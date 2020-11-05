import React, { useState,useEffect } from "react";
import {
  Col,
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
import CloseButton from "../../Common/CloseButton";
import ClButton from "../../Common/Button";

const LinkedInTouchModel = ({
  showModal,
  hideModal,
  handleAction,
  Loading,
  editFlag,
  editData
}) => {
  const formRef = React.useRef();
  const { handleSubmit, register, errors ,reset} = useForm();
  const [form, setForm] = useState({});
  var linkedinTouchDataEdit;

  const getLinkedinType = (linkedinType)=>{
    let linkedin;
    if(linkedinType==="LinkedIn-View Profile")
    linkedin="View Profile"
    else if (linkedinType==="LinkedIn-Connection Request")
    linkedin="Connection Request"
    else if (linkedinType==="LinkedIn-Get Introduced")
    linkedin="Get Introduced"
    else if (linkedinType==="LinkedIn-InMail")
    linkedin="InMail"
    else if (linkedinType==="LinkedIn-Post Interaction")
    linkedin="Post Interaction"
    
      return linkedin;
  }
  
  useEffect(()=>{
    if(editFlag){

      editData.map((edit)=>{
        linkedinTouchDataEdit=
      {
        "linkedInType":getLinkedinType(edit.subTouch),
        "description":edit.instructions,
       "timeToWaitAndExecute":edit.waitPeriodBeforeStart,
        "timeToWaitUnit":edit.waitPeriodUnit,
        "timeToComplete":edit.timeToComplete,
        "timeToCompleteUnit":edit.timeToCompleteUnit,
      }
      })
      reset(linkedinTouchDataEdit)
    }
    
  },[editData])

  const onSubmit = (data) => {
    handleAction(data);
  };

  const handleModalClose = () => {
    setForm();
  };

  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered>
        <Form name="addLinkedInTouch" onSubmit={handleSubmit(onSubmit)} innerRef={formRef}>
          <ModalHeader>Add LinkedIn Touch</ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="linkedIn_type">Choose LinkedIn Touch Type </Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Input
                    type="select"
                    name="linkedInType"
                    id="linkedIn_type"
                    invalid={errors.linkedInType}
                    innerRef={register({
                      required: "Please Select LinkedIn Touch Type",
                    })}
                  >
                    <option></option>
                    <option value="View Profile">LinkedIn-View Profile</option>
                    <option value="Connection Request">
                      LinkedIn-Connection Request
                    </option>
                    <option value="Get Introduced">
                      LinkedIn-Get Introduced
                    </option>
                    <option value="InMail">LinkedIn-InMail</option>
                    <option value="Post Interaction">
                      LinkedIn-Post Interaction
                    </option>
                  </Input>
                  <ErrorMessage
                    errors={errors}
                    name="linkedInType"
                    className="invalid-feedback"
                    as="p"
                  ></ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="description">Description</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    invalid={errors.description}
                    placeholder="Please Enter Description"
                    innerRef={register({ required: "Required Description" })}
                  >
                  </Input>
                  <ErrorMessage
                    errors={errors}
                    name="description"
                    className="invalid-feedback"
                    as="p"
                  ></ErrorMessage>
                 
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
                    invalid={errors.timeToWaitAndExecute}
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
export default LinkedInTouchModel;