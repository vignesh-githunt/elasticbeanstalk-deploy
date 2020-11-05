import React,{useState} from "react";
import {Alert, Card, CardBody, CardHeader, Col, Collapse, Form, FormGroup, Input, Label, Row} from "reactstrap";
import { ContentWrapper } from "@nextaction/components";
import { default as ClButton } from "../../Common/Button";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import PageHeader from "../../Common/PageHeader";
import ReportGrid from './ReportGrid'
import SaveReportModal from "./SaveReportModal"

const Reports =()=>{

    const formRef = React.useRef();

    const [daterange, setDaterange] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [cadences, setcadences] = useState([])
    const [users,setUsers]=useState([])
    const [userDisplay,setUserDisplay]=useState(false)
    const [isOpenUser, setIsOpenUser] = useState(false);
    const [isOpenProspects, setIsOpenProspects] = useState(false);
    const [isOpenTouch, setIsOpenTouch] = useState(false);
    const [isOpenEmail, setIsOpenEmail] = useState(false);
    const [isOpenCall, setIsOpenCall] = useState(false);
   
    const [chartUser, setchartUser] = useState(false)
    const [chartProspects, setchartProspects] = useState(false)
    const [chartTouch, setchartTouch] = useState(false)
    const [chartEmail, setchartEmail] = useState(false)
    const [chartCall, setchartCall] = useState(false)

    const [saveReport, setsaveReport] = useState('')
    const [modalTitle, setModalTitle] = useState();
    const [showAddTagModal, setShowAddTagModal] = useState(false);

    const [visible, setVisible] = useState(false);

    const onDismiss = () => setVisible(false);
  
    const togglerchartUser = () =>{setchartUser(!chartUser)}
    const togglerchartProspects = () =>{setchartProspects(!chartProspects)}
    const togglerchartTouch = () =>{setchartTouch(!chartTouch)}
    const togglerchartEmail = () =>{setchartEmail(!chartEmail)}
    const togglerchartCall = () =>{setchartCall(!chartCall)}

    const toggleUser = () => setIsOpenUser(!isOpenUser);
    const toggleProspects = () => setIsOpenProspects(!isOpenProspects);
    const toggleTouch = () => setIsOpenTouch(!isOpenTouch);
    const toggleEmail = () => setIsOpenEmail(!isOpenEmail);
    const toggleCall = () => setIsOpenCall(!isOpenCall);

    const expandAllHandler = ()=>{
        setIsOpenUser(!isOpenUser);
        setIsOpenProspects(!isOpenProspects);
        setIsOpenTouch(!isOpenTouch);
        setIsOpenEmail(!isOpenEmail);
        setIsOpenCall(!isOpenCall);
        }
  
    const barStackedData = [
      {
        label: "Attempted",
        color: "#37bc9b",
        data: [
          ["Lipton", 12],
          ["Smith", 10],
          ["Alex", 18],
        ],
      },
      {
        label: "Interested",
        color: "#20DAEB ",
        data: [
          ["Lipton", 5],
          ["Smith", 2],
          ["Alex", 8],
        ],
      },
      {
        label: "Not Interested",
        color: "#EB5720 ",
        data: [
          ["Lipton", 0],
          ["Smith", 0],
          ["Alex", 1],
        ],
      },
      {
        label: "Bad data",
        color: "#821464 ",
        data: [
          ["Lipton", 0],
          ["Smith", 0],
          ["Alex", 0],
        ],
      },
      {
        label: "Do not Contact",
        color: "#3618D5 ",
        data: [
          ["Lipton", 0],
          ["Smith", 0],
          ["Alex", 1],
        ],
      },
      {
        label: "Opt-Out",
        color: "#7611EC ",
        data: [
          ["Lipton", 0],
          ["Smith", 0],
          ["Alex", 0],
        ],
      },
      {
        label: "Replied",
        color: "#CFEC11 ",
        data: [
          ["Lipton", 0],
          ["Smith", 1],
          ["Alex", 2],
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
    const UserColumns = React.useMemo(
        () => [        
            {
              Header: "User Name",
              accessor: "User",
              width:"20%",
              Cell: function (props) {
                return (
                    <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                        </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Prospects Added",
              accessor: "Prospects",
              width:"20%",
              Cell: function (props) {
                return (            
                    <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                          <p className="mb-0 text-muted">
                            Prospects Added
                          </p>
                        </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Assigned",
              accessor: "Assigned",
              width:"20%",
              Cell: function (props) {
                return (
                    <CardBody className="d-flex pt-4 pb-0">
                      <div className="ml-auto">
                        <h4 className="mt-0">{props.value}</h4>
                        <p className="mb-0 text-muted">
                          Assigned
                        </p>
                      </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Call Made",
              accessor: "Call",
              width:"20%",
              Cell: function (props) { 
                return (
                    <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                          <p className="mb-0 text-muted">
                            Calls Made
                          </p>
                        </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Email Sent",
              accessor: "Emails",
              width:"20%",
              Cell: function (props) {
                return (            
                    <CardBody className="d-flex pt-4 pb-0">
                      <div className="ml-auto">
                        <h4 className="mt-0">{props.value}</h4>
                        <p className="mb-0 text-muted">
                          Emails Sent
                        </p>
                      </div>
                    </CardBody>
                );
              }
            }
          ]
      );
    
      const UserData = [
        {
            User: "Lipton",
            Prospects: "90",
            Assigned: "152",
            Call: "75",
            Emails: "36"
          },
          {
            User: "smith",
            Prospects: "45",
            Assigned: "113",
            Call: "85",
            Emails: "31"
          },
      ];
      const ProspectsColumns = React.useMemo(
        () => [        
            {
              Header: "User Name",
              accessor: "User",
              width:"20%",
              Cell: function (props) {
                return (
                    <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                        </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Attempted",
              accessor: "Attempted",
              width:"20%",
              Cell: function (props) {
                return (            
                    <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                          <p className="mb-0 text-muted">
                            Attempted
                          </p>
                        </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Interested",
              accessor: "Interested",
              width:"20%",
              Cell: function (props) {
                return (
                    <CardBody className="d-flex pt-4 pb-0">
                      <div className="ml-auto">
                        <h4 className="mt-0">{props.value}</h4>
                        <p className="mb-0 text-muted">
                          Interested
                        </p>
                      </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Not Interested",
              accessor: "NotInterested",
              width:"20%",
              Cell: function (props) { 
                return (
                    <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                          <p className="mb-0 text-muted">
                            Not Interested
                          </p>
                        </div>
                    </CardBody>
                );
              }
            },
            {
              Header: "Bad Data",
              accessor: "BadData",
              width:"20%",
              Cell: function (props) {
                return (            
                    <CardBody className="d-flex pt-4 pb-0">
                      <div className="ml-auto">
                        <h4 className="mt-0">{props.value}</h4>
                        <p className="mb-0 text-muted">
                          Bad Data
                        </p>
                      </div>
                    </CardBody>
                );
              }
            },
            {
                Header: "Do Not Contact",
                accessor: "DoNotContact",
                width:"20%",
                Cell: function (props) {
                  return (            
                      <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                          <p className="mb-0 text-muted">
                            Do Not Contact
                          </p>
                        </div>
                      </CardBody>
                  );
                }
              },
              {
                Header: "Opt-Out",
                accessor: "OptOut",
                width:"20%",
                Cell: function (props) {
                  return (            
                      <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                          <p className="mb-0 text-muted">
                            Opt-Out
                          </p>
                        </div>
                      </CardBody>
                  );
                }
              },
              {
                Header: "Replied",
                accessor: "Replied",
                width:"20%",
                Cell: function (props) {
                  return (            
                      <CardBody className="d-flex pt-4 pb-0">
                        <div className="ml-auto">
                          <h4 className="mt-0">{props.value}</h4>
                          <p className="mb-0 text-muted">
                            Replied
                          </p>
                        </div>
                       </CardBody>
                  );
                }
              }
          ]
      );
      const ProspecctsData = [
        {
            User: "Lipton",
            Attempted: "10",
            Interested: "2",
            NotInterested: "0",
            BadData: "11",
            DoNotContact: "0",
            OptOut: "0",
            Replied: "0",
          },
          {
            User: "Smith",
            Attempted: "8",
            Interested: "1",
            NotInterested: "0",
            BadData: "5",
            DoNotContact: "0",
            OptOut: "0",
            Replied: "1",
          },
         
      ];
     
    const { handleSubmit, register,getValues,setValue,reset, errors } = useForm();

    const searchFormSubmit= (e) =>{
        if(daterange==='Custom'&& Date.parse(start)>Date.parse(end))
        {
          setVisible(true)
        }
        else{
          const Data = getValues();
          expandAllHandler();
        }
      }
    
    const saved_report1={date_range: "Custom", start: "2020-08-20", end: "2020-08-27", cadences: "cadences3", users: "users3"}
    const saved_report2={date_range: "Today", start: null, end: null, cadences: "cadences2", users: "users1"}

    const savedReportHandler=(e)=>{
        if(e.target.value=='report1'){
            reset(saved_report1)
            setsaveReport('report1')
        }
        else{
            reset(saved_report2)
            setsaveReport('report2')
        }
      }

    return(
        <ContentWrapper>
            <PageHeader icon="fas fa-chart-bar" pageName="Reports">
              <div className="ml-auto">
                  <ClButton icon="fas fa-file-csv text-primary" className="mr-2" title="Export to CSV">Export to CSV</ClButton>
                  <ClButton icon="fas fa-file-excel text-primary" title="Export to excel">Export to Excel</ClButton>
              </div>
            </PageHeader>
            <Row >
                  <Col xl={4}>
                    <Card className="card-default">
                        <CardBody>
                          <Form onSubmit={handleSubmit(searchFormSubmit)} innerRef={formRef}>
                              <FormGroup>
                                <Label for="date_range">Date Range</Label>
                                <Input type="select" name="date_range" id="date_range" onChange={(e)=>{setDaterange(e.target.value)}} invalid={errors.date_range} innerRef={register({ required: "Please select Date range" })}>
                                    <option></option>
                                    <option value="Today">Today</option>
                                    <option value="Yesterday">Yesterday</option>
                                    <option value="Current Week">Current Week</option>
                                    <option value="Last Week">Last Week</option>
                                    <option value="Current Month">Current Month</option>
                                    <option value="Last Month">Last Month</option>
                                    <option value="Current Quater">Current Quater</option>
                                    <option value="Last Quater">Last Quater</option>
                                    <option value="Custom">Custom</option>
                                </Input>
                                <ErrorMessage errors={errors} name="date_range" className="invalid-feedback" as="p" />
                              </FormGroup>
                              
                              <Row form>
                              <Col md={6}>
                                  <FormGroup>
                                    <Label for="start">Start</Label>
                                    <Input type="date" name="start" id="start"  onChange={(e)=>{setStart(e.target.value)}} invalid={errors.start} innerRef={register({required:daterange==="Custom"? "Please select the Start date":false})} disabled={daterange==="Custom"?false:true}/>
                                    <ErrorMessage errors={errors} name="start" className="invalid-feedback" as="p" />
                                  </FormGroup>
                              </Col>
                              <Col md={6}>
                                  <FormGroup>
                                    <Label for="end">End</Label>
                                    <Input type="date" name="end" id="end" onChange={(e)=>{setEnd(e.target.value)}} invalid={errors.end} innerRef={register({required:daterange==="Custom"? "Please select the End date":false})} disabled={daterange==="Custom"?false:true}/> 
                                    <ErrorMessage errors={errors} name="end" className="invalid-feedback" as="p" />
                                  </FormGroup>
                                  
                              </Col>
                              </Row>
                              <Alert color="warning" isOpen={visible} toggle={onDismiss}>
                                Please select the valid End date
                              </Alert>
                              <FormGroup>
                                <Label for="cadences">Cadences</Label>
                                <Input type="select" name="cadences" id="cadences"  onChange={(e)=>{setcadences(e.target.value)}} invalid={errors.cadences} innerRef={register({ required: "Please select the Cadences" })} >
                                    <option></option>
                                    <option value="cadences1">cadences1</option>
                                    <option value="cadences2">cadences2</option>
                                    <option value="cadences3">cadences3</option>
                                </Input>
                                <ErrorMessage errors={errors} name="cadences" className="invalid-feedback" as="p" />
                              </FormGroup>

                              <FormGroup>
                                <Label for="users">Users</Label>
                                <Input type="select" name="users" id="users" onChange={(e)=>{setUsers(e.target.value)}} invalid={errors.users} innerRef={register({ required: "Please select the User" })} >
                                  <option></option>
                                  <option value="users1">users1</option>
                                  <option value="users2">users2</option>
                                  <option value="users3">users3</option>
                                </Input>
                                <ErrorMessage errors={errors} name="users" className="invalid-feedback" as="p" />
                              </FormGroup>

                              <FormGroup>
                                <Label for="saved_report">Saved Report</Label>
                                <Input type="select" name="saved_report" id="saved_report" value={saveReport} onChange={savedReportHandler} invalid={errors.saved_report} innerRef={register} >
                                  <option></option>
                                  <option value="report1">report1</option>
                                  <option value="report2">report2</option>
                                </Input>
                                <ErrorMessage errors={errors} name="saved_report" className="invalid-feedback" as="p" />
                              </FormGroup>

                              <FormGroup check>
                                <Input type="checkbox" name="user_display" id="user_display" onClick={() => { setUserDisplay(!userDisplay); setValue("user_display", true)}} ref={register} />
                                <Label for="user_display">Display by each user</Label>
                              </FormGroup>
                              
                              <Row>
                                  <Col md={4}>
                                    <ClButton  icon="fa fa-search" color="success" title="Search">Search</ClButton>
                                  </Col>

                                  <Col md={4}>
                                    <ClButton icon="fas fa-check" color="primary" title="Save as" onClick={() => {
                                      setModalTitle('Save Report')
                                      setShowAddTagModal(true)}}>
                                      Save As
                                    </ClButton>
                                  </Col>

                                  <Col md={4}>
                                    <ClButton onClick={reset} icon="fas fa-sync-alt" color="secondary" title="Reset">Reset</ClButton>
                                  </Col>
                              </Row>
                          </Form>
                        </CardBody>
                        <SaveReportModal
                          hideModal={() => { setShowAddTagModal(false) }}
                          showModal={showAddTagModal}
                          title={modalTitle}
                        />
                    </Card>
                    </Col>
                    <Col xl={8}>
                      <Card className="card-default">
                        <CardHeader></CardHeader>
                          <CardBody>
                              <Card className="b card-default">
                                  <CardHeader className="border-bottom">
                                    <i className={isOpenUser?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenUser?"Collapse":"Expand"} onClick={toggleUser}></i>
                                    <i className="fa fa-user mr-2"></i>
                                    <strong>Users</strong>
                                    <div className="card-tool float-right">
                                      <i className="far fa-chart-bar" title="Chart" onClick={togglerchartUser}></i>
                                    </div>
                                      
                                  </CardHeader>
                                  <Collapse isOpen={isOpenUser}>
                                      <Card>
                                        <CardBody className="d-flex pt-4 pb-0">
                                        {/* {chartUser===true?<FlotChart
                                          data={barStackedData}
                                          options={barStackedOptions}
                                          height="437px" width="750px"/> :<ReportGrid columns={UserColumns} data={UserData} />} */}
                                        </CardBody>
                                      </Card>
                                  </Collapse>
                              </Card>
                            
                              <Card className="b">
                                  <CardHeader className="border-bottom">
                                    <i className={isOpenProspects?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenProspects?"Collapse":"Expand"} onClick={toggleProspects}></i>
                                    <i className="fa fa-address-book mr-2"></i>
                                    <strong>Prospects</strong>
                                    <div className="card-tool float-right">
                                      <i className="far fa-chart-bar" title="Chart" onClick={togglerchartProspects}></i>
                                    </div>
                                      
                                  </CardHeader>
                                  <Collapse isOpen={isOpenProspects}>
                                      <Card>
                                        <CardBody className="d-flex pt-4 pb-0">
                                        {/* {chartProspects===true?<FlotChart
                                          data={barStackedData}
                                          options={barStackedOptions}
                                          height="437px" width="750px"/> :<ReportGrid columns={ProspectsColumns} data={ProspecctsData} />} */}
                                        </CardBody>
                                      </Card>
                                  </Collapse>
                              </Card>

                              <Card className="b card-default">
                                  <CardHeader className="border-bottom">
                                    <i className={isOpenTouch?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenTouch?"Collapse":"Expand"} onClick={toggleTouch}></i>
                                    <i className="fas fa-hand-point-up mr-2"></i>
                                    <strong>Touch</strong>
                                    <div className="card-tool float-right">
                                      <i className="far fa-chart-bar" title="Chart" onClick={togglerchartTouch}></i>
                                    </div>
                                      
                                  </CardHeader>
                                  <Collapse isOpen={isOpenTouch}>
                                      <Card>
                                        <CardBody className="d-flex pt-4 pb-0">
                                        {/* {chartTouch===true?<FlotChart
                                          data={barStackedData}
                                          options={barStackedOptions}
                                          height="437px" width="750px"/> :<ReportGrid columns={ProspectsColumns} data={ProspecctsData} />} */}
                                        </CardBody>
                                      </Card>
                                  </Collapse>
                              </Card>

                              <Card className="b card-default">
                                  <CardHeader className="border-bottom">
                                    <i className={isOpenCall?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenCall?"Collapse":"Expand"} onClick={toggleCall}></i>
                                    <i className="fas fa-phone-alt mr-2"></i>
                                    <strong>Call</strong>
                                    <div className="card-tool float-right">
                                      <i className="far fa-chart-bar" title="Chart" onClick={togglerchartCall}></i>
                                    </div>
                                      
                                  </CardHeader>
                                  <Collapse isOpen={isOpenCall}>
                                      <Card>
                                        <CardBody className="d-flex pt-4 pb-0">
                                        {/* {chartCall===true?<FlotChart
                                          data={barStackedData}
                                          options={barStackedOptions}
                                          height="437px" width="750px"/> :<ReportGrid columns={ProspectsColumns} data={ProspecctsData} />} */}
                                        </CardBody>
                                      </Card>
                                  </Collapse>
                              </Card>

                              <Card className="b card-default">
                                  <CardHeader className="border-bottom">
                                    <i className={isOpenEmail?"fa fa-chevron-up mr-2":"fas fa-chevron-down mr-2"} title={isOpenEmail?"Collapse":"Expand"} onClick={toggleEmail}></i>
                                    <i className="fa fa-envelope mr-2"></i>
                                    <strong>Email</strong>
                                    <div className="card-tool float-right">
                                      <i className="far fa-chart-bar" title="Chart" onClick={togglerchartEmail}></i>
                                    </div>
                                      
                                  </CardHeader>
                                  <Collapse isOpen={isOpenEmail}>
                                      <Card>
                                        <CardBody className="d-flex pt-4 pb-0">
                                        {/* {chartEmail===true?<FlotChart
                                          data={barStackedData}
                                          options={barStackedOptions}
                                          height="437px" width="750px"/> :<ReportGrid columns={UserColumns} data={UserData} />} */}
                                        </CardBody>
                                      </Card>
                                  </Collapse>
                              </Card>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </ContentWrapper>
    )

}

export default Reports;