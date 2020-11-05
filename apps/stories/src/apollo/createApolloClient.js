import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import * as actions from "../store/actions/actions";
import { createBrowserHistory } from 'history'


const createClient = () => {

  const uploadLink = createUploadLink({
    uri: `${process.env.REACT_APP_GRAPHQL_SERVER_URI}`
  })

  const history = createBrowserHistory()

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jwtToken')
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        //'X-Plugin-Token': window.current_user_plugin_token,
      },
    };
  })

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path }) =>
        console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`)
      );
    }

    if (networkError) {
      console.error(
        `[Network error ${operation.operationName}]: ${networkError.message}`
      );
    }
    const { response } = operation.getContext();
    if (response.status === 401) {
      console.log("error", "redirecting to login");
      actions.signOut();
      client.clearStore();
      // eslint-disable-next-line no-restricted-globals
      if (location.hash !== "#/login") {
        // eslint-disable-next-line no-restricted-globals
        history.push("#/login");
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    }
  });

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_GRAPHQL_SERVER_URI}`,
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, uploadLink, httpLink]),
    cache: new InMemoryCache()
  });

  return client
}

export const createLoginClient = () => {
  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path }) =>
        console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`)
      );
    }

    if (networkError) {
      console.error(
        `[Network error ${operation.operationName}]: ${networkError.message}`
      );
    }
  });

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_GRAPHQL_UNAUTHORIZED_SERVER_URI}`,
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return client;
};


export default createClient;
