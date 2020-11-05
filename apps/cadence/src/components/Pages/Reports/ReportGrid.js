import React from "react";
import { useTable } from "react-table";
import {Alert, Table } from "reactstrap";

function GridRow({ row, rowKey }) {
    
    return (
      <tr {...row.getRowProps()}  key={rowKey}>
        {row.cells.map((cell, i) => {
          return (
            <td className="text-center pb-0 pt-0" key={i}>{cell.render("Cell")}</td>
          );
        })}
      </tr>
    );
  }

const ReportGrid = ({ columns, data, loading, error}) => {
    const {
        getTableProps,
        getTableBodyProps,
        rows,
        prepareRow,
        } = useTable({      
          columns,
          data,
        },
      );

     let tableId="users_table"

  return (
    <Table bordered
        {...getTableProps()}
        id={`${tableId}`}
        hover
        className="table table-striped table-bordered table-hover table-condensed"
        responsive
    >
      
      <tbody {...getTableBodyProps()}>
            {
              !loading && !error &&
              rows.slice(0, 10).map((row, i) => {
                prepareRow(row);
  
                return (
                  <GridRow
                    row={row}
                    key={i}
                  />
                );
              })
            }
            {error &&
              <tr>
                <td colSpan="7">
                  <Alert color="danger">
                    Failed to fetch the data
                  </Alert>
                </td>
              </tr>
            }
          </tbody>
    </Table>
  );
};

export default ReportGrid;