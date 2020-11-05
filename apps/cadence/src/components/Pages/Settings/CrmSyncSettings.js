import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Collapse, FormGroup, Input, Label, Table } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_ALL_USER_QUERY } from '../../queries/SettingsQuery';
import Button from "../../Common/Button";
import SyncActivityGrid from './SyncActivityGrid';

const CrmSyncSettings = () => {
    let upAngle = "fas fa-angle-up fa-lg text-primary mr-2";
    let downAngle = "fas fa-angle-down fa-lg text-primary mr-2";
    const cursorStyle = { "cursor": "pointer" };
    const [showApiLimit, setShowApiLimit] = useState(true);
    const [showCrmToTrucadence, setShowCrmToTrucadence] = useState(false);
    const [showTrucadenceToCrm, setShowTrucadenceToCrm] = useState(false);
    const [showWorkFlow, setShowWorkFlow] = useState(false);
    const [action, setAction] = useState(false);
    const [numChildren, setNumChildren] = useState(3);
    const [addWorkflowNum, setAddWorkflowNum] = useState(1);
    const [isCount, setIsCount] = useState(0);
    const [showSyncActivity, setShowSyncActivity] = useState(false);
    const { data: userData } = useQuery(FETCH_ALL_USER_QUERY, {});
    let userList = "";
    if (userData !== undefined) {
        userList = userData.user.data.map(us => {
            return (
                <option value={us.id} key={us.id}>{us.displayName}</option>
            )
        })
    }
    const columns = [
        {
            Header: 'Touch Type',
            accessor: 'touchType',
            width: '25%'
        },
        {
            Header: 'Touch Outcomes',
            accessor: 'outcome',
            width: '30%'
        }
    ]

    const outComesData = [
        {
            touchType: 'call',
            outcome: 'call issue'
        }, {
            touchType: 'call',
            outcome: 'call issue'
        }
    ]
    const showCrmAPI = () => {
        setShowApiLimit(!showApiLimit)
    }
    const showCrmSync = () => {
        setShowCrmToTrucadence(!showCrmToTrucadence)
    }
    const showTrucadenceSync = () => {
        setShowTrucadenceToCrm(!showTrucadenceToCrm)
    }

    const showWorkFlowCriteria = () => {
        setShowWorkFlow(!showWorkFlow)
    }
    const showActivity = () => {
        setShowSyncActivity(!showSyncActivity)
    }

    const getSelectedValue = (event) => {
        if (event.target.value === "MOVE_TO_ANOTHER_CADENCE") {
            setAction(true);
        }
    }

    const FilterCriteriaRow = () => {
        return (
            <FormGroup row>
                <Col>
                    <Input type="select">
                        <option></option>
                    </Input>
                </Col>
                <Col>
                    <Input type="select">
                        <option></option>
                    </Input>
                </Col>
                <Col>
                    <Input type="select">
                        <option></option>
                    </Input>
                </Col>
                <Col><i className="far fa-trash-alt" title="Delete Row"></i></Col>
            </FormGroup>
        );
    }

    const children = [];

    for (var i = 0; i < numChildren; i += 1) {
        children.push(<FilterCriteriaRow key={i} number={i} />);
    };

    const WorkFlowSection = () => {

        return (
            <div>
                <FormGroup row>
                    <Label sm={3}>Choose Record Type</Label>
                    <Col sm={4}>
                        <Input type="select">
                            <option></option>
                            <option>CONTACT</option>
                            <option>LEAD</option>
                        </Input>
                    </Col>
                    <Col sm={1}><i className="far fa-trash-alt mr-2 text-danger pointer" title="Delete Work Flow"></i></Col>
                </FormGroup>
                <Card className="b">
                    <CardHeader className="border-bottom">
                        <div className="card-tool float-right">
                            <i className="fas fa-plus text-primary mr-4" title="Add Row" onClick={() => {
                                setNumChildren(numChildren + 1)
                                setIsCount(isCount + 1)
                            }}></i>
                            <i className="fas fa-sync-alt" title="Reset Row" onClick={() => {
                                setNumChildren(3)
                                setAddWorkflowNum(1)
                            }}>
                            </i>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Table hover id="filter_row">
                            <FormGroup row>
                                <Col>Prospect Field</Col>
                                <Col>Operator</Col>
                                <Col>Value</Col>
                                <Col>Action</Col>
                            </FormGroup>
                            {children}
                        </Table>
                        <FormGroup row className="pl-4">
                            <Col sm={4}>
                                <Input type="radio" id="all_criteria_must_match" name="criteriaMatchs" />
                                <Label for="all_criteria_must_match">All Criteria's Must Match(AND)</Label>
                            </Col>
                            <Col sm={4}>
                                <Input type="radio" id="any_one_criteria_match" name="criteriaMatchs" />
                                <Label for="any_one_criteria_match">Any one Criteria Matchs(OR)</Label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}> Choose Action</Label>
                            <Col sm={4}>
                                <Input type="select" onChange={getSelectedValue}>
                                    <option></option>
                                    <option value="EXIT_CADENCE">Exit Cadence</option>
                                    <option value="MOVE_TO_ANOTHER_CADENCE">Move to Another Cadence</option>
                                    <option calue="MOVE_TO_NEXT_TOUCH">Move to next Touch</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row style={{ display: action ? "" : "none" }}>
                            <Label sm={2}> Choose Cadence</Label>
                            <Col sm={4}>
                                <Input type="select">
                                    <option></option>
                                    <option>call</option>
                                </Input>
                            </Col>
                        </FormGroup>
                    </CardBody>
                </Card>
            </div >
        );
    }
    const wfChildren = [];

    for (var i = 0; i < addWorkflowNum; i += 1) {
        wfChildren.push(<WorkFlowSection key={i} number={i} id="worf_flow_section_" isCount />);
    };

    const CrmApiSection = () => {
        return (
            <Collapse isOpen={showApiLimit}>
                <CardBody>
                    <FormGroup row>
                        <Label sm={3}>Trucadence is Allowed to use</Label>
                        <Col sm={4}><Input type="text" value="5000"></Input></Col>
                        <Label sm={4}>CRM API calls in a 24 hour period.</Label>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Choose CRM Administrator</Label>
                        <Col sm={4}>
                            <Input type="select">
                                <option></option>
                                {userList}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Sync Frequency</Label>
                        <Col sm={4}>
                            <Input type="select">
                                <option></option>
                                <option value="5">5 Minutes</option>
                                <option value="10">10 Minutes</option>
                                <option value="15">15 Minutes</option>
                                <option value="30">30 Minutes</option>
                                <option value="45">45 Minutes</option>
                                <option value="60">1 Hour</option>
                                <option value="120">2 Hours</option>
                                <option value="240">4 Hours</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <Button icon="fas fa-check" color="primary">Save</Button>
                </CardBody>
            </Collapse>
        );
    }
    const [showWorkFlowBlockCheck, setShowWorkFlowBlockCheck] = useState(false);
    const checkSyncCrmToTrucadence = () => {
        setShowWorkFlowBlockCheck(!showWorkFlowBlockCheck)
        if (showWorkFlowBlockCheck === true) {
            setShowWorkFlow(false)
        }
    }

    const CrmToTrucadenceSection = () => {

        return (
            <Collapse isOpen={showCrmToTrucadence}>
                <CardBody>
                    <FormGroup row check sm={9} className="pl-4">
                        <Input type="checkbox" id="crm_to_trucadence" name="crmToTrucadence" />
                        <Label for="crm_to_trucadence"><strong>Do you want to Sync data from CRM to TruCadence ?</strong></Label>
                    </FormGroup>
                    <FormGroup row check sm={9} className="pl-4">
                        <Input type="checkbox" id="sync_update_crm_to_trucadence" className="" name="syncUpdateCrmToTrucadence" onClick={checkSyncCrmToTrucadence} />
                        <Label for="sync_update_crm_to_trucadence">Syncing  updates  taking place in CRM to TruCadence</Label>
                    </FormGroup>
                    <Card className="bt bb">
                        <div style={{ cursorStyle }, { "display": showWorkFlowBlockCheck ? "" : "none" }} onClick={showWorkFlowCriteria} className="bg-gray-lighter text-bold"><i className={showWorkFlow ? upAngle : downAngle}></i>Criteria for Workflow Execution and Corresponding Action</div>
                        <Collapse isOpen={showWorkFlow}>
                            <CardBody>
                                {wfChildren}
                                <Button color="primary" icon="fas fa-plus" onClick={() => { setAddWorkflowNum(addWorkflowNum + 1) }}>Add Workflow</Button>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Button color="primary" icon="fas fa-check">Save</Button>
                </CardBody>
            </Collapse>
        );
    }

    const TrucadenceToCrmSection = () => {
        return (
            <Collapse isOpen={showTrucadenceToCrm}>
                <CardBody>
                    <FormGroup row check sm={9} className="pl-4">
                        <Input type="checkbox" id="crm_to_trucadence" name="crmToTrucadence" />
                        <Label for="crm_to_trucadence"><strong>Do you want to Sync data from TruCadence to CRM ?</strong></Label>
                    </FormGroup>
                    <FormGroup row check sm={9} className="pl-4">
                        <Input type="checkbox" id="sync_update_trucadence_to_crm" name="syncUpdateTrucadenceToCrm" />
                        <Label for="sync_update_trucadence_to_crm">Syncing  updates  taking place in TruCadence to CRM</Label>
                    </FormGroup>
                    <div onClick={showActivity} className="bg-gray-lighter text-bold"> <i className={showSyncActivity ? upAngle : downAngle}></i><strong>Sync Activities</strong> </div>
                    <Collapse isOpen={showSyncActivity}>
                        <SyncActivityGrid
                            columns={columns}
                            data={outComesData}
                            outComesData={outComesData}
                        />
                    </Collapse>
                    <Button color="primary" icon="fas fa-check">Save</Button>
                </CardBody>
            </Collapse>
        );
    }

    return (
        <>
            <Card className="b">
                <CardHeader className="border-bottom">
                    <strong>CRM Sync Settings</strong>
                </CardHeader>
                <div className="p-2 bb bt bg-gray-lighter text-bold" style={cursorStyle} onClick={showCrmAPI}><i className={showApiLimit ? upAngle : downAngle}></i><Link>CRM API Limits</Link></div>
                <CrmApiSection />
                <div className="p-2 bb bt bg-gray-lighter text-bold" style={cursorStyle} onClick={showCrmSync}><i className={showCrmToTrucadence ? upAngle : downAngle}></i><Link>Sync From CRM To Trucadence</Link></div>
                <CrmToTrucadenceSection />
                <div className="p-2 bb bt bg-gray-lighter text-bold" style={cursorStyle} onClick={showTrucadenceSync}><i className={showTrucadenceToCrm ? upAngle : downAngle}></i><Link>Sync From Trucadence To CRM</Link></div>
                <TrucadenceToCrmSection />
            </Card>
        </>
    );

}
export default CrmSyncSettings;