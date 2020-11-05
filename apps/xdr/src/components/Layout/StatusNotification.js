import React, { useState } from 'react';
import dispatcher from '../../lib/dispatcher';

const StatusNotification = () => {
  const [network, setNetwork] = useState({});
  const [platform, setPlatform] = useState({});
  const [linkedin, setLinkedin] = useState({});
  const [salesNavigator, setSalesNavigator] = useState({});
  const [websocket, setWebsocket] = useState({});
  const [version, setVersion] = useState('0.0');

  // const [networkTTOpen, setNetworkTTOpen] = useState(false)
  // const [platformTTOpen, setPlatformTTOpen] = useState(false);
  // const [linkedinTTOpen, setLinkedinTTOpen] = useState(false);
  // const [salesNavigatorTTOpen, setSalesNavigatorTTOpen] = useState(false);
  // const [websocketTTOpen, setWebsocketTTOpen] = useState(false);

  dispatcher.onMessage('status:notify', (e) => {
    console.log(e);
    setNetwork(e.network);
    setPlatform(e.platform);
    setLinkedin(e.linkedIn);
    setSalesNavigator(e.salesNavigator);
    setWebsocket(e.websocket);
    setVersion(e.version);
  });
  // const toggle = () => {
  //   console.log("toggle")
  //   // setNetworkTTOpen(!networkTTOpen)}
  // };

  const getColor = (x) => {
    return x && x.success ? 'bg-success' : 'bg-danger';
  };
  return (
    <div>
      <span>v{version}</span>
      <span
        title={network.text}
        className={'circle circle-md ' + getColor(network)}
      ></span>
      <span
        title={platform.text}
        className={'circle circle-md ' + getColor(platform)}
        href="#"
        id="platform"
      ></span>
      <span
        title={linkedin.text}
        className={'circle circle-md ' + getColor(linkedin)}
        href="#"
        id="linkedin"
      ></span>
      <span
        title={salesNavigator.text}
        className={'circle circle-md ' + getColor(salesNavigator)}
        href="#"
        id="salesNavigator"
      ></span>
      <span
        title={websocket.text}
        className={'circle circle-md ' + getColor(websocket)}
        href="#"
        id="websocket"
      ></span>
    </div>
  );
};

export default StatusNotification;
