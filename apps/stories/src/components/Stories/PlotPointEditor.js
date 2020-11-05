import React, { useState } from 'react';
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
} from 'reactstrap';
import { useMutation } from '@apollo/react-hooks';
import { STORYQUERYSTRING } from '../queries/StoryQueryNew';
import CREATE_PLOTPOINT from '../mutations/stories/CreatePlotPoint';
import UPDATE_PLOTPOINT from '../mutations/stories/UpdatePlotPoint';
import SpinnerButton from '../Extras/SpinnerButton';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { name } from '../Forms/FormValidatorPattern';

const PlotPointEditor = ({ customerId, story, message, plotPoint }) => {
  const { handleSubmit, register, errors } = useForm({
    defaultValues: { name: plotPoint.name },
  });
  const [createPlotPoint, { loading: createLoading }] = useMutation(
    CREATE_PLOTPOINT
  );
  const [updatePlotPoint, { loading: updateLoading }] = useMutation(
    UPDATE_PLOTPOINT
  );
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(
    plotPoint.position || message.plotPoints.length + 1
  );

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = (data) => {
    const { name } = data;
    if (plotPoint.id) {
      updatePlotPoint({
        variables: {
          id: plotPoint.id,
          name: name,
          position: parseInt(position),
          messageId: plotPoint.messageId,
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id },
          },
        ],
      }).then((result) => {
        toggleModal();
      });
    } else {
      createPlotPoint({
        variables: {
          name: name,
          storyId: story.id,
          position: parseInt(position),
          messageId: message.id,
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id },
          },
        ],
      }).then((result) => {
        toggleModal();
      });
    }
  };

  return (
    <React.Fragment>
      {plotPoint.id ? (
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            toggleModal();
          }}
        >
          <i className="fa fa-edit"></i>
        </a>
      ) : (
        <div
          onClick={(e) => {
            e.preventDefault();
            toggleModal();
          }}
          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <span className="circle bg-white mr-2"></span>
          <span>
            <i className="fa fa-plus"></i> Add
          </span>
        </div>
      )}

      <Modal isOpen={isOpen} toggle={toggleModal}>
        <Form name="formPlotPoint" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal}>
            {plotPoint.id ? 'Edit PlotPoint' : 'Create PlotPoint'}
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
              <FormGroup>
                <label>Position</label>
                <select
                  className="custom-select"
                  onChange={(e) => setPosition(e.target.value)}
                  value={position}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </Container>
          </ModalBody>
          <ModalFooter>
            <SpinnerButton
              type="submit"
              color={plotPoint.id ? 'secondary' : 'primary'}
              loading={createLoading || updateLoading}
            >
              {plotPoint.id ? 'Save' : 'Create'}
            </SpinnerButton>{' '}
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default PlotPointEditor;
