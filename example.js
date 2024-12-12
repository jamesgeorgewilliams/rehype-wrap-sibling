import * as fs from 'node:fs/promises';
import { rehype } from 'rehype';
import rehypeNextSiblingWrap from './plugin.js';

const document = await fs.readFile('input.html', 'utf8');

const file = await rehype()
	.data('settings', { fragment: true })
	.use(rehypeNextSiblingWrap, { selector: 'h1', wrapper: 'div.container' })
	.process(document);

await fs.writeFile('output.html', String(file));
