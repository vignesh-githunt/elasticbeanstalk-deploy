import React, { useState,useEffect} from "react";
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

const OtherTouchModal = ({ showModal, hideModal, handleAction, Loading,editFlag, editData}) => {
  const formRef = React.useRef();
  const { handleSubmit, register, errors,reset } = useForm();
  const [form, setForm] = useState({});
  var otherTouchDataEdit;

  const onSubmit = (data) => {
    handleAction(data);
  };

  const handleModalClose = () => {
    setForm();
  };

  const getSocialMediaType = (socialMediaType)=>{
    let typeNo;
    if(socialMediaType==="Others-Google")
      typeNo=1
    else if (socialMediaType==="Others-Twitter")
      typeNo=3
    else if (socialMediaType==="Others-Zoominfo")
      typeNo=6
    else if (socialMediaType==="Others-Custom")
      typeNo=7
    
      return typeNo;
  }
  
  useEffect(()=>{
    if(editFlag){

      editData.map((edit)=>{
        otherTouchDataEdit=
      {
        "socialMediaType":getSocialMediaType(edit.subTouch),
        "description":edit.instructions,
       "timeToWaitAndExecute":edit.waitPeriodBeforeStart,
        "timeToWaitUnit":edit.waitPeriodUnit,
        "timeToComplete":edit.timeToComplete,
        "timeToCompleteUnit":edit.timeToCompleteUnit,
      }
      })
      reset(otherTouchDataEdit)
    }
    
  },[editData])
  
  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered>
        <Form name="addOtherTouch" onSubmit={handleSubmit(onSubmit)} innerRef={formRef}>
          <ModalHeader>Add Other Touch</ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label for="social_media_type">Choose Other Network </Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Input
                    type="select"
                    name="socialMediaType"
                    id="social_media_type"
                    invalid={errors.socialMediaType}
                    innerRef={register({
                      required: "Please Select Other Network Type",
                    })}
                  >
                    <option></option>
                    <option value="1">Others-Google</option>
                    <option value="3">Others-Twitter</option>
                    <option value="6">Others-Zoominfo</option>
                    <option value="7">Others-Custom</option>
                  </Input>
                  <ErrorMessage
                      errors={errors}
                      name="socialMediaType"
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
                    placeholder="Please Enter Description"
                    invalid={errors.description}
                    innerRef={register({ required: "Required Description" })}
                  >
                    <ErrorMessage
                      errors={errors}
                      name="description"
                      className="invalid-feedback"
                      as="p"
                    ></ErrorMessage>
                  </Input>
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
export default OtherTouchModal;