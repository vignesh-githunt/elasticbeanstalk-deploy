import React, { Component } from 'react'

export class CheckCell extends Component {

  constructor(props) {
    super(props)
    this.state = {
      checked: props.row[props.col.key],
      disabled: !!props.row[props.col.props.disabledKey],
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      checked: newProps.row[newProps.col.key],
      disabled: !!newProps.row[newProps.col.props.disabledKey]
    });
  }

  setChecked = (e) => {
    const checked = e.target.checked
    this.props.col.props.onChange(this.props.row, checked)
    this.setState({ checked })
  }

  render () {
    const { disabled, checked } = this.state;
    return <input type="checkbox" disabled={disabled} checked={checked} onChange={this.setChecked} />
  }
}
