/*
 * @author @rManimegalai
 * @version V11.0
 */
import React from 'react';
import {useRowSelect,useTable } from 'react-table';
import { Table } from 'reactstrap';

const OutcomeCheckbox = React.forwardRef(
    ({ callOutcome, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef
        React.useEffect(() => {
            resolvedRef.current.indeterminate = callOutcome
        }, [resolvedRef, callOutcome])
        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)
function SyncActivityGrid({ columns, data, OutcomesData, loading, error }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        OutcomesData,
        manualPagination: false,
    },
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                ...columns, {
                    id: 'schedule_select',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <OutcomeCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <OutcomeCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
            ])
        }
    );
    let tableId = "sync_outcome_table"
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
                                <tr {...row.getRowProps()} className="sync-row" key={i}>
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
export default SyncActivityGrid;