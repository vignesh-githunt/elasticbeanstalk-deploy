import React, { Component } from 'react'

export class ImageCell extends Component {

  render () {
    const { row, col } = this.props;
    let imageSources = row[col.key];
    if (!Array.isArray(imageSources)) {
      imageSources = [imageSources]
    }

    if (!imageSources.length || (imageSources.length === 1 && !imageSources[0])) return '';

    const styles = {
      marginRight: '6px'
    };
    if (col.props.maxWidth) {
      styles.maxWidth = col.props.maxWidth;
    }
    return <React.Fragment>
      {imageSources.map(src => <img key={src} src={src} alt="" style={styles} />)}
    </React.Fragment>
  }
}
