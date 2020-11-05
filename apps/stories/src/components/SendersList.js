import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "./table/Table";
import TableActions from "./table/TableActions";
import {
  Column,
  DateColumn,
  ExtensionStatusColumn,
  BooleanColumn,
  LinkColumn,
  NumberColumn,
  CheckColumn,
  ImageColumn,
  MenuColumn
  
} from "./table/columns";
import SFDCLogo from "../images/sfdc.png";
import OutreachLogo from "../images/outreach.png";
import SalesloftLogo from "../images/salesloft.png";
import MixmaxLogo from "../images/mixmax.png";
import ConnectleaderLogo from "../images/connectleader_square.png";
import { Modal, Button, Glyphicon } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import { useMutation } from '@apollo/react-hooks'
import UPDATE_SENDER_USERTYPE from './mutations/UpdateSender'
import DELETE_IDENTITY_MUTATION from "./mutations/DeleteIdentity";
import {
  RESEND_CONFIRMATION_EMAIL,
  UPDATE_SENDER_ROLE,
  UPDATE_SENDER_DAILY_SENDING_LIMIT,
} from "./mutations/UpdateSender";
import SENDERS_QUERY from "./queries/SendersQuery";
import swal from "sweetalert";

const SendersList = ({ customerId, users, columns, style, fixedheight, loading, selectable, showSearch, children }) => {
  const [deleteIdentity] = useMutation(DELETE_IDENTITY_MUTATION)

  const deleteOption = {
    title: "Are you sure?",
    text: "You will not be able to undo this action! This is highly disruptive for the user as they will need to manually connect again once disconnected.",
    icon: "warning",
    buttons: {
      cancel: {
        text: "No, cancel!",
        value: null,
        visible: true,
        className: "",
        closeModal: false,
      },
      confirm: {
        text: "Yes, disconnect!",
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false,
      },
    },
  };

  const buildSenderMenu = (sender) => {
    const menuItems = [];

    if (sender.userType == "Non-Sender") {
      menuItems.push({
        text: "Activate as Sender",
        onClick: () => setUserType(sender.id, 1),
      });
    }
    if (sender.userType == "Sender") {
      menuItems.push({
        text: "De-activate as Sender",
        onClick: () => setUserType(sender.id, 0),
      });
    }
    if (!sender.confirmed) {
      menuItems.push({
        text: "Re-send Confirmation Email",
        onClick: () => reSendConfirmationsEmail(sender.id),
      });
    }
    if (sender.rolesMask == 4) {
      menuItems.push({
        text: "Promote to Manager",
        onClick: () => setRole(sender.id, 2),
      });
    }
    if (sender.rolesMask == 2) {
      menuItems.push({
        text: "Demote to Employee",
        onClick: () => setRole(sender.id, 4),
      });
    }
    if (sender.dailySendingLimit === 0) {
      menuItems.push({
        text: "Reset Sending Limit",
        onClick: () => setDailySendingLimit(sender.id, 50),
      });
    }
    if (sender.dailySendingLimit !== 0) {
      menuItems.push({
        text: "Disable Sending",
        onClick: () => setDailySendingLimit(sender.id, 0),
      });
    }
    if (sender.connectleaderIdentity) {
      menuItems.push({
        text: "Disconnect from ConnectLeader",
        onClick: () => {
          swal(deleteOption).then((p) =>
            handleDelete(sender.connectleaderIdentity, p, swal)
          );
        }

      });
    }
    if (sender.sfdcIdentity) {
      menuItems.push({
        text: "Disconnect from Salesforce",
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
        "Identity Deleted!",
        "The user has now been disconnected",
        "success"
      );
    } else {
      swal(
        "Cancelled",
        "The user is still connected!",
        "error"
      );
    }
  };

  const buildTableRows = (users) => {
    if (!users || !users.length) return [];

    return users.map((user) => {
      const row = Object.assign({}, user);
      row.id = user.id;
      row.email = user.email;
      row.name = `${user.firstName} ${user.lastName}`;
      row.confirmed = false;
      row.confirmed = user.confirmedAt && true;
      row.company = user.company && user.company.name;
      row.userType =
        user.userType == 0
          ? "Non-Sender"
          : user.userType == 1
          ? "Sender"
          : user.userType == 2
          ? "Avatar"
          : "Not Set";
      // row.extension = user.extensionStatusEvents[0];
      row.roles = user.roles.join(", ");
      row.userUrl = `#/senders/${row.id}`;
      row.dailySendingLimit = user.dailySendingLimit
      // row.selected = !!selectedRows[user.id];
      // row.disableSelect = !!disabledRows[user.id];
      row.connections = [];
      if (user.sfdcIdentity) row.connections.push(SFDCLogo);
      if (user.outreachIdentity) row.connections.push(OutreachLogo);
      if (user.salesloftIdentity) row.connections.push(SalesloftLogo);
      if (user.mixmaxIdentity) row.connections.push(MixmaxLogo);
      if (user.connectleaderIdentity) row.connections.push(ConnectleaderLogo);

      row.menu = buildSenderMenu(row);
      return row;
    });
  };

  const [rows, setRows] = useState(buildTableRows(users))

  const defaultColumns = [
    // "check",
    "name",
    "email",
    "userType",
    "role",
    "confirmed",
    "dailySendingLimit",
    "liFetchQuota",
    "connections",
    // "extension",
    "menu",
  ];

  const columnFunctions = {
    name: () => <LinkColumn key="name" linkUrlProp="userUrl" name="Name" />,
    email: () => <Column key="email" name="Email" />,
    confirmed: () => (
      <BooleanColumn key="confirmed" name="Account Confirmed?" />
    ),
    userType: () => <Column key="userType" name="User Type" />,
    dailySendingLimit: () => (
      <NumberColumn key="dailySendingLimit" name="Daily Sending Limit" />
    ),
    accountsCount: () => <NumberColumn key="accountsCount" name="# of Accounts" />,
    role: () => <Column key="roles" name="User Role" />,
    company: () => <Column key="company" name="Company" />,
    suspendedReason: () => <Column key="suspendedReason" name="Reason" />,
    suspendedAt: () => (
      <DateColumn
        key="suspendedAt"
        name="Suspended At"
        format="YYYY-MM-DD h:mm a"
      />
    ),
    extension: () => (
      <ExtensionStatusColumn key="extension" userIdKey="id" name="Extension" />
    ),
    liFetchQuota: () => (
      <NumberColumn key="liFetchQuota" name="LI Fetch Quota" />
    ),
    connections: () => (
      <ImageColumn key="connections" name="Connections" maxWidth={20} />
    ),
    menu: () => <MenuColumn key="menu" />,
  };

  useEffect(() => {
    setRows(buildTableRows(users))
  }, [users])

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
          variables: { customerId: customerId }
        },
      ],
    });
  }

  const setRole = (senderId, rolesMask) => {
    updateRole({
      variables: {
        id: senderId,
        rolesMask: rolesMask,
      },
      refetchQueries: [
        {
          query: SENDERS_QUERY,
          variables: { customerId: customerId },
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
          variables: { customerId: customerId },
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
          variables: { customerId: customerId },
        },
      ],
    });
  };

  

  const getColumns = (columnsList) => {
    return (columnsList || defaultColumns).map(
      (colName) => columnFunctions[colName]
    );
  }
  
  const allColumns = getColumns(columns);
  return (
    <React.Fragment>
      <Table
        style={style}
        className={fixedheight ? "obw-table-fixed-height" : ""}
        loading={loading}
        rows={rows}
        emptyText="There are no users"
        selectable={selectable}
        showSearch={showSearch}
      >
        {allColumns.map((col) => {
          return col();
        })}
        <TableActions>{children}</TableActions>
      </Table>
    </React.Fragment>
  );
}

export default SendersList
