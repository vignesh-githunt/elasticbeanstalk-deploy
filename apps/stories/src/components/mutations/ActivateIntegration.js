import gql from "graphql-tag";

const ACTIVATE_INTEGRATION_MUTATION = gql`
  mutation ActivateIntegration(
    $customerId: ID!
    $provider: String!
    $senderId: ID
  ) {
    activateIntegration(
      customerId: $customerId
      provider: $provider
      senderId: $senderId
    )
  }
`;

export default ACTIVATE_INTEGRATION_MUTATION;
