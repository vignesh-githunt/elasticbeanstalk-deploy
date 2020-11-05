/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { FormValidator } from '@nextaction/components';
import CloseButton from "../../Common/CloseButton";
import { prospectsToCadenceAction, getAllCadences } from "../../../store/actions/actions";

const AssignOrMoveProspectToCadenceModal = ({ actionBtnIcon, actionBtnText, cadences, currentUserId, getAllCadences, handleAction, handleShowHideModal, modalHeader, prospect, showActionBtnSpinner, showModal }) => {

  const formRef = useRef();
  const cadenceListRef = useRef();

  const [formCadence, setFormCadence] = useState();
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertColor, setAlertColor] = useState("success");
  const [alertMessage, setAlertMessage] = useState();

  const hasError = (inputName, method) => {

    return formCadence &&
      formCadence.errors &&
      formCadence.errors[inputName] &&
      formCadence.errors[inputName][method]
  }

  useEffect(() => getAllCadences(currentUserId), []);

  // Reset Modal
  const handleModalClose = () => {

    setAlertShow(false);

    setFormCadence();
  };

  const handleProspectToCadenceAction = (e) => {

    /* ----- Validate from fields -begin ----- */
    const form = formRef.current;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
    ["SELECT"].includes(i.nodeName)
    );
    
    const { errors, hasError } = FormValidator.bulkValidate(inputs);
    
    setFormCadence({ ...formCadence, formName, errors });
    /* ----- Validate from fields -end ----- */

    if (!hasError) {

      setRequestProcessing(true);

      handleAction(cadenceListRef.current.value);
    }
  }

  return (
    <Modal size="lg" isOpen={showModal} centered={true} onClosed={handleModalClose}>
      <ModalHeader>{modalHeader}</ModalHeader>
      <ModalBody>
        <Form name="assignProspectToCadence" innerRef={formRef}>
          <FormGroup row>
            <Label for="assign_prospect_to_cadence" sm={2}>Cadence<span className="text-danger">*</span></Label>
            <Col sm={10}>
              <Input type="select" name="cadence" id="assign_prospect_to_cadence" className="form-control" data-validate='["select"]'
                invalid={hasError("cadence", "select")}
                innerRef={cadenceListRef}
              >
                <option></option>
                {
                  cadences.data &&
                  cadences.data.map((cadence, i) => {
                    return <option value={cadence.id} key={i}>{cadence.name}</option>;
                  })
                }
              </Input>
              <div className="invalid-feedback">Please select Cadence</div>
            </Col>
          </FormGroup>
        </Form>
        <Row>
          {
            alertShow &&
            <Col>
              <Alert color={alertColor} className="text-center mb-0">
                {alertMessage}
              </Alert>
            </Col>
          }
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleProspectToCadenceAction} disabled={showActionBtnSpinner}>
          <i className={(showActionBtnSpinner ? "fas fa-spinner fa-spin" : actionBtnIcon)+" mr-2"}></i>
          {showActionBtnSpinner ? "Wait..." : actionBtnText}
        </Button>
        <CloseButton onClick={handleShowHideModal}/>
      </ModalFooter>
    </Modal>
  );
}

// This is required for redux
const mapStateToProps = state => ({
  cadences: state.cadences
});

AssignOrMoveProspectToCadenceModal.propTypes = {
  actionBtnIcon: PropTypes.string.isRequired,
  actionBtnText: PropTypes.oneOf(["Assign", "Move"]),
  currentUserId: PropTypes.number.isRequired,
  handleShowHideModal: PropTypes.func.isRequired,
  handleAction: PropTypes.func.isRequired,
  modalHeader: PropTypes.oneOf(["Assign Prospect to Cadence", "Move Prospect to Cadence"]),
  prospect: PropTypes.object.isRequired,
  showActionBtnSpinner: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired
};


// To prevent re-render of this component if parent state which are not related to this component chagnes
const MemorizedAssignProspectToCadenceModal = React.memo(AssignOrMoveProspectToCadenceModal, (prev, next) => prev.showAssignPorspectToCadenceModal === next.showAssignPorspectToCadenceModal);

// This is required for redux
export default connect(mapStateToProps, { getAllCadences })(AssignOrMoveProspectToCadenceModal);