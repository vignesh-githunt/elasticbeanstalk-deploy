import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const PeopleQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props;
    let contacts = (data.v3_People || []).map(p => {
      return { ...p, emails: p.emails.map(e => e.value).join(", "), titles: p.titles.map(e => e.value).join(", ") }
    });
    return <ComponentToWrap loading={!!loading || data.loading} contacts={contacts} {...restProps} />
  }
  return graphql(PEOPLEQUERYSTRING)(WrappedComponent)
}

export const PEOPLEQUERYSTRING = gql`
  query contacts {
    v3_People(limit: 10){
      id
      avatarsValue
      familyNameValue
      givenNameValue
      linkedinUrlsValue
      emails {
        id
        value
      }
      titles {
        id
        value
      }
    }
  }
`
