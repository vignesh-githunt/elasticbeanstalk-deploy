import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import Sparkline from '../Common/Sparklines';


class Dashboard extends Component {

    state = {}

    render() {
        // Usse t function instead of Trans component
        // const { t } = this.props;

        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Dashboard
                        <small><Trans i18nKey='dashboard.WELCOME'></Trans></small>
                    </div>
                </div>
                <Row>
                    <Col xl={ 4 }>
                      <div className="list-group mb-3">
                        <div className="list-group-item">
                          <div className="d-flex align-items-center py-3">
                            <div className="w-50 px-3">
                              <p className="m-0 lead">1204</p>
                              <p className="m-0 text-sm">Commits this month</p>
                            </div>
                            <div className="w-50 px-3 text-center">
                              <Sparkline options={{
                                barColor: "#23b7e5",
                                height: "60",
                                barWidth: "10",
                                barSpacing: "6",
                                chartRangeMin: "0"
                              }}
                                values="3,6,7,8,4,5" />
                            </div>
                          </div>
                        </div>
                        <div className="list-group-item">
                          <div className="d-flex align-items-center py-3">
                            <div className="w-50 px-3">
                              <p className="m-0 lead">$ 3,200.00</p>
                              <p className="m-0 text-sm">Available budget</p>
                            </div>
                            <div className="w-50 px-3 text-center">
                              <Sparkline options={{
                                type: "line",
                                height: "60",
                                width: "80%",
                                lineWidth: "2",
                                lineColor: "#7266ba",
                                chartRangeMin: "0",
                                spotColor: "#888",
                                minSpotColor: "#7266ba",
                                maxSpotColor: "#7266ba",
                                fillColor: "",
                                highlightLineColor: "#fff",
                                spotRadius: "3",
                                resize: true
                              }}
                                values="7,3,4,7,5,9,4,4,7,5,9,6,4" />

                            </div>
                          </div>
                        </div>
                        <div className="list-group-item">
                          <div className="d-flex align-items-center py-3">
                            <div className="w-50 px-3">
                              <p className="m-0 lead">67</p>
                              <p className="m-0 text-sm">New followers</p>
                            </div>
                            <div className="w-50 px-3 text-center">
                              <div className="d-flex align-items-center flex-wrap justify-content-center">

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xl={ 8 }>

                    </Col>

                </Row>
            </ContentWrapper>
            );

    }

}

export default withTranslation('translations')(Dashboard);
