import gql from "graphql-tag";

export const RULE_SET_QUERY = gql`
  query ruleSetQuery($id: ID!) {
    rules_RuleSet(where: { id: $id }) {
      id
      sourceId
      sourceType
      evaluationLogic
      rules {
        id
        evaluatorKey
        lhsParameterKey
        rhsParameterKey
        rhsParameterRaw
        ruleSetId
      }
    }
  }
`;