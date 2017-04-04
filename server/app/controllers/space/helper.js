const _ = require('lodash');

exports.handleError = (err, next) => {
  console.error(err);
  return next(err);
};
/**
 * Field Validation Helpers
 */
const validateField = (value, contentTypeField) => {
  // Check require
  if (contentTypeField.required && _.isEmpty(value)) return `${contentTypeField.name} is required`;

  // Check 'in'
  if (!_.isEmpty(_.get(contentTypeField, 'validations.in'))) {
    if (!_.includes(contentTypeField.in, value)) return `${contentTypeField.name} must be one of ${_.join(contentTypeField.in, ',')}`;
  }

  // Check MIME
  // TODO
  // if (contentTypeField.fieldType === 'assets' && )

  // Size (Array, String)
  if (_.includes(['Array', 'String'], contentTypeField.fieldType) && !_.isEmpty(contentTypeField.size)) {
    const min = _.get(contentTypeField, 'validations.size.min');
    const max = _.get(contentTypeField, 'validations.size.max');
    if (_.size(value) < min || _.size(value) > max) return `${contentTypeField.name} size should be between ${min} and ${max}`;
  }

  // Range (Number)
  if (contentTypeField.fieldType === 'Number' && !_.isEmpty(contentTypeField.range)) {
    const min = _.get(contentTypeField, 'validations.range.min');
    const max = _.get(contentTypeField, 'validations.range.max');
    if (_.size(value) < min || _.size(value) > max) return `${contentTypeField.name} range should be between ${min} and ${max}`;
  }

  // RegExp
  // TODO
  // if (!_.isEmpty(_.get(contentTypeField, 'validations.regexp'))) {
  //   const pattern = _.get(contentTypeField, 'validations.regexp.pattern');
  //   const flags = _.get(contentTypeField, 'validations.regexp.flags');
  //
  //   const re = new RegExp(pattern, flags);
  //   if (!re.test(value)) return `${contentTypeField.name} regular expression fail`;
  // }

  // Unique
  // TODO

  return undefined;
};

exports.validateFields = (fields, contentType) => {
  const errors = _.compact(_.map(contentType.fields, (contentTypeField) => {
    const fieldValue = _.get(fields, contentTypeField.id);
    return validateField(fieldValue, contentTypeField);
  }));
  return _.size(errors) > 0 ? { valid: false, message: errors } : { valid: true, message: '' };
};
