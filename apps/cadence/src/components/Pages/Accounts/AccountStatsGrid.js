import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Collapse, Row } from "reactstrap";
import AccountCadencesGrid from './AccountCadencesGrid';
import AccountProspectsGrid from './AccountProspectsGrid';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const HandOverButton = (props) => {
  return (
    <Button {...props}>
      <i className={`fas fa-${props.title} fa-lg text-primary`}></i>
    </Button>
  );
};

function EmailTemplatesRow({ row, rowKey }) {
  const [showCell, setShowCell] = useState(true);

  return (
    <tr
      {...row.getRowProps()}
      onMouseOver={() => setShowCell(!showCell)}
      onMouseOut={() => setShowCell(!showCell)}
      key={rowKey}
    >
      {row.cells.map((cell, i) => {
        return (
          <td
            key={i}
            style={
              ["Last Activity"].indexOf(cell.column.Header) !== -1
                ? { display: showCell ? "" : "none" }
                : {}
            }
          >
            {cell.render("Cell")}
          </td>
        );
      })}
      <td
        {...row.getRowProps()}
        className="text-center pb-0 pt-0"
        style={{ display: showCell ? "none" : "", verticalAlign: "middle" }}
        colSpan="3"
      >
        <HandOverButton title="edit" />
        <HandOverButton title="clone" />
        <HandOverButton title="trash" />
      </td>
    </tr>
  );
}

function AccountStatsGrid({
  cadenceGridData,
  cadencesData,
  prospectGridData,
  prospectsData,
  templatesData,
  fetchData,
  loading,
  error,
  pageCount: controlledPageCount,
  pageSize: controlledPageSize,
  currentPageIndex,
}) {

  const [isCadenceOpen, setIsCadenceOpen] = useState(false);
  const [isProspectOpen, setIsProspectOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const cadence = () => setIsCadenceOpen(!isCadenceOpen);
  const prospect = () => setIsProspectOpen(!isProspectOpen);
  const call = () => setIsCallOpen(!isCallOpen);
  const email = () => setIsEmailOpen(!isEmailOpen);

  let tableId = "Stats_table";

  return (
    <>
      <Row className="pt-4">
        <Col>
          <Card className="card-default">
            <CardHeader>
              <CardTitle>
                Cadences
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs={2} onClick={cadence}>
                  <div>Total</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={cadence}>
                  <div>Active</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={cadence}>
                  <div>Inactive</div>
                  <br />
                  0
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}></Col>
      </Row>
      <Collapse isOpen={isCadenceOpen}>
        <AccountCadencesGrid
          data={cadenceGridData}
          cadencesData={cadencesData} />
      </Collapse>
      <Row className="pt-4">
        <Col>
          <Card className="card-default">
            <CardHeader>
              <CardTitle>
                Prospects
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs={2} onClick={prospect}>
                  <div>Total</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={prospect}>
                  <div>Assigned</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={prospect}>
                  <div>Unassigned</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={prospect}>
                  <div>Paused</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={prospect}>
                  <div>Completed</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={prospect}>
                  <div>Pending</div>
                  <br />
                  0
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}></Col>
      </Row>
      <Collapse isOpen={isProspectOpen}>
        <AccountProspectsGrid
          data={prospectGridData}
          prospectsData={prospectsData} />
      </Collapse>
      <Row className="pt-4">
        <Col>
          <Card className="card-default">
            <CardHeader>
              <CardTitle>
                Calls
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs={2} onClick={call}>
                  <div>Total</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={call}>
                  <div>Positive Outcomes</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={call}>
                  <div>Bad Data</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={call}>
                  <div>Others</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={call}>
                  <div>Pending</div>
                  <br />
                  0
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}></Col>
      </Row>
      <Collapse isOpen={isCallOpen}>
        <AccountProspectsGrid
          data={prospectGridData}
          prospectsData={prospectsData} />
      </Collapse>
      <Row className="pt-4">
        <Col>
          <Card className="card-default">
            <CardHeader>
              <CardTitle>
                Emails
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs={2} onClick={email}>
                  <div>Total</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Sent</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Opened</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Clicked</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Replied</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Pending</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Bounced</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Failed</div>
                  <br />
                  0
                </Col>
                <Col xs={2} onClick={email}>
                  <div>Opt out</div>
                  <br />
                  0
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}></Col>
      </Row>
      <Collapse isOpen={isEmailOpen}>
        <AccountProspectsGrid
          data={prospectGridData}
          prospectsData={prospectsData} />
      </Collapse>
    </>
  );
}

export default AccountStatsGrid;