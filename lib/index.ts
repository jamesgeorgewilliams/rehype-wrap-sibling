import type { Parent, Root } from 'hast';
import { parseSelector } from 'hast-util-parse-selector';
import { selectAll } from 'hast-util-select';
import type { Plugin } from 'unified';
import { findAfter } from 'unist-util-find-after';
import { visit } from 'unist-util-visit';

interface rehypeNextSiblingWrapOptions {
	selector: string;
	wrapper?: string;
}

const rehypeNextSiblingWrap: Plugin<[rehypeNextSiblingWrapOptions], Root> = (
	options,
) => {
	const selector = options.selector;
	const wrapper = options.wrapper ?? 'div';

	return (tree) => {
		if (typeof selector !== 'string') {
			throw new TypeError('Expected a `string` as selector');
		}
		if (typeof wrapper !== 'string') {
			throw new TypeError('Expected a `string` as wrapper');
		}

		const selectedElements = selectAll(selector, tree);

		for (const element of selectedElements) {
			visit(tree, element, (_node, i, parent) => {
				const elementSibling = findAfter(
					parent as Parent,
					element,
					'element',
				);

				if (elementSibling !== undefined) {
					const wrap = parseSelector(wrapper);
					wrap.children = [element, elementSibling];

					if (parent && i !== undefined) {
						parent.children[i] = wrap;

						let deleteCount = 1;
						for (
							let index = i + 1;
							index < parent.children.length;
							index++
						) {
							const node = parent.children[index];

							deleteCount++;

							if (node.type === 'element') {
								parent.children.splice(i + 1, deleteCount);
								break;
							}
						}
					}
				}
			});
		}
	};
};

export default rehypeNextSiblingWrap;
