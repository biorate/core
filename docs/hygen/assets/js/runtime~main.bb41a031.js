(() => {
  'use strict';
  var e = {};
  const t = {};
  function r(n) {
    const o = t[n];
    if (void 0 !== o) return o.exports;
    const c = (t[n] = { exports: {} });
    return e[n].call(c.exports, c, c.exports, r), c.exports;
  }
  (r.m = e),
    (() => {
      const e = [];
      r.O = (t, n, o) => {
        if (!n) {
          for (var c = 0; c < e.length; c++) {
            let [n, o] = e[c],
              f = !0;
            for (var a = 0; a < n.length; a++)
              Object.keys(r.O).every((e) => r.O[e](n[a])) ? n.splice(a--, 1) : (f = !1);
            if (f) {
              e.splice(c--, 1);
              const r = o();
              void 0 !== r && (t = r);
            }
          }
          return t;
        }
        e.push([n, o]);
      };
    })(),
    (r.n = (e) => {
      const t = e && e.__esModule ? () => e.default : () => e;
      return r.d(t, { a: t }), t;
    }),
    (r.cw = (e) => {
      var t;
      return () => {
        if (e) {
          var r = e;
          (e = 0), (t = { exports: {} }), r.call(t.exports, t, t.exports);
        }
        return t.exports;
      };
    }),
    (() => {
      const e = Object.getPrototypeOf;
      let t;
      r.t = function (n, o) {
        if ((1 & o && (n = this(n)), 8 & o)) return n;
        if ('object' == typeof n && n) {
          if (4 & o && n.__esModule) return n;
          if (16 & o && 'function' == typeof n.then) return n;
        }
        const c = Object.create(null);
        r.r(c);
        const a = {};
        t = t || [null, e({}), e([]), e(e)];
        for (
          var f = 2 & o && n;
          ('object' == typeof f || 'function' == typeof f) && !~t.indexOf(f);
          f = e(f)
        )
          Object.getOwnPropertyNames(f).forEach((e) => (a[e] = () => n[e]));
        return (a.default = () => n), r.d(c, a), c;
      };
    })(),
    (r.d = (e, t) => {
      if (Array.isArray(t))
        for (var n = 0; n < t.length; ) {
          var o = t[n++],
            c = t[n++],
            a = 0 === c ? { enumerable: !0, value: t[n++] } : { enumerable: !0, get: c };
          r.o(e, o) || Object.defineProperty(e, o, a);
        }
      else
        for (var o in t)
          r.o(t, o) &&
            !r.o(e, o) &&
            Object.defineProperty(e, o, { enumerable: !0, get: t[o] });
    }),
    (r.f = {}),
    (r.e = (e) => Promise.all(Object.keys(r.f).reduce((t, n) => (r.f[n](e, t), t), []))),
    (r.u = (e) =>
      'assets/js/' +
      ({
        9: '12e141dd',
        48: 'a94703ab',
        98: 'a7bd4aaa',
        99: '3d70cde6',
        189: '347f7030',
        229: 'abec451a',
        235: 'a7456010',
        338: '56a8b04e',
        393: '1948972b',
        401: '17896441',
        435: '2605654f',
        481: '50037f41',
        577: '9972b359',
        583: '1df93b7f',
        594: '1c568be9',
        647: '5e95c892',
        726: '2d1977f1',
        742: 'aba21aa0',
        777: '0422a2f9',
        778: 'c38d0ac7',
        807: 'e96c62ed',
        810: 'f369a9c8',
        875: '2cb93357',
        879: '22f85d81',
        993: '409e5977',
      }[e] || e) +
      '.' +
      {
        9: '7e101159',
        48: 'f03c2079',
        98: '1eb13a93',
        99: 'b4d5acfa',
        189: 'd9c9f5cb',
        229: '8dd4adaa',
        235: 'e59197f6',
        338: 'd46c8c43',
        393: '9fc734fa',
        401: '6df23cdf',
        435: '2e763345',
        481: '55af3dce',
        577: 'c7ac30cc',
        583: 'a52a256d',
        594: 'f99681a0',
        647: 'd0a83cb7',
        726: 'c6f1f3f0',
        742: '0473ab22',
        777: 'ddcfece5',
        778: '78da8bbc',
        807: 'b50c57dc',
        810: '0abf450d',
        821: '5045b770',
        861: '099f965f',
        875: '6f43dd28',
        879: 'f5480078',
        911: '3051c6dc',
        993: '248db8f7',
      }[e] +
      '.js'),
    (r.miniCssF = (e) => {}),
    (r.g = (function () {
      if ('object' == typeof globalThis) return globalThis;
      try {
        return this || new Function('return this')();
      } catch (e) {
        if ('object' == typeof window) return window;
      }
    })()),
    (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (() => {
      const e = {},
        t = 'hygen-docs-site:';
      r.l = (n, o, c, a) => {
        if (e[n]) return void e[n].push(o);
        let f, s;
        if (void 0 !== c) {
          const e = document.getElementsByTagName('script');
          for (var i = 0; i < e.length; i++) {
            const r = e[i];
            if (r.getAttribute('src') == n || r.getAttribute('data-webpack') == t + c) {
              f = r;
              break;
            }
          }
        }
        f ||
          ((s = !0),
          (f = document.createElement('script')),
          (f.charset = 'utf-8'),
          r.nc && f.setAttribute('nonce', r.nc),
          f.setAttribute('data-webpack', t + c),
          (f.src = n)),
          (e[n] = [o]);
        const d = (t, r) => {
            (f.onerror = f.onload = null), clearTimeout(u);
            const o = e[n];
            if ((delete e[n], f.parentNode?.removeChild(f), o?.forEach((e) => e(r)), t))
              return t(r);
          },
          u = setTimeout(d.bind(null, void 0, { type: 'timeout', target: f }), 12e4);
        (f.onerror = d.bind(null, f.onerror)),
          (f.onload = d.bind(null, f.onload)),
          s && document.head.appendChild(f);
      };
    })(),
    (r.r = (e) => {
      Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (r.dn = (e) => {
      var t = Object.getOwnPropertyDescriptor(e, 'name');
      (!t || (!t.writable && t.configurable)) &&
        Object.defineProperty(e, 'name', { value: 'default', configurable: !0 });
    }),
    (r.p = '/core/hygen/'),
    (r.gca = function (e) {
      return (
        (e =
          {
            17896441: '401',
            '12e141dd': '9',
            a94703ab: '48',
            a7bd4aaa: '98',
            '3d70cde6': '99',
            '347f7030': '189',
            abec451a: '229',
            a7456010: '235',
            '56a8b04e': '338',
            '1948972b': '393',
            '2605654f': '435',
            '50037f41': '481',
            '9972b359': '577',
            '1df93b7f': '583',
            '1c568be9': '594',
            '5e95c892': '647',
            '2d1977f1': '726',
            aba21aa0: '742',
            '0422a2f9': '777',
            c38d0ac7: '778',
            e96c62ed: '807',
            f369a9c8: '810',
            '2cb93357': '875',
            '22f85d81': '879',
            '409e5977': '993',
          }[e] || e),
        r.p + r.u(e)
      );
    }),
    (() => {
      const e = { 354: 0, 869: 0 };
      (r.f.j = (t, n) => {
        let o = r.o(e, t) ? e[t] : void 0;
        if (0 !== o)
          if (o) n.push(o[2]);
          else if (/^(354|869)$/.test(t)) e[t] = 0;
          else {
            const c = new Promise((r, n) => (o = e[t] = [r, n]));
            n.push((o[2] = c));
            const a = new Error(),
              f = (n) => {
                if (r.o(e, t) && ((o = e[t]), 0 !== o && (e[t] = void 0), o)) {
                  const e = n && ('load' === n.type ? 'missing' : n.type),
                    r = n && n.target && n.target.src;
                  (a.message = 'Loading chunk ' + t + ' failed.\n(' + e + ': ' + r + ')'),
                    (a.name = 'ChunkLoadError'),
                    (a.type = e),
                    (a.request = r),
                    (a.event = n),
                    o[1](a);
                }
              };
            r.l(r.p + r.u(t), f, 'chunk-' + t, t);
          }
      }),
        (r.O.j = (t) => 0 === e[t]);
      const t = (t, n) => {
          let [o, c, a] = n;
          var f,
            s,
            i = 0;
          if (o.some((t) => 0 !== e[t])) {
            for (f in c) r.o(c, f) && (r.m[f] = c[f]);
            if (a) var d = a(r);
          }
          for (t && t(n); i < o.length; i++)
            (s = o[i]), r.o(e, s) && e[s] && e[s][0](), (e[s] = 0);
          return r.O(d);
        },
        n = (self.webpackChunkhygen_docs_site = self.webpackChunkhygen_docs_site || []);
      n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
    })();
})();
