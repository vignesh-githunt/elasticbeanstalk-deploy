import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, CardHeader } from 'reactstrap';
import { Link } from 'react-router-dom';
import USER_STORY_CONTACTS_QUERY from '../queries/UserStoryContactsQuery';
import STORY_CONTACT_STATUS from '../mutations/stories/StoryContactStatus';
import REFRESH_STORY_CONTACT from '../mutations/stories/RefreshStoryContact';

import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  useTable,
  useSortBy,
  useExpanded,
  Button,
} from '@koncert/shared-components';
import { BadgeStatus } from '@koncert/shared-components';
import moment from 'moment';
import { ExpandedRow } from '../ExpandedRow';
// import swal from 'sweetalert';

const ApproveOrPause = ({
  storyContactId,
  status,
  approved,
  filter,
  convertedSortBy,
}) => {
  const [updateContactStatus] = useMutation(STORY_CONTACT_STATUS);
  const pauseContact = (storyContactId) => {
    updateContactStatus({
      variables: { id: storyContactId, status: 'Paused' },
      refetchQueries: [
        {
          query: USER_STORY_CONTACTS_QUERY,
          variables: { filter: filter, order: convertedSortBy },
        },
      ],
    });
  };

  const activateContact = (storyContactId) => {
    updateContactStatus({
      variables: { id: storyContactId, status: 'New', approved: true },
      refetchQueries: [
        {
          query: USER_STORY_CONTACTS_QUERY,
          variables: { filter: filter, order: convertedSortBy },
        },
      ],
    });
  };

  const btnClass = status !== 'Paused' ? 'text-muted' : 'text-danger';
  const btnApprovedClass = approved ? 'text-success' : 'text-muted';
  return (
    <>
      <Button
        disabled={approved}
        onClick={(e) => {
          e.preventDefault();
          activateContact(storyContactId);
          return false;
        }}
        className={`btn btn-secondary ${btnApprovedClass}`}
      >
        <i className="fa fa-thumbs-up"></i>
      </Button>
      <Button
        disabled={status === 'Paused'}
        onClick={(e) => {
          e.preventDefault();
          pauseContact(storyContactId);
          return false;
        }}
        className={`btn btn-secondary ${btnClass}`}
      >
        <i className="fa fa-thumbs-down"></i>
      </Button>
    </>
  );
};

const useMessageQueue = (
  customerId,
  currentUser,
  userLoading,
  selectedSenderId,
  sendersLoading,
  pageSize,
  statuses
) => {
  const initialOrder = {
    priority: 'ASC',
    personalizationScore: 'DESC',
  };

  const [
    refreshStoryContactMutation,
    { loading: refreshLoading },
  ] = useMutation(REFRESH_STORY_CONTACT);

  const refreshStoryContact = (storyContactId) => {
    return refreshStoryContactMutation({
      variables: { id: storyContactId },
      refetchQueries: [
        {
          query: USER_STORY_CONTACTS_QUERY,
          variables: { filter: filter, order: convertedSortBy },
        },
      ],
    });
  };

  const [filter, setFilter] = useState(
    selectedSenderId === null
      ? {
          customerId: customerId || currentUser.companyId,
          // eslint-disable-next-line
          status_in: Object.keys(statuses)
            .map((key) => {
              if (statuses[key]) return key;
              else return null;
            })
            .filter((key) => {
              return key !== null;
            }),
        }
      : {
          customerId: customerId || currentUser.companyId,
          senderId: selectedSenderId,
          // eslint-disable-next-line
          status_in: Object.keys(statuses)
            .map((key) => {
              if (statuses[key]) return key;
              else return null;
            })
            .filter((key) => {
              return key !== null;
            }),
        }
  );

  const convertSortBy = ({ sortBy }) => {
    const newOrder = {};
    sortBy &&
      sortBy.map((sort) => {
        let mappedOrder = '';
        switch (sort.id) {
          case 'priorityBadge':
            mappedOrder = 'priority';
            break;
          case 'personalization':
            mappedOrder = 'personalizationScore';
            break;
          default:
            mappedOrder = sort.id;
            break;
        }
        return (newOrder[mappedOrder] = sort.desc ? 'DESC' : 'ASC');
      });
    return Object.keys(newOrder).length ? newOrder : initialOrder;
  };
  const [convertedSortBy] = useState(convertSortBy(initialOrder));

  useEffect(() => {
    setFilter((oldFilter) => {
      if (selectedSenderId === null) {
        delete oldFilter.senderId;
        return {
          ...oldFilter,
          //eslint-disable-next-line
          status_in: Object.keys(statuses)
            .map((key) => {
              if (statuses[key]) return key;
              else return null;
            })
            .filter((key) => {
              return key !== null;
            }),
        };
      } else
        return {
          ...oldFilter,
          senderId: selectedSenderId,
          //eslint-disable-next-line
          status_in: Object.keys(statuses)
            .map((key) => {
              if (statuses[key]) return key;
              else return null;
            })
            .filter((key) => {
              return key !== null;
            }),
        };
    });
  }, [statuses, selectedSenderId]);

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        disableSortBy: true,
        width: '1%',
        Cell: ({ row }) => (
          <span>
            {row.isExpanded ? (
              <i className={'fa fa-angle-down'}></i>
            ) : (
              <i className={'fa fa-angle-right'}></i>
            )}
          </span>
        ),
      },
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
        Header: 'Contact',
        accessor: 'contact',
        disableSortBy: true,
        Cell: ({ cell: { value } }) => (
          <>
            <Link to={'/contacts/' + value.id}>
              {value.givenNameValue} {value.familyNameValue}
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
          const progressValue = value / 10;
          const progressbarClass =
            progressValue > 50
              ? 'bg-success'
              : progressValue > 20
              ? 'bg-warning'
              : 'bg-danger';
          const progressbarTextClass =
            progressValue > 50 ? 'text-gray-lighter' : 'text-dark';
          return (
            <div className="progress progress-md position-relative">
              <div
                className={`progress-bar progress-bar-striped ${progressbarClass}`}
                role="progressbar"
                style={{ width: progressValue + '%' }}
              >
                <div
                  className={`justify-content-center d-flex position-absolute w-100 ${progressbarTextClass}`}
                >
                  {value}
                </div>
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
      {
        Header: 'Approve/Pause',
        accessor: 'id',
        disableSortBy: true,
        disableExpanded: true,
        Cell: ({ row }) => {
          return (
            <ApproveOrPause
              storyContactId={row.original.id}
              status={row.original.status}
              approved={row.original.approved}
              filter={filter}
              convertedSortBy={convertedSortBy}
            />
          );
        },
      },
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSenderId, filter]
  );

  const { loading, data } = useQuery(USER_STORY_CONTACTS_QUERY, {
    variables: {
      filter: {
        ...filter,
      },
      order: convertedSortBy,
      limit: pageSize,
    },
    skip: userLoading || sendersLoading,
  });

  const initialState = {
    pageIndex: 0,
    pageSize: 10,
    sortBy: [
      { id: 'priority', desc: false },
      { id: 'personalizationScore', desc: true },
    ],
  };

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

    const renderRowSubComponent = React.useCallback(({ row }) => {
      return (
        <ExpandedRow
          row={row}
          refreshLoading={refreshLoading}
          refreshStoryContact={refreshStoryContact}
        />
      );
    }, []);

    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      allColumns,
    } = useTable(
      {
        columns,
        data,
        initialState: initialState,
      },
      useSortBy,
      useExpanded
    );

    // Render the UI for your table
    return (
      <Table striped hover size="sm" {...getTableProps()}>
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
            const rowProps = Object.assign({}, row.getRowProps());
            return (
              <React.Fragment key={i}>
                <tr
                  className={'' + (row.id % 2 ? 'odd' : 'even')}
                  {...rowProps}
                >
                  {row.cells.map((cell) => {
                    if (!cell.column.disableExpanded) {
                      return (
                        <td
                          {...cell.getCellProps()}
                          {...row.getToggleRowExpandedProps()}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    } else {
                      return (
                        <td {...cell.getCellProps()} width={cell.width}>
                          {cell.render('Cell')}
                        </td>
                      );
                    }
                  })}
                </tr>
                {/*
                          If the row is in an expanded state, render a row with a
                          column that fills the entire length of the table.
                        */}
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={allColumns.length}>
                      {/*
                                Inside it, call our renderRowSubComponent function. In reality,
                                you could pass whatever you want as props to
                                a component like this, including the entire
                                table instance. But for this example, we'll just
                                pass the row
                              */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={allColumns.length}
                className="justify-content-center text-center"
              >
                <h2>No Contacts Found</h2>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };
  const MessageQueueTable = () => {
    if (userLoading || loading || sendersLoading)
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
          <RTable columns={columns} data={data.v3_Customer_StoryContacts} />
        </Card>
      </div>
    );
  };

  return {
    MessageQueueTable,
    loading,
    data,
  };
};

export default useMessageQueue;
