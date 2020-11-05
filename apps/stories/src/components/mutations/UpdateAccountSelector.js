import gql from "graphql-tag";

const UPDATE_ACCOUNT_SELECTOR = gql`
  mutation UpdateAccountSelector(
    $id: ID!
    $name: String!
    $selectorType: String = "Icp"
    $requiredIndustryDataPoints: [String]
    $optionalIndustryDataPoints: [String]
  ) {
    updateAccountSelector(
      id: $id
      name: $name
      selectorType: $selectorType
      requiredIndustryDataPoints: $requiredIndustryDataPoints
      optionalIndustryDataPoints: $optionalIndustryDataPoints
    )
  }
`;

export default UPDATE_ACCOUNT_SELECTOR;