import React, { Component } from 'react';
import {
  Nav,
  NavItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

export default class AdminHeader extends Component {

  render() {
    return (
      <header className="obw-customer-header">
        <nav className="">
          <Nav navbar className="mr-auto flex-column flex-lg-row">
            <NavItem>
              <Link className="nav-link" to="/dashboard">Message Queue</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/customers">Stories List</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/warehouse">Warehouse</Link>
            </NavItem>
          </Nav>
        </nav>
      </header>
    );
  }
}
