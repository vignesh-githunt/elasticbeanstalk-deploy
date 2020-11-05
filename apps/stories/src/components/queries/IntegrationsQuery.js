import gql from "graphql-tag";

const INTEGRATIONS_QUERY = gql`
  query v3_Customer_Integrations(
    $customerId: ID!
    $limit: Int = 10
    $skip: Int = 0
  ) {
    v3_Customer_Integrations(
      where: { customerId: $customerId}
      limit: $limit
      skip: $skip
    ) {
      id
      customerId
      createdAt
      updatedAt
      name
      category
      provider
      protectedIdentities
      defaultSender {
        id
        fullName
        imageUrl
      }
      plugin {
        id
        authenticated
      }
      
    }
  }
`;

export default INTEGRATIONS_QUERY;
