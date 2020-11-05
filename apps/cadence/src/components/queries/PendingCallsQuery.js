/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import gql from "graphql-tag";

const FETCH_TOUCHES_QUERY = gql`
  query($touchesFilter: String!) {
    touches(touchesFilter: $touchesFilter)
      @rest(type: "MultiTouchesSteps", path: "touches?:touchesFilter") {
      data
    }
  }
`;

export default FETCH_TOUCHES_QUERY;