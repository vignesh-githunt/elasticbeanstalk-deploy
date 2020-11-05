import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Badge, Button, ButtonGroup, Card, CardHeader,CardBody, Col, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import { parseUrl } from "query-string";
import { changeSetting } from "../../../store/actions/actions";
import FETCH_PROSPECTS_QUERY, {
  ASSIGN_OR_MOVE_PROSPECT_TO_CADENCE_QUERY,
  CREATE_PROSPECT_QUERY,
  DELETE_PROSPECTS_QUERY,
  FETCH_PROSPECTS_COUNT_QUERY,
  EXIT_PAUSE_RESUME_PROSPECT_QUERY,
  TAG_PROSPECT_QUERY
} from '../../queries/ProspectsQuery';
import UserContext from "../../UserContext";
import CadenceDataGrid from "./CadenceDataGrid"
import ConfirmModal from "../../Common/ConfirmModal";
import AddProspectModal from "../Prospects/AddProspectModal";
import { default as AssignProspectToCadenceModal, default as MoveProspectToCadenceModal } from "../Prospects/AssignOrMoveProspectToCadenceModal";
import TagProspectModal from "../Prospects/TagProspectModal";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
toast.configure()

const Prospects = ({location,match}) => {

  const { query: searchParams } = parseUrl(window.location.search);

  const prospectActions = { DIAL: "DIAL", EMAIL: "EMAIL", TAG: "TAG", RESUME: "RESUME", PAUSE: "PAUSE", MOVE_TO_ANOTHER_CADENCE: "MOVE_TO_ANOTHER_CADENCE", EXIT_CADENCE: "EXIT_CADENCE", DELETE: "DELETE" };
  const cadenceID = match.params["id"];
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;

  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [prospectsFilter, setProspectsFilter] = useState(`&filter[user][id]=${currentUserId}&filter[cadence][id]=${cadenceID}`);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [showAddPorspectModal, setShowAddPorspectModal] = useState(false);
  const [showAssignPorspectToCadenceModal, setShowAssignPorspectToCadenceModal] = useState(false);
  const [showTagProspectModal, setShowTagProspectModal] = useState(false);
  const [showMoveProspectToCadenceModal, setShowMoveProspectToCadenceModal] = useState(false);
  const [currentProspect, setCurrentProspect] = useState({});
  const [showResumeProspectConfirmModal, setShowResumeProspectConfirmModal] = useState(false);
  const [showPauseProspectConfirmModal, setShowPauseProspectConfirmModal] = useState(false);
  const [showExitProspectConfirmModal, setShowExitProspectConfirmModal] = useState(false);
  const [showDeleteProspectConfirmModal, setShowDeleteProspectConfirmModal] = useState(false);

  const notify = (message, ToasterType) => {
    toast(message, {
      type: ToasterType,
      position: "top-right",
    });
  };
  
 // Fetch prospects data from api-server
  const { data: prospectData, loading, error, refetch: refreshProspectsGrid } = useQuery(FETCH_PROSPECTS_QUERY, {
    variables: { includeAssociationsQry: 'includeAssociations[]=cadence&includeAssociations[]=touch', prospectFilter: prospectsFilter, limit, offset },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first"
  });
  const { data: prospectsCount, loading: prospectsCountLoading, error: prospectsCountError, refetch: refetchProspectsCount } = useQuery(FETCH_PROSPECTS_COUNT_QUERY, {
    variables: { userFilter },
    notifyOnNetworkStatusChange: true
  });
 
  // Add prospect to cadence request
  const [addProspect, { loading: addProspectLoading }] = useLazyQuery(CREATE_PROSPECT_QUERY, {
    onCompleted: (response) => handleAddProspectRequestCallback(response, true),
    onError: (response) => handleAddProspectRequestCallback(response)
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
      notify("Prospect Added Successfully", "success");
      refreshProspectsCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  }

  const handleTagProspectRequestCallback = (response, requestSuccess) => {
    setShowTagProspectModal(false);

    if (requestSuccess) {
      notify("Prospect Taged Successfully", "success");
      refreshProspectsGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  }

  const handleResumeProspectRequestCallback = (response, requestSuccess) => {
    setShowResumeProspectConfirmModal(false);

    if (requestSuccess) {
      notify("Prospect Resumed Successfully", "success");
      refreshProspectsCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  }

  const handlePauseProspectRequestCallback = (response, requestSuccess) => {
    setShowPauseProspectConfirmModal(false);

    if (requestSuccess) {
      notify("Prospect Paused Successfully", "success");
      refreshProspectsCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  }

  const handleMoveProspectRequestCallback = (response, requestSuccess) => {
    setShowMoveProspectToCadenceModal(false);

    if (requestSuccess) {
      notify("Prospect Moved Successfully", "success");
      refreshProspectsCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  }

  const handleExitProspectRequestCallback = (response, requestSuccess) => {
    setShowExitProspectConfirmModal(false);

    if (requestSuccess) {
      notify("Prospect Exited Successfully", "success");
      refreshProspectsCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  }

  const handleDeleteProspectRequestCallback = (response, requestSuccess) => {
    setShowDeleteProspectConfirmModal(false);
    if (requestSuccess) {
      notify("Prospect Deleted Successfully", "success");
      refreshProspectsCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  }

  // Refresh Prospects count on Tabs and grid
  const refreshProspectsCountAndGrid = () => {
    refreshProspectsGrid();

    refetchProspectsCount();
  }

  const getTouchIcons = (touch, extraClass, removeColor) => {

    let className;
    if (touch === "EMAIL")
      className = removeColor ? `fas fa-envelope ${extraClass}` : `fas fa-envelope ${extraClass} text-primary`;
    else if (touch === "OTHERS")
      className = removeColor ? `fas fa-share-alt ${extraClass}` : `fas fa-share-alt ${extraClass} text-warning`;
      else if (touch === "CALL")
      className = removeColor ? `fas fa-phone-alt  ${extraClass}` : `fas fa-phone-alt ${extraClass} text-warning`;
    else if (touch === "LINKEDIN")
      className = removeColor ? `fab fa-linkedin-in ${extraClass}` : `fab fa-linkedin-in ${extraClass} text-info`;
    else if (touch === "TEXT")
      className = removeColor ? `fas fa-comments ${extraClass}` : `fas fa-comments ${extraClass} text-success`;
    else
      className = ``;

    return <em className={className}></em>
  }

  const ProspectsDatacolumns = React.useMemo(
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
              <b>
              <Link
                  to={
                    {
                      pathname: "/prospects/" + props.row.original.id,
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
                >
                  {props.value}
                </Link>
              </b>
              <br></br>
              <span>{props.row.original.title}</span>
              <br></br>
              <p>{props.row.original.accountName}</p>
            </span>
          );
        },
      },
      {
        Header: "Current Touch",
        accessor: "currentTouchType",
        width: "15%",
        Cell: function (props) {
          let rowData = props.row.original;

          if (rowData) {
            return (
              <>
                <span className="mr-2">
                  {getTouchIcons(rowData.currentTouchType)}
                </span>
                <span>
                  Touch <strong>{rowData.currentTouchId} ({rowData.currentTouchType})</strong>
                </span>
              </>
            );
          } else {
            return <span></span>;
          }
        },
      },
      {
        Header: "Call Outcome",
        accessor: "callTouchOutcome",
        width: "15%",
        Cell: function (props) {
          return (
            <Badge color="secondary" pill>
              {props.value}
            </Badge>
          );
        },
      },
      {
        Header: "Email Outcome",
        accessor: "emailTouchOutcome",
        width: "13%",
        Cell: function (props) {
          return (
            <Badge color="secondary" pill>
              {props.value}
            </Badge>
          );
        },        
      },
    ],
    []
  );

  const gridData = useMemo(() => (prospectData && prospectData.prospects ? prospectData.prospects.data : []), [prospectData]);

  useEffect(() => setPageCount(!loading && prospectData.prospects.paging ? Math.ceil(prospectData.prospects.paging.totalCount / limit) : 0), [gridData]);
  return (
    <>
      <div>
        <CadenceDataGrid
              columns={ProspectsDatacolumns}
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
      />
       
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

      </div>
    </>
  );
};

export default Prospects;
