/**
 * This is a description of the sum function.
 *
 * This is a second paragraph in the description. Everything after this is markdown
 *
 * # Heading 1
 * ## Heading 2
 * ### Heading 3
 * #### Heading 4
 * ##### Heading 5
 * ###### Heading 6
 *
 * *This text will be italic*
 * _This will also be italic_
 * __This text will be bold__
 * **This will also be bold**
 * _You **can** combine them_
 *
 * * Item 1
 * * Item 2
 *  * Item 2a
 *  * Item 2b
 *
 * 1. numbered item 1
 * 2. numbered item 2
 * 3. numbered item 3
 *
 * @param a - First number
 * @param b - Second number
 * @param rest - Rest of the numbers
 * @returns The sum of all numbers
 *
 * @example
 * ## Example
 *
 * Example can have markdown too and code blocks
 *
 * ```js
 * import { sum } from "my-library";
 * ```
 *
 * You can multiple examples
 *
 * ```ts
 * sum(1, 2, 3, 4); // 10
 * sum(1, 2); // 3
 * ```
 *
 * @remarks This is a remark
 * @see {@link https://en.wikipedia.org/wiki/Mathematics}
 *
 * @twfeature XYZ
 * @foo FOO BAR
 *
 * @deprecated Use `fancySum` instead.
 *
 */
export function sum(a: number, b: number, ...rest: number[]) {
  return a + b + rest.reduce((acc, val) => acc + val, 0);
}
