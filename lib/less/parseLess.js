const file = require('fs-utils');
const log = require('verbalize');
const _ = require('lodash');
const trim = require('../utils/trim');


/**
 * Build a list of LESS components from classes
 * in .less files.
 *
 * @param   {String}  patterns  String to parse for less classes.
 * @return  {[type]}            [description]
 */

exports.buildClassList = function(patterns, mixins) {
  var arr = [];
  var re = /^(?:\s*(?![\S]+\()\.[^ ,\.:\[\(@]+)/gm;

  if (mixins) {
    re = /^(?:\s*\.[^ ,\.:\[\(@]+)/gm;
  }

  file.expand(patterns).filter(function (filepath) {
    log.inform('extracting', 'classes from', filepath);

    // Read in each file in the expanded array
    var content = file.readFileSync(filepath);
    var name = file.name(filepath);

    // Parse out CSS classes. This should be basic, not all-comprehensive.
    var modifiers = content.match(re);
    if (!Array.isArray(modifiers)) {
      return;
    }

    arr.push({
      name: name,
      modifiers: _.unique(_.flatten(modifiers.map(trim).sort()))
    });
  });

  // Remove object with empty `modifiers` arrays
  return arr.filter(function(component) {
    return component.modifiers.length > 0;
  });
};



/**
 * All components
 */

exports.componentArray = function(arr) {
  return _.flatten(_.unique(_.map(arr, function(obj) {
    return [].concat.apply(obj.modifiers);
  }), true));
};



/**
 * Filter out components that aren't related.
 *
 * Don't use this. I'm keeping it here as a reminder
 * to do someting less lame and inaccurate.
 */

exports.filterComponents = function(arr) {
  return _.map(arr, function(obj) {
    var name = obj.name.replace(/s$/, '');
    name = name.replace(/button-group/, 'btn');

    obj.modifiers = obj.modifiers.filter(function(modifier) {
      return !!~modifier.search(name);
    });

    return obj;
  });
};
