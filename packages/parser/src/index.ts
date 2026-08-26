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
                source: node.source.value
            }))
    };
}
