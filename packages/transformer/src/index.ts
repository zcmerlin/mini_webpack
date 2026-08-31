import { resolve } from 'node:path';
import { Statement, Program } from '@mini-webpack/types';
import { parse } from '@mini-webpack/parser';
import { buildModuleGraph, type ModuleGraph } from '@mini-webpack/graph';

export function transformModule(
    source: string,
    modulePath: string,
    graph: ModuleGraph
): Program {
    const ast = parse(source);
    const body: Statement[] = [];

    for (const node of ast.body) {
        if (node.type !== 'ImportDeclaration') {
            body.push(node);
            continue;
        }

        const module = graph.modules.get(modulePath)!;
        const dependency = module.dependencies.find(
            dependency => dependency.request === node.source
        );

        if (!dependency) {
            throw new Error(
                `Dependency not found for module: ${modulePath}, source: ${node.source}`
            );
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
    }

    return {
        type: 'Program',
        body
    };
}

// const graph = buildModuleGraph(
//     // '/Users/merlin/workspace/javascript/mini_webpack/examples/basic/src/index.js'
//     resolve(process.cwd(), 'examples/basic/src/index.js')
// );

// const module = graph.modules.get(
//     // '/Users/merlin/workspace/javascript/mini_webpack/examples/basic/src/index.js'
//     resolve(process.cwd(), 'examples/basic/src/index.js')
// )!;

// transformModule(module.source, module.path, graph);