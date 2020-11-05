import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks';

import STORYJOURNALAGGREGATION from './queries/StoryJournalAggregationQuery'
import { CUSTOMER_JOBS_QUERY } from "./queries/JobsQuery";
import { START_CUSTOMER_STORY_RUNNER } from "./mutations/workers";
import Colors from "../enums/Colors";
import StoryJournalGraph from './Stories/StoryJournalGraph'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
} from "reactstrap";

const CustomerStoryRunner = ({customerId}) => {
  const [disabled, setDisabled] = useState(false);
  const [format] = useState("day");
  const [startDate] = useState(new Date("2020-03-01"));
  const [endDate] = useState(new Date());
  const [startStoryRunner] = useMutation(
    START_CUSTOMER_STORY_RUNNER,
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
            event: "story_contact_created",
            startDate: startDate,
            endDate: endDate,
          },
        },
      ],
    }
  );

  const handleStartStoryRunner = (e) => {
    setDisabled(true);
    startStoryRunner({
      variables: {
        customerId: customerId,
      },
    }).then((result) => {
      return console.log(result);
    });
  };


  return (
    <Card className="card-default">
      <CardHeader>
        <CardTitle>Customer Story Contact Creation</CardTitle>
      </CardHeader>
      <CardBody>
        <StoryJournalGraph
          bgColorClass="bg-color-cyan-light"
          color={Colors.Cyan}
          title="Story Contacts Created"
          event="story_contact_created"
          format={format}
          startDate={startDate}
          endDate={endDate}
          customerId={customerId}
        />
      </CardBody>
      <Button
        color={"danger"}
        onClick={(e) => {
          handleStartStoryRunner(e);
        }}
        disabled={disabled}
      >
        Start Customer Story Contact Creator Service
      </Button>
    </Card>
  );
}

export default CustomerStoryRunner;