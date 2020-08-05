import { Term, Name, showTerm } from './terms';
import { Type, prune, TFun, showType, TApp, TVar } from './types';
import { List, lookup, Nil, extend } from './list';
import { terr } from './utils';
import { freshMeta, Ix, metaGet, metaSet } from './tmetas';
import { unify } from './unify';

export type Env = List<[Name, Type]>;

const instantiate = (type: Type): Type => {
  if (type.tag === 'TVar') return freshMeta(type.name);
  if (type.tag === 'TApp') return TApp(instantiate(type.left), instantiate(type.right));
  return type;
};

const infer = (env: Env, term: Term): Type => {
  if (term.tag === 'Var') {
    const ty = lookup(env, term.name);
    return ty ? instantiate(ty) : terr(`undefined var ${term.name}`);
  }
  if (term.tag === 'Abs') {
    const ty = freshMeta(term.name);
    const rty = infer(extend(term.name, ty, env), term.body);
    return TFun(ty, rty);
  }
  if (term.tag === 'App') {
    const fty = infer(env, term.left);
    const aty = infer(env, term.right);
    const rty = freshMeta('r');
    try {
      unify(TFun(aty, rty), fty);
      return rty;
    } catch (e) {
      if (e instanceof TypeError)
        return terr(`failed to typecheck ${showTerm(term)}: failed to unify ${showType(prune(TFun(aty, rty)))} ~ ${showType(prune(fty))}: ${e}`);
      throw e;
    }
  }
  if (term.tag === 'Let') {
    const ty = infer(env, term.val);
    return infer(extend(term.name, ty, env), term.body);
  }
  return terr(`unable to infer: ${showTerm(term)}`);
};

const tmetas = (type: Type, arr: Ix[] = []): Ix[] => {
  if (type.tag === 'TMeta') {
    const m = metaGet(type.ix);
    if (m.tag === 'Solved') return tmetas(m.type, arr);
    arr.push(type.ix);
    return arr;
  }
  if (type.tag === 'TApp') {
    tmetas(type.left, arr);
    tmetas(type.right, arr);
    return arr;    
  }
  return arr;
};
const generalize = (type: Type): Type => {
  const ms = tmetas(type);
  for (let i = 0, l = ms.length; i < l; i++) {
    const ix = ms[i];
    const m = metaGet(ix);
    if (m.tag === 'Unsolved') {
      const name = m.name;
      const genname = name || 't';
      metaSet(ix, TVar(genname));
    }
  }
  return type;
};

export const typecheck = (term: Term, env: Env = Nil) =>
  prune(generalize(prune(infer(env, term))));
