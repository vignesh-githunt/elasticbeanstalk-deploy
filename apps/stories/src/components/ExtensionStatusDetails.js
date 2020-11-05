import React from 'react';

export default function ExtensionStatusDetails(props) {

  return <React.Fragment>
        <div>{ props.onlineStatus } - { props.lastSeen } </div>
        <div>{ props.platform } </div>
        <div>{ props.linkedin } </div>
        <div>{ props.salesNav } </div>
        <div>{ props.websocket } </div>
        { props.status.version && <div>Version: { props.status.version }</div> }
        { !props.loading && <div>Last 7 days: {props.user.onlineTime} hours</div> }
        </React.Fragment>
}
