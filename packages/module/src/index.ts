import path from "node:path";
import { parse } from "@mini-webpack/parser";
import { resolve } from "@mini-webpack/resolver";

export interface Module {
    id: number;
    path: string;
    source: string;
    dependencies: Dependency[];
}

export interface Dependency {
    request: string;
    resolvedPath: string;
}

export function createModule(
    id: number,
    modulePath: string,
    source: string
): Module {
    const ast = parse(source);

    const dependencies = analyzeDependencies(ast);

    for (const dependency of dependencies) {
        dependency.resolvedPath = resolve(
            dependency.request,
            path.dirname(modulePath)
        );
    }

    return {
        id,
        path: modulePath,
        source,
        dependencies
    }
}

function analyzeDependencies(
    ast: ReturnType<typeof parse>
): Dependency[] {
    const dependencies: Dependency[] = [];

    for (const node of ast.body) {
        if (node.type !== 'ImportDeclaration') {
            continue;
        }

        dependencies.push({
            request: node.source,
            resolvedPath: '',
        });
    }

    return dependencies;
}
