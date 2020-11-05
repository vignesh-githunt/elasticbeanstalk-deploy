import gql from "graphql-tag";

const CREATE_ACCOUNT_SELECTOR = gql`
  mutation CreateAccountSelector(
    $customerId: ID!
    $name: String!
    $selectorType: String = "Icp"
    $requiredIndustryDataPoints: [String]
    $optionalIndustryDataPoints: [String] = []
  ) {
    createAccountSelector(
      customerId: $customerId
      name: $name
      selectorType: $selectorType
      requiredIndustryDataPoints: $requiredIndustryDataPoints
      optionalIndustryDataPoints: $optionalIndustryDataPoints
    ) 
  }
`;

export default CREATE_ACCOUNT_SELECTOR;