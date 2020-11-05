import React from 'react';
import { Link } from "react-router-dom";
import { useSortBy, useTable } from 'react-table';
import { Alert, Table } from "reactstrap";
import { Scrollable } from "@nextaction/components";

const columns = [
  {
    Header: "Cadences",
    accessor: "name",
    width: "20%",
    Cell: function (props) {
      return (
        <span>
          <b>
            <Link to={"/cadences/" + props.row.original.id}>
              {props.value}
            </Link>
          </b>
        </span>
      );
    }
  },
  {
    Header: "Status",
    accessor: "status",
    width: "20%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  },
  {
    Header: "Owner",
    accessor: "user",
    width: "15%",
    Cell: function (props) {
      let rowData = props.row.original;
      let user = props.cadencesData.accounts.includedAssociations.user.find(
        (user) => user.id === rowData.associations.user[0].id
      );
      return (
        <span>
          {user.displayName}
        </span>
      );
    }
  },
  {
    Header: "Created Date",
    accessor: "createdDate",
    width: "15%",
    Cell: function (props) {
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let date = new Date();
      let date1 = new Date(props.value);
      if (date1.getFullYear() == date.getFullYear()) {
        return months[date1.getMonth()] + ' ' + date1.getDate();
      }
      else {
        return new Date(props.value).toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).replace(',', '');
      }
    }
  }
]

function AccountCadencesGrid({ data, cadencesData, loading, error }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageSize },
  } = useTable({
    columns,
    data,
    cadencesData,
  },
    useSortBy
  );

  let tableId = "account_cadence_table";
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
                          No Cadences Available
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

export default AccountCadencesGrid;
