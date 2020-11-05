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
import CONTACTSELECTORS_QUERY from "../queries/ContactSelectorsQuery";
import DELETE_CONTACT_SELECTOR_MUTATION from "../mutations/DeleteContactSelector";
import PageLoader from "../Common/PageLoader";
import { truncate } from "../Common/Utils"
import moment from "moment";
import ContactSelectorEditor from "./ContactSelectorEditor";

import Swal from "../Elements/Swal";

const ContactSelector = ({ history, match, contactSelector, user }) => {
  let progress = 0;
  let progressColor = "warning";
  let active = contactSelector._storiesMeta.count > 0;

  const [requiredDataToShow, setRequiredDataToShow] = useState(2)

  const [deleteContactSelector] = useMutation(DELETE_CONTACT_SELECTOR_MUTATION);
  
  progress =
    Math.floor(
      (contactSelector.totalCreatedContactsCount /
        contactSelector.totalMatchingContactsCount) *
        100 *
        100
    ) / 100 || 0.0;

  progressColor =
    progress < 20 ? "danger" : progress > 70 ? "success" : "warning";
  const onManage = () => {
    history.push("/settings/personas/" + contactSelector.id);
  };

  const deleteOption = {
    title: "Are you sure?",
    text: "Your will not be able to recover this Persona definition!",
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
      if (contactSelector._storiesMeta.count > 0) {
        swal(
          "Cancelled",
          "The " +
            contactSelector.name +
            " Persona definition is could not be deleted. It's being used by " +
            contactSelector._storiesMeta.count +
            " stories!",
          "error"
        );
        return false;
      } else {
        deleteContactSelector({
          variables: {
            id: contactSelector.id
          },
          refetchQueries: ["v3_Customer_ContactSelectors"]
        });
        swal(
          contactSelector.name + " Deleted!",
          "Your Persona definition has been deleted.",
          "success"
        );
      }
    } else {
      swal("Cancelled", "Your Persona definition is safe!", "error");
    }
  };

  return (
    <Card className="b" key={contactSelector.id}>
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

        <h4 className="m-0">{contactSelector.name}</h4>
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
              <strong># of Contacts</strong>
            </td>
            <td>
              {contactSelector.totalCreatedContactsCount} Selected Contacts{" "}
              <br />
              {contactSelector.totalMatchingContactsCount} Total Matching
              Contacts
            </td>
          </tr>
          <tr>
            <td>
              <strong>Last Checked</strong>
            </td>
            <td>{moment(contactSelector.lastChecked).fromNow()}</td>
          </tr>
          <tr className="w-100">
            <td>
              <strong>Required</strong>
            </td>
            <td>
              <div className="text-truncate">
                {contactSelector.requiredDataPoints
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
              </div>
              {contactSelector.requiredDataPoints.length >
                requiredDataToShow && (
                <a
                  onClick={e => {
                    e.preventDefault();
                    setRequiredDataToShow(
                      contactSelector.requiredDataPoints.length
                    );
                  }}
                  href="#/"
                >
                  <strong>
                    +
                    {contactSelector.requiredDataPoints.length -
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
              {contactSelector.optionalDataPoints.slice(0, 2).map(dp => {
                return (
                  <React.Fragment key={dp.id}>
                    <strong>{dp.dataPointType}:</strong>{" "}
                    {truncate(dp.value, 30)}
                    <br />
                  </React.Fragment>
                );
              })}
              {contactSelector.optionalDataPoints.length > 2 && (
                <a onClick={() => onManage()} href="#/">
                  <strong>
                    +{contactSelector.optionalDataPoints.length - 2}
                  </strong>
                </a>
              )}
            </td>
          </tr>
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
        <ContactSelectorEditor
          customerId={contactSelector.customerId}
          contactSelector={contactSelector}
        />
      </CardFooter>
    </Card>
  );
};
const ContactSelectors = ({ history, match, customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const { data, loading } = useQuery(CONTACTSELECTORS_QUERY, {
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
  
  let contactSelectors = data.v3_Customer_ContactSelectors || [];

  const defaultSelector = {
    name: "",
    requiredDataPoints: []
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col cl={12}>
          <ContactSelectorEditor customerId={customerId} contactSelector={defaultSelector} className="pull-right" />
        </Col>
      </Row>
    <Row>
      {contactSelectors.map(contactSelector => {
        return (
          <Col xl="4" lg="6" key={contactSelector.id}>
            <ContactSelector
              contactSelector={contactSelector}
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
const connectedContactSelectors = connect(mapStateToProps)(ContactSelectors);

export default withTranslation("translations")(connectedContactSelectors);
