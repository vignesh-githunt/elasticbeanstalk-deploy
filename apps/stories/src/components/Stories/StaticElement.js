import React, { useState } from "react";
import {
  Button,
  ModalFooter,
  Form,
  FormGroup,
  CardHeader,
  CardTitle,
  CardBody,
  Card,
  Input
} from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import { STORYQUERYSTRING } from "../queries/StoryQueryNew";
import { CREATE_STATIC_ELEMENT } from "../mutations/stories/CreateElement";
import { UPDATE_STATIC_ELEMENT } from "../mutations/stories/UpdateElement";
import SpinnerButton from "../Extras/SpinnerButton";
import { useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { text } from "../Forms/FormValidatorPattern";
import useSendersList from "../hooks/useSenderList";

const StaticElement = ({
  element,
  plotPoint,
  isDefault,
  toggleModal,
  customerId,
  story,
  user,
  userLoading,
  onModified,
}) => {
  const { handleSubmit, register, errors } = useForm({defaultValues: { text: element.text }});
  const plotPointAsDefaultId = isDefault ? plotPoint.id : null;
  const plotPointAsAdditionalId = !isDefault ? plotPoint.id : null;
  const [weight] = useState(element.weight || 0);

  const [createStaticElement, { loading: createLoading }] = useMutation(
    CREATE_STATIC_ELEMENT
  );
  const [updateStaticElement, { loading: updateLoading }] = useMutation(
    UPDATE_STATIC_ELEMENT
  );

  const { SendersDropdown, senderId } = useSendersList(
    customerId,
    user,
    userLoading,
    element.senderId
  );

  const onSubmit = (data) => {
    const { text } = data;
    if (element.id) {
      updateStaticElement({
        variables: {
          id: element.id,
          text: text,
          weight: weight,
          senderId: senderId
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id },
            awaitRefetchQueries: true
          }
        ]
      }).then((result) => {
        toggleModal();
        onModified();
      });
    } else {
      createStaticElement({
        variables: {
          customerId: customerId,
          text: text,
          weight: weight,
          senderId: senderId,
          plotPointAsDefaultId: plotPointAsDefaultId,
          plotPointAsAdditionalId: plotPointAsAdditionalId
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id },
            awaitRefetchQueries: true
          }
        ]
      }).then((result) => {
        toggleModal();
        onModified();
      });
    }
  };
  return (
    <React.Fragment>
      <Form name="formStaticElement" onSubmit={handleSubmit(onSubmit)}>
        <hr />
        <Card className={"border-info"}>
          <CardHeader className="bg-info">
            <CardTitle>Static Text Trigger</CardTitle>
          </CardHeader>
          <CardBody className="">
            Static text elements are not allowed to contain any variables
          </CardBody>
        </Card>
        <hr />
        <FormGroup className="pb-4 bb">
          <label className="mr-2">Select Sender (optional)</label>
          <SendersDropdown />
        </FormGroup>
        <FormGroup>
          <label>Text</label>
          <Input
            className="form-control"
            type="textarea"
            name="text"
            invalid={errors.text}
            rows={10}
            placeholder="Text"
            innerRef={register(text)}
          />
          <ErrorMessage
            errors={errors}
            className="invalid-feedback"
            name="text"
            as="p"
          ></ErrorMessage>
        </FormGroup>

        <ModalFooter>
          <SpinnerButton
            type="submit"
            color={element.id ? "secondary" : "primary"}
            loading={createLoading || updateLoading}
          >
            {element.id ? "Save" : "Create"}
          </SpinnerButton>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </React.Fragment>
  );
};

export default StaticElement;
