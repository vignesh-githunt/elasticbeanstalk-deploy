import React, { useState } from 'react';
import USER_STORY_CONTACTS_QUERY from './queries/UserStoryContactsQuery';
// import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import { CardBody, CardHeader, Collapse } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
//import ControlledTable, { useLazyQuery } from "./Tables/ControlledTable";
//import EmailMessages from "./EmailMessages";
//import { BadgeStatus } from "./Common/constants";

import EmailMessages from './EmailMessages';

const MessageQueue = ({ user }) => {
  const [pageSize] = useState(50);
  const [selectedStoryContactId, setSelectedStoryContactId] = useState();

  const { data, loading } = useQuery(USER_STORY_CONTACTS_QUERY, {
    variables: {
      filter: {
        senderId: user.id,
      },
      limit: pageSize,
    },
    skip: !user,
  });

  if (loading) return <p>Loading Message Queue...</p>;

  // const renderRowSubComponent = React.useCallback(({ row }) => {
  //   return <EmailMessages row={row} />;
  // }, []);

  return (
    <div>
      {data.v3_Customer_StoryContacts.map((storyContact) => {
        return (
          <div className="card card-default row mb-0" key={storyContact.id}>
            <CardHeader
              onClick={() => {
                if (selectedStoryContactId !== storyContact.id)
                  setSelectedStoryContactId(storyContact.id);
                else setSelectedStoryContactId();
              }}
            >
              {storyContact.contact.givenNameValue}{' '}
              {storyContact.contact.familyNameValue} -{' '}
              {storyContact.contact.position.title} @{' '}
              {storyContact.account.nameValue}
              <div className="card-tool bg-white float-right">
                {selectedStoryContactId === storyContact.id ? (
                  <i className="fa fa-caret-down"></i>
                ) : (
                  <i className="fa fa-caret-right"></i>
                )}
              </div>
            </CardHeader>
            <Collapse isOpen={selectedStoryContactId === storyContact.id}>
              <CardBody>
                <EmailMessages emailContent={storyContact.emailContent} />{' '}
              </CardBody>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};

export default MessageQueue;
