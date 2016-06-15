import Immutable from 'immutable';
import { expect } from 'chai';
import { formatSelector, joinSelectors } from 'react-relax';

import reducer from '../src/reducer';
import * as actionTypes from '../src/actionTypes';
import * as actions from '../src/actions';

describe('Elephorm', () => {
  describe('reducer', () => {
    const form = formatSelector('forms.testForm');

    const expectKnownFields = (state, ...fields) =>
      expect(state.getIn(joinSelectors(form, 'knownFields'))).to.equal(Immutable.Set(fields));

    const expectField = (state, field, value) =>
      expect(state.getIn(joinSelectors(form, 'fields', field))).to.equal(value);

    it('returns a blank map as default state', () =>
      expect(reducer(undefined, undefined)).to.equal(Immutable.Map()));

    it('returns the same state with an unknown action', () =>
      expect(reducer(Immutable.Map({ ooh: 'fancy' }), { type: 'ugh' }))
        .to.equal(Immutable.Map({ ooh: 'fancy' })));

    describe(actionTypes.setup, () => {
      const state = reducer(Immutable.Map(), actions.setup(form));

      it('creates a map for the form', () =>
        expect(state.hasIn(form)).to.equal(true));

      it('saves the form path', () =>
        expect(state.getIn(joinSelectors(form, 'form'))).to.equal(form));
    });

    describe(actionTypes.teardown, () => {
      const baseState = Immutable.Map().setIn(form, 'Im a form!!!');
      const state = reducer(baseState, actions.teardown(form));

      it('deletes the form key', () => {
        expect(baseState.hasIn(form)).to.equal(true);
        expect(state.hasIn(form)).to.equal(false);
      });
    });

    describe(actionTypes.initialValues, () => {
      const baseState = Immutable.Map().setIn(form, Immutable.fromJS({
        fields: {
          name: { dirty: true, value: 'value' },
          address: {
            line1: { dirty: false, value: 'value' },
          },
        },
        knownFields: Immutable.Set(['name']),
      }));

      const action = actions.initialValues(form, Immutable.fromJS({
        name: 'initial name',
        'address.line1': 'initial address',
      }));

      const state = reducer(baseState, action);

      it('sets the initial value', () => {
        expectField(state, 'name.initialValue', 'initial name');
        expectField(state, 'address.line1.initialValue', 'initial address');
      });

      it('adds the field to knownFields', () =>
        expectKnownFields(state, 'address.line1', 'name'));

      it('sets the value if the field is pristine', () =>
        expectField(state, 'address.line1.value', 'initial address'));

      it('does not set the value if the field is dirty', () =>
        expectField(state, 'name.value', 'value'));
    });

    describe(actionTypes.blur, () => {
      const state = reducer(Immutable.Map(), actions.blur(form, 'name', 'value'));

      it('sets the value', () =>
        expectField(state, 'name.value', 'value'));

      it('marks the field as touched', () =>
        expectField(state, 'name.touched', true));

      it('marks the field as inactive', () =>
        expectField(state, 'name.active', false));

      it('adds the field to knownFields', () =>
        expectKnownFields(state, 'name'));
    });

    describe(actionTypes.change, () => {
      const state = reducer(Immutable.Map(), actions.change(form, 'name', 'value'));

      it('sets the value', () =>
        expectField(state, 'name.value', 'value'));

      it('marks the field as touched', () =>
        expectField(state, 'name.touched', true));

      it('marks the field as dirty', () =>
        expectField(state, 'name.dirty', true));

      it('adds the field to knownFields', () =>
        expectKnownFields(state, 'name'));
    });

    describe(actionTypes.focus, () => {
      const state = reducer(Immutable.Map(), actions.focus(form, 'name'));

      it('marks the field as touched', () =>
        expectField(state, 'name.touched', true));

      it('marks the field as active', () =>
        expectField(state, 'name.active', true));

      it('adds the field to knownFields', () =>
        expectKnownFields(state, 'name'));
    });

    describe(actionTypes.validationsStart, () => {
      const state = reducer(Immutable.Map(), actions.validationsStart(form));

      it('sets validationsPending to true', () =>
        expect(state.getIn(form)).to.have.property('validationsPending', true));
    });

    describe(actionTypes.validationsFinished, () => {
      const baseState = Immutable.Map().setIn(form, Immutable.fromJS({
        fields: {
          duckCount: { },
        },
        knownFields: Immutable.Set(['duckCount']),
      }));

      const errors = [
        { type: 'err 0', field: 'name' },
        { type: 'err 1', field: 'user.age' },
        { type: 'err 2', extraInfo: true },
        { type: 'err 3', field: 'name' },
        { type: 'err 4' },
      ];

      const state = reducer(baseState, actions.validationsFinished(form, errors));

      it('sets validationsPending to false', () =>
        expect(state.getIn(form)).to.have.property('validationsPending', false));

      it('sets errors on the form to a list of errors with no field', () =>
        expect(state.getIn(form))
          .to.have.property('errors', Immutable.fromJS([errors[2], errors[4]])));

      it('sets allErrors on the form to the list of errors', () =>
        expect(state.getIn(form))
          .to.have.property('allErrors', Immutable.fromJS(errors)));

      it('sets errors on fields with errors', () => {
        expectField(state, 'name.errors', Immutable.fromJS([errors[0], errors[3]]));
        expectField(state, 'user.age.errors', Immutable.fromJS([errors[1]]));
      });

      it('sets errors to an empty list on fields with no errors', () =>
        expectField(state, 'duckCount.errors', Immutable.List()));

      it('adds the fields with errors to knownFields', () =>
        expectKnownFields(state, 'name', 'user.age', 'duckCount'));
    });

    describe(actionTypes.submitStart, () => {
      const state = reducer(Immutable.Map(), actions.submitStart(form));

      it('sets submitting to true', () =>
        expect(state.getIn(form)).to.have.property('submitting', true));
    });

    describe(actionTypes.submitFinished, () => {
      const state = reducer(Immutable.Map(), actions.submitFinished(form));

      it('sets submitting to false', () =>
        expect(state.getIn(form)).to.have.property('submitting', false));
    });
  });
});
