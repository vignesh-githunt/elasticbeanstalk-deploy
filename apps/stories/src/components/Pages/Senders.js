import React, { useContext } from "react";
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { connect } from "react-redux";
import PageLoader from '../Common/PageLoader';
import SenderEditor from '../SenderEditor';
import UserContext from "../UserContext";
import useSendersDataTable from "../hooks/useSendersDataTable"

const Senders = ({ customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const { SendersDataTable } = useSendersDataTable(customerId, user, userLoading)

  if (userLoading) return <PageLoader />;

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>Senders</div>
      </div>
      <Row>
        <Col xl={12}>
          <Card className="card-default">
            <CardHeader>
              <div className="float-right">
                <SenderEditor customerId={customerId || user.companyId} />
              </div>
              <CardTitle>Senders</CardTitle>
            </CardHeader>
            <CardBody>
              <SendersDataTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );

}
const mapStateToProps = (state) => ({ customerId: state.customer.id});
export default withTranslation('translations')(
  connect(mapStateToProps)(Senders)
);
