const file = require('fs-utils');
const css = require('css');


module.exports = function(patterns) {
  var parsed = [];

  file.expand(patterns).map(function(fp) {
    var content = file.readFileSync(fp);
    parsed.push(css.parse(content));
  });

  return parsed;
};