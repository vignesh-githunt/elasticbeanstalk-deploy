import React from "react";

const Pagination = ({
  tableId,
  canNextPage,
  canPreviousPage,
  previousPage,
  nextPage
}) => {
  return (
    <div className="col-sm-12 col-md-7">
      <div
        className="dataTables_paginate paging_simple_numbers"
        id={`${tableId}_paginate`}
      >
        <ul className="pagination">
          <li
            className={`paginate_button page-item previous ${
              !canPreviousPage ? "disabled" : ""
            }`}
            id={`${tableId}_previous`}
          >
            <a
              href="#"
              disabled={!canPreviousPage}
              aria-controls={tableId}
              data-dt-idx="0"
              tabIndex="0"
              className="page-link"
              onClick={e => {
                e.preventDefault();
                previousPage();
              }}
            >
              Previous
            </a>
          </li>
          <li
            className={`paginate_button page-item next ${
              !canNextPage ? "disabled" : ""
            }`}
            id={`${tableId}_next`}
          >
            <a
              href="#"
              disabled={!canNextPage}
              aria-controls={tableId}
              data-dt-idx="3"
              tabIndex="0"
              className="page-link"
              onClick={e => {
                e.preventDefault();
                nextPage();
              }}
            >
              Next
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;