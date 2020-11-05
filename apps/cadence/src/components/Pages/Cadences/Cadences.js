import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  Button,
  ButtonToolbar,
  ButtonGroup,
  Card,
  CardHeader,
  Col,
  CustomInput,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
} from "reactstrap";
import {
  ContentWrapper,
  PageLoader,
} from "@nextaction/components";
import { connect } from "react-redux";
import { parseUrl } from "query-string";
import ConfirmModal from "../../Common/ConfirmModal";
import CloneCadenceModel from "./CloneCadenceModel"
import SampleCadencesModel from "./SampleCadencesModel"
import UserContext from "../../UserContext";
import PageHeader from "../../Common/PageHeader";
import FETCH_CADENCES_QUERY, {
  DELETE_CADENCE_QUERY,
  FETCH_CADENCES_COUNT_QUERY,
  FETCH_SAMPLE_CADENCES_QUERY,
  CLONE_CADENCE_QUERY,
  DISABLE_CADENCE_QUERY
} from "../../queries/CadenceQuery";
import FilterButton from "../../Common/FilterButton";
import CadencesGrid from "./CadencesGrid";
import { changeSetting } from "../../../store/actions/actions";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
toast.configure()


const Cadences = ({ location, history, pinnedFilterButton, changeSetting }) => {
  const { query: searchParams } = parseUrl(window.location.search);
  var { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;

  const filterButtons = ["ALL", "ACTIVE", "NEW", "INACTIVE"];
  const [limit, setLimit] = useState(
    searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10
  );
  const [searchInput, setSearchInput] = useState(
    searchParams["filter[name]"] ? parseInt(searchParams["filter[name]"]) : ""
  );
  const [offset, setOffset] = useState(
    searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0
  );
  const [activeList, setActiveList] = useState(
    searchParams["filter[status]"] ? searchParams["filter[status]"] : (pinnedFilterButton ? pinnedFilterButton : "ALL")
  );

  const sharedTypeCheck = searchParams["filter[sharedType]"] ? searchParams["filter[sharedType]"] !== "none" ? encodeURIComponent(searchParams["filter[sharedType]"]) : "none" : "none"
  const [sharedType, setSharedType] = useState(sharedTypeCheck);

  const [cadenceFilter, setCadenceFilter] = useState(
    activeList !== "ALL" ? `&filter[status]=${activeList}` : ""
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(
    searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0
  );
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [switchValue, setSwitchValue] = useState(false);
  const [toggle, settoggle] = useState(searchParams["filter[sharedType]"] ? (searchParams["filter[sharedType]"] !== "none" ? true : false) : false)

  const [currentCadence, setCurrentCadence] = useState({});
  const [currentCadenceStatus, setCurrentCadenceStatus] = useState("");

  const [showDeleteCadenceConfirmModal, setShowDeleteCadenceConfirmModal] = useState(false);
  const [showCloneCadenceConfirmModal, setShowCloneCadenceConfirmModal] = useState(false);
  const [showSampleCadenceModal, setShowSampleCloneCadenceModal] = useState(false);
  const [showDisableCadenceConfirmModal, setShowDisableCadenceConfirmModal] = useState(false);
  const searchInputRef = React.useRef();
  const cadenceActions = {
    EDIT: "EDIT",
    CLONE: "CLONE",
    VIEW: "VIEW",
    DISABLE: "DISABLE",
    DELETE: "DELETE",
  };
  const notify = (message, ToasterType) => {
    toast(message, {
      type: ToasterType,
      position: "top-right",
    });
  };

  const { data: sampleCadences, loading: sampleCadencesLoading, error: sampleCadencesError } = useQuery(FETCH_SAMPLE_CADENCES_QUERY, {
    variables: { userFilter },
    notifyOnNetworkStatusChange: true
  });

  const { data: cadencesCount, loading: cadencesCountLoading, error: cadencesCountError, refetch: refetchCadencesCount } = useQuery(FETCH_CADENCES_COUNT_QUERY, {
    variables: { userFilter },
    notifyOnNetworkStatusChange: true
  });

  const {
    data: cadenceData,
    loading,
    error,
    refetch: refreshCadencesGrid,
  } = useQuery(FETCH_CADENCES_QUERY, {
    variables: {
      includeAssociationsQry: 'includeAssociations[]=cadence&includeAssociations[]=touch',
      limit,
      offset,
      sharedType,
      searchInput,
      cadenceFilter,
      sortBy,
      orderBy
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  const handleClose = (flag) => {
    setShowSampleCloneCadenceModal(flag)

  }

  const [deleteCadence, { loading: deleteCadenceLoading }] = useLazyQuery(DELETE_CADENCE_QUERY, {
    onCompleted: (response) => handleDeleteCadenceRequestCallback(response, true),
    onError: (response) => handleDeleteCadenceRequestCallback(response),
  });

  const [cloneCadence, { loading: cloneCadenceLoading }] = useLazyQuery(CLONE_CADENCE_QUERY, {
    onCompleted: (response) => handleCloneCadenceRequestCallback(response, true),
    onError: (response) => handleCloneCadenceRequestCallback(response),
  });

  const [disableCadence, { loading: disableCadenceLoading }] = useLazyQuery(DISABLE_CADENCE_QUERY, {
    onCompleted: (response) => handleDisableCadenceRequestCallback(response, true),
    onError: (response) => handleDisableCadenceRequestCallback(response),
  });

  const handleRowToolbarButton = (action, cadence) => {

    setCurrentCadence(cadence);
    switch (action) {
      case cadenceActions.DELETE:
        setShowDeleteCadenceConfirmModal(true);
        break;
      case cadenceActions.CLONE:
        setShowCloneCadenceConfirmModal(true);
        break;
      case cadenceActions.DISABLE:
        setShowDisableCadenceConfirmModal(true);
        cadence.status === "ACTIVE" ? setCurrentCadenceStatus("INACTIVE") : setCurrentCadenceStatus("ACTIVE")
        break;
    }
  }

  const handleDeleteCadenceRequestCallback = (response, requestSuccess) => {

    if (requestSuccess) {
      notify("Cadence Deleted Successfully", "success");
      refreshCadencesCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
    setShowDeleteCadenceConfirmModal(false);
  }
  const handleDisableCadenceRequestCallback = (response, requestSuccess) => {

    if (requestSuccess) {
      notify("Cadence Disabled Successfully", "success");
      refreshCadencesCountAndGrid();
    } else {
      notify(response.graphQLErrors[0].messagense, "error");
    }
    setShowDisableCadenceConfirmModal(false);
  }

  const handleCloneCadenceRequestCallback = (response, requestSuccess) => {

    if (requestSuccess) {
      notify("Cadence Cloned Successfully", "success");
      refreshCadencesCountAndGrid();
    }
    else {
      notify(response.graphQLErrors[0].message, "error");
    }
    setShowCloneCadenceConfirmModal(false);
  }

  // Refresh Prospects count on Tabs and grid
  const refreshCadencesCountAndGrid = () => {
    refreshCadencesGrid();
    refetchCadencesCount();
  }
  const handleCadenceTabChange = (e) => {
    e.preventDefault();
    const tabValue = e.currentTarget.getAttribute("data-tab-value");
    setActiveList(tabValue);
    setOffset(0);
    setCurrentPageIndex(0);
    if (!currentUrlStatePushed) {
      window.history.pushState({}, "", window.location.href);
      setCurrentUrlStatePushed(true);
    }
    const { query } = parseUrl(window.location.search);
    if (tabValue !== "ALL")
      query["filter[status]"] = tabValue
    else
      delete query["filter[status]"]
    if (searchInput) {
      query["filter[name]"] = searchInput
    }
    else {
      delete query["filter[name]"]
    }
    query["filter[sharedType]"] = sharedType

    let filterQry = Object.entries({
      ...query,
      "filter[user][id]": currentUserId,

    })
      .filter(([key]) => key.startsWith("filter"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    setCadenceFilter(filterQry === "" ? "" : "&" + filterQry);

    let searchString = Object.entries(query)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    window.history.replaceState({}, "", "?" + searchString);
    refreshCadencesGrid();
  };

  const handleOnChange = (e) => {

    settoggle(!toggle)
    setSwitchValue(e.target.checked);
    const tabValue = activeList;
    setOffset(0);
    setCurrentPageIndex(0);
    if (!currentUrlStatePushed) {
      window.history.pushState({}, "", window.location.href);
      setCurrentUrlStatePushed(true);
    }
    const { query } = parseUrl(window.location.search);
    let allUsers = "allUsers"
    let none = "none"
    const sharedTypeFilters = `:[${allUsers},${none}]`
    e.target.checked === true ? setSharedType(encodeURIComponent(sharedTypeFilters)) : setSharedType("none");
    query["filter[sharedType]"] = e.target.checked ? encodeURIComponent(sharedTypeFilters) : "none";

    if (searchInput) {
      query["filter[name]"] = searchInput
    }
    else {
      delete query["filter[name]"]
    }
    let filterQry = Object.entries({
      ...query,
      "filter[user][id]": currentUserId,
    })
      .filter(([key]) => key.startsWith("filter"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    setCadenceFilter(filterQry === "" ? "" : "&" + filterQry);

    let searchString = Object.entries(query)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");

    window.history.replaceState({}, "", "?" + searchString);
  };
  const handleCadenceSearch = () => {
    const { query } = parseUrl(window.location.search);
    let contactName = searchInputRef.current.value.trim()
    if (contactName) {
      query["filter[name]"] = contactName
      setSearchInput(query["filter[name]"])
    }
    else {
      delete query["filter[name]"]
      setSearchInput("")
    }

    query["filter[sharedType]"] = sharedType
    setOffset(0);
    setCurrentPageIndex(0);

    let filterQry = Object.entries({
      ...query,
      "filter[user][id]": currentUserId,
    })
      .filter(([key]) => key.startsWith("filter"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    setCadenceFilter(filterQry === "" ? "" : "&" + filterQry);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Cadences",
        accessor: "name",
        width: "28%",
        Cell: function (props) {
          return (
            <Link
              to={{
                pathname: "/cadences/" + props.row.original.id + "/touches/view",
                search: window.location.search,
                state: {
                  allCadencesData: props.cadenceData,
                  origin: location.pathname,
                  cadence: props.row.original,
                  cadenceName: props.value
                },
              }}
              className="text-dark"
            >
              <strong>{props.value}</strong>
            </Link>
          );
        },
      },
      {
        Header: "Due",
        accessor: "callTouchDueCount",
        width: "6%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">
                {props.value}
                <br></br>
                <i className="fas fa-phone-alt text-muted"></i>
              </Col>
            </Row>
          );
        },
      },
      {
        accessor: "emailTouchDueCount",
        width: "9%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">
                {props.value}
                <br></br>
                <i className="fas fa-envelope text-muted"></i>
              </Col>
            </Row>
          );
        },
      },
      {
        Header: "Stats",
        accessor: "completedCount",
        width: "6%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">
                {props.value}
                <br></br>
                <i className="far fa-circle text-muted"></i>
              </Col>
            </Row>
          );
        },
      },
      {
        Header: "",
        accessor: "activeCount",
        width: "6%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">
                {props.value}
                <br></br>
                <i className="fas fa-play text-muted"></i>
              </Col>
            </Row>
          );
        },
      },
      {
        Header: "",
        accessor: "pausedCount",
        width: "6%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">
                {props.value}
                <br></br>
                <i className="fas fa-pause text-muted"></i>
              </Col>
            </Row>
          );
        },
      },
      {
        Header: "",
        accessor: "touchcount",
        width: "10%",
        Cell: function (props) {
          return (
            <Row className="float-left">
              <Col className="text-center">
                {props.value}
                <br></br>
                <i className="fas fa-check text-muted"></i>
              </Col>
            </Row>
          );
        },
      },

      {
        Header: "Status",
        accessor: "status",
        width: "12%",
      },
      {
        Header: "Last Activity",
        accessor: "createdDate",
        width: "17%",
        Cell: function (props) {
          return new Date(props.value)
            .toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", "");
        },
      },
    ],
    []
  );

  const gridData = useMemo(
    () =>
      cadenceData && cadenceData.cadences ? cadenceData.cadences.data : [],
    [cadenceData]
  );

  useEffect(
    () =>
      setPageCount(
        !loading && cadenceData.cadences.paging
          ? Math.ceil(cadenceData.cadences.paging.totalCount / limit)
          : 0
      ),
    [gridData]

  );

  if (userLoading) return null;
  if (!user) return <PageLoader />;

  return (
    <ContentWrapper>
      <PageHeader icon="svgicon trucadence-icon" pageName="Cadences">
        <ButtonToolbar className="d-flex justify-content-end">
          <Col lg={6} md={7} sm={7} className="px-lg-0">
            <InputGroup>
              <Input
                placeholder="Search"
                innerRef={searchInputRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCadenceSearch();
                  }
                }}
              />
              <InputGroupAddon addonType="append">
                <Button outline onClick={handleCadenceSearch}>
                  <i className="fa fa-search"></i>
                </Button>
                <Button
                  className="mr-2"
                  outline
                  onClick={(query) => {
                    searchInputRef.current.focus();
                    searchInputRef.current.value = "";
                    handleCadenceSearch()

                  }}
                >
                  <i className="fa fa-times"></i>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
          <Col lg={6} md={8} sm={8} className="px-lg-0 mt-lg-0 mt-sm-2 mt-2 mr-lg-0 mr-sm-2 text-sm-right">
            <Button
              className="mr-2 px-md-4 px-sm-3 px-lg-3" 
              title="Clone cadence from sample cadences"
              onClick={() => { setShowSampleCloneCadenceModal(true) }}
            >
              <i className="fas fa-list text-primary mr-2"></i>
                Sample Cadences
              </Button>
            <Button
              className="px-md-4 px-4" 
              title="Create new cadence"
              onClick={() => {
                history.push("/cadences/new");
              }}
            >
              <i className="fa fa-plus text-primary mr-2"></i>
                Add
            </Button>
          </Col>
        </ButtonToolbar>
      </PageHeader>
      <Card className="card-default">
        <CardHeader>
          <ButtonGroup>
            <FilterButton
              active={activeList === filterButtons[0]}
              data-tab-value={filterButtons[0]}
              count={cadencesCount ? cadencesCount.all.paging.totalCount : 0}
              countError={cadencesCountError}
              countLoading={cadencesCountLoading}
              title="All Cadences"
              handleClick={handleCadenceTabChange}
            >
              ALL
              </FilterButton>
            <FilterButton
              active={activeList === filterButtons[1]}
              data-tab-value={filterButtons[1]}
              count={cadencesCount ? cadencesCount.active.paging.totalCount : 0}
              countError={cadencesCountError}
              countLoading={cadencesCountLoading}
              title="All Active Cadences"
              handlePin={(pin) =>
                changeSetting(
                  "cadencesPinnedFilterButton",
                  pin ? filterButtons[1] : filterButtons[0]
                )
              }
              pinned={pinnedFilterButton === filterButtons[1]}
              handleClick={handleCadenceTabChange}
            >
              ACTIVE
              </FilterButton>

            <FilterButton
              active={activeList === "NEW"}
              data-tab-value="NEW"
              count={cadencesCount ? cadencesCount.unassigned.paging.totalCount : 0}
              countError={cadencesCountError}
              countLoading={cadencesCountLoading}
              title="All Unused Cadences"
              handlePin={(pin) =>
                changeSetting(
                  "cadencesPinnedFilterButton",
                  pin ? filterButtons[2] : filterButtons[0]
                )
              }
              pinned={pinnedFilterButton === filterButtons[2]}
              handleClick={handleCadenceTabChange}
            >
              UNUSED
              </FilterButton>
            <FilterButton
              active={activeList === "INACTIVE"}
              data-tab-value="INACTIVE"
              count={cadencesCount ? cadencesCount.paused.paging.totalCount : 0}
              countError={cadencesCountError}
              countLoading={cadencesCountLoading}
              title="All Inactive Cadences"
              handlePin={(pin) =>
                changeSetting(
                  "cadencesPinnedFilterButton",
                  pin ? filterButtons[3] : filterButtons[0]
                )
              }
              pinned={pinnedFilterButton === filterButtons[3]}
              handleClick={handleCadenceTabChange}
            >
              INACTIVE
            </FilterButton>
          </ButtonGroup>

          <div className="float-lg-right float-sm-left float-md-left pt-2">
            <FormGroup check inline>
              <span className="mr-2">My Cadences</span>
              <CustomInput
                type="switch"
                id="example_custom_switch"
                name="custom_switch"
                checked={toggle}
                onChange={handleOnChange}

              ></CustomInput>
              <span>All Cadences</span>
            </FormGroup>
          </div>
        </CardHeader>
        <CadencesGrid
          columns={columns}
          data={gridData}
          cadenceData={cadenceData}
          sortBy={sortBy}
          orderBy={orderBy}
          fetchData={({ pageIndex, pageSize }) => {
            setOffset(pageIndex);
            setCurrentPageIndex(pageIndex);
            setLimit(pageSize);
            if (!currentUrlStatePushed) {
              window.history.replaceState({}, "", window.location.href);
              setCurrentUrlStatePushed(true);
            }
            const { query } = parseUrl(window.location.search);
            query["page[limit]"] = pageSize;
            query["page[offset]"] = pageIndex;
            query["filter[sharedType]"] = sharedType
            let searchString = Object.entries(query)
              .map(([key, val]) => `${key}=${val}`)
              .join("&");
            window.history.replaceState({}, "", "?" + searchString);

          }}
          loading={loading}
          pageSize={limit}
          pageCount={pageCount}
          error={error}
          currentPageIndex={currentPageIndex}
          cadenceActions={cadenceActions}
          handleRowToolbarButton={handleRowToolbarButton}
          handleRefresh={refreshCadencesGrid}
          handleSortBy={(column, order) => {
            setSortBy(column);
            setOrderBy(order);
          }}
        />
        <SampleCadencesModel
          hideModal={() => {
            setShowSampleCloneCadenceModal(false);
          }}
          showModal={showSampleCadenceModal}
          sampleCadences={sampleCadences}
          handleClose={handleClose}
        />

        <ConfirmModal
          confirmBtnIcon="fas fa-trash"
          confirmBtnText="Delete"
          handleCancel={() => setShowDeleteCadenceConfirmModal(false)}
          handleConfirm={() => deleteCadence({ variables: { cadenceID: currentCadence.id } })}
          showConfirmBtnSpinner={deleteCadenceLoading}
          showConfirmModal={showDeleteCadenceConfirmModal}
        >
          <span>Are you sure you want to delete cadence <b>{currentCadence.name}</b></span>
        </ConfirmModal>

        <ConfirmModal
          confirmBtnIcon="fas fa-eye"
          confirmBtnText="Disable"
          handleCancel={() => setShowDisableCadenceConfirmModal(false)}
          handleConfirm={() => {
            disableCadence({ variables: { id: currentCadence.id, status: currentCadenceStatus } });
          }
          }
          showConfirmBtnSpinner={disableCadenceLoading}
          showConfirmModal={showDisableCadenceConfirmModal}
        >
          <span>Are you sure you want to disable cadence <b>{currentCadence.name}</b></span>
        </ConfirmModal>

        <CloneCadenceModel
          showModal={showCloneCadenceConfirmModal}
          currentUserId={currentUserId}
          currentCadence={currentCadence}
          Loading={cloneCadenceLoading}
          cadenceName={currentCadence.name}
          handleAction={(data) => {

            cloneCadence({
              variables: {
                cadenceID: currentCadence.id,
                cloneCadenceName: data.cloneCadenceName
              },
            });
          }}
          hideModal={() => {
            setShowCloneCadenceConfirmModal(false);
          }}
        />
      </Card>
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  pinnedFilterButton: state.settings.cadencesPinnedFilterButton,
});

export default connect(mapStateToProps, { changeSetting })(Cadences);
