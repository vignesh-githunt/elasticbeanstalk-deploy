import gql from 'graphql-tag'

const CONTACT_DATA_FREQUENCIES = gql`
  query contactDataFrequencies(
    $filter: V3_Customer_ContactDataFrequencyFilter
    $limit: Int = 50
  ) {
    v3_Customer_ContactDataFrequencies(
      where: $filter 
      order: { count: DESC }
      limit: $limit
    ) {
      id
      value
      dataPointClassName
      count
      percentageOfTotal
    }
  }`;

export default CONTACT_DATA_FREQUENCIES;