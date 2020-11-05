import React, { Component } from 'react'
import { TableRow } from './TableRow'
import { TableRows } from './TableRows'

const ToggleCell = (row, key, open) => (props) => (
  <React.Fragment>
    <i className={`fa ${open ? 'fa-minus-square' : 'fa-plus-square'}`} />
    {row[key]}
  </React.Fragment>
  )

export class TableGroup extends Component {

  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.state = { open: props.open || false }
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  render() {

    let groupRow = null
    if (this.props.row.groupName) {
      const groupRowCell = { name: ToggleCell(this.props.row, 'groupName', this.state.open)() }
      groupRow = <TableRow onClick={this.toggleOpen} className='group-row' row={groupRowCell} cols={[{ name: 'name' }]} colSpan={this.props.cols.length} />
    } else {
      groupRow = <TableRow row={this.props.row} cols={this.props.cols} />
    }

    return (
      <React.Fragment>
        {groupRow}
        {(this.props.open || this.state.open) && <TableRows rows={this.props.row.rows} cols={this.props.cols} />}
      </React.Fragment>
    )
  }
  }
