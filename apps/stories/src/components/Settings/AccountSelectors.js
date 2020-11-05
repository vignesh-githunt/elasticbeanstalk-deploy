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
import { useQuery, useMutation } from "@apollo/react-hooks";
import UserContext from "../UserContext";
import ACCOUNTSELECTORS_QUERY from "../queries/AccountSelectorsQuery";
import DELETE_ACCOUNT_SELECTOR_MUTATION from "../mutations/DeleteAccountSelector";

import PageLoader from "../Common/PageLoader";

import { truncate } from "../Common/Utils";
import AccountSelectorEditor from "./AccountSelectorEditor";

import Swal from "../Elements/Swal";
import moment from "moment";

const AccountSelector = ({ history, match, accountSelector, user }) => {
  let progress = 0;
  let progressColor = "warning";
  let active = accountSelector._storiesMeta.count > 0;

  const [requiredDataToShow, setRequiredDataToShow] = useState(2);
  const [optionalDataToShow, setOptionalDataToShow] = useState(2);

  const [deleteAccountSelector] = useMutation(DELETE_ACCOUNT_SELECTOR_MUTATION);

  progress =
    (Math.floor((accountSelector.totalCreatedAccountsCount / accountSelector
      .totalMatchingAccountsCount) * 100 * 100) / 100) || 0.00;
  

  progressColor = progress < 20 ? "danger" : progress > 70 ? "success" : "warning";
  const onManage = () => {
    history.push("/settings/icp/" + accountSelector.id);
  };

  const deleteOption = {
    title: "Are you sure?",
    text: "Your will not be able to recover this Icp definition!",
    icon: "warning",
    buttons: {
      cancel: {
        text: "No, cancel!",
        value: null,
        visible: true,
        className: "",
        closeModal: false
      },
      confirm: {
        text: "Yes, delete it!",
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false
      }
    }
  };

  const handleDelete = (isConfirm, swal) => {
    if (isConfirm) {
      if(accountSelector._storiesMeta.count > 0) {
        swal(
          "Cancelled",
          "The " +
            accountSelector.name +
            " ICP definition is could not be deleted. It's being used by " +
            accountSelector._storiesMeta.count +
            " stories!",
          "error"
        );
        return false;
      } else {
        deleteAccountSelector({
          variables: {
            id: accountSelector.id
          },
          refetchQueries: ["v3_Customer_AccountSelectors"]
        });
        swal(
          accountSelector.name + " Deleted!",
          "Your ICP definition has been deleted.",
          "success"
        );
      }

    } else {
      swal("Cancelled", "Your ICP definition is safe!", "error");
    }
  };

  return (
    <Card className="card-default b" key={accountSelector.id}>
      <CardHeader>
        <div className="float-right">
          <Swal
            options={deleteOption}
            callback={handleDelete}
            className="btn btn-secondary float-right"
          >
            <em className="fa fa-times"></em>
          </Swal>
        </div>

        <h4 className="m-0">{accountSelector.name}</h4>
        <small>
          {active ? (
            <div className="badge badge-info">Active</div>
          ) : (
            <div className="badge badge-danger">Inactive</div>
          )}{" "}
        </small>
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
      <Table>
        <tbody>
          <tr>
            <td>
              <strong># of Accounts</strong>
            </td>
            <td>
              {accountSelector.totalCreatedAccountsCount || 0} Targeted Accounts{" "}
              <br />
              {accountSelector.totalMatchingAccountsCount || 0} Total Matching
              Accounts
            </td>
          </tr>
          <tr>
            <td>
              <strong>Last Checked</strong>
            </td>
            <td>
              {accountSelector
                .lastChecked ? moment(accountSelector.lastChecked)
                .fromNow() : "Never"}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Required</strong>
            </td>
            <td>
              {accountSelector.requiredDataPoints
                .slice(0, requiredDataToShow)
                .map(dp => {
                  return (
                    <React.Fragment key={dp.id}>
                      <strong>{dp.dataPointType}:</strong>{" "}
                      {truncate(dp.value, 30)}
                      <br />
                    </React.Fragment>
                  );
                })}
              {accountSelector.requiredDataPoints.length >
                requiredDataToShow && (
                <a
                  onClick={e => {
                    e.preventDefault();
                    setRequiredDataToShow(
                      accountSelector.requiredDataPoints.length
                    );
                  }}
                  href="#/"
                >
                  <strong>
                    +
                    {accountSelector.requiredDataPoints.length -
                      requiredDataToShow}
                  </strong>
                </a>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Optional</strong>
            </td>
            <td>
              {accountSelector.optionalDataPoints
                .slice(0, optionalDataToShow)
                .map(dp => {
                  return (
                    <React.Fragment key={dp.id}>
                      <strong>{dp.dataPointType}:</strong>{" "}
                      {truncate(dp.value, 30)}
                      <br />
                    </React.Fragment>
                  );
                })}
              {accountSelector.optionalDataPoints.length >
                optionalDataToShow && (
                <a
                  onClick={e => {
                    e.preventDefault();
                    setOptionalDataToShow(
                      accountSelector.optionalDataPoints.length
                    );
                  }}
                  href="#/"
                >
                  <strong>
                    +
                    {accountSelector.optionalDataPoints.length -
                      optionalDataToShow}
                  </strong>
                </a>
              )}
            </td>
          </tr>
          {/* <tr>
              <td>
                <strong>Default accountSelector User</strong>
              </td>
              <td>
                <a href="" title="Default accountSelector User">
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
      <CardFooter className="text-center">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => onManage()}
        >
          View Details
        </button>
        <AccountSelectorEditor
          customerId={accountSelector.customerId}
          accountSelector={accountSelector}
        />
      </CardFooter>
    </Card>
  );
};
const AccountSelectors = ({ history, match, customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const { data, loading } = useQuery(ACCOUNTSELECTORS_QUERY, {
    variables: { customerId: customerId || user.companyId },
    skip: userLoading,
  });

  if (userLoading || loading)
    return (
      <Row>
        <Col xl={12}>
          <PageLoader />
        </Col>
      </Row>
    );
  if (!customerId) customerId = user.companyId;
  let accountSelectors = data.v3_Customer_AccountSelectors || []

  const defaultSelector = {
    name: "",
    requiredDataPoints: []
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col cl={12}>
          <AccountSelectorEditor customerId={customerId} accountSelector={defaultSelector} className="pull-right" />
        </Col>
      </Row>
      <Row>
        {accountSelectors.map(accountSelector => {
          return (
            <Col xl="4" lg="6" key={accountSelector.id}>
              <AccountSelector
                accountSelector={accountSelector}
                user={user}
                match={match}
                history={history}
              />
            </Col>
          );
        })}
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  customerId: state.customer.id,
  customerName: state.customer.name
});
const connectedAccountSelectors = connect(mapStateToProps)(AccountSelectors);

export default withTranslation("translations")(connectedAccountSelectors);
