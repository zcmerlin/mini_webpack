export interface Program {
    type: 'Program';
    body: Statement[];
}
export type Statement = ImportDeclaration;
export interface ImportDeclaration {
    type: 'ImportDeclaration';
    source: string;
}
