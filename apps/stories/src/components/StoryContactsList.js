import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Table from './table/Table';
import TableActions from './table/TableActions';
import { Column, LinkColumn, NumberColumn, IndexColumn } from './table/columns';
import flatten from 'flat';

export default class StoryContactsList extends Component {
  static propTypes = {
    storyContacts: PropTypes.array.isRequired,
    baseUrl: PropTypes.string.isRequired,
    limit: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = { rows: this.buildTableRows(props.storyContacts) }
  }

  static defaultColumns = ['index', 'sender', 'email', 'title', 'account', 'story', 'priority', 'personalizationScore', 'status']

  columns = {
    'index': () => <IndexColumn name='#' />,
    'sender': () => <Column key='sender.fullName' name='Sender' />,
    'email': () => <LinkColumn key='contact.position.email' linkUrlProp='nameUrl' name='Email' />,
    'title': () => <LinkColumn key='contact.position.title' linkUrlProp='nameUrl' name='Title' />,
    'account': () => <LinkColumn key='account.nameValue' linkUrlProp='accountUrl' name='Account' />,
    'story': () => <LinkColumn key='story.name' linkUrlProp='storyUrl' name='Story' />,
    'priority': () => <Column key='priority' name='Priority' />,
    'status': () => <Column key='statusValue' name='Status' />,
    'personalizationScore': () => <NumberColumn key='personalizationScore' name='Score' />,
    'emailContent': () => <Column key='emailPreview' name='EmailContent' />,
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ rows: this.buildTableRows(this.props.storyContacts) })
    }
  }

  buildTableRows(storyContacts) {
    if (!storyContacts || !storyContacts.length) return []
    return storyContacts.map((storyContact) => {
      return { 
        nameUrl: `#accounts/${storyContact.account.id}/contacts/${storyContact.id}`, 
        storyUrl: `#${this.props.baseUrl}/${storyContact.story.id}`, 
        accountUrl: `#accounts/${storyContact.account.id}`, 
        emailPreview: `${storyContact.emailContent["Message1"].join("<br>\n")}`, 
        ...flatten(storyContact) }
    });
  }

  getColumns(columnsList) {
    return (columnsList || StoryContactsList.defaultColumns).map(colName => this.columns[colName])
  }

  render() {
    const columns = this.getColumns(this.props.columns)
    return <React.Fragment>
      <Table striped style={this.props.style}
        loading={this.props.loading}
        rows={this.state.rows}
        emptyText={this.props.emptyText || 'There are no contacts ready'}
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
