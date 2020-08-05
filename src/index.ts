import { Abs, App, Var, showTerm } from './terms';
import { typecheck } from './typecheck';
import { showType } from './types';

const term = Abs('x', Abs('y', App(Var('x'), Var('y'))));
console.log(showTerm(term));
const type = typecheck(term);
console.log(showType(type));
