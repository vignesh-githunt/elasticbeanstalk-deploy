import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  Table,
  CardHeader,
} from 'reactstrap';
import SENDERS_QUERY from '../queries/SendersQuery';
import { ACCOUNT_ASSIGNMENTS_QUERY } from '../queries/AccountAssignmentsQuery';
import { CONTACT_ASSIGNMENTS_QUERY } from '../queries/ContactAssignmentsQuery';
import { STORY_CONTACT_ASSIGNMENTS_QUERY } from '../queries/StoryContactAssignmentsQuery';
import UPDATE_SENDER_USERTYPE from '../mutations/UpdateSender';
import DELETE_IDENTITY_MUTATION from '../mutations/DeleteIdentity';
import {
  RESEND_CONFIRMATION_EMAIL,
  UPDATE_SENDER_ROLE,
  UPDATE_SENDER_DAILY_SENDING_LIMIT,
} from '../mutations/UpdateSender';
import SFDCLogo from '../../images/sfdc.png';
import OutreachLogo from '../../images/outreach.png';
import SalesloftLogo from '../../images/salesloft.png';
import MixmaxLogo from '../../images/mixmax.png';
import ConnectleaderLogo from '../../images/connectleader_square.png';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useTable, useSortBy } from 'react-table';
import swal from 'sweetalert';

const ManageMenu = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ButtonDropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle caret color="secondary">
        Manage
      </DropdownToggle>
      <DropdownMenu>
        {menuItems.map((menuItem) => {
          return menuItem.href ? (
            <DropdownItem key={menuItem.href} href={menuItem.href}>
              {menuItem.text}
            </DropdownItem>
          ) : (
            <DropdownItem key={menuItem.text} onClick={menuItem.onClick}>
              {menuItem.text}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

const AccountAssignments = ({ sender }) => {
  const { data, loading } = useQuery(ACCOUNT_ASSIGNMENTS_QUERY, {
    variables: {
      senderId: sender.id,
    },
  });

  if (loading) return <i className="fa fa-spin fa-spinner"></i>;

  return data._v3_Customer_AccountsMeta.count;
};

const ContactAssignments = ({ sender }) => {
  const { data, loading } = useQuery(CONTACT_ASSIGNMENTS_QUERY, {
    variables: {
      senderId: sender.id,
    },
  });

  if (loading) return <i className="fa fa-spin fa-spinner"></i>;

  return data._v3_Customer_ContactsMeta.count;
};

const StoryContactAssignments = ({ sender }) => {
  const { data, loading } = useQuery(STORY_CONTACT_ASSIGNMENTS_QUERY, {
    variables: {
      senderId: sender.id,
    },
  });

  if (loading) return <i className="fa fa-spin fa-spinner"></i>;

  return data._v3_Customer_StoryContactsMeta.count;
};

const useSendersDataTable = (customerId, currentUser, userLoading) => {
  const [deleteIdentity] = useMutation(DELETE_IDENTITY_MUTATION);
  const [updateUserType] = useMutation(UPDATE_SENDER_USERTYPE);
  const [updateDailySendingLimit] = useMutation(
    UPDATE_SENDER_DAILY_SENDING_LIMIT
  );
  const [updateRole] = useMutation(UPDATE_SENDER_ROLE);
  const [reSendSenderConfirmation] = useMutation(RESEND_CONFIRMATION_EMAIL);

  const setUserType = (senderId, type) => {
    updateUserType({
      variables: {
        id: senderId,
        userType: type,
      },
      refetchQueries: [
        {
          query: SENDERS_QUERY,
          variables: { customerId: customerId || currentUser.companyId },
        },
      ],
    });
  };

  const setRole = (senderId, rolesMask) => {
    updateRole({
      variables: {
        id: senderId,
        rolesMask: rolesMask,
      },
      refetchQueries: [
        {
          query: SENDERS_QUERY,
          variables: { customerId: customerId || currentUser.companyId },
        },
      ],
    });
  };

  const setDailySendingLimit = (senderId, sendingLimit) => {
    updateDailySendingLimit({
      variables: {
        id: senderId,
        dailySendingLimit: sendingLimit,
      },
      refetchQueries: [
        {
          query: SENDERS_QUERY,
          variables: { customerId: customerId || currentUser.companyId },
        },
      ],
    });
  };

  const reSendConfirmationsEmail = (senderId) => {
    reSendSenderConfirmation({
      variables: {
        id: senderId,
      },
      refetchQueries: [
        {
          query: SENDERS_QUERY,
          variables: { customerId: customerId || currentUser.companyId },
        },
      ],
    });
  };

  const deleteOption = {
    title: 'Are you sure?',
    text:
      'You will not be able to undo this action! This is highly disruptive for the user as they will need to manually connect again once disconnected.',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel!',
        value: null,
        visible: true,
        className: '',
        closeModal: false,
      },
      confirm: {
        text: 'Yes, disconnect!',
        value: true,
        visible: true,
        className: 'bg-danger',
        closeModal: false,
      },
    },
  };

  const buildSenderMenu = (sender) => {
    const menuItems = [];

    if (sender.userType === 0) {
      menuItems.push({
        text: 'Activate as Sender',
        onClick: () => setUserType(sender.id, 1),
      });
    }
    if (sender.userType === 1) {
      menuItems.push({
        text: 'De-activate as Sender',
        onClick: () => setUserType(sender.id, 0),
      });
    }
    if (!sender.confirmed) {
      menuItems.push({
        text: 'Re-send Confirmation Email',
        onClick: () => reSendConfirmationsEmail(sender.id),
      });
    }
    if (sender.rolesMask === 4) {
      menuItems.push({
        text: 'Promote to Manager',
        onClick: () => setRole(sender.id, 2),
      });
    }
    if (sender.rolesMask === 2) {
      menuItems.push({
        text: 'Demote to Employee',
        onClick: () => setRole(sender.id, 4),
      });
    }
    if (sender.dailySendingLimit === 0) {
      menuItems.push({
        text: 'Reset Sending Limit',
        onClick: () => setDailySendingLimit(sender.id, 50),
      });
    }
    if (sender.dailySendingLimit !== 0) {
      menuItems.push({
        text: 'Disable Sending',
        onClick: () => setDailySendingLimit(sender.id, 0),
      });
    }
    if (sender.connectleaderIdentity) {
      menuItems.push({
        text: 'Disconnect from ConnectLeader',
        onClick: () => {
          swal(deleteOption).then((p) =>
            handleDelete(sender.connectleaderIdentity, p, swal)
          );
        },
      });
    }
    if (sender.sfdcIdentity) {
      menuItems.push({
        text: 'Disconnect from Salesforce',
        onClick: () => {
          swal(deleteOption).then((p) =>
            handleDelete(sender.sfdcIdentity, p, swal)
          );
        },
      });
    }

    return menuItems;
  };

  const handleDelete = (identityId, isConfirm, swal) => {
    if (isConfirm) {
      deleteIdentity({
        variables: {
          identityId: identityId,
        },
        refetchQueries: [
          {
            query: SENDERS_QUERY,
            variables: { customerId: customerId },
          },
        ],
      });
      swal(
        'Identity Deleted!',
        'The user has now been disconnected',
        'success'
      );
    } else {
      swal('Cancelled', 'The user is still connected!', 'error');
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = React.useMemo(() => [
    {
      Header: 'Name',
      disableSortBy: false,
      Cell: ({ row }) => {
        console.log(row);
        return (
          <a href={`#/senders/${row.original.id}`}>
            {`${row.original.firstName} ${row.original.lastName}`}
          </a>
        );
      },
    },
    // {
    //   Header: 'Email',
    //   accessor: 'email',
    //   disableSortBy: false,
    // },
    {
      Header: 'Type',
      accessor: 'userType',
      disableSortBy: false,
      Cell: ({ cell: { value } }) => {
        const type =
          value === 0
            ? 'Non-Sender'
            : value === 1
            ? 'Sender'
            : value === 2
            ? 'Avatar'
            : 'Not Set';
        return type;
      },
    },
    {
      Header: 'Role',
      accessor: 'roles',
      disableSortBy: false,
      Cell: ({ cell: { value } }) => {
        return value.join(', ');
      },
    },
    {
      Header: 'Confirmed?',
      accessor: 'confirmedAt',
      disableSortBy: false,
      Cell: ({ cell: { value } }) => {
        return value ? <i className="fa fa-check" /> : null;
      },
    },
    {
      Header: 'Daily Limit',
      accessor: 'dailySendingLimit',
      disableSortBy: false,
      Cell: ({ cell: { value } }) => {
        return value ? value.toLocaleString() : '-';
      },
    },
    {
      Header: 'Accounts',
      accessor: 'accountAssignments',
      disableSortBy: false,
      Cell: ({ row }) => {
        return <AccountAssignments sender={row.original} />;
      },
    },
    {
      Header: 'Contacts',
      accessor: 'contactAssignments',
      disableSortBy: false,
      Cell: ({ row }) => {
        return <ContactAssignments sender={row.original} />;
      },
    },
    {
      Header: 'Story Contacts',
      accessor: 'storyContactAssignments',
      disableSortBy: false,
      Cell: ({ row }) => {
        return <StoryContactAssignments sender={row.original} />;
      },
    },
    {
      Header: 'Enrich Quota',
      accessor: 'liFetchQuota',
      disableSortBy: false,
    },
    {
      Header: 'Connections',
      disableSortBy: true,
      accessor: 'connections',
      Cell: ({ row }) => {
        const connections = [];
        if (row.original.sfdcIdentity) connections.push(SFDCLogo);
        if (row.original.outreachIdentity) connections.push(OutreachLogo);
        if (row.original.salesloftIdentity) connections.push(SalesloftLogo);
        if (row.original.mixmaxIdentity) connections.push(MixmaxLogo);
        if (row.original.connectleaderIdentity)
          connections.push(ConnectleaderLogo);
        return connections.map((src) => (
          <img
            key={src}
            src={src}
            alt="logo"
            className="mr-2"
            style={{ maxWidth: '20px' }}
          />
        ));
      },
    },
    {
      Header: '',
      disableSortBy: true,
      accessor: 'id',
      Cell: ({ row }) => {
        return <ManageMenu menuItems={buildSenderMenu(row.original)} />;
      },
    },
  ]);

  const { loading, data } = useQuery(SENDERS_QUERY, {
    variables: {
      customerId: customerId || currentUser.companyId,
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
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };
  const SendersDataTable = () => {
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
          <RTable columns={columns} data={data.users} />
        </Card>
      </div>
    );
  };

  return {
    SendersDataTable,
    loading,
    data,
  };
};

export default useSendersDataTable;
