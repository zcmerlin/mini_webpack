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

export interface Identifier {
    type: 'Identifier';
    name: string;
}

export interface NumericLiteral {
    type: 'NumericLiteral';
    value: number;
}

export interface CallExpression {
    type: 'CallExpression';
    callee: Expression;
    arguments: Expression[];
}

export interface MemberExpression {
    type: 'MemberExpression';
    object: Expression;
    property: Identifier;
}

export type Expression = 
    | Identifier
    | NumericLiteral
    | CallExpression
    | MemberExpression;

export interface VariableDeclarator {
    type: 'VariableDeclarator';
    id: Identifier;
    init: Expression;
}

export interface VariableDeclaration {
    type: 'VariableDeclaration';
    kind: 'const';
    declarations: VariableDeclarator[];
}
