const cheerio = require('cheerio');
const file = require('fs-utils');
const log = require('verbalize');
const _ = require('lodash');
const _str = require('underscore.string');

const prettify = require('../utils/prettify');
const count = require('../utils/wordcount');


module.exports = function (patterns, components) {
  var occurrances = '';
  var files = {components: [], occurrances: {}};

  file.expand(patterns).map(function(filepath) {
    var content = file.readFileSync(filepath);
    var $ = cheerio.load(content, {ignoreWhitespace: false});

    components.map(function (modifier) {
      var filename = _str.slugify(modifier);
      var num = 0;

      $(modifier).parent().each(function (i, ele) {
        var result = $(this).html();
        occurrances += (filename + ' ');
        num++;

        var name = filename;
        if (num > 1) {
          name = filename + '-' + num;
        }

        files.components.push({
          name: name,
          content: prettify(result)
        });

        log.run('extracting', name);
      });
    });
  });

  _.extend(files.occurrances, count(occurrances));

  log.done('done');

  return {
    occurrances: files.occurrances,
    components: files.components
  };
};
