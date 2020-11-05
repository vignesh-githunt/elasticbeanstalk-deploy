import gql from "graphql-tag";

export const CUSTOMER_ACCOUNTS_COUNT = gql`
  query accountsCount($customerId: ID!) {
    _v3_Customer_AccountsMeta(where: { customerId: $customerId }) {
      count
    }
  }
`;

export const CUSTOMER_ACCOUNT_SELECTORS_COUNT = gql`
  query accountSelectorsCount($customerId: ID!) {
    _v3_Customer_AccountSelectorsMeta(where: { customerId: $customerId }) {
      count
    }
  }
`;

export const CUSTOMER_CONTACTS_COUNT = gql`
  query contactsCount($customerId: ID!) {
    _v3_Customer_ContactsMeta(where: { customerId: $customerId }) {
      count
    }
  }
`;

export const CUSTOMER_CONTACT_SELECTORS_COUNT = gql`
  query contactSelectorsCount($customerId: ID!) {
    _v3_Customer_ContactSelectorsMeta(where: { customerId: $customerId }) {
      count
    }
  }
`;

export const CUSTOMER_STORY_CONTACTS_COUNT = gql`
  query storyContactsCount($customerId: ID!) {
    _v3_Customer_StoryContactsMeta(where: { customerId: $customerId }) {
      count
    }
  }
`;