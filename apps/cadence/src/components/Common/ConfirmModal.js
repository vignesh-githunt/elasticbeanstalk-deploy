/**
 * @author @rkrishna-gembrill
 * @since Jun 22 2020
 * @version V11.0
 */
import PropTypes from 'prop-types';
import React from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import CloseButton from "./CloseButton";

const ConfirmModal = ({ children, confirmBtnColor, confirmBtnText, confirmBtnIcon, handleConfirm, handleCancel, header, modalSize, showConfirmBtnSpinner, showConfirmModal }) => {

    return (
        <Modal size={modalSize} isOpen={showConfirmModal} centered={true}>
            <ModalHeader>{header}</ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        {children}
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <CloseButton onClick={handleCancel} btnTxt="Cancel" />
                <Button color={confirmBtnColor} onClick={handleConfirm} disabled={showConfirmBtnSpinner}>
                    {
                        confirmBtnIcon && confirmBtnIcon.trim() !== "" && !showConfirmBtnSpinner &&
                        <i className={confirmBtnIcon + " mr-2"}></i>
                    }
                    {
                        showConfirmBtnSpinner &&
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                    }
                    {confirmBtnText}
                </Button>
            </ModalFooter>
        </Modal >
    );
}

ConfirmModal.defaultProps = {
    confirmBtnColor: "primary",
    confirmBtnText: "Confirm",
    header: "Please Confirm!",
    modalSize: "md",
    showConfirmBtnSpinner: false
};

ConfirmModal.propTypes = {
    children: PropTypes.element.isRequired,
    confirmBtnColor: PropTypes.oneOf(["primary", "danger"]),
    confirmBtnText: PropTypes.string,
    confirmBtnIcon: PropTypes.string,
    handleCancel: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    header: PropTypes.string,
    modalSize: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
    showConfirmBtnSpinner: PropTypes.bool.isRequired,
    showConfirmModal: PropTypes.bool.isRequired
};

export default ConfirmModal;