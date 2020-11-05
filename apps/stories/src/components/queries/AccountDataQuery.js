import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const AccountDataQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    return <ComponentToWrap loading={!!loading || data.loading} account={data.v3_AccountData || null} {...restProps} />
  }

  return graphql(ACCOUNTDATAQUERYSTRING, {
    options: ({ accountId }) => ({ variables: { accountId } })
  })(WrappedComponent)
}

export const ACCOUNTDATAQUERYSTRING = gql`
  query($accountId:ID!) {
    v3_AccountData(id: $accountId) {
      id
      name { id value dataSource dataPointType }
      domains { id value dataSource dataPointType }
      industries { id value dataSource dataPointType }
      website { id value dataSource dataPointType }
      sectors { id value dataSource dataPointType }
      tags { id value dataSource dataPointType }
      employeeCountRanges { id value dataSource dataPointType }
      usesApps { id value dataSource dataPointType }
      addresses { id value dataSource dataPointType }
      numberOfEmployees { id value dataSource dataPointType }
      legalName { id value dataSource dataPointType }
      revenue { id value dataSource dataPointType }
      revenueRange { id value dataSource dataPointType }
      haveRaised { id value dataSource dataPointType }
      haveRaisedRange { id value dataSource dataPointType }
      salesGrowth { id value dataSource dataPointType }
      employeeGrowth { id value dataSource dataPointType }
      alexaUsRank { id value dataSource dataPointType }
      alexaGlobalRank { id value dataSource dataPointType }
      marketCap { id value dataSource dataPointType }
      description { id value dataSource dataPointType }
      ownership { id value dataSource dataPointType }
      tech { id value dataSource dataPointType }
      clearbitCompanyId { id value dataSource dataPointType }
      twitterHandle { id value dataSource dataPointType }
      facebookHandle { id value dataSource dataPointType }
      crunchbaseHandle { id value dataSource dataPointType }
      companyLinkedinUrl { id value dataSource dataPointType }
      discoverorgCompanyIds { id value dataSource dataPointType }
      zoominfoCompanyIds { id value dataSource dataPointType }
      legacyCompanyIds { id value dataSource dataPointType }
      phone { id value dataSource dataPointType }
      logo { id value dataSource dataPointType }
      googleRank { id value dataSource dataPointType }
      foundedBy { id value dataSource dataPointType }
      ticker { id value dataSource dataPointType }
      marketCap { id value dataSource dataPointType }
      timeZone { id value dataSource dataPointType }
      utcOffset { id value dataSource dataPointType }
    }
  }
`
