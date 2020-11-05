import React, { useState } from 'react';
import { Row, Col, Card, Table, CardHeader } from 'reactstrap';
import { Link } from 'react-router-dom';
import USER_STORY_CONTACTS_QUERY from '../queries/UserStoryContactsQuery';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { BadgeStatus } from '@koncert/shared-components';
import { useTable, useSortBy } from 'react-table';

const useContactsList = (
  customerId,
  currentUser,
  userLoading,
  defaultSenderId,
  storyId,
  startDate,
  endDate
) => {
  const [senderId] = useState(defaultSenderId);
  const [checked, setChecked] = useState({
    Approaching: true,
    Contacted: true,
    New: false,
    Engaged: true,
    Replied: false,
    Bounced: false,
    Error: false,
  });
  const columns = React.useMemo(
    () => [
      // {
      //   // Make an expander cell
      //   Header: () => null, // No header
      //   id: "expander", // It needs an ID
      //   disableSortBy: true,
      //   width: "1%",
      //   Cell: ({ row }) => (
      //     <span>
      //       {row.isExpanded ? (
      //         <i className={"fa fa-angle-down"}></i>
      //       ) : (
      //         <i className={"fa fa-angle-right"}></i>
      //       )}
      //     </span>
      //   ),
      // },
      {
        Header: 'Priority',
        accessor: 'priority',
        width: '75',
        disableSortBy: false,
        Cell: ({ cell: { value } }) => (
          <div className="badge bg-gray-lighter">{value}</div>
        ),
      },
      {
        Header: 'Touches',
        accessor: 'emailContent',
        width: '100',
        disableSortBy: false,
        Cell: ({ cell: { value } }) => {
          const touches = Object.keys(value).map((key) => {
            if (key !== '__typename')
              return <i key={key} className="circle circle-md"></i>;
            else return null;
          });
          return touches;
        },
      },
      {
        Header: 'Story',
        accessor: 'story',
        disableSortBy: true,
        Cell: ({ cell: { value } }) => {
          return <Link to={`/stories/${value.id}`}>{value.name}</Link>;
        },
      },
      {
        Header: 'Account',
        accessor: 'account.nameValue',
        disableSortBy: true,
      },
      {
        Header: 'Account SFDC Id',
        accessor: 'account.primarySalesforceId',
        disableSortBy: true,
      },
      {
        Header: 'Contact',
        accessor: 'contact',
        disableSortBy: true,
        Cell: ({ cell: { value } }) => (
          <>
            <Link to={'/contacts/' + value.id}>
              {value.givenNameValue} {value.familyNameValue} (SFDC id:{' '}
              {value.primarySalesforceId})
              <br />
              <small>{value.position.email}</small>
            </Link>
            <br />
            <small>{value.position.title}</small>
          </>
        ),
      },
      {
        Header: 'Last Updated',
        accessor: 'updatedAt',
        disableSortBy: false,
        Cell: ({ cell: { value } }) => <span>{moment(value).fromNow()}</span>,
      },
      {
        Header: 'Personalization',
        accessor: 'personalizationScore',
        disableSortBy: false,
        Cell: ({ cell: { value } }) => {
          let progressValue = value / 10;
          const progressbarClass =
            progressValue > 50
              ? 'bg-success'
              : progressValue > 20
              ? 'bg-warning'
              : 'bg-danger';
          return (
            <div className="progress progress-xs">
              <div
                className={`progress-bar progress-bar-striped ${progressbarClass}`}
                role="progressbar"
                style={{ width: progressValue + '%' }}
              >
                <span className="sr-only">{progressValue}% Personalized</span>
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Sender',
        accessor: 'sender.fullName',
        disableSortBy: false,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableSortBy: false,
        Cell: ({ cell: { value } }) => {
          const statusClass = BadgeStatus[value];
          return (
            <div className={`inline wd-xs badge ${statusClass}`}>{value}</div>
          );
        },
      },
    ],
    []
  );

  const { data: storyContacts, loading } = useQuery(USER_STORY_CONTACTS_QUERY, {
    variables: {
      filter: {
        customerId: customerId || currentUser.companyId,
        status_in: Object.keys(checked)
          .map((key) => {
            if (checked[key]) return key;
            else return null;
          })
          .filter((key) => {
            console.log(key);
            return key !== undefined;
          }),
        updatedAt_gt: startDate,
        updatedAt_lt: endDate,
      },
    },
    skip: userLoading || senderId === null,
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
  const ContactsList = () => {
    if (userLoading || loading)
      return (
        <Row>
          <Col>
            <i className="fa fa-spinner fa-spin fa-2x"></i>
          </Col>
        </Row>
      );

    return (
      <div
        id={`contacts_wrapper`}
        className="dataTables_wrapper dt-bootstrap4 no-footer"
      >
        <Card>
          <CardHeader>
            {Object.keys(checked).map((key) => (
              <label key={key} className="mr-2">
                <input
                  type="checkbox"
                  checked={checked[key]}
                  onChange={(e) => {
                    setChecked((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }));
                  }}
                  className="mr-1"
                />
                {key}
              </label>
            ))}
          </CardHeader>
          <RTable
            columns={columns}
            data={storyContacts.v3_Customer_StoryContacts}
          />
        </Card>
      </div>
    );
  };

  return {
    ContactsList,
  };
};

export default useContactsList;
