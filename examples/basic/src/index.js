import { foo } from "./foo.js";
import { bar } from "./bar.js";
import { a } from './cycle-a.js';

console.log(foo());
console.log(bar());
console.log(a());
