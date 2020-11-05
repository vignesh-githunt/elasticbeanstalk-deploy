import gql from 'graphql-tag'

const STORYJOURNALAGGREGATION = gql`
  query identifiedContacts(
    $customerId: ID!
    $format: String = "day"
    $event: String = "contact_identified"
    $startDate: DateTime
    $endDate: DateTime
    $storyId: ID
    $groupByStoryId: Boolean = false
    $senderId: ID
    $groupBySender: Boolean = false
    $groupByAccount: Boolean = false
    $accountId: ID
  ) {
    storyJournalAggregation(
      customerId: $customerId
      format: $format
      event: $event
      startDate: $startDate
      endDate: $endDate
      storyId: $storyId
      groupByStoryId: $groupByStoryId
      senderId: $senderId
      groupBySender: $groupBySender
      groupByAccount: $groupByAccount
      accountId: $accountId
    ) {
      id
      event
      startDate
      endDate
      data
      totalCount
      totalAccountCount
    }
  }
`;

export default STORYJOURNALAGGREGATION;