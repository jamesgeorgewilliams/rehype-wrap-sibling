import { visit } from 'unist-util-visit';
import { parseSelector } from 'hast-util-parse-selector';
import { format } from 'hast-util-format';
import { selectAll } from 'hast-util-select';
import { findAfter } from 'unist-util-find-after';

function transform(tree, selector, wrapper) {
	const selectedElements = selectAll(selector, tree);

	for (const element of selectedElements) {
		visit(tree, element, (_node, i, parent) => {
			const elementSibling = findAfter(parent, element, 'element');

			let indexToRemove;

			if (elementSibling !== undefined) {
				const wrap = parseSelector(wrapper);
				wrap.children = [element, elementSibling];

				parent.children[i] = wrap;

				// Subsequent node types can possibly be 'text' or 'comment'
				parent.children.some((node, index) => {
					if (index > i && node.type === 'element') {
						indexToRemove = index;
						return true;
					}
				});

				parent.children.splice(indexToRemove, 1);
			}
		});
	}
}

function rehypeNextSiblingWrap(options = {}) {
	const selector = options.selector;
	const wrapper = options.wrapper ?? 'div';

	return (tree) => {
		if (typeof selector !== 'string') {
			throw new TypeError('Expected a `string` as selector');
		}
		if (typeof wrapper !== 'string') {
			throw new TypeError('Expected a `string` as wrapper');
		}
		transform(tree, selector, wrapper);
		format(tree);
	};
}

export default rehypeNextSiblingWrap;
