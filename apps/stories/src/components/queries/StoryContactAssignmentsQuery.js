import gql from 'graphql-tag';

export const STORY_CONTACT_ASSIGNMENTS_QUERY = gql`
  query storyContactAssignmentsCount($senderId: ID!) {
    _v3_Customer_StoryContactsMeta(where: { senderId: $senderId }) {
      count
    }
  }
`;
