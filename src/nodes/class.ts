import type { JSONOutput } from "typedoc";
import { ClassDoc, TypeParameter } from "../types";
import { getFunctionDoc } from "./function";
import { getVariableDoc } from "./variable";
import { getAccessorDoc } from "./accessor";
import { getReadableType } from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";
import { getBlockTag } from "./blockTag";

const groupMappings = {
  Constructors: "constructors",
  Properties: "properties",
  Methods: "methods",
  Accessors: "accessors",
} as const;

export function getClassDoc(data: JSONOutput.DeclarationReflection): ClassDoc {
  const methods: ClassDoc["methods"] = [];
  const properties: ClassDoc["properties"] = [];
  const constructors: ClassDoc["constructor"][] = [];
  const accessors: ClassDoc["accessors"] = [];

  // create a mapping from child id to data for lookup
  const childrenMap: Record<string, JSONOutput.DeclarationReflection> = {};
  data.children?.forEach((child) => {
    childrenMap[child.id] = child;
  });

  data.groups?.forEach((group) => {
    const title = group.title as keyof typeof groupMappings;
    if (group.title in groupMappings) {
      group.children?.forEach((childId) => {
        const childData = childrenMap[childId];
        if (!childData) {
          throw new Error(`Failed to resolve child id ${childId}`);
        }

        switch (groupMappings[title]) {
          case "methods": {
            methods.push(getFunctionDoc(childData));
            break;
          }
          case "properties": {
            properties.push(getVariableDoc(childData));
            break;
          }
          case "constructors": {
            constructors.push(getFunctionDoc(childData));
            break;
          }
          case "accessors": {
            accessors.push(getAccessorDoc(childData));
            break;
          }
        }
      });
    } else {
      throw new Error(`Unknown group in class ${group.title}`);
    }
  });

  if (constructors.length > 1) {
    throw new Error(`Found more than 1 constructors on ${data.name} Class`);
  }

  const output: ClassDoc = {
    kind: "class",
    name: data.name,
    source: data.sources?.[0]?.url,

    summary: getSummaryDoc(data.comment?.summary),
    blockTags: data.comment?.blockTags?.map(getBlockTag),

    constructor: constructors[0]!,
    methods: methods.length > 0 ? methods : undefined,
    properties: properties.length > 0 ? properties : undefined,
    accessors: accessors.length > 0 ? accessors : undefined,
    typeParameters: data.typeParameters?.map((param) => {
      const typeParam: TypeParameter = {
        name: param.name,
        extendsType: param.type ? getReadableType(param.type) : undefined,
      };
      return typeParam;
    }),

    implements: data.implementedTypes?.map((t) => getReadableType(t)),
    extends: data.extendedTypes?.map((t) => getReadableType(t)),
  };

  return output;
}
