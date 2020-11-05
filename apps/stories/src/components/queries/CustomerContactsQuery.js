import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const CustomerContactsQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    let contacts = (data.v3_Customer_Contacts || []).map(p => {
      return { ...p, email: p.position.email, title: p.position.title }
    });
    return <ComponentToWrap loading={!!loading || data.loading} contacts={contacts} {...restProps} />
  }
  return graphql(CUSTOMERCONTACTSQUERYSTRING, {
    options: ({ customerId }) => ({ variables: { customerId } })
  })(WrappedComponent)
}

export const CUSTOMERCONTACTSQUERYSTRING = gql`
  query customerContacts($customerId:ID!) {
    v3_Customer_Contacts(limit: 10, where:{ customerId: $customerId}) {
      id
      avatarsValue
      familyNameValue
      givenNameValue
      linkedinUrlsValue
      position {
        id
        email
        title
      }
    }
  }
`
