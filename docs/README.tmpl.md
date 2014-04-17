# {%= name %} {%= badge("fury") %}

> {%= description %}

## Install
{%= include("install-global") %}

For a quickstart, try running:

```bash
extract "test/fixtures/*.html" .carousel
```

The results will be saved to `examples/carousel`.
This will extract the carousel component from Bootstrap's HTML (found in `test/fixtures`).

The results will be saved to `examples/carousel`. Open it in the browser to see what this does ;-)

You can also just run `node index` to use the defaults. This first searches through Bootstrap's LESS files and parses out CSS classes, then those classes are used to find components so we can extract them from the HTML.

## Usage

The CLI is a WIP. It currently takes four arguments:

```bash
extract [src] [selector] [dest] [ext]
```


* `src`: (`-s` | `--src`) the filepaths or globbing patterns for the file(s) to parse, e.g. `test/fixtures/*.html`
* `selector`: (`-c`, for "component" | `--selector`)  the _component selector_, e.g. use `.carousel` to extract the carousel component.
* `dest`: (`-d` | `--dest`) (optional, default is `temp`): the destination directory for extracted components, e.g. `temp`
* `ext`: (`-e` | `--ext`) (optional, default is `.html`): dest extension to use for dest components, e.g. `.hbs`


## Author
{%= contrib("jon") %}

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}