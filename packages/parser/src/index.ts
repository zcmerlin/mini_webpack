import { parse as babelParse } from '@babel/parser';
import type {
    Program,
    Statement,
    FunctionDeclaration,
    BlockStatement,
    ReturnStatement,
    Expression
} from '@mini-webpack/types';

export function parse(source: string): Program {
    const ast = babelParse(source, {
        sourceType: 'module'
    });

    const body: Statement[] = [];

    for (const node of ast.program.body) {
        if (node.type === 'ImportDeclaration') {
            body.push({
                type: 'ImportDeclaration',
                source: node.source.value,
                specifiers: node.specifiers.map((specifier) => {
                    if (specifier.type !== 'ImportSpecifier') {
                        throw new Error(
                            `Unspported import type: ${specifier.type}`
                        );
                    }

                    return {
                        type: 'ImportSpecifier',
                        imported:
                            specifier.imported.type === 'Identifier'
                                ? specifier.imported.name
                                : specifier.imported.value,
                        local: specifier.local.name
                    };
                })
            })

            continue;
        }

        if (node.type === 'ExportNamedDeclaration' &&
            node.declaration?.type === 'FunctionDeclaration'
        ) {
            body.push(
                parseFunctionDeclaration(node.declaration)
            );

            continue;
        }

        throw new Error(
            `Unsupported node type: ${node.type}`
        );
    }

    return {
        type: 'Program',
        body
    };
}

function parseFunctionDeclaration(node: any): FunctionDeclaration {
    return {
        type: 'FunctionDeclaration',
        id: {
            type: 'Identifier',
            name: node.id.name
        },
        params: node.params.map((param: any) => {
            if (param.type !== 'Identifier') {
                throw new Error(
                    `Unsupported parameter type: ${param.type}`
                );
            }

            return {
                type: 'Identifier',
                name: param.name
            }
        }),
        body: parseBlockStatement(node.body)
    }
}

function parseBlockStatement(node: any): BlockStatement {
    const body: Statement[] = [];

    for (const statement of node.body) {
        if(statement.type === 'ReturnStatement') {
            body.push({
                type: 'ReturnStatement',
                argument: parseExpression(statement.argument)
            });

            continue;
        }

        throw new Error(
            `Unsupported statement type: ${statement.type}`
        );
    }

    return {
        type: 'BlockStatement',
        body
    };
}

function parseExpression(node: any): Expression | null {
    if (node === null) {
        return null;
    }

    if (node.type === 'StringLiteral') {
        return {
            type: 'StringLiteral',
            value: node.value
        };
    }

    if (node.type === 'Identifier') {
        return {
            type: 'Identifier',
            name: node.name
        }
    }

    throw new Error(
        `Unsupported expression type: ${node.type}`
    );
}
