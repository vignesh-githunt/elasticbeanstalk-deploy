import React, { Component } from 'react'

export class LinkCell extends Component {

  render () {
    const { row, col } = this.props
    const { linkUrlProp, editUrlProp, iconProp } = col.props

    const url = row[linkUrlProp]
    const editUrl = row[editUrlProp]
    const icon = row[iconProp]
    if (!url) return ''
    return (
      <React.Fragment>
        <a href={`${url}`}>{icon && <i className={`fa ${icon} obw-link-icon`}></i>} {row[col.key]}</a> {editUrlProp && <a href={`${editUrl}`}> <i className="fa fa-edit"></i></a> }
      </React.Fragment>
    )
  }
}
