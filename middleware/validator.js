const validatorHandler = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) return error;
};

module.exports = validatorHandler;
