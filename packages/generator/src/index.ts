import type { Program, Statement, Expression, VariableDeclaration } from '@mini-webpack/types';

export function generate(program: Program): string {
    return program.body
        .map(generateStatement)
        .join('\n');
}

function generateStatement(node: Statement): string {
    switch (node.type) {
        case 'VariableDeclaration':
            return generateVariableDeclaration(node);
        default:
            throw new Error(
                `Unsupported statement type`
            );
    }
}

function generateExpression(node: Expression): string {
    switch (node.type) {
        case 'Identifier':
            return node.name;

        case 'NumericLiteral':
            return String(node.value);

        case 'CallExpression':
            return `${generateExpression(node.callee)}(${node.arguments.map(generateExpression).join(',')})`;

        case 'MemberExpression':
            return `${generateExpression(node.object)}.${node.property.name}`;

        default:
            throw new Error(
                `Unsupported expression type`
            );
    }
}

function generateVariableDeclaration(node: VariableDeclaration): string {
    const declarations = node.declarations
        .map(declaration => {
            return `${declaration.id.name} = ${generateExpression(declaration.init)}`;
        })
        .join(',');
    
    return `const ${declarations};`;
}
