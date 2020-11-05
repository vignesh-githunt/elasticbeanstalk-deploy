/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React from 'react';
import { Card, CardBody, CardHeader, FormGroup, Label, Input} from 'reactstrap';
import Button from "../../Common/Button";
import CallOutComeGrid from './CallOutComeGrid';

const Notifications = (props) => {
    const columns = React.useMemo(
        () => [
            {
                Header: "Call Outcomes",
                accessor: "outCome",
                width: "45%"
            },
            {
                Header: "Product Type",
                accessor: "productType",
                width: "45%"
            },
        ],
        []
    );
    const notificationsData = {
        emailNotifications: [{
            outComeId: 1,
            outCome: "Opened"
        }, {
            outComeId: 2,
            outCome: "Sent"
        }, {
            outComeId: 3,
            outCome: "Failed"
        }, {
            outComeId: 4,
            outCome: "Links-Clicked"
        }, {
            outComeId: 5,
            outCome: "Bounced"
        }, {
            outComeId: 6,
            outCome: "Opt-out"
        }, {
            outComeId: 7,
            outCome: "Replied"
        }],
        textNotifications: [{ outComeId: 1, outCome: "Sent" }],
        prospectNotifications: [{ outcomeId: 1, outCome: "Exit Cadence" }, { outcomeId: 2, outCome: "Fall through from Cadence" }, { outcomeId: 3, outCome: "Moved to another Cadence" }, { outcomeId: 4, outCome: "Assigned to a Cadence" }],
        callNotifications: [{ outComeId: 1, outCome: "Other", productType: "PD" }, { outComeId: 2, outCome: "Interested", productType: "PD" }, { outComeId: 3, outCome: "Call Issue", productType: "PD" }]
    }
    const emailNotificationData = notificationsData.emailNotifications.map(en => {
        return (<>
            <FormGroup check className="mb-2">
                <Label check>
                    <Input type="checkbox" id={en.outComeId} />
                    {en.outCome}
                </Label>
            </FormGroup>
        </>
        );
    })
    const prospectNotificationData = notificationsData.prospectNotifications.map(pn => {
        return (<>
            <FormGroup check className="mb-2">
                <Label check>
                    <Input type="checkbox" id={pn.outComeId} />
                    {pn.outCome}
                </Label>
            </FormGroup>
        </>
        );
    })
    const textNotificationData = notificationsData.textNotifications.map(tn => {
        return (<>
            <FormGroup check className="mb-2">
                <Label check>
                    <Input type="checkbox" id={tn.outComeId} />
                    {tn.outCome}
                </Label>
            </FormGroup>
        </>
        );
    })
    return (
        <Card className="b card-default">
            <CardHeader className="bg-gray-lighter text-bold">Notifications</CardHeader>
            <CardBody className="bt">
                <p><i className="fa fa-envelope mr-2"></i><strong>Email Outcomes</strong></p>
                <div> {emailNotificationData}</div>
            </CardBody>
            <CardBody className="bt">
                <p><i className="far fa-comments mr-2"></i><strong>Text Outcomes</strong></p>
                <div > {textNotificationData}</div>
            </CardBody>
            <CardBody className="bt">
                <p> <i className="fas fa-user mr-2"></i><strong>Prospect Actions</strong></p>
                <div> {prospectNotificationData}</div>
            </CardBody>
            <CardBody className="bt">
                <p> <i className="fas fa-users mr-2"></i><strong>Call Outcomes</strong></p>
                <CallOutComeGrid
                    columns={columns}
                    data={notificationsData.callNotifications}
                    callOutcomesData={notificationsData.callNotifications}
                ></CallOutComeGrid>
                <Button color="primary" className="mt-2" icon="fas fa-check">Save</Button>
            </CardBody>
        </Card>
    );
}
export default Notifications;