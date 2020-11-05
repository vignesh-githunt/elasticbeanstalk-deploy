// SPARKLINE
// -----------------------------------
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
// Sparklines
import 'jquery-sparkline/jquery.sparkline.min.js';

const RESIZE_EVENT = 'resize.sparkline';

export const Sparkline=(props)=>{
    const INITIAL_STATE = {values: props.values,options: props.options || {resize: true}}
    const [myState,setMyState] = useState(INITIAL_STATE)
    const {values,options } = myState
     
    const element = useRef();

    useEffect(() => {
        normalizeParams();
    },[])

    const normalizeParams=()=> {
        let { options, values } = props;

        options.disableHiddenCheck = true; // allow draw when initially is not visible
        options.type = options.type || 'bar'; // default chart is bar
        values = Array.isArray(values) ? values : values.split(','); // support array of csv strings
       setMyState({options, values})
    }

    useEffect(() => {
    
          // init sparkline
          $(element.current).sparkline({values, options});

          // allow responsive
          if (options.resize) {
              $(window).on(RESIZE_EVENT, () => {
                  $(element.current).sparkline({values, options});
                 
              });
              $(".section-container").on(RESIZE_EVENT, () => {
                  $(element.current).sparkline(values, options);
                
              });
          }
        return ()=> {
          $(window).off(RESIZE_EVENT);
          $(element.current).sparkline('destroy');
          }
    })
    const setRef = node => {
         element.current  = node;
    }
    const {tag:Tag} = props;
    return (
        <Tag ref={setRef} {...props}></Tag>
    )

}

Sparkline.propTypes = {
    /** sparkline options object */
    options: PropTypes.object.isRequired,
    /** tag to use, defaults to div */
    tag: PropTypes.string,
    /** values to display, allows array or csv string */
    values: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.array.isRequired
    ])
}

Sparkline.defaultProps = {
    options: {},
    tag: 'div'

}

