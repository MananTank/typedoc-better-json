import { RootContent } from "mdast";
import type { JSONOutput } from "typedoc";

export type SummaryNode = RootContent;
export type Summary = SummaryNode[];

export type BlockTag = Omit<JSONOutput.CommentTag, "content"> & {
  summary?: Summary;
};

export type Flags = JSONOutput.ReflectionFlags;

export type TransformedDoc = {
  meta: {
    typedocBetterJsonVersion: string;
  };
  functions?: FunctionDoc[];
  hooks?: FunctionDoc[];
  components?: FunctionDoc[];
  types?: InterfaceDoc[];
  variables?: VariableDoc[];
  enums?: EnumDoc[];
  classes?: ClassDoc[];
};

export type TokenInfo = {
  name: string;
  package?: string;
};

export type TypeInfo = {
  code: string;
  tokens?: TokenInfo[];
};

export type SomeDoc =
  | FunctionDoc
  | InterfaceDoc
  | VariableDoc
  | EnumDoc
  | ClassDoc;

export type SubTypeDeclarationDoc = {
  kind: "subtype";
  name: string;
  type: TypeInfo;
  summary?: Summary;
  blockTags?: BlockTag[];
};

export type TypeDeclarationDoc = SubTypeDeclarationDoc | FunctionDoc;

export type TypeParameter = {
  name: string;
  extendsType?: TypeInfo;
  defaultType?: TypeInfo;
};

export type FunctionDoc = {
  kind: "function";
  name: string;
  source?: string;
  signatures?: FunctionSignature[];
};

export type AccessorDoc = {
  kind: "accessor";
  name: string;
  source?: string;
  summary?: Summary;
  blockTags?: BlockTag[];
  returns?: {
    type?: TypeInfo;
    summary?: Summary;
  };
  flags?: Flags;
};

export type FunctionSignature = {
  summary?: Summary;
  parameters?: FunctionParameter[];
  typeParameters?: TypeParameter[];
  returns?: {
    type?: TypeInfo;
    summary?: Summary;
  };
  blockTags?: BlockTag[];
  flags?: Flags;
};

export type FunctionParameter = {
  name: string;
  type?: TypeInfo;
  summary?: Summary;
  blockTags?: BlockTag[];
  flags?: Flags;
};

export type InterfaceDoc = {
  kind: "type";
  name: string;
  source?: string;
  summary?: Summary;
  blockTags?: BlockTag[];
  type?: TypeInfo;
  typeDeclaration?: TypeDeclarationDoc[];
  typeParameters?: TypeParameter[];
  extends?: TypeInfo[];
  implements?: TypeInfo[];
};

export type VariableDoc = {
  kind: "variable";
  name: string;
  source?: string;
  summary?: Summary;
  blockTags?: BlockTag[];
  typeDeclaration?: TypeDeclarationDoc[];
  flags?: JSONOutput.ReflectionFlags;
  type?: TypeInfo;
};

export type EnumDoc = {
  kind: "enum";
  name: string;
  source?: string;
  summary?: Summary;
  blockTags?: BlockTag[];
  members: Array<{
    name: string;
    value: TypeInfo;
    summary?: Summary;
    blockTags?: BlockTag[];
  }>;
};

export type ClassDoc = {
  kind: "class";
  name: string;
  source?: string;
  constructor: FunctionDoc;
  properties?: VariableDoc[];
  methods?: FunctionDoc[];
  accessors?: AccessorDoc[];
  summary?: Summary;
  blockTags?: BlockTag[];
  implements?: TypeInfo[];
  extends?: TypeInfo[];
  typeParameters?: TypeParameter[];
};
