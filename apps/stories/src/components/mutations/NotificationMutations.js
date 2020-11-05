import gql from 'graphql-tag';

export const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($id: ID!, $seenAt: DateTime!) {
    updateV3_Notification(id: $id, data: { seenAt: $seenAt }) {
      id
    }
  }
`;
