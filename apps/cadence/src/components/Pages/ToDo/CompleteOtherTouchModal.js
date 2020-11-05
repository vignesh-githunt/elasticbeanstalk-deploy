/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React, { useRef, useState } from "react";
import {
    Col,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import CloseButton from "../../Common/CloseButton";
import ClButton from "../../Common/Button";

const CompleteOtherTouchModal = ({ showCompleteTouch, touchInfoDetails, handleCompleTouch, handleClose, errorAlert, isRequestLoading }) => {

    const commentsRef = useRef();
    const [isRequiredField, setIsRequiredField] = useState({});

    return (
        <Modal size="md" isOpen={showCompleteTouch} centered={true}>
            <ModalHeader>
                Complete Touch - Other
            </ModalHeader>
            <ModalBody>
                <div>
                    <Row className="p-2">
                        <Col sm={6}>Account Name</Col><Col sm={6} className="float-right">{touchInfoDetails.accountName}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={6}>Contact Name</Col><Col sm={6} className="float-right">{touchInfoDetails.contactName}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={6}>Cadence</Col><Col sm={6} className="float-right">{touchInfoDetails.cadenceName}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={6}>Touch</Col><Col sm={6} className="float-right">{touchInfoDetails.touchType}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={6}>Touch Description</Col><Col sm={6} className="float-right overflow-auto">{touchInfoDetails.description}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={6}>Other Network</Col><Col sm={6} className="float-right">{touchInfoDetails.timeToComplete}</Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={6}>Comments</Col>
                        <Col sm={6} className="float-right">
                            <Input
                                type="textarea"
                                name="comments"
                                placeholder="Type Comments Here"
                                rows={5}
                                innerRef={commentsRef}
                                className={isRequiredField["comments"] ? "border border-danger" : ""}
                                onFocus={() => setIsRequiredField({})}
                            />
                            {isRequiredField["comments"] && (
                                <span className="invalid-feedback d-block">Please enter the comments</span>
                            )}
                        </Col>
                    </Row>
                </div>
            </ModalBody>
            <ModalFooter>
                <Col className="text-right">
                    <ClButton className="mr-2" color="primary" icon={isRequestLoading ? "fa fa-spinner fa-spin" : "fas fa-check"} disabled={isRequestLoading}
                        onClick={(e) => {

                            if (!commentsRef.current.value) {
                                setIsRequiredField({ "comments": true })
                                e.preventDefault();
                            } else {
                                const requestData = {
                                    touchType: "others",
                                    touchInput: commentsRef.current.value.trim(),
                                    prospectId: touchInfoDetails.prospectId
                                }
                                handleCompleTouch(requestData)
                            }

                        }} >
                        Complete Touch
                    </ClButton>
                    <CloseButton onClick={() => { setIsRequiredField({}); handleClose(); }} btnTxt="Cancel" ><i className="fa fa-times mr-2"></i></CloseButton>
                </Col>
            </ModalFooter>
        </Modal>
    )

}

export default CompleteOtherTouchModal;