import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const CustomerAccountsQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    return <ComponentToWrap loading={!!loading || data.loading} accounts={data.v3_Customer_Accounts || []} {...restProps} />
  }
  return graphql(CUSTOMERACCOUNTSQUERYSTRING, {
    options: ({ customerId }) => ({ variables: { customerId } })
  })(WrappedComponent)
}

export const CUSTOMERACCOUNTSQUERYSTRING = gql`
  query customerAccounts($customerId: ID!) {
    v3_Customer_Accounts(limit: 10, where:{ customerId: $customerId}){
      id
      nameValue
      domainsValue
      logoValue
      industriesValue
      employeeCountRangesValue
    }
  }
`
