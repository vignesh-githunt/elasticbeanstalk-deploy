/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { browser } from 'webextension-polyfill-ts';
import App from './views/Content/App';
import './content.scss';
import './index.scss';

const Main = ({ parentElement }) => {
  const toggler = () => {
    toggle();
  };
  return (
    <Frame
      head={[
        <link
          type="text/css"
          rel="stylesheet"
          href={chrome.runtime.getURL('/static/css/content.css')}
        ></link>,
      ]}
      key="frame"
      initialContent={
        '<!DOCTYPE html><html class="obw"><head></head><body class="layout-fixed"><div class="frame-root wrapper"></div></body></html>'
      }
    >
      <FrameContextConsumer>
        {
          // Callback is invoked with iframe's window and document instances
          ({ document, window }) => {
            // Render Children
            //document.getElementsByTagName("html")[0].classList.add("obw");
            //  return (
            //     <div className={'my-extension'}>
            //          <h1>Hello world - My first Extension</h1>
            //     </div>
            //  )
            return (
              <App
                document={document}
                window={window}
                parentElement={parentElement}
                toggle={toggler}
                isExt={true}
                key="content-app"
              />
            );
          }
        }
      </FrameContextConsumer>
    </Frame>
  );
};

const app = document.createElement('div');
app.id = 'my-extension-root';

document.body.appendChild(app);
ReactDOM.render(<Main parentElement={app} />, app);

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'clicked_browser_action') {
    toggle();
  }
});

const toggle = () => {
  if (app.style.transform === '') {
    //app.style.display = "block";
    app.style.transform = 'translateX(-400px)';
  } else {
    //app.style.display = "none";
    app.style.transform = '';
  }
};
