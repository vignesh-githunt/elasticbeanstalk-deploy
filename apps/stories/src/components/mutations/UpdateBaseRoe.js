import gql from "graphql-tag";

const UPDATE_BASE_ROE = gql`
  mutation UpdateRoe(
    $id: ID!
    $name: String!
    $days: Int
  ) {
    updateV3_Customer_Roe_Base(id: $id, data: { name: $name, days: $days }) {
      id
    }
  }
`;

export default UPDATE_BASE_ROE;