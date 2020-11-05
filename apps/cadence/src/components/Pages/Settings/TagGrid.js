/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React from "react";
import { useTable, usePagination } from 'react-table';
import ScrollArea from "react-scrollbar";
import { Alert, CardFooter, Table } from 'reactstrap';

import { default as TablePagination } from "../../Common/Pagination";


function TagGrid({ columns, currentPageIndex, data, deleteTag, error, fetchData, loading, pageCount: controlledPageCount, pageSize: controlledPageSize, tagData, updateTag, handleRefresh }) {


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
    state: { pageIndex, pageSize }
  } = useTable({
    columns,
    data,
    tagData,
    initialState: { pageIndex: currentPageIndex, pageSize: controlledPageSize },
    manualPagination: true,
    pageCount: controlledPageCount,
  },
    usePagination,
    hooks => {
      hooks.visibleColumns.push(columns => [
        ...columns,
        {
          id: 'action',
          Header: () => (
            <div>
              Action
            </div>
          ),
          Cell: ({ row }) => (
            <span className="text-center">
              <i className="fas fa-edit mr-2 pointer" title="Edit Tag" onClick={() => { updateTag(row) }}></i>
              <i className="far fa-trash-alt pointer" title="Delete Tag" onClick={() => { deleteTag(row) }}></i>
            </span>
          ),
        },

      ])
    }
  );

  React.useEffect(() => fetchData({ pageIndex, pageSize }), [pageIndex, pageSize]);

  React.useEffect(() => gotoPage(currentPageIndex), [currentPageIndex]);

  let tableId = "tag_table"
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
                    <tr {...row.getRowProps()} className="tag-row" key={i}>
                      {row.cells.map((cell, i) => <td key={i} style={{ width: cell.column.width }}>{cell.render("Cell")}</td>)}
                    </tr>
                  );
                })
              }
              {error && (
                <tr>
                  <td colSpan="7">
                    <Alert color="danger" className="text-center" role="alert">
                      <h4>
                        <i className="fas fa-exclamation-circle fa-lg mr-2"></i>Failed to fetch data
                      </h4>
                    </Alert>
                  </td>
                </tr>
              )}
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
export default TagGrid;