import { resolve } from 'node:path';
import { buildModuleGraph } from '@mini-webpack/graph';
import { transformModule } from '@mini-webpack/transformer';
import { generate } from '@mini-webpack/generator';

const entry = resolve(process.cwd(), 'examples/basic/src/transformer.test.js');

const graph = buildModuleGraph(entry);

const module = graph.modules.get(entry)!;

const ast = transformModule(
    module.source,
    module.path,
    graph
);

console.dir(generate(ast), {
    depth: null
});
