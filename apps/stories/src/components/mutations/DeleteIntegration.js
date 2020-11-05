import gql from "graphql-tag";

const DELETE_INTEGRATION = gql`
  mutation DeleteIntegration($id: ID!) {
    deleteV3_Customer_Integration(id: $id) {
      id
    }
  }
`;

export default DELETE_INTEGRATION;