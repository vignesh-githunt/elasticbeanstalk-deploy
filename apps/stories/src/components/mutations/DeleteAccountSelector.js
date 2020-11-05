import gql from "graphql-tag";

const DELETE_ACCOUNT_SELECTOR = gql`
  mutation DeleteAccountSelector($id: ID!) {
    deleteV3_Customer_AccountSelector(id: $id) {
      id
    }
  }
`;

export default DELETE_ACCOUNT_SELECTOR;