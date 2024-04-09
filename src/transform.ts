import { TransformedDoc } from "./types";
import type { JSONOutput } from "typedoc";
import { getFunctionDoc } from "./nodes/function";
import { isComponentType } from "./utils/isComponentType";
import { getInterfaceDoc } from "./nodes/interface";
import { getEnumDoc } from "./nodes/enum";
import { getVariableDoc } from "./nodes/variable";
import { getClassDoc } from "./nodes/class";
import pkg from "../package.json";
import { isHook } from "./utils/isHook";

const groupNameMap = {
  Interfaces: "types",
  "Type Aliases": "types",
  Variables: "variables",
  Functions: "functions",
  Classes: "classes",
  Enumerations: "enums",
} as const;

/**
 * Transform the typedoc's JSON output to a better format which is more suitable for creating custom website
 * @param inputData - typedoc's JSON output parsed into a JS object via JSON.parse
 */
export function transform(inputData: JSONOutput.ProjectReflection) {
  const functions: NonNullable<TransformedDoc["functions"]> = [];
  const hooks: NonNullable<TransformedDoc["hooks"]> = [];
  const components: NonNullable<TransformedDoc["components"]> = [];
  const types: NonNullable<TransformedDoc["types"]> = [];
  const variables: NonNullable<TransformedDoc["variables"]> = [];
  const enums: NonNullable<TransformedDoc["enums"]> = [];
  const classes: NonNullable<TransformedDoc["classes"]> = [];

  // map childId to doc
  const childrenMap: Record<string, JSONOutput.DeclarationReflection> = {};

  function createChildrenMap(children: JSONOutput.DeclarationReflection[]) {
    children.forEach((child) => {
      childrenMap[child.id] = child;
    });
  }

  function collectChildren(group: JSONOutput.ReflectionGroup) {
    const mappedTitle = groupNameMap[group.title as keyof typeof groupNameMap];

    group.children?.map(async (childId) => {
      const childData = childrenMap[childId];
      if (!childData) {
        throw new Error(`Failed to resolve child id ${childId}`);
      }

      switch (mappedTitle) {
        case "functions": {
          if (isHook(childData.name)) {
            hooks.push(getFunctionDoc(childData));
          } else if (isComponentType(childData)) {
            components.push(getFunctionDoc(childData));
          } else {
            functions.push(getFunctionDoc(childData));
          }
          break;
        }

        case "types": {
          types.push(getInterfaceDoc(childData));
          break;
        }

        case "variables": {
          variables.push(getVariableDoc(childData));
          break;
        }

        case "classes": {
          classes.push(getClassDoc(childData));
          break;
        }

        case "enums": {
          enums.push(getEnumDoc(childData));
        }
      }
    });
  }

  if (
    inputData.groups &&
    inputData.groups.length === 1 &&
    inputData.groups[0] &&
    inputData.groups[0].title === "Modules"
  ) {
    const modules = inputData.groups[0].children?.map((moduleId) => {
      const moduleDoc = inputData.children?.find(
        (child) => child.id === moduleId,
      );

      if (!moduleDoc) {
        throw new Error(`Failed to resolve module id ${moduleId}`);
      }

      if (moduleDoc.children) {
        createChildrenMap(moduleDoc.children);
      }

      return moduleDoc;
    });

    modules?.forEach((moduleDoc) => {
      moduleDoc?.groups?.forEach((group) => {
        collectChildren(group);
      });
    });
  } else {
    if (inputData.children) {
      createChildrenMap(inputData.children);
    }

    inputData.groups?.forEach((group) => {
      collectChildren(group);
    });
  }

  const output: TransformedDoc = {
    meta: {
      typedocBetterJsonVersion: pkg.version,
    },
    functions: functions.length > 0 ? functions : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
    variables: variables.length > 0 ? variables : undefined,
    types: types.length > 0 ? types : undefined,
    components: components.length > 0 ? components : undefined,
    enums: enums.length > 0 ? enums : undefined,
    classes: classes.length > 0 ? classes : undefined,
  };

  return output;
}
