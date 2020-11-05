import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const StoryContactsQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    return <ComponentToWrap loading={!!loading || data.loading} storyContacts={data.v3_Customer_StoryContacts || []} {...restProps} />
  }

  return graphql(STORYCONTACTSQUERYSTRING, {
    options: ({ customerId }) => ({ variables: { customerId } })
  })(WrappedComponent)
}

export const STORYCONTACTSQUERYSTRING = gql`
  query storyContacts($customerId: ID!) {
    v3_Customer_StoryContacts(where: { customerId: $customerId }, limit: 200, order: { priority: ASC, personalizationScore: DESC } ) {
      id
      account {
        id
        nameValue
      }
    	contact {
        id
        givenNameValue
        familyNameValue
        position {
          email
          title
        }
      }
      statusValue
      sender {
        fullName
      }
      story {
        id
        name
      }
      priority
      personalizationScore
      emailContent
    }
  }
`
