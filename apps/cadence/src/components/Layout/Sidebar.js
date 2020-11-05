import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import { Collapse, Badge } from "reactstrap";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/actions";

import SidebarRun from "./Sidebar.run";
import SidebarUserBlock from "./SidebarUserBlock";

import Menu from "./Menu.js";

/** Component to display headings on sidebar */
const SidebarItemHeader = ({ item }) => (
  <li className="nav-heading">
    <span>
      <Trans i18nKey={item.translate}>{item.heading}</Trans>
      {item.heading}
    </span>
  </li>
);

/** Normal items for the sidebar */
const SidebarItem = ({ item, isActive }) => (
  <li className={isActive ? "active" : ""}>
    <Link to={item.path} title={item.name}>
      {item.label && (
        <Badge tag="div" className="float-right" color={item.label.color}>
          {item.label.value}
        </Badge>
      )}
      {item.icon && <em className={item.icon}></em>}
      <span>
        {/* <Trans i18nKey={item.translate}>{item.name}</Trans> */}
        {item.name}
      </span>
    </Link>
  </li>
);

/** Build a sub menu with items inside and attach collapse behavior */
const SidebarSubItem = ({ item, isActive, handler, children, isOpen }) => (
  <li className={isActive ? "active" : ""}>
    <div className="nav-item" onClick={handler}>
      {item.label && (
        <Badge tag="div" className="float-right" color={item.label.color}>
          {item.label.value}
        </Badge>
      )}
      {item.icon && <em className={item.icon}></em>}
      <span>
        {/* <Trans i18nKey={item.translate}>{item.name}</Trans> */}
        {item.name}
      </span>
    </div>
    <Collapse isOpen={isOpen}>
      <ul id={item.path} className="sidebar-nav sidebar-subnav">
        {children}
      </ul>
    </Collapse>
  </li>
);

/** Component used to display a header on menu when using collapsed/hover mode */
const SidebarSubHeader = ({ item }) => (
  <li className="sidebar-subnav-header">{item.name}</li>
);

const Sidebar = (props) => {
  const [collapse, setCollapse] = useState({});

  useEffect(() => {
    // pass navigator to access router api
    console.log("Running SidebarRun");
    SidebarRun(navigator, closeSidebar);
    // prepare the flags to handle menu collapsed states
    buildCollapseList();

    // Listen for routes changes in order to hide the sidebar on mobile
    props.history.listen(closeSidebar);
  },[]);

  const closeSidebar = () => {
    props.actions.toggleSetting("asideToggled");
    window.resizeBy(window.screenX, window.screenY);
  };

  const buildCollapseList = () => {
    let collapse = {};
    Menu.filter(({ heading }) => !heading).forEach(
      ({ name, path, submenu }) => {
        collapse[name] = routeActive(
          submenu ? submenu.map(({ path }) => path) : path
        );
      }
    );
    setCollapse({ collapse });
  };

  const navigator = (route) => {
    props.history.push(route);
  };

  const routeActive = (paths) => {
    paths = Array.isArray(paths) ? paths : [paths];
    return paths.some((p) => props.location.pathname.indexOf(p) > -1);
  };

  const toggleItemCollapse = (stateName) => {
    for (let c in collapse) {
      if (collapse[c] === true && c !== stateName)
        setCollapse({
          collapse: {
            [c]: false,
          },
        });
    }
  };

  const getSubRoutes = (item) => item.submenu.map(({ path }) => path);

  const itemType = (item) => {
    if (item.heading) return "heading";
    if (!item.submenu) return "menu";
    if (item.submenu) return "submenu";
  };

  return (
    <aside className="aside-container">
      {/* START Sidebar (left) */}
      <div className="aside-inner">
        <nav data-sidebar-anyclick-close="" className="sidebar">
          {/* START sidebar nav */}
          <ul className="sidebar-nav">
            {/* START user info */}
            <li className="has-user-block">
              <SidebarUserBlock />
            </li>
            {/* END user info */}

            {/* Iterates over all sidebar items */}
            {Menu.map((item, i) => {
              // heading
              if (itemType(item) === "heading")
                return <SidebarItemHeader item={item} key={i} />;
              else {
                if (itemType(item) === "menu")
                  return (
                    <SidebarItem
                      isActive={routeActive(item.path)}
                      item={item}
                      key={i}
                    />
                  );
                if (itemType(item) === "submenu")
                  return [
                    <SidebarSubItem
                      item={item}
                      isOpen={collapse[item.name]}
                      handler={toggleItemCollapse(item.name)}
                      isActive={routeActive(getSubRoutes(item))}
                      key={i}
                    >
                      <SidebarSubHeader item={item} key={i} />
                      {item.submenu.map((subitem, i) => (
                        <SidebarItem
                          key={i}
                          item={subitem}
                          isActive={routeActive(subitem.path)}
                        />
                      ))}
                    </SidebarSubItem>,
                  ];
              }
              return null; // unrecognized item
            })}
          </ul>
          {/* END sidebar nav */}
        </nav>
      </div>
      {/* END Sidebar (left) */}
    </aside>
  );
};
Sidebar.propTypes = {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("translations")(withRouter(Sidebar)));