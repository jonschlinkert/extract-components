const exclusions = require('./exclusions');

var re = new RegExp('(?:\\' + exclusions.join('|\\') + ')');

module.exports = function(arr) {
  var selectors = arr.filter(function(ea) {
    if (!!~ea.search(re)) {
      return false;
    }
    return true;
  });

  return selectors.sort();
};