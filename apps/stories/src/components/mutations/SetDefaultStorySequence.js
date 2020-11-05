import gql from "graphql-tag";

const SET_DEFAULT_STORY_SEQUENCE_MUTATION = gql`
  mutation SetDefaultUserSequence($userId: ID!, $sequenceId: String!) {
    updateUser(id: $userId, data: { storySequenceId: $sequenceId }) {
      id
    }
  }
`;

export default SET_DEFAULT_STORY_SEQUENCE_MUTATION;
