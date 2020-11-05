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
import SpinnerButton from '../Extras/SpinnerButton';
import CREATE_BASE_ROE from "../mutations/CreateBaseRoe"
import UPDATE_BASE_ROE from "../mutations/UpdateBaseRoe";
import {useTracking} from '../SegmentTracker'
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {name} from "../Forms/FormValidatorPattern";

const RoeEditor = ({ customerId, roe }) => {
  const {handleSubmit,register,errors}=useForm({defaultValues: { name :roe.name,days:(roe.days || 90)}});
  const tracker = useTracking();
  const [createRoe,{loading: createLoading}] = useMutation(CREATE_BASE_ROE);
  const [updateRoe,{loading: updateLoading}] = useMutation(UPDATE_BASE_ROE);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const onSubmit = (data) => {
    const {name,days} = data;
    tracker.track('Create Roe Clicked')
    if(roe.id) {
      updateRoe({
        variables: {
          id: roe.id,
          name: name,
          days: parseInt(days)
        },
        refetchQueries: ["v3_Customer_Roe_Bases"]
      }).then((result) => {
        tracker.track('Roe Edited')
      });   
    } else {
      createRoe({
        variables: {
          customerId: customerId,
          name: name,
          days: parseInt(days),
        },
        refetchQueries: ["v3_Customer_Roe_Bases"]
      }).then((result) => {
        tracker.track('Roe Created')
      });   
    }
    toggleModal();
  };

  return (
    <React.Fragment>
      {roe.id ? (
        <a
          className="card-footer bg-gray-dark bt0 clearfix btn-block d-flex"
          href="#/"
          onClick={e => {
            e.preventDefault();
            toggleModal();
          }}
        >
          <span>Edit</span>
          <span className="ml-auto">
            <em className="fa fa-chevron-circle-right"></em>
          </span>
        </a>
      ) : (
        <Button
          color="primary"
          onClick={e => {
            e.preventDefault();
            toggleModal();
          }}
        >
          Create new
        </Button>
      )}

      <Modal isOpen={isOpen} toggle={toggleModal}>
      <Form name="formRoe" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={toggleModal}>
          {roe.id ? "Edit Rules of Engagement" : "Create Rules of Engagement"}
        </ModalHeader>
        <ModalBody>
          <Container className="container-md">
              <FormGroup>
                <label>Type</label>
                <select className="custom-select custom-select-sm" name="Type">
                  <option value="Base">Days since last contacted</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Name</label>
                <Input
                  type="text"
                  placeholder="Name"
                  name="name"
                  invalid={
                    errors.name
                  }
                  innerRef={register(name)}
                />
                 <ErrorMessage errors={errors} name="name" className="invalid-feedback" as="p"></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Days</label>
                <Input
                  type="text"
                  placeholder="Name"
                  name="days"
                  invalid={
                    errors.days
                  }
                  innerRef={register({required: "Days is required"})}
                />
                <ErrorMessage errors={errors} name="days" className="invalid-feedback" as="p"></ErrorMessage>
              </FormGroup>
           
          </Container>
        </ModalBody>
        <ModalFooter>
        <SpinnerButton type="submit" color= {roe.id ? "secondary" : "primary"} loading={createLoading || updateLoading}>{roe.id ? "Save" : "Create"}</SpinnerButton>
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

export default RoeEditor;
