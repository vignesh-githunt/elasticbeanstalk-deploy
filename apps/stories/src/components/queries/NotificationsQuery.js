import gql from "graphql-tag";

const NOTIFICATIONS_QUERY = gql`
  query v3_Notifications(
    $senderId: ID!
    $limit: Int = 10
    $skip: Int = 0
    $order: V3_NotificationOrder = { createdAt: DESC }
  ) {
    v3_Notifications(
      where: { seenAt: null, senderId: $senderId }
      limit: $limit
      skip: $skip
      order: $order
    ) {
      id
      customerId
      createdAt
      seenAt
      title
      body
      icon
      action
    }
    _v3_NotificationsMeta(where: { seenAt: null, senderId: $senderId }) {
      count
    }
  }
`;

export default NOTIFICATIONS_QUERY;
