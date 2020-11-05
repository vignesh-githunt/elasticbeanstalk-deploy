import gql from "graphql-tag";

const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteV3_Customer_Message(id: $id) {
      id
    }
  }
`;

export default DELETE_MESSAGE;