import React, { useState, useContext, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  FormGroup,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Badge,
  ButtonToolbar,
} from 'reactstrap';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import UserContext from '../UserContext';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ContentWrapper from '../Layout/ContentWrapper';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { STORYQUERYSTRING } from '../queries/StoryQueryNew';
import DELETE_MESSAGE from '../mutations/stories/DeleteMessage';
import DELETE_PLOTPOINT from '../mutations/stories/DeletePlotPoint';
import DELETE_ELEMENT from '../mutations/stories/DeleteElement';
import MessageEditor from './MessageEditor';
import Swal from '../Elements/Swal';
import PlotPointEditor from './PlotPointEditor';
import ReactHtmlParser from 'react-html-parser';
import ElementEditor from './ElementEditor';
import { ElementPreview } from './ElementPreview';
import useSendersList from '../hooks/useSenderList';
import ContactsDataTable from '../ContactsDataTable';

const StoryConfiguration = ({ history, match, customerId }) => {
  const [storyId] = useState(match.params.id);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [selectedPlotPoint, setSelectedPlotPoint] = useState({});
  const [dataPoints, setDataPoints] = useState({});
  const [dataPointsOpen, setDataPointsOpen] = useState(false);
  const { user, loading: userLoading } = useContext(UserContext);

  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  if (!customerId) customerId = user.companyId;

  const onPlotPointDelete = () => {
    setSelectedPlotPoint({});
    setSelectedMessage({});
  };

  const deleteOption = {
    title: 'Are you sure?',
    text: 'Your will not be able to recover this Email Message!',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel!',
        value: null,
        visible: true,
        className: '',
        closeModal: false,
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: 'bg-danger',
        closeModal: false,
      },
    },
  };

  const handleDeleteMessage = (message, isConfirm, swal) => {
    const plotPoints =
      message._plotPointsMeta.count > 1 ? ' plot points' : ' plot point';

    if (isConfirm) {
      if (message._plotPointsMeta.count > 0) {
        swal(
          'Cancelled',
          'The ' +
            message.name +
            ' could not be deleted. It has ' +
            message._plotPointsMeta.count +
            plotPoints,
          'error'
        );
        return false;
      } else {
        deleteMessage({
          variables: {
            id: message.id,
          },
          refetchQueries: [
            {
              query: STORYQUERYSTRING,
              variables: { storyId: storyId },
            },
          ],
        });
        swal(
          message.name + ' Deleted!',
          'Your message has been deleted.',
          'success'
        );
      }
    } else {
      swal('Cancelled', 'Your message is safe!', 'error');
    }
  };

  const { data, loading } = useQuery(STORYQUERYSTRING, {
    variables: {
      storyId: storyId,
    },
    skip: userLoading,
  });

  const { SendersDropdown, senderId, senders } = useSendersList(
    customerId,
    user,
    userLoading,
    userLoading ? null : user.id
  );

  useEffect(() => {
    if (!loading) {
      const vars = {};
      data.v3_Customer_Story.requiredDataPoints.map((dp) => {
        return (vars[dp.split('::').pop()] = dp.split('::').pop());
      });
      data.v3_Customer_Story.optionalDataPoints.map((dp) => {
        return (vars[dp.split('::').pop()] = dp.split('::').pop());
      });
      setDataPoints(vars);
    }
  }, [data, loading]);

  if (userLoading || loading)
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>
            <i className="fa fa-spinner fa-spin"></i>
          </div>
        </div>
      </ContentWrapper>
    );

  const story = data.v3_Customer_Story || {};

  const defaultMessage = {
    customerId: customerId,
    name: '',
    position: story.messages.length + 1,
  };

  const defaultPlotPoint = {
    customerId: customerId,
    name: '',
  };

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {story.name}
          <small>Configuration</small>
        </div>
      </div>
      <Row>
        <Col xl={6}>
          <Card className="card-default">
            <CardHeader
              onClick={() => {
                setDataPointsOpen(!dataPointsOpen);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="float-right card-tool">
                {!dataPointsOpen && (
                  <span>
                    Expand <i className="fa fa-angle-down ml-2"></i>
                  </span>
                )}
                {dataPointsOpen && (
                  <span>
                    Collapse <i className="fa fa-angle-up ml-2"></i>
                  </span>
                )}
              </div>
              <CardTitle>Example Mail Merge Data</CardTitle>
            </CardHeader>
            <Collapse isOpen={dataPointsOpen}>
              <CardBody className="form-horizontal">
                {Object.keys(dataPoints).map((key) => {
                  return (
                    <FormGroup row key={key}>
                      <label className="col-xl-4 col-form-label">{key}</label>
                      <div className="col-xl-8">
                        <Input
                          type="text"
                          placeholder={key}
                          onChange={(e) => {
                            const temp = {};
                            temp[key] = e.target.value;
                            setDataPoints((old) => ({ ...old, ...temp }));
                          }}
                        />
                      </div>
                    </FormGroup>
                  );
                })}
              </CardBody>
            </Collapse>
          </Card>
        </Col>
      </Row>
      <h4 className="page-header mt-0">Email Messages</h4>
      <Row>
        {story.messages.map((message) => (
          <Col xl={3} key={message.id}>
            <Card className="card card-default">
              <CardHeader>
                <div className="float-right">
                  <Swal
                    options={deleteOption}
                    callback={(isConfirm, swal) =>
                      handleDeleteMessage(message, isConfirm, swal)
                    }
                  >
                    <em className="fa fa-times"></em>
                  </Swal>
                </div>
                <div className="float-right mr-2">
                  <MessageEditor
                    story={story}
                    message={message}
                    customerId={customerId}
                  />
                </div>
                <h4>{message.name}</h4>
              </CardHeader>
              <CardBody>
                <strong className="text-muted text-uppercase">
                  Plot Points
                </strong>
                <div className="list-group">
                  {message.plotPoints.map((pp) => {
                    if (pp === selectedPlotPoint)
                      return (
                        <div
                          key={pp.id}
                          onClick={(e) => {
                            setSelectedMessage({});
                            setSelectedPlotPoint({});
                          }}
                          className="active list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          {pp.defaultElement === null ? (
                            <>
                              <span className="circle bg-danger mr-2"></span>
                              <span className="fa fa-exclamation-triangle text-danger mr-2"></span>
                            </>
                          ) : (
                            <span className="circle bg-white mr-2"></span>
                          )}
                          <span>{pp.name}</span>
                          <span className="ml-auto badge">
                            {pp.additionalElements.length + 1}
                          </span>
                        </div>
                      );
                    return (
                      <div
                        key={pp.id}
                        onClick={(e) => {
                          setSelectedMessage(message);
                          setSelectedPlotPoint(pp);
                        }}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      >
                        {pp.defaultElement === null ? (
                          <>
                            <span className="circle bg-danger mr-2"></span>
                            <span className="fa fa-exclamation-triangle text-danger mr-2"></span>
                          </>
                        ) : (
                          <span className="circle bg-green mr-2"></span>
                        )}
                        <span>{pp.name}</span>
                        <span className="ml-auto badge">
                          {pp.additionalElements.length + 1}
                        </span>
                      </div>
                    );
                  })}
                  <PlotPointEditor
                    customerId={customerId}
                    story={story}
                    message={message}
                    plotPoint={defaultPlotPoint}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
        <Col xl={3}>
          <Card className="b">
            <CardBody>
              <MessageEditor
                story={story}
                message={defaultMessage}
                customerId={customerId}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      {selectedPlotPoint.id && (
        <EmailMessage
          message={selectedMessage}
          story={story}
          selectedPlotPoint={selectedPlotPoint}
          onDelete={onPlotPointDelete}
          dataPoints={dataPoints}
          senderId={senderId}
          user={user}
          userLoading={userLoading}
          senders={senders}
          SendersDropdown={SendersDropdown}
        />
      )}
    </ContentWrapper>
  );
};

const EmailMessage = ({
  message,
  story,
  selectedPlotPoint,
  onDelete,
  dataPoints,
  senderId,
  user,
  userLoading,
  senders,
  SendersDropdown,
}) => {
  const [deletePlotPoint] = useMutation(DELETE_PLOTPOINT);

  const deleteOption = {
    title: 'Are you sure?',
    text: 'Your will not be able to recover this Plot Point!',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel!',
        value: null,
        visible: true,
        className: '',
        closeModal: false,
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: 'bg-danger',
        closeModal: false,
      },
    },
  };

  const handleDeletePlotPoint = (plotPoint, isConfirm, swal) => {
    const elements = selectedPlotPoint.defaultElement
      ? ' elements'
      : ' element';

    if (isConfirm) {
      if (selectedPlotPoint.defaultElement) {
        swal(
          'Cancelled',
          'The ' +
            selectedPlotPoint.name +
            ' could not be deleted. It has ' +
            selectedPlotPoint.additionalElements.length +
            1 +
            elements,
          'error'
        );
        return false;
      } else {
        deletePlotPoint({
          variables: {
            id: selectedPlotPoint.id,
          },
          refetchQueries: [
            {
              query: STORYQUERYSTRING,
              variables: { storyId: story.id },
            },
          ],
        }).then((result) => {
          onDelete(result);
        });
        swal(
          selectedPlotPoint.name + ' Deleted!',
          'Your Plot Point has been deleted.',
          'success'
        );
      }
    } else {
      swal('Cancelled', 'Your Plot Point is safe!', 'error');
    }
  };
  return (
    <Row>
      {selectedPlotPoint.id && (
        <React.Fragment>
          <Col xl={6}>
            <Card className="card card-default">
              <CardHeader>
                <div className="float-right">
                  <Swal
                    options={deleteOption}
                    callback={(isConfirm, swal) =>
                      handleDeletePlotPoint(selectedPlotPoint, isConfirm, swal)
                    }
                  >
                    <em className="fa fa-times"></em>
                  </Swal>
                </div>
                <div className="float-right mr-2">
                  <PlotPointEditor
                    key={selectedPlotPoint.id}
                    customerId={story.customerId}
                    story={story}
                    message={message}
                    plotPoint={selectedPlotPoint}
                  />
                </div>
                <h4>{selectedPlotPoint.name}</h4>
              </CardHeader>
              <CardBody>
                <PlotPoint
                  plotPoint={selectedPlotPoint}
                  customerId={story.customerId}
                  story={story}
                  onDelete={onDelete}
                  user={user}
                  userLoading={userLoading}
                  senders={senders}
                  senderId={senderId}
                />
              </CardBody>
            </Card>
          </Col>
          <Col xl={6}>
            <Card className="card b">
              <CardHeader>
                <div className="float-right">
                  <ButtonToolbar>
                    <span className="pt-1 mr-2 text-faded">
                      Preview Sender:
                    </span>
                    <SendersDropdown />
                  </ButtonToolbar>
                </div>
                <h4>Preview</h4>
              </CardHeader>
              <CardBody>
                <EmailMessagePreview
                  message={message}
                  selectedPlotPoint={selectedPlotPoint}
                  dataPoints={dataPoints}
                  senderId={senderId}
                />
              </CardBody>
            </Card>
          </Col>
        </React.Fragment>
      )}
    </Row>
  );
};

const replaceText = (text, dataPoints) => {
  let newText = text;
  if (dataPoints) {
    Object.keys(dataPoints).map((key) => {
      if (newText.search(`{{${key}}}`) > -1) {
        return (newText = newText
          .split(`{{${key}}}`)
          .join(`<span class="badge badge-primary">${dataPoints[key]}</span>`));
      }
      return null;
    });
  }
  return newText;
};

const EmailMessagePreview = ({
  message,
  selectedPlotPoint,
  dataPoints,
  senderId,
}) => {
  // useEffect(() => {
  //   console.log("rendering")
  // }, [dataPoints])
  return (
    //eslint-disable-next-line
    <React.Fragment>
      {message.plotPoints.map((pp) => {
        const elementText = evaluatePlotPoint(pp, dataPoints, senderId);
        return (
          elementText && (
            <ElementPreview
              key={pp.id}
              selected={pp.id === selectedPlotPoint.id}
              elementText={ReactHtmlParser(
                replaceText(elementText, dataPoints)
              )}
            />
          )
        );
      })}
    </React.Fragment>
  );
};

const evaluatePlotPoint = (pp, dataPoints, senderId) => {
  let result = null;
  pp.additionalElements.map((el) => {
    if (!result) {
      if (el.senderId === senderId || el.senderId === null) {
        result = evaluateElement(el, dataPoints);
      }
    }
    return result;
  });
  if (!result) result = evaluateElement(pp.defaultElement, dataPoints);

  return result;
};

const evaluateElement = (el, dataPoints) => {
  if (!el) return null;
  let result = null;
  switch (el.triggerType) {
    case 'ValueTriggered':
      result = evaluateValueTriggeredElement(el, dataPoints);
      break;
    case 'TypeTriggered':
      result = evaluateTypeTriggeredElement(el, dataPoints);
      break;
    case 'TimeTriggered':
      result = evaluateTimeTriggeredElement(el);
      break;
    case 'Static':
      result = el.text;
      break;
    default:
      break;
  }
  return result;
};

const evaluateValueTriggeredElement = (el, dataPoints) => {
  let result = null;
  el.triggerDataPoints.map((trigger) => {
    if (dataPoints[trigger['dataPointType']] === trigger.value) {
      result = el.text;
    } else {
      result = null;
    }
    return result;
  });
  return result;
};

const evaluateTypeTriggeredElement = (el, dataPoints) => {
  let result = null;
  el.triggerDataPoints.map((trigger) => {
    if (dataPoints[trigger['dataPointType']]) result = el.text;
    else result = null;

    return result;
  });
  return result;
};

const evaluateTimeTriggeredElement = (el) => {
  const timeTriggers = [{ value: 'Today' }];
  const dataPoints = { Today: moment().format('dddd') };
  let result = null;
  timeTriggers.map((trigger) => {
    result = replaceText(el.text, dataPoints);
    return result;
  });
  return result;
};

const PlotPoint = ({
  customerId,
  story,
  plotPoint,
  onDelete,
  user,
  userLoading,
  senders,
  senderId,
}) => {
  const defaultElement = {
    customerId: customerId,
    text: '',
    triggerDataPoints: [],
    senderId: senderId,
  };
  const [activeTab, setActiveTab] = useState('1');

  return (
    <div role="tabpanel">
      {/* Nav tabs */}
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              setActiveTab('1');
            }}
          >
            This Story
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              setActiveTab('2');
            }}
          >
            <span className="text-muted">Other Stories</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              setActiveTab('3');
            }}
          >
            <span className="text-muted">Suggestions</span>
          </NavLink>
        </NavItem>
      </Nav>
      {/* Tab panes */}
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <h4>Default</h4>
          {!plotPoint.defaultElement && (
            <CardBody className={'bg-gray-light'}>
              No default element found{' '}
              <ElementEditor
                customerId={customerId}
                story={story}
                element={defaultElement}
                isDefault={true}
                plotPoint={plotPoint}
                onModified={onDelete}
                user={user}
                userLoading={userLoading}
              />
            </CardBody>
          )}
          <DataElement
            customerId={customerId}
            story={story}
            plotPoint={plotPoint}
            element={plotPoint.defaultElement}
            bgColor="bg-gray"
            onDelete={onDelete}
            user={user}
            userLoading={userLoading}
            senders={senders}
          />

          <React.Fragment>
            <hr className="my-4" />
            <h4>
              Variants{' '}
              <ElementEditor
                customerId={customerId}
                story={story}
                element={defaultElement}
                isDefault={false}
                plotPoint={plotPoint}
                onModified={onDelete}
                user={user}
                userLoading={userLoading}
              />
            </h4>
          </React.Fragment>
          {plotPoint.additionalElements.length === 0 && (
            <CardBody className={'bg-gray-light'}>No variants found</CardBody>
          )}
          {plotPoint.additionalElements.map((ae, index) => (
            //eslint-disable-next-line
            <>
              {(senderId === null ||
                senderId === ae.senderId ||
                ae.senderId === null) && (
                <DataElement
                  key={index}
                  customerId={customerId}
                  story={story}
                  plotPoint={plotPoint}
                  element={ae}
                  bgColor="bg-gray-lighter"
                  onDelete={onDelete}
                  user={user}
                  userLoading={userLoading}
                  senders={senders}
                />
              )}
            </>
          ))}
        </TabPane>
        <TabPane tabId="2">Not yet implemented</TabPane>
        <TabPane tabId="3">
          <ContactsDataTable
            customerId={customerId}
            currentUser={user}
            userLoading={userLoading}
            senderId={senderId}
          />
        </TabPane>
      </TabContent>
    </div>
  );
};

const DataElement = ({
  customerId,
  story,
  plotPoint,
  element,
  bgColor,
  onDelete,
  user,
  userLoading,
  senders,
}) => {
  const [deleteElement] = useMutation(DELETE_ELEMENT);

  const deleteOption = {
    title: 'Are you sure?',
    text: 'Your will not be able to recover this Element!',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel!',
        value: null,
        visible: true,
        className: '',
        closeModal: false,
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: 'bg-danger',
        closeModal: false,
      },
    },
  };

  const handleDeleteElement = (element, isConfirm, swal) => {
    if (isConfirm) {
      deleteElement({
        variables: {
          id: element.id,
        },
        refetchQueries: [
          {
            query: STORYQUERYSTRING,
            variables: { storyId: story.id },
          },
        ],
      }).then((result) => {
        onDelete(result);
      });
      swal('Element Deleted!', 'Your Element has been deleted.', 'success');
    } else {
      swal('Cancelled', 'Your Element is safe!', 'error');
    }
  };
  return (
    element && (
      <CardBody className={bgColor + ' mb-1'}>
        <div className="float-right">
          <Swal
            options={deleteOption}
            callback={(isConfirm, swal) =>
              handleDeleteElement(element, isConfirm, swal)
            }
          >
            <em className="fa fa-times"></em>
          </Swal>
        </div>
        <div className={'float-right mr-2'}>
          <ElementEditor
            key={element.id}
            customerId={customerId}
            story={story}
            element={element}
            isDefault={element.plotPointAsDefaultId != null}
            plotPoint={plotPoint}
            onModified={onDelete}
            user={user}
            userLoading={userLoading}
          />
        </div>
        {element.text}
        <br />
        {element.triggerDataPoints.map((tdp) => {
          return (
            <Badge key={tdp.dataPointType} color="primary">
              {tdp.dataPointType} {tdp.value && " = '" + tdp.value + "'"}
            </Badge>
          );
        })}

        {element.senderId && (
          <Row>
            <Col>
              <Badge color="info">
                {getSenderName(element.senderId, senders)}
              </Badge>
            </Col>
          </Row>
        )}
        {!element.senderId && (
          <Row>
            <Col>
              <Badge color="info">All Senders</Badge>
            </Col>
          </Row>
        )}
      </CardBody>
    )
  );
};

const getSenderName = (senderId, senders) => {
  if (senders && senderId !== null) {
    if (senders.users.length > 0) {
      const x = senders.users.filter((s) => s.id === senderId);
      if (x.length > 0) return x[0].fullName;
    }
  }
};

const mapStateToProps = (state) => ({ customerId: state.customer.id });

export default withTranslation('translations')(
  connect(mapStateToProps)(StoryConfiguration)
);
