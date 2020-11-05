import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const PersonQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    return <ComponentToWrap loading={!!loading || data.loading} contact={data.v3_Person || null} {...restProps} />
  }

  return graphql(PERSONQUERYSTRING, {
    options: ({ contactId }) => ({ variables: { contactId } })
  })(WrappedComponent)
}

export const PERSONQUERYSTRING = gql`
  query($contactId:ID!) {
    v3_Person(id: $contactId) {
      id
      emails { id value dataSource dataPointType }
      emailDomains { id value dataSource dataPointType }
      phoneNumbers { id value dataSource dataPointType }
      worksAt { id value dataSource dataPointType }
      previousCompanies { id value dataSource dataPointType }
      previousTitles { id value dataSource dataPointType }
      workedInDepartment { id value dataSource dataPointType }
      worksWith { id value dataSource dataPointType }
      reportsToName { id value dataSource dataPointType }
      seniority { id value dataSource dataPointType }
      titles { id value dataSource dataPointType }
      locationGeneral { id value dataSource dataPointType }
      usesServices { id value dataSource dataPointType }
      experiencedIn { id value dataSource dataPointType }
      likes { id value dataSource dataPointType }
      memberOfGroups { id value dataSource dataPointType }
      schools { id value dataSource dataPointType }
      studied { id value dataSource dataPointType }
      degrees { id value dataSource dataPointType }
      tags { id value dataSource dataPointType }
      twitterHandles { id value dataSource dataPointType }
      talkingAbout { id value dataSource dataPointType }
      chattingWith { id value dataSource dataPointType }
      currentAddresses { id value dataSource dataPointType }
      gender { id value dataSource dataPointType }
      bio { id value dataSource dataPointType }
      avatars { id value dataSource dataPointType }
      facebookHandle { id value dataSource dataPointType }
      blogUrl { id value dataSource dataPointType }
      githubHandle { id value dataSource dataPointType }
      timeZone { id value dataSource dataPointType }
      utcOffset { id value dataSource dataPointType }
      fullName { id value dataSource dataPointType }
      givenName { id value dataSource dataPointType }
      familyName { id value dataSource dataPointType }
      articles { id value dataSource dataPointType }
      influencialAbout { id value dataSource dataPointType }
      mentionedInTheNews { id value dataSource dataPointType }
      linkedinUrls { id value dataSource dataPointType }
      linkedinIds { id value dataSource dataPointType }
      discoverorgIds { id value dataSource dataPointType }
      zoominfoIds { id value dataSource dataPointType }
      clearbitIds { id value dataSource dataPointType }
      legacyUserIds { id value dataSource dataPointType }
      knows { id value dataSource dataPointType }
    }
  }
`
