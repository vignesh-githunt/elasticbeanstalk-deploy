import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Table from './table/Table';
import TableActions from './table/TableActions';
import { Column, LinkColumn, NumberColumn } from './table/columns';
import flatten from 'flat';

export default class StoriesList extends Component {
  static propTypes = {
    stories: PropTypes.array.isRequired,
    baseUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { rows: this.buildTableRows(props.stories) }
  }

  static defaultColumns = ['name', 'priority', 'contactsCount']

  columns = {
    'name': () =>  <LinkColumn key='name' linkUrlProp='nameUrl' name= 'Name' />,
    'priority': () => <Column key='priority'  name= 'Priority' />,
    'contactsCount': () => <NumberColumn key='_storyContactsMeta.count'  name= 'Contacts' />,
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props){
      this.setState({ rows: this.buildTableRows(this.props.stories) })
    }
  }

  buildTableRows(stories) {
    if (!stories || !stories.length) return []
    return stories.map((story) => {
      return { nameUrl: `#${this.props.baseUrl}/${story.id}`, ...flatten(story) }
    });
  }

  getColumns(columnsList) {
    return (columnsList || StoriesList.defaultColumns).map(colName => this.columns[colName])
  }

  render() {
    const columns = this.getColumns(this.props.columns)
    return <React.Fragment>
      <Table striped style={this.props.style}
          loading={this.props.loading}
          rows={this.state.rows}
          emptyText={this.props.emptyText || 'There are no stories'}
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
