import React from 'react';
import Immutable from 'immutable';
import uniqueId from 'lodash.uniqueid';
import omit from 'lodash.omit';
import flattenDeep from 'lodash.flattendeep';
import provideState, {
  formatSelector,
  joinSelectors,
  observe,
  selectFromStore,
  globalStateProvider,
} from 'react-relax';

import getDisplayName from './utils/getDisplayName';
import * as actions from './actions';

const defaultOptions = {
  clearOnUnmount: true,
  onComplete: () => null,
  validations: () => [],
  initialValues: {},
};

export default (Component, options = {}) => {
  const Wrapped = provideState(Component, {
    within: ({ form }) => form,
    bindings: {
      valid: 'valid',
      submitting: 'submitting',
    },
  });

  const dispatch = action => globalStateProvider.store.dispatch(action);

  return class extends React.Component {
    static propTypes = {
      form: React.PropTypes.string,
      fields: React.PropTypes.object,
      children: React.PropTypes.node,
    };

    static displayName = `RelaxForm(${getDisplayName(Component)})`;

    componentWillMount() {
      this.formPath = formatSelector(this.option('form') || ['forms', uniqueId('elephorm')]);
      this.formPath.validate = this.validate;
      dispatch(actions.setup(this.formPath));

      const selector = { form: this.formPath };
      this.unsubscribe = observe(() => selector, this.handleFormChange);

      // TODO: figure out a smarter way of doing initial validations. We need to wait for the
      // initial values to settle (which can take a couple of redux loops) and validate then.
      setTimeout(() => this.validate(), 20);
    }

    componentWillReceiveProps(nextProps) {
      this.handleChange(undefined, nextProps);
    }

    componentWillUnmount() {
      if (this.option('clearOnUnmount')) {
        dispatch(actions.setup(this.formPath));
      }
    }

    option(name, props = this.props) {
      return props[name] || options[name] || defaultOptions[name];
    }

    handleChange = (form = this.formState, props = this.props) => {
      const initialValues = Immutable.Map(this.option('initialValues', props))
        .map((initial) => (typeof initial === 'function' ? initial(form, props) : initial))
        .filter((initial, name) =>
          form.getIn(joinSelectors('fields', name, 'initialValue')) !== initial);

      if (initialValues.size) dispatch(actions.initialValues(this.formPath, initialValues));
    }

    handleFormChange = (change) => {
      this.formState = change.get('form');
      setTimeout(this.handleChange);
    }

    handleSubmit = (e) => {
      e.preventDefault();
      const form = selectFromStore({ form: this.formPath }).get('form');
      dispatch(actions.submitStart(this.formPath));
      return this.validate()
        .then(valid => {
          if (!valid) {
            dispatch(actions.submitFinished(this.formPath));
            return null;
          }

          return Promise.resolve(this.option('onSubmit')(form))
            .then(submitResult => {
              dispatch(actions.submitFinished(this.formPath));
              this.option('onComplete')(submitResult, form);
            })
            .catch(err => {
              dispatch(actions.submitFinished(this.formPath));
              return Promise.reject(err);
            });
        });
    };

    validate = () => {
      const validations = this.option('validations');
      const form = selectFromStore({ form: this.formPath }).get('form');
      dispatch(actions.validationsStart(this.formPath));
      return Promise.resolve()
        .then(() => Promise.all(flattenDeep(validations(form))))
        .then(errors => {
          dispatch(actions.validationsFinished(this.formPath, errors.filter(err => !!err)));
          return !!errors.length;
        });
    }

    render() {
      return React.createElement(Wrapped, {
        ...omit(this.props, ['children']),
        ref: 'component',
        form: this.formPath,
        onSubmit: this.handleSubmit,
      }, this.props.children);
    }
  };
};
