import { AccessorDoc, TypeInfo } from "../types";

export function getAccessorSignature(doc: AccessorDoc): TypeInfo {
  return {
    code: `let ${doc.name}: ${doc.returns?.type?.code || "void"}`,
    tokens: doc.returns?.type?.tokens,
  };
}
