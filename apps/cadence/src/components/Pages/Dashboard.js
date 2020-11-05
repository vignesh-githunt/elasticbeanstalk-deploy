import React, { useState } from "react";

import { ButtonDropdown, ButtonToolbar, Card, CardBody, CardHeader, CardTitle, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Table }from "reactstrap";

import { ContentWrapper, Sparkline } from "@nextaction/components";

import { default as Button } from '../Common/Button';
import PageHeader from "../Common/PageHeader";

const generateData = (count, yrange) => {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = (i + 1).toString();
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push({
      x: x,
      y: y,
    });
    i++;
  }
  return series;
};

const Dashboard = (props) => {
  const [dropdownTranslateOpen, toggleDDTranslate] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [reportUser, setReportUser] = useState("Me");
  const [reportUserOpen, setReportUserOpen] = useState(false);
  const [reportUserOpen2, setReportUserOpen2] = useState(false);
  const [timeSpan, setTimeSpan] = useState("Week");
  const [timeSpanOpen, setTimeSpanOpen] = useState(false);
  const [timeSpanOpen2, setTimeSpanOpen2] = useState(false);
  
  const series = [
    {
      name: "Metric1",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric2",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric3",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric4",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric5",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric6",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric7",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric8",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric9",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: "heatmap",
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#5d9cec"],
  };
  const splineData = [{
      "label": "Emails",
      "color": "#23b7e5",
      "data": [
        ["Jan", 70],
        ["Feb", 20],
        ["Mar", 70],
        ["Apr", 85],
        ["May", 59],
        ["Jun", 93],
        ["Jul", 66],
        ["Aug", 86],
        ["Sep", 60],
        ["Oct", 60],
        ["Nov", 12],
        ["Dec", 50]
      ]
    }, {
      "label": "Opens",
      "color": "#7266ba",
      "data": [
        ["Jan", 20],
        ["Feb", 70],
        ["Mar", 30],
        ["Apr", 50],
        ["May", 85],
        ["Jun", 43],
        ["Jul", 96],
        ["Aug", 36],
        ["Sep", 80],
        ["Oct", 10],
        ["Nov", 72],
        ["Dec", 31]
      ]
    }];

  const splineOptions = {
    series: {
      lines: {
        show: false
      },
      points: {
        show: true,
        radius: 4
      },
      splines: {
        show: true,
        tension: 0.4,
        lineWidth: 1,
        fill: 0.5
      }
    },
    grid: {
      borderColor: '#eee',
      borderWidth: 1,
      hoverable: true,
      backgroundColor: '#fcfcfc'
    },
    tooltip: true,
    tooltipOpts: {
      content: (label, x, y) => x + ' : ' + y
    },
    xaxis: {
      tickColor: '#fcfcfc',
      mode: 'categories'
    },
    yaxis: {
      min: 0,
      max: 150, // optional: use it for a clear represetation
      tickColor: '#eee',
      //position: 'right' or 'left',
      tickFormatter: v => v
    },
    shadowSize: 0
  };
  // Chart bar Stacked
  const barStackedData = [
    {
      label: "Total Connects",
      color: "#37bc9b",
      data: [
        ["Pj1", 86],
        ["Pj2", 136],
        ["Pj3", 97],
        ["Pj4", 110],
        ["Pj5", 62],
        ["Pj6", 85],
        ["Pj7", 115],
        ["Pj8", 78],
        ["Pj9", 104],
        ["Pj10", 82],
        ["Pj11", 97],
        ["Pj12", 110],
        ["Pj13", 62],
      ],
    },
    {
      label: "Positive Connects",
      color: "#58ceb1",
      data: [
        ["Pj1", 49],
        ["Pj2", 81],
        ["Pj3", 47],
        ["Pj4", 44],
        ["Pj5", 100],
        ["Pj6", 49],
        ["Pj7", 94],
        ["Pj8", 44],
        ["Pj9", 52],
        ["Pj10", 17],
        ["Pj11", 47],
        ["Pj12", 44],
        ["Pj13", 100],
      ],
    },
    {
      label: "Meeting Scheduled",
      color: "#2b957a",
      data: [
        ["Pj1", 29],
        ["Pj2", 56],
        ["Pj3", 14],
        ["Pj4", 21],
        ["Pj5", 5],
        ["Pj6", 24],
        ["Pj7", 37],
        ["Pj8", 22],
        ["Pj9", 28],
        ["Pj10", 9],
        ["Pj11", 14],
        ["Pj12", 21],
        ["Pj13", 5],
      ],
    },
  ];
    
  const barStackedOptions = {
    series: {
      stack: true,
      bars: {
        align: 'center',
        lineWidth: 0,
        show: true,
        barWidth: 0.6,
        fill: 0.9
      }
    },
    grid: {
      borderColor: '#eee',
      borderWidth: 1,
      hoverable: true,
      backgroundColor: '#fcfcfc'
    },
    tooltip: true,
    tooltipOpts: {
      content: (label, x, y) => x + ' : ' + y
    },
    xaxis: {
      tickColor: '#fcfcfc',
      mode: 'categories'
    },
    yaxis: {
      // position: 'right' or 'left'
      tickColor: '#eee'
    },
    shadowSize: 0
  }
  // PieChart contents removed
 
  //Choose Language removed

  return (
    <ContentWrapper>
      <PageHeader icon="fas fa-home" pageName="Dashboard">
          <ButtonToolbar>
            <ButtonDropdown
              isOpen={timeSpanOpen}
              toggle={() => setTimeSpanOpen(!timeSpanOpen)}
              id="timeSpan" 
            >
              <DropdownToggle caret>
                <i className="fa fa-calendar-alt mr-2 text-muted"></i>
                Last Week
              </DropdownToggle>
              <DropdownMenu>
                 <DropdownItem>Last Week</DropdownItem>
                 <DropdownItem>Last Month</DropdownItem>
                 <DropdownItem>Today</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonToolbar>
      </PageHeader>
    {/* Start Pending Emails, Calls, Others, Unassigned */}
      <Row>
        <Col xl={3} lg={4} md={6} sm={12}> 
          {/* Pending Emails */}
          <Card className="flex-row align-items-center align-items-stretch border-0">
            <Col md={4} className="d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
              <i className="fas fa-envelope fa-3x"></i>
            </Col>
            <Col md={8} className="py-3 bg-primary rounded-right">
              <div className="h2 mt-0">0</div>
              <div className="text-nowrap">PENDING EMAILS</div>
            </Col>
          </Card>
        </Col>
        <Col xl={3} lg={4} md={6} sm={12}>
          {/* Pending Calls */}
          <Card className="flex-row align-items-center align-items-stretch border-0">
            <Col md={4} className="d-flex align-items-center bg-green-dark justify-content-center rounded-left">
              <i className="fas fa-phone-alt fa-3x"></i>
            </Col>
            <Col md={8} className="py-3 bg-green rounded-right">
              <div className="h2 mt-0">18</div>
              <div className="text-nowrap">PENDING CALLS</div>
            </Col>
          </Card>
        </Col>
        <Col xl={3} lg={4} md={6} sm={12}>
          {/* Pending Texts */}
          <Card className="flex-row align-items-center align-items-stretch border-0">
            <Col md={4} className="d-flex align-items-center bg-yellow-dark justify-content-center rounded-left">
              <i class="fas fa-comments fa-3x"></i>
            </Col>
            <Col md={8} className="py-3 bg-yellow rounded-right">
              <div className="h2 mt-0">0</div>
              <div className="text-nowrap">PENDING TEXTS</div>
            </Col>
          </Card>
        </Col>
        <Col xl={3} lg={4} md={6} sm={12}> 
          {/* Pending Others */}
          <Card className="flex-row align-items-center align-items-stretch border-0">
            <Col md={4} className="d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
              <i className="fas fa-share-alt fa-3x"></i>
            </Col>
            <Col md={8} className="py-3 bg-purple rounded-right">
              <div className="h2 mt-0">9</div>
              <div className="text-nowrap">PENDING OTHER</div>
              </Col>
          </Card>
          </Col>
        <Col xl={3} lg={4} md={6} sm={12}>
          {/* Unassigned */}
          <Card className="flex-row align-items-center align-items-stretch border-0">
            <Col md={4} className="d-flex align-items-center bg-warning-dark justify-content-center rounded-left">
              <i className="fas fa-user fa-3x"></i>
            </Col>
            <Col md={8} className="py-3 bg-warning rounded-right">
              <div className="h2 mt-0">11</div>
              <div className="text-nowrap">UNASSIGNED</div>
            </Col>
          </Card>
        </Col>
      </Row>
    {/* End Pending Emails, Calls, Others, Unassigned */}

    {/* Start - Dials, Valid Connects, Talk Time */}
      <Row>
        <Col lg={6} xl={4}>
          {/* Start Dials */}
          <Card className="card-default">
            <Table striped responsive>
              <thead className="text-nowrap">
                <tr>
                  <th width="5%" className="border-top-0">
                    <i className="fa fa-phone-alt text-muted"></i>
                  </th>
                  <th width="45%" className="border-top-0 text-info">DIALS</th>
                  <th width="40%" className="border-top-0">
                    <i className="fas fa-list text-info pointer"></i>
                    <i className="fas fa-chart-bar text-primary mx-2 pointer"></i>
                    <i className="fas fa-pen text-primary pointer"></i>
                  </th>
                  <th width="10%" className="border-top-0">
                    <small className="text-muted text-bold">TOTAL</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="fa fa-star text-warning"></i>
                  </td>
                  <td colSpan="2">Brian Gibson</td>
                  <td>
                    <span className="text-primary text-bold">329</span>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="2">Korey Ferland</td>
                  <td>
                    <span className="text-primary text-bold">186</span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        {/* End Dials */}
        {/* Start Valid connects */}
        <Col lg={6} xl={4}>
          <Card className="card-default">
            <Table striped responsive>
              <thead className="text-nowrap">
                <tr>
                  <th width="5%" className="border-top-0">
                    <span className="svgicon calling text-muted"></span>
                  </th>
                  <th width="45%" className="border-top-0 text-info">VALID CONNECTS</th>
                  <th width="40%" className="border-top-0">
                    <i className="fas fa-list text-info pointer"></i>
                    <i className="fas fa-chart-bar text-primary mx-2 pointer"></i>
                    <i className="fas fa-pen text-primary text-bold pointer"></i>
                  </th>
                  <th width="10%" className="border-top-0">
                    <small className="text-muted text-bold">TOTAL</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="fa fa-star text-warning"></i>
                  </td>
                  <td colSpan="2">Patrick Morrissey</td>
                  <td>
                    <span className="text-primary text-bold">22</span>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="2">Korey Ferland</td>
                  <td>
                    <span className="text-primary text-bold">11</span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        {/* End Valid Connects*/}
        {/* Start Talk Time */}
        <Col lg={6} xl={4}>
          <Card className="card-default">
            <Table striped responsive>
              <thead className="text-nowrap">
                <tr>
                  <th width="5%" className="border-top-0">
                    <span className="svgicon talktime text-muted"></span>
                  </th>
                  <th width="45%" className="border-top-0 text-info">TALK TIME</th>
                  <th width="40%" className="border-top-0">
                    <i className="fas fa-list text-info pointer"></i>
                    <i className="fas fa-chart-bar text-primary mx-2 pointer"></i>
                    <i className="fas fa-pen text-primary text-bold pointer"></i>
                  </th>
                  <th width="10%" className="border-top-0">
                    <small className="text-muted text-bold">TOTAL</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="fa fa-star text-warning"></i>
                  </td>
                  <td colSpan="2">Anu Soundar</td>
                  <td>
                    <span className="text-primary text-bold">59</span>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="2">Korey Ferland</td>
                  <td>
                    <span className="text-primary text-bold">24</span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
        {/* End Talk Time */}
      </Row>
      {/* End - Dials, Valid Connects, Talk Time */}

     {/* Start - Overall Stats - email & call - metrics  */}
      <Row>
        <Col sm={4} className="text-muted mt-1">
          <h4><i className="fas fa-chart-bar mr-2"></i>Overall Stats</h4>
        </Col>
        <Col className="stats-txt">
          {/* Overall Stats (<strong className="text-primary">Current Month</strong>): Aug 01, 2020 (Saturday) - Aug 31(Monday) */}
          All Users, Current Month - Aug 01, 2020 (Saturday) to Aug 31, 2020 (Monday)
          <Button size="sm" className="text-muted ml-2 pt-1"><i className="fas fa-pencil-alt"></i></Button>
        </Col>
      </Row>
      <hr className="mt-0" />
    {/* End Overall Stats */}

     {/* Start - Overall Stats - Email, Call & Text - metrics  */}
      <Row>
        <Col lg={6} xl={4}>
        {/* Email Metrics */}
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="fa fa-envelope mr-2 text-muted"></i>EMAIL METRICS
              </CardTitle>
            </CardHeader>
            <Table responsive>
              <CardBody className="d-flex pt-4 pb-0">
                <div className="w-50 bb br px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="5,9,4,1,3,4,7,5"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">1329</h4>
                        <p className="mb-0 text-nowrap text-bold">
                          <i className="fa fa-share mr-2 text-muted"></i>SENT
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
                <div className="w-50 bb px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="1,8,4,3,5,6,5,8,9"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">445</h4>
                        <p className="mb-0 text-nowrap text-bold">
                          <i className="fa fa-envelope-open mr-2 text-muted"></i>OPENED
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardBody className="d-flex pt-0 pb-0">
                <div className="w-50 bb br px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="1,0,4,9,5,7,8,4,7"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">311</h4>
                        <p className="mb-0 text-nowrap text-bold">
                          <i className="fa fa-thumbs-up mr-2 text-muted"></i>CLICKED
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
                <div className="w-50 bb px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="1,5,2,2,8,4,4,8"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">38</h4>
                        <p className="mb-0 text-nowrap text-bold">
                          <i className="fa fa-reply-all mr-2 text-muted"></i>REPLIED
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardBody className="d-flex pt-0 pb-0">
              <div className="w-50 br px-3">
                <div className="d-flex align-items-center">
                  {/* Bar chart */}
                  <Sparkline
                    options={{
                      barColor: "#5d9cec",
                      height: "20",
                      barWidth: "3",
                      barSpacing: "2",
                    }}
                    values="1,0,4,9,5,7,8,4,7"
                  />
                  <div className="ml-auto">
                    <CardBody className="text-right">
                      <h4 className="mt-0 text-primary text-bold">7</h4>
                      <p className="mb-0 text-nowrap text-bold">
                        <i className="fa fa-times mr-1 text-muted"></i>BOUNCED
                      </p>
                    </CardBody>
                  </div>
                </div>
              </div>
              <div className="w-50 px-3">
                <div className="d-flex align-items-center">
                  {/* Bar chart */}
                  <Sparkline
                    options={{
                      barColor: "#5d9cec",
                      height: "20",
                      barWidth: "3",
                      barSpacing: "2",
                    }}
                    values="0,0,0,0,0,0,0,0"
                  />
                  <div className="ml-auto">
                    <CardBody className="text-right">
                      <h4 className="mt-0 text-primary text-bold">0</h4>
                      <p className="mb-0 text-nowrap text-bold">
                        <i className="fa fa-exclamation-triangle mr-2 text-muted"></i>FAILED
                      </p>
                    </CardBody>
                  </div>
                </div>
              </div>
            </CardBody>
            </Table>
          </Card>
        </Col>
        <Col lg={6} xl={4}>
        {/* Call Metrics */}
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="fa fa-phone-alt text-muted mr-2"></i>CALL METRICS
              </CardTitle>
            </CardHeader>
            <CardBody>
              {/* <FlotChart
                data={barStackedData}
                options={barStackedOptions}
                height="237px"
              /> */}
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} xl={4}>
        {/* Text Metrics */}
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="fas fa-comments text-muted mr-2"></i>TEXTS
              </CardTitle>
            </CardHeader>
            <CardBody>
              {/* <FlotChart
                data={splineData}
                options={splineOptions}
                height="237px"
              /> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* End - Overall Stats - email & call - metrics  */}
      
      {/* Start Activity Info */}
        <Row>
          <Col sm={4} className="text-muted mt-1">
            <h4><i className="fas fa-info-circle mr-2"></i>Activity Info</h4>
          </Col>
          <Col className="stats-txt">
            {/* Activity Info Stats (<strong className="text-primary">Current Month</strong>): Aug 01, 2020 (Saturday) - Aug 31(Monday)  */}
            All Users, Current Month - Aug 01, 2020 (Saturday) to Aug 31, 2020 (Monday)
            <Button size="sm" className="text-muted ml-2 pt-1"><i className="fas fa-pencil-alt"></i></Button>
          </Col>
        </Row>
        <hr className="mt-0" />
      {/* End Activity Info */}

      {/* Start - Prospects Attempted */}
        <Row>
          <Col>
            <Card className="card-default">
              <CardHeader>
                <CardTitle className="text-info">
                  <i className="fas fa-user text-muted mr-2"></i>PROSPECTS ATTEMPTED
                </CardTitle>
              </CardHeader>
              <CardBody>
                {/* <FlotChart
                  data={barStackedData}
                  options={barStackedOptions}
                  height="237px"
                /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      {/* End - Prospects Attempted */}

      {/* Start - Cadence Analytics */}
      <Row>
        <Col lg={9} md={8} >
          <Card className="card-default">
            <CardHeader>
              <div className="float-right">
                <div className="float-left mr-3 pt-2"><i className="fa fa-user mr-2 text-muted"></i>Me</div>
                <ButtonToolbar>                 
                    <DropdownToggle caret color="secondary">
                      <i className="fa fa-calendar-alt mr-2 text-muted"></i>
                      Last Week
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Last Week</DropdownItem>
                      <DropdownItem>Last Month</DropdownItem>
                      <DropdownItem>Today</DropdownItem>
                    </DropdownMenu>
                </ButtonToolbar>
              </div>
              <CardTitle className="text-info">
                <i className="fa fa-rocket mr-2 text-muted"></i>CADENCE ANALYTICS
              </CardTitle>
              </CardHeader>
              <CardBody>
                {/* <FlotChart
                  data={barStackedData}
                  options={barStackedOptions}
                  height="237px"
                /> */}
              </CardBody>
          </Card>
        </Col>
        <Col lg={3} md={4}>
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-nowrap text-info"><i className="fas fa-file-alt text-muted mr-2"></i>FUTURE TASKS</CardTitle>
            </CardHeader>
            <CardBody className="text-center">
              <div className="text-md m-0 text-primary text-bold">478</div>
              <div className="text-bold"><i className="far fa-circle mr-2 text-muted"></i>Total Connects</div>
            </CardBody>
            <CardBody className="text-center">
              <div className="text-md m-0 text-primary text-bold">33</div>
              <div className="text-bold text-nowrap"><i className="fas fa-check-double mr-2 text-muted"></i>Positive Connects</div>
            </CardBody>
            <CardBody className="text-center">
              <div className="text-md m-0 text-primary text-bold">18</div>
              <div className="text-bold text-nowrap"><i className="fas fa-calendar-alt mr-2 text-muted"></i>Meeting Scheduled</div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* End - Cadence Analytics */}

      {/* Start - Activity Info - email & call - metrics  */}
      <Row>
        <Col lg={6} xl={4}>
        {/* Call Metrics */}
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="fa fa-phone-alt text-muted mr-2"></i>CALL METRICS
              </CardTitle>
            </CardHeader>
            <CardBody>
              {/* <FlotChart
                data={barStackedData}
                options={barStackedOptions}
                height="237px"
              /> */}
            </CardBody>
          </Card>
        </Col>
        <Col lg={6} xl={4}>
        {/* Email Metrics */}
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="fa fa-envelope mr-2 text-muted"></i>EMAIL METRICS
              </CardTitle>
            </CardHeader>
            <Table responsive>
              <CardBody className="d-flex pt-4 pb-0">
                <div className="w-50 bb br px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="5,9,4,1,3,4,7,5"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">1329</h4>
                        <p className="mb-0 text-muted text-nowrap">
                          <i className="fa fa-share mr-2"></i>SENT
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
                <div className="w-50 bb px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="1,8,4,3,5,6,5,8,9"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">445</h4>
                        <p className="mb-0 text-muted text-nowrap">
                          <i className="fa fa-envelope-open mr-2"></i>OPENED
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardBody className="d-flex pt-0 pb-0">
                <div className="w-50 bb br px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="1,0,4,9,5,7,8,4,7"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">311</h4>
                        <p className="mb-0 text-muted text-nowrap">
                          <i className="fa fa-thumbs-up mr-2"></i>CLICKED
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
                <div className="w-50 bb px-3">
                  <div className="d-flex align-items-center">
                    {/* Bar chart */}
                    <Sparkline
                      options={{
                        barColor: "#5d9cec",
                        height: "20",
                        barWidth: "3",
                        barSpacing: "2",
                      }}
                      values="1,5,2,2,8,4,4,8"
                    />
                    <div className="ml-auto">
                      <CardBody className="text-right">
                        <h4 className="mt-0 text-primary text-bold">38</h4>
                        <p className="mb-0 text-muted text-nowrap">
                          <i className="fa fa-reply-all mr-2"></i>REPLIED
                        </p>
                      </CardBody>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardBody className="d-flex pt-0 pb-0">
              <div className="w-50 br px-3">
                <div className="d-flex align-items-center">
                  {/* Bar chart */}
                  <Sparkline
                    options={{
                      barColor: "#5d9cec",
                      height: "20",
                      barWidth: "3",
                      barSpacing: "2",
                    }}
                    values="1,0,4,9,5,7,8,4,7"
                  />
                  <div className="ml-auto">
                    <CardBody className="text-right">
                      <h4 className="mt-0 text-primary text-bold">7</h4>
                      <p className="mb-0 text-muted text-nowrap">
                        <i className="fa fa-times mr-1"></i>BOUNCED
                      </p>
                    </CardBody>
                  </div>
                </div>
              </div>
              <div className="w-50 px-3">
                <div className="d-flex align-items-center">
                  {/* Bar chart */}
                  <Sparkline
                    options={{
                      barColor: "#5d9cec",
                      height: "20",
                      barWidth: "3",
                      barSpacing: "2",
                    }}
                    values="0,0,0,0,0,0,0,0"
                  />
                  <div className="ml-auto">
                    <CardBody className="text-right">
                      <h4 className="mt-0 text-primary text-bold">0</h4>
                      <p className="mb-0 text-muted text-nowrap">
                        <i className="fa fa-exclamation-triangle mr-2"></i>FAILED
                      </p>
                    </CardBody>
                  </div>
                </div>
              </div>
            </CardBody>
            </Table>
          </Card>
        </Col>
        <Col lg={6} xl={4}>
        {/* Texts */}
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="fas fa-comments text-muted mr-2"></i>TEXTS
              </CardTitle>
            </CardHeader>
            <CardBody>
              {/* <FlotChart
                data={splineData}
                options={splineOptions}
                height="237px"
              /> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* End - Activity Info - email & call - metrics  */}

      {/* Start - Future Tasks */}
      <Row>
        <Col>
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="fa fa-file-alt text-muted mr-2"></i>FUTURE TASKS
              </CardTitle>
            </CardHeader>
            <CardBody>
              {/* <FlotChart
                data={barStackedData}
                options={barStackedOptions}
                height="237px"
              /> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    {/* End - Future Tasks */}

    {/* Start - Activity Metrics */}
      <Row>
        <Col lg={12}>
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="far fa-chart-bar text-muted mr-2"></i>ACTIVITY METRICS
              </CardTitle>
            </CardHeader>
            <CardBody>
            {/* <FlotChart
                data={splineData}
                options={splineOptions}
                height="417px"
              /> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    {/* End - Activity Metrics */}

    {/* Start - Best time of the day */}
      <Row>
        <Col lg={12}>
          <Card className="card-default">
            <CardHeader>
              <CardTitle className="text-info">
                <i className="far fa-clock text-muted mr-2"></i>BEST TIME OF THE DAY
              </CardTitle>
            </CardHeader>
            <CardBody>
            {/* <FlotChart
                data={splineData}
                options={splineOptions}
                height="417px"
              /> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* End - Best time of the day */}
     
    </ContentWrapper>
  );
};

export default Dashboard;
