(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.setConfig = exports.config = void 0;
exports.config = {
    debug: false,
    showEnvs: false,
};
exports.setConfig = (c) => {
    for (let k in c)
        exports.config[k] = c[k];
};
exports.log = (msg) => {
    if (exports.config.debug)
        console.log(msg());
};

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalDelete = exports.globalSet = exports.globalGet = exports.globalMap = exports.globalReset = void 0;
let env = {};
exports.globalReset = () => {
    env = {};
};
exports.globalMap = () => env;
exports.globalGet = (name) => env[name] || null;
exports.globalSet = (name, term, type) => {
    env[name] = { term, type };
};
exports.globalDelete = (name) => {
    delete env[name];
};

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.max = exports.contains = exports.range = exports.and = exports.zipWithR_ = exports.zipWith_ = exports.zipWith = exports.foldlprim = exports.foldrprim = exports.foldl = exports.foldr = exports.lookup = exports.extend = exports.indecesOf = exports.indexOf = exports.index = exports.mapIndex = exports.map = exports.consAll = exports.append = exports.toArrayFilter = exports.toArray = exports.reverse = exports.isEmpty = exports.length = exports.each = exports.first = exports.filter = exports.listToString = exports.list = exports.listFrom = exports.Cons = exports.Nil = void 0;
exports.Nil = { tag: 'Nil' };
exports.Cons = (head, tail) => ({ tag: 'Cons', head, tail });
exports.listFrom = (a) => a.reduceRight((x, y) => exports.Cons(y, x), exports.Nil);
exports.list = (...a) => exports.listFrom(a);
exports.listToString = (l, fn = x => `${x}`) => {
    const r = [];
    let c = l;
    while (c.tag === 'Cons') {
        r.push(fn(c.head));
        c = c.tail;
    }
    return `[${r.join(', ')}]`;
};
exports.filter = (l, fn) => l.tag === 'Cons' ? (fn(l.head) ? exports.Cons(l.head, exports.filter(l.tail, fn)) : exports.filter(l.tail, fn)) : l;
exports.first = (l, fn) => {
    let c = l;
    while (c.tag === 'Cons') {
        if (fn(c.head))
            return c.head;
        c = c.tail;
    }
    return null;
};
exports.each = (l, fn) => {
    let c = l;
    while (c.tag === 'Cons') {
        fn(c.head);
        c = c.tail;
    }
};
exports.length = (l) => {
    let n = 0;
    let c = l;
    while (c.tag === 'Cons') {
        n++;
        c = c.tail;
    }
    return n;
};
exports.isEmpty = (l) => l.tag === 'Nil';
exports.reverse = (l) => exports.listFrom(exports.toArray(l, x => x).reverse());
exports.toArray = (l, fn) => {
    let c = l;
    const r = [];
    while (c.tag === 'Cons') {
        r.push(fn(c.head));
        c = c.tail;
    }
    return r;
};
exports.toArrayFilter = (l, m, f) => {
    const a = [];
    while (l.tag === 'Cons') {
        if (f(l.head))
            a.push(m(l.head));
        l = l.tail;
    }
    return a;
};
exports.append = (a, b) => a.tag === 'Cons' ? exports.Cons(a.head, exports.append(a.tail, b)) : b;
exports.consAll = (hs, b) => exports.append(exports.listFrom(hs), b);
exports.map = (l, fn) => l.tag === 'Cons' ? exports.Cons(fn(l.head), exports.map(l.tail, fn)) : l;
exports.mapIndex = (l, fn, i = 0) => l.tag === 'Cons' ? exports.Cons(fn(i, l.head), exports.mapIndex(l.tail, fn, i + 1)) : l;
exports.index = (l, i) => {
    while (l.tag === 'Cons') {
        if (i-- === 0)
            return l.head;
        l = l.tail;
    }
    return null;
};
exports.indexOf = (l, x) => {
    let i = 0;
    while (l.tag === 'Cons') {
        if (l.head === x)
            return i;
        l = l.tail;
        i++;
    }
    return -1;
};
exports.indecesOf = (l, val) => {
    const a = [];
    let i = 0;
    while (l.tag === 'Cons') {
        if (l.head === val)
            a.push(i);
        l = l.tail;
        i++;
    }
    return a;
};
exports.extend = (name, val, rest) => exports.Cons([name, val], rest);
exports.lookup = (l, name, eq = (x, y) => x === y) => {
    while (l.tag === 'Cons') {
        const h = l.head;
        if (eq(h[0], name))
            return h[1];
        l = l.tail;
    }
    return null;
};
exports.foldr = (f, i, l, j = 0) => l.tag === 'Nil' ? i : f(l.head, exports.foldr(f, i, l.tail, j + 1), j);
exports.foldl = (f, i, l) => l.tag === 'Nil' ? i : exports.foldl(f, f(i, l.head), l.tail);
exports.foldrprim = (f, i, l, ind = 0) => l.tag === 'Nil' ? i : f(l.head, exports.foldrprim(f, i, l.tail, ind + 1), l, ind);
exports.foldlprim = (f, i, l, ind = 0) => l.tag === 'Nil' ? i : exports.foldlprim(f, f(l.head, i, l, ind), l.tail, ind + 1);
exports.zipWith = (f, la, lb) => la.tag === 'Nil' || lb.tag === 'Nil' ? exports.Nil :
    exports.Cons(f(la.head, lb.head), exports.zipWith(f, la.tail, lb.tail));
exports.zipWith_ = (f, la, lb) => {
    if (la.tag === 'Cons' && lb.tag === 'Cons') {
        f(la.head, lb.head);
        exports.zipWith_(f, la.tail, lb.tail);
    }
};
exports.zipWithR_ = (f, la, lb) => {
    if (la.tag === 'Cons' && lb.tag === 'Cons') {
        exports.zipWith_(f, la.tail, lb.tail);
        f(la.head, lb.head);
    }
};
exports.and = (l) => l.tag === 'Nil' ? true : l.head && exports.and(l.tail);
exports.range = (n) => n <= 0 ? exports.Nil : exports.Cons(n - 1, exports.range(n - 1));
exports.contains = (l, v) => l.tag === 'Cons' ? (l.head === v || exports.contains(l.tail, v)) : false;
exports.max = (l) => exports.foldl((a, b) => b > a ? b : a, Number.MIN_SAFE_INTEGER, l);

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDefs = exports.parseDef = exports.parse = void 0;
const utils_1 = require("./utils");
const terms_1 = require("./terms");
const config_1 = require("./config");
const matchingBracket = (c) => {
    if (c === '(')
        return ')';
    if (c === ')')
        return '(';
    if (c === '{')
        return '}';
    if (c === '}')
        return '{';
    return utils_1.serr(`invalid bracket: ${c}`);
};
const TName = (name) => ({ tag: 'Name', name });
const TNum = (num) => ({ tag: 'Num', num });
const TList = (list, bracket) => ({ tag: 'List', list, bracket });
const SYM1 = ['\\', ':', '/', '*', '=', '|', ','];
const SYM2 = ['->', '**'];
const START = 0;
const NAME = 1;
const COMMENT = 2;
const NUMBER = 3;
const tokenize = (sc) => {
    let state = START;
    let r = [];
    let t = '';
    let esc = false;
    let p = [], b = [];
    for (let i = 0, l = sc.length; i <= l; i++) {
        const c = sc[i] || ' ';
        const next = sc[i + 1] || '';
        if (state === START) {
            if (SYM2.indexOf(c + next) >= 0)
                r.push(TName(c + next)), i++;
            else if (SYM1.indexOf(c) >= 0)
                r.push(TName(c));
            else if (c === '.' && !/[\.\%\_a-z]/i.test(next))
                r.push(TName('.'));
            else if (c + next === '--')
                i++, state = COMMENT;
            else if (/[\.\?\@\#\%\_a-z]/i.test(c))
                t += c, state = NAME;
            else if (/[0-9]/.test(c))
                t += c, state = NUMBER;
            else if (c === '(' || c === '{')
                b.push(c), p.push(r), r = [];
            else if (c === ')' || c === '}') {
                if (b.length === 0)
                    return utils_1.serr(`unmatched bracket: ${c}`);
                const br = b.pop();
                if (matchingBracket(br) !== c)
                    return utils_1.serr(`unmatched bracket: ${br} and ${c}`);
                const a = p.pop();
                a.push(TList(r, br));
                r = a;
            }
            else if (/\s/.test(c))
                continue;
            else
                return utils_1.serr(`invalid char ${c} in tokenize`);
        }
        else if (state === NAME) {
            if (!(/[a-z0-9\-\_\/]/i.test(c) || (c === '.' && /[a-z0-9]/i.test(next)))) {
                r.push(TName(t));
                t = '', i--, state = START;
            }
            else
                t += c;
        }
        else if (state === NUMBER) {
            if (!/[0-9a-z]/i.test(c)) {
                r.push(TNum(t));
                t = '', i--, state = START;
            }
            else
                t += c;
        }
        else if (state === COMMENT) {
            if (c === '\n')
                state = START;
        }
    }
    if (b.length > 0)
        return utils_1.serr(`unclosed brackets: ${b.join(' ')}`);
    if (state !== START && state !== COMMENT)
        return utils_1.serr('invalid tokenize end state');
    if (esc)
        return utils_1.serr(`escape is true after tokenize`);
    return r;
};
const tunit = terms_1.Var('UnitType');
const unit = terms_1.Var('Unit');
const isName = (t, x) => t.tag === 'Name' && t.name === x;
const isNames = (t) => t.map(x => {
    if (x.tag !== 'Name')
        return utils_1.serr(`expected name`);
    return x.name;
});
const splitTokens = (a, fn, keepSymbol = false) => {
    const r = [];
    let t = [];
    for (let i = 0, l = a.length; i < l; i++) {
        const c = a[i];
        if (fn(c)) {
            r.push(t);
            t = keepSymbol ? [c] : [];
        }
        else
            t.push(c);
    }
    r.push(t);
    return r;
};
const lambdaParams = (t) => {
    if (t.tag === 'Name')
        return [[t.name, false, null]];
    if (t.tag === 'List') {
        const impl = t.bracket === '{';
        const a = t.list;
        if (a.length === 0)
            return [['_', impl, tunit]];
        const i = a.findIndex(v => v.tag === 'Name' && v.name === ':');
        if (i === -1)
            return isNames(a).map(x => [x, impl, null]);
        const ns = a.slice(0, i);
        const rest = a.slice(i + 1);
        const ty = exprs(rest, '(');
        return isNames(ns).map(x => [x, impl, ty]);
    }
    return utils_1.serr(`invalid lambda param`);
};
const expr = (t) => {
    if (t.tag === 'List')
        return [exprs(t.list, '('), t.bracket === '{'];
    if (t.tag === 'Name') {
        const x = t.name;
        if (/[a-z]/i.test(x[0])) {
            return [terms_1.Var(x), false];
        }
        return utils_1.serr(`invalid name: ${x}`);
    }
    if (t.tag === 'Num') {
        if (t.num.endsWith('b')) {
            const n = +t.num.slice(0, -1);
            if (isNaN(n))
                return utils_1.serr(`invalid number: ${t.num}`);
            const s0 = terms_1.Var('B0');
            const s1 = terms_1.Var('B1');
            let c = terms_1.Var('BE');
            const s = n.toString(2);
            for (let i = 0; i < s.length; i++)
                c = terms_1.App(s[i] === '0' ? s0 : s1, c);
            return [c, false];
        }
        else if (t.num.endsWith('f')) {
            const n = +t.num.slice(0, -1);
            if (isNaN(n))
                return utils_1.serr(`invalid number: ${t.num}`);
            const s = terms_1.Var('FS');
            let c = terms_1.Var('FZ');
            for (let i = 0; i < n; i++)
                c = terms_1.App(s, c);
            return [c, false];
        }
        else if (t.num.endsWith('n')) {
            const tt = t.num.slice(0, -1);
            const n = +tt;
            if (isNaN(n))
                return utils_1.serr(`invalid nat number: ${tt}`);
            const s = terms_1.Var('S');
            let c = terms_1.Var('Z');
            for (let i = 0; i < n; i++)
                c = terms_1.App(s, c);
            return [c, false];
        }
        else {
            const tt = t.num;
            const n = +tt;
            if (isNaN(n))
                return utils_1.serr(`invalid nat number: ${tt}`);
            const s = terms_1.Var('S');
            let c = terms_1.Var('Z');
            for (let i = 0; i < n; i++)
                c = terms_1.App(s, c);
            return [c, false];
        }
    }
    return t;
};
const exprs = (ts, br) => {
    if (br === '{')
        return utils_1.serr(`{} cannot be used here`);
    if (ts.length === 0)
        return unit;
    if (ts.length === 1)
        return expr(ts[0])[0];
    if (isName(ts[0], 'let')) {
        const x = ts[1];
        let name = 'ERROR';
        if (x.tag === 'Name') {
            name = x.name;
        }
        else if (x.tag === 'List' && x.bracket === '{') {
            const a = x.list;
            if (a.length !== 1)
                return utils_1.serr(`invalid name for let`);
            const h = a[0];
            if (h.tag !== 'Name')
                return utils_1.serr(`invalid name for let`);
            name = h.name;
        }
        else
            return utils_1.serr(`invalid name for let`);
        let ty = null;
        let j = 2;
        if (isName(ts[j], ':')) {
            const tyts = [];
            j++;
            for (; j < ts.length; j++) {
                const v = ts[j];
                if (v.tag === 'Name' && v.name === '=')
                    break;
                else
                    tyts.push(v);
            }
            ty = exprs(tyts, '(');
        }
        if (!isName(ts[j], '='))
            return utils_1.serr(`no = after name in let`);
        const vals = [];
        let found = false;
        let i = j + 1;
        for (; i < ts.length; i++) {
            const c = ts[i];
            if (c.tag === 'Name' && c.name === 'in') {
                found = true;
                break;
            }
            vals.push(c);
        }
        if (!found)
            return utils_1.serr(`no in after let`);
        if (vals.length === 0)
            return utils_1.serr(`empty val in let`);
        const val = exprs(vals, '(');
        const body = exprs(ts.slice(i + 1), '(');
        if (ty)
            return terms_1.Let(name, val, body);
        return terms_1.Let(name, val, body);
    }
    if (isName(ts[0], '\\')) {
        const args = [];
        let found = false;
        let i = 1;
        for (; i < ts.length; i++) {
            const c = ts[i];
            if (isName(c, '.')) {
                found = true;
                break;
            }
            lambdaParams(c).forEach(x => args.push(x));
        }
        if (!found)
            return utils_1.serr(`. not found after \\ or there was no whitespace after .`);
        const body = exprs(ts.slice(i + 1), '(');
        return args.reduceRight((x, [name]) => terms_1.Abs(name, x), body);
    }
    const l = ts.findIndex(x => isName(x, '\\'));
    let all = [];
    if (l >= 0) {
        const first = ts.slice(0, l).map(expr);
        const rest = exprs(ts.slice(l), '(');
        all = first.concat([[rest, false]]);
    }
    else {
        all = ts.map(expr);
    }
    if (all.length === 0)
        return utils_1.serr(`empty application`);
    if (all[0] && all[0][1])
        return utils_1.serr(`in application function cannot be between {}`);
    return all.slice(1).reduce((x, [y]) => terms_1.App(x, y), all[0][0]);
};
exports.parse = (s) => {
    const ts = tokenize(s);
    const ex = exprs(ts, '(');
    return ex;
};
exports.parseDef = async (c, importMap) => {
    if (c.length === 0)
        return [];
    if (c[0].tag === 'Name' && c[0].name === 'import') {
        const files = c.slice(1).map(t => {
            if (t.tag !== 'Name')
                return utils_1.serr(`trying to import a non-path`);
            if (importMap[t.name]) {
                config_1.log(() => `skipping import ${t.name}`);
                return null;
            }
            return t.name;
        }).filter(x => x);
        config_1.log(() => `import ${files.join(' ')}`);
        const imps = await Promise.all(files.map(utils_1.loadFile));
        const defs = await Promise.all(imps.map(s => exports.parseDefs(s, importMap)));
        const fdefs = defs.reduce((x, y) => x.concat(y), []);
        fdefs.forEach(t => importMap[t.name] = true);
        config_1.log(() => `imported ${fdefs.map(x => x.name).join(' ')}`);
        return fdefs;
    }
    else if (c[0].tag === 'Name' && c[0].name === 'def') {
        const x = c[1];
        let name = '';
        if (x.tag === 'Name') {
            name = x.name;
        }
        else if (x.tag === 'List' && x.bracket === '{') {
            const a = x.list;
            if (a.length !== 1)
                return utils_1.serr(`invalid name for def`);
            const h = a[0];
            if (h.tag !== 'Name')
                return utils_1.serr(`invalid name for def`);
            name = h.name;
        }
        else
            return utils_1.serr(`invalid name for def`);
        if (name) {
            const fst = 2;
            const sym = c[fst];
            if (sym.tag !== 'Name')
                return utils_1.serr(`def: after name should be : or =`);
            if (sym.name === '=') {
                return [terms_1.DDef(name, exprs(c.slice(fst + 1), '('))];
            }
            else if (sym.name === ':') {
                const tyts = [];
                let j = fst + 1;
                for (; j < c.length; j++) {
                    const v = c[j];
                    if (v.tag === 'Name' && v.name === '=')
                        break;
                    else
                        tyts.push(v);
                }
                //const ety = exprs(tyts, '(');
                //const body = exprs(c.slice(j + 1), '(');
                return utils_1.serr(`unimplemented def with annotation`);
                // return [DDef(name, Let(false, name, ety, body, Var(name)), impl)];
            }
            else
                return utils_1.serr(`def: : or = expected but got ${sym.name}`);
        }
        else
            return utils_1.serr(`def should start with a name`);
    }
    else
        return utils_1.serr(`def should start with def or import`);
};
exports.parseDefs = async (s, importMap) => {
    const ts = tokenize(s);
    if (ts[0].tag !== 'Name' || (ts[0].name !== 'def' && ts[0].name !== 'import'))
        return utils_1.serr(`def should start with "def" or "import"`);
    const spl = splitTokens(ts, t => t.tag === 'Name' && (t.name === 'def' || t.name === 'import'), true);
    const ds = await Promise.all(spl.map(s => exports.parseDef(s, importMap)));
    return ds.reduce((x, y) => x.concat(y), []);
};

},{"./config":1,"./terms":6,"./utils":11}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runREPL = exports.initREPL = void 0;
const config_1 = require("./config");
const terms_1 = require("./terms");
const parser_1 = require("./parser");
const globalenv_1 = require("./globalenv");
const utils_1 = require("./utils");
const typecheck_1 = require("./typecheck");
const types_1 = require("./types");
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
let importMap = {};
exports.initREPL = () => {
    importMap = {};
};
exports.runREPL = (_s, _cb) => {
    try {
        _s = _s.trim();
        if (_s === ':help' || _s === ':h')
            return _cb(help);
        if (_s === ':debug' || _s === ':d') {
            config_1.setConfig({ debug: !config_1.config.debug });
            return _cb(`debug: ${config_1.config.debug}`);
        }
        if (_s.toLowerCase() === ':showenvs') {
            config_1.setConfig({ showEnvs: !config_1.config.showEnvs });
            return _cb(`showEnvs: ${config_1.config.showEnvs}`);
        }
        if (_s === ':defs') {
            const e = globalenv_1.globalMap();
            const msg = Object.keys(e).map(k => `def ${k} : ${types_1.showType(e[k].type)} = ${terms_1.showTerm(e[k].term)}`).join('\n');
            return _cb(msg || 'no definitions');
        }
        if (_s.startsWith(':del')) {
            const name = _s.slice(4).trim();
            globalenv_1.globalDelete(name);
            return _cb(`deleted ${name}`);
        }
        if (_s.startsWith(':def') || _s.startsWith(':import')) {
            const rest = _s.slice(1);
            parser_1.parseDefs(rest, importMap).then(ds => {
                const xs = typecheck_1.typecheckDefs(ds, true);
                return _cb(`defined ${xs.join(' ')}`);
            }).catch(err => _cb('' + err, true));
            return;
        }
        if (_s.startsWith(':view')) {
            const files = _s.slice(5).trim().split(/\s+/g);
            Promise.all(files.map(utils_1.loadFile)).then(ds => {
                return _cb(ds.join('\n\n'));
            }).catch(err => _cb('' + err, true));
            return;
        }
        if (_s.startsWith(':gtype')) {
            const name = _s.slice(6).trim();
            const res = globalenv_1.globalGet(name);
            if (!res)
                return _cb(`undefined global: ${name}`, true);
            return _cb(types_1.showType(res.type));
        }
        if (_s.startsWith(':gterm')) {
            const name = _s.slice(7).trim();
            const res = globalenv_1.globalGet(name);
            if (!res)
                return _cb(`undefined global: ${name}`, true);
            return _cb(terms_1.showTerm(res.term));
        }
        let typeOnly = false;
        if (_s.startsWith(':t')) {
            _s = _s.slice(_s.startsWith(':type') ? 5 : 2);
            typeOnly = true;
        }
        if (_s.startsWith(':'))
            return _cb('invalid command', true);
        let msg = '';
        try {
            const t = parser_1.parse(_s);
            config_1.log(() => terms_1.showTerm(t));
            const vty = typecheck_1.typecheck(t);
            config_1.log(() => types_1.showType(vty));
            config_1.log(() => terms_1.showTerm(t));
            msg += `type: ${types_1.showType(vty)}\nterm: ${terms_1.showTerm(t)}`;
            if (typeOnly)
                return _cb(msg);
            return _cb(msg);
        }
        catch (err) {
            config_1.log(() => '' + err);
            return _cb('' + err, true);
        }
    }
    catch (err) {
        config_1.log(() => '' + err);
        return _cb(err, true);
    }
};

},{"./config":1,"./globalenv":2,"./parser":4,"./terms":6,"./typecheck":8,"./types":9,"./utils":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDefs = exports.showDef = exports.DDef = exports.showTerm = exports.showTermP = exports.flattenAbs = exports.flattenApp = exports.showTermS = exports.Let = exports.Abs = exports.App = exports.Var = void 0;
exports.Var = (name) => ({ tag: 'Var', name });
exports.App = (left, right) => ({ tag: 'App', left, right });
exports.Abs = (name, body) => ({ tag: 'Abs', name, body });
exports.Let = (name, val, body) => ({ tag: 'Let', name, val, body });
exports.showTermS = (t) => {
    if (t.tag === 'Var')
        return t.name;
    if (t.tag === 'App')
        return `(${exports.showTermS(t.left)} ${exports.showTermS(t.right)})`;
    if (t.tag === 'Abs')
        return `(\\${t.name}. ${exports.showTermS(t.body)})`;
    if (t.tag === 'Let')
        return `(let ${t.name} = ${exports.showTermS(t.val)} in ${exports.showTermS(t.body)})`;
    return t;
};
exports.flattenApp = (t) => {
    const r = [];
    while (t.tag === 'App') {
        r.push(t.right);
        t = t.left;
    }
    return [t, r.reverse()];
};
exports.flattenAbs = (t) => {
    const r = [];
    while (t.tag === 'Abs') {
        r.push(t.name);
        t = t.body;
    }
    return [r, t];
};
exports.showTermP = (b, t) => b ? `(${exports.showTerm(t)})` : exports.showTerm(t);
exports.showTerm = (t) => {
    if (t.tag === 'Var')
        return t.name;
    if (t.tag === 'App') {
        const [f, as] = exports.flattenApp(t);
        return `${exports.showTermP(f.tag !== 'Var', f)} ${as.map((t, i) => `${exports.showTermP(t.tag === 'App' || t.tag === 'Let' || (t.tag === 'Abs' && i < as.length - 1), t)}`).join(' ')}`;
    }
    if (t.tag === 'Abs') {
        const [as, b] = exports.flattenAbs(t);
        return `\\${as.join(' ')}. ${exports.showTerm(b)}`;
    }
    if (t.tag === 'Let')
        return `let ${t.name} = ${exports.showTermP(t.val.tag === 'Let', t.val)} in ${exports.showTerm(t.body)}`;
    return t;
};
exports.DDef = (name, value) => ({ tag: 'DDef', name, value });
exports.showDef = (d) => {
    if (d.tag === 'DDef')
        return `def ${d.name} = ${exports.showTerm(d.value)}`;
    return d.tag;
};
exports.showDefs = (ds) => ds.map(exports.showDef).join('\n');

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freshMeta = exports.freshMetaId = exports.metaSet = exports.metaGet = exports.metaReset = exports.Solved = exports.Unsolved = void 0;
const types_1 = require("./types");
const utils_1 = require("./utils");
exports.Unsolved = (name) => ({ tag: 'Unsolved', name });
exports.Solved = (name, type) => ({ tag: 'Solved', name, type });
let metas = [];
exports.metaReset = () => { metas = []; };
exports.metaGet = (id) => {
    const s = metas[id];
    if (typeof s === 'undefined')
        return utils_1.impossible(`undefined meta ?${id} in metaGet`);
    return s;
};
exports.metaSet = (id, type) => {
    const m = exports.metaGet(id);
    if (m.tag === 'Solved')
        return utils_1.impossible(`trying to solve meta ?${id} again`);
    metas[id] = exports.Solved(m.name, type);
};
exports.freshMetaId = (name = null) => {
    const id = metas.length;
    metas[id] = exports.Unsolved(name);
    return id;
};
exports.freshMeta = (name = null) => types_1.TMeta(exports.freshMetaId(name));

},{"./types":9,"./utils":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typecheckDefs = exports.typecheck = void 0;
const terms_1 = require("./terms");
const types_1 = require("./types");
const list_1 = require("./list");
const utils_1 = require("./utils");
const tmetas_1 = require("./tmetas");
const unify_1 = require("./unify");
const globalenv_1 = require("./globalenv");
const config_1 = require("./config");
const infer = (env, term) => {
    config_1.log(() => `infer ${terms_1.showTerm(term)}${config_1.config.showEnvs ? ` in ${list_1.listToString(env, ([x, t]) => `${x} : ${types_1.showType(t)}`)}` : ''}`);
    if (term.tag === 'Var') {
        const ty = list_1.lookup(env, term.name);
        if (ty)
            return instantiate(ty);
        const gty = globalenv_1.globalGet(term.name);
        if (gty)
            return instantiate(gty.type);
        return utils_1.terr(`undefined var ${term.name}`);
    }
    if (term.tag === 'Abs') {
        const ty = tmetas_1.freshMeta(term.name);
        const rty = infer(list_1.extend(term.name, ty, env), term.body);
        return types_1.TFun(ty, rty);
    }
    if (term.tag === 'App') {
        const fty = infer(env, term.left);
        const aty = infer(env, term.right);
        const rty = tmetas_1.freshMeta('r');
        try {
            unify_1.unify(types_1.TFun(aty, rty), fty);
            return rty;
        }
        catch (e) {
            if (e instanceof TypeError)
                return utils_1.terr(`failed to typecheck ${terms_1.showTerm(term)}: failed to unify ${types_1.showType(types_1.prune(types_1.TFun(aty, rty)))} ~ ${types_1.showType(types_1.prune(fty))}: ${e}`);
            throw e;
        }
    }
    if (term.tag === 'Let') {
        const ty = infer(env, term.val);
        return infer(list_1.extend(term.name, ty, env), term.body);
    }
    return utils_1.terr(`unable to infer: ${terms_1.showTerm(term)}`);
};
const instantiate = (type, map = {}) => {
    config_1.log(() => `instantiate: ${types_1.showType(type)}`);
    if (type.tag === 'TVar')
        return map[type.name] || (map[type.name] = tmetas_1.freshMeta(type.name));
    if (type.tag === 'TApp')
        return types_1.TApp(instantiate(type.left, map), instantiate(type.right, map));
    return type;
};
const tmetas = (type, arr = []) => {
    if (type.tag === 'TMeta') {
        const m = tmetas_1.metaGet(type.ix);
        if (m.tag === 'Solved')
            return tmetas(m.type, arr);
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
const generalize = (type) => {
    config_1.log(() => `generalize: ${types_1.showType(type)}`);
    const ms = tmetas(type);
    let char = 97;
    for (let i = 0, l = ms.length; i < l; i++) {
        const ix = ms[i];
        const m = tmetas_1.metaGet(ix);
        if (m.tag === 'Unsolved') {
            // TODO: do not ignore name
            const genname = String.fromCharCode(char++);
            // handle char overflow
            tmetas_1.metaSet(ix, types_1.TVar(genname));
        }
    }
    return type;
};
exports.typecheck = (term, env = list_1.Nil) => types_1.prune(generalize(types_1.prune(infer(env, term))));
exports.typecheckDefs = (ds, allowRedefinition = false) => {
    config_1.log(() => `typecheckDefs ${ds.map(x => x.name).join(' ')}`);
    const xs = [];
    if (!allowRedefinition) {
        for (let i = 0; i < ds.length; i++) {
            const d = ds[i];
            if (d.tag === 'DDef' && globalenv_1.globalGet(d.name))
                return utils_1.terr(`cannot redefine global ${d.name}`);
        }
    }
    for (let i = 0; i < ds.length; i++) {
        const d = ds[i];
        config_1.log(() => `typecheckDefs ${terms_1.showDef(d)}`);
        if (d.tag === 'DDef') {
            try {
                const ty = exports.typecheck(d.value);
                const tm = d.value;
                config_1.log(() => `set ${d.name} = ${terms_1.showTerm(tm)}`);
                globalenv_1.globalSet(d.name, tm, ty);
                const i = xs.indexOf(d.name);
                if (i >= 0)
                    xs.splice(i, 1);
                xs.push(d.name);
            }
            catch (err) {
                err.message = `type error in def ${d.name}: ${err.message}`;
                throw err;
            }
        }
    }
    return xs;
};

},{"./config":1,"./globalenv":2,"./list":3,"./terms":6,"./tmetas":7,"./types":9,"./unify":10,"./utils":11}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = exports.containsTMeta = exports.showType = exports.showTypeP = exports.flattenTFun = exports.flattenTApp = exports.showTypeS = exports.matchTFun = exports.TFunR = exports.TFunL = exports.isTFun = exports.TFun = exports.TFunCon = exports.TMeta = exports.TApp = exports.TCon = exports.TVar = void 0;
const tmetas_1 = require("./tmetas");
exports.TVar = (name) => ({ tag: 'TVar', name });
exports.TCon = (name) => ({ tag: 'TCon', name });
exports.TApp = (left, right) => ({ tag: 'TApp', left, right });
exports.TMeta = (ix) => ({ tag: 'TMeta', ix });
exports.TFunCon = exports.TCon('(->)');
exports.TFun = (left, right) => exports.TApp(exports.TApp(exports.TFunCon, left), right);
exports.isTFun = (type) => type.tag === 'TApp' && type.left.tag === 'TApp' && type.left.left === exports.TFunCon;
exports.TFunL = (type) => type.left.right;
exports.TFunR = (type) => type.right;
exports.matchTFun = (type) => exports.isTFun(type) ? [exports.TFunL(type), exports.TFunR(type)] : null;
exports.showTypeS = (t) => {
    if (t.tag === 'TVar')
        return t.name;
    if (t.tag === 'TCon')
        return t.name;
    if (t.tag === 'TApp') {
        const tfun = exports.matchTFun(t);
        if (!tfun)
            return `(${exports.showTypeS(t.left)} ${exports.showTypeS(t.right)})`;
        return `(${tfun[0]} -> ${tfun[1]})`;
    }
    if (t.tag === 'TMeta')
        return `?${t.ix}`;
    return t;
};
exports.flattenTApp = (t) => {
    const r = [];
    while (t.tag === 'TApp') {
        r.push(t.right);
        t = t.left;
    }
    r.push(t);
    return r.reverse();
};
exports.flattenTFun = (t) => {
    const r = [];
    while (exports.isTFun(t)) {
        r.push(exports.TFunL(t));
        t = exports.TFunR(t);
    }
    r.push(t);
    return r;
};
exports.showTypeP = (b, t) => b ? `(${exports.showType(t)})` : exports.showType(t);
exports.showType = (t) => {
    if (t.tag === 'TVar')
        return t.name;
    if (t.tag === 'TCon')
        return t.name;
    if (t.tag === 'TMeta')
        return `?${t.ix}`;
    if (exports.isTFun(t)) {
        const as = exports.flattenTFun(t);
        return as.map(t => exports.showTypeP(exports.isTFun(t), t)).join(' -> ');
    }
    if (t.tag === 'TApp') {
        const as = exports.flattenTApp(t);
        return `${as.map(t => exports.showTypeP(t.tag === 'TApp', t)).join(' ')}`;
    }
    return t;
};
exports.containsTMeta = (ix, type) => {
    if (type.tag === 'TMeta') {
        if (type.ix === ix)
            return true;
        const m = tmetas_1.metaGet(ix);
        if (m.tag === 'Solved')
            return exports.containsTMeta(ix, m.type);
        return false;
    }
    if (type.tag === 'TApp')
        return exports.containsTMeta(ix, type.left) || exports.containsTMeta(ix, type.right);
    return false;
};
exports.prune = (type) => {
    if (type.tag === 'TMeta') {
        const m = tmetas_1.metaGet(type.ix);
        return m.tag === 'Solved' ? exports.prune(m.type) : type;
    }
    if (type.tag === 'TApp')
        return exports.TApp(exports.prune(type.left), exports.prune(type.right));
    return type;
};

},{"./tmetas":7}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unify = void 0;
const types_1 = require("./types");
const utils_1 = require("./utils");
const tmetas_1 = require("./tmetas");
const config_1 = require("./config");
const bindTMeta = (ix, type) => {
    if (type.tag === 'TMeta' && type.ix === ix)
        return;
    const m = tmetas_1.metaGet(ix);
    if (m.tag === 'Solved')
        return exports.unify(m.type, type);
    if (types_1.containsTMeta(ix, type))
        return utils_1.terr(`occurs check failed: ?${ix} in ${types_1.showType(types_1.prune(type))}`);
    tmetas_1.metaSet(ix, type);
};
exports.unify = (left, right) => {
    config_1.log(() => `unify ${types_1.showType(left)} ~ ${types_1.showType(right)}`);
    if (left === right)
        return;
    if (left.tag === 'TVar' && right.tag === 'TVar' && left.name === right.name)
        return;
    if (left.tag === 'TCon' && right.tag === 'TCon' && left.name === right.name)
        return;
    if (left.tag === 'TMeta')
        return bindTMeta(left.ix, right);
    if (right.tag === 'TMeta')
        return bindTMeta(right.ix, left);
    if (left.tag === 'TApp' && right.tag === 'TApp') {
        exports.unify(left.left, right.left);
        exports.unify(left.right, right.right);
        return;
    }
    return utils_1.terr(`failed to unify: ${types_1.showType(types_1.prune(left))} ~ ${types_1.showType(types_1.prune(right))}`);
};

},{"./config":1,"./tmetas":7,"./types":9,"./utils":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDuplicates = exports.range = exports.loadFile = exports.serr = exports.terr = exports.impossible = void 0;
exports.impossible = (msg) => {
    throw new Error(`impossible: ${msg}`);
};
exports.terr = (msg) => {
    throw new TypeError(msg);
};
exports.serr = (msg) => {
    throw new SyntaxError(msg);
};
exports.loadFile = (fn) => {
    if (typeof window === 'undefined') {
        return new Promise((resolve, reject) => {
            require('fs').readFile(fn, 'utf8', (err, data) => {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        });
    }
    else {
        return fetch(fn).then(r => r.text());
    }
};
exports.range = (n) => {
    const a = Array(n);
    for (let i = 0; i < n; i++)
        a[i] = i;
    return a;
};
exports.hasDuplicates = (x) => {
    const m = {};
    for (let i = 0; i < x.length; i++) {
        const y = `${x[i]}`;
        if (m[y])
            return true;
        m[y] = true;
    }
    return false;
};

},{"fs":13}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repl_1 = require("./repl");
var hist = [], index = -1;
var input = document.getElementById('input');
var content = document.getElementById('content');
function onresize() {
    content.style.height = window.innerHeight;
}
window.addEventListener('resize', onresize);
onresize();
addResult('tinka repl');
repl_1.initREPL();
input.focus();
input.onkeydown = function (keyEvent) {
    var val = input.value;
    var txt = (val || '').trim();
    if (keyEvent.keyCode === 13) {
        keyEvent.preventDefault();
        if (txt) {
            hist.push(val);
            index = hist.length;
            input.value = '';
            var div = document.createElement('div');
            div.innerHTML = val;
            div.className = 'line input';
            content.insertBefore(div, input);
            repl_1.runREPL(txt, addResult);
        }
    }
    else if (keyEvent.keyCode === 38 && index > 0) {
        keyEvent.preventDefault();
        input.value = hist[--index];
    }
    else if (keyEvent.keyCode === 40 && index < hist.length - 1) {
        keyEvent.preventDefault();
        input.value = hist[++index];
    }
    else if (keyEvent.keyCode === 40 && keyEvent.ctrlKey && index >= hist.length - 1) {
        index = hist.length;
        input.value = '';
    }
};
function addResult(msg, err) {
    var divout = document.createElement('pre');
    divout.className = 'line output';
    if (err)
        divout.className += ' error';
    divout.innerHTML = '' + msg;
    content.insertBefore(divout, input);
    input.focus();
    content.scrollTop = content.scrollHeight;
    return divout;
}

},{"./repl":5}],13:[function(require,module,exports){

},{}]},{},[12]);
