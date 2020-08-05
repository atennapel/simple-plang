import { TMeta, Type, TName } from './types';
import { impossible } from './utils';

export type Ix = number;
export type Solution = Unsolved | Solved;
export type Unsolved = { tag: 'Unsolved', name: TName | null };
export const Unsolved = (name: TName | null): Unsolved => ({ tag: 'Unsolved', name });
export type Solved = { tag: 'Solved', name: TName | null, type: Type };
export const Solved = (name: TName | null, type: Type): Solved => ({ tag: 'Solved', name, type });

let metas: Solution[] = [];

export const metaReset = () => { metas = [] };

export const metaGet = (id: Ix): Solution => {
  const s = metas[id];
  if (typeof s === 'undefined') return impossible(`undefined meta ?${id} in metaGet`);
  return s;
};
export const metaSet = (id: Ix, type: Type): void => {
  const m = metaGet(id);
  if (m.tag === 'Solved') return impossible(`trying to solve meta ?${id} again`);
  metas[id] = Solved(m.name, type);
};

export const freshMetaId = (name: TName | null = null): Ix => {
  const id = metas.length;
  metas[id] = Unsolved(name);
  return id;
};
export const freshMeta = (name: TName | null = null) => TMeta(freshMetaId(name));
