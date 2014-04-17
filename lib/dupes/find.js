const _ = require('lodash');
const filterDupes = require('./filterDupes');

/**
 * Find duplicates files.
 *
 * @param   {Array} Array of file objects
 *    @prop [basename] (required) basename of the file
 * @param   {Object}  options
 *
 * @return  {Array} array of duplicates
 * @api public
 */

module.exports = function(files, options) {
  var opts = _.extend({stats: true}, options);
  var filepathMap = {};
  var dupe = {};

  files.filter(function (obj) {
    return obj.content !== null;
  }).forEach(function (obj) {
    var key = obj.content;
    dupe[key] = (dupe[key] || 0) + 1;

    filepathMap[key] = filepathMap[key] || [];

    if (opts.stats) {
      filepathMap[key].push(obj);
    } else {
      filepathMap[key].push(obj.path);
    }
  });

  // Filter dupldates
  return filterDupes(dupe, filepathMap);
};

