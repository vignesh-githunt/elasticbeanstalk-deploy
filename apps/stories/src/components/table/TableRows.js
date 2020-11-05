import React, { Component } from 'react'
import { TableGroup } from './TableGroup'
import { TableRow } from './TableRow'

export class TableRows extends Component {

  static propTypes = {

  }

  render() {
    return (
      this.props.rows.map((row, i) => {
        return row.rows ?
          <TableGroup key={'group-' + row.id} row={row} cols={this.props.cols} open={this.props.openGroups} index={i + 1}></TableGroup>
          :
          <TableRow key={row.id || i} row={row} cols={this.props.cols} index={i + 1}></TableRow>
      })
    )
  }
}
