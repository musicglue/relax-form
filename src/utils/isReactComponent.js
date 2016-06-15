export default component =>
  !!(component && component.prototype && component.prototype.isReactContainer);
