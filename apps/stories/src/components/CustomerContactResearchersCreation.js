import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks';

import STORYJOURNALAGGREGATION from './queries/StoryJournalAggregationQuery'
import { CUSTOMER_JOBS_QUERY } from "./queries/JobsQuery";
import { START_CUSTOMER_CONTACT_RESEARCHERS_CREATION } from "./mutations/workers";
import Colors from "../enums/Colors";
import StoryJournalGraph from './Stories/StoryJournalGraph'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
} from "reactstrap";

const CustomerContactResearchersCreation = ({customerId}) => {
  const [disabled, setDisabled] = useState(false);
  const [format] = useState("day");
  const [startDate] = useState(new Date("2020-03-01"));
  const [endDate] = useState(new Date());
  const [startContactResearcherCreation] = useMutation(
    START_CUSTOMER_CONTACT_RESEARCHERS_CREATION,
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
            event: "research_requested", 
            startDate: startDate, 
            endDate: endDate
          }
        }
      ],
    }
  );

    
    const handleStartContactResearcherCreation = (e) => {
      setDisabled(true);
      startContactResearcherCreation({
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
        <CardTitle>Story Pre Research Analyser</CardTitle>
      </CardHeader>
      <CardBody>
        <StoryJournalGraph
          bgColorClass="bg-color-grass-light"
          color={Colors.Grass}
          title="Researchers Created"
          event="research_requested"
          format={format}
          startDate={startDate}
          endDate={endDate}
          customerId={customerId}
        />
      </CardBody>
      <Button
        color={"danger"}
        onClick={(e) => {
          handleStartContactResearcherCreation(e);
        }}
        disabled={disabled}
      >
        Start Story Pre Research Analyser
      </Button>
    </Card>
  );
}

export default CustomerContactResearchersCreation;