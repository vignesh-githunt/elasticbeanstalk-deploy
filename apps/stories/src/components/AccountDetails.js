import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PageLoader from './Common/PageLoader';
import { Row, Col, Table } from 'reactstrap';
import DataPoint from './DataPoint';

export default class AccountDetails extends Component {

  static propTypes = {
    account: PropTypes.object,
  }

  render() {

    if (this.props.loading) return <PageLoader />

    var accountDataPoints = { ...this.props.account };
    delete accountDataPoints.id;
    delete accountDataPoints.__typename;
    return <Row>
            <Col xs={12}>
              <Table striped bordered hover responsive>
                <tbody>
                  {Object.keys(accountDataPoints).map(dp_name => {
                    return <DataPoint key={dp_name} dataPoints={accountDataPoints[dp_name]} />
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
  }
}
