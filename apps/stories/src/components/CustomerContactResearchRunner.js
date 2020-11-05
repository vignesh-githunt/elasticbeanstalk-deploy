import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks';

import STORYJOURNALAGGREGATION from './queries/StoryJournalAggregationQuery'
import { CUSTOMER_JOBS_QUERY } from "./queries/JobsQuery";
import { START_CUSTOMER_CONTACT_RESEARCH_RUNNER } from "./mutations/workers";
import Colors from "../enums/Colors";
import StoryJournalGraph from './Stories/StoryJournalGraph'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
} from "reactstrap";

const CustomerContactResearcherRunner = ({customerId}) => {
  const [disabled, setDisabled] = useState(false);
  const [format] = useState("day");
  const [startDate] = useState(new Date("2020-03-01"));
  const [endDate] = useState(new Date());

    const [startContactResearchRunner] = useMutation(
      START_CUSTOMER_CONTACT_RESEARCH_RUNNER,
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
          {
            query: STORYJOURNALAGGREGATION,
            variables: { 
              customerId: customerId, 
              format: format, 
              event: "research_completed", 
              startDate: startDate, 
              endDate: endDate
            }
          }
        ],
      }
    );
    const handleStartContactResearchRunner = (e) => {
      setDisabled(true);
      startContactResearchRunner({
        variables: {
          customerId: customerId,
        },
      }).then((result) => {
        console.log(result);
      });
    };


  return (
    <Card className="card-default">
      <CardHeader>
        <CardTitle>Story Research Runner</CardTitle>
      </CardHeader>
      <CardBody>
        <StoryJournalGraph
          bgColorClass="bg-color-grass-light"
          color={Colors.Grass}
          title="Researchers Completed"
          event="research_completed"
          format={format}
          startDate={startDate}
          endDate={endDate}
          customerId={customerId}
        />
      </CardBody>
      <Button
        color={"danger"}
        onClick={(e) => {
          handleStartContactResearchRunner(e);
        }}
        disabled={disabled}
      >
        Start Story Research Runner
      </Button>
    </Card>
  );
}

export default CustomerContactResearcherRunner;