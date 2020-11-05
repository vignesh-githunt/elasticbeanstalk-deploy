import gql from 'graphql-tag'
import React from 'react'
import { graphql } from "@apollo/react-hoc";

export const StoryQuery = (ComponentToWrap) => {
  const WrappedComponent = (props) => {
    const { data, loading, ...restProps } = props
    return <ComponentToWrap loading={!!loading || data.loading} story={data.v3_Customer_Story || null} {...restProps} />
  }

  return graphql(STORYQUERYSTRING, {
    options: ({ storyId }) => ({ variables: { storyId } })
  })(WrappedComponent)
}

export const STORYQUERYSTRING = gql`
  query($storyId:ID!) {
    v3_Customer_Story(id: $storyId) {
      id
      name
      priority
      rulesOfEngagement {
        id
        name
        days
      }
      accountSelector {
        id
        requiredDataPoints {
          id
          value
          dataPointType
        }
      }
      contactSelector{
        id
        requiredDataPoints {
          id
          value
          dataPointType
        }
      }
      plotPoints {
        id
        name
        defaultElement {
          id
          weight
          text
          triggerDataPoints {
            id
            value
            dataPointType
          }
        }
        additionalElements {
          id
          weight
          text
          triggerDataPoints {
            id
            value
            dataPointType
          }
        }
      }
      _storyContactsMeta {
        count
      }
    }
  }
`
