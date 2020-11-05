import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
// import Router from 'route-lite'
import { ApolloProvider } from '@apollo/react-hooks';
// import { Provider } from "react-redux";
// import logo from './logo.svg'
import ApolloClient from 'apollo-boost';
import Routes from '../../components/Routes';
// import { TrackingProvider } from "./components/SegmentTracker/index";
// import ErrorBoundary from "./components/Common/ErrorBoundary";
// import '../../styles/bootstrap.scss';
//import '@koncert/styles';
import '../../styles/app.scss';
import customFetch from '../../lib/fetch-mp';
import { InMemoryCache } from 'apollo-cache-inmemory';
import '../../Vendor';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_STORIES_GRAPHQL_URI}`,
  fetch: customFetch,
  cache: new InMemoryCache(),
});

const App = (props) => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes {...props} />
      </Router>
    </ApolloProvider>
  );
};
export default App;
