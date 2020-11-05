import React from "react";
import { Table} from "reactstrap";

const DataElement = ({ element }) => {
  return (
    <li>
      <strong>
        Type: {element.triggerDataPoints
          .map(tdp => tdp.dataPointType)
          .join(", ") || "Default"}
      </strong>{" "}
      - {element.text}
    </li>
  );
}

const PlotPoint = ({ plotPoint }) => {
  return (
    <tr>
      <td>{plotPoint.name}</td>
      <td>
        <ul className="list-unstyled" style={{ marginBottom: 0 }}>
          <DataElement element={plotPoint.defaultElement} />
          {plotPoint.additionalElements.map((ae,index) => (
            <DataElement key={index} element={ae} />
          ))}
        </ul>
      </td>
    </tr>
  );
}

const PlotPoints = ({ story }) => {
  return (
    <Table striped bordered hover responsive>
      <tbody>
        {story.plotPoints.map(plotPoint => (
          <PlotPoint key={plotPoint.id} plotPoint={plotPoint} />
        ))}
      </tbody>
    </Table>
  );
}

export default PlotPoints;