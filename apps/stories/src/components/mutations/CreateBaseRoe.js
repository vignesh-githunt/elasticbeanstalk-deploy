import gql from "graphql-tag";

const CREATE_BASE_ROE = gql`
  mutation CreateRoe($customerId: String!, $name: String!, $days: Int) {
    createV3_Customer_Roe_Base(
      data: { customerId: $customerId, name: $name, days: $days }
    ) {
      id
    }
  }
`;

export default CREATE_BASE_ROE;