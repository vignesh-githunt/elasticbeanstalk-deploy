/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import gql from "graphql-tag";

export const FETCH_PROSPECTS_COUNT_QUERY = gql`
  query($userFilter: Int!) {
    all( userFilter: $userFilter )
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

/* const FETCH_PROSPECTS_QUERY = gql`
  query($includeAssociationsQry: String!, $limit: String!, $offset: String!, $fitlerMemberStatus: String!, $userFilter: String!, $customFilter: String) {
    prospects(includeAssociationsQry: $includeAssociationsQry, limit: $limit, offset: $offset, fitlerMemberStatus: $fitlerMemberStatus, userFilter: $userFilter, customFilter: $customFilter )
     @rest(type: "Prospect", path: "prospects?:includeAssociationsQry&page[limit]=:limit&page[offset]=:offset:fitlerMemberStatus:userFilter:customFilter") {
      data
      includedAssociations
      paging
    }
  }
`; */

const FETCH_PROSPECTS_QUERY = gql`
  query($includeAssociationsQry: String!, $limit: String!, $offset: String!, $prospectFilter: String) {
    prospects(includeAssociationsQry: $includeAssociationsQry, limit: $limit, offset: $offset, prospectFilter: $prospectFilter )
     @rest(type: "Prospect", path: "prospects?:includeAssociationsQry&page[limit]=:limit&page[offset]=:offset:prospectFilter") {
      data
      includedAssociations
      paging
    }
  }
`;

export const FETCH_PROSPECT_QUERY = gql`
  query($id: ID!) {
    prospect(id: $id)
    @rest(type: "Prospect", path: "prospects/:id") {
      data
    }
  }
`;
export const DELETE_PROSPECTS_QUERY = gql`
  query($prospectId: ID!) {
    deleteProspect(prospectId: $prospectId)
    @rest(type: "Prospect", path: "prospects/:prospectId" method:"DELETE") {
      response
    }
  }
`;
export const EXIT_PAUSE_RESUME_PROSPECT_QUERY = gql`
  query($prospectId: ID!,$action: String!) {
    prospect(prospectId: $prospectId,action: $action, input: {})
    @rest(type: "Prospect", path: "prospects/:prospectId/:action" method:"PUT") {
      response
    }
  }
`;

export const ASSIGN_OR_MOVE_PROSPECT_TO_CADENCE_QUERY = gql`
  query($prospectId: ID!, $action: String!, $cadenceId: String!) {
    assignOrMoveProspect(prospectId: $prospectId, action: $action, cadenceId: $cadenceId, input: {})
    @rest(type: "Prospect", path: "prospects/:prospectId/:action/:cadenceId" method:"PUT") {
      response
    }
  }
`;

export const TAG_PROSPECT_QUERY = gql`
  query($prospectId: ID!, $tagName: String!) {
    tagProspect(prospectId: $prospectId, tagName: $tagName, input: {})
    @rest(type: "Prospect", path: "prospects/:prospectId/tags/:tagName" method:"PUT") {
      response
    }
  }
`;

export const CREATE_PROSPECT_QUERY = gql`
  query {
    prospect(input: $input)
    @rest(type: "Prospect", path: "prospects" method:"POST") {
      response
    }
  }
`;
export const FETCH_TODO_COUNT_QUERY = gql`
query($userFilter: Int!) {
  all( userFilter: $userFilter )
  @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[currentTouchStatus]=SCHEDULED&filter[currentTouchType]=!=CALL") {
    paging{
      totalCount
    }
  }
  email( userFilter: $userFilter )
  @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[currentTouchStatus]=SCHEDULED&filter[currentTouchType]=EMAIL") {
    paging{
      totalCount
    }
  }
  others( userFilter: $userFilter )
  @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[currentTouchStatus]=SCHEDULED&filter[currentTouchType]=OTHERS") {
    paging{
      totalCount
    }
  }
  linkedin( userFilter: $userFilter )
  @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[currentTouchStatus]=SCHEDULED&filter[currentTouchType]=LINKEDIN") {
    paging{
      totalCount
    }
  }
  text( userFilter: $userFilter )
  @rest(type: "Prospect", path: "prospects?page[limit]=1:userFilter&filter[currentTouchStatus]=SCHEDULED&filter[currentTouchType]=TEXT") {
    paging{
      totalCount
    }
  }
}
`;
export const UPDATE_PROSPECT_QUERY = gql`
  query($prospectId: ID!, $input: Object!) {
    prospect(prospectId: $prospectId, input: $input)
    @rest(type: "Prospect", path: "prospects/:prospectId" method:"PUT") {
      response
    }
  }
`;

export const FETCH_PROSPECT_QUERY_IDS = gql`
  query($includeAssociationsQry: String!, $limit: String!, $offset: String!, $ids: ID!) {
    prospect(includeAssociationsQry: $includeAssociationsQry, limit: $limit, offset: $offset, ids: $ids)
    @rest(type: "Prospect", path: "prospects?:includeAssociationsQry&page[limit]=:limit&page[offset]=:offset&filter[id]=:ids") {
      data
      includedAssociations
      paging
    }
  }
`;

export const COMPLETE_TOUCH_QUERY = gql`
  query($prospectId: ID!,$input:Object!) {
    completeTouch(prospectId:$prospectId,input: $input)
    @rest(type: "Prospect", path: "prospects/:prospectId/completeTouch", method: "POST") {
      response
    }
  }
`
export default FETCH_PROSPECTS_QUERY;