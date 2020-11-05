import gql from 'graphql-tag';

const USER_STORY_CONTACTS_QUERY = gql`
  query storyContacts(
    $filter: V3_Customer_StoryContactFilter!
    $limit: Int = 25
    $skip: Int = 0
    $order: V3_Customer_StoryContactOrder = {
      priority: ASC
      personalizationScore: DESC
    }
  ) {
    v3_Customer_StoryContacts(
      where: $filter
      limit: $limit
      skip: $skip
      order: $order
    ) {
      id
      updatedAt
      account {
        id
        nameValue
        primarySalesforceId
      }
      contact {
        id
        givenNameValue
        familyNameValue
        primarySalesforceId
        position {
          email
          title
        }
      }
      status
      approved
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
    _v3_Customer_StoryContactsMeta(where: $filter) {
      count
    }
  }
`;

export const USER_STORY_CONTACT_MESSAGES_QUERY = gql`
  query storyContact($id: ID!) {
    v3_Customer_StoryContact(where: { id: $id }) {
      id
      emailContent
      elements {
        id
        triggerType
        text
        triggerDataPoints {
          id
          value
          dataPointType
        }
        plotPointAsAdditional {
          id
          name
          position
          defaultElement {
            id
          }
          additionalElements {
            id
          }
        }
        plotPointAsDefault {
          id
          name
          position
          defaultElement {
            id
          }
          additionalElements {
            id
          }
        }
      }
    }
  }
`;

export default USER_STORY_CONTACTS_QUERY;
