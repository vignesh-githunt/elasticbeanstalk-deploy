import React, { useState,useEffect } from "react";
import {
  Col,
  Card,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import CloseButton from "../../Common/CloseButton";
import WorkflowActions from "./WorkflowActions";
import ClButton from "../../Common/Button";
var WFoutput,textTouchDataEdit;
const TextTouchModal = ({ showModal, hideModal, handleAction, Loading,editFlag,editData,editOutcome,currentCadence }) => {
  const { handleSubmit, register,errors,reset } = useForm();
  const [form, setForm] = useState({});

  useEffect(()=>{
    if(editFlag){

      editData.map((edit)=>{
        textTouchDataEdit=
      {
       "timeToWaitAndExecute":edit.waitPeriodBeforeStart,
        "timeToWaitUnit":edit.waitPeriodUnit,
        "timeToComplete":edit.timeToComplete,
        "timeToCompleteUnit":edit.timeToCompleteUnit,
      }
      })
      reset(textTouchDataEdit)
    }
    
  },[editData])

  const handleWorkFlow=(data)=>{
    WFoutput=data
    
  }
  
  const onSubmit = (data) => {
    handleAction(data,WFoutput);
  };
  const handleModalClose = () => {
    setForm();
  };
  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered>
        <Form name="addTextTouch" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Text Touch</ModalHeader>
          <ModalBody>
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
                    invalid={errors.timeToWaitAndExecute}
                    step="1"
                    innerRef={register({
                      required: "Required Time to wait and Execute",
                    })}
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
                    filterType="Text"
                    isoutcome={true}
                    handleWorkFlow={handleWorkFlow}
                    editFlag={editFlag}
                    editOutcome={editOutcome}
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
              icon="fa fa-check mr-2"
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
export default TextTouchModal;