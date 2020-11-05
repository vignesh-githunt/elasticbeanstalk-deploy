import React, { useContext } from 'react';
import Header from '../Layout/Header';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import UserContext from '../UserContext';
import MessageQueue from '../MessageQueue';

const MessageQueuePage = (props) => {
  const { user, loading: userLoading } = useContext(UserContext);

  if (userLoading) return <p>Fetching the user</p>;

  return (
    <React.Fragment>
      <Header parentElement={props.parentElement} toggle={props.toggle} />
      <ContentWrapper>
        <div className="content-heading">
          <div>Message Queue</div>
        </div>
        <Row>
          <Col>
            <MessageQueue user={user} />
          </Col>
        </Row>
      </ContentWrapper>
    </React.Fragment>
  );
};

export default MessageQueuePage;
