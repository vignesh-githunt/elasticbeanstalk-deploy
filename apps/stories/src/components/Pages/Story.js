import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import StoryDetails from '../StoryDetails';


class Story extends Component {

  state = {}

  render() {
      return (
          <StoryDetails storyId={this.props.match.params.id} />
          );
  }
}

export default withTranslation('translations')(Story);
