var debug = require('debug')('lemon-server:dbErrorHandler');

const getUniqueErrorMessage = (err) => {
  let output;
  try {
    let fieldName = err.message.substring(
      err.message.lastIndexOf(': {') + 4,
      err.message.lastIndexOf(': "'),
    );
    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
  } catch (ex) {
    output = 'Unique field already exists';
  }
  return output;
};

const formatError = (err) => {
  let message = '';
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;

      default:
        message = 'Something went wrong';
        break;
    }
    return { error: message };
  } else if (err.errors) {
    let errors = {};

    for (let errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
        if (errName.includes('.')) {
          let parent = errName.split('.')[0];
          let child = errName.split('.')[1];
          errors[parent] = errors[parent] || {};
          errors[parent][child] = message;
        } else {
          errName = errName == 'hashedPassword' ? 'password' : errName;
          errors[errName] = message;
        }
      }
    }
    return { errors };
  } else {
    return { error: err.message };
  }
};

module.exports = { formatError };
