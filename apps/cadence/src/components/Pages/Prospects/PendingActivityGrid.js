/**
 * @author ranbarasan82
 * @version V11.0
 */
import React from "react";
import { useTable } from "react-table";
import { Table } from 'reactstrap';

function PendingActivityRow({ row, rowKey }) {

  return (
    <tr {...row.getRowProps()} className="activity-row" key={rowKey}>
      {row.cells.map((cell, i) => {
        return (          
          <td key={i}>{cell.render("Cell")}</td>
        );
      })}
    </tr>
  );
}

function PendingActivityGrid({ columns, data, activityData, loading, error }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    activityData,
    manualPagination: false,
  },
    hooks => {
      hooks.visibleColumns.push(columns => [...columns])
    }
  );

  let tableId = "pending_activity_table"
  return (<>
    <div className="row">
      <Table
        {...getTableProps()}
        id={`${tableId}`}
        className="table w-100 dataTable no-footer dtr-inline table-bordered"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {

                return (
                  <th {...column.getHeaderProps()} style={{ width: column.width }}>
                    {column.render("Header")}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            !loading && !error &&
            rows.slice(0, 10).map((row, i) => {
              prepareRow(row);
              return (
                <PendingActivityRow
                  row={row}
                  key={i}
                />
              );
            })
          }
        </tbody>
      </Table>
    </div>
  </>
  );
}
export default PendingActivityGrid;