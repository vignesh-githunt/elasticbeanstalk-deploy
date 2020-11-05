import gql from "graphql-tag";

const INTEGRATION_QUERY = gql`
  query v3_Customer_Integration($id: ID!) {
    v3_Customer_Integration(where: { id: $id }) {
      id
      customerId
      createdAt
      updatedAt
      name
      category
      provider
      sections
      protectedIdentities
      syncOnlyUsedAccounts
      syncOnlyUsedContacts
      userSequenceMapping
      selectedAccountFields
      selectedContactFields
      selectedOpportunityFields
      selectedLeadFields
      initialSetupCompleted
      dncReportId
      defaultSender {
        id
        fullName
        imageUrl
      }
      plugin {
        id
        authenticated
      }
    }
  }
`;

export default INTEGRATION_QUERY;