import React, { useState,useContext,useMemo } from "react";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  ListGroup, 
  ListGroupItem
} from "reactstrap";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import CloseButton from "../../Common/CloseButton";
import UserContext from "../../UserContext";
import ClButton from "../../Common/Button";
import CloneCadenceModel from "./CloneCadenceModel"
import{CLONE_SAMPLE_CADENCE_QUERY} from "../../queries/CadenceQuery";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
toast.configure()

const SampleCadencesModel = ({
  showModal,
  hideModal,
  handleAction,
  Loading,
  sampleCadences,
  handleClose
}) => {
    
  const sample_cadences_list=["Awareness Maker", "Call Blaster", "Focused", "Make It Happen", "Opportunity Maker", "Persistence", "Prospect Maker", "Target Maker"]

  var { user, loading: userLoading } = useContext(UserContext);
  const currentUserId = userLoading ? 0 : user.id;
  const userFilter = '&filter[user][id]=' + currentUserId;
  const [sampleCadence, setsampleCadence] = useState("Awareness Maker");
  const [showCloneCadenceConfirmModal, setShowCloneCadenceConfirmModal] = useState(false);

  const notify = (message, ToasterType) => {
    toast(message, {
      type: ToasterType,
      position: "top-right",
    });
  };

  const [cloneCadence, { loading: cloneCadenceLoading }] = useLazyQuery(CLONE_SAMPLE_CADENCE_QUERY, {
    onCompleted: (response) => handleCloneCadenceRequestCallback(response, true),
    onError: (response) => handleCloneCadenceRequestCallback(response),
  });

  const handleCloneCadenceRequestCallback = (response, requestSuccess) => {
    if (requestSuccess) {
     notify("Cadence cloned Successfully From Sample Cadences", "success");
     
     } else {
      notify(response.graphQLErrors[0].message,"error")
    }
    setShowCloneCadenceConfirmModal(false);
    handleClose(false)
    
  }
  
  const handleSubmit = (sampleCadence) => {
    handleAction(sampleCadence);
    
  };

  const handleModalClose = () => {
    //setForm();
  };
  
const sampleData=useMemo(
    () =>
    sampleCadences && sampleCadences.cadences ? sampleCadences.cadences.data : [],
    [sampleCadences]
  );
  var emailCount=0
  var callCount=0
  var Days=0
  const cadenceData=[]
    for (let i=0;i<sampleData.length;i++){
        if(sampleData[i]["name"]===sampleCadence){
            cadenceData.push(sampleData[i])
            if(sampleData[i]["touchType"]==="EMAIL"){
                emailCount=emailCount+1
            }
            else if(sampleData[i]["touchType"]==="CALL"){
                callCount=callCount+1
            }
            Days=sampleData[i]["daySequenceWaitperiod"]
        }
       
    }
    
  const getTouchIcons = (touch, extraClass, removeColor) => {

    let className;
    if (touch === "EMAIL")
      className = removeColor ? `fas fa-envelope ${extraClass}` : `fas fa-envelope ${extraClass} text-primary`;
    else if (touch === "OTHER")
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

  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered >
          <ModalHeader><i className="fas fa-list  mr-2"></i>Sample cadences</ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={5}>
                <FormGroup>
                <Input type="text" placeholder="filter"></Input>
                </FormGroup>
                  
                <ListGroup >
                    {
                    sample_cadences_list.map((sample_cadence,index)=>{
                        return(
                            <ListGroupItem 
                                key={index}
                                onClick={()=>{setsampleCadence(sample_cadence)}}
                                active={sampleCadence===sample_cadence}
                            
                            >  {sample_cadence}
                            </ListGroupItem>
                        )
                    })
                    }
                  </ListGroup>
                </Col>
                <Col md={5}>
                  <ListGroup>
                  <h4>{sampleCadence}</h4><br/>
                  <h6><span className="mr-2"><strong>{cadenceData.length}</strong> Touches</span><span className="mr-2"><strong>{Days}</strong> Days</span><span className="mr-2"><strong>{emailCount}</strong> Emails</span><span className="mr-2"><strong>{callCount}</strong> Calls</span></h6>
                  {
                    cadenceData.map((cad,index)=>{
                        return(
                           
                              <ListGroupItem 
                                  tag="button"
                                  key={index}

                              >
                                <span className="mr-2">{getTouchIcons(cad.touchType)}</span><span className="mr-2">{cad.stepNo}. Day</span><span>{cad.daySequenceWaitperiod}  - {cad.touchType}</span>
                              </ListGroupItem>
                           )
                         })
                    }
                  </ListGroup>
                 </Col>
              </Row>
            
          </ModalBody>
          <ModalFooter>
            <ClButton
              type="submit"
              color="primary"
              icon="fa fa-check mr-2"
              loading={Loading}
              onClick={()=>{setShowCloneCadenceConfirmModal(true)}}
            >
              Clone
            </ClButton>
            <CloseButton onClick={hideModal} />
          </ModalFooter>

          <CloneCadenceModel
              showModal={showCloneCadenceConfirmModal}
              currentUserId={currentUserId}
              Loading={cloneCadenceLoading}
              cadenceName={sampleCadence}
              handleAction={(data) => {
                const {
                  cloneCadenceName
                } = data;
                cloneCadence({
                  variables: {
                    cloneCadenceName:cloneCadenceName,
                    sampleCadenceName:sampleCadence
                  },
                });
              }}
              hideModal={() => {
                setShowCloneCadenceConfirmModal(false);
              }}
          />
       
      </Modal>
    </>
  );
};
export default SampleCadencesModel;