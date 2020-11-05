import React, {useEffect,useContext} from 'react';

export const HeaderHorizontal=({actions,history})=> {
  return (
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
          </Nav>
          <Nav className="flex-row" navbar>
            {/* Search icon */}
            <NavItem>
                <NavLink href="" data-search-open="">
                  <em className="icon-magnifier"></em>
                </NavLink>
              </NavItem>
            {/* Fullscreen (only desktops) */}
            
            <NavItem className="d-none d-md-block">
              <ToggleFullscreen className="nav-link" />
            </NavItem>
            </Nav>
        </nav>)
}

export default HeaderHorizontal