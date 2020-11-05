import gql from "graphql-tag";

const DELETE_STORY = gql`
  mutation DeleteStory($id: ID!) {
    deleteV3_Customer_Story(id: $id) {
      id
    }
  }
`;

export default DELETE_STORY;