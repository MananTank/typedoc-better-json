# typedoc-better-json

Transforms [typedoc](https://typedoc.org/)'s JSON output to a better format that is more suitable for creating custom documentation website

## Why?

[typedoc](https://typedoc.org/) 's JSON output is extremely complex and it is hard to use for creating a custom documentation website.

The [typedoc-json-parser](https://github.com/RealShadowNova/typedoc-json-parser)'s output is similar to typedoc's JSON output and doesn't convert the complex TypeScript types to human readable types. ( It has broken Types )

This library takes the [typedoc](https://typedoc.org/) 's JSON output as input and transforms it into a simpler, smaller and organized JSON output which can be used to create a custom documentation website easily

## What you get

### Human readable TypeScript types instead of complex structure

<details>
  <summary> typedoc gives you a very complex TypeScript Type like this: </summary>

```json
{
  "type": {
    "type": "reference",
    "target": {
      "sourceFileName": "src/core/query-utils/required-param.ts",
      "qualifiedName": "RequiredParam"
    },
    "typeArguments": [
      {
        "type": "union",
        "types": [
          {
            "type": "literal",
            "value": null
          },
          {
            "type": "reference",
            "target": {
              "sourceFileName": "../sdk/src/evm/contracts/prebuilt-implementations/nft-drop.ts",
              "qualifiedName": "NFTDrop"
            },
            "name": "NFTDrop",
            "package": "@thirdweb-dev/sdk"
          },
          {
            "type": "reference",
            "target": {
              "sourceFileName": "../sdk/src/evm/contracts/prebuilt-implementations/signature-drop.ts",
              "qualifiedName": "SignatureDrop"
            },
            "name": "SignatureDrop",
            "package": "@thirdweb-dev/sdk"
          },
          {
            "type": "reference",
            "target": {
              "sourceFileName": "../sdk/src/evm/contracts/smart-contract.ts",
              "qualifiedName": "SmartContract"
            },
            "typeArguments": [
              {
                "type": "reference",
                "target": {
                  "sourceFileName": "../../node_modules/.pnpm/@ethersproject+contracts@5.7.0/node_modules/@ethersproject/contracts/src.ts/index.ts",
                  "qualifiedName": "BaseContract"
                },
                "name": "BaseContract",
                "package": "@ethersproject/contracts"
              }
            ],
            "name": "SmartContract",
            "package": "@thirdweb-dev/sdk"
          }
        ]
      }
    ],
    "name": "RequiredParam",
    "package": "@thirdweb-dev/react-core"
  }
}
```

</details>

<details>
  <summary> typedoc-better-json transforms it into this: </summary>

```json
{
  "type": "RequiredParam<null | NFTDrop | SignatureDrop | SmartContract<BaseContract>>"
}
```

</details>

### Full Markdown parsing of the JSDoc comment

````ts
/**
 * This is a description
 *
 * Second paragraph with some inline code `const a = 1`
 *
 * # Title
 * ## Subtitle
 *
 * This is *italic* and this is **bold**
 *
 * * Item 1
 * * Item 2
 *  * Item 2a
 *  * Item 2b
 *
 * 1. numbered item 1
 * 2. numbered item 2
 *
 * @param a - First number
 * @param b - Second number
 * @returns the sum of both numbers
 *
 * @example
 * ## another title
 *
 * You can also show examples by using markdown code blocks
 *
 * ```ts
 * import { sum } from "my-library";
 * sum(1, 2); // 3
 * ```
 *
 * @remarks
 *
 * ## another title
 *
 * Some more content
 *
 * @see {@link https://en.wikipedia.org/wiki/Mathematics}
 *
 * @deprecated Use `fancySum` instead.
 *
 */
export function sum(a: number, b: number) {
  return a + b;
}
````

<details>
  <summary> For the above code, you will get this output: </summary>

```json
{
  "functions": [
    {
      "kind": "function",
      "name": "sum",
      "signatures": [
        {
          "summary": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "This is a description"
                }
              ]
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "Second paragraph with some inline code "
                },
                {
                  "type": "inlineCode",
                  "value": "const a = 1"
                }
              ]
            },
            {
              "type": "heading",
              "depth": 1,
              "children": [
                {
                  "type": "text",
                  "value": "Title"
                }
              ]
            },
            {
              "type": "heading",
              "depth": 2,
              "children": [
                {
                  "type": "text",
                  "value": "Subtitle"
                }
              ]
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "This is "
                },
                {
                  "type": "emphasis",
                  "children": [
                    {
                      "type": "text",
                      "value": "italic"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": " and this is "
                },
                {
                  "type": "strong",
                  "children": [
                    {
                      "type": "text",
                      "value": "bold"
                    }
                  ]
                }
              ]
            },
            {
              "type": "list",
              "ordered": false,
              "start": null,
              "spread": false,
              "children": [
                {
                  "type": "listItem",
                  "spread": false,
                  "checked": null,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "Item 1"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "listItem",
                  "spread": false,
                  "checked": null,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "Item 2"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "listItem",
                  "spread": false,
                  "checked": null,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "Item 2a"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "listItem",
                  "spread": false,
                  "checked": null,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "Item 2b"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "list",
              "ordered": true,
              "start": 1,
              "spread": false,
              "children": [
                {
                  "type": "listItem",
                  "spread": false,
                  "checked": null,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "numbered item 1"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "listItem",
                  "spread": false,
                  "checked": null,
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "type": "text",
                          "value": "numbered item 2"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "parameters": [
            {
              "name": "a",
              "type": "number",
              "summary": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "First number"
                    }
                  ]
                }
              ]
            },
            {
              "name": "b",
              "type": "number",
              "summary": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Second number"
                    }
                  ]
                }
              ]
            }
          ],
          "returns": {
            "type": "number",
            "summary": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "the sum of both numbers"
                  }
                ]
              }
            ]
          },
          "blockTags": [
            {
              "tag": "@example",
              "summary": [
                {
                  "type": "heading",
                  "depth": 2,
                  "children": [
                    {
                      "type": "text",
                      "value": "another title"
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "You can also show examples by using markdown code blocks"
                    }
                  ]
                },
                {
                  "type": "code",
                  "lang": "ts",
                  "meta": null,
                  "value": "import { sum } from \"my-library\";\nsum(1, 2); // 3"
                }
              ]
            },
            {
              "tag": "@remarks",
              "summary": [
                {
                  "type": "heading",
                  "depth": 2,
                  "children": [
                    {
                      "type": "text",
                      "value": "another title"
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Some more content"
                    }
                  ]
                }
              ]
            },
            {
              "tag": "@see",
              "summary": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "link",
                      "title": null,
                      "url": "https://en.wikipedia.org/wiki/Mathematics",
                      "children": [
                        {
                          "type": "text",
                          "value": "https://en.wikipedia.org/wiki/Mathematics"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "tag": "@deprecated",
              "summary": [
                {
                  "type": "paragraph",
                  "children": [
                    {
                      "type": "text",
                      "value": "Use "
                    },
                    {
                      "type": "inlineCode",
                      "value": "fancySum"
                    },
                    {
                      "type": "text",
                      "value": " instead."
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "source": "https://github.com/MananTank/typedoc-gen/blob/b476ff8/tests/code.ts#L44"
    }
  ]
}
```

</details>

### Simpler, Smaller and organized JSON

The JSON output organizes functions, hooks, components, types, variables, enums, classes

```ts
type TransformedDoc = {
  functions?: FunctionDoc[];
  hooks?: FunctionDoc[];
  components?: FunctionDoc[];
  types?: InterfaceDoc[];
  variables?: VariableDoc[];
  enums?: EnumDoc[];
  classes?: ClassDoc[];
};
```

## Installation

```
npm i typedoc-better-json
```

## Usage

Follow the [typedoc guide](https://typedoc.org/options/output/#json) for generating a JSON output.

Once you have the JSON file, you can transform it like this:

```ts
import { transform } from "typedoc-better-json";
import { writeFile, readFile } from "node:fs/promises";

async function Example() {
  // read the JSON file generated by typedoc
  const fileContent = await readFile("path/to/doc.json", "utf8");

  // parse it
  const fileData = JSON.parse(fileContent);

  // transform it
  const transformedData = transform(fileData);

  // save it in file
  await writeFile(
    "path/to/transformed-doc.json",
    JSON.stringify(transformedData, null, 2),
  );
}
```

### License

MIT
