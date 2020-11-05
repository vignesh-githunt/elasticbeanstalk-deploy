import React, {
  useState,
} from "react";
import DualListBox from "react-dual-listbox";
import {
  Row,
  Table,
  Col,
  CardBody,
  Input,
  FormGroup
} from "reactstrap";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import INTEGRATION_QUERY from "../queries/IntegrationQuery";
import { SALESFORCE_FIELDS_QUERY } from "../queries/SalesforceFieldsQuery";
import { SALESFORCE_REPORTS_QUERY } from "../queries/SalesforceReportsQuery";
import SAVE_INTEGRATION_SETTINGS, {
  SAVE_INTEGRATION_FIELDS,
  RUN_INTEGRATION_SETUP,
  SAVE_INTEGRATION_DNC_REPORT,
} from "../mutations/SaveIntegrationSettings";
import DELETE_INTEGRATION from "../mutations/DeleteIntegration";
import Avatar from "../../images/default-avatar.jpg";
import moment from "moment";
import Swal from "../Elements/Swal";
import Loader from "../Loader";

export const SalesforceSettings = ({ integration, history }) => {

  const [syncOnlyUsedAccounts, setSyncOnlyUsedAccounts] = useState(
    integration.syncOnlyUsedAccounts
  );
  const [syncOnlyUsedContacts, setSyncOnlyUsedContacts] = useState(
    integration.syncOnlyUsedContacts
  );

  const [deleteIntegration] = useMutation(DELETE_INTEGRATION);
  const [
    saveSettings,
    { loading: saveLoading, error: saveError },
  ] = useMutation(SAVE_INTEGRATION_SETTINGS);
  
  const [runIntegrationSetup, { loading: setupLoading, error: setupError }] = useMutation(
    RUN_INTEGRATION_SETUP
  );

  const deleteOption = {
    title: 'Are you sure?',
    text: 'Your will not be able to recover this integration setup!',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel!',
        value: null,
        visible: true,
        className: "",
        closeModal: false
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false
      }
    }
  }

  const swalCallback5 = (isConfirm, swal) => {
    if (isConfirm) {
      deleteIntegration({
        variables: {
          id: integration.id,
        },
        refetchQueries: ["v3_Customer_Integrations"],
      });
      swal("Deleted!", "Your integration has been deleted.", "success");
      history.push("/settings/integrations");
    } else {
      swal("Cancelled", "Your integration is safe!", "error");
    }
  };

  const save = (contacts, accounts) => {
    saveSettings({
      variables: {
        id: integration.id,
        syncOnlyUsedAccounts: accounts,
        syncOnlyUsedContacts: contacts,
      },
    }).then((result) => {
      // do something
    })
  }

  const runSetup = () => {
    runIntegrationSetup({
      variables: {
        customerId: integration.customerId,
      },
      refetchQueries: [{ query: INTEGRATION_QUERY, variables: { id: integration.id } }],
    }).then((result) => {
      // do something
    });
  };

  if (saveError || setupError)
    return <p>Error</p>


  return (
    <div className="card">
      {saveLoading && <Loader />}
      {!saveLoading && (
        <div className="card-body">
          <div className="checkbox c-checkbox">
            <label>
              <Input
                type="checkbox"
                defaultChecked={syncOnlyUsedAccounts}
                onChange={(e) => {
                  setSyncOnlyUsedAccounts(!syncOnlyUsedAccounts);
                  save(syncOnlyUsedContacts, e.target.checked);
                }}
                className="form-check-input"
                name="syncOnlyUsedAccounts"
              />
              <span className="fa fa-check"></span>
              Only sync Accounts that have been selected by stories
            </label>
          </div>
          <div className="checkbox c-checkbox">
            <label>
              <Input
                type="checkbox"
                defaultChecked={syncOnlyUsedContacts}
                className="form-check-input"
                onChange={(e) => {
                  setSyncOnlyUsedContacts(!syncOnlyUsedContacts);
                  save(e.target.checked, syncOnlyUsedAccounts);
                }}
              />
              <span className="fa fa-check"></span>
              Only sync Contacts that have been selected by stories
            </label>
          </div>
        </div>
      )}
      {setupLoading && <Loader></Loader>}
      {!integration.initialSetupCompleted && !setupLoading && (
        <div className="card-body">
          <button className="btn btn-primary" onClick={() => runSetup()}>
            Run initial Setup
          </button>
        </div>
      )}
      {integration.initialSetupCompleted && (
        <div className="checkbox c-checkbox">
          <label>
            <Input
              type="checkbox"
              defaultChecked={integration.initialSetupCompleted}
              disabled
              className="form-check-input"
            />
            <span className="fa fa-check"></span>
            Initial Setup Completed.
          </label>
        </div>
      )}
      <div className="card-body">
        <Swal
          options={deleteOption}
          callback={swalCallback5}
          className="btn btn-danger pull-right"
        >
          Delete Integration
        </Swal>
      </div>
    </div>
  );
};

export const SalesforceFieldMapping = ({ integration }) => {
  // Fetch the fields directly from sfdc, cache in the integration
  // Present the fileds in a dual list box with a pre-selection of fields
  // Separate sections for the Lead, Contact, Account, and Opportunity
  // saving the fields should update the selected_fields property on the plugin for the given object
  
  // Have another section that shows the field mapping too
  const {data: accountFieldsData, loading: accountsLoading, error} = useQuery(SALESFORCE_FIELDS_QUERY, {
    variables: { integrationId: integration.id, sobjectName: "Account"}
  })
  const {data: contactFieldsData, loading: contactsLoading} = useQuery(SALESFORCE_FIELDS_QUERY, {
    variables: { integrationId: integration.id, sobjectName: "Contact"}
  })
  const {data: opportunityFieldsData, loading: opportunitiesLoading} = useQuery(SALESFORCE_FIELDS_QUERY, {
    variables: { integrationId: integration.id, sobjectName: "Opportunity"}
  })
  const {data: leadFieldsData, loading: leadsLoading} = useQuery(SALESFORCE_FIELDS_QUERY, {
    variables: { integrationId: integration.id, sobjectName: "Lead"}
  })

  const [
    saveFields,
    { loading: saveLoading, error: saveError },
  ] = useMutation(SAVE_INTEGRATION_FIELDS);

  const [selectedAccountFields, setSelectedAccountFields] = useState(integration.selectedAccountFields)
  const [selectedContactFields, setSelectedContactFields] = useState(integration.selectedContactFields)
  const [selectedOpportunityFields, setSelectedOpportunityFields] = useState(integration.selectedOpportunityFields)
  const [selectedLeadFields, setSelectedLeadFields] = useState(integration.selectedLeadFields)

  if (
    accountsLoading ||
    contactsLoading ||
    opportunitiesLoading ||
    leadsLoading ||
    saveLoading
  )
    return <Loader />;

  if(error || saveError)
    return (<div>Error: something went wrong</div>)


  const save = (account, contact, opportunity, lead) => {
    saveFields({
      variables: {
        id: integration.id,
        selectedAccountFields: account,
        selectedContactFields: contact,
        selectedOpportunityFields: opportunity,
        selectedLeadFields: lead,
      },
    }).then((result) => {
      // do something
    });
  };


  const accountFields = accountFieldsData.getSalesforceFields.map((f) => {
    return { value: f.name, label: f.label };
  });

  const onAccountFieldsChange = (selected) => {
    console.log(selected)
    setSelectedAccountFields(selected);
    save(
      selected,
      selectedContactFields,
      selectedOpportunityFields,
      selectedLeadFields
    )
  }

  const contactFields = contactFieldsData.getSalesforceFields.map((f) => {
    return { value: f.name, label: f.label };
  });

  const onContactFieldsChange = (selected) => {
    setSelectedContactFields(selected);
    save(
      selectedAccountFields,
      selected,
      selectedOpportunityFields,
      selectedLeadFields
    )
  }

  const opportunityFields = opportunityFieldsData.getSalesforceFields.map((f) => {
    return { value: f.name, label: f.label };
  });

  const onOpportunityFieldsChange = (selected) => {
    setSelectedOpportunityFields(selected);
    save(
      selectedAccountFields,
      selectedContactFields,
      selected,
      selectedLeadFields
    )
  }
  
  const leadFields = leadFieldsData.getSalesforceFields.map((f) => {
    return { value: f.name, label: f.label };
  });

  const onLeadFieldsChange = (selected) => {
    setSelectedLeadFields(selected);
    save(
      selectedAccountFields,
      selectedContactFields,
      selectedOpportunityFields,
      selected
    )
  }

  return (
    <React.Fragment>
      <CardBody>
        <FormGroup>
          <label>Monitored Account Fields</label>
          <DualListBox
            canFilter
            options={accountFields}
            selected={selectedAccountFields}
            onChange={onAccountFieldsChange}
          />
        </FormGroup>
      </CardBody>
      <CardBody>
        <FormGroup>
          <label>Monitored Contact Fields</label>
          <DualListBox
            canFilter
            options={contactFields}
            selected={selectedContactFields}
            onChange={onContactFieldsChange}
          />
        </FormGroup>
      </CardBody>
      <CardBody>
        <FormGroup>
          <label>Monitored Opportunity Fields</label>
          <DualListBox
            canFilter
            options={opportunityFields}
            selected={selectedOpportunityFields}
            onChange={onOpportunityFieldsChange}
          />
        </FormGroup>
      </CardBody>
      <CardBody>
        <FormGroup>
          <label>Monitored Lead Fields</label>
          <DualListBox
            canFilter
            options={leadFields}
            selected={selectedLeadFields}
            onChange={onLeadFieldsChange}
          />
        </FormGroup>
      </CardBody>
    </React.Fragment>
  );
};

export const SalesforceConnectedUser = ({ identity }) => {

  return (
    <tr key={identity.id}>
      <td>
        <img
          src={Avatar}
          className="rounded-circle thumb24 mr-1"
          alt={identity.nickname}
        />
      </td>
      <td>
        <Link to={"/senders/" + identity.user_id}>{identity.nickname}</Link>
      </td>
      <td>{identity.email}</td>
      <td>{moment(identity.created_at).fromNow()}</td>
      <td>
        
      </td>
    </tr>
  );
};

export const SalesforceConnectedUsers = ({ integration }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>Nickname</th>
          <th>Email</th>
          <th>Connected Since</th>
          <th>Default Story Cadence</th>
        </tr>
      </thead>
      <tbody>
        {integration.protectedIdentities.map(identity => {
          return (
            <SalesforceConnectedUser
              key={identity.id}
              identity={identity}
            />
          );
        })}
      </tbody>
    </Table>
  );
};

export const SalesforceDncManagement = ({ integration }) => {

  const [
    saveReport,
    { loading: saveLoading, error: saveError },
  ] = useMutation(SAVE_INTEGRATION_DNC_REPORT);

  const { data, loading, error } = useQuery(
    SALESFORCE_REPORTS_QUERY,
    {
      variables: { id: integration.id },
    }
  );

  if (loading || saveLoading) return (
    <CardBody>
      <i className="fa fa-spinner fa-spin"></i>
    </CardBody>
  )

  if (error)
    return (
      <CardBody>
        Error...
      </CardBody>
    );

  return (
    <CardBody>
      <Row>
        <Col>
          <FormGroup>
            <label>DNC Report:</label>
            <select
              defaultValue={integration.dncReportId}
              onChange={(e) => {
                saveReport({
                  variables: {
                    id: integration.id,
                    dncReportId: e.target.value
                  }
                })
              }}
            >
              <option value="">Select a dnc report</option>
              {data.v3_Customer_Integrations_Salesforce.getReports.map(
                (option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                )
              )}
            </select>
            { saveError && <span>Something went wrong saving...</span>}
          </FormGroup>
        </Col>
      </Row>
      {/* <Row className="row align-items-center mx-0">
        <Col>
          <AccountJournalGraph
            bgColorClass="bg-color-cyan-light"
            color={Colors.Cyan}
            title="DNC Accounts Identified"
            event="account_dnc"
            customerId={integration.customerId}
          />
        </Col>
      </Row> */}
    </CardBody>
  );
};
