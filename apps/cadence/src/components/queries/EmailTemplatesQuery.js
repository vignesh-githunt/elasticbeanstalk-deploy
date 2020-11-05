/**
 * @author @Sk_Khaja_moulali-gembrill
 * @version V11.0
 */
import gql from "graphql-tag";

const FETCH_EMAIL_TEMPLATES_QUERY = gql`
  query($limit: String!, $offset: String!) {
    templates(limit: $limit, offset: $offset)
     @rest(type: "Templates", path: "emailTemplates?page[limit]=:limit&page[offset]=:offset") {
      data
      paging
    }
  }
`;

export const CREATE_EMAIL_TEMPLATE_QUERY = gql`
  query {
    template(input: $input)
    @rest(type: "Template", path: "emailTemplates" method:"POST") {
      response
    }
  }
`;

export const FETCH_GROUP_USERS_LIST_QUERY = gql`
  query($limit: String!, $offset: String!) {
    users(limit: $limit, offset: $offset)
     @rest(type: "Users", path: "users?page[limit]=:limit&page[offset]=:offset") {
      data
      paging
    }
  }
`;

export const FETCH_CATEGORIES_LIST_QUERY = gql`
  query($limit: String!, $offset: String!) {
    categories(limit: $limit, offset: $offset)
     @rest(type: "Categories", path: "emailTemplates/category?page[limit]=:limit&page[offset]=:offset") {
      data
      paging
    }
  }
`;
export default FETCH_EMAIL_TEMPLATES_QUERY;