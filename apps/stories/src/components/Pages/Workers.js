import React from "react";
import {connect} from 'react-redux'
import ContentWrapper from "../Layout/ContentWrapper";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "reactstrap";
import { useQuery } from "@apollo/react-hooks";
import CustomerAccountCreation from '../CustomerAccountCreation'
import CustomerContactCreation from '../CustomerContactCreation'
import CustomerContactResearchersCreation from "../CustomerContactResearchersCreation";
import CustomerContactResearchRunner from "../CustomerContactResearchRunner";
import CustomerStoryRunner from "../CustomerStoryRunner";
import { CUSTOMER_JOBS_QUERY, JOBS_COUNT } from "../queries/JobsQuery";
import JobsList from "../JobsList";

const Workers = ({customerId, customerName}) => {
  const {
    data,
    loading,
  } = useQuery(CUSTOMER_JOBS_QUERY, {
    variables: { customerId: customerId },
    skip: !customerId,
  });

  const {
    data: countData,
    loading: countLoading,
  } = useQuery(JOBS_COUNT, {
    variables: { customerId: customerId },
    skip: !customerId
  });

  if (!customerId)
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>
            Workers Admin
            <small>
              Start background workers manually and manage the platform
            </small>
          </div>
        </div>
        <Row>
          <Col>You have to select a customer before starting any workers!</Col>
        </Row>
      </ContentWrapper>
    );

  if (loading)
    return null

  if (countLoading)
    return null
  
  const { jobs } = data;
  const { _jobsMeta: jobsCount } = countData
      

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          Workers Admin
          <small>
            Start background workers manually and manage the platform
          </small>
        </div>
      </div>
      <Row>
        <Col xl={4}>
          <CustomerAccountCreation customerId={customerId} />
        </Col>
        <Col xl={4}>
          <CustomerContactCreation customerId={customerId} />
        </Col>
        <Col xl={4}>
          <CustomerContactResearchersCreation customerId={customerId} />
        </Col>
      </Row>
      <Row className={"mt-3"}>
        <Col xl={4}>
          <CustomerContactResearchRunner customerId={customerId} />
        </Col>
        <Col xl={4}>
          <CustomerStoryRunner customerId={customerId} />
        </Col>
        <Col>{/* <CustomerContactCreation customerId={customerId} /> */}</Col>
        <Col>
          {/* <CustomerContactResearchersCreation customerId={customerId} /> */}
        </Col>
      </Row>
      <Row className={"mt-3"}>
        <Col>
          <Card className="card-default">
            <CardHeader>
              <CardTitle>Jobs</CardTitle>
            </CardHeader>
            <CardBody>
              <JobsList jobs={jobs} total={jobsCount.count} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );
}

const mapStateToProps = (state) => ({
  customerId: state.customer.id,
  customerName: state.customer.name
});

export default connect(mapStateToProps)(Workers);

