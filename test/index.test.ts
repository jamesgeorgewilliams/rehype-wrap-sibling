import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { assert, expect, test } from 'vitest';
// importing with .js extension to conform with node spec
import rehypeNextSiblingWrap from '../lib/index.js';

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

test('throw an error if the user provided selector is not a string', async () => {
	const inputHTML = '<h1>Lorem</h1>';

	expect(() =>
		transformHTML(
			rehypeNextSiblingWrap,
			{
				//@ts-ignore
				selector: 1,
				wrapper: 'div.container',
			},
			inputHTML,
		),
	).toThrowError('Expected a `string` as selector');
});

test('throw an error if the user provided wrapper is not a string', async () => {
	const inputHTML = '<h1>Lorem</h1>';

	expect(() =>
		transformHTML(
			rehypeNextSiblingWrap,
			{
				selector: 'h1',
				//@ts-ignore
				wrapper: 1,
			},
			inputHTML,
		),
	).toThrowError('Expected a `string` as wrapper');
});

test("throw an error if user doesn't provide a selector option", async () => {
	const inputHTML = '<h1>Lorem</h1>';

	expect(() =>
		transformHTML(
			rehypeNextSiblingWrap,
			//@ts-ignore
			{
				wrapper: 'div.container',
			},
			inputHTML,
		),
	).toThrowError('Expected a `string` as selector');
});

test("the default wrapper option is a div if the user doesn't provide one", async () => {
	const inputHTML = '<h1>Lorem</h1><h2>Ipsum</h2>';
	const expectedHTML = '<div><h1>Lorem</h1><h2>Ipsum</h2></div>';

	const result = transformHTML(
		rehypeNextSiblingWrap,
		{
			selector: 'h1',
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});
