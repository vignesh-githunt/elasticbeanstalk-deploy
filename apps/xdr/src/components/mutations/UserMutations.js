import gql from "graphql-tag";

 export const SIGNIN_MUTATION = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user
        }
      }
    `;

    export const XDR_SIGNIN_MUTATION = gql`
      mutation XdrLogin($email: String!, $password: String!) {
        xdrLogin(email: $email, password: $password) {
          token
          user
        }
      }
    `;
    
    export const SIGNOUT_MUTATION = gql`
     mutation logout {
      logout
     }
   `;


