import React, { Component } from 'react';
import DefaultAvatar from '../../../images/default-avatar.jpg'

export class AvatarCell extends Component {

  render () {
    const { row, col } = this.props;
    return <img className='table-avatar' alt="alt" src={row[col.key] || DefaultAvatar} />
  };
}
