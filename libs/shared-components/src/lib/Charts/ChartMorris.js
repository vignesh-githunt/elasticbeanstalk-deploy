import React, { useState } from 'react';
import {ContentWrapper} from '../Layout/ContentWrapper';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import MorrisChart from './Morris';

const ChartMorris=()=>{
    const chartdata = useState(
    [{ y: "2006", a: 100, b: 90 },
    { y: "2007", a: 75, b: 65 },
    { y: "2008", a: 50, b: 40 },
    { y: "2009", a: 75, b: 65 },
    { y: "2010", a: 50, b: 40 },
    { y: "2011", a: 75, b: 65 },
    { y: "2012", a: 100, b: 90 }]);

    const donutdata = useState(
        [ {label: "Download Sales", value: 12},
        {label: "In-Store Sales", value: 30},
        {label: "Mail-Order Sales", value: 20}]);

    const lineOptions = useState(
        {
            element: 'morris-line',
            xkey: 'y',
            ykeys: ["a", "b"],
            labels: ["Serie A", "Serie B"],
            lineColors: ["#31C0BE", "#7a92a3"],
            resize: true
        });

    const donutOptions = useState(
            {
                element: 'morris-donut',
                colors: ['#f05050', '#fad732', '#ff902b'],
                resize: true
            });

    const barOptions = useState(
             {
                element: 'morris-bar',
                xkey: 'y',
                ykeys: ["a", "b"],
                labels: ["Series A", "Series B"],
                xLabelMargin: 2,
                barColors: ['#23b7e5', '#f05050'],
                resize: true
                });

    const areaOptions = useState(
              {
                element: 'morris-area',
                xkey: 'y',
                ykeys: ["a", "b"],
                labels: ["Serie A", "Serie B"],
                lineColors: ['#7266ba', '#23b7e5'],
                resize: true
                       });

        return (
                <ContentWrapper>
                    <div className="content-heading">Morris JS</div>
                    <Container fluid>
                        <Row>
                            <Col md={ 6 }>
                                <Card className="card-default">
                                    <CardHeader>Line</CardHeader>
                                    <CardBody>
                                        <MorrisChart id="morris-line" type={'Line'} data={chartdata} options={lineOptions} />
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={ 6 }>
                                <Card className="card-default">
                                    <CardHeader>Area</CardHeader>
                                    <CardBody>
                                        <MorrisChart type={'Area'} id="morris-area" data={chartdata} options={areaOptions}/>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={ 6 }>
                                <Card className="card-default">
                                    <CardHeader>Bar</CardHeader>
                                    <CardBody>
                                        <MorrisChart type={'Bar'} id="morris-bar" data={chartdata} options={barOptions}/>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={ 6 }>
                                <Card className="card-default">
                                    <CardHeader>Donut</CardHeader>
                                    <CardBody>
                                        <MorrisChart type={'Donut'} id="morris-donut" data={donutdata} options={donutOptions}/>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </ContentWrapper>
            );
    
}

export default ChartMorris;