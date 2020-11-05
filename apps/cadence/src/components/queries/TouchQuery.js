import gql from "graphql-tag";

export const FETCH_TOUCHES_QUERY = gql`
  query(
    $includeAssociationsQry: String!
    $touchFilter: String
  ) {
    Touches(
      includeAssociationsQry: $includeAssociationsQry
      touchFilter: $touchFilter
    )
      @rest(
        type: "Touch"
        path: "touches?:includeAssociationsQry&:touchFilter&sort[stepNo]=asc"
      ) {
      data
      includedAssociations
      paging
    }
  }
`;

export const FETCH_TOUCH_QUERY = gql`
query($touchID: ID!) {
  touch(touchID: $touchID) @rest(type: "touch", path: "touches/:touchID") {
    data
    workflow
  }
}
`;

export const DELETE_TOUCH_QUERY = gql`
  query($touchID: ID!) {
    deletetouch(touchID: $touchID)
    @rest(type: "touch", path: "touches/:touchID" method:"DELETE") {
      response
    }
  }
`;

export const CREATE_TOUCH = gql`
  query(
    $productType: String!
    $timeToWaitAndExecute: Int!
    $timeToWaitUnit: String!
    $touchType: String!
    $cadenceId: ID!
    $emailTemplateId: String!
    $emailTouchType: String!
    $previewEmailFlag: String!
    $timeToComplete: Int!
    $timeToCompleteUnit: String!
    $scheduleType: String!
    $touchExecutionScheduleId: Int!
    $scheduledDateTime: String!
    $scheduledTimezone: String!
    $socialMediaType: String!
    $linkedInType: String!
    $description: String!
    $stepNo: Int!
    $workflow: [Episode!]!
  ) {
    touches(
      input: {
        productType: $productType
        timeToWaitAndExecute: $timeToWaitAndExecute
        timeToWaitUnit: $timeToWaitUnit
        touchType: $touchType
        cadenceId: $cadenceId
        emailTemplateId: $emailTemplateId
        emailTouchType: $emailTouchType
        previewEmailFlag: $previewEmailFlag
        timeToComplete: $timeToComplete
        timeToCompleteUnit: $timeToCompleteUnit
        scheduleType: $scheduleType
        touchExecutionScheduleId: $touchExecutionScheduleId
        scheduledDateTime: $scheduledDateTime
        scheduledTimezone: $scheduledTimezone
        socialMediaType: $socialMediaType
        linkedInType: $linkedInType
        description: $description
        stepNo: $stepNo
        workflow: $workflow
      }
    ) @rest(method: "POST", type: "Touch", path: "touches") {
      data
    }
  }
`;




export const FETCH_SCHEDULE_QUERY = gql`
  query($limit: String!, $offset: String!) {
    schedules(limit: $limit, offset: $offset)
      @rest(
        type: "Schedule"
        path: "schedules?page[limit]=:limit&page[offset]=:offset"
        input: {}
      ) {
      data
    }
  }
`;



export const CREATE_OTHER_TOUCH = gql`
  query(
    $productType: String!
    $timeToWaitAndExecute: Int!
    $timeToWaitUnit: String!
    $touchType: String!
    $cadenceId: ID!
    $timeToComplete: Int!
    $timeToCompleteUnit: String!
    $scheduleType: String!
    $stepNo: Int!
    $socialMediaType: String!
    $description: String!
    $linkedInType: String!
    $workflow: [Episode!]!
  ) {
    touches(
      input: {
        productType: $productType
        timeToWaitAndExecute: $timeToWaitAndExecute
        timeToWaitUnit: $timeToWaitUnit
        touchType: $touchType
        cadenceId: $cadenceId
        timeToComplete: $timeToComplete
        timeToCompleteUnit: $timeToCompleteUnit
        scheduleType: $scheduleType
        stepNo: $stepNo
        socialMediaType: $socialMediaType
        description: $description
        linkedInType: $linkedInType
        workflow: $workflow
      }
    ) @rest(method: "POST", type: "Touch", path: "touches") {
      data
    }
  }
`;

export const EDIT_OTHER_TOUCH = gql`
  query(
    $touchID:ID!
    $productType: String!
    $timeToWaitAndExecute: Int!
    $timeToWaitUnit: String!
    $touchType: String!
    $cadenceId: ID!
    $timeToComplete: Int!
    $timeToCompleteUnit: String!
    $scheduleType: String!
    $stepNo: Int!
    $socialMediaType: String!
    $description: String!
    $linkedInType: String!
    $workflow: [Episode!]!
  ) {
    touches(
      touchID:$touchID
      input: {
        productType: $productType
        timeToWaitAndExecute: $timeToWaitAndExecute
        timeToWaitUnit: $timeToWaitUnit
        touchType: $touchType
        cadenceId: $cadenceId
        timeToComplete: $timeToComplete
        timeToCompleteUnit: $timeToCompleteUnit
        scheduleType: $scheduleType
        stepNo: $stepNo
        socialMediaType: $socialMediaType
        description: $description
        linkedInType: $linkedInType
        workflow: $workflow
      }
    ) @rest(method: "PUT", type: "Touch", path: "touches/:touchID") {
      response
    }
  }
`;

export default CREATE_TOUCH;