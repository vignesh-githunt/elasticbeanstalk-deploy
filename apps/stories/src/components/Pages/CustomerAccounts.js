import React, { useState, useContext } from "react";
import { withTranslation } from "react-i18next";
import ContentWrapper from "../Layout/ContentWrapper";
import {
  Row,
  Col,
  ButtonToolbar,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
import { connect } from "react-redux";
import StoryJournalGraph from "../Stories/StoryJournalGraph";
import { SENDERS_LIST_QUERY } from "../queries/SendersQuery";
import Colors from "../../enums/Colors";
import { useEffect } from "react";
import * as moment from "moment";
import UserContext from "../UserContext";
import PageLoader from "../Common/PageLoader";
import { useQuery } from "@apollo/react-hooks";

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

const CustomerAccounts = ({ customerId, customerName }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const [format, setFormat] = useState("day");
  const [startDate, setStartDate] = useState(new Date("2019-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [period, setPeriod] = useState("allTime");
  const [reportUser, setReportUser] = useState("All Senders");
  const [reportUserOpen, setReportUserOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [timePeriodOpen, setTimePeriodOpen] = useState(false);
  const [senderId, setSenderId] = useState(null);
  const [groupBySender, setGroupBySender] = useState(false);

  const {
    data: senders,
    loading: sendersLoading,
  } = useQuery(SENDERS_LIST_QUERY, {
    variables: {
      customerId: customerId || user.companyId,
    },
    skip: userLoading,
  });

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

  if (userLoading || sendersLoading) return <PageLoader />;

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          Accounts Dashboard
          <small>{customerName || user.company.name}</small>
        </div>
        <div className="ml-auto">
          <ButtonToolbar>
            <ButtonDropdown
              isOpen={reportUserOpen}
              toggle={() => setReportUserOpen(!reportUserOpen)}
              id="reportUser"
            >
              <DropdownToggle caret color="secondary">
                <i className="fa fa-user mr-2 text-muted"></i>
                {reportUser}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>My Team</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setReportUser("All Senders");
                    setGroupBySender(false);
                    setSenderId(null);
                    console.log("resetting sender id");
                  }}
                >
                  All Senders
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setReportUser("Me");
                    setGroupBySender(true);
                    setSenderId(user.id);
                  }}
                >
                  Me
                </DropdownItem>
                {senders &&
                  senders.users.map((sender) => {
                    if (sender.id !== user.id)
                      return (
                        <DropdownItem
                          onClick={() => {
                            setReportUser(sender.fullName);
                            setGroupBySender(true);
                            setSenderId(sender.id);
                          }}
                        >
                          {sender.fullName}
                        </DropdownItem>
                      );
                    return null;
                  })}
              </DropdownMenu>
            </ButtonDropdown>
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
                {Object.keys(Periods).map((k) => {
                  return (
                    <DropdownItem onClick={() => setPeriod(k)}>
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
                {Object.keys(TimePeriods).map((k) => {
                  return (
                    <DropdownItem onClick={() => setFormat(k)}>
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
            title="Unique Accounts Identified"
            event="contact_identified"
            format={format}
            startDate={startDate}
            endDate={endDate}
            senderId={senderId}
            groupBySender={groupBySender}
            groupByAccount={true}
          />
        </Col>
        <Col md={6} xl={3}>
          {/* START widget */}
          <StoryJournalGraph
            bgColorClass="bg-color-trueblue-light"
            color={Colors.TrueBlue}
            title="Accounts Contacted"
            event="story_contact_contacted"
            format={format}
            startDate={startDate}
            endDate={endDate}
            senderId={senderId}
            groupBySender={groupBySender}
            groupByAccount={true}
          />
        </Col>
        <Col md={6} xl={3}>
          {/* START widget */}
          <StoryJournalGraph
            bgColorClass="bg-color-cyan-light"
            color={Colors.Cyan}
            title="Accounts Engaged"
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
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  customerId: state.customer.id,
  customerName: state.customer.name,
});
const connectedAccounts = connect(mapStateToProps)(CustomerAccounts);

export default withTranslation("translations")(connectedAccounts);

// import React, { useState, useContext } from "react";
// import { withTranslation } from 'react-i18next';
// import ContentWrapper from '../Layout/ContentWrapper';
// import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
// import { CustomerAccountsQuery } from '../queries/CustomerAccountsQuery';
// import { CustomerContactsQuery } from '../queries/CustomerContactsQuery';
// import AccountsList from '../AccountsList';
// import ContactsList from '../ContactsList';
// import { connect } from 'react-redux';
// import UserContext from "../UserContext";

// const AccountsListWithData = CustomerAccountsQuery(AccountsList);
// const ContactsListWithData = CustomerContactsQuery(ContactsList);

// const CustomerAccounts = ({customerId}) => {
//   const { user, loading: userLoading } = useContext(UserContext);
//   const [activeTab, toggleTab] = useState("accounts");

//   if (userLoading) return null;

//   if (!customerId) customerId = user.companyId;
  
  
//   return (
//       <ContentWrapper>
//           <div className="content-heading">
//               <div>Accounts</div>
//           </div>
//           <Row>
//             <Col xl={ 12 }>
//               <Nav tabs justified>
//                 <NavItem>
//                   <NavLink
//                     className={ activeTab === 'accounts' ? 'active':'' }
//                     onClick={() => { toggleTab('accounts'); }}
//                   >Accounts
//                   </NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink
//                     className={ activeTab === 'contacts' ? 'active':'' }
//                     onClick={() => { toggleTab('contacts'); }}
//                   >Contacts</NavLink>
//                   </NavItem>
//               </Nav>
//               <TabContent activeTab={activeTab}>
//                 <TabPane tabId="accounts">
//                   <AccountsListWithData baseUrl="/accounts" customerId={customerId} />
//                 </TabPane>
//                 <TabPane tabId="contacts">
//                   <ContactsListWithData baseUrl="/contacts" customerId={customerId} columns={['avatar', 'firstName', 'lastName', 'email', 'title', 'linkedinUrl']} />
//                 </TabPane>
//               </TabContent>
//             </Col>
//           </Row>
//       </ContentWrapper>
//       );
// }

// const mapStateToProps = state => ({ customerId: state.customer.id })

// export default withTranslation('translations')(connect(
//   mapStateToProps
// )(CustomerAccounts));
