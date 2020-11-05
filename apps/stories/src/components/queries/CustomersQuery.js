import gql from 'graphql-tag'

const CUSTOMERSQUERYSTRING = gql`
  query allCustomers {
    companies(order: { name: ASC }, where: { isCustomer: true, v3Enabled: true }) {
      id
      name
      logoUrl
      createdAt
    }
  }
`

export default CUSTOMERSQUERYSTRING;

export const CUSTOMER_QUERY = gql`
         query customer($id: ID!) {
           company(where: { id: $id, isCustomer: true, v3Enabled: true }) {
             id
             name
             senderDailySendingLimit
             logoUrl
             createdAt
           }
         }
       `;