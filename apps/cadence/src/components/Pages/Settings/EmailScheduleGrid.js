/*
 * @author @rManimegalai
 * @version V11.0
 */
import React from "react";
import { useRowSelect, useTable, usePagination } from 'react-table';
import ScrollArea from "react-scrollbar";

import { CardFooter, Table } from 'reactstrap';

import { default as TablePagination } from "../../Common/Pagination";

const EmailScheduleCheckBox = React.forwardRef(
  ({ emailschedule, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = emailschedule
    }, [resolvedRef, emailschedule])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)
function EmailScheduleGrid({ columns, currentPageIndex, data, emailScheduleData, error, fetchData, loading, pageCount: controlledPageCount, pageSize: controlledPageSize, rowSelectedValue, handleRefresh }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    emailScheduleData,
    initialState: { pageIndex: currentPageIndex, pageSize: controlledPageSize },
    manualPagination: true,
    pageCount: controlledPageCount,
  },
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'schedule_select',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <EmailScheduleCheckBox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),

          Cell: ({ row }) => (
            <div>
              <EmailScheduleCheckBox {...row.getToggleRowSelectedProps()} onClick={() => (rowSelectedValue(row.original.id))} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  );
  React.useEffect(() => fetchData({ pageIndex, pageSize }), [pageIndex, pageSize]);

  React.useEffect(() => gotoPage(currentPageIndex), [currentPageIndex]);

  let tableId = "email_schedule_table"

  return (
    <>
      <div {...getTableProps()} id={`${tableId}_wrapper`} className="table-responsive">
        <Table
          hover
          {...getTableProps()}
          id={`${tableId}`}
          style={{ minWidth: "800px" }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map((column) =>
                    <th {...column.getHeaderProps()} style={{ width: column.width, whiteSpace: "nowrap" }} >
                      {column.render("Header")}
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
          style={{ minHeight: "230px", maxHeight: "414px", minWidth: "800px" }}
        >
          <Table>
            <tbody {...getTableBodyProps()}>
              {
                !loading && !error &&
                rows.slice(0, 10).map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="email-row" key={i}>
                      {row.cells.map((cell, i) => <td key={i} style={{ width: cell.column.width }}>{cell.render("Cell")}</td>)}
                    </tr>
                  );
                })
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
        />
      </CardFooter>
    </>

  );
}
export default EmailScheduleGrid;