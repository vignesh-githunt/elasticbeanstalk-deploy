import React, { useState } from "react";
import { Alert, Badge, Col, Input, Row, ListGroup, ListGroupItem, ListGroupItemText } from "reactstrap";

function AccountActivityGrid({ }) {
    const [isOption, setIsOption] = useState("callsandemails");
    const toggleOption = (e) => {
        setIsOption(e.target.value);
    }

    return (
        <>
            <Row>
                <Col xs={2}>
                    <Input placeholder="Filter" type="select" className="ml-2" onChange={toggleOption}>
                        <option value="callsandemails">Calls & Emails</option>
                        <option value="all">All</option>
                        <option value="call">Calls</option>
                        <option value="email">Emails</option>
                        <option value="text">Texts</option>
                    </Input>
                </Col>
            </Row>
            {isOption == "callsandemails"
                ? <Alert color="danger" className="mb-0 text-center">
                    <h4>
                        <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                        No activities available
                    </h4>
                </Alert> : <p></p>
            }
            {isOption == "all"
                ? <Alert color="danger" className="mb-0 text-center">
                    <h4>
                        <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                    No activities available
                </h4>
                </Alert> : <p></p>
            }
            {isOption == "call"
                ? <ListGroup>
                    <ListGroupItem className="justify-content-between">
                        <small className="text-muted pt-2 float-left">19 hrs</small>
                        <Badge pill className="float-left bg-white rounded-circle border border-dark p-2 mr-2 ml-2">
                            <i className="fa-1x fas fa-phone-alt text-info"></i>
                        </Badge>
                        <div className="float-left ml-2">
                            <ListGroupItemText><strong>Phone Call</strong> to Daymond John</ListGroupItemText>
                            <ListGroupItemText><strong className="text-warning">Meeting Scheduled</strong></ListGroupItemText>
                            <ListGroupItemText><small>05/06/2019 10:48 AM</small></ListGroupItemText>
                        </div>
                    </ListGroupItem>
                    <ListGroupItem className="justify-content-between">
                        <small className="text-muted pt-2 float-left">1 Day</small>
                        <Badge pill className="float-left bg-white rounded-circle border border-dark p-2 mr-2 ml-2">
                            <i className="fa-1x fas fa-phone-alt text-info"></i>
                        </Badge>
                        <div className="float-left ml-2">
                            <ListGroupItemText><strong>Phone Call</strong> to Daymond John</ListGroupItemText>
                            <ListGroupItemText><strong className="text-warning">Got Referral</strong></ListGroupItemText>
                            <ListGroupItemText><small>05/06/2019 2:49 PM</small></ListGroupItemText>
                        </div>
                    </ListGroupItem>
                </ListGroup> : <p></p>
            }
            {isOption == "email"
                ? <ListGroup>
                    <ListGroupItem className="justify-content-between">
                        <small className="text-muted pt-2 float-left">19 hrs</small>
                        <Badge pill className="float-left bg-white rounded-circle border border-dark p-2 mr-2 ml-2">
                            <i className="fa-1x fas fa-envelope text-info"></i>
                        </Badge>
                        <div className="float-left ml-2">
                            <ListGroupItemText><strong>Mail</strong> to Daymond John</ListGroupItemText>
                            <ListGroupItemText><strong className="text-warning">Meeting Scheduled</strong></ListGroupItemText>
                            <ListGroupItemText><small>05/06/2019 10:48 AM</small></ListGroupItemText>
                        </div>
                    </ListGroupItem>
                    <ListGroupItem className="justify-content-between">
                        <small className="text-muted pt-2 float-left">1 Day</small>
                        <Badge pill className="float-left bg-white rounded-circle border border-dark p-2 mr-2 ml-2">
                            <i className="fa-1x fas fa-envelope text-info"></i>
                        </Badge>
                        <div className="float-left ml-2">
                            <ListGroupItemText><strong>Mail</strong> to Daymond John</ListGroupItemText>
                            <ListGroupItemText><strong className="text-warning">Got Referral</strong></ListGroupItemText>
                            <ListGroupItemText><small>05/06/2019 2:49 PM</small></ListGroupItemText>
                        </div>
                    </ListGroupItem>
                </ListGroup> : <p></p>
            }
            {isOption == "text"
                ? <Alert color="danger" className="mb-0 text-center">
                    <h4>
                        <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                    No activities available
                </h4>
                </Alert> : <p></p>
            }
        </>
    )
}

export default AccountActivityGrid;