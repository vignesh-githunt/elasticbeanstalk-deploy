import React, { useState } from 'react';
import Logo from '../../images/truStories-logo-white.png';
import { Collapse } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import dispatcher from '../../lib/dispatcher';
import StatusNotification from './StatusNotification';

const Header = ({ history, toggle, parentElement }) => {
  const handleLogout = () => {
    //tracker.track("User Logout Clicked");
    // signoutProvider({}).then((result) => {
    //   if (result.data.logout) {
    //     actions.signOut();
    //     tracker.track("User Logged Out");
    //     history.push("/login");
    //   }
    // });
    //localStorage.removeItem('token');
    dispatcher.sendMessage('logout:completed');
    history.push('/login');
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topnavbar-wrapper">
      <nav className="navbar topnavbar navbar-expand-lg navbar-inverse">
        <button onClick={toggle} className="btn btn-outline text-white">
          <i className="fa fa-angle-right fa-2x"></i>
        </button>
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
          </a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={(e) => {
            setMenuOpen(!menuOpen);
          }}
        >
          <div className={menuOpen ? 'animated-icon1 open' : 'animated-icon1 '}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <Collapse isOpen={menuOpen} navbar>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link">
                <StatusNotification />
              </Link>
            </li>
            <li className="nav-item active">
              <Link
                className="nav-link"
                onClick={() => history.push('/dashboard')}
              >
                Stories
              </Link>
            </li>
            <li className="nav-item active">
              <Link
                className="nav-link"
                href="#"
                onClick={() => history.push('/research')}
              >
                Research Queue
              </Link>
            </li>
            <li className="nav-item active">
              <Link
                className="nav-link"
                onClick={() => history.push('/messagequeue')}
              >
                Message Queue
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                onClick={() => history.push('/cadence')}
              >
                Cadence
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#">
                Dialers
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </Collapse>
      </nav>
    </header>
  );
};

export default withRouter(Header);
