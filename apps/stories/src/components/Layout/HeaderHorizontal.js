import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
} from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/actions";
import HeaderRun from "./Header.run";
import Logo from "../../images/truStories-logo-white.png";
import ToggleFullscreen from "../Common/ToggleFullscreen";
import AdminHeader from "./AdminHeader";
import PageLoader from "../Common/PageLoader";
import Avatar from "../../images/default-avatar.jpg";
import { SIGNOUT_MUTATION } from "../mutations/UserMutations";
import { useMutation } from "@apollo/react-hooks";
import { useTracking } from "../SegmentTracker";
import UserContext from "../UserContext";
import useNotifications from "../hooks/useNotifications";

const HeaderHorizontal = ({ actions, history }) => {
  const { user, loading: userLoading, error, logout } = useContext(UserContext);
  const tracker = useTracking();
  const [signoutProvider] = useMutation(SIGNOUT_MUTATION);

  const { Notifications } = useNotifications(
    user,
    userLoading,
    history
  );

  useEffect(() => {
    HeaderRun();
  });
  const handleLogout = () => {
    tracker.track("User Logout Clicked");
    signoutProvider({}).then((result) => {
      if (result.data.logout) {
        actions.signOut();
        actions.removeCustomer();
        logout();
        tracker.track("User Logged Out");
        history.push("/login");
      }
    });
  }
  const connectActivatedIntegration = (e) => {
    const provider = e
    if (process.env.NODE_ENV !== "production") {
      window.location =
        "https://dev.outboundworks.com/users/auth/" +
        provider +
        "?origin=" +
        user.id;
    } else {
      window.location = "/users/auth/" + provider + "?origin=" + user.id;
    }
  }

  const handleXdrDownload = () => {
    history.push("/onboarding");
  };

  if (userLoading) return null;
  if (error) {
    actions.signOut();
    actions.removeCustomer();
    logout();
    history.push("/login");
  }
  if (!user) return <PageLoader />;

  const _avatar = user ? user.imageUrl || Avatar : Avatar;
  return (
    <React.Fragment>
      <header className="topnavbar-wrapper">
        {user && user.rolesMask === 1 && <AdminHeader />}
        <nav className="navbar topnavbar navbar-expand-lg navbar-inverse">
          <div className="navbar-header">
            <a className="navbar-brand" href="#/">
              <div className="brand-logo">
                <img
                  src={Logo}
                  alt="TruStories - Automated Sales Development"
                  className="img-fluid"
                  title="TruStories - Automated Sales Development"
                  width={144}
                />
              </div>
              <div className="brand-logo-collapsed">
                <img className="img-fluid" src={Logo} alt="App Logo" />
              </div>
            </a>
          </div>
          <Nav navbar className="mr-auto flex-column flex-lg-row">
            <NavItem>
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/stories">
                Stories
              </Link>
            </NavItem>
            {user.rolesMask < 4 && (
              <React.Fragment>
                <NavItem>
                  <Link className="nav-link" to="/accounts">
                    Accounts
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to="/senders">
                    Senders
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link" to="/settings/overview">
                    Settings
                  </Link>
                </NavItem>
              </React.Fragment>
            )}
          </Nav>
          <Nav className="flex-row" navbar>
            {/* Search icon */}
            {/* <NavItem>
                <NavLink href="" data-search-open="">
                  <em className="icon-magnifier"></em>
                </NavLink>
              </NavItem> */}
            {/* Fullscreen (only desktops) */}
            {(user.company.senderDailySendingLimit === 0 ||
              user.dailySendingLimit === 0) && (
              <NavItem className="d-none d-md-block">
                {user.rolesMask < 4 && (
                  <Link className="nav-link" to="/settings/overview">
                    <span className="badge badge-danger">Sending Disabled</span>
                  </Link>
                )}
                {user.rolesMask === 4 && (
                  <div className="nav-link">
                    <span className="badge badge-danger">Sending Disabled</span>
                  </div>
                )}
              </NavItem>
            )}
            <NavItem className="d-none d-md-block">
              <ToggleFullscreen className="nav-link" />
            </NavItem>
            {/* START Alert menu */}
            <Notifications />
            {/* END Alert menu */}
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
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                    {user.onlineTime === 0 && (
                      <ListGroupItem onClick={handleXdrDownload}>
                        <span className="d-flex align-items-center">
                          <span className="text-sm">Onboarding</span>
                        </span>
                      </ListGroupItem>
                    )}
                    {user.sfdcIdentity == null && (
                      <ListGroupItem
                        onClick={() =>
                          connectActivatedIntegration("salesforce")
                        }
                      >
                        <span className="d-flex align-items-center">
                          <span className="text-sm">Connect to Salesforce</span>
                        </span>
                      </ListGroupItem>
                    )}
                    {user.connectleaderIdentity == null && (
                      <ListGroupItem
                        onClick={() =>
                          connectActivatedIntegration("connectleader")
                        }
                      >
                        <span className="d-flex align-items-center">
                          <span className="text-sm">
                            Connect to ConnectLeader
                          </span>
                        </span>
                      </ListGroupItem>
                    )}
                    <ListGroupItem onClick={handleLogout}>
                      <span className="d-flex align-items-center">
                        <span className="text-sm" defaultValue>
                          Logout
                        </span>
                      </span>
                    </ListGroupItem>
                  </ListGroup>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </nav>
      </header>
    </React.Fragment>
  );
};

HeaderHorizontal.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object,
};

const mapStateToProps = (state) => ({ settings: state.settings });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HeaderHorizontal));
