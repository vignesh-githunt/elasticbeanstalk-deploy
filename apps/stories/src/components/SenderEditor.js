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
import CREATE_SENDER from "./mutations/CreateSender";
import {useTracking} from './SegmentTracker'
import SpinnerButton from './Extras/SpinnerButton';
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {email} from "./Forms/FormValidatorPattern"

const SenderEditor = ({ customerId }) => {
  const {handleSubmit,register,errors}=useForm();
  const tracker = useTracking();
  const [createSender,{loading:createloading}] = useMutation(CREATE_SENDER);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const onSubmit = (data) => {
    const {firstName,lastName,email} =data;
    tracker.track('Create Sender Clicked')
       createSender({
          variables: {
            customerId: customerId,
            firstName,
            lastName,
            email,
          },
          refetchQueries: ["senders"],
        }).then((result) => {
          return tracker.track('Sender Created')
        });  
       toggleModal();
  };
  return (
    <React.Fragment>
      <Button color="primary" onClick={toggleModal}>
        Create Sender
      </Button>
      <Modal isOpen={isOpen} toggle={toggleModal}>
      <Form name="formSender" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <Container className="container-md">
              <FormGroup>
                <label>First Name</label>
                <Input
                  type="text"
                  name="firstName"
                  invalid={
                   errors.firstName
                  }
                  placeholder="First Name"
                  innerRef= {register({required: "First Name is required"})}
                />
                <ErrorMessage errors={errors} name="firstName" className="invalid-feedback" as="p"></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  invalid={
                   errors.lastName
                  }
                  placeholder="Last Name"
                  innerRef={register({ required: "Last Name is required"})}
                />
                  <ErrorMessage errors={errors} name="lastName" className="invalid-feedback" as="p"></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Email</label>
                <Input
                  type="text"
                  name="email"
                  placeholder="Email"
                  invalid={
                   errors.email
                  }
                  innerRef={register(email)}
                />
                  <ErrorMessage errors={errors} name="email" className="invalid-feedback" as="p"></ErrorMessage>
              </FormGroup>
          </Container>
        </ModalBody>
        <ModalFooter>
        <SpinnerButton  color="primary" loading={createloading}>Create</SpinnerButton>
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
export default SenderEditor;
