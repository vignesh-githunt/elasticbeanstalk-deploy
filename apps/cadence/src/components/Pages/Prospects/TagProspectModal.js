/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import PropTypes from 'prop-types'; import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { FormValidator } from '@nextaction/components';
import { getAllTags, tagProspects } from "../../../store/actions/actions";
import CloseButton from "../../Common/CloseButton";

const TagProspectModal = ({ currentUserId, getAllTags, handleAction, hideModal, showActionBtnSpinner, showModal, tags }) => {

  const formRef = useRef();
  const tagListRef = useRef();

  const [formTag, setFormTag] = useState();
  const [alertShow, setAlertShow] = useState(false);
  const [alertColor, setAlertColor] = useState("success");
  const [alertMessage, setAlertMessage] = useState();
  const hasError = (inputName, method) => {

    return formTag &&
      formTag.errors &&
      formTag.errors[inputName] &&
      formTag.errors[inputName][method]
  }

  useEffect(() => getAllTags(currentUserId), []);

  const handleModalClose = () => {
    setAlertShow(false);
    setFormTag();
  };

  const handleTagProspect = (e) => {
    const form = formRef.current;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
      ["SELECT"].includes(i.nodeName)
    );

    const { errors, hasError } = FormValidator.bulkValidate(inputs);

    setFormTag({ ...formTag, formName, errors });

    if (!hasError) {

      handleAction(tagListRef.current.value);
    }
  }

  return (
    <Modal size="lg" isOpen={showModal} centered={true} onClosed={handleModalClose}>
      <ModalHeader>Tag Prospect</ModalHeader>
      <ModalBody>
        <Form name="tagProspect" innerRef={formRef}>
          <FormGroup row>
            <Label for="tag_prospect" sm={2}>Cadence<span className="text-danger">*</span></Label>
            <Col sm={10}>
              <Input type="select" name="tagName" id="tag_prospect" className="form-control" data-validate='["select"]'
                invalid={hasError("tagName", "select")}
                innerRef={tagListRef}
              >
                <option></option>
                {
                  tags.data &&
                  tags.data.map((tag, i) => {
                    return <option key={i}>{tag.tagValue}</option>;
                  })
                }
              </Input>
              <div className="invalid-feedback">Please select Tag</div>
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
        <Button color="primary" onClick={handleTagProspect} disabled={showActionBtnSpinner}>
          <i className={showActionBtnSpinner ? "fas fa-spinner fa-spin" : "fa fa-tag"}></i>&nbsp;&nbsp;
          {showActionBtnSpinner ? "Wait..." : "Tag"}
        </Button>
        <CloseButton onClick={hideModal} />
      </ModalFooter>
    </Modal>
  );
}

TagProspectModal.propTypes = {
  handleAction: PropTypes.func.isRequired,
  showActionBtnSpinner: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired
};

// This is required for redux
const mapStateToProps = state => ({
  tags: state.tags
});

// To prevent re-render of this component if parent state which are not related to this component chagnes
const MemorizedTagProspectModal = React.memo(TagProspectModal, (prev, next) => {
  return prev.showModal === next.showModal && prev.showActionBtnSpinner === next.showActionBtnSpinner;
});

// // This is required for redux
export default connect(mapStateToProps, { getAllTags })(MemorizedTagProspectModal);
// export default connect(mapStateToProps, { getAllTags })(TagProspectModal);