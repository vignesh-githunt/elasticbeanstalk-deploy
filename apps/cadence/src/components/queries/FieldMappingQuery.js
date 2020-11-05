/**
 * @author @Anbarasan
 * @version V11.0
 */
import gql from "graphql-tag";
const FETCH_CL_CRM_FIELD_MAPPING_QUERY = gql`
  query($id: ID!, $limit: String!, $offset: String!, $filterMapping: String!) {
    fields(id:$id, limit:$limit, offset:$offset, filterMapping:$filterMapping )
    @rest(type: "Fields", path:"fields?page[limit]=:limit&page[offset]=:offset:filterMapping") {
      data
    }
  }
`;
export default FETCH_CL_CRM_FIELD_MAPPING_QUERY;