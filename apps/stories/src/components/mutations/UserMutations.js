import gql from "graphql-tag";

 export const SIGNIN_MUTATION = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
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


