import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { AccountDataQuery } from '../queries/AccountDataQuery';
import AccountDetails from '../AccountDetails';
import PropTypes from 'prop-types';
import PageLoader from '../Common/PageLoader';

const AccountDetailsWithData = AccountDataQuery(AccountDetails)

class Account extends Component {

  static propTypes = {
    account: PropTypes.object,
  }

  render() {
    if (this.props.loading) return <PageLoader />
      return (
        <ContentWrapper>
          <div className="content-heading">
            <div>Account Details</div>
          </div>
          <Row>
            <Col xl={ 12 }>
              <Card className="card-default">
                <CardBody>
                  <AccountDetailsWithData accountId={this.props.match.params.id} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ContentWrapper>
      );
  }
}

export default withTranslation('translations')(Account);
