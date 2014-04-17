const fs = require('fs-utils');
const log = require('verbalize');
const _ = require('lodash');
const css = require('css');


module.exports = function(patterns) {
  var parsed = [],
    selectors = [],
    ids = [],
    elements = [],
    classes = [];

  log.writeln();

  fs.expand(patterns).map(function(fp) {
    log.run('parsing', fp);

    var content = fs.readFileSync(fp);
    parsed.push(css.parse(content));
  });

  parsed.map(function(ea) {
    ea.stylesheet.rules.map(function(rule) {
      if (rule.type === 'rule') {
        selectors.push(rule.selectors);
      }
    });
  });

  _.flatten(selectors).filter(function(selector) {
    return !~selector.search('@');
  }).map(function(selector) {
    if (/\./.test(selector)) {
      selector = selector.replace(/\:[\s\S]+/, '');
      classes.push(selector);
    } else if (/#/.test(selector)) {
      ids.push(selector);
    } else {
      elements.push(selector);
    }
  });


  log.done('done');

  return {
    classes: _.unique(classes).sort(),
    elements: _.unique(elements).sort()
  };
};
