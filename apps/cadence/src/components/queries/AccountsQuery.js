import gql from "graphql-tag";

const FETCH_ACCOUNTS_QUERY = gql`
  query($includeAssociationsQry: String!, $limit: String!, $offset: String!, $accountFilter: String) {
    accounts(includeAssociationsQry: $includeAssociationsQry, limit: $limit, offset: $offset, accountFilter: $accountFilter)
     @rest(type: "Account", path: "accounts?:includeAssociationsQry&page[limit]=:limit&page[offset]=:offset:accountFilter") {
      data
      includedAssociations
      paging
    }
  }
`;

export const DELETE_ACCOUNTS_TAG_QUERY = gql`
  query($tagids: ID!, $id: ID!) {
    accounts(tagids: $tagids, id: $id) 
    @rest(type: "Tag", path: "accounts/:id/:tagids" method:"DELETE") {
      response
    }
  }
`;

export const FETCH_ACCOUNT_CADENCES_QUERY = gql`
  query($includeAssociationsQry: String!, $id: ID!, $accountCadencesFilter: String) {
    accounts(includeAssociationsQry: $includeAssociationsQry, id: $id, accountCadencesFilter: $accountCadencesFilter) 
    @rest(type: "Cadence", path: "accounts/:id/cadences?:includeAssociationsQry:accountCadencesFilter") {
      data
      includedAssociations
      paging
    }
  }
`;

export const FETCH_ACCOUNT_TASKS_QUERY = gql`
  query($includeAssociationsQry: String!, $accountTasksFilter: String, $userFilter: String, $id: ID!) {
    accounts(includeAssociationsQry: $includeAssociationsQry, accountTasksFilter: $accountTasksFilter, userFilter: $userFilter, id: $id) 
    @rest(type: "Task", path: "accounts/:id/tasks/:accountTasksFilter?:userFilter") {
      data
      includedAssociations
      paging
    }
  }
`;

export const FETCH_CADENCES_COUNT_QUERY = gql`
query($userFilter: Int!) {
  total( userFilter: $userFilter )
  @rest(type: "Cadence", path: "accounts/:id/cadences?page[limit]=1:userFilter&filter[Status]=:[PAUSED,ACTIVE,INACTIVE]") {
    paging{
      totalCount
    }
  }
  active( userFilter: $userFilter )
  @rest(type: "Cadence", path: "accounts/:id/cadences?page[limit]=1:userFilter&filter[Status]=ACTIVE") {
    paging{
      totalCount
    }
  }
  inactive( userFilter: $userFilter )
  @rest(type: "Cadence", path: "accounts/:id/cadences?page[limit]=1:userFilter&filter[Status]=INACTIVE") {
    paging{
      totalCount
    }
  }
  paused( userFilter: $userFilter )
  @rest(type: "Cadence", path: "accounts/:id/cadences?page[limit]=1:userFilter&filter[Status]=PAUSED") {
    paging{
      totalCount
    }
  }
}
`;

export const FETCH_PROSPECTS_COUNT_QUERY = gql`
  query($userFilter: Int!, $ids: ID!) {
    all( userFilter: $userFilter, ids: $ids )
    @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[memberStatus]=all") {
      paging{
        totalCount
      }
    }
    active( userFilter: $userFilter )
    @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[memberStatus]=active") {
      paging{
        totalCount
      }
    }
    paused( userFilter: $userFilter )
    @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[memberStatus]=paused") {
      paging{
        totalCount
      }
    }
    unassigned( userFilter: $userFilter )
    @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[memberStatus]=unassigned") {
      paging{
        totalCount
      }
    }
  }
`;


export default FETCH_ACCOUNTS_QUERY;