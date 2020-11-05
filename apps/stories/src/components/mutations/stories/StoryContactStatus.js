import gql from 'graphql-tag';

const STORY_CONTACT_STATUS = gql`
  mutation SetStoryContactStatus(
    $id: ID!
    $status: String!
    $approved: Boolean = false
  ) {
    updateV3_Customer_StoryContact(
      id: $id
      data: { status: $status, approved: $approved }
    ) {
      id
    }
  }
`;

export default STORY_CONTACT_STATUS;
