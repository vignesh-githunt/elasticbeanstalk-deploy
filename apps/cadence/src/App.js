import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider } from 'react-redux';
import client from './apollo/createApolloClient';
import configureStore from './store/store';
import {
  TrackingProvider,
  ErrorBoundary,
  PageLoader,
} from '@nextaction/components/';
import './Vendor';

// import "./i18n";
// App Routes
import Routes from './Routes';

// Application Styles
// import "/styles/bootstrap.scss";

import '@koncert/styles';
import './styles/app.scss';
import 'react-toastify/dist/ReactToastify.css';
//import "./styles/themes/theme-trucadence.scss"
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

// import React from 'react';
// import './App.css';
// import { Base } from '@nextaction/components';

// const App = () => {
//   return (

//     <Base productName="TruCadence">

//     </Base>
//   );
// }

// export default App;
