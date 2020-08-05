import { Type, showType, containsTMeta, prune } from './types';
import { terr } from './utils';
import { Ix, metaSet, metaGet } from './tmetas';

const bindTMeta = (ix: Ix, type: Type): void => {
  if (type.tag === 'TMeta' && type.ix === ix) return;
  const m = metaGet(ix);
  if (m.tag === 'Solved') return unify(m.type, type);
  if (containsTMeta(ix, type)) return terr(`occurs check failed: ?${ix} in ${showType(prune(type))}`);
  metaSet(ix, type);
};

export const unify = (left: Type, right: Type): void => {
  if (left === right) return;
  if (left.tag === 'TVar' && right.tag === 'TVar' && left.name === right.name) return;
  if (left.tag === 'TCon' && right.tag === 'TCon' && left.name === right.name) return;
  if (left.tag === 'TMeta') return bindTMeta(left.ix, right);
  if (right.tag === 'TMeta') return bindTMeta(right.ix, left);
  if (left.tag === 'TApp' && right.tag === 'TApp') {
    unify(left.left, right.left);
    unify(left.right, right.right);
    return;
  }
  return terr(`failed to unify: ${showType(prune(left))} ~ ${showType(prune(right))}`);
};
