const getSequelizeErrorMessage = (error) => {
  if (error.parent && error.parent.sqlMessage) {
    return error.parent.sqlMessage;
  } else {
    return error.message || error;
  }
};

const getSequelizeErrorData = (error) => {
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map(({ message, type, path, value }) => ({
      ...(message && { message }),
      ...(type && { type }),
      ...(path && { path }),
      ...(value && { value }),
    }));
  }
};

module.exports = {
  getSequelizeErrorMessage,
  getSequelizeErrorData,
};
