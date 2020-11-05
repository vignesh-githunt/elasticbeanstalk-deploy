/*
 * @author @Manimegalai V
 * @version V11.0
 */
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, FormGroup, Input, Label } from 'reactstrap';
import Button from "../../Common/Button"
import TransferOwnershipModal from './TransferOwnershipModal';


const TransferOwnership = () => {
    const [showTransferOwnershipModal, setShowTransferOwnershipModal] = useState(false);
    return (
        <Card className="b">
            <CardHeader className="bg-gray-lighter text-bold">
                Transfer OwnerShip Settings
            </CardHeader>
            <CardBody className="bt">
                <FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" name="transferOwnershipAccounts" checked disabled />
                                 Accounts
                        </Label>
                    </FormGroup>
                </FormGroup>
                <FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" name="transferOwnershipProspects" checked disabled />
                                 Prospects
                        </Label>
                    </FormGroup>
                </FormGroup >
                <FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" name="transferOwnershipCadence" checked disabled />
                                Cadences
                        </Label>
                    </FormGroup>
                </FormGroup >
                <FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" name="transferOwnershipEmailTemplate" checked disabled />
                                Email Templates
                        </Label>
                    </FormGroup>
                </FormGroup>
                <Button color="primary" onClick={() => setShowTransferOwnershipModal(true)} icon="fas fa-cog ">Transfer Ownership</Button>
            </CardBody>
            <TransferOwnershipModal
                hideModal={() => { setShowTransferOwnershipModal(false) }}
                showModal={showTransferOwnershipModal}
            />
        </Card>
    );
}
export default TransferOwnership;