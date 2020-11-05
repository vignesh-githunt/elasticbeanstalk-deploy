import { Popover, OverlayTrigger } from 'react-bootstrap'
import React, { Component } from 'react'
import moment from 'moment'
import ExtensionStatusDetails from './ExtensionStatusDetails'
import { UserQuery } from './queries/UserQuery'

const ExtensionStatusDetailsWithData = UserQuery(ExtensionStatusDetails)

export default class ExtensionStatus extends Component {

  constructor(props) {
    super(props)
    if (props.status !== undefined) {
      const minutes = this.getMinutes(props.status.createdAt)
      this.online = minutes < 16
      this.away = minutes > 60
    } else {
      const minutes = 1000
      this.online = minutes < 16
      this.away = minutes > 60
    }

  }

  getMinutes(since) {
    const difference = moment().diff(moment(since))
    return moment.duration(difference).asMinutes()
  }

  getIcon(type, color) {
    return <i className={`fa ${ type } ${ color }`}></i>
  }

  getStatus(title, status, offColor = "extension-error", offType = "fa-times-circle", subtitle = true ) {
    const [type, color, text] = status ? ["fa-check-circle", "extension-success", ": connected"] : [offType, offColor, ": not connected"]
    return <span>{ this.getIcon(type, color) } { title }{ subtitle && text }</span>
  }

  getGeneralStatus(status) {
    var type = "fa-check-circle"
    var color = "extension-success"

    const warning = !status.salesNavigator
    const problem = !status.platform || !status.linkedin || !status.websocket

    if(this.away) { type = "fa-clock-o" }
    if(warning)   { type = "fa-exclamation-circle" }
    if(problem)   { type = "fa-times-circle" }

    if(this.online) {
      if(warning) { color = "extension-warning" }
      if(problem) { color = "extension-error" }
    } else {
      color = "extension-away"
    }

    return this.getIcon(type, color)
  }

  getOnlineStatus() {
    var title = "Offline"
    var offType = "fa-check-circle"

    if(this.away) { offType = "fa-clock-o" }
    if(this.online) { title = "Online" }

    return this.getStatus(title, this.online, "extension-away", offType, false)
  }

  getSalesNavStatus(status) {
    return this.getStatus("Sales Nav", status, "extension-warning", "fa-exclamation-circle")
  }

  getLastSeenSince(since) {
    return (<span>Last seen { moment(since).fromNow() }</span>)
  }

  getStatusPopover(status) {
    return (
      <Popover id='status-version' className="info popover">
        <div>{ this.getOnlineStatus() } - { this.getLastSeenSince(status.createdAt) } </div>
        <div>{ this.getStatus("Platform", status.platform) } </div>
        <div>{ this.getStatus("Linkedin", status.linkedin) } </div>
        <div>{ this.getSalesNavStatus(status.salesNavigator) } </div>
        <div>{ this.getStatus("Websocket", status.websocket) } </div>
        { status.version && <div>Version { status.version }</div> }
      </Popover>
    )
  }

  render() {
    if (this.props.status === undefined)
      return null;
    const status = this.props.status
    const ExtensionStatusPopoverWithDataAndStatus = (<Popover id='status-version' className="info popover">
      <ExtensionStatusDetailsWithData
          status={status}
          userId={this.props.userId}
          onlineStatus={this.getOnlineStatus()}
          lastSeen={this.getLastSeenSince(status.createdAt) }
          platform={this.getStatus("Platform", status.platform)}
          linkedin={this.getStatus("Linkedin", status.linkedin)}
          salesNav={this.getSalesNavStatus(status.salesNavigator)}
          websocket={this.getStatus("Websocket", status.websocket)}
        />
      </Popover>
    )

    return (
      <React.Fragment>
        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={ExtensionStatusPopoverWithDataAndStatus}>
          <span>{this.getGeneralStatus(status)}</span>
        </OverlayTrigger>
      </React.Fragment>
    )
  }
}
