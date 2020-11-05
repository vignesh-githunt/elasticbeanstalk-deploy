import gql from "graphql-tag";

export const CREATE_AAL = gql`
  mutation createAAL($customerId: String, $name: String) {
    createV3_Customer_AccountAssignmentLogic(
      data: { customerId: $customerId, name: $name }
    ) {
      id
    }
  }
`;

export const UPDATE_AAL = gql`
  mutation updateAAL($id: ID!, $name: String, $senderIds: Array) {
    updateV3_Customer_AccountAssignmentLogic(id: $id,
      data: { name: $name, senderIds: $senderIds}
    ) {
      id
    }
  }
`;

export const DELETE_AAL = gql`
  mutation deleteAAL($id: ID!) {
    deleteV3_Customer_AccountAssignmentLogic(id: $id) {
      id
    }
  }
`;

export default CREATE_AAL;