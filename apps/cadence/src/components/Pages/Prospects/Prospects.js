/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Badge, Button, ButtonGroup, Card, CardBody, Col, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { ContentWrapper } from "@nextaction/components";

import { parseUrl } from "query-string";
import { changeSetting } from "../../../store/actions/actions";

import UserContext from "../../UserContext";
import ConfirmModal from "../../Common/ConfirmModal";
import PageHeader from "../../Common/PageHeader";
import FilterButton from "../../Common/FilterButton";
import { default as ClButton } from "../../Common/Button";

import ProspectsGrid from "./ProspectsGrid"
import AddProspectModal from "./AddProspectModal";
import { default as AssignProspectToCadenceModal, default as MoveProspectToCadenceModal } from "./AssignOrMoveProspectToCadenceModal";
import TagProspectModal from "./TagProspectModal";
import CreateFilterModal from "./CreateFilterModal";
import ImportCsvModal from "./ImportCsvModal";
import FETCH_PROSPECTS_QUERY, {
  ASSIGN_OR_MOVE_PROSPECT_TO_CADENCE_QUERY,
  CREATE_PROSPECT_QUERY,
  DELETE_PROSPECTS_QUERY,
  EXIT_PAUSE_RESUME_PROSPECT_QUERY,
  FETCH_PROSPECTS_COUNT_QUERY,
  TAG_PROSPECT_QUERY
} from '../../queries/ProspectsQuery';

const Prospects = ({ location, pinnedFilterButton, changeSetting }) => {

  const { query: searchParams } = parseUrl(window.location.search);
  const prospectActions = { DIAL: "DIAL", EMAIL: "EMAIL", ASSIGN_TO_CADENCE: "ASSIGN_TO_CADENCE", TAG: "TAG", RESUME: "RESUME", PAUSE: "PAUSE", MOVE_TO_ANOTHER_CADENCE: "MOVE_TO_ANOTHER_CADENCE", EXIT_CADENCE: "EXIT_CADENCE", DELETE: "DELETE" };
  const filterButtons = ["all", "active", "paused", "unassigned"];
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;
  const searchInputRef = React.useRef();
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [prospectsFilter, setProspectsFilter] = useState(`&filter[user][id]=${currentUserId}`);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [activeTab, setActiveTab] = useState(filterButtons.indexOf(searchParams["filter[memberStatus]"]) > -1 ? searchParams["filter[memberStatus]"] : (filterButtons.indexOf(pinnedFilterButton) > -1 ? pinnedFilterButton : filterButtons[0]));
  const [showAddPorspectModal, setShowAddPorspectModal] = useState(false);
  const [showAssignPorspectToCadenceModal, setShowAssignPorspectToCadenceModal] = useState(false);
  const [showTagProspectModal, setShowTagProspectModal] = useState(false);
  const [showMoveProspectToCadenceModal, setShowMoveProspectToCadenceModal] = useState(false);
  const [currentProspect, setCurrentProspect] = useState({});
  const [showResumeProspectConfirmModal, setShowResumeProspectConfirmModal] = useState(false);
  const [showPauseProspectConfirmModal, setShowPauseProspectConfirmModal] = useState(false);
  const [showExitProspectConfirmModal, setShowExitProspectConfirmModal] = useState(false);
  const [showDeleteProspectConfirmModal, setShowDeleteProspectConfirmModal] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  // Fetch prospects data from api-server
  const { data: prospectData, loading, error, refetch: refreshProspectsGrid } = useQuery(FETCH_PROSPECTS_QUERY, {
    variables: { includeAssociationsQry: 'includeAssociations[]=cadence&includeAssociations[]=touch', prospectFilter: prospectsFilter, limit, offset },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first"
  });

  // To show prospects count in the tab
  const { data: prospectsCount, loading: prospectsCountLoading, error: prospectsCountError, refetch: refetchProspectsCount } = useQuery(FETCH_PROSPECTS_COUNT_QUERY, {
    variables: { userFilter },
    notifyOnNetworkStatusChange: true
  });

  // Add prospect to cadence request
  const [addProspect, { loading: addProspectLoading }] = useLazyQuery(CREATE_PROSPECT_QUERY, {
    onCompleted: (response) => handleAddProspectRequestCallback(response, true),
    onError: (response) => handleAddProspectRequestCallback(response)
  });

  // Assign prospect to cadence request
  const [assignProspectToCadence, { loading: assignProspectToCadenceLoading }] = useLazyQuery(ASSIGN_OR_MOVE_PROSPECT_TO_CADENCE_QUERY, {
    variables: { action: "assignToCadence" },
    onCompleted: (response) => handleAssignProspectRequestCallback(response, true),
    onError: (response) => handleAssignProspectRequestCallback(response)
  });

  // Tag prospect request
  const [tagProspect, { loading: tagProspectLoading }] = useLazyQuery(TAG_PROSPECT_QUERY, {
    onCompleted: (response) => handleTagProspectRequestCallback(response, true),
    onError: (response) => handleTagProspectRequestCallback(response)
  });

  // Resume prospect request
  const [resumeProspect, { loading: resumeProspectLoading }] = useLazyQuery(EXIT_PAUSE_RESUME_PROSPECT_QUERY, {
    variables: { action: "resume" },
    onCompleted: (response) => handleResumeProspectRequestCallback(response, true),
    onError: (response) => handleResumeProspectRequestCallback(response),
  });

  // Pause prospect request
  const [pauseProspect, { loading: pauseProspectLoading }] = useLazyQuery(EXIT_PAUSE_RESUME_PROSPECT_QUERY, {
    variables: { action: "pause" },
    onCompleted: (response) => handlePauseProspectRequestCallback(response, true),
    onError: (response) => handlePauseProspectRequestCallback(response),
  });

  // Move prospect to cadence request
  const [moveProspectToCadence, { loading: moveProspectToCadenceLoading }] = useLazyQuery(ASSIGN_OR_MOVE_PROSPECT_TO_CADENCE_QUERY, {
    variables: { action: "moveToCadence" },
    onCompleted: (response) => handleMoveProspectRequestCallback(response, true),
    onError: (response) => handleMoveProspectRequestCallback(response),
  });

  // Exit prospect request
  const [exitProspect, { loading: exitProspectLoading }] = useLazyQuery(EXIT_PAUSE_RESUME_PROSPECT_QUERY, {
    variables: { action: "exit" },
    onCompleted: (response) => handleExitProspectRequestCallback(response, true),
    onError: (response) => handleExitProspectRequestCallback(response),
  });

  // Delete prospect request
  const [deleteProspect, { loading: deleteProspectLoading }] = useLazyQuery(DELETE_PROSPECTS_QUERY, {
    onCompleted: (response) => handleDeleteProspectRequestCallback(response, true),
    onError: (response) => handleDeleteProspectRequestCallback(response),
  });

  /* ---- Grid Columns configuration -begin ----- */
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "contactName",
        width: "20%",
        Cell: function (props) {
          let rowData = props.row.original;
          let cadence;
          let touch;

          if (
            rowData.associations && rowData.associations.cadence &&
            props.prospectData.prospects.includedAssociations.cadence
          ) {
            cadence = props.prospectData.prospects.includedAssociations.cadence.find(
              (cadence) => cadence.id === rowData.associations.cadence[0].id
            );
          }

          if (
            rowData.associations.touch &&
            props.prospectData.prospects.includedAssociations.touch
          ) {
            touch = props.prospectData.prospects.includedAssociations.touch.find(
              (touch) => touch.id === rowData.associations.touch[0].id
            );
          }

          return (
            <span>
              <Link
                to={
                  {
                    pathname: "prospects/" + props.row.original.id,
                    search: window.location.search,
                    state: {
                      allProspectsData: props.prospectData,
                      cadence,
                      origin: location.pathname,
                      prospect: props.row.original,
                      touch
                    }
                  }
                }
                className="text-dark"
              >
                <strong>{props.value}</strong>
              </Link>
              <br></br>
              <small>{props.row.original.title}</small>
              <br></br>
              <Link
                to={{ pathname: "/accounts/" + props.row.original.associations.account[0].id, search: window.location.search }}
                className="text-dark font-italic"
              >
                {props.row.original.accountName}
              </Link>
            </span>
          );
        },
      },
      {
        Header: "Cadence",
        width: "20%",
        Cell: function (props) {

          let rowData = props.row.original;
          let cadence;
          let touch;

          if (
            rowData.associations && rowData.associations.cadence &&
            props.prospectData.prospects.includedAssociations.cadence
          ) {
            cadence = props.prospectData.prospects.includedAssociations.cadence.find(
              (cadence) => cadence.id == rowData.associations.cadence[0].id
            );
          }

          if (
            rowData.associations.touch &&
            props.prospectData.prospects.includedAssociations.touch
          ) {
            touch = props.prospectData.prospects.includedAssociations.touch.find(
              (touch) => touch.id == rowData.associations.touch[0].id
            );
          }

          if (cadence) {
            return (
              <span>
                <Link 
                  to={"/cadences/" + cadence.id}
                  className="text-dark"
                >
                  <strong>{cadence.multiTouchName}</strong>
                </Link>
                {touch && (
                  <span>
                    <br></br>
                    <i className="fas fa-phone-alt text-muted mr-2"></i><strong>Touch 3</strong>
                  </span>
                )}
              </span>
            );
          } else {
            return <span></span>;
          }
        },
      },
      {
        Header: "Tags",
        accessor: "tag",
        width: "20%",
        Cell: function (props) {
          return (
            <Badge color="light" className="border border-dark" pill>
              {props.value}
            </Badge>
          );
        },
      },
      {
        Header: "Call Outcome",
        accessor: "callTouchOutcome",
        width: "15%"
      },
      {
        Header: "Email Outcome",
        accessor: "emailTouchOutcome",
        width: "13%"
      },
      {
        Header: "Last Contact",
        accessor: "lastTouchDateTime",
        width: "12%",
        Cell: function (props) {

          return new Date(props.value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', '');
        }
      },
    ],
    []
  );
  /* ---- Grid Columns configuration -end ----- */
  // To render the grid when All, Active, Paused, Unassigned tabe changed
  const handleProspectTabChange = (e) => {
    e.preventDefault();

    const tabValue = e.currentTarget.getAttribute('data-tab-value');
    setActiveTab(tabValue);
    setOffset(0);
    setCurrentPageIndex(0);

    if (!currentUrlStatePushed) {

      window.history.pushState({}, '', window.location.href);
      setCurrentUrlStatePushed(true);
    }

    const { query } = parseUrl(window.location.search);
    query["filter[memberStatus]"] = tabValue;
    let filterQry = Object.entries({ ...query, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter")).map(([key, val]) => `${key}=${val}`).join("&")
    setProspectsFilter(filterQry === "" ? "" : "&" + filterQry);
    let searchString = Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");
    window.history.replaceState({}, '', "?" + searchString);
  }

  /* ----- To handle prospect actions -begin ----- */
  // To handle clicking toolbar buttons on grid row mouseover
  const handleRowToolbarButton = (action, prospect) => {

    setCurrentProspect(prospect);

    switch (action) {
      case prospectActions.ASSIGN_TO_CADENCE:
        setShowAssignPorspectToCadenceModal(true);
        break;
      case prospectActions.RESUME:
        setShowResumeProspectConfirmModal(true);
        break;
      case prospectActions.PAUSE:
        setShowPauseProspectConfirmModal(true);
        break;
      case prospectActions.TAG:
        setShowTagProspectModal(true);
        break;
      case prospectActions.MOVE_TO_ANOTHER_CADENCE:
        setShowMoveProspectToCadenceModal(true);
        break;
      case prospectActions.EXIT_CADENCE:
        setShowExitProspectConfirmModal(true);
        break;
      case prospectActions.DELETE:
        setShowDeleteProspectConfirmModal(true);
    }
  }

  const handleAddProspectRequestCallback = (response, requestSuccess) => {

    setShowAddPorspectModal(false);

    if (requestSuccess) {

      refreshProspectsCountAndGrid();
    } else {
      // TODO handle error resonse here
    }
  }

  const handleAssignProspectRequestCallback = (response, requestSuccess) => {

    setShowAssignPorspectToCadenceModal(false);

    if (requestSuccess) {

      refreshProspectsCountAndGrid();
    } else {
      // TODO handle error resonse here
    }
  }

  const handleTagProspectRequestCallback = (response, requestSuccess) => {

    setShowTagProspectModal(false);

    if (requestSuccess) {

      refreshProspectsGrid();
    } else {
      // TODO handle error resonse here
    }
  }

  const handleResumeProspectRequestCallback = (response, requestSuccess) => {

    setShowResumeProspectConfirmModal(false);
    if (requestSuccess) {
      refreshProspectsCountAndGrid();
    } else {
      //TODO handle error resonse here
    }
  }

  const handlePauseProspectRequestCallback = (response, requestSuccess) => {

    setShowPauseProspectConfirmModal(false);
    if (requestSuccess) {
      refreshProspectsCountAndGrid();
    } else {
      //TODO handle error resonse here
    }
  }

  const handleMoveProspectRequestCallback = (response, requestSuccess) => {

    setShowMoveProspectToCadenceModal(false);

    if (requestSuccess) {
      refreshProspectsCountAndGrid();
    } else {
      //TODO handle error resonse here
    }
  }

  const handleExitProspectRequestCallback = (response, requestSuccess) => {

    setShowExitProspectConfirmModal(false);

    if (requestSuccess) {

      refreshProspectsCountAndGrid();
    } else {
      //TODO handle error resonse here
    }
  }

  const handleDeleteProspectRequestCallback = (response, requestSuccess) => {

    setShowDeleteProspectConfirmModal(false);
    if (requestSuccess) {

      refreshProspectsCountAndGrid();
    } else {
      // TODO handle error resonse here
    }
  }

  // Refresh Prospects count on Tabs and grid
  const refreshProspectsCountAndGrid = () => {
    refreshProspectsGrid();

    refetchProspectsCount();
  }

  /* ----- To handle prospect actions -end ----- */
  const handleProspectsSearch = () => {

    const { query } = parseUrl(window.location.search);
    query["filter[contactName]"] = searchInputRef.current.value.trim();

    //setCustomFilter(customFlterVal === '' ? '' : `&filter[contactName]=${customFlterVal}`);
    let filterQry = Object.entries({ ...query, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter")).map(([key, val]) => `${key}=${val}`).join("&")
    setProspectsFilter(filterQry === "" ? "" : "&" + filterQry);
  }

  const gridData = useMemo(() => (prospectData && prospectData.prospects ? prospectData.prospects.data : []), [prospectData]);

  useEffect(() => setPageCount(!loading && prospectData.prospects.paging ? Math.ceil(prospectData.prospects.paging.totalCount / limit) : 0), [gridData]);
  const handleFilterLogicRequestCallback = (response, requestSuccess) => {

    setShowFilterModal(false);
  }

  return (
    <ContentWrapper>
      <PageHeader icon="fa fa-user" pageName="Prospects">
        <div className="d-flex align-items-center">
          <InputGroup className="col-lg-7">
            <Input
              placeholder="Search"
              innerRef={searchInputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleProspectsSearch()
                }
              }}
            />
            <InputGroupAddon addonType="append">
              <Button
                outline
                onClick={handleProspectsSearch}
              >
                <i className="fa fa-search"></i>
              </Button>
              <Button
                outline
                onClick={() => {

                  searchInputRef.current.focus()
                  searchInputRef.current.value = '';

                  setProspectsFilter("");
                }}
              >
                <i className="fa fa-times"></i>
              </Button>
            </InputGroupAddon>
            <Input placeholder="Filter" type="select" className="ml-2">
              <option>filter1</option>
              <option>filter2</option>
              <option>filter3</option>
            </Input>
            <InputGroupAddon addonType="append">
              <Button title="Search Filter"><i className="fa fa-search"></i></Button>
              <Button title="Edit Filter" onClick={() => { setShowFilterModal(true) }}><i className="fa fa-pencil-alt"></i></Button>
              <Button title="Delete Filter"><i className="fas fa-trash text-danger"></i></Button>
            </InputGroupAddon>
          </InputGroup>
          <div className="d-flex">
            <ClButton icon="fas fa-file-csv text-primary" title="Import CRM" onClick={() => setShowImportModal(true)}>Import CRM</ClButton>
            <ClButton icon="fas fa-file-csv text-primary" className="mx-2" title="Import CSV" onClick={() => setShowImportModal(true)}>Import CSV</ClButton>
            <ClButton icon="fa fa-plus text-primary" title="Add Prospect" onClick={() => setShowAddPorspectModal(true)}>Add</ClButton>
          </div>
        </div>
      </PageHeader>
      <Row>
        <Col>
          <Card className="card-default">
            <CardBody>
              <Row>
                <Col lg={8} md={10}>
                  <ButtonGroup>
                    <FilterButton
                      active={activeTab === filterButtons[0]}
                      count={prospectsCount ? prospectsCount.all.paging.totalCount : 0}
                      countError={prospectsCountError}
                      countLoading={prospectsCountLoading}
                      data-tab-value={filterButtons[0]}
                      handleClick={handleProspectTabChange}
                    >
                      ALL
                    </FilterButton>
                    <FilterButton
                      active={activeTab === filterButtons[1]}
                      count={prospectsCount ? prospectsCount.active.paging.totalCount : 0}
                      countError={prospectsCountError}
                      countLoading={prospectsCountLoading}
                      data-tab-value={filterButtons[1]}
                      handleClick={handleProspectTabChange}
                      handlePin={(pin) => changeSetting("prospectsPinnedFilterButton", pin ? filterButtons[1] : filterButtons[0])}
                      pinned={pinnedFilterButton === filterButtons[1]}
                    >
                      ACTIVE
                    </FilterButton>
                    <FilterButton
                      active={activeTab === filterButtons[2]}
                      count={prospectsCount ? prospectsCount.active.paging.totalCount : 0}
                      countError={prospectsCountError}
                      countLoading={prospectsCountLoading}
                      data-tab-value={filterButtons[2]}
                      handleClick={handleProspectTabChange}
                      handlePin={(pin) => changeSetting("prospectsPinnedFilterButton", pin ? filterButtons[2] : filterButtons[0])}
                      pinned={pinnedFilterButton === filterButtons[2]}
                    >
                      PAUSED
                    </FilterButton>
                    <FilterButton
                      active={activeTab === filterButtons[3]}
                      count={prospectsCount ? prospectsCount.active.paging.totalCount : 0}
                      countError={prospectsCountError}
                      countLoading={prospectsCountLoading}
                      data-tab-value={filterButtons[3]}
                      handleClick={handleProspectTabChange}
                      handlePin={(pin) => changeSetting("prospectsPinnedFilterButton", pin ? filterButtons[3] : filterButtons[0])}
                      pinned={pinnedFilterButton === filterButtons[3]}
                    >
                      UNASSIGNED
                    </FilterButton>
                  </ButtonGroup>
                </Col>
                <Col lg={4} md={6} className="pt-lg-0 pt-sm-2 pt-2">
                  <ClButton icon="fas fa-filter text-primary" className="float-lg-right float-sm-left" onClick={() => setShowFilterModal(true)}>
                    Create Filter Criteria
                  </ClButton>
                </Col>
              </Row>
            </CardBody>

            <ProspectsGrid
              columns={columns}
              data={gridData}
              prospectData={prospectData}
              fetchData={({ pageIndex, pageSize }) => {

                setOffset(pageIndex);
                setCurrentPageIndex(pageIndex);
                setLimit(pageSize);
                if (!currentUrlStatePushed) {

                  window.history.replaceState({}, '', window.location.href);
                  setCurrentUrlStatePushed(true);
                }

                const { query } = parseUrl(window.location.search);
                query["page[limit]"] = pageSize;
                query["page[offset]"] = pageIndex;

                let searchString = Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");

                window.history.replaceState({}, '', "?" + searchString);
              }}
              loading={loading}
              pageSize={limit}
              pageCount={pageCount}
              error={error}
              currentPageIndex={currentPageIndex}
              prospectActions={prospectActions}
              handleRowToolbarButton={handleRowToolbarButton}
              handleRefresh={refreshProspectsGrid}
            />
          </Card>
        </Col>
      </Row>
      <AddProspectModal
        currentUserId={currentUserId}
        handleAction={(input) => {

          addProspect({
            variables: {
              input
            }
          });
        }}
        hideModal={() => { setShowAddPorspectModal(false) }}
        showModal={showAddPorspectModal}
        showActionBtnSpinner={addProspectLoading}
      />

      <AssignProspectToCadenceModal
        actionBtnIcon="fas fa-plus"
        actionBtnText="Assign"
        currentUserId={currentUserId}
        handleShowHideModal={() => { setShowAssignPorspectToCadenceModal(false) }}
        handleAction={(cadenceId) => {
          assignProspectToCadence({
            variables: {
              prospectId: currentProspect.id,
              cadenceId
            }
          });
        }}
        modalHeader="Assign Prospect to Cadence"
        prospect={currentProspect}
        showActionBtnSpinner={assignProspectToCadenceLoading}
        showModal={showAssignPorspectToCadenceModal}
      />

      <MoveProspectToCadenceModal
        actionBtnIcon="fas fa-arrows-alt"
        actionBtnText="Move"
        currentUserId={currentUserId}
        handleShowHideModal={() => { setShowMoveProspectToCadenceModal(false) }}
        handleAction={(cadenceId) => {
          moveProspectToCadence({
            variables: {
              prospectId: currentProspect.id,
              cadenceId
            }
          });
        }}
        modalHeader="Move Prospect to Cadence"
        prospect={currentProspect}
        showActionBtnSpinner={moveProspectToCadenceLoading}
        showModal={showMoveProspectToCadenceModal}
      />

      <TagProspectModal
        currentUserId={currentUserId}
        handleAction={(tagName) => {
          tagProspect({
            variables: {
              prospectId: currentProspect.id,
              tagName
            }
          });
        }}
        hideModal={() => { setShowTagProspectModal(false) }}
        prospect={currentProspect}
        showActionBtnSpinner={tagProspectLoading}
        showModal={showTagProspectModal}
      />

      <ConfirmModal
        confirmBtnIcon="fas fa-pause"
        confirmBtnText="Pause"
        handleCancel={() => { setShowPauseProspectConfirmModal(false) }}
        handleConfirm={() => pauseProspect({ variables: { prospectId: currentProspect.id } })}
        showConfirmBtnSpinner={pauseProspectLoading}
        showConfirmModal={showPauseProspectConfirmModal}
      >
        <span>Are you sure you want to pause prospect <b>{currentProspect.contactName}</b></span>
      </ConfirmModal>

      <ConfirmModal
        confirmBtnIcon="fas fa-play"
        confirmBtnText="Resume"
        handleConfirm={() => resumeProspect({ variables: { prospectId: currentProspect.id } })}
        handleCancel={() => { setShowResumeProspectConfirmModal(false) }}
        showConfirmBtnSpinner={resumeProspectLoading}
        showConfirmModal={showResumeProspectConfirmModal}
      >
        <span>Are you sure you want to resume prospect <b>{currentProspect.contactName}</b></span>
      </ConfirmModal>

      <ConfirmModal
        confirmBtnIcon="fas fa-sign-out-alt"
        confirmBtnText="Exit"
        handleCancel={() => { setShowExitProspectConfirmModal(false) }}
        handleConfirm={() => exitProspect({ variables: { prospectId: currentProspect.id } })}
        showConfirmBtnSpinner={exitProspectLoading}
        showConfirmModal={showExitProspectConfirmModal}
      >
        <span>Are you sure you want to exit prospect <b>{currentProspect.contactName}</b></span>
      </ConfirmModal>
      <ConfirmModal
        confirmBtnIcon="fas fa-trash"
        confirmBtnText="Delete"
        handleCancel={() => setShowDeleteProspectConfirmModal(false)}
        handleConfirm={() => deleteProspect({ variables: { prospectId: currentProspect.id } })}
        showConfirmBtnSpinner={deleteProspectLoading}
        showConfirmModal={showDeleteProspectConfirmModal}
      >
        <span>Are you sure you want to delete prospect <b>{currentProspect.contactName}</b></span>
      </ConfirmModal>
      <CreateFilterModal
        hideModal={() => { setShowFilterModal(false) }}
        showModal={showFilterModal}
        showActionBtnSpinner={addProspectLoading}
      >
      </CreateFilterModal>
      <ImportCsvModal
        hideModal={() => { setShowImportModal(false) }}
        showModal={showImportModal}
      >
      </ImportCsvModal>
    </ContentWrapper>
  );
}
// This is required for redux
const mapStateToProps = state => ({
  pinnedFilterButton: state.settings.prospectsPinnedFilterButton
});
// This is required for redux
export default connect(mapStateToProps, { changeSetting })(Prospects);