// import * as fs from 'node:fs/promises';
import { unified } from 'unified';
import { rehype } from 'rehype';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { assert, expect, test } from 'vitest';
import rehypeNextSiblingWrap from '../dist/lib/index.js';

const transformHTML = (
	plugin: typeof rehypeNextSiblingWrap,
	options: { selector: string; wrapper?: string },
	html: string,
) => {
	return unified()
		.use(rehypeParse, { fragment: true })
		.use(rehypeStringify)
		.use(plugin, options)
		.processSync(html);
};

test('first test', async () => {
	const inputHTML =
		'<div><h1>Solar System</h1><h2>Formation and evolution</h2></div>';
	const expectedHTML =
		'<div><div class="container"><h1>Solar System</h1><h2>Formation and evolution</h2></div></div>';

	const result = transformHTML(
		rehypeNextSiblingWrap,
		{
			selector: 'h1',
			wrapper: 'div.container',
		},
		inputHTML,
	);
	expect(result.value).toBe(expectedHTML);
});

test('assert.equal', async () => {
	const inputHTML =
		'<div><h1>Solar System</h1><h2>Formation and evolution</h2></div>';
	const expectedHTML =
		'<div><div class="container"><h1>Solar System</h1><h2>Formation and evolution</h2></div></div>';

	const result = transformHTML(
		rehypeNextSiblingWrap,
		{
			selector: 'h1',
			wrapper: 'div.container',
		},
		inputHTML,
	);
	assert.equal(result.value, expectedHTML);
});
