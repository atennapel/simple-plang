import { Term, Name, showTerm, Def, showDef } from './terms';
import { Type, prune, TFun, showType, TApp, TVar, TMeta } from './types';
import { List, lookup, Nil, extend, listToString } from './list';
import { terr } from './utils';
import { freshMeta, Ix, metaGet, metaSet } from './tmetas';
import { unify } from './unify';
import { globalGet, globalSet } from './globalenv';
import { log, config } from './config';

export type Env = List<[Name, Type]>;

const infer = (env: Env, term: Term): Type => {
  log(() => `infer ${showTerm(term)}${config.showEnvs ? ` in ${listToString(env, ([x, t]) => `${x} : ${showType(t)}`)}` : ''}`);
  if (term.tag === 'Var') {
    const ty = lookup(env, term.name);
    if (ty) return instantiate(ty);
    const gty = globalGet(term.name);
    if (gty) return instantiate(gty.type);
    return terr(`undefined var ${term.name}`);
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

const instantiate = (type: Type, map: { [key: string]: TMeta } = {}): Type => {
  log(() => `instantiate: ${showType(type)}`);
  if (type.tag === 'TVar') return map[type.name] || (map[type.name] = freshMeta(type.name));
  if (type.tag === 'TApp') return TApp(instantiate(type.left, map), instantiate(type.right, map));
  return type;
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
  log(() => `generalize: ${showType(type)}`);
  const ms = tmetas(type);
  let char = 97;
  for (let i = 0, l = ms.length; i < l; i++) {
    const ix = ms[i];
    const m = metaGet(ix);
    if (m.tag === 'Unsolved') {
      // TODO: do not ignore name
      const genname = String.fromCharCode(char++);
      // handle char overflow
      metaSet(ix, TVar(genname));
    }
  }
  return type;
};

export const typecheck = (term: Term, env: Env = Nil): Type =>
  prune(generalize(prune(infer(env, term))));

export const typecheckDefs = (ds: Def[], allowRedefinition: boolean = false): Name[] => {
  log(() => `typecheckDefs ${ds.map(x => x.name).join(' ')}`);
  const xs: Name[] = [];
  if (!allowRedefinition) {
    for (let i = 0; i < ds.length; i++) {
      const d = ds[i];
      if (d.tag === 'DDef' && globalGet(d.name))
        return terr(`cannot redefine global ${d.name}`);
    }
  }
  for (let i = 0; i < ds.length; i++) {
    const d = ds[i];
    log(() => `typecheckDefs ${showDef(d)}`);
    if (d.tag === 'DDef') {
      try {
        const ty = typecheck(d.value);
        const tm = d.value;
        log(() => `set ${d.name} = ${showTerm(tm)}`);
        globalSet(d.name, tm, ty);
        const i = xs.indexOf(d.name);
        if (i >= 0) xs.splice(i, 1);
        xs.push(d.name);
      } catch (err) {
        err.message = `type error in def ${d.name}: ${err.message}`;
        throw err;
      }
    }
  }
  return xs;
};
