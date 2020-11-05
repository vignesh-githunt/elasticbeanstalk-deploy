import React, { useEffect, useState } from "react";
import { usePagination, useRowSelect, useTable } from 'react-table';
import ScrollArea from "react-scrollbar";
import { Alert, CardFooter, Table } from "reactstrap";
import { useSortBy } from "@nextaction/components";
import { default as TablePagination } from "../../Common/Pagination";

function AccountsGrid({
  columns,
  data,
  accountsData,
  fetchData,
  loading,
  error,
  pageCount: controlledPageCount,
  pageSize: controlledPageSize,
  currentPageIndex,
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
    state: { selectedRowIds, pageIndex, pageSize, sortBy }
  } = useTable({
    columns,
    data,
    accountsData,
    initialState: {
      pageIndex: currentPageIndex,
      pageSize: controlledPageSize,
      sortBy: [
        {
          id: sortByCol,
          desc: orderBy == "desc"
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
    useRowSelect
  );

  function GridRow({ row, rowKey }) {

    const [showCell, setShowCell] = useState(true);

    return (
      <tr {...row.getRowProps()} style={{ cursor: "pointer" }} onMouseEnter={() => setShowCell(!showCell)} onMouseLeave={() => setShowCell(!showCell)} key={rowKey}>
        {row.cells.map((cell, i) => {
          return (
            <td key={i} style={{ width: cell.column.width, display: ['Date Created', 'Owner'].indexOf(cell.column.Header) !== -1 ? (showCell ? "" : "none") : "" }}>{cell.render("Cell")}</td>
          );
        })}
        <td  {...row.getRowProps()} className="pb-0 pt-0 text-center" style={{ display: (showCell ? "none" : ""), verticalAlign: 'middle' }} colSpan="2">
          <span>{row.original.callCount}<i className="fas fa-phone-alt text-muted ml-2 mr-2"></i></span>
          <span>{row.original.sentCount}<i className="fas fa-share text-muted ml-2 mr-2"></i></span>
          <span>{row.original.emailCount}<i className="fas fa-envelope-open text-muted ml-2 mr-2"></i></span>
          <span>{row.original.repliedCount}<i className="fas fa-reply text-muted ml-2"></i></span>
        </td>
      </tr>
    );
  }

  useEffect(() => fetchData({ pageIndex, pageSize }), [pageIndex, pageSize]);

  useEffect(() => gotoPage(currentPageIndex), [currentPageIndex]);

  useEffect(() => {
    if (sortBy.length > 0) { handleSort(sortBy[0].id, sortBy[0].desc); }
  }, [sortBy]);

  let tableId = "accounts_table"
  return (
    <>
      <div {...getTableProps()} id={`${tableId}_wrapper`} className="table-responsive">
        <Table {...getTableProps()} id={`${tableId}`} hover style={{ minWidth: "800px" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="border-top-0" style={{ width: column.width, whiteSpace: "nowrap" }} >
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
          style={{ minHeight: "335px", maxHeight: "603px", minWidth: "800px" }}
        >
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
                          <i className="fas fa-exclamation-circle fa-lg mr-2"></i>No acccounts available
                        </h4>
                      </Alert>
                    </td>
                  </tr>
                )
              }
              {!loading && !error &&
                rows.slice(0, pageSize).map((row, i) => {
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
                    <Alert color="danger" className="mb-0 text-center">
                      <h4><i className="fas fa-exclamation-circle fa-lg mr-2"></i>Failed to fetch data</h4>
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

export default AccountsGrid;
