import { Component } from 'react'

export class Cell extends Component {

  render () {
    return this.props.row[this.props.col.key] || ''
  }
}
