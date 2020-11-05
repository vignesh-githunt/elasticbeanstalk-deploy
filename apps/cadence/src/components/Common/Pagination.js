import React from "react";
import PropTypes from "prop-types";

import { Button, Col, Form, Input, Pagination, PaginationItem, PaginationLink, Progress } from "reactstrap";

const TablePagination = ({ canNextPage, canPreviousPage, handleFirstPage, handleGoToPage, handleLastPage, handleSetPageSize, loading, nextPage, pageIndex, previousPage, pageSize, tableId, totalPages, handleRefresh }) => {

  return (
    <div className="d-flex">
      {loading ? (
        <Col sm={6} className="my-auto">
          <Progress animated value="100" />
        </Col>
      ) : (
          <div>
            <Form className="form-inline">
              {/* Show number of pages */}
              <span className="mr-2">
                Page{" "}
                <strong>
                  {pageIndex} of {totalPages}
                </strong>
              </span>
              {/* Goto page */}
              |
                <div className="mx-2">
                  <div className="pt-2 float-left">Go to page</div>
                  <Input
                    type="number"
                    defaultValue={pageIndex}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      handleGoToPage(page);
                    }}
                    min={0} max={20}
                    className="ml-2 float-right"
                  />
                </div>
              {/* Display number of rows dropdown */}
              <Input
                type="select"
                name={`${tableId}_length`}
                aria-controls={tableId}
                value={pageSize}
                onChange={(e) => handleSetPageSize(Number(e.target.value))}
                className="mr-2"
              >
                <option value={5}>Show 5</option>
                <option value={10}>Show 10</option>
                <option value={25}>Show 25</option>
                <option value={50}>Show 50</option>
                <option value={100}>Show 100</option>
              </Input>
              {/* Refresh */}
              {handleRefresh &&
                <>
                  |
                  <Button
                    outline
                    className="ml-2"
                    type="button"
                    onClick={() => handleRefresh()}
                  >
                    <i className="fas fa-sync-alt text-primary"></i>
                  </Button>
                </>
              }
            </Form>
          </div>
        )}

      {/* Pagination */}
      <div className="ml-auto">
        <Pagination aria-label="Page navigation">
          <PaginationItem
            onClick={() => handleFirstPage()}
            disabled={canPreviousPage}
          >
            <PaginationLink><i className="fas fa-angle-double-left"></i></PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => previousPage()}
            disabled={canPreviousPage}
          >
            <PaginationLink><i className="fas fa-angle-left"></i></PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => nextPage()}
            disabled={canNextPage}
          >
            <PaginationLink><i className="fas fa-angle-right"></i></PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => handleLastPage()}
            disabled={canNextPage}
          >
            <PaginationLink><i className="fas fa-angle-double-right"></i></PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    </div>
  );
}

TablePagination.propTypes = {
  canNextPage: PropTypes.bool, // 'true' to enable next page button
  canPreviousPage: PropTypes.bool, // 'true' to enable previous page button
  handleFirstPage: PropTypes.func, // Function to go to first page of the table
  handleGoToPage: PropTypes.func, // Function to go to exact page needed in table
  handleLastPage: PropTypes.func, // Function to go to last page of the table
  handleRefresh: PropTypes.func, // Function to refresh the table data
  handleSetPageSize: PropTypes.func, // Function to display number of rows per page
  loading: PropTypes.bool, // If 'true' Progress bar shown untill table content gets loaded 
  nextPage: PropTypes.func, // Function to move forward to next page of the table
  pageIndex: PropTypes.number, // Integer value to show current page from total number of pages
  previousPage: PropTypes.func, // Function to move backward to previous page of the table
  pageSize: PropTypes.number, // Integer value to show number of rows per page to be displayed in the dropdown
  tableId: PropTypes.string, // Prop to get corresponding TableID 
  totalPages: PropTypes.number // Integer value to show total number of pages
};

export default TablePagination;
