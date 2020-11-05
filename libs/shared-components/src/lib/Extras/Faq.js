import React, { useState } from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Collapse } from 'reactstrap';

const Faq = () => {
    const INITIAL_STATE = {oneAtATime: true, accordionState:[
        false, false, false, false, false, false,
        false, false, false, false, false, false,
        false, false, false, false, false, false
    ]}
   
    const [myState, setMyState] = useState(INITIAL_STATE);
    const { oneAtATime,accordionState } = myState
    const toggleAccordion = id => {
        let accordionState = accordionState.map((val,i) => {
            return id === i ? !val : (oneAtATime ? false : val)
        })
        setMyState({accordionState})
    }
    return (
        <ContentWrapper>
            <div className="container container-md">
                <Row className="mb-3">
                    <Col lg="8">
                        <div className="h1 text-bold">FAQs</div>
                        <p className="text-muted">Praesent id mauris urna, et tristique lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                    </Col>
                    <Col lg="4">
                        <Card>
                            <CardBody className="text-center">
                                <p className="mb-3">Sed semper diam vitae purus tristique at scelerisque massa ultricies.</p>
                                <button className="btn btn-info" type="button">Contact support</button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <h4 className="my-3 py-4 text-dark">Some presale Questions</h4>
                <div>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(0)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[0]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(1)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[1]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(2)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[2]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(3)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[3]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(4)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[4]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
                <h4 className="my-3 py-4 text-dark">Buyer Questions</h4>
                <div>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(5)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[5]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(6)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[6]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(7)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[7]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(8)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[8]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
                <h4 className="my-3 py-4 text-dark">Seller Questions</h4>
                <div>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(9)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[9]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(10)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[10]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(11)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[11]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                    <Card className="b0 mb-2">
                        <CardHeader onClick={() => toggleAccordion(12)}>
                            <CardTitle tag="h4">
                                <a className="text-inherit">
                                    <small>
                                        <em className="fa fa-plus text-primary mr-2"></em>
                                    </small>
                                    <span>How can I change the color?</span>
                                </a>
                            </CardTitle>
                        </CardHeader>
                        <Collapse isOpen={accordionState[12]}>
                            <CardBody>
                                <p>Donec congue sagittis mi sit amet tincidunt. Quisque sollicitudin massa vel erat tincidunt blandit. Curabitur quis leo nulla. Phasellus faucibus placerat luctus. Integer fermentum molestie massa at congue. Quisque quis quam dictum diam volutpat adipiscing.</p>
                                <p>Proin ut urna enim.</p>
                                <div className="text-right">
                                    <small className="text-muted mr-2">Was this information useful?</small>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-up text-muted"></em>
                                    </button>
                                    <button className="btn btn-secondary btn-xs" type="button">
                                        <em className="fa fa-thumbs-down text-muted"></em>
                                    </button>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
            </div>
        </ContentWrapper>
        );
}
export default Faq;