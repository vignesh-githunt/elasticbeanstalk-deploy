import React, { useRef, useState} from "react";
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

const CloneCadenceModel = ({
  showModal,
  hideModal,
  handleAction,
  Loading,
  cadenceName,
  
}) => {
    
  const formRef = useRef();

  const { handleSubmit, register, errors } = useForm();
  const [form, setForm] = useState({});

  const onSubmit = (data) => {
    handleAction(data);
  };

  const handleModalClose = () => {
    setForm();
  };

  return (
    <>
      <Modal size="lg" isOpen={showModal} onClosed={handleModalClose} centered>
        <Form name="assignProspects" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Clone cadence-<strong>{cadenceName}</strong></ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="clone_cadence_name">Cadence Name</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Input
                    type="text"
                    name="cloneCadenceName"
                    id="clone_cadence_name"
                    invalid={errors.cloneCadenceName}
                    innerRef={register({
                      required: "Please enter the cadence name",
                    })}
                  >
                  </Input>
                  <ErrorMessage errors={errors} name="clone_cadence_name" className="invalid-feedback" as="p" />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <b className="mr-2">Note:</b><p>All the touches and email templates in this cadence will be added to this cloned cadence</p>
            </Row>
            
        </ModalBody>
          <ModalFooter>
            <ClButton
              type="submit"
              color="primary"
              icon="fa fa-check mr-2"
              disabled={Loading} icon={Loading ? "fas fa-spinner fa-spin" : "fa fa-check"}
            >
              {Loading ? "Wait...":"Save"}
            </ClButton>
            <CloseButton onClick={hideModal} />
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};
export default CloneCadenceModel;