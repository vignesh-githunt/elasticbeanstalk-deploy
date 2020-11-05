import React, { useContext, useState ,useMemo,useEffect} from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Progress,
  Row,
} from "reactstrap";
import { parseUrl } from "query-string";
import { withRouter, useHistory } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import CREATE_TOUCH, {CREATE_OTHER_TOUCH,EDIT_OTHER_TOUCH,FETCH_TOUCHES_QUERY,FETCH_TOUCH_QUERY,DELETE_TOUCH_QUERY} from "../../queries/TouchQuery";
import UserContext from "../../UserContext";
import EmailTouchModal from "./EmailTouchModal";
import CallTouchModal from "./CallTouchModal";
import LinkedInTouchModel from "./LinkedInTouchModal"
import OtherTouchModal from "./OtherTouchModal"
import TextTouchModel from "./TextTouchModal";
import ConfirmModal from "../../Common/ConfirmModal";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
toast.configure()


const TouchInfo = ({match,location}) => {
  const { query: searchParams } = parseUrl(window.location.search);
  const cadenceID = match.params["id"];
  var { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;
  const { allCadencesData, cadence } = location.state ? location.state : {};
  const [accordionState, setMyState] = useState();
  const [TouchOpen, setTouchOpen] = useState(false);
  const [EditID,setEditID]=useState(0)
  const [deleteTouch, setDeleteTouch] = useState(0);
  const [touchState, setTouchState] = useState([])
  const [workflowState, setWorkflowState] = useState([])
  const [touchSelect, setTouchSelect] = useState("white")
  const [touchFilter, settouchFilter] = useState(`filter[user][id]=${currentUserId}&filter[cadence][id]=${cadenceID}`)

  
  const handleTouchSelection = (id) => {
    touchSelect===id?setTouchSelect(-id):setTouchSelect(id);
  };
  
  const [dispositionFilter, setDispositionFilter] = useState(
    `&filter[productType]=CD`
  );

  const [ShowEmailTouchModal, setShowEmailTouchModal] = useState(false);
  const [ShowCallTouchModal, setShowCallTouchModal] = useState(false);
  const [ShowLinkedInTouchModal, setShowLinkedInTouchModal] = useState(false);
  const [ShowOtherTouchModal, setShowOtherTouchModal] = useState(false);
  const [ShowTextTouchModal, setShowTextTouchModal] = useState(false);
  const [showDeleteTouchConfirmModal, setShowDeleteTouchConfirmModal] = useState(false);

  const { data: TouchesData, loading: TouchesLoading, error: TouchesError,refetch: refetchTouchesData } = useQuery(FETCH_TOUCHES_QUERY, {
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
  const TouchIncludeAssociations=useMemo(
    () =>
    TouchesData && TouchesData.Touches ? TouchesData.Touches.includedAssociations.emailtemplate : [],
    [TouchesData]
  );
  const Total_touches=TouchData.length

const getTemplateDetails = (touchID)=>{
  let templateName;
  for (let i=0;i<TouchIncludeAssociations.length;i++){
    
    for(let j=0;j<(TouchIncludeAssociations[i]["associations"]["touch"]).length;j++){
      if(touchID === TouchIncludeAssociations[i]["associations"]["touch"][j]["id"] ){
        templateName=TouchIncludeAssociations[i].emailTemplateName
      }
    }
  }
  return templateName;

}

const getSubjectDetails = (touchID)=>{
  let subject;
  for (let i=0;i<TouchIncludeAssociations.length;i++){
    
    for(let j=0;j<(TouchIncludeAssociations[i]["associations"]["touch"]).length;j++){
      if(touchID === TouchIncludeAssociations[i]["associations"]["touch"][j]["id"] ){
        subject=TouchIncludeAssociations[i].subject
         }
    }
    
  }
  return subject;

}

  const [getTouch, {data:singleTouchData, loading: getTouchLoading }] = useLazyQuery(
    FETCH_TOUCH_QUERY,
    {
      onCompleted: (response) => handleEditTouch(response, true),
      onError: (response) => handleEditTouch(response),
    }
  );
  
  const [deleteTouches, { loading: DeleteTouchLoading }] = useLazyQuery(
    DELETE_TOUCH_QUERY,
    {
      onCompleted: (response) => handleDeleteTouch(response, true),
      onError: (response) => handleDeleteTouch(response),
    }
  );
  
  const [editEmailTouch, { loading: editEmailTouchLoading }] = useLazyQuery(
    CREATE_TOUCH,
    {
      onCompleted: (response) => handleEditEmailTouchCallback(response, true),
      onError: (response) => handleEditEmailTouchCallback(response),
    }
  );
  const [editCallTouch, { loading: editCallTouchLoading }] = useLazyQuery(
    EDIT_OTHER_TOUCH,
    {
      onCompleted: (response) => handleEditCallTouchCallback(response, true),
      onError: (response) => handleEditCallTouchCallback(response),
    }
  );

  const [editOtherTouch, { loading: editOtherTouchLoading }] = useLazyQuery(
    EDIT_OTHER_TOUCH,
    {
      onCompleted: (response) =>
        handleEditOtherTouchRequestCallback(response, true),
      onError: (response) => handleEditOtherTouchRequestCallback(response),
    }
  );
  const [editLinkedInTouch, { loading: editLinkedInTouchLoading }] = useLazyQuery(
    EDIT_OTHER_TOUCH,
    {
      onCompleted: (response) =>
        handleEditLinkedInTouchRequestCallback(response, true),
      onError: (response) => handleEditLinkedInTouchRequestCallback(response),
    }
  );

  const [editTextTouch, { loading: editTextTouchLoading }] = useLazyQuery(
    EDIT_OTHER_TOUCH,
    {
      onCompleted: (response) =>
        handleEditTextTouchRequestCallback(response, true),
      onError: (response) => handleEditTextTouchRequestCallback(response),
    }
  );

  const notify = (message, ToasterType) => {
    toast(message, {
      type: ToasterType,
      position: "top-right",
    });
  };

  const handleEditTouch=(response)=>{

    //setTouchState(response.data)

  }

  const handleEditOtherTouchRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      setShowOtherTouchModal(false);
      refetchTouchesData()
      notify("Other Touch Saved Successfully", "success");
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  };
  const handleEditLinkedInTouchRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      setShowLinkedInTouchModal(false);
      refetchTouchesData()
      notify("LinkedIn Touch Saved Successfully", "success");
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  };
  const handleEditTextTouchRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      setShowTextTouchModal(false);
      refetchTouchesData()
      notify("Text Touch Saved Successfully", "success");
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  };

  const handleEditEmailTouchCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      setShowEmailTouchModal(false);
      refetchTouchesData()
      notify("Email Touch Saved Successfully", "success");
    } else {
      notify("error");
    }
  };
  const handleEditCallTouchCallback = (response, requestSuccess) => {
    if (requestSuccess) {
      setShowCallTouchModal(false);
      refetchTouchesData()
      notify("Call Touch Saved Successfully", "success");
    } else {
      notify(response.graphQLErrors[0].message, "error");
    }
  };

  const handleDeleteTouch= (response, requestSuccess) => {

    if (requestSuccess) {
      notify("Touch Deleted Successfully", "success");
      refetchTouchesData();
    } else {
      notify(response.graphQLErrors[0].message, "error");
     }
    setShowDeleteTouchConfirmModal(false);
  }
 
  const getTouchIcons = (touch) => {

    let className;
    if (touch === "EMAIL"){
      className =  "fas fa-envelope text-primary text-white mr-2";
    }
    else if (touch === "OTHERS"){
      className = "fas fa-share-alt text-warning text-white mr-2";
    }
      else if (touch === "CALL"){
      className = "fas fa-phone-alt text-warning text-white mr-2";
    }
    else if (touch === "LINKEDIN"){
      className = "fab fa-linkedin-in text-info text-white mr-2";
    }
    else if (touch === "TEXT"){
      className = "far fa-comments text-success text-white mr-2";
    }
    else
      className = ``;

    return className
  }

  const getButtonClass = (touch) => {

    let Button_ClassName;
    if (touch === "EMAIL"){
      Button_ClassName="rounded-0 px-4 border  bg-primary btn-block";
    }
    else if (touch === "OTHERS"){
      Button_ClassName="border rounded-0 px-4  bg-warning btn-block";
    }
      else if (touch === "CALL"){
      Button_ClassName="border rounded-0 px-4  bg-success btn-block";
    }
    else if (touch === "LINKEDIN"){
      Button_ClassName="border rounded-0 px-4  bg-info btn-block";
    }
    else if (touch === "TEXT"){
      Button_ClassName="border rounded-0 px-4  bg-danger btn-block";
    }
    else
    Button_ClassName = ``;

    return Button_ClassName
  }

  const getTouchData=useMemo(
    () =>
    !getTouchLoading && singleTouchData && singleTouchData.touch ? setTouchState(singleTouchData.touch.data) : [{}],
    [singleTouchData]
  );
  
  
  
  
  const getWorkflowData=useMemo(
    () =>
    !getTouchLoading && singleTouchData && singleTouchData.touch ? setWorkflowState(singleTouchData.touch.workflow) : [],
    [singleTouchData]
  );

  const handleEditTouches = (touchType)=>{
    

    if(touchType==="EMAIL")
    setShowEmailTouchModal(true)

    else if (touchType==="CALL")
    setShowCallTouchModal(true)

    else if (touchType==="OTHERS")
    {
    setShowOtherTouchModal(true)
    
    }
    else if (touchType==="LINKEDIN")
    setShowLinkedInTouchModal(true)

    else if (touchType==="TEXT")
    setShowTextTouchModal(true)

    }
   
  return (
    <>
      <Card className="mb-0">
        {
          TouchesLoading &&
            (
            <CardBody>
              <Progress striped value="75" />
            </CardBody>
            )
        }
        {
          (!TouchesLoading && !TouchesError &&TouchData.length===0) && 
            (
              <CardBody>
                    <Alert color="warning" className="text-center mb-0">
                      <i className="fas fa-exclamation-circle fa-lg mr-2"></i>{" "}
                      No Touches Available, Add more touches here.
                    </Alert>
              </CardBody>
             )
        }
        {
        TouchesError&&
            (
              <CardBody>
                <Alert color="danger" className="text-center mb-0">
                  <i className="fas fa-exclamation-circle fa-lg"></i>{" "}
                  Failed to fetch data
                </Alert>
              </CardBody>
            )

        }
        {
          !TouchesLoading && !TouchesError &&
          TouchData.map((touch)=>{
            return(
              <CardBody className="bt" draggable style={{backgroundColor: touchSelect===touch.stepNo?"lavender":"white"}} onClick={()=>{handleTouchSelection(touch.stepNo)}} >
                <Row>
                  <Col className="border-right pt-3 text-center w-50" sm={1}>
                    <h3 className="text-muted" title="Step No">{touch.stepNo}</h3>
                  </Col>
                  <Col sm="3">
                    <Row>
                      <Col className="pt-3 text-bold" sm="4">
                        <span>Day {touch.day}</span>
                      </Col>
                      <Col sm="3" className="text-center ">
                        {touch.totalMembers}<br></br>
                        <i className="fas fa-user-friends text-muted"></i>
                      </Col>
                      <Col className="text-center pt-3" sm="5">
                        <span>{touch.waitPeriodBeforeStart}{touch.waitPeriodUnit} ~ {touch.timeToComplete}{touch.timeToCompleteUnit}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="text-center pt-3 text-nowrap" sm={2}>
                    <Button className={getButtonClass(touch.touchType)}>
                      <i className={getTouchIcons(touch.touchType)}></i>{" "}
                      <span className="text-bold">{touch.touchType}</span>
                    </Button>
                  </Col>
                  <Col className="pt-3 text-bold" sm={3}>
                    <a href="#" >{touch.touchType==="EMAIL"?getTemplateDetails(touch.id):"-"} </a>- <span>{touch.touchType==="EMAIL"?getSubjectDetails(touch.id):"-"}</span>
                  </Col>
                  <Col className="text-center pt-3" sm={1}>
                    <span>
                      <i className="fa-2  fas fa-pencil-alt text-muted pointer" onClick={()=>{getTouch({ variables: { touchID:touch.id } });handleEditTouches(touch.touchType);setEditID(touch.id)} }title="Edit touch"></i>
                    </span>
                  </Col>
                  <Col className="text-center pt-3" sm={1}>
                    <span>
                      <i className="fas fa-trash text-muted pointer" title="delete touch" onClick={()=>{setShowDeleteTouchConfirmModal(true);setDeleteTouch(touch.id);}}></i>
                    </span>
                  </Col>
                </Row>
             </CardBody>
            );
          })
        }
         <ConfirmModal
            confirmBtnIcon="fas fa-trash"
            confirmBtnText="Delete"
            handleCancel={() => setShowDeleteTouchConfirmModal(false)}
            handleConfirm={() => deleteTouches({ variables: { touchID: deleteTouch } })}
            showConfirmBtnSpinner={DeleteTouchLoading}
            showConfirmModal={showDeleteTouchConfirmModal}
          >
            <span>Are you sure you want to delete touch <b>{deleteTouch}</b></span>
          </ConfirmModal>

          <EmailTouchModal
            showModal={ShowEmailTouchModal}
            currentUserId={currentUserId}
            currentCadence={cadence}
            Loading={editEmailTouchLoading}
            editFlag={true}
            editData={touchState}
            editOutcome={workflowState}
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
              editEmailTouch({
                variables: {
                  touchID:EditID,
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
          editFlag={true}
          editData={touchState}
          editOutcome={workflowState}
          handleAction={(data, dialerValues,WFoutput) => {
            const {
              timeToWaitAndExecute,
              timeToWaitUnit,
              timeToComplete,
              timeToCompleteUnit,
            } = data;
            editCallTouch({
              variables: {
                touchID:EditID,
                productType: dialerValues.toString(),
                timeToWaitAndExecute: timeToWaitAndExecute,
                timeToWaitUnit: timeToWaitUnit,
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
          editFlag={true}
          editData={touchState}
          handleAction={(data) => {
            const {
              timeToWaitAndExecute,
              timeToWaitUnit,
              timeToComplete,
              timeToCompleteUnit,
              socialMediaType,
              description,
            } = data;
            editOtherTouch({
              variables: {
                touchID:EditID,
                timeToWaitAndExecute: timeToWaitAndExecute,
                timeToWaitUnit: timeToWaitUnit,
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
          editFlag={true}
          editData={touchState}
          handleAction={(data) => {
            const {
              timeToWaitAndExecute,
              timeToWaitUnit,
              timeToComplete,
              timeToCompleteUnit,
              description,
              linkedInType,
            } = data;
            editLinkedInTouch({
              variables: {
                touchID:EditID,
                timeToWaitAndExecute: timeToWaitAndExecute,
                timeToWaitUnit: timeToWaitUnit,
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
          editFlag={true}
          editData={touchState}
          editOutcome={workflowState}
          handleAction={(data,WFoutput) => {
            const {
              timeToWaitAndExecute,
              timeToWaitUnit,
              timeToComplete,
              timeToCompleteUnit,
            } = data;
            editTextTouch({
              variables: {
                touchID:EditID,
                timeToWaitAndExecute: timeToWaitAndExecute,
                timeToWaitUnit: timeToWaitUnit,
                timeToComplete: timeToComplete,
                timeToCompleteUnit: timeToCompleteUnit,
                workflow: WFoutput
              },
            });
          }}
          hideModal={() => {
            setShowTextTouchModal(false);
          }}
        />
    </Card>
  </>
  );
};

export default withRouter(TouchInfo);
