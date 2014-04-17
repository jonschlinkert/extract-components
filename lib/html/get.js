const cheerio = require('cheerio');
const file = require('fs-utils');
const log = require('verbalize');
const _ = require('lodash');
const _str = require('underscore.string');

const count = require('../utils/wordcount');


module.exports = function (patterns, component) {
  var occurrances = '';
  var files = {components: [], occurrances: {}};

  file.expand(patterns).map(function(filepath) {
    var content = file.readFileSync(filepath);
    var $ = cheerio.load(content, {ignoreWhitespace: false});

    var filename = _str.slugify(component);
    var num = 0;

    $(component).each(function (i, ele) {
      var result = $(this).parent().html();
      occurrances += (filename + ' ');
      num++;

      var name = filename;
      if (num > 1) {
        name = filename + '-' + num;
      }

      files.components.push({
        name: name,
        content: result
      });

      log.run('extracting', name);
    });
  });

  _.extend(files.occurrances, count(occurrances));

  log.verbose.done('done');

  return {
    occurrances: files.occurrances,
    components: files.components
  };
};