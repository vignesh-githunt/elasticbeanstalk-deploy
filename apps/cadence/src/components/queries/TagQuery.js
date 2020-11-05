import gql from "graphql-tag";

export const FETCH_TAG_LIST_QUERY = gql`
  query(
    $includeAssociationsQry: String!
    $filter: String!
    $limit: String!
    $offset: String!
  ) {
    allTags(
      includeAssociationsQry: $includeAssociationsQry
      filter: $filter
      limit: $limit
      offset: $offset
    )
      @rest(
        type: "Tag"
        path: "tags?page[limit]=:limit&page[offset]=:offset:filter"
      ) {
      data
      paging
    }
  }
`;

export const FETCH_TAG_QUERY = gql`
  query($id: ID!, $limit: String!, $offset: String!) {
    tag(id: $id, limit: $limit, offset: $offset)
      @rest(
        type: "Tag"
        path: "tags/:id?page[limit]=:limit&page[offset]=:offset"
      ) {
      data
      paging
    }
  }
`;

export const FETCH_EMAIL_TEMPLATES_LIST_QUERY = gql`
  query(
    $filter: String!
    $limit: String!
    $offset: String!
  ) {
    templates(
      filter: $filter
      limit: $limit
      offset: $offset
    )
      @rest(
        type: "Templates"
        path: "emailTemplates?page[limit]=:limit&page[offset]=:offset:filter"
      ) {
      data
      paging
      includedAssociations
    }
  }
`;



export const FETCH_CATEGORIES_LIST_QUERY = gql`
  query($includeAssociationsQry: String!, $limit: String!, $offset: String!) {
    categories(
      includeAssociationsQry: $includeAssociationsQry
      limit: $limit
      offset: $offset
    )
      @rest(
        type: "Categories"
        path: "emailTemplates/category?page[limit]=:limit&page[offset]=:offset"
      ) {
      data
      paging
    }
  }
`;

export default FETCH_TAG_LIST_QUERY;