/**
 * @author  @ManimegalaiV
 * */
import gql from "graphql-tag";

const FETCH_TAG_QUERY = gql`
query($tagFilter:String!,$limit: String!, $offset: String!) {
  allTags(tagFilter:$tagFilter,limit: $limit, offset: $offset)
  @rest(type: "Tag", path: "tags?page[limit]=:limit&page[offset]=:offset:tagFilter") {
    data
    paging
  }
}
`;

export const CREATE_TAG_QUERY = gql`
  query{
    Tag(input:$input)
    @rest(type: "Tag", path: "tags" method:"POST") {
      response
    }
  }
`;

export const UPDATE_TAG_QUERY = gql`
query($id: ID!,$name: String!) {
  Tag(id: $id,input:{name:$name})
    @rest(type: "Tag", path: "tags/:id" method:"PUT") {
      response
    }
  }
`;

export const DELETE_TAG_QUERY = gql`
  query($tagId: ID!) {
    deleteTag(tagId: $tagId)
    @rest(type: "Tag", path: "tags/:tagId" method:"DELETE") {
      response
    }
  }
`;

export const FETCH_CALL_OUTCOMES_QUERY = gql`
  query($limit: String!, $offset: String!) {
    call(limit: $limit, offset: $offset)
    @rest(type: "call", path: "callDispositions?page[limit]=500&page[offset]=0") {
      data
      paging
    }
  }
`;

export const FETCH_ALL_OUTCOMES_QUERY = gql`
  query($limit: String!, $offset: String!) {
    allOutcomes(limit: $limit, offset: $offset)
    @rest(type: "all", path: "outcomes?page[limit]=500&page[offset]=0") {
      data
      paging
    }
  }
`;

export const FECTH_ALL_MEMBER_STAGE_QUERY = gql`
query($id:ID!){
  member(id:$id)
  @rest(type: "member", path: "memberStages") {
    data
  }
}
`;

export const UPDATE_TOUCH_OUTCOME_QUERY = gql`
  query($id:ID!) {
    outcome(id: $id,input:$input)
    @rest(type: "outcome", path: "settings/outcomes/:id" method:"PUT") {
      response
    }
  }
`;

export const FETCH_EMAIL_ACCOUNT_QUERY = gql`
  query($emailFilter: String!) {
    Email(emailFilter: $emailFilter)
    @rest(type: "Email", path: "emailAccounts?:emailFilter") {
      data
    }
  }
`;

export const CREATE_EMAIL_ACCOUNT_QUERY = gql`
  query{
    Email(input:$input)
    @rest(type:"Email", path:"emailAccounts" method:"POST") {
      response
    }
  }
`;

export const UPDATE_EMAIL_ACCOUNT_QUERY = gql`
query($id: ID!) {
  Email(id: $id, input:$input)
    @rest(type: "Email", path: "emailAccounts/:id" method:"PUT") {
      response
    }
  }
`;

export const FETCH_EMAIL_SIGNATURE_QUERY = gql`
  query($signatureFilter: String!) {
    Email(signatureFilter: $signatureFilter)
    @rest(type: "Signature", path: "emailSignatures?:signatureFilter") {
      data
    }
  }
`;
export const CREATE_EMAIL_SIGNATURE_QUERY = gql`
  query($content: String!){
    Email(input:{content:$content})
    @rest(type:"Signature", path:"emailSignatures" method:"POST") {
      response
    }
  }
`;

export const UPDATE_EMAIL_SIGNATURE_QUERY = gql`
query($id: ID!,$content: String!) {
  Email(id: $id,input:{content:$content})
    @rest(type: "Signature", path: "emailSignatures/:id" method:"PUT") {
      response
    }
  }
`;

export const FETCH_SCHEDULE_QUERY = gql`
  query($includeAssociationsQry: String!,$id: ID!) {
    schedule(includeAssociationsQry:$includeAssociationsQry,id: $id)
    @rest(type: "Schedule", path: "schedules/:id?:includeAssociationsQry") {
      data
      includedAssociations
    }
  }
`;

export const FETCH_SCHEDULES_QUERY = gql`
  query($limit: String!, $offset: String!) {
    schedule(limit: $limit, offset: $offset)
    @rest(type: "Schedule", path: "schedules") {
      data
      paging
    }
  }
`;

export const CREATE_SCHEDULE_QUERY = gql`
  query{
    schedule(input:$input)
    @rest(type: "Schedule", path: "schedules" method:"POST") {      
      data
    }
  }
`;
export const UPDATE_SCHEDULE_QUERY = gql`
  query($id:ID!) {
    schedule(id: $id,input:$input)
    @rest(type: "Schedule", path: "schedules/:id" method:"PUT") {
      response
    }
  }
`;

export const DELETE_SCHEDULE_QUERY = gql`
  query($id:ID!) {
    schedule(id: $id)
    @rest(type: "Schedule", path: "schedules/:id" method:"DELETE") {
      response
    }
  }
`;

export const CLONE_SCHEDULE_QUERY = gql`
query($id:ID!,$scheduleName:String!) {
  schedule(id: $id,scheduleName:$scheduleName,input:$input)
  @rest(type: "Schedule", path: "schedules/:id/cloneSchedule/:scheduleName" method:"PUT") {
    data
  }
}
`;

export const CREATE_TIMESLOT_QUERY = gql`
  query{
    Timeslot(input:$input)
    @rest(type: "Timeslot", path: "scheduleTimeSlots" method:"POST") {
      response
    }
  }
`;

export const FETCH_MANAGER_USER_QUERY = gql`
query($isManagerUser: String!) {
  manager(isManagerUser: $isManagerUser)
  @rest(type: "Schedule", path: "users?:isManagerUser") {
    data
    
  }
}
`;

export const FETCH_ALL_USER_QUERY = gql`
query($id:ID!){
  user(id:$id)
  @rest(type: "user", path: "users") {
    data
  }
}
`;

export const FETCH_ALL_SYNCLOG_QUERY = gql`
query($syncLogFilter:String!,$limit: String!, $offset: String!) {
  synclogs(syncLogFilter: $syncLogFilter,limit: $limit, offset: $offset)
  @rest(type: "SyncLogs", path: "settings/synclogs?page[limit]=:limit&page[offset]=:offset:syncLogFilter") {
    data
    paging
  }
}
`;

export const FETCH_ALL_SETTINGS_QUERY = gql`
query($id:ID!){
  settings(id:$id)
  @rest(type: "Settings", path: "org") {
    data
  }
}
`;
export const FETCH_USER_SETTING_QUERY = gql`
query($id:ID!){
  usersettings(id:$id)
  @rest(type: "Usersettings", path: "settings/user") {
    data
  }
}
`;

export const UPDATE_USER_SETTING_QUERY = gql`
    query($menuExpanded: String!){
    usersettings(input:{isTrucadenceLeftmenuExpanded:$menuExpanded})
    @rest(type: "UserSettings", path: "users" method:"POST") {
      response
    }
  }
`;

export default FETCH_TAG_QUERY;