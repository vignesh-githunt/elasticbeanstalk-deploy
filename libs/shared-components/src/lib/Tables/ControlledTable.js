import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback
} from "react";
import { useTable, useSortBy, usePagination, useExpanded } from "react-table";

import Pagination from "./Pagination";
import "loaders.css";

const ControlledTable = ({
  initialState,
  tableId,
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  renderRowSubComponent
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    allColumns,
    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy }
  } = useTable(
    {
      columns,
      data,
      initialState: initialState,
      manualPagination: true,
      manualSortBy: true,
      pageCount: controlledPageCount
    },
    useSortBy,
    useExpanded,
    usePagination
  );

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize, sortBy });
  }, [fetchData, pageIndex, pageSize, sortBy]);

  const getSortingClassName = (sorted, isSortedDesc, disableSortBy) => {
    return !disableSortBy ? sorted ? (isSortedDesc ? "sorting_desc" : "sorting_asc") : "sorting" : "";
  };

  return (
    <div
      {...getTableProps()}
      id={`${tableId}_wrapper`}
      className="dataTables_wrapper dt-bootstrap4 no-footer"
    >
      <div className="row">
        <div className="col-sm-12 col-md-5">
          <div className="dataTables_length" id={`${tableId}_length`}>
            <label>
              Show{" "}
              <select
                name={`${tableId}_length`}
                aria-controls={tableId}
                className="custom-select custom-select-sm form-control form-control-sm"
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </label>
          </div>
        </div>
        <Pagination
          previousPage={previousPage}
          canPreviousPage={canPreviousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
        />
        {/* <div className="col-sm-12 col-md-7">
            <div id="DataTables_Table_1_filter" className="dataTables_filter">
              <label>
                Search:
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder=""
                  aria-controls="DataTables_Table_1"
                />
              </label>
            </div>
          </div> */}
      </div>
      <div className="row">
        <table
          {...getTableProps()}
          id={`${tableId}`}
          className="table w-100 dataTable no-footer dtr-inline"
        >
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={getSortingClassName(
                      column.isSorted,
                      column.isSortedDesc,
                      column.disableSortBy
                    )}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              let rowProps = Object.assign({}, row.getRowProps());
              delete(rowProps.role)
              return (
                <React.Fragment { ...rowProps }>
                  <tr
                    className={"" + (row.id % 2 ? "odd" : "even")}
                  >
                    {row.cells.map(cell => {
                      if(!cell.column.disableExpanded) {
                        return (
                          <td
                            {...cell.getCellProps()}
                            {...row.getToggleRowExpandedProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      } else {
                        return (
                          <td
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      }

                    })}
                  </tr>
                  {/*
                          If the row is in an expanded state, render a row with a
                          column that fills the entire length of the table.
                        */}
                  {row.isExpanded ? (
                    <tr>
                      <td colSpan={allColumns.length}>
                        {/*
                                Inside it, call our renderRowSubComponent function. In reality,
                                you could pass whatever you want as props to
                                a component like this, including the entire
                                table instance. But for this example, we'll just
                                pass the row
                              */}
                        {renderRowSubComponent({ row })}
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-5">
          <div
            className="dataTables_info"
            id={`${tableId}_info`}
            role="status"
            aria-live="polite"
          >
            {loading ? (
              <div className="line-scale">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <div>
                Showing {pageIndex + 1} to {(pageIndex + 1) * pageSize} of many
              </div>
            )}
          </div>
        </div>
        <Pagination
          previousPage={previousPage}
          canPreviousPage={canPreviousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
        />
      </div>
    </div>
  );
}
export default ControlledTable
