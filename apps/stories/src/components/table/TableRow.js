import React, { Component } from 'react'
import * as CellComponents from './cells'

export class TableRow extends Component {

  render() {
    const className = (this.props.className || '') + (this.props.onClick ? ' row-clickable' : '')
    let rowColor = ''
    if (this.props.row && this.props.row.props) {
     rowColor = this.props.row.props.rowcolor
    }

    return (
      <tr className={`${className} ${rowColor}`} onClick={this.props.onClick} >
        {this.props.cols.map(col => {
           const CellComponent = CellComponents[col.type.component || 'TextCell']
           return (
             <td
               colSpan={this.props.colSpan}
               key={col.key}
               width={col.props.width}
               textalign={col.props.textAlign}
               className={col.props.className}
             >
               <CellComponent row={this.props.row} col={col} index={this.props.index} />
             </td>
           )
        })}
      </tr>
    )
  }
  }
