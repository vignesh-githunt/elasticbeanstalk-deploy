import React, { useState } from 'react';
import Header from '../Layout/Header';
import { ContentWrapper } from '@koncert/shared-components';
import { Row } from 'reactstrap';
import StoryJournalGraph from '../Stories/StoryJournalGraph';

const Dashboard = (props) => {
  const [format] = useState('day');
  const [startDate] = useState(new Date('2020-08-01'));
  const [endDate] = useState(new Date());

  return (
    <React.Fragment>
      <Header parentElement={props.parentElement} toggle={props.toggle} />
      <ContentWrapper>
        <div className="content-heading">
          <div>Dashboard</div>
        </div>
        <Row>
          <div className="col-xl-3 col-md-6">
            {/* START widget */}
            <StoryJournalGraph
              bgColorClass="bg-color-ocean-light"
              color={'084f89'}
              title="Contacts Identified"
              event="contact_identified"
              format={format}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </Row>
      </ContentWrapper>
    </React.Fragment>
  );
};

export default Dashboard;
