import React, { FunctionComponent } from 'react';
import { Hello } from '../components-old/hello';
import { browser } from 'webextension-polyfill-ts';
import { Scroller } from '../components-old/scroller';
import './styles.scss';

// // // //

export const Popup: FunctionComponent = () => {
  // Sends the `popupMounted` event
  React.useEffect(() => {
    browser.runtime.sendMessage({ popupMounted: true });
  }, []);

  // Renders the component tree
  return (
    <div className="popup-container">
      <div className="container mx-4 my-4">
        <Hello />
        <hr />
        <Scroller />
      </div>
    </div>
  );
};
