import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const UserQuery = (ComponentToWrap) => {

  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props

    return <ComponentToWrap loading={!!loading || data.loading} user={data.user} {...restProps} />
  }

  return graphql(USERQUERYSTRING, {
    options: ({ userId }) => ({ variables: { userId } })
  })(WrappedComponent)
}

export const USERQUERYSTRING =  gql`
  query USER($userId: ID!) {
    user(id: $userId) {
      id
      firstName
      lastName
      email
      rolesMask
      workflowRoles
      companyId
      onlineTime
    }
  }
`
