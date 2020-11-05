/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import React, { useState } from "react";
import { useTable, useRowSelect, usePagination } from 'react-table';
import ScrollArea from "react-scrollbar";

import { Alert, Button, CardFooter, Table } from "reactstrap";
import { useSortBy } from '@nextaction/components';
import { default as TablePagination } from "../../Common/Pagination";


const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

function GridRow({ row, handleRowToolbarButton, rowKey, prospectActions }) {

  const [showCell, setShowCell] = useState(true);// To hide Call Outcome, Email Outcome, Last Contact on row mouse over and to show the same on mouse out
  const prospect = row.original;

  return (
    <tr {...row.getRowProps()} onMouseOver={() => setShowCell(!showCell)} onMouseOut={() => setShowCell(!showCell)} key={rowKey}>
      {row.cells.map((cell, i) => {
        return (
          <td key={i} style={{ width: cell.column.width, display: ['Call Outcome', 'Email Outcome', 'Last Contact'].indexOf(cell.column.Header) !== -1 ? (showCell ? "" : "none") : "" }}>{cell.render("Cell")}</td>
        );
      })}
      <td  {...row.getRowProps()} className="text-center pb-0 pt-0" style={{ display: (showCell ? "none" : ""), verticalAlign: 'middle' }} colSpan="3">
        <Button color="outline" title="Dial" onClick={() => handleRowToolbarButton(prospectActions.DIAL, prospect)}><i className="fas fa-phone-alt fa-lg text-success"></i></Button>
        <Button color="outline" title="Email" onClick={() => handleRowToolbarButton(prospectActions.EMAIL, prospect)}><i className="fas fa-envelope fa-lg text-success"></i></Button>&nbsp;&nbsp;|&nbsp;&nbsp;
        <Button color="outline" title="Assign to Cadence" onClick={() => handleRowToolbarButton(prospectActions.ASSIGN_TO_CADENCE, prospect)}><i className="fas fa-plus fa-lg text-primary"></i></Button>
        <Button color="outline" title="Tag" onClick={() => handleRowToolbarButton(prospectActions.TAG, prospect)}><i className="fa fa-tag fa-lg text-primary"></i></Button>
        <Button color="outline" title="Resume" onClick={() => handleRowToolbarButton(prospectActions.RESUME, prospect)}><i className="fas fa-play fa-lg text-primary"></i></Button>
        <Button color="outline" title="Pause" onClick={() => handleRowToolbarButton(prospectActions.PAUSE, prospect)}><i className="fas fa-pause fa-lg text-primary"></i></Button>&nbsp;&nbsp;|&nbsp;&nbsp;
        <Button color="outline" title="Move to Another Cadence" onClick={() => handleRowToolbarButton(prospectActions.MOVE_TO_ANOTHER_CADENCE, prospect)}><i className="fas fa-arrows-alt fa-lg text-warning"></i></Button>
        <Button color="outline" title="Exit Cadence" onClick={() => handleRowToolbarButton(prospectActions.EXIT_CADENCE, prospect)}><i className="fas fa-sign-out-alt fa-lg text-warning"></i></Button>&nbsp;&nbsp;|&nbsp;&nbsp;
        <Button color="outline" title="Delete" onClick={() => handleRowToolbarButton(prospectActions.DELETE, prospect)}><i className="fas fa-trash fa-lg text-danger"></i></Button>
      </td>
    </tr>
  );
}

function ProspectsGrid({ columns, data, prospectData, fetchData, loading, error, pageCount: controlledPageCount, pageSize: controlledPageSize, currentPageIndex, handleRowToolbarButton, prospectActions, handleRefresh }) {
  // Use the state and functions returned from useTable to build your UI
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
    // Get the state from the instance
    state: { selectedRowIds, pageIndex, pageSize }
  } = useTable({
    columns,
    data,
    prospectData,
    initialState: { pageIndex: currentPageIndex, pageSize: controlledPageSize }, // Pass our hoisted table state
    manualPagination: true, // Tell the usePagination
    // hook that we'll handle our own data fetching
    // This means we'll also have to provide our own
    // pageCount.
    pageCount: controlledPageCount,
  },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  );

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => fetchData({ pageIndex, pageSize }), [pageIndex, pageSize]);

  // This line is required to reset the page offset when prospect page tab(ALL, Paused, Active, Unassigned) changed
  React.useEffect(() => gotoPage(currentPageIndex), [currentPageIndex]);

  let tableId = "prospects-table"
  // Render the UI for your table
  return (
    <>
      <div {...getTableProps()} id={`${tableId}_wrapper`} className="table-responsive">
        <Table striped className="bb"
          {...getTableProps()}
          id={`${tableId}`}
          hover
          style={{ minWidth: "800px" }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map((column, index) =>
                    <th {...column.getHeaderProps()} style={{ width: column.width, whiteSpace: "nowrap" }} >
                      {column.render("Header")}
                      {index != 0 ? (
                        <span className="ml-2">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <span className="fa-stack">
                                <i className="fas fa-sort-down fa-stack-1x" />
                                <i className="fas fa-sort-up fa-stack-1x text-muted" />
                              </span>
                            ) : (
                                <span className="fa-stack">
                                  <i className="fas fa-sort-down fa-stack-1x text-muted" />
                                  <i className="fas fa-sort-up fa-stack-1x" />
                                </span>
                              )
                          ) : (
                              <i className="fas fa-sort text-muted" />
                            )}
                        </span>
                      ) : (<i />)}
                    </th>
                  )
                }
              </tr>
            ))}
          </thead>
        </Table>
        <ScrollArea
          speed={0.8}
          className="area"
          contentClassName="content"
          horizontal={true}
          style={{ minHeight: "440px", maxHeight: "792px", minWidth: "800px" }}
        >
          <Table>
            <tbody {...getTableBodyProps()} >
              {
                !loading && !error &&
                rows.slice(0, 10).map((row, i) => {
                  prepareRow(row);

                  return (
                    <GridRow
                      row={row}
                      handleRowToolbarButton={handleRowToolbarButton}
                      key={i}
                      prospectActions={prospectActions}
                    />
                  );
                })
              }
              {error &&
                <tr>
                  <td colSpan="9">
                    <Alert color="danger" className="text-center" role="alert">
                      <h4>
                        <i className="fas fa-exclamation-circle fa-lg mr-2"></i>Failed to fetch data
                      </h4>
                    </Alert>
                  </td>
                </tr>
              }
            </tbody>
          </Table>
        </ScrollArea>
      </div>
      <CardFooter>
        <TablePagination
          loading={loading}
          handleFirstPage={() => gotoPage(0)}
          handleLastPage={() => gotoPage(pageCount - 1)}
          totalPages={(pageOptions.length)}
          pageIndex={pageIndex + 1}
          handleGoToPage={(pageNumber) => gotoPage(pageNumber)}
          pageSize={pageSize}
          handleSetPageSize={(pageSize) => setPageSize(pageSize)}
          canPreviousPage={!canPreviousPage}
          canNextPage={!canNextPage}
          previousPage={() => previousPage()}
          nextPage={() => nextPage()}
          handleRefresh={handleRefresh}
        >
        </TablePagination>
      </CardFooter>
    </>
  );
}

export default ProspectsGrid;