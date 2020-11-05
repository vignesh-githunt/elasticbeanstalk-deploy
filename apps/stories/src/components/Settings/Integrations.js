import React, {
  useState,
  useContext,
} from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  Progress,
  Row,
  Table,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter
} from "reactstrap";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import UserContext from "../UserContext";
import INTEGRATIONS_QUERY from "../queries/IntegrationsQuery";
import ACTIVATE_INTEGRATION_MUTATION from "../mutations/ActivateIntegration"
import PageLoader from "../Common/PageLoader";
import Avatar from "../../images/default-avatar.jpg";
import ConnectLeaderLogo from "../../images/connectleader_square.png"
import SalesforceLogo from "../../images/salesforce_square.png"
import moment from 'moment'

const Integration = ({ history, match, integration, user }) => {
  
  let progress = 0
  let progressColor = "warning"
  let active = integration.createdAt && true
  if(integration.createdAt && integration.plugin.authenticated) {
    progress = 100
    progressColor = "success"
  } else if (integration.createdAt && !integration.plugin.authenticated) {
    progress = 50;
    progressColor = "warning"
  }

  const [activateIntegration] = useMutation(ACTIVATE_INTEGRATION_MUTATION);
  const [isOpen, setIsOpen] = useState(false)

  const onActivate = (provider) => {
    activateIntegration({
      variables: {
        customerId: integration.customerId,
        provider,
        senderId: integration.defaultSender.id
      },
      refetchQueries: ["v3_Customer_Integrations"]
    });
  };

  const onManage = () => {
    setIsOpen(true)
    history.push("/settings/integrations/"+integration.id)
  }

  const onAuthenticate = (provider) => {
    if(user.companyId !== integration.customerId) {
      alert("Admins can't authenticate integrations on behalf of customers")
    } else {
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
  }

  return (
    <Card className="b" key={integration.id}>
      <CardHeader>
        <div className="float-right">
          {integration.createdAt ? (
            <div className="badge badge-info">Active</div>
          ) : (
            <div className="badge badge-danger">Inactive</div>
          )}
        </div>

        <h4 className="m-0">
          <img
            alt={integration.name} src={integration.provider === "connectleader" ? ConnectLeaderLogo : SalesforceLogo}
            className="rounded-circle thumb24 mr-1"
          />
          {integration.name}
        </h4>
        <small className="text-muted">{integration.category}</small>
      </CardHeader>
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="w-100" data-title="Health">
            <Progress
              className="progress-xs m-0"
              value={progress}
              color={progressColor}
            />
          </div>
          <div className="wd-xxs text-right">
            <div className="text-bold text-muted">{progress}%</div>
          </div>
        </div>
      </CardBody>
      {active && integration.plugin.authenticated && (
        <Table>
          <tbody>
            <tr>
              <td>
                <strong>Last Updated</strong>
              </td>
              <td>{moment(integration.updatedAt).fromNow()}</td>
            </tr>
            <tr>
              <td>
                <strong>Authenticated Users</strong>
              </td>
              <td>
                {integration.protectedIdentities.slice(0, 5).map(identity => {
                  return (
                    <a
                      className="inline"
                      title={identity.nickname}
                      href="#/"
                      key={identity.nickname}
                    >
                      <img
                        src={Avatar}
                        className="rounded-circle thumb24 mr-1"
                        alt={identity.nickname}
                      />
                    </a>
                  );
                })}

                {integration.protectedIdentities.size > 5 && (
                  <a className="inline" href="#/">
                    <strong>+{integration.protectedIdentities.size - 5}</strong>
                  </a>
                )}
              </td>
            </tr>
            {/* <tr>
              <td>
                <strong>Default Integration User</strong>
              </td>
              <td>
                <a href="" title="Default Integration User">
                  <img
                    className="rounded-circle thumb24 mr-1"
                    src={Avatar}
                    alt="project member"
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Metrics</strong>
              </td>
              <td>
                <Sparkline
                  values="20,80"
                  options={{
                    type: "pie",
                    height: "24",
                    sliceColors: ["#edf1f2", "#23b7e5"]
                  }}
                  className="sparkline inline mr-2"
                />
                <Sparkline
                  values="60,40"
                  options={{
                    type: "pie",
                    height: "24",
                    sliceColors: ["#edf1f2", "#27c24c"]
                  }}
                  className="sparkline inline mr-2"
                />
                <Sparkline
                  values="90,10"
                  options={{
                    type: "pie",
                    height: "24",
                    sliceColors: ["#edf1f2", "#ff902b"]
                  }}
                  className="sparkline inline"
                />
              </td>
            </tr> */}
          </tbody>
        </Table>
      )}
      <CardFooter className="text-center">
        {active ? (
          integration.plugin.authenticated ? (
            isOpen ? (
              <Link
                className="btn btn-danger"
                type="button"
                to={"/settings/integrations/"}
              >
                Close
              </Link>
            ) : (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onManage()}
              >
                Manage integration
              </button>
            )
          ) : (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => onAuthenticate(integration.provider)}
            >
              Authenticate
            </button>
          )
        ) : (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => onActivate(integration.provider)}
          >
            Activate
          </button>
        )}
      </CardFooter>
    </Card>
  );
}

const Integrations = ({ history, match, customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const { data, loading } = useQuery(INTEGRATIONS_QUERY, {
    variables: {  customerId: customerId || user.companyId },
    skip: userLoading
  })

  if (userLoading || loading)
    return (
      <Row>
        <Col xl={12}>
          <PageLoader />
        </Col>
      </Row>
    );

  const clIntegration = {
    id: "cl_id",
    customerId: customerId || user.companyId,
    name: "ConnectLeader",
    provider: "connectleader",
    category: "Sequencer",
    createdAt: null,
    updatedAt: null,
    defaultSender: {},
    plugin: {},
  };

  const sfdcIntegration = {
    id: "sfdc_id",
    customerId: customerId || user.companyId,
    name: "Salesforce",
    provider: "salesforce",
    category: "CRM",
    createdAt: null,
    updatedAt: null,
    defaultSender: {},
    plugin: {},
  };

  let integrationsList = [clIntegration, sfdcIntegration];

  if(data && data.v3_Customer_Integrations) {
    let sfdcIntegrations = data.v3_Customer_Integrations.filter(integration => { return integration.provider === "salesforce"})
    let clIntegrations = data.v3_Customer_Integrations.filter(integration => { return integration.provider === "connectleader"})
    sfdcIntegrations = sfdcIntegrations.length > 0 ? sfdcIntegrations : [sfdcIntegration]
    clIntegrations = clIntegrations.length > 0 ? clIntegrations : [clIntegration]
    integrationsList = [...clIntegrations, ...sfdcIntegrations];


  }

  
  return (
    <Row>
      {integrationsList.map(integration => {
          return (
            <Col xl="4" lg="6" key={integration.id}>
              <Integration
                integration={integration}
                user={user}
                match={match}
                history={history}
              />
            </Col>
          );
        })}
    </Row>
  );

}

const mapStateToProps = state => ({
  customerId: state.customer.id,
  customerName: state.customer.name
});
const connectedIntegrations = connect(mapStateToProps)(Integrations);

export default withTranslation("translations")(connectedIntegrations);
