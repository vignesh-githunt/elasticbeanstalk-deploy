import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const AccountDatasQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    return <ComponentToWrap loading={!!loading || data.loading} accounts={data.v3_AccountDatas || []} {...restProps} />
  }
  return graphql(ACCOUNTDATASQUERYSTRING)(WrappedComponent)
}

export const ACCOUNTDATASQUERYSTRING = gql`
  query accountData {
    v3_AccountDatas(limit: 10) {
      id
      nameValue
      domainsValue
      logoValue
      industriesValue
      employeeCountRangesValue
      statusValue
      status
    }
  }
`
