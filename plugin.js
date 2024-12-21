import { parseSelector } from 'hast-util-parse-selector';
import { selectAll } from 'hast-util-select';
import { findAfter } from 'unist-util-find-after';
import { findBefore } from 'unist-util-find-before';
import { visit } from 'unist-util-visit';
const rehypeSiblingWrap = (options) => {
	const selector = options.selector;
	const wrapper = options.wrapper ?? 'div';
	const previous = options.previous ?? false;
	return (tree) => {
		if (typeof selector !== 'string') {
			throw new TypeError('Expected a `string` as selector');
		}
		if (typeof wrapper !== 'string') {
			throw new TypeError('Expected a `string` as wrapper');
		}
		if (typeof previous !== 'boolean') {
			throw new TypeError('Expected a `boolean` as previous');
		}
		const selectedElements = selectAll(selector, tree);
		for (const element of selectedElements) {
			visit(tree, element, (_node, i, parent) => {
				if (previous) {
					const previousSibling = findBefore(
						parent,
						element,
						'element',
					);
					if (previousSibling !== undefined) {
						const wrap = parseSelector(wrapper);
						wrap.children = [previousSibling, element];
						if (parent && i !== undefined) {
							parent.children[i] = wrap;
							let deleteCount = 0;
							for (let index = i - 1; index >= 0; index--) {
								const node = parent.children[index];
								deleteCount++;
								if (node.type === 'element') {
									parent.children.splice(index, deleteCount);
									break;
								}
							}
						}
					}
				} else {
					const elementSibling = findAfter(
						parent,
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
				}
			});
		}
	};
};
export default rehypeSiblingWrap;
