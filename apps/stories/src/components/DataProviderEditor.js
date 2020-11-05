import React, { useState } from 'react'
import {
  Button, 
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container, 
  Form,
  FormGroup,
  Input,
 } from "reactstrap";
import { useMutation } from '@apollo/react-hooks'
import { useDropzone } from 'react-dropzone'
import CREATE_CSV_DATA_PROVIDER_MUTATION from "./mutations/CreateCsvDataProvider";
import Select from "react-select";

const DATASOURCES = [
  { value: "Generic", label: "Generic" },
  { value: "DiscoverOrg", label: "Discoverorg" },
  { value: "Zoominfo", label: "ZoomInfo" }
];

const DataProviderEditor = ({ customerId }) => {

  const [createDataProvider] = useMutation(CREATE_CSV_DATA_PROVIDER_MUTATION);
  const [isOpen, setIsOpen] = useState(false)
  const [dataSource, setDataSource] = useState(false)
  const [accountsType, setAccountsType] = useState(false)
  const [contactsType, setContactsType] = useState(false)
  const [positionsType, setPositionsType] = useState(false)
  
  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  const onSubmit = () => {
    let dataTypes = calculateDataTypes()
    createDataProvider({ 
      variables: { importFileUrl: acceptedFiles[0], dataSource: dataSource.value, dataTypes }, 
      refetchQueries: ["v3_Import_CsvDataProviders"] 
    })
    toggleModal()
  }

  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept: "text/csv, application/vnd.ms-excel"
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      <i className="fa fa-file mb-2" alt="Item" /> {file.path} - {file.size} bytes
    </li>
  ));

  const calculateDataTypes = () => {
    let value = 0
    value += accountsType ? 32 : 0
    value += contactsType ? 16 : 0
    value += positionsType ? 8 : 0
    return value
  }

  const rejectedFilesItems = rejectedFiles ? rejectedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes ({file.type})
    </li>
  )): [];

  return (
    <React.Fragment>
      <Button color="primary" onClick={toggleModal}>
        Add Data
      </Button>
      <Modal isOpen={isOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Upload CSV file</ModalHeader>
        <ModalBody>
          <Container className="container-md">
            <Form>
              <label>Data Source: </label>
              <Select
                name="dataSource"
                value={dataSource}
                onChange={setDataSource}
                options={DATASOURCES}
              />
              <br />
              <FormGroup row>
                <label className="col-md-4 col-form-label">Data Types</label>
                <div className="col-md-8">
                  <label className="c-checkbox">
                    <Input
                      name="inlineCheckbox10"
                      type="checkbox"
                      checked={accountsType}
                      onChange={(e) => {
                        setAccountsType(e.target.checked);
                      }}
                    />
                    <span className="fa fa-check"></span>Accounts{" "}
                  </label>
                  <label className="c-checkbox">
                    <Input
                      id="inlineCheckbox20"
                      type="checkbox"
                      checked={contactsType}
                      onChange={(e) => {
                        setContactsType(e.target.checked);
                        calculateDataTypes();
                      }}
                    />
                    <span className="fa fa-check"></span>Contacts{" "}
                  </label>
                  <label className="c-checkbox">
                    <Input
                      id="inlineCheckbox30"
                      type="checkbox"
                      checked={positionsType}
                      onChange={(e) => {
                        setPositionsType(e.target.checked);
                      }}
                    />
                    <span className="fa fa-check"></span>Positions
                  </label>
                </div>
              </FormGroup>
              <br />
              <label>Csv File: </label>
              <div className="card p-3" {...getRootProps()}>
                {acceptedFiles.length === 0 && (
                  <input {...getInputProps()} name="importFileUrl" />
                )}
                {acceptedFiles.length === 0 && isDragActive ? (
                  <div className="text-center box-placeholder m-0">
                    Drag the CSV file here...
                  </div>
                ) : acceptedFiles.length === 0 ? (
                  <div className="text-center box-placeholder m-0">
                    Try dropping a CSV file here, or click to select file to
                    upload.
                  </div>
                ) : (
                  ""
                )}
                <ul className="list-unstyled">{files}</ul>
                {rejectedFiles && rejectedFiles.length !== 0 && (
                  <h4>The following files was of the wrong file type</h4>
                )}
                <ul className="list-unstyled">{rejectedFilesItems}</ul>
              </div>
            </Form>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={onSubmit}
            disabled={acceptedFiles.length !== 1}
          >
            Upload
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default DataProviderEditor
