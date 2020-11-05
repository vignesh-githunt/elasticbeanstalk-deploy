import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class DataPoint extends Component {

  static propTypes = {
    dataPoints: PropTypes.array,
  }

  render() {

    if (this.props.dataPoints.length === 0) return null;
    return <tr>
            <td>
              {this.props.dataPoints[0].dataPointType.replace(/([A-Z])/g, ' $1')}
            </td>
            <td>
              <ul className="list-unstyled" style={{marginBottom: 0}}>
                {this.props.dataPoints.map(dp => {
                  return <li key={dp.id}>
                    <strong>{dp.value}</strong> - <em>{dp.dataSource}</em>
                  </li>
                })}
              </ul>
            </td>
          </tr>
  }
}
