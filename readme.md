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
