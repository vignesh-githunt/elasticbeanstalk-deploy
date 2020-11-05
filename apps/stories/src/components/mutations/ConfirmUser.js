import gql from "graphql-tag";

const CONFIRM_USER_MUTATION = gql`
  mutation ConfirmUser($password: String!,$password_confirmation: String!, $confirmation_token: String!) {
    account_confirmation(password: $password,password_confirmation :$password_confirmation,confirmation_token : $confirmation_token  ){
        token
        user
    }
  }
`;
export default CONFIRM_USER_MUTATION;
