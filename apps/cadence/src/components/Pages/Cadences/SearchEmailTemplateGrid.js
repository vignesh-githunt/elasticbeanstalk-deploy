import React from "react";
import { useTable, useRowSelect, usePagination } from "react-table";
import { Alert, CardFooter, Table } from "reactstrap";

import { default as TablePagination } from "../../Common/Pagination";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

function GridRow({ row, rowKey }) {
  const cadence = row.original;
  return (
    <tr {...row.getRowProps()} className="cadence-grid-row" key={rowKey}>
      {row.cells.map((cell, i) => {
        return <td key={i}>{cell.render("Cell")}</td>;
      })}
    </tr>
  );
}

function SearchEmailTemplateGrid({
  columns,
  data,
  templateData,
  fetchData,
  loading,
  error,
  pageCount: controlledPageCount,
  pageSize: controlledPageSize,
  currentPageIndex,
  handleRowToolbarButton,
  cadenceActions,
  history,
  register,
  setSelectedRows,
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
    // Get the state from the instance
    state: { selectedRowIds, pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      templateData,
      initialState: {
        pageIndex: currentPageIndex,
        pageSize: controlledPageSize,
      },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox
                name="emailTemplateId"
                innerRef={register(true)}
                {...getToggleAllRowsSelectedProps()}
              />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                name="emailTemplateId"
                innerRef={register(true)}
                {...row.getToggleRowSelectedProps()}
              />
            </div>
          ),
          width: "3%",
        },
        ...columns,
      ]);
    }
  );

  React.useEffect(() => {
    setSelectedRows(selectedFlatRows.map((row) => row.original));
  }, [setSelectedRows, selectedFlatRows]);

  React.useEffect(() => fetchData({ pageIndex, pageSize }), [
    pageIndex,
    pageSize,
  ]);
  React.useEffect(() => gotoPage(currentPageIndex), [currentPageIndex]);
  let tableId = "cadences-table";
  return (
    <>
      <div {...getTableProps()} id={`${tableId}_wrapper`}>
        <Table striped {...getTableProps()} id={`${tableId}`} className="bt">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th {...column.getHeaderProps()} width={column.width}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {!loading &&
              !error &&
              rows.slice(0, 10).map((row, i) => {
                prepareRow(row);

                return (
                  <GridRow
                    row={row}
                    handleRowToolbarButton={handleRowToolbarButton}
                    key={i}
                    cadenceActions={cadenceActions}
                    history={history}
                  />
                );
              })}

            {error && (
              <tr>
                <td colSpan="10">
                  <Alert color="danger" className="text-center" role="alert">
                    <h4>
                      <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                      Failed to fetch data
                    </h4>
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <CardFooter>
          <TablePagination
            loading={loading}
            handleFirstPage={() => gotoPage(0)}
            handleLastPage={() => gotoPage(pageCount - 1)}
            totalPages={pageOptions.length}
            pageIndex={pageIndex + 1}
            handleGoToPage={(pageNumber) => gotoPage(pageNumber)}
            pageSize={pageSize}
            handleSetPageSize={(pageSize) => setPageSize(pageSize)}
            canPreviousPage={!canPreviousPage}
            canNextPage={!canNextPage}
            previousPage={() => previousPage()}
            nextPage={() => nextPage()}
          ></TablePagination>
        </CardFooter>
      </div>
    </>
  );
}
export default SearchEmailTemplateGrid;