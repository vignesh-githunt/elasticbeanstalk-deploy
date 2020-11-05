import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks';
import CONTACTSELECTORS_QUERY from "./queries/ContactSelectorsQuery";
import { CUSTOMER_JOBS_QUERY} from "./queries/JobsQuery";
import { START_CUSTOMER_CONTACT_CREATION } from "./mutations/workers";
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

const CustomerContactCreation = ({customerId}) => {
  const [disabled, setDisabled] = useState(false);
  const [format] = useState("day");
  const [startDate] = useState(new Date("2020-03-01"));
  const [endDate] = useState(new Date());

    const { data: data2, loading } = useQuery(
      CONTACTSELECTORS_QUERY,
      {
        variables: { customerId: customerId },
      }
    );

    const [startContactCreation] = useMutation(
      START_CUSTOMER_CONTACT_CREATION,
      {
        variables: {
          customerId: customerId,
        },
        refetchQueries: [
          {
            query: CUSTOMER_JOBS_QUERY,
            variables: {
              customerId: customerId,
            },
          },
        ],
      }
    );

    if (loading) return <div>Loading...</div>;

    const { v3_Customer_ContactSelectors: contactSelectors } = data2;

    const handleStartContactCreation = (e) => {
      setDisabled(true);
      startContactCreation({
        variables: {
          customerId: customerId,
        },
      }).then((result) => {
        console.log(result);
      });
    };

    const contactSelectorsCount = contactSelectors
      ? contactSelectors.length
      : 0;
    const contactSelector = contactSelectorsCount
      ? contactSelectors.sort((a, b) => a.lastChecked > b.lastChecked)[0]
      : null;

  return (
    <Card className="card-default">
      <CardHeader>
        <CardTitle>Customer Contact Creation</CardTitle>
      </CardHeader>
      <Row className="row align-items-center mx-0">
        <Col>
          <AccountJournalGraph
            bgColorClass="bg-color-cyan-light"
            color={Colors.Cyan}
            title="Contacts Created"
            event="contact_created"
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
          <div className="h1 m-0 text-bold">{contactSelectorsCount}</div>
          <div className="text-uppercase">Total Contact Selectors</div>
        </Col>
      </Row>
      <Row className="row align-items-center mx-0">
        <Col xl={4} className="text-center">
          <em className="fa fa-calendar-check fa-3x"></em>
        </Col>
        <Col xl={8} className="py-4 rounded-right">
          <div className="text-uppercase">Last Checked</div>
          <div className="h1 m-0 text-bold">
            {contactSelector && contactSelector.lastChecked
              ? moment(contactSelector.lastChecked).fromNow()
              : "Never"}
          </div>
        </Col>
      </Row>
      <Button
        color={"danger"}
        onClick={(e) => {
          handleStartContactCreation(e);
        }}
        disabled={disabled}
      >
        Start Customer Contact Creator Service
      </Button>
    </Card>
  );
}

export default CustomerContactCreation;