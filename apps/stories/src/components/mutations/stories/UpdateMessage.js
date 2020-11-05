import gql from "graphql-tag";

const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($id: ID!, $name: String!, $position: Int) {
    updateV3_Customer_Message(
      id: $id
      data: { name: $name, position: $position }
    ) {
      id
    }
  }
`;

export default UPDATE_MESSAGE;