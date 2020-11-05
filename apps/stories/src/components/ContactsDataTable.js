import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { useQuery } from '@apollo/react-hooks';

import { useTable, useSortBy } from 'react-table';
import CONTACT_DATA_FREQUENCIES from './queries/ContactDataFrequenciesQuery';
import { ELEMENTS_COUNT_QUERY } from './queries/ElementsQueries';

const Variants = ({ customerId, senderId, dataPointClassName, value }) => {
  const filter = {
    customerId,
    triggerDataPoints: {
      _type: `V3::Data::DataPoints::${dataPointClassName}`,
      value: value,
    },
  };

  if (senderId) filter.senderId = senderId;
  const { data, loading } = useQuery(ELEMENTS_COUNT_QUERY, {
    variables: {
      filter,
    },
  });

  if (loading) return <i className="fa fa-spin fa-spinner"></i>;

  return (
    <div>
      {data && data._v3_Customer_StoryComponents_ElementsMeta.count > 0 ? (
        <i className="fa fa-check text-success"></i>
      ) : (
        <i className="fa text-danger">-</i>
      )}
    </div>
  );
};

const ContactsDataTable = ({
  customerId,
  currentUser,
  userLoading,
  dataPoint,
  senderId,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Element Type',
        accessor: 'dataPointClassName',
        disableSortBy: false,
      },
      {
        Header: 'Value',
        accessor: 'value',
        disableSortBy: false,
      },
      {
        Header: 'Frequency',
        accessor: 'count',
        disableSortBy: false,
      },
      {
        Header: 'Percentage of Total',
        accessor: (d) => Number((d.percentageOfTotal * 100).toFixed(2)),
        disableSortBy: false,
        Cell: ({ cell: { value } }) => `${value} %`,
      },
      {
        Header: 'Variant exists?',
        accessor: 'variants',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Variants
              senderId={senderId}
              dataPointClassName={row.original.dataPointClassName}
              value={row.original.value}
              customerId={customerId}
            />
          );
        },
      },
    ],
    [customerId, senderId]
  );

  const filter = {
    customerId: customerId || currentUser.companyId,
  };
  if (senderId) filter['OR'] = [{ senderId: senderId }, { senderId: null }];
  if (dataPoint) filter['dataPointClassName'] = dataPoint;

  const { loading, data } = useQuery(CONTACT_DATA_FREQUENCIES, {
    variables: {
      filter: filter,
      limit: 50,
    },
    skip: userLoading,
  });

  if (userLoading || loading)
    return (
      <Row>
        <Col>
          <i className="fa fa-spinner fa-spin fa-2x"></i>
        </Col>
      </Row>
    );

  return (
    <RTable columns={columns} data={data.v3_Customer_ContactDataFrequencies} />
  );
};

export default ContactsDataTable;

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
      initialState: {
        sortBy: [
          {
            id: 'count',
            desc: true,
          },
        ],
      },
    },
    useSortBy
  );

  // Render the UI for your table
  return (
    <Table
      striped
      bordered
      hover
      size="sm"
      {...getTableProps()}
      className="mb-4"
    >
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
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
