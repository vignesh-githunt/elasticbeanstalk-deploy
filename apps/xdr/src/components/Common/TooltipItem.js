import React, { useState } from "react";
import {Tooltip} from 'reactstrap';

 const TooltipItem = (props) => {

    const _id = useState( "id4tooltip_" +
    new Date().getUTCMilliseconds() +
    (Math.floor(Math.random() * 10) + 1))

    const [tooltipOpen,setTooltipOpen] = useState(false);
    const toggle = (e) => setTooltipOpen(!tooltipOpen);
   
    return [
        <Tooltip
          {...props}
          isOpen={tooltipOpen}
          toggle={toggle}
          target={_id}
          key="1"
        >
          {props.content}
        </Tooltip>,
        React.cloneElement(React.Children.only(props.children), {
          id: _id,
          key: "2",
        }),
      ];
 }
 
 export default TooltipItem;