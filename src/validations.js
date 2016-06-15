import fieldValue from './utils/fieldValue';

export const field = (form, fieldName, ...validations) => {
  const value = fieldValue(form, fieldName);
  return validations
    .map(validation =>
      Promise.resolve(validation(value, form, fieldName))
        .then(error => (error ? { field: fieldName, ...error } : null)));
};

export const when = (predicate, validations) =>
  (predicate ? validations() : null);

export const required = value =>
  (value === null || value === undefined || (value.trim && value.trim() === '')
    ? { type: 'required' }
    : null);

export const email = value =>
  (typeof value === 'string' && /.+@.+/.test(value)
    ? null
    : { type: 'email' });

export const accepted = value =>
  (!!value
    ? null
    : { type: 'acceptance' });
