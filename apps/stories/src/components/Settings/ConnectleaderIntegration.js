import React from "react";
import {
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";

import DELETE_INTEGRATION from "../mutations/DeleteIntegration";
import { CONNECTLEADER_PLUGIN_SEQUENCES_QUERY } from "../queries/PluginSequencesQuery";
import SET_DEFAULT_STORY_SEQUENCE_MUTATION from "../mutations/SetDefaultStorySequence";
import PageLoader from "../Common/PageLoader";
import Avatar from "../../images/default-avatar.jpg";
import moment from "moment";
import Swal from "../Elements/Swal";

export const ConnectleaderSettings = ({ integration, history }) => {

  const [deleteIntegration] = useMutation(DELETE_INTEGRATION);

  const deleteOption = {
    title: 'Are you sure?',
    text: 'Your will not be able to recover this integration setup!',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel!',
        value: null,
        visible: true,
        className: "",
        closeModal: false
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false
      }
    }
  }

  const swalCallback5 = (isConfirm, swal) => {
    if (isConfirm) {
      deleteIntegration({
        variables: {
          id: integration.id,
        },
        refetchQueries: ["v3_Customer_Integrations"],
      });
      swal("Deleted!", "Your integration has been deleted.", "success");
      history.push("/settings/integrations")
    } else {
      swal("Cancelled", "Your integration is safe!", "error");
    }
  }
  return (
    <div>
      <Swal
        options={deleteOption}
        callback={swalCallback5}
        className="btn btn-danger pull-right"
      >
        Delete Integration
      </Swal>
    </div>
  );
};

export const ConnectleaderCadences = ({ integration }) => {
  
  return <div>Connectleader Cadences</div>;
};

export const ConnectleaderFieldMapping = ({ integration }) => {
  return <div>Connectleader Field Mapping</div>;
};

export const ConnectleaderConnectedUser = ({ identity, sequences }) => {
  const [setDefaultStorySequence] = useMutation(
    SET_DEFAULT_STORY_SEQUENCE_MUTATION
  );

  const handleSelect = target => {
    setDefaultStorySequence({
      variables: {
        userId: identity.user_id,
        sequenceId: "" + target.value
      },
      refetchQueries: ["v3_Customer_Integration"]
    });
  };

  return (
    <tr key={identity.id}>
      <td>
        <img
          src={Avatar}
          className="rounded-circle thumb24 mr-1"
          alt={identity.nickname}
        />
      </td>
      <td>
        <Link to={"/senders/" + identity.user_id}>{identity.nickname}</Link>
      </td>
      <td>{identity.email}</td>
      <td>{moment(identity.created_at).fromNow()}</td>
      <td>
        <select
          onChange={e => handleSelect(e.target)}
          value={identity.story_sequence_id}
        >
          <option value="">Select A Cadence...</option>
          {sequences.map(sequence => {
            return (
              <option key={sequence.id} value={sequence.id}>
                {sequence.name}
              </option>
            );
          })}
        </select>
      </td>
    </tr>
  );
};

export const ConnectleaderConnectedUsers = ({ integration, user }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>Nickname</th>
          <th>Email</th>
          <th>Connected Since</th>
          <th>Default Story Cadence</th>
        </tr>
      </thead>
      <tbody>
        {integration.protectedIdentities.map(identity => {
          return (
            <ConnectleaderConnectedUserWithSequences integration={integration} identity={identity} />
          );
        })}
      </tbody>
    </Table>
  );
};

export const ConnectleaderConnectedUserWithSequences = ({ integration, identity }) => {
  const { data, loading } = useQuery(CONNECTLEADER_PLUGIN_SEQUENCES_QUERY, {
    variables: { userId: identity.user_id },
  });
  if (loading) return <PageLoader />;

  return <ConnectleaderConnectedUser
              key={identity.id}
              identity={identity}
              sequences={integration.userSequenceMapping[identity.user_id] || data.getConnectleaderPluginSequences || []}
            />
};
