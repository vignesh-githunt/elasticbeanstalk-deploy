/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React from "react";
import {
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import CloseButton from "../Common/CloseButton";
import Button from "../Common/Button";

const TouchInfoModal = ({ touchInfoHeading, showTouchInfo, touchInfoDetails, handleClose, handleShowCompleTouchWindow, confirBtnIcon, confirmBtnText }) => {

    return (
        <Modal size="md" isOpen={showTouchInfo} centered={true}>
            <ModalHeader>{touchInfoHeading}</ModalHeader>
            <ModalBody>
                <div>
                    <Row className="p-2">
                        <Col>Contact Name</Col><Col className="float-right">{touchInfoDetails.contactName}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col>Cadence</Col><Col className="float-right">{touchInfoDetails.cadenceName}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col>Touch</Col><Col className="float-right">{touchInfoDetails.touchType}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col>Time To Complete</Col><Col className="float-right">{touchInfoDetails.timeToComplete}</Col>
                    </Row>
                </div>
            </ModalBody>
            <ModalFooter>
                <Col className="text-right">
                    <Button color="primary" className="mr-2" onClick={handleShowCompleTouchWindow} icon={confirBtnIcon}>{confirmBtnText}</Button>
                    <CloseButton onClick={handleClose} btnTxt="Cancel" />
                </Col>
            </ModalFooter>
        </Modal>
    )
}

export default TouchInfoModal;