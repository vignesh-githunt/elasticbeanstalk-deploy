
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Card, CardHeader, Input, InputGroup, InputGroupAddon, UncontrolledCollapse } from 'reactstrap';
import Button from "../../Common/Button"
import SyncFieldMappingGrid from './SyncFieldMappingGrid';
import AddMergeVariable from './AddMergeVariable';
import ActivityDataGrid from './ActivityDataGrid';

const SyncFieldMapping = () => {
  let upAngle = "fas fa-angle-up fa-lg text-primary mr-2";
  let downAngle = "fas fa-angle-down fa-lg text-primary mr-2";
  const [show, setShow] = useState(true);
  const [activeShow, setActiveShow] = useState(true);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const cursorStyle = { "cursor": "pointer" };

  const syncFieldMappingData = [{
    name: "Account Name",
    crmLeadField: "Account Name",
    fieldSyncRuleFromTrucadenceLead: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceLead: "Use CRM data to update TruCadence",
    crmContactField: "Account Name",
    fieldSyncRuleFromTrucadenceContact: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceContact: "Use CRM data to update TruCadence",
    lastModifiedDate: "8/10/2020"
  }, {
    name: "Contact Name",
    crmLeadField: "Contact Name",
    fieldSyncRuleFromTrucadenceLead: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceLead: "Use CRM data to update TruCadence",
    crmContactField: "Contact Name",
    fieldSyncRuleFromTrucadenceContact: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceContact: "Use CRM data to update TruCadence",
    lastModifiedDate: "8/10/2020"
  }, {
    name: "Tag",
    crmLeadField: "Tag",
    fieldSyncRuleFromTrucadenceLead: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceLead: "Use CRM data to update TruCadence",
    crmContactField: "Tag",
    fieldSyncRuleFromTrucadenceContact: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceContact: "Use CRM data to update TruCadence",
    lastModifiedDate: "8/10/2020"
  },
  {
    name: "Touch Type",
    crmLeadField: "Touch Type",
    fieldSyncRuleFromTrucadenceLead: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceLead: "Use CRM data to update TruCadence",
    crmContactField: "Touch Type",
    fieldSyncRuleFromTrucadenceContact: "Use TruCadence data to update CRM",
    fieldSyncRuleToTrucadenceContact: "Use CRM data to update TruCadence",
    lastModifiedDate: "10/8/2020"
  }
  ]

  const activityData = [{
    clFieldLabel: "{{out come}}",
    crmFieldName: "Out come"
  }, {
    clFieldLabel: "{{touch type}}",
    crmFieldName: "TouchType"
  }]

  const activityColumns = [
    {
      Header: "Trucadence Field",
      accessor: "clFieldLabel",
      width: "30%",
      Cell: function (props) {
        return (
          <InputGroup>
            <Input type="text" value={props.value} />
            <InputGroupAddon addonType="append">
              <Button onClick={() => { setShowMergeModal(true) }}><i className="fa fa-search pointer"></i></Button>
            </InputGroupAddon>
          </InputGroup>
        );
      }
    },
    {
      Header: "CRM Field",
      accessor: "crmFieldName",
      width: "30%",
      Cell: function (props) {
        return (
          <Input type="select" value={props.value}>
            <option></option>
            <option value="Account Name">Account Name</option>
            <option value="Contact Name">Contact Name</option>
            <option value="Tag">Tag</option>
          </Input>
        );
      }
    },
    {
      Header: "Action",
      accessor: "recordType",
      width: "15%",
      Cell: function (props) {
        return (
          <i className="far fa-trash-alt" title="Delete"></i>
        );
      }
    },
  ]

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      width: "10%"
    },
    {
      Header: "CRM Lead",
      accessor: "crmLeadField",
      width: "10%",
      Cell: function (props) {
        return (
          <Input type="select" value={props.value}>
            <option></option>
            <option value="Account Name">Account Name</option>
            <option value="Contact Name">Contact Name</option>
            <option value="Tag">Tag</option>
          </Input>
        );
      }
    },
    {
      Header: "Sync to CRM",
      accessor: "fieldSyncRuleFromTrucadenceLead",
      width: "15%",
      Cell: function (props) {
        return (
          <Input type="select" value={props.value}>
            <option value={"Use TruCadence data to update CRM"}>Use TruCadence data to update CRM</option>
            <option value={"Use TruCadence data to update CRM only if CRM field is empty"}>Use TruCadence data to update CRM only if CRM field is empty</option>
            <option value={"Use most recent data from either system be used to update the other"}>Use most recent data from either system be used to update the other</option>
            <option value={"Do NOT update CRM"}>Do NOT update CRM</option>
          </Input>
        );
      }
    },
    {
      Header: "Sync to Trucadence",
      accessor: "fieldSyncRuleToTrucadenceLead",
      width: "15%",
      Cell: function (props) {
        return (
          <Input type="select" value={props.value}>
            <option value="Use CRM data to update TruCadence">Use CRM data to update TruCadence</option>
            <option value="Use CRM data to update TruCadence only if the TruCadence field is empty">Use CRM data to update TruCadence only if the TruCadence field is empty</option>
            <option value="Use most recent data from either system be used to update the other">Use most recent data from either system be used to update the other</option>
            <option value="Do NOT update TruCadence">Do NOT update TruCadence</option>
          </Input>
        );
      }
    }, {
      Header: "CRM Contact",
      accessor: "crmContactField",
      width: "10%",
      Cell: function (props) {
        return (
          <Input type="select" value={props.value}>
            <option></option>
            <option value="Account Name">Account Name</option>
            <option value="Contact Name">Contact Name</option>
            <option value="Tag">Tag</option>
          </Input>
        );
      }
    },
    {
      Header: "Sync to CRM",
      accessor: "fieldSyncRuleFromTrucadenceContact",
      width: "15%",
      Cell: function (props) {
        return (
          <Input type="select" value={props.value}>
            <option value={"Use TruCadence data to update CRM"}>Use TruCadence data to update CRM</option>
            <option value={"Use TruCadence data to update CRM only if CRM field is empty"}>Use TruCadence data to update CRM only if CRM field is empty</option>
            <option value={"Use most recent data from either system be used to update the other"}>Use most recent data from either system be used to update the other</option>
            <option value={"Do NOT update CRM"}>Do NOT update CRM</option>
          </Input>
        );
      }
    },
    {
      Header: "Sync to Trucadence",
      accessor: "fieldSyncRuleToTrucadenceContact",
      width: "15%",
      Cell: function (props) {
        return (
          <Input type="select" value={props.value}>
            <option>Use CRM data to update TruCadence</option>
            <option>Use CRM data to update TruCadence only if the TruCadence field is empty</option>
            <option>Use most recent data from either system be used to update the other</option>
            <option>Do NOT update TruCadence</option>
          </Input>
        );
      }
    }, {
      Header: "Last Modified Date",
      accessor: "lastModifiedDate",
      width: "10%"
    }
  ];
  const FieldMapping = () => {
    return (
      <div>
        <div id="lead" className="p-2 bb bt bg-gray-lighter text-bold" style={cursorStyle} onClick={() => setShow(!show)}><i className={show ? upAngle : downAngle}></i><Link>Field Mapping</Link></div>
        <UncontrolledCollapse toggler="#lead" className={show ? "show" : ""}>

          <SyncFieldMappingGrid
            columns={columns}
            data={syncFieldMappingData}
          />
          <Button color="primary" icon="fas fa-check" className="mt-2 ml-2 mb-2">Save</Button>

        </UncontrolledCollapse>
      </div>
    );
  }
  const ActivityDataMapping = () => {
    return (
      <div>
        <div id="activity" className="p-2 bg-gray-lighter text-bold" style={cursorStyle} onClick={() => setActiveShow(!activeShow)}><i className={activeShow ? upAngle : downAngle}></i><Link>Activity Data Mapping</Link></div>
        <UncontrolledCollapse toggler="#activity" className={activeShow ? "show" : ""}>
          <CardHeader>
            <div className="card-tool float-right">
              <i className="fas fa-plus text-primary mr-2 pointer" title="Add Row"></i>
              <i className="fas fa-sync-alt text-danger pointer" title="Reset"></i>
            </div>
          </CardHeader>

          <ActivityDataGrid
            columns={activityColumns}
            data={activityData}
          />
          <Button color="primary" icon="fas fa-check" className="mb-4 ml-2">Save</Button>
        </UncontrolledCollapse>
      </div>
    );
  }
  return (
    <Card className="b">
      <CardHeader className="text-bold">CRM Field Mapping & Rules to Update</CardHeader>
      <FieldMapping />
      <ActivityDataMapping />
      <AddMergeVariable
        hideModal={() => { setShowMergeModal(false) }}
        showModal={showMergeModal}
      />
    </Card>
  );
}
export default SyncFieldMapping;