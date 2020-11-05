import React, {
  useContext,
  } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardHeader,
} from "reactstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import UserContext from "../UserContext";
import ROE_QUERY from "../queries/RoeQuery";
import DELETE_ROE_MUTATION from "../mutations/DeleteRoe";
import PageLoader from "../Common/PageLoader";
import RoeEditor from "./RoeEditor";

import Swal from "../Elements/Swal";

const RulesOfEngagement = ({ history, match, roe, user }) => {

  let active = roe._storiesMeta.count > 0;

  const [deleteRoe] = useMutation(DELETE_ROE_MUTATION);

  const deleteOption = {
    title: "Are you sure?",
    text: "Your will not be able to recover this Rules of engagement definition!",
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

  let stories = roe._storiesMeta.count > 1 ? " Stories" : " Story"

  const handleDelete = (isConfirm, swal) => {
    if (isConfirm) {
      if (roe._storiesMeta.count > 0) {
        swal(
          "Cancelled",
          "The " +
            roe.name +
            " Rules of engagement definition is could not be deleted. It's being used by " +
            roe._storiesMeta.count +
            stories,
          "error"
        );
        return false;
      } else {
        deleteRoe({
          variables: {
            id: roe.id
          },
          refetchQueries: ["v3_Customer_Roe_Bases"]
        });
        swal(
          roe.name + " Deleted!",
          "Your Rules of engagement definition has been deleted.",
          "success"
        );
      }
    } else {
      swal("Cancelled", "Your Rules of engagement definition is safe!", "error");
    }
  };

  return (
    <Card
      className={active ? "bg-primary border-0" : "bg-warning border-0"}
      key={roe.id}
    >
      <CardHeader>
        <div className="float-right">
          <Swal
            options={deleteOption}
            callback={handleDelete}
            className="float-right"
          >
            <em className="fa fa-times"></em>
          </Swal>
          <h4 className="m-0">{roe.name}</h4>
          <small>
            {active
              ? "Active in " + roe._storiesMeta.count + stories
              : "Inactive"}{" "}
          </small>
          <div className="row align-items-center">
            <div className="col-3">
              <em className="fa fa-comments fa-5x"></em>
            </div>
            <div className="col-9 text-right">
              <div className="text-lg">{roe.days}</div>
              <p className="m-0">Days Last Contacted</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <RoeEditor
        customerId={roe.customerId}
        roe={roe}
      />
    </Card>
  );
};
const RulesOfEngagements = ({ history, match, customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  

  

  const { data, loading } = useQuery(ROE_QUERY, {
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
  let roes = data.v3_Customer_Roe_Bases || [];

  const defaultRoe = {
    name: "",
    days: 90
  };

  return (
    <React.Fragment>
      <Row className="mb-2">
        <Col cl={12}>
          <RoeEditor
            customerId={customerId}
            roe={defaultRoe}
            className="pull-right"
          />
        </Col>
      </Row>
      <Row>
        {roes.map(roe => {
          return (
            <Col xl="3" lg="4" key={roe.id}>
              <RulesOfEngagement
                roe={roe}
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
const connectedRulesOfEngagements = connect(mapStateToProps)(
  RulesOfEngagements
);

export default withTranslation("translations")(connectedRulesOfEngagements);
