import gql from 'graphql-tag';

export const CONTACT_ASSIGNMENTS_QUERY = gql`
  query contactAssignmentsCount($senderId: ID!) {
    _v3_Customer_ContactsMeta(where: { senderId: $senderId }) {
      count
    }
  }
`;
