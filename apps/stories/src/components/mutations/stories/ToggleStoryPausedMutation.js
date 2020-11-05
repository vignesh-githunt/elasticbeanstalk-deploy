import gql from "graphql-tag";

const TOGGLE_STORY_PAUSED_MUTATION = gql`
  mutation ToggleStoryPaused($id: ID!, $pausedAt: DateTime) {
    updateV3_Customer_Story(id: $id, data: { pausedAt: $pausedAt }) {
      __typename
      id
      pausedAt
    }
  }
`;

export default TOGGLE_STORY_PAUSED_MUTATION;