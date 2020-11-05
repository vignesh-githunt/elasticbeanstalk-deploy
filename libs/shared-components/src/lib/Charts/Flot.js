import $ from 'jquery';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';

// Flot Charts
import 'flot/jquery.flot.js';
import 'flot/jquery.flot.categories.js';
import 'flot/jquery.flot.pie.js';
import 'flot/jquery.flot.resize.js';
import 'flot/jquery.flot.time.js';
import 'jquery.flot.spline/jquery.flot.spline.js';
import 'jquery.flot.tooltip/js/jquery.flot.tooltip.min.js';

export const FlotChart=(props)=>{
    const flotElement = useRef();
     useEffect(() => {
        if(typeof $.plot === 'undefined')
        throw new Error('Flot plugin not present.');
        
        dreawChart();

         return () => {
            $(flotElement.current).data('plot').shutdown();
             }
     },[props])

     const dreawChart = (nextProps) => {
        const data = (nextProps && nextProps.data) || props.data;
         const options = (nextProps && nextProps.options) || props.options;
      $.plot(flotElement.current, data, options);
      }

     const setRef = node => {
         flotElement.current = node;
    }

    const style = {
        height: props.height,
        width: props.width
    };
    return (
        <div ref={flotElement} style={style} />
    );
}

FlotChart.propTypes = {
     /** data to display */
     data: PropTypes.array.isRequired,
     /** flot options object */
     options: PropTypes.object.isRequired,
     /** height of the container element */
     height: PropTypes.string,
     /** width of the container element */
     width: PropTypes.string
}

FlotChart.defaultProps = {
    height: '300px',
    width: '100%'
}

export default FlotChart;