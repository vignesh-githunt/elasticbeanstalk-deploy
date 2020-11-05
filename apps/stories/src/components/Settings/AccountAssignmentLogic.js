import React, {
  useContext,
} from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import UserContext from "../UserContext";
import {
  ACCOUNT_ASSIGNMENT_LOGIC_QUERY,
  ACCOUNT_ASSIGNMENT_LOGIC_COUNT_QUERY,
} from "../queries/AccountAssignmentLogicQuery";
import { UPDATE_AAL, DELETE_AAL } from "../mutations/AccountAssignmentLogicMutations";
import useSendersList from "../hooks/useSenderList";
import DualListBox from "react-dual-listbox";
import { RuleSet } from '../RulesEngine/RuleSet';
import AALEditor from './AALEditor';
import swal from "sweetalert";

const Aal = ({ customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const { data, loading, error } = useQuery(ACCOUNT_ASSIGNMENT_LOGIC_QUERY, {
    variables: {
      customerId: customerId || user.companyId
    }
  });

  const [updateLogic, { loading: updateLoading }] = useMutation(UPDATE_AAL);
  const [deleteLogic] = useMutation(DELETE_AAL);

  const { senders } = useSendersList(
    customerId,
    user,
    userLoading
  );

  const onSendersChange = (logic, selected) => {
    updateLogic({
      variables: {
        id: logic.id,
        name: logic.name,
        senderIds: selected,
      },
      refetchQueries: [
        {
          query: ACCOUNT_ASSIGNMENT_LOGIC_QUERY,
          variables: {
            customerId: customerId || user.companyId,
          },
        },
      ],
    });
  }

  const deleteOption = {
    title: "Are you sure?",
    text: "You will not be able to undo this action!",
    icon: "warning",
    buttons: {
      cancel: {
        text: "No, cancel!",
        value: null,
        visible: true,
        className: "",
        closeModal: false,
      },
      confirm: {
        text: "Yes, delete this account assignment logic!",
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false,
      },
    },
  };

  const handleDelete = (logic, isConfirm, swal) => {
    if (isConfirm) {
      deleteLogic({
        variables: {
          id: logic.id,
        },
        refetchQueries: () => [
          {
            query: ACCOUNT_ASSIGNMENT_LOGIC_QUERY,
            variables: {
              customerId: customerId || user.companyId,
            },
          },
          {
            query: ACCOUNT_ASSIGNMENT_LOGIC_COUNT_QUERY,
            variables: {
              customerId: customerId || user.companyId,
            },
          },
        ],
      });
      swal(
        "Logic Deleted!",
        "The account assignment logic has been deleted",
        "success"
      );
    } else {
      swal("Cancelled", "Your logic is safe!", "error");
    }
  };

  if (userLoading || loading) return <i className="fa fa-spin fa-spinner"></i>

  if (error) return "Something went wrong"

  return (
    <Card className="card-default">
      <CardHeader>
        <div className="float-right">
          <AALEditor
            customerId={customerId || user.companyId}
            aal={{
              name: "",
            }}
          />
        </div>
        <CardTitle>Current rules for Account Assignments</CardTitle>
      </CardHeader>
      {data.v3_Customer_AccountAssignmentLogics.map((logic, index) => {
        return (
          <CardBody className="bb" key={index}>
            <Row>
              <Col>
                <RuleSet
                  customerId={customerId || user.companyId}
                  ruleSetId={logic.ruleSet.id}
                />
              </Col>
              <Col>
                <div class="float-right">
                  <button
                    title="remove this logic"
                    onClick={(e) => {
                      swal(deleteOption).then((p) =>
                        handleDelete(logic, p, swal)
                      );
                      e.stopPropagation();
                    }}
                    className="btn btn-danger btn-xs"
                  >
                    {" "}
                    <i className="fa fa-minus"></i>{" "}
                  </button>
                </div>
                <p>
                  ... assign the accounts (round robin) to the below selected
                  Sender(s)
                </p>
                {senders && !updateLoading && (
                  <DualListBox
                    canFilter
                    options={senders.users.map((f) => {
                      return { value: f.id, label: f.fullName };
                    })}
                    onChange={(selected) => onSendersChange(logic, selected)}
                    selected={logic.senders.map((f) => {
                      return f.id;
                    })}
                  />
                )}
                {updateLoading && (
                  <i className="fa fa-2x fa-spin fa-spinner"></i>
                )}
              </Col>
            </Row>
          </CardBody>
        );
      })}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  customerId: state.customer.id,
  customerName: state.customer.name,
});
const connectedAal = connect(mapStateToProps)(Aal);

export default withTranslation("translations")(connectedAal);
