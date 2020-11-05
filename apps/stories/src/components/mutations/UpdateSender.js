import gql from "graphql-tag";

const UPDATE_SENDER_USERTYPE = gql`
  mutation UpdateSenderUserType(
    $id: ID!
    $userType: Int!
  ) {
    updateUser(
      id: $id
      data: {
        userType: $userType
      }
    ) {
      id
    }
  }
`;

export const UPDATE_SENDER_DAILY_SENDING_LIMIT = gql`
  mutation UpdateSenderUserType($id: ID!, $dailySendingLimit: Int!) {
    updateUser(id: $id, data: { dailySendingLimit: $dailySendingLimit }) {
      id
    }
  }
`;

export const UPDATE_SENDER_ROLE = gql`
  mutation UpdateSenderRole($id: ID!, $rolesMask: Int!) {
    updateUser(id: $id, data: { rolesMask: $rolesMask }) {
      id
    }
  }
`;
export const RESEND_CONFIRMATION_EMAIL = gql`
  mutation reSendConfirmationEmail($id: String!) {
    reSendUserConfirmationEmail(id: $id) {
      id
    }
  }
`;



export default UPDATE_SENDER_USERTYPE;
