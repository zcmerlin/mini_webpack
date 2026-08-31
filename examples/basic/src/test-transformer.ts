import { resolve } from 'node:path';
import { buildModuleGraph } from '@mini-webpack/graph';
import { transformModule } from '@mini-webpack/transformer';

const entry = resolve(process.cwd(), 'examples/basic/src/transformer.test.js');

const graph = buildModuleGraph(
    entry
);

const module = graph.modules.get(entry)!;

const transformed = transformModule(
    module.source,
    module.path,
    graph
);

console.dir(transformed, {
    depth: null
});
