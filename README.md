# rehype-wrap-sibling

![build](https://github.com/jamesgeorgewilliams/rehype-wrap-sibling/workflows/main/badge.svg)
[![npm version](https://badge.fury.io/js/rehype-wrap-sibling.svg?icon=si%3Anpm)](https://badge.fury.io/js/rehype-wrap-sibling)

A [rehype](https://github.com/rehypejs/rehype?tab=readme-ov-file#plugins) plugin to wrap a selected element and its
sibling in a container element.

- The plugin will wrap all occurrences of the provided selector and its sibling if one exists.
- The selected element(s) and next sibling are wrapped by default.
- HTML comments between the selected element(s) and sibling element will not be preserved.
- The plugin doesn't prettify output of the wrapper: whitespace, line endings, etc.

## Installation

This package is [ESM only][esm].

```sh
npm i rehype-wrap-sibling
```

## Usage

```js
/* example.js */

import * as fs from 'node:fs/promises';
import { rehype } from 'rehype';
import rehypeWrapSibling from 'rehype-wrap-sibling';

const document = await fs.readFile('./input.html', 'utf8');

const file = await rehype()
	.data('settings', { fragment: true })
	.use(rehypeWrapSibling, {
		selector: 'h1',
		wrapper: 'hgroup#doc-title',
	})
	.process(document);

await fs.writeFile('./output.html', String(file));
```

```html
<!-- input.html -->

<h1>HTML: Living Standard</h1>
<p>Last Edited: 7 July 2022</p>
```

```html
<!-- output.html -->

<hgroup id="doc-title"><h1>HTML: Living Standard</h1><p>Last Edited: 7 July 2022</p></hgroup>
```

### Options

Name | Type | Description
---|---|---
`selector` | `string` | CSS selector to select an element(s).
`wrapper` | `string?` | Element to wrap the selected element and its sibling.
`wrapPreviousSibling` | `boolean?` | If `true`, the selected element(s), and its previous sibling are wrapped.

- If no `wrapper` option is provided by the user, the default container element will be `<div></div>`.
- The `selector` option can be a CSS selector supported
via [hast-util-select](https://github.com/syntax-tree/hast-util-select?tab=readme-ov-file#support).
- The `wrapper` option can be a selector supported
via [hast-util-parse-selector](https://github.com/syntax-tree/hast-util-parse-selector/blob/main/readme.md#parameters).

## License

[MIT](./LICENSE) :copyright: [James Williams][author]

[author]: https://jameswilliams.dev

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
