import React, { useState, useContext } from 'react';
import { withTranslation } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Nav, NavItem, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import STORIES_QUERY from '../queries/StoriesQueryNew';
import TOGGLE_STORY_PAUSED_MUTATION from '../mutations/stories/ToggleStoryPausedMutation';
import DELETE_STORY from '../mutations/DeleteStory';
import StoryEditor from '../Stories/StoryEditor';
import { connect } from 'react-redux';
import bg3 from '../../images/bg3.jpg';
import p09 from '../../images/gmail-round.png';

import Swal from '../Elements/Swal';

import UserContext from '../UserContext';

const SubMenu = () => {
  const [selectedSection] = useState('Explore');

  return (
    <div className="content-heading submenu">
      <Col xl={2} style={{ paddingLeft: '0px' }}>
        <div>
          Stories
          <small>{selectedSection}</small>
        </div>
      </Col>
      <Col xl={10}>
        <nav className="navbar navbar-expand-lg subnavbar">
          <Nav navbar className="mr-auto flex-column flex-lg-row nav-tabs">
            <NavItem active>
              <Link className="nav-link" to="/stories">
                Explore
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/stories/messagequeue">
                Message Queue
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/stories/personalization">
                Personalization
              </Link>
            </NavItem>
            {/* <NavItem>
              <Link className="nav-link" to="/stories/messagebuilder">
                Message Builder
              </Link>
            </NavItem> */}
          </Nav>
        </nav>
      </Col>
    </div>
  );
};

const Stories = ({ customerId }) => {
  const { user, loading: userLoading } = useContext(UserContext);

  const { data, loading } = useQuery(STORIES_QUERY, {
    variables: { filter: { customerId: customerId || user.companyId } },
    skip: userLoading,
  });

  const [togglePaused] = useMutation(TOGGLE_STORY_PAUSED_MUTATION, {
    refetchQueries: ['v3_Customer_Stories'],
  });

  const [deleteStory] = useMutation(DELETE_STORY);

  const deleteOption = {
    title: 'Are you sure?',
    text: 'Your will not be able to recover this Story!',
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

  const handleDelete = (story, isConfirm, swal) => {
    if (isConfirm) {
      if (story._storyContactsMeta.count > 0) {
        swal(
          'Cancelled',
          'The ' +
            story.name +
            ' Story is could not be deleted. It has ' +
            story._storyContactsMeta.count +
            ' Contacts pending!',
          'error'
        );
        return false;
      } else {
        deleteStory({
          variables: {
            id: story.id,
          },
          refetchQueries: ['v3_Customer_Stories'],
        });
        swal(
          story.name + ' Deleted!',
          'Your Story has been deleted.',
          'success'
        );
      }
    } else {
      swal('Cancelled', 'Your Story is safe!', 'error');
    }
  };

  if (loading) return <i className="fa fa-spin fa-2x fa-spinner"></i>;

  if (!data) return null;

  const stories = data && (data.v3_Customer_Stories || []);

  const toggleStoryStatus = (id, status) => {
    if (status === 'play') {
      togglePaused({ variables: { id: id, pausedAt: null } });
    } else {
      togglePaused({ variables: { id: id, pausedAt: new Date() } });
    }
  };
  const StoryButton = ({ story }) => {
    if (story.pausedAt) {
      return (
        <button
          className="btn btn-secondary"
          onClick={() => toggleStoryStatus(story.id, 'play')}
        >
          <i className={'fa fa-play text-muted'}></i>
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-secondary"
          onClick={() => toggleStoryStatus(story.id, 'pause')}
        >
          <i className={'fa fa-pause text-primary'}></i>
        </button>
      );
    }
  };

  const defaultStory = {
    name: '',
    priority: stories.length + 1,
  };

  return (
    <ContentWrapper>
      <SubMenu />
      {/* <Row>
        <Col xl={12}>
          <Card className="card-defaul card-group">
            <CardHeader>
              <div className={"float-right text-right"}>
                <button className="btn btn-primary btn-sm" type="button">
                  Create new
                </button>
              </div>
              <h4>Stories</h4>
            </CardHeader>
            <CardBody> */}
      <Row className="mb-2">
        <Col cl={12}>
          <StoryEditor
            customerId={customerId || user.companyId}
            story={defaultStory}
            className="pull-right"
          />
        </Col>
      </Row>
      <Row>
        {stories.map((story) => {
          return (
            <Col xl={4} key={story.id}>
              <div className="card">
                <div className="half-float ie-fix-flex">
                  <img className="img-fluid" src={bg3} alt={story.name} />
                  <div className="half-float-bottom">
                    <img
                      className="img-thumbnail circle thumb128"
                      src={p09}
                      alt={story.name}
                    />
                  </div>
                </div>
                <div className="card-body text-center">
                  <h3 className="m-0">
                    {story.name}
                    {story.pausedAt && (
                      <span className="text-muted ml-1">(Paused)</span>
                    )}
                  </h3>
                  <p className="text-muted">Default Story</p>
                  <div className="btn-group">
                    <StoryButton story={story} />
                    <StoryEditor
                      customerId={customerId || user.companyId}
                      story={story}
                    />
                    <Link
                      to={'/stories/' + story.id}
                      className="btn btn-secondary"
                    >
                      <i className="fa fa-eye mr-2"></i>View
                    </Link>
                    <Link
                      to={'/stories/' + story.id + '/configuration'}
                      className="btn btn-secondary"
                    >
                      <i className="fa fa-cogs mr-2"></i>Edit Content
                    </Link>
                    <Swal
                      options={deleteOption}
                      callback={(isConfirm, swal) =>
                        handleDelete(story, isConfirm, swal)
                      }
                      className="btn btn-outline-danger"
                    >
                      <i className={'fa fa-trash-alt'}></i>
                    </Swal>
                  </div>
                </div>
                <div className="card-body text-center bg-gray-dark">
                  <div className="row">
                    <div className="col-3">
                      <h3 className="m-0">{story.priority}</h3>
                      <p className="m-0">Priority</p>
                    </div>
                    <div className="col-3">
                      <h3 className="m-0">
                        -{/* story.matchingAccountsCount */}
                      </h3>
                      <p className="m-0">Accounts</p>
                    </div>
                    <div className="col-3">
                      <h3 className="m-0">
                        -{/*story.matchingContactsCount */}
                      </h3>
                      <p className="m-0">Contacts</p>
                    </div>
                    <div className="col-3">
                      <h3 className="m-0">
                        -{/* story._storyContactsMeta.count */}
                      </h3>
                      <p className="m-0">Story Contacts</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* <StoriesList /> */}
      {/* </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </Col>
      </Row> */}
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({ customerId: state.customer.id });

export default withTranslation('translations')(
  connect(mapStateToProps)(Stories)
);
