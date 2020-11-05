/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, Row } from 'reactstrap';
import $ from 'jquery';
/* import 'bootstrap-select/dist/js/bootstrap-select.js';
import 'bootstrap-select/dist/css/bootstrap-select.min.css'; */
import { FormValidator } from '@nextaction/components';
import CloseButton from "../../Common/CloseButton";
import { getAllAccounts, getAllTags } from "../../../store/actions/actions";

const AddProspectModal = ({ showModal, handleAction, hideModal, getAllAccounts, getAllTags, accounts, tags, currentUserId, showActionBtnSpinner }) => {

  const formRef = React.useRef();
  const tagRef = React.useRef();

  const [form, setForm] = useState({});

  const hasError = (inputName, method) => {

    return form &&
      form.errors &&
      form.errors[inputName] &&
      form.errors[inputName][method]
  }

  useEffect(() => {
    getAllAccounts(currentUserId);
    getAllTags(currentUserId)
  }, []);

  const handleSelectPicker = () => {   
  }

  // Reset Modal
  const handleModalClose = () => {
    setForm();
  };

  const handleSaveProspect = (e) => {
    const form = formRef.current;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );
    const { errors, hasError } = FormValidator.bulkValidate(inputs);
    setForm({ ...form, formName, errors });
    if (!hasError) {
      var prospectData = [...form.elements].reduce((acc, item) => {
        if (item.value.trim() != "") {
          acc[item.name] = item.value;
        }
        return acc;
      }, {});
      handleAction(prospectData);
    }
  }

  return (
    <Modal size="lg" isOpen={showModal} centered={true} onOpened={handleSelectPicker} onClosed={handleModalClose}>
      <div className="modal-header">
        <h4 className="modal-title modal-title mt-auto mb-auto">Add New Prospect</h4>
        <div>
          <span><span className="text-danger">*</span> Denotes mandatory</span>
          <br />
          <span><span className="text-warning">#</span> Either one is required</span>
        </div>
      </div>
      <ModalBody>
        <Form name="addProspect" innerRef={formRef}>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_first_name">First Name<span className="text-danger">*</span></Label>
                <Input type="text" name="firstName" id="add_prospect_first_name" data-validate='["required"]'
                  invalid={
                    hasError("firstName", "required") ||
                    hasError("firstName", "text")
                  }
                />
                <div className="invalid-feedback">First Name is required</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_last_name">Last Name<span className="text-danger">*</span></Label>
                <Input type="text" name="lastName" id="add_prospect_last_name" data-validate='["required"]'
                  invalid={
                    hasError("lastName", "required") ||
                    hasError("lastName", "text")
                  }
                />
                <div className="invalid-feedback">Last Name is required</div>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_title">Title</Label>
                <Input type="text" name="title" id="add_prospect_title" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_account_name">Company</Label>
                <select name="accountName" id="add_prospect_account_name" className="form-control">
                  <option></option>
                  {
                    accounts.data &&
                    accounts.data.map((account, i) => {
                      return account.accountName && <option key={i}>{account.accountName}</option>;
                    })
                  }
                </select>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_phone">Phone<span className="text-warning">#</span></Label>
                <Input type="text" name="phone" id="add_prospect_phone" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_email">Email<span className="text-warning">#</span></Label>
                <Input type="text" name="email" id="add_prospect_email" />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_city">City</Label>
                <Input type="text" name="city" id="add_prospect_city" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_state">State</Label>
                <Input type="text" name="state" id="add_prospect_state" />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_tag">tag</Label>
                <Input type="select" name="tag" id="add_prospect_tag" className="form-control" innerRef={tagRef} multiselect="true">
                  <option></option>
                  {
                    tags.data &&
                    tags.data.map((tag, i) => {
                      return tag.tagValue && <option key={i}>{tag.tagValue}</option>;
                    })
                  }
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="add_prospect_record_type">Record Type<span className="text-danger">*</span></Label>
                <Input type="select" name="recordType" id="add_prospect_record_type" className="form-control" data-validate='["select"]'
                  invalid={hasError("recordType", "select")}
                >
                  <option></option>
                  <option>Contact</option>
                  <option>Lead</option>
                </Input>
                <div className="invalid-feedback">Record Type is required</div>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSaveProspect} disabled={showActionBtnSpinner}>
          <i className={(showActionBtnSpinner ? "fas fa-spinner fa-spin" : "fa fa-plus") + " mr-2"}></i>
          {showActionBtnSpinner ? "Wait..." : "Save"}
        </Button>
        <CloseButton onClick={hideModal} />
      </ModalFooter>
    </Modal>
  );
}

// This is required for redux
const mapStateToProps = state => ({
  accounts: state.accounts,
  tags: state.tags
});

// This is required for redux
export default connect(mapStateToProps, { getAllAccounts, getAllTags })(AddProspectModal);
