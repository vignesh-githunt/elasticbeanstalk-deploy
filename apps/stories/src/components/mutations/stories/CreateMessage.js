import gql from "graphql-tag";

const CREATE_MESSAGE = gql`
  mutation CreateMessage($customerId: String!, $storyId: String!, $name: String!) {
    createV3_Customer_Message(
      data: { customerId: $customerId, name: $name, storyId: $storyId }
    ) {
      id
    }
  }
`;

export default CREATE_MESSAGE;