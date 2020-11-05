import gql from 'graphql-tag'

const ACCOUNTJOURNALAGGREGATION = gql`
query accountJournalAggregation(
  $customerId: ID!,
  $format: String = "day",
  $event: String = "account_created",
  $startDate: DateTime,
  $endDate: DateTime,
  $accountId: ID,
  $groupByAccountId: Boolean = false
) {
  accountJournalAggregation(
    customerId: $customerId, 
    format: $format, 
    event: $event,
    startDate: $startDate,
    endDate: $endDate,
    accountId: $accountId,
    groupByAccountId: $groupByAccountId
  )  
  {
		id
    event
    startDate
    endDate
    data
    totalCount
  }
}
`;

export default ACCOUNTJOURNALAGGREGATION;