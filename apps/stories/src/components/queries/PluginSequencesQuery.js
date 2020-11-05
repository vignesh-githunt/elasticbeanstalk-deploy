import gql from "graphql-tag";

export const SALESLOFT_PLUGIN_SEQUENCES_QUERY = gql`
  query salesloftPluginSequencesQuery($userId: ID) {
    getSalesloftPluginSequences(userId: $userId)
  }
`;
export const CONNECTLEADER_PLUGIN_SEQUENCES_QUERY = gql`
  query connectleaderPluginSequencesQuery($userId: ID) {
    getConnectleaderPluginSequences(userId: $userId)
  }
`;
export const OUTREACH_PLUGIN_SEQUENCES_QUERY = gql`
  query outreachPluginSequencesQuery($userId: ID) {
    getOutreachPluginSequences(userId: $userId)
  }
`;
export const MIXMAX_PLUGIN_SEQUENCES_QUERY = gql`
  query mixmaxPluginSequencesQuery($userId: ID) {
    getMixmaxPluginSequences(userId: $userId)
  }
`;
