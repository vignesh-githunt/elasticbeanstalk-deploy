import React, { useState, useContext, useEffect } from "react";
import { withTranslation } from "react-i18next";
import ContentWrapper from "../Layout/ContentWrapper";
import Integrations from "../Settings/Integrations"
import AccountSelectors from "../Settings/AccountSelectors"
import ContactSelectors from "../Settings/ContactSelectors"
import Aal from "../Settings/AccountAssignmentLogic"
import IntegrationDetails from "../Settings/IntegrationDetails"
import {
  FormGroup,
  Nav,
  NavItem,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "reactstrap";
import { CUSTOMER_QUERY } from "../queries/CustomersQuery";
import { Link } from "react-router-dom";
import ProtectedRoute from '../ProtectedRoute';
import { connect } from "react-redux";
import RulesOfEngagements from "../Settings/RulesOfEngagements";
import UserContext from '../UserContext'
import { useQuery, useMutation } from "@apollo/react-hooks";
import PageLoader from "../Common/PageLoader";
import UPDATE_CUSTOMER from '../mutations/UpdateCustomer';

const Overview = ({ history, match, customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);
  const { data, loading: customerLoading } = useQuery(CUSTOMER_QUERY, {
    variables: { id: customerId || user.companyId },
    skip: userLoading,
  });
  const [updateCustomer, { loading: saveLoading }] = useMutation(
    UPDATE_CUSTOMER
  );

  const [sendingLimit, setSendingLimit] = useState(50)
  useEffect(() => {
    if(data && data.company) {
      setSendingLimit(data.company.senderDailySendingLimit)
    }
  },[data])
  if (userLoading || customerLoading)
    return (
      <Row>
        <Col xl={12}>
          <PageLoader />
        </Col>
      </Row>
    );

  const handleSave = (value) => {
    
    updateCustomer({
      variables: {
        id: data.company.id,
        senderDailySendingLimit: parseInt(sendingLimit)
      },
      refetchQueries: [{query: CUSTOMER_QUERY,
        variables: { id: data.company.id }
      }]
    });
  }

  return (
    <Row>
      <Col md={12}>
        <Card className="card-default">
          <CardHeader>Organization Settings</CardHeader>
          <CardBody>
            <FormGroup className="col-xl-3">
              <label>Global Daily Sending Limit (per sender)</label>
              <select
                className="custom-select custom-select-sm"
                name="sendingLimit"
                value={sendingLimit}
                onChange={(e) => setSendingLimit(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="40">40</option>
                <option value="50">50 (Recommended)</option>
                <option value="55">55</option>
                <option value="60">60</option>
                <option value="0">0 (Disable Sending)</option>
              </select>
              {sendingLimit === 0 && (
                <small>Sending is currently disabled</small>
              )}
            </FormGroup>
          </CardBody>
          <CardFooter>
            <div className="float-right">
              <button className="btn btn-secondary" onClick={handleSave}>
                {saveLoading && <i className="fa fa-spinner fa-spin mr-2"></i>}
                Save
              </button>
            </div>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};

const components = {
  overview: Overview,
  integrations: Integrations,
  icp: AccountSelectors,
  personas: ContactSelectors,
  roe: RulesOfEngagements,
  aal: Aal
};

const sections = [
  { key: "overview", name: "Main" },
  { key: "integrations", name: "Integrations" },
  { key: "icp", name: "Ideal Customer Profiles" },
  { key: "personas", name: "Personas" },
  { key: "roe", name: "Rules of Engagement" },
  { key: "aal", name: "Account Assignment Logic" }
];

const Capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Settings = ({history, match, customerId}) => {
  // const { user, loading: userLoading } = useContext(UserContext);
  const [selectedSection] = useState(
    match.params["section"] || "overview"
  );


  const SectionComponent = components[selectedSection]
  return (
    <ContentWrapper>
      <div className="content-heading submenu">
        <Col xl={2} style={{ paddingLeft: "0px" }}>
          <div>
            Settings
            <small>{Capitalize(selectedSection)}</small>
          </div>
        </Col>
        <Col xl={10}>
          <nav className="navbar navbar-expand-lg subnavbar">
            <Nav navbar className="mr-auto flex-column flex-lg-row nav-tabs">
              {sections.map(section => {
                return (
                  <NavItem
                    key={section.key}
                    active={selectedSection === section.key ? true : false}
                  >
                    <Link className="nav-link" to={"/settings/" + section.key}>
                      {section.name}
                    </Link>
                  </NavItem>
                );
              })}
            </Nav>
          </nav>
        </Col>
      </div>
      <Row>
        <Col xl={12}>
          <ProtectedRoute path="/settings/:section/" component={SectionComponent} />
        </Col>
      </Row>
      <Row>
        <Col xl={12}>
          <ProtectedRoute
            path="/settings/integrations/:id"
            component={IntegrationDetails}
          />
        </Col>
      </Row>
    </ContentWrapper>
  );
};

const mapStateToProps = state => ({ customerId: state.customer.id });

export default withTranslation("translations")(
  connect(mapStateToProps)(Settings)
);
