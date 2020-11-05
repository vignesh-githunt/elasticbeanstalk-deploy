import React, { useContext } from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import * as actions from "../../store/actions/actions";
import PropTypes from "prop-types";
import ContentWrapper from "../Layout/ContentWrapper";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";
import UserContext from "../UserContext";

const Onboarding = ({ actions, history }) => {
  var { user } = useContext(UserContext);
  const connectActivatedIntegration = (provider) => {
    if (process.env.NODE_ENV !== "production") {
      window.location =
        "http://localhost:5200/users/auth/" + provider + "?origin=" + user.id;
    } else {
      window.location = "/users/auth/" + provider + "?origin=" + user.id;
    }
  };

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>Onboarding</div>
      </div>
      <Row className="mb-3 ml-1 mr-1">
        <Col xl={12}>
          <Card className="card-default">
            <CardHeader>
              <CardTitle>XDR - Your Sales Development Helper</CardTitle>
            </CardHeader>
            <CardBody className="row">
              <Col xl={4} className="mb-2">
                A required step to make Stories function is that you install the
                XDR Chrome Extension. This will help you get your job done much
                quicker and will help with your every day activities related to
                everything outbound sales!
              </Col>
              <Col>
                <a
                  className="btn btn-primary"
                  href="https://chrome.google.com/webstore/detail/xdr-the-sales-development/omkfaingifmnipkahnfblnebpbpfkfak"
                  target="_new"
                >
                  Download the XDR chrome extension
                </a>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {user.sfdcIdentity == null && (
        <Row className="mb-3 ml-1 mr-1">
          <Col xl={12}>
            <Card className="card-default">
              <CardHeader>
                <CardTitle>Connect Salesforce</CardTitle>
              </CardHeader>
              <CardBody className="row">
                <Col xl={4} className="mb-2">
                  Another required step to make Stories function is that you
                  connect the platform to Salesforce. This allows the system to
                  log activity on your behalf, and help you close more deals!
                </Col>
                <Col>
                  <button
                    className="btn btn-primary"
                    onClick={() => connectActivatedIntegration("salesforce")}
                  >
                    Connect Salesforce
                  </button>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
      {user.connectleaderIdentity == null && (
        <Row className="mb-3 ml-1 mr-1">
          <Col xl={12}>
            <Card className="card-default">
              <CardHeader>
                <CardTitle>Connect Cadence</CardTitle>
              </CardHeader>
              <CardBody className="row">
                <Col xl={4} className="mb-2">
                  Another required step to make Stories function is that you
                  connect the platform to your sequencer; TruCadence. This allows the system to
                  send emails on your behalf.
                </Col>
                <Col>
                  <button
                    className="btn btn-primary"
                    onClick={() => connectActivatedIntegration("connectleader")}
                  >
                    Connect Cadence
                  </button>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </ContentWrapper>
  );
};

Onboarding.propTypes = {
    actions: PropTypes.object,
    settings: PropTypes.object
  };
  
  const mapStateToProps = state => ({ settings: state.settings });
  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  });
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(Onboarding));