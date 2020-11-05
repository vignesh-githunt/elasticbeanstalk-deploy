import gql from "graphql-tag";

const UPDATE_CONTACT_SELECTOR = gql`
  mutation UpdateContactSelector(
    $id: ID!
    $name: String!
    $selectorType: String = "Icp"
    $requiredTitleDataPoints: [String]
    $optionalTitleDataPoints: [String]
  ) {
    updateContactSelector(
      id: $id
      name: $name
      selectorType: $selectorType
      requiredTitleDataPoints: $requiredIndustryDataPoints
      optionalTitleDataPoints: $optionalIndustryDataPoints
    )
  }
`;

export default UPDATE_CONTACT_SELECTOR;