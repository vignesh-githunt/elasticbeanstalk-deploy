import React, { Component } from 'react'
import ExtensionStatus from '../../ExtensionStatus'

export class ExtensionStatusCell extends Component {
  render () {
    const { row } = this.props

    if (!row.extension || !row[this.props.col.key] )
      return null

    return <ExtensionStatus userId={row[this.props.col.props.userIdKey]} status={ row.extension } />
  }
}
