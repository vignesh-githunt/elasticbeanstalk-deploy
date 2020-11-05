/**
 * @author ranbarasan
 * @version v11.0
 */
import React, { useState } from "react";
import { Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { default as ClButton } from "../../Common/Button";
import CloseButton from '../../Common/CloseButton';

const LogACallAndLogATask = ({ showModal, hideModal }) => {

    const [activeTab, setActiveTab] = useState('logCall');
    const [heading, setHeading] = useState("Log a Call");

    const handleTabChange = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            tab === "logCall" ? setHeading("Log a Call") : setHeading("New Task")
        }
    }

    const handleSaveLogATask = () => {
        //Todo - Save Log a Call
    }

    return (
        <div>
            <Modal isOpen={showModal}>
                <ModalHeader>{heading}</ModalHeader>
                <ModalBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === 'logCall' })}
                                onClick={() => { handleTabChange('logCall'); }}
                            >
                                Log a Call
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === 'logTask' })}
                                onClick={() => { handleTabChange('logTask'); }}
                            >
                                New Task
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="logCall">
                            <Form>
                                <FormGroup>
                                    <Label for="log_a_call_result">Call Result</Label>
                                    <Input type="select" name="logACallResult" id="log_a_call_result" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="log_a_call_notes">Notes</Label>
                                    <Input type="textarea" name="logACallNotes" id="log_a_call_notes" rows={6} />
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="createFollowupTask" id="create_followup_task" />{' '}
                                        Create a Followup Task
                                    </Label>
                                </FormGroup>
                            </Form>
                        </TabPane>
                        <TabPane tabId="logTask">
                            <Form>
                                <FormGroup>
                                    <Label for="log_a_task_subject">Subject:</Label>
                                    <Input type="text" name="logaTaskSubject" id="log_a_task_subject" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="log_a_task_notes">Notes:</Label>
                                    <Input type="textarea" name="logaTaskNotes" id="log_a_task_notes" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="follow_up_date">Follow Up Date:</Label>
                                    <Input type="text" name="followUpDate" id="follow_up_date" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="log_a_task_follow_up_date">Remainder:</Label>
                                    <Input type="text" name="logaTaskFollowupDate" id="log_a_task_follow_up_date" />
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="includeLogaCall" id="include_log_a_call" />
                                        Include Log a Call
                                    </Label>
                                </FormGroup>
                            </Form>
                        </TabPane>
                    </TabContent>
                </ModalBody>
                <ModalFooter>
                    <ClButton color="primary" icon="fa fa-check" title="Save Changes" onClick={() => { handleSaveLogATask(); }}>Save</ClButton>
                    <CloseButton onClick={hideModal} btnTxt="Cancel" />
                </ModalFooter>
            </Modal>
        </div>
    );
}
export default LogACallAndLogATask;