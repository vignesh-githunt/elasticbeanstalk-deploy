import { from } from 'apollo-link';
/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React, { useContext, useState } from "react";
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label } from "reactstrap";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { FETCH_USER_SETTING_QUERY, UPDATE_USER_SETTING_QUERY } from "../../queries/SettingsQuery";
import UserContext from "../../UserContext";

const UserSettings = () => {
    const { user, loading: userLoading } = useContext(UserContext);
    const [menuExpanded, setMenuExpanded] = useState(user.isTrucadenceLeftmenuExpanded);

    const { data: userSettingData, loading, error } = useQuery(FETCH_USER_SETTING_QUERY, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "cache-first"
    });

    const [editUserSettingData] = useLazyQuery(UPDATE_USER_SETTING_QUERY, {
    });

    let userData = [];
    if (userSettingData && userSettingData.usersettings && userSettingData.usersettings.data) {
        userData = userSettingData.usersettings.data[0];
    }

    const handleChange = () => {
        setMenuExpanded(!menuExpanded);
        editUserSettingData({
            variables: {
                menuExpanded: !menuExpanded,
            },
        })
    }

    return (
        <>
            <Card className="b">
                <CardHeader className="bg-gray-lighter text-bold">User Settings</CardHeader>
                <CardBody className="bt">
                    <p><strong>Emails</strong></p>
                    <FormGroup row>
                        <Label sm={3}>Email Govern Limit</Label>
                        <Col sm={3}><Input type="text" value={userData.perDayUserLimit} disabled></Input></Col>
                        <Label sm={3}>Emails per day</Label>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Total Emails Sent</Label>
                        <Col sm={3}><Input type="text" value={userData.perDayUsed} disabled></Input></Col>
                        <Label sm={3}>in the Last 24 hours</Label>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}># of Emails Attempt</Label>
                        <Col sm={3}><Input type="text" value={userData.noOfEmailAttemptsPerDay} disabled></Input></Col>
                        <Label sm={3}>per Prospects per day</Label>
                    </FormGroup>
                </CardBody>
                <CardBody className="bt">
                    <p><strong>Prospects</strong></p>
                    <FormGroup row>
                        <Label sm={3} >Duplicate Check Enable</Label>
                        <Col sm={2} className="ml-3">
                            <Input
                                type="radio"
                                name="duplicateCheckEnable"
                                checked={userData.checkCalllistRecordsDuplicates === true}
                                disabled={userData.checkCalllistRecordsDuplicates === false}
                            >
                            </Input>
                                Yes
                        </Col>
                        <Col sm={2}>
                            <Input
                                type="radio"
                                name="duplicateCheckEnable"
                                checked={userData.checkCalllistRecordsDuplicates === false}
                                disabled={userData.checkCalllistRecordsDuplicates === true}
                            >
                            </Input>
                                No
                        </Col>
                    </FormGroup>
                    <FormGroup row style={{ display: (userData.checkCalllistRecordsDuplicates === false) ? "none" : "" }}>
                        <Label sm={3}>Duplicate Check based </Label>
                        <Col sm={4}>
                            <Input value={userData.checkDuplicatesBasedOn} disabled>
                            </Input>
                        </Col>
                    </FormGroup>
                </CardBody>
                <CardBody className="bt">
                    <p><strong>Defaut Menu</strong></p>
                    <FormGroup check>
                        <Input type="checkbox" id="menu_expanded" name="menuexpanded" checked={menuExpanded} onChange={handleChange} />
                        <Label for="menu_expanded">Expand Menu Items upon screen load</Label>
                    </FormGroup>
                </CardBody>
            </Card>
        </>
    );
}
export default UserSettings;
