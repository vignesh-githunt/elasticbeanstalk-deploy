import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import { STORYQUERYSTRING } from "../queries/StoryQueryNew";
import CREATE_MESSAGE from "../mutations/stories/CreateMessage";
import UPDATE_MESSAGE from "../mutations/stories/UpdateMessage";
import SpinnerButton from '../Extras/SpinnerButton';
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {name} from "../Forms/FormValidatorPattern";

const MessageEditor = ({ customerId, story, message }) => {
  const {handleSubmit,register,errors}=useForm({defaultValues: { name :message.name }});
  const [createMessage,{loading: createLoading}] = useMutation(CREATE_MESSAGE);
  const [updateMessage,{loading: updateLoading}] = useMutation(UPDATE_MESSAGE);
  const [isOpen, setIsOpen] = useState(false);
  const [position] = useState(message.position || story.messages.length + 1);
  
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = (data) => {
    const {name} = data;
    if (message.id) {
      updateMessage({
        variables: {
          id: message.id,
          name: name,
          position: position
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id }
          }
        ]
      }).then(result => {
        toggleModal();
      });
    } else {
      createMessage({
        variables: {
          customerId: customerId,
          name: name,
          storyId: story.id
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id }
          }
        ]
      }).then(result => {
        toggleModal();
      });
    }
  
  };
  // const options = [
  //   { value: "Computer Software", label: "Computer Software" },
  //   { value: "Information Technology and Services", label: "Information Technology and Services" },
  //   { value: "Internet", label: "Internet" }
  // ];
  return (
    <React.Fragment>
      {message.id ? (
        <a
          href="#/"
          onClick={e => {
            e.preventDefault();
            toggleModal();
          }}
        >
          <i className="fa fa-edit"></i>
        </a>
      ) : (
        <Button
          color="primary"
          onClick={e => {
            e.preventDefault();
            toggleModal();
          }}
        >
          <i className="fa fa-plus"></i> Add
        </Button>
      )}

      <Modal isOpen={isOpen} toggle={toggleModal}>
      <Form name="formMessage"  onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={toggleModal}>
          {message.id ? "Edit Message" : "Create Message"}
        </ModalHeader>
        <ModalBody>
          <Container className="container-md">
              <FormGroup>
                <label>Type</label>
                <select className="custom-select custom-select-sm" name="type">
                  <option value="Email">Email</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Name</label>
                <Input
                  type="text"
                  name="name"
                  invalid={
                    errors.name
                  }
                  placeholder="Name"
                  innerRef={register(name)}
                />
                 <ErrorMessage errors={errors} name="name" className="invalid-feedback" as="p"></ErrorMessage>
              </FormGroup>
          
          </Container>
        </ModalBody>
        <ModalFooter>
        <SpinnerButton type="submit" color= {message.id ? "secondary" : "primary"} loading={createLoading || updateLoading}>{message.id ? "Save" : "Create"}</SpinnerButton>
         {" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default MessageEditor;
