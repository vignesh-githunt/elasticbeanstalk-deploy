import gql from "graphql-tag";

const CSV_DATA_PROVIDERS_QUERY = gql`
  query v3_Import_CsvDataProviders(
    $filter: V3_Import_CsvDataProviderFilter
    $limit: Int = 10
    $skip: Int = 0
    $order: V3_Import_CsvDataProviderOrder
  ) {
    v3_Import_CsvDataProviders(
      where: $filter
      limit: $limit
      skip: $skip
      order: $order
    ) {
      id
      dataSource
      dataTypes
      size
      status
      tags
      updatedAt
      createdAt
      eventLogs(order: { createdAt: DESC }, limit: 10) {
        message
      }
      cloudFile {
        name
        contentType
      }
    }
  }
`;

export default CSV_DATA_PROVIDERS_QUERY;