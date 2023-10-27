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
};

export type TypeParameter = {
  name: string;
  extendsType?: string;
};

export type FunctionParameter = {
  name: string;
  type?: string;
  summary?: Summary;
  flags?: Flags;
};

export type InterfaceDoc = {
  kind: "type";
  name: string;
  source?: string;
  summary?: Summary;
  type?: string;
  typeDeclaration?: TypeDeclarationDoc[];
};

export type VariableDoc = {
  kind: "variable";
  name: string;
  source?: string;
  summary?: Summary;
  type?: string;
  typeDeclaration?: VariableTypeDeclaration[];
  flags?: JSONOutput.ReflectionFlags;
};

export type VariableTypeDeclaration = TypeDeclarationDoc | FunctionDoc;

export type TypeDeclarationDoc = {
  name: string;
  type: string;
  summary?: Summary;
};

export type EnumDoc = {
  kind: "enum";
  name: string;
  source?: string;
  summary?: Summary;
  members: Array<{
    name: string;
    value: string;
    summary?: Summary;
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
  typeParameters?: TypeParameter[];
};
