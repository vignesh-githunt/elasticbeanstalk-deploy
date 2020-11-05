import gql from "graphql-tag";

export const DELETE_RULE = gql`
  mutation DeleteRule($id: ID!) {
    deleteRules_Rule(id: $id) {
      id
    }
  }
`;

export const DELETE_RULESET = gql`
  mutation DeleteRuleSet($id: ID!) {
    deleteRules_RuleSet(id: $id) {
      id
    }
  }
`;

export const UPDATE_RULE = gql`
  mutation UpdateRule(
    $id: ID!
    $evaluatorKey: String!
    $lhsParameterKey: String!
    $rhsParameterRaw: String!
  ) {
    updateRules_Rule(
      id: $id
      data: {
        evaluatorKey: $evaluatorKey
        lhsParameterKey: $lhsParameterKey
        rhsParameterRaw: $rhsParameterRaw
      }
    ) {
      id
    }
  }
`;

export const CREATE_RULE = gql`
  mutation CreateRule(
    $ruleSetId: String!
    $evaluatorKey: String!
    $lhsParameterKey: String!
    $rhsParameterRaw: String
    $trueResultContent: String = "truthy"
    $falseResultContent: String = "falsey"
  ) {
    createRules_Rule(
      data: {
        ruleSetId: $ruleSetId
        evaluatorKey: $evaluatorKey
        lhsParameterKey: $lhsParameterKey
        rhsParameterRaw: $rhsParameterRaw
        trueResultContent: $trueResultContent
        falseResultContent: $falseResultContent
      }
    ) {
      id
    }
  }
`;

export const UPDATE_RULESET = gql`
  mutation UpdateRuleSet($id: ID!, $evaluationLogic: String!) {
    updateRules_RuleSet(
      id: $id
      data: {
        evaluationLogic: $evaluationLogic
      }
    ) {
      id
    }
  }
`;


