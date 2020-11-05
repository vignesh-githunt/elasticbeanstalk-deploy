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
  Row,
  Col
} from "reactstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import SpinnerButton from '../Extras/SpinnerButton';
import CREATE_STORY from "../mutations/CreateStory"
import UPDATE_STORY from "../mutations/UpdateStory";
import CONTACTSELECTORS_QUERY from "../queries/ContactSelectorsQuery"
import ACCOUNTSELECTORS_QUERY from "../queries/AccountSelectorsQuery"
import ROE_QUERY from "../queries/RoeQuery"
import {useTracking} from '../SegmentTracker'
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {name} from "../Forms/FormValidatorPattern";

const StoryEditor = ({ customerId, story }) => {
  const {handleSubmit,register,errors}=useForm({});
  const tracker = useTracking();
  const [createStory, { loading: createStoryLoading }] = useMutation(CREATE_STORY);
  const [updateStory, {loading: updateStoryLoading }] = useMutation(UPDATE_STORY);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = (data) => {
    const {
      name,
      priority,
      accountSelectorId,
      contactSelectorId,
      rulesOfEngagementId,
      sendingWindowDayStart,
      sendingWindowDayEnd,
      sendingWindowHourStart,
      sendingWindowHourEnd,
    } = data;
    if(story.id) {
      tracker.track('Edit Story Clicked');
      updateStory({
        variables: {
          id: story.id,
          name: name,
          priority: parseInt(priority),
          accountSelectorId: accountSelectorId,
          contactSelectorId: contactSelectorId,
          rulesOfEngagementId: rulesOfEngagementId,
          sendingWindowDayStart: parseInt(sendingWindowDayStart),
          sendingWindowDayEnd: parseInt(sendingWindowDayEnd),
          sendingWindowHourStart: parseInt(sendingWindowHourStart),
          sendingWindowHourEnd: parseInt(sendingWindowHourEnd),
        },
        refetchQueries: ["v3_Customer_Stories"],
      }).then((data) => {
        tracker.track("Story Edited");
        toggleModal();
      });
    } else {
      tracker.track('Create Story Clicked');
      createStory({
        variables: {
          customerId: customerId,
          name: name,
          priority: parseInt(priority),
          accountSelectorId: accountSelectorId,
          contactSelectorId: contactSelectorId,
          rulesOfEngagementId: rulesOfEngagementId,
          pausedAt: new Date()
        },
        refetchQueries: ["v3_Customer_Stories"]
      }).then(data => {
        tracker.track('Story Created');
        toggleModal();
      });
    }
  };

  // const options = Titles.map(title => {
  //   return { value: title, label: title };
  // });
  const {
    data: accountSelectorData,
    loading: accountSelectorLoading
  } = useQuery(ACCOUNTSELECTORS_QUERY, {
    variables: { customerId: customerId }
  });

  const {
    data: contactSelectorData,
    loading: contactSelectorLoading
  } = useQuery(CONTACTSELECTORS_QUERY, {
    variables: { customerId: customerId }
  });

  const {
    data: roeData,
    loading: roeLoading
  } = useQuery(ROE_QUERY, {
    variables: { customerId: customerId }
  });

  if (accountSelectorLoading || contactSelectorLoading || roeLoading )
    return null

  const accountSelectorOptions = (accountSelectorData.v3_Customer_AccountSelectors || []).map((x) => {
    return { value: x.id, label: x.name + " (" + x.totalMatchingAccountsCount + " Matching Accounts)" };
  })

  const contactSelectorOptions = (
    contactSelectorData.v3_Customer_ContactSelectors || []
  ).map(x => {
    return {
      value: x.id,
      label:
        x.name + " (" + x.totalMatchingContactsCount + " Matching Contacts)"
    };
  });

  const roeOptions = (
    roeData.v3_Customer_Roe_Bases || []
  ).map(x => {
    return {
      value: x.id,
      label: x.name
    };
  });

  return (
    <React.Fragment>
      {story.id ? (
        <Button
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            toggleModal();
          }}
        >
          <i className="fa fa-edit mr-2"></i>Edit
        </Button>
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
        <Form name="formStory" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal}>
            {story.id ? "Edit Story" : "Create Story"}
          </ModalHeader>
          <ModalBody>
            <Container className="container-md">
              <FormGroup>
                <label>Type</label>
                <select
                  className="custom-select custom-select-sm"
                  name="default"
                >
                  <option value="Default">Default</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Name</label>
                <Input
                  type="text"
                  placeholder="Name"
                  name="name"
                  invalid={errors.name}
                  innerRef={register(name)}
                  defaultValue={story.name}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  className="invalid-feedback"
                  as="p"
                ></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Priority</label>
                <select
                  className="custom-select custom-select-sm"
                  name="priority"
                  ref={register({ required: "Priority is required" })}
                  defaultValue={story.priority || 1}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="1000">1000 (Story Preview Mode)</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Account Targeting</label>
                <select
                  name="accountSelectorId"
                  className="custom-select custom-select-sm"
                  invalid={errors.accountSelectorId}
                  ref={register({ required: "Account Targeting is required" })}
                  defaultValue={story.accountSelectorId}
                >
                  <option value="">Select Account Targeting</option>
                  {accountSelectorOptions.map((x) => (
                    <option key={x.value} value={x.value}>
                      {x.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  errors={errors}
                  name="accountSelectorId"
                  style={{
                    fontSize: "80%",
                    color: "#F45B53",
                    marginTop: "0.25rem",
                  }}
                  as="p"
                ></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Persona Targeting</label>
                <select
                  className="custom-select custom-select-sm"
                  name="contactSelectorId"
                  invalid={errors.contactSelectorId}
                  ref={register({ required: "Contact Targeting is required" })}
                  defaultValue={story.contactSelectorId}
                >
                  <option value="">Select Contact Targeting</option>
                  {contactSelectorOptions.map((x) => (
                    <option key={x.value} value={x.value}>
                      {x.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  errors={errors}
                  name="contactSelectorId"
                  style={{
                    fontSize: "80%",
                    color: "#F45B53",
                    marginTop: "0.25rem",
                  }}
                  as="p"
                ></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Rules of Engagement</label>
                <select
                  className="custom-select custom-select-sm"
                  name="rulesOfEngagementId"
                  invalid={errors.rulesOfEngagementId}
                  ref={register({
                    required: "Rules of Engagement is required",
                  })}
                  defaultValue={story.rulesOfEngagementId}
                >
                  <option value="">Select Rules of Engagement</option>
                  {roeOptions.map((x) => (
                    <option key={x.value} value={x.value}>
                      {x.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  errors={errors}
                  name="rulesOfEngagementId"
                  style={{
                    fontSize: "80%",
                    color: "#F45B53",
                    marginTop: "0.25rem",
                  }}
                  as="p"
                ></ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col>
                    <label>Sending Window Start Day</label>
                    <select
                      className="custom-select custom-select-sm"
                      name="sendingWindowDayStart"
                      ref={register({ required: "Sending window is required" })}
                      defaultValue={story.sendingWindowDayStart || 1}
                    >
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                      <option value="0">Sunday</option>
                    </select>
                  </Col>
                  <Col>
                    <label>Sending Window End Day</label>
                    <select
                      className="custom-select custom-select-sm"
                      name="sendingWindowDayEnd"
                      ref={register({ required: "Sending window is required" })}
                      defaultValue={story.sendingWindowDayEnd || 5}
                    >
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                      <option value="0">Sunday</option>
                    </select>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col>
                    <label>Sending Window Start Hour</label>
                    <select
                      className="custom-select custom-select-sm"
                      name="sendingWindowHourStart"
                      ref={register({ required: "Sending window is required" })}
                      defaultValue={story.sendingWindowHourStart || 5}
                    >
                      <option value="0">12 am</option>
                      <option value="1">1 am</option>
                      <option value="2">2 am</option>
                      <option value="3">3 am</option>
                      <option value="4">4 am</option>
                      <option value="5">5 am</option>
                      <option value="6">6 am</option>
                      <option value="7">7 am</option>
                      <option value="8">8 am</option>
                      <option value="9">9 am</option>
                      <option value="10">10 am</option>
                      <option value="11">11 am</option>
                      <option value="12">12 pm</option>
                      <option value="13">1 pm</option>
                      <option value="14">2 pm</option>
                      <option value="15">3 pm</option>
                    </select>
                  </Col>
                  <Col>
                    <label>Sending Window End Hour</label>
                    <select
                      className="custom-select custom-select-sm"
                      name="sendingWindowHourEnd"
                      ref={register({ required: "Sending window is required" })}
                      defaultValue={story.sendingWindowHourEnd || 10}
                    >
                      <option value="0">12 am</option>
                      <option value="1">1 am</option>
                      <option value="2">2 am</option>
                      <option value="3">3 am</option>
                      <option value="4">4 am</option>
                      <option value="5">5 am</option>
                      <option value="6">6 am</option>
                      <option value="7">7 am</option>
                      <option value="8">8 am</option>
                      <option value="9">9 am</option>
                      <option value="10">10 am</option>
                      <option value="11">11 am</option>
                      <option value="12">12 pm</option>
                      <option value="13">1 pm</option>
                      <option value="14">2 pm</option>
                      <option value="15">3 pm</option>
                    </select>
                  </Col>
                </Row>
              </FormGroup>
            </Container>
          </ModalBody>
          <ModalFooter>
            <SpinnerButton
              type="submit"
              color={story.id ? "secondary" : "primary"}
              loading={createStoryLoading || updateStoryLoading}
            >
              {story.id ? "Save" : "Create"}
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

export default StoryEditor;

