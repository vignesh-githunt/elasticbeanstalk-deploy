/*
 * @author @Manimegalai
 * @version V11.0
 */
import React from 'react';
import { useTable } from 'react-table';
import { Table } from 'reactstrap';

function ActivityDataGrid({ columns, data, ActivityData, loading, error }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        ActivityData,
        manualPagination: false,
    },
        hooks => {
            hooks.visibleColumns.push(columns => [
                ...columns
            ])
        }
    );
    let tableId = "activity_data_table"
    return (
        <>
            <Table
                hover
                {...getTableProps()}
                id={`${tableId}`}
            >
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map((column) =>
                                    <th {...column.getHeaderProps()} style={{ width: column.width }} >
                                        {column.render("Header")}
                                    </th>
                                )
                            }
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        !loading && !error &&
                        rows.slice(0, 10).map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="activity-row" key={i}>
                                    {row.cells.map((cell, i) => <td key={i}>{cell.render("Cell")}</td>)}
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </>
    );
}
export default ActivityDataGrid;