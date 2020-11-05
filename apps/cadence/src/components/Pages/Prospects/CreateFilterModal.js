/**
 * @author ranbarasan
 * @version V11.0
 */
import React from 'react';
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import { default as ClButton } from "../../Common/Button";
import CloseButton from "../../Common/CloseButton";
import AddFilterLogicGrid from "./AddFilterLogicGrid";

function CreateFilterModal({ showModal, hideModal, showActionBtnSpinner }) {

  const filterLogicData = [{
    cl_field_label: "First Name",
    operator: "equal",
    value: "Anbarasan"
  }];

  const filterLogicColumns = React.useMemo(
    () => [{
      Header: "Prospect Field",
      accessor: "cl_field_label"
    }, {
      Header: "Operator",
      accessor: "operator"
    }, {
      Header: "Value",
      accessor: "value"
    }],
    []
  );

  return (
    <div>
      <Modal isOpen={showModal} centered={true} size="lg">
        <ModalHeader><i class="fas fa-filter mr-2"></i>Add Filter Criteria</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label for="filter_name" md={2}>Filter Name</Label>
              <Col md={6}>
                <Input type="text" name="filterName" id="filter_name" />
              </Col>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="allCriteriaMatch" id="all_criteria_match" />All Criteria's match (AND)
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="anyCriteriaMatch" id="any_criteria_match" />Any one Criteria match (OR)
              </Label>
            </FormGroup>
            <div className="mt-2">
              <AddFilterLogicGrid
                columns={filterLogicColumns}
                data={filterLogicData}
              />
            </div>
            <Row>
              <Col>
                <ClButton outline className="float-right" icon="fas fa-plus" title="Add Filter Logic">Add Filter Logic</ClButton>
              </Col>
            </Row>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="shareWithNone" id="share_with_none" />None (Private)
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="shareWithAllUsers" id="share_with_all_users" />All Users (Public)
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="shareWithTeams" id="share_with_teams" />Assign to Teams
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="shareWithUsers" id="share_with_users" />Assign to Users
              </Label>
            </FormGroup>
            <FormGroup row className="mt-2">
              <Label for="choose_users" md={2}>Choose Users</Label>
              <Col md={6}>
                <Input type="select" name="chooseUsers" id="choose_users">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Input>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <ClButton color="primary" icon={(showActionBtnSpinner ? "fas fa-spinner fa-spin" : "fa fa-plus")} title="Save Changes">
            {showActionBtnSpinner ? "Wait..." : "Save"}
          </ClButton>
          <CloseButton onClick={hideModal} btnTxt="Cancel" />
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default CreateFilterModal;