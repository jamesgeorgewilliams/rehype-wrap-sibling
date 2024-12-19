# rehype-next-sibling-wrap

A [rehype](https://github.com/rehypejs/rehype?tab=readme-ov-file#plugins) plugin to wrap a selected element and its
next sibling element in a container element.

- The plugin will wrap all occurrences of the provided selector and its next sibling if one exists
- HTML comments between the selected element and its next sibling element will not be preserved

## Installation

```
npm i rehype-next-sibling-wrap
```

## Usage

```
import * as fs from 'node:fs/promises';
import { rehype } from 'rehype';
import rehypeNextSiblingWrap from 'rehype-next-sibling-wrap';

const document = await fs.readFile('./input.html', 'utf8');

const file = await rehype()
	.data('settings', { fragment: true })
	.use(rehypeNextSiblingWrap, {
		selector: 'h1',
		wrapper: 'hgroup#document-title',
	})
	.process(document);

await fs.writeFile('./output.html', String(file));
```

#### Input

```
<h1>HTML: Living Standard</h1><p>Last Updated: 16 July 2022</p>
```

#### Output

```
<hgroup id="document-title"><h1>HTML: Living Standard</h1><p>Last Updated: 16 July 2022</p></hgroup>
```

### Options

Name | Type | Description
---|---|---
selector | string | CSS selector to select an element(s)
wrapper| string? | Element to wrap the selected element and its next sibling

- If no `wrapper` option is provided by the user, the default container element will be `<div></div>`.
- The `selector` option can be a CSS selector supported
via [hast-util-select](https://github.com/syntax-tree/hast-util-select?tab=readme-ov-file#support)
- The `wrapper` option can be a selector supported
via [hast-util-parse-selector](https://github.com/syntax-tree/hast-util-parse-selector/blob/main/readme.md#parameters)

## License

[MIT](./LICENSE) :copyright: James Williams
