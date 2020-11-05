/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React, { useEffect } from "react";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import ScrollArea from "react-scrollbar";
import { Alert, CardFooter, Table } from "reactstrap";
import { default as TablePagination } from "../../Common/Pagination";

function SyncLogGrid({
  columns,
  currentPageIndex,
  data,
  error,
  fetchData,
  loading,
  syncLogData,
  pageCount: controlledPageCount,
  pageSize: controlledPageSize,
  handleSort,
  handleRefresh,
  sortBy: sortByCol,
  orderBy
}) {
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
    state: { pageIndex, pageSize, sortBy }
  } = useTable({
    columns,
    data,
    syncLogData,
    initialState: {
      pageIndex: currentPageIndex,
      pageSize: controlledPageSize,
      sortBy: [
        {
          id: sortByCol,
          desc: orderBy === "desc"
        }
      ]
    },
    manualPagination: true,
    pageCount: controlledPageCount,
    manualSortBy: true,
    disableSortRemove: true
  },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        ...columns,
      ])
    }
  );
  useEffect(() => fetchData({ pageIndex, pageSize }), [pageIndex, pageSize]);

  useEffect(() => gotoPage(currentPageIndex), [currentPageIndex]);

  useEffect(() => {
    if (sortBy.length > 0) { handleSort(sortBy[0].id, sortBy[0].desc); }
  }, [sortBy]);

  let tableId = "sync_log_table"
  return (
    <>
      <div {...getTableProps()} id={`${tableId}_wrapper`} className="table-responsive">
        <Table
          hover
          {...getTableProps()}
          id={`${tableId}`}
          style={{ minWidth: "1250px" }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.width, whiteSpace: "nowrap" }} >
                      {column.render("Header")}
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
                        ) : !column.disableSortBy && (
                          <i className="fas fa-sort text-muted" />
                        )}
                      </span>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
        </Table>
        <ScrollArea
          speed={0.8}
          className="area"
          contentClassName="content"
          horizontal={true}
          style={{ minHeight: "230px", maxHeight: "414px", minWidth: "1250px" }}
        >
          <Table>
            <tbody {...getTableBodyProps()}>
              {
                !loading && !error &&
                rows.slice(0, pageSize).map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="sync-log-row" key={i}>
                      {row.cells.map((cell, i) => <td key={i} style={{ width: cell.column.width, whiteSpace: "nowrap" }}>{cell.render("Cell")}</td>)}
                    </tr>
                  );
                })
              }
              {!loading &&
                !error &&
                rows.length === 0 &&
                (
                  <tr>
                    <td colSpan="7">
                      <Alert color="warning" className="text-center" role="alert">
                        <h4>
                          <i className="fas fa-exclamation-circle fa-lg mr-2"></i>No Sync Logs Available
                          </h4>
                      </Alert>
                    </td>
                  </tr>
                )}
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
        />
      </CardFooter>
    </>
  );
}
export default SyncLogGrid;
