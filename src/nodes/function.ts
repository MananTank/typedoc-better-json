import type { JSONOutput } from "typedoc";
import {
  FunctionDoc,
  FunctionSignature,
  FunctionParameter,
  TypeParameter,
} from "../types";
import { getReadableType } from "../utils/getReadableType";
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
  };
}

function getFunctionSignatureDoc(signature: JSONOutput.SignatureReflection) {
  const output: FunctionSignature = {
    flags:
      Object.keys(signature.flags).length > 0 ? signature.flags : undefined,
    summary: getSummaryDoc(signature.comment?.summary),
    parameters: signature.parameters?.map((param) => {
      const arg: FunctionParameter = {
        name: param.name,
        type: param.type ? getReadableType(param.type) : undefined,
        summary: getSummaryDoc(param.comment?.summary),
        flags: Object.keys(param.flags).length > 0 ? param.flags : undefined,
        blockTags: param.comment?.blockTags?.map(getBlockTag),
      };
      return arg;
    }),
    returns: {
      type: signature.type ? getReadableType(signature.type) : undefined,
      summary: getSummaryDoc(
        signature.comment?.blockTags?.find((tag) => tag.tag === "@returns")
          ?.content,
      ),
    },
    typeParameters: signature.typeParameter?.map((param) => {
      const typeParam: TypeParameter = {
        name: param.name,
        extendsType: param.type ? getReadableType(param.type) : undefined,
      };
      return typeParam;
    }),
    blockTags: signature.comment?.blockTags
      ?.filter((w) => w.tag !== "@returns")
      .map(getBlockTag),
  };

  return output;
}
