/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React, { useContext } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Col, ListGroup, ListGroupItem, Progress, Row } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
import { ContentWrapper } from "@nextaction/components";
import { FETCH_ALL_SETTINGS_QUERY } from '../../queries/SettingsQuery';
import UserContext from '../../UserContext';
import EmailSetting from './EmailSettings';
import EmailExecutionSchedule from './EmailExecutionSchedule';
import Notifications from './Notifications';
import Tags from './Tags';
import OutcomeColumns from './TouchOutcomes';
import TransferOwnership from './TransferOwnership';
import UserSettings from './UserSettings';
import SyncFieldMapping from './SyncFieldMapping';
import SyncLog from './SyncLog';
import CrmSyncSettings from './CrmSyncSettings';

const Settings = ({ match }) => {

  const { data: settingsData, loading: settingsLoading, error } = useQuery(FETCH_ALL_SETTINGS_QUERY, {
    notifyOnNetworkStatusChange: true,
  });

  let crmType;
  if (settingsData && settingsData.settings && settingsData.settings.data) {
    crmType = settingsData.settings.data[0].crmType;
  }

  const { user, loading: userLoading } = useContext(UserContext);
  const isManager = userLoading ? "" : user.isManagerUser;
  const isAdmin = userLoading ? "" : user.isAdminUser;
  const tabsList = ["emailSettings", "touchOutcomes", "notifications", "syncFieldMapping", "crmSync", "transferOwnerShip", "emailExecutionSchedule", "syncLog", "userSettings", "calendar", "tag"];
  const activeTab = tabsList.indexOf(match.params.tab) > -1 ? match.params.tab : tabsList[0];

  return (
    <ContentWrapper>
      <Row>
        <Col lg="3">
          <div className="b">
            <ListGroupItem className="pl-2 borderless font-weight-bold" tag="a">Settings</ListGroupItem >
            {settingsLoading &&
              <Col sm={6} className="my-auto">
                <Progress animated value="100" />
              </Col>
            }
            {
              !settingsLoading && !error && crmType !== undefined &&
              <ListGroup className="borderless">
                <NavLink
                  to="/settings/emailSettings"
                  activeClassName="active"
                  className="list-group-item-action list-group-item pl-4 borderless"
                  isActive={() => activeTab === tabsList[0]}
                  activeStyle={{ pointerEvents: "none" }}
                  replace
                >
                  Email Settings
                </NavLink>
                {
                  (isManager === "Y" || isAdmin === "Y") &&
                  <NavLink
                    to="/settings/touchOutcomes"
                    activeClassName="active"
                    className="list-group-item-action list-group-item pl-4 borderless"
                    isActive={() => activeTab === tabsList[1]}
                    activeStyle={{ pointerEvents: "none" }}
                    replace
                  >
                    Touch Outcomes
                  </NavLink>
                }
                {
                  (isManager === "Y" || isAdmin === "Y") &&
                  <NavLink
                    to="/settings/notifications"
                    activeClassName="active"
                    className="list-group-item-action list-group-item pl-4 borderless"
                    isActive={() => activeTab === tabsList[2]}
                    activeStyle={{ pointerEvents: "none" }}
                    replace
                  >
                    Notifications
            	    </NavLink>
                }
                {
                  (isManager === "Y" || isAdmin === "Y") && crmType !== "standalone" &&
                  <NavLink
                    to="/settings/syncFieldMapping"
                    activeClassName="active"
                    className="list-group-item-action list-group-item pl-4 borderless"
                    isActive={() => activeTab === tabsList[3]}
                    activeStyle={{ pointerEvents: "none" }}
                    replace
                  >
                    Sync Field Mapping
                  </NavLink>
                }
                {
                  (isManager === "Y" || isAdmin === "Y") && crmType !== "standalone" &&
                  <NavLink
                    to="/settings/crmSync"
                    activeClassName="active"
                    className="list-group-item-action list-group-item pl-4 borderless"
                    isActive={() => activeTab === tabsList[4]}
                    activeStyle={{ pointerEvents: "none" }}
                    replace
                  >
                    CRM  Sync Settings
                  </NavLink>
                }
                {
                  (isManager === "Y" || isAdmin === "Y") &&
                  <NavLink
                    to="/settings/transferOwnerShip"
                    activeClassName="active"
                    className="list-group-item-action list-group-item pl-4 borderless"
                    isActive={() => activeTab === tabsList[5]}
                    activeStyle={{ pointerEvents: "none" }}
                    replace
                  >
                    Transfer OwnerShip
                  </NavLink>
                }
                <NavLink
                  to="/settings/emailExecutionSchedule"
                  activeClassName="active"
                  className="list-group-item-action list-group-item pl-4 borderless"
                  isActive={() => activeTab === tabsList[6]}
                  activeStyle={{ pointerEvents: "none" }}
                  replace
                >
                  Email Execution Schedule
                </NavLink>
                {
                  (isManager === "Y" || isAdmin === "Y") && crmType !== "standalone" &&
                  <NavLink
                    to="/settings/syncLog"
                    activeClassName="active"
                    className="list-group-item-action list-group-item pl-4 borderless"
                    isActive={() => activeTab === tabsList[7]}
                    activeStyle={{ pointerEvents: "none" }}
                    replace
                  >
                    Sync Logs
                  </NavLink>
                }
                <NavLink
                  to="/settings/userSettings"
                  activeClassName="active"
                  className="list-group-item-action list-group-item pl-4 borderless"
                  isActive={() => activeTab === tabsList[8]}
                  activeStyle={{ pointerEvents: "none" }}
                  replace
                >
                  User Settings
                </NavLink>
                <NavLink
                  to="/settings/calendar"
                  activeClassName="active"
                  className="list-group-item-action list-group-item pl-4 borderless"
                  isActive={() => activeTab === tabsList[9]}
                  activeStyle={{ pointerEvents: "none" }}
                  replace
                >
                  Calendar Settings
                </NavLink>
                <NavLink
                  to="/settings/tag"
                  activeClassName="active"
                  className="list-group-item-action list-group-item pl-4 borderless"
                  isActive={() => activeTab === tabsList[10]}
                  activeStyle={{ pointerEvents: "none" }}
                  replace
                >
                  Tags
                </NavLink>
              </ListGroup>
            }
          </div>
        </Col>
        <Col lg="9">
          <Route path="/settings/emailSettings" component={EmailSetting} />
          <Route path="/settings" component={EmailSetting} exact />
          <Route path="/settings/touchOutcomes" component={OutcomeColumns} />
          <Route path="/settings/notifications" component={Notifications} />
          <Route path="/settings/syncFieldMapping" component={SyncFieldMapping} />
          <Route path="/settings/crmSync" component={CrmSyncSettings} />
          <Route path="/settings/transferOwnerShip" component={TransferOwnership} />
          <Route path="/settings/emailExecutionSchedule" component={EmailExecutionSchedule} />
          <Route path="/settings/syncLog" component={SyncLog} />
          <Route path="/settings/userSettings" component={UserSettings} />
          <Route path="/settings/calendar" />
          <Route path="/settings/tag" component={Tags} />
        </Col>
      </Row>
    </ContentWrapper>
  );
}
export default Settings;