import React, { useState } from "react";
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

const AssignProspectsModal = ({
  showModal,
  hideModal,
  handleAction,
  Loading,
  cadenceName
}) => {
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
          <ModalHeader>Assign prospects to <strong>{cadenceName}</strong></ModalHeader>
          <ModalBody>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="select_user">User</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Input
                    type="select"
                    name="select_user"
                    id="select_user"
                    innerRef={register({
                      required: "Please Select the user",
                    })}
                    invalid={errors.select_user}
                  >
                    <option></option>
                    <option value="Edwin">Edwin</option>
                    <option value="Ravi">
                      Ravi
                    </option>
                  </Input>
                  <ErrorMessage errors={errors} name="select_user" className="invalid-feedback" as="p" />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="select_prospects">Prospects </Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <Input
                    type="select"
                    name="select_prospects"
                    id="select_prospects"
                    invalid={errors.select_prospects}
                    innerRef={register({
                      required: "Please Select the prospects",
                    })}
                  multiple
                  >
                    <option></option>
                    <option value="p1 dd">p1 dd</option>
                    <option value="pros1">pros1</option>
                    <option value="test1">test1</option>
                    <option value="p1">p1</option>
                   
                  </Input>
                  <ErrorMessage errors={errors} name="select_prospects" className="invalid-feedback" as="p" />
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
              title="Save"
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
export default AssignProspectsModal;