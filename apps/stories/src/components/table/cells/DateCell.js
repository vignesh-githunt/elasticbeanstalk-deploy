import PropTypes from 'prop-types'
import { Component } from 'react'
import moment from 'moment'

export class DateCell extends Component {
  static propTypes = {
    col: PropTypes.shape({
      props: PropTypes.shape({
        format: PropTypes.string
      })
    })
  }

  get format() {
    return this.props.col.props.format || 'YYYY-MM-DD'
  }

  get date() {
    return this.props.row[this.props.col.key]
  }

  render () {
    return this.date ? moment(this.date).format(this.format) : ''
  }
}
