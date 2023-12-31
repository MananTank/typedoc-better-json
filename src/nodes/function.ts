import type { JSONOutput } from "typedoc";
import {
  FunctionDoc,
  FunctionSignature,
  FunctionParameter,
  TypeParameter,
} from "../types";
import { getTypeInfo } from "../utils/getReadableType";
import { getSummaryDoc } from "./summary";
import { getBlockTag } from "./blockTag";

export function getFunctionDoc(
  data: JSONOutput.DeclarationReflection,
): FunctionDoc {
  return {
    kind: "function",
    name: data.name,
    signatures: data.signatures?.map(getFunctionSignatureDoc),
    source: data.sources?.[0]?.url,
    flags: Object.keys(data.flags).length > 0 ? data.flags : undefined,
  };
}

function getFunctionSignatureDoc(signature: JSONOutput.SignatureReflection) {
  const output: FunctionSignature = {
    flags:
      Object.keys(signature.flags).length > 0 ? signature.flags : undefined,
    summary: getSummaryDoc(signature.comment?.summary),
    parameters: signature.parameters
      ? getFunctionParametersDoc(signature.parameters)
      : undefined,
    returns: {
      type: signature.type ? getTypeInfo(signature.type) : undefined,
      summary: getSummaryDoc(
        signature.comment?.blockTags?.find((tag) => tag.tag === "@returns")
          ?.content,
      ),
    },
    typeParameters: signature.typeParameter?.map((param) => {
      const typeParam: TypeParameter = {
        name: param.name,
        extendsType: param.type ? getTypeInfo(param.type) : undefined,
        defaultType: param.default ? getTypeInfo(param.default) : undefined,
      };
      return typeParam;
    }),
    inheritedFrom: signature.inheritedFrom
      ? {
          name: signature.inheritedFrom.name,
        }
      : undefined,
    blockTags: signature.comment?.blockTags
      ?.filter((w) => w.tag !== "@returns")
      .map(getBlockTag),
  };

  return output;
}

export function getFunctionParametersDoc(
  parameters: JSONOutput.ParameterReflection[],
): FunctionParameter[] {
  // convert the (...args: [x: Foo, y: Bar]) params to a list of params
  if (parameters.length === 1 && parameters[0] && parameters[0].flags.isRest) {
    const type = parameters[0] && parameters[0].type;
    if (type?.type === "tuple" && type.elements) {
      const output: FunctionParameter[] = [];

      type.elements.forEach((member) => {
        if (member.type === "namedTupleMember") {
          const typeInfo = getTypeInfo(member.element);
          output.push({
            name: member.name,
            type: typeInfo,
          });
        }
      });

      return output;
    }
  }

  return parameters.map((param) => {
    const arg: FunctionParameter = {
      name: param.name,
      type: param.type ? getTypeInfo(param.type) : undefined,
      summary: getSummaryDoc(param.comment?.summary),
      flags: Object.keys(param.flags).length > 0 ? param.flags : undefined,
      blockTags: param.comment?.blockTags?.map(getBlockTag),
    };
    return arg;
  });
}
