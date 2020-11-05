/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";

import CloseButton from "../../Common/CloseButton";

const CompleteLinkedInTouchModal = ({ showCompleteTouch, touchInfoDetails, handleCompleTouch, handleClose }) => {

    return (
        <Modal size="xl" isOpen={showCompleteTouch} centered={true}>
            <ModalHeader>
                Complete Touch - LinkedIn
            </ModalHeader>
            <ModalBody>
                <div className="p-3 bl bt br bb">
                    <Row>
                        <Col sm={4}>{touchInfoDetails.contactName}</Col>
                        <Col sm={4}>
                            <Row className="p-1"><Col>Current Cadence</Col><Col className="float-right">{touchInfoDetails.cadenceName}</Col></Row>
                            <Row className="p-1"><Col>Current Touch</Col><Col className="float-right">{touchInfoDetails.touchType}</Col></Row>
                        </Col>
                        <Col sm={4}>
                            <Row className="p-1"><Col>Last Touched On</Col><Col className="float-right">{touchInfoDetails.lastTouchDateTime}</Col></Row>
                            <Row className="p-1"> <Col>Next Touch</Col><Col className="float-right">{touchInfoDetails.touchType}</Col></Row>
                        </Col>
                    </Row>
                </div>
                <Col sm={8} className="p-3 bl bt br bb mt-3 mx-auto">
                    <Row className="pb-3 bb"><Col><h4 className="mb-0">LinkedIn-Connection Request</h4></Col></Row>
                    <div className="mt-5">
                        <Row className="p-1"><Col className="text-center"><strong><i className="fa fa-user mr-2"></i>{touchInfoDetails.contactName}</strong></Col></Row>
                        <Row className="p-1"><Col className="text-center">{touchInfoDetails.accountName}</Col></Row>
                        <FormGroup row>
                            <Label for="linked_request_url" sm={3}>LinkedIn Request URL :</Label>
                            <Col sm={9}>
                                <Input type="text" name="email" id="linked_request_url" />
                            </Col>
                        </FormGroup>
                        <Row className="p-1"><Col className="text-center"><Button color="primary" className="mr-2" onClick={handleCompleTouch} >Send Invite in LinkedIn</Button></Col></Row>
                    </div>
                </Col>
            </ModalBody>
            <ModalFooter className="p-1">
                <Col className="text-right">
                    <Button color="primary" className="mr-2" onClick={handleCompleTouch} ><i className="fas fa-check mr-2"></i>Complete Touch</Button>
                    <CloseButton onClick={handleClose} btnTxt="Cancel" ><i className="fa fa-times mr-2"></i></CloseButton>
                </Col>
            </ModalFooter>
        </Modal>
    )

}
export default CompleteLinkedInTouchModal;