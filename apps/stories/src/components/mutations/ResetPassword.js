import gql from "graphql-tag";

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($password: String!,$password_confirmation: String!, $reset_password_token: String!) {
    reset_password(password: $password,password_confirmation :$password_confirmation,reset_password_token : $reset_password_token  )
  }
`;
export default RESET_PASSWORD_MUTATION;
