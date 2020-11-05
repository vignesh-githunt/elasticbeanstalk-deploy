import React from 'react';
import { APP_COLORS } from '@koncert/shared-components';
//import 'loaders.css';
//import 'spinkit/spinkit.min.css';
import Spinner from 'react-spinkit';

export default (props) => (
  <div className={`obw-loader-container ${props.inline ? 'obw-inline' : ''}`}>
    <Spinner name="wave" color={APP_COLORS.primary} />
  </div>
);
