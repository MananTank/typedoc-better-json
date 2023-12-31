import { EnumDoc, TypeInfo } from "../types";

export function getEnumSignature(doc: EnumDoc): TypeInfo {
  return {
    code: `enum ${doc.name} {
      ${doc.members?.map((member) => member.name).join(",\n")}}`,
    tokens: [],
  };
}
