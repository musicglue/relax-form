import React from 'react';
import provideState, { joinSelectors } from 'react-relax';
import omit from 'lodash.omit';

import * as actions from './actions';
import getValue from './utils/getValue';

class RelaxField extends React.Component {
  static propTypes = {
    form: React.PropTypes.any.isRequired,
    name: React.PropTypes.string.isRequired,
    component: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]).isRequired,
    onBlur: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onFocus: React.PropTypes.func.isRequired,
    validateOn: React.PropTypes.arrayOf(React.PropTypes.oneOf(['blur', 'change', 'focus'])),
    children: React.PropTypes.node,
  };

  static defaultProps = {
    dirty: false,
    active: false,
    validationsPending: false,
    errors: [],
    touched: false,
    validateOn: ['blur'],
  };

  handleBlur = e => {
    this.props.onBlur(e);
    if (this.props.validateOn.includes('blur')) this.props.form.validate();
  };

  handleChange = e => {
    this.props.onChange(e);
    if (this.props.validateOn.includes('change')) this.props.form.validate();
  };

  handleFocus = e => {
    this.props.onFocus(e);
    if (this.props.validateOn.includes('focus')) this.props.form.validate();
  };

  render() {
    const { component, children, ...props } = this.props;
    return React.createElement(component, {
      ...omit(props, ['form', 'name']),
      valid: props.errors.length === 0,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
    }, children);
  }
}


export default provideState(RelaxField, {
  within: ({ form, name }) => joinSelectors(form, 'fields', name),
  bindings: {
    active: 'active',
    dirty: 'dirty',
    errors: 'errors',
    touched: 'touched',
    validationsPending: 'validationsPending',
    value: 'value',
  },
  actions: {
    onChange: (event, { form, name }) => actions.change(form, name, getValue(event)),
    onBlur: (event, { form, name }) => actions.blur(form, name, getValue(event)),
    onFocus: (event, { form, name }) => actions.focus(form, name),
  },
});
