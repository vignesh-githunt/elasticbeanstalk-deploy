import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PageLoader from './Common/PageLoader';
import { Row, Col, Table } from 'reactstrap';
import DataPoint from './DataPoint';

export default class ContactDetails extends Component {

  static propTypes = {
    contact: PropTypes.object,
  }

  render() {

    if (this.props.loading) return <PageLoader />

    var contactPoints = { ...this.props.contact };
    delete contactPoints.id;
    delete contactPoints.__typename;
    return <Row>
            <Col xs={12}>
              <Table striped bordered hover responsive>
                <tbody>
                  {Object.keys(contactPoints).map(dp_name => {
                    return <DataPoint key={dp_name} dataPoints={contactPoints[dp_name]} />
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
  }
}
