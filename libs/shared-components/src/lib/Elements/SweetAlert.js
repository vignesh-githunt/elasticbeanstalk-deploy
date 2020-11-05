import React, { useState } from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import { Container, Row, Col } from 'reactstrap';

import Swal from './Swal';

const SweetAlert = () => {
    const swalOption1 = useState({
        title: "Here's a message!"
    });

    const swalOption2 = useState({
        title: "Here's a message!",
        text: "It's pretty, isn't it?"
    });

    const swalOption3 = useState({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
    });

    const swalOption4 = useState({
        title: 'Are you sure?',
        text: 'Your will not be able to recover this imaginary file!',
        icon: 'warning',
        buttons: {
            cancel: true,
            confirm: {
                text: 'Yes, delete it!',
                value: true,
                visible: true,
                className: "bg-danger",
                closeModal: true
            }
        }
    });

    const swalOption5 = useState({
        title: 'Are you sure?',
            text: 'Your will not be able to recover this imaginary file!',
            icon: 'warning',
            buttons: {
                cancel: {
                    text: 'No, cancel plx!',
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: false
                },
                confirm: {
                    text: 'Yes, delete it!',
                    value: true,
                    visible: true,
                    className: "bg-danger",
                    closeModal: false
                }
            }
    });

   const  swalCallback4=(isConfirm, swal)=> {
        swal("Deleted!", "Your imaginary file has been deleted.", "success");
    }

    const  swalCallback5=(isConfirm, swal)=> {
        if (isConfirm) {
            swal("Deleted!", "Your imaginary file has been deleted.", "success");
        } else {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
    }

    return (
        <ContentWrapper>
            <div className="content-heading">
               <div>SweetAlert
                  <small>A Beautiful Replacement For Javascript's "alert"</small>
               </div>
            </div>
            <Container>
                <h4 className="page-header mt-0">Usage examples</h4>
                <Row className="mb-2">
                    <Col sm={9} lg={6}>
                        <p>A basic message</p>
                    </Col>
                    <Col sm={3} lg={6}>
                        <Swal options={swalOption1} className="btn btn-primary">Try me!</Swal>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col sm={9} lg={6}>
                        <p>A title with a text under</p>
                    </Col>
                    <Col sm={3} lg={6}>
                        <Swal options={swalOption2} className="btn btn-primary">Try me!</Swal>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col sm={9} lg={6}>
                        <p>A success message!</p>
                    </Col>
                    <Col sm={3} lg={6}>
                        <Swal options={swalOption3} className="btn btn-primary">Try me!</Swal>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col sm={9} lg={6}>
                        <p>A warning message, with a function attached to the &quot;Confirm&quot;-button</p>
                    </Col>
                    <Col sm={3} lg={6}>
                        <Swal options={swalOption4} callback={swalCallback4} className="btn btn-primary">Try me!</Swal>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col sm={9} lg={6}>
                        <p>... and by passing a parameter, you can execute something else for &quot;Cancel&quot;.</p>
                    </Col>
                    <Col sm={3} lg={6}>
                        <Swal options={swalOption5} callback={swalCallback5} className="btn btn-primary">Try me!</Swal>
                    </Col>
                </Row>
            </Container>
        </ContentWrapper>
        );
}
export default SweetAlert;