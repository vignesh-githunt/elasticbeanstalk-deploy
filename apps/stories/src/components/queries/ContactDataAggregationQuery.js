import gql from 'graphql-tag'

const CONTACT_DATA_AGGREGATION = gql`
  query contactDataAggregation(
    $customerId: ID!
    $dataPoint: String!
    $senderId: ID
  ) {
    contactDataAggregation(
      customerId: $customerId
      dataPoint: $dataPoint
      senderId: $senderId
    ) {
      id
      dataPoint
      data
      totalCount
    }
  }
`;

export default CONTACT_DATA_AGGREGATION;