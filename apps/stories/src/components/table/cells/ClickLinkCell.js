import React, { Component } from 'react'

export class ClickLinkCell extends Component {

  render () {
    const { row, col } = this.props
    const { linkProp, onClick } = col.props
    return <a href={(row[linkProp] || '#')}  onClick={(e) => onClick(e, row)}>{row[this.props.col.key]}</a>
  };
}
