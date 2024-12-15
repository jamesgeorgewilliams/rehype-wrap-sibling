import { format } from 'hast-util-format';
import { parseSelector } from 'hast-util-parse-selector';
import { selectAll } from 'hast-util-select';
import { findAfter } from 'unist-util-find-after';
import { visit } from 'unist-util-visit';

const rehypeNextSiblingWrap = (options) => {
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
				const elementSibling = findAfter(parent, element, 'element');

				if (elementSibling !== undefined) {
					const wrap = parseSelector(wrapper);
					wrap.children = [element, elementSibling];

					if (i) {
						parent.children[i] = wrap;

						// Subsequent node types can possibly be 'text' or 'comment'
						for (
							let index = i + 1;
							index < parent.children.length;
							index++
						) {
							const node = parent.children[index];
							if (node.type === 'element') {
								parent.children.splice(index, 1);
								break;
							}
						}
					}
				}
			});
		}

		format(tree);
	};
};

export default rehypeNextSiblingWrap;
