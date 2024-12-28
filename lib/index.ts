import type { Element, Parent, Root } from 'hast';
import { parseSelector } from 'hast-util-parse-selector';
import { selectAll } from 'hast-util-select';
import type { Plugin } from 'unified';
import { findAfter } from 'unist-util-find-after';
import { findBefore } from 'unist-util-find-before';
import { visit } from 'unist-util-visit';

type rehypeWrapSiblingOptions = {
	selector: string;
	wrapper?: string;
	wrapPreviousSibling?: boolean;
};

const rehypeWrapSibling: Plugin<[rehypeWrapSiblingOptions], Root> = (
	options,
) => {
	const selector = options.selector;
	const wrapper = options.wrapper ?? 'div';
	const wrapPreviousSibling = options.wrapPreviousSibling ?? false;

	return (tree) => {
		if (typeof selector !== 'string') {
			throw new TypeError('Expected a `string` as selector');
		}
		if (typeof wrapper !== 'string') {
			throw new TypeError('Expected a `string` as wrapper');
		}
		if (typeof wrapPreviousSibling !== 'boolean') {
			throw new TypeError('Expected a `boolean` as wrapPreviousSibling');
		}

		const selectedElements = selectAll(selector, tree);

		for (const element of selectedElements) {
			visit(tree, element, (_node, i, parent) => {
				if (wrapPreviousSibling) {
					const previousSibling: Element | undefined = findBefore(
						parent as Parent,
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
						parent as Parent,
						element,
						'element',
					);

					if (elementSibling !== undefined) {
						const wrap = parseSelector(wrapper);
						wrap.children = [element, elementSibling];

						if (parent && i !== undefined) {
							parent.children[i] = wrap;

							let deleteCount = 0;
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

export default rehypeWrapSibling;
