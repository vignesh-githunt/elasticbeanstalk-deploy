/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React from "react";
import { usePagination, useSortBy, useTable } from 'react-table';
import ScrollArea from "react-scrollbar";

import { CardFooter, Table } from 'reactstrap';

import { default as TablePagination } from "../../Common/Pagination";

function TouchOutcomeGrid({ columns, data, error, loading, handleRefresh, outcomesData, updateOutcome }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      outcomesData,
      initialState: { pageIndex: 0 }
    },
    useSortBy,
    usePagination,
    hooks => {
      hooks.visibleColumns.push(columns => [
        ...columns,
        {
          id: 'action',
          Header: 'Action',
          disableSortBy: true,
          Cell: ({ row }) => (
            <span className="text-center">
              <i className="fas fa-pencil-alt mr-2 pointer" title="Edit Tag" onClick={() => { updateOutcome(row) }}></i>
            </span>
          ),
        },

      ])
    }
  );


  let tableId = "touch_outcome_table"
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
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.width, whiteSpace: "nowrap" }} >
                      {column.render("Header")}
                      <span className="ml-2">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="fa fa-sort-down" />
                          ) : (
                              <i className="fa fa-sort-up" />
                            )
                        ) : !column.disableSortBy && (
                          <i className="fa fa-sort text-muted" />
                        )}
                      </span>
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
                page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="outcome-row" key={i}>
                      {row.cells.map((cell, i) => <td key={i} style={{ width: cell.column.width }}>{cell.render("Cell")}</td>)}
                    </tr>
                  );
                })}
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

export default TouchOutcomeGrid;