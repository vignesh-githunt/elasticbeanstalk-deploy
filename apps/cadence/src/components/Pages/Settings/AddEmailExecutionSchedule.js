import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import Button from "../../Common/Button";
import {
    CREATE_SCHEDULE_QUERY,
    CREATE_TIMESLOT_QUERY,
    CLONE_SCHEDULE_QUERY,
    FETCH_SCHEDULE_QUERY,
    FETCH_MANAGER_USER_QUERY,
    UPDATE_SCHEDULE_QUERY
} from '../../queries/SettingsQuery';


const AddEmailExecutionSchedule = ({ match }) => {

    const action = match.params.action === "add" ? "Add" : match.params.action === "clone" ? "Clone" : "Edit";
    const scheduleDay = { MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday", THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday" };
    const scheduleHour = {
        t12am: " 12:00 am",
        t1230am: " 12:30 am",
        t1am: " 1:00 am",
        t130am: " 1:30 am",
        t2am: " 2:00 am",
        t230am: " 2:30 am",
        t3am: " 3:00 am",
        t330am: " 3:30 am",
        t4am: " 4:00 am",
        t430am: " 4:30 am",
        t5am: " 5:00 am",
        t530am: " 5:30 am",
        t6am: " 6:00 am",
        t630am: " 6:30 am",
        t7am: " 7:00 am",
        t730am: " 7:30 am",
        t8am: " 8:00 am",
        t830am: " 8:30 am",
        t9am: " 9:00 am",
        t930am: " 9:30 am",
        t10am: " 10:00 am",
        t1030am: " 10:30 am",
        t11am: " 11:00 am",
        t1130am: " 11:30 am",
        t12pm: " 12:00 pm",
        t1230pm: " 12:30 pm",
        t1pm: " 1:00 pm",
        t130pm: " 1:30 pm",
        t2pm: " 2:00 pm",
        t230pm: " 2:30 pm",
        t3pm: " 3:00 pm",
        t330pm: " 3:30 pm",
        t4pm: " 4:00 pm",
        t430pm: " 4:30 pm",
        t5pm: " 5:00 pm",
        t530pm: " 5:30 pm",
        t6pm: " 6:00 pm",
        t630pm: " 6:30 pm",
        t7pm: " 7:00 pm",
        t730pm: " 7:30 pm",
        t8pm: " 8:00 pm",
        t830pm: " 8:30 pm",
        t90pm: " 9:00 pm",
        t930pm: " 9:30 pm",
        t10pm: " 10:00 pm",
        t1030pm: " 10:30 pm",
        t110pm: " 11:00 pm",
        t1130pm: " 11:30 pm"
    }
    const [show, setShow] = useState(false);
    const [activeMondayBlocks, setActiveMondayBlocks] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    const [activeTuesdayBlocks, setActiveTuesdayBlocks] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    const [activeWednesdayBlocks, setActiveWednesdayBlocks] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    const [activeThursdayBlocks, setActiveThursdayBlocks] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    const [activeFridayBlocks, setActiveFridayBlocks] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    const [activeSaturdayBlocks, setActiveSaturdayBlocks] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    const [activeSundayBlocks, setActiveSundayBlocks] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    const [currentScheduleId, setCurrentScheduleId] = useState(0);

    const toastStyles = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const successNotify = () => toast.success("Saved Successfully!", toastStyles)
    const errorNotify = () => toast.error("Failed to save.Try after sometime else contact ConnectLeader support", toastStyles)

    let touchExecutionTimeSlots = [];
    const formRef = React.useRef();

    const { data: eachSchedularData } = useQuery(FETCH_SCHEDULE_QUERY, { variables: { includeAssociationsQry: 'includeAssociations[]=touchExecutionTimeSlots', id: match.params.id } });

    useEffect(() => {
        eachSchedularData &&
            eachSchedularData.schedule.data.map((item) => {
                setValue("name", item.name)
                setValue("timezone", item.timezone)
                setValue("useProspectTimezone", item.useProspectTimezone)
                setValue("includeWeekends", item.includeWeekends)
                setValue("excludeHolidays", item.excludeHolidays)
                setValue("sharedType", item.sharedType)
                setCurrentScheduleId(item.id)
            });

        eachSchedularData &&
            eachSchedularData.schedule.includedAssociations.touchExecutionTimeSlots.map((ts) => {
                switch (ts.weekday) {
                    case 0:
                        let activeSunBlocks = activeSundayBlocks.map((val, i) => {
                            return ts.timeslot - 1 === i ? !val : val;
                        });
                        setActiveSundayBlocks(activeSunBlocks);
                        break;
                    case 1:
                        let activeMonBlocks = activeMondayBlocks.map((val, i) => {
                            return ts.timeslot - 1 === i ? !val : val;
                        });
                        setActiveMondayBlocks(activeMonBlocks);
                        break;
                    case 2:
                        let activeTuesBlocks = activeTuesdayBlocks.map((val, i) => {
                            return ts.timeslot - 1 === i ? !val : val;
                        });
                        setActiveTuesdayBlocks(activeTuesBlocks);
                        break;
                    case 3:
                        let activeWedBlocks = activeWednesdayBlocks.map((val, i) => {
                            return ts.timeslot - 1 === i ? !val : val;
                        });
                        setActiveWednesdayBlocks(activeWedBlocks);
                        break;
                    case 4:
                        let activeThursBlocks = activeThursdayBlocks.map((val, i) => {
                            return ts.timeslot - 1 === i ? !val : val;
                        });
                        setActiveThursdayBlocks(activeThursBlocks);
                        break;
                    case 5:
                        let activeFriBlocks = activeFridayBlocks.map((val, i) => {
                            return ts.timeslot - 1 === i ? !val : val;
                        });
                        setActiveFridayBlocks(activeFriBlocks);
                        break;
                    case 6:
                        let activeSaturBlocks = activeSaturdayBlocks.map((val, i) => {
                            return ts.timeslot - 1 === i ? !val : val;
                        });
                        setActiveSaturdayBlocks(activeSaturBlocks);
                        break;
                    default:
                        break;
                }

            });
    }, [eachSchedularData]);

    const { register, setValue, getValues, errors } = useForm({
        defaultValues: { name: "", timezone: "", sharedGroups: "", useProspectTimezone: false, includeWeekends: false, excludeHolidays: false },
    });

    const [addEmailSchedule, { loading: scheduleLoading }] = useLazyQuery(CREATE_SCHEDULE_QUERY, {
        onCompleted: (response) => addScheduleCallBack(response, true),
        onError: (response) => addScheduleCallBack(response)
    });
    const [addEmailScheduleTimeSlot, { loading: timeslotLoading }] = useLazyQuery(CREATE_TIMESLOT_QUERY, {
        onCompleted: (response) => addTimeSlotCallBack(response, true),
        onError: (response) => addTimeSlotCallBack(response)
    });
    const [editEmailSchedule, { loading: editScheduleLoading }] = useLazyQuery(UPDATE_SCHEDULE_QUERY, {
        variables: { id: currentScheduleId },
        onCompleted: (response) => addScheduleCallBack(response, true),
        onError: (response) => addScheduleCallBack(response)
    });

    const [cloneEmailSchedule, { loading: cloneScheduleLoading }] = useLazyQuery(CLONE_SCHEDULE_QUERY, {
        onCompleted: (response) => addScheduleCallBack(response, true),
        onError: (response) => addScheduleCallBack(response)
    });
    const [isManagerUser, setIsManagerUser] = useState(`filter[isManagerUser]=Y`);
    const { data: managerData } = useQuery(FETCH_MANAGER_USER_QUERY, { variables: { isManagerUser: isManagerUser } });
    let ManagerUserData = "";
    let AllManagers = [];

    if (managerData !== undefined) {
        ManagerUserData = managerData.manager.data.map(mu => {
            AllManagers.push(mu.id);
            return (
                <option value={mu.id} key={mu.id}>{mu.displayName}</option>
            )
        })
    }

    const emailScheduleSubmit = () => {

        let selectTimezone = "";
        let sharedType = "";
        let sharedGroups = [0];
        const scheduleData = getValues();

        if (scheduleData.sharedType !== "none" && scheduleData.sharedType !== "allUsers") {
            sharedGroups = [scheduleData.sharedType];
            sharedType = "specificGroupOfUsers"
        } else if (scheduleData.sharedType === "allUsers") {
            sharedGroups = AllManagers
            sharedType = "allUsers"
        }
        else {
            sharedType = scheduleData.sharedType
        }

        if (scheduleData.timezone === "America/New_York") {
            selectTimezone = "EST"
        } else if (scheduleData.timezone === "America/Chicago") {
            selectTimezone = "CST"
        } else if (scheduleData.timezone === "America/Denver") {
            selectTimezone = "MST"
        } else {
            selectTimezone = "PST"
        }

        if (match.params.action === "clone") {
            let input = {
                name: scheduleData.name,
                timezone: selectTimezone,
                excludeHolidays: scheduleData.excludeHolidays,
                useProspectTimezone: scheduleData.useProspectTimezone,
                includeWeekends: scheduleData.includeWeekends
            }

            cloneEmailSchedule({
                variables: {
                    id: currentScheduleId,
                    scheduleName: scheduleData.name,
                    input,
                }
            })

        } else if (currentScheduleId === 0) {

            let input = {
                name: scheduleData.name,
                timezone: selectTimezone,
                excludeHolidays: scheduleData.excludeHolidays,
                useProspectTimezone: scheduleData.useProspectTimezone,
                includeWeekends: scheduleData.includeWeekends,
                sharedType: sharedType,
                sharedGroups: sharedGroups
            }
            addEmailSchedule({
                variables: {
                    input,
                },
            });
        } else {
            let input = {
                name: scheduleData.name,
                timezone: selectTimezone,
                excludeHolidays: scheduleData.excludeHolidays,
                useProspectTimezone: scheduleData.useProspectTimezone,
                includeWeekends: scheduleData.includeWeekends
            }
            editEmailSchedule({
                variables: {
                    input,
                }
            })
        }
    };

    const addScheduleCallBack = (response, status) => {

        let sundayArray = []
        let mondayArray = [];
        let tuesdayArray = [];
        let wednesdayArray = [];
        let thursdayArray = [];
        let fridayArray = [];
        let saturdayArray = [];

        activeSundayBlocks.map((val, i) => {
            if (val === true) {
                sundayArray.push(i + 1)
            }
        });

        activeMondayBlocks.map((val, i) => {
            if (val === true) {
                mondayArray.push(i + 1)
            }
        });
        activeTuesdayBlocks.map((val, i) => {
            if (val === true) {
                tuesdayArray.push(i + 1)
            }
        });
        activeWednesdayBlocks.map((val, i) => {
            if (val === true) {
                wednesdayArray.push(i + 1)
            }
        });
        activeThursdayBlocks.map((val, i) => {
            if (val === true) {
                thursdayArray.push(i + 1)
            }
        });

        activeFridayBlocks.map((val, i) => {
            if (val === true) {
                fridayArray.push(i + 1)
            }
        });

        activeSaturdayBlocks.map((val, i) => {
            if (val === true) {
                saturdayArray.push(i + 1)
            }
        });
        let sundayData = { weekday: 0, timeslot: sundayArray }
        let mondayData = { weekday: 1, timeslot: mondayArray }
        let tuesdayData = { weekday: 2, timeslot: tuesdayArray }
        let wednesdayData = { weekday: 3, timeslot: wednesdayArray }
        let thursdayData = { weekday: 4, timeslot: thursdayArray }
        let fridayData = { weekday: 5, timeslot: fridayArray }
        let saturdayData = { weekday: 6, timeslot: saturdayArray }

        if (sundayArray.length > 0) {
            touchExecutionTimeSlots.push(sundayData);
        }
        if (mondayArray.length > 0) {
            touchExecutionTimeSlots.push(mondayData);
        }
        if (tuesdayArray.length > 0) {
            touchExecutionTimeSlots.push(tuesdayData);
        }
        if (wednesdayArray.length > 0) {
            touchExecutionTimeSlots.push(wednesdayData);
        }
        if (thursdayArray.length > 0) {
            touchExecutionTimeSlots.push(thursdayData);
        }

        if (fridayArray.length > 0) {
            touchExecutionTimeSlots.push(fridayData);
        }
        if (saturdayArray.length > 0) {
            touchExecutionTimeSlots.push(saturdayData)
        }
        if (status) {
            if (currentScheduleId === 0 || match.params.action === "clone") {
                let input = { scheduleId: response.schedule.data[0].id, touchExecutionTimeSlots: touchExecutionTimeSlots }
                addEmailScheduleTimeSlot({
                    variables: {
                        input,
                    }
                })
            } else {
                let input = { scheduleId: currentScheduleId, touchExecutionTimeSlots: touchExecutionTimeSlots }
                addEmailScheduleTimeSlot({
                    variables: {
                        input,
                    }
                })
            }

        } else {
            errorNotify();
        }
    }
    const addTimeSlotCallBack = (response, status) => {

        if (status) {
            successNotify();
        } else {
            errorNotify();
        }
    }

    const toggleActiveBlock = (day, hour, index) => {

        if (day === scheduleDay.MONDAY) {
            let activeBlocks = activeMondayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveMondayBlocks(activeBlocks);
        }
        if (day === scheduleDay.TUESDAY) {
            let activeBlocks = activeTuesdayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveTuesdayBlocks(activeBlocks);
        }
        if (day === scheduleDay.WEDNESDAY) {
            let activeBlocks = activeWednesdayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveWednesdayBlocks(activeBlocks);
        }
        if (day === scheduleDay.THURSDAY) {
            let activeBlocks = activeThursdayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveThursdayBlocks(activeBlocks);
        }
        if (day === scheduleDay.FRIDAY) {
            let activeBlocks = activeFridayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveFridayBlocks(activeBlocks);
        }
        if (day === scheduleDay.SATURDAY) {
            let activeBlocks = activeSaturdayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveSaturdayBlocks(activeBlocks);
        }
        if (day === scheduleDay.SATURDAY) {
            let activeBlocks = activeSaturdayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveSaturdayBlocks(activeBlocks);
        }
        if (day === scheduleDay.SUNDAY) {
            let activeBlocks = activeSundayBlocks.map((val, i) => {
                return index === i ? !val : val;
            });
            setActiveSundayBlocks(activeBlocks);
        }
    }

    const copyFromAbove = (day) => {

        if (day === scheduleDay.TUESDAY) {
            setActiveTuesdayBlocks(activeMondayBlocks);
        }
        if (day === scheduleDay.WEDNESDAY) {
            setActiveWednesdayBlocks(activeTuesdayBlocks);
        }
        if (day === scheduleDay.THURSDAY) {
            setActiveThursdayBlocks(activeWednesdayBlocks);
        }
        if (day === scheduleDay.FRIDAY) {
            setActiveFridayBlocks(activeThursdayBlocks);
        }
        if (day === scheduleDay.SATURDAY) {
            setActiveSaturdayBlocks(activeFridayBlocks);
        }
        if (day === scheduleDay.SUNDAY) {
            setActiveSundayBlocks(activeSaturdayBlocks);
        }
    }

    return (
        <Card className="b">
            <Breadcrumb className="mb-0">
                <Link to="/settings/emailExecutionSchedule" className="breadcrumb-item">Email Execution Schedule</Link>
                <BreadcrumbItem active>{action}</BreadcrumbItem>
            </Breadcrumb>
            <CardBody className="bt">
                <Form innerRef={formRef}>
                    <FormGroup row>
                        <Label sm={2}>Schedule Name</Label>
                        <Col sm={9}>
                            <Input type="text" name="name" invalid={errors.name} innerRef={register({})}></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={2}>Default Timezone</Label>
                        <Col sm={9}><Input type="select" name="timezone" invalid={errors.timezone} innerRef={register({})}>
                            <option value="America/New_York">EST - Eastern Standard Time</option>
                            <option value="America/Chicago">CST - Central Standard Time</option>
                            <option value="America/Denver">MST - Mountain Standard Time</option>
                            <option value="America/Los_Angeles">PST - Pacific Standard Time</option>
                        </Input>
                        </Col>
                    </FormGroup>
                    <Row>
                        <Col sm={2}></Col>
                        <Col sm={9}>
                            <FormGroup check>
                                <Input type="checkbox" id="use_prospect_timezone" name="useProspectTimezone" invalid={errors.useProspectTimezone} innerRef={register({})} />
                                <Label for="use_prospect_timezone">Send Emails using Prospects Time Zone if available</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup row>
                        <Label sm={2}>Share this schedule with</Label>
                        <Col sm={9}>
                            <Input type="select" name="sharedType" invalid={errors.sharedType} innerRef={register({})}>
                                <option value="none">None</option>
                                <option value="allUsers">All Users</option>
                                {ManagerUserData}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={2}><p><strong>Choose Time Blocks</strong></p></Col>
                        <Col sm={2} >
                            <FormGroup check className="mr-4">
                                <Input type="checkbox" id="include_week_ends" name="includeWeekends" onClick={() => { setShow(!show) }} invalid={errors.includeWeekends} innerRef={register({})} />
                                <Label for="include_week_ends">Include Week Ends</Label>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup check>
                                <Input type="checkbox" id="exclude_week_ends" name="excludeHolidays" invalid={errors.excludeHolidays} innerRef={register({})} />
                                <Label for="exclude_week_ends">Exclude Holidays(This will exclude all Federal Holidays)</Label>
                            </FormGroup>
                        </Col>
                    </FormGroup>
                    <Row className="mt-3">
                        <Col sm={12}>
                            <FormGroup row>
                                <Col sm={12} className="pl-100">
                                    <div className="timeshedule">
                                        <div className="schedule pb-2 pl-3">
                                            <Row>
                                                <Col md={2}>
                                                    <div className="header">
                                                        <div className="header-item Monday-header">
                                                            <h3><div className="ml-2"></div>Monday</h3>
                                                        </div>
                                                        <div className="header-item Tuesday-header">
                                                            <h3><i className="fas fa-copy mr-2 pointer" title="Copy from above" onClick={() => { copyFromAbove(scheduleDay.TUESDAY) }}></i>Tuesday</h3>
                                                        </div>
                                                        <div className="header-item Wednesday-header">
                                                            <h3><i className="fas fa-copy mr-2 pointer" title="Copy from above" onClick={() => { copyFromAbove(scheduleDay.WEDNESDAY) }}></i>Wednesday</h3>
                                                        </div>
                                                        <div className="header-item Thursday-header">
                                                            <h3><i className="fas fa-copy mr-2 pointer" title="Copy from above" onClick={() => { copyFromAbove(scheduleDay.THURSDAY) }}></i>Thursday</h3>
                                                        </div>
                                                        <div className="header-item Friday-header">
                                                            <h3><i className="fas fa-copy mr-2 pointer" title="Copy from above" onClick={() => { copyFromAbove(scheduleDay.FRIDAY) }}></i>Friday</h3>
                                                        </div>
                                                        <div className="header-item Saturday-header" style={{ display: show ? "" : "none" }}>
                                                            <h3><i className="fas fa-copy mr-2 pointer" title="Copy from above" onClick={() => { copyFromAbove(scheduleDay.SATURDAY) }}></i>Saturday</h3>
                                                        </div>
                                                        <div className="header-item Sunday-header" style={{ display: show ? "" : "none" }}>
                                                            <h3><i className="fas fa-copy mr-2 pointer" title="Copy from above" onClick={() => { copyFromAbove(scheduleDay.SUNDAY) }}></i>Sunday</h3>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={10}>
                                                    <div className="tbgwidth">
                                                        <div className="hour-header">
                                                            <div className="hour-header-item">
                                                                <h5>12:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>12:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>1:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>1:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>2:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>2:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>3:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>3:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>4:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>4:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>5:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>5:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>6:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>6:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>7:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>7:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>8:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>8:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>9:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>9:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>10:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>10:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>11:00 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>11:30 am</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>12:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>12:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>1:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>1:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>2:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>2:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>3:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>3:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>4:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>4:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>5:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>5:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>6:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>6:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>7:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>7:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>8:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>8:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>9:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>9:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>10:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>10:30 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>11:00 pm</h5>
                                                            </div>
                                                            <div className="hour-header-item">
                                                                <h5>11:30 pm</h5>
                                                            </div>
                                                        </div>
                                                        <div className="days-wrapper">
                                                            <div className="day Monday">
                                                                <div title="Monday 12:00 am" className={activeMondayBlocks[0] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t12am, 0) }}></div>
                                                                <div title="Monday 12:30 am" className={activeMondayBlocks[1] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1230am, 1) }}></div>
                                                                <div title="Monday 1:00 am" className={activeMondayBlocks[2] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1am, 2) }}></div>
                                                                <div title="Monday 1:30 am" className={activeMondayBlocks[3] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t130am, 3) }}></div>
                                                                <div title="Monday 2:00 am" className={activeMondayBlocks[4] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t2am, 4) }}></div>
                                                                <div title="Monday 2:30 am" className={activeMondayBlocks[5] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t230am, 5) }}></div>
                                                                <div title="Monday 3:00 am" className={activeMondayBlocks[6] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t3am, 6) }}></div>
                                                                <div title="Monday 3:30 am" className={activeMondayBlocks[7] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t330am, 7) }}></div>
                                                                <div title="Monday 4:00 am" className={activeMondayBlocks[8] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t4am, 8) }}></div>
                                                                <div title="Monday 4:30 am" className={activeMondayBlocks[9] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t430am, 9) }}></div>
                                                                <div title="Monday 5:00 am" className={activeMondayBlocks[10] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t5am, 10) }}></div>
                                                                <div title="Monday 5:30 am" className={activeMondayBlocks[11] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t530am, 11) }}></div>
                                                                <div title="Monday 6:00 am" className={activeMondayBlocks[12] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t6am, 12) }}></div>
                                                                <div title="Monday 6:30 am" className={activeMondayBlocks[13] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t630am, 13) }}></div>
                                                                <div title="Monday 7:00 am" className={activeMondayBlocks[14] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t7am, 14) }}></div>
                                                                <div title="Monday 7:30 am" className={activeMondayBlocks[15] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t730am, 15) }}></div>
                                                                <div title="Monday 8:00 am" className={activeMondayBlocks[16] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t8am, 16) }}></div>
                                                                <div title="Monday 8:30 am" className={activeMondayBlocks[17] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t830am, 17) }}></div>
                                                                <div title="Monday 9:00 am" className={activeMondayBlocks[18] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t9am, 18) }}></div>
                                                                <div title="Monday 9:30 am" className={activeMondayBlocks[19] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t930am, 19) }}></div>
                                                                <div title="Monday 10:00 am" className={activeMondayBlocks[20] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t10am, 20) }}></div>
                                                                <div title="Monday 10:30 am" className={activeMondayBlocks[21] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1030am, 21) }}></div>
                                                                <div title="Monday 11:00 am" className={activeMondayBlocks[22] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t11am, 22) }}></div>
                                                                <div title="Monday 11:30 am" className={activeMondayBlocks[23] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1130am, 23) }}></div>
                                                                <div title="Monday 12:00 pm" className={activeMondayBlocks[24] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t12pm, 24) }}></div>
                                                                <div title="Monday 12:30 pm" className={activeMondayBlocks[25] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1230pm, 25) }}></div>
                                                                <div title="Monday 1:00 pm" className={activeMondayBlocks[26] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1pm, 26) }}></div>
                                                                <div title="Monday 1:30 pm" className={activeMondayBlocks[27] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t130pm, 27) }}></div>
                                                                <div title="Monday 2:00 pm" className={activeMondayBlocks[28] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t2pm, 28) }}></div>
                                                                <div title="Monday 2:30 pm" className={activeMondayBlocks[29] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t230pm, 29) }}></div>
                                                                <div title="Monday 3:00 pm" className={activeMondayBlocks[30] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t3pm, 30) }}></div>
                                                                <div title="Monday 3:30 pm" className={activeMondayBlocks[31] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t330pm, 31) }}></div>
                                                                <div title="Monday 4:00 pm" className={activeMondayBlocks[32] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t4pm, 32) }}></div>
                                                                <div title="Monday 4:30 pm" className={activeMondayBlocks[33] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t430pm, 33) }}></div>
                                                                <div title="Monday 5:00 pm" className={activeMondayBlocks[34] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t5pm, 34) }}></div>
                                                                <div title="Monday 5:30 pm" className={activeMondayBlocks[35] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t530pm, 35) }}></div>
                                                                <div title="Monday 6:00 pm" className={activeMondayBlocks[36] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t6pm, 36) }}></div>
                                                                <div title="Monday 6:30 pm" className={activeMondayBlocks[37] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t630pm, 37) }}></div>
                                                                <div title="Monday 7:00 pm" className={activeMondayBlocks[38] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t7pm, 38) }}></div>
                                                                <div title="Monday 7:30 pm" className={activeMondayBlocks[39] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t730pm, 39) }}></div>
                                                                <div title="Monday 8:00 pm" className={activeMondayBlocks[40] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t8pm, 40) }}></div>
                                                                <div title="Monday 8:30 pm" className={activeMondayBlocks[41] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t830pm, 41) }}></div>
                                                                <div title="Monday 9:00 pm" className={activeMondayBlocks[42] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t9pm, 42) }}></div>
                                                                <div title="Monday 9:30 pm" className={activeMondayBlocks[43] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t930pm, 43) }}></div>
                                                                <div title="Monday 10:00 pm" className={activeMondayBlocks[44] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t10pm, 44) }}></div>
                                                                <div title="Monday 10:30 pm" className={activeMondayBlocks[45] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1030pm, 45) }}></div>
                                                                <div title="Monday 11:00 pm" className={activeMondayBlocks[46] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t110pm, 46) }}></div>
                                                                <div title="Monday 11:30 pm" className={activeMondayBlocks[47] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.MONDAY, scheduleHour.t1130pm, 47) }}></div>
                                                            </div>
                                                            <div className="day Tuesday">
                                                                <div title="Tuesday 12:00 am" className={activeTuesdayBlocks[0] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t12am, 0) }}></div>
                                                                <div title="Tuesday 12:30 am" className={activeTuesdayBlocks[1] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1230am, 1) }}></div>
                                                                <div title="Tuesday 1:00 am" className={activeTuesdayBlocks[2] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1am, 2) }}></div>
                                                                <div title="Tuesday 1:30 am" className={activeTuesdayBlocks[3] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t130am, 3) }}></div>
                                                                <div title="Tuesday 2:00 am" className={activeTuesdayBlocks[4] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t2am, 4) }}></div>
                                                                <div title="Tuesday 2:30 am" className={activeTuesdayBlocks[5] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t230am, 5) }}></div>
                                                                <div title="Tuesday 3:00 am" className={activeTuesdayBlocks[6] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t3am, 6) }}></div>
                                                                <div title="Tuesday 3:30 am" className={activeTuesdayBlocks[7] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t330am, 7) }}></div>
                                                                <div title="Tuesday 4:00 am" className={activeTuesdayBlocks[8] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t4am, 8) }}></div>
                                                                <div title="Tuesday 4:30 am" className={activeTuesdayBlocks[9] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t430am, 9) }}></div>
                                                                <div title="Tuesday 5:00 am" className={activeTuesdayBlocks[10] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t5am, 10) }}></div>
                                                                <div title="Tuesday 5:30 am" className={activeTuesdayBlocks[11] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t530am, 11) }}></div>
                                                                <div title="Tuesday 6:00 am" className={activeTuesdayBlocks[12] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t6am, 12) }}></div>
                                                                <div title="Tuesday 6:30 am" className={activeTuesdayBlocks[13] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t630am, 13) }}></div>
                                                                <div title="Tuesday 7:00 am" className={activeTuesdayBlocks[14] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t7am, 14) }}></div>
                                                                <div title="Tuesday 7:30 am" className={activeTuesdayBlocks[15] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t730am, 15) }}></div>
                                                                <div title="Tuesday 8:00 am" className={activeTuesdayBlocks[16] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t8am, 16) }}></div>
                                                                <div title="Tuesday 8:30 am" className={activeTuesdayBlocks[17] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t830am, 17) }}></div>
                                                                <div title="Tuesday 9:00 am" className={activeTuesdayBlocks[18] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t9am, 18) }}></div>
                                                                <div title="Tuesday 9:30 am" className={activeTuesdayBlocks[19] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t930am, 19) }}></div>
                                                                <div title="Tuesday 10:00 am" className={activeTuesdayBlocks[20] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t10am, 20) }}></div>
                                                                <div title="Tuesday 10:30 am" className={activeTuesdayBlocks[21] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1030am, 21) }}></div>
                                                                <div title="Tuesday 11:00 am" className={activeTuesdayBlocks[22] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t11am, 22) }}></div>
                                                                <div title="Tuesday 11:30 am" className={activeTuesdayBlocks[23] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1130am, 23) }}></div>
                                                                <div title="Tuesday 12:00 pm" className={activeTuesdayBlocks[24] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t12pm, 24) }}></div>
                                                                <div title="Tuesday 12:30 pm" className={activeTuesdayBlocks[25] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1230pm, 25) }}></div>
                                                                <div title="Tuesday 1:00 pm" className={activeTuesdayBlocks[26] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1pm, 26) }}></div>
                                                                <div title="Tuesday 1:30 pm" className={activeTuesdayBlocks[27] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t130pm, 27) }}></div>
                                                                <div title="Tuesday 2:00 pm" className={activeTuesdayBlocks[28] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t2pm, 28) }}></div>
                                                                <div title="Tuesday 2:30 pm" className={activeTuesdayBlocks[29] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t230pm, 29) }}></div>
                                                                <div title="Tuesday 3:00 pm" className={activeTuesdayBlocks[30] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t3pm, 30) }}></div>
                                                                <div title="Tuesday 3:30 pm" className={activeTuesdayBlocks[31] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t330pm, 31) }}></div>
                                                                <div title="Tuesday 4:00 pm" className={activeTuesdayBlocks[32] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t4pm, 32) }}></div>
                                                                <div title="Tuesday 4:30 pm" className={activeTuesdayBlocks[33] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t430pm, 33) }}></div>
                                                                <div title="Tuesday 5:00 pm" className={activeTuesdayBlocks[34] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t5pm, 34) }}></div>
                                                                <div title="Tuesday 5:30 pm" className={activeTuesdayBlocks[35] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t530pm, 35) }}></div>
                                                                <div title="Tuesday 6:00 pm" className={activeTuesdayBlocks[36] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t6pm, 36) }}></div>
                                                                <div title="Tuesday 6:30 pm" className={activeTuesdayBlocks[37] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t630pm, 37) }}></div>
                                                                <div title="Tuesday 7:00 pm" className={activeTuesdayBlocks[38] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t7pm, 38) }}></div>
                                                                <div title="Tuesday 7:30 pm" className={activeTuesdayBlocks[39] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t730pm, 39) }}></div>
                                                                <div title="Tuesday 8:00 pm" className={activeTuesdayBlocks[40] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t8pm, 40) }}></div>
                                                                <div title="Tuesday 8:30 pm" className={activeTuesdayBlocks[41] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t830pm, 41) }}></div>
                                                                <div title="Tuesday 9:00 pm" className={activeTuesdayBlocks[42] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t9pm, 42) }}></div>
                                                                <div title="Tuesday 9:30 pm" className={activeTuesdayBlocks[43] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t930pm, 43) }}></div>
                                                                <div title="Tuesday 10:00 pm" className={activeTuesdayBlocks[44] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t10pm, 44) }}></div>
                                                                <div title="Tuesday 10:30 pm" className={activeTuesdayBlocks[45] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1030pm, 45) }}></div>
                                                                <div title="Tuesday 11:00 pm" className={activeTuesdayBlocks[46] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t110pm, 46) }}></div>
                                                                <div title="Tuesday 11:30 pm" className={activeTuesdayBlocks[47] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.TUESDAY, scheduleHour.t1130pm, 47) }}></div>
                                                            </div>
                                                            <div className="day Wednesday">
                                                                <div title="Wednesday 12:00 am" className={activeWednesdayBlocks[0] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t12am, 0) }}></div>
                                                                <div title="Wednesday 12:30 am" className={activeWednesdayBlocks[1] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1230am, 1) }}></div>
                                                                <div title="Wednesday 1:00 am" className={activeWednesdayBlocks[2] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1am, 2) }}></div>
                                                                <div title="Wednesday 1:30 am" className={activeWednesdayBlocks[3] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t130am, 3) }}></div>
                                                                <div title="Wednesday 2:00 am" className={activeWednesdayBlocks[4] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t2am, 4) }}></div>
                                                                <div title="Wednesday 2:30 am" className={activeWednesdayBlocks[5] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t230am, 5) }}></div>
                                                                <div title="Wednesday 3:00 am" className={activeWednesdayBlocks[6] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t3am, 6) }}></div>
                                                                <div title="Wednesday 3:30 am" className={activeWednesdayBlocks[7] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t330am, 7) }}></div>
                                                                <div title="Wednesday 4:00 am" className={activeWednesdayBlocks[8] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t4am, 8) }}></div>
                                                                <div title="Wednesday 4:30 am" className={activeWednesdayBlocks[9] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t430am, 9) }}></div>
                                                                <div title="Wednesday 5:00 am" className={activeWednesdayBlocks[10] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t5am, 10) }}></div>
                                                                <div title="Wednesday 5:30 am" className={activeWednesdayBlocks[11] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t530am, 11) }}></div>
                                                                <div title="Wednesday 6:00 am" className={activeWednesdayBlocks[12] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t6am, 12) }}></div>
                                                                <div title="Wednesday 6:30 am" className={activeWednesdayBlocks[13] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t630am, 13) }}></div>
                                                                <div title="Wednesday 7:00 am" className={activeWednesdayBlocks[14] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t7am, 14) }}></div>
                                                                <div title="Wednesday 7:30 am" className={activeWednesdayBlocks[15] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t730am, 15) }}></div>
                                                                <div title="Wednesday 8:00 am" className={activeWednesdayBlocks[16] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t8am, 16) }}></div>
                                                                <div title="Wednesday 8:30 am" className={activeWednesdayBlocks[17] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t830am, 17) }}></div>
                                                                <div title="Wednesday 9:00 am" className={activeWednesdayBlocks[18] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t9am, 18) }}></div>
                                                                <div title="Wednesday 9:30 am" className={activeWednesdayBlocks[19] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t930am, 19) }}></div>
                                                                <div title="Wednesday 10:00 am" className={activeWednesdayBlocks[20] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t10am, 20) }}></div>
                                                                <div title="Wednesday 10:30 am" className={activeWednesdayBlocks[21] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1030am, 21) }}></div>
                                                                <div title="Wednesday 11:00 am" className={activeWednesdayBlocks[22] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t11am, 22) }}></div>
                                                                <div title="Wednesday 11:30 am" className={activeWednesdayBlocks[23] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1130am, 23) }}></div>
                                                                <div title="Wednesday 12:00 pm" className={activeWednesdayBlocks[24] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t12pm, 24) }}></div>
                                                                <div title="Wednesday 12:30 pm" className={activeWednesdayBlocks[25] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1230pm, 25) }}></div>
                                                                <div title="Wednesday 1:00 pm" className={activeWednesdayBlocks[26] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1pm, 26) }}></div>
                                                                <div title="Wednesday 1:30 pm" className={activeWednesdayBlocks[27] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t130pm, 27) }}></div>
                                                                <div title="Wednesday 2:00 pm" className={activeWednesdayBlocks[28] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t2pm, 28) }}></div>
                                                                <div title="Wednesday 2:30 pm" className={activeWednesdayBlocks[29] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t230pm, 29) }}></div>
                                                                <div title="Wednesday 3:00 pm" className={activeWednesdayBlocks[30] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t3pm, 30) }}></div>
                                                                <div title="Wednesday 3:30 pm" className={activeWednesdayBlocks[31] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t330pm, 31) }}></div>
                                                                <div title="Wednesday 4:00 pm" className={activeWednesdayBlocks[32] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t4pm, 32) }}></div>
                                                                <div title="Wednesday 4:30 pm" className={activeWednesdayBlocks[33] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t430pm, 33) }}></div>
                                                                <div title="Wednesday 5:00 pm" className={activeWednesdayBlocks[34] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t5pm, 34) }}></div>
                                                                <div title="Wednesday 5:30 pm" className={activeWednesdayBlocks[35] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t530pm, 35) }}></div>
                                                                <div title="Wednesday 6:00 pm" className={activeWednesdayBlocks[36] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t6pm, 36) }}></div>
                                                                <div title="Wednesday 6:30 pm" className={activeWednesdayBlocks[37] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t630pm, 37) }}></div>
                                                                <div title="Wednesday 7:00 pm" className={activeWednesdayBlocks[38] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t7pm, 38) }}></div>
                                                                <div title="Wednesday 7:30 pm" className={activeWednesdayBlocks[39] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t730pm, 39) }}></div>
                                                                <div title="Wednesday 8:00 pm" className={activeWednesdayBlocks[40] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t8pm, 40) }}></div>
                                                                <div title="Wednesday 8:30 pm" className={activeWednesdayBlocks[41] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t830pm, 41) }}></div>
                                                                <div title="Wednesday 9:00 pm" className={activeWednesdayBlocks[42] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t9pm, 42) }}></div>
                                                                <div title="Wednesday 9:30 pm" className={activeWednesdayBlocks[43] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t930pm, 43) }}></div>
                                                                <div title="Wednesday 10:00 pm" className={activeWednesdayBlocks[44] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t10pm, 44) }}></div>
                                                                <div title="Wednesday 10:30 pm" className={activeWednesdayBlocks[45] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1030pm, 45) }}></div>
                                                                <div title="Wednesday 11:00 pm" className={activeWednesdayBlocks[46] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t110pm, 46) }}></div>
                                                                <div title="Wednesday 11:30 pm" className={activeWednesdayBlocks[47] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.WEDNESDAY, scheduleHour.t1130pm, 47) }}></div>

                                                            </div>
                                                            <div className="day Thursday">
                                                                <div title="Thursday 12:00 am" className={activeThursdayBlocks[0] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t12am, 0) }}></div>
                                                                <div title="Thursday 12:30 am" className={activeThursdayBlocks[1] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1230am, 1) }}></div>
                                                                <div title="Thursday 1:00 am" className={activeThursdayBlocks[2] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1am, 2) }}></div>
                                                                <div title="Thursday 1:30 am" className={activeThursdayBlocks[3] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t130am, 3) }}></div>
                                                                <div title="Thursday 2:00 am" className={activeThursdayBlocks[4] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t2am, 4) }}></div>
                                                                <div title="Thursday 2:30 am" className={activeThursdayBlocks[5] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t230am, 5) }}></div>
                                                                <div title="Thursday 3:00 am" className={activeThursdayBlocks[6] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t3am, 6) }}></div>
                                                                <div title="Thursday 3:30 am" className={activeThursdayBlocks[7] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t330am, 7) }}></div>
                                                                <div title="Thursday 4:00 am" className={activeThursdayBlocks[8] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t4am, 8) }}></div>
                                                                <div title="Thursday 4:30 am" className={activeThursdayBlocks[9] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t430am, 9) }}></div>
                                                                <div title="Thursday 5:00 am" className={activeThursdayBlocks[10] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t5am, 10) }}></div>
                                                                <div title="Thursday 5:30 am" className={activeThursdayBlocks[11] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t530am, 11) }}></div>
                                                                <div title="Thursday 6:00 am" className={activeThursdayBlocks[12] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t6am, 12) }}></div>
                                                                <div title="Thursday 6:30 am" className={activeThursdayBlocks[13] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t630am, 13) }}></div>
                                                                <div title="Thursday 7:00 am" className={activeThursdayBlocks[14] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t7am, 14) }}></div>
                                                                <div title="Thursday 7:30 am" className={activeThursdayBlocks[15] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t730am, 15) }}></div>
                                                                <div title="Thursday 8:00 am" className={activeThursdayBlocks[16] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t8am, 16) }}></div>
                                                                <div title="Thursday 8:30 am" className={activeThursdayBlocks[17] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t830am, 17) }}></div>
                                                                <div title="Thursday 9:00 am" className={activeThursdayBlocks[18] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t9am, 18) }}></div>
                                                                <div title="Thursday 9:30 am" className={activeThursdayBlocks[19] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t930am, 19) }}></div>
                                                                <div title="Thursday 10:00 am" className={activeThursdayBlocks[20] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t10am, 20) }}></div>
                                                                <div title="Thursday 10:30 am" className={activeThursdayBlocks[21] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1030am, 21) }}></div>
                                                                <div title="Thursday 11:00 am" className={activeThursdayBlocks[22] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t11am, 22) }}></div>
                                                                <div title="Thursday 11:30 am" className={activeThursdayBlocks[23] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1130am, 23) }}></div>
                                                                <div title="Thursday 12:00 pm" className={activeThursdayBlocks[24] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t12pm, 24) }}></div>
                                                                <div title="Thursday 12:30 pm" className={activeThursdayBlocks[25] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1230pm, 25) }}></div>
                                                                <div title="Thursday 1:00 pm" className={activeThursdayBlocks[26] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1pm, 26) }}></div>
                                                                <div title="Thursday 1:30 pm" className={activeThursdayBlocks[27] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t130pm, 27) }}></div>
                                                                <div title="Thursday 2:00 pm" className={activeThursdayBlocks[28] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t2pm, 28) }}></div>
                                                                <div title="Thursday 2:30 pm" className={activeThursdayBlocks[29] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t230pm, 29) }}></div>
                                                                <div title="Thursday 3:00 pm" className={activeThursdayBlocks[30] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t3pm, 30) }}></div>
                                                                <div title="Thursday 3:30 pm" className={activeThursdayBlocks[31] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t330pm, 31) }}></div>
                                                                <div title="Thursday 4:00 pm" className={activeThursdayBlocks[32] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t4pm, 32) }}></div>
                                                                <div title="Thursday 4:30 pm" className={activeThursdayBlocks[33] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t430pm, 33) }}></div>
                                                                <div title="Thursday 5:00 pm" className={activeThursdayBlocks[34] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t5pm, 34) }}></div>
                                                                <div title="Thursday 5:30 pm" className={activeThursdayBlocks[35] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t530pm, 35) }}></div>
                                                                <div title="Thursday 6:00 pm" className={activeThursdayBlocks[36] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t6pm, 36) }}></div>
                                                                <div title="Thursday 6:30 pm" className={activeThursdayBlocks[37] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t630pm, 37) }}></div>
                                                                <div title="Thursday 7:00 pm" className={activeThursdayBlocks[38] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t7pm, 38) }}></div>
                                                                <div title="Thursday 7:30 pm" className={activeThursdayBlocks[39] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t730pm, 39) }}></div>
                                                                <div title="Thursday 8:00 pm" className={activeThursdayBlocks[40] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t8pm, 40) }}></div>
                                                                <div title="Thursday 8:30 pm" className={activeThursdayBlocks[41] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t830pm, 41) }}></div>
                                                                <div title="Thursday 9:00 pm" className={activeThursdayBlocks[42] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t9pm, 42) }}></div>
                                                                <div title="Thursday 9:30 pm" className={activeThursdayBlocks[43] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t930pm, 43) }}></div>
                                                                <div title="Thursday 10:00 pm" className={activeThursdayBlocks[44] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t10pm, 44) }}></div>
                                                                <div title="Thursday 10:30 pm" className={activeThursdayBlocks[45] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1030pm, 45) }}></div>
                                                                <div title="Thursday 11:00 pm" className={activeThursdayBlocks[46] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t110pm, 46) }}></div>
                                                                <div title="Thursday 11:30 pm" className={activeThursdayBlocks[47] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.THURSDAY, scheduleHour.t1130pm, 47) }}></div>
                                                            </div>
                                                            <div className="day Friday">
                                                                <div title="Friday 12:00 am" className={activeFridayBlocks[0] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t12am, 0) }}></div>
                                                                <div title="Friday 12:30 am" className={activeFridayBlocks[1] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1230am, 1) }}></div>
                                                                <div title="Friday 1:00 am" className={activeFridayBlocks[2] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1am, 2) }}></div>
                                                                <div title="Friday 1:30 am" className={activeFridayBlocks[3] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t130am, 3) }}></div>
                                                                <div title="Friday 2:00 am" className={activeFridayBlocks[4] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t2am, 4) }}></div>
                                                                <div title="Friday 2:30 am" className={activeFridayBlocks[5] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t230am, 5) }}></div>
                                                                <div title="Friday 3:00 am" className={activeFridayBlocks[6] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t3am, 6) }}></div>
                                                                <div title="Friday 3:30 am" className={activeFridayBlocks[7] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t330am, 7) }}></div>
                                                                <div title="Friday 4:00 am" className={activeFridayBlocks[8] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t4am, 8) }}></div>
                                                                <div title="Friday 4:30 am" className={activeFridayBlocks[9] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t430am, 9) }}></div>
                                                                <div title="Friday 5:00 am" className={activeFridayBlocks[10] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t5am, 10) }}></div>
                                                                <div title="Friday 5:30 am" className={activeFridayBlocks[11] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t530am, 11) }}></div>
                                                                <div title="Friday 6:00 am" className={activeFridayBlocks[12] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t6am, 12) }}></div>
                                                                <div title="Friday 6:30 am" className={activeFridayBlocks[13] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t630am, 13) }}></div>
                                                                <div title="Friday 7:00 am" className={activeFridayBlocks[14] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t7am, 14) }}></div>
                                                                <div title="Friday 7:30 am" className={activeFridayBlocks[15] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t730am, 15) }}></div>
                                                                <div title="Friday 8:00 am" className={activeFridayBlocks[16] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t8am, 16) }}></div>
                                                                <div title="Friday 8:30 am" className={activeFridayBlocks[17] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t830am, 17) }}></div>
                                                                <div title="Friday 9:00 am" className={activeFridayBlocks[18] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t9am, 18) }}></div>
                                                                <div title="Friday 9:30 am" className={activeFridayBlocks[19] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t930am, 19) }}></div>
                                                                <div title="Friday 10:00 am" className={activeFridayBlocks[20] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t10am, 20) }}></div>
                                                                <div title="Friday 10:30 am" className={activeFridayBlocks[21] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1030am, 21) }}></div>
                                                                <div title="Friday 11:00 am" className={activeFridayBlocks[22] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t11am, 22) }}></div>
                                                                <div title="Friday 11:30 am" className={activeFridayBlocks[23] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1130am, 23) }}></div>
                                                                <div title="Friday 12:00 pm" className={activeFridayBlocks[24] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t12pm, 24) }}></div>
                                                                <div title="Friday 12:30 pm" className={activeFridayBlocks[25] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1230pm, 25) }}></div>
                                                                <div title="Friday 1:00 pm" className={activeFridayBlocks[26] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1pm, 26) }}></div>
                                                                <div title="Friday 1:30 pm" className={activeFridayBlocks[27] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t130pm, 27) }}></div>
                                                                <div title="Friday 2:00 pm" className={activeFridayBlocks[28] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t2pm, 28) }}></div>
                                                                <div title="Friday 2:30 pm" className={activeFridayBlocks[29] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t230pm, 29) }}></div>
                                                                <div title="Friday 3:00 pm" className={activeFridayBlocks[30] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t3pm, 30) }}></div>
                                                                <div title="Friday 3:30 pm" className={activeFridayBlocks[31] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t330pm, 31) }}></div>
                                                                <div title="Friday 4:00 pm" className={activeFridayBlocks[32] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t4pm, 32) }}></div>
                                                                <div title="Friday 4:30 pm" className={activeFridayBlocks[33] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t430pm, 33) }}></div>
                                                                <div title="Friday 5:00 pm" className={activeFridayBlocks[34] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t5pm, 34) }}></div>
                                                                <div title="Friday 5:30 pm" className={activeFridayBlocks[35] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t530pm, 35) }}></div>
                                                                <div title="Friday 6:00 pm" className={activeFridayBlocks[36] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t6pm, 36) }}></div>
                                                                <div title="Friday 6:30 pm" className={activeFridayBlocks[37] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t630pm, 37) }}></div>
                                                                <div title="Friday 7:00 pm" className={activeFridayBlocks[38] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t7pm, 38) }}></div>
                                                                <div title="Friday 7:30 pm" className={activeFridayBlocks[39] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t730pm, 39) }}></div>
                                                                <div title="Friday 8:00 pm" className={activeFridayBlocks[40] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t8pm, 40) }}></div>
                                                                <div title="Friday 8:30 pm" className={activeFridayBlocks[41] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t830pm, 41) }}></div>
                                                                <div title="Friday 9:00 pm" className={activeFridayBlocks[42] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t9pm, 42) }}></div>
                                                                <div title="Friday 9:30 pm" className={activeFridayBlocks[43] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t930pm, 43) }}></div>
                                                                <div title="Friday 10:00 pm" className={activeFridayBlocks[44] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t10pm, 44) }}></div>
                                                                <div title="Friday 10:30 pm" className={activeFridayBlocks[45] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1030pm, 45) }}></div>
                                                                <div title="Friday 11:00 pm" className={activeFridayBlocks[46] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t110pm, 46) }}></div>
                                                                <div title="Friday 11:30 pm" className={activeFridayBlocks[47] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.FRIDAY, scheduleHour.t1130pm, 47) }}></div>
                                                            </div>
                                                            <div className="day Saturday" style={{ display: show ? "" : "none" }}>
                                                                <div title="Saturday 12:00 am" className={activeSaturdayBlocks[0] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t12am, 0) }}></div>
                                                                <div title="Saturday 12:30 am" className={activeSaturdayBlocks[1] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1230am, 1) }}></div>
                                                                <div title="Saturday 1:00 am" className={activeSaturdayBlocks[2] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1am, 2) }}></div>
                                                                <div title="Saturday 1:30 am" className={activeSaturdayBlocks[3] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t130am, 3) }}></div>
                                                                <div title="Saturday 2:00 am" className={activeSaturdayBlocks[4] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t2am, 4) }}></div>
                                                                <div title="Saturday 2:30 am" className={activeSaturdayBlocks[5] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t230am, 5) }}></div>
                                                                <div title="Saturday 3:00 am" className={activeSaturdayBlocks[6] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t3am, 6) }}></div>
                                                                <div title="Saturday 3:30 am" className={activeSaturdayBlocks[7] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t330am, 7) }}></div>
                                                                <div title="Saturday 4:00 am" className={activeSaturdayBlocks[8] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t4am, 8) }}></div>
                                                                <div title="Saturday 4:30 am" className={activeSaturdayBlocks[9] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t430am, 9) }}></div>
                                                                <div title="Saturday 5:00 am" className={activeSaturdayBlocks[10] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t5am, 10) }}></div>
                                                                <div title="Saturday 5:30 am" className={activeSaturdayBlocks[11] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t530am, 11) }}></div>
                                                                <div title="Saturday 6:00 am" className={activeSaturdayBlocks[12] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t6am, 12) }}></div>
                                                                <div title="Saturday 6:30 am" className={activeSaturdayBlocks[13] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t630am, 13) }}></div>
                                                                <div title="Saturday 7:00 am" className={activeSaturdayBlocks[14] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t7am, 14) }}></div>
                                                                <div title="Saturday 7:30 am" className={activeSaturdayBlocks[15] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t730am, 15) }}></div>
                                                                <div title="Saturday 8:00 am" className={activeSaturdayBlocks[16] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t8am, 16) }}></div>
                                                                <div title="Saturday 8:30 am" className={activeSaturdayBlocks[17] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t830am, 17) }}></div>
                                                                <div title="Saturday 9:00 am" className={activeSaturdayBlocks[18] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t9am, 18) }}></div>
                                                                <div title="Saturday 9:30 am" className={activeSaturdayBlocks[19] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t930am, 19) }}></div>
                                                                <div title="Saturday 10:00 am" className={activeSaturdayBlocks[20] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t10am, 20) }}></div>
                                                                <div title="Saturday 10:30 am" className={activeSaturdayBlocks[21] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1030am, 21) }}></div>
                                                                <div title="Saturday 11:00 am" className={activeSaturdayBlocks[22] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t11am, 22) }}></div>
                                                                <div title="Saturday 11:30 am" className={activeSaturdayBlocks[23] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1130am, 23) }}></div>
                                                                <div title="Saturday 12:00 pm" className={activeSaturdayBlocks[24] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t12pm, 24) }}></div>
                                                                <div title="Saturday 12:30 pm" className={activeSaturdayBlocks[25] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1230pm, 25) }}></div>
                                                                <div title="Saturday 1:00 pm" className={activeSaturdayBlocks[26] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1pm, 26) }}></div>
                                                                <div title="Saturday 1:30 pm" className={activeSaturdayBlocks[27] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t130pm, 27) }}></div>
                                                                <div title="Saturday 2:00 pm" className={activeSaturdayBlocks[28] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t2pm, 28) }}></div>
                                                                <div title="Saturday 2:30 pm" className={activeSaturdayBlocks[29] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t230pm, 29) }}></div>
                                                                <div title="Saturday 3:00 pm" className={activeSaturdayBlocks[30] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t3pm, 30) }}></div>
                                                                <div title="Saturday 3:30 pm" className={activeSaturdayBlocks[31] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t330pm, 31) }}></div>
                                                                <div title="Saturday 4:00 pm" className={activeSaturdayBlocks[32] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t4pm, 32) }}></div>
                                                                <div title="Saturday 4:30 pm" className={activeSaturdayBlocks[33] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t430pm, 33) }}></div>
                                                                <div title="Saturday 5:00 pm" className={activeSaturdayBlocks[34] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t5pm, 34) }}></div>
                                                                <div title="Saturday 5:30 pm" className={activeSaturdayBlocks[35] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t530pm, 35) }}></div>
                                                                <div title="Saturday 6:00 pm" className={activeSaturdayBlocks[36] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t6pm, 36) }}></div>
                                                                <div title="Saturday 6:30 pm" className={activeSaturdayBlocks[37] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t630pm, 37) }}></div>
                                                                <div title="Saturday 7:00 pm" className={activeSaturdayBlocks[38] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t7pm, 38) }}></div>
                                                                <div title="Saturday 7:30 pm" className={activeSaturdayBlocks[39] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t730pm, 39) }}></div>
                                                                <div title="Saturday 8:00 pm" className={activeSaturdayBlocks[40] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t8pm, 40) }}></div>
                                                                <div title="Saturday 8:30 pm" className={activeSaturdayBlocks[41] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t830pm, 41) }}></div>
                                                                <div title="Saturday 9:00 pm" className={activeSaturdayBlocks[42] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t9pm, 42) }}></div>
                                                                <div title="Saturday 9:30 pm" className={activeSaturdayBlocks[43] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t930pm, 43) }}></div>
                                                                <div title="Saturday 10:00 pm" className={activeSaturdayBlocks[44] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t10pm, 44) }}></div>
                                                                <div title="Saturday 10:30 pm" className={activeSaturdayBlocks[45] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1030pm, 45) }}></div>
                                                                <div title="Saturday 11:00 pm" className={activeSaturdayBlocks[46] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t110pm, 46) }}></div>
                                                                <div title="Saturday 11:30 pm" className={activeSaturdayBlocks[47] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SATURDAY, scheduleHour.t1130pm, 47) }}></div>
                                                            </div>
                                                            <div className="day Sunday" style={{ display: show ? "" : "none" }}>
                                                                <div title="Sunday 12:00 am" className={activeSundayBlocks[0] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t12am, 0) }}></div>
                                                                <div title="Sunday 12:30 am" className={activeSundayBlocks[1] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1230am, 1) }}></div>
                                                                <div title="Sunday 1:00 am" className={activeSundayBlocks[2] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1am, 2) }}></div>
                                                                <div title="Sunday 1:30 am" className={activeSundayBlocks[3] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t130am, 3) }}></div>
                                                                <div title="Sunday 2:00 am" className={activeSundayBlocks[4] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t2am, 4) }}></div>
                                                                <div title="Sunday 2:30 am" className={activeSundayBlocks[5] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t230am, 5) }}></div>
                                                                <div title="Sunday 3:00 am" className={activeSundayBlocks[6] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t3am, 6) }}></div>
                                                                <div title="Sunday 3:30 am" className={activeSundayBlocks[7] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t330am, 7) }}></div>
                                                                <div title="Sunday 4:00 am" className={activeSundayBlocks[8] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t4am, 8) }}></div>
                                                                <div title="Sunday 4:30 am" className={activeSundayBlocks[9] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t430am, 9) }}></div>
                                                                <div title="Sunday 5:00 am" className={activeSundayBlocks[10] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t5am, 10) }}></div>
                                                                <div title="Sunday 5:30 am" className={activeSundayBlocks[11] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t530am, 11) }}></div>
                                                                <div title="Sunday 6:00 am" className={activeSundayBlocks[12] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t6am, 12) }}></div>
                                                                <div title="Sunday 6:30 am" className={activeSundayBlocks[13] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t630am, 13) }}></div>
                                                                <div title="Sunday 7:00 am" className={activeSundayBlocks[14] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t7am, 14) }}></div>
                                                                <div title="Sunday 7:30 am" className={activeSundayBlocks[15] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t730am, 15) }}></div>
                                                                <div title="Sunday 8:00 am" className={activeSundayBlocks[16] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t8am, 16) }}></div>
                                                                <div title="Sunday 8:30 am" className={activeSundayBlocks[17] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t830am, 17) }}></div>
                                                                <div title="Sunday 9:00 am" className={activeSundayBlocks[18] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t9am, 18) }}></div>
                                                                <div title="Sunday 9:30 am" className={activeSundayBlocks[19] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t930am, 19) }}></div>
                                                                <div title="Sunday 10:00 am" className={activeSundayBlocks[20] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t10am, 20) }}></div>
                                                                <div title="Sunday 10:30 am" className={activeSundayBlocks[21] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1030am, 21) }}></div>
                                                                <div title="Sunday 11:00 am" className={activeSundayBlocks[22] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t11am, 22) }}></div>
                                                                <div title="Sunday 11:30 am" className={activeSundayBlocks[23] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1130am, 23) }}></div>
                                                                <div title="Sunday 12:00 pm" className={activeSundayBlocks[24] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t12pm, 24) }}></div>
                                                                <div title="Sunday 12:30 pm" className={activeSundayBlocks[25] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1230pm, 25) }}></div>
                                                                <div title="Sunday 1:00 pm" className={activeSundayBlocks[26] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1pm, 26) }}></div>
                                                                <div title="Sunday 1:30 pm" className={activeSundayBlocks[27] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t130pm, 27) }}></div>
                                                                <div title="Sunday 2:00 pm" className={activeSundayBlocks[28] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t2pm, 28) }}></div>
                                                                <div title="Sunday 2:30 pm" className={activeSundayBlocks[29] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t230pm, 29) }}></div>
                                                                <div title="Sunday 3:00 pm" className={activeSundayBlocks[30] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t3pm, 30) }}></div>
                                                                <div title="Sunday 3:30 pm" className={activeSundayBlocks[31] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t330pm, 31) }}></div>
                                                                <div title="Sunday 4:00 pm" className={activeSundayBlocks[32] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t4pm, 32) }}></div>
                                                                <div title="Sunday 4:30 pm" className={activeSundayBlocks[33] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t430pm, 33) }}></div>
                                                                <div title="Sunday 5:00 pm" className={activeSundayBlocks[34] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t5pm, 34) }}></div>
                                                                <div title="Sunday 5:30 pm" className={activeSundayBlocks[35] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t530pm, 35) }}></div>
                                                                <div title="Sunday 6:00 pm" className={activeSundayBlocks[36] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t6pm, 36) }}></div>
                                                                <div title="Sunday 6:30 pm" className={activeSundayBlocks[37] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t630pm, 37) }}></div>
                                                                <div title="Sunday 7:00 pm" className={activeSundayBlocks[38] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t7pm, 38) }}></div>
                                                                <div title="Sunday 7:30 pm" className={activeSundayBlocks[39] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t730pm, 39) }}></div>
                                                                <div title="Sunday 8:00 pm" className={activeSundayBlocks[40] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t8pm, 40) }}></div>
                                                                <div title="Sunday 8:30 pm" className={activeSundayBlocks[41] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t830pm, 41) }}></div>
                                                                <div title="Sunday 9:00 pm" className={activeSundayBlocks[42] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t9pm, 42) }}></div>
                                                                <div title="Sunday 9:30 pm" className={activeSundayBlocks[43] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t930pm, 43) }}></div>
                                                                <div title="Sunday 10:00 pm" className={activeSundayBlocks[44] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t10pm, 44) }}></div>
                                                                <div title="Sunday 10:30 pm" className={activeSundayBlocks[45] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1030pm, 45) }}></div>
                                                                <div title="Sunday 11:00 pm" className={activeSundayBlocks[46] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t110pm, 46) }}></div>
                                                                <div title="Sunday 11:30 pm" className={activeSundayBlocks[47] ? "active-block" : "hour"} onClick={(e) => { toggleActiveBlock(scheduleDay.SUNDAY, scheduleHour.t1130pm, 47) }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
                <Button color="primary" disabled={scheduleLoading || timeslotLoading || editScheduleLoading || cloneScheduleLoading} icon={(scheduleLoading || timeslotLoading || editScheduleLoading || cloneScheduleLoading) ? "fas fa-spinner fa-spin" : "fas fa-check"} onClick={() => { emailScheduleSubmit() }}>{(scheduleLoading || timeslotLoading || editScheduleLoading || cloneScheduleLoading) ? "Wait..." : "Save"}</Button>
            </CardBody>
            {/* // TODO need to add icons before the message. icons are fa-check-circle and fas fa-exclamation-circle */}
            <ToastContainer toastStyles />
        </Card>
    );
}

export default AddEmailExecutionSchedule;