import gql from "graphql-tag";

const CREATE_CSV_DATA_PROVIDER_MUTATION = gql`
  mutation CreateCsvDataProvider(
    $importFileUrl: Upload!,
    $dataSource: String!,
    $dataTypes: Int!
    ) {
    createCsvDataProvider(
      data: {
        file: $importFileUrl
        dataSource: $dataSource
        dataTypes: $dataTypes
      }
    ) {
      id
    }
  }
`;

export default CREATE_CSV_DATA_PROVIDER_MUTATION;