// import "core-js/es6/string";
// import "core-js/es6/array";
// import "core-js/es6/map";
// import "core-js/es6/set";
// import "core-js/es6/object";
// import "core-js/es6/promise";
// import "core-js/es7/object";
// import "core-js/es7/array";
// import "raf/polyfill";
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider } from 'react-redux';
import createApolloClient from './apollo/createApolloClient';
import configureStore from './store/store';
import { TrackingProvider } from './components/SegmentTracker/index';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './i18n';
// App Routes
import Routes from './Routes';
import './Vendor';
// Application Styles
import '@koncert/styles';
import './styles/app.scss';

const client = createApolloClient();
const store = configureStore();

// Vendor dependencies

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <TrackingProvider>
          <ErrorBoundary>
            <Router basename={process.env.PUBLIC_URL}>
              <Routes />
            </Router>
          </ErrorBoundary>
        </TrackingProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
