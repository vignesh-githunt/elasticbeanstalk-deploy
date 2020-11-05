import React, { useState } from "react";
import { usePagination, useRowSelect, useTable} from 'react-table';
import {Alert, Button, CardFooter, Table } from "reactstrap";
import {default as TablePagination } from "../../Common/Pagination";

import { useSortBy } from '@nextaction/components';

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

function GridRow({ row, handleRowToolbarButton, rowKey, prospectActions}) {

  const [showCell, setShowCell] = useState(true);
  const prospect = row.original;

  return (
    <tr {...row.getRowProps()} onMouseOver={() => setShowCell(!showCell)} onMouseOut={() => setShowCell(!showCell)} key={rowKey}>
      {row.cells.map((cell, i) => {
        return (
          <td key={i} style={['Call Outcome', 'Email Outcome'].indexOf(cell.column.Header) !== -1 ? { display: (showCell ? "" : "none") } : {}}>{cell.render("Cell")}</td>
        );
      })}
      <td  {...row.getRowProps()} className="text-center pb-0 pt-0" style={{ display: (showCell ? "none" : ""), verticalAlign: 'middle' }} colSpan="3">
      <Button color="outline" title="Dial" onClick={() => handleRowToolbarButton(prospectActions.DIAL, prospect)}><i className="fas fa-phone-alt fa-lg text-success"></i></Button>
        <Button color="outline" title="Email" onClick={() => handleRowToolbarButton(prospectActions.EMAIL, prospect)}><i className="fas fa-envelope fa-lg text-success"></i></Button>&nbsp;&nbsp;|&nbsp;&nbsp;
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

function CadenceDataGrid({ columns, data, prospectData, fetchData, loading, error, pageCount: controlledPageCount, pageSize: controlledPageSize, currentPageIndex, handleRowToolbarButton, prospectActions }) {
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
    
  );

  let tableId = "prospects-table"
  // Render the UI for your table
  return (
    <>
      <Table className="border" striped
        {...getTableProps()}
        id={`${tableId}`}
        hover
        responsive
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column,index) =>
                  <th {...column.getHeaderProps()} style={{ width: column.width }} >
                    {column.render("Header")}
                    { index!=0?(
                      <span className="ml-2">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="fa fa-sort-down"/>
                          ) : (
                              <i className="fa fa-sort-up"/>
                            )
                        ) : (
                            <i className="fa fa-sort text-muted"/>
                          )}
                      </span>
                    ):(<i/>)}
                  </th>
                )
              }
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {!loading &&
                !error &&
                rows.length === 0 &&
                (
                  <tr>
                    <td colSpan="4" className="text-center mb-0">
                    <Alert color="danger">
                    <i className="fas fa-exclamation-circle fa-lg mr-2"></i>{" "}
                    No prospects available
                  </Alert>
                    </td>
                  </tr>
                )}
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
              <td colSpan="4" className="text-center mb-0">
                <Alert color="danger">
                  Failed to fetch the data
                </Alert>
              </td>
            </tr>
          }
        </tbody>
      </Table>
      <CardFooter>
        <TablePagination
          loading={loading}
          handleFirstPage={()=>gotoPage(0)}
          handleLastPage={()=>gotoPage(pageCount - 1)}
          totalPages={(pageOptions.length)}
          pageIndex={pageIndex + 1}
          handleGoToPage={(pageNumber)=>gotoPage(pageNumber)}
          pageSize={pageSize}
          handleSetPageSize={(pageSize)=>setPageSize(pageSize)}
          canPreviousPage={!canPreviousPage}
          canNextPage={!canNextPage}
          previousPage={() => previousPage()}
          nextPage={() => nextPage()}
        >         
        </TablePagination>
      </CardFooter>
    </>
  );
}

export default CadenceDataGrid;