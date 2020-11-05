/**
 * @author @rajesh-thiyagarajan
 * @version V11.0
 */
import React from "react";
import {
    Col,
    Modal,
    ModalHeader,
    Row,
} from "reactstrap";

const ZipwhipTocuhModal = ({ showZhipwhiTouchWindow, phoneNumber, zipwhipSessionKey, handleClose, lastActivityData }) => {

    if (!zipwhipSessionKey) {
        alert("Please connect Zipwhip and then try again.");
        return;
    }

    let iframeStyle = {
        'width': '100%',
        'height': '400px',
        'backgroundColor': '#fff',
        'border': '0px'
    }

    const zipwhipWidgetURL = "https://embed.zipwhip.com/messaging/";
    let phoneNo = phoneNumber.toString().replace(/[^0-9|+]/g, '');
    let zhipWhipRequestUrl = zipwhipWidgetURL + phoneNo;
    let lastTouchedTime = new Date(lastActivityData.lastTouchDateTime).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', '');
    return (
        <>
            <Modal size="lg" isOpen={showZhipwhiTouchWindow} centered={true} className="float-right" style={{ width: "33%" }}>
                <div>
                    <ModalHeader toggle={handleClose}>
                        Comple Touch - Text
                    </ModalHeader>
                    <div className="px-2">
                        <Row className="p-2 bb">
                            <Col>Cadence</Col><Col className="float-right">{lastActivityData.cadenceName}</Col>
                        </Row>
                        <Row className="p-2 bb">
                            <Col>Last Touch</Col><Col className="float-right">{lastActivityData.lastTouch}</Col>
                        </Row>
                        <Row className="p-2 bb">
                            <Col>Last Touched On</Col><Col className="float-right">{lastTouchedTime}</Col>
                        </Row>
                        <Row className="p-2 bb">
                            <Col>Last Outcome</Col><Col className="float-right">{lastActivityData.lastTextOutcome}</Col>
                        </Row>
                    </div>
                    <div >
                        <iframe src={zhipWhipRequestUrl} style={iframeStyle} id="chat"></iframe>
                    </div>
                 </div>
            </Modal>
        </>
    )
}

export default ZipwhipTocuhModal;