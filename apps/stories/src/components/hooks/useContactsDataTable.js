import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  Button,
  CardColumns,
  Table,
  CardHeader,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import USER_STORY_CONTACTS_QUERY from '../queries/UserStoryContactsQuery';
import { useQuery } from '@apollo/react-hooks';

import { useTable, useSortBy, usePagination, useExpanded } from 'react-table';
import CONTACT_DATA_AGGREGATION from '../queries/ContactDataAggregationQuery';
import Pagination from '../Tables/Pagination';

const useContactsDataTable = (
  customerId,
  currentUser,
  userLoading,
  dataPoint,
  defaultSenderId
) => {
  const [senderId, setSenderId] = useState(defaultSenderId);
  const columns = React.useMemo(() => [
    {
      Header: 'Value',
      accessor: '_id',
      disableSortBy: false,
    },
    {
      Header: 'Frequency',
      accessor: 'total',
      disableSortBy: false,
    },
  ]);

  const { loading, data } = useQuery(CONTACT_DATA_AGGREGATION, {
    variables: {
      customerId: customerId || currentUser.companyId,
      dataPoint: dataPoint,
      senderId: senderId,
    },
    skip: userLoading,
  });

  const RTable = ({ columns, data }) => {
    const getSortingClassName = (sorted, isSortedDesc, disableSortBy) => {
      return !disableSortBy
        ? sorted
          ? isSortedDesc
            ? 'sorting_desc'
            : 'sorting_asc'
          : 'sorting'
        : '';
    };
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

    // Render the UI for your table
    return (
      <Table striped bordered hover size="sm" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={getSortingClassName(
                    column.isSorted,
                    column.isSortedDesc,
                    column.disableSortBy
                  )}
                  width={column.width}
                >
                  {column.render('Header')}
                  <span className="ml-2">
                    {!column.disableSortBy ? (
                      column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fa fa-sort-down"></i>
                        ) : (
                          <i className="fa fa-sort-up"></i>
                        )
                      ) : (
                        <i className="fa fa-sort text-muted"></i>
                      )
                    ) : (
                      <span></span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <th {...cell.getCellProps()}>{cell.render('Cell')}</th>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };
  const ContactsDataTable = () => {
    if (userLoading || loading)
      return (
        <Row>
          <Col>
            <i className="fa fa-spinner fa-spin fa-2x"></i>
          </Col>
        </Row>
      );

    return (
      <div id={`contacts_wrapper`} className="">
        <Card>
          <CardHeader></CardHeader>
          <RTable columns={columns} data={data.contactDataAggregation.data} />
        </Card>
      </div>
    );
  };

  return {
    ContactsDataTable,
  };
};

export default useContactsDataTable;
