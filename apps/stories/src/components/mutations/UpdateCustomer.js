import gql from "graphql-tag";

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $senderDailySendingLimit: Int!) {
    updateCompany(
      id: $id
      data: { senderDailySendingLimit: $senderDailySendingLimit }
    ) {
      id
    }
  }
`;

export default UPDATE_CUSTOMER;
