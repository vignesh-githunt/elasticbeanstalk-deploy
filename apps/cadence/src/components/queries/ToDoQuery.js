/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import gql from "graphql-tag";

const FETCH_TODO_COUNT_QUERY = gql`
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

export default FETCH_TODO_COUNT_QUERY;