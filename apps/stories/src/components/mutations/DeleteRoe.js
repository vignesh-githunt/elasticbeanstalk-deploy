import gql from "graphql-tag";

const DELETE_ROE = gql`
  mutation DeleteRoe($id: ID!) {
    deleteV3_Customer_Roe_Base(id: $id) {
      id
    }
  }
`;

export default DELETE_ROE;