import gql from "graphql-tag";

const SEND_RESET_PASSWORD_INSTRUCTIONS = gql`
  mutation ResetPasswordInstructions($email: String!) {
    reset_password_instructions(email: $email)
  }
`;
export default SEND_RESET_PASSWORD_INSTRUCTIONS;
