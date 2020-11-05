import React, { useState, useContext } from "react";
import { withTranslation } from "react-i18next";
import ContentWrapper from "../Layout/ContentWrapper";
import {
  Nav,
  NavItem,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonToolbar
} from "reactstrap";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import useSendersList from "../hooks/useSenderList";
import ContactsDataTable from "../ContactsDataTable";
import { connect } from "react-redux";

const SubMenu = ({SendersDropdown}) => {
  const [selectedSection] = useState("Personalization");

  return (
    <div className="content-heading submenu">
      <div>
        Stories
        <small>{selectedSection}</small>
      </div>
      <div className="subnavbar ml-4">
        <Nav navbar className="mx-auto flex-lg-row nav-tabs">
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
            <Link className="nav-link" to="/stories/personalization">
              Personalization
            </Link>
          </NavItem>
          {/* <NavItem>
              <Link className="nav-link" to="/stories/messagebuilder">
                Message Builder
              </Link>
            </NavItem> */}
        </Nav>
      </div>
      <div className="ml-auto">
        <ButtonToolbar>
          <SendersDropdown />
        </ButtonToolbar>
      </div>
    </div>
  );
};

const Personalization = ({ customerId }) => {
  const { user, loading: userLoading} = useContext(UserContext);

  const { SendersDropdown, senderId } = useSendersList(
    customerId,
    user,
    userLoading
  );
  
  // const { ContactsDataTable } = useContactsDataTable(
  //   customerId,
  //   user,
  //   userLoading,
  //   "titles",
  //   senderId
  // );


  return (
    <ContentWrapper>
      <SubMenu SendersDropdown={SendersDropdown} />
      <Row>
        <Col xl={12}>
          <Card className="card-default">
            <CardHeader>
              <h4>Personalization</h4>
            </CardHeader>
            <CardBody>
              <ContactsDataTable
                customerId={customerId}
                currentUser={user}
                userLoading={userLoading}
                senderId={senderId}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );
};


const mapStateToProps = state => ({ customerId: state.customer.id });

export default withTranslation("translations")(
  connect(mapStateToProps)(Personalization)
);
