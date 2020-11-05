import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { RULE_SET_QUERY } from '../queries/RuleSetQuery';
import {
  DELETE_RULE,
  UPDATE_RULE,
  CREATE_RULE,
  UPDATE_RULESET,
} from '../mutations/RuleSetMutations';
import { FACTS } from '@koncert/shared-components';
import swal from 'sweetalert';
import { Row, Col } from 'reactstrap';
import SpinnerButton from '../Extras/SpinnerButton';

export const RuleSet = ({ customerId, ruleSetId }) => {
  const { data, loading } = useQuery(RULE_SET_QUERY, {
    variables: { id: ruleSetId },
  });

  const [updateRuleSet] = useMutation(UPDATE_RULESET);

  const [newRules, setNewRules] = useState([]);

  const addRule = () => {
    let newRule = {
      evaluatorKey: 'equals',
      lhsParameterKey: 'addresses.state',
      rhsParameterRaw: '',
    };

    setNewRules((oldRules) => [...oldRules, newRule]);
  };

  const onCreate = (rule) => {
    setNewRules([]);
  };

  const handleEvaluationLogicChange = (value) => {
    if (ruleSetId) {
      updateRuleSet({
        variables: {
          id: ruleSetId,
          evaluationLogic: value,
        },
        refetchQueries: () => [
          {
            query: RULE_SET_QUERY,
            variables: {
              id: ruleSetId,
            },
          },
        ],
      });
    }
  };

  if (loading) return <i className="fa fa-spinner fa-spin"></i>;

  return (
    <fieldset className="Conditions" style={{ position: 'relative' }}>
      <Row className="mb-2">
        <Col className="col-auto">
          if{' '}
          <select
            value={data.rules_RuleSet.evaluationLogic}
            onChange={(e) => {
              handleEvaluationLogicChange(e.target.value);
              e.stopPropagation();
            }}
          >
            <option value="all">all</option>
            <option value="any">any</option>
          </select>{' '}
          of these resolve to true:
        </Col>
      </Row>
      {data.rules_RuleSet &&
        data.rules_RuleSet.rules.map((rule, i) => (
          <Rule rule={rule} key={rule.id} ruleSetId={ruleSetId} />
        ))}
      {newRules.map((rule, i) => (
        <Rule rule={rule} key={i} ruleSetId={ruleSetId} onCreate={onCreate} />
      ))}
      {newRules.length === 0 && (
        <Row>
          <Col className="col-auto">
            <button className="btn btn-primary" onClick={() => addRule()}>
              <i className="fa fa-plus mr-2"></i>Add
            </button>
          </Col>
        </Row>
      )}
    </fieldset>
  );
};

export const Rule = ({ customerId, rule, ruleSetId, onCreate }) => {
  const [operator, setOperator] = useState(rule.evaluatorKey);
  const [fact, setFact] = useState(rule.lhsParameterKey);
  const [value, setValue] = useState(rule.rhsParameterRaw);
  const [saveVisible, setSaveVisible] = useState(rule.id === undefined);

  const onFactSave = () => {
    if (rule.id) {
      updateRule({
        variables: {
          id: rule.id,
          evaluatorKey: operator,
          lhsParameterKey: fact,
          rhsParameterRaw: value,
        },
        refetchQueries: () => [
          {
            query: RULE_SET_QUERY,
            variables: {
              id: ruleSetId,
            },
          },
        ],
      }).then(() => {
        setSaveVisible(false);
      });
    } else {
      createRule({
        variables: {
          ruleSetId: ruleSetId,
          evaluatorKey: operator,
          lhsParameterKey: fact,
          rhsParameterRaw: value,
        },
        refetchQueries: () => [
          {
            query: RULE_SET_QUERY,
            variables: {
              id: ruleSetId,
            },
          },
        ],
      }).then(() => {
        setSaveVisible(false);
        onCreate(rule);
      });
    }
  };

  const [deleteRule] = useMutation(DELETE_RULE);
  const [updateRule, { loading: updateLoading }] = useMutation(UPDATE_RULE);
  const [createRule, { loading: createLoading }] = useMutation(CREATE_RULE);

  const deleteOption = {
    title: 'Are you sure?',
    text: 'You will not be able to undo this action!',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, cancel!',
        value: null,
        visible: true,
        className: '',
        closeModal: false,
      },
      confirm: {
        text: 'Yes, delete condition!',
        value: true,
        visible: true,
        className: 'bg-danger',
        closeModal: false,
      },
    },
  };

  const handleDelete = (rule, isConfirm, swal) => {
    if (isConfirm) {
      deleteRule({
        variables: {
          id: rule.id,
        },
        refetchQueries: () => [
          {
            query: RULE_SET_QUERY,
            variables: {
              id: ruleSetId,
            },
          },
        ],
      });
      swal(
        'Identity Deleted!',
        'The user has now been disconnected',
        'success'
      );
    } else {
      swal('Cancelled', 'The user is still connected!', 'error');
    }
  };

  return (
    <div className="form-row">
      <div className="col-auto">
        <select
          className="mb-2 form-control"
          value={fact}
          onChange={(e) => {
            setFact(e.target.value);
            setSaveVisible(true);
          }}
        >
          {FACTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-auto">
        <select
          className="mb-2 form-control"
          value={operator}
          onChange={(e) => {
            setOperator(e.target.value);
            setSaveVisible(true);
          }}
        >
          <option value="equals">==</option>
          <option value="not_equal">!=</option>
          <option value="greater_than">&gt;</option>
          <option value="greater_than_inclusive">&gt;=</option>
          <option value="less_than">&lt;</option>
          <option value="less_than_inclusive">&lt;=</option>
          <option value="in">in</option>
          <option value="not_in">not in</option>
          <option value="contains">contains</option>
          <option value="does_not_contain">does not contain</option>
        </select>
      </div>
      <div className="col-auto">
        <input
          className="mb-2 form-control"
          type="text"
          placeholder="value"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaveVisible(true);
          }}
        />
      </div>
      <div className="col-auto">
        <button
          title="remove this rule"
          onClick={(e) => {
            swal(deleteOption).then((p) => handleDelete(rule, p, swal));
            e.stopPropagation();
          }}
          className="btn btn-danger btn-sm"
        >
          {' '}
          <i className="fa fa-minus"></i>{' '}
        </button>
      </div>
      {saveVisible && (
        <div className="col-auto">
          <SpinnerButton
            color="primary"
            className="btn-block ml-2"
            type="submit"
            loading={updateLoading || createLoading}
            onClick={() => onFactSave()}
          >
            {rule.id ? 'Save' : 'Create'}
          </SpinnerButton>
        </div>
      )}
    </div>
  );
};
