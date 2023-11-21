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

export type SomeDoc =
  | FunctionDoc
  | InterfaceDoc
  | VariableDoc
  | EnumDoc
  | ClassDoc;

export type SubTypeDeclarationDoc = {
  kind: "subtype";
  name: string;
  type: string;
  summary?: Summary;
  blockTags?: BlockTag[];
};

export type TypeDeclarationDoc = SubTypeDeclarationDoc | FunctionDoc;

export type TypeParameter = {
  name: string;
  extendsType?: string;
  defaultType?: string;
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
    type?: string;
    summary?: Summary;
  };
  flags?: Flags;
};

export type FunctionSignature = {
  summary?: Summary;
  parameters?: FunctionParameter[];
  typeParameters?: TypeParameter[];
  returns?: {
    type?: string;
    summary?: Summary;
  };
  blockTags?: BlockTag[];
  flags?: Flags;
};

export type FunctionParameter = {
  name: string;
  type?: string;
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
  type?: string;
  typeDeclaration?: TypeDeclarationDoc[];
  typeParameters?: TypeParameter[];
};

export type VariableDoc = {
  kind: "variable";
  name: string;
  source?: string;
  summary?: Summary;
  blockTags?: BlockTag[];
  typeDeclaration?: TypeDeclarationDoc[];
  flags?: JSONOutput.ReflectionFlags;
  type?: string;
};

export type EnumDoc = {
  kind: "enum";
  name: string;
  source?: string;
  summary?: Summary;
  blockTags?: BlockTag[];
  members: Array<{
    name: string;
    value: string;
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
  implements?: string[];
  extends?: string[];
  typeParameters?: TypeParameter[];
};
