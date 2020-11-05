import React, { useState } from 'react';
import {
  Button,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
  CardHeader,
  CardTitle,
  CardBody,
  Card,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { DataPointTypes } from '@koncert/shared-components';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { STORYQUERYSTRING } from '../queries/StoryQueryNew';
import { CREATE_VALUETRIGGERED_ELEMENT } from '../mutations/stories/CreateElement';
import { UPDATE_VALUETRIGGERED_ELEMENT } from '../mutations/stories/UpdateElement';
import { VALUETRIGGERED_ELEMENTS_QUERY } from '../queries/ElementsQueries';
import SpinnerButton from '../Extras/SpinnerButton';
import { ElementPreview } from './ElementPreview';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { text } from '../Forms/FormValidatorPattern';
import useSendersList from '../hooks/useSenderList';
import classnames from 'classnames';
import ContactsDataTable from '../ContactsDataTable';

const SimilarElementSearch = ({ customerId, senderId, dataPointType }) => {
  const triggerDataPoint = `V3::Data::DataPoints::${dataPointType}`;
  const { data, loading, error } = useQuery(VALUETRIGGERED_ELEMENTS_QUERY, {
    variables: {
      customerId,
      senderId,
      triggerDataPoint,
    },
    skip: !dataPointType,
  });

  if (!dataPointType)
    return <CardBody>Select a data point to see examples </CardBody>;

  if (loading) {
    return <CardBody>Loading...</CardBody>;
  }

  if (error) return <CardBody>Error...</CardBody>;

  return (
    <div>
      {data.v3_Customer_StoryComponents_Elements_ValueTriggereds.map(
        (element) => {
          return (
            <ElementPreview
              key={element.id}
              elementText={element.text}
              showTriggerDataPoints={true}
              triggerDataPoints={element.triggerDataPoints}
            />
          );
        }
      )}
    </div>
  );
};

const ValueTriggeredElement = ({
  element,
  plotPoint,
  isDefault,
  toggleModal,
  customerId,
  user,
  userLoading,
  story,
  onModified,
}) => {
  const { handleSubmit, register, errors, getValues, setValue } = useForm({
    defaultValues: { text: element.text },
  });
  const plotPointAsDefaultId = isDefault ? plotPoint.id : null;
  const plotPointAsAdditionalId = !isDefault ? plotPoint.id : null;
  const [weight, setWeight] = useState(element.weight || 20);
  const [isInvalidDualList, setIsInvalidDualList] = useState(false);
  const [createValueTriggeredElement, { loading: createLoading }] = useMutation(
    CREATE_VALUETRIGGERED_ELEMENT
  );
  const [updateValueTriggeredElement, { loading: updateLoading }] = useMutation(
    UPDATE_VALUETRIGGERED_ELEMENT
  );
  const [activeTab, setActiveTab] = useState('1');
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
    handleTriggerDataPoints(selected);
  };

  const handleTriggerDataPoints = (selected) => {
    const dps = [];
    selected.map((data) => {
      let v = '';
      const dp = triggerDataPoints.filter((x) => x.dataPointType === data);
      if (dp.length) {
        v = getValues(data);
      }

      dps.push({
        dataPointType: data,
        dataSource: 'LegacyDb',
        value: v || undefined,
      });
      return null;
    });

    setTriggerDataPoints([...dps]);
    return dps;
  };

  const onSubmit = (data) => {
    const { text } = data;
    if (selectedRequiredData.length === 0) {
      setIsInvalidDualList(true);
      return false;
    }
    const dataPoints = handleTriggerDataPoints(selectedRequiredData);
    if (element.id) {
      dataPoints.map((x) => {
        return delete x.dataSource;
      });
      updateValueTriggeredElement({
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
      createValueTriggeredElement({
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
  const hasError = (errors, inputName) => {
    return errors[inputName];
  };
  const dynamicFieldMessage = (inputName) => {
    return inputName + ' is required';
  };
  return (
    <Form name="formValueTriggeredElement" onSubmit={handleSubmit(onSubmit)}>
      <hr />
      <Card className={'border-info'}>
        <CardHeader className="bg-warning">
          <CardTitle>Value Triggered Text</CardTitle>
        </CardHeader>
        <CardBody className="">
          This text element will be selected if the Contacts has specific data
          in the below selected fields provided that they have the exact values
          also provided below
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
      {triggerDataPoints.map((data, index) => {
        const controlName = data.dataPointType;
        const v = getValues(controlName);
        if (v === undefined || v === '') {
          setValue(controlName, data.value);
        } else {
          setValue(controlName, v);
        }
        return (
          <FormGroup key={index}>
            <label>{data.dataPointType}</label>
            <Input
              type={'text'}
              name={data.dataPointType}
              invalid={hasError(errors, controlName)}
              innerRef={register({
                required: dynamicFieldMessage(controlName),
              })}
            />
            <ErrorMessage
              errors={errors}
              className="invalid-feedback"
              name={data.dataPointType}
              as="p"
            ></ErrorMessage>
          </FormGroup>
        );
      })}
      <Row>
        <Col xl={6}>
          <FormGroup>
            <label>Text</label>
            <Input
              rows={10}
              type="textarea"
              placeholder="Text"
              name="text"
              invalid={errors.text}
              innerRef={register(text)}
            />
            <ErrorMessage
              errors={errors}
              className="invalid-feedback"
              name="text"
              as="p"
            ></ErrorMessage>
          </FormGroup>
        </Col>
        <Col xl={6}>
          <div role="tabpanel">
            {/* Nav tabs */}
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => {
                    setActiveTab('1');
                  }}
                >
                  Related Snippets
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => {
                    setActiveTab('2');
                  }}
                >
                  <span className="text-muted">Suggested Values</span>
                </NavLink>
              </NavItem>
            </Nav>
            {/* Tab panes */}
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Card className="b">
                  {triggerDataPoints.map((dataPoint, index) => {
                    return (
                      <SimilarElementSearch
                        key={index}
                        dataPointType={dataPoint.dataPointType}
                        customerId={customerId}
                      />
                    );
                  })}
                </Card>
              </TabPane>
              <TabPane tabId="2">
                <Card className="b">
                  {triggerDataPoints.map((dataPoint, index) => {
                    return (
                      <ContactsDataTable
                        customerId={customerId}
                        currentUser={user}
                        userLoading={userLoading}
                        senderId={senderId}
                        dataPoint={dataPoint.dataPointType}
                      />
                    );
                  })}
                </Card>
              </TabPane>
            </TabContent>
          </div>
        </Col>
      </Row>

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
  );
};

export default ValueTriggeredElement;
