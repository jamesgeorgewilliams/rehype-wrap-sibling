import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { expect, test } from 'vitest';
// importing with .js extension to conform with node spec
import rehypeSiblingWrap from '../lib/index.js';

const transformHTML = (
	plugin: typeof rehypeSiblingWrap,
	options: { selector: string; wrapper?: string; previous?: boolean },
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
			rehypeSiblingWrap,
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
			rehypeSiblingWrap,
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
			rehypeSiblingWrap,
			//@ts-ignore
			{
				wrapper: 'div.container',
			},
			inputHTML,
		),
	).toThrowError('Expected a `string` as selector');
});

test("a container is not added to elements that don't have a sibling", async () => {
	const inputHTML = '<h1>Lorem</h1>';
	const expectedHTML = '<h1>Lorem</h1>';

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: 'h1',
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});

test('a container is added to elements that have a sibling', async () => {
	const inputHTML = '<h1>Lorem</h1><h2>Ipsum</h2>';
	const expectedHTML = '<div><h1>Lorem</h1><h2>Ipsum</h2></div>';

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: 'h1',
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});

test('a provided user class in the wrapper option is added to the container', async () => {
	const inputHTML = '<h1>Lorem</h1><h2>Ipsum</h2>';
	const expectedHTML =
		'<div class="container"><h1>Lorem</h1><h2>Ipsum</h2></div>';

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: 'h1',
			wrapper: 'div.container',
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});

test('a provided user class in the selector targets the correct element', async () => {
	const inputHTML = '<h1 class="heading">Lorem</h1><h2>Ipsum</h2>';
	const expectedHTML =
		'<div><h1 class="heading">Lorem</h1><h2>Ipsum</h2></div>';

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: '.heading',
			wrapper: 'div',
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});

test('a HTML comment between siblings is removed, and the elements are wrapped', async () => {
	const inputHTML = '<h1>Lorem</h1><!-- HTML comment --><h2>Ipsum</h2>';
	const expectedHTML = '<div><h1>Lorem</h1><h2>Ipsum</h2></div>';

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: 'h1',
			wrapper: 'div',
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});

test('multiple selected elements and their respective siblings are wrapped', async () => {
	const inputHTML = `<figcaption><cite>Venus and Adonis</cite>, by William Shakespeare</figcaption>
<p>
	Bid me discourse, I will enchant thine ear, Or like a fairy trip upon the
	green, Or, like a nymph, with long dishevelled hair, Dance on the sands, and
	yet no footing seen: Love is a spirit all compact of fire, Not gross to
	sink, but light, and will aspire.
</p>
<figcaption><b>Edsger Dijkstra:</b></figcaption>
<blockquote>
	If debugging is the process of removing software bugs, then programming must
	be the process of putting them in.
</blockquote>`;

	const expectedHTML = `<figure><figcaption><cite>Venus and Adonis</cite>, by William Shakespeare</figcaption><p>
	Bid me discourse, I will enchant thine ear, Or like a fairy trip upon the
	green, Or, like a nymph, with long dishevelled hair, Dance on the sands, and
	yet no footing seen: Love is a spirit all compact of fire, Not gross to
	sink, but light, and will aspire.
</p></figure><figure><figcaption><b>Edsger Dijkstra:</b></figcaption><blockquote>
	If debugging is the process of removing software bugs, then programming must
	be the process of putting them in.
</blockquote></figure>`;

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: 'figcaption',
			wrapper: 'figure',
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});

test("a container is not added to elements that don't have a previous sibling", async () => {
	const inputHTML = '<h1>Lorem</h1>';
	const expectedHTML = '<h1>Lorem</h1>';

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: 'h1',
			previous: true,
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});

test('a container is added to elements that have a previous sibling', async () => {
	const inputHTML = '<h1>Lorem</h1><h2>Ipsum</h2>';
	const expectedHTML = '<div><h1>Lorem</h1><h2>Ipsum</h2></div>';

	const result = transformHTML(
		rehypeSiblingWrap,
		{
			selector: 'h2',
			previous: true,
		},
		inputHTML,
	);

	expect(result.value).toBe(expectedHTML);
});
