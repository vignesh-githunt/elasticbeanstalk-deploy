import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const StoriesQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    return <ComponentToWrap loading={!!loading || data.loading} stories={data.v3_Customer_Stories || []} {...restProps} />
  }

  return graphql(STORIESQUERYSTRING, {
    options: ({ customerId }) => ({ variables: { customerId } })
  })(WrappedComponent)
}

export const STORIESQUERYSTRING = gql`
  query($customerId:ID!) {
    v3_Customer_Stories(where:{ customerId: $customerId }, order:{ priority: DESC}) {
      id
      name
      priority
      _storyContactsMeta {
        count
      }

    }
  }
`
