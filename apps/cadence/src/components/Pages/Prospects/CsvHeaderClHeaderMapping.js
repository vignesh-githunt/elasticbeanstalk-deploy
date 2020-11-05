/**
 * @author ranbarasan82
 * @version V11.0
 */
import React from "react";
import { useTable } from "react-table";
import { FormGroup, Input, Table } from 'reactstrap';

function CsvHeaderGridRow({ row, rowKey }) {

    return (
        <tr {...row.getRowProps()} key={rowKey}>
            {
                row.cells.map((cell, colIndex) => {
                    if (colIndex == 1) {
                        return (<td key={colIndex}>
                            <FormGroup>
                                <Input type="select" name="prospectField">
                                    <option value="">--Select Field--</option>
                                    <option>First Name</option>
                                    <option>Last Name</option>
                                </Input>
                            </FormGroup>
                        </td>);

                    } else {
                        return (<td key={colIndex}>{cell.render("Cell")}</td>);
                    }
                })
            }
        </tr>
    );
}

function CsvHeaderClHeaderMapping({ columns, data, loading, error }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data
    },
        hooks => {
            hooks.visibleColumns.push(columns => [
                ...columns
            ])
        }
    );

    let tableId = "csv-header-cl-header-mapping";
    return (
        <Table className="mb-0" {...getTableProps()}>
            <thead>
                {
                    headerGroups.map((headerGroup) => (
                        <tr {
                            ...headerGroup.getHeaderGroupProps()
                        }>
                            {
                                headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()} style={{ width: column.width }} >
                                        {column.render("Header")}
                                    </th>
                                ))
                            }
                        </tr>
                    ))
                }
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                    rows.slice(0, 10).map((row, i) => {
                        prepareRow(row);
                        return (
                            <CsvHeaderGridRow
                                row={row}
                                key={i}
                            />
                        );
                    })
                }
            </tbody>
        </Table>
    );
}
export default CsvHeaderClHeaderMapping;