const _ = require('lodash');
const filterDupes = require('./filterDupes');


/**
 * Return an array of objects with unique values.
 *
 * @param   {String}  arr   Array of objects to filter
 * @param   {String}  prop  The property to match against
 * @return  {String}  duplicate-free array of objects.
 */

module.exports = function(arr, prop) {
  var filepathMap = {};
  var unique = [];
  var dupe = {};

  arr.filter(function (obj) {
    return obj[prop] !== null;
  }).forEach(function (obj) {
    var key = obj[prop];
    dupe[key] = (dupe[key] || 0) + 1;

    filepathMap[key] = filepathMap[key] || [];
    filepathMap[key].push(obj);
  });

  // Filter duplicates
  _.forIn(filterDupes(dupe, filepathMap), function(values) {
     unique.push(_.first(values));
  });

  return unique;
};

