/**
 * @author ranbarasan
 * @version v11.0
 */
import React, { useState } from 'react';
import { Button, Col, Form, FormGroup, FormText, Input, InputGroup, InputGroupAddon, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { default as ClButton } from "../../Common/Button";
import CloseButton from '../../Common/CloseButton';
import CsvHeaderClHeaderMapping from './CsvHeaderClHeaderMapping';

function ImportCsvModal({ showModal, hideModal }) {

    const [uploadCsv, setUploadCsv] = useState("block");
    const uploadCsvPrev = { "display": uploadCsv };

    const [saveCsv, setSaveCsv] = useState("none");
    const uploadCsvNext = { "display": saveCsv };

    const clColumnsData = [{
        ismapped: 'Fist Name',
        clfield: 'firstName',
        csvheader: 'First Name',
        row1: 'anbu',
        row2: "ram",
        row3: "test"
    },
    {
        ismapped: 'Fist Name',
        clfield: 'firstName',
        csvheader: 'First Name',
        row1: 'anbu',
        row2: "ram",
        row3: "test"
    },
    {
        ismapped: 'Fist Name',
        clfield: 'firstName',
        csvheader: 'First Name',
        row1: 'anbu',
        row2: "ram",
        row3: "test"
    }];

    const columns = React.useMemo(
        () => [{
            Header: "Is Mapped?",
            accessor: "ismapped"
        }, {
            Header: "ConnectLeader Fields",
            accessor: "clfield"
        }, {
            Header: "CSV Fields",
            accessor: "csvheader"
        }, {
            Header: "Row 1",
            accessor: "row1"
        }, {
            Header: "Row 2",
            accessor: "row2"
        }, {
            Header: "Row 3",
            accessor: "row3"
        }],
        []
    );

    return (
        <div>
            <Modal isOpen={showModal} centered={true} size="lg">
                <ModalHeader><i class="fas fa-upload mr-2"></i>Upload List From File</ModalHeader>
                <ModalBody>
                    <Form style={uploadCsvPrev}>
                        <FormGroup>
                            <Input type="file" name="csvFileName" id="csv_file_name" />
                            <FormText color="muted">Please upload CSV file alone.</FormText>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="tag_name" sm={2}>Tag your list</Label>
                            <Col sm={6}>
                                <Input type="text" name="tagName" id="tag_name" />
                            </Col>
                        </FormGroup>
                    </Form>
                    <Form style={uploadCsvNext}>
                        <h4>Map Columns with ConnectLeader Fields</h4>
                        <p>Column headers in the uploaded file do not match fields within ConnectLeader. Please map the columns manually. Fields marked with (*) are mandatory.</p>
                        <FormGroup row>
                            <Label for="use_mapping" sm={3}>Use Mapping</Label>
                            <Col sm={9}>
                                <InputGroup>
                                    <Input placeholder="Filter" type="select" id="use_mapping" name="useMapping">
                                        <option>Mapping 1</option>
                                        <option>Mapping 2</option>
                                        <option>Mapping 3</option>
                                    </Input>
                                    <InputGroupAddon addonType="append">
                                        <Button title="Delete Mapping"><i className="fas fa-trash text-danger"></i></Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="addMapping" sm={3}>Save New Mapping</Label>
                            <Col sm={9}>
                                <InputGroup>
                                    <Input type="text" name="addMapping" id="add_mapping" />
                                    <InputGroupAddon addonType="append">
                                        <Button color="outline-primary" title="Save Changes"><i className="fa fa-check"></i></Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        <h4>Upload List for</h4>
                        <FormGroup row>
                            <Label for="upload_list_for_user" sm={3}>Select the User</Label>
                            <Col sm={9}>
                                <InputGroup>
                                    <Input type="select" name="uploadListForUser" id="upload_list_for_user" >
                                        <option>user1</option>
                                        <option>user2</option>
                                    </Input>
                                    <InputGroupAddon addonType="append">
                                        <Button color="outline-primary" title="Save Changes"><i className="fa fa-check"></i></Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        <CsvHeaderClHeaderMapping
                            columns={columns}
                            data={clColumnsData}
                        />
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <ClButton color="primary" icon="fas fa-upload" title="Upload" style={uploadCsvPrev} onClick={() => { setUploadCsv("none"); setSaveCsv("block") }}>Upload</ClButton>
                    {/* TODO loading icon has to be displayed*/}
                    <ClButton color="primary" icon="fa fa-check" title="Save Changes" style={uploadCsvNext} onClick={() => { setUploadCsv("none"); setSaveCsv("block") }}>Save</ClButton>
                    <CloseButton onClick={hideModal} btnTxt="Cancel" />
                </ModalFooter>
            </Modal>
        </div>
    );
}
export default ImportCsvModal;