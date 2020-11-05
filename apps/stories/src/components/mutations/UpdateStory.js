import gql from "graphql-tag";

const UPDATE_STORY = gql`
  mutation UpdateStory(
    $id: ID!
    $name: String!
    $priority: Int
    $accountSelectorId: String!
    $contactSelectorId: String!
    $rulesOfEngagementId: String!
    $sendingWindowDayStart: Int
    $sendingWindowDayEnd: Int
    $sendingWindowHourStart: Int
    $sendingWindowHourEnd: Int
  ) {
    updateV3_Customer_Story(
      id: $id
      data: {
        name: $name
        priority: $priority
        accountSelectorId: $accountSelectorId
        contactSelectorId: $contactSelectorId
        rulesOfEngagementId: $rulesOfEngagementId
        sendingWindowDayStart: $sendingWindowDayStart
        sendingWindowDayEnd: $sendingWindowDayEnd
        sendingWindowHourStart: $sendingWindowHourStart
        sendingWindowHourEnd: $sendingWindowHourEnd
      }
    ) {
      id
    }
  }
`;

export default UPDATE_STORY;