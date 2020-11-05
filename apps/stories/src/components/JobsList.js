import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Table from "./table/Table";
import TableActions from "./table/TableActions";
import { Column, LinkColumn, NumberColumn } from "./table/columns";
import { Badge } from "reactstrap";

export default class JobsList extends Component {
  static propTypes = {
    jobs: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      rows: this.buildTableRows(props),
    };
  }

  static defaultColumns = [
    "name",
    "status",
    "started",
    "duration",
    "childJobsCount",
    "logsCount",
  ];

  columns = {
    name: () => <LinkColumn key="name" linkUrlProp="jobUrl" name="Name" />,
    status: () => <Column key="statusLabel" name="Status" />,
    started: () => <Column key="started" name="Started" />,
    duration: () => <Column key="duration" name="Duration" />,
    childJobsCount: () => (
      <NumberColumn key="childJobCount" name="Child Jobs" />
    ),
    logsCount: () => <NumberColumn key="logsCount" name="Logs" />,
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        rows: this.buildTableRows(this.props),
      });
    }
  }

  buildTableRows(props) {
    return props.jobs.map((job) => {
      const row = Object.assign({}, job);

      row.name = row.className
        .replace("Worker", "")
        .split(/(?=[A-Z])/)
        .join(" ");
      row.jobUrl = `/v2#/admin/jobs/${job.id}`;
      row.started = moment(row.startTime).fromNow();
      row.duration = "-";
      if (row.endTime) {
        let difference = moment(row.endTime).diff(moment(row.startTime));
        row.duration = moment.duration(difference).humanize();
      }
      row.customer = job.customer && job.customer.name;
      row.customerUrl = job.customer && `#/customers/${job.customer.id}`;
      row.logsCount = job._eventLogsMeta.count;
      row.childJobsCount = job._childJobsMeta.count;
      let statusColor = "info";
      switch (job.status) {
        case "success":
          statusColor = "success";
          break;
        case "error":
        case "terminated":
          statusColor = "danger";
          break;
        default:
          break;
      }
      row.statusLabel = <Badge color={statusColor}>{job.status}</Badge>;
      return row;
    });
  }

  getColumns(columnsList) {
    return (columnsList || JobsList.defaultColumns).map(
      (colName) => this.columns[colName]
    );
  }

  render() {
    const Paginator = this.props.pager;
    const columns = this.getColumns(this.props.columns);
    return (
      <Table
        style={this.props.style}
        className={this.props.fixedheight ? "obw-table-fixed-height" : ""}
        loading={this.props.loading}
        rows={this.state.rows}
        emptyText="There are no jobs"
        selectable={false}
        showSearch={false}
      >
        {columns.map((col) => {
          return col();
        })}
        <TableActions>
          {Paginator && <Paginator />}
          {this.props.children}
        </TableActions>
      </Table>
    );
  }
}
