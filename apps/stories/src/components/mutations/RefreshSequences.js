import gql from "graphql-tag";
import React from "react";
import { graphql } from "@apollo/react-hoc"
import { SALESLOFT_PLUGIN_SEQUENCES_QUERY } from "../queries/PluginSequencesQuery";
import { CONNECTLEADER_PLUGIN_SEQUENCES_QUERY } from "../queries/PluginSequencesQuery";
import { OUTREACH_PLUGIN_SEQUENCES_QUERY } from "../queries/PluginSequencesQuery";
import { MIXMAX_PLUGIN_SEQUENCES_QUERY } from "../queries/PluginSequencesQuery";

export default function RefreshSequences(ComponentToWrap) {
  const WrappedComponent = props => {
    const { refreshSequencesMutation, ...restProps } = props;
    const refreshSequences = userId => {
      return refreshSequencesMutation({
        variables: { userId },
        refetchQueries: [
          { query: SALESLOFT_PLUGIN_SEQUENCES_QUERY, variables: { userId } },
          {
            query: CONNECTLEADER_PLUGIN_SEQUENCES_QUERY,
            variables: { userId }
          },
          { query: OUTREACH_PLUGIN_SEQUENCES_QUERY, variables: { userId } },
          { query: MIXMAX_PLUGIN_SEQUENCES_QUERY, variables: { userId } }
        ]
      });
    };

    return (
      <ComponentToWrap refreshSequences={refreshSequences} {...restProps} />
    );
  };
  return graphql(refreshSequencesMutation, {
    name: "refreshSequencesMutation"
  })(WrappedComponent);
}

const refreshSequencesMutation = gql`
  mutation refreshSequences($userId: ID) {
    refreshSequences(userId: $userId)
  }
`;
