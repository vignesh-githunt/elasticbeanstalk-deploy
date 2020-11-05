import React, {useContext, useMemo, useState} from "react";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  CustomInput,
  Row,
} from "reactstrap";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import CREATE_TOUCH, {FETCH_TOUCHES_QUERY,FETCH_TOUCH_QUERY} from "../../queries/TouchQuery";
import UserContext from "../../UserContext";

const CadenceOverView = ({match}) => {
  const [accordionState, setMyState] = useState();
  const [isOpenActivity, setIsOpenActivity] = useState(false);
  const [isOpenScore, setIsOpenScore] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(true);
  const cadenceID = match.params["id"];
  var { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const [touchFilter, settouchFilter] = useState(`filter[user][id]=${currentUserId}&filter[cadence][id]=${cadenceID}`)

  const toggleAccordion = (id) => {
    accordionState===id?setMyState(-id):setMyState(id);
  };
  const toggleActivity = () => setIsOpenActivity(!isOpenActivity);
  const toggleScore = () => setIsOpenScore(!isOpenScore);
  const toggleDetail = () => setIsOpenDetail(!isOpenDetail);

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
  
  const getTouchIcons = (touch) => {

    let className;
    if (touch === "EMAIL"){
      className =  "fas fa-envelope fa-stack-1x fa-inverse text-white";
    }
    else if (touch === "OTHERS"){
      className = "fas fa-share-alt fa-stack-1x fa-inverse text-white";
    }
      else if (touch === "CALL"){
      className = "fas fa-phone-alt fa-stack-1x fa-inverse text-white";
    }
    else if (touch === "LINKEDIN"){
      className = "fab fa-linkedin-in fa-stack-1x fa-inverse text-white";
    }
    else if (touch === "TEXT"){
      className = "far fa-comments fa-stack-1x fa-inverse text-white";
    }
    else
      className = ``;

    return className
  }

  const getButtonClass = (touch) => {

    let Button_ClassName;
    if (touch === "EMAIL"){
      Button_ClassName="fa fa-circle fa-stack-2x  text-primary";
    }
    else if (touch === "OTHERS"){
      Button_ClassName="fa fa-circle fa-stack-2x  text-warning";
    }
      else if (touch === "CALL"){
      Button_ClassName="fa fa-circle fa-stack-2x  text-success";
    }
    else if (touch === "LINKEDIN"){
      Button_ClassName="fa fa-circle fa-stack-2x  text-info";
    }
    else if (touch === "TEXT"){
      Button_ClassName="fa fa-circle fa-stack-2x  text-danger";
    }
    else
    Button_ClassName = ``;

    return Button_ClassName
  }


  return (
    <div>
      <Card className="mb-2">
        <CardBody>
          <Card className="b">
            <CardBody>
                <i className={isOpenActivity?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenActivity?"Collapse":"Expand"} onClick={toggleActivity}></i>
                <i className="fas fa-chart-line mr-2"></i>
                <strong>Activity view</strong>
            </CardBody>
            <Collapse isOpen={isOpenActivity}>
                <Card>
                  <CardBody className="d-flex pt-4 pb-0">
                    <h4>Activity Score content</h4>
                  </CardBody>
                </Card>
            </Collapse>
          </Card>
        <Card className="b">
            <CardBody >
              <i className={isOpenScore?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenScore?"Collapse":"Expand"} onClick={toggleScore}></i>
              <i className="fas fa-chart-pie mr-2"></i>
              <strong>Cadence scores</strong>
            </CardBody>
            <Collapse isOpen={isOpenScore}>
                <Card>
                  <CardBody className="d-flex pt-4 pb-0">
                    <h4>Cadence Scores content</h4>
                  </CardBody>
                </Card>
            </Collapse>
        </Card>
        <Card className="b">
            <CardBody >
              <i className={isOpenDetail?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenDetail?"Collapse":"Expand"} onClick={toggleDetail}></i>
              <i className="far fa-list-alt mr-2"></i>
              <strong>Detailed view</strong>
            </CardBody>
            <Collapse isOpen={isOpenDetail}>
                
                {
                  (!TouchesLoading && !TouchesError &&TouchData.length===0) && 
                    (
                      <CardBody>
                            <Alert color="danger" className="text-center mb-0">
                              <i className="fas fa-exclamation-circle fa-lg"></i>{" "}
                              No Touches Available
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
              <Card className="mb-3 border-botton-0 b">
                  <CardBody >
                    <Row>
                      <Col sm="1" className="border-right pt-3 text-center">
                         <h3 className="text-muted">{touch.stepNo}</h3>
                      </Col>
                      <Col  className="border-right ">
                        <Row>
                          <Col sm="6" className="pt-1 text-bold">
                            <span>Day {touch.day}</span>
                          </Col>
                          <Col sm="3" className="text-bold">
                            <span class="fa-stack mr-2">
                              <i className={getButtonClass(touch.touchType)}></i>
                              <i className={getTouchIcons(touch.touchType)} ></i>
                            </span>
                            <span className="text-bold">{touch.touchType}</span>
                          </Col>
                        </Row>
                        <Row className="pt-1 text-bold">
                          <Col>
                            <a href="#">{touch.touchType==="EMAIL"?getTemplateDetails(touch.id):"-"}</a>
                          </Col>
                        </Row>
                      </Col>
                      <Col className="border-right text-center" sm="1">
                        {touch.total}
                        <br></br>
                        <i className="far fa-circle text-muted mr-2" title="Total"></i>
                      </Col>
                      <Col className="border-right text-center" sm="1">
                        {touch.active}
                        <br></br>
                        <span>
                          <i className="fas fa-circle text-success mr-2" title="Active"></i>
                        </span>
                      </Col>
                      <Col className="border-right text-center" sm="1">
                        {touch.paused}
                        <br></br>
                        <i className="fas fa-pause text-muted mr-2" title="Paused"></i>
                      </Col>
                      <Col className="border-right text-center" sm="1">
                        {touch.completed}
                        <br></br>
                        <i className="fas fa-check text-muted mr-2"></i>
                      </Col>
                      <Col className="border-right text-center" sm="1">
                        {touch.fallThrough}
                        <br></br>
                        <i className="fas fa-sign-out-alt text-muted" title="Fall Through"></i>
                      </Col>
                      <Col className="border-right text-center" sm="1">
                        {touch.due}
                        <br></br>
                        <i className="fas fa-stop text-muted" title="Due"></i>
                      </Col>
                      <Col className="text-center pt-3" sm="1">
                        <i className={accordionState ===touch.id?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"}  onClick={() => toggleAccordion(touch.id)}></i>
                      </Col>
                    </Row>
                  </CardBody>
                  <Collapse isOpen={accordionState == touch.id}>
                    <CardBody className="border-top">
                      <CardHeader className="border-bottom-0">
                        <Row>
                          <Col sm="1" className="text-center">
                            <CustomInput
                              type="switch"
                              id="exampleCustomSwitch"
                              name="customSwitch"
                            >
                            </CustomInput>
                          </Col>
                          <Col sm="8">
                            <Row>
                              <Col className="pt-1 text-bold" sm="2">
                              <a href="#" >{touch.touchType==="EMAIL"?getTemplateDetails(touch.id):"-"} </a>- <span>{touch.touchType==="EMAIL"?getSubjectDetails(touch.id):"-"}</span>
                              </Col>
                            </Row>
                          </Col>

                          <Col className="text-center text-bold">
                            5<br></br>
                            <i className="fa-2 icon-action-redo text-muted mr-2"></i>
                          </Col>
                          <Col className=" text-center text-bold">
                            8<br></br>
                            <i className="far fa-envelope-open text-muted mr-2"></i>
                          </Col>
                          <Col className=" text-center text-bold">
                            13
                            <br></br>
                            <span>
                              <i className="fas fa-reply-all text-muted mr-2"></i>
                            </span>
                          </Col>
                          <Col className="text-center pt-3 text-bold">
                            <i className="fas fa-ellipsis-v text-muted mr-2"></i>
                          </Col>
                        </Row>
                      </CardHeader>
                    </CardBody>
                  </Collapse>
                </Card>
                );
              })
            }
          </Collapse>
        </Card>
      </CardBody>
     </Card>
      </div>
  );
}
export default CadenceOverView;

