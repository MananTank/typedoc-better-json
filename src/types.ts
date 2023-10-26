import type { JSONOutput } from "typedoc";

export type TransformedDoc = {
  functions?: FunctionDoc[];
  hooks?: FunctionDoc[];
  components?: FunctionDoc[];
  types?: InterfaceDoc[];
  variables?: VariableDoc[];
  enums?: EnumDoc[];
  classes?: ClassDoc[];
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
  summary?: JSONOutput.CommentDisplayPart[];
  blockTags?: JSONOutput.CommentTag[];
  returns?: {
    type?: string;
    summary?: JSONOutput.CommentDisplayPart[];
  };
  flags?: JSONOutput.ReflectionFlags;
};

export type FunctionSignature = {
  summary?: JSONOutput.CommentDisplayPart[];
  parameters?: FunctionParameter[];
  typeParameters?: TypeParameter[];
  returns?: {
    type?: string;
    summary?: JSONOutput.CommentDisplayPart[];
  };
  blockTags?: JSONOutput.CommentTag[];
};

export type TypeParameter = {
  name: string;
  extendsType?: string;
};

export type FunctionParameter = {
  name: string;
  type?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  flags?: JSONOutput.ReflectionFlags;
};

export type InterfaceDoc = {
  kind: "type";
  name: string;
  source?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  type?: string;
  typeDeclaration?: TypeDeclarationDoc[];
};

export type VariableDoc = {
  kind: "variable";
  name: string;
  source?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  type?: string;
  typeDeclaration?: VariableTypeDeclaration[];
  flags?: JSONOutput.ReflectionFlags;
};

export type VariableTypeDeclaration = TypeDeclarationDoc | FunctionDoc;

export type TypeDeclarationDoc = {
  name: string;
  type: string;
  summary?: JSONOutput.CommentDisplayPart[];
};

export type EnumDoc = {
  kind: "enum";
  name: string;
  source?: string;
  summary?: JSONOutput.CommentDisplayPart[];
  members: Array<{
    name: string;
    value: string;
    summary?: JSONOutput.CommentDisplayPart[];
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
  summary?: JSONOutput.CommentDisplayPart[];
  blockTags?: JSONOutput.CommentTag[];
  implements?: string[];
};
