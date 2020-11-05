import React, { useState, useEffect } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  Button,
} from 'reactstrap';
import { SENDERS_LIST_QUERY } from '../queries/SendersQuery';
import { useQuery } from '@apollo/react-hooks';

const useSenderList = (
  customerId,
  currentUser,
  userLoading,
  defaultSenderId,
  disableForNonManagers = false
) => {
  const [senderId, setSenderId] = useState(defaultSenderId);
  const [reportUser, setReportUser] = useState('All Senders');
  const [reportUserOpen, setReportUserOpen] = useState(false);
  const [groupBySender, setGroupBySender] = useState(false);
  const { data: senders, loading, error } = useQuery(SENDERS_LIST_QUERY, {
    variables: {
      customerId: customerId || currentUser.companyId,
    },
    skip: userLoading,
  });

  const SendersDropdown = () => {
    useEffect(() => {
      if (senders && senderId !== null) {
        if (senderId === currentUser.id) {
          setReportUser('Me');
        } else {
          if (senders.users.length > 0) {
            let x = senders.users.filter((s) => s.id === senderId);
            if (x.length > 0) setReportUser(x[0].fullName);
          }
        }
      }
    }, []);
    if (userLoading || loading)
      return (
        <Button>
          <i className="fa fa-spinner fa-spin"></i>
        </Button>
      );

    return (
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
            active={senderId === null}
            disabled={disableForNonManagers && currentUser.rolesMask > 2}
            onClick={() => {
              setReportUser('All Senders');
              setGroupBySender(false);
              setSenderId(null);
            }}
          >
            All Senders
          </DropdownItem>
          <DropdownItem
            active={senderId === currentUser.id}
            onClick={() => {
              setReportUser('Me');
              setGroupBySender(true);
              setSenderId(currentUser.id);
            }}
          >
            Me
          </DropdownItem>
          {senders &&
            senders.users.map((sender) => {
              if (sender.id !== currentUser.id)
                return (
                  <DropdownItem
                    active={senderId === sender.id}
                    key={sender.id}
                    disabled={
                      disableForNonManagers && currentUser.rolesMask > 2
                    }
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
    );
  };

  return {
    SendersDropdown,
    senderId,
    senders,
    loading,
    error,
    reportUser,
    groupBySender,
    setSenderId,
    setReportUser,
    setGroupBySender,
  };
};

export default useSenderList;
