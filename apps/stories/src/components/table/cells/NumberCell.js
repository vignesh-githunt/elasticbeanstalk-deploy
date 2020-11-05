import { Component } from 'react'

export class NumberCell extends Component {

  render () {
    const val = this.props.row[this.props.col.key];
    return val ? val.toLocaleString() : '-';
  }
}
