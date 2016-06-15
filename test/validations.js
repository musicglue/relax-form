import { expect } from 'chai';
import Immutable from 'immutable';
import sinon from 'sinon';

import {
  field,
  when,
  required,
  email,
  accepted,
} from '../src/validations';

describe('Elephorm', () => {
  describe('validations', () => {
    describe('field', () => {
      const form = Immutable.fromJS({
        fields: {
          name: { value: 'my name' },
        },
      });

      it('calls the validations passed in with value, form, and fieldName', () => {
        const validation = sinon.stub().returns(null);
        field(form, 'name', validation);
        expect(validation).to.have.been.calledWith('my name', form, 'name');
      });

      it('returns a promise for each validation', () => {
        const validation = sinon.stub().returns(null);
        const errors = field(form, 'name', validation, validation, validation);
        expect(errors).to.have.length(3);
        errors.forEach(error => expect(error).to.be.a('promise'));
      });

      it('adds the field name to errors', () => {
        const validation = sinon.stub().returns({ type: 'drama' });
        return field(form, 'name', validation)[0]
          .then(err => expect(err).to.deep.equal({ type: 'drama', field: 'name' }));
      });
    });

    describe('when', () => {
      it('returns the validations when predicate is truthy', () =>
        expect(when(true, () => ({ error: 'oh-no' }))).to.deep.equal({ error: 'oh-no' }));

      it('returns null whent the predicate is falsy', () =>
        expect(when(false, () => { throw new Error('drama'); })).to.equal(null));
    });

    describe('required', () => {
      it('returns an error if value is null', () =>
        expect(required(null)).to.deep.equal({ type: 'required' }));

      it('returns an error if value is undefined', () =>
        expect(required()).to.deep.equal({ type: 'required' }));

      it('returns an error if value is empty string', () =>
        expect(required('')).to.deep.equal({ type: 'required' }));

      it('returns an error if value is a string of only whitespace', () =>
        expect(required('     ')).to.deep.equal({ type: 'required' }));

      it('returns null if value is supplied', () =>
        expect(required('hello')).to.equal(null));

      it('returns null if value is supplied but falsy', () =>
        expect(required(false)).to.equal(null));
    });

    describe('email', () => {
      it('returns an error if value isnt a string', () =>
        expect(email(123)).to.deep.equal({ type: 'email' }));

      it('returns an error if value does not look vaguely email-like', () =>
        expect(email('YEE MAILLS')).to.deep.equal({ type: 'email' }));

      it('returns null if value is maybe an email', () =>
        expect(email('shouting@geese')).to.equal(null));
    });

    describe('accepted', () => {
      it('returns an error if no value is supplied', () =>
        expect(accepted()).to.deep.equal({ type: 'acceptance' }));

      it('returns an error if value is falsy', () =>
        expect(accepted(false)).to.deep.equal({ type: 'acceptance' }));

      it('returns null if error is true', () =>
        expect(accepted(true)).to.equal(null));
    });
  });
});
