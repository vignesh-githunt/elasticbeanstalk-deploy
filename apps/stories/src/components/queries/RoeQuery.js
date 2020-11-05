import gql from "graphql-tag";

const ROE_QUERY = gql`
  query v3_Customer_Roe_Bases(
    $customerId: ID!
    $limit: Int = 100
    $skip: Int = 0
  ) {
    v3_Customer_Roe_Bases(
      where: { customerId: $customerId }
      limit: $limit
      skip: $skip
    ) {
      id
      customerId
      createdAt
      updatedAt
      name
      days
      _storiesMeta {
        count
      }
    }
  }
`;

export default ROE_QUERY;
