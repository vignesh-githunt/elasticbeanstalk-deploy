import gql from "graphql-tag";

const DELETE_ELEMENT = gql`
  mutation DeleteElement($id: ID!) {
    deleteV3_Customer_StoryComponents_Element(id: $id) {
      id
    }
  }
`;

export default DELETE_ELEMENT;