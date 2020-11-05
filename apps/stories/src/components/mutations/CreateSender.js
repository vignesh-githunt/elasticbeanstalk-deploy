import gql from "graphql-tag";

const CREATE_SENDER = gql`
  mutation CreateSender(
    $customerId: String!
    $firstName: String!
    $lastName: String!
    $email: String!
  ) {
    createSender(
      customerId: $customerId
      firstName: $firstName
      lastName: $lastName
      email: $email
    ) {
      id
    }
  }
`;

export default CREATE_SENDER;
