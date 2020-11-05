import gql from "graphql-tag";

export const SALESFORCE_REPORTS_QUERY = gql`
         query SALESFORCE_REPORTS_QUERY($id: ID!) {
           v3_Customer_Integrations_Salesforce(where: { id: $id }) {
             id
             getReports
           }
         }
       `;