import type { Program } from '@mini-webpack/types';

import type { Dependency } from './index.ts';

export function analyzeDependencies(
    ast: Program,
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
