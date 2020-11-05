import gql from "graphql-tag";

const SAVE_INTEGRATION_SETTINGS = gql`
  mutation SaveIntegrationSettings(
    $id: ID!
    $syncOnlyUsedAccounts: Boolean!
    $syncOnlyUsedContacts: Boolean!
  ) {
    updateV3_Customer_Integration(
      id: $id
      data: { 
        syncOnlyUsedAccounts: $syncOnlyUsedAccounts 
        syncOnlyUsedContacts: $syncOnlyUsedContacts 
      }
    ) {
      id
    }
  }
`;

export const SAVE_INTEGRATION_DNC_REPORT = gql`
  mutation SaveIntegrationSettings($id: ID!, $dncReportId: String!) {
    updateV3_Customer_Integration(
      id: $id
      data: {
        dncReportId: $dncReportId
      }
    ) {
      id
    }
  }
`;

export const SAVE_INTEGRATION_FIELDS = gql`
         mutation SaveIntegrationFields(
           $id: ID!
           $selectedAccountFields: Array!
           $selectedContactFields: Array!
           $selectedOpportunityFields: Array!
           $selectedLeadFields: Array!
         ) {
           updateV3_Customer_Integration(
             id: $id
             data: {
               selectedAccountFields: $selectedAccountFields
               selectedContactFields: $selectedContactFields
               selectedOpportunityFields: $selectedOpportunityFields
               selectedLeadFields: $selectedLeadFields
             }
           ) {
             id
           }
         }
       `;

export const RUN_INTEGRATION_SETUP = gql`
         mutation SalesforceIntegrationSetup($customerId: String!) {
           salesforceIntegrationSetup(customerId: $customerId)
         }
       `;


export default SAVE_INTEGRATION_SETTINGS;
