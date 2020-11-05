import gql from "graphql-tag";

export const START_CUSTOMER_ACCOUNT_CREATION = gql`
  mutation StartAccountCreation($customerId: String!) {
    startAccountCreation(customerId: $customerId) 
  }
`;

export const START_CUSTOMER_CONTACT_CREATION = gql`
  mutation StartContactCreation($customerId: String!) {
    startContactCreation(customerId: $customerId)
  }
`;

export const START_CUSTOMER_CONTACT_RESEARCHERS_CREATION = gql`
  mutation StartContactResearchersCreation($customerId: String!) {
    startContactResearchersCreation(customerId: $customerId)
  }
`;

export const START_CUSTOMER_CONTACT_RESEARCH_RUNNER = gql`
  mutation StartContactResearchRunner($customerId: String!) {
    startContactResearchRunner(customerId: $customerId)
  }
`;

export const START_CUSTOMER_STORY_RUNNER = gql`
  mutation StartStoryRunner($customerId: String!) {
    startStoryRunner(customerId: $customerId)
  }
`;



