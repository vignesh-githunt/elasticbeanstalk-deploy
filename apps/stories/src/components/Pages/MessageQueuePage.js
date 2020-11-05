import React, { useState, useContext } from 'react';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import {
  Nav,
  NavItem,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ButtonToolbar,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import ProtectedRoute from '../ProtectedRoute';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import { connect } from 'react-redux';
import useSendersList from '../hooks/useSenderList';
import useMessageQueue from '../hooks/useMessageQueue';
import RoutedElementEditor from '../Stories/RoutedElementEditor';
import useLocalStorageState from 'use-local-storage-state';

const SubMenu = () => {
  const [selectedSection] = useState('Message Queue');

  return (
    <div className="content-heading submenu">
      <Col xl={2} style={{ paddingLeft: '0px' }}>
        <div>
          Stories
          <small>{selectedSection}</small>
        </div>
      </Col>
      <Col xl={10}>
        <nav className="navbar navbar-expand-lg subnavbar">
          <Nav navbar className="mr-auto flex-column flex-lg-row nav-tabs">
            <NavItem>
              <Link className="nav-link" to="/stories">
                Explore
              </Link>
            </NavItem>
            <NavItem active>
              <Link className="nav-link" to="/stories/messagequeue">
                Message Queue
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/stories/personalization">
                Personalization
              </Link>
            </NavItem>
          </Nav>
        </nav>
      </Col>
    </div>
  );
};

const MessageQueuePage = ({ customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);
  const { SendersDropdown, senderId, loading: sendersLoading } = useSendersList(
    customerId,
    user,
    userLoading,
    !userLoading ? (user.rolesMask > 2 ? user.id : null) : null,
    true
  );

  const [statuses, setStatuses] = useLocalStorageState('statuses', {
    New: true,
    Approaching: true,
    Paused: true,
    'Error syncing': false,
    'Error in the sequencer': false,
    'ROE violation Error': false,
    'Other Error': false,
  });

  const [pageSize, setPageSize] = useState(50);

  const [selectPageSizeOpen, togglePageSize] = useState(false);

  const { MessageQueueTable, loading, data } = useMessageQueue(
    customerId,
    user,
    userLoading,
    senderId,
    sendersLoading,
    pageSize,
    statuses
  );

  if (loading || userLoading)
    return (
      <ContentWrapper>
        <SubMenu />
        <Row>
          <Col xl={12}>
            <Card className="card-default">
              <CardHeader>
                <CardTitle>Message Queue</CardTitle>
              </CardHeader>
              <CardBody>
                <i className="fa fa-spinner fa-spin"></i>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ContentWrapper>
    );

  return (
    <ContentWrapper>
      <SubMenu />
      <Row>
        <Col xl={12}>
          <Card className="card-default" style={{ minHeight: 600 + 'px' }}>
            <CardHeader>
              <div className="card-tool float-right">
                <ButtonToolbar>
                  <div className="pt-2">
                    {Object.keys(statuses).map((key) => (
                      <label key={key} className="mr-2 text-dark">
                        <input
                          type="checkbox"
                          checked={statuses[key]}
                          onChange={(e) => {
                            setStatuses((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }));
                          }}
                          className="mr-1"
                        />
                        {key}
                      </label>
                    ))}
                  </div>
                  <ButtonDropdown
                    isOpen={selectPageSizeOpen}
                    toggle={() => togglePageSize(!selectPageSizeOpen)}
                    id="pageSize"
                    className="mr-2"
                  >
                    <DropdownToggle caret color="secondary">
                      <i className="fa fa-users mr-2 text-muted"></i>
                      Show {pageSize}{' '}
                      {!loading && data && (
                        <span>
                          of {data._v3_Customer_StoryContactsMeta.count}
                        </span>
                      )}{' '}
                      Contacts
                    </DropdownToggle>
                    <DropdownMenu>
                      {[10, 20, 30, 40, 50, 100, 200].map((x) => {
                        return (
                          <DropdownItem
                            active={pageSize === x}
                            key={x}
                            onClick={() => {
                              setPageSize(x);
                            }}
                          >
                            {x}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </ButtonDropdown>
                  <SendersDropdown />
                </ButtonToolbar>
              </div>
              <CardTitle>Message Queue</CardTitle>
            </CardHeader>
            <CardBody>
              <MessageQueueTable />
              {/* <MessageQueue
                customerId={customerId}
                user={user}
                senderId={senderId}
              /> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ProtectedRoute
        path="/stories/messagequeue/story/:storyId/plotpoint/:plotPointId/element/:elementId"
        component={(props) => {
          return (
            <RoutedElementEditor
              customerId={customerId || user.companyId}
              user={user}
              userLoading={userLoading}
              match={props.match}
              history={props.history}
            />
          );
        }}
      />
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({ customerId: state.customer.id });

export default withTranslation('translations')(
  connect(mapStateToProps)(MessageQueuePage)
);
