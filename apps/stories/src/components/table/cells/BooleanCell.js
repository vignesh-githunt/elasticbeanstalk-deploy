import React, { Component } from 'react'

export class BooleanCell extends Component {
  render () {
    if (!this.props.row[this.props.col.key])
      return null
    return <i className='fa fa-check' />
  }
}
