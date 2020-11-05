import React, { Component } from 'react'
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";


export class MenuCell extends Component {

  state = {
    isOpen: false
  }

  render () {
    const menuItems = this.props.row[this.props.col.key];
    return (
    <ButtonDropdown
      isOpen={this.state["isOpen"]}
      toggle={() => this.setState({ isOpen: !this.state.isOpen })}
      key={this.props.col.key}
      id={this.props.col.key}
    >
      <DropdownToggle caret color="secondary">
        Manage
      </DropdownToggle>
      <DropdownMenu>
        {menuItems.map(menuItem => {
          return (menuItem.href ? 
            <DropdownItem key={menuItem.href} href={menuItem.href}>{menuItem.text}</DropdownItem> : 
            <DropdownItem key={menuItem.text} onClick={menuItem.onClick}>{menuItem.text}</DropdownItem>
          )
          })
        }
      </DropdownMenu>
    </ButtonDropdown>);
  }
}


