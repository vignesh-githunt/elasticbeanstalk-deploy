import gql from "graphql-tag";

export const JOBS_COUNT = gql`
  query jobsCount($customerId: ID!) {
    _jobsMeta(where: { customerId: $customerId }) {
      count
    }
  }
`;

export const CUSTOMER_JOBS_QUERY = gql`
  query jobs($customerId: ID!) {
    jobs(
      where: { customerId: $customerId }
      order: { startTime: DESC }
      limit: 25
    ) {
      id
      status
      className
      startTime
      endTime
      parentJobId
      _childJobsMeta {
        count
      }
      _eventLogsMeta {
        count
      }
    }
  }
       `;