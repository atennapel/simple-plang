import { Ix, metaGet } from './tmetas';

export type TName = string;

export type Type = TVar | TCon | TApp | TMeta;

export type TVar = { tag: 'TVar', name: TName };
export const TVar = (name: TName): TVar => ({ tag: 'TVar', name });
export type TCon = { tag: 'TCon', name: TName };
export const TCon = (name: TName): TCon => ({ tag: 'TCon', name });
export type TApp = { tag: 'TApp', left: Type, right: Type };
export const TApp = (left: Type, right: Type): TApp => ({ tag: 'TApp', left, right });
export type TMeta = { tag: 'TMeta', ix: Ix };
export const TMeta = (ix: Ix): TMeta => ({ tag: 'TMeta', ix });

export const TFunCon = TCon('(->)');
export type TFun = { tag: 'TApp', left: { tag: 'TApp', left: TCon, right: Type }, right: Type };
export const TFun = (left: Type, right: Type): TFun => TApp(TApp(TFunCon, left), right) as TFun;
export const isTFun = (type: Type): type is TFun => type.tag === 'TApp' && type.left.tag === 'TApp' && type.left.left === TFunCon;
export const TFunL = (type: TFun): Type => type.left.right;
export const TFunR = (type: TFun): Type => type.right;
export const matchTFun = (type: Type): [Type, Type] | null => isTFun(type) ? [TFunL(type), TFunR(type)] : null;

export const showTypeS = (t: Type): string => {
  if (t.tag === 'TVar') return t.name;
  if (t.tag === 'TCon') return t.name;
  if (t.tag === 'TApp') {
    const tfun = matchTFun(t);
    if (!tfun) return `(${showTypeS(t.left)} ${showTypeS(t.right)})`;
    return `(${tfun[0]} -> ${tfun[1]})`;
  }
  if (t.tag === 'TMeta') return `?${t.ix}`;
  return t;
};

export const flattenTApp = (t: Type): Type[] => {
  const r: Type[] = [];
  while (t.tag === 'TApp') {
    r.push(t.right);
    t = t.left;
  }
  r.push(t);
  return r.reverse();
};
export const flattenTFun = (t: Type): Type[] => {
  const r: Type[] = [];
  while (isTFun(t)) {
    r.push(TFunL(t));
    t = TFunR(t);
  }
  r.push(t);
  return r;
};

export const showTypeP = (b: boolean, t: Type): string =>
  b ? `(${showType(t)})` : showType(t);
export const showType = (t: Type): string => {
  if (t.tag === 'TVar') return t.name;
  if (t.tag === 'TCon') return t.name;
  if (t.tag === 'TMeta') return `?${t.ix}`;
  if (isTFun(t)) {
    const as = flattenTFun(t);
    return as.map(t => showTypeP(isTFun(t), t)).join(' -> ');
  }
  if (t.tag === 'TApp') {
    const as = flattenTApp(t);
    return `${as.map(t => showTypeP(t.tag === 'TApp', t)).join(' ')}`;
  }
  return t;
};

export const containsTMeta = (ix: Ix, type: Type): boolean => {
  if (type.tag === 'TMeta') {
    if (type.ix === ix) return true;
    const m = metaGet(ix);
    if (m.tag === 'Solved') return containsTMeta(ix, m.type);
    return false;
  }
  if (type.tag === 'TApp') return containsTMeta(ix, type.left) || containsTMeta(ix, type.right);
  return false;
};

export const prune = (type: Type): Type => {
  if (type.tag === 'TMeta') {
    const m = metaGet(type.ix);
    return m.tag === 'Solved' ? prune(m.type) : type;
  }
  if (type.tag === 'TApp') return TApp(prune(type.left), prune(type.right));
  return type;
};
