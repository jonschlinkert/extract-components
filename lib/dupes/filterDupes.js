const _ = require('lodash');

module.exports = function(val, arr) {
  _.filter(_.keys(val), function (key) {
    return val[key] > 1;
  });

  _.filter(val, function (key) {
    return arr[key] && arr[key].length !== 0;
  });
  return arr;
};
