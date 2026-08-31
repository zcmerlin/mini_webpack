import type {
    Program,
    Statement,
    Expression,
    VariableDeclaration,
    FunctionDeclaration,
    BlockStatement,
    ReturnStatement,
    ExpressionStatement,
    AssignmentExpression
} from '@mini-webpack/types';

export function generate(program: Program): string {
    return program.body
        .map(generateStatement)
        .join('\n');
}

function generateStatement(node: Statement): string {
    switch (node.type) {
        case 'VariableDeclaration':
            return generateVariableDeclaration(node);

        case 'FunctionDeclaration':
            return generateFunctionDeclaration(node);

        case 'ReturnStatement':
            return generateReturnStatement(node);

        case 'ExpressionStatement':
            return generateExpressionStatement(node);

        default:
            throw new Error(
                `Unsupported statement type: ${node.type}`
            );
    }
}

function generateExpression(node: Expression): string {
    switch (node.type) {
        case 'Identifier':
            return node.name;

        case 'NumericLiteral':
            return String(node.value);

        case 'StringLiteral':
            return JSON.stringify(node.value);

        case 'CallExpression':
            return `${generateExpression(node.callee)}(${node.arguments
                .map(generateExpression)
                .join(', ')})`;

        case 'MemberExpression':
            return `${generateExpression(node.object)}.${node.property.name}`;

        case 'AssignmentExpression':
            return generateAssignmentExpression(node);

        default:
            throw new Error(
                `Unsupported expression type: ${(node as any).type}`
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

function generateFunctionDeclaration(
    node: FunctionDeclaration
): string {
    const params = node.params
        .map(param => param.name)
        .join(', ');

    return `function ${node.id.name}(${params}) ${generateBlockStatement(
        node.body
    )}`;
}

function generateBlockStatement(
    node: BlockStatement
): string {
    const body = node.body
        .map(generateStatement)
        .join('\n');

    return `{\n${body}\n}`;
}

function generateReturnStatement(
    node: ReturnStatement
): string {
    if (node.argument === null) {
        return 'return;';
    }

    return `return ${generateExpression(node.argument)};`;
}

function generateExpressionStatement(
    node: ExpressionStatement
): string {
    return `${generateExpression(node.expression)};`;
}

function generateAssignmentExpression(
    node: AssignmentExpression
): string {
    return `${generateExpression(node.left)} ${node.operator} ${generateExpression(
        node.right
    )}`;
}
