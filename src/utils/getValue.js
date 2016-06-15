import isEvent from './isEvent';

// from https://github.com/erikras/redux-form/blob/master/src/events/getValue.js
export default event => {
  if (isEvent(event)) {
    if (event.nativeEvent && event.nativeEvent.text !== undefined) return event.nativeEvent.text;

    const { target: { type, value, checked, files }, dataTransfer } = event;
    if (type === 'checkbox') return checked;
    if (type === 'file') return files || dataTransfer && dataTransfer.files;
    if (type === 'number' || type === 'range') return parseFloat(value);
    return value;
  }

  return event && typeof event === 'object' && typeof event.value !== 'undefined'
    ? event.value
    : event;
};
