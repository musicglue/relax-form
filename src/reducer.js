import Immutable from 'immutable';
import omit from 'lodash.omit';
import { joinSelectors } from 'react-relax';
import * as types from './actionTypes';

const defaultState = Immutable.Map();

const fieldPath = (form, name) => joinSelectors(form, 'fields', name);

const updateField = (form, name, state, updater) =>
  state
    .updateIn(fieldPath(form, name), Immutable.Map(), updater)
    .updateIn(joinSelectors(form, 'knownFields'), Immutable.Set(), knownFields =>
      knownFields.add(name));

const reducers = {
  [types.setup]: (state, action) =>
    state.setIn(action.form, Immutable.fromJS(omit(action, ['type']))),

  [types.teardown]: (state, { form }) =>
    state.deleteIn(form),


  [types.initialValues]: (state, { form, values }) =>
    values
      .reduce((memo, initialValue, name) =>
        updateField(form, name, memo, field =>
          field
            .set('initialValue', initialValue)
            .update('value', value =>
              (field.get('dirty') ? value : initialValue))),
        state),

  [types.blur]: (state, { form, name, value }) =>
    updateField(form, name, state, field =>
      field
        .set('value', value)
        .set('touched', true)
        .set('active', false)),

  [types.change]: (state, { form, name, value }) =>
    updateField(form, name, state, field =>
      field
        .set('value', value)
        .set('touched', true)
        .set('dirty', true)),

  [types.focus]: (state, { form, name }) =>
    updateField(form, name, state, field =>
      field
        .set('touched', true)
        .set('active', true)),


  [types.validationsStart]: (state, { form }) =>
    state.setIn(joinSelectors(form, 'validationsPending'), true),

  [types.validationsFinished]: (state, { form, errors = [] }) => {
    const iErrors = Immutable.fromJS(errors);
    const groupedErrors = iErrors.groupBy(error => error.get('field', 'ELEPHORM:NO_FIELD'));
    const errorFields = iErrors
      .map(error => error.get('field', null))
      .filter(field => field !== null);

    return state
      .updateIn(joinSelectors(form, 'knownFields'), Immutable.Set(), knownFields =>
        errorFields.reduce((memo, field) => memo.add(field), knownFields))
      .getIn(joinSelectors(form, 'knownFields'), Immutable.Set())
      .reduce((memo, name) =>
        updateField(form, name, memo, field =>
          field.set('errors', groupedErrors.get(name, Immutable.List()))),
        state)
      .updateIn(form, Immutable.Map(), formState =>
        formState
          .set('validationsPending', false)
          .set('errors', groupedErrors.get('ELEPHORM:NO_FIELD', Immutable.List()))
          .set('allErrors', iErrors));
  },


  [types.submitStart]: (state, { form }) =>
    state.updateIn(form, Immutable.Map(), formState =>
      formState.set('submitting', true)),

  [types.submitFinished]: (state, { form }) =>
    state.updateIn(form, Immutable.Map(), formState =>
      formState.set('submitting', false)),
};

export default function elephormReducer(state = defaultState, action = {}) {
  const reducer = action.type && reducers[action.type];
  return reducer ? reducer(state, action) : state;
}
