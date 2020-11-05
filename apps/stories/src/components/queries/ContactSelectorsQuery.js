import gql from "graphql-tag";

const CONTACTSELECTORS_QUERY = gql`
  query v3_Customer_ContactSelectors(
    $customerId: ID!
    $limit: Int = 100
    $skip: Int = 0
  ) {
    v3_Customer_ContactSelectors(
      where: { customerId: $customerId }
      limit: $limit
      skip: $skip
    ) {
      id
      customerId
      createdAt
      updatedAt
      lastChecked
      name
      totalMatchingContactsCount
      totalCreatedContactsCount
      _storiesMeta {
        count
      }
      requiredDataPoints {
        id
        normalizedValue
        value
        dataPointType
        properties
      }
      optionalDataPoints {
        id
        normalizedValue
        value
        dataPointType
        properties
      }
    }
  }
`;

export default CONTACTSELECTORS_QUERY;
