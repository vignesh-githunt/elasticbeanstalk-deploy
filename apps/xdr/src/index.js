import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/Content/App';

ReactDOM.render(
  <React.StrictMode>
    <App isExt={false} />
  </React.StrictMode>,
  document.getElementById('root')
);
