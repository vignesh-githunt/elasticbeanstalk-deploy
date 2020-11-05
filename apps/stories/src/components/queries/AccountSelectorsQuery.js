import gql from "graphql-tag";

const ACCOUNTSELECTORS_QUERY = gql`
  query v3_Customer_AccountSelectors(
    $customerId: ID!
    $limit: Int = 100
    $skip: Int = 0
  ) {
    v3_Customer_AccountSelectors(
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
      totalMatchingAccountsCount
      totalCreatedAccountsCount
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

export default ACCOUNTSELECTORS_QUERY;
