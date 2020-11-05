import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FACTS } from '@koncert/shared-components';

export const Condition = ({
  onConditionRemove,
  onFactChange,
  id,
  condition,
}) => {
  const [operator, setOperator] = useState(condition.operator);
  const [fact, setFact] = useState(condition.fact);
  const [value, setValue] = useState(condition.value);

  return (
    <div className="form-row">
      <div className="col-auto">
        <select
          className="mb-2 form-control"
          value={fact}
          onChange={(e) => {
            setFact(e.target.value);
            onFactChange(condition.id, {
              fact: e.target.value,
              operator,
              value,
            });
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
            onFactChange(condition.id, {
              fact,
              operator: e.target.value,
              value,
            });
          }}
        >
          <option value="equal">==</option>
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
            onFactChange(condition.id, {
              fact,
              operator,
              value: e.target.value,
            });
          }}
        />
      </div>
      <div className="col-auto">
        <button
          title="remove this condition"
          onClick={(e) => {
            onConditionRemove(condition);
            e.stopPropagation();
          }}
          className="btn btn-danger btn-sm"
        >
          {' '}
          <i className="fa fa-minus"></i>{' '}
        </button>
      </div>
    </div>
  );
};

export const Conditions = ({
  conditions,
  op,
  top,
  onConditionRemoveGroup,
  onConditionAdd,
  onConditionAddGroup,
  onOpChange,
  onFactChange,
  id,
  ruleSetId,
}) => {
  const onConditionRemove = (condition) => {
    conditions.pop(condition);
  };

  return (
    <fieldset className="Conditions" style={{ position: 'relative' }}>
      {!top && (
        <button
          style={{ position: 'absolute', right: 0, top: 2 }}
          title="remove this condition group"
          onClick={(e) => {
            onConditionRemoveGroup(id);
            e.stopPropagation();
          }}
          className="cancel"
        >
          {' '}
          <i className="fa fa-minus"></i>{' '}
        </button>
      )}
      <div>
        if{' '}
        {top ? (
          <strong>{op}</strong>
        ) : (
          <select
            value={op}
            onChange={(e) => {
              onOpChange(id.split('.').slice(0, -1).join('.'), e.target.value);
            }}
          >
            <option value="all">all</option>
            <option value="any">any</option>
          </select>
        )}{' '}
        of these resolve to true:
      </div>
      {conditions.map((condition, i) => (
        <div key={i}>
          {typeof condition.any === 'object' && (
            <Conditions
              id={`${id}[${i}].any`}
              ruleSetId={ruleSetId}
              onOpChange={onOpChange}
              onConditionAdd={onConditionAdd}
              onConditionRemove={onConditionRemove}
              op="any"
              conditions={condition.any}
            />
          )}
          {typeof condition.all === 'object' && (
            <Conditions
              id={`${id}[${i}].all`}
              ruleSetId={ruleSetId}
              onOpChange={onOpChange}
              onConditionAdd={onConditionAdd}
              onConditionRemove={onConditionRemove}
              op="all"
              conditions={condition.all}
            />
          )}
          {typeof condition.fact !== 'undefined' && (
            <Condition
              onFactChange={onFactChange}
              id={`${id}[${i}]`}
              ruleSetId={ruleSetId}
              onConditionAdd={onConditionAdd}
              onConditionRemove={onConditionRemove}
              condition={condition}
            />
          )}
        </div>
      ))}
      {!top && (
        <button
          title="add a condition to this group"
          onClick={(e) => {
            onConditionAdd(id);
            e.stopPropagation();
          }}
        >
          {' '}
          <i className="fa fa-plus"></i> add condition
        </button>
      )}
      <button
        title="add a group of conditions to this group"
        onClick={(e) => {
          onConditionAddGroup(id);
          e.stopPropagation();
        }}
      >
        {' '}
        <i className="fa fa-plus"></i> add condition group
      </button>
    </fieldset>
  );
};

export const ConditionManager = ({
  conditions = [],
  onConditionRemove,
  onConditionRemoveGroup,
  onConditionAdd,
  onConditionAddGroup,
  onOpChange,
  onFactChange,
  ruleSetId,
}) => (
  <div className="ConditionManager">
    {conditions.any && (
      <Conditions
        id=".any"
        ruleSetId={ruleSetId}
        top
        onConditionRemoveGroup={onConditionRemoveGroup}
        onConditionAddGroup={onConditionAddGroup}
        onFactChange={onFactChange}
        onOpChange={onOpChange}
        onConditionAdd={onConditionAdd}
        onConditionRemove={onConditionRemove}
        op="any"
        conditions={conditions.any || []}
      />
    )}
    {conditions.all && (
      <Conditions
        id=".all"
        top
        ruleSetId={ruleSetId}
        onConditionRemoveGroup={onConditionRemoveGroup}
        onConditionAddGroup={onConditionAddGroup}
        onFactChange={onFactChange}
        onOpChange={onOpChange}
        onConditionAdd={onConditionAdd}
        onConditionRemove={onConditionRemove}
        op="all"
        conditions={conditions.all || []}
      />
    )}
  </div>
);

export default ConditionManager;
