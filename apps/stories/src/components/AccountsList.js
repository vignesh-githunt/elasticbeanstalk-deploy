import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Table from './table/Table';
import TableActions from './table/TableActions';
import { Column, LinkColumn, ImageColumn } from './table/columns';

export default class AccountsList extends Component {
  static propTypes = {
    accounts: PropTypes.array.isRequired,
    baseUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { rows: this.buildTableRows(props.accounts) }
  }

  static defaultColumns = ['logo', 'name', 'domain', 'industry', 'employeeCount', 'status']

  columns = {
    'logo': () =>  <ImageColumn key='logoValue'  name= 'Logo' maxWidth={30} />,
    'name': () =>  <LinkColumn key='nameValue' linkUrlProp='nameUrl' name= 'Name' />,
    'domain': () => <Column key='domainsValue'  name= 'Domain' />,
    'industry': () => <Column key='industriesValue'  name= 'Industry' />,
    'employeeCount': () => <Column key='employeeCountRangesValue'  name= 'Employees' />,
    'status': () => <Column key='status'  name= 'Status' />,
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props){
      this.setState({ rows: this.buildTableRows(this.props.accounts) })
    }
  }

  buildTableRows(accounts) {
    if (!accounts || !accounts.length) return []
    return accounts.map((account) => {
      return { nameUrl: `#${this.props.baseUrl}/${account.id}`, ...account }
    })
  }

  getColumns(columnsList) {
    return (columnsList || AccountsList.defaultColumns).map(colName => this.columns[colName])
  }

  render() {
    const columns = this.getColumns(this.props.columns)
    return <React.Fragment>
      <Table striped style={this.props.style}
          loading={this.props.loading}
          rows={this.state.rows}
          emptyText={this.props.emptyText || 'There are no accounts'}
          selectable={this.props.selectable}
          showSearch={this.props.showSearch}>
          {columns.map(col => {
            return col()
          })}
          <TableActions>
            {this.props.children}
          </TableActions>
      </Table>
    </React.Fragment>
  }
}
