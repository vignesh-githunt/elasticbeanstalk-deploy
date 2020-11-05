import gql from "graphql-tag";

export const SALESFORCE_FIELDS_QUERY = gql`
         query salesforceFieldsQuery($integrationId: ID!, $sobjectName: String!) {
           getSalesforceFields(integrationId: $integrationId, sobjectName: $sobjectName)
         }
       `;