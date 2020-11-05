/*
 * @author @rManimegalai
 * @version V11.0
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from 'reactstrap';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { parseUrl } from "query-string";
import {
    FETCH_SCHEDULES_QUERY,
    DELETE_SCHEDULE_QUERY
} from '../../queries/SettingsQuery';
import EmailScheduleGrid from './EmailScheduleGrid';


const EmailExecutionSchedule = ({ match }) => {

    const deleteCallBack = (response, status) => {
        if (status) {
            refetchScheduleData();
        }
    }
    const [scheduleId, setScheduleId] = useState(0);
    const { query: searchParams } = parseUrl(window.location.search);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
    const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
    const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
    const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
    const { data: scheduleData, loading, error, refetch: refetchScheduleData } = useQuery(FETCH_SCHEDULES_QUERY, { 
        variables: { limit, offset },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "cache-first"
    });


    const [deleteSchedule] = useLazyQuery(DELETE_SCHEDULE_QUERY, {
        onCompleted: (response) => deleteCallBack(response, true)
    });
    const rowSelectedValue = (id) => {
        setScheduleId(id)

    }

    const columns = [
        {
            Header: "Name",
            accessor: "name",
            width: "20%",
            Cell: function (props) {
                let id=props.row.original.id
                return (
                    <Link
                        to={"/settings/emailExecutionSchedule/"+id+"/edit"}
                        className="text-dark"
                    >
                        {props.value}
                    </Link>
                );
            }
        },
        {
            Header: "Time zone",
            accessor: "timezone",
            width: "20%"
        },
        {
            Header: "Touch Type",
            accessor: "touchType",
            width: "20%"
        },
        {
            Header: "Created Date",
            accessor: "createdDate",
            width: "20%"
        },
        {
            Header: "Created By",
            accessor: "createdBy",
            width: "20%"

        },
    ];
    const scheduleGridData = useMemo(() => (scheduleData && scheduleData.schedule ? scheduleData.schedule.data : []), [scheduleData]);
    useEffect(() => setPageCount(!loading && scheduleData.schedule.paging ? Math.ceil(scheduleData.schedule.paging.totalCount / limit) : 0), [scheduleData]);

    return (
        <Card className="b">
            <CardHeader className="border-bottom">
                <i className="fa fa-user mr-2"></i>
                <strong>Email Touch Schedule</strong>
                <div className="card-tool float-right">
                    <Link
                        to="/settings/emailExecutionSchedule/add"
                    >
                        <i className="fa fa-plus text-primary mr-2" title="Add Schedule"></i>
                    </Link>
                    <Link
                        to={"/settings/emailExecutionSchedule/"+scheduleId+"/clone"}
                    >
                        <i className="fa fa-clone text-primary mr-2" title="Clone Schedule"></i>
                    </Link>
                    <i className="far fa-trash-alt text-danger" title="Delete Schedule" onClick={() => deleteSchedule({ variables: { id: scheduleId } })}></i>
                </div>
            </CardHeader>
            <EmailScheduleGrid
                columns={columns}
                data={scheduleGridData}
                emailScheduleData={scheduleData}
                fetchData={({ pageIndex, pageSize }) => {
                    setOffset(pageIndex);
                    setCurrentPageIndex(pageIndex);
                    setLimit(pageSize);
                    if (!currentUrlStatePushed) {
                        window.history.replaceState({}, '', window.location.href);
                        setCurrentUrlStatePushed(true);
                    }
                    if (match.params.tab === 'emailExecutionSchedule') {
                        const { query } = parseUrl(window.location.search);
                        query["page[limit]"] = pageSize;
                        query["page[offset]"] = pageIndex;
                        let searchString = Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");
                        window.history.replaceState({}, '', "?" + searchString);
                    }
                }}
                loading={loading}
                error={error}
                pageSize={limit}
                pageCount={pageCount}
                currentPageIndex={currentPageIndex}
                rowSelectedValue={rowSelectedValue}
                handleRefresh={refetchScheduleData}
            />
        </Card>
    );
}
export default EmailExecutionSchedule;