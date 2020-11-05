import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { useQuery } from "@apollo/react-hooks";
import { parseUrl } from "query-string";
import Button from "../../Common/Button";
import { FETCH_ALL_USER_QUERY, FETCH_ALL_SYNCLOG_QUERY } from "../../queries/SettingsQuery";
import UserContext from "../../UserContext";
import SyncLogGrid from "./SyncLogGrid";

const SyncLog = ({ match }) => {
    const formRef = useRef();
    const [pageCount, setPageCount] = useState(0);
    const { user, loading: userLoading } = useContext(UserContext);
    const currentUserId = userLoading ? 0 : user.id;
    const { query: searchParams } = parseUrl(window.location.search);
    const [offset, setOffset] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
    const [currentPageIndex, setCurrentPageIndex] = useState(searchParams["page[offset]"] ? parseInt(searchParams["page[offset]"]) : 0);
    const [limit, setLimit] = useState(searchParams["page[limit]"] ? parseInt(searchParams["page[limit]"]) : 10);
    const [currentUrlStatePushed, setCurrentUrlStatePushed] = useState(false);
    const [syncLogFilter, setSyncLogFilter] = useState(`&sort[accountName]=asc&filter[user][id]=${currentUserId}`);
    const [sortBy, setSortBy] = useState("accountName");
    const [orderBy, setOrderBy] = useState("asc");
    const sortByRef = useRef({});
    const sortingParams = {
        "accountName": "sort[accountName]",
        "contactName": "sort[contactName]",
        "recordType": "sort[recordType]",
        "crmId": "sort[crmId]",
        "syncType": "sort[syncType]",
        "syncStatus": "sort[syncStatus]",
        "syncDatetime": "sort[syncDatetime]"
    }

    const { data: userData } = useQuery(FETCH_ALL_USER_QUERY, {});
    let userList = "";
    if (userData !== undefined) {
        userList = userData.user.data.map(us => {
            return (
                <option value={us.id} key={us.id}>{us.displayName}</option>
            )
        })
    }

    const { data: syncLogData, loading, error, refetch: refreshSyncLogGrid } = useQuery(FETCH_ALL_SYNCLOG_QUERY, {
        variables: { syncLogFilter: syncLogFilter, limit, offset },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "cache-first"
    });

    const syncLogGridData = useMemo(() => (syncLogData && syncLogData.synclogs ? syncLogData.synclogs.data : []), [syncLogData]);

    useEffect(() => setPageCount(!loading && syncLogData.synclogs.paging ? Math.ceil(syncLogData.synclogs.paging.totalCount / limit) : 0), [syncLogGridData]);

    const { register, handleSubmit, errors, reset, getValues } = useForm();
    const onSubmit = () => {
        let formValues = getValues();
            const { query } = parseUrl(window.location.search);

            query[sortingParams[sortBy]] = orderBy;
            if (formValues.syncStatus) {
                query["filter[syncStatus]"] = formValues.syncStatus;
            }
            else
                delete query["filter[syncStatus]"];

            if (formValues.syncType) {
                query["filter[syncType]"] = formValues.syncType;
            }
            else
                delete query["filter[syncType]"];

            if (formValues.recordType) {
                query["filter[recordType]"] = formValues.recordType;
            }
            else
                delete query["filter[recordType]"];

            if (formValues.accountName)
                query["filter[accountName]"] = formValues.accountName;
            else
                delete query["filter[accountName]"];

            if (formValues.crmId) {
                query["filter[crmId]"] = formValues.crmId;
            }
            else
                delete query["filter[crmId]"];

            if (formValues.contactName) {
                query["filter[contactName]"] = formValues.contactName;
            }
            else
                delete query["filter[contactName]"];

            if (query["filter[user][id]"] = formValues.user) {
                query["filter[user][id]"] = formValues.user;
                let filterQry = Object.entries({ ...query }).filter(([key]) => key.startsWith("filter") || key.startsWith("sort")).map(([key, val]) => `${key}=${val}`).join("&")
                setSyncLogFilter(filterQry === "" ? "" : "&" + filterQry);
            }
            else {
                delete query["filter[user][id]"];
                let filterQry = Object.entries({ ...query, "filter[user][id]": currentUserId }).filter(([key]) => key.startsWith("filter") || key.startsWith("sort")).map(([key, val]) => `${key}=${val}`).join("&")
                setSyncLogFilter(filterQry === "" ? "" : "&" + filterQry);
            }
    }
    useEffect(() => onSubmit(), [sortBy, orderBy])

    const columns = [{
        Header: "Account Name",
        accessor: "accountName",
        width: "17%"
    }, {
        Header: "Contact Name",
        accessor: "contactName",
        width: "17%"
    }, {
        Header: "Record Type",
        accessor: "recordType",
        width: "13%"
    }, {
        Header: "CRM ID",
        accessor: "crmId",
        width: "18%"
    }, {
        Header: "Sync Type",
        accessor: "syncType",
        width: "10%"
    }, {
        Header: "Status",
        accessor: "syncStatus",
        width: "10%",
        Cell: function (props) {
            let state = props.value === "SUCCESS" ? "fas fa-check-circle text-success mr-2" : "fas fa-times-circle text-danger mr-2";
            return (
                <div><i className={state}></i>{props.value}</div>
            );
        }
    }, {
        Header: "Activity Date Time",
        accessor: "syncDatetime",
        width: "15%",
        Cell: function (props) {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let date = new Date();
            let date1 = new Date(props.value);
            if (date1.getFullYear() === date.getFullYear()) {
                return months[date1.getMonth()] + " " + date1.getDate();
            }
            else {
                return new Date(props.value).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }).replace(",", "");
            }
        }
    }]

    if (!sortByRef.current) {
        sortByRef.current.value = {}
    }
    
    return (
        <>
            <Card className="b">
                <CardHeader className="border-bottom">
                    <strong>Sync Logs</strong>
                </CardHeader>
                <CardBody>
                <Form name="searchForm" onSubmit={handleSubmit(onSubmit)} innerRef={formRef}>
                <FormGroup row>
                    <Col sm={3}>
                        <Label for="date_range">Date Range</Label>
                        <Input
                            type="select"
                            name="daterange"
                            id="date_range"
                            innerRef={register}>
                            <option></option>
                            <option value={"Today"}>Today</option>
                            <option value={"YesterDay"}>YesterDay</option>
                            <option value={"Last Week"}>Last Week</option>
                            <option value={"Current Week"}>Current Week</option>
                            <option value={"Current Month"}>Current Month</option>
                            <option value={"Last Month"}>Last Month</option>
                            <option value={"Current Quarter"}>Current Quarter</option>
                            <option value={"Last Quarter"}>Last Quarter</option>
                        </Input>
                    </Col>
                    <Col sm={3}>
                        <Label for="sync_status">Sync Status</Label>
                        <Input
                            type="select"
                            name="syncStatus"
                            id="sync_status"
                            innerRef={register}>
                            <option></option>
                            <option value="SUCCESS">Success</option>
                            <option value="FAILURE">Failure</option>
                        </Input>
                    </Col>
                    <Col sm={3}>
                        <Label for="sync_type">Sync Type</Label>
                        <Input
                            type="select"
                            name="syncType"
                            id="sync_type"
                            innerRef={register}>
                            <option></option>
                            <option value="RECORD UPDATE">Record Update</option>
                            <option value="ACTIVITIES">Activities</option>
                        </Input>
                    </Col>
                    <Col sm={3}>
                        <Label for="record_type">Record Type</Label>
                        <Input
                            type="select"
                            name="recordType"
                            id="record_type"
                            innerRef={register}>
                            <option></option>
                            <option value="Contact">Contact</option>
                            <option value="Lead">Lead</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Col sm={3}>
                        <Label for="crm_id">CRM ID</Label>
                        <Input type="text" id="crm_id" name="crmId" innerRef={register}></Input>
                    </Col>
                    <Col sm={3}>
                        <Label for="account_name">Account Name</Label>
                        <Input type="text" name="accountName" id="account_name" innerRef={register}></Input>
                    </Col>
                    <Col sm={3}>
                        <Label for="contact_name">Contact Name</Label>
                        <Input type="text" name="contactName" id="contact_name" innerRef={register}></Input>
                    </Col>
                    <Col sm={3}>
                        <Label for="user">Choose Users</Label>
                        <Input
                            type="select"
                            name="user"
                            id="user"
                            innerRef={register}>
                            <option></option>
                            {userList}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row className="d-flex justify-content-center">
                    <Button type="submit" color="primary" icon="fas fa-search" className="mr-2" onClick={onSubmit}>Search</Button>
                    <Button icon="fas fa-sync-alt" type="reset" onClick={() => {
                        reset(onSubmit);
                        setSyncLogFilter(`&sort[${sortBy}]=${orderBy}&filter[user][id]=${currentUserId}`);
                    }}>Reset</Button>
                </FormGroup>
            </Form>
                </CardBody>
                <SyncLogGrid
                    columns={columns}
                    data={syncLogGridData}
                    sortBy={sortBy}
                    orderBy={orderBy}
                    fetchData={({ pageIndex, pageSize }) => {
                        setOffset(pageIndex);
                        setCurrentPageIndex(pageIndex);
                        setLimit(pageSize);
                        if (!currentUrlStatePushed) {
                            window.history.replaceState({}, "", window.location.href);
                            setCurrentUrlStatePushed(true);
                        }
                        if (match.params.tab === "touchOutcomes") {
                            const { query } = parseUrl(window.location.search);
                            query["page[limit]"] = pageSize;
                            query["page[offset]"] = pageIndex;
                            let searchString = Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");
                            window.history.replaceState({}, "", "?" + searchString);
                        }
                    }}
                    loading={loading}
                    pageSize={limit}
                    pageCount={pageCount}
                    error={error}
                    currentPageIndex={currentPageIndex}
                    handleRefresh={refreshSyncLogGrid}
                    handleSort={(sortBy, orderBy) => {

                        setSortBy(sortBy);
                        setOrderBy(orderBy ? "desc" : "asc");
                    }}
                />
            </Card>
        </>
    )
}
export default SyncLog;