import { resolve } from 'node:path';
import { parse } from '@mini-webpack/parser';
import { buildModuleGraph, type ModuleGraph } from '@mini-webpack/graph';

export function transformModule(
    source: string,
    modulePath: string,
    graph: ModuleGraph
): string {
    const ast = parse(source);

    for (const node of ast.body) {
        if (node.type !== 'ImportDeclaration') {
            continue;
        }

        const resolvedPath = graph.modules
            .get(modulePath)!
            .dependencies
            .find(
                dependency => dependency.request === node.source
            )!
            .resolvedPath;

        const moduleId = graph.getModuleId(resolvedPath);

        console.log(({
            source: node.source,
            resolvedPath,
            moduleId,
            specifiers: node.specifiers
        }));
    }

    console.dir(ast, { depth: null, colors: true });

    return source;
}

const graph = buildModuleGraph(
    // '/Users/merlin/workspace/javascript/mini_webpack/examples/basic/src/index.js'
    resolve(process.cwd(), 'examples/basic/src/index.js')
);

const module = graph.modules.get(
    // '/Users/merlin/workspace/javascript/mini_webpack/examples/basic/src/index.js'
    resolve(process.cwd(), 'examples/basic/src/index.js')
)!;

transformModule(module.source, module.path, graph);