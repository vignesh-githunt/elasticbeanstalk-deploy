import gql from "graphql-tag";

const USER_FETCHABLES_QUERY = gql`
  query UserFetchablesQuery($userId: ID!) {
    plugin_Fetchables(
      where: { userId: $userId, responseStatus: null }
      limit: 10
      order: { priority: DESC }
    ) {
      id
      type
      createdAt
      url
      responseStatus
      workerStatus
      responseBodySize
      fetchedAt
      processedAt
    }
    _plugin_FetchablesMeta(where: { userId: $userId, responseStatus: null }) {
      count
    }
  }
`;

export default USER_FETCHABLES_QUERY