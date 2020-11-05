import React, { useEffect, useContext } from "react";

import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/actions";

// import ToggleFullscreen from '../Common/ToggleFullscreen';
import HeaderRun from "./Header.run";
// import Logo from '../../images/obw-logo.png'
import UserContext from "../UserContext";
import { Logo, LogoSmall, ToggleFullscreen, PageLoader, Avatar } from "@nextaction/components";

const Header = ({history, ...props} ) => {
  var { user, loading: userLoading, error, logout } = useContext(UserContext);
  useEffect(() => {
    HeaderRun();
  }, []);

  const toggleUserblock = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("showUserBlock");
  };

  const toggleOffsidebar = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("offsidebarOpen");
  };

  const toggleCollapsed = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("isCollapsed");
    resize();
  };

  const toggleAside = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("asideToggled");
  };

  const resize = () => {
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
  };

  const handleLogout = () => { 
    console.log("Logout Not implemented")
  }

  if (userLoading) return null;
  if (error) {
    history.push("/login");
  }
  if (!user) return <PageLoader />;

  const _avatar = user ? user.imageUrl || Avatar : Avatar;
  return (
    <header className="topnavbar-wrapper">
      {/* START Top Navbar */}
      <nav className="navbar topnavbar">
        {/* START navbar header */}
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            <div className="brand-logo">
              <img className="img-fluid" src={Logo} alt="App Logo" />
            </div>
            <div className="brand-logo-collapsed">
              <img className="img-fluid" src={LogoSmall} alt="App Logo" />
            </div>
          </a>
        </div>
        {/* END navbar header */}

        {/* START Left navbar */}
        <ul className="navbar-nav mr-auto flex-row">
          <li className="nav-item">
            {/* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
            <a
              href=""
              className="nav-link d-none d-md-block d-lg-block d-xl-block"
              onClick={toggleCollapsed}
            >
              <em className="fas fa-bars"></em>
            </a>
            {/* Button to show/hide the sidebar on mobile. Visible on mobile only. */}
            <a
              href=""
              className="nav-link sidebar-toggle d-md-none"
              onClick={toggleAside}
            >
              <em className="fas fa-bars"></em>
            </a>
          </li>
          
          {/* START lock screen */}
          {/* <li className="nav-item d-none d-md-block">
            <Link to="lock" title="Lock screen" className="nav-link">
              <em className="icon-lock"></em>
            </Link>
          </li> */}
          {/* END lock screen */}
        </ul>
        {/* END Left navbar */}
        {/* START Right Navbar */}
        <ul className="navbar-nav flex-row">
          {/* Search icon */}
          <li className="nav-item">
            <a className="nav-link" href="" data-search-open="">
              <em className="icon-magnifier"></em>
            </a>
          </li>
          {/* Fullscreen (only desktops) */}
          <li className="nav-item d-none d-md-block">
            <ToggleFullscreen className="nav-link" />
          </li>
          {/* START Alert menu */}
          <UncontrolledDropdown nav inNavbar className="dropdown-list">
            <DropdownToggle nav className="dropdown-toggle-nocaret">
              <em className="icon-bell"></em>
              <span className="badge badge-danger">11</span>
            </DropdownToggle>
            {/* START Dropdown menu */}
            <DropdownMenu
              right
              className="dropdown-menu-right animated flipInX"
            >
              <DropdownItem>
                {/* START list group */}
                <ListGroup>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="media">
                      <div className="align-self-start mr-2">
                        <em className="fab fa-twitter fa-2x text-info"></em>
                      </div>
                      <div className="media-body">
                        <p className="m-0">New followers</p>
                        <p className="m-0 text-muted text-sm">1 new follower</p>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="media">
                      <div className="align-self-start mr-2">
                        <em className="fa fa-envelope fa-2x text-warning"></em>
                      </div>
                      <div className="media-body">
                        <p className="m-0">New e-mails</p>
                        <p className="m-0 text-muted text-sm">
                          You have 10 new emails
                        </p>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="media">
                      <div className="align-self-start mr-2">
                        <em className="fa fa-tasks fa-2x text-success"></em>
                      </div>
                      <div className="media-body">
                        <p className="m-0">Pending Tasks</p>
                        <p className="m-0 text-muted text-sm">
                          11 pending task
                        </p>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="d-flex align-items-center">
                      <span className="text-sm">More notifications</span>
                      <span className="badge badge-danger ml-auto">14</span>
                    </span>
                  </ListGroupItem>
                </ListGroup>
                {/* END list group */}
              </DropdownItem>
            </DropdownMenu>
            {/* END Dropdown menu */}
          </UncontrolledDropdown>
          <UncontrolledDropdown nav inNavbar className="dropdown-list">
            <DropdownToggle nav className="dropdown-toggle-nocaret">
              <em className="icon-user"></em>
            </DropdownToggle>
            <DropdownMenu
              right
              className="dropdown-menu-right animated flipInX"
            >
              <DropdownItem>
                {/* START list group */}
                <ListGroup>
                  <ListGroupItem
                    action
                    tag="a"
                    href="/user/settings"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div>
                      <div className="item user-block">
                        {/* User picture */}
                        <div className="user-block-picture">
                          <div className="user-block-status">
                            <img
                              className="img-thumbnail rounded-circle"
                              src={_avatar}
                              alt="Avatar"
                              width="60"
                              height="60"
                            />
                            <div className="circle bg-success circle-lg"></div>
                          </div>
                        </div>
                        {/* Name and Job */}
                        <div className="user-block-info">
                          <span className="user-block-name">
                            Hello, {user.firstName}
                          </span>
                          <span className="user-block-role">
                            {user.title}
                            <br />
                            {user.roles && user.roles.join(",")}
                          </span>
                          {/* <a
                                className="btn btn-secondary btn-xs"
                                onClick={handleLogout}
                              >
                                Logout
                              </a> */}
                        </div>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem onClick={handleLogout}>
                    <span className="d-flex align-items-center">
                      <span className="text-sm">Logout</span>
                    </span>
                  </ListGroupItem>
                </ListGroup>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          {/* END Alert menu */}
          {/* START Offsidebar button */}
          {/* <li className="nav-item">
            <a className="nav-link" href="" onClick={toggleOffsidebar}>
              <em className="icon-notebook"></em>
            </a>
          </li> */}
          {/* END Offsidebar menu */}
        </ul>
        {/* END Right Navbar */}

        {/* START Search form */}
        <form className="navbar-form" role="search" action="search.html">
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="Type and hit enter ..."
            />
            <div
              className="fa fa-times navbar-form-close"
              data-search-dismiss=""
            ></div>
          </div>
          <button className="d-none" type="submit">
            Submit
          </button>
        </form>
        {/* END Search form */}
      </nav>
      {/* END Top Navbar */}
    </header>
  );
};

Header.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object,
};

const mapStateToProps = function (state) {
  return {
    settings: state.settings,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
