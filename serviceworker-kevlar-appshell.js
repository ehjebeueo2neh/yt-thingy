'use strict';
var t, aa = typeof Object.create == "function" ? Object.create : function(a) {
    function b() {}
    b.prototype = a;
    return new b
}
, ba = typeof Object.defineProperties == "function" ? Object.defineProperty : function(a, b, c) {
    if (a == Array.prototype || a == Object.prototype)
        return a;
    a[b] = c.value;
    return a
}
;
function ca(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math)
            return c
    }
    throw Error("Cannot find global object");
}
var da = ca(this);
function fa(a, b) {
    if (b)
        a: {
            var c = da;
            a = a.split(".");
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                if (!(e in c))
                    break a;
                c = c[e]
            }
            a = a[a.length - 1];
            d = c[a];
            b = b(d);
            b != d && b != null && ba(c, a, {
                configurable: !0,
                writable: !0,
                value: b
            })
        }
}
function ha(a) {
    function b(d) {
        return a.next(d)
    }
    function c(d) {
        return a.throw(d)
    }
    return new Promise(function(d, e) {
        function f(g) {
            g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e)
        }
        f(a.next())
    }
    )
}
function u(a) {
    return ha(a())
}
fa("globalThis", function(a) {
    return a || da
});
function ia(a) {
    var b = (typeof Iterator != "undefined" && Iterator.prototype && !Iterator.prototype.next ? Iterator.prototype : null) || Object.prototype
      , c = aa(b);
    c.next = a;
    b[Symbol.iterator] || (c[Symbol.iterator] = function() {
        return this
    }
    );
    return c
}
fa("Symbol.dispose", function(a) {
    return a ? a : Symbol("Symbol.dispose")
});
fa("Object.values", function(a) {
    return a ? a : function(b) {
        var c = [], d;
        for (d in b)
            Object.prototype.hasOwnProperty.call(b, d) && c.push(b[d]);
        return c
    }
});
fa("Array.prototype.includes", function(a) {
    return a ? a : function(b, c) {
        var d = this;
        d instanceof String && (d = String(d));
        var e = d.length;
        c = c || 0;
        for (c < 0 && (c = Math.max(c + e, 0)); c < e; c++) {
            var f = d[c];
            if (f === b || Object.is(f, b))
                return !0
        }
        return !1
    }
});
fa("Object.entries", function(a) {
    return a ? a : function(b) {
        var c = [], d;
        for (d in b)
            Object.prototype.hasOwnProperty.call(b, d) && c.push([d, b[d]]);
        return c
    }
});
function ja(a, b) {
    a instanceof String && (a += "");
    var c = 0
      , d = !1;
    return ia(function() {
        if (!d && c < a.length) {
            var e = c++;
            return {
                value: b(e, a[e]),
                done: !1
            }
        }
        d = !0;
        return {
            done: !0,
            value: void 0
        }
    })
}
fa("Array.prototype.values", function(a) {
    return a ? a : function() {
        return ja(this, function(b, c) {
            return c
        })
    }
});
fa("String.prototype.matchAll", function(a) {
    return a ? a : function(b) {
        if (b instanceof RegExp && !b.global)
            throw new TypeError("RegExp passed into String.prototype.matchAll() must have global tag.");
        var c = new RegExp(b,b instanceof RegExp ? void 0 : "g");
        b instanceof RegExp && (c.lastIndex = b.lastIndex);
        var d = this
          , e = !1;
        return ia(function() {
            if (e)
                return {
                    value: void 0,
                    done: !0
                };
            var f = c.exec(d);
            if (!f)
                return e = !0,
                {
                    value: void 0,
                    done: !0
                };
            f[0] === "" && (c.lastIndex += 1);
            return {
                value: f,
                done: !1
            }
        })
    }
});
fa("Promise.prototype.finally", function(a) {
    return a ? a : function(b) {
        return this.then(function(c) {
            return Promise.resolve(b()).then(function() {
                return c
            })
        }, function(c) {
            return Promise.resolve(b()).then(function() {
                throw c;
            })
        })
    }
});
/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var v = this || self;
function ka(a, b) {
    var c = y("CLOSURE_FLAGS");
    a = c && c[a];
    return a != null ? a : b
}
function y(a, b) {
    a = a.split(".");
    b = b || v;
    for (var c = 0; c < a.length; c++)
        if (b = b[a[c]],
        b == null)
            return null;
    return b
}
function la(a) {
    var b = typeof a;
    b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
    return b == "array" || b == "object" && typeof a.length == "number"
}
function ma(a, b, c) {
    return a.call.apply(a.bind, arguments)
}
function na(a, b, c) {
    if (!a)
        throw Error();
    if (arguments.length > 2) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var e = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(e, d);
            return a.apply(b, e)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
}
function oa(a, b, c) {
    oa = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? ma : na;
    return oa.apply(null, arguments)
}
function z(a, b) {
    a = a.split(".");
    for (var c = v, d; a.length && (d = a.shift()); )
        a.length || b === void 0 ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
}
function pa(a) {
    return a
}
function qa(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.pb = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.Kb = function(d, e, f) {
        for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++)
            g[h - 2] = arguments[h];
        return b.prototype[e].apply(d, g)
    }
}
;function ra(a, b) {
    if (Error.captureStackTrace)
        Error.captureStackTrace(this, ra);
    else {
        let c = Error().stack;
        c && (this.stack = c)
    }
    a && (this.message = String(a));
    b !== void 0 && (this.cause = b)
}
qa(ra, Error);
ra.prototype.name = "CustomError";
const sa = String.prototype.trim ? function(a) {
    return a.trim()
}
: function(a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
}
;
/*

 Copyright Google LLC
 SPDX-License-Identifier: Apache-2.0
*/
let ta = globalThis.trustedTypes, ua;
function va() {
    var a = null;
    if (!ta)
        return a;
    try {
        let b = c => c;
        a = ta.createPolicy("goog#html", {
            createHTML: b,
            createScript: b,
            createScriptURL: b
        })
    } catch (b) {}
    return a
}
;var wa = class {
    constructor(a) {
        this.h = a
    }
    toString() {
        return this.h + ""
    }
}
;
var xa = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
function ya(a, b=`unexpected value ${a}!`) {
    throw Error(b);
}
;function za(a, b) {
    Array.prototype.forEach.call(a, b, void 0)
}
function Aa(a, b) {
    return Array.prototype.map.call(a, b, void 0)
}
function Ba(a, b) {
    b = Array.prototype.indexOf.call(a, b, void 0);
    b >= 0 && Array.prototype.splice.call(a, b, 1)
}
function Ca(a) {
    var b = a.length;
    if (b > 0) {
        let c = Array(b);
        for (let d = 0; d < b; d++)
            c[d] = a[d];
        return c
    }
    return []
}
function Da(a, b) {
    for (let c = 1; c < arguments.length; c++) {
        let d = arguments[c];
        if (la(d)) {
            let e = a.length || 0
              , f = d.length || 0;
            a.length = e + f;
            for (let g = 0; g < f; g++)
                a[e + g] = d[g]
        } else
            a.push(d)
    }
}
;function Ea(a, b) {
    a.__closure__error__context__984382 || (a.__closure__error__context__984382 = {});
    a.__closure__error__context__984382.severity = b
}
;function Fa(a) {
    var b = y("window.location.href");
    a == null && (a = 'Unknown Error of type "null/undefined"');
    if (typeof a === "string")
        return {
            message: a,
            name: "Unknown error",
            lineNumber: "Not available",
            fileName: b,
            stack: "Not available"
        };
    var c = !1;
    try {
        var d = a.lineNumber || a.line || "Not available"
    } catch (f) {
        d = "Not available",
        c = !0
    }
    try {
        var e = a.fileName || a.filename || a.sourceURL || v.$googDebugFname || b
    } catch (f) {
        e = "Not available",
        c = !0
    }
    b = Ga(a);
    if (!(!c && a.lineNumber && a.fileName && a.stack && a.message && a.name)) {
        c = a.message;
        if (c == null) {
            if (a.constructor && a.constructor instanceof Function) {
                if (a.constructor.name)
                    c = a.constructor.name;
                else if (c = a.constructor,
                Ha[c])
                    c = Ha[c];
                else {
                    c = String(c);
                    if (!Ha[c]) {
                        let f = /function\s+([^\(]+)/m.exec(c);
                        Ha[c] = f ? f[1] : "[Anonymous]"
                    }
                    c = Ha[c]
                }
                c = 'Unknown Error of type "' + c + '"'
            } else
                c = "Unknown Error of unknown type";
            typeof a.toString === "function" && Object.prototype.toString !== a.toString && (c += ": " + a.toString())
        }
        return {
            message: c,
            name: a.name || "UnknownError",
            lineNumber: d,
            fileName: e,
            stack: b || "Not available"
        }
    }
    return {
        message: a.message,
        name: a.name,
        lineNumber: a.lineNumber,
        fileName: a.fileName,
        stack: b
    }
}
function Ga(a, b) {
    b || (b = {});
    b[Ia(a)] = !0;
    var c = a.stack || ""
      , d = a.cause;
    d && !b[Ia(d)] && (c += "\nCaused by: ",
    d.stack && d.stack.indexOf(d.toString()) == 0 || (c += typeof d === "string" ? d : d.message + "\n"),
    c += Ga(d, b));
    a = a.errors;
    if (Array.isArray(a)) {
        d = 1;
        let e;
        for (e = 0; e < a.length && !(d > 4); e++)
            b[Ia(a[e])] || (c += "\nInner error " + d++ + ": ",
            a[e].stack && a[e].stack.indexOf(a[e].toString()) == 0 || (c += typeof a[e] === "string" ? a[e] : a[e].message + "\n"),
            c += Ga(a[e], b));
        e < a.length && (c += "\n... " + (a.length - e) + " more inner errors")
    }
    return c
}
function Ia(a) {
    var b = "";
    typeof a.toString === "function" && (b = "" + a);
    return b + a.stack
}
var Ha = {};
const Ja = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
function Ka(a) {
    return (a = a.match(Ja)[3] || null) ? decodeURI(a) : a
}
function La(a) {
    var b = a.match(Ja);
    a = b[5];
    var c = b[6];
    b = b[7];
    var d = "";
    a && (d += a);
    c && (d += "?" + c);
    b && (d += "#" + b);
    return d
}
function Ma(a) {
    var b = a.indexOf("#");
    return b < 0 ? a : a.slice(0, b)
}
function Na(a, b) {
    if (a) {
        a = a.split("&");
        for (let c = 0; c < a.length; c++) {
            let d = a[c].indexOf("="), e, f = null;
            d >= 0 ? (e = a[c].substring(0, d),
            f = a[c].substring(d + 1)) : e = a[c];
            b(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
        }
    }
}
function Oa(a, b, c) {
    if (Array.isArray(b))
        for (let d = 0; d < b.length; d++)
            Oa(a, String(b[d]), c);
    else
        b != null && c.push(a + (b === "" ? "" : "=" + encodeURIComponent(String(b))))
}
function Pa(a) {
    var b = [];
    for (let c in a)
        Oa(c, a[c], b);
    return b.join("&")
}
function Qa(a, b) {
    b = Pa(b);
    if (b) {
        var c = a.indexOf("#");
        c < 0 && (c = a.length);
        let d = a.indexOf("?"), e;
        d < 0 || d > c ? (d = c,
        e = "") : e = a.substring(d + 1, c);
        a = [a.slice(0, d), e, a.slice(c)];
        c = a[1];
        a[1] = b ? c ? c + "&" + b : b : c;
        b = a[0] + (a[1] ? "?" + a[1] : "") + a[2]
    } else
        b = a;
    return b
}
function Ra(a, b, c, d) {
    for (var e = c.length; (b = a.indexOf(c, b)) >= 0 && b < d; ) {
        var f = a.charCodeAt(b - 1);
        if (f == 38 || f == 63)
            if (f = a.charCodeAt(b + e),
            !f || f == 61 || f == 38 || f == 35)
                return b;
        b += e + 1
    }
    return -1
}
const Sa = /#|$/
  , Ta = /[?&]($|#)/;
function Va() {
    throw Error("Invalid UTF8");
}
function Wa(a, b) {
    b = String.fromCharCode.apply(null, b);
    return a == null ? b : a + b
}
let Xa = void 0, Ya;
const Za = typeof TextDecoder !== "undefined";
function $a(a) {
    v.setTimeout( () => {
        throw a;
    }
    , 0)
}
;var ab = ka(610401301, !1)
  , bb = ka(748402147, !0);
function cb() {
    var a = v.navigator;
    return a && (a = a.userAgent) ? a : ""
}
var db;
const eb = v.navigator;
db = eb ? eb.userAgentData || null : null;
function fb(a) {
    if (!ab || !db)
        return !1;
    for (let b = 0; b < db.brands.length; b++) {
        let {brand: c} = db.brands[b];
        if (c && c.indexOf(a) != -1)
            return !0
    }
    return !1
}
function B(a) {
    return cb().indexOf(a) != -1
}
;function gb() {
    return ab ? !!db && db.brands.length > 0 : !1
}
;function hb() {
    return B("iPhone") && !B("iPod") && !B("iPad")
}
;var ib;
ib = ab ? !!db && !!db.platform : !1;
var jb = ib ? db.platform === "Android" : B("Android");
const kb = hb() || B("iPod")
  , lb = B("iPad")
  , mb = B("Safari") && !((gb() ? fb("Chromium") : (B("Chrome") || B("CriOS")) && (gb() || !B("Edge")) || B("Silk")) || (gb() ? 0 : B("Coast")) || (gb() ? 0 : B("Opera")) || (gb() ? 0 : B("Edge")) || (gb() ? fb("Microsoft Edge") : B("Edg/")) || (gb() ? fb("Opera") : B("OPR")) || B("Firefox") || B("FxiOS") || B("Silk") || B("Android")) && !(hb() || B("iPad") || B("iPod"));
const nb = {};
let ob = null;
function pb(a, b) {
    b === void 0 && (b = 0);
    qb();
    b = nb[b];
    for (var c = Array(Math.floor(a.length / 3)), d = b[64] || "", e = 0, f = 0; e < a.length - 2; e += 3) {
        var g = a[e]
          , h = a[e + 1]
          , k = a[e + 2]
          , l = b[g >> 2];
        g = b[(g & 3) << 4 | h >> 4];
        h = b[(h & 15) << 2 | k >> 6];
        k = b[k & 63];
        c[f++] = "" + l + g + h + k
    }
    l = 0;
    k = d;
    switch (a.length - e) {
    case 2:
        l = a[e + 1],
        k = b[(l & 15) << 2] || d;
    case 1:
        a = a[e],
        c[f] = "" + b[a >> 2] + b[(a & 3) << 4 | l >> 4] + k + d
    }
    return c.join("")
}
function rb(a) {
    var b = a.length
      , c = b * 3 / 4;
    c % 3 ? c = Math.floor(c) : "=.".indexOf(a[b - 1]) != -1 && (c = "=.".indexOf(a[b - 2]) != -1 ? c - 2 : c - 1);
    var d = new Uint8Array(c)
      , e = 0;
    sb(a, function(f) {
        d[e++] = f
    });
    return e !== c ? d.subarray(0, e) : d
}
function sb(a, b) {
    function c(e) {
        for (; d < a.length; ) {
            let f = a.charAt(d++)
              , g = ob[f];
            if (g != null)
                return g;
            if (!/^[\s\xa0]*$/.test(f))
                throw Error("Unknown base64 encoding at char: " + f);
        }
        return e
    }
    qb();
    for (var d = 0; ; ) {
        let e = c(-1)
          , f = c(0)
          , g = c(64)
          , h = c(64);
        if (h === 64 && e === -1)
            break;
        b(e << 2 | f >> 4);
        g != 64 && (b(f << 4 & 240 | g >> 2),
        h != 64 && b(g << 6 & 192 | h))
    }
}
function qb() {
    if (!ob) {
        ob = {};
        var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("")
          , b = ["+/=", "+/", "-_=", "-_.", "-_"];
        for (let c = 0; c < 5; c++) {
            let d = a.concat(b[c].split(""));
            nb[c] = d;
            for (let e = 0; e < d.length; e++) {
                let f = d[e];
                ob[f] === void 0 && (ob[f] = e)
            }
        }
    }
}
;var tb = typeof Uint8Array !== "undefined"
  , ub = !(gb() ? 0 : B("Trident") || B("MSIE")) && typeof btoa === "function";
const vb = /[-_.]/g
  , wb = {
    "-": "+",
    _: "/",
    ".": "="
};
function xb(a) {
    return wb[a] || ""
}
function yb(a) {
    if (!ub)
        return rb(a);
    a = vb.test(a) ? a.replace(vb, xb) : a;
    a = atob(a);
    var b = new Uint8Array(a.length);
    for (let c = 0; c < a.length; c++)
        b[c] = a.charCodeAt(c);
    return b
}
var zb = {};
function Ab() {
    return Bb || (Bb = new Cb(null,zb))
}
function Db(a) {
    Eb(zb);
    var b = a.h;
    b = b == null || tb && b != null && b instanceof Uint8Array ? b : typeof b === "string" ? yb(b) : null;
    return b == null ? b : a.h = b
}
var Cb = class {
    sizeBytes() {
        var a = Db(this);
        return a ? a.length : 0
    }
    constructor(a, b) {
        Eb(b);
        this.h = a;
        if (a != null && a.length === 0)
            throw Error("ByteString should be constructed with non-empty values");
    }
}
;
let Bb;
function Eb(a) {
    if (a !== zb)
        throw Error("illegal external caller");
}
;let Fb = void 0;
function Gb(a) {
    a = Error(a);
    Ea(a, "warning");
    return a
}
function Hb(a, b) {
    if (a != null) {
        var c;
        var d = (c = Fb) != null ? c : Fb = {};
        c = d[a] || 0;
        c >= b || (d[a] = c + 1,
        a = Error(),
        Ea(a, "incident"),
        $a(a))
    }
}
;function Ib() {
    return typeof BigInt === "function"
}
;var Jb = typeof Symbol === "function" && typeof Symbol() === "symbol";
function Kb(a, b, c=!1) {
    return typeof Symbol === "function" && typeof Symbol() === "symbol" ? c && Symbol.for && a ? Symbol.for(a) : a != null ? Symbol(a) : Symbol() : b
}
var Lb = Kb("jas", void 0, !0)
  , Mb = Kb(void 0, "1oa")
  , Nb = Kb(void 0, Symbol())
  , Ob = Kb(void 0, "0ubs")
  , Pb = Kb(void 0, "0actk")
  , Qb = Kb("m_m", "Ub", !0);
const Rb = {
    ab: {
        value: 0,
        configurable: !0,
        writable: !0,
        enumerable: !1
    }
}
  , Sb = Object.defineProperties
  , C = Jb ? Lb : "ab";
var Tb;
const Ub = [];
D(Ub, 7);
Tb = Object.freeze(Ub);
function Vb(a, b) {
    Jb || C in a || Sb(a, Rb);
    a[C] |= b
}
function D(a, b) {
    Jb || C in a || Sb(a, Rb);
    a[C] = b
}
;var Wb = {};
function Xb(a, b) {
    return b === void 0 ? a.h !== Yb && !!(2 & (a.A[C] | 0)) : !!(2 & b) && a.h !== Yb
}
const Yb = {};
Object.freeze({});
function Zb(a, b, c) {
    var d = b & 128 ? 0 : -1, e = a.length, f;
    if (f = !!e)
        f = a[e - 1],
        f = f != null && typeof f === "object" && f.constructor === Object;
    var g = e + (f ? -1 : 0);
    for (b = b & 128 ? 1 : 0; b < g; b++)
        c(b - d, a[b]);
    if (f) {
        a = a[e - 1];
        for (let h in a)
            !isNaN(h) && c(+h, a[h])
    }
}
var $b = {};
function ac(a) {
    a.Sb = !0;
    return a
}
;var bc = ac(a => typeof a === "number")
  , cc = ac(a => typeof a === "string")
  , dc = ac(a => typeof a === "boolean")
  , ec = ac(a => a != null && typeof a === "object" && typeof a.then === "function")
  , fc = ac(a => !!a && (typeof a === "object" || typeof a === "function"));
var hc = typeof v.BigInt === "function" && typeof v.BigInt(0) === "bigint";
function ic(a) {
    var b = a;
    if (cc(b)) {
        if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(b))
            throw Error(String(b));
    } else if (bc(b) && !Number.isSafeInteger(b))
        throw Error(String(b));
    return hc ? BigInt(a) : a = dc(a) ? a ? "1" : "0" : cc(a) ? a.trim() || "0" : String(a)
}
var oc = ac(a => hc ? a >= jc && a <= kc : a[0] === "-" ? lc(a, mc) : lc(a, nc));
const mc = Number.MIN_SAFE_INTEGER.toString()
  , jc = hc ? BigInt(Number.MIN_SAFE_INTEGER) : void 0
  , nc = Number.MAX_SAFE_INTEGER.toString()
  , kc = hc ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;
function lc(a, b) {
    if (a.length > b.length)
        return !1;
    if (a.length < b.length || a === b)
        return !0;
    for (let c = 0; c < a.length; c++) {
        let d = a[c]
          , e = b[c];
        if (d > e)
            return !1;
        if (d < e)
            return !0
    }
}
;const pc = typeof Uint8Array.prototype.slice === "function";
let E = 0
  , qc = 0;
function rc(a) {
    var b = a >>> 0;
    E = b;
    qc = (a - b) / 4294967296 >>> 0
}
function sc(a) {
    if (a < 0) {
        rc(0 - a);
        let[b,c] = tc(E, qc);
        E = b >>> 0;
        qc = c >>> 0
    } else
        rc(a)
}
function uc(a, b) {
    b >>>= 0;
    a >>>= 0;
    if (b <= 2097151)
        var c = "" + (4294967296 * b + a);
    else
        Ib() ? c = "" + (BigInt(b) << BigInt(32) | BigInt(a)) : (c = (a >>> 24 | b << 8) & 16777215,
        b = b >> 16 & 65535,
        a = (a & 16777215) + c * 6777216 + b * 6710656,
        c += b * 8147497,
        b *= 2,
        a >= 1E7 && (c += a / 1E7 >>> 0,
        a %= 1E7),
        c >= 1E7 && (b += c / 1E7 >>> 0,
        c %= 1E7),
        c = b + vc(c) + vc(a));
    return c
}
function vc(a) {
    a = String(a);
    return "0000000".slice(a.length) + a
}
function wc() {
    var a = E
      , b = qc;
    if (b & 2147483648)
        if (Ib())
            a = "" + (BigInt(b | 0) << BigInt(32) | BigInt(a >>> 0));
        else {
            let[c,d] = tc(a, b);
            a = "-" + uc(c, d)
        }
    else
        a = uc(a, b);
    return a
}
function tc(a, b) {
    b = ~b;
    a ? a = ~a + 1 : b += 1;
    return [a, b]
}
;const xc = typeof BigInt === "function" ? BigInt.asIntN : void 0
  , yc = Number.isSafeInteger
  , zc = Number.isFinite
  , Ac = Math.trunc;
function Bc(a) {
    return a.displayName || a.name || "unknown type name"
}
const Cc = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;
function Dc(a) {
    switch (typeof a) {
    case "bigint":
        return !0;
    case "number":
        return zc(a);
    case "string":
        return Cc.test(a);
    default:
        return !1
    }
}
function Ec(a) {
    if (a == null)
        return a;
    if (typeof a === "string" && a)
        a = +a;
    else if (typeof a !== "number")
        return;
    return zc(a) ? a | 0 : void 0
}
function Fc(a) {
    var b = void 0;
    b != null || (b = 1024);
    if (!Dc(a))
        throw Gb("int64");
    var c = typeof a;
    switch (b) {
    case 512:
        switch (c) {
        case "string":
            return Gc(a);
        case "bigint":
            return String(xc(64, a));
        default:
            return Hc(a)
        }
    case 1024:
        switch (c) {
        case "string":
            return b = Ac(Number(a)),
            yc(b) ? a = ic(b) : (b = a.indexOf("."),
            b !== -1 && (a = a.substring(0, b)),
            a = Ib() ? ic(xc(64, BigInt(a))) : ic(Ic(a))),
            a;
        case "bigint":
            return ic(xc(64, a));
        default:
            return yc(a) ? ic(Jc(a)) : ic(Hc(a))
        }
    case 0:
        switch (c) {
        case "string":
            return Gc(a);
        case "bigint":
            return ic(xc(64, a));
        default:
            return Jc(a)
        }
    default:
        return ya(b, "Unknown format requested type for int64")
    }
}
function Ic(a) {
    var b = a.length;
    if (a[0] === "-" ? b < 20 || b === 20 && a <= "-9223372036854775808" : b < 19 || b === 19 && a <= "9223372036854775807")
        return a;
    if (a.length < 16)
        sc(Number(a));
    else if (Ib())
        a = BigInt(a),
        E = Number(a & BigInt(4294967295)) >>> 0,
        qc = Number(a >> BigInt(32) & BigInt(4294967295));
    else {
        b = +(a[0] === "-");
        qc = E = 0;
        let c = a.length;
        for (let d = 0 + b, e = (c - b) % 6 + b; e <= c; d = e,
        e += 6) {
            let f = Number(a.slice(d, e));
            qc *= 1E6;
            E = E * 1E6 + f;
            E >= 4294967296 && (qc += Math.trunc(E / 4294967296),
            qc >>>= 0,
            E >>>= 0)
        }
        if (b) {
            let[d,e] = tc(E, qc);
            E = d;
            qc = e
        }
    }
    return wc()
}
function Jc(a) {
    Dc(a);
    a = Ac(a);
    if (!yc(a)) {
        sc(a);
        var b = E
          , c = qc;
        if (a = c & 2147483648)
            b = ~b + 1 >>> 0,
            c = ~c >>> 0,
            b == 0 && (c = c + 1 >>> 0);
        let d = c * 4294967296 + (b >>> 0);
        b = Number.isSafeInteger(d) ? d : uc(b, c);
        a = typeof b === "number" ? a ? -b : b : a ? "-" + b : b
    }
    return a
}
function Hc(a) {
    Dc(a);
    a = Ac(a);
    yc(a) ? a = String(a) : (sc(a),
    a = wc());
    return a
}
function Gc(a) {
    Dc(a);
    var b = Ac(Number(a));
    if (yc(b))
        return String(b);
    b = a.indexOf(".");
    b !== -1 && (a = a.substring(0, b));
    return Ic(a)
}
function Kc(a) {
    if (a != null && typeof a !== "string")
        throw Error();
    return a
}
function Lc(a) {
    return a == null || typeof a === "string" ? a : void 0
}
function Mc(a, b) {
    if (!(a instanceof b))
        throw Error(`Expected instanceof ${Bc(b)} but got ${a && Bc(a.constructor)}`);
    return a
}
function Oc(a, b, c) {
    if (a != null && a[Qb] === Wb)
        return a;
    if (Array.isArray(a)) {
        var d = a[C] | 0;
        c = d | c & 32 | c & 2;
        c !== d && D(a, c);
        return new b(a)
    }
}
;function Pc(a) {
    return a
}
;function Qc(a) {
    var b = pa(Nb);
    return b ? a[b] : void 0
}
function Rc(a, b) {
    for (let c in a)
        !isNaN(c) && b(a, +c, a[c])
}
function Sc(a) {
    var b = new Tc;
    Rc(a, (c, d, e) => {
        b[d] = Array.prototype.slice.call(e)
    }
    );
    b.h = a.h;
    return b
}
var Tc = class {
}
;
function Uc(a, b) {
    b < 100 || Hb(Ob, 1)
}
;function Vc(a, b, c, d) {
    var e = d !== void 0;
    d = !!d;
    var f = pa(Nb), g;
    !e && Jb && f && (g = a[f]) && Rc(g, Uc);
    f = [];
    var h = a.length;
    g = 4294967295;
    var k = !1
      , l = !!(b & 64)
      , m = l ? b & 128 ? 0 : -1 : void 0;
    if (!(b & 1)) {
        var p = h && a[h - 1];
        p != null && typeof p === "object" && p.constructor === Object ? (h--,
        g = h) : p = void 0;
        if (l && !(b & 128) && !e) {
            k = !0;
            var q;
            g = ((q = Wc) != null ? q : Pc)(g - m, m, a, p, void 0) + m
        }
    }
    b = void 0;
    for (q = 0; q < h; q++) {
        let r = a[q];
        if (r != null && (r = c(r, d)) != null)
            if (l && q >= g) {
                let w = q - m;
                var n = void 0;
                ((n = b) != null ? n : b = {})[w] = r
            } else
                f[q] = r
    }
    if (p)
        for (let r in p) {
            n = p[r];
            if (n == null || (n = c(n, d)) == null)
                continue;
            h = +r;
            let w;
            if (l && !Number.isNaN(h) && (w = h + m) < g)
                f[w] = n;
            else {
                let x;
                ((x = b) != null ? x : b = {})[r] = n
            }
        }
    b && (k ? f.push(b) : f[g] = b);
    e && pa(Nb) && (a = Qc(a)) && a instanceof Tc && (f[Nb] = Sc(a));
    return f
}
function Xc(a) {
    switch (typeof a) {
    case "number":
        return Number.isFinite(a) ? a : "" + a;
    case "bigint":
        return oc(a) ? Number(a) : "" + a;
    case "boolean":
        return a ? 1 : 0;
    case "object":
        if (Array.isArray(a)) {
            var b = a[C] | 0;
            return a.length === 0 && b & 1 ? void 0 : Vc(a, b, Xc)
        }
        if (a != null && a[Qb] === Wb)
            return Yc(a);
        if (a instanceof Cb) {
            let e = a.h;
            if (e == null)
                a = "";
            else if (typeof e === "string")
                a = e;
            else {
                if (ub) {
                    b = "";
                    for (var c = 0, d = e.length - 10240; c < d; )
                        b += String.fromCharCode.apply(null, e.subarray(c, c += 10240));
                    b += String.fromCharCode.apply(null, c ? e.subarray(c) : e);
                    b = btoa(b)
                } else
                    b = pb(e);
                a = a.h = b
            }
            return a
        }
        return
    }
    return a
}
let Wc;
function Yc(a) {
    a = a.A;
    return Vc(a, a[C] | 0, Xc)
}
;let Zc, $c;
function ad(a) {
    switch (typeof a) {
    case "boolean":
        return Zc || (Zc = [0, void 0, !0]);
    case "number":
        return a > 0 ? void 0 : a === 0 ? $c || ($c = [0, void 0]) : [-a, void 0];
    case "string":
        return [0, a];
    case "object":
        return a
    }
}
function bd(a, b) {
    return cd(a, b[0], b[1])
}
function cd(a, b, c, d=0) {
    if (a == null) {
        var e = 32;
        c ? (a = [c],
        e |= 128) : a = [];
        b && (e = e & -16760833 | (b & 1023) << 14)
    } else {
        if (!Array.isArray(a))
            throw Error("narr");
        e = a[C] | 0;
        if (bb && 1 & e)
            throw Error("rfarr");
        2048 & e && !(2 & e) && dd();
        if (e & 256)
            throw Error("farr");
        if (e & 64)
            return (e | d) !== e && D(a, e | d),
            a;
        if (c && (e |= 128,
        c !== a[0]))
            throw Error("mid");
        a: {
            c = a;
            e |= 64;
            var f = c.length;
            if (f) {
                var g = f - 1;
                let k = c[g];
                if (k != null && typeof k === "object" && k.constructor === Object) {
                    b = e & 128 ? 0 : -1;
                    g -= b;
                    if (g >= 1024)
                        throw Error("pvtlmt");
                    for (var h in k)
                        f = +h,
                        f < g && (c[f + b] = k[h],
                        delete k[h]);
                    e = e & -16760833 | (g & 1023) << 14;
                    break a
                }
            }
            if (b) {
                h = Math.max(b, f - (e & 128 ? 0 : -1));
                if (h > 1024)
                    throw Error("spvt");
                e = e & -16760833 | (h & 1023) << 14
            }
        }
    }
    D(a, e | 64 | d);
    return a
}
function dd() {
    if (bb)
        throw Error("carr");
    Hb(Pb, 5)
}
;function ed(a, b) {
    if (typeof a !== "object")
        return a;
    if (Array.isArray(a)) {
        var c = a[C] | 0;
        a.length === 0 && c & 1 ? a = void 0 : c & 2 || (!b || 4096 & c || 16 & c ? a = fd(a, c, !1, b && !(c & 16)) : (Vb(a, 34),
        c & 4 && Object.freeze(a)));
        return a
    }
    if (a != null && a[Qb] === Wb)
        return b = a.A,
        c = b[C] | 0,
        Xb(a, c) ? a : gd(a, b, c) ? hd(a, b) : fd(b, c);
    if (a instanceof Cb)
        return a
}
function hd(a, b, c) {
    a = new a.constructor(b);
    c && (a.h = Yb);
    a.i = Yb;
    return a
}
function fd(a, b, c, d) {
    d != null || (d = !!(34 & b));
    a = Vc(a, b, ed, d);
    d = 32;
    c && (d |= 2);
    b = b & 16769217 | d;
    D(a, b);
    return a
}
function id(a) {
    var b = a.A
      , c = b[C] | 0;
    return Xb(a, c) ? gd(a, b, c) ? hd(a, b, !0) : new a.constructor(fd(b, c, !1)) : a
}
function jd(a) {
    if (a.h !== Yb)
        return !1;
    var b = a.A;
    b = fd(b, b[C] | 0);
    Vb(b, 2048);
    a.A = b;
    a.h = void 0;
    a.i = void 0;
    return !0
}
function kd(a) {
    if (!jd(a) && Xb(a, a.A[C] | 0))
        throw Error();
}
function ld(a, b) {
    b === void 0 && (b = a[C] | 0);
    b & 32 && !(b & 4096) && D(a, b | 4096)
}
function gd(a, b, c) {
    return c & 2 ? !0 : c & 32 && !(c & 4096) ? (D(b, c | 2),
    a.h = Yb,
    !0) : !1
}
;const md = {};
function F(a, b, c, d) {
    Object.isExtensible(a);
    b = nd(a.A, b, c);
    if (b !== null || d && a.i !== Yb)
        return b
}
function nd(a, b, c, d) {
    if (b === -1)
        return null;
    var e = b + (c ? 0 : -1)
      , f = a.length - 1;
    if (!(f < 1 + (c ? 0 : -1))) {
        if (e >= f) {
            var g = a[f];
            if (g != null && typeof g === "object" && g.constructor === Object) {
                c = g[b];
                var h = !0
            } else if (e === f)
                c = g;
            else
                return
        } else
            c = a[e];
        if (d && c != null) {
            d = d(c);
            if (d == null)
                return d;
            if (!Object.is(d, c))
                return h ? g[b] = d : a[e] = d,
                d
        }
        return c
    }
}
function od(a, b, c) {
    kd(a);
    var d = a.A;
    pd(d, d[C] | 0, b, c);
    return a
}
function pd(a, b, c, d, e) {
    var f = c + (e ? 0 : -1)
      , g = a.length - 1;
    if (g >= 1 + (e ? 0 : -1) && f >= g) {
        let h = a[g];
        if (h != null && typeof h === "object" && h.constructor === Object)
            return h[c] = d,
            b
    }
    if (f <= g)
        return a[f] = d,
        b;
    if (d !== void 0) {
        let h;
        g = ((h = b) != null ? h : b = a[C] | 0) >> 14 & 1023 || 536870912;
        c >= g ? d != null && (a[g + (e ? 0 : -1)] = {
            [c]: d
        }) : a[f] = d
    }
    return b
}
function qd(a, b, c) {
    a = nd(a, b, c);
    return Array.isArray(a) ? a : Tb
}
function rd(a, b) {
    2 & b && (a |= 2);
    return a | 1
}
function sd(a) {
    return !!(2 & a) && !!(4 & a) || !!(256 & a)
}
function td(a, b, c, d) {
    kd(a);
    var e = a.A
      , f = e[C] | 0;
    if (d == null) {
        var g = ud(e);
        if (vd(g, e, f, c) === b)
            g.set(c, 0);
        else
            return a
    } else {
        b === 0 || c.includes(b);
        g = ud(e);
        let h = vd(g, e, f, c);
        h !== b && (h && (f = pd(e, f, h)),
        g.set(c, b))
    }
    pd(e, f, b, d);
    return a
}
function ud(a) {
    if (Jb) {
        var b;
        return (b = a[Mb]) != null ? b : a[Mb] = new Map
    }
    if (Mb in a)
        return a[Mb];
    b = new Map;
    Object.defineProperty(a, Mb, {
        value: b
    });
    return b
}
function vd(a, b, c, d) {
    var e = a.get(d);
    if (e != null)
        return e;
    e = 0;
    for (let f = 0; f < d.length; f++) {
        let g = d[f];
        nd(b, g) != null && (e !== 0 && (c = pd(b, c, e)),
        e = g)
    }
    a.set(d, e);
    return e
}
function wd(a, b, c) {
    var d = a[C] | 0
      , e = d & 128 ? $b : void 0
      , f = nd(a, c, e);
    if (f != null && f[Qb] === Wb) {
        if (!Xb(f))
            return jd(f),
            f.A;
        var g = f.A
    } else
        Array.isArray(f) && (g = f);
    if (g) {
        let h = g[C] | 0;
        h & 2 && (g = fd(g, h))
    }
    g = bd(g, b);
    g !== f && pd(a, d, c, g, e);
    return g
}
function xd(a, b, c, d, e) {
    var f = !1;
    d = nd(a, d, e, g => {
        var h = Oc(g, c, b);
        f = h !== g && h != null;
        return h
    }
    );
    if (d != null)
        return f && !Xb(d) && ld(a, b),
        d
}
function yd(a, b, c, d) {
    var e = a.A
      , f = e[C] | 0;
    b = xd(e, f, b, c, d);
    if (b == null)
        return b;
    f = e[C] | 0;
    if (!Xb(a, f)) {
        let g = id(b);
        g !== b && (jd(a) && (e = a.A,
        f = e[C] | 0),
        b = g,
        f = pd(e, f, c, b, d),
        ld(e, f))
    }
    return b
}
function zd(a, b, c, d, e, f, g, h) {
    var k = Xb(a, c);
    f = k ? 1 : f || 4;
    g = !!g || f === 3;
    k = h && !k;
    (f === 2 || k) && jd(a) && (b = a.A,
    c = b[C] | 0);
    h = qd(b, e);
    var l = h === Tb ? 7 : h[C] | 0
      , m = rd(l, c);
    if (a = !(4 & m)) {
        var p = h
          , q = c;
        let n = !!(2 & m);
        n && (q |= 2);
        let r = !n
          , w = !0
          , x = 0
          , A = 0;
        for (; x < p.length; x++) {
            let T = Oc(p[x], d, q);
            if (T instanceof d) {
                if (!n) {
                    let ea = Xb(T);
                    r && (r = !ea);
                    w && (w = ea)
                }
                p[A++] = T
            }
        }
        A < x && (p.length = A);
        m |= 4;
        m = w ? m & -4097 : m | 4096;
        m = r ? m | 8 : m & -9
    }
    m !== l && (D(h, m),
    2 & m && Object.freeze(h));
    if (k && !(8 & m || !h.length && (f === 1 || (f !== 4 ? 0 : 2 & m || !(16 & m) && 32 & c)))) {
        sd(m) && (h = Array.prototype.slice.call(h),
        m = Ad(m, c),
        c = pd(b, c, e, h));
        d = h;
        k = m;
        for (l = 0; l < d.length; l++)
            p = d[l],
            m = id(p),
            p !== m && (d[l] = m);
        k |= 8;
        m = k = d.length ? k | 4096 : k & -4097;
        D(h, m)
    }
    k = d = m;
    f === 1 || (f !== 4 ? 0 : 2 & d || !(16 & d) && 32 & c) ? sd(d) || (d |= !h.length || a && !(4096 & d) || 32 & c && !(4096 & d || 16 & d) ? 2 : 256,
    d !== k && D(h, d),
    Object.freeze(h)) : (f === 2 && sd(d) && (h = Array.prototype.slice.call(h),
    k = 0,
    d = Ad(d, c),
    c = pd(b, c, e, h)),
    sd(d) || (g || (d |= 16),
    d !== k && D(h, d)));
    2 & d || !(4096 & d || 16 & d) || ld(b, c);
    return h
}
function G(a, b, c, d) {
    d != null ? Mc(d, b) : d = void 0;
    od(a, c, d);
    d && !Xb(d) && ld(a.A);
    return a
}
function Ad(a, b) {
    var c;
    2 & b ? c = a | 2 : c = a & -3;
    a = c;
    return a & -273
}
function Bd(a, b, c, d) {
    var e = d;
    kd(a);
    d = a.A;
    a = zd(a, d, d[C] | 0, c, b, 2, !0);
    e = e != null ? Mc(e, c) : new c;
    a.push(e);
    b = c = a === Tb ? 7 : a[C] | 0;
    (e = Xb(e)) ? (c &= -9,
    a.length === 1 && (c &= -4097)) : c |= 4096;
    c !== b && D(a, c);
    e || ld(d)
}
function Cd(a, b, c="", d) {
    var e;
    return (e = Lc(F(a, b, d))) != null ? e : c
}
function Dd(a, b) {
    var c = Ed;
    var d = a.A;
    c = vd(ud(d), d, void 0, c);
    return Lc(F(a, c === b ? b : -1, void 0, md))
}
function Fd(a, b, c) {
    if (c != null) {
        if (typeof c !== "number")
            throw Gb("int32");
        if (!zc(c))
            throw Gb("int32");
        c |= 0
    }
    od(a, b, c)
}
function H(a, b, c) {
    return od(a, b, Kc(c))
}
function Gd(a, b, c) {
    if (c != null) {
        if (!zc(c))
            throw Gb("enum");
        c |= 0
    }
    return od(a, b, c)
}
;var Hd = class {
    constructor(a, b, c) {
        this.buffer = a;
        if (c && !b)
            throw Error();
        this.h = b
    }
}
;
function Id(a, b) {
    if (typeof a === "string")
        return new Hd(yb(a),b);
    if (Array.isArray(a))
        return new Hd(new Uint8Array(a),b);
    if (a.constructor === Uint8Array)
        return new Hd(a,!1);
    if (a.constructor === ArrayBuffer)
        return a = new Uint8Array(a),
        new Hd(a,!1);
    if (a.constructor === Cb)
        return b = Db(a) || new Uint8Array(0),
        new Hd(b,!0,a);
    if (a instanceof Uint8Array)
        return a = a.constructor === Uint8Array ? a : new Uint8Array(a.buffer,a.byteOffset,a.byteLength),
        new Hd(a,!1);
    throw Error();
}
;function Jd(a) {
    var b = a.i
      , c = a.h
      , d = b[c++]
      , e = d & 127;
    if (d & 128 && (d = b[c++],
    e |= (d & 127) << 7,
    d & 128 && (d = b[c++],
    e |= (d & 127) << 14,
    d & 128 && (d = b[c++],
    e |= (d & 127) << 21,
    d & 128 && (d = b[c++],
    e |= d << 28,
    d & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128)))))
        throw Error();
    Kd(a, c);
    return e
}
function Kd(a, b) {
    a.h = b;
    if (b > a.j)
        throw Error();
}
function Ld(a, b) {
    if (b < 0)
        throw Error();
    var c = a.h;
    b = c + b;
    if (b > a.j)
        throw Error();
    a.h = b;
    return c
}
var Md = class {
    constructor(a, b, c, d) {
        this.i = null;
        this.m = !1;
        this.h = this.j = this.l = 0;
        this.init(a, b, c, d)
    }
    init(a, b, c, {da: d=!1, qa: e=!1}={}) {
        this.da = d;
        this.qa = e;
        a && (a = Id(a, this.qa),
        this.i = a.buffer,
        this.m = a.h,
        this.l = b || 0,
        this.j = c !== void 0 ? this.l + c : this.i.length,
        this.h = this.l)
    }
    clear() {
        this.i = null;
        this.m = !1;
        this.h = this.j = this.l = 0;
        this.da = !1
    }
    reset() {
        this.h = this.l
    }
}
  , Nd = [];
let Od = 0;
function Pd(a, b, c, d) {
    if (Qd.length) {
        let e = Qd.pop();
        Rd(e, d);
        e.h.init(a, b, c, d);
        return e
    }
    return new Sd(a,b,c,d)
}
function Rd(a, {wa: b=!1}={}) {
    a.wa = b
}
function Td(a) {
    a.h.clear();
    a.j = -1;
    a.i = -1;
    Qd.length < 100 && Qd.push(a)
}
function Ud(a) {
    var b = a.h;
    if (b.h == b.j)
        return !1;
    a.l = a.h.h;
    var c = Jd(a.h) >>> 0;
    b = c >>> 3;
    c &= 7;
    if (!(c >= 0 && c <= 5))
        throw Error();
    if (b < 1)
        throw Error();
    a.j = b;
    a.i = c;
    return !0
}
function Vd(a) {
    try {
        switch (a.i) {
        case 0:
            if (a.i != 0)
                Vd(a);
            else
                a: {
                    var b = a.h;
                    let h = b.h;
                    a = h + 10;
                    let k = b.i;
                    for (; h < a; )
                        if ((k[h++] & 128) === 0) {
                            Kd(b, h);
                            break a
                        }
                    throw Error();
                }
            break;
        case 1:
            var c = a.h;
            Kd(c, c.h + 8);
            break;
        case 2:
            if (a.i != 2)
                Vd(a);
            else {
                var d = Jd(a.h) >>> 0
                  , e = a.h;
                Kd(e, e.h + d)
            }
            break;
        case 5:
            var f = a.h;
            Kd(f, f.h + 4);
            break;
        case 3:
            Wd();
            let g = a.j;
            try {
                do {
                    if (!Ud(a))
                        throw Error();
                    if (a.i == 4) {
                        if (a.j != g)
                            throw Error();
                        break
                    }
                    Vd(a)
                } while (1)
            } catch (h) {
                if (h instanceof RangeError)
                    throw new SyntaxError;
                throw h;
            } finally {
                Od > 0 && Od--
            }
            break;
        default:
            throw Error();
        }
    } catch (g) {
        if (g instanceof RangeError)
            throw new SyntaxError;
        throw g;
    }
}
function Wd() {
    if (Od >= 100)
        throw new SyntaxError;
    Od++
}
function Xd(a, b, c) {
    var d = a.h.j
      , e = Jd(a.h) >>> 0;
    e = a.h.h + e;
    var f = e - d;
    f <= 0 && (a.h.j = e,
    c(b, a, void 0, void 0, void 0),
    f = e - a.h.h);
    if (f)
        throw Error();
    a.h.h = e;
    a.h.j = d
}
var Sd = class {
    constructor(a, b, c, d) {
        if (Nd.length) {
            let e = Nd.pop();
            e.init(a, b, c, d);
            a = e
        } else
            a = new Md(a,b,c,d);
        this.h = a;
        this.l = this.h.h;
        this.i = this.j = -1;
        Rd(this, d)
    }
    reset() {
        this.h.reset();
        this.l = this.h.h;
        this.i = this.j = -1
    }
}
  , Qd = [];
function Yd() {
    var a = class {
        constructor() {
            throw Error();
        }
    }
    ;
    Object.setPrototypeOf(a, a.prototype);
    return a
}
var Zd = Yd()
  , $d = Yd();
var I = class {
    constructor(a, b, c) {
        this.A = cd(a, b, c, 2048)
    }
    toJSON() {
        return Yc(this)
    }
    clone() {
        var a = this.A
          , b = a[C] | 0;
        return gd(this, a, b) ? hd(this, a, !0) : new this.constructor(fd(a, b, !1))
    }
}
;
I.prototype[Qb] = Wb;
var ae = class {
    constructor(a, b) {
        this.ba = a;
        a = pa(Zd);
        this.h = !!a && b === a || !1
    }
}
;
const be = new ae(function(a, b, c, d, e) {
    if (a.i !== 2)
        return !1;
    Xd(a, wd(b, d, c), e);
    return !0
}
,Zd)
  , ce = new ae(function(a, b, c, d, e) {
    if (a.i !== 2)
        return !1;
    Xd(a, wd(b, d, c), e);
    return !0
}
,Zd);
var de = Symbol()
  , ee = Symbol()
  , fe = Symbol();
let ge, he;
function ie(a) {
    var b = je
      , c = ke
      , d = a[de];
    if (d)
        return d;
    d = {};
    d.La = a;
    d.la = ad(a[0]);
    var e = a[1]
      , f = 1;
    e && e.constructor === Object && (d.extensions = e,
    e = a[++f],
    typeof e === "function" && (d.bb = !0,
    ge != null || (ge = e),
    he != null || (he = a[f + 1]),
    e = a[f += 2]));
    for (var g = {}; e && Array.isArray(e) && e.length && typeof e[0] === "number" && e[0] > 0; ) {
        for (var h = 0; h < e.length; h++)
            g[e[h]] = e;
        e = a[++f]
    }
    for (h = 1; e !== void 0; ) {
        typeof e === "number" && (h += e,
        e = a[++f]);
        let m;
        var k = void 0;
        e instanceof ae ? m = e : (m = be,
        f--);
        let p;
        if ((p = m) == null ? 0 : p.h) {
            e = a[++f];
            k = a;
            var l = f;
            typeof e === "function" && (e = e(),
            k[l] = e);
            k = e
        }
        e = a[++f];
        l = h + 1;
        typeof e === "number" && e < 0 && (l -= e,
        e = a[++f]);
        for (; h < l; h++) {
            let q = g[h];
            k ? c(d, h, m, k, q) : b(d, h, m, q)
        }
    }
    return a[de] = d
}
;function je(a, b, c, d) {
    var e = c.ba;
    a[b] = d ? (f, g, h) => e(f, g, h, d) : e
}
function ke(a, b, c, d, e) {
    var f = c.ba, g, h;
    a[b] = (k, l, m) => f(k, l, m, h || (h = ie(d).la), g || (g = le(d)), e)
}
function le(a) {
    var b = a[ee];
    if (b != null)
        return b;
    var c = ie(a);
    b = c.bb ? (d, e) => ge(d, e, c) : (d, e) => {
        a: {
            Wd();
            try {
                for (; Ud(e) && e.i != 4; ) {
                    let A = e.j
                      , T = c[A];
                    if (T == null) {
                        let ea = c.extensions;
                        if (ea) {
                            let Nc = ea[A];
                            if (Nc) {
                                let Ua = me(Nc);
                                Ua != null && (T = c[A] = Ua)
                            }
                        }
                    }
                    if (T == null || !T(e, d, A)) {
                        var f = e;
                        let ea = f.l;
                        Vd(f);
                        if (f.wa)
                            var g = void 0;
                        else {
                            let Nc = f.h.h - ea;
                            f.h.h = ea;
                            c: {
                                var h = f.h
                                  , k = Nc;
                                if (k == 0) {
                                    g = Ab();
                                    break c
                                }
                                let Ua = Ld(h, k);
                                if (h.da && h.m)
                                    var l = h.i.subarray(Ua, Ua + k);
                                else {
                                    var m = h.i;
                                    f = Ua;
                                    k = Ua + k;
                                    l = f === k ? new Uint8Array(0) : pc ? m.slice(f, k) : new Uint8Array(m.subarray(f, k))
                                }
                                f = l;
                                g = f.length == 0 ? Ab() : new Cb(f,zb)
                            }
                        }
                        var p = k = f = void 0
                          , q = d
                          , n = A
                          , r = g;
                        r && ((f = (k = (p = q[Nb]) != null ? p : q[Nb] = new Tc)[n]) != null ? f : k[n] = []).push(r)
                    }
                }
                let x = Qc(d);
                x && (x.h = c.La[fe]);
                var w = !0;
                break a
            } catch (x) {
                if (x instanceof RangeError)
                    throw new SyntaxError;
                throw x;
            } finally {
                Od > 0 && Od--
            }
            w = void 0
        }
        return w
    }
    ;
    a[ee] = b;
    a[fe] = ne.bind(a);
    return b
}
function ne(a, b, c, d) {
    var e = this[de]
      , f = this[ee]
      , g = bd(void 0, e.la)
      , h = Qc(a);
    if (h) {
        var k = !1
          , l = e.extensions;
        if (l) {
            e = (m, p, q) => {
                if (q.length !== 0)
                    if (l[p])
                        for (let n of q) {
                            m = Pd(n);
                            try {
                                k = !0,
                                f(g, m)
                            } finally {
                                Td(m)
                            }
                        }
                    else
                        d == null || d(a, p, q)
            }
            ;
            if (b == null)
                Rc(h, e);
            else if (h != null) {
                let m = h[b];
                m && e(h, b, m)
            }
            if (k) {
                let m = a[C] | 0;
                if (m & 2 && m & 2048 && (c == null || !c.ec))
                    throw Error();
                let p = m & 128 ? $b : void 0
                  , q = (n, r) => {
                    if (nd(a, n, p) != null)
                        switch (c == null ? void 0 : c.cc) {
                        case 1:
                            return;
                        default:
                            throw Error();
                        }
                    r != null && (m = pd(a, m, n, r, p));
                    delete h[n]
                }
                ;
                b == null ? Zb(g, g[C] | 0, (n, r) => {
                    q(n, r)
                }
                ) : q(b, nd(g, b, p))
            }
        }
    }
}
function me(a) {
    a = Array.isArray(a) ? a[0] instanceof ae ? a : [ce, a] : [a, void 0];
    var b = a[0].ba;
    if (a = a[1]) {
        let c = le(a)
          , d = ie(a).la;
        return (e, f, g) => b(e, f, g, d, c)
    }
    return b
}
;var oe;
oe = new ae(function(a, b, c) {
    if (a.i !== 2)
        return !1;
    var d = Jd(a.h) >>> 0;
    a = a.h;
    var e = Ld(a, d);
    a = a.i;
    if (Za) {
        var f = a, g;
        (g = Ya) || (g = Ya = new TextDecoder("utf-8",{
            fatal: !0
        }));
        d = e + d;
        f = e === 0 && d === f.length ? f : f.subarray(e, d);
        try {
            var h = g.decode(f)
        } catch (l) {
            if (Xa === void 0) {
                try {
                    g.decode(new Uint8Array([128]))
                } catch (m) {}
                try {
                    g.decode(new Uint8Array([97])),
                    Xa = !0
                } catch (m) {
                    Xa = !1
                }
            }
            !Xa && (Ya = void 0);
            throw l;
        }
    } else {
        h = e;
        d = h + d;
        e = [];
        let l = null;
        let m;
        for (; h < d; ) {
            var k = a[h++];
            k < 128 ? e.push(k) : k < 224 ? h >= d ? Va() : (m = a[h++],
            k < 194 || (m & 192) !== 128 ? (h--,
            Va()) : e.push((k & 31) << 6 | m & 63)) : k < 240 ? h >= d - 1 ? Va() : (m = a[h++],
            (m & 192) !== 128 || k === 224 && m < 160 || k === 237 && m >= 160 || ((g = a[h++]) & 192) !== 128 ? (h--,
            Va()) : e.push((k & 15) << 12 | (m & 63) << 6 | g & 63)) : k <= 244 ? h >= d - 2 ? Va() : (m = a[h++],
            (m & 192) !== 128 || (k << 28) + (m - 144) >> 30 !== 0 || ((g = a[h++]) & 192) !== 128 || ((f = a[h++]) & 192) !== 128 ? (h--,
            Va()) : (k = (k & 7) << 18 | (m & 63) << 12 | (g & 63) << 6 | f & 63,
            k -= 65536,
            e.push((k >> 10 & 1023) + 55296, (k & 1023) + 56320))) : Va();
            e.length >= 8192 && (l = Wa(l, e),
            e.length = 0)
        }
        h = Wa(l, e)
    }
    pd(b, b[C] | 0, c, h, (b[C] | 0) & 128 ? $b : void 0);
    return !0
}
,$d);
var pe = function(a, b, c=Zd) {
    return new ae(a,c)
}(function(a, b, c, d, e) {
    if (a.i !== 2)
        return !1;
    d = bd(void 0, d);
    var f = b[C] | 0;
    if (f & 2)
        throw Error();
    var g = f & 128 ? $b : void 0
      , h = qd(b, c, g)
      , k = h === Tb ? 7 : h[C] | 0
      , l = rd(k, f);
    if (2 & l || sd(l) || 16 & l)
        l === k || sd(l) || D(h, l),
        h = Array.prototype.slice.call(h),
        k = 0,
        l = Ad(l, f),
        pd(b, f, c, h, g);
    l &= -13;
    l !== k && D(h, l);
    h.push(d);
    Xd(a, d, e);
    return !0
}, function(a, b, c, d, e) {
    if (Array.isArray(b)) {
        for (let l = 0; l < b.length; l++) {
            var f = e
              , g = a
              , h = g.h;
            var k = b[l];
            k = k instanceof I ? k.A : Array.isArray(k) ? bd(k, d) : void 0;
            h.call(g, c, k, f)
        }
        a = b[C] | 0;
        a & 1 || D(b, a | 1)
    }
});
function qe() {}
;function re(a) {
    for (let b in a)
        return !1;
    return !0
}
function se(a) {
    if (!a || typeof a !== "object")
        return a;
    if (typeof a.clone === "function")
        return a.clone();
    if (typeof Map !== "undefined" && a instanceof Map)
        return new Map(a);
    if (typeof Set !== "undefined" && a instanceof Set)
        return new Set(a);
    if (a instanceof Date)
        return new Date(a.getTime());
    var b = Array.isArray(a) ? [] : typeof ArrayBuffer !== "function" || typeof ArrayBuffer.isView !== "function" || !ArrayBuffer.isView(a) || a instanceof DataView ? {} : new a.constructor(a.length);
    for (let c in a)
        b[c] = se(a[c]);
    return b
}
const te = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function ue(a, b) {
    for (let e = 1; e < arguments.length; e++) {
        var c = arguments[e];
        for (d in c)
            a[d] = c[d];
        for (let f = 0; f < te.length; f++) {
            var d = te[f];
            Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
        }
    }
}
;function ve(a) {
    if (!a)
        return "";
    if (/^about:(?:blank|srcdoc)$/.test(a))
        return window.origin || "";
    a.indexOf("blob:") === 0 && (a = a.substring(5));
    a = a.split("#")[0].split("?")[0];
    a = a.toLowerCase();
    a.indexOf("//") == 0 && (a = window.location.protocol + a);
    /^[\w\-]*:\/\//.test(a) || (a = window.location.href);
    var b = a.substring(a.indexOf("://") + 3)
      , c = b.indexOf("/");
    c != -1 && (b = b.substring(0, c));
    c = a.substring(0, a.indexOf("://"));
    if (!c)
        throw Error("URI is missing protocol: " + a);
    if (c !== "http" && c !== "https" && c !== "chrome-extension" && c !== "moz-extension" && c !== "file" && c !== "android-app" && c !== "chrome-search" && c !== "chrome-untrusted" && c !== "chrome" && c !== "app" && c !== "devtools")
        throw Error("Invalid URI scheme in origin: " + c);
    a = "";
    var d = b.indexOf(":");
    if (d != -1) {
        var e = b.substring(d + 1);
        b = b.substring(0, d);
        if (c === "http" && e !== "80" || c === "https" && e !== "443")
            a = ":" + e
    }
    return c + "://" + b + a
}
;function we() {
    function a() {
        e[0] = 1732584193;
        e[1] = 4023233417;
        e[2] = 2562383102;
        e[3] = 271733878;
        e[4] = 3285377520;
        m = l = 0
    }
    function b(p) {
        for (var q = g, n = 0; n < 64; n += 4)
            q[n / 4] = p[n] << 24 | p[n + 1] << 16 | p[n + 2] << 8 | p[n + 3];
        for (n = 16; n < 80; n++)
            p = q[n - 3] ^ q[n - 8] ^ q[n - 14] ^ q[n - 16],
            q[n] = (p << 1 | p >>> 31) & 4294967295;
        p = e[0];
        var r = e[1]
          , w = e[2]
          , x = e[3]
          , A = e[4];
        for (n = 0; n < 80; n++) {
            if (n < 40)
                if (n < 20) {
                    var T = x ^ r & (w ^ x);
                    var ea = 1518500249
                } else
                    T = r ^ w ^ x,
                    ea = 1859775393;
            else
                n < 60 ? (T = r & w | x & (r | w),
                ea = 2400959708) : (T = r ^ w ^ x,
                ea = 3395469782);
            T = ((p << 5 | p >>> 27) & 4294967295) + T + A + ea + q[n] & 4294967295;
            A = x;
            x = w;
            w = (r << 30 | r >>> 2) & 4294967295;
            r = p;
            p = T
        }
        e[0] = e[0] + p & 4294967295;
        e[1] = e[1] + r & 4294967295;
        e[2] = e[2] + w & 4294967295;
        e[3] = e[3] + x & 4294967295;
        e[4] = e[4] + A & 4294967295
    }
    function c(p, q) {
        if (typeof p === "string") {
            p = unescape(encodeURIComponent(p));
            for (var n = [], r = 0, w = p.length; r < w; ++r)
                n.push(p.charCodeAt(r));
            p = n
        }
        q || (q = p.length);
        n = 0;
        if (l == 0)
            for (; n + 64 < q; )
                b(p.slice(n, n + 64)),
                n += 64,
                m += 64;
        for (; n < q; )
            if (f[l++] = p[n++],
            m++,
            l == 64)
                for (l = 0,
                b(f); n + 64 < q; )
                    b(p.slice(n, n + 64)),
                    n += 64,
                    m += 64
    }
    function d() {
        var p = []
          , q = m * 8;
        l < 56 ? c(h, 56 - l) : c(h, 64 - (l - 56));
        for (var n = 63; n >= 56; n--)
            f[n] = q & 255,
            q >>>= 8;
        b(f);
        for (n = q = 0; n < 5; n++)
            for (var r = 24; r >= 0; r -= 8)
                p[q++] = e[n] >> r & 255;
        return p
    }
    for (var e = [], f = [], g = [], h = [128], k = 1; k < 64; ++k)
        h[k] = 0;
    var l, m;
    a();
    return {
        reset: a,
        update: c,
        digest: d,
        Sa: function() {
            for (var p = d(), q = "", n = 0; n < p.length; n++)
                q += "0123456789ABCDEF".charAt(Math.floor(p[n] / 16)) + "0123456789ABCDEF".charAt(p[n] % 16);
            return q
        }
    }
}
;function xe(a, b, c) {
    var d = String(v.location.href);
    return d && a && b ? [b, ye(ve(d), a, c || null)].join(" ") : null
}
function ye(a, b, c) {
    var d = []
      , e = [];
    if ((Array.isArray(c) ? 2 : 1) == 1)
        return e = [b, a],
        za(d, function(h) {
            e.push(h)
        }),
        ze(e.join(" "));
    var f = []
      , g = [];
    za(c, function(h) {
        g.push(h.key);
        f.push(h.value)
    });
    c = Math.floor((new Date).getTime() / 1E3);
    e = f.length == 0 ? [c, b, a] : [f.join(":"), c, b, a];
    za(d, function(h) {
        e.push(h)
    });
    a = ze(e.join(" "));
    a = [c, a];
    g.length == 0 || a.push(g.join(""));
    return a.join("_")
}
function ze(a) {
    var b = we();
    b.update(a);
    return b.Sa().toLowerCase()
}
;function Ae(a) {
    this.h = a || {
        cookie: ""
    }
}
t = Ae.prototype;
t.isEnabled = function() {
    if (!v.navigator.cookieEnabled)
        return !1;
    if (this.h.cookie)
        return !0;
    this.set("TESTCOOKIESENABLED", "1", {
        ja: 60
    });
    if (this.get("TESTCOOKIESENABLED") !== "1")
        return !1;
    this.remove("TESTCOOKIESENABLED");
    return !0
}
;
t.set = function(a, b, c) {
    var d = !1;
    if (typeof c === "object") {
        var e = c.sameSite;
        d = c.secure || !1;
        var f = c.domain || void 0;
        var g = c.path || void 0;
        var h = c.ja
    }
    if (/[;=\s]/.test(a))
        throw Error('Invalid cookie name "' + a + '"');
    if (/[;\r\n]/.test(b))
        throw Error('Invalid cookie value "' + b + '"');
    h === void 0 && (h = -1);
    this.h.cookie = a + "=" + b + (f ? ";domain=" + f : "") + (g ? ";path=" + g : "") + (h < 0 ? "" : h == 0 ? ";expires=" + (new Date(1970,1,1)).toUTCString() : ";expires=" + (new Date(Date.now() + h * 1E3)).toUTCString()) + (d ? ";secure" : "") + (e != null ? ";samesite=" + e : "")
}
;
t.get = function(a, b) {
    var c = a + "="
      , d = (this.h.cookie || "").split(";");
    for (let e = 0, f; e < d.length; e++) {
        f = sa(d[e]);
        if (f.lastIndexOf(c, 0) == 0)
            return f.slice(c.length);
        if (f == a)
            return ""
    }
    return b
}
;
t.remove = function(a, b, c) {
    var d = this.get(a) !== void 0;
    this.set(a, "", {
        ja: 0,
        path: b,
        domain: c
    });
    return d
}
;
t.ga = function() {
    return Be(this).values
}
;
t.clear = function() {
    var a = Be(this).keys;
    for (let b = a.length - 1; b >= 0; b--)
        this.remove(a[b])
}
;
function Be(a) {
    a = (a.h.cookie || "").split(";");
    var b = []
      , c = [];
    for (let f = 0; f < a.length; f++) {
        var d = sa(a[f]);
        var e = d.indexOf("=");
        e == -1 ? (b.push(""),
        c.push(d)) : (b.push(d.substring(0, e)),
        c.push(d.substring(e + 1)))
    }
    return {
        keys: b,
        values: c
    }
}
var Ce = new Ae(typeof document == "undefined" ? null : document);
function De() {
    var a = v.__SAPISID || v.__APISID || v.__3PSAPISID || v.__1PSAPISID || v.__OVERRIDE_SID;
    if (a)
        return !0;
    typeof document !== "undefined" && (a = new Ae(document),
    a = a.get("SAPISID") || a.get("APISID") || a.get("__Secure-3PAPISID") || a.get("__Secure-1PAPISID"));
    return !!a
}
function Ee(a, b, c, d) {
    (a = v[a]) || typeof document === "undefined" || (a = (new Ae(document)).get(b));
    return a ? xe(a, c, d) : null
}
;var Fe = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? a => a && AsyncContext.Snapshot.wrap(a) : a => a;
function Ge() {
    this.l = this.l;
    this.j = this.j
}
Ge.prototype.l = !1;
Ge.prototype.dispose = function() {
    this.l || (this.l = !0,
    this.R())
}
;
Ge.prototype[Symbol.dispose] = function() {
    this.dispose()
}
;
Ge.prototype.addOnDisposeCallback = function(a, b) {
    this.l ? b !== void 0 ? a.call(b) : a() : (this.j || (this.j = []),
    b && (a = a.bind(b)),
    this.j.push(a))
}
;
Ge.prototype.R = function() {
    if (this.j)
        for (; this.j.length; )
            this.j.shift()()
}
;
function He(a, b) {
    a.l(b);
    a.i < 100 && (a.i++,
    b.next = a.h,
    a.h = b)
}
class Ie {
    constructor(a, b) {
        this.j = a;
        this.l = b;
        this.i = 0;
        this.h = null
    }
    get() {
        if (this.i > 0) {
            this.i--;
            var a = this.h;
            this.h = a.next;
            a.next = null
        } else
            a = this.j();
        return a
    }
}
;class Je {
    constructor() {
        this.i = this.h = null
    }
    add(a, b) {
        var c = Ke.get();
        c.set(a, b);
        this.i ? this.i.next = c : this.h = c;
        this.i = c
    }
    remove() {
        var a = null;
        this.h && (a = this.h,
        this.h = this.h.next,
        this.h || (this.i = null),
        a.next = null);
        return a
    }
}
var Ke = new Ie( () => new Le,a => a.reset());
class Le {
    constructor() {
        this.next = this.scope = this.h = null
    }
    set(a, b) {
        this.h = a;
        this.scope = b;
        this.next = null
    }
    reset() {
        this.next = this.scope = this.h = null
    }
}
;let Me, Ne = !1, Oe = new Je, Qe = (a, b) => {
    Me || Pe();
    Ne || (Me(),
    Ne = !0);
    Oe.add(a, b)
}
, Pe = () => {
    var a = Promise.resolve(void 0);
    Me = () => {
        a.then(Re)
    }
}
;
function Re() {
    for (var a; a = Oe.remove(); ) {
        try {
            a.h.call(a.scope)
        } catch (b) {
            $a(b)
        }
        He(Ke, a)
    }
    Ne = !1
}
;function Se(a) {
    this.h = 0;
    this.v = void 0;
    this.l = this.i = this.j = null;
    this.m = this.o = !1;
    if (a != qe)
        try {
            let b = this;
            a.call(void 0, function(c) {
                Te(b, 2, c)
            }, function(c) {
                Te(b, 3, c)
            })
        } catch (b) {
            Te(this, 3, b)
        }
}
function Ue() {
    this.next = this.context = this.i = this.j = this.h = null;
    this.l = !1
}
Ue.prototype.reset = function() {
    this.context = this.i = this.j = this.h = null;
    this.l = !1
}
;
var Ve = new Ie(function() {
    return new Ue
}
,function(a) {
    a.reset()
}
);
function We(a, b, c) {
    var d = Ve.get();
    d.j = a;
    d.i = b;
    d.context = c;
    return d
}
function Xe(a) {
    if (a instanceof Se)
        return a;
    var b = new Se(qe);
    Te(b, 2, a);
    return b
}
Se.prototype.then = function(a, b, c) {
    return Ye(this, Fe(typeof a === "function" ? a : null), Fe(typeof b === "function" ? b : null), c)
}
;
Se.prototype.$goog_Thenable = !0;
t = Se.prototype;
t.rb = function(a, b) {
    return Ye(this, null, Fe(a), b)
}
;
t.catch = Se.prototype.rb;
t.cancel = function(a) {
    if (this.h == 0) {
        let b = new Ze(a);
        Qe(function() {
            $e(this, b)
        }, this)
    }
}
;
function $e(a, b) {
    if (a.h == 0)
        if (a.j) {
            var c = a.j;
            if (c.i) {
                var d = 0
                  , e = null
                  , f = null;
                for (let g = c.i; g && (g.l || (d++,
                g.h == a && (e = g),
                !(e && d > 1))); g = g.next)
                    e || (f = g);
                e && (c.h == 0 && d == 1 ? $e(c, b) : (f ? (d = f,
                d.next == c.l && (c.l = d),
                d.next = d.next.next) : af(c),
                bf(c, e, 3, b)))
            }
            a.j = null
        } else
            Te(a, 3, b)
}
function cf(a, b) {
    a.i || a.h != 2 && a.h != 3 || df(a);
    a.l ? a.l.next = b : a.i = b;
    a.l = b
}
function Ye(a, b, c, d) {
    var e = We(null, null, null);
    e.h = new Se(function(f, g) {
        e.j = b ? function(h) {
            try {
                let k = b.call(d, h);
                f(k)
            } catch (k) {
                g(k)
            }
        }
        : f;
        e.i = c ? function(h) {
            try {
                let k = c.call(d, h);
                k === void 0 && h instanceof Ze ? g(h) : f(k)
            } catch (k) {
                g(k)
            }
        }
        : g
    }
    );
    e.h.j = a;
    cf(a, e);
    return e.h
}
t.sb = function(a) {
    this.h = 0;
    Te(this, 2, a)
}
;
t.tb = function(a) {
    this.h = 0;
    Te(this, 3, a)
}
;
function Te(a, b, c) {
    if (a.h == 0) {
        a === c && (b = 3,
        c = new TypeError("Promise cannot resolve to itself"));
        a.h = 1;
        a: {
            var d = c
              , e = a.sb
              , f = a.tb;
            if (d instanceof Se) {
                cf(d, We(e || qe, f || null, a));
                var g = !0
            } else {
                if (d)
                    try {
                        var h = !!d.$goog_Thenable
                    } catch (k) {
                        h = !1
                    }
                else
                    h = !1;
                if (h)
                    d.then(e, f, a),
                    g = !0;
                else {
                    h = typeof d;
                    if (h == "object" && d != null || h == "function")
                        try {
                            let k = d.then;
                            if (typeof k === "function") {
                                ef(d, k, e, f, a);
                                g = !0;
                                break a
                            }
                        } catch (k) {
                            f.call(a, k);
                            g = !0;
                            break a
                        }
                    g = !1
                }
            }
        }
        g || (a.v = c,
        a.h = b,
        a.j = null,
        df(a),
        b != 3 || c instanceof Ze || ff(a, c))
    }
}
function ef(a, b, c, d, e) {
    function f(k) {
        h || (h = !0,
        d.call(e, k))
    }
    function g(k) {
        h || (h = !0,
        c.call(e, k))
    }
    var h = !1;
    try {
        b.call(a, g, f)
    } catch (k) {
        f(k)
    }
}
function df(a) {
    a.o || (a.o = !0,
    Qe(a.Ua, a))
}
function af(a) {
    var b = null;
    a.i && (b = a.i,
    a.i = b.next,
    b.next = null);
    a.i || (a.l = null);
    return b
}
t.Ua = function() {
    for (var a; a = af(this); )
        bf(this, a, this.h, this.v);
    this.o = !1
}
;
function bf(a, b, c, d) {
    if (c == 3 && b.i && !b.l)
        for (; a && a.m; a = a.j)
            a.m = !1;
    if (b.h)
        b.h.j = null,
        gf(b, c, d);
    else
        try {
            b.l ? b.j.call(b.context) : gf(b, c, d)
        } catch (e) {
            hf.call(null, e)
        }
    He(Ve, b)
}
function gf(a, b, c) {
    b == 2 ? a.j.call(a.context, c) : a.i && a.i.call(a.context, c)
}
function ff(a, b) {
    a.m = !0;
    Qe(function() {
        a.m && hf.call(null, b)
    })
}
var hf = $a;
function Ze(a) {
    ra.call(this, a)
}
qa(Ze, ra);
Ze.prototype.name = "cancel";
const jf = self;
class kf {
    constructor() {
        this.promise = new Promise( (a, b) => {
            this.resolve = a;
            this.reject = b
        }
        )
    }
}
;function lf(a) {
    Ge.call(this);
    this.v = 1;
    this.m = [];
    this.o = 0;
    this.h = [];
    this.i = {};
    this.D = !!a
}
qa(lf, Ge);
t = lf.prototype;
t.subscribe = function(a, b, c) {
    var d = this.i[a];
    d || (d = this.i[a] = []);
    var e = this.v;
    this.h[e] = a;
    this.h[e + 1] = b;
    this.h[e + 2] = c;
    this.v = e + 3;
    d.push(e);
    return e
}
;
t.unsubscribe = function(a, b, c) {
    if (a = this.i[a]) {
        let d = this.h;
        if (a = a.find(function(e) {
            return d[e + 1] == b && d[e + 2] == c
        }))
            return this.aa(a)
    }
    return !1
}
;
t.aa = function(a) {
    var b = this.h[a];
    if (b) {
        let c = this.i[b];
        this.o != 0 ? (this.m.push(a),
        this.h[a + 1] = () => {}
        ) : (c && Ba(c, a),
        delete this.h[a],
        delete this.h[a + 1],
        delete this.h[a + 2])
    }
    return !!b
}
;
t.na = function(a, b) {
    var c = this.i[a];
    if (c) {
        let e = Array(arguments.length - 1);
        var d = arguments.length;
        let f;
        for (f = 1; f < d; f++)
            e[f - 1] = arguments[f];
        if (this.D)
            for (f = 0; f < c.length; f++)
                d = c[f],
                mf(this.h[d + 1], this.h[d + 2], e);
        else {
            this.o++;
            try {
                for (f = 0,
                d = c.length; f < d && !this.l; f++) {
                    let g = c[f];
                    this.h[g + 1].apply(this.h[g + 2], e)
                }
            } finally {
                if (this.o--,
                this.m.length > 0 && this.o == 0)
                    for (; c = this.m.pop(); )
                        this.aa(c)
            }
        }
        return f != 0
    }
    return !1
}
;
function mf(a, b, c) {
    Qe(function() {
        a.apply(b, c)
    })
}
t.clear = function(a) {
    if (a) {
        let b = this.i[a];
        b && (b.forEach(this.aa, this),
        delete this.i[a])
    } else
        this.h.length = 0,
        this.i = {}
}
;
t.R = function() {
    lf.pb.R.call(this);
    this.clear();
    this.m.length = 0
}
;
function nf(a) {
    this.i = this.v = this.j = "";
    this.D = null;
    this.m = this.h = "";
    this.l = !1;
    var b;
    a instanceof nf ? (this.l = a.l,
    of(this, a.j),
    this.v = a.v,
    this.i = a.i,
    pf(this, a.D),
    this.h = a.h,
    qf(this, a.o.clone()),
    this.m = a.m) : a && (b = String(a).match(Ja)) ? (this.l = !1,
    of(this, b[1] || "", !0),
    this.v = rf(b[2] || ""),
    this.i = rf(b[3] || "", !0),
    pf(this, b[4]),
    this.h = rf(b[5] || "", !0),
    qf(this, b[6] || "", !0),
    this.m = rf(b[7] || "")) : (this.l = !1,
    this.o = new sf(null,this.l))
}
nf.prototype.toString = function() {
    var a = []
      , b = this.j;
    b && a.push(tf(b, uf, !0), ":");
    var c = this.i;
    if (c || b == "file")
        a.push("//"),
        (b = this.v) && a.push(tf(b, uf, !0), "@"),
        a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
        c = this.D,
        c != null && a.push(":", String(c));
    if (c = this.h)
        this.i && c.charAt(0) != "/" && a.push("/"),
        a.push(tf(c, c.charAt(0) == "/" ? vf : wf, !0));
    (c = this.o.toString()) && a.push("?", c);
    (c = this.m) && a.push("#", tf(c, xf));
    return a.join("")
}
;
nf.prototype.resolve = function(a) {
    var b = this.clone()
      , c = !!a.j;
    c ? of(b, a.j) : c = !!a.v;
    c ? b.v = a.v : c = !!a.i;
    c ? b.i = a.i : c = a.D != null;
    var d = a.h;
    if (c)
        pf(b, a.D);
    else if (c = !!a.h) {
        if (d.charAt(0) != "/")
            if (this.i && !this.h)
                d = "/" + d;
            else {
                var e = b.h.lastIndexOf("/");
                e != -1 && (d = b.h.slice(0, e + 1) + d)
            }
        e = d;
        if (e == ".." || e == ".")
            d = "";
        else if (e.indexOf("./") != -1 || e.indexOf("/.") != -1) {
            d = e.lastIndexOf("/", 0) == 0;
            e = e.split("/");
            let f = [];
            for (let g = 0; g < e.length; ) {
                let h = e[g++];
                h == "." ? d && g == e.length && f.push("") : h == ".." ? ((f.length > 1 || f.length == 1 && f[0] != "") && f.pop(),
                d && g == e.length && f.push("")) : (f.push(h),
                d = !0)
            }
            d = f.join("/")
        } else
            d = e
    }
    c ? b.h = d : c = a.o.toString() !== "";
    c ? qf(b, a.o.clone()) : c = !!a.m;
    c && (b.m = a.m);
    return b
}
;
nf.prototype.clone = function() {
    return new nf(this)
}
;
function of(a, b, c) {
    a.j = c ? rf(b, !0) : b;
    a.j && (a.j = a.j.replace(/:$/, ""))
}
function pf(a, b) {
    if (b) {
        b = Number(b);
        if (isNaN(b) || b < 0)
            throw Error("Bad port number " + b);
        a.D = b
    } else
        a.D = null
}
function qf(a, b, c) {
    b instanceof sf ? (a.o = b,
    yf(a.o, a.l)) : (c || (b = tf(b, zf)),
    a.o = new sf(b,a.l))
}
function rf(a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
}
function tf(a, b, c) {
    return typeof a === "string" ? (a = encodeURI(a).replace(b, Af),
    c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
    a) : null
}
function Af(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var uf = /[#\/\?@]/g
  , wf = /[#\?:]/g
  , vf = /[#\?]/g
  , zf = /[#\?@]/g
  , xf = /#/g;
function sf(a, b) {
    this.i = this.h = null;
    this.j = a || null;
    this.l = !!b
}
function Bf(a) {
    a.h || (a.h = new Map,
    a.i = 0,
    a.j && Na(a.j, function(b, c) {
        a.add(decodeURIComponent(b.replace(/\+/g, " ")), c)
    }))
}
t = sf.prototype;
t.add = function(a, b) {
    Bf(this);
    this.j = null;
    a = Cf(this, a);
    var c = this.h.get(a);
    c || this.h.set(a, c = []);
    c.push(b);
    this.i = this.i + 1;
    return this
}
;
t.remove = function(a) {
    Bf(this);
    a = Cf(this, a);
    return this.h.has(a) ? (this.j = null,
    this.i = this.i - this.h.get(a).length,
    this.h.delete(a)) : !1
}
;
t.clear = function() {
    this.h = this.j = null;
    this.i = 0
}
;
function Df(a, b) {
    Bf(a);
    b = Cf(a, b);
    return a.h.has(b)
}
t.forEach = function(a, b) {
    Bf(this);
    this.h.forEach(function(c, d) {
        c.forEach(function(e) {
            a.call(b, e, d, this)
        }, this)
    }, this)
}
;
t.ga = function(a) {
    Bf(this);
    var b = [];
    if (typeof a === "string")
        Df(this, a) && (b = b.concat(this.h.get(Cf(this, a))));
    else {
        a = Array.from(this.h.values());
        for (let c = 0; c < a.length; c++)
            b = b.concat(a[c])
    }
    return b
}
;
t.set = function(a, b) {
    Bf(this);
    this.j = null;
    a = Cf(this, a);
    Df(this, a) && (this.i = this.i - this.h.get(a).length);
    this.h.set(a, [b]);
    this.i = this.i + 1;
    return this
}
;
t.get = function(a, b) {
    if (!a)
        return b;
    a = this.ga(a);
    return a.length > 0 ? String(a[0]) : b
}
;
t.toString = function() {
    if (this.j)
        return this.j;
    if (!this.h)
        return "";
    var a = []
      , b = Array.from(this.h.keys());
    for (let d = 0; d < b.length; d++) {
        var c = b[d];
        let e = encodeURIComponent(String(c));
        c = this.ga(c);
        for (let f = 0; f < c.length; f++) {
            let g = e;
            c[f] !== "" && (g += "=" + encodeURIComponent(String(c[f])));
            a.push(g)
        }
    }
    return this.j = a.join("&")
}
;
t.clone = function() {
    var a = new sf;
    a.j = this.j;
    this.h && (a.h = new Map(this.h),
    a.i = this.i);
    return a
}
;
function Cf(a, b) {
    b = String(b);
    a.l && (b = b.toLowerCase());
    return b
}
function yf(a, b) {
    b && !a.l && (Bf(a),
    a.j = null,
    a.h.forEach(function(c, d) {
        var e = d.toLowerCase();
        d != e && (this.remove(d),
        this.remove(e),
        c.length > 0 && (this.j = null,
        this.h.set(Cf(this, e), Ca(c)),
        this.i = this.i + c.length))
    }, a));
    a.l = b
}
;/*

 (The MIT License)

 Copyright (C) 2014 by Vitaly Puzrin

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 -----------------------------------------------------------------------------
 Ported from zlib, which is under the following license
 https://github.com/madler/zlib/blob/master/zlib.h

 zlib.h -- interface of the 'zlib' general purpose compression library
   version 1.2.8, April 28th, 2013
   Copyright (C) 1995-2013 Jean-loup Gailly and Mark Adler
   This software is provided 'as-is', without any express or implied
   warranty.  In no event will the authors be held liable for any damages
   arising from the use of this software.
   Permission is granted to anyone to use this software for any purpose,
   including commercial applications, and to alter it and redistribute it
   freely, subject to the following restrictions:
   1. The origin of this software must not be misrepresented; you must not
      claim that you wrote the original software. If you use this software
      in a product, an acknowledgment in the product documentation would be
      appreciated but is not required.
   2. Altered source versions must be plainly marked as such, and must not be
      misrepresented as being the original software.
   3. This notice may not be removed or altered from any source distribution.
   Jean-loup Gailly        Mark Adler
   jloup@gzip.org          madler@alumni.caltech.edu
   The data format used by the zlib library is described by RFCs (Request for
   Comments) 1950 to 1952 in the files http://tools.ietf.org/html/rfc1950
   (zlib format), rfc1951 (deflate format) and rfc1952 (gzip format).
*/
let Ef = {};
var Ff = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
Ef.assign = function(a) {
    for (var b = Array.prototype.slice.call(arguments, 1); b.length; ) {
        var c = b.shift();
        if (c) {
            if (typeof c !== "object")
                throw new TypeError(c + "must be non-object");
            for (var d in c)
                Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
        }
    }
    return a
}
;
Ef.hc = function(a, b) {
    if (a.length === b)
        return a;
    if (a.subarray)
        return a.subarray(0, b);
    a.length = b;
    return a
}
;
var Gf = {
    Ka: function(a, b, c, d, e) {
        if (b.subarray && a.subarray)
            a.set(b.subarray(c, c + d), e);
        else
            for (var f = 0; f < d; f++)
                a[e + f] = b[c + f]
    },
    Va: function(a) {
        var b, c;
        var d = c = 0;
        for (b = a.length; d < b; d++)
            c += a[d].length;
        var e = new Uint8Array(c);
        d = c = 0;
        for (b = a.length; d < b; d++) {
            var f = a[d];
            e.set(f, c);
            c += f.length
        }
        return e
    }
}
  , Hf = {
    Ka: function(a, b, c, d, e) {
        for (var f = 0; f < d; f++)
            a[e + f] = b[c + f]
    },
    Va: function(a) {
        return [].concat.apply([], a)
    }
};
Ef.mb = function() {
    Ff ? (Ef.Ea = Uint8Array,
    Ef.Ca = Uint16Array,
    Ef.Da = Int32Array,
    Ef.assign(Ef, Gf)) : (Ef.Ea = Array,
    Ef.Ca = Array,
    Ef.Da = Array,
    Ef.assign(Ef, Hf))
}
;
Ef.mb();
try {
    new Uint8Array(1)
} catch (a) {}
;function If(a) {
    for (var b = a.length; --b >= 0; )
        a[b] = 0
}
If(Array(576));
If(Array(60));
If(Array(512));
If(Array(256));
If(Array(29));
If(Array(30));
/*

Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
var Jf = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
var Kf = class {
    constructor(a) {
        this.name = a
    }
}
;
var Lf = new Kf("rawColdConfigGroup");
var Mf = new Kf("rawHotConfigGroup");
var Nf = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var Of = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var Pf = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var Qf = class extends I {
    constructor(a) {
        super(a)
    }
    getPlayerType() {
        var a = F(this, 36);
        a = a == null ? a : zc(a) ? a | 0 : void 0;
        return a != null ? a : 0
    }
    setHomeGroupInfo(a) {
        return G(this, Pf, 81, a)
    }
    clearLocationPlayabilityToken() {
        return od(this, 89)
    }
}
;
var Sf = class extends I {
    constructor(a) {
        super(a)
    }
    clearValue() {
        return td(this, 2, Rf)
    }
}
  , Rf = [2, 3, 4, 5, 6];
var Tf = class extends I {
    constructor(a) {
        super(a)
    }
    setTrackingParams(a) {
        if (a != null)
            if (typeof a === "string")
                a = a ? new Cb(a,zb) : Ab();
            else if (a.constructor !== Cb)
                if (tb && a != null && a instanceof Uint8Array)
                    a = a.length ? new Cb(new Uint8Array(a),zb) : Ab();
                else
                    throw Error();
        return od(this, 1, a)
    }
}
;
var Uf = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var Vf = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var Wf = class extends I {
    constructor(a) {
        super(a)
    }
    setToken(a) {
        return H(this, 2, a)
    }
}
;
var Xf = class extends I {
    constructor(a) {
        super(a)
    }
    setSafetyMode(a) {
        return Gd(this, 5, a)
    }
}
;
var Yf = class extends I {
    constructor(a) {
        super(a)
    }
    j(a) {
        return G(this, Qf, 1, a)
    }
}
;
var Zf = new Kf("continuationCommand");
var $f = new Kf("signalServiceEndpoint");
var ag = class extends I {
    constructor(a) {
        super(a, 500)
    }
}
;
var bg = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var cg = class extends I {
    constructor(a) {
        super(a)
    }
    setVideoId(a) {
        return td(this, 1, Ed, Kc(a))
    }
    getPlaylistId() {
        return Dd(this, 2)
    }
}
  , Ed = [1, 2];
var dg = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var eg = new Kf("recordNotificationInteractionsEndpoint");
var fg = ["notification/convert_endpoint_to_url"]
  , gg = ["notification/record_interactions"]
  , hg = ["notification_registration/set_registration"];
var ig = a => self.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a)))).replace(/\+/g, "-").replace(/\//g, "_");
var jg = ["notifications_register", "notifications_check_registration"];
var J = class extends Error {
    constructor(a, ...b) {
        super(a);
        this.args = [...b];
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
;
let kg = null;
function lg(a, b) {
    var c = {};
    c.key = a;
    c.value = b;
    return mg().then(d => new Promise( (e, f) => {
        try {
            let g = d.transaction("swpushnotificationsstore", "readwrite").objectStore("swpushnotificationsstore").put(c);
            g.onsuccess = () => {
                e()
            }
            ;
            g.onerror = () => {
                f()
            }
        } catch (g) {
            f(g)
        }
    }
    ))
}
function ng() {
    return lg("IndexedDBCheck", "testing IndexedDB").then( () => og("IndexedDBCheck")).then(a => a === "testing IndexedDB" ? Promise.resolve() : Promise.reject()).then( () => !0).catch( () => !1)
}
function og(a) {
    var b = new J("Error accessing DB");
    return mg().then(c => new Promise( (d, e) => {
        try {
            let f = c.transaction("swpushnotificationsstore").objectStore("swpushnotificationsstore").get(a);
            f.onsuccess = () => {
                var g = f.result;
                d(g ? g.value : null)
            }
            ;
            f.onerror = () => {
                b.params = {
                    key: a,
                    source: "onerror"
                };
                e(b)
            }
        } catch (f) {
            b.params = {
                key: a,
                thrownError: String(f)
            },
            e(b)
        }
    }
    ), () => null)
}
function mg() {
    return kg ? Promise.resolve(kg) : new Promise( (a, b) => {
        var c = self.indexedDB.open("swpushnotificationsdb");
        c.onerror = b;
        c.onsuccess = () => {
            var d = c.result;
            if (d.objectStoreNames.contains("swpushnotificationsstore"))
                kg = d,
                a(kg);
            else
                return self.indexedDB.deleteDatabase("swpushnotificationsdb"),
                mg()
        }
        ;
        c.onupgradeneeded = pg
    }
    )
}
function pg(a) {
    a = a.target.result;
    a.objectStoreNames.contains("swpushnotificationsstore") && a.deleteObjectStore("swpushnotificationsstore");
    a.createObjectStore("swpushnotificationsstore", {
        keyPath: "key"
    })
}
;const qg = {
    WEB_UNPLUGGED: "^unplugged/",
    WEB_UNPLUGGED_ONBOARDING: "^unplugged/",
    WEB_UNPLUGGED_OPS: "^unplugged/",
    WEB_UNPLUGGED_PUBLIC: "^unplugged/",
    WEB_CREATOR: "^creator/",
    WEB_KIDS: "^kids/",
    WEB_EXPERIMENTS: "^experiments/",
    WEB_MUSIC: "^music/",
    WEB_REMIX: "^music/",
    WEB_MUSIC_EMBEDDED_PLAYER: "^music/",
    WEB_MUSIC_EMBEDDED_PLAYER: "^main_app/|^sfv/"
};
function rg(a) {
    if (a.length === 1)
        return a[0];
    var b = qg.UNKNOWN_INTERFACE;
    if (b) {
        b = new RegExp(b);
        for (var c of a)
            if (b.exec(c))
                return c
    }
    var d = [];
    Object.entries(qg).forEach( ([e,f]) => {
        "UNKNOWN_INTERFACE" !== e && d.push(f)
    }
    );
    c = new RegExp(d.join("|"));
    a.sort( (e, f) => e.length - f.length);
    for (let e of a)
        if (!c.exec(e))
            return e;
    return a[0]
}
function sg(a) {
    return `/youtubei/v1/${rg(a)}`
}
;var tg = class extends I {
    constructor(a) {
        super(a)
    }
}
;
var ug = class extends I {
    constructor(a) {
        super(a, 0, ug.messageId)
    }
}
;
ug.messageId = "yt.sw.adr";
const vg = v.window;
let wg, xg;
const yg = (vg == null ? void 0 : (wg = vg.yt) == null ? void 0 : wg.config_) || (vg == null ? void 0 : (xg = vg.ytcfg) == null ? void 0 : xg.data_) || {};
z("yt.config_", yg);
function K(...a) {
    a = arguments;
    a.length > 1 ? yg[a[0]] = a[1] : a.length === 1 && Object.assign(yg, a[0])
}
function L(a, b) {
    return a in yg ? yg[a] : b
}
;const zg = [];
function Ag(a) {
    zg.forEach(b => {
        b(a)
    }
    )
}
function Bg(a) {
    var b = window;
    return a && b.yterr ? function(...c) {
        try {
            return a.apply(this, c)
        } catch (d) {
            Cg(d instanceof Error ? d : Error(String(d)))
        }
    }
    : a
}
function Dg(a, b) {
    var c = y("yt.logging.errors.log");
    c ? c(a, b, void 0, void 0, void 0, void 0, void 0) : (c = L("ERRORS", []),
    c.push([a, b, void 0, void 0, void 0, void 0, void 0]),
    K("ERRORS", c))
}
function Cg(a) {
    Dg(a, "ERROR");
    Ag(a)
}
function Eg(a) {
    Dg(a, "WARNING")
}
;function M(a) {
    a = Fg(a);
    return typeof a === "string" && a === "false" ? !1 : !!a
}
function Gg(a, b) {
    return Number(Fg(a, b) || 0)
}
function Hg() {
    return L("EXPERIMENTS_TOKEN", "")
}
function Fg(a, b) {
    a = L("EXPERIMENT_FLAGS", {})[a];
    return a !== void 0 ? a : b
}
function Ig() {
    var a = []
      , b = L("EXPERIMENTS_FORCED_FLAGS", {});
    for (var c of Object.keys(b))
        a.push({
            key: c,
            value: String(b[c])
        });
    c = L("EXPERIMENT_FLAGS", {});
    for (let d of Object.keys(c))
        d.startsWith("force_") && b[d] === void 0 && a.push({
            key: d,
            value: String(c[d])
        });
    return a
}
;const Jg = /^[\w.]*$/
  , Kg = {
    q: !0,
    search_query: !0
};
function Lg(a, b) {
    b = a.split(b);
    var c = {};
    for (let f = 0, g = b.length; f < g; f++) {
        let h = b[f].split("=");
        if (h.length === 1 && h[0] || h.length === 2)
            try {
                let k = Mg(h[0] || "")
                  , l = Mg(h[1] || "");
                if (k in c) {
                    let m = c[k];
                    Array.isArray(m) ? Da(m, l) : c[k] = [m, l]
                } else
                    c[k] = l
            } catch (k) {
                var d = k
                  , e = h[0];
                let l = String(Lg);
                d.args = [{
                    key: e,
                    value: h[1],
                    query: a,
                    method: Ng === l ? "unchanged" : l
                }];
                Kg.hasOwnProperty(e) || Eg(d)
            }
    }
    return c
}
const Ng = String(Lg);
function Og(a) {
    a.charAt(0) === "?" && (a = a.substring(1));
    return Lg(a, "&")
}
function Pg(a, b) {
    return Qg(a, b || {}, !0)
}
function Qg(a, b, c) {
    if (M("fix_uri_parsing_for_legacy_underescaping")) {
        var d = (a || "").split("#", 2);
        a = d[0];
        d = d.length > 1 ? "#" + d[1] : "";
        let g = a.indexOf("?");
        var e = g !== -1 ? a.substring(0, g) : a;
        a = Og(g !== -1 ? a.substring(g + 1) : "");
        for (var f in b)
            !c && a !== null && f in a || (a[f] = b[f]);
        return Qa(e, a) + d
    }
    f = a.split("#", 2);
    a = f[0];
    f = f.length > 1 ? "#" + f[1] : "";
    e = a.split("?", 2);
    a = e[0];
    e = Og(e[1] || "");
    for (d in b)
        !c && e !== null && d in e || (e[d] = b[d]);
    return Qa(a, e) + f
}
function Rg(a) {
    if (!b)
        var b = window.location.href;
    var c = a.match(Ja)[1] || null
      , d = Ka(a);
    c && d ? (a = a.match(Ja),
    b = b.match(Ja),
    a = a[3] == b[3] && a[1] == b[1] && a[4] == b[4]) : a = d ? Ka(b) === d && (Number(b.match(Ja)[4] || null) || null) === (Number(a.match(Ja)[4] || null) || null) : !0;
    return a
}
function Mg(a) {
    return a && a.match(Jg) ? a : decodeURIComponent(a.replace(/\+/g, " "))
}
;new class {
    constructor() {}
}
(window,window.document);
function Sg(a, b) {
    typeof a === "function" && (a = Bg(a));
    return window.setTimeout(a, b)
}
;var Tg = "absolute_experiments client_dev_domain client_dev_expflag client_dev_regex_map client_dev_root_url client_rollout_override expflag forcedCapability jsfeat jsmode mods theme".split(" ")
  , Ug = [...Tg, "client_dev_set_cookie"];
[...Tg];
let Vg = !1;
function Wg(a, b) {
    var c = {
        method: b.method || "GET",
        credentials: "same-origin"
    };
    b.headers && (c.headers = b.headers);
    b.priority && (c.priority = b.priority);
    b.keepalive !== void 0 && (c.keepalive = b.keepalive);
    b.mode && (c.mode = b.mode);
    a = Xg(a, b);
    var d = Yg(a, b);
    d && (c.body = d);
    b.withCredentials && (c.credentials = "include");
    var e = b.context || v, f = !1, g;
    fetch(a, c).then(h => {
        if (!f) {
            f = !0;
            g && window.clearTimeout(g);
            var k = h.ok
              , l = m => {
                m = m || {};
                k ? b.onSuccess && b.onSuccess.call(e, m, h) : b.onError && b.onError.call(e, m, h);
                b.onFinish && b.onFinish.call(e, m, h)
            }
            ;
            (b.format || "JSON") === "JSON" && (k || h.status >= 400 && h.status < 500) ? h.json().then(l, () => {
                l(null)
            }
            ) : l(null)
        }
    }
    ).catch( () => {
        b.onError && b.onError.call(e, {}, {})
    }
    );
    a = b.timeout || 0;
    b.onFetchTimeout && a > 0 && (g = Sg( () => {
        f || (f = !0,
        window.clearTimeout(g),
        b.onFetchTimeout.call(b.context || v))
    }
    , a))
}
function Xg(a, b) {
    b.includeDomain && (a = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ":" + document.location.port : "") + a);
    var c = L("XSRF_FIELD_NAME");
    if (b = b.urlParams)
        b[c] && delete b[c],
        a = Pg(a, b);
    return a
}
function Yg(a, b) {
    var c = L("XSRF_FIELD_NAME"), d = L("XSRF_TOKEN"), e = b.postBody || "", f = b.postParams, g = L("XSRF_FIELD_NAME"), h;
    b.headers && (h = b.headers["Content-Type"]);
    b.excludeXsrf || Ka(a) && !b.withCredentials && Ka(a) !== document.location.hostname || b.method !== "POST" || h && h !== "application/x-www-form-urlencoded" || b.postParams && b.postParams[g] || (f || (f = {}),
    f[c] = d);
    f && typeof e === "string" && (e = Og(e),
    ue(e, f),
    e = b.postBodyFormat && b.postBodyFormat === "JSON" ? JSON.stringify(e) : Pa(e));
    f = e || f && !re(f);
    !Vg && f && b.method !== "POST" && (Vg = !0,
    Cg(Error("AJAX request with postData should use POST")));
    return e
}
;const Zg = [{
    ka: a => `Cannot read property '${a.key}'`,
    Y: {
        Error: [{
            F: /(Permission denied) to access property "([^']+)"/,
            groups: ["reason", "key"]
        }],
        TypeError: [{
            F: /Cannot read property '([^']+)' of (null|undefined)/,
            groups: ["key", "value"]
        }, {
            F: /\u65e0\u6cd5\u83b7\u53d6\u672a\u5b9a\u4e49\u6216 (null|undefined) \u5f15\u7528\u7684\u5c5e\u6027\u201c([^\u201d]+)\u201d/,
            groups: ["value", "key"]
        }, {
            F: /\uc815\uc758\ub418\uc9c0 \uc54a\uc74c \ub610\ub294 (null|undefined) \ucc38\uc870\uc778 '([^']+)' \uc18d\uc131\uc744 \uac00\uc838\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4./,
            groups: ["value", "key"]
        }, {
            F: /No se puede obtener la propiedad '([^']+)' de referencia nula o sin definir/,
            groups: ["key"]
        }, {
            F: /Unable to get property '([^']+)' of (undefined or null) reference/,
            groups: ["key", "value"]
        }, {
            F: /(null) is not an object \(evaluating '(?:([^.]+)\.)?([^']+)'\)/,
            groups: ["value", "base", "key"]
        }]
    }
}, {
    ka: a => `Cannot call '${a.key}'`,
    Y: {
        TypeError: [{
            F: /(?:([^ ]+)?\.)?([^ ]+) is not a function/,
            groups: ["base", "key"]
        }, {
            F: /([^ ]+) called on (null or undefined)/,
            groups: ["key", "value"]
        }, {
            F: /Object (.*) has no method '([^ ]+)'/,
            groups: ["base", "key"]
        }, {
            F: /Object doesn't support property or method '([^ ]+)'/,
            groups: ["key"]
        }, {
            F: /\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u306f '([^']+)' \u30d7\u30ed\u30d1\u30c6\u30a3\u307e\u305f\u306f\u30e1\u30bd\u30c3\u30c9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093/,
            groups: ["key"]
        }, {
            F: /\uac1c\uccb4\uac00 '([^']+)' \uc18d\uc131\uc774\ub098 \uba54\uc11c\ub4dc\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4./,
            groups: ["key"]
        }]
    }
}, {
    ka: a => `${a.key} is not defined`,
    Y: {
        ReferenceError: [{
            F: /(.*) is not defined/,
            groups: ["key"]
        }, {
            F: /Can't find variable: (.*)/,
            groups: ["key"]
        }]
    }
}];
var bh = {
    K: [],
    J: [{
        callback: $g,
        weight: 500
    }, {
        callback: ah,
        weight: 500
    }]
};
function $g(a) {
    if (a.name === "JavaException")
        return !0;
    a = a.stack;
    return a.includes("chrome://") || a.includes("-extension://") || a.includes("webkit-masked-url://")
}
function ah(a) {
    if (!a.stack)
        return !0;
    var b = !a.stack.includes("\n");
    return b && a.stack.includes("ErrorType: ") || b && a.stack.includes("Anonymous function (Unknown script") || a.stack.toLowerCase() === "not available" || a.fileName === "user-script" || a.fileName.startsWith("user-script:") ? !0 : !1
}
;function ch() {
    if (!dh) {
        var a = dh = new eh;
        a.K.length = 0;
        a.J.length = 0;
        fh(a, bh)
    }
    return dh
}
function fh(a, b) {
    b.K && a.K.unshift.apply(a.K, b.K);
    b.J && a.J.unshift.apply(a.J, b.J)
}
var eh = class {
    constructor() {
        this.J = [];
        this.K = []
    }
}
, dh;
const gh = new lf;
function hh(a) {
    var b = a.length
      , c = 0
      , d = () => a.charCodeAt(c++);
    do {
        var e = ih(d);
        if (e === Infinity)
            break;
        let f = e >> 3;
        switch (e & 7) {
        case 0:
            e = ih(d);
            if (f === 2)
                return e;
            break;
        case 1:
            if (f === 2)
                return;
            c += 8;
            break;
        case 2:
            e = ih(d);
            if (f === 2)
                return a.substr(c, e);
            c += e;
            break;
        case 5:
            if (f === 2)
                return;
            c += 4;
            break;
        default:
            return
        }
    } while (c < b)
}
function ih(a) {
    var b = a()
      , c = b & 127;
    if (b < 128)
        return c;
    b = a();
    c |= (b & 127) << 7;
    if (b < 128)
        return c;
    b = a();
    c |= (b & 127) << 14;
    if (b < 128)
        return c;
    b = a();
    return b < 128 ? c | (b & 127) << 21 : Infinity
}
;function jh(a, b, c, d) {
    if (a)
        if (Array.isArray(a)) {
            var e = d;
            for (d = 0; d < a.length && !(a[d] && (e += kh(d, a[d], b, c),
            e > 500)); d++)
                ;
            d = e
        } else if (typeof a === "object")
            for (e in a) {
                if (a[e]) {
                    a: {
                        var f = e;
                        var g = a[e]
                          , h = b
                          , k = c;
                        if (typeof g !== "string" || f !== "clickTrackingParams" && f !== "trackingParams") {
                            f = 0;
                            break a
                        }
                        f = (g = hh(atob(g.replace(/-/g, "+").replace(/_/g, "/")))) ? kh(`${f}.ve`, g, h, k) : 0
                    }
                    d += f;
                    d += kh(e, a[e], b, c);
                    if (d > 500)
                        break
                }
            }
        else
            c[b] = lh(a),
            d += c[b].length;
    else
        c[b] = lh(a),
        d += c[b].length;
    return d
}
function kh(a, b, c, d) {
    c += `.${a}`;
    a = lh(b);
    d[c] = a;
    return c.length + a.length
}
function lh(a) {
    try {
        return (typeof a === "string" ? a : String(JSON.stringify(a))).substr(0, 500)
    } catch (b) {
        return `unable to serialize ${typeof a} (${b.message})`
    }
}
;function mh() {
    nh.instance || (nh.instance = new nh);
    return nh.instance
}
function oh(a, b) {
    a = {};
    var c = [];
    "USER_SESSION_ID" in yg && c.push({
        key: "u",
        value: L("USER_SESSION_ID")
    });
    var d = ve(v == null ? void 0 : v.location.href);
    var e = [];
    if (De()) {
        d = d.indexOf("https:") == 0 || d.indexOf("chrome-extension:") == 0 || d.indexOf("chrome-untrusted://new-tab-page") == 0 || d.indexOf("moz-extension:") == 0;
        var f = d ? v.__SAPISID : v.__APISID;
        f || typeof document === "undefined" || (f = new Ae(document),
        f = f.get(d ? "SAPISID" : "APISID") || f.get("__Secure-3PAPISID"));
        (f = f ? xe(f, d ? "SAPISIDHASH" : "APISIDHASH", c) : null) && e.push(f);
        d && ((d = Ee("__1PSAPISID", "__Secure-1PAPISID", "SAPISID1PHASH", c)) && e.push(d),
        (c = Ee("__3PSAPISID", "__Secure-3PAPISID", "SAPISID3PHASH", c)) && e.push(c))
    }
    if (e = e.length == 0 ? null : e.join(" "))
        a.Authorization = e,
        e = b = b == null ? void 0 : b.sessionIndex,
        e === void 0 && (e = Number(L("SESSION_INDEX", 0)),
        e = isNaN(e) ? 0 : e),
        M("voice_search_auth_header_removal") || (a["X-Goog-AuthUser"] = e.toString()),
        "INNERTUBE_HOST_OVERRIDE" in yg || (a["X-Origin"] = window.location.origin),
        b === void 0 && "DELEGATED_SESSION_ID" in yg && (a["X-Goog-PageId"] = L("DELEGATED_SESSION_ID"));
    return a
}
var nh = class {
    constructor() {
        this.za = !0
    }
}
;
var ph = {
    identityType: "UNAUTHENTICATED_IDENTITY_TYPE_UNKNOWN"
};
function qh(a) {
    switch (a) {
    case "DESKTOP":
        return 1;
    case "UNKNOWN_PLATFORM":
        return 0;
    case "TV":
        return 2;
    case "GAME_CONSOLE":
        return 3;
    case "MOBILE":
        return 4;
    case "TABLET":
        return 5
    }
}
;z("ytglobal.prefsUserPrefsPrefs_", y("ytglobal.prefsUserPrefsPrefs_") || {});
function rh() {
    if (L("DATASYNC_ID") !== void 0)
        return L("DATASYNC_ID");
    throw new J("Datasync ID not set","unknown");
}
;function sh(a, b) {
    return th(a, 0, b)
}
function uh(a) {
    var b = y("yt.scheduler.instance.addImmediateJob");
    b ? b(a) : a()
}
var vh = class {
    h(a) {
        th(a, 1)
    }
}
;
function wh() {
    xh.instance || (xh.instance = new xh);
    return xh.instance
}
function th(a, b, c) {
    c !== void 0 && Number.isNaN(Number(c)) && (c = void 0);
    var d = y("yt.scheduler.instance.addJob");
    return d ? d(a, b, c) : c === void 0 ? (a(),
    NaN) : Sg(a, c || 0)
}
var xh = class extends vh {
    W(a) {
        if (a === void 0 || !Number.isNaN(Number(a))) {
            var b = y("yt.scheduler.instance.cancelJob");
            b ? b(a) : window.clearTimeout(a)
        }
    }
    start() {
        var a = y("yt.scheduler.instance.start");
        a && a()
    }
    pause() {
        var a = y("yt.scheduler.instance.pause");
        a && a()
    }
}
  , yh = wh();
const zh = [];
let Ah, Bh = !1;
function Ch(a) {
    Bh || (Ah ? Ah.handleError(a) : (zh.push({
        type: "ERROR",
        payload: a
    }),
    zh.length > 10 && zh.shift()))
}
function Dh(a, b) {
    Bh || (Ah ? Ah.X(a, b) : (zh.push({
        type: "EVENT",
        eventType: a,
        payload: b
    }),
    zh.length > 10 && zh.shift()))
}
;function Eh(a) {
    if (a.indexOf(":") >= 0)
        throw Error("Database name cannot contain ':'");
}
function Fh(a) {
    return a.substr(0, a.indexOf(":")) || a
}
;function Gh(a) {
    var b = cb();
    return b ? b.toLowerCase().indexOf(a) >= 0 : !1
}
;const Hh = {
    AUTH_INVALID: "No user identifier specified.",
    EXPLICIT_ABORT: "Transaction was explicitly aborted.",
    IDB_NOT_SUPPORTED: "IndexedDB is not supported.",
    MISSING_INDEX: "Index not created.",
    MISSING_OBJECT_STORES: "Object stores not created.",
    DB_DELETED_BY_MISSING_OBJECT_STORES: "Database is deleted because expected object stores were not created.",
    DB_REOPENED_BY_MISSING_OBJECT_STORES: "Database is reopened because expected object stores were not created.",
    UNKNOWN_ABORT: "Transaction was aborted for unknown reasons.",
    QUOTA_EXCEEDED: "The current transaction exceeded its quota limitations.",
    QUOTA_MAYBE_EXCEEDED: "The current transaction may have failed because of exceeding quota limitations.",
    EXECUTE_TRANSACTION_ON_CLOSED_DB: "Can't start a transaction on a closed database",
    INCOMPATIBLE_DB_VERSION: "The binary is incompatible with the database version"
}
  , Ih = {
    AUTH_INVALID: "ERROR",
    EXECUTE_TRANSACTION_ON_CLOSED_DB: "WARNING",
    EXPLICIT_ABORT: "IGNORED",
    IDB_NOT_SUPPORTED: "ERROR",
    MISSING_INDEX: "WARNING",
    MISSING_OBJECT_STORES: "ERROR",
    DB_DELETED_BY_MISSING_OBJECT_STORES: "WARNING",
    DB_REOPENED_BY_MISSING_OBJECT_STORES: "WARNING",
    QUOTA_EXCEEDED: "WARNING",
    QUOTA_MAYBE_EXCEEDED: "WARNING",
    UNKNOWN_ABORT: "WARNING",
    INCOMPATIBLE_DB_VERSION: "WARNING"
}
  , Jh = {
    AUTH_INVALID: !1,
    EXECUTE_TRANSACTION_ON_CLOSED_DB: !1,
    EXPLICIT_ABORT: !1,
    IDB_NOT_SUPPORTED: !1,
    MISSING_INDEX: !1,
    MISSING_OBJECT_STORES: !1,
    DB_DELETED_BY_MISSING_OBJECT_STORES: !1,
    DB_REOPENED_BY_MISSING_OBJECT_STORES: !1,
    QUOTA_EXCEEDED: !1,
    QUOTA_MAYBE_EXCEEDED: !0,
    UNKNOWN_ABORT: !0,
    INCOMPATIBLE_DB_VERSION: !1
};
var N = class extends J {
    constructor(a, b={}, c=Hh[a], d=Ih[a], e=Jh[a]) {
        super(c, Object.assign({}, {
            name: "YtIdbKnownError",
            isSw: self.document === void 0,
            isIframe: self !== self.top,
            type: a
        }, b));
        this.type = a;
        this.message = c;
        this.level = d;
        this.h = e;
        Object.setPrototypeOf(this, N.prototype)
    }
}
  , Kh = class extends N {
    constructor(a, b) {
        super("MISSING_OBJECT_STORES", {
            expectedObjectStores: b,
            foundObjectStores: a
        }, Hh.MISSING_OBJECT_STORES);
        Object.setPrototypeOf(this, Kh.prototype)
    }
}
  , Lh = class extends Error {
    constructor(a, b) {
        super();
        this.index = a;
        this.objectStore = b;
        Object.setPrototypeOf(this, Lh.prototype)
    }
}
;
const Mh = ["The database connection is closing", "Can't start a transaction on a closed database", "A mutation operation was attempted on a database that did not allow mutations"];
function Nh(a, b, c, d) {
    b = Fh(b);
    var e = a instanceof Error ? a : Error(`Unexpected error: ${a}`);
    if (e instanceof N)
        return e;
    a = {
        objectStoreNames: c,
        dbName: b,
        dbVersion: d
    };
    if (e.name === "QuotaExceededError")
        return new N("QUOTA_EXCEEDED",a);
    if (mb && e.name === "UnknownError")
        return new N("QUOTA_MAYBE_EXCEEDED",a);
    if (e instanceof Lh)
        return new N("MISSING_INDEX",Object.assign({}, a, {
            objectStore: e.objectStore,
            index: e.index
        }));
    if (e.name === "InvalidStateError" && Mh.some(f => e.message.includes(f)))
        return new N("EXECUTE_TRANSACTION_ON_CLOSED_DB",a);
    if (e.name === "AbortError")
        return new N("UNKNOWN_ABORT",a,e.message);
    e.args = [Object.assign({}, a, {
        name: "IdbError",
        Vb: e.name
    })];
    e.level = "WARNING";
    return e
}
function Oh(a, b, c) {
    return new N("IDB_NOT_SUPPORTED",{
        context: {
            caller: a,
            publicName: b,
            version: c,
            hasSucceededOnce: void 0
        }
    })
}
;function Ph(a) {
    if (!a)
        throw Error();
    throw a;
}
function Qh(a) {
    return a
}
var Rh = class {
    constructor(a) {
        this.h = a
    }
}
;
function Sh(a, b, c, d, e) {
    try {
        if (a.state.status !== "FULFILLED")
            throw Error("calling handleResolve before the promise is fulfilled.");
        let f = c(a.state.value);
        f instanceof Th ? Uh(a, b, f, d, e) : d(f)
    } catch (f) {
        e(f)
    }
}
function Vh(a, b, c, d, e) {
    try {
        if (a.state.status !== "REJECTED")
            throw Error("calling handleReject before the promise is rejected.");
        let f = c(a.state.reason);
        f instanceof Th ? Uh(a, b, f, d, e) : d(f)
    } catch (f) {
        e(f)
    }
}
function Uh(a, b, c, d, e) {
    b === c ? e(new TypeError("Circular promise chain detected.")) : c.then(f => {
        f instanceof Th ? Uh(a, b, f, d, e) : d(f)
    }
    , f => {
        e(f)
    }
    )
}
var Th = class {
    constructor(a) {
        this.state = {
            status: "PENDING"
        };
        this.h = [];
        this.i = [];
        a = a.h;
        var b = d => {
            if (this.state.status === "PENDING") {
                this.state = {
                    status: "FULFILLED",
                    value: d
                };
                for (let e of this.h)
                    e()
            }
        }
          , c = d => {
            if (this.state.status === "PENDING") {
                this.state = {
                    status: "REJECTED",
                    reason: d
                };
                for (let e of this.i)
                    e()
            }
        }
        ;
        try {
            a(b, c)
        } catch (d) {
            c(d)
        }
    }
    static all(a) {
        return new Th(new Rh( (b, c) => {
            var d = []
              , e = a.length;
            e === 0 && b(d);
            for (let f = 0; f < a.length; ++f)
                Th.resolve(a[f]).then(g => {
                    d[f] = g;
                    e--;
                    e === 0 && b(d)
                }
                ).catch(g => {
                    c(g)
                }
                )
        }
        ))
    }
    static resolve(a) {
        return new Th(new Rh( (b, c) => {
            a instanceof Th ? a.then(b, c) : b(a)
        }
        ))
    }
    static reject(a) {
        return new Th(new Rh( (b, c) => {
            c(a)
        }
        ))
    }
    then(a, b) {
        var c = a != null ? a : Qh
          , d = b != null ? b : Ph;
        return new Th(new Rh( (e, f) => {
            this.state.status === "PENDING" ? (this.h.push( () => {
                Sh(this, this, c, e, f)
            }
            ),
            this.i.push( () => {
                Vh(this, this, d, e, f)
            }
            )) : this.state.status === "FULFILLED" ? Sh(this, this, c, e, f) : this.state.status === "REJECTED" && Vh(this, this, d, e, f)
        }
        ))
    }
    catch(a) {
        return this.then(void 0, a)
    }
}
;
function Wh(a, b, c) {
    var d = () => {
        try {
            a.removeEventListener("success", e),
            a.removeEventListener("error", f)
        } catch (g) {}
    }
      , e = () => {
        b(a.result);
        d()
    }
      , f = () => {
        c(a.error);
        d()
    }
    ;
    a.addEventListener("success", e);
    a.addEventListener("error", f)
}
function Xh(a) {
    return new Promise( (b, c) => {
        Wh(a, b, c)
    }
    )
}
function O(a) {
    return new Th(new Rh( (b, c) => {
        Wh(a, b, c)
    }
    ))
}
;function Yh(a, b) {
    return new Th(new Rh( (c, d) => {
        var e = () => {
            var f = a ? b(a) : null;
            f ? f.then(g => {
                a = g;
                e()
            }
            , d) : c()
        }
        ;
        e()
    }
    ))
}
;const Zh = window;
var P = Zh.ytcsi && Zh.ytcsi.now ? Zh.ytcsi.now : Zh.performance && Zh.performance.timing && Zh.performance.now && Zh.performance.timing.navigationStart ? () => Zh.performance.timing.navigationStart + Zh.performance.now() : () => (new Date).getTime();
function $h() {
    return M("idb_immediate_commit")
}
function ai(a, b, c, d) {
    return u(function*() {
        var e = {
            mode: "readonly",
            H: !1,
            tag: "IDB_TRANSACTION_TAG_UNKNOWN"
        };
        typeof c === "string" ? e.mode = c : Object.assign(e, c);
        a.transactionCount++;
        for (var f = e.H ? 3 : 1, g = 0, h; !h; ) {
            g++;
            let p = Math.round(P());
            try {
                var k = a.h.transaction(b, e.mode)
                  , l = d
                  , m = !!e.commit;
                let q = new bi(k)
                  , n = yield ci(q, l, m)
                  , r = Math.round(P());
                di(a, p, r, g, void 0, b.join(), e);
                return n
            } catch (q) {
                l = Math.round(P());
                let n = Nh(q, a.h.name, b.join(), a.h.version);
                if (n instanceof N && !n.h || g >= f)
                    di(a, p, l, g, n, b.join(), e),
                    h = n
            }
        }
        return Promise.reject(h)
    })
}
function ei(a, b, c) {
    a = a.h.createObjectStore(b, c);
    return new fi(a)
}
function gi(a, b, c, d) {
    return ai(a, [b], {
        mode: "readwrite",
        H: !0,
        commit: $h()
    }, e => {
        e = e.objectStore(b);
        return O(e.h.put(c, d))
    }
    )
}
function di(a, b, c, d, e, f, g) {
    b = c - b;
    e ? (e instanceof N && (e.type === "QUOTA_EXCEEDED" || e.type === "QUOTA_MAYBE_EXCEEDED") && Dh("QUOTA_EXCEEDED", {
        dbName: Fh(a.h.name),
        objectStoreNames: f,
        transactionCount: a.transactionCount,
        transactionMode: g.mode
    }),
    e instanceof N && e.type === "UNKNOWN_ABORT" && (c -= a.j,
    c < 0 && c >= 2147483648 && (c = 0),
    Dh("TRANSACTION_UNEXPECTEDLY_ABORTED", {
        objectStoreNames: f,
        transactionDuration: b,
        transactionCount: a.transactionCount,
        dbDuration: c
    }),
    a.i = !0),
    hi(a, !1, d, f, b, g.tag),
    Ch(e)) : hi(a, !0, d, f, b, g.tag)
}
function hi(a, b, c, d, e, f="IDB_TRANSACTION_TAG_UNKNOWN") {
    Dh("TRANSACTION_ENDED", {
        objectStoreNames: d,
        connectionHasUnknownAbortedTransaction: a.i,
        duration: e,
        isSuccessful: b,
        tryCount: c,
        tag: f
    })
}
var ii = class {
    constructor(a, b) {
        this.h = a;
        this.options = b;
        this.transactionCount = 0;
        this.j = Math.round(P());
        this.i = !1
    }
    add(a, b, c) {
        return ai(this, [a], {
            mode: "readwrite",
            H: !0,
            commit: $h()
        }, d => d.objectStore(a).add(b, c))
    }
    clear(a) {
        return ai(this, [a], {
            mode: "readwrite",
            H: !0
        }, b => b.objectStore(a).clear())
    }
    close() {
        this.h.close();
        var a;
        ((a = this.options) == null ? 0 : a.closed) && this.options.closed()
    }
    count(a, b) {
        return ai(this, [a], {
            mode: "readonly",
            H: !0,
            commit: $h()
        }, c => c.objectStore(a).count(b))
    }
    delete(a, b) {
        return ai(this, [a], {
            mode: "readwrite",
            H: !0,
            commit: $h() && !(b instanceof IDBKeyRange)
        }, c => c.objectStore(a).delete(b))
    }
    get(a, b) {
        return ai(this, [a], {
            mode: "readonly",
            H: !0,
            commit: $h()
        }, c => c.objectStore(a).get(b))
    }
    getAll(a, b, c) {
        return ai(this, [a], {
            mode: "readonly",
            H: !0
        }, d => d.objectStore(a).getAll(b, c))
    }
    objectStoreNames() {
        return Array.from(this.h.objectStoreNames)
    }
    getName() {
        return this.h.name
    }
}
;
function ji(a, b, c) {
    a = a.h.openCursor(b.query, b.direction);
    return ki(a).then(d => Yh(d, c))
}
function li(a, b) {
    return ji(a, {
        query: b
    }, c => c.delete().then( () => mi(c))).then( () => {}
    )
}
function ni(a, b, c) {
    var d = [];
    return ji(a, {
        query: b
    }, e => {
        if (!(c !== void 0 && d.length >= c))
            return d.push(e.cursor.value),
            mi(e)
    }
    ).then( () => d)
}
var fi = class {
    constructor(a) {
        this.h = a
    }
    add(a, b) {
        return O(this.h.add(a, b))
    }
    autoIncrement() {
        return this.h.autoIncrement
    }
    clear() {
        return O(this.h.clear()).then( () => {}
        )
    }
    count(a) {
        return O(this.h.count(a))
    }
    delete(a) {
        return a instanceof IDBKeyRange ? li(this, a) : O(this.h.delete(a))
    }
    get(a) {
        return O(this.h.get(a))
    }
    getAll(a, b) {
        return "getAll" in IDBObjectStore.prototype ? O(this.h.getAll(a, b)) : ni(this, a, b)
    }
    index(a) {
        try {
            return new oi(this.h.index(a))
        } catch (b) {
            if (b instanceof Error && b.name === "NotFoundError")
                throw new Lh(a,this.h.name);
            throw b;
        }
    }
    getName() {
        return this.h.name
    }
    keyPath() {
        return this.h.keyPath
    }
}
;
function ci(a, b, c) {
    var d = new Promise( (e, f) => {
        try {
            let g = b(a);
            c && a.commit();
            g.then(h => {
                e(h)
            }
            ).catch(f)
        } catch (g) {
            f(g),
            a.abort()
        }
    }
    );
    return Promise.all([d, a.done]).then( ([e]) => e)
}
var bi = class {
    constructor(a) {
        this.h = a;
        this.i = new Map;
        this.aborted = !1;
        this.done = new Promise( (b, c) => {
            this.h.addEventListener("complete", () => {
                b()
            }
            );
            this.h.addEventListener("error", d => {
                d.currentTarget === d.target && c(this.h.error)
            }
            );
            this.h.addEventListener("abort", () => {
                var d = this.h.error;
                if (d)
                    c(d);
                else if (!this.aborted) {
                    d = N;
                    var e = this.h.objectStoreNames;
                    let f = [];
                    for (let g = 0; g < e.length; g++) {
                        let h = e.item(g);
                        if (h === null)
                            throw Error("Invariant: item in DOMStringList is null");
                        f.push(h)
                    }
                    d = new d("UNKNOWN_ABORT",{
                        objectStoreNames: f.join(),
                        dbName: this.h.db.name,
                        mode: this.h.mode
                    });
                    c(d)
                }
            }
            )
        }
        )
    }
    abort() {
        this.h.abort();
        this.aborted = !0;
        throw new N("EXPLICIT_ABORT");
    }
    commit() {
        if (!this.aborted) {
            let a, b;
            (b = (a = this.h).commit) == null || b.call(a)
        }
    }
    objectStore(a) {
        a = this.h.objectStore(a);
        var b = this.i.get(a);
        b || (b = new fi(a),
        this.i.set(a, b));
        return b
    }
}
;
function pi(a, b, c) {
    var {query: d=null, direction: e="next"} = b;
    a = a.h.openCursor(d, e);
    return ki(a).then(f => Yh(f, c))
}
function qi(a, b, c) {
    var d = [];
    return pi(a, {
        query: b
    }, e => {
        if (!(c !== void 0 && d.length >= c))
            return d.push(e.cursor.value),
            mi(e)
    }
    ).then( () => d)
}
var oi = class {
    constructor(a) {
        this.h = a
    }
    count(a) {
        return O(this.h.count(a))
    }
    delete(a) {
        return pi(this, {
            query: a
        }, b => b.delete().then( () => mi(b)))
    }
    get(a) {
        return O(this.h.get(a))
    }
    getAll(a, b) {
        return "getAll" in IDBIndex.prototype ? O(this.h.getAll(a, b)) : qi(this, a, b)
    }
    keyPath() {
        return this.h.keyPath
    }
    unique() {
        return this.h.unique
    }
}
;
function ki(a) {
    return O(a).then(b => b ? new ri(a,b) : null)
}
function mi(a) {
    a.cursor.continue(void 0);
    return ki(a.request)
}
function si(a) {
    a.cursor.advance(5);
    return ki(a.request)
}
var ri = class {
    constructor(a, b) {
        this.request = a;
        this.cursor = b
    }
    delete() {
        return O(this.cursor.delete()).then( () => {}
        )
    }
    update(a) {
        return O(this.cursor.update(a))
    }
}
;
function ti(a, b, c) {
    return new Promise( (d, e) => {
        var f = b !== void 0 ? self.indexedDB.open(a, b) : self.indexedDB.open(a);
        var g = c.Ma, h = c.blocking, k = c.qb, l = c.upgrade, m = c.closed, p, q = () => {
            p || (p = new ii(f.result,{
                closed: m
            }));
            return p
        }
        ;
        f.addEventListener("upgradeneeded", n => {
            try {
                if (n.newVersion === null)
                    throw Error("Invariant: newVersion on IDbVersionChangeEvent is null");
                if (f.transaction === null)
                    throw Error("Invariant: transaction on IDbOpenDbRequest is null");
                n.dataLoss && n.dataLoss !== "none" && Dh("IDB_DATA_CORRUPTED", {
                    reason: n.dataLossMessage || "unknown reason",
                    dbName: Fh(a)
                });
                let r = q()
                  , w = new bi(f.transaction);
                l && l(r, x => n.oldVersion < x && n.newVersion >= x, w);
                w.done.catch(x => {
                    e(x)
                }
                )
            } catch (r) {
                e(r)
            }
        }
        );
        f.addEventListener("success", () => {
            var n = f.result;
            h && n.addEventListener("versionchange", () => {
                h(q())
            }
            );
            n.addEventListener("close", () => {
                Dh("IDB_UNEXPECTEDLY_CLOSED", {
                    dbName: Fh(a),
                    dbVersion: n.version
                });
                k && k()
            }
            );
            d(q())
        }
        );
        f.addEventListener("error", () => {
            e(f.error)
        }
        );
        g && f.addEventListener("blocked", () => {
            g()
        }
        )
    }
    )
}
function ui(a, b, c={}) {
    return ti(a, b, c)
}
function vi(a, b={}) {
    return u(function*() {
        try {
            let c = self.indexedDB.deleteDatabase(a)
              , d = b.Ma;
            d && c.addEventListener("blocked", () => {
                d()
            }
            );
            yield Xh(c)
        } catch (c) {
            throw Nh(c, a, "", -1);
        }
    })
}
;function wi(a, b) {
    return new N("INCOMPATIBLE_DB_VERSION",{
        dbName: a.name,
        oldVersion: a.options.version,
        newVersion: b
    })
}
function xi(a, b) {
    if (!b)
        throw Oh("openWithToken", Fh(a.name));
    return a.open()
}
var yi = class {
    constructor(a, b) {
        this.name = a;
        this.options = b;
        this.j = !0;
        this.m = this.l = 0
    }
    i(a, b, c={}) {
        return ui(a, b, c)
    }
    delete(a={}) {
        return vi(this.name, a)
    }
    open() {
        if (!this.j)
            throw wi(this);
        if (this.h)
            return this.h;
        var a, b = () => {
            this.h === a && (this.h = void 0)
        }
        , c = {
            blocking: e => {
                e.close()
            }
            ,
            closed: b,
            qb: b,
            upgrade: this.options.upgrade
        }, d = () => {
            var e = this;
            return u(function*() {
                var f, g = (f = Error().stack) != null ? f : "";
                try {
                    let k = yield e.i(e.name, e.options.version, c);
                    f = k;
                    var h = e.options;
                    let l = [];
                    for (let m of Object.keys(h.O)) {
                        let {N: p, bc: q=Number.MAX_VALUE} = h.O[m];
                        !(f.h.version >= p) || f.h.version >= q || f.h.objectStoreNames.contains(m) || l.push(m)
                    }
                    if (l.length !== 0) {
                        let m = Object.keys(e.options.O)
                          , p = k.objectStoreNames();
                        if (e.m < Gg("ytidb_reopen_db_retries", 0))
                            return e.m++,
                            k.close(),
                            Ch(new N("DB_REOPENED_BY_MISSING_OBJECT_STORES",{
                                dbName: e.name,
                                expectedObjectStores: m,
                                foundObjectStores: p
                            })),
                            d();
                        if (e.l < Gg("ytidb_remake_db_retries", 1))
                            return e.l++,
                            yield e.delete(),
                            Ch(new N("DB_DELETED_BY_MISSING_OBJECT_STORES",{
                                dbName: e.name,
                                expectedObjectStores: m,
                                foundObjectStores: p
                            })),
                            d();
                        throw new Kh(p,m);
                    }
                    return k
                } catch (k) {
                    if (k instanceof DOMException ? k.name === "VersionError" : "DOMError" in self && k instanceof DOMError ? k.name === "VersionError" : k instanceof Object && "message" in k && k.message === "An attempt was made to open a database using a lower version than the existing version.") {
                        g = yield e.i(e.name, void 0, Object.assign({}, c, {
                            upgrade: void 0
                        }));
                        h = g.h.version;
                        if (e.options.version !== void 0 && h > e.options.version + 1)
                            throw g.close(),
                            e.j = !1,
                            wi(e, h);
                        return g
                    }
                    b();
                    k instanceof Error && !M("ytidb_async_stack_killswitch") && (k.stack = `${k.stack}\n${g.substring(g.indexOf("\n") + 1)}`);
                    let l;
                    throw Nh(k, e.name, "", (l = e.options.version) != null ? l : -1);
                }
            })
        }
        ;
        return this.h = a = d()
    }
}
;
const zi = new yi("YtIdbMeta",{
    O: {
        databases: {
            N: 1
        }
    },
    upgrade(a, b) {
        b(1) && ei(a, "databases", {
            keyPath: "actualName"
        })
    }
});
function Ai(a, b) {
    return u(function*() {
        return ai(yield xi(zi, b), ["databases"], {
            H: !0,
            mode: "readwrite"
        }, c => {
            var d = c.objectStore("databases");
            return d.get(a.actualName).then(e => {
                if (e ? a.actualName !== e.actualName || a.publicName !== e.publicName || a.userIdentifier !== e.userIdentifier : 1)
                    return O(d.h.put(a, void 0)).then( () => {}
                    )
            }
            )
        }
        )
    })
}
function Bi(a, b) {
    return u(function*() {
        if (a)
            return (yield xi(zi, b)).delete("databases", a)
    })
}
;let Ci;
const Di = new class {
    constructor() {}
}
(new class {
    constructor() {}
}
);
function Ei() {
    return u(function*() {
        return !0
    })
}
function Fi() {
    if (Ci !== void 0)
        return Ci;
    Bh = !0;
    return Ci = Ei().then(a => {
        Bh = !1;
        return a
    }
    )
}
function Gi() {
    return y("ytglobal.idbToken_") || void 0
}
function Hi() {
    var a = Gi();
    return a ? Promise.resolve(a) : Fi().then(b => {
        b ? (z("ytglobal.idbToken_", Di),
        b = Di) : b = void 0;
        return b
    }
    )
}
;new kf;
function Ii(a) {
    try {
        rh();
        var b = !0
    } catch (c) {
        b = !1
    }
    if (!b)
        throw a = new N("AUTH_INVALID",{
            dbName: a
        }),
        Ch(a),
        a;
    b = rh();
    return {
        actualName: `${a}:${b}`,
        publicName: a,
        userIdentifier: b
    }
}
function Ji(a, b, c, d) {
    return u(function*() {
        var e, f = (e = Error().stack) != null ? e : "";
        e = yield Hi();
        if (!e)
            throw e = Oh("openDbImpl", a, b),
            M("ytidb_async_stack_killswitch") || (e.stack = `${e.stack}\n${f.substring(f.indexOf("\n") + 1)}`),
            Ch(e),
            e;
        Eh(a);
        f = c ? {
            actualName: a,
            publicName: a,
            userIdentifier: void 0
        } : Ii(a);
        try {
            return yield Ai(f, e),
            yield ui(f.actualName, b, d)
        } catch (g) {
            try {
                yield Bi(f.actualName, e)
            } catch (h) {}
            throw g;
        }
    })
}
function Ki(a, b, c={}) {
    return Ji(a, b, !1, c)
}
function Li(a, b, c={}) {
    return Ji(a, b, !0, c)
}
function Mi(a, b={}) {
    return u(function*() {
        var c = yield Hi();
        if (c) {
            Eh(a);
            var d = Ii(a);
            yield vi(d.actualName, b);
            yield Bi(d.actualName, c)
        }
    })
}
function Ni(a, b={}) {
    return u(function*() {
        var c = yield Hi();
        c && (Eh(a),
        yield vi(a, b),
        yield Bi(a, c))
    })
}
;function Oi(a, b) {
    var c;
    return () => {
        c || (c = new Pi(a,b));
        return c
    }
}
var Pi = class extends yi {
    constructor(a, b) {
        super(a, b);
        this.options = b;
        Eh(a)
    }
    i(a, b, c={}) {
        return (this.options.shared ? Li : Ki)(a, b, Object.assign({}, c))
    }
    delete(a={}) {
        return (this.options.shared ? Ni : Mi)(this.name, a)
    }
}
;
function Qi(a, b) {
    return Oi(a, b)
}
;var Ri = Qi("ytGcfConfig", {
    O: {
        coldConfigStore: {
            N: 1
        },
        hotConfigStore: {
            N: 1
        }
    },
    shared: !1,
    upgrade(a, b) {
        b(1) && (ei(a, "hotConfigStore", {
            keyPath: "key",
            autoIncrement: !0
        }).h.createIndex("hotTimestampIndex", "timestamp", {
            unique: !1
        }),
        ei(a, "coldConfigStore", {
            keyPath: "key",
            autoIncrement: !0
        }).h.createIndex("coldTimestampIndex", "timestamp", {
            unique: !1
        }))
    },
    version: 1
});
function Si(a) {
    return xi(Ri(), a)
}
function Ti(a, b, c) {
    return u(function*() {
        var d = {
            config: a,
            hashData: b,
            timestamp: P()
        }
          , e = yield Si(c);
        yield e.clear("hotConfigStore");
        return yield gi(e, "hotConfigStore", d)
    })
}
function Ui(a, b, c, d) {
    return u(function*() {
        var e = {
            config: a,
            hashData: b,
            configData: c,
            timestamp: P()
        }
          , f = yield Si(d);
        yield f.clear("coldConfigStore");
        return yield gi(f, "coldConfigStore", e)
    })
}
function Vi(a) {
    return u(function*() {
        var b = void 0;
        yield ai(yield Si(a), ["coldConfigStore"], {
            mode: "readwrite",
            H: !0
        }, c => pi(c.objectStore("coldConfigStore").index("coldTimestampIndex"), {
            direction: "prev"
        }, d => {
            b = d.cursor.value
        }
        ));
        return b
    })
}
function Wi(a) {
    return u(function*() {
        var b = void 0;
        yield ai(yield Si(a), ["hotConfigStore"], {
            mode: "readwrite",
            H: !0
        }, c => pi(c.objectStore("hotConfigStore").index("hotTimestampIndex"), {
            direction: "prev"
        }, d => {
            b = d.cursor.value
        }
        ));
        return b
    })
}
;var Xi = class extends Ge {
    constructor() {
        super();
        this.i = [];
        this.h = [];
        var a = y("yt.gcf.config.hotUpdateCallbacks");
        a ? (this.i = [...a],
        this.h = a) : (this.h = [],
        z("yt.gcf.config.hotUpdateCallbacks", this.h))
    }
    R() {
        for (let b of this.i) {
            var a = this.h;
            let c = a.indexOf(b);
            c >= 0 && a.splice(c, 1)
        }
        this.i.length = 0;
        super.R()
    }
}
;
function Yi(a, b, c) {
    return u(function*() {
        if (M("start_client_gcf")) {
            c && (a.j = c,
            z("yt.gcf.config.hotConfigGroup", a.j || null));
            a.hotHashData = b;
            z("yt.gcf.config.hotHashData", a.hotHashData || null);
            var d = Gi();
            if (d) {
                if (!c) {
                    var e;
                    c = (e = yield Wi(d)) == null ? void 0 : e.config
                }
                yield Ti(c, b, d)
            }
            if (c) {
                d = a.i;
                e = c;
                for (let f of d.h)
                    f(e)
            }
        }
    })
}
function Zi(a, b, c) {
    return u(function*() {
        if (M("start_client_gcf")) {
            a.coldHashData = b;
            z("yt.gcf.config.coldHashData", a.coldHashData || null);
            let d = Gi();
            if (d) {
                if (!c) {
                    let e;
                    c = (e = yield Vi(d)) == null ? void 0 : e.config
                }
                c && (yield Ui(c, b, c.configData, d))
            }
        }
    })
}
var $i = class {
    constructor() {
        this.h = 0;
        this.i = new Xi
    }
}
;
function aj() {
    return "INNERTUBE_API_KEY" in yg && "INNERTUBE_API_VERSION" in yg
}
function bj() {
    return {
        innertubeApiKey: L("INNERTUBE_API_KEY"),
        innertubeApiVersion: L("INNERTUBE_API_VERSION"),
        ha: L("INNERTUBE_CONTEXT_CLIENT_CONFIG_INFO"),
        Wa: L("INNERTUBE_CONTEXT_CLIENT_NAME", "WEB"),
        Xa: L("INNERTUBE_CONTEXT_CLIENT_NAME", 1),
        innertubeContextClientVersion: L("INNERTUBE_CONTEXT_CLIENT_VERSION"),
        ya: L("INNERTUBE_CONTEXT_HL"),
        xa: L("INNERTUBE_CONTEXT_GL"),
        Ya: L("INNERTUBE_HOST_OVERRIDE") || "",
        Za: !!L("INNERTUBE_USE_THIRD_PARTY_AUTH", !1),
        Rb: !!L("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT", !1),
        appInstallData: L("SERIALIZED_CLIENT_CONFIG_DATA")
    }
}
function cj(a) {
    var b = {
        client: {
            hl: a.ya,
            gl: a.xa,
            clientName: a.Wa,
            clientVersion: a.innertubeContextClientVersion,
            configInfo: a.ha
        }
    };
    navigator.userAgent && (b.client.userAgent = String(navigator.userAgent));
    var c = v.devicePixelRatio;
    c && c != 1 && (b.client.screenDensityFloat = String(c));
    c = Hg();
    c !== "" && (b.client.experimentsToken = c);
    c = Ig();
    c.length > 0 && (b.request = {
        internalExperimentFlags: c
    });
    dj(void 0, b);
    ej(a, void 0, b);
    M("start_client_gcf") && fj(void 0, b);
    L("DELEGATED_SESSION_ID") && !M("pageid_as_header_web") && (b.user = {
        onBehalfOfUser: L("DELEGATED_SESSION_ID")
    });
    !M("fill_delegate_context_in_gel_killswitch") && (a = L("INNERTUBE_CONTEXT_SERIALIZED_DELEGATION_CONTEXT")) && (b.user = Object.assign({}, b.user, {
        serializedDelegationContext: a
    }));
    a = L("INNERTUBE_CONTEXT");
    var d;
    if (M("enable_persistent_device_token") && (a == null ? 0 : (d = a.client) == null ? 0 : d.rolloutToken)) {
        var e;
        b.client.rolloutToken = a == null ? void 0 : (e = a.client) == null ? void 0 : e.rolloutToken
    }
    d = Object;
    e = d.assign;
    a = b.client;
    var f = L("DEVICE", "");
    c = {};
    for (let[g,h] of Object.entries(Og(f))) {
        f = g;
        let k = h;
        f === "cbrand" ? c.deviceMake = k : f === "cmodel" ? c.deviceModel = k : f === "cbr" ? c.browserName = k : f === "cbrver" ? c.browserVersion = k : f === "cos" ? c.osName = k : f === "cosver" ? c.osVersion = k : f === "cplatform" && (c.platform = k)
    }
    b.client = e.call(d, a, c);
    return b
}
function dj(a, b) {
    var c = y("yt.embedded_player.embed_url");
    c && (a ? (b = yd(a, Vf, 7) || new Vf,
    H(b, 4, c),
    G(a, Vf, 7, b)) : b && (b.thirdParty = {
        embedUrl: c
    }))
}
function ej(a, b, c) {
    if (a.appInstallData)
        if (b) {
            let d;
            c = (d = yd(b, Of, 62)) != null ? d : new Of;
            H(c, 6, a.appInstallData);
            G(b, Of, 62, c)
        } else
            c && (c.client.configInfo = c.client.configInfo || {},
            c.client.configInfo.appInstallData = a.appInstallData)
}
function gj(a, b, c={}) {
    var d = {};
    L("EOM_VISITOR_DATA") ? d = {
        "X-Goog-EOM-Visitor-Id": L("EOM_VISITOR_DATA")
    } : d = {
        "X-Goog-Visitor-Id": c.visitorData || L("VISITOR_DATA", "")
    };
    if (b && b.includes("www.youtube-nocookie.com"))
        return d;
    b = c.Ib || L("AUTHORIZATION");
    b || (a ? b = `Bearer ${y("gapi.auth.getToken")().Hb}` : (a = oh(mh()),
    M("pageid_as_header_web") || delete a["X-Goog-PageId"],
    d = Object.assign({}, d, a)));
    b && (d.Authorization = b);
    return d
}
function fj(a, b) {
    if (!$i.instance) {
        var c = new $i;
        $i.instance = c
    }
    c = $i.instance;
    var d = P() - c.h;
    if (c.h !== 0 && d < Gg("send_config_hash_timer"))
        c = void 0;
    else {
        d = y("yt.gcf.config.coldConfigData");
        var e = y("yt.gcf.config.hotHashData")
          , f = y("yt.gcf.config.coldHashData");
        d && e && f && (c.h = P());
        c = {
            coldConfigData: d,
            hotHashData: e,
            coldHashData: f
        }
    }
    if (d = c)
        if (e = d.coldConfigData,
        c = d.coldHashData,
        d = d.hotHashData,
        a) {
            var g;
            b = (g = yd(a, Of, 62)) != null ? g : new Of;
            g = H(b, 1, e);
            g = H(g, 3, c);
            H(g, 5, d);
            G(a, Of, 62, b)
        } else
            b && (b.client.configInfo = b.client.configInfo || {},
            e && (b.client.configInfo.coldConfigData = e),
            c && (b.client.configInfo.coldHashData = c),
            d && (b.client.configInfo.hotHashData = d))
}
;typeof TextEncoder !== "undefined" && new TextEncoder;
function hj(a) {
    this.version = 1;
    this.args = a
}
;function ij() {
    var a = jj;
    this.topic = "screen-created";
    this.h = a
}
ij.prototype.toString = function() {
    return this.topic
}
;
const kj = y("ytPubsub2Pubsub2Instance") || new lf;
lf.prototype.subscribe = lf.prototype.subscribe;
lf.prototype.unsubscribeByKey = lf.prototype.aa;
lf.prototype.publish = lf.prototype.na;
lf.prototype.clear = lf.prototype.clear;
z("ytPubsub2Pubsub2Instance", kj);
const lj = y("ytPubsub2Pubsub2SubscribedKeys") || {};
z("ytPubsub2Pubsub2SubscribedKeys", lj);
const mj = y("ytPubsub2Pubsub2TopicToKeys") || {};
z("ytPubsub2Pubsub2TopicToKeys", mj);
const nj = y("ytPubsub2Pubsub2IsAsync") || {};
z("ytPubsub2Pubsub2IsAsync", nj);
z("ytPubsub2Pubsub2SkipSubKey", null);
function oj(a, b) {
    var c = pj();
    c && c.publish.call(c, a.toString(), a, b)
}
function qj(a) {
    var b = rj
      , c = pj();
    if (!c)
        return 0;
    var d = c.subscribe(b.toString(), (e, f) => {
        var g = y("ytPubsub2Pubsub2SkipSubKey");
        g && g == d || (g = () => {
            if (lj[d])
                try {
                    if (f && b instanceof ij && b != e)
                        try {
                            {
                                var h = b.h
                                  , k = f;
                                if (!k.args || !k.version)
                                    throw Error("yt.pubsub2.Data.deserialize(): serializedData is incomplete.");
                                let l;
                                try {
                                    if (!h.Aa) {
                                        let m = new h;
                                        h.Aa = m.version
                                    }
                                    l = h.Aa
                                } catch (m) {}
                                if (!l || k.version != l)
                                    throw Error("yt.pubsub2.Data.deserialize(): serializedData version is incompatible.");
                                try {
                                    f = Reflect.construct(h, Ca(k.args))
                                } catch (m) {
                                    throw m.message = "yt.pubsub2.Data.deserialize(): " + m.message,
                                    m;
                                }
                            }
                        } catch (l) {
                            throw l.message = "yt.pubsub2.pubsub2 cross-binary conversion error for " + b.toString() + ": " + l.message,
                            l;
                        }
                    a.call(window, f)
                } catch (l) {
                    Cg(l)
                }
        }
        ,
        nj[b.toString()] ? y("yt.scheduler.instance") ? yh.h(g) : Sg(g, 0) : g())
    }
    );
    lj[d] = !0;
    mj[b.toString()] || (mj[b.toString()] = []);
    mj[b.toString()].push(d);
    return d
}
function sj() {
    var a = tj
      , b = qj(function(c) {
        a.apply(void 0, arguments);
        uj(b)
    });
    return b
}
function uj(a) {
    var b = pj();
    b && (typeof a === "number" && (a = [a]),
    za(a, c => {
        b.unsubscribeByKey(c);
        delete lj[c]
    }
    ))
}
function pj() {
    return y("ytPubsub2Pubsub2Instance")
}
;var vj = {
    accountStateChangeSignedIn: 23,
    accountStateChangeSignedOut: 24,
    delayedEventMetricCaptured: 11,
    latencyActionBaselined: 6,
    latencyActionInfo: 7,
    latencyActionTicked: 5,
    offlineTransferStatusChanged: 2,
    offlineImageDownload: 335,
    playbackStartStateChanged: 9,
    systemHealthCaptured: 3,
    mangoOnboardingCompleted: 10,
    mangoPushNotificationReceived: 230,
    mangoUnforkDbMigrationError: 121,
    mangoUnforkDbMigrationSummary: 122,
    mangoUnforkDbMigrationPreunforkDbVersionNumber: 133,
    mangoUnforkDbMigrationPhoneMetadata: 134,
    mangoUnforkDbMigrationPhoneStorage: 135,
    mangoUnforkDbMigrationStep: 142,
    mangoAsyncApiMigrationEvent: 223,
    mangoDownloadVideoResult: 224,
    mangoHomepageVideoCount: 279,
    mangoHomeV3State: 295,
    mangoImageClientCacheHitEvent: 273,
    sdCardStatusChanged: 98,
    framesDropped: 12,
    thumbnailHovered: 13,
    deviceRetentionInfoCaptured: 14,
    thumbnailLoaded: 15,
    backToAppEvent: 318,
    streamingStatsCaptured: 17,
    offlineVideoShared: 19,
    appCrashed: 20,
    youThere: 21,
    offlineStateSnapshot: 22,
    mdxSessionStarted: 25,
    mdxSessionConnected: 26,
    mdxSessionDisconnected: 27,
    bedrockResourceConsumptionSnapshot: 28,
    nextGenWatchWatchSwiped: 29,
    kidsAccountsSnapshot: 30,
    zeroStepChannelCreated: 31,
    tvhtml5SearchCompleted: 32,
    offlineSharePairing: 34,
    offlineShareUnlock: 35,
    mdxRouteDistributionSnapshot: 36,
    bedrockRepetitiveActionTimed: 37,
    unpluggedDegradationInfo: 229,
    uploadMp4HeaderMoved: 38,
    uploadVideoTranscoded: 39,
    uploadProcessorStarted: 46,
    uploadProcessorEnded: 47,
    uploadProcessorReady: 94,
    uploadProcessorRequirementPending: 95,
    uploadProcessorInterrupted: 96,
    uploadFrontendEvent: 241,
    assetPackDownloadStarted: 41,
    assetPackDownloaded: 42,
    assetPackApplied: 43,
    assetPackDeleted: 44,
    appInstallAttributionEvent: 459,
    playbackSessionStopped: 45,
    adBlockerMessagingShown: 48,
    distributionChannelCaptured: 49,
    dataPlanCpidRequested: 51,
    detailedNetworkTypeCaptured: 52,
    sendStateUpdated: 53,
    receiveStateUpdated: 54,
    sendDebugStateUpdated: 55,
    receiveDebugStateUpdated: 56,
    kidsErrored: 57,
    mdxMsnSessionStatsFinished: 58,
    appSettingsCaptured: 59,
    mdxWebSocketServerHttpError: 60,
    mdxWebSocketServer: 61,
    startupCrashesDetected: 62,
    coldStartInfo: 435,
    offlinePlaybackStarted: 63,
    liveChatMessageSent: 225,
    liveChatUserPresent: 434,
    liveChatBeingModerated: 457,
    liveChatGiftButtonImpressed: 558,
    liveCreationCameraUpdated: 64,
    liveCreationEncodingCaptured: 65,
    liveCreationError: 66,
    liveCreationHealthUpdated: 67,
    liveCreationVideoEffectsCaptured: 68,
    liveCreationStageOccured: 75,
    offlineSystemFailure: 546,
    liveCreationBroadcastScheduled: 123,
    liveCreationArchiveReplacement: 149,
    liveCreationCostreamingConnection: 421,
    liveCreationPlayablesMetrics: 533,
    liveCreationStreamWebrtcStats: 288,
    liveCreationWebrtcError: 526,
    mdxSessionRecoveryStarted: 69,
    mdxSessionRecoveryCompleted: 70,
    mdxSessionRecoveryStopped: 71,
    visualElementShown: 72,
    visualElementHidden: 73,
    visualElementGestured: 78,
    visualElementStateChanged: 208,
    screenCreated: 156,
    playbackAssociated: 202,
    visualElementAttached: 215,
    playbackContextEvent: 214,
    cloudCastingPlaybackStarted: 74,
    webPlayerApiCalled: 76,
    tvhtml5AccountDialogOpened: 79,
    foregroundHeartbeat: 80,
    foregroundHeartbeatScreenAssociated: 111,
    kidsOfflineSnapshot: 81,
    mdxEncryptionSessionStatsFinished: 82,
    playerRequestCompleted: 83,
    liteSchedulerStatistics: 84,
    mdxSignIn: 85,
    spacecastMetadataLookupRequested: 86,
    spacecastBatchLookupRequested: 87,
    spacecastSummaryRequested: 88,
    spacecastPlayback: 89,
    spacecastDiscovery: 90,
    tvhtml5LaunchUrlComponentChanged: 91,
    mdxBackgroundPlaybackRequestCompleted: 92,
    mdxBrokenAdditionalDataDeviceDetected: 93,
    tvhtml5LocalStorage: 97,
    tvhtml5DeviceStorageStatus: 147,
    autoCaptionsAvailable: 99,
    playbackScrubbingEvent: 339,
    flexyState: 100,
    interfaceOrientationCaptured: 101,
    mainAppBrowseFragmentCache: 102,
    offlineCacheVerificationFailure: 103,
    offlinePlaybackExceptionDigest: 217,
    vrCopresenceStats: 104,
    vrCopresenceSyncStats: 130,
    vrCopresenceCommsStats: 137,
    vrCopresencePartyStats: 153,
    vrCopresenceEmojiStats: 213,
    vrCopresenceEvent: 141,
    vrCopresenceFlowTransitEvent: 160,
    vrCowatchPartyEvent: 492,
    vrCowatchUserStartOrJoinEvent: 504,
    vrPlaybackEvent: 345,
    kidsAgeGateTracking: 105,
    offlineDelayAllowedTracking: 106,
    mainAppAutoOfflineState: 107,
    videoAsThumbnailDownload: 108,
    videoAsThumbnailPlayback: 109,
    liteShowMore: 110,
    renderingError: 118,
    kidsProfilePinGateTracking: 119,
    abrTrajectory: 124,
    scrollEvent: 125,
    streamzIncremented: 126,
    kidsProfileSwitcherTracking: 127,
    kidsProfileCreationTracking: 129,
    buyFlowStarted: 136,
    integrationAttributionEvent: 556,
    mbsConnectionInitiated: 138,
    mbsPlaybackInitiated: 139,
    mbsLoadChildren: 140,
    liteProfileFetcher: 144,
    mdxRemoteTransaction: 146,
    reelPlaybackError: 148,
    reachabilityDetectionEvent: 150,
    mobilePlaybackEvent: 151,
    courtsidePlayerStateChanged: 152,
    musicPersistentCacheChecked: 154,
    musicPersistentCacheCleared: 155,
    playbackInterrupted: 157,
    playbackInterruptionResolved: 158,
    fixFopFlow: 159,
    anrDetection: 161,
    backstagePostCreationFlowEnded: 162,
    clientError: 163,
    gamingAccountLinkStatusChanged: 164,
    liteHousewarming: 165,
    buyFlowEvent: 167,
    kidsParentalGateTracking: 168,
    kidsSignedOutSettingsStatus: 437,
    kidsSignedOutPauseHistoryFixStatus: 438,
    tvhtml5WatchdogViolation: 444,
    ypcUpgradeFlow: 169,
    yongleStudy: 170,
    ypcUpdateFlowStarted: 171,
    ypcUpdateFlowCancelled: 172,
    ypcUpdateFlowSucceeded: 173,
    ypcUpdateFlowFailed: 174,
    liteGrowthkitPromo: 175,
    paymentFlowStarted: 341,
    transactionFlowShowPaymentDialog: 405,
    transactionFlowStarted: 176,
    transactionFlowSecondaryDeviceStarted: 222,
    transactionFlowSecondaryDeviceSignedOutStarted: 383,
    transactionFlowCancelled: 177,
    transactionFlowPaymentCallBackReceived: 387,
    transactionFlowPaymentSubmitted: 460,
    transactionFlowPaymentSucceeded: 329,
    transactionFlowSucceeded: 178,
    transactionFlowFailed: 179,
    transactionFlowPlayBillingConnectionStartEvent: 428,
    transactionFlowSecondaryDeviceSuccess: 458,
    transactionFlowErrorEvent: 411,
    liteVideoQualityChanged: 180,
    watchBreakEnablementSettingEvent: 181,
    watchBreakFrequencySettingEvent: 182,
    videoEffectsCameraPerformanceMetrics: 183,
    adNotify: 184,
    startupTelemetry: 185,
    playbackOfflineFallbackUsed: 186,
    outOfMemory: 187,
    ypcPauseFlowStarted: 188,
    ypcPauseFlowCancelled: 189,
    ypcPauseFlowSucceeded: 190,
    ypcPauseFlowFailed: 191,
    uploadFileSelected: 192,
    ypcResumeFlowStarted: 193,
    ypcResumeFlowCancelled: 194,
    ypcResumeFlowSucceeded: 195,
    ypcResumeFlowFailed: 196,
    adsClientStateChange: 197,
    ypcCancelFlowStarted: 198,
    ypcCancelFlowCancelled: 199,
    ypcCancelFlowSucceeded: 200,
    ypcCancelFlowFailed: 201,
    ypcCancelFlowGoToPaymentProcessor: 402,
    ypcDeactivateFlowStarted: 320,
    ypcRedeemFlowStarted: 203,
    ypcRedeemFlowCancelled: 204,
    ypcRedeemFlowSucceeded: 205,
    ypcRedeemFlowFailed: 206,
    ypcFamilyCreateFlowStarted: 258,
    ypcFamilyCreateFlowCancelled: 259,
    ypcFamilyCreateFlowSucceeded: 260,
    ypcFamilyCreateFlowFailed: 261,
    ypcFamilyManageFlowStarted: 262,
    ypcFamilyManageFlowCancelled: 263,
    ypcFamilyManageFlowSucceeded: 264,
    ypcFamilyManageFlowFailed: 265,
    restoreContextEvent: 207,
    embedsAdEvent: 327,
    autoplayTriggered: 209,
    clientDataErrorEvent: 210,
    experimentalVssValidation: 211,
    tvhtml5TriggeredEvent: 212,
    tvhtml5FrameworksFieldTrialResult: 216,
    tvhtml5FrameworksFieldTrialStart: 220,
    musicOfflinePreferences: 218,
    watchTimeSegment: 219,
    appWidthLayoutError: 221,
    accountRegistryChange: 226,
    userMentionAutoCompleteBoxEvent: 227,
    downloadRecommendationEnablementSettingEvent: 228,
    musicPlaybackContentModeChangeEvent: 231,
    offlineDbOpenCompleted: 232,
    kidsFlowEvent: 233,
    kidsFlowCorpusSelectedEvent: 234,
    videoEffectsEvent: 235,
    unpluggedOpsEogAnalyticsEvent: 236,
    playbackAudioRouteEvent: 237,
    interactionLoggingDebugModeError: 238,
    offlineYtbRefreshed: 239,
    kidsFlowError: 240,
    musicAutoplayOnLaunchAttempted: 242,
    deviceContextActivityEvent: 243,
    deviceContextEvent: 244,
    templateResolutionException: 245,
    musicSideloadedPlaylistServiceCalled: 246,
    embedsStorageAccessNotChecked: 247,
    embedsHasStorageAccessResult: 248,
    embedsItpPlayedOnReload: 249,
    embedsRequestStorageAccessResult: 250,
    embedsShouldRequestStorageAccessResult: 251,
    embedsRequestStorageAccessState: 256,
    embedsRequestStorageAccessFailedState: 257,
    embedsItpWatchLaterResult: 266,
    searchSuggestDecodingPayloadFailure: 252,
    siriShortcutActivated: 253,
    tvhtml5KeyboardPerformance: 254,
    latencyActionSpan: 255,
    elementsLog: 267,
    ytbFileOpened: 268,
    tfliteModelError: 269,
    apiTest: 270,
    yongleUsbSetup: 271,
    touStrikeInterstitialEvent: 272,
    liteStreamToSave: 274,
    appBundleClientEvent: 275,
    ytbFileCreationFailed: 276,
    adNotifyFailure: 278,
    ytbTransferFailed: 280,
    blockingRequestFailed: 281,
    liteAccountSelector: 282,
    liteAccountUiCallbacks: 283,
    dummyPayload: 284,
    browseResponseValidationEvent: 285,
    entitiesError: 286,
    musicIosBackgroundFetch: 287,
    mdxNotificationEvent: 289,
    layersValidationError: 290,
    musicPwaInstalled: 291,
    liteAccountCleanup: 292,
    html5PlayerHealthEvent: 293,
    watchRestoreAttempt: 294,
    liteAccountSignIn: 296,
    notaireEvent: 298,
    kidsVoiceSearchEvent: 299,
    adNotifyFilled: 300,
    delayedEventDropped: 301,
    analyticsSearchEvent: 302,
    systemDarkThemeOptOutEvent: 303,
    flowEvent: 304,
    networkConnectivityBaselineEvent: 305,
    ytbFileImported: 306,
    downloadStreamUrlExpired: 307,
    directSignInEvent: 308,
    lyricImpressionEvent: 309,
    accessibilityStateEvent: 310,
    tokenRefreshEvent: 311,
    genericAttestationExecution: 312,
    tvhtml5VideoSeek: 313,
    unpluggedAutoPause: 314,
    scrubbingEvent: 315,
    bedtimeReminderEvent: 317,
    tvhtml5UnexpectedRestart: 319,
    tvhtml5DeviceStorageStats: 535,
    tvhtml5StabilityTraceEvent: 478,
    tvhtml5OperationHealth: 467,
    tvhtml5WatchKeyEvent: 321,
    voiceLanguageChanged: 322,
    tvhtml5LiveChatStatus: 323,
    parentToolsCorpusSelectedEvent: 324,
    offerAdsEnrollmentInitiated: 325,
    networkQualityIntervalEvent: 326,
    deviceStartupMetrics: 328,
    heartbeatActionPlayerTransitioned: 330,
    tvhtml5Lifecycle: 331,
    heartbeatActionPlayerHalted: 332,
    adaptiveInlineMutedSettingEvent: 333,
    mainAppLibraryLoadingState: 334,
    thirdPartyLogMonitoringEvent: 336,
    appShellAssetLoadReport: 337,
    tvhtml5AndroidAttestation: 338,
    tvhtml5StartupSoundEvent: 340,
    iosBackgroundRefreshTask: 342,
    iosBackgroundProcessingTask: 343,
    sliEventBatch: 344,
    postImpressionEvent: 346,
    musicSideloadedPlaylistExport: 347,
    idbUnexpectedlyClosed: 348,
    voiceSearchEvent: 349,
    mdxSessionCastEvent: 350,
    idbQuotaExceeded: 351,
    idbTransactionEnded: 352,
    idbTransactionAborted: 353,
    tvhtml5KeyboardLogging: 354,
    idbIsSupportedCompleted: 355,
    creatorStudioMobileEvent: 356,
    idbDataCorrupted: 357,
    parentToolsAppChosenEvent: 358,
    webViewBottomSheetResized: 359,
    activeStateControllerScrollPerformanceSummary: 360,
    navigatorValidation: 361,
    mdxSessionHeartbeat: 362,
    clientHintsPolyfillDiagnostics: 363,
    clientHintsPolyfillEvent: 364,
    proofOfOriginTokenError: 365,
    kidsAddedAccountSummary: 366,
    musicWearableDevice: 367,
    ypcRefundFlowEvent: 368,
    tvhtml5PlaybackMeasurementEvent: 369,
    tvhtml5WatermarkMeasurementEvent: 370,
    clientExpGcfPropagationEvent: 371,
    mainAppReferrerIntent: 372,
    leaderLockEnded: 373,
    leaderLockAcquired: 374,
    googleHatsEvent: 375,
    persistentLensLaunchEvent: 376,
    parentToolsChildWelcomeChosenEvent: 378,
    browseThumbnailPreloadEvent: 379,
    finalPayload: 380,
    mdxDialAdditionalDataUpdateEvent: 381,
    webOrchestrationTaskLifecycleRecord: 382,
    startupSignalEvent: 384,
    accountError: 385,
    gmsDeviceCheckEvent: 386,
    accountSelectorEvent: 388,
    accountUiCallbacks: 389,
    mdxDialAdditionalDataProbeEvent: 390,
    downloadsSearchIcingApiStats: 391,
    downloadsSearchIndexUpdatedEvent: 397,
    downloadsSearchIndexSnapshot: 398,
    dataPushClientEvent: 392,
    kidsCategorySelectedEvent: 393,
    mdxDeviceManagementSnapshotEvent: 394,
    prefetchRequested: 395,
    prefetchableCommandExecuted: 396,
    gelDebuggingEvent: 399,
    webLinkTtsPlayEnd: 400,
    clipViewInvalid: 401,
    persistentStorageStateChecked: 403,
    cacheWipeoutEvent: 404,
    playerEvent: 410,
    sfvEffectPipelineStartedEvent: 412,
    sfvEffectPipelinePausedEvent: 429,
    sfvEffectPipelineEndedEvent: 413,
    sfvEffectChosenEvent: 414,
    sfvEffectLoadedEvent: 415,
    sfvEffectUserInteractionEvent: 465,
    sfvEffectFirstFrameProcessedLatencyEvent: 416,
    sfvEffectAggregatedFramesProcessedLatencyEvent: 417,
    sfvEffectAggregatedFramesDroppedEvent: 418,
    sfvEffectPipelineErrorEvent: 430,
    sfvEffectGraphFrozenEvent: 419,
    sfvEffectGlThreadBlockedEvent: 420,
    mdeQosEvent: 510,
    mdeVideoChangedEvent: 442,
    mdePlayerPerformanceMetrics: 472,
    mdeExporterEvent: 497,
    genericClientExperimentEvent: 423,
    homePreloadTaskScheduled: 424,
    homePreloadTaskExecuted: 425,
    homePreloadCacheHit: 426,
    polymerPropertyChangedInObserver: 427,
    applicationStarted: 431,
    networkCronetRttBatch: 432,
    networkCronetRttSummary: 433,
    repeatChapterLoopEvent: 436,
    seekCancellationEvent: 462,
    lockModeTimeoutEvent: 483,
    externalVideoShareToYoutubeAttempt: 501,
    parentCodeEvent: 502,
    offlineTransferStarted: 4,
    musicOfflineMixtapePreferencesChanged: 16,
    mangoDailyNewVideosNotificationAttempt: 40,
    mangoDailyNewVideosNotificationError: 77,
    dtwsPlaybackStarted: 112,
    dtwsTileFetchStarted: 113,
    dtwsTileFetchCompleted: 114,
    dtwsTileFetchStatusChanged: 145,
    dtwsKeyframeDecoderBufferSent: 115,
    dtwsTileUnderflowedOnNonkeyframe: 116,
    dtwsBackfillFetchStatusChanged: 143,
    dtwsBackfillUnderflowed: 117,
    dtwsAdaptiveLevelChanged: 128,
    blockingVisitorIdTimeout: 277,
    liteSocial: 18,
    mobileJsInvocation: 297,
    biscottiBasedDetection: 439,
    coWatchStateChange: 440,
    embedsVideoDataDidChange: 441,
    shortsFirst: 443,
    cruiseControlEvent: 445,
    qoeClientLoggingContext: 446,
    atvRecommendationJobExecuted: 447,
    tvhtml5UserFeedback: 448,
    producerProjectCreated: 449,
    producerProjectOpened: 450,
    producerProjectDeleted: 451,
    producerProjectElementAdded: 453,
    producerProjectElementRemoved: 454,
    producerAppStateChange: 509,
    producerProjectDiskInsufficientExportFailure: 516,
    producerMediaServicesResetDetails: 522,
    tvhtml5ShowClockEvent: 455,
    deviceCapabilityCheckMetrics: 456,
    youtubeClearcutEvent: 461,
    offlineBrowseFallbackEvent: 463,
    getCtvTokenEvent: 464,
    startupDroppedFramesSummary: 466,
    screenshotEvent: 468,
    miniAppPlayEvent: 469,
    elementsDebugCounters: 470,
    fontLoadEvent: 471,
    webKillswitchReceived: 473,
    webKillswitchExecuted: 474,
    cameraOpenEvent: 475,
    manualSmoothnessMeasurement: 476,
    tvhtml5AppQualityEvent: 477,
    polymerPropertyAccessEvent: 479,
    miniAppSdkUsage: 480,
    cobaltTelemetryEvent: 481,
    crossDevicePlayback: 482,
    channelCreatedWithObakeImage: 484,
    channelEditedWithObakeImage: 485,
    offlineDeleteEvent: 486,
    crossDeviceNotificationTransfer: 487,
    androidIntentEvent: 488,
    unpluggedAmbientInterludesCounterfactualEvent: 489,
    keyPlaysPlayback: 490,
    shortsCreationFallbackEvent: 493,
    vssData: 491,
    castMatch: 494,
    miniAppPerformanceMetrics: 495,
    userFeedbackEvent: 496,
    kidsGuestSessionMismatch: 498,
    musicSideloadedPlaylistMigrationEvent: 499,
    sleepTimerSessionFinishEvent: 500,
    watchEpPromoConflict: 503,
    innertubeResponseCacheMetrics: 505,
    miniAppAdEvent: 506,
    dataPlanUpsellEvent: 507,
    producerProjectRenamed: 508,
    producerMediaSelectionEvent: 511,
    embedsAutoplayStatusChanged: 512,
    remoteConnectEvent: 513,
    connectedSessionMisattributionEvent: 514,
    producerProjectElementModified: 515,
    adsSeenClientLogging: 517,
    producerEvent: 518,
    tvhtml5CleanStart: 519,
    deviceAccountMetricsEvent: 520,
    derpLogEvent: 521,
    playablesPortalEvent: 523,
    ipValidationStarted: 524,
    ipValidationReceived: 525,
    reelsSequenceMutationEvent: 527,
    watchZoomStateChange: 528,
    metadataEditorEvent: 529,
    kidsPrismaDeeplinksEvent: 530,
    creationOrchestrationEvent: 531,
    coordinatedSamplingTriggered: 532,
    recapScreenshotEvent: 534,
    mdxLocalNetworkPermissionRequestEvent: 536,
    mdxLocalNetworkPermissionResponseEvent: 537,
    sessionReplayEvent: 538,
    sessionReplayStatusEvent: 539,
    loggingReliabilityProbe: 540,
    keyValueStoreStatsEvent: 541,
    deviceLocationPermissionEvent: 542,
    remoteControlStarted: 543,
    remoteControlCompleted: 544,
    reelsAdsEvents: 545,
    ytlrLoaderTestHarnessEvent: 547,
    biometricAuthenticationEvent: 548,
    mainAppLifecycleEvent: 549,
    musicDownloadBackgroundContinuedProcessingTask: 550,
    musicMetadataMismatchEvent: 551,
    scrollToComponentCompleted: 552,
    entityStoreTelemetry: 553,
    streamingDarkLaunchEvent: 554,
    childAccountsDisplayEvent: 555,
    tvfasPlaybackContext: 557,
    mdeC2PaEvent: 559,
    mdeBatchedPlayerEvents: 560,
    tvhtml5UlpCreationFlowData: 561,
    alwaysConnectedHandshakeRemoteControlStarted: 562,
    alwaysConnectedHandshakeRemoteControlCompleted: 563,
    alwaysConnectedHandshakeAwarenessStarted: 564,
    alwaysConnectedHandshakeAwarenessCompleted: 565,
    customThumbnailSourceMetadata: 567,
    miniAppInGameEvent: 568,
    androidToastyRun: 569
};
const wj = ["client.name", "client.version"];
function xj(a) {
    if (!a.errorMetadata || !a.errorMetadata.kvPairs)
        return a;
    a.errorMetadata.kvPairs = a.errorMetadata.kvPairs.filter(b => b.key ? wj.includes(b.key) : !1);
    return a
}
;var yj = Qi("ServiceWorkerLogsDatabase", {
    O: {
        SWHealthLog: {
            N: 1
        }
    },
    shared: !0,
    upgrade: (a, b) => {
        b(1) && ei(a, "SWHealthLog", {
            keyPath: "id",
            autoIncrement: !0
        }).h.createIndex("swHealthNewRequest", ["interface", "timestamp"], {
            unique: !1
        })
    }
    ,
    version: 1
});
function zj(a, b) {
    return u(function*() {
        var c = yield xi(yj(), b)
          , d = L("INNERTUBE_CONTEXT_CLIENT_NAME", 0)
          , e = Object.assign({}, a);
        e.clientError && (e.clientError = xj(e.clientError));
        e.interface = d;
        return gi(c, "SWHealthLog", e)
    })
}
;z("ytNetworklessLoggingInitializationOptions", v.ytNetworklessLoggingInitializationOptions || {
    isNwlInitialized: !1
});
function Aj(a, b, c, d) {
    !L("VISITOR_DATA") && b !== "visitor_id" && Math.random() < .01 && Eg(new J("Missing VISITOR_DATA when sending innertube request.",b,c,d));
    if (!a.isReady())
        throw a = new J("innertube xhrclient not ready",b,c,d),
        Cg(a),
        a;
    c = {
        headers: d.headers || {},
        method: "POST",
        postParams: c,
        postBody: d.postBody,
        postBodyFormat: d.postBodyFormat || "JSON",
        onTimeout: () => {
            d.onTimeout()
        }
        ,
        onFetchTimeout: d.onTimeout,
        onSuccess: (h, k) => {
            if (d.onSuccess)
                d.onSuccess(k)
        }
        ,
        onFetchSuccess: h => {
            if (d.onSuccess)
                d.onSuccess(h)
        }
        ,
        onProgress: h => {
            if (d.onProgress)
                d.onProgress(h)
        }
        ,
        onError: (h, k) => {
            if (d.onError)
                d.onError(k)
        }
        ,
        onFetchError: h => {
            if (d.onError)
                d.onError(h)
        }
        ,
        timeout: d.timeout,
        withCredentials: !0,
        compress: d.compress
    };
    c.headers["Content-Type"] || (c.headers["Content-Type"] = "application/json");
    var e = ""
      , f = a.config_.Ya;
    f && (e = f);
    f = a.config_.Za || !1;
    var g = gj(f, e, d);
    Object.assign(c.headers, g);
    c.headers.Authorization && !e && f && (c.headers["x-origin"] = window.location.origin);
    a = Pg(`${e}${`/youtubei/${a.config_.innertubeApiVersion}/${b}`}`, {
        alt: "json"
    });
    try {
        Wg(a, c)
    } catch (h) {
        if (h.name === "InvalidAccessError")
            Eg(Error("An extension is blocking network request."));
        else
            throw h;
    }
}
var Bj = class {
    constructor(a) {
        this.config_ = null;
        a ? this.config_ = a : aj() && (this.config_ = bj())
    }
    isReady() {
        !this.config_ && aj() && (this.config_ = bj());
        return !!this.config_
    }
}
;
let Cj = 0;
z("ytDomDomGetNextId", y("ytDomDomGetNextId") || ( () => ++Cj));
z("ytEventsEventsListeners", v.ytEventsEventsListeners || {});
z("ytEventsEventsCounter", v.ytEventsEventsCounter || {
    count: 0
});
v.ytPubsubPubsubInstance || new lf;
var Q = Symbol("injectionDeps");
var Dj = class {
    constructor(a) {
        this.key = a
    }
}
;
function R(a) {
    return new Dj(a)
}
;function Ej(a, b, c) {
    return a.stack.some(d => {
        if (d.key !== b)
            return !1;
        var e = Math.min(d.T.length, c.length);
        for (let f = 0; f < e; f++)
            if (d.T[f] !== c[f])
                return !1;
        return !0
    }
    )
}
var Fj = class {
    constructor() {
        this.stack = []
    }
    push(a, b) {
        this.stack.push({
            key: a,
            T: b
        })
    }
    pop() {
        this.stack.pop()
    }
}
;
function Gj(a, b) {
    var c = a.m.get(b);
    if (c)
        try {
            c.dc(a.resolve(b))
        } catch (d) {
            c.ac(d)
        }
    for (let d of a.l)
        d.h.has(b) || Gj(d, b)
}
function S(a, b) {
    a.h.set(b.u, b);
    Gj(a, b.u)
}
function Hj(a, b, c=!1) {
    if (Ej(a.j, b, a.T))
        throw Error(`Deps cycle for: ${b}`);
    if (a.i.has(b))
        return a.i.get(b);
    if (a.h.has(b)) {
        a.j.push(b, a.T);
        try {
            let f = a.h.get(b);
            var d = f;
            if (d.V !== void 0)
                var e = d.V;
            else if (d.P) {
                let g = d[Q] ? Ij(a, d[Q]) : [];
                e = d.P(...g)
            } else if (d.C) {
                let g = d.C
                  , h = g[Q] ? Ij(a, g[Q]) : [];
                e = new g(...h)
            } else {
                if (!c)
                    throw Error(`Could not resolve providers for: ${b}`);
                e = void 0
            }
            f.B || a.i.set(b, e);
            return e
        } finally {
            a.j.pop()
        }
    }
    if (a.parent)
        return Hj(a.parent, b, c);
    if (!c)
        throw Error(`No provider for: ${b}`);
}
function Ij(a, b) {
    return b ? b.map(c => c instanceof Dj ? Hj(a, c.key, !0) : Hj(a, c)) : []
}
var Jj = class {
    constructor() {
        this.h = new Map;
        this.m = new Map;
        this.i = new Map;
        this.l = new Set;
        this.parent = null;
        this.T = [this];
        this.j = new Fj;
        var a;
        (a = this.parent) == null || a.l.add(this)
    }
    resolve(a) {
        return a instanceof Dj ? Hj(this, a.key, !0) : Hj(this, a)
    }
}
;
var U = class {
    constructor(a) {
        this.name = a
    }
    toString() {
        return `InjectionToken(${this.name})`
    }
}
;
let Kj, Lj;
function Mj() {
    Lj || (Lj = Kj = new Jj);
    return Lj
}
;let Nj = window;
function Oj() {
    var a, b;
    return "h5vcc" in Nj && ((a = Nj.h5vcc.traceEvent) == null ? 0 : a.traceBegin) && ((b = Nj.h5vcc.traceEvent) == null ? 0 : b.traceEnd) ? 1 : "performance" in Nj && Nj.performance.mark && Nj.performance.measure ? 2 : 0
}
function Pj(a) {
    var b = Oj();
    switch (b) {
    case 1:
        Nj.h5vcc.traceEvent.traceBegin("YTLR", a);
        break;
    case 2:
        Nj.performance.mark(`${a}-start`);
        break;
    case 0:
        break;
    default:
        ya(b, "unknown trace type")
    }
}
function Qj(a) {
    var b = Oj();
    switch (b) {
    case 1:
        Nj.h5vcc.traceEvent.traceEnd("YTLR", a);
        break;
    case 2:
        b = `${a}-start`;
        let c = `${a}-end`;
        Nj.performance.mark(c);
        Nj.performance.measure(a, b, c);
        break;
    case 0:
        break;
    default:
        ya(b, "unknown trace type")
    }
}
;var Rj = M("web_enable_lifecycle_monitoring") && Oj() !== 0
  , Sj = M("web_enable_lifecycle_monitoring");
function Tj(a) {
    var b, c;
    (c = (b = window).onerror) == null || c.call(b, a.message, "", 0, 0, a)
}
;function Uj(a) {
    var b;
    return (b = a.priority) != null ? b : 0
}
function Vj(a) {
    var b = Array.from(a.h.keys()).sort( (c, d) => Uj(a.h[d]) - Uj(a.h[c]));
    for (let c of b)
        b = a.h[c],
        b.jobId === void 0 || b.Z || (a.scheduler.W(b.jobId),
        th(b.ia, 10))
}
var Wj = class {
    constructor(a) {
        this.scheduler = wh();
        this.i = new kf;
        this.h = a;
        for (let b = 0; b < this.h.length; b++) {
            let c = this.h[b];
            a = () => {
                c.ia();
                this.h[b].Z = !0;
                this.h.every(e => e.Z === !0) && this.i.resolve()
            }
            ;
            let d = th(a, Uj(c));
            this.h[b] = Object.assign({}, c, {
                ia: a,
                jobId: d
            })
        }
    }
    cancel() {
        for (let a of this.h)
            a.jobId === void 0 || a.Z || this.scheduler.W(a.jobId),
            a.Z = !0;
        this.i.resolve()
    }
}
;
function Xj(a, b, c) {
    Sj && console.groupCollapsed && console.groupEnd && (console.groupCollapsed(`[${a.constructor.name}] '${a.state}' to '${b}'`),
    console.log("with message: ", c),
    console.groupEnd())
}
function Yj(a, b) {
    var c = b.filter(e => Zj(a, e) === 10)
      , d = b.filter(e => Zj(a, e) !== 10);
    return a.m.fc ? (...e) => u(function*() {
        yield ak(c, ...e);
        bk(a, d, ...e)
    }) : (...e) => {
        ck(c, ...e);
        bk(a, d, ...e)
    }
}
function Zj(a, b) {
    var c, d;
    return (d = (c = a.l) != null ? c : b.priority) != null ? d : 0
}
function ak(a, ...b) {
    return u(function*() {
        wh();
        for (let c of a) {
            let d;
            uh( () => {
                dk(c.name);
                var e = ek( () => c.callback(...b));
                ec(e) ? d = M("web_lifecycle_error_handling_killswitch") ? e.then( () => {
                    fk(c.name)
                }
                ) : e.then( () => {
                    fk(c.name)
                }
                , f => {
                    Tj(f);
                    fk(c.name)
                }
                ) : fk(c.name)
            }
            );
            d && (yield d)
        }
    })
}
function bk(a, b, ...c) {
    b = b.map(d => {
        var e = Zj(a, d);
        return {
            ia: gk(d, ...c),
            priority: e
        }
    }
    );
    b.length && (a.i = new Wj(b))
}
function ck(a, ...b) {
    wh();
    for (let c of a)
        a = gk(c, ...b),
        uh(a)
}
function gk(a, ...b) {
    return () => {
        dk(a.name);
        ek( () => a.callback(...b));
        fk(a.name)
    }
}
function dk(a) {
    Rj && a && Pj(a)
}
function fk(a) {
    Rj && a && Qj(a)
}
var hk = class {
    constructor() {
        this.state = "none";
        this.plugins = [];
        this.l = void 0;
        this.j = [];
        this.m = {};
        Rj && Pj(this.state)
    }
    get currentState() {
        return this.state
    }
    install(a) {
        this.plugins.push(a);
        return this
    }
    transition(a, b) {
        Rj && Qj(this.state);
        var c = this.transitions.find(d => Array.isArray(d.from) ? d.from.find(e => e === this.state && d.to === a) : d.from === this.state && d.to === a);
        if (c) {
            this.i && (Vj(this.i),
            this.i = void 0);
            M("kevlar_startup_split") && this.j.length && (this.j.forEach(e => {
                Vj(e)
            }
            ),
            this.j = []);
            Xj(this, a, b);
            this.state = a;
            Rj && Pj(this.state);
            c = c.action.bind(this);
            let d = this.plugins.filter(e => e[a]).map(e => e[a]);
            c(Yj(this, d), b)
        } else
            throw Error(`no transition specified from ${this.state} to ${a}`);
    }
}
;
function ek(a) {
    if (M("web_lifecycle_error_handling_killswitch"))
        return a();
    try {
        return a()
    } catch (b) {
        Tj(b)
    }
}
;function ik() {
    jk || (jk = new kk);
    return jk
}
var kk = class extends hk {
    constructor() {
        super();
        this.h = null;
        this.l = 10;
        this.transitions = [{
            from: "none",
            to: "application_navigating",
            action: this.o
        }, {
            from: "application_navigating",
            to: "none",
            action: this.v
        }, {
            from: "application_navigating",
            to: "application_navigating",
            action: () => {}
        }, {
            from: "none",
            to: "none",
            action: () => {}
        }]
    }
    o(a, b) {
        this.h = sh( () => {
            this.currentState === "application_navigating" && this.transition("none")
        }
        , 5E3);
        a(b == null ? void 0 : b.event)
    }
    v(a, b) {
        this.h && (yh.W(this.h),
        this.h = null);
        a(b == null ? void 0 : b.event)
    }
}
, jk;
let lk = [];
z("yt.logging.transport.getScrapedGelPayloads", function() {
    return lk
});
let mk = void 0
  , nk = void 0;
function ok(a, b) {
    var c = pk(b);
    if (a.h[c])
        return a.h[c];
    var d = Object.keys(a.store) || [];
    if (d.length <= 1 && pk(b) === d[0])
        return d;
    var e = [];
    for (let g = 0; g < d.length; g++) {
        let h = d[g].split("/");
        if (qk(b.auth, h[0])) {
            var f = b.isJspb;
            qk(f === void 0 ? "undefined" : f ? "true" : "false", h[1]) && qk(b.cttAuthInfo, h[2]) && (f = b.tier,
            f = f === void 0 ? "undefined" : JSON.stringify(f),
            qk(f, h[3]) && e.push(d[g]))
        }
    }
    return a.h[c] = e
}
function qk(a, b) {
    return a === void 0 || a === "undefined" ? !0 : a === b
}
var rk = class {
    constructor() {
        this.store = {};
        this.h = {}
    }
    storePayload(a, b) {
        a = pk(a);
        this.store[a] ? this.store[a].push(b) : (this.h = {},
        this.store[a] = [b]);
        M("more_accurate_gel_parser") && (b = new CustomEvent("TRANSPORTING_NEW_EVENT"),
        window.dispatchEvent(b));
        return a
    }
    smartExtractMatchingEntries(a) {
        if (!a.keys.length)
            return [];
        var b = ok(this, a.keys.splice(0, 1)[0])
          , c = [];
        for (let d = 0; d < b.length; d++)
            this.store[b[d]] && a.sizeLimit && (this.store[b[d]].length <= a.sizeLimit ? (c.push(...this.store[b[d]]),
            delete this.store[b[d]]) : c.push(...this.store[b[d]].splice(0, a.sizeLimit)));
        (a == null ? 0 : a.sizeLimit) && c.length < (a == null ? void 0 : a.sizeLimit) && (a.sizeLimit -= c.length,
        c.push(...this.smartExtractMatchingEntries(a)));
        return c
    }
    extractMatchingEntries(a) {
        a = ok(this, a);
        var b = [];
        for (let c = 0; c < a.length; c++)
            this.store[a[c]] && (b.push(...this.store[a[c]]),
            delete this.store[a[c]]);
        return b
    }
    getSequenceCount(a) {
        a = ok(this, a);
        var b = 0;
        for (let c = 0; c < a.length; c++) {
            let d;
            b += ((d = this.store[a[c]]) == null ? void 0 : d.length) || 0
        }
        return b
    }
}
;
rk.prototype.getSequenceCount = rk.prototype.getSequenceCount;
rk.prototype.extractMatchingEntries = rk.prototype.extractMatchingEntries;
rk.prototype.smartExtractMatchingEntries = rk.prototype.smartExtractMatchingEntries;
rk.prototype.storePayload = rk.prototype.storePayload;
function pk(a) {
    return [a.auth === void 0 ? "undefined" : a.auth, a.isJspb === void 0 ? "undefined" : a.isJspb, a.cttAuthInfo === void 0 ? "undefined" : a.cttAuthInfo, a.tier === void 0 ? "undefined" : a.tier].join("/")
}
;function sk(a, b) {
    if (a)
        return a[b.name]
}
;var tk = new U("FinchConfigManagerService");
const uk = Gg("initial_gel_batch_timeout", 2E3)
  , vk = Gg("gel_queue_timeout_max_ms", 6E4)
  , wk = Gg("gel_min_batch_size", 5);
let xk = void 0
  , yk = null;
function zk() {
    return M("html5_send_qoe_on_gel") || M("web_send_vss3_isolated_payload")
}
function Ak(a) {
    yk = a;
    zk() && (v.ytLoggingTransportRegisteredClientCtor_ = a);
    xk = new a
}
class Bk {
    constructor() {
        this.l = this.i = this.j = 0;
        this.h = !1
    }
}
const Ck = new Bk
  , Dk = new Bk
  , Ek = new Bk
  , Fk = new Bk;
let Gk, Hk = !0, Ik = 1;
const Jk = new Map
  , Kk = v.ytLoggingTransportTokensToCttTargetIds_ || {}
  , Lk = v.ytLoggingTransportTokensToJspbCttTargetIds_ || {};
let Mk = {};
function Nk() {
    var a = y("yt.logging.ims");
    a || (a = new rk,
    z("yt.logging.ims", a));
    return a
}
function Ok(a, b) {
    if (a.endpoint === "log_event") {
        Pk();
        var c = Qk(a)
          , d = Rk(a.payload) || "";
        a: {
            if (M("enable_web_tiered_gel")) {
                var e = vj[d || ""];
                var f, g;
                if (Mj().resolve(R($i)) == null)
                    var h = void 0;
                else {
                    let k;
                    h = (k = y("yt.gcf.config.hotConfigGroup")) != null ? k : L("RAW_HOT_CONFIG_GROUP");
                    h = h == null ? void 0 : (f = h.loggingHotConfig) == null ? void 0 : (g = f.eventLoggingConfig) == null ? void 0 : g.payloadPolicies
                }
                if (f = h)
                    for (g = 0; g < f.length; g++)
                        if (f[g].payloadNumber === e) {
                            e = f[g];
                            break a
                        }
            }
            e = void 0
        }
        f = 200;
        if (e) {
            if (e.enabled === !1 && !M("web_payload_policy_disabled_killswitch"))
                return;
            f = Sk(e.tier);
            if (f === 400) {
                Tk(a, b);
                return
            }
        }
        Mk[c] = !0;
        c = {
            cttAuthInfo: c,
            isJspb: !1,
            tier: f
        };
        Nk().storePayload(c, a.payload);
        Uk(b, c, Vk(d))
    }
}
function Uk(a, b, c=!1) {
    a && Ak(a);
    a = Gg("tvhtml5_logging_max_batch_ads_fork") || Gg("tvhtml5_logging_max_batch") || Gg("web_logging_max_batch") || 100;
    var d = P()
      , e = Wk(!1, b.tier)
      , f = e.l;
    c && (e.h = !0);
    c = 0;
    b && (c = Nk().getSequenceCount(b));
    c >= 1E3 ? Xk({
        writeThenSend: !0
    }, !1, b.tier) : c >= a ? Gk || (Gk = Yk( () => {
        Xk({
            writeThenSend: !0
        }, !1, b.tier);
        Gk = void 0
    }
    , 0)) : d - f >= 10 && (Zk(!1, b.tier),
    e.l = d)
}
function Tk(a, b) {
    if (a.endpoint === "log_event") {
        M("more_accurate_gel_parser") && Nk().storePayload({
            isJspb: !1
        }, a.payload);
        Pk();
        var c = Qk(a)
          , d = new Map;
        d.set(c, [a.payload]);
        var e = Rk(a.payload) || "";
        (a = b ? b : zk() ? yk || v.ytLoggingTransportRegisteredClientCtor_ || null : null) && Ak(a);
        return new Se( (f, g) => {
            xk && xk.isReady() ? $k(d, xk, f, g, {
                bypassNetworkless: !0
            }, !0, Vk(e)) : f()
        }
        )
    }
}
function Qk(a) {
    var b = "";
    if (a.dangerousLogToVisitorSession)
        b = "visitorOnlyApprovedKey";
    else if (a.cttAuthInfo) {
        b = a.cttAuthInfo;
        let c = {};
        b.videoId ? c.videoId = b.videoId : b.playlistId && (c.playlistId = b.playlistId);
        Kk[a.cttAuthInfo.token] = c;
        b = a.cttAuthInfo.token
    }
    return b
}
function Xk(a={}, b=!1, c) {
    new Se( (d, e) => {
        var f = Wk(b, c)
          , g = f.h;
        f.h = !1;
        if (M("enable_web_tiered_gel") && M("web_vss_routing_check_all_tier_policies")) {
            let h = Wk(b, 300)
              , k = Wk(b, 200);
            g = g || h.h || k.h;
            h.h = !1;
            k.h = !1
        }
        al(f.j);
        al(f.i);
        f.i = 0;
        xk && xk.isReady() ? c === void 0 && M("enable_web_tiered_gel") ? bl(d, e, a, b, 300, g) : bl(d, e, a, b, c, g) : (Zk(b, c),
        d())
    }
    )
}
function bl(a, b, c={}, d=!1, e=200, f=!1) {
    var g = xk
      , h = new Map
      , k = new Map
      , l = {
        isJspb: d,
        cttAuthInfo: void 0,
        tier: e
    }
      , m = {
        isJspb: d,
        cttAuthInfo: void 0
    };
    if (d) {
        for (let p of Object.keys(Mk))
            b = M("enable_web_tiered_gel") ? Nk().smartExtractMatchingEntries({
                keys: [l, m],
                sizeLimit: 1E3
            }) : Nk().extractMatchingEntries({
                isJspb: !0,
                cttAuthInfo: p
            }),
            b.length > 0 && h.set(p, b),
            (M("web_fp_via_jspb_and_json") && c.writeThenSend || !M("web_fp_via_jspb_and_json")) && delete Mk[p];
        cl(h, g, a, c, f)
    } else {
        for (let p of Object.keys(Mk))
            h = M("enable_web_tiered_gel") ? Nk().smartExtractMatchingEntries({
                keys: [{
                    isJspb: !1,
                    cttAuthInfo: p,
                    tier: e
                }, {
                    isJspb: !1,
                    cttAuthInfo: p
                }],
                sizeLimit: 1E3
            }) : Nk().extractMatchingEntries({
                isJspb: !1,
                cttAuthInfo: p
            }),
            h.length > 0 && k.set(p, h),
            (M("web_fp_via_jspb_and_json") && c.writeThenSend || !M("web_fp_via_jspb_and_json")) && delete Mk[p];
        $k(k, g, a, b, c, !1, f)
    }
}
function Zk(a=!1, b=200) {
    var c = () => {
        Xk({
            writeThenSend: !0
        }, a, b)
    }
      , d = Wk(a, b)
      , e = d === Fk || d === Ek ? 5E3 : vk;
    M("web_gel_timeout_cap") && !d.i && (e = Yk( () => {
        c()
    }
    , e),
    d.i = e);
    al(d.j);
    e = L("LOGGING_BATCH_TIMEOUT", Gg("web_gel_debounce_ms", 1E4));
    M("shorten_initial_gel_batch_timeout") && Hk && (e = uk);
    e = Yk( () => {
        Gg("gel_min_batch_size") > 0 ? Nk().getSequenceCount({
            cttAuthInfo: void 0,
            isJspb: a,
            tier: b
        }) >= wk && c() : c()
    }
    , e);
    d.j = e
}
function $k(a, b, c, d, e={}, f, g) {
    if (a.size === 0)
        c();
    else {
        var h = Math.round(P())
          , k = a.size
          , l = dl(g);
        for (let[m,p] of a) {
            a = m;
            g = p;
            let q = se({
                context: cj(b.config_ || bj())
            });
            if (!la(g) && !M("throw_err_when_logevent_malformed_killswitch")) {
                d();
                break
            }
            q.events = g;
            (g = Kk[a]) && el(q, a, g);
            delete Kk[a];
            let n = a === "visitorOnlyApprovedKey";
            fl(q, h, n);
            gl(e);
            let r = A => {
                M("start_client_gcf") && yh.h( () => u(function*() {
                    yield hl(A)
                }));
                k--;
                k || c()
            }
              , w = 0
              , x = () => {
                w++;
                if (e.bypassNetworkless && w === 1)
                    try {
                        Aj(b, l, q, il({
                            writeThenSend: !0
                        }, n, r, x, f)),
                        Hk = !1
                    } catch (A) {
                        Cg(A),
                        d()
                    }
                k--;
                k || c()
            }
            ;
            try {
                Aj(b, l, q, il(e, n, r, x, f)),
                Hk = !1
            } catch (A) {
                Cg(A),
                d()
            }
        }
    }
}
function cl(a, b, c, d={}, e) {
    if (a.size === 0)
        c();
    else {
        var f = Math.round(P())
          , g = {
            value: a.size
        }
          , h = new Map([...a]);
        for (let[w] of h) {
            var k = w
              , l = a.get(k);
            h = new dg;
            var m = b.config_ || bj()
              , p = new Yf
              , q = new Qf;
            H(q, 1, m.ya);
            H(q, 2, m.xa);
            Gd(q, 16, m.Xa);
            H(q, 17, m.innertubeContextClientVersion);
            if (m.ha) {
                var n = m.ha
                  , r = new Of;
                n.coldConfigData && H(r, 1, n.coldConfigData);
                n.appInstallData && H(r, 6, n.appInstallData);
                n.coldHashData && H(r, 3, n.coldHashData);
                n.hotHashData && H(r, 5, n.hotHashData);
                G(q, Of, 62, r)
            }
            if ((n = v.devicePixelRatio) && n != 1) {
                if (n != null && typeof n !== "number")
                    throw Error(`Value of float/double field must be a number, found ${typeof n}: ${n}`);
                od(q, 65, n)
            }
            n = Hg();
            n !== "" && H(q, 54, n);
            n = Ig();
            if (n.length > 0) {
                r = new Uf;
                for (let x = 0; x < n.length; x++) {
                    let A = new Sf;
                    H(A, 1, n[x].key);
                    td(A, 2, Rf, Kc(n[x].value));
                    Bd(r, 15, Sf, A)
                }
                G(p, Uf, 5, r)
            }
            dj(p);
            ej(m, q);
            M("start_client_gcf") && fj(q);
            L("DELEGATED_SESSION_ID") && !M("pageid_as_header_web") && (m = new Xf,
            H(m, 3, L("DELEGATED_SESSION_ID")));
            !M("fill_delegate_context_in_gel_killswitch") && (n = L("INNERTUBE_CONTEXT_SERIALIZED_DELEGATION_CONTEXT")) && (r = yd(p, Xf, 3) || new Xf,
            m = p,
            n = H(r, 18, n),
            G(m, Xf, 3, n));
            m = q;
            n = L("DEVICE", "");
            for (let[x,A] of Object.entries(Og(n)))
                n = x,
                r = A,
                n === "cbrand" ? H(m, 12, r) : n === "cmodel" ? H(m, 13, r) : n === "cbr" ? H(m, 87, r) : n === "cbrver" ? H(m, 88, r) : n === "cos" ? H(m, 18, r) : n === "cosver" ? H(m, 19, r) : n === "cplatform" && Gd(m, 42, qh(r));
            p.j(q);
            G(h, Yf, 1, p);
            if (q = Lk[k])
                a: {
                    if (Dd(q, 1))
                        p = 1;
                    else if (q.getPlaylistId())
                        p = 2;
                    else
                        break a;
                    G(h, cg, 4, q);
                    q = yd(h, Yf, 1) || new Yf;
                    m = yd(q, Xf, 3) || new Xf;
                    n = new Wf;
                    n.setToken(k);
                    Gd(n, 1, p);
                    Bd(m, 12, Wf, n);
                    G(q, Xf, 3, m)
                }
            delete Lk[k];
            k = k === "visitorOnlyApprovedKey";
            jl() || od(h, 2, f == null ? f : Fc(f));
            !k && (p = L("EVENT_ID")) && (q = kl(),
            m = new bg,
            H(m, 1, p),
            od(m, 2, q == null ? q : Fc(q)),
            G(h, bg, 5, m));
            gl(d);
            if (M("jspb_serialize_with_worker")) {
                if (!nk)
                    a: {
                        p = L("WORKER_SERIALIZATION_URL");
                        if (!p) {
                            nk = null;
                            break a
                        }
                        (p = p.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue) ? (ua === void 0 && (ua = va()),
                        p = (q = ua) ? q.createScriptURL(p) : p,
                        p = new wa(p)) : p = null;
                        nk = p
                    }
                q = nk || void 0;
                if (!mk && q !== void 0) {
                    p = Worker;
                    if (q instanceof wa)
                        q = q.h;
                    else
                        throw Error("");
                    mk = new p(q,void 0)
                }
                if ((p = mk) && d.writeThenSend) {
                    Jk.set(Ik, {
                        client: b,
                        resolve: c,
                        networklessOptions: d,
                        isIsolated: !1,
                        useVSSEndpoint: e,
                        dangerousLogToVisitorSession: k,
                        requestsOutstanding: g
                    });
                    a = p;
                    b = a.postMessage;
                    c = Yc(h);
                    b.call(a, {
                        op: "gelBatchToSerialize",
                        batchRequest: c,
                        clientEvents: l,
                        key: Ik
                    });
                    Ik++;
                    break
                }
            }
            if (l) {
                p = [];
                for (q = 0; q < l.length; q++)
                    try {
                        p.push(new ag(l[q]))
                    } catch (x) {
                        Cg(new J("Transport failed to deserialize " + String(l[q])))
                    }
                l = p
            } else
                l = [];
            for (let x of l)
                Bd(h, 3, ag, x);
            l = {
                startTime: P(),
                ticks: {},
                infos: {}
            };
            h = JSON.stringify(Yc(h));
            l.ticks.geljspc = P();
            M("log_jspb_serialize_latency") && Math.random() < .001 && oj("meta_logging_csi_event", {
                timerName: "gel_jspb_serialize",
                timelineData: l
            });
            ll(h, b, c, d, e, k, g)
        }
    }
}
function ll(a, b, c, d={}, e, f, g={
    value: 0
}) {
    e = dl(e);
    d = il(d, f, h => {
        M("start_client_gcf") && yh.h( () => u(function*() {
            yield hl(h)
        }));
        g.value--;
        g.value || c()
    }
    , () => {
        g.value--;
        g.value || c()
    }
    , !1);
    d.headers["Content-Type"] = "application/json+protobuf";
    d.postBodyFormat = "JSPB";
    d.postBody = a;
    Aj(b, e, "", d);
    Hk = !1
}
function gl(a) {
    M("always_send_and_write") && (a.writeThenSend = !1)
}
function il(a, b, c, d, e) {
    a = {
        retry: !0,
        onSuccess: c,
        onError: d,
        networklessOptions: a,
        dangerousLogToVisitorSession: b,
        Lb: !!e,
        headers: {},
        postBodyFormat: "",
        postBody: "",
        compress: M("compress_gel") || M("compress_gel_lr")
    };
    jl() && (a.headers["X-Goog-Request-Time"] = JSON.stringify(Math.round(P())));
    return a
}
function fl(a, b, c) {
    jl() || (a.requestTimeMs = String(b));
    M("unsplit_gel_payloads_in_logs") && (a.unsplitGelPayloadsInLogs = !0);
    !c && (b = L("EVENT_ID")) && (c = kl(),
    a.serializedClientEventId = {
        serializedEventId: b,
        clientCounter: String(c)
    })
}
function kl() {
    var a = L("BATCH_CLIENT_COUNTER") || 0;
    a || (a = Math.floor(Math.random() * 65535 / 2));
    a++;
    a > 65535 && (a = 1);
    K("BATCH_CLIENT_COUNTER", a);
    return a
}
function el(a, b, c) {
    if (c.videoId)
        var d = "VIDEO";
    else if (c.playlistId)
        d = "PLAYLIST";
    else
        return;
    a.credentialTransferTokenTargetId = c;
    a.context = a.context || {};
    a.context.user = a.context.user || {};
    a.context.user.credentialTransferTokens = [{
        token: b,
        scope: d
    }]
}
function Pk() {
    var a = Fg("il_payload_scraping");
    a = (a !== void 0 ? String(a) : "") === "enable_il_payload_scraping";
    !y("yt.logging.transport.enableScrapingForTest") && a && (lk = [],
    z("yt.logging.transport.enableScrapingForTest", !0),
    z("yt.logging.transport.scrapedPayloadsForTesting", lk),
    z("yt.logging.transport.payloadToScrape", "visualElementShown visualElementHidden visualElementAttached screenCreated visualElementGestured visualElementStateChanged".split(" ")),
    z("yt.logging.transport.getScrapedPayloadFromClientEventsFunction"),
    z("yt.logging.transport.scrapeClientEvent", !0))
}
function jl() {
    return M("use_request_time_ms_header")
}
function Yk(a, b) {
    return M("transport_use_scheduler") === !1 ? Sg(a, b) : M("logging_avoid_blocking_during_navigation") || M("lr_logging_avoid_blocking_during_navigation") ? sh( () => {
        ik().currentState === "none" ? a() : ik().install({
            none: {
                callback: a
            }
        })
    }
    , b) : sh(a, b)
}
function al(a) {
    M("transport_use_scheduler") ? yh.W(a) : window.clearTimeout(a)
}
function hl(a) {
    return u(function*() {
        var b, c = a == null ? void 0 : (b = a.responseContext) == null ? void 0 : b.globalConfigGroup;
        b = sk(c, Mf);
        var d = c == null ? void 0 : c.hotHashData
          , e = sk(c, Lf)
          , f = c == null ? void 0 : c.coldHashData
          , g = Mj().resolve(R($i));
        g && (d && (b ? yield Yi(g, d, b) : yield Yi(g, d)),
        f && (e ? yield Zi(g, f, e) : yield Zi(g, f)));
        b = c == null ? void 0 : c.rawFinchStaticConfigGroup;
        (c = c == null ? void 0 : c.finchStaticHashData) ? (d = Mj().resolve(R(tk))) ? yield d.Zb({
            config: b || {},
            Mb: c || ""
        }) : (b || c) && Eg(new J("FinchConfigManagerService is not present, but Finch config data is present.")) : b && Eg(new J("Finch config data is present, but hash is missing."))
    })
}
function Wk(a, b=200) {
    return a ? b === 300 ? Fk : Dk : b === 300 ? Ek : Ck
}
function Rk(a) {
    a = Object.keys(a);
    for (let b of a)
        if (vj[b])
            return b
}
function Sk(a) {
    switch (a) {
    case "DELAYED_EVENT_TIER_UNSPECIFIED":
        return 0;
    case "DELAYED_EVENT_TIER_DEFAULT":
        return 100;
    case "DELAYED_EVENT_TIER_DISPATCH_TO_EMPTY":
        return 200;
    case "DELAYED_EVENT_TIER_FAST":
        return 300;
    case "DELAYED_EVENT_TIER_IMMEDIATE":
        return 400;
    default:
        return 200
    }
}
function Vk(a) {
    return a === "gelDebuggingEvent" || a === "watchTimeSegment"
}
function dl(a=!1) {
    return a && M("vss_through_gel_video_stats") ? "video_stats" : "log_event"
}
;const ml = v.ytLoggingGelSequenceIdObj_ || {};
function nl(a, b, c, d={}) {
    var e = {}
      , f = Math.round(d.timestamp || P());
    e.eventTimeMs = f < Number.MAX_SAFE_INTEGER ? f : 0;
    e[a] = b;
    a = y("_lact", window);
    a = a == null ? -1 : Math.max(Date.now() - a, 0);
    e.context = {
        lastActivityMs: String(d.timestamp || !isFinite(a) ? -1 : a)
    };
    d.sequenceGroup && !M("web_gel_sequence_info_killswitch") && (a = e.context,
    b = d.sequenceGroup,
    ml[b] = b in ml ? ml[b] + 1 : 0,
    a.sequence = {
        index: ml[b],
        groupKey: b
    },
    d.endOfSequence && delete ml[d.sequenceGroup]);
    M("web_tag_automated_log_events") && (e.context.automatedLogEventSource = d.automatedLogEventSource);
    (d.sendIsolatedPayload ? Tk : Ok)({
        endpoint: "log_event",
        payload: e,
        cttAuthInfo: d.cttAuthInfo,
        dangerousLogToVisitorSession: d.dangerousLogToVisitorSession
    }, c)
}
function ol(a=!1) {
    Xk(void 0, a)
}
;let pl = [];
function V(a, b, c={}) {
    var d = Bj;
    L("ytLoggingEventsDefaultDisabled", !1) && Bj === Bj && (d = null);
    nl(a, b, d, c)
}
;function ql(a, b={}) {
    var c = a.Ba;
    if (c) {
        a = c.Ta;
        let e = c.Ob;
        var d;
        c = [["componentStack", c.Qa], ["wizTagName", c.tagName], ["wizOwnerTrace", (d = c.Wb) == null ? void 0 : d.join(" > ")], ["errorSeverity", a == null ? void 0 : a.toString()], ["wizFeatureFlags", e ? Object.entries(e).join("\n") : void 0]];
        for (let[f,g] of c)
            d = g,
            d !== void 0 && (b[f] = d)
    }
    return b
}
;var rl = new Set
  , sl = 0
  , tl = 0
  , ul = 0
  , vl = [];
const wl = []
  , xl = ["PhantomJS", "Googlebot", "TO STOP THIS SECURITY SCAN go/scan"];
function yl(a) {
    zl(a)
}
function Al(a) {
    zl(a, "WARNING")
}
function zl(a, b="ERROR") {
    var c = {};
    c.name = L("INNERTUBE_CONTEXT_CLIENT_NAME", 1);
    c.version = L("INNERTUBE_CONTEXT_CLIENT_VERSION");
    Bl(a, c, b)
}
function Bl(a, b, c="ERROR") {
    if (a) {
        a.hasOwnProperty("level") && a.level && (c = a.level);
        if (M("wiz_enable_metadata_extraction_killswitch")) {
            var d = b, e;
            if ((e = d) == null || !e.componentStack) {
                var f;
                if (e = (f = a.Ba) == null ? void 0 : f.Qa)
                    d || (d = {}),
                    d.componentStack = e
            }
            b = d || b
        } else
            b = ql(a, b),
            f = (d = a.Ba) == null ? void 0 : d.Ta,
            f !== void 0 && c !== "IGNORED" && (c = f >= 3 ? "ERROR" : "WARNING");
        if (M("console_log_js_exceptions") || ["test", "dev", "autopush", "staging"].includes(L("SERVER_VERSION")))
            f = [],
            f.push(`Name: ${a.name}`),
            f.push(`Message: ${a.message}`),
            a.hasOwnProperty("params") && f.push(`Error Params: ${JSON.stringify(a.params)}`),
            a.hasOwnProperty("args") && f.push(`Error args: ${JSON.stringify(a.args, null, 2)}`),
            f.push(`File name: ${a.fileName}`),
            f.push(`Stacktrace: ${a.stack}`),
            window.console.log(f.join("\n"), a);
        if (!(sl >= 5)) {
            f = [];
            for (g of wl)
                try {
                    g() && f.push(g())
                } catch (r) {}
            var g = f;
            g = [...vl, ...g];
            var h = Fa(a);
            f = h.message || "Unknown Error";
            d = h.name || "UnknownError";
            var k = h.stack || a.jc || "Not available";
            k.startsWith(`${d}: ${f}`) && (e = k.split("\n"),
            e.shift(),
            k = e.join("\n"));
            e = h.lineNumber || "Not available";
            h = h.fileName || "Not available";
            let n = 0;
            if (a.hasOwnProperty("args") && a.args && a.args.length)
                for (var l = 0; l < a.args.length && !(n = jh(a.args[l], `params.${l}`, b, n),
                n >= 500); l++)
                    ;
            else if (a.hasOwnProperty("params") && a.params) {
                let r = a.params;
                if (typeof a.params === "object")
                    for (l in r) {
                        if (!r[l])
                            continue;
                        let w = `params.${l}`
                          , x = lh(r[l]);
                        b[w] = x;
                        n += w.length + x.length;
                        if (n > 500)
                            break
                    }
                else
                    b.params = lh(r)
            }
            if (g.length)
                for (l = 0; l < g.length && !(n = jh(g[l], `params.context.${l}`, b, n),
                n >= 500); l++)
                    ;
            navigator.vendor && !b.hasOwnProperty("vendor") && (b["device.vendor"] = navigator.vendor);
            l = {
                message: f,
                name: d,
                lineNumber: e,
                fileName: h,
                stack: k,
                params: b,
                sampleWeight: 1
            };
            b = Number(a.columnNumber);
            isNaN(b) || (l.lineNumber = `${l.lineNumber}:${b}`);
            if (a.level === "IGNORED")
                var m = 0;
            else
                a: {
                    a = ch();
                    for (m of a.K)
                        if (l.message && l.message.match(m.gb)) {
                            m = m.weight;
                            break a
                        }
                    for (var p of a.J)
                        if (p.callback(l)) {
                            m = p.weight;
                            break a
                        }
                    m = 1
                }
            l.sampleWeight = m;
            m = l;
            for (var q of Zg) {
                if (!q.Y[m.name])
                    continue;
                p = q.Y[m.name];
                for (let r of p) {
                    p = m.message.match(r.F);
                    if (!p)
                        continue;
                    m.params["params.error.original"] = p[0];
                    a = r.groups;
                    l = {};
                    for (b = 0; b < a.length; b++)
                        l[a[b]] = p[b + 1],
                        m.params[`params.error.${a[b]}`] = p[b + 1];
                    m.message = q.ka(l);
                    break
                }
            }
            m.params || (m.params = {});
            q = ch();
            m.params["params.errorServiceSignature"] = `msg=${q.K.length}&cb=${q.J.length}`;
            m.params["params.serviceWorker"] = "true";
            v.document && v.document.querySelectorAll && (m.params["params.fscripts"] = String(document.querySelectorAll("script:not([nonce])").length));
            window.yterr && typeof window.yterr === "function" && window.yterr(m);
            m.sampleWeight === 0 || rl.has(m.message) || Cl(m, c)
        }
    }
}
function Cl(a, b="ERROR") {
    if (b === "ERROR") {
        gh.na("handleError", a);
        if (M("record_app_crashed_web") && ul === 0 && a.sampleWeight === 1) {
            ul++;
            var c = {
                appCrashType: "APP_CRASH_TYPE_BREAKPAD"
            };
            M("report_client_error_with_app_crash_ks") || (c.systemHealth = {
                crashData: {
                    clientError: {
                        logMessage: {
                            message: a.message
                        }
                    }
                }
            });
            V("appCrashed", c)
        }
        tl++
    } else
        b === "WARNING" && gh.na("handleWarning", a);
    c = {};
    b: {
        for (d of xl)
            if (Gh(d.toLowerCase())) {
                var d = !0;
                break b
            }
        d = !1
    }
    if (d)
        c = void 0;
    else {
        var e = {
            stackTrace: a.stack
        };
        a.fileName && (e.filename = a.fileName);
        d = a.lineNumber && a.lineNumber.split ? a.lineNumber.split(":") : [];
        d.length !== 0 && (d.length !== 1 || isNaN(Number(d[0])) ? d.length !== 2 || isNaN(Number(d[0])) || isNaN(Number(d[1])) || (e.lineNumber = Number(d[0]),
        e.columnNumber = Number(d[1])) : e.lineNumber = Number(d[0]));
        d = {
            level: "ERROR_LEVEL_UNKNOWN",
            message: a.message,
            errorClassName: a.name,
            sampleWeight: a.sampleWeight
        };
        b === "ERROR" ? d.level = "ERROR_LEVEL_ERROR" : b === "WARNING" && (d.level = "ERROR_LEVEL_WARNNING");
        e = {
            isObfuscated: !0,
            browserStackInfo: e
        };
        c.pageUrl = window.location.href;
        c.kvPairs = [];
        L("FEXP_EXPERIMENTS") && (c.experimentIds = L("FEXP_EXPERIMENTS"));
        var f = L("LATEST_ECATCHER_SERVICE_TRACKING_PARAMS");
        let l = yg.EXPERIMENT_FLAGS;
        if ((!l || !l.web_disable_gel_stp_ecatcher_killswitch) && f)
            for (var g of Object.keys(f))
                c.kvPairs.push({
                    key: g,
                    value: String(f[g])
                });
        if (g = a.params)
            for (var h of Object.keys(g))
                c.kvPairs.push({
                    key: `client.${h}`,
                    value: String(g[h])
                });
        var k;
        if (h = (k = a.params) == null ? void 0 : k.sessionReplayId)
            c.sessionReplayId = String(h);
        k = L("SERVER_NAME");
        h = L("SERVER_VERSION");
        k && h && (c.kvPairs.push({
            key: "server.name",
            value: k
        }),
        c.kvPairs.push({
            key: "server.version",
            value: h
        }));
        (k = L("PLAYER_CLIENT_VERSION")) && c.kvPairs.push({
            key: "client.player.version",
            value: k
        });
        c = {
            errorMetadata: c,
            stackTrace: e,
            logMessage: d
        }
    }
    if (c && (V("clientError", c),
    b === "ERROR" || M("errors_flush_gel_always_killswitch")))
        a: {
            if (M("web_fp_via_jspb")) {
                b = pl;
                pl = [];
                if (b)
                    for (let l of b)
                        nl(l.S, l.payload, Bj, l.options);
                ol(!0);
                if (!M("web_fp_via_jspb_and_json"))
                    break a
            }
            ol()
        }
    try {
        rl.add(a.message)
    } catch (l) {}
    sl++
}
function Dl(a, ...b) {
    a.args || (a.args = []);
    Array.isArray(a.args) && a.args.push(...b)
}
;function El(a) {
    return u(function*() {
        var b = yield v.fetch(a.i);
        if (b.status !== 200)
            return Promise.reject("Server error when retrieving AmbientData");
        b = yield b.text();
        if (!b.startsWith(")]}'\n"))
            return Promise.reject("Incorrect JSPB formatting");
        a: {
            b = JSON.parse(b.substring(5));
            for (let c = 0; c < b.length; c++)
                if (b[c][0] === ug.messageId) {
                    b = new ug(b[c]);
                    break a
                }
            b = null
        }
        return b ? b : Promise.reject("AmbientData missing from response")
    })
}
function Fl(a=!1) {
    var b = Gl.instance;
    return u(function*() {
        if (a || !b.h)
            b.h = El(b).then(b.j).catch(c => {
                delete b.h;
                zl(c)
            }
            );
        return b.h
    })
}
var Gl = class {
    constructor() {
        this.i = Hl("/sw.js_data")
    }
    j(a) {
        var b = yd(a, tg, 2, $b);
        if (b) {
            var c = Cd(b, 5);
            c && (v.__SAPISID = c);
            Lc(F(b, 10)) != null ? K("EOM_VISITOR_DATA", Cd(b, 10)) : Lc(F(b, 7)) != null && K("VISITOR_DATA", Cd(b, 7));
            if (Ec(F(b, 4)) != null) {
                c = String;
                let e;
                var d = (e = Ec(F(b, 4))) != null ? e : 0;
                K("SESSION_INDEX", c(d))
            }
            Lc(F(b, 8)) != null && K("DELEGATED_SESSION_ID", Cd(b, 8));
            Lc(F(b, 12)) != null && K("USER_SESSION_ID", Cd(b, 12));
            Lc(F(b, 11)) != null && K("INNERTUBE_CONTEXT_SERIALIZED_DELEGATION_CONTEXT", Cd(b, 11))
        }
        return a
    }
}
;
function Il(a, b) {
    b.encryptedTokenJarContents && (a.h[b.encryptedTokenJarContents] = b,
    typeof b.expirationSeconds === "string" && setTimeout( () => {
        delete a.h[b.encryptedTokenJarContents]
    }
    , Number(b.expirationSeconds) * 1E3))
}
var Jl = class {
    constructor() {
        this.h = {}
    }
    handleResponse(a, b) {
        if (!b)
            throw Error("request needs to be passed into ConsistencyService");
        var c, d;
        b = ((c = b.innerTubeRequest.context) == null ? void 0 : (d = c.request) == null ? void 0 : d.consistencyTokenJars) || [];
        var e;
        if (a = (e = a.responseContext) == null ? void 0 : e.consistencyTokenJar) {
            for (let f of b)
                delete this.h[f.encryptedTokenJarContents];
            Il(this, a)
        }
    }
}
;
let Kl = Date.now().toString();
function Ll() {
    if (window.crypto && window.crypto.getRandomValues)
        try {
            var a = Array(16)
              , b = new Uint8Array(16);
            window.crypto.getRandomValues(b);
            for (var c = 0; c < a.length; c++)
                a[c] = b[c];
            return a
        } catch (d) {}
    a = Array(16);
    for (b = 0; b < 16; b++) {
        c = Date.now();
        for (let d = 0; d < c % 23; d++)
            a[b] = Math.random();
        a[b] = Math.floor(Math.random() * 256)
    }
    if (Kl)
        for (b = 1,
        c = 0; c < Kl.length; c++)
            a[b % 16] ^= a[(b - 1) % 16] / 4 ^ Kl.charCodeAt(c),
            b++;
    return a
}
;var Ml;
let Nl = v.ytLoggingDocDocumentNonce_;
if (!Nl) {
    let a = Ll()
      , b = [];
    for (let c = 0; c < a.length; c++)
        b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(a[c] & 63));
    Nl = b.join("")
}
Ml = Nl;
var Ol = {
    xb: 0,
    ub: 1,
    wb: 2,
    Ab: 3,
    yb: 4,
    Gb: 5,
    Bb: 6,
    Fb: 7,
    Db: 8,
    Eb: 9,
    Cb: 10,
    zb: 11,
    0: "DEFAULT",
    1: "CHAT",
    2: "CONVERSATIONS",
    3: "MINIPLAYER",
    4: "DIALOG",
    5: "VOZ",
    6: "MUSIC_WATCH_TABS",
    7: "SHARE",
    8: "PUSH_NOTIFICATIONS",
    9: "RICH_GRID_WATCH",
    10: "PICTURE_IN_PICTURE",
    11: "MEDIA_CLIENT"
};
let Pl = 1;
function Ql(a) {
    return new Rl({
        trackingParams: a
    })
}
function Sl(a, b, c, d, e, f) {
    var g = Pl++;
    return new Rl({
        veType: a,
        veCounter: g,
        elementIndex: c,
        dataElement: b,
        youtubeData: d,
        jspbYoutubeData: e,
        loggingDirectives: f
    })
}
var Rl = class {
    constructor(a) {
        this.h = a
    }
    getAsJson() {
        var a = {};
        this.h.trackingParams !== void 0 ? a.trackingParams = this.h.trackingParams : (a.veType = this.h.veType,
        this.h.veCounter !== void 0 && (a.veCounter = this.h.veCounter),
        this.h.elementIndex !== void 0 && (a.elementIndex = this.h.elementIndex));
        this.h.dataElement !== void 0 && (a.dataElement = this.h.dataElement.getAsJson());
        this.h.youtubeData !== void 0 && (a.youtubeData = this.h.youtubeData);
        this.h.isCounterfactual && (a.isCounterfactual = !0);
        return a
    }
    getAsJspb() {
        var a = new Tf;
        this.h.trackingParams !== void 0 ? a.setTrackingParams(this.h.trackingParams) : (this.h.veType !== void 0 && Fd(a, 2, this.h.veType),
        this.h.veCounter !== void 0 && Fd(a, 6, this.h.veCounter),
        this.h.elementIndex !== void 0 && Fd(a, 3, this.h.elementIndex),
        this.h.isCounterfactual && od(a, 5, !0));
        if (this.h.dataElement !== void 0) {
            var b = this.h.dataElement.getAsJspb();
            G(a, Tf, 7, b)
        }
        this.h.youtubeData !== void 0 && G(a, Nf, 8, this.h.jspbYoutubeData);
        return a
    }
    toString() {
        return JSON.stringify(this.getAsJson())
    }
    isClientVe() {
        return !this.h.trackingParams && !!this.h.veType
    }
    getLoggingDirectives() {
        return this.h.loggingDirectives
    }
}
;
function Tl(a=0) {
    return L("client-screen-nonce-store", {})[a]
}
function Ul(a, b=0) {
    var c = L("client-screen-nonce-store");
    c || (c = {},
    K("client-screen-nonce-store", c));
    c[b] = a
}
function Vl(a=0) {
    return a === 0 ? "ROOT_VE_TYPE" : `ROOT_VE_TYPE.${a}`
}
function Wl(a=0) {
    return L(Vl(a))
}
function Xl(a=0) {
    return (a = Wl(a)) ? new Rl({
        veType: a,
        youtubeData: void 0,
        jspbYoutubeData: void 0
    }) : null
}
function Yl() {
    var a = L("csn-to-ctt-auth-info");
    a || (a = {},
    K("csn-to-ctt-auth-info", a));
    return a
}
function Zl() {
    return Object.values(L("client-screen-nonce-store", {})).filter(a => a !== void 0)
}
function W(a=0) {
    a = Tl(a);
    if (!a && !L("USE_CSN_FALLBACK", !0))
        return null;
    a || (a = "UNDEFINED_CSN");
    return a ? a : null
}
function $l(a) {
    for (let b of Object.values(Ol))
        if (W(b) === a)
            return !0;
    return !1
}
function am(a, b, c) {
    var d = Yl();
    (c = W(c)) && delete d[c];
    b && (d[a] = b)
}
function bm(a) {
    return Yl()[a]
}
function cm(a, b, c=0, d) {
    if (a !== Tl(c) || b !== L(Vl(c)))
        if (am(a, d, c),
        Ul(a, c),
        K(Vl(c), b),
        b = () => {
            setTimeout( () => {
                a && V("foregroundHeartbeatScreenAssociated", {
                    clientDocumentNonce: Ml,
                    clientScreenNonce: a
                })
            }
            , 0)
        }
        ,
        "requestAnimationFrame" in window)
            try {
                window.requestAnimationFrame(b)
            } catch (e) {
                b()
            }
        else
            b()
}
;function dm() {
    var a = L("INNERTUBE_CONTEXT");
    if (!a)
        return zl(Error("Error: No InnerTubeContext shell provided in ytconfig.")),
        {};
    a = se(a);
    M("web_no_tracking_params_in_shell_killswitch") || delete a.clickTracking;
    a.client || (a.client = {});
    var b = a.client;
    b.utcOffsetMinutes = -Math.floor((new Date).getTimezoneOffset());
    var c = Hg();
    c ? b.experimentsToken = c : delete b.experimentsToken;
    Jl.instance || (Jl.instance = new Jl);
    b = Jl.instance.h;
    c = [];
    var d = 0;
    for (var e in b)
        c[d++] = b[e];
    a.request = Object.assign({}, a.request, {
        consistencyTokenJars: c
    });
    a.user = Object.assign({}, a.user);
    if (e = L("INNERTUBE_CONTEXT_SERIALIZED_DELEGATION_CONTEXT"))
        a.user.serializedDelegationContext = e;
    return a
}
;var em = "tokens consistency service_params mss client_location entities adblock_detection response_received_commands store manifest player_preload shorts_prefetch resolve_url_prefetch".split(" ");
var fm = new U("INNERTUBE_TRANSPORT_TOKEN")
  , gm = new U("RESPONSE_PROCESSOR_MAP_TOKEN");
function hm(a) {
    var b = L("INNERTUBE_HOST_OVERRIDE");
    b && (a = String(b) + String(La(a)));
    return a
}
function im(a) {
    var b = {};
    M("json_condensed_response") && (b.prettyPrint = "false");
    return a = Qg(a, b || {}, !1)
}
function jm(a, b="POST") {
    a = {
        method: b,
        mode: Rg(a) ? "same-origin" : "cors",
        credentials: Rg(a) ? "same-origin" : "include"
    };
    b = {};
    var c = {};
    for (let d of Object.keys(b))
        b[d] && (c[d] = b[d]);
    Object.keys(c).length > 0 && (a.headers = c);
    return a
}
;function km(a) {
    var b = {
        "Content-Type": "application/json"
    };
    L("EOM_VISITOR_DATA") ? b["X-Goog-EOM-Visitor-Id"] = L("EOM_VISITOR_DATA") : L("VISITOR_DATA") && (b["X-Goog-Visitor-Id"] = L("VISITOR_DATA"));
    b["X-Youtube-Bootstrap-Logged-In"] = L("LOGGED_IN", !1);
    L("DEBUG_SETTINGS_METADATA") && (b["X-Debug-Settings-Metadata"] = L("DEBUG_SETTINGS_METADATA"));
    a !== "cors" && ((a = L("INNERTUBE_CONTEXT_CLIENT_NAME")) && (b["X-Youtube-Client-Name"] = a),
    (a = L("INNERTUBE_CONTEXT_CLIENT_VERSION")) && (b["X-Youtube-Client-Version"] = a),
    (a = L("CHROME_CONNECTED_HEADER")) && (b["X-Youtube-Chrome-Connected"] = a),
    (a = L("DOMAIN_ADMIN_STATE")) && (b["X-Youtube-Domain-Admin-State"] = a));
    (a = L("SERIALIZED_LAVA_DEVICE_CONTEXT")) && (b["X-YouTube-Lava-Device-Context"] = a);
    return b
}
;var lm = new U("LOCAL_INNERTUBE_ROUTER_TOKEN");
var mm = class {
    constructor() {
        this.h = {}
    }
    get(a) {
        if (Object.prototype.hasOwnProperty.call(this.h, a))
            return this.h[a]
    }
    set(a, b) {
        this.h[a] = b
    }
    remove(a) {
        delete this.h[a]
    }
}
;
new class {
    constructor() {
        this.mappings = new mm
    }
    get(a) {
        a: {
            var b = this.mappings.get(a.toString());
            switch (b.type) {
            case "mapping":
                a = b.value;
                break a;
            case "factory":
                b = b.value();
                this.mappings.set(a.toString(), {
                    type: "mapping",
                    value: b
                });
                a = b;
                break a;
            default:
                a = ya(b, void 0)
            }
        }
        return a
    }
}
;
var nm = class {
    l(a) {
        dm();
        a = new J("Error: Failed to create Request from Command.",a);
        zl(a)
    }
}
  , om = class extends nm {
}
;
const pm = {
    GET_DATASYNC_IDS: function(a) {
        return () => new a
    }(class extends om {
        l() {
            return {
                input: "/getDatasyncIdsEndpoint",
                G: jm("/getDatasyncIdsEndpoint", "GET"),
                innerTubeRequest: {}
            }
        }
    }
    )
};
var qm = new U("ENDPOINT_MAP");
var rm = new U("REQUEST_MACHINE_REGISTRY_TOKEN")
  , sm = new U("REQUEST_MACHINE_FACTORY_TOKEN")
  , tm = new U("INFLIGHT_REQUEST_MAP_TOKEN");
var um = new U("REQUEST_SEQUENCING");
var vm = new U("EPHEMERAL_STORE_TOKEN");
var wm = new U("AUTH_SERVICE_TOKEN");
const xm = "absolute_experiments app conditional_experiments debugcss debugjs expflag forced_experiments pbj pbjreload sbb spf spfreload sr_bns_address sttick".split(" ");
function ym(a, b, c) {
    a = zm(a);
    b = b ? Pa(b) : "";
    c = c || 5;
    (De() || (kb || lb) && Gh("applewebkit") && !Gh("version") && (!Gh("safari") || Gh("gsa/")) || jb && Gh("version/") || !L("EOM_VISITOR_DATA")) && Ce.set("" + a, b, {
        ja: c,
        path: "/",
        domain: "youtube.com",
        secure: !1
    })
}
function zm(a) {
    for (var b of xm) {
        let d;
        var c = b;
        let e = a.search(Sa)
          , f = 0
          , g = [];
        for (; (d = Ra(a, f, c, e)) >= 0; )
            g.push(a.substring(f, d)),
            f = Math.min(a.indexOf("&", d) + 1 || e, e);
        g.push(a.slice(f));
        a = g.join("").replace(Ta, "$1")
    }
    b = 0;
    for (c = 0; c < a.length; ++c)
        b = 31 * b + a.charCodeAt(c) >>> 0;
    return "ST-" + b.toString(36)
}
;class jj extends hj {
    constructor(a) {
        super(arguments);
        this.csn = a
    }
}
const rj = new ij
  , Am = [];
let Cm = Bm
  , Dm = 0;
const Em = new Map
  , Fm = new Map
  , Gm = new Map;
function Hm(a, b, c, d, e, f, g, h, k) {
    var l = Cm();
    f = new Rl({
        veType: b,
        youtubeData: f,
        jspbYoutubeData: void 0
    });
    k = Im({
        automatedLogEventSource: k
    }, l);
    e && (k.cttAuthInfo = e);
    e = {
        csn: l,
        pageVe: f.getAsJson()
    };
    M("expectation_logging") && h && h.screenCreatedLoggingExpectations && (e.screenCreatedLoggingExpectations = h.screenCreatedLoggingExpectations);
    c && c.visualElement ? (e.implicitGesture = {
        parentCsn: c.clientScreenNonce,
        gesturedVe: c.visualElement.getAsJson()
    },
    g && (e.implicitGesture.gestureType = g)) : c && Al(new J("newScreen() parent element does not have a VE - rootVe",b));
    d && (e.cloneCsn = d);
    a ? nl("screenCreated", e, a, k) : V("screenCreated", e, k);
    oj(rj, new jj(l));
    Em.clear();
    Fm.clear();
    Gm.clear();
    return l
}
function Jm(a, b, c, d, e=!1, f={}) {
    Km(a, b, c, [d], e, f)
}
function Km(a, b, c, d, e=!1, f={}) {
    Object.assign(f, Im({
        cttAuthInfo: bm(b) || void 0
    }, b));
    for (let h of d) {
        var g = h.getAsJson();
        (re(g) || !g.trackingParams && !g.veType) && Al(Error("Child VE logged with no data"));
        if (M("no_client_ve_attach_unless_shown")) {
            let k = Lm(h, b);
            if (g.veType && !Fm.has(k) && !Gm.has(k) && !e) {
                if (!M("il_attach_cache_limit") || Em.size < 1E3) {
                    Em.set(k, [a, b, c, h]);
                    return
                }
                M("il_attach_cache_limit") && Em.size > 1E3 && Al(new J("IL Attach cache exceeded limit"))
            }
            g = Lm(c, b);
            Em.has(g) ? Mm(c, b) : Gm.set(g, !0)
        }
    }
    d = d.filter(h => {
        h.csn !== b ? (h.csn = b,
        h = !0) : h = !1;
        return h
    }
    );
    c = {
        csn: b,
        parentVe: c.getAsJson(),
        childVes: Aa(d, h => h.getAsJson())
    };
    b === "UNDEFINED_CSN" ? Nm("visualElementAttached", f, c) : a ? nl("visualElementAttached", c, a, f) : V("visualElementAttached", c, f)
}
function Om(a, b, c, d, e, f, g) {
    Pm(a, b, c, e, g)
}
function Pm(a, b, c, d, e) {
    Qm(c, b);
    e = Im({
        cttAuthInfo: bm(b) || void 0,
        automatedLogEventSource: e
    }, b);
    c = {
        csn: b,
        ve: c.getAsJson(),
        eventType: 1
    };
    d && (c.clientData = d);
    b === "UNDEFINED_CSN" ? Nm("visualElementShown", e, c) : a ? nl("visualElementShown", c, a, e) : V("visualElementShown", c, e)
}
function Rm(a, b, c, d=!1, e, f) {
    var g = d ? 16 : 8;
    d = Im({
        cttAuthInfo: bm(b) || void 0,
        endOfSequence: d,
        automatedLogEventSource: f
    }, b);
    c = {
        csn: b,
        ve: c.getAsJson(),
        eventType: g
    };
    e && (c.clientData = e);
    b === "UNDEFINED_CSN" ? Nm("visualElementHidden", d, c) : a ? nl("visualElementHidden", c, a, d) : V("visualElementHidden", c, d)
}
function Sm(a, b, c, d) {
    var e = void 0;
    Qm(c, b);
    e = e || "INTERACTION_LOGGING_GESTURE_TYPE_GENERIC_CLICK";
    var f = Im({
        cttAuthInfo: bm(b) || void 0,
        automatedLogEventSource: void 0
    }, b);
    c = {
        csn: b,
        ve: c.getAsJson(),
        gestureType: e
    };
    d && (c.clientData = d);
    b === "UNDEFINED_CSN" ? Nm("visualElementGestured", f, c) : a ? nl("visualElementGestured", c, a, f) : V("visualElementGestured", c, f)
}
function Bm() {
    var a = Ll();
    var b = [];
    for (let c = 0; c < a.length; c++)
        b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(a[c] & 63));
    return b.join("")
}
function Nm(a, b, c) {
    Am.push({
        S: a,
        payload: c,
        Tb: void 0,
        options: b
    });
    Dm || (Dm = sj())
}
function tj(a) {
    if (Am) {
        for (let b of Am)
            b.payload && (b.payload.csn = a.csn,
            V(b.S, b.payload, b.options));
        Am.length = 0
    }
    Dm = 0
}
function Lm(a, b) {
    return `${a.getAsJson().veType}${a.getAsJson().veCounter}${b}`
}
function Qm(a, b) {
    if (M("no_client_ve_attach_unless_shown")) {
        var c = Lm(a, b);
        Fm.set(c, !0);
        Mm(a, b)
    }
}
function Mm(a, b) {
    a = Lm(a, b);
    Em.has(a) && (b = Em.get(a) || [],
    Jm(b[0], b[1], b[2], b[3], !0),
    Em.delete(a))
}
function Im(a, b) {
    M("log_sequence_info_on_gel_web") && (a.sequenceGroup = b);
    return a
}
;function Tm() {
    var a = !1;
    try {
        a = !!window.sessionStorage.getItem("session_logininfo")
    } catch (b) {
        a = !0
    }
    return (L("INNERTUBE_CLIENT_NAME") === "WEB" || L("INNERTUBE_CLIENT_NAME") === "WEB_CREATOR") && a
}
function Um() {
    try {
        window.sessionStorage.removeItem("stickiness_reload");
        window.sessionStorage.removeItem("session_logininfo");
        K("LOGIN_INFO", "");
        window.sessionStorage.setItem("from_switch_account", "1");
        var a;
        let c = Vm;
        c || (c = document.querySelector("#persist_identity"));
        if (a = c) {
            var b = a.src ? (new URL(a.src)).origin : "*";
            let d;
            (d = a.contentWindow) == null || d.postMessage({
                action: "clear"
            }, b)
        }
    } catch (c) {}
}
let Vm = null;
var Wm = new U("CONTEXT_PROCESSOR_MAP")
  , Xm = new U("ASYNC_CONTEXT_PROCESSOR_MAP");
Object.assign({
    auto_search: "LATENCY_ACTION_AUTO_SEARCH",
    ad_to_ad: "LATENCY_ACTION_AD_TO_AD",
    ad_to_video: "LATENCY_ACTION_AD_TO_VIDEO",
    app_startup: "LATENCY_ACTION_APP_STARTUP",
    browse: "LATENCY_ACTION_BROWSE",
    cast_splash: "LATENCY_ACTION_CAST_SPLASH",
    call_to_cast: "LATENCY_ACTION_CALL_TO_CAST",
    channel_activity: "LATENCY_ACTION_FAMILY_CENTER_CHANNEL_ACTIVITY",
    channels: "LATENCY_ACTION_CHANNELS",
    chips: "LATENCY_ACTION_CHIPS",
    commerce_transaction: "LATENCY_ACTION_COMMERCE_TRANSACTION",
    direct_playback: "LATENCY_ACTION_DIRECT_PLAYBACK",
    editor: "LATENCY_ACTION_EDITOR",
    embed: "LATENCY_ACTION_EMBED",
    embed_no_video: "LATENCY_ACTION_EMBED_NO_VIDEO",
    entity_key_serialization_perf: "LATENCY_ACTION_ENTITY_KEY_SERIALIZATION_PERF",
    entity_key_deserialization_perf: "LATENCY_ACTION_ENTITY_KEY_DESERIALIZATION_PERF",
    explore: "LATENCY_ACTION_EXPLORE",
    favorites: "LATENCY_ACTION_FAVORITES",
    home: "LATENCY_ACTION_HOME",
    inboarding: "LATENCY_ACTION_INBOARDING",
    landing: "LATENCY_ACTION_LANDING",
    learning: "LATENCY_ACTION_LEARNING",
    learning_journey_browse: "LATENCY_ACTION_LEARNING_JOURNEY_BROWSE",
    learning_journey_watch: "LATENCY_ACTION_LEARNING_JOURNEY_WATCH",
    library: "LATENCY_ACTION_LIBRARY",
    live: "LATENCY_ACTION_LIVE",
    live_pagination: "LATENCY_ACTION_LIVE_PAGINATION",
    management: "LATENCY_ACTION_MANAGEMENT",
    mini_app: "LATENCY_ACTION_MINI_APP_PLAY",
    notification_settings: "LATENCY_ACTION_FAMILY_CENTER_NOTIFICATION_SETTINGS",
    onboarding: "LATENCY_ACTION_ONBOARDING",
    parent_profile_settings: "LATENCY_ACTION_KIDS_PARENT_PROFILE_SETTINGS",
    parent_tools_collection: "LATENCY_ACTION_PARENT_TOOLS_COLLECTION",
    parent_tools_dashboard: "LATENCY_ACTION_PARENT_TOOLS_DASHBOARD",
    player_att: "LATENCY_ACTION_PLAYER_ATTESTATION",
    prebuffer: "LATENCY_ACTION_PREBUFFER",
    prefetch: "LATENCY_ACTION_PREFETCH",
    profile_settings: "LATENCY_ACTION_KIDS_PROFILE_SETTINGS",
    profile_switcher: "LATENCY_ACTION_LOGIN",
    projects: "LATENCY_ACTION_PROJECTS",
    reel_watch: "LATENCY_ACTION_REEL_WATCH",
    results: "LATENCY_ACTION_RESULTS",
    red: "LATENCY_ACTION_PREMIUM_PAGE_GET_BROWSE",
    premium: "LATENCY_ACTION_PREMIUM_PAGE_GET_BROWSE",
    premium_lite_upsell: "LATENCY_ACTION_PREMIUM_LITE_UPSELL",
    privacy_policy: "LATENCY_ACTION_FAMILY_CENTER_PRIVACY_POLICY",
    review: "LATENCY_ACTION_REVIEW",
    search_overview_answer: "LATENCY_ACTION_SEARCH_OVERVIEW_ANSWER",
    search_ui: "LATENCY_ACTION_SEARCH_UI",
    search_suggest: "LATENCY_ACTION_SUGGEST",
    search_zero_state: "LATENCY_ACTION_SEARCH_ZERO_STATE",
    secret_code: "LATENCY_ACTION_KIDS_SECRET_CODE",
    switchplan: "LATENCY_ACTION_UNPLUGGED_SWITCH_PLAN",
    seek: "LATENCY_ACTION_PLAYER_SEEK",
    settings: "LATENCY_ACTION_SETTINGS",
    store: "LATENCY_ACTION_STORE",
    supervisee_insights: "LATENCY_ACTION_FAMILY_CENTER_SUPERVISEE_INSIGHTS",
    supervisee_insight_details: "LATENCY_ACTION_FAMILY_CENTER_SUPERVISEE_INSIGHT_DETAILS",
    supervision_dashboard: "LATENCY_ACTION_FAMILY_CENTER_SUPERVISION_DASHBOARD",
    bedtime_reminder_settings: "LATENCY_ACTION_FAMILY_CENTER_BEDTIME_REMINDER_SETTINGS",
    break_reminder_settings: "LATENCY_ACTION_FAMILY_CENTER_BREAK_REMINDER_SETTINGS",
    supervision_settings_dashboard: "LATENCY_ACTION_FAMILY_CENTER_SUPERVISION_SETTINGS_DASHBOARD",
    time_management: "LATENCY_ACTION_FAMILY_CENTER_TIME_MANAGEMENT",
    update_profile: "LATENCY_ACTION_FAMILY_CENTER_UPDATE_PROFILE",
    viewing_permissions: "LATENCY_ACTION_FAMILY_CENTER_VIEWING_PERMISSIONS",
    shorts_settings: "LATENCY_ACTION_FAMILY_CENTER_SHORTS_SETTINGS",
    privacy_settings: "LATENCY_ACTION_FAMILY_CENTER_PRIVACY_SETTINGS",
    tenx: "LATENCY_ACTION_TENX",
    video_preview: "LATENCY_ACTION_VIDEO_PREVIEW",
    video_to_ad: "LATENCY_ACTION_VIDEO_TO_AD",
    watch: "LATENCY_ACTION_WATCH",
    watch_it_again: "LATENCY_ACTION_KIDS_WATCH_IT_AGAIN",
    "watch,watch7": "LATENCY_ACTION_WATCH",
    "watch,watch7_html5": "LATENCY_ACTION_WATCH",
    "watch,watch7ad": "LATENCY_ACTION_WATCH",
    "watch,watch7ad_html5": "LATENCY_ACTION_WATCH",
    wn_comments: "LATENCY_ACTION_LOAD_COMMENTS",
    ww_rqs: "LATENCY_ACTION_WHO_IS_WATCHING",
    voice_assistant: "LATENCY_ACTION_VOICE_ASSISTANT",
    cast_load_by_entity_to_watch: "LATENCY_ACTION_CAST_LOAD_BY_ENTITY_TO_WATCH",
    networkless_performance: "LATENCY_ACTION_NETWORKLESS_PERFORMANCE",
    gel_compression: "LATENCY_ACTION_GEL_COMPRESSION",
    gel_jspb_serialize: "LATENCY_ACTION_GEL_JSPB_SERIALIZE",
    attestation_challenge_fetch: "LATENCY_ACTION_ATTESTATION_CHALLENGE_FETCH"
}, {
    "analytics.explore": "LATENCY_ACTION_CREATOR_ANALYTICS_EXPLORE",
    "artist.analytics": "LATENCY_ACTION_CREATOR_ARTIST_ANALYTICS",
    "artist.events": "LATENCY_ACTION_CREATOR_ARTIST_CONCERTS",
    "artist.presskit": "LATENCY_ACTION_CREATOR_ARTIST_PROFILE",
    "asset.claimed_videos": "LATENCY_ACTION_CREATOR_CMS_ASSET_CLAIMED_VIDEOS",
    "asset.composition": "LATENCY_ACTION_CREATOR_CMS_ASSET_COMPOSITION",
    "asset.composition_ownership": "LATENCY_ACTION_CREATOR_CMS_ASSET_COMPOSITION_OWNERSHIP",
    "asset.composition_policy": "LATENCY_ACTION_CREATOR_CMS_ASSET_COMPOSITION_POLICY",
    "asset.embeds": "LATENCY_ACTION_CREATOR_CMS_ASSET_EMBEDS",
    "asset.history": "LATENCY_ACTION_CREATOR_CMS_ASSET_HISTORY",
    "asset.issues": "LATENCY_ACTION_CREATOR_CMS_ASSET_ISSUES",
    "asset.licenses": "LATENCY_ACTION_CREATOR_CMS_ASSET_LICENSES",
    "asset.metadata": "LATENCY_ACTION_CREATOR_CMS_ASSET_METADATA",
    "asset.ownership": "LATENCY_ACTION_CREATOR_CMS_ASSET_OWNERSHIP",
    "asset.potential_embeds": "LATENCY_ACTION_CREATOR_CMS_ASSET_POTENTIAL_EMBEDS",
    "asset.policy": "LATENCY_ACTION_CREATOR_CMS_ASSET_POLICY",
    "asset.references": "LATENCY_ACTION_CREATOR_CMS_ASSET_REFERENCES",
    "asset.shares": "LATENCY_ACTION_CREATOR_CMS_ASSET_SHARES",
    "asset.sound_recordings": "LATENCY_ACTION_CREATOR_CMS_ASSET_SOUND_RECORDINGS",
    "asset_group.assets": "LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_ASSETS",
    "asset_group.campaigns": "LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_CAMPAIGNS",
    "asset_group.claimed_videos": "LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_CLAIMED_VIDEOS",
    "asset_group.metadata": "LATENCY_ACTION_CREATOR_CMS_ASSET_GROUP_METADATA",
    "song.analytics": "LATENCY_ACTION_CREATOR_SONG_ANALYTICS",
    creator_channel_dashboard: "LATENCY_ACTION_CREATOR_CHANNEL_DASHBOARD",
    "channel.analytics": "LATENCY_ACTION_CREATOR_CHANNEL_ANALYTICS",
    channel_appeal: "LATENCY_ACTION_CREATOR_CHANNEL_APPEAL",
    "channel.comments": "LATENCY_ACTION_CREATOR_CHANNEL_COMMENTS",
    "channel.content": "LATENCY_ACTION_CREATOR_CONTENT",
    "channel.content.posts": "LATENCY_ACTION_CREATOR_POST_LIST",
    "channel.content.promotions": "LATENCY_ACTION_CREATOR_PROMOTION_LIST",
    "channel.copyright": "LATENCY_ACTION_CREATOR_CHANNEL_COPYRIGHT",
    "channel.editing": "LATENCY_ACTION_CREATOR_CHANNEL_EDITING",
    "channel.monetization": "LATENCY_ACTION_CREATOR_CHANNEL_MONETIZATION",
    "channel.music": "LATENCY_ACTION_CREATOR_CHANNEL_MUSIC",
    "channel.music_storefront": "LATENCY_ACTION_CREATOR_CHANNEL_MUSIC_STOREFRONT",
    "channel.playlists": "LATENCY_ACTION_CREATOR_CHANNEL_PLAYLISTS",
    "channel.translations": "LATENCY_ACTION_CREATOR_CHANNEL_TRANSLATIONS",
    "channel.videos": "LATENCY_ACTION_CREATOR_CHANNEL_VIDEOS",
    "channel.live_streaming": "LATENCY_ACTION_CREATOR_LIVE_STREAMING",
    "dialog.copyright_strikes": "LATENCY_ACTION_CREATOR_DIALOG_COPYRIGHT_STRIKES",
    "dialog.video_copyright": "LATENCY_ACTION_CREATOR_DIALOG_VIDEO_COPYRIGHT",
    "dialog.uploads": "LATENCY_ACTION_CREATOR_DIALOG_UPLOADS",
    owner: "LATENCY_ACTION_CREATOR_CMS_DASHBOARD",
    "owner.allowlist": "LATENCY_ACTION_CREATOR_CMS_ALLOWLIST",
    "owner.analytics": "LATENCY_ACTION_CREATOR_CMS_ANALYTICS",
    "owner.art_tracks": "LATENCY_ACTION_CREATOR_CMS_ART_TRACKS",
    "owner.assets": "LATENCY_ACTION_CREATOR_CMS_ASSETS",
    "owner.asset_groups": "LATENCY_ACTION_CREATOR_CMS_ASSET_GROUPS",
    "owner.bulk": "LATENCY_ACTION_CREATOR_CMS_BULK_HISTORY",
    "owner.campaigns": "LATENCY_ACTION_CREATOR_CMS_CAMPAIGNS",
    "owner.channel_invites": "LATENCY_ACTION_CREATOR_CMS_CHANNEL_INVITES",
    "owner.channels": "LATENCY_ACTION_CREATOR_CMS_CHANNELS",
    "owner.claimed_videos": "LATENCY_ACTION_CREATOR_CMS_CLAIMED_VIDEOS",
    "owner.claims": "LATENCY_ACTION_CREATOR_CMS_MANUAL_CLAIMING",
    "owner.claims.manual": "LATENCY_ACTION_CREATOR_CMS_MANUAL_CLAIMING",
    "owner.delivery": "LATENCY_ACTION_CREATOR_CMS_CONTENT_DELIVERY",
    "owner.delivery_templates": "LATENCY_ACTION_CREATOR_CMS_DELIVERY_TEMPLATES",
    "owner.issues": "LATENCY_ACTION_CREATOR_CMS_ISSUES",
    "owner.licenses": "LATENCY_ACTION_CREATOR_CMS_LICENSES",
    "owner.pitch_music": "LATENCY_ACTION_CREATOR_CMS_PITCH_MUSIC",
    "owner.policies": "LATENCY_ACTION_CREATOR_CMS_POLICIES",
    "owner.releases": "LATENCY_ACTION_CREATOR_CMS_RELEASES",
    "owner.reports": "LATENCY_ACTION_CREATOR_CMS_REPORTS",
    "owner.videos": "LATENCY_ACTION_CREATOR_CMS_VIDEOS",
    "playlist.videos": "LATENCY_ACTION_CREATOR_PLAYLIST_VIDEO_LIST",
    "post.comments": "LATENCY_ACTION_CREATOR_POST_COMMENTS",
    "post.edit": "LATENCY_ACTION_CREATOR_POST_EDIT",
    "promotion.edit": "LATENCY_ACTION_CREATOR_PROMOTION_EDIT",
    suspense_card_load_ask_studio_card: "LATENCY_ACTION_CREATOR_ASK_STUDIO_CARD",
    "video.analytics": "LATENCY_ACTION_CREATOR_VIDEO_ANALYTICS",
    "video.claims": "LATENCY_ACTION_CREATOR_VIDEO_CLAIMS",
    "video.comments": "LATENCY_ACTION_CREATOR_VIDEO_COMMENTS",
    "video.copyright": "LATENCY_ACTION_CREATOR_VIDEO_COPYRIGHT",
    "video.edit": "LATENCY_ACTION_CREATOR_VIDEO_EDIT",
    "video.editor": "LATENCY_ACTION_CREATOR_VIDEO_EDITOR",
    "video.editor_async": "LATENCY_ACTION_CREATOR_VIDEO_EDITOR_ASYNC",
    "video.live_settings": "LATENCY_ACTION_CREATOR_VIDEO_LIVE_SETTINGS",
    "video.live_streaming": "LATENCY_ACTION_CREATOR_VIDEO_LIVE_STREAMING",
    "video.monetization": "LATENCY_ACTION_CREATOR_VIDEO_MONETIZATION",
    "video.policy": "LATENCY_ACTION_CREATOR_VIDEO_POLICY",
    "video.rights_management": "LATENCY_ACTION_CREATOR_VIDEO_RIGHTS_MANAGEMENT",
    "video.translations": "LATENCY_ACTION_CREATOR_VIDEO_TRANSLATIONS"
});
z("ytLoggingLatencyUsageStats_", v.ytLoggingLatencyUsageStats_ || {});
const Ym = window;
class Zm {
    constructor() {
        this.timing = {};
        this.clearResourceTimings = () => {}
        ;
        this.webkitClearResourceTimings = () => {}
        ;
        this.mozClearResourceTimings = () => {}
        ;
        this.msClearResourceTimings = () => {}
        ;
        this.oClearResourceTimings = () => {}
    }
}
var $m = Ym.performance || Ym.mozPerformance || Ym.msPerformance || Ym.webkitPerformance || new Zm;
oa($m.clearResourceTimings || $m.webkitClearResourceTimings || $m.mozClearResourceTimings || $m.msClearResourceTimings || $m.oClearResourceTimings || qe, $m);
var an = new U("NETWORK_MANAGER_TOKEN");
const bn = ["type.googleapis.com/youtube.api.pfiinnertube.YoutubeApiInnertube.BrowseResponse", "type.googleapis.com/youtube.api.pfiinnertube.YoutubeApiInnertube.PanelResponse"];
function cn() {
    var a;
    return (a = Mj().resolve(R(sm))) == null ? void 0 : a()
}
function dn(a, b) {
    return u(function*() {
        var c, d = a == null ? void 0 : (c = a.I) == null ? void 0 : c.sessionIndex, e;
        c = a == null ? void 0 : (e = a.I) == null ? void 0 : e.ea;
        d = Object.assign({}, {
            sessionIndex: d
        }, c);
        d = yield Xe(oh(0, d));
        return Promise.resolve(Object.assign({}, km(b), d))
    })
}
function en(a, b, c, d= () => {}
) {
    return u(function*() {
        var e, f, g = (e = b.config) == null ? void 0 : (f = e.pa) == null ? void 0 : f.ob, h, k;
        if (g && a.j && a.j.has(g) && !((h = b.config) == null ? 0 : (k = h.pa) == null ? 0 : k.disableCache) && (e = yield a.j.get(g)) && !e.isExpired()) {
            var l = e.h();
            e.isProcessed() || (fn(a, l, b),
            yield a.j.h(g));
            return Promise.resolve(l)
        }
        var m;
        if ((m = a.i) == null ? 0 : m.nb(b.input, b.innerTubeRequest))
            return l = yield a.i.eb(b.input, b.innerTubeRequest),
            fn(a, l, b),
            l;
        yield gn(a, b);
        var p;
        if ((g = (p = b.config) == null ? void 0 : p.requestKey) && a.h.has(g))
            var q = a.h.get(g);
        else {
            p = JSON.stringify(b.innerTubeRequest);
            let w;
            m = (w = (q = b.G) == null ? void 0 : q.headers) != null ? w : {};
            b.G = Object.assign({}, b.G, {
                headers: Object.assign({}, m, c)
            });
            let x = Object.assign({}, b.G);
            b.G.method === "POST" && (x = Object.assign({}, x, {
                body: p
            }));
            q = () => a.L.fetch(b.input, x, b.config);
            q = a.o ? a.o.lb(b, q) : q();
            g && a.h.set(g, q)
        }
        q = yield q;
        var n, r;
        if (q && "error" in q && ((n = q) == null ? 0 : (r = n.error) == null ? 0 : r.details)) {
            n = q.error.details;
            for (let w of n)
                (n = w["@type"]) && bn.indexOf(n) > -1 && (delete w["@type"],
                q = w)
        }
        g && a.h.has(g) && a.h.delete(g);
        !q && ((l = a.i) == null ? 0 : l.Oa(b.input, b.innerTubeRequest)) && (q = yield a.i.cb(b.input, b.innerTubeRequest));
        fn(a, q, b);
        d();
        return q || void 0
    })
}
function hn(a, b, c) {
    var d = {
        I: {
            identity: ph
        }
    };
    if (M("maw_network_machine_raw_request") || M("all_web_network_machine_raw_request")) {
        let f = cn();
        if (f)
            return jn(kn(f, {
                innerTubeRequest: b,
                apiPath: c,
                clickTrackingParams: void 0,
                config: d,
                includeCurrentScreenNonce: !0
            })).then(g => g, g => {
                M("web_nm_error_passthrough_ks") || Al(new J("Error: InnerTube request machine failed",c,g == null ? void 0 : g.message))
            }
            )
    }
    var e = () => {}
    ;
    b.context || (b.context = dm());
    return new Se(f => u(function*() {
        var g = hm(c);
        g = Rg(g) ? "same-origin" : "cors";
        if (a.v.za) {
            var h;
            let l = d == null ? void 0 : (h = d.I) == null ? void 0 : h.sessionIndex;
            var k;
            h = d == null ? void 0 : (k = d.I) == null ? void 0 : k.ea;
            k = oh(0, Object.assign({}, {
                sessionIndex: l
            }, h));
            g = Object.assign({}, km(g), k)
        } else
            g = yield dn(d, g);
        k = im(hm(c));
        k = {
            input: k,
            G: jm(k),
            innerTubeRequest: b,
            config: d
        };
        f(en(a, k, g, e))
    }))
}
function gn(a, b) {
    return u(function*() {
        var c;
        if (b == null ? 0 : (c = b.innerTubeRequest) == null ? 0 : c.context) {
            c = b.innerTubeRequest.context;
            if (a.l && a.l.length > 0) {
                let d = [];
                for (let e of a.l) {
                    let f = e.ma(b);
                    f.h && d.push(f.h)
                }
                d.length > 0 && (yield Promise.all(d))
            }
            for (let d of a.D || [])
                yield d.ma(c)
        }
    })
}
function fn(a, b, c) {
    var d;
    if (b && !(b == null ? 0 : (d = b.sequenceMetaData) == null ? 0 : d.skipProcessing) && a.m)
        for (let e of em)
            a.m[e] && a.m[e].handleResponse(b, c)
}
var ln = class {
    constructor(a, b, c, d, e, f, g, h, k) {
        this.L = b;
        this.v = c;
        this.m = d;
        this.j = e;
        this.D = f;
        this.l = g;
        this.i = h;
        this.o = k;
        this.h = new Map;
        a.U || (a.U = {});
        a.U = Object.assign({}, pm, a.U)
    }
}
;
ln[Q] = [qm, an, wm, R(gm), R(vm), R(Wm), R(Xm), R(lm), R(um)];
var mn = class {
}
;
function nn() {
    var a, b;
    return {
        fa: new on( (c, d) => {
            a = c;
            b = d
        }
        ),
        resolve: a,
        reject: b
    }
}
function X(a) {
    return pn(a) ? a : ec(a) ? new on( (b, c) => {
        a.then(b, c)
    }
    ) : new on(b => {
        b(a)
    }
    )
}
function qn(a) {
    return new on( (b, c) => {
        c(a)
    }
    )
}
function rn(a) {
    try {
        return X(a())
    } catch (b) {
        return qn(b)
    }
}
function jn(a) {
    return sn(a)
}
function sn(a) {
    return new Se( (b, c) => {
        tn(a, b, c)
    }
    )
}
function un(a) {
    if (a.h === "fulfilled") {
        var b = a.i;
        a.i = [];
        a.j = [];
        for (var c of b)
            c(a.result)
    } else if (a.h === "rejected") {
        c = a.j;
        a.i = [];
        a.j = [];
        for (b of c)
            b(a.error)
    }
}
function tn(a, b, c) {
    var {fa: d, resolve: e, reject: f} = nn();
    a.i.push(g => {
        if (b)
            try {
                let h = b(g);
                e(h)
            } catch (h) {
                f(h)
            }
        else
            e(g)
    }
    );
    a.j.push(g => {
        if (c)
            try {
                let h = c(g);
                e(h)
            } catch (h) {
                f(h)
            }
        else
            f(g)
    }
    );
    un(a);
    return d
}
function vn(a, b) {
    return tn(a, void 0, b)
}
var on = class {
    constructor(a) {
        this.h = "pending";
        this.i = [];
        this.j = [];
        try {
            a(this.m.bind(this), this.reject.bind(this))
        } catch (b) {
            this.reject(b)
        }
    }
    state() {
        return this.h === "fulfilled" ? {
            state: "fulfilled",
            value: this.result
        } : this.h === "rejected" ? {
            state: "rejected",
            reason: this.error
        } : {
            state: "pending"
        }
    }
    m(a) {
        ec(a) || pn(a) ? tn(X(a), this.m.bind(this), this.reject.bind(this)) : (this.h = "fulfilled",
        this.result = a,
        un(this))
    }
    reject(a) {
        this.h = "rejected";
        this.error = a;
        un(this)
    }
}
  , pn = ac(a => fc(a) ? a instanceof on : !1);
function Y(a, b) {
    return wn(b.call(a))
}
function Z(a) {
    return function*() {
        return yield{
            fa: X(a)
        }
    }()
}
function wn(a) {
    return rn( () => xn(a, a.next()))
}
function xn(a, b) {
    return b.done ? X(b.value) : vn(tn(b.value.fa, c => xn(a, a.next(c))), c => xn(a, a.throw(c)))
}
;function yn(a, b, c) {
    return Y(a, function() {
        return function*() {
            var d, e = b == null ? void 0 : (d = b.I) == null ? void 0 : d.sessionIndex, f;
            d = b == null ? void 0 : (f = b.I) == null ? void 0 : f.ea;
            e = Object.assign({}, {
                sessionIndex: e
            }, d);
            e = Xe(oh(0, e));
            e = yield*Z(X(e));
            return Object.assign({}, km(c), e)
        }()
    })
}
var zn = class extends mn {
    constructor(a) {
        super();
        this.h = a
    }
    execute(a) {
        return Y(this, function() {
            var b = this;
            return function*() {
                var c = a.ytRequest
                  , d = c.input;
                if (d)
                    if (d.startsWith("https://accounts.google.com/AddSession"))
                        Um();
                    else if (d.startsWith("https://accounts.google.com/ServiceLogin"))
                        Um();
                    else {
                        var e;
                        if (e = d.startsWith("https://myaccount.google.com"))
                            e = (d instanceof nf ? d.clone() : new nf(d)).h.endsWith("/youtubeoptions");
                        e && Um()
                    }
                if (L("LOGGED_IN", !0) && Tm()) {
                    var f;
                    e = L("VALID_SESSION_TEMPDATA_DOMAINS", []);
                    (f = Ka(window.location.href)) && e.push(f);
                    f = Ka(d);
                    Array.prototype.indexOf.call(e, f, void 0) >= 0 || !f && d.lastIndexOf("/", 0) == 0 ? (e = La(d),
                    (e = Ma(e)) ? (e = zm(e),
                    e = (e = Ce.get("" + e, void 0) || null) ? Og(e) : {}) : e = null,
                    f = e) : f = null;
                    f == null && (f = {});
                    e = f;
                    var g = void 0;
                    Tm() ? (g || (g = L("LOGIN_INFO")),
                    g ? (e.session_logininfo = g,
                    e = !0) : e = !1) : e = !1;
                    if (e && (e = d,
                    d = f,
                    f = L("VALID_SESSION_TEMPDATA_DOMAINS", []),
                    (g = Ka(window.location.href)) && f.push(g),
                    g = Ka(e),
                    Array.prototype.indexOf.call(f, g, void 0) >= 0 || !g && e.lastIndexOf("/", 0) == 0) && (f = document.createElement("a"),
                    e = xa.test(e) ? e : void 0,
                    e !== void 0 && (f.href = e),
                    e = f.href) && (e = La(e),
                    e = Ma(e)))
                        if (!d.csn && (d.itct || d.ved) && (d = Object.assign({
                            csn: W()
                        }, d)),
                        h) {
                            var h = parseInt(h, 10);
                            isFinite(h) && h > 0 && ym(e, d, h)
                        } else
                            ym(e, d)
                }
                var k;
                h = ((k = c.G) == null ? void 0 : k.mode) === "cors" ? "cors" : void 0;
                var l;
                if (b.h.za) {
                    d = c.config;
                    var m;
                    k = d == null ? void 0 : (m = d.I) == null ? void 0 : m.sessionIndex;
                    m = d == null ? void 0 : (l = d.I) == null ? void 0 : l.ea;
                    l = oh(0, Object.assign({}, {
                        sessionIndex: k
                    }, m));
                    l = Object.assign({}, km(h), l)
                } else
                    l = yield*Z(yn(b, c.config, h));
                var p, q;
                m = (q = (p = c.G) == null ? void 0 : p.headers) != null ? q : {};
                c.G = Object.assign({}, c.G, {
                    headers: Object.assign({}, m, l)
                });
                return {
                    nextState: "DEDUPE",
                    params: a
                }
            }()
        })
    }
}
;
zn[Q] = [wm];
var An = new U("RESPONSE_MACHINE_REGISTRY_TOKEN")
  , Bn = new U("RESPONSE_MACHINE_FACTORY_TOKEN");
var Dn = class extends mn {
    constructor(a, b) {
        super();
        this.h = a;
        this.i = b
    }
    execute(a) {
        var b = this.i
          , c = this.h;
        return Y(this, function() {
            return function*() {
                var d = a.ytRequest, e, f, g = (e = d.config) == null ? void 0 : (f = e.pa) == null ? void 0 : f.ob, h, k;
                return g && b && b.has(g) && !((h = d.config) == null ? 0 : (k = h.pa) == null ? 0 : k.disableCache) && (e = yield*Z(X(b.get(g)))) && !e.isExpired() ? (d = e.h(),
                M("web_process_response_store_responses") && !e.isProcessed() ? (e = c(),
                d = yield*Z(Cn(e, {
                    wireResponse: d,
                    ytRequest: a.ytRequest,
                    chunkCallback: a.chunkCallback,
                    responsePayload: {
                        type: "PAGE_CONTRACT"
                    },
                    extractedResponse: d
                })),
                yield*Z(X(b.h(g))),
                {
                    nextState: "DONE",
                    value: d
                }) : {
                    nextState: "DONE",
                    value: d
                }) : {
                    nextState: "LOCAL_ROUTER",
                    params: a
                }
            }()
        })
    }
}
;
Dn[Q] = [Bn, R(vm)];
var En = class extends mn {
    constructor(a, b) {
        super();
        this.i = a;
        this.h = b
    }
    execute(a) {
        var b = this.i, c = this.h, d = a.ytRequest, e, f = d == null ? void 0 : (e = d.innerTubeRequest) == null ? void 0 : e.context;
        if (!f)
            return X({
                nextState: "AUTH",
                params: a
            });
        var g = [];
        if (c && c.length > 0)
            for (let h of c)
                c = h.ma(d),
                c.h && g.push(c.h);
        for (let h of b || [])
            h.ma(f);
        return g.length > 0 ? Y(this, function() {
            return function*() {
                yield*Z(X(Promise.all(g)));
                return {
                    nextState: "AUTH",
                    params: a
                }
            }()
        }) : X({
            nextState: "AUTH",
            params: a
        })
    }
}
;
En[Q] = [R(Wm), R(Xm)];
var Fn = class extends mn {
    constructor(a) {
        super();
        this.h = a
    }
    execute(a) {
        var b = this.h;
        return Y(this, function() {
            return function*() {
                var c, d = (c = a.ytRequest.config) == null ? void 0 : c.requestKey;
                return d && b.has(d) && (c = b.get(d),
                c = yield*Z(X(c))) ? {
                    nextState: "DONE",
                    value: c
                } : {
                    nextState: "FETCH",
                    params: a
                }
            }()
        })
    }
}
;
Fn[Q] = [tm];
var Gn = class extends mn {
    constructor(a, b) {
        super();
        this.i = a;
        this.h = b
    }
    execute(a) {
        var b = this.h
          , c = this.i;
        return Y(this, function() {
            return function*() {
                var d = a.ytRequest
                  , e = a.chunkCallback
                  , f = {
                    type: "PAGE_CONTRACT"
                };
                if (b == null ? 0 : b.Oa(d.input, d.innerTubeRequest)) {
                    let h = yield*Z(X(b.cb(d.input, d.innerTubeRequest)));
                    if (h) {
                        let k = !1;
                        var g = function(l, m) {
                            return function*() {
                                var p = c();
                                yield*Z(Cn(p, {
                                    wireResponse: m,
                                    ytRequest: d,
                                    chunkCallback: e,
                                    responsePayload: f
                                }));
                                k = !0
                            }()
                        };
                        h.playerResponse && (yield*g(h.playerResponse, {
                            playerResponse: h.playerResponse,
                            isStreaming: !0
                        }));
                        h.watchNextResponse && (yield*g(h.watchNextResponse, {
                            watchNextResponse: h.watchNextResponse,
                            isStreaming: !0
                        }));
                        k || (g = c(),
                        yield*Z(Cn(g, {
                            wireResponse: h,
                            ytRequest: d,
                            chunkCallback: e,
                            responsePayload: f
                        })));
                        if (e)
                            return {
                                nextState: "DONE",
                                value: f
                            };
                        g = f.content || f.player || f.oa;
                        return f.type === "PAGE_CONTRACT" && g ? {
                            nextState: "DONE",
                            value: g
                        } : {
                            nextState: "DONE",
                            value: h
                        }
                    }
                }
                return {
                    nextState: "FAILED",
                    error: Error("FallbackNode failed to produce a valid response")
                }
            }()
        })
    }
}
;
Gn[Q] = [Bn, R(lm)];
var Hn = class extends J {
    constructor(a, b, c) {
        super(b, Object.assign({}, {
            status: c
        }, []));
        this.type = a;
        this.status = c;
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
;
function In(a, b, c) {
    var d;
    a = (d = a.config) == null ? void 0 : d.kb;
    var e, f;
    return b <= ((f = a == null ? void 0 : a.maxRetries) != null ? f : 0) && (c === void 0 || !(a == null ? 0 : (e = a.jb) == null ? 0 : e.includes(c)))
}
var Kn = class extends mn {
    constructor(a, b, c, d) {
        super();
        this.i = a;
        this.h = b;
        this.l = c;
        this.j = d
    }
    execute(a) {
        var b = this.i
          , c = this.h
          , d = this.l
          , e = this.j;
        return Y(this, function() {
            return function*() {
                var f = a.ytRequest, g = a.chunkCallback, h, k = (h = f.config) == null ? void 0 : h.requestKey;
                h = JSON.stringify(f.innerTubeRequest);
                var l = Object.assign({}, f.G, {
                    body: f.G.method === "POST" ? h : void 0
                })
                  , m = {
                    type: "PAGE_CONTRACT"
                }
                  , p = 0
                  , q = x => {
                    Jn(d(), {
                        wireResponse: x,
                        ytRequest: f,
                        chunkCallback: g,
                        responsePayload: m
                    }, p++)
                }
                ;
                h = () => g ? b.fetch(f.input, l, f.config, q) : b.fetch(f.input, l, f.config);
                try {
                    var n = e ? e.lb(f, h) : h()
                } catch (x) {
                    n = Promise.reject(x)
                }
                k && c && c.set(k, n);
                h = (a.attempt || 0) + 1;
                try {
                    var r = yield*Z(X(n))
                } catch (x) {
                    if (In(f, h)) {
                        let A = x instanceof TypeError && x.message === "Failed to fetch" ? 1 : 0;
                        if (A === 1 || A === 2)
                            return {
                                nextState: "RETRY",
                                params: Object.assign({}, a, {
                                    error: new Hn(A,x.message),
                                    attempt: h
                                })
                            }
                    }
                    return {
                        nextState: "FALLBACK",
                        params: Object.assign({}, a)
                    }
                } finally {
                    k && c && c.delete(k)
                }
                if (!r)
                    return In(f, h) && !g ? {
                        nextState: "RETRY",
                        params: Object.assign({}, a, {
                            error: new Hn(1,"Failed to fetch"),
                            attempt: h
                        })
                    } : {
                        nextState: "FALLBACK",
                        params: Object.assign({}, a)
                    };
                if (r && typeof r === "object" && !Array.isArray(r)) {
                    k = r;
                    var w;
                    if ((w = k.errorMetadata) == null ? 0 : w.status)
                        if (w = k.errorMetadata.status,
                        k = w === 503 || w === 504 || w === 429 ? 2 : w >= 400 && w < 500 || w >= 500 ? 3 : 0,
                        (k === 1 || k === 2) && In(f, h, w))
                            return {
                                nextState: "RETRY",
                                params: Object.assign({}, a, {
                                    error: new Hn(k,`HTTP Status ${w}`,w),
                                    attempt: h
                                })
                            }
                }
                !g && r && (w = d(),
                w = yield*Z(Jn(w, {
                    wireResponse: r,
                    ytRequest: f,
                    responsePayload: {
                        type: "PAGE_CONTRACT"
                    }
                })),
                k = w.content || w.player || w.oa,
                w.type === "PAGE_CONTRACT" && k && (r = k));
                w = r;
                if (Array.isArray(r))
                    if (r = r.filter(x => {
                        var A;
                        return !((A = (x.playerResponse || x.watchNextResponse || x).responseContext) == null ? 0 : A.frameworkOnly)
                    }
                    ),
                    r.length === 1)
                        w = r[0];
                    else if (r.length > 1)
                        w = r.find(x => x.watchNextResponse) || r[0];
                    else
                        return {
                            nextState: "FAILED",
                            error: Error("FetchNode produced only framework-only responses")
                        };
                return {
                    nextState: "DONE",
                    value: g && !M("web_nm_fetch_chunk_callback_ks") ? m : w
                }
            }()
        })
    }
}
;
Kn[Q] = [an, tm, Bn, R(um)];
var Ln = class extends mn {
    constructor(a, b) {
        super();
        this.i = a;
        this.h = b
    }
    execute(a) {
        var b = this.h
          , c = this.i
          , d = a.ytRequest;
        return (b == null ? 0 : b.nb(d.input, d.innerTubeRequest)) ? Y(this, function() {
            return function*() {
                var e = yield*Z(X(b.eb(d.input, d.innerTubeRequest)));
                var f = c();
                e.playerResponse && e.watchNextResponse ? (yield*Z(Cn(f, {
                    wireResponse: {
                        playerResponse: e.playerResponse,
                        isStreaming: !0
                    },
                    ytRequest: a.ytRequest,
                    chunkCallback: a.chunkCallback,
                    responsePayload: {
                        type: "PAGE_CONTRACT"
                    },
                    extractedResponse: e.playerResponse
                })),
                f = yield*Z(Cn(f, {
                    wireResponse: {
                        watchNextResponse: e.watchNextResponse,
                        isStreaming: !0
                    },
                    ytRequest: a.ytRequest,
                    chunkCallback: a.chunkCallback,
                    responsePayload: {
                        type: "PAGE_CONTRACT"
                    },
                    extractedResponse: e.watchNextResponse
                }))) : f = yield*Z(Cn(f, {
                    wireResponse: e,
                    ytRequest: a.ytRequest,
                    chunkCallback: a.chunkCallback,
                    responsePayload: {
                        type: "PAGE_CONTRACT"
                    },
                    extractedResponse: e
                }));
                var g = f.content || f.player || f.oa;
                f.type === "PAGE_CONTRACT" && g && (e = g);
                return {
                    nextState: "DONE",
                    value: e
                }
            }()
        }) : X({
            nextState: "CONTEXT",
            params: a
        })
    }
}
;
Ln[Q] = [Bn, R(lm)];
function Mn(a, b, c=!1) {
    var d, e, f = (e = sk(b, Zf)) == null ? void 0 : e.request;
    f && a.h.Ra && (d = a.h.Ra[f]);
    if (!d && !c) {
        let g;
        (e = (g = sk(b, $f)) == null ? void 0 : g.signal) && a.h.U && (d = a.h.U[e])
    }
    if (!d && (a = c ? a.h.kc : a.h.Pa))
        for (let g in b)
            if (a[g]) {
                d = a[g];
                break
            }
    if (!d) {
        if (c)
            throw Error("Error: No streaming request builder found for command");
        throw Error("Error: No request builder found for command.");
    }
    b = d();
    return X(b)
}
var Nn = class extends mn {
    constructor(a) {
        super();
        this.h = a
    }
    execute(a) {
        return Y(this, function() {
            var b = this;
            return function*() {
                try {
                    var c = yield*Z(Mn(b, a.command, !!a.chunkCallback))
                } catch (d) {
                    return {
                        nextState: "FAILED",
                        error: d
                    }
                }
                return (c = c.l(a.command)) ? {
                    nextState: "CACHE",
                    params: {
                        ytRequest: c,
                        chunkCallback: a.chunkCallback
                    }
                } : {
                    nextState: "FAILED",
                    error: Error("Failed to build request for command")
                }
            }()
        })
    }
}
;
Nn[Q] = [qm];
var On = class extends mn {
    execute(a) {
        return Y(this, function() {
            return function*() {
                var {innerTubeRequest: b, apiPath: c, config: d={
                    I: {
                        identity: ph
                    }
                }, chunkCallback: e} = a;
                b.context || (b.context = dm());
                var f = im(hm(c));
                return {
                    nextState: "CACHE",
                    params: {
                        ytRequest: {
                            input: f,
                            G: jm(f),
                            innerTubeRequest: b,
                            config: d
                        },
                        chunkCallback: e
                    }
                }
            }()
        })
    }
}
;
var Pn = class {
    constructor(a) {
        this.h = a
    }
    run(a, b) {
        return Y(this, function() {
            var c = this;
            return function*() {
                for (var d = a, e = b, f = []; ; ) {
                    f.push(String(d));
                    e = yield*Z(c.h[d].execute(e));
                    if (e.nextState === "DONE")
                        return f.push("DONE"),
                        e.value;
                    if (e.nextState === "FAILED")
                        throw f.push(`FAILED(${e.error.message || "error"})`),
                        e.error;
                    d = e.nextState;
                    e = e.params
                }
            }()
        })
    }
}
;
function kn(a, b) {
    return a.run("REQUEST_INIT", b)
}
var Qn = class extends Pn {
}
;
Qn[Q] = [rm];
function Rn(a, b) {
    a instanceof Hn ? a.status !== void 0 && (b == null ? 0 : b.includes(a.status)) ? a = !1 : (a = a.type,
    a = a === 1 || a === 2) : a = !1;
    return a
}
var Sn = class extends mn {
    execute(a) {
        return Y(this, function() {
            return function*() {
                var b = a.ytRequest, c = a.error, d = a.attempt, e = a.chunkCallback, f, g = (f = b.config) == null ? void 0 : f.kb, h;
                if (!g || !Rn(c, g.jb) || d > ((h = g.maxRetries) != null ? h : 0))
                    return {
                        nextState: "FALLBACK",
                        params: {
                            ytRequest: b,
                            chunkCallback: e
                        }
                    };
                var k = (c = g.Jb) ? c.Pb(d) : -1;
                k === -1 && (k = 1E3);
                g.fb !== void 0 && (k = Math.min(k, g.fb));
                yield*Z(X(new Promise(l => {
                    th(l, 4, k)
                }
                )));
                return {
                    nextState: "FETCH",
                    params: {
                        ytRequest: b,
                        chunkCallback: e,
                        attempt: d
                    }
                }
            }()
        })
    }
}
;
var Tn = class extends mn {
    execute(a) {
        return Y(this, function() {
            return function*() {
                var b = a.chunkCallback
                  , c = a.responsePayload
                  , d = a.wireResponse;
                b && (b(c),
                "playerResponse" in d && d.playerResponse && (wh(),
                (b = y("yt.scheduler.instance.setPriorityThreshold")) && b(4)));
                return {
                    nextState: "DONE",
                    value: c
                }
            }()
        })
    }
}
;
const Un = ["type.googleapis.com/youtube.api.pfiinnertube.YoutubeApiInnertube.BrowseResponse", "type.googleapis.com/youtube.api.pfiinnertube.YoutubeApiInnertube.PanelResponse"];
var Vn = class extends mn {
    execute(a) {
        return Y(this, function() {
            return function*() {
                var b = a.onePlatformError;
                if (b && "details" in b && b.details) {
                    b = b.details;
                    for (let c of b)
                        if ((b = c["@type"]) && Un.indexOf(b) > -1)
                            return delete c["@type"],
                            {
                                nextState: "PROCESS_RESPONSE",
                                params: Object.assign({}, a, {
                                    extractedResponse: c
                                })
                            }
                }
                return a.extractedResponse && !M("web_nm_error_passthrough_ks") ? {
                    nextState: "PROCESS_RESPONSE",
                    params: a
                } : {
                    nextState: "FAILED",
                    error: Error("Error response could not be unpacked")
                }
            }()
        })
    }
}
;
var Wn = class extends mn {
    constructor(a) {
        super();
        this.h = a
    }
    execute(a) {
        var b = this.h;
        return Y(this, function() {
            return function*() {
                var c = a.extractedResponse, d = a.ytRequest, e = a.responsePayload, f = a.wireResponse, g;
                if (!(!c || "code" in c || "error" in c || (g = c.sequenceMetaData) != null && g.skipProcessing))
                    for (let h of em)
                        b[h] && b[h].handleResponse(c, d);
                M("web_nm_process_response_is_streaming_ks") || !Array.isArray(f) && f.isStreaming ? f.watchNextResponse || f.reelItemWatchResponse ? f.watchNextResponse ? e.content = f.watchNextResponse : e.content = f.reelItemWatchResponse : f.playerResponse ? e.player = f.playerResponse : f.reelWatchSequenceResponse ? e.oa = f.reelWatchSequenceResponse : e.content = f : e.content = f;
                return {
                    nextState: "CALLBACK_DISPATCHER",
                    params: a
                }
            }()
        })
    }
}
;
Wn[Q] = [gm];
function Cn(a, b) {
    return a.run("PROCESS_RESPONSE", b, "ResponseMachine (Cache)")
}
function Jn(a, b, c) {
    return a.run("INIT", b, c !== void 0 ? `ResponseMachine (Chunk ${c})` : "ResponseMachine")
}
var Xn = class extends Pn {
}
;
Xn[Q] = [An];
var Yn = class extends mn {
    execute(a) {
        return Y(this, function() {
            return function*() {
                var b = a.wireResponse;
                return (b = Array.isArray(b) ? b[0] : b.isStreaming ? b.playerResponse || b.watchNextResponse || b.reelItemWatchResponse || b.reelWatchSequenceResponse || b : b) && "error" in b ? {
                    nextState: "ERROR_UNPACKER",
                    params: Object.assign({}, a, {
                        extractedResponse: b,
                        onePlatformError: b.error
                    })
                } : {
                    nextState: "PROCESS_RESPONSE",
                    params: Object.assign({}, a, {
                        extractedResponse: b
                    })
                }
            }()
        })
    }
}
;
function Zn() {
    var a = Mj();
    S(a, {
        u: tm,
        P: () => new Map
    });
    S(a, {
        u: zn,
        C: zn,
        B: !0
    });
    S(a, {
        u: Dn,
        C: Dn,
        B: !0
    });
    S(a, {
        u: En,
        C: En,
        B: !0
    });
    S(a, {
        u: Fn,
        C: Fn,
        B: !0
    });
    S(a, {
        u: Gn,
        C: Gn,
        B: !0
    });
    S(a, {
        u: Kn,
        C: Kn,
        B: !0
    });
    S(a, {
        u: Ln,
        C: Ln,
        B: !0
    });
    S(a, {
        u: Nn,
        C: Nn,
        B: !0
    });
    S(a, {
        u: On,
        C: On,
        B: !0
    });
    S(a, {
        u: Sn,
        C: Sn,
        B: !0
    });
    S(a, {
        u: rm,
        P: (b, c, d, e, f, g, h, k, l, m) => ({
            COMMAND_INIT: k,
            REQUEST_INIT: l,
            CACHE: c,
            LOCAL_ROUTER: h,
            CONTEXT: d,
            AUTH: b,
            DEDUPE: e,
            FETCH: g,
            RETRY: m,
            FALLBACK: f
        }),
        [Q]: [zn, Dn, En, Fn, Gn, Kn, Ln, Nn, On, Sn],
        B: !0
    });
    S(a, {
        u: sm,
        P: b => () => new Qn(b),
        [Q]: [rm],
        B: !0
    });
    S(a, {
        u: Tn,
        C: Tn,
        B: !0
    });
    S(a, {
        u: Vn,
        C: Vn,
        B: !0
    });
    S(a, {
        u: Wn,
        C: Wn,
        B: !0
    });
    S(a, {
        u: Yn,
        C: Yn,
        B: !0
    });
    S(a, {
        u: An,
        P: (b, c, d, e) => ({
            INIT: e,
            ERROR_UNPACKER: c,
            PROCESS_RESPONSE: d,
            CALLBACK_DISPATCHER: b
        }),
        [Q]: [Tn, Vn, Wn, Yn],
        B: !0
    });
    S(a, {
        u: Bn,
        P: b => () => new Xn(b),
        [Q]: [An],
        B: !0
    })
}
;let $n;
function ao() {
    if (!$n) {
        let a = Mj();
        S(a, {
            u: qm,
            V: {
                Pa: {}
            }
        });
        S(a, {
            u: an,
            V: {
                fetch: (b, c) => Xe(fetch(new Request(b,c)))
            }
        });
        S(a, {
            u: wm,
            V: mh()
        });
        S(a, {
            u: gm,
            V: {}
        });
        M("web_all_enable_network_machine") && Zn();
        S(a, {
            u: fm,
            C: ln
        });
        $n = a.resolve(fm)
    }
    return $n
}
;function bo(a) {
    return u(function*() {
        yield co();
        Al(a)
    })
}
function eo(a) {
    return u(function*() {
        yield co();
        zl(a)
    })
}
function fo(a) {
    u(function*() {
        var b = yield Hi();
        b ? yield zj(a, b) : (yield Fl(),
        b = {
            timestamp: a.timestamp
        },
        b = a.appShellAssetLoadReport ? {
            S: "appShellAssetLoadReport",
            payload: a.appShellAssetLoadReport,
            options: b
        } : a.clientError ? {
            S: "clientError",
            payload: a.clientError,
            options: b
        } : void 0,
        b && V(b.S, b.payload))
    })
}
function co() {
    return u(function*() {
        try {
            yield Fl()
        } catch (a) {}
    })
}
;var go = Symbol("trackingData")
  , ho = new WeakMap;
function io() {
    jo.instance || (jo.instance = new jo);
    return jo.instance
}
function ko(a) {
    var b = lo(a), c, d;
    if (M("il_use_view_model_logging_context") && (b == null ? 0 : (c = b.context) == null ? 0 : (d = c.loggingContext) == null ? 0 : d.loggingDirectives))
        return b.context.loggingContext.loggingDirectives.trackingParams || "";
    var e, f;
    if (b == null ? 0 : (e = b.rendererContext) == null ? 0 : (f = e.loggingContext) == null ? 0 : f.loggingDirectives)
        return b.rendererContext.loggingContext.loggingDirectives.trackingParams || "";
    if (b == null ? 0 : b.loggingDirectives)
        return b.loggingDirectives.trackingParams || "";
    var g;
    return ((g = a.veContainer) == null ? 0 : g.trackingParams) ? a.veContainer.trackingParams : (b == null ? void 0 : b.trackingParams) || ""
}
function mo(a, b, c) {
    var d = W(c);
    return a.csn === null || d === a.csn || c ? d : (a = new J("VisibilityLogger called before newScreen",{
        caller: b.tagName,
        previous_csn: a.csn,
        current_csn: d
    }),
    Al(a),
    null)
}
function no(a) {
    var b;
    return !((b = lo(a)) == null || !b.loggingDirectives)
}
function oo(a) {
    a = lo(a);
    return Math.floor(Number(a && a.loggingDirectives && a.loggingDirectives.visibility && a.loggingDirectives.visibility.types || "")) || 1
}
function lo(a) {
    var b, c = a.data || ((b = a.props) == null ? void 0 : b.data);
    if (!c || a.isWebComponentWrapper) {
        let d;
        c = (d = ho.get(a)) == null ? void 0 : d[go]
    }
    return c
}
var jo = class {
    constructor() {
        this.l = new Set;
        this.i = new Set;
        this.h = new Map;
        this.client = void 0;
        this.csn = null
    }
    j(a) {
        this.client = a
    }
    m() {
        this.clear();
        this.csn = W()
    }
    clear() {
        this.l.clear();
        this.i.clear();
        this.h.clear();
        this.csn = null
    }
    v(a, b, c, d) {
        var e = ko(a)
          , f = a.visualElement ? a.visualElement : e;
        b = f ? this.l.has(f) : !1;
        var g = f ? this.h.get(f) : !1;
        if (!(f && b && g) && (f && (this.l.add(f),
        this.h.set(f, !0)),
        a.impressionLog && !b && a.impressionLog(),
        e || a.visualElement) && (c = mo(this, a, c))) {
            var h = no(a);
            if (oo(a) || h)
                f = a.visualElement ? a.visualElement : Ql(e),
                a.interactionLoggingClientData || (a.interactionLoggingClientData = {}),
                e = a.interactionLoggingClientData,
                h || b ? oo(a) & 4 ? g || (a = this.client,
                Qm(f, c),
                d = Im({
                    cttAuthInfo: bm(c) || void 0,
                    automatedLogEventSource: void 0
                }, c),
                b = {
                    csn: c,
                    ve: f.getAsJson(),
                    eventType: 4
                },
                e && (b.clientData = e),
                c === "UNDEFINED_CSN" ? Nm("visualElementShown", d, b) : a ? nl("visualElementShown", b, a, d) : V("visualElementShown", b, d)) : oo(a) & 1 && !b && Pm(this.client, c, f, e, d) : Pm(this.client, c, f, e, d)
        }
    }
    o(a, b, c, d) {
        var e = ko(a)
          , f = a.visualElement ? a.visualElement : e;
        b = this.i.has(f);
        var g = this.h.get(f);
        this.i.add(f);
        this.h.set(f, !1);
        if (g === !1)
            return !0;
        if (!e && !a.visualElement)
            return !1;
        c = mo(this, a, c);
        if (!c || !oo(a) && no(a))
            return !1;
        e = a.visualElement ? a.visualElement : Ql(e);
        oo(a) & 8 ? Rm(this.client, c, e, void 0, void 0, d) : oo(a) & 2 && !b && (a = this.client,
        d = Im({
            cttAuthInfo: bm(c) || void 0,
            automatedLogEventSource: d
        }, c),
        b = {
            csn: c,
            ve: e.getAsJson(),
            eventType: 2
        },
        c === "UNDEFINED_CSN" ? Nm("visualElementHidden", d, b) : a ? nl("visualElementHidden", b, a, d) : V("visualElementHidden", b, d));
        return !0
    }
}
;
function po() {
    qo.instance || (qo.instance = new qo)
}
function ro(a) {
    po();
    Bg(io().v).bind(io())(a, void 0, 8, void 0)
}
function so(a) {
    po();
    Bg(io().o).bind(io())(a, void 0, 8, void 0)
}
var qo = class {
    j(a) {
        Bg(io().j).bind(io())(a)
    }
    clear() {
        Bg(io().clear).bind(io())()
    }
}
;
function to() {
    uo.instance || (uo.instance = new uo);
    return uo.instance
}
function vo(a, b) {
    a.v.has(b) || a.v.set(b, []);
    return a.v.get(b)
}
function wo(a, b, c={}) {
    a.h.add(c.layer || 0);
    a.m = () => {
        xo(a, b, c);
        var d = Xl(c.layer);
        if (d) {
            let e = W(c.layer);
            for (let f of a.L) {
                let g = f[0]
                  , h = f[1] || d;
                e ? yo(a, g, h, c.layer, e) : zo(a, g, h, c.layer)
            }
            for (let f of a.ca)
                Ao(a, f[0], f[1])
        }
    }
    ;
    W(c.layer) || a.m();
    if (c.va)
        for (let d of c.va)
            Bo(a, d, c.layer);
    else
        zl(Error("Delayed screen needs a data promise."))
}
function xo(a, b, c={}) {
    var d = void 0;
    c.layer || (c.layer = 0);
    d = c.hb !== void 0 ? c.hb : c.layer;
    var e = W(d);
    d = Xl(d);
    var f;
    d && (c.parentCsn !== void 0 ? f = {
        clientScreenNonce: c.parentCsn,
        visualElement: d
    } : e && e !== "UNDEFINED_CSN" && (f = {
        clientScreenNonce: e,
        visualElement: d
    }));
    var g, h = L("EVENT_ID");
    e === "UNDEFINED_CSN" && h && (g = {
        servletData: {
            serializedServletEventId: h
        }
    });
    M("combine_ve_grafts") && e && Co(a, e);
    M("no_client_ve_attach_unless_shown") && d && e && Mm(d, e);
    try {
        var k = Hm(a.client, b, f, c.ta, c.cttAuthInfo, g, c.Qb, c.loggingExpectations, c.automatedLogEventSource)
    } catch (p) {
        Dl(p, {
            rootVeType: b,
            rootVe: d,
            Yb: void 0,
            Nb: e,
            Xb: f,
            ta: c.ta
        });
        zl(p);
        return
    }
    cm(k, b, c.layer, c.cttAuthInfo);
    e && e !== "UNDEFINED_CSN" && d && !$l(e) && (Rm(a.client, e, d, !0),
    a.i.delete(e));
    b = vo(a, c.layer || 0);
    b.length > 0 && !b[b.length - 1].csn && (b[b.length - 1].csn = k || "");
    po();
    Bg(io().m).bind(io())();
    var l = Xl(c.layer);
    e && e !== "UNDEFINED_CSN" && l && M("music_web_mark_root_visible") && Bg(Om)(void 0, k, l, void 0, void 0, void 0);
    a.h.delete(c.layer || 0);
    a.m = void 0;
    var m;
    (m = a.Ga.get(c.layer)) == null || m.forEach( (p, q) => {
        p ? zo(a, q, p, c.layer) : l && zo(a, q, l, c.layer)
    }
    );
    Do(a)
}
function Eo(a) {
    var b = 28631
      , c = {
        layer: 8
    };
    Bg( () => {
        [28631].includes(b) || (Al(new J("createClientScreen() called with a non-page VE",b)),
        b = 83769);
        if (!c.isHistoryNavigation) {
            let d = c.layer || 0;
            a.Fa.set(d, []);
            vo(a, d).push({
                rootVe: b,
                key: c.key || ""
            })
        }
        a.L = [];
        a.ca = [];
        c.va ? wo(a, b, c) : xo(a, b, c)
    }
    )()
}
function Bo(a, b, c=0) {
    Bg( () => {
        b.then(d => {
            a.h.has(c) && a.m && a.m();
            var e = W(c)
              , f = Xl(c);
            if (e && f) {
                var g = {
                    automatedLogEventSource: 3
                }, h;
                (d == null ? 0 : (h = d.response) == null ? 0 : h.trackingParams) && Jm(a.client, e, f, Ql(d.response.trackingParams), !1, g);
                var k;
                (d == null ? 0 : (k = d.playerResponse) == null ? 0 : k.trackingParams) && Jm(a.client, e, f, Ql(d.playerResponse.trackingParams), !1, g)
            }
        }
        )
    }
    )()
}
function yo(a, b, c, d=0, e) {
    a.i.has(e) || a.i.set(e, new Set);
    var f = c || Xl(d);
    f = `${b.toString()}|${f ? f.toString() : ""}`;
    a.i.get(e).has(f) || (zo(a, b, c, d),
    a.i.get(e).add(f))
}
function zo(a, b, c, d=0) {
    return Bg( () => {
        if (a.h.has(d))
            return a.L.push([b, c]),
            !0;
        var e = W(d)
          , f = c || Xl(d);
        if (e && f) {
            if (M("combine_ve_grafts")) {
                let g = a.l.get(f.toString());
                g ? g.push(b) : (a.D.set(f.toString(), f),
                a.l.set(f.toString(), [b]));
                a.sa || (a.sa = sh( () => {
                    Co(a, e)
                }
                , 1200))
            } else
                Jm(a.client, e, f, b);
            return !0
        }
        return !1
    }
    )()
}
function Fo(a, b) {
    return Bg( () => {
        var c = Ql(b)
          , d = W(8);
        d && !a.h.has(8) ? yo(a, c, void 0, 8, d) : zo(a, c, void 0, 8);
        return c
    }
    )()
}
function Co(a, b) {
    if (b === void 0) {
        let c = Zl();
        for (let d = 0; d < c.length; d++)
            c[d] !== void 0 && Co(a, c[d])
    } else
        a.l.forEach( (c, d) => {
            (d = a.D.get(d)) && Km(a.client, b, d, c)
        }
        ),
        a.l.clear(),
        a.D.clear(),
        a.sa = void 0
}
function Go(a, b, c, d=0) {
    if (!b)
        return !1;
    d = W(d);
    if (!d)
        return !1;
    Sm(a.client, d, Ql(b), c);
    return !0
}
function Ao(a, b, c, d=0) {
    var e = W(d);
    b = b || Xl(d);
    e && b && (a = a.client,
    d = Im({
        cttAuthInfo: bm(e) || void 0
    }, e),
    c = {
        csn: e,
        ve: b.getAsJson(),
        clientData: c
    },
    e === "UNDEFINED_CSN" ? Nm("visualElementStateChanged", d, c) : a ? nl("visualElementStateChanged", c, a, d) : V("visualElementStateChanged", c, d))
}
function Do(a) {
    for (var b = 0; b < a.o.length; b++) {
        var c = a.o[b];
        try {
            c()
        } catch (d) {
            zl(d)
        }
    }
    a.o.length = 0;
    for (b = 0; b < a.ra.length; b++) {
        c = a.ra[b];
        try {
            c()
        } catch (d) {
            zl(d)
        }
    }
}
var uo = class {
    constructor() {
        this.L = [];
        this.ca = [];
        this.v = new Map;
        this.Fa = new Map;
        this.o = [];
        this.ra = [];
        this.l = new Map;
        this.D = new Map;
        this.i = new Map;
        this.h = new Set;
        this.Ga = new Map
    }
    j(a) {
        this.client = a
    }
    clickCommand(a, b, c=0) {
        return Go(this, a.clickTrackingParams, b, c)
    }
    stateChanged(a, b, c=0) {
        this.visualElementStateChanged(Ql(a), b, c)
    }
    visualElementStateChanged(a, b, c=0) {
        c === 0 && this.h.has(c) ? this.ca.push([a, b]) : Ao(this, a, b, c)
    }
}
;
const Ho = {
    granted: "GRANTED",
    denied: "DENIED",
    unknown: "UNKNOWN"
}
  , Io = RegExp("^(?:[a-z]+:)?//", "i");
function Jo(a) {
    var b = a.data;
    a = b.type;
    b = b.data;
    a === "notifications_register" ? (lg("IDToken", b),
    Ko()) : a === "notifications_check_registration" && Lo(b)
}
function Mo() {
    return self.clients.matchAll({
        type: "window",
        includeUncontrolled: !0
    }).then(a => {
        if (a)
            for (let b of a)
                b.postMessage({
                    type: "update_unseen_notifications_count_signal"
                })
    }
    )
}
function No(a) {
    var b = [];
    a.forEach(c => {
        b.push({
            key: c.key,
            value: c.value
        })
    }
    );
    return b
}
function Oo(a) {
    return u(function*() {
        var b = No(a.payload.chrome.extraUrlParams)
          , c = {
            recipientId: a.recipientId,
            endpoint: a.payload.chrome.endpoint,
            extraUrlParams: b
        }
          , d = sg(fg);
        return Po().then(e => hn(e, c, d).then(f => {
            f.json().then(g => g && g.endpointUrl ? Qo(a, g.endpointUrl) : Promise.resolve()).catch(g => {
                eo(g);
                Promise.reject(g)
            }
            )
        }
        ))
    })
}
function Ro(a, b) {
    var c = W(8);
    if (c == null || !b)
        return a;
    a = Io.test(a) ? new URL(a) : new URL(a,self.registration.scope);
    a.searchParams.set("parentCsn", c);
    a.searchParams.set("parentTrackingParams", b);
    return a.toString()
}
function Qo(a, b) {
    a.deviceId && lg("DeviceId", a.deviceId);
    a.timestampSec && lg("TimestampLowerBound", a.timestampSec);
    var c = a.payload.chrome
      , d = to();
    Eo(d);
    var e, f = (e = c.postedEndpoint) == null ? void 0 : e.clickTrackingParams;
    e = c == null ? void 0 : c.loggingDirectives;
    var g = c.title
      , h = {
        body: c.body,
        icon: c.iconUrl,
        data: {
            nav: Ro(b, e == null ? void 0 : e.trackingParams),
            id: c.notificationId,
            attributionTag: c.attributionTag,
            clickEndpoint: c.clickEndpoint,
            postedEndpoint: c.postedEndpoint,
            clickTrackingParams: f,
            isDismissed: !0,
            loggingDirectives: e
        },
        tag: c.notificationTag || c.title + c.body + c.iconUrl,
        requireInteraction: !0
    };
    return self.registration.showNotification(g, h).then( () => {
        var k;
        ((k = h.data) == null ? 0 : k.postedEndpoint) && So(h.data.postedEndpoint);
        var l;
        if ((l = h.data) == null ? 0 : l.loggingDirectives)
            k = h.data.loggingDirectives,
            M("enable_client_ve_spec") && k.clientVeSpec ? (k = Sl(k.clientVeSpec.uiType, void 0, k.clientVeSpec.elementIndex, k.clientVeSpec.clientYoutubeData, void 0, k),
            k = zo(d, k, void 0, 8) ? k : null) : k = k.trackingParams ? Fo(d, k.trackingParams) : null,
            ro({
                screenLayer: 8,
                visualElement: k
            });
        To(a.displayCap)
    }
    ).catch( () => {}
    )
}
function So(a) {
    if (!sk(a, eg))
        return Promise.reject();
    var b = {
        serializedRecordNotificationInteractionsRequest: sk(a, eg).serializedInteractionsRequest
    }
      , c = sg(gg);
    return Po().then(d => hn(d, b, c)).then(d => d)
}
function To(a) {
    a !== -1 && self.registration.getNotifications().then(b => {
        for (let d = 0; d < b.length - a; d++) {
            b[d].data.isDismissed = !1;
            b[d].close();
            let e, f;
            if ((e = b[d].data) == null ? 0 : (f = e.loggingDirectives) == null ? 0 : f.trackingParams) {
                var c = Ql(b[d].data.loggingDirectives.trackingParams);
                let g = {
                    screenLayer: 8,
                    visualElement: c
                }
                  , h = Sl(82046)
                  , k = to();
                zo(k, h, c, 8);
                ro({
                    screenLayer: 8,
                    visualElement: h
                });
                (c = W(8)) && Sm(k.client, c, h);
                so(g)
            }
        }
    }
    )
}
function Lo(a) {
    var b = [Uo(a), og("RegistrationTimestamp").then(Vo), Wo(), Xo(), Yo()];
    Promise.all(b).catch( () => {
        lg("IDToken", a);
        Ko();
        return Promise.resolve()
    }
    )
}
function Vo(a) {
    return Date.now() - (a || 0) <= 9E7 ? Promise.resolve() : Promise.reject()
}
function Uo(a) {
    return og("IDToken").then(b => a === b ? Promise.resolve() : Promise.reject())
}
function Wo() {
    return og("Permission").then(a => Notification.permission === a ? Promise.resolve() : Promise.reject())
}
function Xo() {
    return og("Endpoint").then(a => Zo().then(b => a === b ? Promise.resolve() : Promise.reject()))
}
function Yo() {
    return og("application_server_key").then(a => $o().then(b => a === b ? Promise.resolve() : Promise.reject()))
}
function ap() {
    var a = Notification.permission;
    if (Ho[a])
        return Ho[a]
}
function Ko() {
    lg("RegistrationTimestamp", 0);
    Promise.all([Zo(), bp(), cp(), $o()]).then( ([a,b,c,d]) => {
        b = b ? ig(b) : null;
        c = c ? ig(c) : null;
        d = d ? pb(new Uint8Array(d), 4) : null;
        dp(a, b, c, d)
    }
    ).catch( () => {
        dp()
    }
    )
}
function dp(a=null, b=null, c=null, d=null) {
    ng().then(e => {
        e && (lg("Endpoint", a),
        lg("P256dhKey", b),
        lg("AuthKey", c),
        lg("application_server_key", d),
        lg("Permission", Notification.permission),
        Promise.all([og("DeviceId"), og("NotificationsDisabled")]).then( ([f,g]) => {
            if (f != null)
                var h = f;
            else {
                f = [];
                var k;
                h = h || Jf.length;
                for (k = 0; k < 256; k++)
                    f[k] = Jf[0 | Math.random() * h];
                h = f.join("")
            }
            ep(h, a != null ? a : void 0, b != null ? b : void 0, c != null ? c : void 0, d != null ? d : void 0, g != null ? g : void 0)
        }
        ))
    }
    )
}
function ep(a, b, c, d, e, f) {
    u(function*() {
        var g = {
            notificationRegistration: {
                chromeRegistration: {
                    deviceId: a,
                    pushParams: {
                        applicationServerKey: e,
                        authKey: d,
                        p256dhKey: c,
                        browserEndpoint: b
                    },
                    notificationsDisabledInApp: f,
                    permission: ap()
                }
            }
        }
          , h = sg(hg);
        return Po().then(k => hn(k, g, h).then( () => {
            lg("DeviceId", a);
            lg("RegistrationTimestamp", Date.now());
            lg("TimestampLowerBound", Date.now())
        }
        , l => {
            bo(l)
        }
        ))
    })
}
function Zo() {
    return self.registration.pushManager.getSubscription().then(a => a ? Promise.resolve(a.endpoint) : Promise.resolve(null))
}
function bp() {
    return self.registration.pushManager.getSubscription().then(a => a && a.getKey ? Promise.resolve(a.getKey("p256dh")) : Promise.resolve(null))
}
function cp() {
    return self.registration.pushManager.getSubscription().then(a => a && a.getKey ? Promise.resolve(a.getKey("auth")) : Promise.resolve(null))
}
function $o() {
    return self.registration.pushManager.getSubscription().then(a => a ? Promise.resolve(a.options.applicationServerKey) : Promise.resolve(null))
}
function Po() {
    return u(function*() {
        try {
            return yield Fl(!0),
            ao()
        } catch (a) {
            return yield bo(a),
            Promise.reject(a)
        }
    })
}
;let fp = self.location.origin + "/";
function Hl(a) {
    var b = typeof ServiceWorkerGlobalScope !== "undefined" && self instanceof ServiceWorkerGlobalScope ? jf.registration.scope : fp;
    b.endsWith("/") && (b = b.slice(0, -1));
    return a === "/" ? b : b + a
}
;let gp = void 0;
function hp(a) {
    return u(function*() {
        gp || (gp = yield a.open("yt-appshell-assets"));
        return gp
    })
}
function ip(a, b) {
    return u(function*() {
        var c = yield hp(a)
          , d = b.map(e => jp(c, e));
        return Promise.all(d)
    })
}
function kp(a, b) {
    return u(function*() {
        try {
            var c = yield a.match(b, {
                cacheName: "yt-appshell-assets"
            })
        } catch (d) {}
        return c
    })
}
function lp(a, b) {
    return u(function*() {
        var c = yield hp(a)
          , d = (yield c.keys()).filter(e => !b.includes(e.url)).map(e => c.delete(e));
        return Promise.all(d)
    })
}
function mp(a, b, c) {
    return u(function*() {
        yield(yield hp(a)).put(b, c)
    })
}
function np(a, b) {
    u(function*() {
        yield(yield hp(a)).delete(b)
    })
}
function jp(a, b) {
    return u(function*() {
        return (yield a.match(b)) ? Promise.resolve() : a.add(b)
    })
}
;var op = Qi("yt-serviceworker-metadata", {
    O: {
        auth: {
            N: 1
        },
        ["resource-manifest-assets"]: {
            N: 2
        }
    },
    shared: !0,
    upgrade(a, b) {
        b(1) && ei(a, "resource-manifest-assets");
        b(2) && ei(a, "auth")
    },
    version: 2
});
let pp = null;
function qp(a) {
    return xi(op(), a)
}
function rp() {
    return u(function*() {
        var a = yield Hi();
        if (a)
            return sp.instance || (sp.instance = new sp(a)),
            sp.instance
    })
}
function tp(a, b) {
    return u(function*() {
        yield ai(yield qp(a.token), ["resource-manifest-assets"], "readwrite", c => {
            var d = c.objectStore("resource-manifest-assets")
              , e = Date.now();
            return O(d.h.put(b, e)).then( () => {
                pp = e;
                var f = !0;
                return ji(d, {
                    query: IDBKeyRange.bound(0, Date.now()),
                    direction: "prev"
                }, g => f ? (f = !1,
                si(g)) : d.delete(g.cursor.key).then( () => mi(g)))
            }
            )
        }
        )
    })
}
function up(a, b) {
    return u(function*() {
        var c = !1
          , d = 0;
        yield ai(yield qp(a.token), ["resource-manifest-assets"], "readonly", e => ji(e.objectStore("resource-manifest-assets"), {
            query: IDBKeyRange.bound(0, Date.now()),
            direction: "prev"
        }, f => {
            if (f.cursor.value.includes(b))
                c = !0;
            else
                return d += 1,
                mi(f)
        }
        ));
        return c ? d : -1
    })
}
function vp(a) {
    return u(function*() {
        pp || (yield ai(yield qp(a.token), ["resource-manifest-assets"], "readonly", b => ji(b.objectStore("resource-manifest-assets"), {
            query: IDBKeyRange.bound(0, Date.now()),
            direction: "prev"
        }, c => {
            pp = c.cursor.key
        }
        )));
        return pp
    })
}
var sp = class {
    constructor(a) {
        this.token = a
    }
}
;
function wp() {
    return u(function*() {
        var a = yield Hi();
        if (a)
            return xp.instance || (xp.instance = new xp(a)),
            xp.instance
    })
}
function yp(a, b) {
    return u(function*() {
        yield gi(yield qp(a.token), "auth", b, "shell_identifier_key")
    })
}
function zp(a) {
    return u(function*() {
        return (yield(yield qp(a.token)).get("auth", "shell_identifier_key")) || ""
    })
}
function Ap(a) {
    return u(function*() {
        yield(yield qp(a.token)).clear("auth")
    })
}
var xp = class {
    constructor(a) {
        this.token = a
    }
}
;
function Bp() {
    u(function*() {
        var a = yield wp();
        a && (yield Ap(a))
    })
}
;var Cp = class extends I {
    constructor(a) {
        super(a)
    }
    hasUrl() {
        return Lc(F(this, 1)) != null
    }
}
;
function Dp(a) {
    var b = a.A;
    return zd(a, b, b[C] | 0, Cp, 1, void 0, !1, !0)
}
var Ep = function(a, b) {
    return (c, d) => {
        a: {
            let f = {
                qa: !0
            };
            d && Object.assign(f, d);
            c = Pd(c, void 0, void 0, f);
            try {
                let g = new a
                  , h = g.A;
                le(b)(h, c);
                var e = g;
                break a
            } catch (g) {
                if (g instanceof RangeError)
                    throw new SyntaxError;
                throw g;
            } finally {
                Td(c)
            }
            e = void 0
        }
        return e
    }
}(class extends I {
    constructor(a) {
        super(a)
    }
}
, [0, pe, [0, oe]]);
function Fp(a) {
    return u(function*() {
        var b = a.headers.get("X-Resource-Manifest");
        return b ? Promise.resolve(Gp(b)) : Promise.reject(Error("No resource manifest header"))
    })
}
function Gp(a) {
    return Dp(Ep(decodeURIComponent(a))).reduce( (b, c) => {
        (c = Cd(c, 1)) && b.push(c);
        return b
    }
    , [])
}
;function Hp(a) {
    return u(function*() {
        var b = yield Fl();
        if (b && Lc(F(b, 3, $b)) != null) {
            var c = yield wp();
            c && (c = yield zp(c),
            Lc(F(b, 3, $b, md)) !== c && (np(a.caches, a.M),
            Bp()))
        }
    })
}
function Ip(a) {
    return u(function*() {
        try {
            var b = yield Jp(a.h);
            var c = yield Fp(b);
            yield ip(a.caches, c)
        } catch (d) {
            return Promise.reject(d)
        }
        try {
            yield Kp(),
            yield mp(a.caches, a.M, b)
        } catch (d) {
            return Promise.reject(d)
        }
        if (c)
            try {
                yield Lp(a, c, a.M)
            } catch (d) {}
        return Promise.resolve()
    })
}
function Jp(a) {
    return u(function*() {
        try {
            return yield v.fetch(new Request(a))
        } catch (b) {
            return Promise.reject(b)
        }
    })
}
function Kp() {
    return u(function*() {
        var a = yield Fl(), b;
        a && Lc(F(a, 3, $b)) != null && (b = Cd(a, 3, void 0, $b));
        return b ? (a = yield wp()) ? Promise.resolve(yp(a, b)) : Promise.reject(Error("Could not get AuthMonitor instance")) : Promise.reject(Error("Could not get datasync ID"))
    })
}
function Lp(a, b, c) {
    return u(function*() {
        var d = yield rp();
        if (d)
            try {
                yield tp(d, b)
            } catch (e) {
                yield bo(e)
            }
        b.push(c);
        try {
            yield lp(a.caches, b)
        } catch (e) {
            yield bo(e)
        }
        return Promise.resolve()
    })
}
function Mp(a, b) {
    return u(function*() {
        return kp(a.caches, b)
    })
}
function Np(a) {
    return u(function*() {
        return kp(a.caches, a.M)
    })
}
var Op = class {
    constructor() {
        var a = self.caches;
        var b = Hl("/app_shell");
        M("service_worker_forward_exp_params") && (b += self.location.search);
        var c = Hl("/app_shell_home");
        this.caches = a;
        this.h = b;
        this.M = c
    }
    initialize() {
        var a = this;
        return u(function*() {
            yield Hp(a);
            return Ip(a)
        })
    }
}
;
var Pp = class {
    constructor() {
        var a = this;
        this.i = new ReadableStream({
            start(b) {
                a.close = () => void b.close();
                a.h = c => {
                    var d = c.getReader();
                    return d.read().then(function h({done: f, value: g}) {
                        if (f)
                            return Promise.resolve();
                        b.enqueue(g);
                        return d.read().then(h)
                    })
                }
                ;
                a.j = () => {
                    var c = (new TextEncoder).encode("<script>if (window.fetchInitialData) { window.fetchInitialData(); } else { window.getInitialData = undefined; }\x3c/script>");
                    b.enqueue(c)
                }
            }
        })
    }
}
;
function Qp(a, b) {
    return u(function*() {
        var c = b.request
          , d = yield Mp(a.h, c.url);
        if (d)
            return a.i && fo({
                appShellAssetLoadReport: {
                    assetPath: c.url,
                    cacheHit: !0
                },
                timestamp: P()
            }),
            d;
        Rp(a, c);
        return Sp(b)
    })
}
function Tp(a, b) {
    return u(function*() {
        var c = yield Up(b);
        if (c.response && (c.response.ok || c.response.type === "opaqueredirect" || c.response.status === 429 || c.response.status === 303 || c.response.status >= 300 && c.response.status < 400))
            return c.response;
        var d = yield Np(a.h);
        if (d)
            return Vp(a),
            Wp(d, b);
        Xp(a);
        return c.response ? c.response : Promise.reject(c.error)
    })
}
function Yp(a, b) {
    b = new URL(b);
    if (!a.config.Ha.includes(b.pathname))
        return !1;
    if (!b.search)
        return !0;
    b = new URLSearchParams(b.search);
    for (let c of a.config.Ja) {
        if (c.key === "*")
            return !0;
        a = b.get(c.key);
        if (c.value === void 0 || a === c.value)
            if (b.delete(c.key),
            !b.toString())
                return !0
    }
    return !1
}
function Zp(a, b) {
    return u(function*() {
        var c = yield Np(a.h);
        if (!c)
            return Xp(a),
            Sp(b);
        Vp(a);
        var d;
        a: {
            if (c.headers && (d = c.headers.get("date")) && (d = Date.parse(d),
            !isNaN(d))) {
                d = Math.round(P() - d);
                break a
            }
            d = -1
        }
        if (!(d > -1 && d / 864E5 >= 7))
            return Wp(c, b);
        d = yield Up(b);
        return d.response && d.response.ok ? d.response : Wp(c, b)
    })
}
function Sp(a) {
    return Promise.resolve(a.preloadResponse).then(b => b && !$p(b) ? b : v.fetch(a.request))
}
function Rp(a, b) {
    if (a.i) {
        var c = {
            assetPath: b.url,
            cacheHit: !1
        };
        rp().then(d => {
            if (d) {
                var e = vp(d).then(f => {
                    f && (c.currentAppBundleTimestampSec = String(Math.floor(f / 1E3)))
                }
                );
                d = up(d, b.url).then(f => {
                    c.appBundleVersionDiffCount = f
                }
                );
                Promise.all([e, d]).catch(f => {
                    bo(f)
                }
                ).finally( () => {
                    fo({
                        appShellAssetLoadReport: c,
                        timestamp: P()
                    })
                }
                )
            } else
                fo({
                    appShellAssetLoadReport: c,
                    timestamp: P()
                })
        }
        )
    }
}
function Vp(a) {
    a.i && fo({
        appShellAssetLoadReport: {
            assetPath: a.h.M,
            cacheHit: !0
        },
        timestamp: P()
    })
}
function Xp(a) {
    a.i && fo({
        appShellAssetLoadReport: {
            assetPath: a.h.M,
            cacheHit: !1
        },
        timestamp: P()
    })
}
function Wp(a, b) {
    if (!M("sw_nav_preload_pbj"))
        return a;
    var c = new Pp
      , d = c.h(a.body);
    Promise.resolve(b.preloadResponse).then(e => {
        if (!e || !$p(e))
            throw Error("no pbj preload response available");
        d.then( () => c.h(e.body)).then( () => void c.close())
    }
    ).catch( () => {
        d.then( () => {
            c.j();
            c.close()
        }
        )
    }
    );
    return new Response(c.i,{
        status: a.status,
        statusText: a.statusText,
        headers: a.headers
    })
}
function Up(a) {
    return u(function*() {
        try {
            return {
                response: yield Sp(a)
            }
        } catch (b) {
            return {
                error: b
            }
        }
    })
}
function $p(a) {
    return a.headers.get("x-navigation-preload-response-type") === "pbj"
}
var iq = class {
    constructor() {
        var a = aq;
        var b = {
            Na: bq,
            ib: cq([dq, /\/signin/, /\/logout/]),
            Ha: ["/", "/feed/downloads"],
            Ja: eq([{
                key: "feature",
                value: "ytca"
            }]),
            Ia: fq(M("kevlar_sw_app_wide_fallback") ? gq : hq)
        };
        this.h = a;
        this.config = b;
        a = Gg("app_shell_asset_log_fraction");
        this.i = !0;
        a && (this.i = Math.random() < a)
    }
}
;
const jq = /^\/$/
  , hq = [jq, /^\/feed\/downloads$/]
  , gq = [jq, /^\/feed\/\w*/, /^\/results$/, /^\/playlist$/, /^\/watch$/, /^\/channel\/\w*/];
function fq(a) {
    return new RegExp(a.map(b => b.source).join("|"))
}
const kq = /^https:\/\/([\w-]*\.)*youtube\.com.*/;
fq([kq, /^https:\/\/([\w-]*\.)*gstatic\.com.*/]);
fq([/\.css$/, /\.js$/, /\.webm$/, /\.png$/]);
function cq(a) {
    a = fq(a);
    return new RegExp(`${kq.source}(${a.source})`)
}
const lq = fq([/\.css$/, /\.js$/, /\.ico$/, /\/ytmweb\/_\/js\//, /\/ytmweb\/_\/ss\//, /\/kabuki\/_\/js\//, /\/kabuki\/_\/ss\//, /\/ytmainappweb\/_\/js\//, /\/ytmainappweb\/_\/ss\//, /\/ytmusicweb\/_\/js\//, /\/ytmusicweb\/_\/ss\//, /\/music_integrations\/_\/js\//, /\/music_integrations\/_\/ss\//, /\/ytvweb\/_\/js\//, /\/ytvweb\/_\/ss\//])
  , bq = new RegExp(`${kq.source}(${lq.source})`)
  , dq = /purge_shell=1/;
function eq(a=[]) {
    var b = [];
    for (let c of Ug)
        b.push({
            key: c
        });
    for (let c of a)
        b.push(c);
    return b
}
cq([dq]);
eq();
var nq = class {
    constructor() {
        var a = aq
          , b = mq
          , c = self;
        if (v.URLPattern) {
            var d = [];
            d.push({
                condition: {
                    urlPattern: new URLPattern({
                        pathname: "/embed*"
                    })
                },
                source: "network"
            });
            M("service_worker_static_routing_exclude_innertube") && d.push({
                condition: {
                    urlPattern: new URLPattern({
                        pathname: "/youtubei/v1/*"
                    })
                },
                source: "network"
            })
        } else
            d = [];
        this.h = c;
        this.i = a;
        this.o = b;
        this.L = jg;
        this.j = d
    }
    init() {
        this.h.oninstall = this.v.bind(this);
        this.h.onactivate = this.l.bind(this);
        this.h.onfetch = this.m.bind(this);
        this.h.onmessage = this.D.bind(this)
    }
    v(a) {
        this.h.skipWaiting();
        if (this.j.length > 0 && a.addRoutes)
            try {
                a.addRoutes(this.j)
            } catch (c) {}
        var b = this.i.initialize().catch(c => {
            bo(c);
            return Promise.resolve()
        }
        );
        a.waitUntil(b)
    }
    l(a) {
        var b = [this.h.clients.claim()]
          , c = this.h.registration;
        c.navigationPreload && (b.push(c.navigationPreload.enable()),
        M("sw_nav_preload_pbj") && b.push(c.navigationPreload.setHeaderValue("pbj")));
        a.waitUntil(Promise.all(b))
    }
    m(a) {
        var b = this;
        return u(function*() {
            var c = b.o
              , d = !!b.h.registration.navigationPreload
              , e = a.request;
            if (c.config.ib.test(e.url))
                Gl.instance && (delete Gl.instance.h,
                v.__SAPISID = void 0,
                K("VISITOR_DATA", void 0),
                K("SESSION_INDEX", void 0),
                K("DELEGATED_SESSION_ID", void 0),
                K("USER_SESSION_ID", void 0),
                K("INNERTUBE_CONTEXT_SERIALIZED_DELEGATION_CONTEXT", void 0)),
                d = a.respondWith,
                c = c.h,
                np(c.caches, c.M),
                Bp(),
                c = Sp(a),
                d.call(a, c);
            else if (c.config.Na.test(e.url))
                a.respondWith(Qp(c, a));
            else if (e.mode === "navigate") {
                let f = new URL(e.url);
                c.config.Ia.test(f.pathname) ? a.respondWith(Tp(c, a)) : Yp(c, e.url) ? a.respondWith(Zp(c, a)) : d && a.respondWith(Sp(a))
            }
        })
    }
    D(a) {
        var b = a.data;
        this.L.includes(b.type) ? Jo(a) : b.type === "refresh_shell" && Ip(this.i).catch(c => {
            bo(c)
        }
        )
    }
}
;
function oq() {
    var a = y("ytglobal.storage_");
    a || (a = new pq,
    z("ytglobal.storage_", a));
    return a
}
var pq = class {
    estimate() {
        return u(function*() {
            var a = navigator, b;
            if ((b = a.storage) == null ? 0 : b.estimate)
                return a.storage.estimate();
            var c;
            if ((c = a.webkitTemporaryStorage) == null ? 0 : c.queryUsageAndQuota)
                return qq()
        })
    }
}
;
function qq() {
    var a = navigator;
    return new Promise( (b, c) => {
        var d;
        (d = a.webkitTemporaryStorage) != null && d.queryUsageAndQuota ? a.webkitTemporaryStorage.queryUsageAndQuota( (e, f) => {
            b({
                usage: e,
                quota: f
            })
        }
        , e => {
            c(e)
        }
        ) : c(Error("webkitTemporaryStorage is not supported."))
    }
    )
}
z("ytglobal.storageClass_", pq);
function rq(a, b) {
    oq().estimate().then(c => {
        c = Object.assign({}, b, {
            isSw: self.document === void 0,
            isIframe: self !== self.top,
            deviceStorageUsageMbytes: sq(c == null ? void 0 : c.usage),
            deviceStorageQuotaMbytes: sq(c == null ? void 0 : c.quota)
        });
        a.h("idbQuotaExceeded", c)
    }
    )
}
class tq {
    constructor() {
        var a = uq;
        this.handleError = vq;
        this.h = a;
        this.i = !1;
        self.document === void 0 || self.addEventListener("beforeunload", () => {
            this.i = !0
        }
        );
        this.j = Math.random() <= .2
    }
    X(a, b) {
        switch (a) {
        case "IDB_DATA_CORRUPTED":
            M("idb_data_corrupted_killswitch") || this.h("idbDataCorrupted", b);
            break;
        case "IDB_UNEXPECTEDLY_CLOSED":
            this.h("idbUnexpectedlyClosed", b);
            break;
        case "IS_SUPPORTED_COMPLETED":
            M("idb_is_supported_completed_killswitch") || this.h("idbIsSupportedCompleted", b);
            break;
        case "QUOTA_EXCEEDED":
            rq(this, b);
            break;
        case "TRANSACTION_ENDED":
            this.j && Math.random() <= .1 && this.h("idbTransactionEnded", b);
            break;
        case "TRANSACTION_UNEXPECTEDLY_ABORTED":
            a = Object.assign({}, b, {
                hasWindowUnloaded: this.i
            }),
            this.h("idbTransactionAborted", a)
        }
    }
}
function sq(a) {
    return typeof a === "undefined" ? "-1" : String(Math.ceil(a / 1048576))
}
;fh(ch(), {
    K: [{
        gb: /Failed to fetch/,
        weight: 500
    }],
    J: []
});
({handleError: vq=yl, X: uq=V} = {
    handleError: eo,
    X: function(a, b) {
        return u(function*() {
            yield co();
            V(a, b)
        })
    }
});
var uq, vq;
for (Ah = new tq; zh.length > 0; ) {
    let a = zh.shift();
    switch (a.type) {
    case "ERROR":
        Ah.handleError(a.payload);
        break;
    case "EVENT":
        Ah.X(a.eventType, a.payload)
    }
}
Gl.instance = new Gl;
self.onnotificationclick = function(a) {
    a.notification.close();
    var b = a.notification.data;
    b.isDismissed = !1;
    var c = self.clients.matchAll({
        type: "window",
        includeUncontrolled: !0
    });
    c.then(d => {
        a: {
            var e = b.nav;
            for (let f of d)
                if (f.url === e) {
                    f.focus();
                    break a
                }
            self.clients.openWindow(e)
        }
    }
    );
    a.waitUntil(c);
    a.waitUntil(So(b.clickEndpoint))
}
;
self.onnotificationclose = function(a) {
    var b = a.notification.data, c;
    if (b == null ? 0 : (c = b.loggingDirectives) == null ? 0 : c.trackingParams) {
        a = Ql(b.loggingDirectives.trackingParams);
        c = {
            screenLayer: 8,
            visualElement: a
        };
        if (b.isDismissed) {
            b = Sl(74726);
            let d = to();
            zo(d, b, a, 8);
            ro({
                screenLayer: 8,
                visualElement: b
            });
            (a = W(8)) && Sm(d.client, a, b)
        }
        so(c)
    }
}
;
self.onpush = function(a) {
    a.waitUntil(og("NotificationsDisabled").then(b => {
        if (b)
            return Promise.resolve();
        if (a.data && a.data.text().length)
            try {
                return Oo(a.data.json())
            } catch (c) {
                return Promise.resolve(c.message)
            }
        return Promise.resolve()
    }
    ));
    a.waitUntil(Mo())
}
;
self.onpushsubscriptionchange = function() {
    Ko()
}
;
const aq = new Op
  , mq = new iq;
(new nq).init();
