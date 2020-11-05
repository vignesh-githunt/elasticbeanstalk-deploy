import gql from "graphql-tag";

export const ACCOUNT_ASSIGNMENTS_QUERY = gql`
query accountAssignmentsCount($senderId: ID!) {
  _v3_Customer_AccountsMeta(where: {ownerId: $senderId}) {
    count
  }
}
`;