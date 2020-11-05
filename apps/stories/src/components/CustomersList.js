import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Table from './table/Table';
import TableActions from './table/TableActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../store/actions/actions';
import { ClickLinkColumn, DateColumn, ImageColumn } from './table/columns';

class CustomersList extends Component {
  static propTypes = {
    customers: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { rows: this.buildTableRows(props.customers) }
  }

  static defaultColumns = ['logo', 'name', 'createdAt']

  columns = {
    'logo': () =>  <ImageColumn key='logoUrl'  name= 'Logo' />,
    'name': () =>  <ClickLinkColumn key='name' linkProp='nameUrl' name= 'Name' onClick={this.navigateToCustomer} />,
    'createdAt': () => <DateColumn key='createdAt' name= 'Created At' />,
  }

  navigateToCustomer = (e, customer) => {
    this.props.actions.setCustomer(customer.id, customer.name);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props){
      this.setState({ rows: this.buildTableRows(this.props.customers) })
    }
  }

  buildTableRows(customers) {
    if (!customers || !customers.length) return []
    return customers.map((customer) => ({ nameUrl: `#/dashboard`, ...customer }))
  }

  getColumns(columnsList) {
    return (columnsList || CustomersList.defaultColumns).map(colName => this.columns[colName])
  }

  render() {
    const columns = this.getColumns(this.props.columns)
    return <React.Fragment>
      <Table striped sortColumn='name' sortDirection='ascending' style={this.props.style}
          loading={this.props.loading}
          rows={this.state.rows}
          emptyText={this.props.emptyText || 'There are no customers lists'}
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

const mapStateToProps = () => ({ })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomersList);
