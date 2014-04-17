const path = require('path');
const file = require('fs-utils');
const template = require('template');
const relative = require('relative');
const log = require('verbalize');
const _ = require('lodash');
const marked = require('marked');
const extras = require('marked-extras');


log.runner = 'extract-components';

// Dupes
const findDupes = require('./dupes/find');
const removeDupes = require('./dupes/remove');

// LESS
const parseLess = require('./less/parseLess');

// CSS
const parseCss = require('./css/parseCss');
const filterSelectors = require('./css/filterCss');

// HTML
const extract = require('./html/extract');
const uniquify = require('./html/uniquify');

// Utils
const exclusions = require('./utils/exclusions');
const sanitize = require('./utils/sanitize');
const prettify = require('./utils/prettify');


/**
 * 1. LESS
 */


// Build an array of all CSS components, along with the modifier classes for each.
var getClasses = parseLess.buildClassList('vendor/bootstrap/less/*.less');
file.writeJSONSync('data/component-list.json', getClasses);

// var getMixins = parseLess.buildClassList('vendor/bootstrap/less/mixins/*.less', true);
// file.writeJSONSync('data/mixin-list.json', getMixins);

// Build a flattened array of all CSS classes
var arrayOfClasses = parseLess.componentArray(getClasses);
file.writeJSONSync('data/all-css-classes.json', arrayOfClasses);


/**
 * 2. CSS
 */

var parsedCss = parseCss('vendor/bootstrap/dist/css/bootstrap.css');
file.writeJSONSync('data/parsed-css.json', parsedCss);


var filteredSelectors = filterSelectors('vendor/bootstrap/dist/css/bootstrap.css');
file.writeJSONSync('data/filtered-classes.json', filteredSelectors.classes);
file.writeJSONSync('data/filtered-elements.json', filteredSelectors.elements);


/**
 * 3. HTML
 *
 * These don't need to run unless something changes in the html.
 */

var safeClasses = _.difference(arrayOfClasses, exclusions);
file.writeJSONSync('data/safe-classes.json', safeClasses);

var safeClassesParsed = sanitize(filteredSelectors.classes);
file.writeJSONSync('data/safe-classes-parsed.json', safeClassesParsed);

// Extract HTML components
// var extractedFromParser = extract('test/fixtures/*.html', safeClassesParsed);
// file.writeJSONSync('data/extracted-from-css-parser.json', extractedFromParser);


// // Extract HTML components
// var extracted = extract('test/fixtures/*.html', safeClasses);
// file.writeJSONSync('data/extracted.json', extracted);

// // Find duplicates
// var dupes = findDupes(extractedFromParser.components);
// file.writeJSONSync('data/dupes.json', dupes);


// Without duplicates
var noDupes = removeDupes(file.readJSONSync('data/extracted-from-css-parser.json').components, 'content');
file.writeJSONSync('data/no-dupes.json', noDupes);

var tmpl = file.readFileSync('./lib/utils/template.tmpl');

function setup() {
  var options = {
    cwd: 'lib',
    destBase: 'examples',
    filter: 'isFile'
  };

  file.expandMapping('assets/**', options).map(function (fp) {
    file.copyFileSync(fp.src, fp.dest);
  });
}


function buildComponents(components, destpath, assets) {
  var opts = {prefix: 'language-', process: true};
  extras.init(opts);
  var markedOpts = _.extend({}, extras.markedDefaults, opts);
  marked.setOptions(markedOpts);

  components.map(function(component) {
    var name = _.uniq(component.name.split('-')).join('-') + '.html';
    var dir = component.name.split('-')[0];
    var dest = path.join(destpath, dir, name);

    var content = prettify(component.content);
    var assetsPath = relative(dest, path.join(destpath, assets));
    var code = '\n\n```html\n' + content + '\n```\n';

    var rendered = template(tmpl, {
      content: content,
      name: name,
      code: marked(code),
      assets: assetsPath
    });

    log.run('writing', relative(dest));
    file.writeFileSync(dest, rendered);
  });
}

var componentList = file.readJSONSync('data/no-dupes.json');

setup();
buildComponents(componentList, 'examples', 'assets');
