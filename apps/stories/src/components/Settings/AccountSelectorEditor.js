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

import CREATE_ACCOUNT_SELECTOR from '../mutations/CreateAccountSelector';
import UPDATE_ACCOUNT_SELECTOR from '../mutations/UpdateAccountSelector';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { Industries } from '@koncert/shared-components';
import { useTracking } from '../SegmentTracker';
import SpinnerButton from '../Extras/SpinnerButton';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { name } from '../Forms/FormValidatorPattern';

const AccountSelectorEditor = ({ customerId, accountSelector }) => {
  const { handleSubmit, register, errors } = useForm({
    defaultValues: { name: accountSelector.name },
  });
  const tracker = useTracking();
  const [createAccountSelector, { loading: createLoading }] = useMutation(
    CREATE_ACCOUNT_SELECTOR
  );
  const [updateAccountSelector, { loading: updateLoading }] = useMutation(
    UPDATE_ACCOUNT_SELECTOR
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isInvalidDualList, setIsInvalidDualList] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const onSubmit = (data) => {
    const { name } = data;
    if (selectedRequiredIndustries.length === 0) {
      setIsInvalidDualList(true);
      return false;
    }
    tracker.track('Create AccountSelector Clicked');
    if (accountSelector.id) {
      updateAccountSelector({
        variables: {
          id: accountSelector.id,
          name: name,
          requiredIndustryDataPoints: selectedRequiredIndustries,
          selectorTypee: 'Icp',
        },
        refetchQueries: ['v3_Customer_AccountSelectors'],
      }).then((result) => {
        tracker.track('AccountSelector Edited');
      });
    } else {
      createAccountSelector({
        variables: {
          customerId: customerId,
          name: name,
          requiredIndustryDataPoints: selectedRequiredIndustries,
          selectorTypee: 'Icp',
        },
        refetchQueries: ['v3_Customer_AccountSelectors'],
      }).then((result) => {
        tracker.track('AccountSelector Created');
      });
    }
    toggleModal();
  };

  const options = Industries.map((industry) => {
    return { value: industry, label: industry };
  });

  const [selectedRequiredIndustries, setSelectedRequiredIndustries] = useState(
    accountSelector.requiredDataPoints.map((dp) => {
      if (dp.dataPointType === 'Industry') {
        return dp.value;
      }
      return null;
    }) || []
  );

  const onChange = (selected) => {
    setSelectedRequiredIndustries(selected);
  };

  return (
    <React.Fragment>
      <Button
        color={accountSelector.id ? 'secondary' : 'primary'}
        onClick={toggleModal}
      >
        {accountSelector.id ? 'Edit' : 'Create new'}
      </Button>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <Form name="formAccountSelector" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal}>
            Create Ideal Customer Profile Definition
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
                <label>Required Industries</label>
                <DualListBox
                  canFilter
                  name="requiredindustries"
                  options={options}
                  selected={selectedRequiredIndustries}
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
                    Select at least one industries
                  </span>
                )}
              </FormGroup>
            </Container>
          </ModalBody>
          <ModalFooter>
            <SpinnerButton
              type="submit"
              color={accountSelector.id ? 'secondary' : 'primary'}
              loading={createLoading || updateLoading}
            >
              {accountSelector.id ? 'Save' : 'Create'}
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

export default AccountSelectorEditor;
