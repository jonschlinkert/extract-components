module.exports = function(src) {
  var html = require('js-beautify').html(src, {
    indent_char: ' ',
    indent_size: 2,
    indent_inner_html: true,
    unformatted: ['code', 'pre', 'em', 'strong', 'span']
  });

  return html;
};