/*
 * @author @rManimegalai
 * @version V11.0
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { FormValidator } from '@nextaction/components';
import CloseButton from "../../Common/CloseButton";
import Button from "../../Common/Button";

const AddTagModal = ({ data, handleAction, hideModal, onChange, showModal, showActionBtnSpinner, title }) => {

  const [tagId, setTagId] = useState(0);
  const [text, setText] = useState();
  
  let id = 0;
  let value = "";
  if (data !== undefined) {
    id = data.original.id;
    value = data.values.name;
  }
  useEffect(() => {
    data &&
      setTagId(id)
    setText(value);
  }, [data]);

  const update = (event) => {
    setText(event.target.value.trim());
    if (typeof onChange === "function") {
      onChange(event.target.value);
    }
  }

  const formRef = useRef();
  const tagNameRef = useRef();
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

  const handleAddTag = (e) => {
    const form = formRef.current;
    const formName = form.name;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT"].includes(i.nodeName)
    );

    const { errors, hasError } = FormValidator.bulkValidate(inputs);
    setFormTag({ ...formTag, formName, errors });
    if (!hasError) {
      if (title === 'Add Tag') {
        handleAction(tagNameRef.current.value, 0);
      } else {
        handleAction(tagNameRef.current.value, tagId);
      }
    }
  }

  return (

    <Modal size="md" isOpen={showModal} centered={true} onClosed={handleModalClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <Form name="addTag" innerRef={formRef}>
          <FormGroup row>
            <Label for="add_tag_name" sm={12} lg={3}>Tag Name<span className="text-danger">*</span></Label>
            <Col sm={12} lg={9}>
              <Input type="text" name="tagName" id="add_tag_name" data-validate='["required"]' invalid={hasError("tagName", "required")} innerRef={tagNameRef} value={text} onChange={update}></Input>
              <div className="invalid-feedback">Please Enter Tag Name</div>
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddTag} disabled={showActionBtnSpinner} icon={showActionBtnSpinner ? "fas fa-spinner fa-spin" : "fa fa-check"}>
          {showActionBtnSpinner ? "Wait..." : title === "Update Tag" ? "Update" : "Save"}
        </Button>
        <CloseButton onClick={hideModal} />
      </ModalFooter>
    </Modal>
  );
}
AddTagModal.propTypes = {
  handleAction: PropTypes.func.isRequired,
  showActionBtnSpinner: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};

export default AddTagModal;