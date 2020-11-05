import gql from "graphql-tag";

export const ACCOUNT_ASSIGNMENT_LOGIC_QUERY = gql`
  query accountAssignmentLogic($customerId: ID!) {
    v3_Customer_AccountAssignmentLogics(where: { customerId: $customerId }) {
      id
      priority
      ruleSet {
        id
      }
      senders {
        id
        fullName
        imageUrl
        email
      }
    }
  }
`;

export const ACCOUNT_ASSIGNMENT_LOGIC_COUNT_QUERY = gql`
  query accountAssignmentLogicCount($customerId: ID!) {
    _v3_Customer_AccountAssignmentLogicsMeta(
      where: { customerId: $customerId }
    ) {
      count
    }
  }
`;