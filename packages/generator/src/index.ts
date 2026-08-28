import { buildModuleGraph, type ModuleGraph } from '@mini-webpack/graph';

export function generateModules(graph: ModuleGraph): string {
    const modules: string[] = [];

    for (const module of graph.modules.values()) {
        modules.push(`
            ${module.id}: function(module, exports) {
                ${module.source}
            }
        `);
    }

    return `{${modules.join(",")}}`;
}

const graph = buildModuleGraph(
    "/learning/mini_webpack/examples/basic/src/index.js"
)

console.log(generateModules(graph));