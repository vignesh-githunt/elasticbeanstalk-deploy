/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React from "react";
import { useTable, usePagination } from 'react-table';
import { Table } from 'reactstrap';

function SyncFieldMappingGrid({ columns, data, fieldData, loading, error }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        fieldData
    },
        usePagination,
        hooks => {
            hooks.visibleColumns.push(columns => [
                ...columns,
            ])
        }
    );

    let tableId = "sync_table"
    var tabWidth = {
        width: '2000px'
    };
    return (
        <>
            <div className="tbgwidth">
                <Table
                    hover
                    {...getTableProps()}
                    id={`${tableId}`}
                    style={tabWidth}
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
                                    <tr {...row.getRowProps()} className="sync-row" key={i}>
                                        {row.cells.map((cell, i) => <td key={i}>{cell.render("Cell")}</td>)}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </>
    );
}
export default SyncFieldMappingGrid;