/*
 * @author @Manimegalai V
 * @version V11.0
 */

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { FormValidator } from '@nextaction/components';
import Button from "../../Common/Button";
import CloseButton from "../../Common/CloseButton";

const TransferOwnershipModal = ({ handleAction, hideModal, showActionBtnSpinner, showModal }) => {

  const formRef = useRef();
  const userListRef = useRef();
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

  const handleTransferOwnership = (e) => {
    const form = formRef.current;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
      ["SELECT"].includes(i.nodeName)
    );

    const { errors, hasError } = FormValidator.bulkValidate(inputs);

    setFormTag({ ...formTag, formName, errors });

    if (!hasError) {

      handleAction(userListRef.current.value);
    }
  }

  return (
    <Modal size="lg" isOpen={showModal} centered={true} onClosed={handleModalClose}>
      <ModalHeader>Transfer Ownership</ModalHeader>
      <ModalBody>
        <Form name="transferownership" innerRef={formRef}>
          <FormGroup row>
            <Label for="tc_transfer_ownership_from_user" sm={2}>From User<span className="text-danger">*</span></Label>
            <Col sm={10}>
              <Input type="select" name="userName" id="tc_transfer_ownership_from_user" className="form-control" data-validate='["select"]'
                invalid={hasError("userName", "select")}
                innerRef={userListRef}
              >
                <option></option>
              </Input>
              <div className="invalid-feedback">Please select User</div>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="tc_transfer_ownership_to_user" sm={2}>To User<span className="text-danger">*</span></Label>
            <Col sm={10}>
              <Input type="select" name="userName" id="tc_transfer_ownership_to_user" className="form-control" data-validate='["select"]'
                invalid={hasError("userName", "select")}
                innerRef={userListRef}
              >
                <option></option>
              </Input>
              <div className="invalid-feedback">Please select User</div>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleTransferOwnership} disabled={showActionBtnSpinner} icon={showActionBtnSpinner ? "fas fa-spinner fa-spin" : "fa fa-check"}>
          {showActionBtnSpinner ? "Wait..." : "Save"}
        </Button>
        <CloseButton onClick={hideModal} />
      </ModalFooter>
    </Modal>
  );
}
TransferOwnershipModal.propTypes = {
  handleAction: PropTypes.func.isRequired,
  showActionBtnSpinner: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired
};

export default TransferOwnershipModal;