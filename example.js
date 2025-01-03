import * as fs from 'node:fs/promises';
import { rehype } from 'rehype';
import rehypeWrapSibling from './plugin.js';

const document = await fs.readFile('./static/input.html', 'utf8');

const file = await rehype()
	.data('settings', { fragment: true })
	.use(rehypeWrapSibling, {
		selector: 'h1',
		wrapper: 'hgroup#doc-title',
	})
	.process(document);

await fs.writeFile('./static/output.html', String(file));
