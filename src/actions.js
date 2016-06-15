import * as types from './actionTypes';

export const setup = form =>
  ({ type: types.setup, form });

export const teardown = form =>
  ({ type: types.teardown, form });


export const initialValues = (form, values) =>
  ({ type: types.initialValues, form, values });

export const blur = (form, name, value) =>
  ({ type: types.blur, form, name, value });

export const change = (form, name, value) =>
  ({ type: types.change, form, name, value });

export const focus = (form, name) =>
  ({ type: types.focus, form, name });


export const validationsStart = form =>
  ({ type: types.validationsStart, form });

export const validationsFinished = (form, errors) =>
  ({ type: types.validationsFinished, form, errors });


export const submitStart = form =>
  ({ type: types.submitStart, form });

export const submitFinished = form =>
  ({ type: types.submitFinished, form });
