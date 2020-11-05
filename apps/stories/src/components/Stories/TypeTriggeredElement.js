import React, { useState } from 'react';
import {
  Button,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  CardHeader,
  CardTitle,
  CardBody,
  Card,
} from 'reactstrap';
import { DataPointTypes } from '@koncert/shared-components';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useMutation } from '@apollo/react-hooks';
import { STORYQUERYSTRING } from '../queries/StoryQueryNew';
import { CREATE_TYPETRIGGERED_ELEMENT } from '../mutations/stories/CreateElement';
import { UPDATE_TYPETRIGGERED_ELEMENT } from '../mutations/stories/UpdateElement';
import SpinnerButton from '../Extras/SpinnerButton';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { text } from '../Forms/FormValidatorPattern';
import useSendersList from '../hooks/useSenderList';

const TypeTriggeredElement = ({
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
  const { handleSubmit, register, errors } = useForm({
    defaultValues: { text: element.text },
  });
  const plotPointAsDefaultId = isDefault ? plotPoint.id : null;
  const plotPointAsAdditionalId = !isDefault ? plotPoint.id : null;
  const [weight, setWeight] = useState(element.weight || 20);
  const [createTypeTriggeredElement, { loading: createLoading }] = useMutation(
    CREATE_TYPETRIGGERED_ELEMENT
  );
  const [isInvalidDualList, setIsInvalidDualList] = useState(false);
  const [updateTypeTriggeredElement, { loading: updateLoading }] = useMutation(
    UPDATE_TYPETRIGGERED_ELEMENT
  );
  const options = DataPointTypes.map((dp) => {
    return { value: dp, label: dp };
  });

  const { SendersDropdown, senderId } = useSendersList(
    customerId,
    user,
    userLoading,
    element.senderId
  );
  const marks = {
    '-10': '-10',
    0: <strong className="text-info">0</strong>,
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    60: '60',
    70: '70',
    80: '80',
    90: '90',
    100: '100',
  };

  const [selectedRequiredData, setSelectedRequiredData] = useState(
    element.triggerDataPoints.map((dp) => {
      return dp.dataPointType;
    }) || []
  );

  const [triggerDataPoints, setTriggerDataPoints] = useState(
    element.triggerDataPoints || []
  );

  const onChange = (selected) => {
    setSelectedRequiredData(selected);
  };

  const handleTriggerDataPoints = () => {
    let dps = [];
    selectedRequiredData.map((data) => {
      return dps.push({ dataPointType: data, dataSource: 'LegacyDb' });
    });
    setTriggerDataPoints(dps);
    // console.log(dps)
    return dps;
  };

  const onSubmit = (data) => {
    if (selectedRequiredData.length === 0) {
      setIsInvalidDualList(true);
      return false;
    }
    const { text } = data;
    let dataPoints = handleTriggerDataPoints();
    console.log(triggerDataPoints);
    if (element.id) {
      updateTypeTriggeredElement({
        variables: {
          id: element.id,
          text: text,
          weight: weight,
          dataPoints: dataPoints,
          senderId: senderId,
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id },
            awaitRefetchQueries: true,
          },
        ],
      }).then((result) => {
        toggleModal();
        onModified();
      });
    } else {
      createTypeTriggeredElement({
        variables: {
          customerId: customerId,
          senderId: senderId,
          text: text,
          weight: weight,
          plotPointAsDefaultId: plotPointAsDefaultId,
          plotPointAsAdditionalId: plotPointAsAdditionalId,
          dataPoints: dataPoints,
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id },
            awaitRefetchQueries: true,
          },
        ],
      }).then((result) => {
        toggleModal();
        onModified();
      });
    }
    return null;
  };
  return (
    <React.Fragment>
      <Form name="formTypeTriggeredElement" onSubmit={handleSubmit(onSubmit)}>
        <hr />
        <Card className={'border-info'}>
          <CardHeader className="bg-info">
            <CardTitle>Type Triggered Text</CardTitle>
          </CardHeader>
          <CardBody className="">
            This text element will be selected if the Contacts has any data in
            the following selected fields...
          </CardBody>
        </Card>
        <hr />
        <FormGroup className="pb-4 bb">
          <label className="mr-2">Select Sender (optional)</label>
          <SendersDropdown />
        </FormGroup>
        <FormGroup className="pb-4">
          <label>Importance (weight)</label>
          <Slider
            dots
            marks={marks}
            step={5}
            defaultValue={weight}
            onChange={(value) => setWeight(value)}
          />
        </FormGroup>
        <hr />
        <FormGroup>
          <label>Required Data Fields</label>
          <DualListBox
            canFilter
            options={options}
            selected={selectedRequiredData}
            onChange={onChange}
          />
          {isInvalidDualList && (
            <span
              style={{
                fontSize: '80%',
                color: '#F45B53',
                marginTop: '0.25rem',
              }}
            >
              Select at least one trigger element
            </span>
          )}
        </FormGroup>
        <FormGroup>
          <label>Text</label>
          <Input
            rows={10}
            type="textarea"
            name="text"
            invalid={errors.text}
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
            color={element.id ? 'secondary' : 'primary'}
            loading={createLoading || updateLoading}
          >
            {element.id ? 'Save' : 'Create'}
          </SpinnerButton>{' '}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </React.Fragment>
  );
};

export default TypeTriggeredElement;
