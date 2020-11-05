import gql from 'graphql-tag';

const STORY_CONTACT_STATUS = gql`
  mutation RefreshStoryContact($id: String!) {
    refreshStoryContact(id: $id) {
      id
    }
  }
`;

export default STORY_CONTACT_STATUS;
