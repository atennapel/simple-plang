import { Type } from './types';
import { Term, Name } from './terms';

export type EnvGEntry = {
  term: Term,
  type: Type,
};
export type EnvG = { [key: string]: EnvGEntry };

let env: EnvG = {};

export const globalReset = () => {
  env = {};
};
export const globalMap = (): EnvG => env;
export const globalGet = (name: Name): EnvGEntry | null =>
  env[name] || null;
export const globalSet = (name: Name, term: Term, type: Type): void => {
  env[name] = { term, type };
};
export const globalDelete = (name: Name): void => {
  delete env[name];
};
