import React, { useState } from "react";
import ScrollArea from "react-scrollbar"; 
import { usePagination, useRowSelect, useTable } from "react-table";
import {
  Alert,
  Button,
  CardFooter,
  Table,
} from "reactstrap";

import { default as TablePagination } from "../../Common/Pagination";
import { Scrollable, useSortBy } from "@nextaction/components";
import { withRouter } from "react-router-dom";

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

function GridRow({
  row,
  handleRowToolbarButton,
  rowKey,
  cadenceActions,
  history,
  location
}) {
  const [showCell, setShowCell] = useState(true);
  const cadence = row.original;
  return (
    <tr
      {...row.getRowProps()}
      className="cadence-grid-row"
      onMouseOver={() => setShowCell(!showCell)}
      onMouseOut={() => setShowCell(!showCell)}
      key={rowKey}
    >
      {row.cells.map((cell, i) => {
        return (
          <td 
            key={i} 
            style={{ width: cell.column.width, display : ['Tags', 'Status', 'Last Activity'].indexOf(cell.column.Header) !== -1 ? ( showCell ? "" : "none" ) : "" }}>
            {cell.render("Cell")}
          </td>
        );
      })}
      <td
        {...row.getRowProps()}
        className="text-center pb-0 pt-0 p-0"
        style={{ display: showCell ? "none" : "", verticalAlign: "middle" }}
        colSpan="3"
      >
        <Button
          color="outline"
          title="Edit"
          onClick={() => history.push("/cadences" + "/" + cadence.id)}
        >
          <i className="fa-2  fas fa-pencil-alt fa-lg text-primary"></i>
        </Button>
        <Button
          color="outline"
          title="Clone"
          onClick={() => handleRowToolbarButton(cadenceActions.CLONE, cadence)}
        >
          <i className="fas fa-clone fa-lg text-primary"></i>
        </Button>
        <Button
          color="outline"
          title="View"
          onClick={() =>
            history.push({
              pathname: "/cadences" + "/" + cadence.id + "/overview/view",
              state: {
                cadence: cadence,
                cadenceName: cadence.name,
              },
            })
          }
        >
          <i className="fas fa-eye fa-lg text-primary"></i>
        </Button>
        <Button
          color="outline"
          title="Disable"
          onClick={() =>
            handleRowToolbarButton(cadenceActions.DISABLE, cadence)
          }
        >
          <i className="fas fa-ban fa-lg text-primary"></i>
        </Button>
        <Button
          color="outline"
          title="Delete"
          onClick={() => handleRowToolbarButton(cadenceActions.DELETE, cadence)}
        >
          <i className="fas fa-trash fa-lg text-danger"></i>
        </Button>
      </td>
    </tr>
  );
}

function CadencesGrid({
  columns,
  data,
  cadenceData,
  fetchData,
  cadenceName,
  loading,
  error,
  pageCount: controlledPageCount,
  pageSize: controlledPageSize,
  currentPageIndex,
  handleRowToolbarButton,
  cadenceActions,
  history,
  location,
  handleRefresh,
  sortBy: sortByColumn,
  orderBy,
  handleSortBy
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
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
    // Get the state from the instance
    state: { selectedRowIds, pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      cadenceData,
      initialState: {
        pageIndex: currentPageIndex,
        pageSize: controlledPageSize,
        sortBy: [
          {
            id: sortByColumn,
            desc: orderBy === "desc"
          }
        ]
      },
      manualPagination: true,
      manualSortBy: true,
      pageCount: controlledPageCount,
      disableSortRemove: true
    },
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  React.useEffect(() => fetchData({ pageIndex, pageSize }), [
    pageIndex,
    pageSize,
  ]);
  React.useEffect(() => gotoPage(currentPageIndex), [currentPageIndex]);

  React.useEffect(() => handleSortBy(sortBy[0].id, sortBy[0].desc ? "desc" : "asc"), [sortBy]);

  let tableId = "cadences-table";
  return (
    <>
      <div {...getTableProps()} id={`${tableId}_wrapper`} className="table-responsive">
        <Table striped {...getTableProps()} id={`${tableId}`} className="bt" style={{ minWidth: "800px" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column,index) => {
                  return (
                    <th 
                      onMouseEnter={(e)=>{["Cadences", "Status", "Last Activity"].includes(column.render("Header")) && (e.currentTarget.className="text-primary")}} 
                      onMouseLeave={(e)=>{e.currentTarget.className=""}} 
                      {...column.getHeaderProps(["Cadences", "Status", "Last Activity"].includes(column.render("Header")) && column.getSortByToggleProps())}  
                      style={{ width: column.width, whiteSpace:"nowrap" }}
                    >
                      {column.render("Header")}
                      {["Cadences", "Status", "Last Activity"].includes(column.render("Header")) ? (
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
                  );
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
                rows.slice(0, 100).map((row, i) => {
                  prepareRow(row);

                  return (
                    <GridRow
                      row={row}
                      handleRowToolbarButton={handleRowToolbarButton}
                      key={i}
                      cadenceActions={cadenceActions}
                      history={history}
                      cadenceName={cadenceName}
                      location={location}
                    />
                  );
                })}
              {error && (
                <tr>
                  <td colSpan="10">
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
            totalPages={pageOptions.length}
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
export default withRouter(CadencesGrid);