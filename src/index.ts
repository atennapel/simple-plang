import { showTerm } from './terms';
import { typecheck } from './typecheck';
import { showType } from './types';
import { parse } from './parser';

const term = parse('\\x y z. x');
console.log(showTerm(term));
const type = typecheck(term);
console.log(showType(type));
