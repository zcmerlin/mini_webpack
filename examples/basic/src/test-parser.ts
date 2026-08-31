import { parse } from '@mini-webpack/parser';

const source = `
import { bar } from './bar.js';
export function foo() {
  return 'foo';
}
`;

console.dir(parse(source), {
    depth: null
});