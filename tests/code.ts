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

const getBoo = () => {
  const xyz = function (...args: [a: number]) {
    console.log(args);
  };

  xyz.bar = "hello";

  return xyz;
};

/**
 * Variable test
 */
export const test = {
  /**
   * Normal property
   */
  foo: 1,
  /**
   * method on variable
   */
  bar() {
    return {
      value: 10,
    };
  },
  /**
   * method with arguments
   * @param a - first number
   * @param b - second number
   *
   * @example
   * ```ts
   * test.bazz(1, 2); // 3
   * ```
   */
  bazz(a: number, b: number) {
    return a + b;
  },
  /**
   * method with rest arguments and extra property
   *
   * @example
   * ```ts
   * console.log('hello')
   * ```
   */
  boo: getBoo(),
};

class Bar {}

class Bar2 {}

export class Foo<T extends string> extends Bar2 implements Bar {
  get(): T {
    return "hello" as T;
  }

  /**
   * Foo.boo description
   *
   * @example
   * ```ts
   * console.log('Foo.boo example')
   * ```
   */
  boo = getBoo();

  /**
   *
   * @param a - first number
   * @param b - second number
   * @example
   * ```ts
   * Foo.bazz(1, 2); // 3
   * ```
   */
  bazz = (a: number, b: number) => a + b;
}
