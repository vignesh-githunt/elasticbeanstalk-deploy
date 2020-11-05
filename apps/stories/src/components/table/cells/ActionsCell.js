import React, { Component } from 'react'

export class ActionsCell extends Component {

  render () {
    const { row, col } = this.props
    return <i className='fa fa-trash' onClick={() => col.props.onDelete(row) } />
  };
}
