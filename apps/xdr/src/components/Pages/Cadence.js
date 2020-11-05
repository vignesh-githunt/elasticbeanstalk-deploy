import React from "react";
import Header from '../Layout/Header';
import ContentWrapper from "../Layout/ContentWrapper";
import { Row, Col } from 'reactstrap';

const Cadence = (props) => {
  return (
    <React.Fragment>
      <Header parentElement={props.parentElement} toggle={props.toggle} />
      <ContentWrapper>
        <div className="content-heading">
          <div>Cadence</div>
        </div>
        <Row>
          <Col>Content here</Col>
        </Row>
      </ContentWrapper>
    </React.Fragment>
  );
}

export default Cadence