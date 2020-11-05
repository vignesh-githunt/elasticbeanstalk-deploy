import React from 'react';
import { Link } from "react-router-dom";
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
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
    Header: "Cadence",
    accessor: "cadence",
    width: "10%",
    Cell: function (props) {
      let rowData = props.row.original;
      let cadence;
      if (
        rowData.associations && rowData.associations.cadence &&
        props.prospectsData.prospect.includedAssociations.cadence
      ) {
        cadence = props.prospectsData.prospect.includedAssociations.cadence.find(
          (cadence) => cadence.id == rowData.associations.cadence[0].id
        );
        return (
          <span>
            <b>
              <Link to={"/cadences/" + cadence.id}>
                {cadence.multiTouchName}
              </Link>
            </b>
          </span>
        );
      }
      else return <span></span>
    }
  },
  {
    Header: "Touch",
    accessor: "touch",
    width: "10%",
    Cell: function (props) {
      let touch;
      if (props.prospectsData && props.prospectsData.prospect && props.prospectsData.prospect.includedAssociations && props.prospectsData.prospect.includedAssociations.touch) {
        touch = props.prospectsData.prospect.includedAssociations.touch.find((touch) => touch.id);
        return (
          <span>{touch.touchType}</span>
        );
      }
      else return <span></span>
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
    Header: "Created Date",
    accessor: "createdDate",
    width: "10%",
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
  },
  {
    Header: "Outcome",
    accessor: "outcome",
    width: "15%",
    Cell: function (props) {
      return (
        <span>
          {props.value}
        </span>
      );
    }
  }
]

function AccountProspectsGrid({ data, prospectsData, loading, error }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    selectedFlatRows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { selectedRowIds, pageIndex, pageSize }
  } = useTable({
    columns,
    data,
    prospectsData
  },
    useSortBy,
    usePagination,
    useRowSelect
  );

  let tableId = "account_prospect_table";
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
                        <i className="fas fa-exclamation-circle fa-lg mr-2"></i>No Prospects Available
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
                      <i className="fas fa-exclamation-circle fa-lg mr-2"></i> Failed to fetch data
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

export default AccountProspectsGrid;
