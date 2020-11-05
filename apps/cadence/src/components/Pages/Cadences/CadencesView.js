import React, { useContext, useState,useMemo } from "react";
import { Button, ButtonGroup, Card, CardHeader, Col, Input, InputGroup, InputGroupAddon, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { withRouter, useHistory } from "react-router-dom";
import { parseUrl } from "query-string";
import { toast } from "react-toastify";

import { ContentWrapper } from "@nextaction/components";
import UserContext from "../../UserContext";
import CadenceOverView from "./CadenceOverView";
import TouchInfo from "./TouchInfo";
import Calls from "./Calls";
import Emails from "./Emails";
import Prospects from "./Prospects";
import ProtectedRoute from "../../ProtectedRoute";

import {FETCH_CADENCE_QUERY} from "../../queries/CadenceQuery";
import EmailTouchModal from "./EmailTouchModal";
import CallTouchModal from "./CallTouchModal";
import LinkedInTouchModel from "./LinkedInTouchModal"
import OtherTouchModal from "./OtherTouchModal"
import CadenceReportGrid from "./CadenceReportGrid"
import { default as ClButton } from "../../Common/Button";
import AssignProspectsModal from "./AssignProspectsModel"
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import TextTouchModel from "./TextTouchModal";

import CREATE_TOUCH,{ CREATE_OTHER_TOUCH,FETCH_TOUCHES_QUERY } from "../../queries/TouchQuery";

const components = {
  touches: TouchInfo,
  overview: CadenceOverView,
  prospects: Prospects,
  emails: Emails,
  calls: Calls,
};

const sections = [
  { key: "touches", name: "Touches" },
  { key: "overview", name: "Overview" },
  { key: "prospects", name: "Prospects" },
  { key: "emails", name: "Emails" },
  { key: "calls", name: "Calls" },
];

const Capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const CadenceView = ({ match, location, history}) => {

  const { query: searchParams } = parseUrl(window.location.search);
  const currentURL=window.location.href

  const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
  const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
  const [status, setStatus] = useState(searchParams["filter[status]"] ?(searchParams["filter[status]"]) : "");
  const [sharedType, setSharedType] = useState(searchParams["filter[sharedType]"] ?(searchParams["filter[sharedType]"]) : "none");
  
  const prospectsFilterButtons = ["Total", "Active", "Paused", "FallThrough", "Exited", "Attempted", "Interested", "Not interested", "Bad data", "Opt-out"]
  const emailsFilterButtons = ["Total", "Active", "Paused", "Replied", "sent", "bounced", "Opened", "Links Clicked", "Failed", "Opt-out"]
  const callsFilterButtons = ["Total", "Active", "Paused", "Qualified lead", "Meeting scheduled", "Got referral", "Not interested", "Follow up", "Not a decision maker", "Call issue", "Other"]

  const { allCadencesData, cadence } = location.state ? location.state : {};
  const searchInputRef = React.useRef();
  const { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;
  const cadenceID = match.params["id"];
  const [prospectsFilter, setProspectsFilter] = useState(`&filter[user][id]=${currentUserId}`);
  const [touchFilter, settouchFilter] = useState(`filter[user][id]=${currentUserId}&filter[cadence][id]=${cadenceID}`)

  const sectionParams = match.params["section"];
  const [selectedSection, setSelectedSection] = useState(
    match.params["section"] || "touches"
  );

  const [cadenceFilter, setCadenceFilter] = useState(
    `&filter[status]=ACTIVE&filter[sharedType]=none`
  );

  const { data: prospectsCount, loading: prospectsCountLoading, error: prospectsCountError, refetch: refetchProspectsCount } = useQuery(FETCH_CADENCE_QUERY, {
    variables: { prospectsFilter,id:cadenceID },
    notifyOnNetworkStatusChange: true
  });
  
  const prospectsFilterMetrics=useMemo(
    () =>
    prospectsCount && prospectsCount.cadence.data[0].outComes,
    [prospectsCount]
  );

  const cadenceName =location.state?location.state.cadenceName:(prospectsCount&&prospectsCount.cadence.data[0].name)

  const [ShowEmailTouchModal, setShowEmailTouchModal] = useState(false);
  const [ShowCallTouchModal, setShowCallTouchModal] = useState(false);
  const [ShowLinkedInTouchModal, setShowLinkedInTouchModal] = useState(false);
  const [ShowOtherTouchModal, setShowOtherTouchModal] = useState(false);
  const [ShowTextTouchModal, setShowTextTouchModal] = useState(false);
  const [ShowAssignProspectsModal, setShowAssignProspectsModal] = useState(false);

  const [dispositionFilter, setDispositionFilter] = useState(
    `&filter[productType]=CD`
  );

  const { data: TouchesData, error: TouchesError,refetch: refetchTouchesData } = useQuery(FETCH_TOUCHES_QUERY, {
    variables: { 
      touchFilter:touchFilter,
      includeAssociationsQry: 'includeAssociations[]=emailTemplate',
      },
    notifyOnNetworkStatusChange: true
  });

  const TouchData=useMemo(
    () =>
    TouchesData && TouchesData.Touches ? TouchesData.Touches.data : [],
    [TouchesData]
  );
 
  const notify = (message, ToasterType) => {
    toast(message, {
      type: ToasterType,
      position: "top-right",
    });
  };
  
  const [addEmailTouch, { loading: addEmailTouchLoading }] = useLazyQuery(
    CREATE_TOUCH,
    {
      onCompleted: (response) => handleAddEmailTouchCallback(response, true),
      onError: (response) => handleAddEmailTouchCallback(response),
    }
  );
  const [addCallTouch, { loading: addCallTouchLoading }] = useLazyQuery(
    CREATE_OTHER_TOUCH,
    {
      onCompleted: (response) => handleAddCallTouchCallback(response, true),
      onError: (response) => handleAddCallTouchCallback(response),
    }
  );

  const [addOtherTouch, { loading: addOtherTouchLoading }] = useLazyQuery(
    CREATE_OTHER_TOUCH,
    {
      onCompleted: (response) =>
        handleAddOtherTouchRequestCallback(response, true),
      onError: (response) => handleAddOtherTouchRequestCallback(response),
    }
  );
  const [addLinkedInTouch, { loading: addLinkedInTouchLoading }] = useLazyQuery(
    CREATE_OTHER_TOUCH,
    {
      onCompleted: (response) =>
        handleAddLinkedInTouchRequestCallback(response, true),
      onError: (response) => handleAddLinkedInTouchRequestCallback(response),
    }
  );

  const [addTextTouch, { loading: addTextTouchLoading }] = useLazyQuery(
    CREATE_OTHER_TOUCH,
    {
      onCompleted: (response) =>
        handleAddTextTouchRequestCallback(response, true),
      onError: (response) => handleAddTextTouchRequestCallback(response),
    }
  );

  const [assignProspects, { loading: assignProspectsLoading }] = useLazyQuery(
    CREATE_OTHER_TOUCH,
    {
      onCompleted: (response) =>
        handleAssignProspectsRequestCallback(response, true),
      onError: (response) => handleAssignProspectsRequestCallback(response),
    }
  );

  const handleAddOtherTouchRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      refetchTouchesData()
      notify("Other Touch Created Successfully", "success");
      history.push("/cadences/" + cadenceID + "/touches/view")
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
    setShowOtherTouchModal(false);
  };
  const handleAddLinkedInTouchRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      refetchTouchesData()
      notify("LinkedIn Touch Created Successfully", "success");
      history.push("/cadences/" + cadenceID + "/touches/view")
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
    setShowLinkedInTouchModal(false);
  };
  const handleAddTextTouchRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      refetchTouchesData()
      notify("Text Touch Created Successfully", "success");
      history.push("/cadences/" + cadenceID + "/touches/view")
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
    setShowLinkedInTouchModal(false);
  };

  const handleAddEmailTouchCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      refetchTouchesData()
      notify("Email Touch Created Successfully", "success");
      history.push("/cadences/" + cadenceID + "/touches/view")  
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
    setShowEmailTouchModal(false);
  };
  const handleAddCallTouchCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      refetchTouchesData()
      notify("Call Touch Created Successfully", "success");
      history.push("/cadences/" + cadenceID + "/touches/view")
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
    setShowCallTouchModal(false);
  };

  const handleAssignProspectsRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      setShowAssignProspectsModal(false);
      notify("Prospects assigned Successfully", "success");
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  };

  const SectionComponent = components[selectedSection];

  const handleCadenceSearch = () => {
    const { query } = parseUrl(window.location.search);
    query["filter[contactName]"] = searchInputRef.current.value.trim();

    let filterQry = Object.entries({ ...query, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter")).map(([key, val]) => `${key}=${val}`).join("&")
    setProspectsFilter(filterQry === "" ? "" : "&" + filterQry);
  };

  const handleBackCadenceList = () => {

    window.history.replaceState({}, "", '/cadences');

    const { query } = parseUrl(window.location.search);
    query["filter[status]"] = status;
    query["page[limit]"] = limit;
    query["page[offset]"] = offset;
    query["filter[sharedType]"]=encodeURIComponent(sharedType);
    
    let searchString = Object.entries(query)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    
    window.history.pushState({}, "", "?" + searchString);
    window.location=window.location.href
  
  }

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          <i className=" svgicon trucadence-icon mr-2"></i>
          {cadenceName + " / " + Capitalize(sectionParams)}
        </div>
        {

          (selectedSection === 'prospects' || selectedSection === 'emails' || selectedSection === 'calls') &&
          <div className="ml-auto">
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
                  onClick={() => {
                    searchInputRef.current.focus();
                    searchInputRef.current.value = "";

                    setCadenceFilter("");
                  }}
                >
                  <i className="fa fa-times"></i>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        }
          <div className={(selectedSection === 'touches' || selectedSection === 'overview') && "ml-auto"}>
            <Link
              className="btn btn-secondary mr-2"
              to={{
                pathname:"/cadences" + "/" + cadenceID,
                state:{
                  currentURL:currentURL,
                  editFlag:true
                }
              }}
              title="Edit cadences"
            >
              <i className="fa-2  fas fa-pencil-alt text-primary mr-2"></i>
              Edit
            </Link>
            <ClButton icon="fa fas fa-user-plus text-primary" className=" mr-2" color="secondary " title="Assign Prospects to cadence" onClick={() => setShowAssignProspectsModal(true)}>
              Assign Prospects
            </ClButton>

            <ClButton icon="fas fa-chevron-left text-primary"  color="secondary " title="Back to cadence list" onClick={handleBackCadenceList}>
              Back
            </ClButton>
          </div>
      </div>
      
        <Card className="card card-default">
          <CardHeader>
            <Row>
              <Col lg={6} md={12}>
                <ButtonGroup>
                    {sections.map((section) => {
                      return (
                        <>
                          <Link
                            key={section.key}
                            className={
                              "btn btn-secondary" +
                              (section.key === sectionParams ? " active" : "")
                            }
                            to={
                              {
                                pathname: "/cadences" + "/" + cadenceID + "/" + section.key + "/view",
                                search: window.location.search,
                                state: {
                                  allCadencesData: allCadencesData,
                                  cadence: cadence,
                                  cadenceName: location.state?location.state.cadenceName:'',
                                  cadenceID:cadenceID
                                }
                              }
                            }
                          >
                            {section.name}
                          </Link>
                        </>
                      );
                    })}
                </ButtonGroup>
              </Col>

              <Col lg={6} md={12}>
                  {
                  selectedSection === 'touches' &&
                  <div className="d-flex justify-content-end">
                
                      <Button
                        className="border rounded-0 px-4  bg-primary mr-2"
                        title="Add email touch"
                        onClick={() => setShowEmailTouchModal(true)}
                      >
                        <i className="fa-2 fas fa-envelope"></i>
                      </Button>
                  
                      <Button
                        className="border rounded-0 px-4  bg-success mr-2"
                        title="Add call touch"
                        onClick={() => {
                          setShowCallTouchModal(true);
                        }}
                      >
                        <i className="fas fa-phone-alt"></i>
                      </Button>
                    
                      <Button
                        className="rounded-0 px-4 border  bg-warning mr-2"
                        title="Add other touch"
                        onClick={() => setShowOtherTouchModal(true)}
                      >
                        <i className="fa fa-share-alt"></i>
                      </Button>
                    
                      <Button
                        className="rounded-0 px-4 border  bg-info mr-2"
                        title="Add linkedin touch"
                        onClick={() => setShowLinkedInTouchModal(true)}
                      >
                        <i className="fab fa-linkedin-in"></i>
                      </Button>
                  
                      <Button
                        className="rounded-0 px-4 border bg-danger"
                        title="Add text touch"
                        onClick={() => setShowTextTouchModal(true)}
                      >
                        <i className="far fa-comments"></i>
                      </Button>
                </div>
                }
                {
                selectedSection === 'prospects' &&
                <div className="float-right">
                  <CadenceReportGrid filterButtons={prospectsFilterButtons} cadenceID={cadenceID} />
                </div>
              }
                {
                selectedSection === 'emails' &&
                <div className="float-right">
                  <CadenceReportGrid filterButtons={emailsFilterButtons} cadenceID={cadenceID} />
                </div>
              }
                {
                selectedSection === 'calls' &&
                <div className="float-right">
                  <CadenceReportGrid filterButtons={callsFilterButtons} cadenceID={cadenceID} />
                </div>
              }
            </Col>
          </Row>
        </CardHeader>

          <ProtectedRoute
            path="/cadences/:id/:section/:view"
            component={SectionComponent}
          />
      </Card>
    
      <EmailTouchModal
          showModal={ShowEmailTouchModal}
          currentUserId={currentUserId}
          currentCadence={cadence}
          Loading={addEmailTouchLoading}
          handleAction={(data,ids,WFoutput) => {
            const {
              timeToWaitAndExecute,
              timeToWaitUnit,
              emailTouchType,
              timeToComplete,
              timeToCompleteUnit,
              previewEmailFlag,
              scheduleType,
              scheduledDate,
              scheduleTime,
              touchExecutionScheduleId,
              scheduledTimezone,
              stepNo,
            } = data;
            let sHour,modifiedScheduledTime;
            if (scheduleTime){
                let sTime=scheduleTime.split(':');
                
                if(parseInt(sTime[0])>12){
                  sHour=(parseInt(sTime[0])-12)>9?(parseInt(sTime[0])-12).toString():"0"+(parseInt(sTime[0])-12).toString()
                  modifiedScheduledTime=sHour+":"+sTime[1]+" PM";
                }
                else
                modifiedScheduledTime=scheduleTime+" AM"
              }
            addEmailTouch({
              variables: {
                timeToWaitAndExecute: timeToWaitAndExecute,
                timeToWaitUnit: timeToWaitUnit,
                emailTemplateId:ids,
                emailTouchType:emailTouchType,
                previewEmailFlag:previewEmailFlag,
                touchType: "Email",
                cadenceId: cadenceID,
                scheduleType:scheduleType,
                touchExecutionScheduleId:touchExecutionScheduleId,
                scheduledDateTime:scheduledDate +" " + modifiedScheduledTime,
                timeToComplete: timeToComplete,
                timeToCompleteUnit: timeToCompleteUnit,
                scheduledTimezone,
                workflow: WFoutput
              },
            });
          }}
          hideModal={() => {
            setShowEmailTouchModal(false);    
          }}
      />
      <CallTouchModal
        showModal={ShowCallTouchModal}
        currentUserId={currentUserId}
        currentCadence={cadence}
        Loading={addCallTouchLoading}
        handleAction={(data, dialerValues,WFoutput) => {
          const {
            timeToWaitAndExecute,
            timeToWaitUnit,
            timeToComplete,
            timeToCompleteUnit,
            stepNo,
          } = data;
          addCallTouch({
            variables: {
              productType: dialerValues.toString(),
              timeToWaitAndExecute: timeToWaitAndExecute,
              timeToWaitUnit: timeToWaitUnit,
              touchType: "CALL",
              cadenceId: cadenceID,
              timeToComplete: timeToComplete,
              timeToCompleteUnit: timeToCompleteUnit,
              workflow: WFoutput
            },
          });
        }}
        handleFilter={(filterQry) => {
          setDispositionFilter(filterQry);
        }}
        hideModal={() => {
          setShowCallTouchModal(false);
        }}
      />
      <OtherTouchModal
        showModal={ShowOtherTouchModal}
        currentUserId={currentUserId}
        currentCadence={cadence}
        Loading={addOtherTouchLoading}
        handleAction={(data) => {
          const {
            timeToWaitAndExecute,
            timeToWaitUnit,
            timeToComplete,
            timeToCompleteUnit,
            socialMediaType,
            description,
          } = data;
          addOtherTouch({
            variables: {
              timeToWaitAndExecute: timeToWaitAndExecute,
              timeToWaitUnit: timeToWaitUnit,
              touchType: "others",
              cadenceId: cadenceID,
              timeToComplete: timeToComplete,
              timeToCompleteUnit: timeToCompleteUnit,
              socialMediaType: socialMediaType,
              description: description,
            },
          });
        }}
        hideModal={() => {
          setShowOtherTouchModal(false);
        }}
      />
      <LinkedInTouchModel
        showModal={ShowLinkedInTouchModal}
        currentUserId={currentUserId}
        currentCadence={cadence}
        Loading={addLinkedInTouchLoading}
        handleAction={(data) => {
          const {
            timeToWaitAndExecute,
            timeToWaitUnit,
            timeToComplete,
            timeToCompleteUnit,
            description,
            linkedInType,
          } = data;
          addLinkedInTouch({
            variables: {
              timeToWaitAndExecute: timeToWaitAndExecute,
              timeToWaitUnit: timeToWaitUnit,
              touchType: "linkedin",
              cadenceId: cadenceID,
              timeToComplete: timeToComplete,
              timeToCompleteUnit: timeToCompleteUnit,
              description: description,
              linkedInType: linkedInType,
            },
          });
        }}
        hideModal={() => {
          setShowLinkedInTouchModal(false);
        }}
      />

      <TextTouchModel
        showModal={ShowTextTouchModal}
        currentUserId={currentUserId}
        currentCadence={cadence}
        Loading={addTextTouchLoading}
        handleAction={(data) => {
          const {
            timeToWaitAndExecute,
            timeToWaitUnit,
            timeToComplete,
            timeToCompleteUnit,
            stepNo,
          } = data;
          addTextTouch({
            variables: {
              timeToWaitAndExecute: timeToWaitAndExecute,
              timeToWaitUnit: timeToWaitUnit,
              touchType: "TEXT",
              cadenceId: cadenceID,
              timeToComplete: timeToComplete,
              timeToCompleteUnit: timeToCompleteUnit,
            },
          });
        }}
        hideModal={() => {
          setShowTextTouchModal(false);
        }}
      />

      <AssignProspectsModal
        showModal={ShowAssignProspectsModal}
        currentUserId={currentUserId}
        currentCadence={cadence}
        cadenceName={cadenceName}
        handleAction={(data) => {
          const {
            select_user,
            select_prospects,
            cadence
          } = data;
          assignProspects({
            variables: {
              select_user:select_user,
              select_prospects:select_prospects,
              cadence:cadence
            },
          });
        }}
        hideModal={() => {
          setShowAssignProspectsModal(false);
        }}
      />
    </ContentWrapper>
  );
};
export default withRouter(CadenceView);
