import { expect } from 'chai';
import getDisplayName from '../../src/utils/getDisplayName';

// adapted from https://github.com/erikras/redux-form/blob/master/src/__tests__/getDisplayName.spec.js

describe('Elephorm', () => {
  describe('utils/getDisplayName', () => {
    it('should return the displayName if set', () => {
      expect(getDisplayName({ displayName: 'Foo' })).to.equal('Foo');
      expect(getDisplayName({ displayName: 'Bar' })).to.equal('Bar');
    });

    it('should return the name if set', () => {
      expect(getDisplayName({ name: 'Foo' })).to.equal('Foo');
      expect(getDisplayName({ name: 'Bar' })).to.equal('Bar');
    });

    it('should return "Component" if neither displayName nor name is set', () => {
      expect(getDisplayName({})).to.equal('Component');
    });
  });
});
