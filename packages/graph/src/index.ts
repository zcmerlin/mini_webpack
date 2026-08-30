import fs from 'node:fs';
import { createModule, type Module } from '@mini-webpack/module';

export interface ModuleGraph {
    modules: Map<string, Module>;
    edges: Map<string, string[]>;
    getModuleId(path: string): number;
}

export function buildModuleGraph(
    entry: string
): ModuleGraph {
    const modules = new Map<string, Module>();
    const edges = new Map<string, string[]>();

    const queue: string[] = [entry];

    let nextId = 0;

    while (queue.length > 0) {
        const modulePath = queue.shift()!;

        if (modules.has(modulePath)) {
            continue;
        }

        const source = fs.readFileSync(modulePath, 'utf-8');

        const module = createModule(
            nextId++,
            modulePath,
            source
        );

        modules.set(modulePath, module);

        edges.set(
            modulePath,
            module.dependencies.map(
                dependency => dependency.resolvedPath
            )
        );

        for (const dependency of module.dependencies) {
            queue.push(dependency.resolvedPath);
        }
    }

    function getModuleId(path: string): number {
        const module = modules.get(path);

        if (!module) {
            throw new Error(`Module not found: ${path}`);
        }

        return module.id;
    }

    return {
        modules,
        edges,
        getModuleId
    };
}

export function detectCycles(graph: ModuleGraph): string[][] {
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const path: string[] = [];
    const cycles: string[][] = [];

    function dfs(modulePath: string) {
        if (visiting.has(modulePath)) {
            const start = path.indexOf(modulePath);

            if (start !== -1) {
                cycles.push([
                    ...path.slice(start),
                    modulePath
                ]);
            }

            return;
        }

        if (visited.has(modulePath)) {
            return;
        }

        visiting.add(modulePath);
        path.push(modulePath);

        const dependencies = graph.edges.get(modulePath) ?? [];

        for (const dependencyPath of dependencies) {
            dfs(dependencyPath);
        }

        path.pop();
        visiting.delete(modulePath);
        visited.add(modulePath);
    }

    for (const modulePath of graph.modules.keys()) {
        dfs(modulePath);
    }

    return cycles;
}

// const graph = buildModuleGraph(
//     "/learning/mini_webpack/examples/basic/src/index.js"
// );

// console.dir(graph, { depth: null, colors: true });
// console.dir(graph.modules, { depth: null, colors: true });
// console.dir(graph.edges, { depth: null, colors: true });

// const cycles = detectCycles(graph);

// console.log("cycles:", cycles);
// console.log(
//   graph.getModuleId(
//     "/learning/mini_webpack/examples/basic/src/bar.js",
//   ),
// );
