import React from "react";
import { Badge, CardBody } from "reactstrap";

export const ElementPreview = ({
         elementText,
         selected,
         showTriggerDataPoints = false,
         triggerDataPoints,
       }) => {
         return (
           <>
             {elementText && (
               <CardBody
                 className={
                   selected === true
                     ? "bg-gray-dark mb-1"
                     : "bg-gray-lighter mb-1"
                 }
               >
                 {elementText}
                 <br />
                 {showTriggerDataPoints &&
                   triggerDataPoints.map((tdp) => {
                     return (
                       <Badge key={tdp.dataPointType} color="primary">
                         {tdp.dataPointType}{" "}
                         {tdp.value && " = '" + tdp.value + "'"}
                       </Badge>
                     );
                   })}
               </CardBody>
             )}
           </>
         );
       };
