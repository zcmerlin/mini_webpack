import { Statement, Program } from '@mini-webpack/types';
import { parse } from '@mini-webpack/parser';
import { type ModuleGraph } from '@mini-webpack/graph';

export function transformModule(
    source: string,
    modulePath: string,
    graph: ModuleGraph
): Program {
    const ast = parse(source);
    const body: Statement[] = [];

    for (const node of ast.body) {
        if (node.type === 'ImportDeclaration') {

            const module = graph.modules.get(modulePath)!;
            const dependency = module.dependencies.find(
                dependency => dependency.request === node.source
            );

            if (!dependency) {
                throw new Error(
                    `Dependency not found for module ${modulePath}, source: ${node.source}`
                )
            }

            const moduleId = graph.getModuleId(dependency.resolvedPath);

            for (const specifier of node.specifiers) {
                body.push({
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: specifier.local
                            },
                            init: {
                                type: 'MemberExpression',
                                object: {
                                    type: 'CallExpression',
                                    callee: {
                                        type: 'Identifier',
                                        name: '__require'
                                    },
                                    arguments: [
                                        {
                                            type: 'NumericLiteral',
                                            value: moduleId
                                        }
                                    ]
                                },
                                property: {
                                    type: 'Identifier',
                                    name: specifier.imported
                                }
                            }
                            
                        }
                    ]
                })
            }

            continue;
        }

        if (node.type === 'FunctionDeclaration') {
            body.push({
                ...node,
                exported: false
            });

            if (node.exported) {
                body.push({
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'MemberExpression',
                            object: {
                                type: 'Identifier',
                                name: '__exports'
                            },
                            property: {
                                type: 'Identifier',
                                name: node.id.name
                            }
                        },
                        right: {
                            type: 'Identifier',
                            name: node.id.name
                        }
                    }
                })
            }

            continue;
        }

        body.push(node);
    }

    return {
        type: 'Program',
        body
    };
}
