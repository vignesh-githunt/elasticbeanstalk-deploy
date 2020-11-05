import gql from "graphql-tag";

const DELETE_CONTACT_SELECTOR = gql`
  mutation DeleteContactSelector($id: ID!) {
    deleteV3_Customer_ContactSelector(id: $id) {
      id
    }
  }
`;

export default DELETE_CONTACT_SELECTOR;