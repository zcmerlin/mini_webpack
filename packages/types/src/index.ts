export interface Program {
    type: 'Program';
    body: Statement[];
}

export type Statement =
  | ImportDeclaration
  | VariableDeclaration
  | FunctionDeclaration
  | ReturnStatement
  | ExpressionStatement;
  
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

export interface FunctionDeclaration {
    type: 'FunctionDeclaration';
    id: Identifier;
    params: Identifier[];
    body: BlockStatement;
    exported: boolean;
}

export interface BlockStatement {
    type: 'BlockStatement';
    body: Statement[];
}

export interface ReturnStatement {
    type: 'ReturnStatement';
    argument: Expression | null;
}

export interface ExpressionStatement {
    type: 'ExpressionStatement';
    expression: Expression;
}

export interface Identifier {
    type: 'Identifier';
    name: string;
}

export interface StringLiteral {
    type: 'StringLiteral';
    value: string;
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

export interface AssignmentExpression {
    type: 'AssignmentExpression';
    operator: '=';
    left: Expression;
    right: Expression;
}

export type Expression = 
    | Identifier
    | NumericLiteral
    | StringLiteral
    | CallExpression
    | MemberExpression
    | AssignmentExpression;

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

