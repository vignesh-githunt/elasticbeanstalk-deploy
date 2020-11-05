import React from 'react';
import {
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import NOTIFICATIONS_QUERY from '../queries/NotificationsQuery';
import { UPDATE_NOTIFICATION } from '../mutations/NotificationMutations';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';

const useNotifications = (currentUser, userLoading, history) => {
  const { data, loading, error } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      senderId: currentUser && currentUser.id,
    },
    skip: !currentUser || userLoading,
  });

  const [markAsSeen] = useMutation(UPDATE_NOTIFICATION);
  const Notifications = () => {
    if (userLoading || loading)
      return (
        <UncontrolledDropdown nav inNavbar className="dropdown-list">
          <DropdownToggle nav className="dropdown-toggle-nocaret">
            <em className="icon-bell"></em>
            <span className="badge badge-danger">
              <i className="fa fa-spinner fa-spin"></i>
            </span>
          </DropdownToggle>
        </UncontrolledDropdown>
      );
    if (error)
      return (
        <UncontrolledDropdown nav inNavbar className="dropdown-list">
          <DropdownToggle nav className="dropdown-toggle-nocaret">
            <em className="icon-bell"></em>
            <span className="badge badge-danger">
              <i className="fa fa-exclamation-triangle"></i>
            </span>
          </DropdownToggle>
          <DropdownMenu right className="dropdown-menu-right animated flipInX">
            <ListGroupItem
              action
              tag="a"
              href=""
              onClick={(e) => e.preventDefault()}
            >
              <div className="media">
                <div className="align-self-start mr-2">
                  <em className="fa fa-exclamation-triangle fa-2x text-danger"></em>
                </div>
                <div className="media-body">
                  <p className="m-0">Error</p>
                  <p className="m-0 text-muted text-sm">
                    Something went wrong fetching notifications
                  </p>
                </div>
              </div>
            </ListGroupItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      );

    return (
      <UncontrolledDropdown nav inNavbar className="dropdown-list">
        <DropdownToggle nav className="dropdown-toggle-nocaret">
          <em className="icon-bell"></em>
          {data &&
            data._v3_NotificationsMeta &&
            data._v3_NotificationsMeta.count > 0 && (
              <span className="badge badge-danger">
                {data._v3_NotificationsMeta.count}
              </span>
            )}
        </DropdownToggle>
        {/* START Dropdown menu */}
        <DropdownMenu right className="dropdown-menu-right animated flipInX">
          <DropdownItem>
            {/* START list group */}
            <ListGroup>
              {data &&
                data.v3_Notifications &&
                data.v3_Notifications.map((notification) => {
                  return (
                    <ListGroupItem
                      action
                      tag="a"
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        markAsSeen({
                          variables: {
                            id: notification.id,
                            seenAt: new Date(),
                          },
                          refetchQueries: [
                            {
                              query: NOTIFICATIONS_QUERY,
                              variables: {
                                senderId: currentUser && currentUser.id,
                              },
                            },
                          ],
                        });
                        history.push(`/${notification.action}`);
                      }}
                    >
                      <div className="media">
                        <div className="align-self-start mr-2">
                          <em className={`${notification.icon} fa-2x`}></em>
                        </div>
                        <div className="media-body">
                          <p className="m-0">{notification.title}</p>
                          <p className="m-0 text-muted text-sm">
                            {notification.body}
                          </p>
                          <p className="text-right">
                            {moment(notification.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    </ListGroupItem>
                  );
                })}
              {data &&
                data._v3_NotificationsMeta &&
                data._v3_NotificationsMeta.count === 0 && (
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="media">
                      <div className="align-self-start mr-2">
                        <em className="fa fa-check fa-2x text-success"></em>
                      </div>
                      <div className="media-body">
                        <p className="m-0">No notifications</p>
                        <p className="m-0 text-muted text-sm">
                          You have no unread notifications
                        </p>
                      </div>
                    </div>
                  </ListGroupItem>
                )}
            </ListGroup>
            {/* END list group */}
          </DropdownItem>
        </DropdownMenu>
        {/* END Dropdown menu */}
      </UncontrolledDropdown>
    );
  };

  return {
    Notifications,
    data,
    loading,
    error,
  };
};

export default useNotifications;
