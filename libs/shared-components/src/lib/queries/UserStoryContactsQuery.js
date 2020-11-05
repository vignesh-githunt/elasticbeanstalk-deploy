import gql from 'graphql-tag'

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
`;

export default USER_STORY_CONTACTS_QUERY;