import { parse as babelParse } from '@babel/parser';
import type { Program } from '@mini-webpack/types';

export function parse(source: string): Program {
    const ast = babelParse(source, {
        sourceType: 'module'
    });

    return {
        type: 'Program',
        body: ast.program.body
            .filter((node) => node.type === 'ImportDeclaration')
            .map((node) => ({
                type: 'ImportDeclaration',
                source: node.source.value,
                specifiers: node.specifiers.map((specifier) => {
                    if (specifier.type !== 'ImportSpecifier') {
                        throw new Error(`Unsupported import type: ${specifier.type}`);
                    }
                    return ({
                        type: 'ImportSpecifier',
                        imported: specifier.imported.type === 'Identifier'
                            ? specifier.imported.name
                            : specifier.imported.value,
                        local: specifier.local.name
                    })
                }
                )
            }))
    };
}

// const source = `
// import { foo } from './foo.js';
// import { bar as baz } from './bar.js';

// console.log(foo());
// `;

// console.dir(parse(source), { depth: null, colors: true });