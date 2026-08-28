export interface Program {
    type: 'Program';
    body: Statement[];
}

export type Statement =
  | ImportDeclaration;

export interface ImportDeclaration {
    type: 'ImportDeclaration';
    source: string;
    specifiers: ImportSpecifier[];
}

export interface ImportSpecifier {
    type: 'ImportSpecifier';
    imported: string;
    local: string;
}