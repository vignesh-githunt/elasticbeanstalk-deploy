import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks';
import ACCOUNTSELECTORS_QUERY from "./queries/AccountSelectorsQuery";
import { CUSTOMER_JOBS_QUERY} from "./queries/JobsQuery";
import { START_CUSTOMER_ACCOUNT_CREATION } from "./mutations/workers";
import Colors from "../enums/Colors";
import AccountJournalGraph from "./AccountJournalGraph";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  Button,
} from "reactstrap";
import moment from "moment";

const CustomerAccountCreation = ({customerId}) => {
  const [disabled, setDisabled] = useState(false);
  const [format] = useState("day");
  const [startDate] = useState(new Date("2020-03-01"));
  const [endDate] = useState(new Date());
    
  const { data: data2, loading } = useQuery(ACCOUNTSELECTORS_QUERY, {
    variables: { customerId: customerId },
  });

  const [startAccountCreation] = useMutation(START_CUSTOMER_ACCOUNT_CREATION, {
    variables: {
      customerId: customerId,
    },
    refetchQueries: [
      {
        query: CUSTOMER_JOBS_QUERY,
        variables: {
          customerId: customerId
        }
      },
    ],
  });

  if (loading)
    return <div>Loading...</div>;

  const {
    v3_Customer_AccountSelectors: accountSelectors,
  } = data2;

  const handleStartAccountCreation = (e) => {
    setDisabled(true)
    startAccountCreation({
      variables: {
        customerId: customerId,
      },
    }).then((result) => {
      console.log(result);
    });
  };

  const accountSelectorsCount = accountSelectors ? accountSelectors.length : 0
  const accountSelector = accountSelectorsCount
    ? accountSelectors.sort((a, b) => a.lastChecked > b.lastChecked)[0]
    : null;

  return (
    <Card className="card-default">
      <CardHeader>
        <CardTitle>Customer Account Creation</CardTitle>
      </CardHeader>
      <Row className="row align-items-center mx-0">
        <Col>
          <AccountJournalGraph
            bgColorClass="bg-color-cyan-light"
            color={Colors.Cyan}
            title="Accounts Created"
            event="account_created"
            format={format}
            startDate={startDate}
            endDate={endDate}
            customerId={customerId}
          />
        </Col>
      </Row>
      <Row className="row align-items-center mx-0">
        <Col xl={4} className="text-center">
          <em className="icon-target fa-3x"></em>
        </Col>
        <Col xl={8} className="py-4 rounded-right">
          <div className="text-uppercase">Created from</div>
          <div className="h1 m-0 text-bold">{accountSelectorsCount}</div>
          <div className="text-uppercase">Total Account Selectors</div>
        </Col>
      </Row>
      <Row className="row align-items-center mx-0">
        <Col xl={4} className="text-center">
          <em className="fa fa-calendar-check fa-3x"></em>
        </Col>
        <Col xl={8} className="py-4 rounded-right">
          <div className="text-uppercase">Last Checked</div>
          <div className="h1 m-0 text-bold">
            {accountSelector && accountSelector.lastChecked
              ? moment(accountSelector.lastChecked).fromNow()
              : "Never"}
          </div>
        </Col>
      </Row>
      <Button
        color={"danger"}
        onClick={(e) => {
          handleStartAccountCreation(e);
        }}
        disabled={disabled}
      >
        Start Customer Account Creator Service
      </Button>
    </Card>
  );
}

export default CustomerAccountCreation;