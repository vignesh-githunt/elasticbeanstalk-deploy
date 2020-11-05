import gql from "graphql-tag";

const STORY_CONTACT_STATUS = gql`
  mutation PauseStoryContact($id: String!) {
    pauseStoryContact(id: $id) {
      id
    }
  }
`;

export default STORY_CONTACT_STATUS;
