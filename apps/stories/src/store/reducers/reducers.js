import { combineReducers } from 'redux';

import settingsReducer from './settings.reducer.js';
import themesReducer from './themes.reducers.js';
import customerReducers from './customer.reducers.js';
import * as apolloReducers from './apollo.reducers';
import authReducer from "./auth.reducers";

export default combineReducers({
  settings: settingsReducer,
  theme: themesReducer,
  customer: customerReducers,
  auth: authReducer,
  ...apolloReducers,
});
