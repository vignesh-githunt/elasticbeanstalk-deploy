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

import CREATE_CONTACT_SELECTOR from '../mutations/CreateContactSelector';
import UPDATE_CONTACT_SELECTOR from '../mutations/UpdateContactSelector';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { Titles } from '@koncert/shared-components';
import { useTracking } from '../SegmentTracker/index';
import SpinnerButton from '../Extras/SpinnerButton';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { name } from '../Forms/FormValidatorPattern';

const ContactSelectorEditor = ({ customerId, contactSelector }) => {
  const { handleSubmit, register, errors } = useForm({
    defaultValues: { name: contactSelector.name },
  });
  const tracker = useTracking();
  const [createContactSelector, { loading: createLoading }] = useMutation(
    CREATE_CONTACT_SELECTOR
  );
  const [updateContactSelector, { loading: updateLoading }] = useMutation(
    UPDATE_CONTACT_SELECTOR
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isInvalidDualList, setIsInvalidDualList] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const [selectedRequiredTitles, setSelectedRequiredTitles] = useState(
    contactSelector.requiredDataPoints.map((dp) => {
      if (dp.dataPointType === 'Title') {
        return dp.value;
      }
      return null;
    }) || []
  );

  const onChange = (selected) => {
    setSelectedRequiredTitles(selected);
  };
  const options = Titles.map((title) => {
    return { value: title, label: title };
  });

  const onSubmit = (data) => {
    const { name } = data;
    if (selectedRequiredTitles.length === 0) {
      setIsInvalidDualList(true);
      return false;
    }
    if (contactSelector.id) {
      tracker.track('Edit ContactSelector Clicked');
      updateContactSelector({
        variables: {
          id: contactSelector.id,
          name: name,
          requiredIndustryDataPoints: selectedRequiredTitles,
          selectorTypee: 'Icp',
        },
        refetchQueries: ['v3_Customer_ContactSelectors'],
      }).then((result) => {
        return tracker.track('ContactSelector Edited');
      });
    } else {
      tracker.track('Create ContactSelector Clicked');
      createContactSelector({
        variables: {
          customerId: customerId,
          name: name,
          requiredTitleDataPoints: selectedRequiredTitles,
          selectorTypee: 'Icp',
        },
        refetchQueries: ['v3_Customer_ContactSelectors'],
      }).then((result) => {
        tracker.track('ContactSelector Created');
      });
    }
    toggleModal();
  };

  return (
    <React.Fragment>
      <Button
        color={contactSelector.id ? 'secondary' : 'primary'}
        onClick={toggleModal}
      >
        {contactSelector.id ? 'Edit' : 'Create new'}
      </Button>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <Form name="formContactSelector" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal}>
            {contactSelector.id
              ? 'Edit Persona Definition'
              : 'Create Persona Definition'}
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
                <label>Required Titles</label>
                <DualListBox
                  canFilter
                  options={options}
                  selected={selectedRequiredTitles}
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
                    Select at least one Titles
                  </span>
                )}
              </FormGroup>
            </Container>
          </ModalBody>
          <ModalFooter>
            <SpinnerButton
              type="submit"
              color={contactSelector.id ? 'secondary' : 'primary'}
              loading={createLoading || updateLoading}
            >
              {contactSelector.id ? 'Save' : 'Create'}
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

export default ContactSelectorEditor;
