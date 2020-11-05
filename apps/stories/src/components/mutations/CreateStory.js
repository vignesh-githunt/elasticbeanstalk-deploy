import gql from "graphql-tag";

const CREATE_BASIC_STORY = gql`
  mutation CreateBasicStory(
    $customerId: String!
    $name: String!
    $priority: Int
    $accountSelectorId: String!
    $contactSelectorId: String!
    $rulesOfEngagementId: String!
    $pausedAt: DateTime
    $sendingWindowDayStart: Int
    $sendingWindowDayEnd: Int
    $sendingWindowHourStart: Int
    $sendingWindowHourEnd: Int
  ) {
    createV3_Customer_Stories_Basic(
      data: {
        customerId: $customerId
        name: $name
        priority: $priority
        accountSelectorId: $accountSelectorId
        contactSelectorId: $contactSelectorId
        rulesOfEngagementId: $rulesOfEngagementId
        pausedAt: $pausedAt
        sendingWindowDayStart: $sendingWindowDayStart,
        sendingWindowDayEnd: $sendingWindowDayEnd,
        sendingWindowHourStart: $sendingWindowHourStart,
        sendingWindowHourEnd: $sendingWindowHourEnd,
      }
    ) {
      id
    }
  }
`;

export default CREATE_BASIC_STORY;