import ApolloClient from 'apollo-boost'
import customFetch from "../lib/fetch-mp";

export const client = new ApolloClient({
         uri: `${process.env.REACT_APP_STORIES_GRAPHQL_URI}`,
         request: (operation) => {
           const token = localStorage.getItem("token");
           operation.setContext({
             headers: {
               authorization: token ? `Bearer ${token}` : "",
             },
           });
         },
       });

export default client