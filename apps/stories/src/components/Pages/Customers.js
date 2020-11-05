import React from 'react';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks'
import CUSTOMERSQUERYSTRING from "../queries/CustomersQuery";
import CustomersList from '../CustomersList';
import CustomerEditor from '../CustomerEditor'

//const CustomersListWithData = CustomersQuery(CustomersList);

const Customers = () => {
    const {
      data: { companies: customers },
      loading,
    } = useQuery(CUSTOMERSQUERYSTRING);

    if(loading)
      return null;

    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Customers</div>
        </div>
        <Row>
          <Col xl={12}>
            <Card className="card-default">
              <CardHeader>
                <div className="float-right">
                  <CustomerEditor />
                </div>
                <CardTitle>Customers</CardTitle>
              </CardHeader>
              <CardBody>
                <CustomersList customers={customers} loading={loading}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ContentWrapper>
    );
}

export default withTranslation('translations')(Customers);
