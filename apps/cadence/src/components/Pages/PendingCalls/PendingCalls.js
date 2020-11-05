/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverBody, Row } from "reactstrap";
import { parseUrl } from "query-string";
import UserContext from "../../UserContext";
import { ContentWrapper } from "@nextaction/components";
import ConfirmModal from "../../Common/ConfirmModal";
import ZipWhipModal from "../../Common/ZipwhipTouchModal";
import CadenceList from "../../Common/CadenceList";
import UserList from "../../Common/UserList";
import CloseButton from "../../Common/CloseButton";
import DropDown from "../../Common/DropDown";
import FETCH_PROSPECTS_QUERY from "../../queries/ProspectsQuery";
import FETCH_TOUCHES_QUERY from "../../queries/PendingCallsQuery";
import PendingCallsGrid from "../PendingCalls/PendingCallsGrid";

const PendingCalls = ({ location }) => {
  const { query: searchParams } = parseUrl(window.location.search);
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(
    searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0
  );
  const [sortBy, setSortBy] = useState("contactName");
  const [orderBy, setOrderBy] = useState("asc");
  const [pendingCallsFilter, setPendingCallsFilter] = useState(
    `&sort[${sortBy}]=${orderBy}&filter[user][id]=${currentUserId}&filter[currentTouchType]=CALL&filter[currentTouchStatus]=SCHEDULED`
  );
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(
    searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10
  );
  const [offset, setOffset] = useState(
    searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0
  );
  const [cadenceValue, setCadenceValue] = useState();
  const [touchValue, setTouchValue] = useState();
  const [isClickDialerChecked, setIsClickDialerChecked] = useState(false);
  const [isPersonalDialerChecked, setIsPersonalDialerChecked] = useState(false);
  const [isTeamDialerChecked, setIsTeamDialerChecked] = useState(false);
  const [touches, setTouches] = useState([]);
  const [showStartPowerDialingConfirmModal, setShowStartPowerDialingConfirmModal] = useState(false);
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [showZhipwhiTouchWindow, setShowZhipwhiTouchWindow] = useState(false);
  const [textPhoneNumber, setTextPhoneNumber] = useState(0);
  const [lastActivityData, setLastActivityData] = useState({});
  let zipwhipSessionKey = '894BECDC5D90E1F89137FB73EEF77159BD0070E5A25C57B3E7908F1825B075908B360CC9F747E90FA452153E4BC075F0';

  const [followUp, setFollowUp] = useState("Due");
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [showViewInfo, setShowViewInfo] = useState(false);
  const [userId, setUserId] = useState(currentUserId);
  const sortingParams = {
    "contactName": "sort[contactName]",
    "campaignName": "sort[cadence][name]",
    "currentTouchType": "sort[currentTouchType]",
    "duedate": "sort[due]",
    "product": "sort[product]"
  }

  const {
    data: pendingCallsData,
    loading,
    error,
    refetch: refetchPendingCalls
  } = useQuery(FETCH_PROSPECTS_QUERY, {
    variables: {
      includeAssociationsQry:
        "includeAssociations[]=cadence&includeAssociations[]=touch",
      prospectFilter: pendingCallsFilter,
      limit,
      offset,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });

  const [renderTouches] = useLazyQuery(FETCH_TOUCHES_QUERY, {
    onCompleted: (response) => handleRenderTouches(response, true),
    onError: (response) => handleRenderTouches(response),
  });

  const renderZhipwhipTouch = (phoneNumber, lastActivityData) => {
    setTextPhoneNumber(phoneNumber);
    setShowZhipwhiTouchWindow(true);
    setLastActivityData(lastActivityData);
  }

  const PopoverItem = props => {
    const { id, data } = props;
    const [popoverOpen, setPopoverOpen] = useState(false);

    const toggle = () => setPopoverOpen(!popoverOpen);

    return (
      <span>
        <Popover
          placement={"left"}
          isOpen={popoverOpen}
          target={"Popover-" + id}
          toggle={toggle}
        >
          <PopoverBody>
            <Col>
              <Row className="p-1">
                <span className="pointer" onClick={() => setShowSnoozeModal(true)}><i className="fas fa-user-clock mr-2"></i>Snooze</span>
              </Row>
              <Row className="p-1">
                <span className="pointer" onClick={() => handleViewInfo(data)}><i className="fas fa-street-view mr-2"></i>View Info</span>
              </Row>
              <Row className="p-1">
                <span className="pointer"><i className="fas fa-phone phone-contact mr-2 fa-rotate-90"></i>Complete Call</span>
              </Row>
            </Col>
          </PopoverBody>
        </Popover>
      </span >
    );
  };

  const SnoozeModal = ({ showSnoozeModal, handleCancel }) => {

    return (
      <Modal size="md" isOpen={showSnoozeModal} centered={true}>
        <ModalHeader>Snooze</ModalHeader>
        <ModalBody>
          <div>
            <FormGroup row className="mb-0">
              <Label for="snooze_value" sm={6}>Click Snooze to be reminded in</Label>
              <Col sm={6}>
                <Input type="select" name="email" id="snooze_value" >
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="6 hours">6 hours</option>
                  <option value="12 hours">12 hours</option>
                  <option value="1 day">1 day</option>
                  <option value="2 days">2 days</option>
                  <option value="4 days">4 days</option>
                  <option value="1 week">1 week</option>
                </Input>
              </Col>
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="p-1">
          <Col className="text-right">
            <Button color="primary" className="mr-2" ><i className="fas fa-arrows-alt mr-2"></i>Snooze</Button>
            <CloseButton onClick={handleCancel} btnTxt="Cancel" ><i className="fa fa-times mr-2"></i></CloseButton>
          </Col>
        </ModalFooter>
      </Modal>
    )
  }

  const ViewInfoModal = ({ showViewInfo, handleOk }) => {
    return (
      <Modal size="md" isOpen={showViewInfo} centered={true}>
        <ModalHeader>Follow Up View Info</ModalHeader>
        <ModalBody>
          <Row className="p-1">
            <Col>Subject</Col><Col></Col>
          </Row>
          <Row className="p-1">
            <Col>Comments</Col><Col></Col>
          </Row>
          <Row className="p-1">
            <Col>Due Date</Col><Col></Col>
          </Row>
        </ModalBody>
        <ModalFooter className="p-1">
          <Col className="text-right">
            <Button color="primary" onClick={handleOk}><i className="fas fa-check mr-2"></i>Ok</Button>
          </Col>
        </ModalFooter>
      </Modal >
    )
  }

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
            props.pendingCallsData.prospects.includedAssociations.cadence
          ) {
            cadence = props.pendingCallsData.prospects.includedAssociations.cadence.find(
              (cadence) => cadence.id === rowData.associations.cadence[0].id
            );
          }

          if (
            rowData.associations.touch &&
            props.pendingCallsData.prospects.includedAssociations.touch
          ) {
            touch = props.pendingCallsData.prospects.includedAssociations.touch.find(
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
                    allProspectsData: props.pendingCallsData,
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
            props.pendingCallsData.prospects.includedAssociations.cadence
          ) {
            cadence = props.pendingCallsData.prospects.includedAssociations.cadence.find(
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
                <span>
                  <i className="fas fa-phone-alt text-muted mr-2"></i><strong>Touch {rowData.currentTouchId}</strong>
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
        accessor: "action",
        width: "10%",
        disableSortBy: true,
        Cell: function (props) {
          let rowData = props.row.original;
          let cadence;
          if (
            rowData.associations &&
            rowData.associations.cadence &&
            props.pendingCallsData.prospects.includedAssociations.cadence
          ) {
            cadence = props.pendingCallsData.prospects.includedAssociations.cadence.find(
              (cadence) => cadence.id === rowData.associations.cadence[0].id
            );
          }
          let lastActivityData = {};
          if (cadence) {
            lastActivityData.cadenceName = cadence.multiTouchName;
          }
          lastActivityData.lastTouchDateTime = rowData.lastTouchDateTime;
          lastActivityData.lastTouch = rowData.lastTouch;

          if (rowData) {
            return (
              <>
                <span className="pointer">
                  <span className="fa-stack" >
                    <i className="far fa-circle fa-stack-2x text-muted"></i>
                    <i className="fas fa-phone-alt fa-stack-1x text-success"></i>
                  </span>
                </span>
                <span onClick={() => renderZhipwhipTouch(rowData.phone, lastActivityData)} className="pointer">
                  <span className="fa-stack" >
                    <i className="far fa-circle fa-stack-2x text-muted"></i>
                    <i className="fas fa-comments fa-stack-1x text-warning"></i>
                  </span>
                </span>
              </>
            );
          } else {
            return <span></span>;
          }
        },
      },
      {
        Header: "Due",
        accessor: "duedate",
        width: "15%"
      },
      {
        Header: "Calling Mode",
        accessor: "product",
        width: "20%"
      }, {
        id: "followup_action",
        disableSortBy: true,
        Cell: (props) => {
          let rowData = props.row.original;
          return (
            <>
              <a style={{ "cursor": "pointer" }} id={"Popover-" + rowData.id}><i className="fas fa-ellipsis-v"></i></a>
              <PopoverItem id={rowData.id} data={rowData} />
            </>
          )
        }
      }
    ],
    []
  );

  const pendingCallsGridData = useMemo(
    () =>
      pendingCallsData && pendingCallsData.prospects
        ? pendingCallsData.prospects.data
        : [],
    [pendingCallsData]
  );

  useEffect(
    () =>
      setPageCount(
        !loading && pendingCallsData.prospects.paging
          ? Math.ceil(pendingCallsData.prospects.paging.totalCount / limit)
          : 0
      ),
    [pendingCallsGridData]
  );


  useEffect(() => handlePendingCallsSearch(), [sortBy, orderBy])

  /*----------------Handle blocks start------------------------*/

  const handleViewInfo = () => {
    setShowViewInfo(true)
  }

  const handlePendingCallsSearch = () => {

    const { query } = parseUrl(window.location.search);
    if (!isNaN(cadenceValue) || Array.isArray(cadenceValue) && cadenceValue.length > 1) {
      query["filter[cadence][id]"] = getEncodedUriValue(cadenceValue);
    }
    if (!isNaN(touchValue)) query["filter[currentTouchId]"] = touchValue;

    if (isClickDialerChecked && isPersonalDialerChecked && isTeamDialerChecked) {
      query["filter[callingMode]"] = encodeURIComponent(":[CD,PD,TD]");
    } else if (isClickDialerChecked && isPersonalDialerChecked) {
      query["filter[callingMode]"] = encodeURIComponent(":[CD,PD]");
    } else if (isPersonalDialerChecked && isTeamDialerChecked) {
      query["filter[callingMode]"] = encodeURIComponent(":[PD,TD]");
    } else if (isTeamDialerChecked && isClickDialerChecked) {
      query["filter[callingMode]"] = encodeURIComponent(":[CD,TD]");
    } else if (isClickDialerChecked) {
      query["filter[callingMode]"] = "CD";
    } else if (isPersonalDialerChecked) {
      query["filter[callingMode]"] = "PD";
    } else if (isTeamDialerChecked) {
      query["filter[callingMode]"] = "TD";
    }

    query[sortingParams[sortBy]] = orderBy;

    let filterQry = Object.entries({
      ...query,
      "filter[user][id]": userId,
      "filter[currentTouchType]": "CALL",
      "filter[currentTouchStatus]": "SCHEDULED",
    })
      .filter(([key]) => key.startsWith("filter") || key.startsWith("sort"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");

    setPendingCallsFilter(filterQry === "" ? "" : "&" + filterQry);
  };



  const handlePendingCallsReset = () => {
    setCadenceValue("Select Cadence");
    setTouches({});
    setIsClickDialerChecked(false);
    setIsPersonalDialerChecked(false);
    setIsTeamDialerChecked(false);
  }

  const handleRenderTouches = (response, responseStatus) => {
    let touches = response.touches && response.touches.data &&
      response.touches.data.map((touch) => {
        return (
          { 'text': "Touch # " + touch.stepNo, 'value': touch.stepNo, 'active': false }
        );
      });
    if (responseStatus) {
      setTouches(touches);
    }
  };

  const handleFollowupChange = (e) => {
    setFollowUp(e.target.value)
  }

  const handleUserChange = (value) => {
    setUserId(value);
  }

  const handleCadenceChange = (value) => {

    let touchFilterQry = Object.entries({
      "filter[user][id]": currentUserId,
      "filter[touchType]": "CALL",
      "filter[cadence][id]": getEncodedUriValue(value),
    })
      .filter(([key]) => key.startsWith("filter"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");

    renderTouches({
      variables: {
        touchesFilter: touchFilterQry,
      },
    });
    setCadenceValue(value);
  }

  /*----------------Handle blocks end------------------------*/

  const getEncodedUriValue = (value) => {
    return value && Array.isArray(value) && value.length > 1 ? encodeURIComponent(':[' + value + ']') : value;
  }

  const startPowerDialing = () => {
    setShowStartPowerDialingConfirmModal(true);
  }

  useEffect(() => handlePendingCallsSearch(), [sortBy, orderBy])


  return (
    <ContentWrapper>
      <div className="content-heading">
        <div><i className="fas fa-phone-alt mr-2"></i>Pending Calls</div>
        <div className="ml-auto">
          <div className="float-right">
            <Button
              color="primary"
              className="ml-auto mt-n1 rounded-0 shadow-sm"
              onClick={startPowerDialing}
            >
              <h4 className="m-1">
                <span className="svgicon calling mr-2"></span> Start Power Dialing
              </h4>
            </Button>
          </div>
        </div>
      </div>
      <Row>
        <Col>
          <Card className="card-default">
            <CardBody className="p-0">
              <div className="p-3">
                <Row>
                  <Col sm={12} md={12} lg={8}>
                    <Row>
                      <Col sm={3}>
                        <CadenceList multiselect={true} onChange={handleCadenceChange} placeHolder={"Select Cadences"} />
                      </Col>
                      <Col sm={3}>
                        <DropDown data={touches} placeHolder={"Select Touches"} onChange={(value) => {
                          const touchValue = value
                            ? Number(value)
                            : 0;
                          setTouchValue(touchValue);
                        }}
                        />
                      </Col>
                      <Col sm={3}>
                        <UserList value={currentUserId} onChange={handleUserChange} placeHolder={"Select Users"} />
                      </Col>
                      <Col sm={3}>
                        <Button color="secondary" onClick={handlePendingCallsSearch}>
                          <i className="fa fa-search"></i>
                        </Button>
                        <Button
                          color="outline-secondary"
                          type="button"
                          onClick={handlePendingCallsReset}
                        >
                          <i className="fa fa-times"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="border-top border-bottom">
                <Row>
                  <Col lg={7} className="d-flex">
                    <div className="card m-0 rounded-0 bg-white br">
                      <div className="card-body pl-4 pt-0 pb-0 d-flex align-items-center">
                        <div className="block pl-2 pt-1">
                          <div className="row">
                            <span className="fa-2x svgicon speed-30"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span class="path5"></span></span>
                          </div>
                          <div className="row">
                            <small className="mx-auto pl-1">30%</small>
                          </div>
                        </div>
                        <div className="ml-4 text-nowrap">
                          Click Dialer
                          <Label className="pl-3 ml-3">
                            <Input
                              className="mt-n1"
                              id="pending_calls_cd"
                              type="checkbox"
                              checked={isClickDialerChecked}
                              onChange={(e) => setIsClickDialerChecked(e.target.checked)}
                            />
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="card m-0 rounded-0 bg-white br">
                      <div className="card-body pl-4 pt-0 pb-0 d-flex align-items-center">
                        <div className="block pl-2 pt-1">
                          <div className="row">
                            <span className="fa-2x svgicon speed-100"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span class="path5"></span></span>
                          </div>
                          <div className="row">
                            <small className="mx-auto pl-1">100%</small>
                          </div>
                        </div>
                        <div className="ml-4 text-nowrap">
                          Personal Dialer
                          <Label className="pl-3 ml-3">
                            <Input
                              className="mt-n1"
                              id="pending_calls_pd"
                              type="checkbox"
                              checked={isPersonalDialerChecked}
                              onChange={(e) =>
                                setIsPersonalDialerChecked(e.target.checked)
                              }
                            />
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="card m-0 rounded-0 bg-white br">
                      <div className="card-body pl-4 pt-0 pb-0 d-flex align-items-center">
                        <div className="block pl-2 pt-1">
                          <div className="row">
                            <span className="fa-2x svgicon speed-800"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span class="path5"></span></span>
                          </div>
                          <div className="row">
                            <small className="mx-auto pl-1">800%</small>
                          </div>
                        </div>
                        <div className="ml-4 text-nowrap">
                          Team Dialer
                          <Label className="pl-3 ml-3">
                            <Input
                              className="mt-n1"
                              id="pending_calls_td"
                              type="checkbox"
                              checked={isTeamDialerChecked}
                              onChange={(e) => setIsTeamDialerChecked(e.target.checked)}
                            />
                          </Label>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={5} className="d-flex justify-content-lg-end justify-content-sm-start my-auto pl-5 ml-n3">
                    <Label check className="mr-3">Follow Up Calls</Label>
                    <FormGroup check inline>
                      <Label check>
                        <Input type="radio" name="followupAll" checked={followUp === "All"} value="All" onChange={(e) => handleFollowupChange(e)} /> All
                        </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <Input type="radio" name="followupDue" checked={followUp === "Due"} value="Due" onChange={(e) => handleFollowupChange(e)} /> Due
                        </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <Input type="radio" name="followupFuture" checked={followUp === "Future"} value="Future" onChange={(e) => handleFollowupChange(e)} /> Future
                        </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <PendingCallsGrid
                columns={columns}
                data={pendingCallsGridData}
                pendingCallsData={pendingCallsData}
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
                selectedRowCount={(count) => {
                  setSelectedRowCount(count)
                }}
                handleRefresh={refetchPendingCalls}
                handleSort={(sortBy, orderBy) => {
                  setSortBy(sortBy);
                  setOrderBy(orderBy ? "desc" : "asc");
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ConfirmModal
        confirmBtnIcon="fas fa-check"
        confirmBtnText="Proceed"
        handleCancel={() => { setShowStartPowerDialingConfirmModal(false) }}
        handleConfirm={() => setShowStartPowerDialingConfirmModal(false)}
        header="Start Power Dialing"
        showConfirmModal={showStartPowerDialingConfirmModal}
      >
        <span className="text-center">
          You have selected <strong>{selectedRowCount}</strong> Prospect(s) to dial.
           <br />Any exisiting records in the Dialing Session will be replaced.
            <br />Would you like to proceed?
        </span>
      </ConfirmModal>
      <ZipWhipModal
        showZhipwhiTouchWindow={showZhipwhiTouchWindow}
        phoneNumber={textPhoneNumber}
        zipwhipSessionKey={zipwhipSessionKey}
        handleClose={() => setShowZhipwhiTouchWindow(false)}
        lastActivityData={lastActivityData}
      />
      <SnoozeModal
        showSnoozeModal={showSnoozeModal}
        handleCancel={() => setShowSnoozeModal(false)}
      />
      <ViewInfoModal
        showViewInfo={showViewInfo}
        handleOk={() => setShowViewInfo(false)}
      />
    </ContentWrapper >
  );
};

export default PendingCalls;