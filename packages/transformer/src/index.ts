import { parse } from '@mini-webpack/parser';
import { buildModuleGraph, type ModuleGraph } from '@mini-webpack/graph';

export function transformModule(
    source: string,
    modulePath: string,
    graph: ModuleGraph
): string {
    const ast = parse(source);

    for (const node of ast.body) {
        if (node.type === 'ImportDeclaration') {
            console.log(`发现 import: ${node.source}`);

            for (const specifier of node.specifiers) {}
        }
    }

    console.log(ast);

    return source;
}

const graph = buildModuleGraph(
    '/learning/mini_webpack/examples/basic/src/index.js'
);

const module = graph.modules.get(
    '/learning/mini_webpack/examples/basic/src/index.js'
)!;

transformModule(module.source, module.path, graph);