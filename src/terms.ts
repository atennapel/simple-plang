export type Name = string;

export type Term = Var | App | Abs | Let;

export type Var = { tag: 'Var', name: Name };
export const Var = (name: Name): Var => ({ tag: 'Var', name });
export type App = { tag: 'App', left: Term, right: Term };
export const App = (left: Term, right: Term): App => ({ tag: 'App', left, right });
export type Abs = { tag: 'Abs', name: Name, body: Term };
export const Abs = (name: Name, body: Term): Abs => ({ tag: 'Abs', name, body });
export type Let = { tag: 'Let', name: Name, val: Term, body: Term };
export const Let = (name: Name, val: Term, body: Term): Let => ({ tag: 'Let', name, val, body });

export const showTermS = (t: Term): string => {
  if (t.tag === 'Var') return t.name;
  if (t.tag === 'App') return `(${showTermS(t.left)} ${showTermS(t.right)})`;
  if (t.tag === 'Abs')
    return `(\\${t.name}. ${showTermS(t.body)})`;
  if (t.tag === 'Let') return `(let ${t.name} = ${showTermS(t.val)} in ${showTermS(t.body)})`;
  return t;
};

export const flattenApp = (t: Term): [Term, Term[]] => {
  const r: Term[] = [];
  while (t.tag === 'App') {
    r.push(t.right);
    t = t.left;
  }
  return [t, r.reverse()];
};
export const flattenAbs = (t: Term): [Name[], Term] => {
  const r: Name[] = [];
  while (t.tag === 'Abs') {
    r.push(t.name);
    t = t.body;
  }
  return [r, t];
};

export const showTermP = (b: boolean, t: Term): string =>
  b ? `(${showTerm(t)})` : showTerm(t);
export const showTerm = (t: Term): string => {
  if (t.tag === 'Var') return t.name;
  if (t.tag === 'App') {
    const [f, as] = flattenApp(t);
    return `${showTermP(f.tag !== 'Var', f)} ${
      as.map((t, i) =>
        `${showTermP(t.tag === 'App' || t.tag === 'Let' || (t.tag === 'Abs' && i < as.length - 1), t)}`).join(' ')}`;
  }
  if (t.tag === 'Abs') {
    const [as, b] = flattenAbs(t);
    return `\\${as.join(' ')}. ${showTerm(b)}`;
  }
  if (t.tag === 'Let')
    return `let ${t.name} = ${showTermP(t.val.tag === 'Let', t.val)} in ${showTerm(t.body)}`;
  return t;
};

export type Def = DDef;

export type DDef = { tag: 'DDef', name: Name, value: Term };
export const DDef = (name: Name, value: Term): DDef => ({ tag: 'DDef', name, value });

export const showDef = (d: Def): string => {
  if (d.tag === 'DDef') return `def ${d.name} = ${showTerm(d.value)}`;
  return d.tag;
};
export const showDefs = (ds: Def[]): string => ds.map(showDef).join('\n');
