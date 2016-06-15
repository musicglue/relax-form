import { expect } from 'chai';
import isEvent from '../../src/utils/isEvent';

// adapted from https://github.com/erikras/redux-form/blob/master/src/events/__tests__/isEvent.spec.js

describe('Elephorm', () => {
  describe('utils/isEvent', () => {
    it('should return false if event is undefined', () => {
      expect(isEvent()).to.equal(false);
    });

    it('should return false if event is null', () => {
      expect(isEvent(null)).to.equal(false);
    });

    it('should return false if event is not an object', () => {
      expect(isEvent(42)).to.equal(false);
      expect(isEvent(true)).to.equal(false);
      expect(isEvent(false)).to.equal(false);
      expect(isEvent('not an event')).to.equal(false);
    });

    it('should return false if event has no stopPropagation', () => {
      expect(isEvent({
        preventDefault: () => null,
      })).to.equal(false);
    });

    it('should return false if event has no preventDefault', () => {
      expect(isEvent({
        stopPropagation: () => null,
      })).to.equal(false);
    });

    it('should return true if event has stopPropagation, and preventDefault', () => {
      expect(isEvent({
        stopPropagation: () => null,
        preventDefault: () => null,
      })).to.equal(true);
    });
  });
});
