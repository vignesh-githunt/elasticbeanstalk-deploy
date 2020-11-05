import React, {
  useState,
  useContext
} from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import { useQuery } from "@apollo/react-hooks";
import UserContext  from "../UserContext";
import INTEGRATION_QUERY  from "../queries/IntegrationQuery";


import PageLoader from "../Common/PageLoader";

import CardTool from "../Common/CardTool";
import {ConnectleaderSettings, ConnectleaderCadences, ConnectleaderFieldMapping, ConnectleaderConnectedUsers} from "./ConnectleaderIntegration"
import {SalesforceSettings, SalesforceFieldMapping, SalesforceConnectedUsers, SalesforceDncManagement} from "./SalesforceIntegration"


const components = {
  ConnectleaderSettings: ConnectleaderSettings,
  ConnectleaderCadences: ConnectleaderCadences,
  ConnectleaderFieldMapping: ConnectleaderFieldMapping,
  ConnectleaderConnectedUsers: ConnectleaderConnectedUsers,
  SalesforceSettings: SalesforceSettings,
  SalesforceFieldMapping: SalesforceFieldMapping,
  SalesforceConnectedUsers: SalesforceConnectedUsers,
  SalesforceDncManagement: SalesforceDncManagement,
};

const IntegrationDetails = ({ history, match, customerId }) => {
  
  const [integrationId] = useState(
    match.params["id"] || null
  );
  const [activeTab, setActiveTab] = useState("0");

  const { user, loading: userLoading } = useContext(UserContext);

  if (!customerId) customerId = user.companyId;

  const { data, loading } = useQuery(INTEGRATION_QUERY, {
    variables: { id: integrationId },
    skip: userLoading
  });

  if (userLoading || loading) return <PageLoader />;

  let integration = data.v3_Customer_Integration

  const onCardRemove = (card, confirm) => {
    // Call confirm() to continue removing the card
    // perform checks to avoid removing card if some user action is required
    setTimeout(confirm, 50);
  };
  const onCardRemoved = () => {
    history.push("/settings/integrations")
  };

  return (
    <Row>
      <Col lg={12}>
        <Card className="card-default">
          <CardHeader>
            {integration.name}
            <CardTool
              dismiss
              onRemove={onCardRemove}
              onRemoved={onCardRemoved}
            />
          </CardHeader>
          <CardBody>
            <div role="tabpanel">
              {/* Nav tabs */}
              <Nav tabs>
                {integration.sections.map((key, index) => (
                  <NavItem key={key.name}>
                    <NavLink
                      className={activeTab === String(index) ? "active" : ""}
                      onClick={() => {
                        setActiveTab(String(index));
                      }}
                    >
                      {key.name}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              {/* Tab panes */}
              <TabContent activeTab={activeTab}>
                {integration.sections.map((key, index) => {
                  const SectionComponent = components[key.component];
                  return (
                    <TabPane tabId={String(index)} key={key.name}>
                      <SectionComponent integration={integration} history={history} user={user} />
                    </TabPane>
                  );
                })}
              </TabContent>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );

}

const mapStateToProps = state => ({
  customerId: state.customer.id,
  customerName: state.customer.name
});
const connectedIntegrationDetails = connect(mapStateToProps)(IntegrationDetails);

export default withTranslation("translations")(connectedIntegrationDetails);
