import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CloseButton from "../../Common/CloseButton";
import { FormValidator } from '@nextaction/components';
import Button from "../../Common/Button";

const SaveReportModal = ({ handleAction, hideModal, showModal, showActionBtnSpinner, title }) => {
  const formRef = useRef();
  const saveReportRef = useRef();
  const [formTag, setFormTag] = useState();

  const hasError = (inputName, method) => {
    return formTag &&
      formTag.errors &&
      formTag.errors[inputName] &&
      formTag.errors[inputName][method]
  }

  const handleModalClose = () => {
    setFormTag();
  };

  const handleSaveReport= (e) => {
    const form = formRef.current;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT"].includes(i.nodeName)
    );

    const { errors, hasError } = FormValidator.bulkValidate(inputs);
    setFormTag({ ...formTag, formName, errors });
    if (!hasError) {
      const FormData=saveReportRef.current.value
      hideModal()
    }
  }

  return (
    <Modal  isOpen={showModal} centered={true} onClosed={handleModalClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <Form name="saveReport" innerRef={formRef}>
          <FormGroup row>
            <Label for="report_name" sm={2}>Report name<span className="text-danger">*</span></Label>
            <Col sm={10}>
              <Input type="text" name="report_name" id="report_name" data-validate='["required"]' invalid={hasError("report_name", "required")} innerRef={saveReportRef} ></Input>
              <div className="invalid-feedback">Please enter report name</div>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" title="Save" onClick={handleSaveReport} disabled={showActionBtnSpinner} icon={showActionBtnSpinner ? "fas fa-spinner fa-spin" : "fa fa-check"}>
          {showActionBtnSpinner ? "Wait...":"Save"}
        </Button>
        <CloseButton title="Close" onClick={hideModal} />
      </ModalFooter>
    </Modal>
  );
}
SaveReportModal.propTypes = {
  handleAction: PropTypes.func.isRequired,
  showActionBtnSpinner: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};

export default SaveReportModal;
