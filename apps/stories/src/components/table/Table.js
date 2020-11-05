import React, { Component } from 'react'
import { TableRows } from './TableRows'
import TableActions from './TableActions'
import debounce from 'lodash/debounce'
import * as Columns from './columns'
import './table.scss'
import Loader from '../Loader'

export default class Table extends Component {

  static propTypes = {

  }

  constructor(props) {
    super(props)
    const rows = (props.rows || []).slice(0)
    this.columnTypes = Object.values(Columns)
    this.state = {
      allRows: rows,
      rows: rows,
      indexedRows: props.onSearch ? [] : rows.map(this.indexRow),
      searchValue: props.search || '',
      sortColumn: props.sortColumn || null,
      direction: props.sortDirection || null
    }
  }

  componentDidMount() {
    if (!this.props.autoFixedHeight) return
    const toolbarHeight = this.containerElement.firstElementChild.offsetHeight
    const toolbarStyle = getComputedStyle(this.containerElement.firstElementChild)
    const tableElement = this.containerElement.lastElementChild.firstElementChild
    const toolBarTopBotMargin = parseInt(toolbarStyle.marginTop, 10) + parseInt(toolbarStyle.marginBottom, 10)
    tableElement.style.height = (this.containerElement.parentElement.offsetHeight - toolbarHeight - toolBarTopBotMargin) + 'px'
  }

  get columns() {
    return Array.isArray(this.props.children) ?
           this.getColumnsFromChildren(this.props.children) :
           this.isColumn(this.props.children) ?
           [this.props.children] :
           []
  }

  getColumnsFromChildren(children) {
    let cols = []
    children.forEach(child => {
      if (Array.isArray(child))
        cols = cols.concat(this.getColumnsFromChildren(child))
      else if (this.isColumn(this.columnTypes, child))
        cols.push(child)
    })
    return cols
  }

  get tableActions() {
    const tableActions = Array.isArray(this.props.children) ?
                         this.props.children.find(child => !!child && child.type === TableActions) :
                         this.props.children.type === TableActions ?
                         this.props.children :
                         null

    return tableActions ? tableActions.props.children : null
  }

  isColumn(columnTypes, component) {
    return !!component && columnTypes.indexOf(component.type) > -1
  }

  indexRow = (row) => {
    const rowFields = Object.keys(row)
    const searchValue = rowFields.reduce((currentSearchValue, field) => {
      if (field.startsWith('__')) return currentSearchValue
      const value = row[field] ? row[field].toString().toLowerCase() : ''
      return currentSearchValue + `|${value}`
    }, '')
    if (row.rows)
      row.indexedRows = row.rows.map(this.indexRow)
    return { searchValue, row }
  }

  updateFilterValue = (filter, ev) => {
    const value = ev.target.value
    const { onFilter } = this.props

    if( onFilter && (value.length > 2 || !value))
        this.doProvidedFilter(value, filter)
  }

  doProvidedFilter = debounce((value, filter) => {
    this.props.onFilter(value, filter)
  }, 500)

  updateSearchValue = (ev) => {
    const value = ev.target.value
    this.setState({ searchValue: value })
    if (this.props.onSearch) {

      if (value.length > 2 || !value)
        this.doProvidedSearch(value)
      return
    }

    this.doLocalSearch(value)
  }

  doProvidedSearch = debounce((searchValue) => {
    this.props.onSearch(searchValue)
  }, 500)

  doLocalSearch = debounce((searchValue) => {
    const newState = {
      rows: this.getRowsToDisplay(searchValue.toLowerCase(), this.state.allRows, this.state.indexedRows)
    }
    if (this.state.sortColumn && this.state.direction)
      this.performFullSort(this.state.sortColumn, this.state.direction, newState.rows, newState)
    this.setState(newState)
  }, 500)

  getRowsToDisplay(searchValue, allRows, indexedRows) {
    const rowsToDisplay = searchValue.length < 3 ?
                          allRows :
                          this.filterRows(searchValue, indexedRows)
    return rowsToDisplay
  }

  filterRows(searchValue, rowsToSearch) {
    const filteredRows = []
    rowsToSearch.forEach(this.filterRow.bind(this, filteredRows, searchValue))
    return filteredRows
  }

  filterRow(filteredRows, searchValue, rowToFilter) {
    if (!rowToFilter.row.rows) {
      if (rowToFilter.searchValue.indexOf(searchValue) > -1)
        filteredRows.push(rowToFilter.row)
      return
    }

    const returnRow = {}
    Object.assign(returnRow, rowToFilter.row)
    returnRow.rows = this.filterRows(searchValue, returnRow.indexedRows)
    if (returnRow.rows.length || rowToFilter.searchValue.indexOf(searchValue) > -1)
      filteredRows.push(returnRow)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows === this.props.rows && nextProps.cols === this.props.cols) return
    const rows = nextProps.rows || []
    const indexedRows = rows.map(this.indexRow)
    this.setState({
      indexedRows: indexedRows,
      allRows: rows,
      rows: this.getRowsToDisplay(this.state.searchValue.toLowerCase(), rows, indexedRows)
    })
  }

  sortableValue(value) {
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value
    }
    return (value || '').toString().toLowerCase()
  }

  performFullSort(sortColumn, direction, rows, state) {
    state.sortColumn = sortColumn
    state.rows = rows.sort((rowA, rowB) => {
      const rowAValue = this.sortableValue(rowA[sortColumn])
      const rowBValue = this.sortableValue(rowB[sortColumn])
      if (rowAValue < rowBValue)
        return direction === 'ascending' ? -1 : 1
      else if (rowAValue > rowBValue)
        return direction === 'ascending' ? 1 : -1
      return 0
    })
    state.direction = direction
  }

  onSort = columnToSort => () => {
    if (this.state.sortColumn !== columnToSort) {
      const newState = {}
      this.performFullSort(columnToSort, 'descending', this.state.rows, newState)
      this.setState(newState)
      return
    }

    this.setState({
      data: this.state.rows.reverse(),
      direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  render() {

    const { selectable, className} = this.props
    let tableClass = 'table table-striped'
    if (selectable) tableClass += ' selectable'
    if (className) tableClass += ` ${className}`
    return (
      <div ref={(ele) => { this.containerElement = ele }}>
        {(this.tableActions || this.props.showSearch) &&
          <div className='obw-table-toolbar'>
            <div className='obw-table-actions'>
              {this.tableActions}
            </div>
            {this.props.showSearch &&
              <div className='obw-field-with-icon obw-table-search'>
                <input type='text' placeholder='Search...' value={this.state.searchValue} onChange={this.updateSearchValue} />
                <i className='fa fa-search'></i>
              </div>
            }
          </div>
        }
        <table style={this.props.style} className={tableClass}>
          <thead>
            <tr>
              {this.columns.map(col => {
                return <th key={col.key}
                          width={col.props.width}
                          sorted={this.state.sortColumn === col.key ? this.state.direction : null}>
                  <span onClick={this.onSort(col.key)}>{col.props.name} {this.state.sortColumn === col.key ? this.state.direction === 'descending' ? <i className='fa fa-caret-down' ></i> : <i className='fa fa-caret-up' ></i> : ''}</span>
                  {col.props.allowFilter &&
                    <div className='obw-field-with-icon obw-table-search'>
                      <input type='text' placeholder={'Add a filter on ' + col.props.name} onChange={(e) => this.updateFilterValue(col.props.name.toLowerCase(), e)} />
                    </div>}
                </th>
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.loading && (
              <tr>
                <td colSpan={this.columns.length}>
                  <Loader />
                </td>
              </tr>
            )}
            {this.state.rows.length === 0 && !this.props.loading ? (
                <tr>
                  <td colSpan={this.columns.length} style={{ textAlign: 'center' }}>
                    {this.props.emptyText}
                  </td>
                </tr>
              ) : (
                <TableRows rows={this.state.rows} cols={this.columns} openGroups={this.state.searchValue.length > 3} />
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}
