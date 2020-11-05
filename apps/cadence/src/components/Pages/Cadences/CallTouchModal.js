import React, { useState,useEffect } from "react";
import {
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { parseUrl } from "query-string";
import CloseButton from "../../Common/CloseButton";
import WorkflowActions from "./WorkflowActions";
import ClButton from "../../Common/Button";

const CallTouchModal = ({ showModal, hideModal, handleAction, Loading,currentUserId,editFlag,editData,editOutcome,currentCadence }) => {
  const [dispositionFilter, setDispositionFilter] = useState(
    `&filter[productType]=CD `
  );

  const [cdDialer, setCdDialer] = useState(true);
  const [pdDialer, setPdDialer] = useState(false);
  const [tdDialer, setTdDialer] = useState(false);
  const [dialerValues] = useState(["CD"]);
  var WFoutput,callTouchDataEdit;

  const { handleSubmit, register,errors,reset } = useForm();
  const [form,setForm] = useState({});

  
  useEffect(()=>{
    if(editFlag){

      editData.map((edit)=>{
        if (edit.product ==="PD"){
          setPdDialer(true)
          setCdDialer(false)
        }
        else if(edit.product ==="PD"){
          setTdDialer(true)
          setCdDialer(false)
        }
        callTouchDataEdit=
      {
       "timeToWaitAndExecute":edit.waitPeriodBeforeStart,
        "timeToWaitUnit":edit.waitPeriodUnit,
        "timeToComplete":edit.timeToComplete,
        "timeToCompleteUnit":edit.timeToCompleteUnit,
      }
      })
      reset(callTouchDataEdit)
    }
    
  },[editData])

  const handleWorkFlow=(data)=>{
    WFoutput=data
    
  }

  const onSubmit = (data) => {
    handleAction(data, dialerValues,WFoutput);
  };

  const handleDialerChange = (e) => {
    const selectedDialerValue = e.currentTarget.getAttribute("data-tab-value");
    const ischecked = e.currentTarget.checked;
    if (selectedDialerValue == "CD") {
      setCdDialer(ischecked);
      if (ischecked) {
        const index = dialerValues.indexOf(selectedDialerValue);
        if (dialerValues.includes(selectedDialerValue)) {
          dialerValues.splice(index, 1);
        } else {
          dialerValues.push(selectedDialerValue);
        }
      }
    }
    if (selectedDialerValue == "PD") {
      setPdDialer(ischecked);
      if (ischecked) {
        dialerValues.push(selectedDialerValue);
      } else {
        const index = dialerValues.indexOf(selectedDialerValue);
        if (index > -1) {
          dialerValues.splice(index, 1);
        }
      }
    }
    if (selectedDialerValue == "TD") {
      setTdDialer(ischecked);
      if (ischecked) {
        dialerValues.push(selectedDialerValue);
      } else {
        const index = dialerValues.indexOf(selectedDialerValue);
        if (index > -1) {
          dialerValues.splice(index, 1);
        }
      }
    }

    const { query } = parseUrl("?page[limit]=10&page[offset]=0");
    query["filter[productType]"] = dialerValues ? dialerValues: "CD" ;
    let filterQry = Object.entries({
      ...query,
    })
      .filter(([key]) => key.startsWith("filter"))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    setDispositionFilter(filterQry === "" ? "" : "&" + filterQry);
  };

  const handleModalClose = () => {
    setForm();
  };

  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered>
        <Form name="addCallTouch" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Call Touch</ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>Choose Calling Mode</Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup row>
                  <Card className="m-0 rounded-0 bg-white br">
                    <CardBody className="pl-3 pt-0 pb-0 d-flex align-items-center">
                      <div className="block pl-2">
                        <div className="row">
                          <span className="fa-2x svg speed-30"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                        </div>
                      </div>
                      <div className="ml-3 text-dark">
                        Click Dialer{" "}
                        <Label className="ml-4">
                          <Input
                            className="mt-n1"
                            type="checkbox"
                            name="cdDialer"
                            data-tab-value="CD"
                            checked={cdDialer}
                            innerRef={register(true)}
                            onClick={handleDialerChange}
                          />
                        </Label>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="m-0 rounded-0 bg-white br">
                    <CardBody className="pl-4 pt-0 pb-0 d-flex align-items-center">
                      <div className="block pl-2">
                        <div className="row">
                          <span className="fa-2x svg speed-100"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                        </div>
                      </div>
                      <div className="ml-3 text-dark">
                        Personal Dialer{" "}
                        <Label className="ml-4">
                          <Input
                            className="mt-n1"
                            name="pdDialer"
                            checked={pdDialer}
                            type="checkbox"
                            data-tab-value="PD"
                            innerRef={register(true)}
                            onClick={handleDialerChange}
                          />
                        </Label>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="m-0 rounded-0 bg-white br">
                    <CardBody className="pl-4 pt-0 pb-0 d-flex align-items-center">
                      <div className="block pl-2">
                        <div className="row">
                          <span className="fa-2x svg speed-800"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                        </div>
                      </div>
                      <div className="ml-3 text-dark">
                        Team Dialer{" "}
                        <Label className="ml-4">
                          <Input
                            className="mt-n1"
                            name="tdDialer"
                            data-tab-value="TD"
                            checked={tdDialer}
                            innerRef={register(true)}
                            onClick={handleDialerChange}
                            type="checkbox"
                          />
                        </Label>
                      </div>
                    </CardBody>
                  </Card>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="time_to_wait_and_execute">Time to wait and Execute </Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="number"
                    min="0"
                    name="timeToWaitAndExecute"
                    id="time_to_wait_and_execute"
                    step="1"
                    invalid={errors.timeToWaitAndExecute}  
                    innerRef={register({required: "Required Time to wait and Execute",})}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="timeToWaitAndExecute"
                    className="invalid-feedback"
                    as="p"
                  ></ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="select"
                    name="timeToWaitUnit"
                    innerRef={register(true)}
                  >
                    <option value="Mi">Minute(s)</option>
                    <option value="Ho">Hour(s)</option>
                    <option value="Da">Day(s)</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="time_to_complete">Maximum Time to complete the Touch</Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="number"
                    min="0"
                    name="timeToComplete"
                    id="time_to_complete"
                    step="1"
                    invalid={errors.timeToComplete}
                    innerRef={register({
                      required: "Required Maximum Time to complete the Touch",
                    })}
                  />
                   <ErrorMessage
                    errors={errors}
                    name="timeToComplete"
                    className="invalid-feedback"
                    as="p"
                  ></ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    type="select"
                    name="timeToCompleteUnit"
                    innerRef={register(true)}
                  >
                    <option value="Mi">Minute(s)</option>
                    <option value="Ho">Hour(s)</option>
                    <option value="Da">Day(s)</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={12}>
                <Card>
                  <WorkflowActions
                    register={register}
                    filterType="Call"
                    defaultFilter={dispositionFilter}
                    isoutcome={false}
                    handleWorkFlow={handleWorkFlow}
                    editOutcome={editOutcome}
                    editFlag={editFlag}
                    currentCadence={currentCadence}
                  ></WorkflowActions>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <ClButton
              type="submit"
              color="primary"
              icon="fa fa-check"
              loading={Loading}
            >
              Save
            </ClButton>
            <CloseButton onClick={hideModal} />
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};
export default CallTouchModal;