import React, { useState, useContext } from 'react';
import PageLoader from './Common/PageLoader';
import { Row, Col, Table, Card, CardHeader,  CardBody,
  ButtonToolbar,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown, } from 'reactstrap';
import StoryJournalGraph from "./Stories/StoryJournalGraph";
import Colors from "../enums/Colors";
import { useEffect } from "react";
import { STORYQUERYSTRING } from "./queries/StoryQuery";
import { useQuery } from "@apollo/react-hooks";
import ContentWrapper from './Layout/ContentWrapper';
import UserContext from "./UserContext";
import { connect } from "react-redux";
import * as moment from "moment";
import useSendersList from "./hooks/useSenderList";
import useContactsList from "./hooks/useContactsList";

const Periods = {
  allTime: "All Time",
  thisQuarter: "This Quarter",
  thisMonth: "This Month",
  lastMonth: "Last Month",
  thisWeek: "This Week",
};

const TimePeriods = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

const StoryDetails = ({ storyId, customerId, customerName }) => {
  const { user, loading: userLoading } = useContext(UserContext);
  
  const { loading, data } = useQuery(STORYQUERYSTRING, {
    variables: {
      storyId: storyId
    }
  });

  const [format, setFormat] = useState("day");
  const [startDate, setStartDate] = useState(new Date("2019-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState("allTime");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [timePeriodOpen, setTimePeriodOpen] = useState(false);

  const { SendersDropdown, senderId, groupBySender } = useSendersList(
    customerId,
    user,
    userLoading
  );

  const { ContactsList } = useContactsList(
    customerId,
    user,
    userLoading,
    senderId,
    storyId,
    startDate,
    endDate
  );

  useEffect(() => {
    switch (period) {
      case "allTime":
        setStartDate(new Date("2020-01-01"));
        setEndDate(new Date());
        break;
      case "thisQuarter":
        setStartDate(moment().startOf("quarter"));
        setEndDate(moment().endOf("quarter"));
        break;
      case "thisMonth":
        setStartDate(moment().startOf("month"));
        setEndDate(moment().endOf("month"));
        break;
      case "lastMonth":
        setStartDate(
          moment()
            .subtract(1, "M")
            .startOf("month")
        );
        setEndDate(
          moment()
            .subtract(1, "M")
            .endOf("month")
        );
        break;
      case "thisWeek":
        setStartDate(moment().startOf("week"));
        setEndDate(moment().endOf("week"));
        break;
      default:
        break;
    }
  }, [period]);

  if (loading) return <PageLoader />;

  const story = data.v3_Customer_Story;
  
  
  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {story.name}
          <small>
            {customerName || user.company.name} - {user.firstName}{" "}
            {user.lastName}
          </small>
        </div>
        <div className="ml-auto">
          <ButtonToolbar>
            <SendersDropdown />
            <ButtonDropdown
              isOpen={periodOpen}
              toggle={() => setPeriodOpen(!periodOpen)}
              id="timeSpan"
            >
              <DropdownToggle caret color="secondary">
                <i className="fa fa-calendar-alt mr-2 text-muted"></i>
                {Periods[period]}
              </DropdownToggle>
              <DropdownMenu>
                {Object.keys(Periods).map((k, index) => {
                  return (
                    <DropdownItem key={index} onClick={() => setPeriod(k)}>
                      {Periods[k]}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </ButtonDropdown>
            <ButtonDropdown
              isOpen={timePeriodOpen}
              toggle={() => setTimePeriodOpen(!timePeriodOpen)}
              id="timeSpan"
            >
              <DropdownToggle caret color="secondary">
                <i className="fa fa-calendar-day mr-2 text-muted"></i>
                Group by: {TimePeriods[format]}
              </DropdownToggle>
              <DropdownMenu>
                {Object.keys(TimePeriods).map((k, index) => {
                  return (
                    <DropdownItem key={index} onClick={() => setFormat(k)}>
                      {TimePeriods[k]}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonToolbar>
        </div>
      </div>
      <Row className="mb-2">
        <Col md={6} xl={3}>
          <StoryJournalGraph
            bgColorClass="bg-color-ocean-light"
            color={Colors.Ocean}
            title="Contact Identified"
            event="story_contact_created"
            format={format}
            startDate={startDate}
            endDate={endDate}
            storyId={storyId}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
        <Col md={6} xl={3}>
          <StoryJournalGraph
            bgColorClass="bg-color-trueblue-light"
            color={Colors.TrueBlue}
            title="Contact Added to Sequencer"
            event="story_contact_added_to_sequencer"
            format={format}
            startDate={startDate}
            endDate={endDate}
            storyId={storyId}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
        <Col md={6} xl={3}>
          <StoryJournalGraph
            bgColorClass="bg-color-trueblue-light"
            color={Colors.TrueBlue}
            title="Contacts Contacted"
            event="story_contact_contacted"
            format={format}
            startDate={startDate}
            endDate={endDate}
            storyId={storyId}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
        <Col md={6} xl={3}>
          <StoryJournalGraph
            bgColorClass="bg-danger-light"
            color={Colors.Poppy}
            title="Problem in Sequencer"
            event="story_contact_sequencer_error"
            format={format}
            startDate={startDate}
            endDate={endDate}
            storyId={storyId}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} xl={3}>
          {/* START widget */}
          <StoryJournalGraph
            bgColorClass="bg-color-cyan-light"
            color={Colors.Cyan}
            title="Engaged"
            event="story_contact_engaged"
            format={format}
            startDate={startDate}
            endDate={endDate}
            storyId={storyId}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
        <Col md={6} xl={3}>
          {/* START widget */}
          <StoryJournalGraph
            bgColorClass="bg-color-grass-light"
            color={Colors.Grass}
            title="Opportunities"
            event="opportunity_created"
            format={format}
            startDate={startDate}
            endDate={endDate}
            storyId={storyId}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
      </Row>
      <ContactsList />
      <Row>
        <Col xl={4}>
          <Card className="card-default">
            <CardHeader>Details</CardHeader>
            <CardBody>
              <p className="m-0 lead">{story.name}</p>
              <p className="m-0 lead">
                {story.rulesOfEngagement.days} days last contacted
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="card-default">
            <CardHeader>Account Selection</CardHeader>
            <CardBody>
              <Table striped bordered hover responsive>
                <tbody>
                  {story.accountSelector.requiredDataPoints.map((dp) => {
                    return (
                      <tr key={dp.id}>
                        <td>{dp.dataPointType}</td>
                        <td>{dp.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="card-default">
            <CardHeader>Contact Selection</CardHeader>
            <CardBody>
              <Table striped bordered hover responsive>
                <tbody>
                  {story.contactSelector.requiredDataPoints.map((dp) => {
                    return (
                      <tr key={dp.id}>
                        <td>{dp.dataPointType}</td>
                        <td>{dp.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  customerId: state.customer.id,
  customerName: state.customer.name
});
const connectedStoryDetails = connect(mapStateToProps)(StoryDetails);
export default connectedStoryDetails;

