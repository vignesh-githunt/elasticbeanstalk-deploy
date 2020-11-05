import gql from "graphql-tag";

export const FETCH_CADENCES_COUNT_QUERY = gql`
  query($userFilter: Int!) {
    all( userFilter: $userFilter )
    @rest(type: "Cadence", path: "cadences?page[limit]=1:userFilter") {
      paging{
        totalCount
      }
    }
    active( userFilter: $userFilter )
    @rest(type: "Cadence", path: "cadences?page[limit]=1:userFilter&filter[status]=ACTIVE") {
      paging{
        totalCount
      }
    }
    unassigned( userFilter: $userFilter )
    @rest(type: "Cadence", path: "cadences?page[limit]=1:userFilter&filter[status]=NEW") {
      paging{
        totalCount
      }
    }
    paused( userFilter: $userFilter )
    @rest(type: "Cadence", path: "cadences?page[limit]=1:userFilter&filter[status]=INACTIVE") {
      paging{
        totalCount
      }
    }
    
  }
`;

export const FETCH_SAMPLE_CADENCES_QUERY = gql`
  query(
    $includeAssociationsQry: String!
    $userFilter: String
    $limit: String!
  ) {
    cadences(
      includeAssociationsQry: $includeAssociationsQry
      userFilter: $userFilter
      limit: $limit
    )
      @rest(
        type: "Cadence"
        path: "cadences/sample?page[limit]=500"
      ) {
      data
      includedAssociations
      paging
    }
  }
`;

export const FETCH_CADENCES_QUERY = gql`
  query(
    $includeAssociationsQry: String!
    $limit: String!
    $offset: String!
    $sharedType: String!
    $cadenceFilter: String
    $sortBy: String!
    $orderBy: String!
  ) {
    cadences(
      includeAssociationsQry: $includeAssociationsQry
      limit: $limit
      offset: $offset
      sharedType: $sharedType
      cadenceFilter: $cadenceFilter
      sortBy: $sortBy
      orderBy: $orderBy
    )
      @rest(
        type: "Cadence"
        path: "cadences?page[limit]=:limit&page[offset]=:offset&filter[sharedType]=:sharedType:cadenceFilter&sort[:sortBy]=:orderBy"
      ) {
      data
      includedAssociations
      paging
    }
  }
`;

export const FETCH_CADENCE_QUERY = gql`
  query($id: ID!) {
    cadence(id: $id) @rest(type: "Cadence", path: "cadences/:id") {
      data
    }
  }
`;

export const FETCH_OUTCOMES_QUERY = gql`
  query($limit: String!, $offset: String!, $filter: String) {
    outcomes(limit: $limit, offset: $offset, filter: $filter)
      @rest(
        type: "Outcomes"
        path: "outcomes?page[limit]=:limit&page[offset]=:offset:filter"
        input: {}
      ) {
      data
    }
  }
`;


export const CREATE_CADENCE = gql`
  query($name: String!, $description: String!, $sharedType: String!) {
    cadences(
      input: { name: $name, description: $description, sharedType: $sharedType }
    ) @rest(method: "POST", type: "Cadence", path: "cadences") {
      data
    }
  }
`;

export const UPDATE_CADENCE = gql`
  query($id: ID!, $name: String!, $description: String!, $sharedType: String!) {
    cadences(
      id: $id
      name: $name
      input: { name: $name, description: $description, sharedType: $sharedType }
    ) @rest(type: "Cadence", path: "cadences/:id", method: "PUT") {
      response
    }
  }
`;

export const DISABLE_CADENCE_QUERY = gql`
  query($id: ID!, $status: String!) {
    disablecadence(
      id: $id
      input: { status: $status}
    ) @rest(type: "cadence", path: "cadences/:id" method:"PUT") {
      response
    }
  }
`;

export const DELETE_CADENCE_QUERY = gql`
  query($cadenceID: ID!) {
    deletecadence(cadenceID: $cadenceID)
    @rest(type: "cadence", path: "cadences/:cadenceID" method:"DELETE") {
      response
    }
  }
`;
export const CLONE_CADENCE_QUERY = gql`
  query($cadenceID: ID!,$cloneCadenceName:String!) {
    clonecadence(cadenceID: $cadenceID,cloneCadenceName:$cloneCadenceName
      input:{})
    @rest(type: "cadence", path: "cadences/:cadenceID/cloneCadence/:cloneCadenceName" method:"PUT") {
      response
    }
  }
`;

export const CLONE_SAMPLE_CADENCE_QUERY = gql`
  query($sampleCadenceName: String!,$cloneCadenceName:String!) {
    clonecadence(sampleCadenceName: $sampleCadenceName,cloneCadenceName:$cloneCadenceName
      input:{})
    @rest(type: "cadence", path: "cadences/sample/:sampleCadenceName/cloneCadence/:cloneCadenceName" method:"PUT") {
      response
    }
  }
`;

export const FETCH_USERS_QUERY = gql`
  query(
    $userFilter: String
  ) {
    users(
      userFilter: $userFilter

    )
      @rest(
        type: "Users"
        path: "users?:userFilter"
      ) {
      data
    }
  }
`;

export default FETCH_CADENCES_QUERY;