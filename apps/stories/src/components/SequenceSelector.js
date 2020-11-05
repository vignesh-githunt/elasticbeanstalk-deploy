import React from "react";
import Loader from "./Loader";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  OverlayTrigger,
  Popover,
  Button
} from "react-bootstrap";

export default SequenceSelector = (props) => {
  if (props.loading) return <Loader />;

  const groupOptions = [
    {
      name: "No Sequencer",
      options: [{ id: null, name: "No Sequence Selected" }]
    },
    {
      name: "Salesloft",
      options: props.salesloftPluginSequences.map(sequence => ({
        id: sequence.id,
        name: sequence.name
      }))
    },
    {
      name: "ConnectLeader",
      options: props.connectleaderPluginSequences.map(sequence => ({
        id: sequence.id,
        name: sequence.name
      }))
    },
    {
      name: "Mixmax",
      options: props.mixmaxPluginSequences.map(sequence => ({
        id: sequence.id,
        name: sequence.name
      }))
    },
    {
      name: "Outreach",
      options: props.outreachPluginSequences.map(sequence => ({
        id: sequence.id,
        name: sequence.attributes.name
      }))
    }
  ];

  const popoverClick = <Popover id="field-info">{props.helpText}</Popover>;

  return (
    <FormGroup>
      <ControlLabel>{props.label}</ControlLabel>
      {props.helpText && (
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="right"
          overlay={popoverClick}
        >
          <span>
            &nbsp;<i className={`fa fa-question-circle-o`}></i>
          </span>
        </OverlayTrigger>
      )}
      <Button
        bsStyle="link"
        onClick={() => props.refreshSequences(props.userId)}
      >
        Refresh
      </Button>
      <FormControl
        value={props.value || ""}
        onChange={props.onChange}
        componentClass="select"
      >
        {groupOptions.map(({ name, options }) => (
          <optgroup key={name} label={name}>
            {options.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </optgroup>
        ))}
      </FormControl>
    </FormGroup>
  );
}
