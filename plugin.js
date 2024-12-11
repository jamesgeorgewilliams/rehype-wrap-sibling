import { visit } from 'unist-util-visit';
import { parseSelector } from 'hast-util-parse-selector';
import { format } from 'hast-util-format';
import { selectAll } from 'hast-util-select';
import { findAfter } from 'unist-util-find-after';

function transform(tree) {
	const selector = 'h2';
	const selectedElements = selectAll(selector, tree);

	for (const element of selectedElements) {
		visit(tree, element, (node, i, parent) => {
			const elementSibling = findAfter(parent, element, 'element');

			let indexToRemove;

			if (elementSibling !== undefined) {
				const wrapper = parseSelector('div.wrapper');
				wrapper.children = [element, elementSibling];

				parent.children[i] = wrapper;

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

function rehypeSiblingWrap(options) {
	return (tree) => {
		transform(tree);
		format(tree);
	};
}

export default rehypeSiblingWrap;
