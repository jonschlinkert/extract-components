const cheerio = require('cheerio');
const file = require('fs-utils');
const _ = require('lodash');
const template = require('template');
const unique = require('unique-words');
const log = require('verbalize');

const defaultTemplate = file.readFileSync('./lib/utils/template.tmpl');
log.runner = 'extract-components';


module.exports = function(patterns, components, options) {
  options = options || {};
  var arr = [];

  var tmpl = options.template || defaultTemplate;

  file.expand(patterns).map(function(fp) {
    log.run('reading', fp);

    var content = template(tmpl, {content: file.readFileSync(fp)});
    var $ = cheerio.load(content, {ignoreWhitespace: false});

    components.map(function(component) {
      $(component).map(function() {
        arr.push($(this).attr('class'));
      });
    });
  });

  var result = _.unique(_.flatten(arr)).map(function(ea) {
    return ea.replace(/\./g, ' ');
  });

  return unique(result).sort();
};


