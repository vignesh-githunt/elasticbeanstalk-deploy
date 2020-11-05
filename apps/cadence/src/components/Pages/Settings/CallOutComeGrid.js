/*
 * @author @rManimegalai
 * @version V11.0
 */
import React from 'react';
import { useTable, useRowSelect } from 'react-table';
import { Table } from 'reactstrap';

const CallOutcomeCheckbox = React.forwardRef(
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
function CallOutcomeRow({ row, rowKey }) {
    return (
        <tr {...row.getRowProps()} className="outcome-row" key={rowKey}>
            {row.cells.map((cell, i) => <td key={i}>{cell.render("Cell")}</td>)}
        </tr>
    );
}
function CallOutComeGrid({ columns, data, callOutcomesData, loading, error }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        callOutcomesData,
        manualPagination: false,
    },
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [{
                id: 'schedule_select',
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <CallOutcomeCheckbox {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                Cell: ({ row }) => (
                    <div>
                        <CallOutcomeCheckbox {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
            },
            ...columns,
            ])
        }
    );
    let tableId = "call_outcome_table"
    return (
        <>
            <Table hover
                {...getTableProps()}
                id={`${tableId}`}
                className="table w-50 dataTable no-footer"
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
                                <CallOutcomeRow
                                    row={row}
                                    key={i}
                                />
                            );
                        })
                    }
                </tbody>
            </Table>
        </>
    );
}
export default CallOutComeGrid;