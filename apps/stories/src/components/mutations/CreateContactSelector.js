import gql from "graphql-tag";

const CREATE_CONTACT_SELECTOR = gql`
  mutation CreateContactSelector(
    $customerId: ID!
    $name: String!
    $selectorType: String = "Icp"
    $requiredTitleDataPoints: [String]
    $optionalTitleDataPoints: [String] = []
  ) {
    createContactSelector(
      customerId: $customerId
      name: $name
      selectorType: $selectorType
      requiredTitleDataPoints: $requiredTitleDataPoints
      optionalTitleDataPoints: $optionalTitleDataPoints
    ) 
  }
`;

export default CREATE_CONTACT_SELECTOR;