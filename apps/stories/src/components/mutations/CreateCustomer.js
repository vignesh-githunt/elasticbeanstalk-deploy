import gql from "graphql-tag";

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer(
    $name: String!
    $domain: String!
  ) {
    createCustomer(
      name: $name
      domain: $domain
    ) {
      id
    }
  }
`;

export default CREATE_CUSTOMER;
