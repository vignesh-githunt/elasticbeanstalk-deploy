import React, { useEffect  } from 'react';
import PropTypes from 'prop-types';
// Morris.js
import 'morris.js.so/morris.css';
import 'morris.js.so/morris.js';

const MorrisChart=(props)=>{
    useEffect(()=>{
        drawChart();
       })

    const drawChart = () => {
        const element = { element: props.id };
        const data = { data: props.data };
        chart = new Morris[props.type]({
            ...element,
            ...data,
            ...props.options
        });
    }

    return (
        <div id={props.id} />
    )
}
MorrisChart.PropTypes = {
    /** id of the container element */
    id: PropTypes.string.isRequired,
    /** data to display */
    data: PropTypes.array.isRequired,
    /** morris option object */
    options: PropTypes.object.isRequired,
    /** chart type */
    type: PropTypes.oneOf(['Line', 'Area', 'Donut', 'Bar']).isRequired
}
export default MorrisChart;