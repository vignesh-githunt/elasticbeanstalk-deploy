import React from 'react';
import { Link } from "react-router-dom";
import { useSortBy, useTable } from 'react-table';
import { Alert, Table } from "reactstrap";
import { Scrollable } from "@nextaction/components";


const columns = [
  {
    Header: "Contact Name",
    accessor: "contactName",
    width: "10%",
    Cell: function (props) {
      return (
        <span>
          <b>
            <Link to={"/prospects/" + props.row.original.id}>
              {props.value}
            </Link>
          </b>
        </span>
      );
    }
  },
  {
    Header: "Account Name",
    accessor: "accountName",
    width: "10%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  },
  {
    Header: "Title",
    accessor: "title",
    width: "10%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  },
  {
    Header: "Touch",
    accessor: "currentTouchType",
    width: "10%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  },
  {
    Header: "Task",
    accessor: "taskMode",
    width: "10%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  },
  {
    Header: "Phone #",
    accessor: "phone",
    width: "15%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  },
  {
    Header: "Email",
    accessor: "email",
    width: "15%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  },
  {
    Header: "Cadence Name",
    accessor: "campaignName",
    width: "10%",
    Cell: function (props) {
      let rowData = props.row.original;
      let cadence;
      if (
        rowData.associations && rowData.associations.cadence
      ) {
        cadence = rowData.associations.cadence[0].id;
        return (
          <span>
            <b>
              <Link to={"/cadences/" + cadence}>
                {props.value}
              </Link>
            </b>
          </span>
        );
      }
      else return <span></span>
    }
  },
  {
    Header: "Touch #",
    accessor: "currentTouchId",
    width: "10%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  }
]

function AccountTasksGrid({ data, taskData, loading, error }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageSize }
  } = useTable({
    columns,
    data,
    taskData,
  },
    useSortBy
  );

  let tableId = "account_task_table";
  return (
    <>
      <Table
        {...getTableProps()}
        id={`${tableId}`}
        hover
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <th {...column.getHeaderProps()} style={{ width: column.width }}>
                    {column.render("Header")}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
      </Table>
      <Scrollable height={null} style={{ minHeight: "440px", maxHeight: "792px" }}>
        <Table>
          <tbody {...getTableBodyProps()}>
            {!loading &&
              !error &&
              rows.length === 0 &&
              (
                <tr>
                  <td colSpan="7">
                  <Alert color="danger" className="mb-0 text-center">
                      <h4>
                        <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                          No Tasks Available
                        </h4>
                    </Alert>
                  </td>
                </tr>
              )}
            {!loading &&
              !error &&
              rows.slice(0, pageSize).map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} >
                    {row.cells.map((cell, j) => {
                      return (
                        <td {...cell.getCellProps()} style={{ width: cell.column.width }}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            {error && (
              <tr>
                <td colSpan="7">
                <Alert color="danger" className="mb-0 text-center">
                    <h4>
                      <i className="fas fa-exclamation-circle fa-lg mr-2"></i>Failed to fetch data
                        </h4>
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Scrollable>
    </>
  );
}

export default AccountTasksGrid;