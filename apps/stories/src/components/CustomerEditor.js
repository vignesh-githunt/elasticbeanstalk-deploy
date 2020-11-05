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
import CREATE_CUSTOMER from "./mutations/CreateCustomer";
import {useTracking} from './SegmentTracker'
import SpinnerButton from './Extras/SpinnerButton';
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {name} from "./Forms/FormValidatorPattern"
const CustomerEditor = () => {
  const {handleSubmit,register,errors}=useForm();
  const tracker = useTracking();
  const [createCustomer,{loading:createloading}] = useMutation(CREATE_CUSTOMER);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const onSubmit = (data) => {
    const {name,domain} =data;
    tracker.track('Create Customer Clicked')
      createCustomer({
        variables: {
          name,
          domain,
        },
        refetchQueries: ["allCustomers"],
      }).then((result) => {
        tracker.track('Customer Created')
      });   
      toggleModal();
  };
  return (
    <React.Fragment>
      <Button color="primary" onClick={toggleModal}>
        Create Customer
      </Button>
      <Modal isOpen={isOpen} toggle={toggleModal}>
      <Form name="formCustomer" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <Container className="container-md">
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
               <ErrorMessage errors={errors} className="invalid-feedback" name="name" as="p"></ErrorMessage> 
              </FormGroup>
              <FormGroup>
                <label>Domain</label>
                <Input
                  type="text"
                  name="domain"
                  invalid={
                    errors.domain
                  }
                  placeholder="Domain"
                  innerRef={register({required: "Domain is required"})}
                />
               <ErrorMessage errors={errors} className="invalid-feedback" name="domain" as="p"></ErrorMessage> 
              </FormGroup>
          </Container>
        </ModalBody>
        <ModalFooter>
        <SpinnerButton color="primary" type="submit" loading={createloading}>Create</SpinnerButton>
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

export default CustomerEditor;
