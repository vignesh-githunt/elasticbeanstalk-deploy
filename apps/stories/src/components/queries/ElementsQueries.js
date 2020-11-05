import gql from 'graphql-tag';

export const TYPETRIGGERED_ELEMENTS_QUERY = gql`
  query v3_Customer_StoryComponents_Elements_TypeTriggereds(
    $customerId: ID!
    $triggerDataPoint: String!
    $senderId: ID
    $limit: Int = 10
    $skip: Int = 0
    $order: V3_Customer_StoryComponents_Elements_TypeTriggeredsOrder = {
      weight: DESC
    }
  ) {
    v3_Customer_StoryComponents_Elements_TypeTriggereds(
      where: {
        customerId: $customerId
        senderId: $senderId
        triggerDataPoints: { _type: $triggerDataPoint }
      }
      limit: $limit
      skip: $skip
      order: $order
    ) {
      id
      triggerType
      _triggerDataPointsMeta {
        count
      }
      senderId
      triggerDataPoints {
        dataPointType
        value
      }
      text
    }
  }
`;

export const VALUETRIGGERED_ELEMENTS_QUERY = gql`
  query v3_Customer_StoryComponents_Elements_ValueTriggereds(
    $customerId: ID!
    $triggerDataPoint: String!
    $senderId: ID
    $limit: Int = 10
    $skip: Int = 0
    $order: V3_Customer_StoryComponents_Elements_ValueTriggeredOrder = {
      weight: DESC
    }
  ) {
    v3_Customer_StoryComponents_Elements_ValueTriggereds(
      where: {
        customerId: $customerId
        senderId: $senderId
        triggerDataPoints: { _type: $triggerDataPoint }
      }
      limit: $limit
      skip: $skip
      order: $order
    ) {
      id
      triggerType
      _triggerDataPointsMeta {
        count
      }
      senderId
      triggerDataPoints {
        dataPointType
        value
      }
      text
    }
  }
`;

export const ELEMENTS_COUNT_QUERY = gql`
  query v3_Customer_StoryComponents_Elements_Count(
    $filter: V3_Customer_StoryComponents_ElementFilter
  ) {
    _v3_Customer_StoryComponents_ElementsMeta(where: $filter) {
      count
    }
  }
`;

export const ELEMENT_QUERY = gql`
  query v3_Customer_StoryComponents_Element($id: ID!) {
    v3_Customer_StoryComponents_Element(where: { id: $id }) {
      id
      triggerType
      text
      weight
      plotPointAsDefaultId
      plotPointAsAdditionalId
      triggerDataPoints {
        id
        dataPointType
        value
      }
      _triggerDataPointsMeta {
        count
      }
      sender {
        id
        fullName
      }
    }
  }
`;
