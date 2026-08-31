import { parse } from '@mini-webpack/parser';

const source = `
import { bar } from './bar.js';

export function foo() {
    return 'foo';
}

function test() {
    return 'test';
}
`;

console.dir(parse(source), {
    depth: null
});