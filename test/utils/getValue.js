import { expect } from 'chai';
import getValue from '../../src/utils/getValue';

// adapted from https://github.com/erikras/redux-form/blob/master/src/events/__tests__/getValue.spec.js

describe('Elephorm', () => {
  describe('utils/getValue', () => {
    it('should return value if non-event value is passed', () => {
      expect(getValue(undefined, true)).to.equal(undefined);
      expect(getValue(undefined, false)).to.equal(undefined);
      expect(getValue(null, true)).to.equal(null);
      expect(getValue(null, false)).to.equal(null);
      expect(getValue(5, true)).to.equal(5);
      expect(getValue(5, false)).to.equal(5);
      expect(getValue(true, true)).to.equal(true);
      expect(getValue(true, false)).to.equal(true);
      expect(getValue(false, true)).to.equal(false);
      expect(getValue(false, false)).to.equal(false);
    });

    it('should unwrap value if non-event object containing value key is passed', () => {
      expect(getValue({ value: 5 }, true)).to.equal(5);
      expect(getValue({ value: 5 }, false)).to.equal(5);
      expect(getValue({ value: true }, true)).to.equal(true);
      expect(getValue({ value: true }, false)).to.equal(true);
      expect(getValue({ value: false }, true)).to.equal(false);
      expect(getValue({ value: false }, false)).to.equal(false);
    });

    it('should return value if object NOT containing value key is passed', () => {
      const foo = { bar: 5, baz: 8 };
      expect(getValue(foo)).to.equal(foo);
    });

    it('should return event.nativeEvent.text if defined and not react-native', () => {
      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        nativeEvent: {
          text: 'foo',
        },
      }, false)).to.equal('foo');
    });

    it('should return event.target.checked if checkbox', () => {
      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'checkbox',
          checked: true,
        },
      }, true)).to.equal(true);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'checkbox',
          checked: true,
        },
      }, false)).to.equal(true);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'checkbox',
          checked: false,
        },
      }, true)).to.equal(false);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'checkbox',
          checked: false,
        },
      }, false)).to.equal(false);
    });

    it('should return event.target.files if file', () => {
      const myFiles = ['foo', 'bar'];

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'file',
          files: myFiles,
        },
      }, true)).to.equal(myFiles);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'file',
          files: myFiles,
        },
      }, false)).to.equal(myFiles);
    });

    it('should return event.dataTransfer.files if file and files not in target.files', () => {
      const myFiles = ['foo', 'bar'];

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'file',
        },
        dataTransfer: {
          files: myFiles,
        },
      }, true)).to.equal(myFiles);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'file',
        },
        dataTransfer: {
          files: myFiles,
        },
      }, false)).to.equal(myFiles);
    });

    it('should return a number type for numeric inputs', () => {
      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'number',
          value: '3.1415',
        },
      }, true)).to.equal(3.1415);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'range',
          value: '2.71828',
        },
      }, true)).to.equal(2.71828);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'number',
          value: '3',
        },
      }, false)).to.equal(3);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          type: 'range',
          value: '3.1415',
        },
      }, false)).to.equal(3.1415);
    });
    it('should return event.target.value if not file or checkbox', () => {
      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: undefined,
        },
      }, true)).to.equal(undefined);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: undefined,
        },
      }, false)).to.equal(undefined);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: null,
        },
      }, true)).to.equal(null);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: null,
        },
      }, false)).to.equal(null);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: true,
        },
      }, true)).to.equal(true);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: true,
        },
      }, false)).to.equal(true);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: false,
        },
      }, true)).to.equal(false);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: false,
        },
      }, false)).to.equal(false);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: 42,
        },
      }, true)).to.equal(42);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: 42,
        },
      }, false)).to.equal(42);

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: 'foo',
        },
      }, true)).to.equal('foo');

      expect(getValue({
        preventDefault: () => null,
        stopPropagation: () => null,
        target: {
          value: 'foo',
        },
      }, false)).to.equal('foo');
    });
  });
});
