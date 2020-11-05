import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { PersonQuery } from '../queries/PersonQuery';
import ContactDetails from '../ContactDetails';
import PropTypes from 'prop-types';
import PageLoader from "../Common/PageLoader";

const ContactDetailsWithData = PersonQuery(ContactDetails)

class Contact extends Component {

  static propTypes = {
    account: PropTypes.object,
  }

  render() {
    if (this.props.loading) return <PageLoader />
      return (
        <ContentWrapper>
          <div className="content-heading">
            <div>Contact Details</div>
          </div>
          <Row>
            <Col xl={ 12 }>
              <Card className="card-default">
                <CardBody>
                  <ContactDetailsWithData contactId={this.props.match.params.id} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ContentWrapper>
      );
  }
}

export default withTranslation('translations')(Contact);
