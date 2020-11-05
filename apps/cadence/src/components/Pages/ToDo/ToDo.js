/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { ContentWrapper } from "@nextaction/components";
import { Button, ButtonGroup, Card, CardBody, Col, Input, InputGroup, InputGroupAddon, Row, Table } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import { parseUrl } from "query-string";
import { changeSetting } from "../../../store/actions/actions";
import UserContext from "../../UserContext";
import ToDoGrid from "./ToDoGrid";
import EmailsModal from "./EmailsModal";
import TouchInfoModal from "../../Common/TouchInfoModal";
import ZipWhipModal from "../../Common/ZipwhipTouchModal";
import FilterButton from "../../Common/FilterButton";
import PageHeader from "../../Common/PageHeader";
import CompleteOtherTouchModal from "../ToDo/CompleteOtherTouchModal";
import CompleteLinkedInTouchModal from "../ToDo/CompleteLinkedInTouchModal";
import FETCH_PROSPECTS_QUERY, { FETCH_TODO_COUNT_QUERY, COMPLETE_TOUCH_QUERY } from '../../queries/ProspectsQuery';

const ToDo = ({ location, pinnedFilterButton, changeSetting }) => {

  const [showAddEmailsModal, setShowEmailsModal] = useState(false);
  const { query: searchParams } = parseUrl(window.location.search);
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;
  const searchInputRef = React.useRef();
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const filterButtons = ["ALL", "EMAIL", "OTHERS", "LINKEDIN", "TEXT"];
  const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [sortBy, setSortBy] = useState("contactName");
  const [orderBy, setOrderBy] = useState("asc");
  const [todoFilter, setTodoFilter] = useState(
    pinnedFilterButton === "ALL"
      ? `&sort[${sortBy}]=${orderBy}&filter[user][id]=${currentUserId}&filter[currentTouchStatus]=SCHEDULED&filter[currentTouchType]=!=CALL`
      : `&sort[${sortBy}]=${orderBy}&filter[user][id]=${currentUserId}&filter[currentTouchStatus]=SCHEDULED&filter[currentTouchType]=${pinnedFilterButton}`
  );
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [activeTab, setActiveTab] = useState(filterButtons.indexOf(searchParams["filter[memberStatus]"]) > -1 ? searchParams["filter[memberStatus]"] : (filterButtons.indexOf(pinnedFilterButton) > -1 ? pinnedFilterButton : filterButtons[0]));
  const [showTouchInfo, setShowTouchInfo] = useState(false);
  const [touchInfoHeading, setTouchInfoHeading] = useState("");
  const [touchInfoConfirmBtnIcon, setTouchInfoConfirmBtnIcon] = useState("");
  const [touchInfoConfirmBtnText, setTouchInfoConfirmBtnText] = useState("");
  const [touchInfoDetails, setTouchInfoDetails] = useState({});
  const [showZhipwhiTouchWindow, setShowZhipwhiTouchWindow] = useState(false);
  const [textPhoneNumber, setTextPhoneNumber] = useState(0);
  const [lastActivityData, setLastActivityData] = useState({});
  const [showCompleteTouch, setShowCompleteTouch] = useState(false);
  const [showLinkedInTouch, setShowLinkedInTouch] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const cursorStyle = { "cursor": "pointer" };
  let zipwhipSessionKey = '894BECDC5D90E1F89137FB73EEF77159BD0070E5A25C57B3E7908F1825B075908B360CC9F747E90FA452153E4BC075F0';
  const sortingParams = {
    "contactName": "sort[contactName]",
    "campaignName": "sort[cadence][name]",
    "currentTouchType": "sort[currentTouchType]",
    "duedate": "sort[due]",
    "product": "sort[product]",
    "lastActivityDatetime": "sort[lastActivityDatetime]"
  }
  const toastStyles = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }
  const successAlert = (message) => {
    return toast.success(message, toastStyles);
  }
  const errorAlert = (message) => {
    return toast.error(message, toastStyles);
  }
  const {
    data: todoData,
    loading,
    error,
    refetch: refetchToDoData
  } = useQuery(FETCH_PROSPECTS_QUERY, {
    variables: {
      includeAssociationsQry:
        "includeAssociations[]=cadence&includeAssociations[]=touch",
      prospectFilter: todoFilter,
      limit: limit,
      offset: offset,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  // To show todo counts in the tab
  const {
    data: todoCount,
    loading: todoCountLoading,
    error: todoCountError,
    refetch: refetchToDoCount
  } = useQuery(FETCH_TODO_COUNT_QUERY, {
    variables: { userFilter },
    notifyOnNetworkStatusChange: true
  });

  // To Completed the linked in touch and linked in touch
  const [completeTouch, { loading: completeTouchLoading }] = useLazyQuery(COMPLETE_TOUCH_QUERY, {
    onCompleted: (response) => handleCompleTouchCallBack(response, true),
    onError: (response) => handleCompleTouchCallBack(response)
  });

  // Use Memo Blocks Start

  const todoGridData = useMemo(
    () =>
      todoData && todoData.prospects
        ? todoData.prospects.data
        : [],
    [todoData]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "contactName",
        width: "25%",
        Cell: function (props) {
          let rowData = props.row.original;
          let cadence;
          let touch;
          if (
            rowData.associations &&
            rowData.associations.cadence &&
            props.todoData.prospects.includedAssociations.cadence
          ) {
            cadence = props.todoData.prospects.includedAssociations.cadence.find(
              (cadence) => cadence.id === rowData.associations.cadence[0].id
            );
          }

          if (
            rowData.associations.touch &&
            props.todoData.prospects.includedAssociations.touch
          ) {
            touch = props.todoData.prospects.includedAssociations.touch.find(
              (touch) => touch.id === rowData.associations.touch[0].id
            );
          }

          return (
            <span>
              <Link
                to={{
                  pathname: "prospects/" + props.row.original.id,
                  search: window.location.search,
                  state: {
                    allProspectsData: props.todoData,
                    cadence,
                    origin: location.pathname,
                    prospect: props.row.original,
                    touch,
                  },
                }}
                className="text-dark"
              >
                <strong>{props.value}</strong>
              </Link>
              <br></br>
              <small>{props.row.original.title}</small>
              <br></br>
              <Link
                to={"/accounts/" + props.row.original.id}
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
        accessor: "campaignName",
        width: "20%",
        Cell: function (props) {
          let rowData = props.row.original;
          let cadence;

          if (
            rowData.associations &&
            rowData.associations.cadence &&
            props.todoData.prospects.includedAssociations.cadence
          ) {
            cadence = props.todoData.prospects.includedAssociations.cadence.find(
              (cadence) => cadence.id === rowData.associations.cadence[0].id
            );
          }
          if (cadence) {
            return (
              <span>
                <Link
                  to={"/cadences/" + cadence.id}
                  className="text-dark"
                >
                  <strong>{cadence.name}</strong>
                </Link>
              </span>
            );
          } else {
            return <span></span>;
          }
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
                  {getTouchIcons(rowData.currentTouchType, "text-muted", true)}
                </span>
                <span>
                  <strong>Touch {rowData.currentTouchId} ({rowData.currentTouchType})</strong>
                </span>
              </>
            );
          } else {
            return <span></span>;
          }
        },
      },
      {
        Header: "Action",
        accessor: "actionEnvelope",
        disableSortBy: true,
        width: "10%",
        Cell: function (props) {
          let rowData = props.row.original;
          let button;
          let touch;

          if (
            rowData.associations.touch &&
            props.todoData.prospects.includedAssociations.touch
          ) {
            touch = props.todoData.prospects.includedAssociations.touch.find(
              (touch) => touch.id === rowData.associations.touch[0].id
            );
          }
          let touchType = rowData.currentTouchType;
          if (touchType == "EMAIL") {
            button = <a onClick={() => setShowEmailsModal(true)} style={cursorStyle}>
              <span className="fa-stack" >
                <i className="far fa-circle fa-stack-2x text-muted"></i>
                {getTouchIcons(touchType, "fa-stack-1x")}
              </span>
            </a>
          } else if (touchType == "OTHERS" || touchType == "LINKEDIN" || touchType == "TEXT") {
            button = <a onClick={() => handleShowTouchInfo(rowData, touch)} style={cursorStyle}>
              <span className="fa-stack" >
                <i className="far fa-circle fa-stack-2x text-muted"></i>
                {getTouchIcons(touchType, "fa-stack-1x")}
              </span>
            </a>
          }
          return (
            <span>{button}
            </span>
          );
        },
      },
      {
        Header: "Due",
        accessor: "duedate",
        width: "10%",
      },
      {
        Header: "Last Contact",
        accessor: "lastActivityDatetime",
        width: "20%",
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
    ]
  );

  // Use Memo Blocks End

  // Use Effects Blocks Start

  useEffect(
    () =>
      setPageCount(
        !loading && todoData.prospects.paging
          ? Math.ceil(todoData.prospects.paging.totalCount / limit)
          : 0
      ),
    [todoGridData]
  );

  useEffect(() => setIsRequestLoading(completeTouchLoading), [completeTouchLoading])

  // Use Effects Blocks End

  /* Handle Events Start*/

  // To render the grid when All, Email, Others, LinkedIn,Text tabe changed
  const handleToDoTabChange = (e) => {
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
    let contactName = searchInputRef.current.value.trim();
    if (contactName)
      query["filter[contactName]"] = contactName;
    tabValue === "ALL" ? query["filter[currentTouchType]"] = "!=CALL"
      : query["filter[currentTouchType]"] = tabValue;
    let filterQry = Object.entries({ ...query, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter")).map(([key, val]) => `${key}=${val}`).join("&")
    setTodoFilter(filterQry === "" ? "" : "&" + filterQry);
    let searchString = Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");
    window.history.replaceState({}, '', "?" + searchString);
  }

  const handleTodoSearch = () => {
    setOffset(0);
    setCurrentPageIndex(0);
    const { query } = parseUrl(window.location.search);
    let contactName = searchInputRef.current.value.trim();
    if (contactName)
      query["filter[contactName]"] = contactName;
    else
      delete query["filter[contactName]"];
    // activeTab === "ALL" ? query["filter[currentTouchType]"] = "!=CALL" :
    //   query["filter[currentTouchType]"] = activeTab;

    query[sortingParams[sortBy]] = orderBy;

    let filterQry = Object.entries({
      ...query,
      "filter[user][id]": currentUserId,
      "filter[currentTouchStatus]": "SCHEDULED",
      "filter[currentTouchType]": activeTab === "ALL" ? "!=CALL" : activeTab
    }).filter(([key]) => key.startsWith("filter") || key.startsWith("sort"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&")

    setTodoFilter(filterQry === "" ? "" : "&" + filterQry);
  }

  const handleShowTouchInfo = (rowData, touch) => {

    let touchData = {};
    let touchType = rowData.currentTouchType;
    touchData.cadenceName = rowData.campaignName;
    touchData.contactName = rowData.contactName;
    touchData.touchType = "Touch " + rowData.currentTouchId + "(" + touch.subTouch + ")";
    touchData.timeToComplete = rowData.duedate;
    touchData.lastTouch = rowData.lastTouch;
    touchData.currentTouchType = rowData.currentTouchType;
    touchData.accountName = rowData.accountName;
    touchData.description = touch.instructions;
    touchData.prospectId = rowData.id;
    touchData.lastTouchDateTime = new Date(rowData.lastTouchDateTime).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
    let touches = ["OTHERS", "LINKEDIN", "TEXT"]

    if (touchType === "OTHERS") {
      setTouchInfoHeading("Other Touch Info");
      setTouchInfoConfirmBtnText("Complete Touch");
    } else if (touchType === "LINKEDIN") {
      setTouchInfoHeading("Linkedin Touch Info");
      setTouchInfoConfirmBtnText("Complete Touch");
    } else if (touchType === "TEXT") {
      setTouchInfoHeading("ZipWhip Touch Info");
      setTouchInfoConfirmBtnText("Send a Text");
      setTextPhoneNumber(rowData.phone);
      setLastActivityData(touchData);
    }

    if (touches.indexOf(touchType) > -1) {
      setTouchInfoConfirmBtnIcon(getTouchIcons(touchType, "", true).props.className)
      setTouchInfoDetails(touchData)
      setShowTouchInfo(true)
    }
  }

  const handleShowCompleTouchWindow = () => {
    setShowTouchInfo(false);
    if (touchInfoDetails.currentTouchType === "OTHERS")
      setShowCompleteTouch(true);
    else if (touchInfoDetails.currentTouchType === "TEXT")
      setShowZhipwhiTouchWindow(true);
    else if (touchInfoDetails.currentTouchType === "LINKEDIN")
      setShowLinkedInTouch(true);
  }

  const handleCompleTouch = (requestData) => {
    completeTouch({
      variables: {
        input: {
          touchType: requestData.touchType,
          touchInput: requestData.touchInput,
        },
        prospectId: requestData.prospectId
      },
    });
  }

  const handleCompleTouchCallBack = (response, status) => {
    if (status && response && response.completeTouch.response === "success") {
      successAlert("Completed Successfully!");
      refetchToDoData();
      refetchToDoCount();
    } else {
      errorAlert("Completed Failed!")
    }
    setShowCompleteTouch(false);
  }



  /* Handle Events End*/

  const getTouchIcons = (touch, extraClass, removeColor) => {

    let className;
    if (touch === "EMAIL")
      className = removeColor ? `fas fa-envelope ${extraClass}` : `fas fa-envelope ${extraClass} text-primary`;
    else if (touch === "OTHERS")
      className = removeColor ? `fas fa-share-alt ${extraClass}` : `fas fa-share-alt ${extraClass} text-success`;
    else if (touch === "LINKEDIN")
      className = removeColor ? `fab fa-linkedin-in ${extraClass}` : `fab fa-linkedin-in ${extraClass} text-info`;
    else if (touch === "TEXT")
      className = removeColor ? `fas fa-comments ${extraClass}` : `fas fa-comments ${extraClass} text-warning`;
    else
      className = ``;

    return <i className={className}></i>
  }

  useEffect(() => {
    handleTodoSearch();
  }, [sortBy, orderBy])

  return (
    <ContentWrapper>
      <PageHeader icon="fas fa-tasks" pageName="To-Do">
        <div className="ml-auto">
          <InputGroup>
            <Input
              placeholder="Search"
              innerRef={searchInputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTodoSearch()
                }
              }}
            />
            <InputGroupAddon addonType="append">
              <Button
                outline
                onClick={handleTodoSearch}
              >
                <i className="fa fa-search"></i>
              </Button>
              <Button
                outline
                onClick={() => {
                  searchInputRef.current.focus()
                  searchInputRef.current.value = '';
                  handleTodoSearch();
                }}
              >
                <i className="fa fa-times"></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </PageHeader>
      <Row>
        <Col>
          <Card className="card-default">
            <CardBody className="bb">
              <Row>
                <Col>
                  <Table responsive>
                    <ButtonGroup>
                      <FilterButton
                        active={activeTab === filterButtons[0]}
                        count={todoCount ? todoCount.all.paging.totalCount : 0}
                        countError={todoCountError}
                        countLoading={todoCountLoading}
                        data-tab-value={filterButtons[0]}
                        handleClick={handleToDoTabChange}
                      >
                        ALL
                    </FilterButton>
                      <FilterButton
                        active={activeTab === filterButtons[1]}
                        count={todoCount ? todoCount.email.paging.totalCount : 0}
                        countError={todoCountError}
                        countLoading={todoCountLoading}
                        data-tab-value={filterButtons[1]}
                        handleClick={handleToDoTabChange}
                        handlePin={(pin) => changeSetting("toDoPinnedFilterButton", pin ? filterButtons[1] : filterButtons[0])}
                        pinned={pinnedFilterButton === filterButtons[1]}
                      >
                        EMAIL
                    </FilterButton>
                      <FilterButton
                        active={activeTab === filterButtons[2]}
                        count={todoCount ? todoCount.others.paging.totalCount : 0}
                        countError={todoCountError}
                        countLoading={todoCountLoading}
                        data-tab-value={filterButtons[2]}
                        handleClick={handleToDoTabChange}
                        handlePin={(pin) => changeSetting("toDoPinnedFilterButton", pin ? filterButtons[2] : filterButtons[0])}
                        pinned={pinnedFilterButton === filterButtons[2]}
                      >
                        OTHERS
                    </FilterButton>
                      <FilterButton
                        active={activeTab === filterButtons[3]}
                        count={todoCount ? todoCount.linkedin.paging.totalCount : 0}
                        countError={todoCountError}
                        countLoading={todoCountLoading}
                        data-tab-value={filterButtons[3]}
                        handleClick={handleToDoTabChange}
                        handlePin={(pin) => changeSetting("toDoPinnedFilterButton", pin ? filterButtons[3] : filterButtons[0])}
                        pinned={pinnedFilterButton === filterButtons[3]}
                      >
                        LINKEDIN
                    </FilterButton>
                      <FilterButton
                        active={activeTab === filterButtons[4]}
                        count={todoCount ? todoCount.text.paging.totalCount : 0}
                        countError={todoCountError}
                        countLoading={todoCountLoading}
                        data-tab-value={filterButtons[4]}
                        handleClick={handleToDoTabChange}
                        handlePin={(pin) => changeSetting("toDoPinnedFilterButton", pin ? filterButtons[4] : filterButtons[0])}
                        pinned={pinnedFilterButton === filterButtons[4]}
                      >
                        TEXT
                    </FilterButton>
                    </ButtonGroup>
                  </Table>
                </Col>
              </Row>
            </CardBody>
            <ToDoGrid
              columns={columns}
              data={todoGridData}
              todoData={todoData}
              sortBy={sortBy}
              orderBy={orderBy}
              fetchData={({ pageIndex, pageSize }) => {

                setOffset(pageIndex);
                setCurrentPageIndex(pageIndex);
                setLimit(pageSize);
                if (!currentUrlStatePushed) {

                  window.history.replaceState({}, '', window.location.href);

                  setCurrentUrlStatePushed(true);
                }

                const { query } = parseUrl(window.location.search);
                if (query["filter[contactName]"])
                  searchInputRef.current.value = query["filter[contactName]"];

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
              handleRefresh={refetchToDoData}
              handleSort={(sortBy, orderBy) => {
                setSortBy(sortBy);
                setOrderBy(orderBy ? "desc" : "asc");
              }}
            />
          </Card>
        </Col>
      </Row>
      <EmailsModal
        hideModal={() => { setShowEmailsModal(false) }}
        showModal={showAddEmailsModal}
      />
      <TouchInfoModal
        touchInfoHeading={touchInfoHeading}
        showTouchInfo={showTouchInfo}
        touchInfoDetails={touchInfoDetails}
        handleClose={() => setShowTouchInfo(false)}
        confirBtnIcon={touchInfoConfirmBtnIcon}
        confirmBtnText={touchInfoConfirmBtnText}
        handleShowCompleTouchWindow={handleShowCompleTouchWindow}
      />
      <ZipWhipModal
        showZhipwhiTouchWindow={showZhipwhiTouchWindow}
        phoneNumber={textPhoneNumber}
        zipwhipSessionKey={zipwhipSessionKey}
        handleClose={() => setShowZhipwhiTouchWindow(false)}
        lastActivityData={lastActivityData}
      />
      <CompleteOtherTouchModal
        showCompleteTouch={showCompleteTouch}
        touchInfoDetails={touchInfoDetails}
        handleClose={() => setShowCompleteTouch(false)}
        handleCompleTouch={handleCompleTouch}
        errorAlert={errorAlert}
        isRequestLoading={isRequestLoading}
      />
      <CompleteLinkedInTouchModal
        showCompleteTouch={showLinkedInTouch}
        touchInfoDetails={touchInfoDetails}
        handleClose={() => setShowLinkedInTouch(false)}
      />
      <ToastContainer toastStyles />
    </ContentWrapper>
  )
};

// This is required for redux
const mapStateToProps = state => ({
  pinnedFilterButton: state.settings.toDoPinnedFilterButton
});

export default connect(mapStateToProps, { changeSetting })(ToDo);