import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Table from './table/Table';
import TableActions from './table/TableActions';
import { Column, LinkColumn, ImageColumn } from './table/columns';
import flatten from 'flat';

export default class ContactsList extends Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired,
    baseUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { rows: this.buildTableRows(props.contacts) }
  }

  static defaultColumns = ['avatar', 'firstName', 'lastName', 'emails', 'titles', 'linkedinUrl']

  columns = {
    'avatar': () =>  <ImageColumn key='avatarsValue'  name= 'Photo' maxWidth={50} />,
    'firstName': () =>  <LinkColumn key='givenNameValue' linkUrlProp='nameUrl' name= 'First Name' />,
    'lastName': () => <Column key='familyNameValue'  name= 'Last Name' />,
    'email': () => <Column key='email'  name= 'Email' />,
    'emails': () => <Column key='email'  name= 'Emails' />,
    'title': () => <Column key='title'  name= 'Title' />,
    'titles': () => <Column key='titles'  name= 'Title' />,
    'linkedinUrl': () => <Column key='linkedinUrlsValue'  name= 'LinkedIn' />,
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props){
      this.setState({ rows: this.buildTableRows(this.props.contacts) })
    }
  }

  buildTableRows(contacts) {
    if (!contacts || !contacts.length) return []
    return contacts.map((person) => {
      return { nameUrl: `#${this.props.baseUrl}/${person.id}`, ...flatten(person) }
    })
  }

  getColumns(columnsList) {
    return (columnsList || ContactsList.defaultColumns).map(colName => this.columns[colName])
  }

  render() {
    const columns = this.getColumns(this.props.columns)
    return <React.Fragment>
      <Table striped style={this.props.style}
          loading={this.props.loading}
          rows={this.state.rows}
          emptyText={this.props.emptyText || 'There are no contacts'}
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
