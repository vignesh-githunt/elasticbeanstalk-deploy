import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import ContentWrapper from "../Layout/ContentWrapper";
import {
  Nav,
  NavItem,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import { Link } from "react-router-dom";

import { connect } from "react-redux";


const SubMenu = () => {
  const [selectedSection] = useState("Elements");

  return (
    <div className="content-heading submenu">
      <Col xl={2} style={{ paddingLeft: "0px" }}>
        <div>
          Stories
          <small>{selectedSection}</small>
        </div>
      </Col>
      <Col xl={10}>
        <nav className="navbar navbar-expand-lg subnavbar">
          <Nav navbar className="mr-auto flex-column flex-lg-row nav-tabs">
            <NavItem>
              <Link className="nav-link" to="/stories">
                Explore
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/stories/messagequeue">
                Message Queue
              </Link>
            </NavItem>
            <NavItem active>
              <Link className="nav-link" to="/stories/elements">
                Elements
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/stories/messagebuilder">
                Message Builder
              </Link>
            </NavItem>
          </Nav>
        </nav>
      </Col>
    </div>
  );
};

const Elements = () => {
  return (
    <ContentWrapper>
      <SubMenu />
      <Row>
        <Col xl={12}>
          <Card className="card-default">
            <CardHeader>
              <h4>Elements</h4>
            </CardHeader>
            <CardBody></CardBody>
            
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );
};


const mapStateToProps = state => ({ customerId: state.customer.id });

export default withTranslation("translations")(
  connect(mapStateToProps)(Elements)
);
