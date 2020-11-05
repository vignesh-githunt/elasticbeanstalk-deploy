/**
 * @author @Sk_khaja_moulali-gembrill
 * @version V11.0
 */

import React from "react";
import { Table } from "reactstrap";

const emailData = [
  {
    id: 1,
    name: "khaja",
    time_zone: "MST",
    owner: "Nil",
    last_activity: "Mar 1",
  },
  {
    id: 2,
    name: "moulali",
    time_zone: "CST",
    owner: "Nil",
    last_activity: "Mar 2",
  },
  {
    id: 3,
    name: "shaik",
    time_zone: "PST",
    owner: "Nil",
    last_activity: "Mar 3",
  },
  {
    id: 4,
    name: "ali",
    time_zone: "EST",
    owner: "Nil",
    last_activity: "Mar 4",
  },
];

const Schedules = (props) => {
  const emailDataList = emailData.map((ed) => {
    return (
      <>
        <tr key={ed.id}>
          <td>{ed.name}</td>
          <td>{ed.time_zone}</td>
          <td className="text-primary">{ed.owner}</td>
          <td>{ed.last_activity}</td>
        </tr>
      </>
    );
  });
  return (
    <div>
      <Table hovered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Time Zone</th>
            <th>Owner</th>
            <th>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {emailDataList.length > 0 ? emailDataList : "No Data Available"}
        </tbody>
      </Table>
    </div>
  );
};

export default Schedules;
