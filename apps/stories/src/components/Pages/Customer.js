import React, { useState, useContext } from 'react';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import {
  Row,
  Col,
  ButtonToolbar,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
import { connect } from 'react-redux';
import StoryJournalGraph from '../Stories/StoryJournalGraph'
import Colors from '../../enums/Colors'
import { useEffect } from 'react';
import * as moment from 'moment';
import UserContext from '../UserContext';
import PageLoader from '../Common/PageLoader';
import useSendersList from '../hooks/useSenderList';

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
  year: "Year"
};

const Customer = ({ customerId, customerName }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const [format, setFormat] = useState("day");
  const [startDate, setStartDate] = useState(new Date("2019-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState("allTime");
  const [showDetails, setShowDetails] = useState(false);
  // const [reportUser, setReportUser] = useState("All Senders");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [timePeriodOpen, setTimePeriodOpen] = useState(false);
  // const [senderId, setSenderId] = useState(null);
  // const [groupBySender, setGroupBySender] = useState(false);

  // const { data: senders, loading: sendersLoading, error: sendersError } = useQuery(
  //   SENDERS_LIST_QUERY, {
  //     variables: {
  //       customerId: customerId || user.companyId
  //     },
  //     skip: userLoading
  //   }
  // );
  const { SendersDropdown, senderId, groupBySender } = useSendersList(customerId, user, userLoading);

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
        setStartDate(moment().subtract(1, "M").startOf("month"));
        setEndDate(moment().subtract(1, "M").endOf("month"));
        break;
      case "thisWeek":
        setStartDate(moment().startOf("week"));
        setEndDate(moment().endOf("week"));
        break;
      default:
        break;
    }
  }, [period]);

  if (userLoading) return <PageLoader />

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          Dashboard
          <small>{customerName || user.company.name}</small>
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
      <Row>
        <Col md={6} xl={3}>
          {/* START widget */}
          <StoryJournalGraph
            bgColorClass="bg-color-ocean-light"
            color={Colors.Ocean}
            title="Unique Contacts Identified"
            event="contact_identified"
            format={format}
            startDate={startDate}
            endDate={endDate}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
        <Col md={6} xl={3}>
          {/* START widget */}
          <StoryJournalGraph
            bgColorClass="bg-color-trueblue-light"
            color={Colors.TrueBlue}
            title="Contacts Contacted"
            event="story_contact_contacted"
            format={format}
            startDate={startDate}
            endDate={endDate}
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
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
            senderId={senderId}
            groupBySender={groupBySender}
          />
        </Col>
      </Row>
      <h1 className="title">Details</h1>
      <button
        className="btn btn-secondary mb-4"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide" : "Show"} Details
      </button>
      {showDetails && (
        <Row>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-color-trueblue-light"
              color={Colors.TrueBlue}
              title="Research Requested for Contacts"
              event="research_requested"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-danger-light"
              color={Colors.Rouge}
              title="Research Error for Contacts"
              event="research_error"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-color-cyan-light"
              color={Colors.Cyan}
              title="Research Completed for Contacts"
              event="research_completed"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-color-cyan-light"
              color={Colors.Cyan}
              title="Story Contacts Created"
              event="story_contact_created"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-color-cyan-light"
              color={Colors.Cyan}
              title="Story Contacts Updated"
              event="story_contact_updated"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-color-cyan-light"
              color={Colors.Cyan}
              title="Story Contacts Added to Sequencer"
              event="story_contact_added_to_sequencer"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-danger-light"
              color={Colors.Poppy}
              title="Story Contact Sequencer Error"
              event="story_contact_sequencer_error"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-danger-light"
              color={Colors.Poppy}
              title="Story Contact Deleted"
              event="story_contact_deleted"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
          <Col md={6} xl={3}>
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-danger-light"
              color={Colors.Poppy}
              title="Story Contact Errors"
              event="story_contact_error"
              format={format}
              startDate={startDate}
              endDate={endDate}
              senderId={senderId}
              groupBySender={groupBySender}
            />
          </Col>
        </Row>
      )}
    </ContentWrapper>
  );
};


const mapStateToProps = (state) => ({
  customerId: state.customer.id,
  customerName: state.customer.name 
});
const connectedCustomer = connect(mapStateToProps)(Customer)

export default withTranslation('translations')(connectedCustomer);
