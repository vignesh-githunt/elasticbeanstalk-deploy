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
import { useQuery, useMutation } from "@apollo/react-hooks";
import SpinnerButton from '../Extras/SpinnerButton';
import CREATE_AAL from "../mutations/AccountAssignmentLogicMutations"
import {
  ACCOUNT_ASSIGNMENT_LOGIC_QUERY,
  ACCOUNT_ASSIGNMENT_LOGIC_COUNT_QUERY,
} from "../queries/AccountAssignmentLogicQuery";
import {useTracking} from '../SegmentTracker'
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {name} from "../Forms/FormValidatorPattern";
import { useEffect } from "react";

const AALEditor = ({ customerId, aal }) => {
  const {handleSubmit,register,errors}=useForm({defaultValues: { name: aal.name }});
  const tracker = useTracking();

  const { data, loading } = useQuery(ACCOUNT_ASSIGNMENT_LOGIC_COUNT_QUERY, {
    variables: {
      customerId: customerId
    }
  });

  const [createAAL, { loading: createLoading }] = useMutation(CREATE_AAL);
  const [isOpen, setIsOpen] = useState(false);
  const [aalCount, setAalCount] = useState(0);

  useEffect(() => {
    if (!loading && data && data._v3_Customer_AccountAssignmentLogicsMeta)
      setAalCount(data._v3_Customer_AccountAssignmentLogicsMeta.count);
  }, [data, loading])

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const onSubmit = ({ name }) => {
    tracker.track('Create AAL Clicked')
    createAAL({
      variables: {
        customerId: customerId,
        name: name,
        priority: aalCount + 1,
      },
      refetchQueries: [
        {
          query: ACCOUNT_ASSIGNMENT_LOGIC_QUERY,
          variables: {
            customerId: customerId,
          },
        },
        {
          query: ACCOUNT_ASSIGNMENT_LOGIC_COUNT_QUERY,
          variables: {
            customerId: customerId,
          },
        },
      ],
    }).then((result) => {
      tracker.track("AAL Created");
    });   
  
    toggleModal();
  };

  if (loading)
  return <i className="fa fa-spinner fa-spin"></i>

  return (
    <React.Fragment>
      {aal.id ? (
        <a
          className="card-footer bg-gray-dark bt0 clearfix btn-block d-flex"
          href="#/"
          onClick={(e) => {
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
          onClick={(e) => {
            e.preventDefault();
            toggleModal();
          }}
        >
          Create new
        </Button>
      )}

      <Modal isOpen={isOpen} toggle={toggleModal}>
        <Form name="formAAL" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal}>
            {aal.id
              ? "Edit Account Assignment Logic"
              : "Create Account Assignment Logic"}
          </ModalHeader>
          <ModalBody>
            <Container className="container-md">
              <FormGroup>
                <label>Name</label>
                <Input
                  type="text"
                  placeholder="Name"
                  name="name"
                  invalid={errors.name}
                  innerRef={register(name)}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  className="invalid-feedback"
                  as="p"
                ></ErrorMessage>
              </FormGroup>
            </Container>
          </ModalBody>
          <ModalFooter>
            <SpinnerButton
              type="submit"
              color={aal.id ? "secondary" : "primary"}
              loading={ createLoading }
            >
              {aal.id ? "Save" : "Create"}
            </SpinnerButton>{" "}
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AALEditor;
