/**
 * @author ranbarasan82
 * @version V11.0
 */
import React from "react";
import { useTable } from "react-table";
import { Input, Table } from 'reactstrap';

function LogicGridRow({ row, rowKey }) {
  return (
    <tr {...row.getRowProps()} key={rowKey}>
      {row.cells.map((cell, colIndex) => {
        if (colIndex == 0) {
          return (
            <td key={colIndex}>
              <Input type="select" name="prospectField" id={"prospect_field_" + rowKey}>
                <option></option>
                <option>First Name</option>
                <option>Last Name</option>
              </Input>
            </td>
          );
        } else if (colIndex == 1) {
          return (
            <td key={colIndex}>
              <Input type="select" name="operator" id={"operator_" + rowKey}>
                <option></option>
                <option>equal</option>
                <option>not equal</option>
              </Input>
            </td>
          );
        } else {
          return (
            <td key={colIndex}>
              <Input type="text" name="filterValue" id={"filter_value" + rowKey} />
            </td>
          );
        }
      })}
    </tr>
  );
}

function AddFilterLogicGrid({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  },
    (hooks) => {
      hooks.visibleColumns.push((columns) => [...columns]);
    }
  );

  let tableId = "filter_logic_table";
  return (
    <Table {...getTableProps()} id={tableId} className="mb-0">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} style={{ width: column.width }}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.slice(0, 10).map((row, i) => {
          prepareRow(row);
          return <LogicGridRow row={row} key={i} />;
        })}
      </tbody>
    </Table>
  );
}

export default AddFilterLogicGrid;