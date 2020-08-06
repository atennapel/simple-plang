import { log, setConfig, config } from './config';
import { showTerm } from './terms';
import { parse, ImportMap, parseDefs } from './parser';
import { globalMap, globalDelete, globalGet } from './globalenv';
import { loadFile } from './utils';
import { typecheckDefs, typecheck } from './typecheck';
import { showType } from './types';

const help = `
COMMANDS
[:help or :h] this help message
[:debug or :d]
[:showenvs]
[:defs]
[:del]
[:def or :import]
[:gtype]
[:gterm]
`.trim();

let importMap: ImportMap = {};

export const initREPL = () => {
  importMap = {};
};

export const runREPL = (_s: string, _cb: (msg: string, err?: boolean) => void) => {
  try {
    _s = _s.trim();
    if (_s === ':help' || _s === ':h')
      return _cb(help);
    if (_s === ':debug' || _s === ':d') {
      setConfig({ debug: !config.debug });
      return _cb(`debug: ${config.debug}`);
    }
    if (_s.toLowerCase() === ':showenvs') {
      setConfig({ showEnvs: !config.showEnvs });
      return _cb(`showEnvs: ${config.showEnvs}`);
    }
    if (_s === ':defs') {
      const e = globalMap();
      const msg = Object.keys(e).map(k => `def ${k} : ${showType(e[k].type)} = ${showTerm(e[k].term)}`).join('\n');
      return _cb(msg || 'no definitions');
    }
    if (_s.startsWith(':del')) {
      const name = _s.slice(4).trim();
      globalDelete(name);
      return _cb(`deleted ${name}`);
    }
    if (_s.startsWith(':def') || _s.startsWith(':import')) {
      const rest = _s.slice(1);
      parseDefs(rest, importMap).then(ds => {
        const xs = typecheckDefs(ds, true);
        return _cb(`defined ${xs.join(' ')}`);
      }).catch(err => _cb(''+err, true));
      return;
    }
    if (_s.startsWith(':view')) {
      const files = _s.slice(5).trim().split(/\s+/g);
      Promise.all(files.map(loadFile)).then(ds => {
        return _cb(ds.join('\n\n'));
      }).catch(err => _cb(''+err, true));
      return;
    }
    if (_s.startsWith(':gtype')) {
      const name = _s.slice(6).trim();
      const res = globalGet(name);
      if (!res) return _cb(`undefined global: ${name}`, true);
      return _cb(showType(res.type));
    }
    if (_s.startsWith(':gterm')) {
      const name = _s.slice(7).trim();
      const res = globalGet(name);
      if (!res) return _cb(`undefined global: ${name}`, true);
      return _cb(showTerm(res.term));
    }
    let typeOnly = false;
    if (_s.startsWith(':t')) {
      _s = _s.slice(_s.startsWith(':type') ? 5 : 2);
      typeOnly = true;
    }
    if (_s.startsWith(':')) return _cb('invalid command', true);
    let msg = '';
    try {
      const t = parse(_s);
      log(() => showTerm(t));
      const vty = typecheck(t);
      log(() => showType(vty));
      log(() => showTerm(t));
      msg += `type: ${showType(vty)}\nterm: ${showTerm(t)}`;
      if (typeOnly) return _cb(msg);
      return _cb(msg);
    } catch (err) {
      log(() => ''+err);
      return _cb(''+err, true);
    }
  } catch (err) {
    log(() => ''+err);
    return _cb(err, true);
  }
};
