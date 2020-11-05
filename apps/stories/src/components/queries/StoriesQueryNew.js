import gql from 'graphql-tag';

const STORIES_QUERY = gql`
  query v3_Customer_Stories(
    $filter: V3_Customer_StoryFilter!
    $limit: Int = 10
    $skip: Int = 0
    $order: V3_Customer_StoryOrder = { priority: ASC }
  ) {
    v3_Customer_Stories(
      where: $filter
      limit: $limit
      skip: $skip
      order: $order
    ) {
      id
      name
      priority
      pausedAt
      accountSelectorId
      contactSelectorId
      rulesOfEngagementId
      sendingWindowDayStart
      sendingWindowDayEnd
      sendingWindowHourStart
      sendingWindowHourEnd
    }
  }
`;

export default STORIES_QUERY;
