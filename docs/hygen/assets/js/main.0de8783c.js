/*! For license information please see main.0de8783c.js.LICENSE.txt */
(self.webpackChunkhygen_docs_site = self.webpackChunkhygen_docs_site || []).push([
  [792],
  {
    6174(e, t, n) {
      const r = {
        './prism-bash': 1022,
        './prism-javascript': 1515,
        './prism-shell-session': 4413,
        './prism-typescript': 6931,
        './prism-yaml': 9299,
      };
      function a(e) {
        const t = o(e);
        return n(t);
      }
      function o(e) {
        if (!n.o(r, e)) {
          const t = new Error("Cannot find module '" + e + "'");
          throw ((t.code = 'MODULE_NOT_FOUND'), t);
        }
        return r[e];
      }
      (a.keys = function () {
        return Object.keys(r);
      }),
        (a.resolve = o),
        (e.exports = a),
        (a.id = 6174);
    },
    9293(e, t, n) {
      'use strict';
      n.d(t, { mg: () => J, vd: () => W });
      var r = n.cw((e) => {
          e.exports = function (e, t, n, r, a, o, i, l) {
            if (!e) {
              var s;
              if (void 0 === t)
                s = new Error(
                  'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.',
                );
              else {
                var u = [n, r, a, o, i, l],
                  c = 0;
                (s = new Error(
                  t.replace(/%s/g, function () {
                    return u[c++];
                  }),
                )).name = 'Invariant Violation';
              }
              throw ((s.framesToPop = 1), s);
            }
          };
        }),
        a = n(2503),
        o = n(2736),
        i = n.n(o),
        l = n(4072),
        s = n.n(l);
      function u() {
        return u.c || (u.c = n.n(r()));
      }
      r();
      var c = n(2945),
        d = n.n(c);
      function f() {
        return (
          (f =
            Object.assign ||
            function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                  Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          f.apply(this, arguments)
        );
      }
      function p(e, t) {
        (e.prototype = Object.create(t.prototype)),
          (e.prototype.constructor = e),
          g(e, t);
      }
      function g(e, t) {
        return (
          (g =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            }),
          g(e, t)
        );
      }
      function m(e, t) {
        if (null == e) return {};
        var n,
          r,
          a = {},
          o = Object.keys(e);
        for (r = 0; r < o.length; r++) t.indexOf((n = o[r])) >= 0 || (a[n] = e[n]);
        return a;
      }
      var h = {
          BASE: 'base',
          BODY: 'body',
          HEAD: 'head',
          HTML: 'html',
          LINK: 'link',
          META: 'meta',
          NOSCRIPT: 'noscript',
          SCRIPT: 'script',
          STYLE: 'style',
          TITLE: 'title',
          FRAGMENT: 'Symbol(react.fragment)',
        },
        y = { rel: ['amphtml', 'canonical', 'alternate'] },
        v = { type: ['application/ld+json'] },
        b = {
          charset: '',
          name: ['robots', 'description'],
          property: [
            'og:type',
            'og:title',
            'og:url',
            'og:image',
            'og:image:alt',
            'og:description',
            'twitter:url',
            'twitter:title',
            'twitter:description',
            'twitter:image',
            'twitter:image:alt',
            'twitter:card',
            'twitter:site',
          ],
        },
        w = Object.keys(h).map(function (e) {
          return h[e];
        }),
        k = {
          accesskey: 'accessKey',
          charset: 'charSet',
          class: 'className',
          contenteditable: 'contentEditable',
          contextmenu: 'contextMenu',
          'http-equiv': 'httpEquiv',
          itemprop: 'itemProp',
          tabindex: 'tabIndex',
        },
        S = Object.keys(k).reduce(function (e, t) {
          return (e[k[t]] = t), e;
        }, {}),
        x = function (e, t) {
          for (var n = e.length - 1; n >= 0; n -= 1) {
            var r = e[n];
            if (Object.prototype.hasOwnProperty.call(r, t)) return r[t];
          }
          return null;
        },
        E = function (e) {
          var t = x(e, h.TITLE),
            n = x(e, 'titleTemplate');
          if ((Array.isArray(t) && (t = t.join('')), n && t))
            return n.replace(/%s/g, function () {
              return t;
            });
          var r = x(e, 'defaultTitle');
          return t || r || void 0;
        },
        _ = function (e) {
          return x(e, 'onChangeClientState') || function () {};
        },
        A = function (e, t) {
          return t
            .filter(function (t) {
              return void 0 !== t[e];
            })
            .map(function (t) {
              return t[e];
            })
            .reduce(function (e, t) {
              return f({}, e, t);
            }, {});
        },
        C = function (e, t) {
          return t
            .filter(function (e) {
              return void 0 !== e[h.BASE];
            })
            .map(function (e) {
              return e[h.BASE];
            })
            .reverse()
            .reduce(function (t, n) {
              if (!t.length)
                for (var r = Object.keys(n), a = 0; a < r.length; a += 1) {
                  var o = r[a].toLowerCase();
                  if (-1 !== e.indexOf(o) && n[o]) return t.concat(n);
                }
              return t;
            }, []);
        },
        T = function (e, t, n) {
          var r = {};
          return n
            .filter(function (t) {
              return (
                !!Array.isArray(t[e]) ||
                (void 0 !== t[e] &&
                  console &&
                  'function' == typeof console.warn &&
                  console.warn(
                    'Helmet: ' +
                      e +
                      ' should be of type "Array". Instead found type "' +
                      typeof t[e] +
                      '"',
                  ),
                !1)
              );
            })
            .map(function (t) {
              return t[e];
            })
            .reverse()
            .reduce(function (e, n) {
              var a = {};
              n.filter(function (e) {
                for (var n, o = Object.keys(e), i = 0; i < o.length; i += 1) {
                  var l = o[i],
                    s = l.toLowerCase();
                  -1 === t.indexOf(s) ||
                    ('rel' === n && 'canonical' === e[n].toLowerCase()) ||
                    ('rel' === s && 'stylesheet' === e[s].toLowerCase()) ||
                    (n = s),
                    -1 === t.indexOf(l) ||
                      ('innerHTML' !== l && 'cssText' !== l && 'itemprop' !== l) ||
                      (n = l);
                }
                if (!n || !e[n]) return !1;
                var u = e[n].toLowerCase();
                return (
                  r[n] || (r[n] = {}),
                  a[n] || (a[n] = {}),
                  !r[n][u] && ((a[n][u] = !0), !0)
                );
              })
                .reverse()
                .forEach(function (t) {
                  return e.push(t);
                });
              for (var o = Object.keys(a), i = 0; i < o.length; i += 1) {
                var l = o[i],
                  s = f({}, r[l], a[l]);
                r[l] = s;
              }
              return e;
            }, [])
            .reverse();
        },
        N = function (e, t) {
          if (Array.isArray(e) && e.length)
            for (var n = 0; n < e.length; n += 1) if (e[n][t]) return !0;
          return !1;
        },
        O = function (e) {
          return Array.isArray(e) ? e.join('') : e;
        },
        P = function (e, t) {
          return Array.isArray(e)
            ? e.reduce(
                function (e, n) {
                  return (
                    (function (e, t) {
                      for (var n = Object.keys(e), r = 0; r < n.length; r += 1)
                        if (t[n[r]] && t[n[r]].includes(e[n[r]])) return !0;
                      return !1;
                    })(n, t)
                      ? e.priority.push(n)
                      : e.default.push(n),
                    e
                  );
                },
                { priority: [], default: [] },
              )
            : { default: e };
        },
        j = function (e, t) {
          var n;
          return f({}, e, (((n = {})[t] = void 0), n));
        },
        L = [h.NOSCRIPT, h.SCRIPT, h.STYLE],
        I = function (e, t) {
          return (
            void 0 === t && (t = !0),
            !1 === t
              ? String(e)
              : String(e)
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#x27;')
          );
        },
        F = function (e) {
          return Object.keys(e).reduce(function (t, n) {
            var r = void 0 !== e[n] ? n + '="' + e[n] + '"' : '' + n;
            return t ? t + ' ' + r : r;
          }, '');
        },
        R = function (e, t) {
          return (
            void 0 === t && (t = {}),
            Object.keys(e).reduce(function (t, n) {
              return (t[k[n] || n] = e[n]), t;
            }, t)
          );
        },
        D = function (e, t) {
          return t.map(function (t, n) {
            var r,
              o = (((r = { key: n })['data-rh'] = !0), r);
            return (
              Object.keys(t).forEach(function (e) {
                var n = k[e] || e;
                'innerHTML' === n || 'cssText' === n
                  ? (o.dangerouslySetInnerHTML = { __html: t.innerHTML || t.cssText })
                  : (o[n] = t[e]);
              }),
              a.createElement(e, o)
            );
          });
        },
        z = function (e, t, n) {
          switch (e) {
            case h.TITLE:
              return {
                toComponent: function () {
                  return (
                    (n = t.titleAttributes),
                    ((r = { key: (e = t.title) })['data-rh'] = !0),
                    (o = R(n, r)),
                    [a.createElement(h.TITLE, o, e)]
                  );
                  var e, n, r, o;
                },
                toString: function () {
                  return (function (e, t, n, r) {
                    var a = F(n),
                      o = O(t);
                    return a
                      ? '<' + e + ' data-rh="true" ' + a + '>' + I(o, r) + '</' + e + '>'
                      : '<' + e + ' data-rh="true">' + I(o, r) + '</' + e + '>';
                  })(e, t.title, t.titleAttributes, n);
                },
              };
            case 'bodyAttributes':
            case 'htmlAttributes':
              return {
                toComponent: function () {
                  return R(t);
                },
                toString: function () {
                  return F(t);
                },
              };
            default:
              return {
                toComponent: function () {
                  return D(e, t);
                },
                toString: function () {
                  return (function (e, t, n) {
                    return t.reduce(function (t, r) {
                      var a = Object.keys(r)
                          .filter(function (e) {
                            return !('innerHTML' === e || 'cssText' === e);
                          })
                          .reduce(function (e, t) {
                            var a = void 0 === r[t] ? t : t + '="' + I(r[t], n) + '"';
                            return e ? e + ' ' + a : a;
                          }, ''),
                        o = r.innerHTML || r.cssText || '',
                        i = -1 === L.indexOf(e);
                      return (
                        t +
                        '<' +
                        e +
                        ' data-rh="true" ' +
                        a +
                        (i ? '/>' : '>' + o + '</' + e + '>')
                      );
                    }, '');
                  })(e, t, n);
                },
              };
          }
        },
        M = function (e) {
          var t = e.baseTag,
            n = e.bodyAttributes,
            r = e.encode,
            a = e.htmlAttributes,
            o = e.noscriptTags,
            i = e.styleTags,
            l = e.title,
            s = void 0 === l ? '' : l,
            u = e.titleAttributes,
            c = e.linkTags,
            d = e.metaTags,
            f = e.scriptTags,
            p = {
              toComponent: function () {},
              toString: function () {
                return '';
              },
            };
          if (e.prioritizeSeoTags) {
            var g = (function (e) {
              var t = e.linkTags,
                n = e.scriptTags,
                r = e.encode,
                a = P(e.metaTags, b),
                o = P(t, y),
                i = P(n, v);
              return {
                priorityMethods: {
                  toComponent: function () {
                    return [].concat(
                      D(h.META, a.priority),
                      D(h.LINK, o.priority),
                      D(h.SCRIPT, i.priority),
                    );
                  },
                  toString: function () {
                    return (
                      z(h.META, a.priority, r) +
                      ' ' +
                      z(h.LINK, o.priority, r) +
                      ' ' +
                      z(h.SCRIPT, i.priority, r)
                    );
                  },
                },
                metaTags: a.default,
                linkTags: o.default,
                scriptTags: i.default,
              };
            })(e);
            (p = g.priorityMethods),
              (c = g.linkTags),
              (d = g.metaTags),
              (f = g.scriptTags);
          }
          return {
            priority: p,
            base: z(h.BASE, t, r),
            bodyAttributes: z('bodyAttributes', n, r),
            htmlAttributes: z('htmlAttributes', a, r),
            link: z(h.LINK, c, r),
            meta: z(h.META, d, r),
            noscript: z(h.NOSCRIPT, o, r),
            script: z(h.SCRIPT, f, r),
            style: z(h.STYLE, i, r),
            title: z(h.TITLE, { title: s, titleAttributes: u }, r),
          };
        },
        B = [],
        $ = function (e, t) {
          var n = this;
          void 0 === t && (t = 'undefined' != typeof document),
            (this.instances = []),
            (this.value = {
              setHelmet: function (e) {
                n.context.helmet = e;
              },
              helmetInstances: {
                get: function () {
                  return n.canUseDOM ? B : n.instances;
                },
                add: function (e) {
                  (n.canUseDOM ? B : n.instances).push(e);
                },
                remove: function (e) {
                  var t = (n.canUseDOM ? B : n.instances).indexOf(e);
                  (n.canUseDOM ? B : n.instances).splice(t, 1);
                },
              },
            }),
            (this.context = e),
            (this.canUseDOM = t),
            t ||
              (e.helmet = M({
                baseTag: [],
                bodyAttributes: {},
                encodeSpecialCharacters: !0,
                htmlAttributes: {},
                linkTags: [],
                metaTags: [],
                noscriptTags: [],
                scriptTags: [],
                styleTags: [],
                title: '',
                titleAttributes: {},
              }));
        },
        U = a.createContext({}),
        H = i().shape({
          setHelmet: i().func,
          helmetInstances: i().shape({ get: i().func, add: i().func, remove: i().func }),
        }),
        V = 'undefined' != typeof document,
        W = (function (e) {
          function t(n) {
            var r;
            return (
              ((r = e.call(this, n) || this).helmetData = new $(
                r.props.context,
                t.canUseDOM,
              )),
              r
            );
          }
          return (
            p(t, e),
            (t.prototype.render = function () {
              return a.createElement(
                U.Provider,
                { value: this.helmetData.value },
                this.props.children,
              );
            }),
            t
          );
        })(a.Component);
      (W.canUseDOM = V),
        (W.propTypes = {
          context: i().shape({ helmet: i().shape() }),
          children: i().node.isRequired,
        }),
        (W.defaultProps = { context: {} }),
        (W.displayName = 'HelmetProvider');
      var G = function (e, t) {
          var n,
            r = document.head || document.querySelector(h.HEAD),
            a = r.querySelectorAll(e + '[data-rh]'),
            o = [].slice.call(a),
            i = [];
          return (
            t &&
              t.length &&
              t.forEach(function (t) {
                var r = document.createElement(e);
                for (var a in t)
                  Object.prototype.hasOwnProperty.call(t, a) &&
                    ('innerHTML' === a
                      ? (r.innerHTML = t.innerHTML)
                      : 'cssText' === a
                      ? r.styleSheet
                        ? (r.styleSheet.cssText = t.cssText)
                        : r.appendChild(document.createTextNode(t.cssText))
                      : r.setAttribute(a, void 0 === t[a] ? '' : t[a]));
                r.setAttribute('data-rh', 'true'),
                  o.some(function (e, t) {
                    return (n = t), r.isEqualNode(e);
                  })
                    ? o.splice(n, 1)
                    : i.push(r);
              }),
            o.forEach(function (e) {
              return e.parentNode.removeChild(e);
            }),
            i.forEach(function (e) {
              return r.appendChild(e);
            }),
            { oldTags: o, newTags: i }
          );
        },
        q = function (e, t) {
          var n = document.getElementsByTagName(e)[0];
          if (n) {
            for (
              var r = n.getAttribute('data-rh'),
                a = r ? r.split(',') : [],
                o = [].concat(a),
                i = Object.keys(t),
                l = 0;
              l < i.length;
              l += 1
            ) {
              var s = i[l],
                u = t[s] || '';
              n.getAttribute(s) !== u && n.setAttribute(s, u),
                -1 === a.indexOf(s) && a.push(s);
              var c = o.indexOf(s);
              -1 !== c && o.splice(c, 1);
            }
            for (var d = o.length - 1; d >= 0; d -= 1) n.removeAttribute(o[d]);
            a.length === o.length
              ? n.removeAttribute('data-rh')
              : n.getAttribute('data-rh') !== i.join(',') &&
                n.setAttribute('data-rh', i.join(','));
          }
        },
        Y = function (e, t) {
          var n = e.baseTag,
            r = e.htmlAttributes,
            a = e.linkTags,
            o = e.metaTags,
            i = e.noscriptTags,
            l = e.onChangeClientState,
            s = e.scriptTags,
            u = e.styleTags,
            c = e.title,
            d = e.titleAttributes;
          q(h.BODY, e.bodyAttributes),
            q(h.HTML, r),
            (function (e, t) {
              void 0 !== e && document.title !== e && (document.title = O(e)),
                q(h.TITLE, t);
            })(c, d);
          var f = {
              baseTag: G(h.BASE, n),
              linkTags: G(h.LINK, a),
              metaTags: G(h.META, o),
              noscriptTags: G(h.NOSCRIPT, i),
              scriptTags: G(h.SCRIPT, s),
              styleTags: G(h.STYLE, u),
            },
            p = {},
            g = {};
          Object.keys(f).forEach(function (e) {
            var t = f[e],
              n = t.newTags,
              r = t.oldTags;
            n.length && (p[e] = n), r.length && (g[e] = f[e].oldTags);
          }),
            t && t(),
            l(e, p, g);
        },
        K = null,
        Q = (function (e) {
          function t() {
            for (var t, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
              r[a] = arguments[a];
            return ((t = e.call.apply(e, [this].concat(r)) || this).rendered = !1), t;
          }
          p(t, e);
          var n = t.prototype;
          return (
            (n.shouldComponentUpdate = function (e) {
              return !d()(e, this.props);
            }),
            (n.componentDidUpdate = function () {
              this.emitChange();
            }),
            (n.componentWillUnmount = function () {
              this.props.context.helmetInstances.remove(this), this.emitChange();
            }),
            (n.emitChange = function () {
              var e,
                t,
                n = this.props.context,
                r = n.setHelmet,
                a = null,
                o =
                  ((e = n.helmetInstances.get().map(function (e) {
                    var t = f({}, e.props);
                    return delete t.context, t;
                  })),
                  {
                    baseTag: C(['href'], e),
                    bodyAttributes: A('bodyAttributes', e),
                    defer: x(e, 'defer'),
                    encode: x(e, 'encodeSpecialCharacters'),
                    htmlAttributes: A('htmlAttributes', e),
                    linkTags: T(h.LINK, ['rel', 'href'], e),
                    metaTags: T(
                      h.META,
                      ['name', 'charset', 'http-equiv', 'property', 'itemprop'],
                      e,
                    ),
                    noscriptTags: T(h.NOSCRIPT, ['innerHTML'], e),
                    onChangeClientState: _(e),
                    scriptTags: T(h.SCRIPT, ['src', 'innerHTML'], e),
                    styleTags: T(h.STYLE, ['cssText'], e),
                    title: E(e),
                    titleAttributes: A('titleAttributes', e),
                    prioritizeSeoTags: N(e, 'prioritizeSeoTags'),
                  });
              W.canUseDOM
                ? ((t = o),
                  K && cancelAnimationFrame(K),
                  t.defer
                    ? (K = requestAnimationFrame(function () {
                        Y(t, function () {
                          K = null;
                        });
                      }))
                    : (Y(t), (K = null)))
                : M && (a = M(o)),
                r(a);
            }),
            (n.init = function () {
              this.rendered ||
                ((this.rendered = !0),
                this.props.context.helmetInstances.add(this),
                this.emitChange());
            }),
            (n.render = function () {
              return this.init(), null;
            }),
            t
          );
        })(a.Component);
      (Q.propTypes = { context: H.isRequired }), (Q.displayName = 'HelmetDispatcher');
      var Z = ['children'],
        X = ['children'],
        J = (function (e) {
          function t() {
            return e.apply(this, arguments) || this;
          }
          p(t, e);
          var n = t.prototype;
          return (
            (n.shouldComponentUpdate = function (e) {
              return !s()(j(this.props, 'helmetData'), j(e, 'helmetData'));
            }),
            (n.mapNestedChildrenToProps = function (e, t) {
              if (!t) return null;
              switch (e.type) {
                case h.SCRIPT:
                case h.NOSCRIPT:
                  return { innerHTML: t };
                case h.STYLE:
                  return { cssText: t };
                default:
                  throw new Error(
                    '<' +
                      e.type +
                      ' /> elements are self-closing and can not contain children. Refer to our API for more information.',
                  );
              }
            }),
            (n.flattenArrayTypeChildren = function (e) {
              var t,
                n = e.child,
                r = e.arrayTypeChildren;
              return f(
                {},
                r,
                (((t = {})[n.type] = [].concat(r[n.type] || [], [
                  f(
                    {},
                    e.newChildProps,
                    this.mapNestedChildrenToProps(n, e.nestedChildren),
                  ),
                ])),
                t),
              );
            }),
            (n.mapObjectTypeChildren = function (e) {
              var t,
                n,
                r = e.child,
                a = e.newProps,
                o = e.newChildProps,
                i = e.nestedChildren;
              switch (r.type) {
                case h.TITLE:
                  return f(
                    {},
                    a,
                    (((t = {})[r.type] = i), (t.titleAttributes = f({}, o)), t),
                  );
                case h.BODY:
                  return f({}, a, { bodyAttributes: f({}, o) });
                case h.HTML:
                  return f({}, a, { htmlAttributes: f({}, o) });
                default:
                  return f({}, a, (((n = {})[r.type] = f({}, o)), n));
              }
            }),
            (n.mapArrayTypeChildrenToProps = function (e, t) {
              var n = f({}, t);
              return (
                Object.keys(e).forEach(function (t) {
                  var r;
                  n = f({}, n, (((r = {})[t] = e[t]), r));
                }),
                n
              );
            }),
            (n.warnOnInvalidChildren = function (e, t) {
              return (
                u()()(
                  w.some(function (t) {
                    return e.type === t;
                  }),
                  'function' == typeof e.type
                    ? 'You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.'
                    : 'Only elements types ' +
                        w.join(', ') +
                        ' are allowed. Helmet does not support rendering <' +
                        e.type +
                        '> elements. Refer to our API for more information.',
                ),
                u()()(
                  !t ||
                    'string' == typeof t ||
                    (Array.isArray(t) &&
                      !t.some(function (e) {
                        return 'string' != typeof e;
                      })),
                  'Helmet expects a string as a child of <' +
                    e.type +
                    '>. Did you forget to wrap your children in braces? ( <' +
                    e.type +
                    '>{``}</' +
                    e.type +
                    '> ) Refer to our API for more information.',
                ),
                !0
              );
            }),
            (n.mapChildrenToProps = function (e, t) {
              var n = this,
                r = {};
              return (
                a.Children.forEach(e, function (e) {
                  if (e && e.props) {
                    var a = e.props,
                      o = a.children,
                      i = m(a, Z),
                      l = Object.keys(i).reduce(function (e, t) {
                        return (e[S[t] || t] = i[t]), e;
                      }, {}),
                      s = e.type;
                    switch (
                      ('symbol' == typeof s
                        ? (s = s.toString())
                        : n.warnOnInvalidChildren(e, o),
                      s)
                    ) {
                      case h.FRAGMENT:
                        t = n.mapChildrenToProps(o, t);
                        break;
                      case h.LINK:
                      case h.META:
                      case h.NOSCRIPT:
                      case h.SCRIPT:
                      case h.STYLE:
                        r = n.flattenArrayTypeChildren({
                          child: e,
                          arrayTypeChildren: r,
                          newChildProps: l,
                          nestedChildren: o,
                        });
                        break;
                      default:
                        t = n.mapObjectTypeChildren({
                          child: e,
                          newProps: t,
                          newChildProps: l,
                          nestedChildren: o,
                        });
                    }
                  }
                }),
                this.mapArrayTypeChildrenToProps(r, t)
              );
            }),
            (n.render = function () {
              var e = this.props,
                t = e.children,
                n = m(e, X),
                r = f({}, n),
                o = n.helmetData;
              return (
                t && (r = this.mapChildrenToProps(t, r)),
                !o || o instanceof $ || (o = new $(o.context, o.instances)),
                o
                  ? a.createElement(Q, f({}, r, { context: o.value, helmetData: void 0 }))
                  : a.createElement(U.Consumer, null, function (e) {
                      return a.createElement(Q, f({}, r, { context: e }));
                    })
              );
            }),
            t
          );
        })(a.Component);
      (J.propTypes = {
        base: i().object,
        bodyAttributes: i().object,
        children: i().oneOfType([i().arrayOf(i().node), i().node]),
        defaultTitle: i().string,
        defer: i().bool,
        encodeSpecialCharacters: i().bool,
        htmlAttributes: i().object,
        link: i().arrayOf(i().object),
        meta: i().arrayOf(i().object),
        noscript: i().arrayOf(i().object),
        onChangeClientState: i().func,
        script: i().arrayOf(i().object),
        style: i().arrayOf(i().object),
        title: i().string,
        titleAttributes: i().object,
        titleTemplate: i().string,
        prioritizeSeoTags: i().bool,
        helmetData: i().object,
      }),
        (J.defaultProps = {
          defer: !0,
          encodeSpecialCharacters: !0,
          prioritizeSeoTags: !1,
        }),
        (J.displayName = 'Helmet');
    },
    3151(e, t, n) {
      'use strict';
      n.d(t, { A: () => p });
      var r = n.cw((e) => {
          function t(e, t) {
            (e.prototype = Object.create(t.prototype)),
              (e.prototype.constructor = e),
              (e.__proto__ = t);
          }
          function r(e) {
            if (void 0 === e)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called",
              );
            return e;
          }
          function o(e, t, n) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = n),
              e
            );
          }
          function i() {
            return (
              (i =
                Object.assign ||
                function (e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n)
                      Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
                  }
                  return e;
                }),
              i.apply(this, arguments)
            );
          }
          var l = a(),
            s = [],
            u = [];
          var c = l.createContext(null);
          function d(e) {
            var t = e(),
              n = { loading: !0, loaded: null, error: null };
            return (
              (n.promise = t
                .then(function (e) {
                  return (n.loading = !1), (n.loaded = e), e;
                })
                .catch(function (e) {
                  throw ((n.loading = !1), (n.error = e), e);
                })),
              n
            );
          }
          function f(e) {
            var t = { loading: !1, loaded: {}, error: null },
              n = [];
            try {
              Object.keys(e).forEach(function (r) {
                var a = d(e[r]);
                a.loading
                  ? (t.loading = !0)
                  : ((t.loaded[r] = a.loaded), (t.error = a.error)),
                  n.push(a.promise),
                  a.promise
                    .then(function (e) {
                      t.loaded[r] = e;
                    })
                    .catch(function (e) {
                      t.error = e;
                    });
              });
            } catch (r) {
              t.error = r;
            }
            return (
              (t.promise = Promise.all(n)
                .then(function (e) {
                  return (t.loading = !1), e;
                })
                .catch(function (e) {
                  throw ((t.loading = !1), e);
                })),
              t
            );
          }
          function p(e, t) {
            return l.createElement((n = e) && n.__esModule ? n.default : n, t);
            var n;
          }
          function g(e, a) {
            var d, f;
            if (!a.loading)
              throw new Error('react-loadable requires a `loading` component');
            var g = i(
                {
                  loader: null,
                  loading: null,
                  delay: 200,
                  timeout: null,
                  render: p,
                  webpack: null,
                  modules: null,
                },
                a,
              ),
              m = null;
            function h() {
              return m || (m = e(g.loader)), m.promise;
            }
            return (
              s.push(h),
              'function' == typeof g.webpack &&
                u.push(function () {
                  if (
                    (0, g.webpack)().every(function (e) {
                      return void 0 !== e && void 0 !== n.m[e];
                    })
                  )
                    return h();
                }),
              (f = d =
                (function (n) {
                  function a(t) {
                    var a;
                    return (
                      o(r(r((a = n.call(this, t) || this))), 'retry', function () {
                        a.setState({ error: null, loading: !0, timedOut: !1 }),
                          (m = e(g.loader)),
                          a._loadModule();
                      }),
                      h(),
                      (a.state = {
                        error: m.error,
                        pastDelay: !1,
                        timedOut: !1,
                        loading: m.loading,
                        loaded: m.loaded,
                      }),
                      a
                    );
                  }
                  t(a, n),
                    (a.preload = function () {
                      return h();
                    });
                  var i = a.prototype;
                  return (
                    (i.UNSAFE_componentWillMount = function () {
                      this._loadModule();
                    }),
                    (i.componentDidMount = function () {
                      this._mounted = !0;
                    }),
                    (i._loadModule = function () {
                      var e = this;
                      if (
                        (this.context &&
                          Array.isArray(g.modules) &&
                          g.modules.forEach(function (t) {
                            e.context.report(t);
                          }),
                        m.loading)
                      ) {
                        var t = function (t) {
                          e._mounted && e.setState(t);
                        };
                        'number' == typeof g.delay &&
                          (0 === g.delay
                            ? this.setState({ pastDelay: !0 })
                            : (this._delay = setTimeout(function () {
                                t({ pastDelay: !0 });
                              }, g.delay))),
                          'number' == typeof g.timeout &&
                            (this._timeout = setTimeout(function () {
                              t({ timedOut: !0 });
                            }, g.timeout));
                        var n = function () {
                          t({ error: m.error, loaded: m.loaded, loading: m.loading }),
                            e._clearTimeouts();
                        };
                        m.promise
                          .then(function () {
                            return n(), null;
                          })
                          .catch(function (e) {
                            return n(), null;
                          });
                      }
                    }),
                    (i.componentWillUnmount = function () {
                      (this._mounted = !1), this._clearTimeouts();
                    }),
                    (i._clearTimeouts = function () {
                      clearTimeout(this._delay), clearTimeout(this._timeout);
                    }),
                    (i.render = function () {
                      return this.state.loading || this.state.error
                        ? l.createElement(g.loading, {
                            isLoading: this.state.loading,
                            pastDelay: this.state.pastDelay,
                            timedOut: this.state.timedOut,
                            error: this.state.error,
                            retry: this.retry,
                          })
                        : this.state.loaded
                        ? g.render(this.state.loaded, this.props)
                        : null;
                    }),
                    a
                  );
                })(l.Component)),
              o(d, 'contextType', c),
              f
            );
          }
          function m(e) {
            return g(d, e);
          }
          m.Map = function (e) {
            if ('function' != typeof e.render)
              throw new Error('LoadableMap requires a `render(loaded, props)` function');
            return g(f, e);
          };
          var h = (function (e) {
            function n() {
              return e.apply(this, arguments) || this;
            }
            return (
              t(n, e),
              (n.prototype.render = function () {
                return l.createElement(
                  c.Provider,
                  { value: { report: this.props.report } },
                  l.Children.only(this.props.children),
                );
              }),
              n
            );
          })(l.Component);
          function y(e) {
            for (var t = []; e.length; ) {
              var n = e.pop();
              t.push(n());
            }
            return Promise.all(t).then(function () {
              if (e.length) return y(e);
            });
          }
          (m.Capture = h),
            (m.preloadAll = function () {
              return new Promise(function (e, t) {
                y(s).then(e, t);
              });
            }),
            (m.preloadReady = function () {
              return new Promise(function (e, t) {
                y(u).then(e, e);
              });
            }),
            (e.exports = m);
        }),
        a = () => n(2503);
      function o() {
        return o.c || (o.c = n.n(r()));
      }
      a(), r();
      var i = n(4054);
      const l = {
        '0422a2f9': [
          function () {
            return n.e(777).then(() => n(3971));
          },
          '@site/../docs/conditional-skip.md',
          3971,
        ],
        '12e141dd': [
          function () {
            return n.e(9).then(() => n.t(3134, 19));
          },
          '@generated/docusaurus-plugin-content-docs/default/p/core-hygen-docs-dcd.json',
          3134,
        ],
        17896441: [
          function () {
            return Promise.all([n.e(869), n.e(861), n.e(401)]).then(() => n(2751));
          },
          '@theme/DocItem',
          2751,
        ],
        '1948972b': [
          function () {
            return n.e(393).then(() => n(5320));
          },
          '@site/../docs/content-transforms.md',
          5320,
        ],
        '1c568be9': [
          function () {
            return n.e(594).then(() => n(3781));
          },
          '@site/../docs/react-native.md',
          3781,
        ],
        '1df93b7f': [
          function () {
            return Promise.all([n.e(869), n.e(861), n.e(583)]).then(() => n(1010));
          },
          '@site/src/pages/index.tsx',
          1010,
        ],
        '22f85d81': [
          function () {
            return n.e(879).then(() => n(5779));
          },
          '@site/../docs/extensibility.md',
          5779,
        ],
        '2605654f': [
          function () {
            return n.e(435).then(() => n(2334));
          },
          '@site/../docs/ide-plugin.md',
          2334,
        ],
        '2cb93357': [
          function () {
            return n.e(875).then(() => n(4614));
          },
          '@site/../docs/quick-start.md',
          4614,
        ],
        '2d1977f1': [
          function () {
            return n.e(726).then(() => n(2041));
          },
          '@site/../docs/express.md',
          2041,
        ],
        '347f7030': [
          function () {
            return n.e(189).then(() => n(9110));
          },
          '@site/../docs/redux.md',
          9110,
        ],
        '3d70cde6': [
          function () {
            return n.e(99).then(() => n(492));
          },
          '@site/../docs/faq.md',
          492,
        ],
        '409e5977': [
          function () {
            return n.e(993).then(() => n(609));
          },
          '@site/../docs/interactive-picker.md',
          609,
        ],
        '50037f41': [
          function () {
            return n.e(481).then(() => n(6066));
          },
          '@site/../docs/standalone.md',
          6066,
        ],
        '56a8b04e': [
          function () {
            return n.e(338).then(() => n(8101));
          },
          '@site/../docs/create.md',
          8101,
        ],
        '5e95c892': [
          function () {
            return n.e(647).then(() => n(5527));
          },
          '@theme/DocsRoot',
          5527,
        ],
        '5e9f5e1a': [
          function () {
            return Promise.resolve().then(() => n(4784));
          },
          '@generated/docusaurus.config',
          4784,
        ],
        '9972b359': [
          function () {
            return n.e(577).then(() => n(9987));
          },
          '@site/../docs/generators.md',
          9987,
        ],
        a7456010: [
          function () {
            return n.e(235).then(() => n.t(8552, 19));
          },
          '@generated/docusaurus-plugin-content-pages/default/__plugin.json',
          8552,
        ],
        a7bd4aaa: [
          function () {
            return n.e(98).then(() => n(9854));
          },
          '@theme/DocVersionRoot',
          9854,
        ],
        a94703ab: [
          function () {
            return Promise.all([n.e(869), n.e(48)]).then(() => n(603));
          },
          '@theme/DocRoot',
          603,
        ],
        aba21aa0: [
          function () {
            return n.e(742).then(() => n.t(9474, 19));
          },
          '@generated/docusaurus-plugin-content-docs/default/__plugin.json',
          9474,
        ],
        abec451a: [
          function () {
            return n.e(229).then(() => n(8747));
          },
          '@site/../docs/prompts.md',
          8747,
        ],
        c38d0ac7: [
          function () {
            return n.e(778).then(() => n(2412));
          },
          '@site/../docs/packages.md',
          2412,
        ],
        e96c62ed: [
          function () {
            return n.e(807).then(() => n(1360));
          },
          '@site/../docs/templates.md',
          1360,
        ],
        f369a9c8: [
          function () {
            return n.e(810).then(() => n(5552));
          },
          '@site/../docs/glob-batch.md',
          5552,
        ],
      };
      var s = n(159);
      function u(e) {
        var t = e.error,
          n = e.retry,
          r = e.pastDelay;
        return t
          ? (0, s.jsxs)('div', {
              style: {
                textAlign: 'center',
                color: '#fff',
                backgroundColor: '#fa383e',
                borderColor: '#fa383e',
                borderStyle: 'solid',
                borderRadius: '0.25rem',
                borderWidth: '1px',
                boxSizing: 'border-box',
                display: 'block',
                padding: '1rem',
                flex: '0 0 50%',
                marginLeft: '25%',
                marginRight: '25%',
                marginTop: '5rem',
                maxWidth: '50%',
                width: '100%',
              },
              children: [
                (0, s.jsx)('p', { children: String(t) }),
                (0, s.jsx)('div', {
                  children: (0, s.jsx)('button', {
                    type: 'button',
                    onClick: n,
                    children: 'Retry',
                  }),
                }),
              ],
            })
          : r
          ? (0, s.jsx)('div', {
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              },
              children: (0, s.jsx)('svg', {
                id: 'loader',
                style: {
                  width: 128,
                  height: 110,
                  position: 'absolute',
                  top: 'calc(100vh - 64%)',
                },
                viewBox: '0 0 45 45',
                xmlns: 'http://www.w3.org/2000/svg',
                stroke: '#61dafb',
                children: (0, s.jsxs)('g', {
                  fill: 'none',
                  fillRule: 'evenodd',
                  transform: 'translate(1 1)',
                  strokeWidth: '2',
                  children: [
                    (0, s.jsxs)('circle', {
                      cx: '22',
                      cy: '22',
                      r: '6',
                      strokeOpacity: '0',
                      children: [
                        (0, s.jsx)('animate', {
                          attributeName: 'r',
                          begin: '1.5s',
                          dur: '3s',
                          values: '6;22',
                          calcMode: 'linear',
                          repeatCount: 'indefinite',
                        }),
                        (0, s.jsx)('animate', {
                          attributeName: 'stroke-opacity',
                          begin: '1.5s',
                          dur: '3s',
                          values: '1;0',
                          calcMode: 'linear',
                          repeatCount: 'indefinite',
                        }),
                        (0, s.jsx)('animate', {
                          attributeName: 'stroke-width',
                          begin: '1.5s',
                          dur: '3s',
                          values: '2;0',
                          calcMode: 'linear',
                          repeatCount: 'indefinite',
                        }),
                      ],
                    }),
                    (0, s.jsxs)('circle', {
                      cx: '22',
                      cy: '22',
                      r: '6',
                      strokeOpacity: '0',
                      children: [
                        (0, s.jsx)('animate', {
                          attributeName: 'r',
                          begin: '3s',
                          dur: '3s',
                          values: '6;22',
                          calcMode: 'linear',
                          repeatCount: 'indefinite',
                        }),
                        (0, s.jsx)('animate', {
                          attributeName: 'stroke-opacity',
                          begin: '3s',
                          dur: '3s',
                          values: '1;0',
                          calcMode: 'linear',
                          repeatCount: 'indefinite',
                        }),
                        (0, s.jsx)('animate', {
                          attributeName: 'stroke-width',
                          begin: '3s',
                          dur: '3s',
                          values: '2;0',
                          calcMode: 'linear',
                          repeatCount: 'indefinite',
                        }),
                      ],
                    }),
                    (0, s.jsx)('circle', {
                      cx: '22',
                      cy: '22',
                      r: '8',
                      children: (0, s.jsx)('animate', {
                        attributeName: 'r',
                        begin: '0s',
                        dur: '1.5s',
                        values: '6;1;2;3;4;5;6',
                        calcMode: 'linear',
                        repeatCount: 'indefinite',
                      }),
                    }),
                  ],
                }),
              }),
            })
          : null;
      }
      var c = n(1971),
        d = n(8032);
      function f(e, t) {
        if ('*' === e)
          return o()()({
            loading: u,
            loader: function () {
              return n.e(911).then(() => n(2911));
            },
            modules: ['@theme/NotFound'],
            webpack: function () {
              return [2911];
            },
            render: function (e, t) {
              var n = e.default;
              return (0, s.jsx)(d.W, {
                value: { plugin: { name: 'native', id: 'default' } },
                children: (0, s.jsx)(n, Object.assign({}, t)),
              });
            },
          });
        var r = i[e + '-' + t],
          a = {},
          f = [],
          p = [],
          g = (0, c.A)(r);
        return (
          Object.entries(g).forEach(function (e) {
            var t = e[0],
              n = e[1],
              r = l[n];
            r && ((a[t] = r[0]), f.push(r[1]), p.push(r[2]));
          }),
          o()().Map({
            loading: u,
            loader: a,
            modules: f,
            webpack: function () {
              return p;
            },
            render: function (t, n) {
              var a = JSON.parse(JSON.stringify(r));
              Object.entries(t).forEach(function (t) {
                var n = t[0],
                  r = t[1],
                  o = r.default;
                if (!o)
                  throw new Error(
                    'The page component at ' +
                      e +
                      " doesn't have a default export. This makes it impossible to render anything. Consider default-exporting a React component.",
                  );
                ('object' != typeof o && 'function' != typeof o) ||
                  Object.keys(r)
                    .filter(function (e) {
                      return 'default' !== e;
                    })
                    .forEach(function (e) {
                      o[e] = r[e];
                    });
                var i = a,
                  l = n.split('.');
                l.slice(0, -1).forEach(function (e) {
                  i = i[e];
                }),
                  (i[l[l.length - 1]] = o);
              });
              var o = a.__comp;
              delete a.__comp;
              var i = a.__context;
              delete a.__context;
              var l = a.__props;
              return (
                delete a.__props,
                (0, s.jsx)(d.W, {
                  value: i,
                  children: (0, s.jsx)(o, Object.assign({}, a, l, n)),
                })
              );
            },
          })
        );
      }
      const p = [
        {
          path: '/core/hygen/docs',
          component: f('/core/hygen/docs', '0a5'),
          routes: [
            {
              path: '/core/hygen/docs',
              component: f('/core/hygen/docs', 'd3d'),
              routes: [
                {
                  path: '/core/hygen/docs',
                  component: f('/core/hygen/docs', '965'),
                  routes: [
                    {
                      path: '/core/hygen/docs/conditional-skip',
                      component: f('/core/hygen/docs/conditional-skip', '719'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/content-transforms',
                      component: f('/core/hygen/docs/content-transforms', 'f8c'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/create',
                      component: f('/core/hygen/docs/create', 'a6b'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/express',
                      component: f('/core/hygen/docs/express', '20d'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/extensibility',
                      component: f('/core/hygen/docs/extensibility', '95b'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/faq',
                      component: f('/core/hygen/docs/faq', '342'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/generators',
                      component: f('/core/hygen/docs/generators', 'e47'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/glob-batch',
                      component: f('/core/hygen/docs/glob-batch', '30b'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/ide-plugin',
                      component: f('/core/hygen/docs/ide-plugin', 'c24'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/interactive-picker',
                      component: f('/core/hygen/docs/interactive-picker', 'e01'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/packages',
                      component: f('/core/hygen/docs/packages', 'cca'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/prompts',
                      component: f('/core/hygen/docs/prompts', '53e'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/quick-start',
                      component: f('/core/hygen/docs/quick-start', '221'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/react-native',
                      component: f('/core/hygen/docs/react-native', 'aa9'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/redux',
                      component: f('/core/hygen/docs/redux', 'f8b'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/standalone',
                      component: f('/core/hygen/docs/standalone', 'b10'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                    {
                      path: '/core/hygen/docs/templates',
                      component: f('/core/hygen/docs/templates', '9ad'),
                      exact: !0,
                      sidebar: 'docs',
                    },
                  ],
                },
              ],
            },
          ],
        },
        { path: '/core/hygen/', component: f('/core/hygen/', '5d7'), exact: !0 },
        { path: '*', component: f('*') },
      ];
    },
    271(e, t, n) {
      'use strict';
      n.d(t, { o: () => o, x: () => i });
      var r = n(2503),
        a = n(159),
        o = r.createContext(!1);
      function i(e) {
        var t = e.children,
          n = (0, r.useState)(!1),
          i = n[0],
          l = n[1];
        return (
          (0, r.useEffect)(function () {
            l(!0);
          }, []),
          (0, a.jsx)(o.Provider, { value: i, children: t })
        );
      }
    },
    5119(e, t, n) {
      'use strict';
      var r = n.cw((e, t) => {
          n.r(t), s(), S()().configure({ showSpinner: !1 });
          const r = {
            onRouteUpdate: function (e) {
              var t = e.location,
                n = e.previousLocation;
              if (n && t.pathname !== n.pathname) {
                var r = window.setTimeout(function () {
                  S()().start();
                }, 200);
                return function () {
                  return window.clearTimeout(r);
                };
              }
            },
            onRouteDidUpdate: function () {
              S()().done();
            },
          };
          n.d(t, ['default', 0, r]);
        }),
        a = n.cw((e, t) => {
          n.r(t), v(), o(), (0, o().A)(v().My);
        }),
        o = n.cw((e, t) => {
          function r(e) {
            var t = y().default.themeConfig.prism.additionalLanguages,
              r = globalThis.Prism;
            (globalThis.Prism = e),
              t.forEach(function (e) {
                'php' === e && u(), n(6174)('./prism-' + e);
              }),
              delete globalThis.Prism,
              void 0 !== r && (globalThis.Prism = e);
          }
          n.d(t, { A: () => r });
        }),
        i = n.cw((e, t) => {
          n.r(t);
        }),
        l = n.cw((e, t) => {
          n.r(t);
        }),
        s = () => n(8744),
        u = () => n(8020),
        c = n.cw((e, t) => {
          var n = h(),
            r = g(),
            a = p();
          function o(e) {
            var t = 'https://react.dev/errors/' + e;
            if (1 < arguments.length) {
              t += '?args[]=' + encodeURIComponent(arguments[1]);
              for (var n = 2; n < arguments.length; n++)
                t += '&args[]=' + encodeURIComponent(arguments[n]);
            }
            return (
              'Minified React error #' +
              e +
              '; visit ' +
              t +
              ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
            );
          }
          function i(e) {
            return !(!e || (1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType));
          }
          function l(e) {
            for (var t = e, n = t; n && !n.alternate; )
              !!(4098 & (t = n).flags) && (e = t.return), (n = t.return);
            for (; t.return; ) t = t.return;
            return 3 === t.tag ? e : null;
          }
          function s(e) {
            if (13 === e.tag) {
              var t = e.memoizedState;
              if (
                (null === t && null !== (e = e.alternate) && (t = e.memoizedState),
                null !== t)
              )
                return t.dehydrated;
            }
            return null;
          }
          function u(e) {
            if (31 === e.tag) {
              var t = e.memoizedState;
              if (
                (null === t && null !== (e = e.alternate) && (t = e.memoizedState),
                null !== t)
              )
                return t.dehydrated;
            }
            return null;
          }
          function c(e) {
            if (l(e) !== e) throw Error(o(188));
          }
          function d(e) {
            var t = e.tag;
            if (5 === t || 26 === t || 27 === t || 6 === t) return e;
            for (e = e.child; null !== e; ) {
              if (null !== (t = d(e))) return t;
              e = e.sibling;
            }
            return null;
          }
          function f(e, t, n, r, a, o) {
            for (; null !== e; ) {
              if (
                ((5 === e.tag || 27 === e.tag || 6 === e.tag) && n(e, r, a, o)) ||
                ((22 !== e.tag || null === e.memoizedState) &&
                  (t || (5 !== e.tag && 27 !== e.tag)) &&
                  f(e.child, t, n, r, a, o))
              )
                return !0;
              e = e.sibling;
            }
            return !1;
          }
          function m(e) {
            for (e = e.return; null !== e; ) {
              if (3 === e.tag || 5 === e.tag || 27 === e.tag) return e;
              e = e.return;
            }
            return null;
          }
          function y(e) {
            var t = !1;
            for (
              e = e.return;
              null !== e &&
              (4 === e.tag && (t = !0), 3 !== e.tag && 5 !== e.tag && 27 !== e.tag);

            )
              e = e.return;
            return t;
          }
          function v(e) {
            var t = [null, null],
              n = m(e);
            return null === n || b(t, e, n.child, { foundSelf: !1 }), t;
          }
          function b(e, t, n, r) {
            for (; null !== n; ) {
              if (n === t) r.foundSelf = !0;
              else if (5 === n.tag || 27 === n.tag || 6 === n.tag) {
                if (r.foundSelf) return (e[1] = n), !0;
                e[0] = n;
              } else if (
                (22 !== n.tag || null === n.memoizedState) &&
                b(e, t, n.child, r)
              )
                return !0;
              n = n.sibling;
            }
            return !1;
          }
          function w(e) {
            switch (e.tag) {
              case 5:
              case 27:
              case 6:
                return e.stateNode;
              case 3:
                return e.stateNode.containerInfo;
              default:
                throw Error(o(559));
            }
          }
          var k = null,
            S = null;
          function x(e, t, n) {
            return e === n || (e === t && ((k = e), !0));
          }
          function E(e, t, n) {
            return e === n ? ((S = e), !1) : e === t && (null !== S && (k = e), !0);
          }
          function _(e) {
            if (null === e) return null;
            do {
              e = null === e ? null : e.return;
            } while (e && 5 !== e.tag && 27 !== e.tag && 3 !== e.tag);
            return e || null;
          }
          function A(e, t, n) {
            for (var r = 0, a = e; a; a = n(a)) r++;
            a = 0;
            for (var o = t; o; o = n(o)) a++;
            for (; 0 < r - a; ) (e = n(e)), r--;
            for (; 0 < a - r; ) (t = n(t)), a--;
            for (; r--; ) {
              if (e === t || (null !== t && e === t.alternate)) return e;
              (e = n(e)), (t = n(t));
            }
            return null;
          }
          var C = Object.assign,
            T = Symbol.for('react.element'),
            N = Symbol.for('react.transitional.element'),
            O = Symbol.for('react.portal'),
            P = Symbol.for('react.fragment'),
            j = Symbol.for('react.strict_mode'),
            L = Symbol.for('react.profiler'),
            I = Symbol.for('react.consumer'),
            F = Symbol.for('react.context'),
            R = Symbol.for('react.forward_ref'),
            D = Symbol.for('react.suspense'),
            z = Symbol.for('react.suspense_list'),
            M = Symbol.for('react.memo'),
            B = Symbol.for('react.lazy');
          Symbol.for('react.scope');
          var $ = Symbol.for('react.activity'),
            U = Symbol.for('react.legacy_hidden');
          Symbol.for('react.tracing_marker');
          var H = Symbol.for('react.memo_cache_sentinel'),
            V = Symbol.for('react.view_transition'),
            W = Symbol.for('react.recoverable'),
            G = Symbol.iterator;
          function q(e) {
            return null === e || 'object' != typeof e
              ? null
              : 'function' == typeof (e = (G && e[G]) || e['@@iterator'])
              ? e
              : null;
          }
          var Y = Symbol.for('react.client.reference');
          function K(e) {
            if (null == e) return null;
            if ('function' == typeof e)
              return e.$$typeof === Y ? null : e.displayName || e.name || null;
            if ('string' == typeof e) return e;
            switch (e) {
              case P:
                return 'Fragment';
              case L:
                return 'Profiler';
              case j:
                return 'StrictMode';
              case D:
                return 'Suspense';
              case z:
                return 'SuspenseList';
              case $:
                return 'Activity';
              case V:
                return 'ViewTransition';
            }
            if ('object' == typeof e)
              switch (e.$$typeof) {
                case O:
                  return 'Portal';
                case F:
                  return e.displayName || 'Context';
                case I:
                  return (e._context.displayName || 'Context') + '.Consumer';
                case R:
                  var t = e.render;
                  return (
                    (e = e.displayName) ||
                      (e =
                        '' !== (e = t.displayName || t.name || '')
                          ? 'ForwardRef(' + e + ')'
                          : 'ForwardRef'),
                    e
                  );
                case M:
                  return null !== (t = e.displayName || null) ? t : K(e.type) || 'Memo';
                case B:
                  (t = e._payload), (e = e._init);
                  try {
                    return K(e(t));
                  } catch (n) {}
              }
            return null;
          }
          var Q = Array.isArray,
            Z = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
            X = a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
            J = { pending: !1, data: null, method: null, action: null },
            ee = [],
            te = -1;
          function ne(e) {
            return { current: e };
          }
          function re(e) {
            0 > te || ((e.current = ee[te]), (ee[te] = null), te--);
          }
          function ae(e, t) {
            te++, (ee[te] = e.current), (e.current = t);
          }
          var oe,
            ie,
            le = ne(null),
            se = ne(null),
            ue = ne(null),
            ce = ne(null);
          function de(e, t) {
            switch ((ae(ue, t), ae(se, e), ae(le, null), t.nodeType)) {
              case 9:
              case 11:
                e = (e = t.documentElement) && (e = e.namespaceURI) ? Mf(e) : 0;
                break;
              default:
                if (((e = t.tagName), (t = t.namespaceURI))) e = Bf((t = Mf(t)), e);
                else
                  switch (e) {
                    case 'svg':
                      e = 1;
                      break;
                    case 'math':
                      e = 2;
                      break;
                    default:
                      e = 0;
                  }
            }
            re(le), ae(le, e);
          }
          function fe() {
            re(le), re(se), re(ue);
          }
          function pe(e) {
            var t = e.memoizedState;
            null !== t && ((gg._currentValue = t.memoizedState), ae(ce, e));
            var n = Bf((t = le.current), e.type);
            t !== n && (ae(se, e), ae(le, n));
          }
          function ge(e) {
            se.current === e && (re(le), re(se)),
              ce.current === e && (re(ce), (gg._currentValue = J));
          }
          function me(e) {
            if (void 0 === oe)
              try {
                throw Error();
              } catch (n) {
                var t = n.stack.trim().match(/\n( *(at )?)/);
                (oe = (t && t[1]) || ''),
                  (ie =
                    -1 < n.stack.indexOf('\n    at')
                      ? ' (<anonymous>)'
                      : -1 < n.stack.indexOf('@')
                      ? '@unknown:0:0'
                      : '');
              }
            return '\n' + oe + e + ie;
          }
          var he = !1;
          function ye(e, t) {
            if (!e || he) return '';
            he = !0;
            var n = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            try {
              var r = {
                DetermineComponentFrameRoot: function () {
                  try {
                    if (t) {
                      var n = function () {
                        throw Error();
                      };
                      if (
                        (Object.defineProperty(n.prototype, 'props', {
                          set: function () {
                            throw Error();
                          },
                        }),
                        'object' == typeof Reflect && Reflect.construct)
                      ) {
                        try {
                          Reflect.construct(n, []);
                        } catch (o) {
                          var r = o;
                        }
                        Reflect.construct(e, [], n);
                      } else {
                        try {
                          n.call();
                        } catch (i) {
                          r = i;
                        }
                        n = !1;
                        try {
                          var a = Object.getOwnPropertyDescriptor(e.prototype, 'props');
                          Object.defineProperty(e.prototype, 'props', {
                            configurable: !0,
                            set: function () {
                              throw Error();
                            },
                          }),
                            (n = !0),
                            new e();
                        } finally {
                          n &&
                            (void 0 !== a
                              ? Object.defineProperty(e.prototype, 'props', a)
                              : delete e.prototype.props);
                        }
                      }
                    } else {
                      try {
                        throw Error();
                      } catch (l) {
                        r = l;
                      }
                      (n = e()) &&
                        'function' == typeof n.catch &&
                        n.catch(function () {});
                    }
                  } catch (s) {
                    if (s && r && 'string' == typeof s.stack) return [s.stack, r.stack];
                  }
                  return [null, null];
                },
              };
              r.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
              var a = Object.getOwnPropertyDescriptor(
                r.DetermineComponentFrameRoot,
                'name',
              );
              a &&
                a.configurable &&
                Object.defineProperty(r.DetermineComponentFrameRoot, 'name', {
                  value: 'DetermineComponentFrameRoot',
                });
              var o = r.DetermineComponentFrameRoot(),
                i = o[0],
                l = o[1];
              if (i && l) {
                var s = i.split('\n'),
                  u = l.split('\n');
                for (
                  a = r = 0;
                  r < s.length && !s[r].includes('DetermineComponentFrameRoot');

                )
                  r++;
                for (; a < u.length && !u[a].includes('DetermineComponentFrameRoot'); )
                  a++;
                if (r === s.length || a === u.length)
                  for (
                    r = s.length - 1, a = u.length - 1;
                    1 <= r && 0 <= a && s[r] !== u[a];

                  )
                    a--;
                for (; 1 <= r && 0 <= a; r--, a--)
                  if (s[r] !== u[a]) {
                    if (1 !== r || 1 !== a)
                      do {
                        if ((r--, 0 > --a || s[r] !== u[a])) {
                          var c = '\n' + s[r].replace(' at new ', ' at ');
                          return (
                            e.displayName &&
                              c.includes('<anonymous>') &&
                              (c = c.replace('<anonymous>', e.displayName)),
                            c
                          );
                        }
                      } while (1 <= r && 0 <= a);
                    break;
                  }
              }
            } finally {
              (he = !1), (Error.prepareStackTrace = n);
            }
            return (n = e ? e.displayName || e.name : '') ? me(n) : '';
          }
          function ve(e, t) {
            switch (e.tag) {
              case 26:
              case 27:
              case 5:
                return me(e.type);
              case 16:
                return me('Lazy');
              case 13:
                return e.child !== t && null !== t
                  ? me('Suspense Fallback')
                  : me('Suspense');
              case 19:
                return me('SuspenseList');
              case 0:
              case 15:
                return ye(e.type, !1);
              case 11:
                return ye(e.type.render, !1);
              case 1:
                return ye(e.type, !0);
              case 31:
                return me('Activity');
              case 30:
                return me('ViewTransition');
              default:
                return '';
            }
          }
          function be(e) {
            try {
              var t = '',
                n = null;
              do {
                (t += ve(e, n)), (n = e), (e = e.return);
              } while (e);
              return t;
            } catch (r) {
              return '\nError generating stack: ' + r.message + '\n' + r.stack;
            }
          }
          var we = Object.prototype.hasOwnProperty,
            ke = n.unstable_scheduleCallback,
            Se = n.unstable_cancelCallback,
            xe = n.unstable_shouldYield,
            Ee = n.unstable_requestPaint,
            _e = n.unstable_now,
            Ae = n.unstable_getCurrentPriorityLevel,
            Ce = n.unstable_ImmediatePriority,
            Te = n.unstable_UserBlockingPriority,
            Ne = n.unstable_NormalPriority,
            Oe = n.unstable_LowPriority,
            Pe = n.unstable_IdlePriority,
            je = n.log,
            Le = n.unstable_setDisableYieldValue,
            Ie = null,
            Fe = null;
          function Re(e) {
            if (
              ('function' == typeof je && Le(e),
              Fe && 'function' == typeof Fe.setStrictMode)
            )
              try {
                Fe.setStrictMode(Ie, e);
              } catch (t) {}
          }
          var De = Math.clz32
              ? Math.clz32
              : function (e) {
                  return 0 === (e >>>= 0) ? 32 : (31 - ((ze(e) / Me) | 0)) | 0;
                },
            ze = Math.log,
            Me = Math.LN2;
          var Be = 256,
            $e = 262144,
            Ue = 4194304;
          function He(e) {
            var t = 42 & e;
            if (0 !== t) return t;
            switch (e & -e) {
              case 1:
                return 1;
              case 2:
                return 2;
              case 4:
                return 4;
              case 8:
                return 8;
              case 16:
                return 16;
              case 32:
                return 32;
              case 64:
                return 64;
              case 128:
                return 128;
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
                return e & -e;
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
                return 3932160 & e;
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
                return 62914560 & e;
              case 67108864:
                return 67108864;
              case 134217728:
                return 134217728;
              case 268435456:
                return 268435456;
              case 536870912:
                return 536870912;
              case 1073741824:
                return 0;
              default:
                return e;
            }
          }
          function Ve(e, t, n) {
            var r = e.pendingLanes;
            if (0 === r) return 0;
            var a = 0,
              o = e.suspendedLanes,
              i = e.pingedLanes;
            e = e.warmLanes;
            var l = 134217727 & r;
            return (
              0 !== l
                ? 0 !== (r = l & ~o)
                  ? (a = He(r))
                  : 0 !== (i &= l)
                  ? (a = He(i))
                  : n || (0 !== (n = l & ~e) && (a = He(n)))
                : 0 !== (l = r & ~o)
                ? (a = He(l))
                : 0 !== i
                ? (a = He(i))
                : n || (0 !== (n = r & ~e) && (a = He(n))),
              0 === a
                ? 0
                : 0 !== t &&
                  t !== a &&
                  0 === (t & o) &&
                  ((o = a & -a) >= (n = t & -t) || (32 === o && 4194048 & n))
                ? t
                : a
            );
          }
          function We(e, t) {
            return 0 === (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t);
          }
          function Ge(e, t) {
            8 & t && (t |= 32 & t);
            var n = e.entangledLanes;
            if (0 !== n)
              for (e = e.entanglements, n &= t; 0 < n; ) {
                var r = 31 - De(n),
                  a = 1 << r;
                (t |= e[r]), (n &= ~a);
              }
            return t;
          }
          function qe(e, t) {
            switch (e) {
              case 1:
              case 2:
              case 4:
              case 8:
              case 64:
                return t + 250;
              case 16:
              case 32:
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
                return t + 5e3;
              default:
                return -1;
            }
          }
          function Ye() {
            var e = Ue;
            return !(62914560 & (Ue <<= 1)) && (Ue = 4194304), e;
          }
          function Ke(e) {
            for (var t = [], n = 0; 31 > n; n++) t.push(e);
            return t;
          }
          function Qe(e, t) {
            (e.pendingLanes |= t),
              268435456 !== t &&
                ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0));
          }
          function Ze(e, t, n) {
            (e.pendingLanes |= t), (e.suspendedLanes &= ~t);
            var r = 31 - De(t);
            (e.entangledLanes |= t),
              (e.entanglements[r] = 1073741824 | e.entanglements[r] | (261930 & n));
          }
          function Xe(e, t) {
            var n = (e.entangledLanes |= t);
            for (e = e.entanglements; n; ) {
              var r = 31 - De(n),
                a = 1 << r;
              (a & t) | (e[r] & t) && (e[r] |= t), (n &= ~a);
            }
          }
          function Je(e, t) {
            var n = t & -t;
            return 0 !== ((n = 42 & n ? 1 : et(n)) & (e.suspendedLanes | t)) ? 0 : n;
          }
          function et(e) {
            switch (e) {
              case 2:
                e = 1;
                break;
              case 8:
                e = 4;
                break;
              case 32:
                e = 16;
                break;
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
                e = 128;
                break;
              case 268435456:
                e = 134217728;
                break;
              default:
                e = 0;
            }
            return e;
          }
          function tt(e) {
            return 2 < (e &= -e) ? (8 < e ? (134217727 & e ? 32 : 268435456) : 8) : 2;
          }
          function nt() {
            var e = X.p;
            return 0 !== e ? e : void 0 === (e = window.event) ? 32 : Og(e.type);
          }
          function rt(e, t) {
            var n = X.p;
            try {
              return (X.p = e), t();
            } finally {
              X.p = n;
            }
          }
          var at = Math.random().toString(36).slice(2),
            ot = '__reactFiber$' + at,
            it = '__reactProps$' + at,
            lt = '__reactContainer$' + at,
            st = '__reactEvents$' + at,
            ut = '__reactListeners$' + at,
            ct = '__reactHandles$' + at,
            dt = '__reactResources$' + at,
            ft = '__reactMarker$' + at,
            pt = '__reactLoad$' + at;
          function gt(e) {
            delete e[ot], delete e[it], delete e[ut], delete e[ct];
          }
          function mt(e) {
            var t;
            if ((t = e[ot])) return t;
            for (var n = e.parentNode; n; ) {
              if ((t = n[lt] || n[ot])) {
                if (
                  ((n = t.alternate),
                  null !== t.child || (null !== n && null !== n.child))
                )
                  for (e = Ip(e); null !== e; ) {
                    if ((n = e[ot])) return n;
                    e = Ip(e);
                  }
                return t;
              }
              n = (e = n).parentNode;
            }
            return null;
          }
          function ht(e) {
            if ((e = e[ot] || e[lt])) {
              var t = e.tag;
              if (
                5 === t ||
                6 === t ||
                13 === t ||
                31 === t ||
                26 === t ||
                27 === t ||
                3 === t
              )
                return e;
            }
            return null;
          }
          function yt(e) {
            var t = e.tag;
            if (5 === t || 26 === t || 27 === t || 6 === t) return e.stateNode;
            throw Error(o(33));
          }
          function vt(e) {
            var t = e[dt];
            return (
              t ||
                (t = e[dt] = { hoistableStyles: new Map(), hoistableScripts: new Map() }),
              t
            );
          }
          function bt(e) {
            e[ft] = !0;
          }
          function wt(e) {
            e[pt] = void 0;
          }
          var kt = new Set(),
            St = {};
          function xt(e, t) {
            Et(e, t), Et(e + 'Capture', t);
          }
          function Et(e, t) {
            for (St[e] = t, e = 0; e < t.length; e++) kt.add(t[e]);
          }
          var _t = RegExp(
              '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
            ),
            At = {},
            Ct = {};
          var Tt = !1;
          function Nt() {
            var e = Tt;
            return (Tt = !1), e;
          }
          function Ot(e, t, n) {
            if (
              ((a = t),
              we.call(Ct, a) ||
                (!we.call(At, a) && (_t.test(a) ? (Ct[a] = !0) : ((At[a] = !0), 0))))
            )
              if (null === n) e.removeAttribute(t);
              else {
                switch (typeof n) {
                  case 'undefined':
                  case 'function':
                  case 'symbol':
                    return void e.removeAttribute(t);
                  case 'boolean':
                    var r = t.toLowerCase().slice(0, 5);
                    if ('data-' !== r && 'aria-' !== r) return void e.removeAttribute(t);
                }
                e.setAttribute(t, n);
              }
            var a;
          }
          function Pt(e, t, n) {
            if (null === n) e.removeAttribute(t);
            else {
              switch (typeof n) {
                case 'undefined':
                case 'function':
                case 'symbol':
                case 'boolean':
                  return void e.removeAttribute(t);
              }
              e.setAttribute(t, n);
            }
          }
          function jt(e, t, n, r) {
            if (null === r) e.removeAttribute(n);
            else {
              switch (typeof r) {
                case 'undefined':
                case 'function':
                case 'symbol':
                case 'boolean':
                  return void e.removeAttribute(n);
              }
              e.setAttributeNS(t, n, r);
            }
          }
          function Lt(e) {
            switch (typeof e) {
              case 'bigint':
              case 'boolean':
              case 'number':
              case 'string':
              case 'undefined':
              case 'object':
                return e;
              default:
                return '';
            }
          }
          function It(e) {
            var t = e.type;
            return (
              (e = e.nodeName) &&
              'input' === e.toLowerCase() &&
              ('checkbox' === t || 'radio' === t)
            );
          }
          function Ft(e) {
            if (!e._valueTracker) {
              var t = It(e) ? 'checked' : 'value';
              e._valueTracker = (function (e, t, n) {
                var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
                if (
                  !e.hasOwnProperty(t) &&
                  void 0 !== r &&
                  'function' == typeof r.get &&
                  'function' == typeof r.set
                ) {
                  var a = r.get,
                    o = r.set;
                  return (
                    Object.defineProperty(e, t, {
                      configurable: !0,
                      get: function () {
                        return a.call(this);
                      },
                      set: function (e) {
                        (n = '' + e), o.call(this, e);
                      },
                    }),
                    Object.defineProperty(e, t, { enumerable: r.enumerable }),
                    {
                      getValue: function () {
                        return n;
                      },
                      setValue: function (e) {
                        n = '' + e;
                      },
                      stopTracking: function () {
                        (e._valueTracker = null), delete e[t];
                      },
                    }
                  );
                }
              })(e, t, '' + e[t]);
            }
          }
          function Rt(e) {
            if (!e) return !1;
            var t = e._valueTracker;
            if (!t) return !0;
            var n = t.getValue(),
              r = '';
            return (
              e && (r = It(e) ? (e.checked ? 'true' : 'false') : e.value),
              (e = r) !== n && (t.setValue(e), !0)
            );
          }
          var Dt = /[\n"\\]/g;
          function zt(e) {
            return e.replace(Dt, function (e) {
              return '\\' + e.charCodeAt(0).toString(16) + ' ';
            });
          }
          function Mt(e, t, n, r, a, o, i, l) {
            (e.name = ''),
              null != i &&
              'function' != typeof i &&
              'symbol' != typeof i &&
              'boolean' != typeof i
                ? (e.type = i)
                : e.removeAttribute('type'),
              null != t
                ? 'number' === i
                  ? ((0 === t && '' === e.value) || e.value != t) &&
                    (e.value = '' + Lt(t))
                  : e.value !== '' + Lt(t) && (e.value = '' + Lt(t))
                : ('submit' !== i && 'reset' !== i) || e.removeAttribute('value'),
              null != t
                ? 'number' === i && e.value == t
                  ? $t(e, Lt(e.value))
                  : $t(e, Lt(t))
                : null != n
                ? $t(e, Lt(n))
                : null != r && e.removeAttribute('value'),
              null == a && null != o && (e.defaultChecked = !!o),
              null != a &&
                (e.checked = a && 'function' != typeof a && 'symbol' != typeof a),
              null != l &&
              'function' != typeof l &&
              'symbol' != typeof l &&
              'boolean' != typeof l
                ? (e.name = '' + Lt(l))
                : e.removeAttribute('name');
          }
          function Bt(e, t, n, r, a, o, i, l) {
            if (
              (null != o &&
                'function' != typeof o &&
                'symbol' != typeof o &&
                'boolean' != typeof o &&
                (e.type = o),
              null != t || null != n)
            ) {
              if (('submit' === o || 'reset' === o) && null == t) return void Ft(e);
              (n = null != n ? '' + Lt(n) : ''),
                (t = null != t ? '' + Lt(t) : n),
                l || t === e.value || (e.value = t),
                (e.defaultValue = t);
            }
            (r =
              'function' != typeof (r = null != r ? r : a) &&
              'symbol' != typeof r &&
              !!r),
              (e.checked = l ? e.checked : !!r),
              (e.defaultChecked = !!r),
              null != i &&
                'function' != typeof i &&
                'symbol' != typeof i &&
                'boolean' != typeof i &&
                (e.name = i),
              Ft(e);
          }
          function $t(e, t) {
            e.defaultValue !== '' + t && (e.defaultValue = '' + t);
          }
          function Ut(e, t, n, r) {
            if (((e = e.options), t)) {
              t = {};
              for (var a = 0; a < n.length; a++) t['$' + n[a]] = !0;
              for (n = 0; n < e.length; n++)
                (a = t.hasOwnProperty('$' + e[n].value)),
                  e[n].selected !== a && (e[n].selected = a),
                  a && r && (e[n].defaultSelected = !0);
            } else {
              for (n = '' + Lt(n), t = null, a = 0; a < e.length; a++) {
                if (e[a].value === n)
                  return (e[a].selected = !0), void (r && (e[a].defaultSelected = !0));
                null !== t || e[a].disabled || (t = e[a]);
              }
              null !== t && (t.selected = !0);
            }
          }
          function Ht(e, t, n) {
            null == t || ((t = '' + Lt(t)) !== e.value && (e.value = t), null != n)
              ? (e.defaultValue = null != n ? '' + Lt(n) : '')
              : e.defaultValue !== t && (e.defaultValue = t);
          }
          function Vt(e, t, n, r) {
            if (null == t) {
              if (null != r) {
                if (null != n) throw Error(o(92));
                if (Q(r)) {
                  if (1 < r.length) throw Error(o(93));
                  r = r[0];
                }
                n = r;
              }
              null == n && (n = ''), (t = n);
            }
            (n = Lt(t)),
              (e.defaultValue = n),
              (r = e.textContent) === n && '' !== r && null !== r && (e.value = r),
              Ft(e);
          }
          function Wt(e, t) {
            if (t) {
              var n = e.firstChild;
              if (n && n === e.lastChild && 3 === n.nodeType)
                return void (n.nodeValue = t);
            }
            e.textContent = t;
          }
          var Gt = new Set(
            'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
              ' ',
            ),
          );
          function qt(e, t, n) {
            var r = 0 === t.indexOf('--');
            null == n || 'boolean' == typeof n || '' === n
              ? r
                ? e.setProperty(t, '')
                : 'float' === t
                ? (e.cssFloat = '')
                : (e[t] = '')
              : r
              ? e.setProperty(t, n)
              : 'number' != typeof n || 0 === n || Gt.has(t)
              ? 'float' === t
                ? (e.cssFloat = n)
                : (e[t] = ('' + n).trim())
              : (e[t] = n + 'px');
          }
          function Yt(e, t, n) {
            if (null != t && 'object' != typeof t) throw Error(o(62));
            if (((e = e.style), null != n)) {
              for (var r in n)
                !n.hasOwnProperty(r) ||
                  (null != t && t.hasOwnProperty(r)) ||
                  (0 === r.indexOf('--')
                    ? e.setProperty(r, '')
                    : 'float' === r
                    ? (e.cssFloat = '')
                    : (e[r] = ''),
                  (Tt = !0));
              for (var a in t)
                (r = t[a]), t.hasOwnProperty(a) && n[a] !== r && (qt(e, a, r), (Tt = !0));
            } else for (var i in t) t.hasOwnProperty(i) && qt(e, i, t[i]);
          }
          function Kt(e) {
            if (-1 === e.indexOf('-')) return !1;
            switch (e) {
              case 'annotation-xml':
              case 'color-profile':
              case 'font-face':
              case 'font-face-src':
              case 'font-face-uri':
              case 'font-face-format':
              case 'font-face-name':
              case 'missing-glyph':
                return !1;
              default:
                return !0;
            }
          }
          var Qt = new Map([
              ['acceptCharset', 'accept-charset'],
              ['htmlFor', 'for'],
              ['httpEquiv', 'http-equiv'],
              ['crossOrigin', 'crossorigin'],
              ['accentHeight', 'accent-height'],
              ['alignmentBaseline', 'alignment-baseline'],
              ['arabicForm', 'arabic-form'],
              ['baselineShift', 'baseline-shift'],
              ['capHeight', 'cap-height'],
              ['clipPath', 'clip-path'],
              ['clipRule', 'clip-rule'],
              ['colorInterpolation', 'color-interpolation'],
              ['colorInterpolationFilters', 'color-interpolation-filters'],
              ['colorProfile', 'color-profile'],
              ['colorRendering', 'color-rendering'],
              ['dominantBaseline', 'dominant-baseline'],
              ['enableBackground', 'enable-background'],
              ['fillOpacity', 'fill-opacity'],
              ['fillRule', 'fill-rule'],
              ['floodColor', 'flood-color'],
              ['floodOpacity', 'flood-opacity'],
              ['fontFamily', 'font-family'],
              ['fontSize', 'font-size'],
              ['fontSizeAdjust', 'font-size-adjust'],
              ['fontStretch', 'font-stretch'],
              ['fontStyle', 'font-style'],
              ['fontVariant', 'font-variant'],
              ['fontWeight', 'font-weight'],
              ['glyphName', 'glyph-name'],
              ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
              ['glyphOrientationVertical', 'glyph-orientation-vertical'],
              ['horizAdvX', 'horiz-adv-x'],
              ['horizOriginX', 'horiz-origin-x'],
              ['imageRendering', 'image-rendering'],
              ['letterSpacing', 'letter-spacing'],
              ['lightingColor', 'lighting-color'],
              ['markerEnd', 'marker-end'],
              ['markerMid', 'marker-mid'],
              ['markerStart', 'marker-start'],
              ['maskType', 'mask-type'],
              ['overlinePosition', 'overline-position'],
              ['overlineThickness', 'overline-thickness'],
              ['paintOrder', 'paint-order'],
              ['panose-1', 'panose-1'],
              ['pointerEvents', 'pointer-events'],
              ['renderingIntent', 'rendering-intent'],
              ['shapeRendering', 'shape-rendering'],
              ['stopColor', 'stop-color'],
              ['stopOpacity', 'stop-opacity'],
              ['strikethroughPosition', 'strikethrough-position'],
              ['strikethroughThickness', 'strikethrough-thickness'],
              ['strokeDasharray', 'stroke-dasharray'],
              ['strokeDashoffset', 'stroke-dashoffset'],
              ['strokeLinecap', 'stroke-linecap'],
              ['strokeLinejoin', 'stroke-linejoin'],
              ['strokeMiterlimit', 'stroke-miterlimit'],
              ['strokeOpacity', 'stroke-opacity'],
              ['strokeWidth', 'stroke-width'],
              ['textAnchor', 'text-anchor'],
              ['textDecoration', 'text-decoration'],
              ['textRendering', 'text-rendering'],
              ['transformOrigin', 'transform-origin'],
              ['underlinePosition', 'underline-position'],
              ['underlineThickness', 'underline-thickness'],
              ['unicodeBidi', 'unicode-bidi'],
              ['unicodeRange', 'unicode-range'],
              ['unitsPerEm', 'units-per-em'],
              ['vAlphabetic', 'v-alphabetic'],
              ['vHanging', 'v-hanging'],
              ['vIdeographic', 'v-ideographic'],
              ['vMathematical', 'v-mathematical'],
              ['vectorEffect', 'vector-effect'],
              ['vertAdvY', 'vert-adv-y'],
              ['vertOriginX', 'vert-origin-x'],
              ['vertOriginY', 'vert-origin-y'],
              ['wordSpacing', 'word-spacing'],
              ['writingMode', 'writing-mode'],
              ['xmlnsXlink', 'xmlns:xlink'],
              ['xHeight', 'x-height'],
            ]),
            Zt =
              /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
          function Xt(e) {
            return Zt.test('' + e)
              ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
              : e;
          }
          function Jt() {}
          var en = null;
          function tn(e) {
            return (
              (e = e.target || e.srcElement || window).correspondingUseElement &&
                (e = e.correspondingUseElement),
              3 === e.nodeType ? e.parentNode : e
            );
          }
          var nn = null,
            rn = null;
          function an(e) {
            var t = ht(e);
            if (t && (e = t.stateNode)) {
              var n = e[it] || null;
              e: switch (((e = t.stateNode), t.type)) {
                case 'input':
                  if (
                    (Mt(
                      e,
                      n.value,
                      n.defaultValue,
                      n.defaultValue,
                      n.checked,
                      n.defaultChecked,
                      n.type,
                      n.name,
                    ),
                    (t = n.name),
                    'radio' === n.type && null != t)
                  ) {
                    for (n = e; n.parentNode; ) n = n.parentNode;
                    for (
                      n = n.querySelectorAll(
                        'input[name="' + zt('' + t) + '"][type="radio"]',
                      ),
                        t = 0;
                      t < n.length;
                      t++
                    ) {
                      var r = n[t];
                      if (r !== e && r.form === e.form) {
                        var a = r[it] || null;
                        if (!a) throw Error(o(90));
                        Mt(
                          r,
                          a.value,
                          a.defaultValue,
                          a.defaultValue,
                          a.checked,
                          a.defaultChecked,
                          a.type,
                          a.name,
                        );
                      }
                    }
                    for (t = 0; t < n.length; t++) (r = n[t]).form === e.form && Rt(r);
                  }
                  break e;
                case 'textarea':
                  Ht(e, n.value, n.defaultValue);
                  break e;
                case 'select':
                  null != (t = n.value) && Ut(e, !!n.multiple, t, !1);
              }
            }
          }
          var on = !1;
          function ln(e, t, n) {
            if (on) return e(t, n);
            on = !0;
            try {
              return e(t);
            } finally {
              if (
                ((on = !1),
                (null !== nn || null !== rn) &&
                  (vd(), nn && ((t = nn), (e = rn), (rn = nn = null), an(t), e)))
              )
                for (t = 0; t < e.length; t++) an(e[t]);
            }
          }
          function sn(e, t) {
            var n = e.stateNode;
            if (null === n) return null;
            var r = n[it] || null;
            if (null === r) return null;
            n = r[t];
            e: switch (t) {
              case 'onClick':
              case 'onClickCapture':
              case 'onDoubleClick':
              case 'onDoubleClickCapture':
              case 'onMouseDown':
              case 'onMouseDownCapture':
              case 'onMouseMove':
              case 'onMouseMoveCapture':
              case 'onMouseUp':
              case 'onMouseUpCapture':
              case 'onMouseEnter':
                (r = !r.disabled) ||
                  (r = !(
                    'button' === (e = e.type) ||
                    'input' === e ||
                    'select' === e ||
                    'textarea' === e
                  )),
                  (e = !r);
                break e;
              default:
                e = !1;
            }
            if (e) return null;
            if (n && 'function' != typeof n) throw Error(o(231, t, typeof n));
            return n;
          }
          var un = !(
              'undefined' == typeof window ||
              void 0 === window.document ||
              void 0 === window.document.createElement
            ),
            cn = !1;
          if (un)
            try {
              var dn = {};
              Object.defineProperty(dn, 'passive', {
                get: function () {
                  cn = !0;
                },
              }),
                window.addEventListener('test', dn, dn),
                window.removeEventListener('test', dn, dn);
            } catch (tm) {
              cn = !1;
            }
          var fn = null,
            pn = null,
            gn = null;
          function mn() {
            if (gn) return gn;
            var e,
              t,
              n = pn,
              r = n.length,
              a = 'value' in fn ? fn.value : fn.textContent,
              o = a.length;
            for (e = 0; e < r && n[e] === a[e]; e++);
            var i = r - e;
            for (t = 1; t <= i && n[r - t] === a[o - t]; t++);
            return (gn = a.slice(e, 1 < t ? 1 - t : void 0));
          }
          function hn(e) {
            var t = e.keyCode;
            return (
              'charCode' in e ? 0 === (e = e.charCode) && 13 === t && (e = 13) : (e = t),
              10 === e && (e = 13),
              32 <= e || 13 === e ? e : 0
            );
          }
          function yn() {
            return !0;
          }
          function vn() {
            return !1;
          }
          function bn(e) {
            function t(t, n, r, a, o) {
              for (var i in ((this._reactName = t),
              (this._targetInst = r),
              (this.type = n),
              (this.nativeEvent = a),
              (this.target = o),
              (this.currentTarget = null),
              e))
                e.hasOwnProperty(i) && ((t = e[i]), (this[i] = t ? t(a) : a[i]));
              return (
                (this.isDefaultPrevented = (
                  null != a.defaultPrevented ? a.defaultPrevented : !1 === a.returnValue
                )
                  ? yn
                  : vn),
                (this.isPropagationStopped = vn),
                this
              );
            }
            return (
              C(t.prototype, {
                preventDefault: function () {
                  this.defaultPrevented = !0;
                  var e = this.nativeEvent;
                  e &&
                    (e.preventDefault
                      ? e.preventDefault()
                      : 'unknown' != typeof e.returnValue && (e.returnValue = !1),
                    (this.isDefaultPrevented = yn));
                },
                stopPropagation: function () {
                  var e = this.nativeEvent;
                  e &&
                    (e.stopPropagation
                      ? e.stopPropagation()
                      : 'unknown' != typeof e.cancelBubble && (e.cancelBubble = !0),
                    (this.isPropagationStopped = yn));
                },
                persist: function () {},
                isPersistent: yn,
              }),
              t
            );
          }
          var wn,
            kn,
            Sn,
            xn = {
              eventPhase: 0,
              bubbles: 0,
              cancelable: 0,
              timeStamp: function (e) {
                return e.timeStamp || Date.now();
              },
              defaultPrevented: 0,
              isTrusted: 0,
            },
            En = bn(xn),
            _n = C({}, xn, { view: 0, detail: 0 }),
            An = bn(_n),
            Cn = C({}, _n, {
              screenX: 0,
              screenY: 0,
              clientX: 0,
              clientY: 0,
              pageX: 0,
              pageY: 0,
              ctrlKey: 0,
              shiftKey: 0,
              altKey: 0,
              metaKey: 0,
              getModifierState: zn,
              button: 0,
              buttons: 0,
              relatedTarget: function (e) {
                return void 0 === e.relatedTarget
                  ? e.fromElement === e.srcElement
                    ? e.toElement
                    : e.fromElement
                  : e.relatedTarget;
              },
              movementX: function (e) {
                return 'movementX' in e
                  ? e.movementX
                  : (e !== Sn &&
                      (Sn && 'mousemove' === e.type
                        ? ((wn = e.screenX - Sn.screenX), (kn = e.screenY - Sn.screenY))
                        : (kn = wn = 0),
                      (Sn = e)),
                    wn);
              },
              movementY: function (e) {
                return 'movementY' in e ? e.movementY : kn;
              },
            }),
            Tn = bn(Cn),
            Nn = bn(C({}, Cn, { dataTransfer: 0 })),
            On = bn(C({}, _n, { relatedTarget: 0 })),
            Pn = bn(C({}, xn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 })),
            jn = bn(
              C({}, xn, {
                clipboardData: function (e) {
                  return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
                },
              }),
            ),
            Ln = bn(C({}, xn, { data: 0 })),
            In = {
              Esc: 'Escape',
              Spacebar: ' ',
              Left: 'ArrowLeft',
              Up: 'ArrowUp',
              Right: 'ArrowRight',
              Down: 'ArrowDown',
              Del: 'Delete',
              Win: 'OS',
              Menu: 'ContextMenu',
              Apps: 'ContextMenu',
              Scroll: 'ScrollLock',
              MozPrintableKey: 'Unidentified',
            },
            Fn = {
              8: 'Backspace',
              9: 'Tab',
              12: 'Clear',
              13: 'Enter',
              16: 'Shift',
              17: 'Control',
              18: 'Alt',
              19: 'Pause',
              20: 'CapsLock',
              27: 'Escape',
              32: ' ',
              33: 'PageUp',
              34: 'PageDown',
              35: 'End',
              36: 'Home',
              37: 'ArrowLeft',
              38: 'ArrowUp',
              39: 'ArrowRight',
              40: 'ArrowDown',
              45: 'Insert',
              46: 'Delete',
              112: 'F1',
              113: 'F2',
              114: 'F3',
              115: 'F4',
              116: 'F5',
              117: 'F6',
              118: 'F7',
              119: 'F8',
              120: 'F9',
              121: 'F10',
              122: 'F11',
              123: 'F12',
              144: 'NumLock',
              145: 'ScrollLock',
              224: 'Meta',
            },
            Rn = {
              Alt: 'altKey',
              Control: 'ctrlKey',
              Meta: 'metaKey',
              Shift: 'shiftKey',
            };
          function Dn(e) {
            var t = this.nativeEvent;
            return t.getModifierState ? t.getModifierState(e) : !!(e = Rn[e]) && !!t[e];
          }
          function zn() {
            return Dn;
          }
          var Mn = bn(
              C({}, _n, {
                key: function (e) {
                  if (e.key) {
                    var t = In[e.key] || e.key;
                    if ('Unidentified' !== t) return t;
                  }
                  return 'keypress' === e.type
                    ? 13 === (e = hn(e))
                      ? 'Enter'
                      : String.fromCharCode(e)
                    : 'keydown' === e.type || 'keyup' === e.type
                    ? Fn[e.keyCode] || 'Unidentified'
                    : '';
                },
                code: 0,
                location: 0,
                ctrlKey: 0,
                shiftKey: 0,
                altKey: 0,
                metaKey: 0,
                repeat: 0,
                locale: 0,
                getModifierState: zn,
                charCode: function (e) {
                  return 'keypress' === e.type ? hn(e) : 0;
                },
                keyCode: function (e) {
                  return 'keydown' === e.type || 'keyup' === e.type ? e.keyCode : 0;
                },
                which: function (e) {
                  return 'keypress' === e.type
                    ? hn(e)
                    : 'keydown' === e.type || 'keyup' === e.type
                    ? e.keyCode
                    : 0;
                },
              }),
            ),
            Bn = bn(
              C({}, Cn, {
                pointerId: 0,
                width: 0,
                height: 0,
                pressure: 0,
                tangentialPressure: 0,
                tiltX: 0,
                tiltY: 0,
                twist: 0,
                pointerType: 0,
                isPrimary: 0,
              }),
            ),
            $n = bn(C({}, xn, { submitter: 0 })),
            Un = bn(
              C({}, _n, {
                touches: 0,
                targetTouches: 0,
                changedTouches: 0,
                altKey: 0,
                metaKey: 0,
                ctrlKey: 0,
                shiftKey: 0,
                getModifierState: zn,
              }),
            ),
            Hn = bn(C({}, xn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
            Vn = bn(
              C({}, Cn, {
                deltaX: function (e) {
                  return 'deltaX' in e
                    ? e.deltaX
                    : 'wheelDeltaX' in e
                    ? -e.wheelDeltaX
                    : 0;
                },
                deltaY: function (e) {
                  return 'deltaY' in e
                    ? e.deltaY
                    : 'wheelDeltaY' in e
                    ? -e.wheelDeltaY
                    : 'wheelDelta' in e
                    ? -e.wheelDelta
                    : 0;
                },
                deltaZ: 0,
                deltaMode: 0,
              }),
            ),
            Wn = bn(C({}, xn, { newState: 0, oldState: 0, source: 0 })),
            Gn = [9, 13, 27, 32],
            qn = un && 'CompositionEvent' in window,
            Yn = null;
          un && 'documentMode' in document && (Yn = document.documentMode);
          var Kn = un && 'TextEvent' in window && !Yn,
            Qn = un && (!qn || (Yn && 8 < Yn && 11 >= Yn)),
            Zn = String.fromCharCode(32),
            Xn = !1;
          function Jn(e, t) {
            switch (e) {
              case 'keyup':
                return -1 !== Gn.indexOf(t.keyCode);
              case 'keydown':
                return 229 !== t.keyCode;
              case 'keypress':
              case 'mousedown':
              case 'focusout':
                return !0;
              default:
                return !1;
            }
          }
          function er(e) {
            return 'object' == typeof (e = e.detail) && 'data' in e ? e.data : null;
          }
          var tr = !1;
          var nr = {
            color: !0,
            date: !0,
            datetime: !0,
            'datetime-local': !0,
            email: !0,
            month: !0,
            number: !0,
            password: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
          };
          function rr(e) {
            var t = e && e.nodeName && e.nodeName.toLowerCase();
            return 'input' === t ? !!nr[e.type] : 'textarea' === t;
          }
          function ar(e, t, n, r) {
            nn ? (rn ? rn.push(r) : (rn = [r])) : (nn = r),
              0 < (t = Ef(t, 'onChange')).length &&
                ((n = new En('onChange', 'change', null, n, r)),
                e.push({ event: n, listeners: t }));
          }
          var or = null,
            ir = null;
          function lr(e) {
            hf(e, 0);
          }
          function sr(e) {
            if (Rt(yt(e))) return e;
          }
          function ur(e, t) {
            if ('change' === e) return t;
          }
          var cr = !1;
          if (un) {
            var dr;
            if (un) {
              var fr = 'oninput' in document;
              if (!fr) {
                var pr = document.createElement('div');
                pr.setAttribute('oninput', 'return;'),
                  (fr = 'function' == typeof pr.oninput);
              }
              dr = fr;
            } else dr = !1;
            cr = dr && (!document.documentMode || 9 < document.documentMode);
          }
          function gr() {
            or && (or.detachEvent('onpropertychange', mr), (ir = or = null));
          }
          function mr(e) {
            if ('value' === e.propertyName && sr(ir)) {
              var t = [];
              ar(t, ir, e, tn(e)), ln(lr, t);
            }
          }
          function hr(e, t, n) {
            'focusin' === e
              ? (gr(), (ir = n), (or = t).attachEvent('onpropertychange', mr))
              : 'focusout' === e && gr();
          }
          function yr(e) {
            if ('selectionchange' === e || 'keyup' === e || 'keydown' === e)
              return sr(ir);
          }
          function vr(e, t) {
            if ('click' === e) return sr(t);
          }
          function br(e, t) {
            if ('input' === e || 'change' === e) return sr(t);
          }
          var wr =
            'function' == typeof Object.is
              ? Object.is
              : function (e, t) {
                  return (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t);
                };
          function kr(e, t) {
            if (wr(e, t)) return !0;
            if ('object' != typeof e || null === e || 'object' != typeof t || null === t)
              return !1;
            var n = Object.keys(e),
              r = Object.keys(t);
            if (n.length !== r.length) return !1;
            for (r = 0; r < n.length; r++) {
              var a = n[r];
              if (!we.call(t, a) || !wr(e[a], t[a])) return !1;
            }
            return !0;
          }
          function Sr(e) {
            if (
              void 0 === (e = e || ('undefined' != typeof document ? document : void 0))
            )
              return null;
            try {
              return e.activeElement || e.body;
            } catch (t) {
              return e.body;
            }
          }
          function xr(e) {
            for (; e && e.firstChild; ) e = e.firstChild;
            return e;
          }
          function Er(e, t) {
            var n,
              r = xr(e);
            for (e = 0; r; ) {
              if (3 === r.nodeType) {
                if (((n = e + r.textContent.length), e <= t && n >= t))
                  return { node: r, offset: t - e };
                e = n;
              }
              e: {
                for (; r; ) {
                  if (r.nextSibling) {
                    r = r.nextSibling;
                    break e;
                  }
                  r = r.parentNode;
                }
                r = void 0;
              }
              r = xr(r);
            }
          }
          function _r(e, t) {
            return (
              !(!e || !t) &&
              (e === t ||
                ((!e || 3 !== e.nodeType) &&
                  (t && 3 === t.nodeType
                    ? _r(e, t.parentNode)
                    : 'contains' in e
                    ? e.contains(t)
                    : !!e.compareDocumentPosition &&
                      !!(16 & e.compareDocumentPosition(t)))))
            );
          }
          function Ar(e) {
            for (
              var t = Sr(
                (e =
                  null != e &&
                  null != e.ownerDocument &&
                  null != e.ownerDocument.defaultView
                    ? e.ownerDocument.defaultView
                    : window).document,
              );
              t instanceof e.HTMLIFrameElement;

            ) {
              try {
                var n = 'string' == typeof t.contentWindow.location.href;
              } catch (r) {
                n = !1;
              }
              if (!n) break;
              t = Sr((e = t.contentWindow).document);
            }
            return t;
          }
          function Cr(e) {
            var t = e && e.nodeName && e.nodeName.toLowerCase();
            return (
              t &&
              (('input' === t &&
                ('text' === e.type ||
                  'search' === e.type ||
                  'tel' === e.type ||
                  'url' === e.type ||
                  'password' === e.type)) ||
                'textarea' === t ||
                'true' === e.contentEditable)
            );
          }
          var Tr = un && 'documentMode' in document && 11 >= document.documentMode,
            Nr = null,
            Or = null,
            Pr = null,
            jr = !1;
          function Lr(e, t, n) {
            var r = n.window === n ? n.document : 9 === n.nodeType ? n : n.ownerDocument;
            jr ||
              null == Nr ||
              Nr !== Sr(r) ||
              ('selectionStart' in (r = Nr) && Cr(r)
                ? (r = { start: r.selectionStart, end: r.selectionEnd })
                : (r = {
                    anchorNode: (r = (
                      (r.ownerDocument && r.ownerDocument.defaultView) ||
                      window
                    ).getSelection()).anchorNode,
                    anchorOffset: r.anchorOffset,
                    focusNode: r.focusNode,
                    focusOffset: r.focusOffset,
                  }),
              (Pr && kr(Pr, r)) ||
                ((Pr = r),
                0 < (r = Ef(Or, 'onSelect')).length &&
                  ((t = new En('onSelect', 'select', null, t, n)),
                  e.push({ event: t, listeners: r }),
                  (t.target = Nr))));
          }
          function Ir(e, t) {
            var n = {};
            return (
              (n[e.toLowerCase()] = t.toLowerCase()),
              (n['Webkit' + e] = 'webkit' + t),
              (n['Moz' + e] = 'moz' + t),
              n
            );
          }
          var Fr = {
              animationend: Ir('Animation', 'AnimationEnd'),
              animationiteration: Ir('Animation', 'AnimationIteration'),
              animationstart: Ir('Animation', 'AnimationStart'),
              transitionrun: Ir('Transition', 'TransitionRun'),
              transitionstart: Ir('Transition', 'TransitionStart'),
              transitioncancel: Ir('Transition', 'TransitionCancel'),
              transitionend: Ir('Transition', 'TransitionEnd'),
            },
            Rr = {},
            Dr = {};
          function zr(e) {
            if (Rr[e]) return Rr[e];
            if (!Fr[e]) return e;
            var t,
              n = Fr[e];
            for (t in n) if (n.hasOwnProperty(t) && t in Dr) return (Rr[e] = n[t]);
            return e;
          }
          un &&
            ((Dr = document.createElement('div').style),
            'AnimationEvent' in window ||
              (delete Fr.animationend.animation,
              delete Fr.animationiteration.animation,
              delete Fr.animationstart.animation),
            'TransitionEvent' in window || delete Fr.transitionend.transition);
          var Mr = zr('animationend'),
            Br = zr('animationiteration'),
            $r = zr('animationstart'),
            Ur = zr('transitionrun'),
            Hr = zr('transitionstart'),
            Vr = zr('transitioncancel'),
            Wr = zr('transitionend'),
            Gr = new Map(),
            qr =
              'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
                ' ',
              );
          function Yr(e, t) {
            Gr.set(e, t), xt(t, [e]);
          }
          qr.push('scrollEnd');
          var Kr = 0;
          function Qr(e, t) {
            return null != e.name && 'auto' !== e.name
              ? e.name
              : null !== t.autoName
              ? t.autoName
              : ((e = '_' + (e = Jc.identifierPrefix) + 't_' + (Kr++).toString(32) + '_'),
                (t.autoName = e));
          }
          function Zr(e) {
            if (null == e || 'string' == typeof e) return e;
            var t = null,
              n = ld;
            if (null !== n)
              for (var r = 0; r < n.length; r++) {
                var a = e[n[r]];
                if (null != a) {
                  if ('none' === a) return 'none';
                  t = null == t ? a : t + ' ' + a;
                }
              }
            return null == t ? e.default : t;
          }
          function Xr(e, t) {
            return (
              (e = Zr(e)),
              null == (t = Zr(t)) ? ('auto' === e ? null : e) : 'auto' === t ? null : t
            );
          }
          var Jr =
              'function' == typeof reportError
                ? reportError
                : function (e) {
                    if (
                      'object' == typeof window &&
                      'function' == typeof window.ErrorEvent
                    ) {
                      var t = new window.ErrorEvent('error', {
                        bubbles: !0,
                        cancelable: !0,
                        message:
                          'object' == typeof e &&
                          null !== e &&
                          'string' == typeof e.message
                            ? String(e.message)
                            : String(e),
                        error: e,
                      });
                      if (!window.dispatchEvent(t)) return;
                    } else if (
                      'object' == typeof process &&
                      'function' == typeof process.emit
                    )
                      return void process.emit('uncaughtException', e);
                    console.error(e);
                  },
            ea = [],
            ta = 0,
            na = 0;
          function ra() {
            for (var e = ta, t = (na = ta = 0); t < e; ) {
              var n = ea[t];
              ea[t++] = null;
              var r = ea[t];
              ea[t++] = null;
              var a = ea[t];
              ea[t++] = null;
              var o = ea[t];
              if (((ea[t++] = null), null !== r && null !== a)) {
                var i = r.pending;
                null === i ? (a.next = a) : ((a.next = i.next), (i.next = a)),
                  (r.pending = a);
              }
              0 !== o && la(n, a, o);
            }
          }
          function aa(e, t, n, r) {
            (ea[ta++] = e),
              (ea[ta++] = t),
              (ea[ta++] = n),
              (ea[ta++] = r),
              (na |= r),
              (e.lanes |= r),
              null !== (e = e.alternate) && (e.lanes |= r);
          }
          function oa(e, t, n, r) {
            return aa(e, t, n, r), sa(e);
          }
          function ia(e, t) {
            return aa(e, null, null, t), sa(e);
          }
          function la(e, t, n) {
            e.lanes |= n;
            var r = e.alternate;
            null !== r && (r.lanes |= n);
            for (var a = !1, o = e.return; null !== o; )
              (o.childLanes |= n),
                null !== (r = o.alternate) && (r.childLanes |= n),
                22 === o.tag &&
                  (null === (e = o.stateNode) || 1 & e._visibility || (a = !0)),
                (e = o),
                (o = o.return);
            return 3 === e.tag
              ? ((o = e.stateNode),
                a &&
                  null !== t &&
                  ((a = 31 - De(n)),
                  null === (r = (e = o.hiddenUpdates)[a]) ? (e[a] = [t]) : r.push(t),
                  (t.lane = 536870912 | n)),
                o)
              : null;
          }
          function sa(e) {
            if (50 < sd) throw ((sd = 0), (ud = null), Error(o(185)));
            for (var t = e.return; null !== t; ) t = (e = t).return;
            return 3 === e.tag ? e.stateNode : null;
          }
          var ua = {};
          function ca(e, t, n, r) {
            (this.tag = e),
              (this.key = n),
              (this.sibling =
                this.child =
                this.return =
                this.stateNode =
                this.type =
                this.elementType =
                  null),
              (this.index = 0),
              (this.refCleanup = this.ref = null),
              (this.pendingProps = t),
              (this.dependencies =
                this.memoizedState =
                this.updateQueue =
                this.memoizedProps =
                  null),
              (this.mode = r),
              (this.subtreeFlags = this.flags = 0),
              (this.deletions = null),
              (this.childLanes = this.lanes = 0),
              (this.alternate = null);
          }
          function da(e, t, n, r) {
            return new ca(e, t, n, r);
          }
          function fa(e) {
            return !(!(e = e.prototype) || !e.isReactComponent);
          }
          function pa(e, t) {
            var n = e.alternate;
            return (
              null === n
                ? (((n = da(e.tag, t, e.key, e.mode)).elementType = e.elementType),
                  (n.type = e.type),
                  (n.stateNode = e.stateNode),
                  (n.alternate = e),
                  (e.alternate = n))
                : ((n.pendingProps = t),
                  (n.type = e.type),
                  (n.flags = 0),
                  (n.subtreeFlags = 0),
                  (n.deletions = null)),
              (n.flags = 1206910976 & e.flags),
              (n.childLanes = e.childLanes),
              (n.lanes = e.lanes),
              (n.child = e.child),
              (n.memoizedProps = e.memoizedProps),
              (n.memoizedState = e.memoizedState),
              (n.updateQueue = e.updateQueue),
              (t = e.dependencies),
              (n.dependencies =
                null === t ? null : { lanes: t.lanes, firstContext: t.firstContext }),
              (n.sibling = e.sibling),
              (n.index = e.index),
              (n.ref = e.ref),
              (n.refCleanup = e.refCleanup),
              n
            );
          }
          function ga(e, t) {
            e.flags &= 1206910978;
            var n = e.alternate;
            return (
              null === n
                ? ((e.childLanes = 0),
                  (e.lanes = t),
                  (e.child = null),
                  (e.subtreeFlags = 0),
                  (e.memoizedProps = null),
                  (e.memoizedState = null),
                  (e.updateQueue = null),
                  (e.dependencies = null),
                  (e.stateNode = null))
                : ((e.childLanes = n.childLanes),
                  (e.lanes = n.lanes),
                  (e.child = n.child),
                  (e.subtreeFlags = 0),
                  (e.deletions = null),
                  (e.memoizedProps = n.memoizedProps),
                  (e.memoizedState = n.memoizedState),
                  (e.updateQueue = n.updateQueue),
                  (e.type = n.type),
                  (t = n.dependencies),
                  (e.dependencies =
                    null === t
                      ? null
                      : { lanes: t.lanes, firstContext: t.firstContext })),
              e
            );
          }
          function ma(e, t, n, r, a, i) {
            var l = 0;
            if ('function' == typeof (r = e)) fa(r) && (l = 1);
            else if ('string' == typeof r)
              l = (function (e, t, n) {
                if (1 === n || null != t.itemProp) return !1;
                switch (e) {
                  case 'meta':
                  case 'title':
                    return !0;
                  case 'style':
                    if (
                      'string' != typeof t.precedence ||
                      'string' != typeof t.href ||
                      '' === t.href
                    )
                      break;
                    return !0;
                  case 'link':
                    if (
                      'string' != typeof t.rel ||
                      'string' != typeof t.href ||
                      '' === t.href ||
                      t.onLoad ||
                      t.onError
                    )
                      break;
                    return (
                      'stylesheet' !== t.rel ||
                      ((e = t.disabled), 'string' == typeof t.precedence && null == e)
                    );
                  case 'script':
                    if (
                      t.async &&
                      'function' != typeof t.async &&
                      'symbol' != typeof t.async &&
                      !t.onLoad &&
                      !t.onError &&
                      t.src &&
                      'string' == typeof t.src
                    )
                      return !0;
                }
                return !1;
              })(e, n, le.current)
                ? 26
                : 'html' === e || 'head' === e || 'body' === e
                ? 27
                : 5;
            else
              e: switch (r) {
                case $:
                  return ((e = da(31, n, t, a)).elementType = $), (e.lanes = i), e;
                case P:
                  return ha(n.children, a, i, t);
                case j:
                  (l = 8), (a |= 24);
                  break;
                case L:
                  return ((e = da(12, n, t, 2 | a)).elementType = L), (e.lanes = i), e;
                case D:
                  return ((e = da(13, n, t, a)).elementType = D), (e.lanes = i), e;
                case z:
                  return ((e = da(19, n, t, a)).elementType = z), (e.lanes = i), e;
                case U:
                case V:
                  return (
                    ((e = da(30, n, t, (e = 32 | a))).elementType = V),
                    (e.lanes = i),
                    (e.stateNode = {
                      autoName: null,
                      paired: null,
                      clones: null,
                      ref: null,
                    }),
                    e
                  );
                default:
                  if ('object' == typeof r && null !== r)
                    switch (r.$$typeof) {
                      case F:
                        l = 10;
                        break e;
                      case I:
                        l = 9;
                        break e;
                      case R:
                        l = 11;
                        break e;
                      case M:
                        l = 14;
                        break e;
                      case B:
                        (l = 16), (r = null);
                        break e;
                    }
                  (l = 29),
                    (n = Error(o(130, null === e ? 'null' : typeof e, ''))),
                    (r = null);
              }
            return ((t = da(l, n, t, a)).elementType = e), (t.type = r), (t.lanes = i), t;
          }
          function ha(e, t, n, r) {
            return ((e = da(7, e, r, t)).lanes = n), e;
          }
          function ya(e, t, n) {
            return ((e = da(6, e, null, t)).lanes = n), e;
          }
          function va(e) {
            var t = da(18, null, null, 0);
            return (t.stateNode = e), t;
          }
          function ba(e, t, n) {
            return (
              ((t = da(4, null !== e.children ? e.children : [], e.key, t)).lanes = n),
              (t.stateNode = {
                containerInfo: e.containerInfo,
                pendingChildren: null,
                implementation: e.implementation,
              }),
              t
            );
          }
          var wa = new WeakMap();
          function ka(e, t) {
            if ('object' == typeof e && null !== e) {
              var n = wa.get(e);
              return void 0 !== n
                ? n
                : ((t = { value: e, source: t, stack: be(t) }), wa.set(e, t), t);
            }
            return { value: e, source: t, stack: be(t) };
          }
          var Sa = [],
            xa = 0,
            Ea = null,
            _a = 0,
            Aa = [],
            Ca = 0,
            Ta = null,
            Na = 1,
            Oa = '';
          function Pa(e, t) {
            (Sa[xa++] = _a), (Sa[xa++] = Ea), (Ea = e), (_a = t);
          }
          function ja(e, t, n) {
            (Aa[Ca++] = Na), (Aa[Ca++] = Oa), (Aa[Ca++] = Ta), (Ta = e);
            var r = Na;
            e = Oa;
            var a = 32 - De(r) - 1;
            (r &= ~(1 << a)), (n += 1);
            var o = 32 - De(t) + a;
            if (30 < o) {
              var i = a - (a % 5);
              (o = (r & ((1 << i) - 1)).toString(32)),
                (r >>= i),
                (a -= i),
                (Na = (1 << (32 - De(t) + a)) | (n << a) | r),
                (Oa = o + e);
            } else (Na = (1 << o) | (n << a) | r), (Oa = e);
          }
          function La(e) {
            null !== e.return && (Pa(e, 1), ja(e, 1, 0));
          }
          function Ia(e) {
            for (; e === Ea; )
              (Ea = Sa[--xa]), (Sa[xa] = null), (_a = Sa[--xa]), (Sa[xa] = null);
            for (; e === Ta; )
              (Ta = Aa[--Ca]),
                (Aa[Ca] = null),
                (Oa = Aa[--Ca]),
                (Aa[Ca] = null),
                (Na = Aa[--Ca]),
                (Aa[Ca] = null);
          }
          function Fa(e, t) {
            (Aa[Ca++] = Na),
              (Aa[Ca++] = Oa),
              (Aa[Ca++] = Ta),
              (Na = t.id),
              (Oa = t.overflow),
              (Ta = e);
          }
          var Ra = null,
            Da = null,
            za = !1,
            Ma = null,
            Ba = !1,
            $a = Error(o(519));
          function Ua(e) {
            throw (
              (Ya(
                ka(
                  Error(
                    o(
                      418,
                      1 < arguments.length && void 0 !== arguments[1] && arguments[1]
                        ? 'text'
                        : 'HTML',
                      '',
                    ),
                  ),
                  e,
                ),
              ),
              $a)
            );
          }
          function Ha(e) {
            var t = e.stateNode,
              n = e.type,
              r = e.memoizedProps;
            switch (((t[ot] = e), (t[it] = r), n)) {
              case 'dialog':
                yf('cancel', t), yf('close', t);
                break;
              case 'iframe':
              case 'object':
              case 'embed':
                yf('load', t);
                break;
              case 'video':
              case 'audio':
                for (n = 0; n < gf.length; n++) yf(gf[n], t);
                break;
              case 'source':
                yf('error', t);
                break;
              case 'img':
              case 'image':
              case 'link':
                yf('error', t), yf('load', t);
                break;
              case 'details':
                yf('toggle', t);
                break;
              case 'input':
                yf('invalid', t),
                  Bt(
                    t,
                    r.value,
                    r.defaultValue,
                    r.checked,
                    r.defaultChecked,
                    r.type,
                    r.name,
                    !0,
                  );
                break;
              case 'select':
                yf('invalid', t);
                break;
              case 'textarea':
                yf('invalid', t), Vt(t, r.value, r.defaultValue, r.children);
            }
            ('string' != typeof (n = r.children) &&
              'number' != typeof n &&
              'bigint' != typeof n) ||
            t.textContent === '' + n ||
            !0 === r.suppressHydrationWarning ||
            Of(t.textContent, n)
              ? (null != r.popover && (yf('beforetoggle', t), yf('toggle', t)),
                null != r.onScroll && yf('scroll', t),
                null != r.onScrollEnd && yf('scrollend', t),
                null != r.onClick && (t.onclick = Jt),
                (t = !0))
              : (t = !1),
              t || Ua(e, !0);
          }
          function Va(e) {
            for (Ra = e.return; Ra; )
              switch (Ra.tag) {
                case 5:
                case 31:
                case 13:
                  return void (Ba = !1);
                case 27:
                case 3:
                  return void (Ba = !0);
                default:
                  Ra = Ra.return;
              }
          }
          function Wa(e) {
            if (e !== Ra) return !1;
            if (!za) return Va(e), (za = !0), !1;
            var t,
              n = e.tag;
            if (
              ((t = 3 !== n && 27 !== n) &&
                ((t = 5 === n) &&
                  (t =
                    !('form' !== (t = e.type) && 'button' !== t) ||
                    Uf(e.type, e.memoizedProps)),
                (t = !t)),
              t && Da && Ua(e),
              Va(e),
              13 === n)
            ) {
              if (!(e = null !== (e = e.memoizedState) ? e.dehydrated : null))
                throw Error(o(317));
              Da = Lp(e);
            } else if (31 === n) {
              if (!(e = null !== (e = e.memoizedState) ? e.dehydrated : null))
                throw Error(o(317));
              Da = Lp(e);
            } else
              27 === n
                ? ((n = Da), Qf(e.type) ? ((e = jp), (jp = null), (Da = e)) : (Da = n))
                : (Da = Ra ? Pp(e.stateNode.nextSibling) : null);
            return !0;
          }
          function Ga() {
            (Da = Ra = null), (za = !1);
          }
          function qa() {
            var e = Ma;
            return (
              null !== e && (null === Wc ? (Wc = e) : Wc.push.apply(Wc, e), (Ma = null)),
              e
            );
          }
          function Ya(e) {
            null === Ma ? (Ma = [e]) : Ma.push(e);
          }
          var Ka = ne(null),
            Qa = null,
            Za = null;
          function Xa(e, t, n) {
            ae(Ka, t._currentValue), (t._currentValue = n);
          }
          function Ja(e) {
            (e._currentValue = Ka.current), re(Ka);
          }
          function eo(e, t, n) {
            for (; null !== e; ) {
              var r = e.alternate;
              if (
                ((e.childLanes & t) !== t
                  ? ((e.childLanes |= t), null !== r && (r.childLanes |= t))
                  : null !== r && (r.childLanes & t) !== t && (r.childLanes |= t),
                e === n)
              )
                break;
              e = e.return;
            }
          }
          function to(e, t, n, r) {
            var a = e.child;
            for (null !== a && (a.return = e); null !== a; ) {
              var i = a.dependencies;
              if (null !== i) {
                var l = a.child;
                i = i.firstContext;
                e: for (; null !== i; ) {
                  var s = i;
                  i = a;
                  for (var u = 0; u < t.length; u++)
                    if (s.context === t[u]) {
                      (i.lanes |= n),
                        null !== (s = i.alternate) && (s.lanes |= n),
                        eo(i.return, n, e),
                        r || (l = null);
                      break e;
                    }
                  i = s.next;
                }
              } else if (18 === a.tag) {
                if (null === (l = a.return)) throw Error(o(341));
                (l.lanes |= n),
                  null !== (i = l.alternate) && (i.lanes |= n),
                  eo(l, n, e),
                  (l = null);
              } else
                13 === a.tag &&
                null !== a.memoizedState &&
                null === a.memoizedState.dehydrated
                  ? ((a.lanes |= n),
                    null !== (l = a.alternate) && (l.lanes |= n),
                    eo(a.return, n, e),
                    (l = null !== (l = a.child) ? l.sibling : null))
                  : (l = a.child);
              if (null !== l) l.return = a;
              else
                for (l = a; null !== l; ) {
                  if (l === e) {
                    l = null;
                    break;
                  }
                  if (null !== (a = l.sibling)) {
                    (a.return = l.return), (l = a);
                    break;
                  }
                  l = l.return;
                }
              a = l;
            }
          }
          function no(e, t, n, r) {
            e = null;
            for (var a = t, i = !1; null !== a; ) {
              if (!i)
                if (524288 & a.flags) i = !0;
                else if (262144 & a.flags) break;
              if (10 === a.tag) {
                var l = a.alternate;
                if (null === l) throw Error(o(387));
                if (null !== (l = l.memoizedProps)) {
                  var s = a.type;
                  wr(a.pendingProps.value, l.value) ||
                    (null !== e ? e.push(s) : (e = [s]));
                }
              } else if (a === ce.current) {
                if (null === (l = a.alternate)) throw Error(o(387));
                l.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
                  (null !== e ? e.push(gg) : (e = [gg]));
              }
              a = a.return;
            }
            return null !== e && to(t, e, n, r), (t.flags |= 262144), null !== e;
          }
          function ro(e) {
            for (e = e.firstContext; null !== e; ) {
              if (!wr(e.context._currentValue, e.memoizedValue)) return !0;
              e = e.next;
            }
            return !1;
          }
          function ao(e) {
            (Qa = e),
              (Za = null),
              null !== (e = e.dependencies) && (e.firstContext = null);
          }
          function oo(e) {
            return lo(Qa, e);
          }
          function io(e, t) {
            return null === Qa && ao(e), lo(e, t);
          }
          function lo(e, t) {
            var n = t._currentValue;
            if (((t = { context: t, memoizedValue: n, next: null }), null === Za)) {
              if (null === e) throw Error(o(308));
              (Za = t),
                (e.dependencies = { lanes: 0, firstContext: t }),
                (e.flags |= 524288);
            } else Za = Za.next = t;
            return n;
          }
          var so =
              'undefined' != typeof AbortController
                ? AbortController
                : function () {
                    var e = [],
                      t = (this.signal = {
                        aborted: !1,
                        addEventListener: function (t, n) {
                          e.push(n);
                        },
                      });
                    this.abort = function () {
                      (t.aborted = !0),
                        e.forEach(function (e) {
                          return e();
                        });
                    };
                  },
            uo = n.unstable_scheduleCallback,
            co = n.unstable_NormalPriority,
            fo = {
              $$typeof: F,
              Consumer: null,
              Provider: null,
              _currentValue: null,
              _currentValue2: null,
              _threadCount: 0,
            };
          function po() {
            return { controller: new so(), data: new Map(), refCount: 0 };
          }
          function go(e) {
            e.refCount--,
              0 === e.refCount &&
                uo(co, function () {
                  e.controller.abort();
                });
          }
          function mo(e, t) {
            if (4194048 & e.pendingLanes) {
              var n = e.transitionTypes;
              for (null === n && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
                var r = t[e];
                -1 === n.indexOf(r) && n.push(r);
              }
            }
          }
          var ho = null;
          var yo = null,
            vo = 0,
            bo = 0,
            wo = null;
          function ko() {
            if (0 === --vo && ((ho = null), null !== yo)) {
              null !== wo && (wo.status = 'fulfilled');
              var e = yo;
              (yo = null), (bo = 0), (wo = null);
              for (var t = 0; t < e.length; t++) (0, e[t])();
            }
          }
          var So = Z.S;
          Z.S = function (e, t) {
            if (
              ((Yc = _e()),
              'object' == typeof t &&
                null !== t &&
                'function' == typeof t.then &&
                (function (e, t) {
                  if (null === yo) {
                    var n = (yo = []);
                    (vo = 0),
                      (bo = cf()),
                      (wo = {
                        status: 'pending',
                        value: void 0,
                        then: function (e) {
                          n.push(e);
                        },
                      });
                  }
                  vo++, t.then(ko, ko);
                })(0, t),
              null !== ho)
            )
              for (var n = Qd; null !== n; ) mo(n, ho), (n = n.next);
            if (null !== (n = e.types)) {
              for (var r = Qd; null !== r; ) mo(r, n), (r = r.next);
              if (0 !== bo) {
                null === (r = ho) && (r = ho = []);
                for (var a = 0; a < n.length; a++) {
                  var o = n[a];
                  -1 === r.indexOf(o) && r.push(o);
                }
              }
            }
            null !== So && So(e, t);
          };
          var xo = ne(null);
          function Eo() {
            var e = xo.current;
            return null !== e ? e : Nc.pooledCache;
          }
          function _o(e, t) {
            ae(xo, null === t ? xo.current : t.pool);
          }
          function Ao() {
            var e = Eo();
            return null === e ? null : { parent: fo._currentValue, pool: e };
          }
          var Co = Error(o(460)),
            To = Error(o(474)),
            No = Error(o(542)),
            Oo = { then: function () {} };
          function Po(e) {
            return 'fulfilled' === (e = e.status) || 'rejected' === e;
          }
          function jo(e, t, n) {
            switch (
              (void 0 === (n = e[n]) ? e.push(t) : n !== t && (t.then(Jt, Jt), (t = n)),
              t.status)
            ) {
              case 'fulfilled':
                return t.value;
              case 'rejected':
                if ((Ro((e = t.reason)), void 0 === e && !('reason' in t)))
                  throw Error(o(600));
                throw e;
              default:
                if ('string' == typeof t.status) t.then(Jt, Jt);
                else {
                  if (null !== (e = Nc) && 100 < e.shellSuspendCounter)
                    throw Error(o(482));
                  ((e = t).status = 'pending'),
                    e.then(
                      function (e) {
                        if ('pending' === t.status) {
                          var n = t;
                          (n.status = 'fulfilled'), (n.value = e);
                        }
                      },
                      function (e) {
                        if ('pending' === t.status) {
                          var n = t;
                          (n.status = 'rejected'), (n.reason = e);
                        }
                      },
                    );
                }
                switch (t.status) {
                  case 'fulfilled':
                    return t.value;
                  case 'rejected':
                    throw (Ro((e = t.reason)), e);
                }
                throw ((Io = t), Co);
            }
          }
          function Lo(e) {
            try {
              return (0, e._init)(e._payload);
            } catch (t) {
              if (null !== t && 'object' == typeof t && 'function' == typeof t.then)
                throw ((Io = t), Co);
              throw t;
            }
          }
          var Io = null;
          function Fo() {
            if (null === Io) throw Error(o(459));
            var e = Io;
            return (Io = null), e;
          }
          function Ro(e) {
            if (e === Co || e === No) throw Error(o(483));
          }
          var Do = null,
            zo = 0;
          function Mo(e) {
            var t = zo;
            return (zo += 1), null === Do && (Do = []), jo(Do, e, t);
          }
          function Bo(e, t) {
            (t = t.props.ref), (e.ref = void 0 !== t ? t : null);
          }
          function $o(e, t) {
            if (t.$$typeof === T) throw Error(o(525));
            throw (
              ((e = Object.prototype.toString.call(t)),
              Error(
                o(
                  31,
                  '[object Object]' === e
                    ? 'object with keys {' + Object.keys(t).join(', ') + '}'
                    : e,
                ),
              ))
            );
          }
          function Uo(e) {
            function t(t, n) {
              if (e) {
                var r = t.deletions;
                null === r ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
              }
            }
            function n(n, r) {
              if (!e) return null;
              for (; null !== r; ) t(n, r), (r = r.sibling);
              return null;
            }
            function r(e) {
              for (var t = new Map(); null !== e; )
                null === e.key ? t.set(e.index, e) : t.set(e.key, e), (e = e.sibling);
              return t;
            }
            function a(e, t) {
              return ((e = pa(e, t)).index = 0), (e.sibling = null), e;
            }
            function i(t, n, r) {
              return (
                (t.index = r),
                e
                  ? null !== (r = t.alternate)
                    ? (r = r.index) < n
                      ? ((t.flags |= 2), n)
                      : r
                    : ((t.flags |= 134217730), n)
                  : ((t.flags |= 1048576), n)
              );
            }
            function l(t) {
              return e && null === t.alternate && (t.flags |= 134217730), t;
            }
            function s(e, t, n, r) {
              return null === t || 6 !== t.tag
                ? (((t = ya(n, e.mode, r)).return = e), t)
                : (((t = a(t, n)).return = e), t);
            }
            function u(e, t, n, r) {
              var o = n.type;
              return o === P
                ? (Bo((e = d(e, t, n.props.children, r, n.key)), n), e)
                : null !== t &&
                  (t.elementType === o ||
                    ('object' == typeof o &&
                      null !== o &&
                      o.$$typeof === B &&
                      Lo(o) === t.type))
                ? (Bo((t = a(t, n.props)), n), (t.return = e), t)
                : (Bo((t = ma(n.type, n.key, n.props, null, e.mode, r)), n),
                  (t.return = e),
                  t);
            }
            function c(e, t, n, r) {
              return null === t ||
                4 !== t.tag ||
                t.stateNode.containerInfo !== n.containerInfo ||
                t.stateNode.implementation !== n.implementation
                ? (((t = ba(n, e.mode, r)).return = e), t)
                : (((t = a(t, n.children || [])).return = e), t);
            }
            function d(e, t, n, r, o) {
              return null === t || 7 !== t.tag
                ? (((t = ha(n, e.mode, r, o)).return = e), t)
                : (((t = a(t, n)).return = e), t);
            }
            function f(e, t, n) {
              if (
                ('string' == typeof t && '' !== t) ||
                'number' == typeof t ||
                'bigint' == typeof t
              )
                return ((t = ya('' + t, e.mode, n)).return = e), t;
              if ('object' == typeof t && null !== t) {
                switch (t.$$typeof) {
                  case N:
                    return (
                      Bo((n = ma(t.type, t.key, t.props, null, e.mode, n)), t),
                      (n.return = e),
                      n
                    );
                  case O:
                    return ((t = ba(t, e.mode, n)).return = e), t;
                  case B:
                    return f(e, (t = Lo(t)), n);
                }
                if (Q(t) || q(t)) return ((t = ha(t, e.mode, n, null)).return = e), t;
                if ('function' == typeof t.then) return f(e, Mo(t), n);
                if (t.$$typeof === F) return f(e, io(e, t), n);
                $o(e, t);
              }
              return null;
            }
            function p(e, t, n, r) {
              var a = null !== t ? t.key : null;
              if (
                ('string' == typeof n && '' !== n) ||
                'number' == typeof n ||
                'bigint' == typeof n
              )
                return null !== a ? null : s(e, t, '' + n, r);
              if ('object' == typeof n && null !== n) {
                switch (n.$$typeof) {
                  case N:
                    return n.key === a ? u(e, t, n, r) : null;
                  case O:
                    return n.key === a ? c(e, t, n, r) : null;
                  case B:
                    return p(e, t, (n = Lo(n)), r);
                }
                if (Q(n) || q(n)) return null !== a ? null : d(e, t, n, r, null);
                if ('function' == typeof n.then) return p(e, t, Mo(n), r);
                if (n.$$typeof === F) return p(e, t, io(e, n), r);
                $o(e, n);
              }
              return null;
            }
            function g(e, t, n, r, a) {
              if (
                ('string' == typeof r && '' !== r) ||
                'number' == typeof r ||
                'bigint' == typeof r
              )
                return s(t, (e = e.get(n) || null), '' + r, a);
              if ('object' == typeof r && null !== r) {
                switch (r.$$typeof) {
                  case N:
                    return u(t, (e = e.get(null === r.key ? n : r.key) || null), r, a);
                  case O:
                    return c(t, (e = e.get(null === r.key ? n : r.key) || null), r, a);
                  case B:
                    return g(e, t, n, (r = Lo(r)), a);
                }
                if (Q(r) || q(r)) return d(t, (e = e.get(n) || null), r, a, null);
                if ('function' == typeof r.then) return g(e, t, n, Mo(r), a);
                if (r.$$typeof === F) return g(e, t, n, io(t, r), a);
                $o(t, r);
              }
              return null;
            }
            function m(s, u, c, d) {
              if (
                ('object' == typeof c &&
                  null !== c &&
                  c.type === P &&
                  null === c.key &&
                  void 0 === c.props.ref &&
                  (c = c.props.children),
                'object' == typeof c && null !== c)
              ) {
                switch (c.$$typeof) {
                  case N:
                    e: {
                      for (var h = c.key; null !== u; ) {
                        if (u.key === h) {
                          if ((h = c.type) === P) {
                            if (7 === u.tag) {
                              n(s, u.sibling),
                                Bo((d = a(u, c.props.children)), c),
                                (d.return = s),
                                (s = d);
                              break e;
                            }
                          } else if (
                            u.elementType === h ||
                            ('object' == typeof h &&
                              null !== h &&
                              h.$$typeof === B &&
                              Lo(h) === u.type)
                          ) {
                            n(s, u.sibling),
                              Bo((d = a(u, c.props)), c),
                              (d.return = s),
                              (s = d);
                            break e;
                          }
                          n(s, u);
                          break;
                        }
                        t(s, u), (u = u.sibling);
                      }
                      c.type === P
                        ? (Bo((d = ha(c.props.children, s.mode, d, c.key)), c),
                          (d.return = s),
                          (s = d))
                        : (Bo((d = ma(c.type, c.key, c.props, null, s.mode, d)), c),
                          (d.return = s),
                          (s = d));
                    }
                    return l(s);
                  case O:
                    e: {
                      for (h = c.key; null !== u; ) {
                        if (u.key === h) {
                          if (
                            4 === u.tag &&
                            u.stateNode.containerInfo === c.containerInfo &&
                            u.stateNode.implementation === c.implementation
                          ) {
                            n(s, u.sibling),
                              ((d = a(u, c.children || [])).return = s),
                              (s = d);
                            break e;
                          }
                          n(s, u);
                          break;
                        }
                        t(s, u), (u = u.sibling);
                      }
                      ((d = ba(c, s.mode, d)).return = s), (s = d);
                    }
                    return l(s);
                  case B:
                    return m(s, u, (c = Lo(c)), d);
                }
                if (Q(c))
                  return (function (a, o, l, s) {
                    for (
                      var u = null, c = null, d = o, m = (o = 0), h = null;
                      null !== d && m < l.length;
                      m++
                    ) {
                      d.index > m ? ((h = d), (d = null)) : (h = d.sibling);
                      var y = p(a, d, l[m], s);
                      if (null === y) {
                        null === d && (d = h);
                        break;
                      }
                      e && d && null === y.alternate && t(a, d),
                        (o = i(y, o, m)),
                        null === c ? (u = y) : (c.sibling = y),
                        (c = y),
                        (d = h);
                    }
                    if (m === l.length) return n(a, d), za && Pa(a, m), u;
                    if (null === d) {
                      for (; m < l.length; m++)
                        null !== (d = f(a, l[m], s)) &&
                          ((o = i(d, o, m)),
                          null === c ? (u = d) : (c.sibling = d),
                          (c = d));
                      return za && Pa(a, m), u;
                    }
                    for (d = r(d); m < l.length; m++)
                      null !== (h = g(d, a, m, l[m], s)) &&
                        (e &&
                          null !== (y = h.alternate) &&
                          d.delete(null === y.key ? m : y.key),
                        (o = i(h, o, m)),
                        null === c ? (u = h) : (c.sibling = h),
                        (c = h));
                    return (
                      e &&
                        d.forEach(function (e) {
                          return t(a, e);
                        }),
                      za && Pa(a, m),
                      u
                    );
                  })(s, u, c, d);
                if (q(c)) {
                  if ('function' != typeof (h = q(c))) throw Error(o(150));
                  return (function (a, l, s, u) {
                    if (null == s) throw Error(o(151));
                    for (
                      var c = null, d = null, m = l, h = (l = 0), y = null, v = s.next();
                      null !== m && !v.done;
                      h++, v = s.next()
                    ) {
                      m.index > h ? ((y = m), (m = null)) : (y = m.sibling);
                      var b = p(a, m, v.value, u);
                      if (null === b) {
                        null === m && (m = y);
                        break;
                      }
                      e && m && null === b.alternate && t(a, m),
                        (l = i(b, l, h)),
                        null === d ? (c = b) : (d.sibling = b),
                        (d = b),
                        (m = y);
                    }
                    if (v.done) return n(a, m), za && Pa(a, h), c;
                    if (null === m) {
                      for (; !v.done; h++, v = s.next())
                        null !== (v = f(a, v.value, u)) &&
                          ((l = i(v, l, h)),
                          null === d ? (c = v) : (d.sibling = v),
                          (d = v));
                      return za && Pa(a, h), c;
                    }
                    for (m = r(m); !v.done; h++, v = s.next())
                      null !== (v = g(m, a, h, v.value, u)) &&
                        (e &&
                          null !== (y = v.alternate) &&
                          m.delete(null === y.key ? h : y.key),
                        (l = i(v, l, h)),
                        null === d ? (c = v) : (d.sibling = v),
                        (d = v));
                    return (
                      e &&
                        m.forEach(function (e) {
                          return t(a, e);
                        }),
                      za && Pa(a, h),
                      c
                    );
                  })(s, u, (c = h.call(c)), d);
                }
                if ('function' == typeof c.then) return m(s, u, Mo(c), d);
                if (c.$$typeof === F) return m(s, u, io(s, c), d);
                $o(s, c);
              }
              return ('string' == typeof c && '' !== c) ||
                'number' == typeof c ||
                'bigint' == typeof c
                ? ((c = '' + c),
                  null !== u && 6 === u.tag
                    ? (n(s, u.sibling), ((d = a(u, c)).return = s), (s = d))
                    : (n(s, u), ((d = ya(c, s.mode, d)).return = s), (s = d)),
                  l(s))
                : n(s, u);
            }
            return function (e, t, n, r) {
              try {
                zo = 0;
                var a = m(e, t, n, r);
                return (Do = null), a;
              } catch (i) {
                if (i === Co || i === No) throw i;
                var o = da(29, i, null, e.mode);
                return (o.lanes = r), (o.return = e), o;
              }
            };
          }
          var Ho = Uo(!0),
            Vo = Uo(!1),
            Wo = !1;
          function Go(e) {
            e.updateQueue = {
              baseState: e.memoizedState,
              firstBaseUpdate: null,
              lastBaseUpdate: null,
              shared: { pending: null, lanes: 0, hiddenCallbacks: null },
              callbacks: null,
            };
          }
          function qo(e, t) {
            (e = e.updateQueue),
              t.updateQueue === e &&
                (t.updateQueue = {
                  baseState: e.baseState,
                  firstBaseUpdate: e.firstBaseUpdate,
                  lastBaseUpdate: e.lastBaseUpdate,
                  shared: e.shared,
                  callbacks: null,
                });
          }
          function Yo(e) {
            return { lane: e, tag: 0, payload: null, callback: null, next: null };
          }
          function Ko(e, t, n) {
            var r = e.updateQueue;
            if (null === r) return null;
            if (((r = r.shared), 2 & Tc)) {
              var a = r.pending;
              return (
                null === a ? (t.next = t) : ((t.next = a.next), (a.next = t)),
                (r.pending = t),
                (t = sa(e)),
                la(e, null, n),
                t
              );
            }
            return aa(e, r, t, n), sa(e);
          }
          function Qo(e, t, n) {
            if (null !== (t = t.updateQueue) && ((t = t.shared), 4194048 & n)) {
              var r = t.lanes;
              (n |= r &= e.pendingLanes), (t.lanes = n), Xe(e, n);
            }
          }
          function Zo(e, t) {
            var n = e.updateQueue,
              r = e.alternate;
            if (null !== r && n === (r = r.updateQueue)) {
              var a = null,
                o = null;
              if (null !== (n = n.firstBaseUpdate)) {
                do {
                  var i = {
                    lane: n.lane,
                    tag: n.tag,
                    payload: n.payload,
                    callback: null,
                    next: null,
                  };
                  null === o ? (a = o = i) : (o = o.next = i), (n = n.next);
                } while (null !== n);
                null === o ? (a = o = t) : (o = o.next = t);
              } else a = o = t;
              return (
                (n = {
                  baseState: r.baseState,
                  firstBaseUpdate: a,
                  lastBaseUpdate: o,
                  shared: r.shared,
                  callbacks: r.callbacks,
                }),
                void (e.updateQueue = n)
              );
            }
            null === (e = n.lastBaseUpdate) ? (n.firstBaseUpdate = t) : (e.next = t),
              (n.lastBaseUpdate = t);
          }
          var Xo = !1;
          function Jo() {
            if (Xo) {
              if (null !== wo) throw wo;
            }
          }
          function ei(e, t, n, r) {
            Xo = !1;
            var a = e.updateQueue;
            Wo = !1;
            var o = a.firstBaseUpdate,
              i = a.lastBaseUpdate,
              l = a.shared.pending;
            if (null !== l) {
              a.shared.pending = null;
              var s = l,
                u = s.next;
              (s.next = null), null === i ? (o = u) : (i.next = u), (i = s);
              var c = e.alternate;
              null !== c &&
                (l = (c = c.updateQueue).lastBaseUpdate) !== i &&
                (null === l ? (c.firstBaseUpdate = u) : (l.next = u),
                (c.lastBaseUpdate = s));
            }
            if (null !== o) {
              var d = a.baseState;
              for (i = 0, c = u = s = null, l = o; ; ) {
                var f = -536870913 & l.lane,
                  p = f !== l.lane;
                if (p ? (Pc & f) === f : (r & f) === f) {
                  0 !== f && f === bo && (Xo = !0),
                    null !== c &&
                      (c = c.next =
                        {
                          lane: 0,
                          tag: l.tag,
                          payload: l.payload,
                          callback: null,
                          next: null,
                        });
                  e: {
                    var g = e,
                      m = l;
                    f = t;
                    var h = n;
                    switch (m.tag) {
                      case 1:
                        if ('function' == typeof (g = m.payload)) {
                          d = g.call(h, d, f);
                          break e;
                        }
                        d = g;
                        break e;
                      case 3:
                        g.flags = (-65537 & g.flags) | 128;
                      case 0:
                        if (
                          null ==
                          (f = 'function' == typeof (g = m.payload) ? g.call(h, d, f) : g)
                        )
                          break e;
                        d = C({}, d, f);
                        break e;
                      case 2:
                        Wo = !0;
                    }
                  }
                  null !== (f = l.callback) &&
                    ((e.flags |= 64),
                    p && (e.flags |= 8192),
                    null === (p = a.callbacks) ? (a.callbacks = [f]) : p.push(f));
                } else
                  (p = {
                    lane: f,
                    tag: l.tag,
                    payload: l.payload,
                    callback: l.callback,
                    next: null,
                  }),
                    null === c ? ((u = c = p), (s = d)) : (c = c.next = p),
                    (i |= f);
                if (null === (l = l.next)) {
                  if (null === (l = a.shared.pending)) break;
                  (l = (p = l).next),
                    (p.next = null),
                    (a.lastBaseUpdate = p),
                    (a.shared.pending = null);
                }
              }
              null === c && (s = d),
                (a.baseState = s),
                (a.firstBaseUpdate = u),
                (a.lastBaseUpdate = c),
                null === o && (a.shared.lanes = 0),
                (Mc |= i),
                (e.lanes = i),
                (e.memoizedState = d);
            }
          }
          function ti(e, t) {
            if ('function' != typeof e) throw Error(o(191, e));
            e.call(t);
          }
          function ni(e, t) {
            var n = e.callbacks;
            if (null !== n)
              for (e.callbacks = null, e = 0; e < n.length; e++) ti(n[e], t);
          }
          var ri = ne(null),
            ai = ne(0);
          function oi(e, t) {
            ae(ai, (e = Dc)), ae(ri, t), (Dc = e | t.baseLanes);
          }
          function ii() {
            ae(ai, Dc), ae(ri, ri.current);
          }
          function li() {
            (Dc = ai.current), re(ri), re(ai);
          }
          var si = ne(null),
            ui = null;
          function ci(e) {
            var t = e.alternate;
            ae(mi, 1 & mi.current),
              ae(si, e),
              null === ui &&
                (null === t || null !== ri.current || null !== t.memoizedState) &&
                (ui = e);
          }
          function di(e) {
            ae(mi, mi.current), ae(si, e), null === ui && (ui = e);
          }
          function fi(e) {
            22 === e.tag
              ? (ae(mi, mi.current), ae(si, e), null === ui && (ui = e))
              : pi();
          }
          function pi() {
            ae(mi, mi.current), ae(si, si.current);
          }
          function gi(e) {
            re(si), ui === e && (ui = null), re(mi);
          }
          var mi = ne(0);
          function hi(e, t) {
            ae(si, si.current), ae(mi, t);
          }
          function yi(e) {
            re(mi), re(si), ui === e && (ui = null);
          }
          function vi(e) {
            for (var t = e; null !== t; ) {
              if (13 === t.tag) {
                var n = t.memoizedState;
                if (null !== n && (null === (n = n.dehydrated) || Np(n) || Op(n)))
                  return t;
              } else if (19 === t.tag && 'independent' !== t.memoizedProps.revealOrder) {
                if (128 & t.flags) return t;
              } else if (null !== t.child) {
                (t.child.return = t), (t = t.child);
                continue;
              }
              if (t === e) break;
              for (; null === t.sibling; ) {
                if (null === t.return || t.return === e) return null;
                t = t.return;
              }
              (t.sibling.return = t.return), (t = t.sibling);
            }
            return null;
          }
          var bi = 0,
            wi = null,
            ki = null,
            Si = null,
            xi = !1,
            Ei = !1,
            _i = !1,
            Ai = 0,
            Ci = 0,
            Ti = null,
            Ni = 0;
          function Oi() {
            throw Error(o(321));
          }
          function Pi(e, t) {
            if (null === t) return !1;
            for (var n = 0; n < t.length && n < e.length; n++)
              if (!wr(e[n], t[n])) return !1;
            return !0;
          }
          function ji(e, t, n, r, a, o) {
            return (
              (bi = o),
              (wi = t),
              (t.memoizedState = null),
              (t.updateQueue = null),
              (t.lanes = 0),
              (Z.H = null === e || null === e.memoizedState ? ql : Yl),
              (_i = !1),
              (o = n(r, a)),
              (_i = !1),
              Ei && (o = Ii(t, n, r, a)),
              Li(e),
              o
            );
          }
          function Li(e) {
            Z.H = Gl;
            var t = null !== ki && null !== ki.next;
            if (((bi = 0), (Si = ki = wi = null), (xi = !1), (Ci = 0), (Ti = null), t))
              throw Error(o(300));
            null === e || cs || (null !== (e = e.dependencies) && ro(e) && (cs = !0));
          }
          function Ii(e, t, n, r) {
            wi = e;
            var a = 0;
            do {
              if ((Ei && (Ti = null), (Ci = 0), (Ei = !1), 25 <= a)) throw Error(o(301));
              if (((a += 1), (Si = ki = null), null != e.updateQueue)) {
                var i = e.updateQueue;
                (i.lastEffect = null),
                  (i.events = null),
                  (i.stores = null),
                  null != i.memoCache && (i.memoCache.index = 0);
              }
              (Z.H = Kl), (i = t(n, r));
            } while (Ei);
            return i;
          }
          function Fi() {
            var e = Z.H,
              t = e.useState()[0];
            return (
              (t = 'function' == typeof t.then ? $i(t) : t),
              (e = e.useState()[0]),
              (null !== ki ? ki.memoizedState : null) !== e && (wi.flags |= 1024),
              t
            );
          }
          function Ri() {
            var e = 0 !== Ai;
            return (Ai = 0), e;
          }
          function Di(e, t, n) {
            (t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n);
          }
          function zi(e) {
            if (xi) {
              for (e = e.memoizedState; null !== e; ) {
                var t = e.queue;
                null !== t && (t.pending = null), (e = e.next);
              }
              xi = !1;
            }
            (bi = 0), (Si = ki = wi = null), (Ei = !1), (Ci = Ai = 0), (Ti = null);
          }
          function Mi() {
            var e = {
              memoizedState: null,
              baseState: null,
              baseQueue: null,
              queue: null,
              next: null,
            };
            return null === Si ? (wi.memoizedState = Si = e) : (Si = Si.next = e), Si;
          }
          function Bi() {
            if (null === ki) {
              var e = wi.alternate;
              e = null !== e ? e.memoizedState : null;
            } else e = ki.next;
            var t = null === Si ? wi.memoizedState : Si.next;
            if (null !== t) (Si = t), (ki = e);
            else {
              if (null === e) {
                if (null === wi.alternate) throw Error(o(467));
                throw Error(o(310));
              }
              (e = {
                memoizedState: (ki = e).memoizedState,
                baseState: ki.baseState,
                baseQueue: ki.baseQueue,
                queue: ki.queue,
                next: null,
              }),
                null === Si ? (wi.memoizedState = Si = e) : (Si = Si.next = e);
            }
            return Si;
          }
          function $i(e) {
            var t = Ci;
            return (
              (Ci += 1),
              null === Ti && (Ti = []),
              (e = jo(Ti, e, t)),
              (t = wi),
              null === (null === Si ? t.memoizedState : Si.next) &&
                ((t = t.alternate),
                (Z.H = null === t || null === t.memoizedState ? ql : Yl)),
              e
            );
          }
          function Ui(e) {
            if (null !== e && 'object' == typeof e) {
              if ('function' == typeof e.then) return $i(e);
              if (e.$$typeof === W) return;
              if (e.$$typeof === F) return oo(e);
            }
            throw Error(o(438, String(e)));
          }
          function Hi(e) {
            var t = null,
              n = wi.updateQueue;
            if ((null !== n && (t = n.memoCache), null == t)) {
              var r = wi.alternate;
              null !== r &&
                null !== (r = r.updateQueue) &&
                null != (r = r.memoCache) &&
                (t = {
                  data: r.data.map(function (e) {
                    return e.slice();
                  }),
                  index: 0,
                });
            }
            if (
              (null == t && (t = { data: [], index: 0 }),
              null === n &&
                ((n = { lastEffect: null, events: null, stores: null, memoCache: null }),
                (wi.updateQueue = n)),
              (n.memoCache = t),
              void 0 === (n = t.data[t.index]))
            )
              for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = H;
            return t.index++, n;
          }
          function Vi(e, t) {
            return 'function' == typeof t ? t(e) : t;
          }
          function Wi(e) {
            return Gi(Bi(), ki, e);
          }
          function Gi(e, t, n) {
            var r = e.queue;
            if (null === r) throw Error(o(311));
            r.lastRenderedReducer = n;
            var a = e.baseQueue,
              i = r.pending;
            if (null !== i) {
              if (null !== a) {
                var l = a.next;
                (a.next = i.next), (i.next = l);
              }
              (t.baseQueue = a = i), (r.pending = null);
            }
            if (((i = e.baseState), null === a)) e.memoizedState = i;
            else {
              var s = (l = null),
                u = null,
                c = (t = a.next),
                d = !1;
              do {
                var f = -536870913 & c.lane;
                if (f !== c.lane ? (Pc & f) === f : (bi & f) === f) {
                  var p = c.revertLane;
                  if (0 === p)
                    null !== u &&
                      (u = u.next =
                        {
                          lane: 0,
                          revertLane: 0,
                          gesture: null,
                          action: c.action,
                          hasEagerState: c.hasEagerState,
                          eagerState: c.eagerState,
                          next: null,
                        }),
                      f === bo && (d = !0);
                  else {
                    if ((bi & p) === p) {
                      (c = c.next), p === bo && (d = !0);
                      continue;
                    }
                    (f = {
                      lane: 0,
                      revertLane: c.revertLane,
                      gesture: null,
                      action: c.action,
                      hasEagerState: c.hasEagerState,
                      eagerState: c.eagerState,
                      next: null,
                    }),
                      null === u ? ((s = u = f), (l = i)) : (u = u.next = f),
                      (wi.lanes |= p),
                      (Mc |= p);
                  }
                  (f = c.action),
                    _i && n(i, f),
                    (i = c.hasEagerState ? c.eagerState : n(i, f));
                } else
                  (p = {
                    lane: f,
                    revertLane: c.revertLane,
                    gesture: c.gesture,
                    action: c.action,
                    hasEagerState: c.hasEagerState,
                    eagerState: c.eagerState,
                    next: null,
                  }),
                    null === u ? ((s = u = p), (l = i)) : (u = u.next = p),
                    (wi.lanes |= f),
                    (Mc |= f);
                c = c.next;
              } while (null !== c && c !== t);
              if (
                (null === u ? (l = i) : (u.next = s),
                !wr(i, e.memoizedState) && ((cs = !0), d && null !== (n = wo)))
              )
                throw n;
              (e.memoizedState = i),
                (e.baseState = l),
                (e.baseQueue = u),
                (r.lastRenderedState = i);
            }
            return null === a && (r.lanes = 0), [e.memoizedState, r.dispatch];
          }
          function qi(e) {
            var t = Bi(),
              n = t.queue;
            if (null === n) throw Error(o(311));
            n.lastRenderedReducer = e;
            var r = n.dispatch,
              a = n.pending,
              i = t.memoizedState;
            if (null !== a) {
              n.pending = null;
              var l = (a = a.next);
              do {
                (i = e(i, l.action)), (l = l.next);
              } while (l !== a);
              wr(i, t.memoizedState) || (cs = !0),
                (t.memoizedState = i),
                null === t.baseQueue && (t.baseState = i),
                (n.lastRenderedState = i);
            }
            return [i, r];
          }
          function Yi(e, t, n) {
            var r = wi,
              a = Bi(),
              i = za;
            if (i) {
              if (void 0 === n) throw Error(o(407));
              n = n();
            } else n = t();
            var l = !wr((ki || a).memoizedState, n);
            if (
              (l && ((a.memoizedState = n), (cs = !0)),
              (a = a.queue),
              bl(Zi.bind(null, r, a, e), [e]),
              gl(
                (e =
                  a.getSnapshot !== t ||
                  l ||
                  (null !== Si && !!(1 & Si.memoizedState.tag)))
                  ? 9
                  : 8,
                { destroy: void 0 },
                Qi.bind(null, r, a, n, t),
                null,
              ),
              e)
            ) {
              if (((r.flags |= 2048), null === Nc)) throw Error(o(349));
              i || 127 & bi || Ki(r, t, n);
            }
            return n;
          }
          function Ki(e, t, n) {
            (e.flags |= 16384),
              (e = { getSnapshot: t, value: n }),
              null === (t = wi.updateQueue)
                ? ((t = {
                    lastEffect: null,
                    events: null,
                    stores: null,
                    memoCache: null,
                  }),
                  (wi.updateQueue = t),
                  (t.stores = [e]))
                : null === (n = t.stores)
                ? (t.stores = [e])
                : n.push(e);
          }
          function Qi(e, t, n, r) {
            (t.value = n), (t.getSnapshot = r), Xi(t) && Ji(e);
          }
          function Zi(e, t, n) {
            return n(function () {
              Xi(t) && Ji(e);
            });
          }
          function Xi(e) {
            var t = e.getSnapshot;
            e = e.value;
            try {
              var n = t();
              return !wr(e, n);
            } catch (r) {
              return !0;
            }
          }
          function Ji(e) {
            var t = ia(e, 2);
            null !== t && pd(t, e, 2);
          }
          function el(e) {
            var t = Mi();
            if ('function' == typeof e) {
              var n = e;
              if (((e = n()), _i)) {
                Re(!0);
                try {
                  n();
                } finally {
                  Re(!1);
                }
              }
            }
            return (
              (t.memoizedState = t.baseState = e),
              (t.queue = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: Vi,
                lastRenderedState: e,
              }),
              t
            );
          }
          function tl(e, t, n, r) {
            return (e.baseState = n), Gi(e, ki, 'function' == typeof r ? r : Vi);
          }
          function nl(e, t, n, r, a) {
            if (Hl(e)) throw Error(o(485));
            if (null !== (e = t.action)) {
              var i = {
                payload: a,
                action: e,
                next: null,
                isTransition: !0,
                status: 'pending',
                value: null,
                reason: null,
                listeners: [],
                then: function (e) {
                  i.listeners.push(e);
                },
              };
              null !== Z.T ? n(!0) : (i.isTransition = !1),
                r(i),
                null === (n = t.pending)
                  ? ((i.next = t.pending = i), rl(t, i))
                  : ((i.next = n.next), (t.pending = n.next = i));
            }
          }
          function rl(e, t) {
            var n = t.action,
              r = t.payload,
              a = e.state;
            if (t.isTransition) {
              var o = Z.T,
                i = {};
              (i.types = null !== o ? o.types : null), (Z.T = i);
              try {
                var l = n(a, r),
                  s = Z.S;
                null !== s && s(i, l), al(e, t, l);
              } catch (u) {
                il(e, t, u);
              } finally {
                null !== o && null !== i.types && (o.types = i.types), (Z.T = o);
              }
            } else
              try {
                al(e, t, (o = n(a, r)));
              } catch (c) {
                il(e, t, c);
              }
          }
          function al(e, t, n) {
            null !== n && 'object' == typeof n && 'function' == typeof n.then
              ? n.then(
                  function (n) {
                    ol(e, t, n);
                  },
                  function (n) {
                    return il(e, t, n);
                  },
                )
              : ol(e, t, n);
          }
          function ol(e, t, n) {
            (t.status = 'fulfilled'),
              (t.value = n),
              ll(t),
              (e.state = n),
              null !== (t = e.pending) &&
                ((n = t.next) === t
                  ? (e.pending = null)
                  : ((n = n.next), (t.next = n), rl(e, n)));
          }
          function il(e, t, n) {
            var r = e.pending;
            if (((e.pending = null), null !== r)) {
              r = r.next;
              do {
                (t.status = 'rejected'), (t.reason = n), ll(t), (t = t.next);
              } while (t !== r);
            }
            e.action = null;
          }
          function ll(e) {
            e = e.listeners;
            for (var t = 0; t < e.length; t++) (0, e[t])();
          }
          function sl(e, t) {
            return t;
          }
          function ul(e, t) {
            if (za) {
              var n = Nc.formState;
              if (null !== n) {
                e: {
                  var r = wi;
                  if (za) {
                    if (Da) {
                      t: {
                        for (var a = Da, o = Ba; 8 !== a.nodeType; ) {
                          if (!o) {
                            a = null;
                            break t;
                          }
                          if (null === (a = Pp(a.nextSibling))) {
                            a = null;
                            break t;
                          }
                        }
                        a = 'F!' === (o = a.data) || 'F' === o ? a : null;
                      }
                      if (a) {
                        (Da = Pp(a.nextSibling)), (r = 'F!' === a.data);
                        break e;
                      }
                    }
                    Ua(r);
                  }
                  r = !1;
                }
                r && (t = n[0]);
              }
            }
            return (
              ((n = Mi()).memoizedState = n.baseState = t),
              (r = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: sl,
                lastRenderedState: t,
              }),
              (n.queue = r),
              (n = Bl.bind(null, wi, r)),
              (r.dispatch = n),
              (r = el(!1)),
              (o = Ul.bind(null, wi, !1, r.queue)),
              (a = { state: t, dispatch: null, action: e, pending: null }),
              ((r = Mi()).queue = a),
              (n = nl.bind(null, wi, a, o, n)),
              (a.dispatch = n),
              (r.memoizedState = e),
              [t, n, !1]
            );
          }
          function cl(e) {
            return dl(Bi(), ki, e);
          }
          function dl(e, t, n) {
            if (
              ((t = Gi(e, t, sl)[0]),
              (e = Wi(Vi)[0]),
              'object' == typeof t && null !== t && 'function' == typeof t.then)
            )
              try {
                var r = $i(t);
              } catch (i) {
                if (i === Co) throw No;
                throw i;
              }
            else r = t;
            var a = (t = Bi()).queue,
              o = a.dispatch;
            return (
              n !== t.memoizedState &&
                ((wi.flags |= 2048),
                gl(9, { destroy: void 0 }, fl.bind(null, a, n), null)),
              [r, o, e]
            );
          }
          function fl(e, t) {
            e.action = t;
          }
          function pl(e) {
            var t = Bi(),
              n = ki;
            if (null !== n) return dl(t, n, e);
            Bi(), (t = t.memoizedState);
            var r = (n = Bi()).queue.dispatch;
            return (n.memoizedState = e), [t, r, !1];
          }
          function gl(e, t, n, r) {
            return (
              (e = { tag: e, create: n, deps: r, inst: t, next: null }),
              null === (t = wi.updateQueue) &&
                ((t = { lastEffect: null, events: null, stores: null, memoCache: null }),
                (wi.updateQueue = t)),
              null === (n = t.lastEffect)
                ? (t.lastEffect = e.next = e)
                : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
              e
            );
          }
          function ml() {
            return Bi().memoizedState;
          }
          function hl(e, t, n, r) {
            var a = Mi();
            (wi.flags |= e),
              (a.memoizedState = gl(
                1 | t,
                { destroy: void 0 },
                n,
                void 0 === r ? null : r,
              ));
          }
          function yl(e, t, n, r) {
            var a = Bi();
            r = void 0 === r ? null : r;
            var o = a.memoizedState.inst;
            null !== ki && null !== r && Pi(r, ki.memoizedState.deps)
              ? (a.memoizedState = gl(t, o, n, r))
              : ((wi.flags |= e), (a.memoizedState = gl(1 | t, o, n, r)));
          }
          function vl(e, t) {
            hl(8390656, 8, e, t);
          }
          function bl(e, t) {
            yl(2048, 8, e, t);
          }
          function wl(e) {
            var t = Bi().memoizedState;
            return (
              (function (e) {
                wi.flags |= 4;
                var t = wi.updateQueue;
                if (null === t)
                  (t = { lastEffect: null, events: null, stores: null, memoCache: null }),
                    (wi.updateQueue = t),
                    (t.events = [e]);
                else {
                  var n = t.events;
                  null === n ? (t.events = [e]) : n.push(e);
                }
              })({ ref: t, nextImpl: e }),
              function () {
                if (2 & Tc) throw Error(o(440));
                return t.impl.apply(void 0, arguments);
              }
            );
          }
          function kl(e, t) {
            return yl(4, 2, e, t);
          }
          function Sl(e, t) {
            return yl(4, 4, e, t);
          }
          function xl(e, t) {
            if ('function' == typeof t) {
              e = e();
              var n = t(e);
              return function () {
                'function' == typeof n ? n() : t(null);
              };
            }
            if (null != t)
              return (
                (e = e()),
                (t.current = e),
                function () {
                  t.current = null;
                }
              );
          }
          function El(e, t, n) {
            (n = null != n ? n.concat([e]) : null), yl(4, 4, xl.bind(null, t, e), n);
          }
          function _l() {}
          function Al(e, t) {
            var n = Bi();
            t = void 0 === t ? null : t;
            var r = n.memoizedState;
            return null !== t && Pi(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
          }
          function Cl(e, t) {
            var n = Bi();
            t = void 0 === t ? null : t;
            var r = n.memoizedState;
            if (null !== t && Pi(t, r[1])) return r[0];
            if (((r = e()), _i)) {
              Re(!0);
              try {
                e();
              } finally {
                Re(!1);
              }
            }
            return (n.memoizedState = [r, t]), r;
          }
          function Tl(e, t, n) {
            return void 0 === n || (1073741824 & bi && !(261930 & Pc))
              ? (e.memoizedState = t)
              : ((e.memoizedState = n), (e = dd()), (wi.lanes |= e), (Mc |= e), n);
          }
          function Nl(e, t, n, r) {
            return wr(n, t)
              ? n
              : null !== ri.current
              ? ((e = Tl(e, n, r)), wr(e, t) || (cs = !0), e)
              : 106 & bi && (!(1073741824 & bi) || 261930 & Pc)
              ? ((e = dd()), (wi.lanes |= e), (Mc |= e), t)
              : ((cs = !0), (e.memoizedState = n));
          }
          function Ol(e, t, n, r, a) {
            var o = X.p;
            X.p = 0 !== o && 8 > o ? o : 8;
            var i,
              l,
              s,
              u = Z.T,
              c = {};
            (c.types = null !== u ? u.types : null), (Z.T = c), Ul(e, !1, t, n);
            try {
              var d = a(),
                f = Z.S;
              if (
                (null !== f && f(c, d),
                null !== d && 'object' == typeof d && 'function' == typeof d.then)
              )
                $l(
                  e,
                  t,
                  ((i = r),
                  (l = []),
                  (s = {
                    status: 'pending',
                    value: null,
                    reason: null,
                    then: function (e) {
                      l.push(e);
                    },
                  }),
                  d.then(
                    function () {
                      (s.status = 'fulfilled'), (s.value = i);
                      for (var e = 0; e < l.length; e++) (0, l[e])(i);
                    },
                    function (e) {
                      for (s.status = 'rejected', s.reason = e, e = 0; e < l.length; e++)
                        (0, l[e])(void 0);
                    },
                  ),
                  s),
                  cd(),
                );
              else $l(e, t, r, cd());
            } catch (p) {
              $l(e, t, { then: function () {}, status: 'rejected', reason: p }, cd());
            } finally {
              (X.p = o), null !== u && null !== c.types && (u.types = c.types), (Z.T = u);
            }
          }
          function Pl() {}
          function jl(e, t, n, r) {
            if (5 !== e.tag) throw Error(o(476));
            var a = Ll(e).queue;
            Ol(
              e,
              a,
              t,
              J,
              null === n
                ? Pl
                : function () {
                    return Il(e), n(r);
                  },
            );
          }
          function Ll(e) {
            var t = e.memoizedState;
            if (null !== t) return t;
            var n = {};
            return (
              ((t = {
                memoizedState: J,
                baseState: J,
                baseQueue: null,
                queue: {
                  pending: null,
                  lanes: 0,
                  dispatch: null,
                  lastRenderedReducer: Vi,
                  lastRenderedState: J,
                },
                next: null,
              }).next = {
                memoizedState: n,
                baseState: n,
                baseQueue: null,
                queue: {
                  pending: null,
                  lanes: 0,
                  dispatch: null,
                  lastRenderedReducer: Vi,
                  lastRenderedState: n,
                },
                next: null,
              }),
              (e.memoizedState = t),
              null !== (e = e.alternate) && (e.memoizedState = t),
              t
            );
          }
          function Il(e) {
            var t = Ll(e);
            null === t.next && (t = e.alternate.memoizedState),
              $l(e, t.next.queue, {}, cd());
          }
          function Fl() {
            return oo(gg);
          }
          function Rl() {
            return Bi().memoizedState;
          }
          function Dl() {
            return Bi().memoizedState;
          }
          function zl(e) {
            for (var t = e.return; null !== t; ) {
              switch (t.tag) {
                case 24:
                case 3:
                  var n = cd(),
                    r = Ko(t, (e = Yo(n)), n);
                  return (
                    null !== r && (pd(r, t, n), Qo(r, t, n)),
                    (t = { cache: po() }),
                    void (e.payload = t)
                  );
              }
              t = t.return;
            }
          }
          function Ml(e, t, n) {
            var r = cd();
            (n = {
              lane: r,
              revertLane: 0,
              gesture: null,
              action: n,
              hasEagerState: !1,
              eagerState: null,
              next: null,
            }),
              Hl(e)
                ? Vl(t, n)
                : null !== (n = oa(e, t, n, r)) && (pd(n, e, r), Wl(n, t, r));
          }
          function Bl(e, t, n) {
            $l(e, t, n, cd());
          }
          function $l(e, t, n, r) {
            var a = {
              lane: r,
              revertLane: 0,
              gesture: null,
              action: n,
              hasEagerState: !1,
              eagerState: null,
              next: null,
            };
            if (Hl(e)) Vl(t, a);
            else {
              var o = e.alternate;
              if (
                0 === e.lanes &&
                (null === o || 0 === o.lanes) &&
                null !== (o = t.lastRenderedReducer)
              )
                try {
                  var i = t.lastRenderedState,
                    l = o(i, n);
                  if (((a.hasEagerState = !0), (a.eagerState = l), wr(l, i)))
                    return aa(e, t, a, 0), null === Nc && ra(), !1;
                } catch (s) {}
              if (null !== (n = oa(e, t, a, r))) return pd(n, e, r), Wl(n, t, r), !0;
            }
            return !1;
          }
          function Ul(e, t, n, r) {
            if (
              ((r = {
                lane: 2,
                revertLane: cf(),
                gesture: null,
                action: r,
                hasEagerState: !1,
                eagerState: null,
                next: null,
              }),
              Hl(e))
            ) {
              if (t) throw Error(o(479));
            } else null !== (t = oa(e, n, r, 2)) && pd(t, e, 2);
          }
          function Hl(e) {
            var t = e.alternate;
            return e === wi || (null !== t && t === wi);
          }
          function Vl(e, t) {
            Ei = xi = !0;
            var n = e.pending;
            null === n ? (t.next = t) : ((t.next = n.next), (n.next = t)),
              (e.pending = t);
          }
          function Wl(e, t, n) {
            if (4194048 & n) {
              var r = t.lanes;
              (n |= r &= e.pendingLanes), (t.lanes = n), Xe(e, n);
            }
          }
          var Gl = {
              readContext: oo,
              use: Ui,
              useCallback: Oi,
              useContext: Oi,
              useEffect: Oi,
              useImperativeHandle: Oi,
              useLayoutEffect: Oi,
              useInsertionEffect: Oi,
              useMemo: Oi,
              useReducer: Oi,
              useRef: Oi,
              useState: Oi,
              useDebugValue: Oi,
              useDeferredValue: Oi,
              useTransition: Oi,
              useSyncExternalStore: Oi,
              useId: Oi,
              useHostTransitionStatus: Oi,
              useFormState: Oi,
              useActionState: Oi,
              useOptimistic: Oi,
              useMemoCache: Oi,
              useCacheRefresh: Oi,
              useEffectEvent: Oi,
            },
            ql = {
              readContext: oo,
              use: Ui,
              useCallback: function (e, t) {
                return (Mi().memoizedState = [e, void 0 === t ? null : t]), e;
              },
              useContext: oo,
              useEffect: vl,
              useImperativeHandle: function (e, t, n) {
                (n = null != n ? n.concat([e]) : null),
                  hl(4194308, 4, xl.bind(null, t, e), n);
              },
              useLayoutEffect: function (e, t) {
                return hl(4194308, 4, e, t);
              },
              useInsertionEffect: function (e, t) {
                hl(4, 2, e, t);
              },
              useMemo: function (e, t) {
                var n = Mi();
                t = void 0 === t ? null : t;
                var r = e();
                if (_i) {
                  Re(!0);
                  try {
                    e();
                  } finally {
                    Re(!1);
                  }
                }
                return (n.memoizedState = [r, t]), r;
              },
              useReducer: function (e, t, n) {
                var r = Mi();
                if (void 0 !== n) {
                  var a = n(t);
                  if (_i) {
                    Re(!0);
                    try {
                      n(t);
                    } finally {
                      Re(!1);
                    }
                  }
                } else a = t;
                return (
                  (r.memoizedState = r.baseState = a),
                  (e = {
                    pending: null,
                    lanes: 0,
                    dispatch: null,
                    lastRenderedReducer: e,
                    lastRenderedState: a,
                  }),
                  (r.queue = e),
                  (e = e.dispatch = Ml.bind(null, wi, e)),
                  [r.memoizedState, e]
                );
              },
              useRef: function (e) {
                return (e = { current: e }), (Mi().memoizedState = e);
              },
              useState: function (e) {
                var t = (e = el(e)).queue,
                  n = Bl.bind(null, wi, t);
                return (t.dispatch = n), [e.memoizedState, n];
              },
              useDebugValue: _l,
              useDeferredValue: function (e, t) {
                return Tl(Mi(), e, t);
              },
              useTransition: function () {
                var e = el(!1);
                return (
                  (e = Ol.bind(null, wi, e.queue, !0, !1)),
                  (Mi().memoizedState = e),
                  [!1, e]
                );
              },
              useSyncExternalStore: function (e, t, n) {
                var r = wi,
                  a = Mi();
                if (za) {
                  if (void 0 === n) throw Error(o(407));
                  n = n();
                } else {
                  if (((n = t()), null === Nc)) throw Error(o(349));
                  127 & Pc || Ki(r, t, n);
                }
                a.memoizedState = n;
                var i = { value: n, getSnapshot: t };
                return (
                  (a.queue = i),
                  vl(Zi.bind(null, r, i, e), [e]),
                  (r.flags |= 2048),
                  gl(9, { destroy: void 0 }, Qi.bind(null, r, i, n, t), null),
                  n
                );
              },
              useId: function () {
                var e = Mi(),
                  t = Nc.identifierPrefix;
                if (za) {
                  var n = Oa;
                  (t =
                    '_' +
                    t +
                    'R_' +
                    (n = (Na & ~(1 << (32 - De(Na) - 1))).toString(32) + n)),
                    0 < (n = Ai++) && (t += 'H' + n.toString(32)),
                    (t += '_');
                } else t = '_' + t + 'r_' + (n = Ni++).toString(32) + '_';
                return (e.memoizedState = t);
              },
              useHostTransitionStatus: Fl,
              useFormState: ul,
              useActionState: ul,
              useOptimistic: function (e) {
                var t = Mi();
                t.memoizedState = t.baseState = e;
                var n = {
                  pending: null,
                  lanes: 0,
                  dispatch: null,
                  lastRenderedReducer: null,
                  lastRenderedState: null,
                };
                return (
                  (t.queue = n), (t = Ul.bind(null, wi, !0, n)), (n.dispatch = t), [e, t]
                );
              },
              useMemoCache: Hi,
              useCacheRefresh: function () {
                return (Mi().memoizedState = zl.bind(null, wi));
              },
              useEffectEvent: function (e) {
                var t = Mi(),
                  n = { impl: e };
                return (
                  (t.memoizedState = n),
                  function () {
                    if (2 & Tc) throw Error(o(440));
                    return n.impl.apply(void 0, arguments);
                  }
                );
              },
            },
            Yl = {
              readContext: oo,
              use: Ui,
              useCallback: Al,
              useContext: oo,
              useEffect: bl,
              useImperativeHandle: El,
              useInsertionEffect: kl,
              useLayoutEffect: Sl,
              useMemo: Cl,
              useReducer: Wi,
              useRef: ml,
              useState: function () {
                return Wi(Vi);
              },
              useDebugValue: _l,
              useDeferredValue: function (e, t) {
                return Nl(Bi(), ki.memoizedState, e, t);
              },
              useTransition: function () {
                var e = Wi(Vi)[0],
                  t = Bi().memoizedState;
                return ['boolean' == typeof e ? e : $i(e), t];
              },
              useSyncExternalStore: Yi,
              useId: Rl,
              useHostTransitionStatus: Fl,
              useFormState: cl,
              useActionState: cl,
              useOptimistic: function (e, t) {
                return tl(Bi(), 0, e, t);
              },
              useMemoCache: Hi,
              useCacheRefresh: Dl,
              useEffectEvent: wl,
            },
            Kl = {
              readContext: oo,
              use: Ui,
              useCallback: Al,
              useContext: oo,
              useEffect: bl,
              useImperativeHandle: El,
              useInsertionEffect: kl,
              useLayoutEffect: Sl,
              useMemo: Cl,
              useReducer: qi,
              useRef: ml,
              useState: function () {
                return qi(Vi);
              },
              useDebugValue: _l,
              useDeferredValue: function (e, t) {
                var n = Bi();
                return null === ki ? Tl(n, e, t) : Nl(n, ki.memoizedState, e, t);
              },
              useTransition: function () {
                var e = qi(Vi)[0],
                  t = Bi().memoizedState;
                return ['boolean' == typeof e ? e : $i(e), t];
              },
              useSyncExternalStore: Yi,
              useId: Rl,
              useHostTransitionStatus: Fl,
              useFormState: pl,
              useActionState: pl,
              useOptimistic: function (e, t) {
                var n = Bi();
                return null !== ki
                  ? tl(n, 0, e, t)
                  : ((n.baseState = e), [e, n.queue.dispatch]);
              },
              useMemoCache: Hi,
              useCacheRefresh: Dl,
              useEffectEvent: wl,
            };
          function Ql(e, t, n, r) {
            (n = null == (n = n(r, (t = e.memoizedState))) ? t : C({}, t, n)),
              (e.memoizedState = n),
              0 === e.lanes && (e.updateQueue.baseState = n);
          }
          var Zl = {
            enqueueSetState: function (e, t, n) {
              e = e._reactInternals;
              var r = cd(),
                a = Yo(r);
              (a.payload = t),
                null != n && (a.callback = n),
                null !== (t = Ko(e, a, r)) && (pd(t, e, r), Qo(t, e, r));
            },
            enqueueReplaceState: function (e, t, n) {
              e = e._reactInternals;
              var r = cd(),
                a = Yo(r);
              (a.tag = 1),
                (a.payload = t),
                null != n && (a.callback = n),
                null !== (t = Ko(e, a, r)) && (pd(t, e, r), Qo(t, e, r));
            },
            enqueueForceUpdate: function (e, t) {
              e = e._reactInternals;
              var n = cd(),
                r = Yo(n);
              (r.tag = 2),
                null != t && (r.callback = t),
                null !== (t = Ko(e, r, n)) && (pd(t, e, n), Qo(t, e, n));
            },
          };
          function Xl(e, t, n, r, a, o, i) {
            return 'function' == typeof (e = e.stateNode).shouldComponentUpdate
              ? e.shouldComponentUpdate(r, o, i)
              : !t.prototype ||
                  !t.prototype.isPureReactComponent ||
                  !kr(n, r) ||
                  !kr(a, o);
          }
          function Jl(e, t, n, r) {
            (e = t.state),
              'function' == typeof t.componentWillReceiveProps &&
                t.componentWillReceiveProps(n, r),
              'function' == typeof t.UNSAFE_componentWillReceiveProps &&
                t.UNSAFE_componentWillReceiveProps(n, r),
              t.state !== e && Zl.enqueueReplaceState(t, t.state, null);
          }
          function es(e, t) {
            var n = t;
            if ('ref' in t) for (var r in ((n = {}), t)) 'ref' !== r && (n[r] = t[r]);
            if ((e = e.defaultProps))
              for (var a in (n === t && (n = C({}, n)), e))
                void 0 === n[a] && (n[a] = e[a]);
            return n;
          }
          function ts(e) {
            Jr(e);
          }
          function ns(e) {
            console.error(e);
          }
          function rs(e) {
            Jr(e);
          }
          function as(e, t) {
            try {
              (0, e.onUncaughtError)(t.value, { componentStack: t.stack });
            } catch (n) {
              setTimeout(function () {
                throw n;
              });
            }
          }
          function os(e, t, n) {
            try {
              (0, e.onCaughtError)(n.value, {
                componentStack: n.stack,
                errorBoundary: 1 === t.tag ? t.stateNode : null,
              });
            } catch (r) {
              setTimeout(function () {
                throw r;
              });
            }
          }
          function is(e, t, n) {
            return (
              ((n = Yo(n)).tag = 3),
              (n.payload = { element: null }),
              (n.callback = function () {
                as(e, t);
              }),
              n
            );
          }
          function ls(e) {
            return ((e = Yo(e)).tag = 3), e;
          }
          function ss(e, t, n, r) {
            var a = n.type.getDerivedStateFromError;
            if ('function' == typeof a) {
              var o = r.value;
              (e.payload = function () {
                return a(o);
              }),
                (e.callback = function () {
                  os(t, n, r);
                });
            }
            var i = n.stateNode;
            null !== i &&
              'function' == typeof i.componentDidCatch &&
              (e.callback = function () {
                os(t, n, r),
                  'function' != typeof a &&
                    (null === Zc ? (Zc = new Set([this])) : Zc.add(this));
                var e = r.stack;
                this.componentDidCatch(r.value, { componentStack: null !== e ? e : '' });
              });
          }
          var us = Error(o(461)),
            cs = !1;
          function ds(e, t, n, r) {
            t.child = null === e ? Vo(t, null, n, r) : Ho(t, e.child, n, r);
          }
          function fs(e, t, n, r, a) {
            n = n.render;
            var o = t.ref;
            if ('ref' in r) {
              var i = {};
              for (var l in r) 'ref' !== l && (i[l] = r[l]);
            } else i = r;
            return (
              ao(t),
              (r = ji(e, t, n, i, o, a)),
              (l = Ri()),
              null === e || cs
                ? (za && l && La(t), (t.flags |= 1), ds(e, t, r, a), t.child)
                : (Di(e, t, a), zs(e, t, a))
            );
          }
          function ps(e, t, n, r, a) {
            if (null === e) {
              var o = n.type;
              return 'function' != typeof o ||
                fa(o) ||
                void 0 !== o.defaultProps ||
                null !== n.compare
                ? (((e = ma(n.type, null, r, t, t.mode, a)).ref = t.ref),
                  (e.return = t),
                  (t.child = e))
                : ((t.tag = 15), (t.type = o), gs(e, t, o, r, a));
            }
            if (((o = e.child), !Ms(e, a))) {
              var i = o.memoizedProps;
              if ((n = null !== (n = n.compare) ? n : kr)(i, r) && e.ref === t.ref)
                return zs(e, t, a);
            }
            return (
              (t.flags |= 1), ((e = pa(o, r)).ref = t.ref), (e.return = t), (t.child = e)
            );
          }
          function gs(e, t, n, r, a) {
            if (null !== e) {
              var o = e.memoizedProps;
              if (kr(o, r) && e.ref === t.ref) {
                if (((cs = !1), (t.pendingProps = r = o), !Ms(e, a)))
                  return (t.lanes = e.lanes), zs(e, t, a);
                131072 & e.flags && (cs = !0);
              }
            }
            return ks(e, t, n, r, a);
          }
          function ms(e, t, n, r) {
            var a = r.children,
              o = null !== e ? e.memoizedState : null;
            if (
              (null === e &&
                null === t.stateNode &&
                (t.stateNode = {
                  _visibility: 1,
                  _pendingMarkers: null,
                  _retryCache: null,
                  _transitions: null,
                }),
              'hidden' === r.mode)
            ) {
              if (128 & t.flags) {
                if (((o = null !== o ? o.baseLanes | n : n), null !== e)) {
                  for (r = t.child = e.child, a = 0; null !== r; )
                    (a = a | r.lanes | r.childLanes), (r = r.sibling);
                  r = a & ~o;
                } else (r = 0), (t.child = null);
                return ys(e, t, o, n, r);
              }
              if (!(536870912 & n))
                return (
                  (r = t.lanes = 536870912),
                  ys(e, t, null !== o ? o.baseLanes | n : n, n, r)
                );
              (t.memoizedState = { baseLanes: 0, cachePool: null }),
                null !== e && _o(0, null !== o ? o.cachePool : null),
                null !== o ? oi(t, o) : ii(),
                fi(t);
            } else
              null !== o
                ? (_o(0, o.cachePool), oi(t, o), pi(), (t.memoizedState = null))
                : (null !== e && _o(0, null), ii(), pi());
            return ds(e, t, a, n), t.child;
          }
          function hs(e, t) {
            return (
              (null !== e && 22 === e.tag) ||
                null !== t.stateNode ||
                (t.stateNode = {
                  _visibility: 1,
                  _pendingMarkers: null,
                  _retryCache: null,
                  _transitions: null,
                }),
              t.sibling
            );
          }
          function ys(e, t, n, r, a) {
            var o = Eo();
            return (
              (o = null === o ? null : { parent: fo._currentValue, pool: o }),
              (t.memoizedState = { baseLanes: n, cachePool: o }),
              null !== e && _o(0, null),
              ii(),
              fi(t),
              null !== e && no(e, t, r, !0),
              (t.childLanes = a),
              null
            );
          }
          function vs(e, t) {
            return (
              ((t = Os({ mode: t.mode, children: t.children }, e.mode)).ref = e.ref),
              (e.child = t),
              (t.return = e),
              t
            );
          }
          function bs(e, t, n) {
            return (
              Ho(t, e.child, null, n),
              ((e = vs(t, t.pendingProps)).flags |= 2),
              gi(t),
              (t.memoizedState = null),
              e
            );
          }
          function ws(e, t) {
            var n = t.ref;
            if (null === n) null !== e && null !== e.ref && (t.flags |= 4194816);
            else {
              if ('function' != typeof n && 'object' != typeof n) throw Error(o(284));
              (null !== e && e.ref === n) || (t.flags |= 4194816);
            }
          }
          function ks(e, t, n, r, a) {
            return (
              ao(t),
              (n = ji(e, t, n, r, void 0, a)),
              (r = Ri()),
              null === e || cs
                ? (za && r && La(t), (t.flags |= 1), ds(e, t, n, a), t.child)
                : (Di(e, t, a), zs(e, t, a))
            );
          }
          function Ss(e, t, n, r, a, o) {
            return (
              ao(t),
              (t.updateQueue = null),
              (n = Ii(t, r, n, a)),
              Li(e),
              (r = Ri()),
              null === e || cs
                ? (za && r && La(t), (t.flags |= 1), ds(e, t, n, o), t.child)
                : (Di(e, t, o), zs(e, t, o))
            );
          }
          function xs(e, t, n, r, a) {
            if ((ao(t), null === t.stateNode)) {
              var o = ua,
                i = n.contextType;
              'object' == typeof i && null !== i && (o = oo(i)),
                (o = new n(r, o)),
                (t.memoizedState =
                  null !== o.state && void 0 !== o.state ? o.state : null),
                (o.updater = Zl),
                (t.stateNode = o),
                (o._reactInternals = t),
                ((o = t.stateNode).props = r),
                (o.state = t.memoizedState),
                (o.refs = {}),
                Go(t),
                (i = n.contextType),
                (o.context = 'object' == typeof i && null !== i ? oo(i) : ua),
                (o.state = t.memoizedState),
                'function' == typeof (i = n.getDerivedStateFromProps) &&
                  (Ql(t, n, i, r), (o.state = t.memoizedState)),
                'function' == typeof n.getDerivedStateFromProps ||
                  'function' == typeof o.getSnapshotBeforeUpdate ||
                  ('function' != typeof o.UNSAFE_componentWillMount &&
                    'function' != typeof o.componentWillMount) ||
                  ((i = o.state),
                  'function' == typeof o.componentWillMount && o.componentWillMount(),
                  'function' == typeof o.UNSAFE_componentWillMount &&
                    o.UNSAFE_componentWillMount(),
                  i !== o.state && Zl.enqueueReplaceState(o, o.state, null),
                  ei(t, r, o, a),
                  Jo(),
                  (o.state = t.memoizedState)),
                'function' == typeof o.componentDidMount && (t.flags |= 4194308),
                (r = !0);
            } else if (null === e) {
              o = t.stateNode;
              var l = t.memoizedProps,
                s = es(n, l);
              o.props = s;
              var u = o.context,
                c = n.contextType;
              (i = ua), 'object' == typeof c && null !== c && (i = oo(c));
              var d = n.getDerivedStateFromProps;
              (c =
                'function' == typeof d || 'function' == typeof o.getSnapshotBeforeUpdate),
                (l = t.pendingProps !== l),
                c ||
                  ('function' != typeof o.UNSAFE_componentWillReceiveProps &&
                    'function' != typeof o.componentWillReceiveProps) ||
                  ((l || u !== i) && Jl(t, o, r, i)),
                (Wo = !1);
              var f = t.memoizedState;
              (o.state = f),
                ei(t, r, o, a),
                Jo(),
                (u = t.memoizedState),
                l || f !== u || Wo
                  ? ('function' == typeof d && (Ql(t, n, d, r), (u = t.memoizedState)),
                    (s = Wo || Xl(t, n, s, r, f, u, i))
                      ? (c ||
                          ('function' != typeof o.UNSAFE_componentWillMount &&
                            'function' != typeof o.componentWillMount) ||
                          ('function' == typeof o.componentWillMount &&
                            o.componentWillMount(),
                          'function' == typeof o.UNSAFE_componentWillMount &&
                            o.UNSAFE_componentWillMount()),
                        'function' == typeof o.componentDidMount && (t.flags |= 4194308))
                      : ('function' == typeof o.componentDidMount && (t.flags |= 4194308),
                        (t.memoizedProps = r),
                        (t.memoizedState = u)),
                    (o.props = r),
                    (o.state = u),
                    (o.context = i),
                    (r = s))
                  : ('function' == typeof o.componentDidMount && (t.flags |= 4194308),
                    (r = !1));
            } else {
              (o = t.stateNode),
                qo(e, t),
                (c = es(n, (i = t.memoizedProps))),
                (o.props = c),
                (d = t.pendingProps),
                (f = o.context),
                (u = n.contextType),
                (s = ua),
                'object' == typeof u && null !== u && (s = oo(u)),
                (u =
                  'function' == typeof (l = n.getDerivedStateFromProps) ||
                  'function' == typeof o.getSnapshotBeforeUpdate) ||
                  ('function' != typeof o.UNSAFE_componentWillReceiveProps &&
                    'function' != typeof o.componentWillReceiveProps) ||
                  ((i !== d || f !== s) && Jl(t, o, r, s)),
                (Wo = !1),
                (f = t.memoizedState),
                (o.state = f),
                ei(t, r, o, a),
                Jo();
              var p = t.memoizedState;
              i !== d ||
              f !== p ||
              Wo ||
              (null !== e && null !== e.dependencies && ro(e.dependencies))
                ? ('function' == typeof l && (Ql(t, n, l, r), (p = t.memoizedState)),
                  (c =
                    Wo ||
                    Xl(t, n, c, r, f, p, s) ||
                    (null !== e && null !== e.dependencies && ro(e.dependencies)))
                    ? (u ||
                        ('function' != typeof o.UNSAFE_componentWillUpdate &&
                          'function' != typeof o.componentWillUpdate) ||
                        ('function' == typeof o.componentWillUpdate &&
                          o.componentWillUpdate(r, p, s),
                        'function' == typeof o.UNSAFE_componentWillUpdate &&
                          o.UNSAFE_componentWillUpdate(r, p, s)),
                      'function' == typeof o.componentDidUpdate && (t.flags |= 4),
                      'function' == typeof o.getSnapshotBeforeUpdate && (t.flags |= 1024))
                    : ('function' != typeof o.componentDidUpdate ||
                        (i === e.memoizedProps && f === e.memoizedState) ||
                        (t.flags |= 4),
                      'function' != typeof o.getSnapshotBeforeUpdate ||
                        (i === e.memoizedProps && f === e.memoizedState) ||
                        (t.flags |= 1024),
                      (t.memoizedProps = r),
                      (t.memoizedState = p)),
                  (o.props = r),
                  (o.state = p),
                  (o.context = s),
                  (r = c))
                : ('function' != typeof o.componentDidUpdate ||
                    (i === e.memoizedProps && f === e.memoizedState) ||
                    (t.flags |= 4),
                  'function' != typeof o.getSnapshotBeforeUpdate ||
                    (i === e.memoizedProps && f === e.memoizedState) ||
                    (t.flags |= 1024),
                  (r = !1));
            }
            return (
              (o = r),
              ws(e, t),
              (r = !!(128 & t.flags)),
              o || r
                ? ((o = t.stateNode),
                  (n =
                    r && 'function' != typeof n.getDerivedStateFromError
                      ? null
                      : o.render()),
                  (t.flags |= 1),
                  null !== e && r
                    ? ((t.child = Ho(t, e.child, null, a)), (t.child = Ho(t, null, n, a)))
                    : ds(e, t, n, a),
                  (t.memoizedState = o.state),
                  (e = t.child))
                : (e = zs(e, t, a)),
              e
            );
          }
          function Es(e, t, n, r) {
            return Ga(), (t.flags |= 256), ds(e, t, n, r), t.child;
          }
          var _s = {
            dehydrated: null,
            treeContext: null,
            retryLane: 0,
            hydrationErrors: null,
          };
          function As(e) {
            return { baseLanes: e, cachePool: Ao() };
          }
          function Cs(e, t, n) {
            return (e = null !== e ? e.childLanes & ~n : 0), t && (e |= Uc), e;
          }
          function Ts(e, t, n) {
            var r,
              a = t.pendingProps,
              i = !1,
              l = !!(128 & t.flags);
            if (
              ((r = l) ||
                (r = (null === e || null !== e.memoizedState) && !!(2 & mi.current)),
              r && ((i = !0), (t.flags &= -129)),
              (r = !!(32 & t.flags)),
              (t.flags &= -33),
              null === e)
            ) {
              if (za) {
                if (
                  (i ? ci(t) : pi(),
                  (e = Da)
                    ? null !==
                        (e = null !== (e = Tp(e, Ba)) && '&' !== e.data ? e : null) &&
                      ((t.memoizedState = {
                        dehydrated: e,
                        treeContext: null !== Ta ? { id: Na, overflow: Oa } : null,
                        retryLane: 536870912,
                        hydrationErrors: null,
                      }),
                      ((n = va(e)).return = t),
                      (t.child = n),
                      (Ra = t),
                      (Da = null))
                    : (e = null),
                  null === e)
                )
                  throw Ua(t);
                return Op(e) ? (t.lanes = 32) : (t.lanes = 536870912), null;
              }
              return (
                (l = a.children),
                (a = a.fallback),
                i
                  ? (pi(),
                    (l = Os({ mode: 'hidden', children: l }, (i = t.mode))),
                    (a = ha(a, i, n, null)),
                    (l.return = t),
                    (a.return = t),
                    (l.sibling = a),
                    (t.child = l),
                    ((a = t.child).memoizedState = As(n)),
                    (a.childLanes = Cs(e, r, n)),
                    (t.memoizedState = _s),
                    hs(null, a))
                  : (ci(t), Ns(t, l))
              );
            }
            var s = e.memoizedState;
            if (null !== s) {
              var u = s.dehydrated;
              if (null !== u)
                return (function (e, t, n, r, a, i, l, s) {
                  if (n)
                    return 256 & t.flags
                      ? (ci(t), (t.flags &= -257), Ps(e, t, s))
                      : null !== t.memoizedState
                      ? (pi(), (t.child = e.child), (t.flags |= 128), null)
                      : (pi(),
                        (i = a.fallback),
                        (l = t.mode),
                        (a = Os({ mode: 'visible', children: a.children }, l)),
                        ((i = ha(i, l, s, null)).flags |= 2),
                        (a.return = t),
                        (i.return = t),
                        (a.sibling = i),
                        (t.child = a),
                        Ho(t, e.child, null, s),
                        ((a = t.child).memoizedState = As(s)),
                        (a.childLanes = Cs(e, r, s)),
                        (t.memoizedState = _s),
                        hs(null, a));
                  if ((ci(t), Op(i))) {
                    if ((r = i.nextSibling && i.nextSibling.dataset)) var u = r.dgst;
                    return (
                      '' !== (r = u) &&
                        (((a = Error(o(419))).stack = ''),
                        (a.digest = r),
                        Ya({ value: a, source: null, stack: null })),
                      Ps(e, t, s)
                    );
                  }
                  if ((cs || no(e, t, s, !1), (r = 0 !== (s & e.childLanes)), cs || r)) {
                    if (null !== ri.current) return Ps(e, t, s);
                    if (null !== (r = Nc) && 0 !== (a = Je(r, s)) && a !== l.retryLane)
                      throw ((l.retryLane = a), ia(e, a), pd(r, e, a), us);
                    return Np(i) || _d(), Ps(e, t, s);
                  }
                  return Np(i)
                    ? ((t.flags |= 192), (t.child = e.child), null)
                    : ((e = l.treeContext),
                      (Da = Pp(i.nextSibling)),
                      (Ra = t),
                      (za = !0),
                      (Ma = null),
                      (Ba = !1),
                      null !== e && Fa(t, e),
                      (t = Ns(t, a.children)),
                      (t.flags |= 134221824),
                      t);
                })(e, t, l, r, a, u, s, n);
            }
            return i
              ? (pi(),
                (i = a.fallback),
                (l = t.mode),
                (u = (s = e.child).sibling),
                ((a = pa(s, { mode: 'hidden', children: a.children })).subtreeFlags =
                  1206910976 & s.subtreeFlags),
                null !== u ? (i = pa(u, i)) : ((i = ha(i, l, n, null)).flags |= 2),
                (i.return = t),
                (a.return = t),
                (a.sibling = i),
                (t.child = a),
                hs(null, a),
                (a = t.child),
                null === (i = e.child.memoizedState)
                  ? (i = As(n))
                  : (null !== (l = i.cachePool)
                      ? ((s = fo._currentValue),
                        (l = l.parent !== s ? { parent: s, pool: s } : l))
                      : (l = Ao()),
                    (i = { baseLanes: i.baseLanes | n, cachePool: l })),
                (a.memoizedState = i),
                (a.childLanes = Cs(e, r, n)),
                (t.memoizedState = _s),
                hs(e.child, a))
              : (ci(t),
                (e = (n = e.child).sibling),
                ((n = pa(n, { mode: 'visible', children: a.children })).return = t),
                (n.sibling = null),
                null !== e &&
                  (null === (r = t.deletions)
                    ? ((t.deletions = [e]), (t.flags |= 16))
                    : r.push(e)),
                (t.child = n),
                (t.memoizedState = null),
                n);
          }
          function Ns(e, t) {
            return (
              ((t = Os({ mode: 'visible', children: t }, e.mode)).return = e),
              (e.child = t)
            );
          }
          function Os(e, t) {
            return ((e = da(22, e, null, t)).lanes = 0), e;
          }
          function Ps(e, t, n) {
            return (
              Ho(t, e.child, null, n),
              ((e = Ns(t, t.pendingProps.children)).flags |= 2),
              (t.memoizedState = null),
              e
            );
          }
          function js(e, t, n) {
            e.lanes |= t;
            var r = e.alternate;
            null !== r && (r.lanes |= t), eo(e.return, t, n);
          }
          function Ls(e) {
            for (var t = null; null !== e; ) {
              var n = e.alternate;
              null !== n && null === vi(n) && (t = e), (e = e.sibling);
            }
            return t;
          }
          function Is(e, t, n, r, a, o) {
            var i = e.memoizedState;
            null === i
              ? (e.memoizedState = {
                  isBackwards: t,
                  rendering: null,
                  renderingStartTime: 0,
                  last: r,
                  tail: n,
                  tailMode: a,
                  treeForkCount: o,
                })
              : ((i.isBackwards = t),
                (i.rendering = null),
                (i.renderingStartTime = 0),
                (i.last = r),
                (i.tail = n),
                (i.tailMode = a),
                (i.treeForkCount = o));
          }
          function Fs(e) {
            var t = e.child;
            for (e.child = null; null !== t; ) {
              var n = t.sibling;
              (t.sibling = e.child), (e.child = t), (t = n);
            }
          }
          function Rs(e, t, n) {
            var r = t.pendingProps,
              a = r.revealOrder,
              o = r.tail;
            r = r.children;
            var i = mi.current;
            if (128 & t.flags) return hi(0, i), null;
            var l = !!(2 & i);
            if (
              (l ? ((i = (1 & i) | 2), (t.flags |= 128)) : (i &= 1),
              hi(0, i),
              'backwards' === a && null !== e
                ? (Fs(e), ds(e, t, r, n), Fs(e))
                : ds(e, t, r, n),
              (r = za ? _a : 0),
              !l && null !== e && 128 & e.flags)
            )
              e: for (e = t.child; null !== e; ) {
                if (13 === e.tag) null !== e.memoizedState && js(e, n, t);
                else if (19 === e.tag) js(e, n, t);
                else if (null !== e.child) {
                  (e.child.return = e), (e = e.child);
                  continue;
                }
                if (e === t) break e;
                for (; null === e.sibling; ) {
                  if (null === e.return || e.return === t) break e;
                  e = e.return;
                }
                (e.sibling.return = e.return), (e = e.sibling);
              }
            switch (a) {
              case 'backwards':
                null === (n = Ls(t.child))
                  ? ((a = t.child), (t.child = null))
                  : ((a = n.sibling), (n.sibling = null), Fs(t)),
                  Is(t, !0, a, null, o, r);
                break;
              case 'unstable_legacy-backwards':
                for (n = null, a = t.child, t.child = null; null !== a; ) {
                  if (null !== (e = a.alternate) && null === vi(e)) {
                    t.child = a;
                    break;
                  }
                  (e = a.sibling), (a.sibling = n), (n = a), (a = e);
                }
                Is(t, !0, n, null, o, r);
                break;
              case 'together':
                Is(t, !1, null, null, void 0, r);
                break;
              case 'independent':
                t.memoizedState = null;
                break;
              default:
                null === (n = Ls(t.child))
                  ? ((a = t.child), (t.child = null))
                  : ((a = n.sibling), (n.sibling = null)),
                  Is(t, !1, a, n, o, r);
            }
            return t.child;
          }
          function Ds(e, t, n) {
            var r = t.pendingProps;
            return Xa(0, t.type, r.value), ds(e, t, r.children, n), t.child;
          }
          function zs(e, t, n) {
            if (
              (null !== e && (t.dependencies = e.dependencies),
              (Mc |= t.lanes),
              0 === (n & t.childLanes))
            ) {
              if (null === e) return null;
              if ((no(e, t, n, !1), 0 === (n & t.childLanes))) return null;
            }
            if (null !== e && t.child !== e.child) throw Error(o(153));
            if (null !== t.child) {
              for (
                n = pa((e = t.child), e.pendingProps), t.child = n, n.return = t;
                null !== e.sibling;

              )
                (e = e.sibling), ((n = n.sibling = pa(e, e.pendingProps)).return = t);
              n.sibling = null;
            }
            return t.child;
          }
          function Ms(e, t) {
            return 0 !== (e.lanes & t) || !(null === (e = e.dependencies) || !ro(e));
          }
          function Bs(e, t, n) {
            if (null !== e)
              if (e.memoizedProps !== t.pendingProps) cs = !0;
              else {
                if (!(Ms(e, n) || 128 & t.flags))
                  return (
                    (cs = !1),
                    (function (e, t, n) {
                      switch (t.tag) {
                        case 3:
                          de(t, t.stateNode.containerInfo),
                            Xa(0, fo, e.memoizedState.cache),
                            Ga();
                          break;
                        case 27:
                        case 5:
                          pe(t);
                          break;
                        case 4:
                          de(t, t.stateNode.containerInfo);
                          break;
                        case 10:
                          Xa(0, t.type, t.memoizedProps.value);
                          break;
                        case 31:
                          if (null !== t.memoizedState)
                            return (t.flags |= 128), di(t), null;
                          break;
                        case 13:
                          var r = t.memoizedState;
                          if (null !== r) {
                            if (null !== r.dehydrated)
                              return ci(t), (t.flags |= 128), null;
                            r = no(e, t, n, !1);
                            var a = t.child.childLanes;
                            return r || 0 !== (n & a)
                              ? Ts(e, t, n)
                              : (ci(t), null !== (e = zs(e, t, n)) ? e.sibling : null);
                          }
                          ci(t);
                          break;
                        case 19:
                          if (128 & t.flags) return Rs(e, t, n);
                          if (
                            ((a = !!(128 & e.flags)),
                            (r = 0 !== (n & t.childLanes)) ||
                              (no(e, t, n, !1), (r = 0 !== (n & t.childLanes))),
                            a)
                          ) {
                            if (r) return Rs(e, t, n);
                            t.flags |= 128;
                          }
                          if (
                            (null !== (a = t.memoizedState) &&
                              ((a.rendering = null),
                              (a.tail = null),
                              (a.lastEffect = null)),
                            hi(0, mi.current),
                            r)
                          )
                            break;
                          return null;
                        case 22:
                          return (t.lanes = 0), ms(e, t, n, t.pendingProps);
                        case 24:
                          Xa(0, fo, e.memoizedState.cache);
                      }
                      return zs(e, t, n);
                    })(e, t, n)
                  );
                cs = !!(131072 & e.flags);
              }
            else (cs = !1), za && 1048576 & t.flags && ja(t, _a, t.index);
            switch (((t.lanes = 0), t.tag)) {
              case 16:
                e: {
                  var r = t.pendingProps;
                  if (((e = Lo(t.elementType)), (t.type = e), 'function' != typeof e)) {
                    if (null != e) {
                      var a = e.$$typeof;
                      if (a === R) {
                        (t.tag = 11), (t = fs(null, t, e, r, n));
                        break e;
                      }
                      if (a === M) {
                        (t.tag = 14), (t = ps(null, t, e, r, n));
                        break e;
                      }
                      if (a === F) {
                        (t.tag = 10), (t.type = e), (t = Ds(null, t, n));
                        break e;
                      }
                    }
                    throw ((t = K(e) || e), Error(o(306, t, '')));
                  }
                  fa(e)
                    ? ((r = es(e, r)), (t.tag = 1), (t = xs(null, t, e, r, n)))
                    : ((t.tag = 0), (t = ks(null, t, e, r, n)));
                }
                return t;
              case 0:
                return ks(e, t, t.type, t.pendingProps, n);
              case 1:
                return xs(e, t, (r = t.type), (a = es(r, t.pendingProps)), n);
              case 3:
                e: {
                  if ((de(t, t.stateNode.containerInfo), null === e)) throw Error(o(387));
                  r = t.pendingProps;
                  var i = t.memoizedState;
                  (a = i.element), qo(e, t), ei(t, r, null, n);
                  var l = t.memoizedState;
                  if (
                    ((r = l.cache),
                    Xa(0, fo, r),
                    r !== i.cache && to(t, [fo], n, !0),
                    Jo(),
                    (r = l.element),
                    i.isDehydrated)
                  ) {
                    if (
                      ((i = { element: r, isDehydrated: !1, cache: l.cache }),
                      (t.updateQueue.baseState = i),
                      (t.memoizedState = i),
                      256 & t.flags)
                    ) {
                      t = Es(e, t, r, n);
                      break e;
                    }
                    if (r !== a) {
                      Ya((a = ka(Error(o(424)), t))), (t = Es(e, t, r, n));
                      break e;
                    }
                    if (9 === (e = t.stateNode.containerInfo).nodeType) e = e.body;
                    else e = 'HTML' === e.nodeName ? e.ownerDocument.body : e;
                    for (
                      Da = Pp(e.firstChild),
                        Ra = t,
                        za = !0,
                        Ma = null,
                        Ba = !0,
                        n = Vo(t, null, r, n),
                        t.child = n;
                      n;

                    )
                      (n.flags = (-3 & n.flags) | 134221824), (n = n.sibling);
                  } else {
                    if ((Ga(), r === a)) {
                      t = zs(e, t, n);
                      break e;
                    }
                    ds(e, t, r, n);
                  }
                  t = t.child;
                }
                return t;
              case 26:
                return (
                  ws(e, t),
                  null === e
                    ? (n = Vp(t.type, null, t.pendingProps, null))
                      ? (t.memoizedState = n)
                      : za || (t.stateNode = $f(t.type, t.pendingProps, ue.current, t))
                    : (t.memoizedState = Vp(
                        t.type,
                        e.memoizedProps,
                        t.pendingProps,
                        e.memoizedState,
                      )),
                  null
                );
              case 27:
                return (
                  pe(t),
                  null === e &&
                    za &&
                    ((r = t.stateNode = Fp(t.type, t.pendingProps, ue.current)),
                    (Ra = t),
                    (Ba = !0),
                    (a = Da),
                    Qf(t.type) ? ((jp = a), (Da = Pp(r.firstChild))) : (Da = a)),
                  ds(e, t, t.pendingProps.children, n),
                  ws(e, t),
                  null === e && (t.flags |= 4194304),
                  t.child
                );
              case 5:
                return (
                  null === e &&
                    za &&
                    ((a = r = Da) &&
                      (null !==
                      (r = (function (e, t, n, r) {
                        for (; 1 === e.nodeType; ) {
                          var a = n;
                          if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
                            if (!r && ('INPUT' !== e.nodeName || 'hidden' !== e.type))
                              break;
                          } else if (r) {
                            if (!e[ft])
                              switch (t) {
                                case 'meta':
                                  if (!e.hasAttribute('itemprop')) break;
                                  return e;
                                case 'link':
                                  if (
                                    'stylesheet' === (o = e.getAttribute('rel')) &&
                                    e.hasAttribute('data-precedence')
                                  )
                                    break;
                                  if (
                                    o !== a.rel ||
                                    e.getAttribute('href') !==
                                      (null == a.href || '' === a.href ? null : a.href) ||
                                    e.getAttribute('crossorigin') !==
                                      (null == a.crossOrigin ? null : a.crossOrigin) ||
                                    e.getAttribute('title') !==
                                      (null == a.title ? null : a.title)
                                  )
                                    break;
                                  return e;
                                case 'style':
                                  if (e.hasAttribute('data-precedence')) break;
                                  return e;
                                case 'script':
                                  if (
                                    ((o = e.getAttribute('src')) !==
                                      (null == a.src ? null : a.src) ||
                                      e.getAttribute('type') !==
                                        (null == a.type ? null : a.type) ||
                                      e.getAttribute('crossorigin') !==
                                        (null == a.crossOrigin ? null : a.crossOrigin)) &&
                                    o &&
                                    e.hasAttribute('async') &&
                                    !e.hasAttribute('itemprop')
                                  )
                                    break;
                                  return e;
                                default:
                                  return e;
                              }
                          } else {
                            if ('input' !== t || 'hidden' !== e.type) return e;
                            var o = null == a.name ? null : '' + a.name;
                            if ('hidden' === a.type && e.getAttribute('name') === o)
                              return e;
                          }
                          if (null === (e = Pp(e.nextSibling))) break;
                        }
                        return null;
                      })(r, t.type, t.pendingProps, Ba))
                        ? ((t.stateNode = r),
                          (Ra = t),
                          (Da = Pp(r.firstChild)),
                          (Ba = !1),
                          (a = !0))
                        : (a = !1)),
                    a || Ua(t)),
                  pe(t),
                  (a = t.type),
                  (i = t.pendingProps),
                  (l = null !== e ? e.memoizedProps : null),
                  (r = i.children),
                  Uf(a, i) ? (r = null) : null !== l && Uf(a, l) && (t.flags |= 32),
                  null !== t.memoizedState &&
                    ((a = ji(e, t, Fi, null, null, n)), (gg._currentValue = a)),
                  ws(e, t),
                  ds(e, t, r, n),
                  t.child
                );
              case 6:
                return (
                  null === e &&
                    za &&
                    ((e = n = Da) &&
                      (null !==
                      (n = (function (e, t, n) {
                        if ('' === t) return null;
                        for (; 3 !== e.nodeType; ) {
                          if (
                            (1 !== e.nodeType ||
                              'INPUT' !== e.nodeName ||
                              'hidden' !== e.type) &&
                            !n
                          )
                            return null;
                          if (null === (e = Pp(e.nextSibling))) return null;
                        }
                        return e;
                      })(n, t.pendingProps, Ba))
                        ? ((t.stateNode = n), (Ra = t), (Da = null), (e = !0))
                        : (e = !1)),
                    e || Ua(t)),
                  null
                );
              case 13:
                return Ts(e, t, n);
              case 4:
                return (
                  de(t, t.stateNode.containerInfo),
                  (r = t.pendingProps),
                  null === e ? (t.child = Ho(t, null, r, n)) : ds(e, t, r, n),
                  t.child
                );
              case 11:
                return fs(e, t, t.type, t.pendingProps, n);
              case 7:
                return (r = t.pendingProps), ws(e, t), ds(e, t, r, n), t.child;
              case 8:
              case 12:
                return ds(e, t, t.pendingProps.children, n), t.child;
              case 10:
                return Ds(e, t, n);
              case 9:
                return (
                  (a = t.type._context),
                  (r = t.pendingProps.children),
                  ao(t),
                  (r = r((a = oo(a)))),
                  (t.flags |= 1),
                  ds(e, t, r, n),
                  t.child
                );
              case 14:
                return ps(e, t, t.type, t.pendingProps, n);
              case 15:
                return gs(e, t, t.type, t.pendingProps, n);
              case 19:
                return Rs(e, t, n);
              case 31:
                return (function (e, t, n) {
                  var r = t.pendingProps,
                    a = !!(128 & t.flags);
                  if (((t.flags &= -129), null === e)) {
                    if (za) {
                      if ('hidden' === r.mode)
                        return (
                          (e = vs(t, r)),
                          (t.lanes = 536870912),
                          (e.memoizedState = { baseLanes: 0, cachePool: null }),
                          hs(null, e)
                        );
                      if (
                        (di(t),
                        (e = Da)
                          ? null !==
                              (e =
                                null !== (e = Tp(e, Ba)) && '&' === e.data ? e : null) &&
                            ((t.memoizedState = {
                              dehydrated: e,
                              treeContext: null !== Ta ? { id: Na, overflow: Oa } : null,
                              retryLane: 536870912,
                              hydrationErrors: null,
                            }),
                            ((n = va(e)).return = t),
                            (t.child = n),
                            (Ra = t),
                            (Da = null))
                          : (e = null),
                        null === e)
                      )
                        throw Ua(t);
                      return (t.lanes = 536870912), null;
                    }
                    return vs(t, r);
                  }
                  var i = e.memoizedState;
                  if (null !== i) {
                    var l = i.dehydrated;
                    if ((di(t), a))
                      if (256 & t.flags) (t.flags &= -257), (t = bs(e, t, n));
                      else {
                        if (null === t.memoizedState) throw Error(o(558));
                        (t.child = e.child), (t.flags |= 128), (t = null);
                      }
                    else if (
                      (cs || no(e, t, n, !1), (a = 0 !== (n & e.childLanes)), cs || a)
                    ) {
                      if (null === ri.current) {
                        if (
                          null !== (r = Nc) &&
                          0 !== (l = Je(r, n)) &&
                          l !== i.retryLane
                        )
                          throw ((i.retryLane = l), ia(e, l), pd(r, e, l), us);
                        _d();
                      }
                      t = bs(e, t, n);
                    } else
                      (e = i.treeContext),
                        (Da = Pp(l.nextSibling)),
                        (Ra = t),
                        (za = !0),
                        (Ma = null),
                        (Ba = !1),
                        null !== e && Fa(t, e),
                        ((t = vs(t, r)).flags |= 134221824);
                    return t;
                  }
                  return (
                    ((e = pa(e.child, { mode: r.mode, children: r.children })).ref =
                      t.ref),
                    (t.child = e),
                    (e.return = t),
                    e
                  );
                })(e, t, n);
              case 22:
                return ms(e, t, n, t.pendingProps);
              case 24:
                return (
                  ao(t),
                  (r = oo(fo)),
                  null === e
                    ? (null === (a = Eo()) &&
                        ((a = Nc),
                        (i = po()),
                        (a.pooledCache = i),
                        i.refCount++,
                        null !== i && (a.pooledCacheLanes |= n),
                        (a = i)),
                      (t.memoizedState = { parent: r, cache: a }),
                      Go(t),
                      Xa(0, fo, a))
                    : (0 !== (e.lanes & n) && (qo(e, t), ei(t, null, null, n), Jo()),
                      (a = e.memoizedState),
                      (i = t.memoizedState),
                      a.parent !== r
                        ? ((a = { parent: r, cache: r }),
                          (t.memoizedState = a),
                          0 === t.lanes &&
                            (t.memoizedState = t.updateQueue.baseState = a),
                          Xa(0, fo, r))
                        : ((r = i.cache),
                          Xa(0, fo, r),
                          r !== a.cache && to(t, [fo], n, !0))),
                  ds(e, t, t.pendingProps.children, n),
                  t.child
                );
              case 30:
                return (
                  null === t.stateNode &&
                    (t.stateNode = {
                      autoName: null,
                      paired: null,
                      clones: null,
                      ref: null,
                    }),
                  null != (r = t.pendingProps).name && 'auto' !== r.name
                    ? (t.flags |= null === e ? 18882560 : 18874368)
                    : za && La(t),
                  null !== e && e.memoizedProps.name !== r.name
                    ? (t.flags |= 4194816)
                    : ws(e, t),
                  ds(e, t, r.children, n),
                  t.child
                );
              case 29:
                throw t.pendingProps;
            }
            throw Error(o(156, t.tag));
          }
          function $s(e) {
            e.flags |= 4;
          }
          function Us(e, t, n, r, a) {
            var o;
            if (
              ((o = !!(32 & e.mode)) &&
                (o =
                  null === n
                    ? rg(t, r)
                    : rg(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)),
              o)
            ) {
              if (((e.flags |= 16777216), (335544128 & a) === a))
                if (e.stateNode.complete) e.flags |= 8192;
                else {
                  if (!Sd()) throw ((Io = Oo), To);
                  e.flags |= 8192;
                }
            } else e.flags &= -16777217;
          }
          function Hs(e, t) {
            if ('stylesheet' !== t.type || 4 & t.state.loading) e.flags &= -16777217;
            else if (((e.flags |= 16777216), !ag(t))) {
              if (!Sd()) throw ((Io = Oo), To);
              e.flags |= 8192;
            }
          }
          function Vs(e, t) {
            null !== t && (e.flags |= 4),
              16384 & e.flags &&
                ((t = 22 !== e.tag ? Ye() : 536870912), (e.lanes |= t), (Hc |= t));
          }
          function Ws(e, t) {
            if (!za)
              switch (e.tailMode) {
                case 'visible':
                  break;
                case 'collapsed':
                  for (var n = e.tail, r = null; null !== n; )
                    null !== n.alternate && (r = n), (n = n.sibling);
                  null === r
                    ? t || null === e.tail
                      ? (e.tail = null)
                      : (e.tail.sibling = null)
                    : (r.sibling = null);
                  break;
                default:
                  for (t = e.tail, n = null; null !== t; )
                    null !== t.alternate && (n = t), (t = t.sibling);
                  null === n ? (e.tail = null) : (n.sibling = null);
              }
          }
          function Gs(e) {
            var t = null !== e.alternate && e.alternate.child === e.child,
              n = 0,
              r = 0;
            if (t)
              for (var a = e.child; null !== a; )
                (n |= a.lanes | a.childLanes),
                  (r |= 1206910976 & a.subtreeFlags),
                  (r |= 1206910976 & a.flags),
                  (a.return = e),
                  (a = a.sibling);
            else
              for (a = e.child; null !== a; )
                (n |= a.lanes | a.childLanes),
                  (r |= a.subtreeFlags),
                  (r |= a.flags),
                  (a.return = e),
                  (a = a.sibling);
            return (e.subtreeFlags |= r), (e.childLanes = n), t;
          }
          function qs(e, t, n) {
            var r = t.pendingProps;
            switch ((Ia(t), t.tag)) {
              case 16:
              case 15:
              case 0:
              case 11:
              case 7:
              case 8:
              case 12:
              case 9:
              case 14:
              case 1:
                return Gs(t), null;
              case 3:
                return (
                  (n = t.stateNode),
                  (r = null),
                  null !== e && (r = e.memoizedState.cache),
                  t.memoizedState.cache !== r && (t.flags |= 2048),
                  Ja(fo),
                  fe(),
                  n.pendingContext &&
                    ((n.context = n.pendingContext), (n.pendingContext = null)),
                  (null !== e && null !== e.child) ||
                    (Wa(t)
                      ? $s(t)
                      : null === e ||
                        (e.memoizedState.isDehydrated && !(256 & t.flags)) ||
                        ((t.flags |= 1024), qa())),
                  Gs(t),
                  null
                );
              case 26:
                var a = t.type,
                  i = t.memoizedState;
                return (
                  null === e
                    ? ($s(t),
                      null !== i ? (Gs(t), Hs(t, i)) : (Gs(t), Us(t, a, null, r, n)))
                    : i
                    ? i !== e.memoizedState
                      ? ($s(t), Gs(t), Hs(t, i))
                      : (Gs(t), (t.flags &= -16777217))
                    : ((e = e.memoizedProps) !== r && $s(t), Gs(t), Us(t, a, e, r, n)),
                  null
                );
              case 27:
                if (
                  (ge(t),
                  (n = ue.current),
                  (a = t.type),
                  null !== e && null != t.stateNode)
                )
                  e.memoizedProps !== r && $s(t);
                else {
                  if (!r) {
                    if (null === t.stateNode) throw Error(o(166));
                    return Gs(t), (t.subtreeFlags &= -33554433), null;
                  }
                  (e = le.current),
                    Wa(t) ? Ha(t) : ((e = Fp(a, r, n)), (t.stateNode = e), $s(t));
                }
                return Gs(t), (t.subtreeFlags &= -33554433), null;
              case 5:
                if ((ge(t), (a = t.type), null !== e && null != t.stateNode))
                  e.memoizedProps !== r && $s(t);
                else {
                  if (!r) {
                    if (null === t.stateNode) throw Error(o(166));
                    return Gs(t), (t.subtreeFlags &= -33554433), null;
                  }
                  if (((i = le.current), Wa(t))) Ha(t);
                  else {
                    var l = zf(ue.current);
                    switch (i) {
                      case 1:
                        i = l.createElementNS('http://www.w3.org/2000/svg', a);
                        break;
                      case 2:
                        i = l.createElementNS('http://www.w3.org/1998/Math/MathML', a);
                        break;
                      default:
                        switch (a) {
                          case 'svg':
                            i = l.createElementNS('http://www.w3.org/2000/svg', a);
                            break;
                          case 'math':
                            i = l.createElementNS(
                              'http://www.w3.org/1998/Math/MathML',
                              a,
                            );
                            break;
                          case 'script':
                            ((i = l.createElement('div')).innerHTML =
                              '<script></script>'),
                              (i = i.removeChild(i.firstChild));
                            break;
                          case 'select':
                            (i =
                              'string' == typeof r.is
                                ? l.createElement('select', { is: r.is })
                                : l.createElement('select')),
                              r.multiple
                                ? (i.multiple = !0)
                                : r.size && (i.size = r.size);
                            break;
                          default:
                            i =
                              'string' == typeof r.is
                                ? l.createElement(a, { is: r.is })
                                : l.createElement(a);
                        }
                    }
                    (i[ot] = t), (i[it] = r);
                    e: for (l = t.child; null !== l; ) {
                      if (5 === l.tag || 6 === l.tag) i.appendChild(l.stateNode);
                      else if (4 !== l.tag && 27 !== l.tag && null !== l.child) {
                        (l.child.return = l), (l = l.child);
                        continue;
                      }
                      if (l === t) break e;
                      for (; null === l.sibling; ) {
                        if (null === l.return || l.return === t) break e;
                        l = l.return;
                      }
                      (l.sibling.return = l.return), (l = l.sibling);
                    }
                    t.stateNode = i;
                    e: switch ((Lf(i, a, r), a)) {
                      case 'button':
                      case 'input':
                      case 'select':
                      case 'textarea':
                        r = !!r.autoFocus;
                        break e;
                      case 'img':
                        r = !0;
                        break e;
                      default:
                        r = !1;
                    }
                    r && $s(t);
                  }
                }
                return (
                  Gs(t),
                  (t.subtreeFlags &= -33554433),
                  Us(t, t.type, null === e ? null : e.memoizedProps, t.pendingProps, n),
                  null
                );
              case 6:
                if (e && null != t.stateNode) e.memoizedProps !== r && $s(t);
                else {
                  if ('string' != typeof r && null === t.stateNode) throw Error(o(166));
                  if (((e = ue.current), Wa(t))) {
                    if (
                      ((e = t.stateNode),
                      (n = t.memoizedProps),
                      (r = null),
                      null !== (a = Ra))
                    )
                      switch (a.tag) {
                        case 27:
                        case 5:
                          r = a.memoizedProps;
                      }
                    (e[ot] = t),
                      (e = !!(
                        e.nodeValue === n ||
                        (null !== r && !0 === r.suppressHydrationWarning) ||
                        Of(e.nodeValue, n)
                      )) || Ua(t, !0);
                  } else ((e = zf(e).createTextNode(r))[ot] = t), (t.stateNode = e);
                }
                return Gs(t), null;
              case 31:
                if (((n = t.memoizedState), null === e || null !== e.memoizedState)) {
                  if (((r = Wa(t)), null !== n)) {
                    if (null === e) {
                      if (!r) throw Error(o(318));
                      if (!(e = null !== (e = t.memoizedState) ? e.dehydrated : null))
                        throw Error(o(557));
                      e[ot] = t;
                    } else
                      Ga(), !(128 & t.flags) && (t.memoizedState = null), (t.flags |= 4);
                    Gs(t), (e = !1);
                  } else
                    (n = qa()),
                      null !== e &&
                        null !== e.memoizedState &&
                        (e.memoizedState.hydrationErrors = n),
                      (e = !0);
                  if (!e) return 256 & t.flags ? (gi(t), t) : (gi(t), null);
                  if (128 & t.flags) throw Error(o(558));
                }
                return Gs(t), null;
              case 13:
                if (
                  ((r = t.memoizedState),
                  null === e ||
                    (null !== e.memoizedState && null !== e.memoizedState.dehydrated))
                ) {
                  if (((a = Wa(t)), null !== r && null !== r.dehydrated)) {
                    if (null === e) {
                      if (!a) throw Error(o(318));
                      if (!(a = null !== (a = t.memoizedState) ? a.dehydrated : null))
                        throw Error(o(317));
                      a[ot] = t;
                    } else
                      Ga(), !(128 & t.flags) && (t.memoizedState = null), (t.flags |= 4);
                    Gs(t), (a = !1);
                  } else
                    (a = qa()),
                      null !== e &&
                        null !== e.memoizedState &&
                        (e.memoizedState.hydrationErrors = a),
                      (a = !0);
                  if (!a) return 256 & t.flags ? (gi(t), t) : (gi(t), null);
                }
                return (
                  gi(t),
                  128 & t.flags
                    ? ((t.lanes = n), t)
                    : ((n = null !== r),
                      (e = null !== e && null !== e.memoizedState),
                      n &&
                        ((a = null),
                        null !== (r = t.child).alternate &&
                          null !== r.alternate.memoizedState &&
                          null !== r.alternate.memoizedState.cachePool &&
                          (a = r.alternate.memoizedState.cachePool.pool),
                        (i = null),
                        null !== r.memoizedState &&
                          null !== r.memoizedState.cachePool &&
                          (i = r.memoizedState.cachePool.pool),
                        i !== a && (r.flags |= 2048)),
                      n !== e && n && (t.child.flags |= 8192),
                      Vs(t, t.updateQueue),
                      Gs(t),
                      null)
                );
              case 4:
                return (
                  fe(),
                  null === e && wf(t.stateNode.containerInfo),
                  (t.flags |= 67108864),
                  Gs(t),
                  null
                );
              case 10:
                return Ja(t.type), Gs(t), null;
              case 19:
                if ((yi(t), null === (r = t.memoizedState))) return Gs(t), null;
                if (((a = !!(128 & t.flags)), null === (i = r.rendering)))
                  if (a) Ws(r, !1);
                  else {
                    if (0 !== zc || (null !== e && 128 & e.flags))
                      for (e = t.child; null !== e; ) {
                        if (null !== (i = vi(e))) {
                          for (
                            t.flags |= 128,
                              Ws(r, !1),
                              e = i.updateQueue,
                              t.updateQueue = e,
                              Vs(t, e),
                              t.subtreeFlags = 0,
                              e = n,
                              n = t.child;
                            null !== n;

                          )
                            ga(n, e), (n = n.sibling);
                          return (
                            hi(0, (1 & mi.current) | 2),
                            za && Pa(t, r.treeForkCount),
                            t.child
                          );
                        }
                        e = e.sibling;
                      }
                    null !== r.tail &&
                      _e() > Kc &&
                      ((t.flags |= 128), (a = !0), Ws(r, !1), (t.lanes = 4194304));
                  }
                else {
                  if (!a)
                    if (null !== (e = vi(i))) {
                      if (
                        ((t.flags |= 128),
                        (a = !0),
                        (e = e.updateQueue),
                        (t.updateQueue = e),
                        Vs(t, e),
                        Ws(r, !0),
                        null === r.tail &&
                          'collapsed' !== r.tailMode &&
                          'visible' !== r.tailMode &&
                          !i.alternate &&
                          !za)
                      )
                        return Gs(t), null;
                    } else
                      2 * _e() - r.renderingStartTime > Kc &&
                        536870912 !== n &&
                        ((t.flags |= 128), (a = !0), Ws(r, !1), (t.lanes = 4194304));
                  r.isBackwards
                    ? ((i.sibling = t.child), (t.child = i))
                    : (null !== (e = r.last) ? (e.sibling = i) : (t.child = i),
                      (r.last = i));
                }
                if (null !== r.tail) {
                  e: {
                    for (n = e = r.tail; null !== n; ) {
                      if (null !== n.alternate) {
                        n = !1;
                        break e;
                      }
                      n = n.sibling;
                    }
                    n = !0;
                  }
                  return (
                    (r.rendering = e),
                    (r.tail = e.sibling),
                    (r.renderingStartTime = _e()),
                    (e.sibling = null),
                    (i = mi.current),
                    (i = a ? (1 & i) | 2 : 1 & i),
                    'visible' === r.tailMode || 'collapsed' === r.tailMode || !n || za
                      ? hi(0, i)
                      : ((n = i), ae(si, t), ae(mi, n), null === ui && (ui = t)),
                    za && Pa(t, r.treeForkCount),
                    e
                  );
                }
                return Gs(t), null;
              case 22:
              case 23:
                return (
                  gi(t),
                  li(),
                  (r = null !== t.memoizedState),
                  null !== e
                    ? (null !== e.memoizedState) !== r && (t.flags |= 8192)
                    : r && (t.flags |= 8192),
                  r
                    ? !!(536870912 & n) &&
                      !(128 & t.flags) &&
                      (Gs(t), 6 & t.subtreeFlags && (t.flags |= 8192))
                    : Gs(t),
                  null !== (n = t.updateQueue) && Vs(t, n.retryQueue),
                  (n = null),
                  null !== e &&
                    null !== e.memoizedState &&
                    null !== e.memoizedState.cachePool &&
                    (n = e.memoizedState.cachePool.pool),
                  (r = null),
                  null !== t.memoizedState &&
                    null !== t.memoizedState.cachePool &&
                    (r = t.memoizedState.cachePool.pool),
                  r !== n && (t.flags |= 2048),
                  null !== e && re(xo),
                  null
                );
              case 24:
                return (
                  (n = null),
                  null !== e && (n = e.memoizedState.cache),
                  t.memoizedState.cache !== n && (t.flags |= 2048),
                  Ja(fo),
                  Gs(t),
                  null
                );
              case 25:
                return null;
              case 30:
                return (t.flags |= 33554432), Gs(t), null;
            }
            throw Error(o(156, t.tag));
          }
          function Ys(e, t) {
            switch ((Ia(t), t.tag)) {
              case 1:
                return 65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null;
              case 3:
                return (
                  Ja(fo),
                  fe(),
                  65536 & (e = t.flags) && !(128 & e)
                    ? ((t.flags = (-65537 & e) | 128), t)
                    : null
                );
              case 26:
              case 27:
              case 5:
                return ge(t), null;
              case 31:
                if (null !== t.memoizedState) {
                  if ((gi(t), null === t.alternate)) throw Error(o(340));
                  Ga();
                }
                return 65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null;
              case 13:
                if ((gi(t), null !== (e = t.memoizedState) && null !== e.dehydrated)) {
                  if (null === t.alternate) throw Error(o(340));
                  Ga();
                }
                return 65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null;
              case 19:
                return (
                  yi(t),
                  65536 & (e = t.flags)
                    ? ((t.flags = (-65537 & e) | 128),
                      null !== (e = t.memoizedState) &&
                        ((e.rendering = null), (e.tail = null)),
                      (t.flags |= 4),
                      t)
                    : null
                );
              case 4:
                return fe(), null;
              case 10:
                return Ja(t.type), null;
              case 22:
              case 23:
                return (
                  gi(t),
                  li(),
                  null !== e && re(xo),
                  65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null
                );
              case 24:
                return Ja(fo), null;
              default:
                return null;
            }
          }
          function Ks(e, t) {
            switch ((Ia(t), t.tag)) {
              case 3:
                Ja(fo), fe();
                break;
              case 26:
              case 27:
              case 5:
                ge(t);
                break;
              case 4:
                fe();
                break;
              case 31:
                null !== t.memoizedState && gi(t);
                break;
              case 13:
                gi(t);
                break;
              case 19:
                yi(t);
                break;
              case 10:
                Ja(t.type);
                break;
              case 22:
              case 23:
                gi(t), li(), null !== e && re(xo);
                break;
              case 24:
                Ja(fo);
            }
          }
          function Qs(e, t) {
            try {
              var n = t.updateQueue,
                r = null !== n ? n.lastEffect : null;
              if (null !== r) {
                var a = r.next;
                n = a;
                do {
                  if ((n.tag & e) === e) {
                    r = void 0;
                    var o = n.create,
                      i = n.inst;
                    (r = o()), (i.destroy = r);
                  }
                  n = n.next;
                } while (n !== a);
              }
            } catch (l) {
              Vd(t, t.return, l);
            }
          }
          function Zs(e, t, n) {
            try {
              var r = t.updateQueue,
                a = null !== r ? r.lastEffect : null;
              if (null !== a) {
                var o = a.next;
                r = o;
                do {
                  if ((r.tag & e) === e) {
                    var i = r.inst,
                      l = i.destroy;
                    if (void 0 !== l) {
                      (i.destroy = void 0), (a = t);
                      var s = n,
                        u = l;
                      try {
                        u();
                      } catch (c) {
                        Vd(a, s, c);
                      }
                    }
                  }
                  r = r.next;
                } while (r !== o);
              }
            } catch (c) {
              Vd(t, t.return, c);
            }
          }
          function Xs(e) {
            var t = e.updateQueue;
            if (null !== t) {
              var n = e.stateNode;
              try {
                ni(t, n);
              } catch (r) {
                Vd(e, e.return, r);
              }
            }
          }
          function Js(e, t, n) {
            (n.props = es(e.type, e.memoizedProps)), (n.state = e.memoizedState);
            try {
              n.componentWillUnmount();
            } catch (r) {
              Vd(e, t, r);
            }
          }
          function eu(e, t) {
            try {
              var n = e.ref;
              if (null !== n) {
                switch (e.tag) {
                  case 26:
                  case 27:
                  case 5:
                    var r = e.stateNode;
                    break;
                  case 30:
                    var a = e.stateNode,
                      o = Qr(e.memoizedProps, a);
                    (null !== a.ref && a.ref.name === o) || (a.ref = ip(o)), (r = a.ref);
                    break;
                  case 7:
                    if (null === e.stateNode) {
                      var i = new lp(e);
                      f(e.child, !1, xp, i, void 0, void 0), (e.stateNode = i);
                    }
                    r = e.stateNode;
                    break;
                  default:
                    r = e.stateNode;
                }
                'function' == typeof n ? (e.refCleanup = n(r)) : (n.current = r);
              }
            } catch (l) {
              Vd(e, t, l);
            }
          }
          function tu(e, t) {
            var n = e.ref,
              r = e.refCleanup;
            if (null !== n)
              if ('function' == typeof r)
                try {
                  r();
                } catch (a) {
                  Vd(e, t, a);
                } finally {
                  (e.refCleanup = null),
                    null != (e = e.alternate) && (e.refCleanup = null);
                }
              else if ('function' == typeof n)
                try {
                  n(null);
                } catch (o) {
                  Vd(e, t, o);
                }
              else n.current = null;
          }
          function nu(e, t) {
            if (
              (5 === e.tag || 27 === e.tag || 6 === e.tag) &&
              null === e.alternate &&
              null !== t
            )
              for (var n = 0; n < t.length; n++) _p(e.stateNode, t[n]);
          }
          function ru(e) {
            for (
              var t = e.return;
              null !== t && (iu(t) && _p(e.stateNode, t.stateNode), !ou(t));

            )
              t = t.return;
          }
          function au(e) {
            for (
              var t = e.return;
              null !== t && (iu(t) && Ap(e.stateNode, t.stateNode), !ou(t));

            )
              t = t.return;
          }
          function ou(e) {
            return 5 === e.tag || 3 === e.tag || 27 === e.tag;
          }
          function iu(e) {
            return e && 7 === e.tag && null !== e.stateNode;
          }
          function lu(e) {
            var t = e.type,
              n = e.memoizedProps,
              r = e.stateNode;
            try {
              e: switch (t) {
                case 'button':
                case 'input':
                case 'select':
                case 'textarea':
                  n.autoFocus && r.focus();
                  break e;
                case 'img':
                  n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
              }
            } catch (a) {
              Vd(e, e.return, a);
            }
          }
          function su(e, t, n) {
            try {
              var r = e.stateNode;
              !(function (e, t, n, r) {
                switch (t) {
                  case 'div':
                  case 'span':
                  case 'svg':
                  case 'path':
                  case 'a':
                  case 'g':
                  case 'p':
                  case 'li':
                    break;
                  case 'input':
                    var a = null,
                      i = null,
                      l = null,
                      s = null,
                      u = null,
                      c = null,
                      d = null;
                    for (g in n) {
                      var f = n[g];
                      if (n.hasOwnProperty(g) && null != f)
                        switch (g) {
                          case 'checked':
                          case 'value':
                            break;
                          case 'defaultValue':
                            u = f;
                          default:
                            r.hasOwnProperty(g) || Pf(e, t, g, null, r, f);
                        }
                    }
                    for (var p in r) {
                      var g = r[p];
                      if (((f = n[p]), r.hasOwnProperty(p) && (null != g || null != f)))
                        switch (p) {
                          case 'type':
                            g !== f && (Tt = !0), (i = g);
                            break;
                          case 'name':
                            g !== f && (Tt = !0), (a = g);
                            break;
                          case 'checked':
                            g !== f && (Tt = !0), (c = g);
                            break;
                          case 'defaultChecked':
                            g !== f && (Tt = !0), (d = g);
                            break;
                          case 'value':
                            g !== f && (Tt = !0), (l = g);
                            break;
                          case 'defaultValue':
                            g !== f && (Tt = !0), (s = g);
                            break;
                          case 'children':
                          case 'dangerouslySetInnerHTML':
                            if (null != g) throw Error(o(137, t));
                            break;
                          default:
                            g !== f && Pf(e, t, p, g, r, f);
                        }
                    }
                    return void Mt(e, l, s, u, c, d, i, a);
                  case 'select':
                    for (i in ((g = l = s = p = null), n))
                      if (((u = n[i]), n.hasOwnProperty(i) && null != u))
                        switch (i) {
                          case 'value':
                            break;
                          case 'multiple':
                            g = u;
                          default:
                            r.hasOwnProperty(i) || Pf(e, t, i, null, r, u);
                        }
                    for (a in r)
                      if (
                        ((i = r[a]),
                        (u = n[a]),
                        r.hasOwnProperty(a) && (null != i || null != u))
                      )
                        switch (a) {
                          case 'value':
                            i !== u && (Tt = !0), (p = i);
                            break;
                          case 'defaultValue':
                            i !== u && (Tt = !0), (s = i);
                            break;
                          case 'multiple':
                            i !== u && (Tt = !0), (l = i);
                          default:
                            i !== u && Pf(e, t, a, i, r, u);
                        }
                    return (
                      (t = s),
                      (n = l),
                      (r = g),
                      void (null != p
                        ? Ut(e, !!n, p, !1)
                        : !!r != !!n &&
                          (null != t ? Ut(e, !!n, t, !0) : Ut(e, !!n, n ? [] : '', !1)))
                    );
                  case 'textarea':
                    for (s in ((g = p = null), n))
                      if (
                        ((a = n[s]),
                        n.hasOwnProperty(s) && null != a && !r.hasOwnProperty(s))
                      )
                        switch (s) {
                          case 'value':
                          case 'children':
                            break;
                          default:
                            Pf(e, t, s, null, r, a);
                        }
                    for (l in r)
                      if (
                        ((a = r[l]),
                        (i = n[l]),
                        r.hasOwnProperty(l) && (null != a || null != i))
                      )
                        switch (l) {
                          case 'value':
                            a !== i && (Tt = !0), (p = a);
                            break;
                          case 'defaultValue':
                            a !== i && (Tt = !0), (g = a);
                            break;
                          case 'children':
                            break;
                          case 'dangerouslySetInnerHTML':
                            if (null != a) throw Error(o(91));
                            break;
                          default:
                            a !== i && Pf(e, t, l, a, r, i);
                        }
                    return void Ht(e, p, g);
                  case 'option':
                    for (var m in n)
                      if (
                        ((p = n[m]),
                        n.hasOwnProperty(m) && null != p && !r.hasOwnProperty(m))
                      )
                        if ('selected' === m) e.selected = !1;
                        else Pf(e, t, m, null, r, p);
                    for (u in r)
                      if (
                        ((p = r[u]),
                        (g = n[u]),
                        r.hasOwnProperty(u) && p !== g && (null != p || null != g))
                      )
                        if ('selected' === u)
                          p !== g && (Tt = !0),
                            (e.selected =
                              p && 'function' != typeof p && 'symbol' != typeof p);
                        else Pf(e, t, u, p, r, g);
                    return;
                  case 'img':
                  case 'link':
                  case 'area':
                  case 'base':
                  case 'br':
                  case 'col':
                  case 'embed':
                  case 'hr':
                  case 'keygen':
                  case 'meta':
                  case 'param':
                  case 'source':
                  case 'track':
                  case 'wbr':
                  case 'menuitem':
                    for (var h in n)
                      (p = n[h]),
                        n.hasOwnProperty(h) &&
                          null != p &&
                          !r.hasOwnProperty(h) &&
                          Pf(e, t, h, null, r, p);
                    for (c in r)
                      if (
                        ((p = r[c]),
                        (g = n[c]),
                        r.hasOwnProperty(c) && p !== g && (null != p || null != g))
                      )
                        switch (c) {
                          case 'children':
                          case 'dangerouslySetInnerHTML':
                            if (null != p) throw Error(o(137, t));
                            break;
                          default:
                            Pf(e, t, c, p, r, g);
                        }
                    return;
                  default:
                    if (Kt(t)) {
                      for (var y in n)
                        (p = n[y]),
                          n.hasOwnProperty(y) &&
                            void 0 !== p &&
                            !r.hasOwnProperty(y) &&
                            jf(e, t, y, void 0, r, p);
                      for (d in r)
                        (p = r[d]),
                          (g = n[d]),
                          !r.hasOwnProperty(d) ||
                            p === g ||
                            (void 0 === p && void 0 === g) ||
                            jf(e, t, d, p, r, g);
                      return;
                    }
                }
                for (var v in n)
                  (p = n[v]),
                    n.hasOwnProperty(v) &&
                      null != p &&
                      !r.hasOwnProperty(v) &&
                      Pf(e, t, v, null, r, p);
                for (f in r)
                  (p = r[f]),
                    (g = n[f]),
                    !r.hasOwnProperty(f) ||
                      p === g ||
                      (null == p && null == g) ||
                      Pf(e, t, f, p, r, g);
              })(r, e.type, n, t),
                (r[it] = t);
            } catch (a) {
              Vd(e, e.return, a);
            }
          }
          function uu(e) {
            return (
              5 === e.tag ||
              3 === e.tag ||
              26 === e.tag ||
              (27 === e.tag && Qf(e.type)) ||
              4 === e.tag
            );
          }
          function cu(e) {
            e: for (;;) {
              for (; null === e.sibling; ) {
                if (null === e.return || uu(e.return)) return null;
                e = e.return;
              }
              for (
                e.sibling.return = e.return, e = e.sibling;
                5 !== e.tag && 6 !== e.tag && 18 !== e.tag;

              ) {
                if (27 === e.tag && Qf(e.type)) continue e;
                if (2 & e.flags) continue e;
                if (null === e.child || 4 === e.tag) continue e;
                (e.child.return = e), (e = e.child);
              }
              if (!(2 & e.flags)) return e.stateNode;
            }
          }
          function du(e, t, n, r) {
            var a = e.tag;
            if (5 === a || 6 === a)
              (a = e.stateNode),
                t
                  ? (9 === n.nodeType
                      ? n.body
                      : 'HTML' === n.nodeName
                      ? n.ownerDocument.body
                      : n
                    ).insertBefore(a, t)
                  : ((t =
                      9 === n.nodeType
                        ? n.body
                        : 'HTML' === n.nodeName
                        ? n.ownerDocument.body
                        : n).appendChild(a),
                    null != (n = n._reactRootContainer) ||
                      null !== t.onclick ||
                      (t.onclick = Jt)),
                nu(e, r),
                (Tt = !0);
            else if (
              4 !== a &&
              (27 === a &&
                (nu(e, r), (r = null), Qf(e.type) && ((n = e.stateNode), (t = null))),
              null !== (e = e.child))
            )
              for (du(e, t, n, r), e = e.sibling; null !== e; )
                du(e, t, n, r), (e = e.sibling);
          }
          function fu(e, t, n, r) {
            var a = e.tag;
            if (5 === a || 6 === a)
              (a = e.stateNode),
                t ? n.insertBefore(a, t) : n.appendChild(a),
                nu(e, r),
                (Tt = !0);
            else if (
              4 !== a &&
              (27 === a && (nu(e, r), (r = null), Qf(e.type) && (n = e.stateNode)),
              null !== (e = e.child))
            )
              for (fu(e, t, n, r), e = e.sibling; null !== e; )
                fu(e, t, n, r), (e = e.sibling);
          }
          function pu(e) {
            var t = e.stateNode,
              n = e.memoizedProps;
            try {
              for (var r = e.type, a = t.attributes; a.length; )
                t.removeAttributeNode(a[0]);
              Lf(t, r, n), (t[ot] = e), (t[it] = n);
            } catch (o) {
              Vd(e, e.return, o);
            }
          }
          var gu = !1,
            mu = null;
          function hu(e) {
            (30 === e.tag || 33554432 & e.subtreeFlags) && (gu = !0);
          }
          var yu = null;
          function vu() {
            var e = yu;
            return (yu = null), e;
          }
          var bu = 0;
          function wu(e, t, n, r, a) {
            return (bu = 0), ku(e.child, t, n, r, a);
          }
          function ku(e, t, n, r, a) {
            for (var o = !1; null !== e; ) {
              if (5 === e.tag) {
                var i = e.stateNode;
                if (null !== r) {
                  var l = np(i);
                  r.push(l), l.view && (o = !0);
                } else o || (np(i).view && (o = !0));
                (gu = !0), Jf(i, 0 === bu ? t : t + '_' + bu, n), bu++;
              } else
                (22 === e.tag && null !== e.memoizedState) ||
                  (30 === e.tag && a) ||
                  (ku(e.child, t, n, r, a) && (o = !0));
              e = e.sibling;
            }
            return o;
          }
          function Su(e, t) {
            for (; null !== e; )
              5 === e.tag
                ? ep(e.stateNode, e.memoizedProps)
                : (22 === e.tag && null !== e.memoizedState) ||
                  (30 === e.tag && t) ||
                  Su(e.child, t),
                (e = e.sibling);
          }
          function xu(e) {
            if (18874368 & e.subtreeFlags)
              for (e = e.child; null !== e; ) {
                if (
                  (22 !== e.tag || null === e.memoizedState) &&
                  (xu(e), 30 === e.tag && 18874368 & e.flags && e.stateNode.paired)
                ) {
                  var t = e.memoizedProps;
                  if (null == t.name || 'auto' === t.name) throw Error(o(544));
                  var n = t.name;
                  'none' !== (t = Xr(t.default, t.share)) &&
                    (wu(e, n, t, null, !1) || Su(e.child, !1));
                }
                e = e.sibling;
              }
          }
          function Eu(e, t) {
            if (30 === e.tag) {
              var n = e.stateNode,
                r = e.memoizedProps,
                a = Qr(r, n),
                o = Xr(r.default, n.paired ? r.share : r.enter);
              'none' !== o
                ? wu(e, a, o, null, !1)
                  ? (xu(e), n.paired || t || fd(e, r.onEnter))
                  : Su(e.child, !1)
                : xu(e);
            } else if (33554432 & e.subtreeFlags)
              for (e = e.child; null !== e; ) Eu(e, t), (e = e.sibling);
            else xu(e);
          }
          function _u(e) {
            if (null !== mu && 0 !== mu.size) {
              var t = mu;
              if (18874368 & e.subtreeFlags)
                for (e = e.child; null !== e; ) {
                  if (22 !== e.tag || null === e.memoizedState) {
                    if (30 === e.tag && 18874368 & e.flags) {
                      var n = e.memoizedProps,
                        r = n.name;
                      if (null != r && 'auto' !== r) {
                        var a = t.get(r);
                        if (void 0 !== a) {
                          var o = Xr(n.default, n.share);
                          if (
                            ('none' !== o &&
                              (wu(e, r, o, null, !1)
                                ? ((o = e.stateNode),
                                  (a.paired = o),
                                  (o.paired = a),
                                  fd(e, n.onShare))
                                : Su(e.child, !1)),
                            t.delete(r),
                            0 === t.size)
                          )
                            break;
                        }
                      }
                    }
                    _u(e);
                  }
                  e = e.sibling;
                }
            }
          }
          function Au(e) {
            if (30 === e.tag) {
              var t = e.memoizedProps,
                n = Qr(t, e.stateNode),
                r = null !== mu ? mu.get(n) : void 0,
                a = Xr(t.default, void 0 !== r ? t.share : t.exit);
              'none' !== a &&
                (wu(e, n, a, null, !1)
                  ? void 0 !== r
                    ? ((a = e.stateNode),
                      (r.paired = a),
                      (a.paired = r),
                      mu.delete(n),
                      fd(e, t.onShare))
                    : fd(e, t.onExit)
                  : Su(e.child, !1)),
                null !== mu && _u(e);
            } else if (33554432 & e.subtreeFlags)
              for (e = e.child; null !== e; ) Au(e), (e = e.sibling);
            else null !== mu && _u(e);
          }
          function Cu(e) {
            for (e = e.child; null !== e; ) {
              if (30 === e.tag) {
                var t = e.memoizedProps,
                  n = Qr(t, e.stateNode);
                (t = Xr(t.default, t.update)),
                  (e.flags &= -5),
                  'none' !== t && wu(e, n, t, (e.memoizedState = []), !1);
              } else 33554432 & e.subtreeFlags && Cu(e);
              e = e.sibling;
            }
          }
          function Tu(e) {
            if (18874368 & e.subtreeFlags)
              for (e = e.child; null !== e; ) {
                if (22 !== e.tag || null === e.memoizedState) {
                  if (30 === e.tag && 18874368 & e.flags) {
                    var t = e.stateNode;
                    null !== t.paired && ((t.paired = null), Su(e.child, !1));
                  }
                  Tu(e);
                }
                e = e.sibling;
              }
          }
          function Nu(e) {
            if (30 === e.tag) (e.stateNode.paired = null), Su(e.child, !1), Tu(e);
            else if (33554432 & e.subtreeFlags)
              for (e = e.child; null !== e; ) Nu(e), (e = e.sibling);
            else Tu(e);
          }
          function Ou(e) {
            for (e = e.child; null !== e; )
              30 === e.tag ? Su(e.child, !1) : !!(33554432 & e.subtreeFlags) && Ou(e),
                (e = e.sibling);
          }
          function Pu(e, t, n, r, a, o, i) {
            for (var l = !1; null !== t; ) {
              if (5 === t.tag) {
                var s = t.stateNode;
                if (null !== o && bu < o.length) {
                  var u,
                    c = o[bu],
                    d = np(s);
                  if (((c.view || d.view) && (l = !0), (u = !(4 & e.flags))))
                    if (d.clip) u = !0;
                    else {
                      u = c.rect;
                      var f = d.rect;
                      u =
                        u.y !== f.y ||
                        u.x !== f.x ||
                        u.height !== f.height ||
                        u.width !== f.width;
                    }
                  u && (e.flags |= 4),
                    d.abs
                      ? (d = !c.abs)
                      : ((c = c.rect),
                        (d = d.rect),
                        (d = c.height !== d.height || c.width !== d.width)),
                    d && (e.flags |= 32);
                } else e.flags |= 32;
                4 & e.flags && Jf(s, 0 === bu ? n : n + '_' + bu, a),
                  (l && 4 & e.flags) ||
                    (null === yu && (yu = []),
                    yu.push(s, 0 === bu ? r : r + '_' + bu, t.memoizedProps)),
                  bu++;
              } else
                (22 === t.tag && null !== t.memoizedState) ||
                  (30 === t.tag && i
                    ? (e.flags |= 32 & t.flags)
                    : Pu(e, t.child, n, r, a, o, i) && (l = !0));
              t = t.sibling;
            }
            return l;
          }
          function ju(e, t) {
            for (e = e.child; null !== e; ) {
              if (30 === e.tag) {
                var n = e.memoizedProps,
                  r = e.stateNode,
                  a = Qr(n, r),
                  o = Xr(n.default, n.update);
                if (t) var i = null === (r = r.clones) ? null : r.map(rp);
                else (i = e.memoizedState), (e.memoizedState = null);
                r = e;
                var l = e.child;
                (bu = 0),
                  (a = Pu(r, l, a, a, o, i, !1)),
                  4 & e.flags && a && (t || fd(e, n.onUpdate));
              } else 33554432 & e.subtreeFlags && ju(e, t);
              e = e.sibling;
            }
          }
          var Lu = !1,
            Iu = !1,
            Fu = !1,
            Ru = !1,
            Du = 'function' == typeof WeakSet ? WeakSet : Set,
            zu = null,
            Mu = !1,
            Bu = !1,
            $u = !1,
            Uu = !1;
          function Hu(e) {
            for (; null !== zu; ) {
              var t = zu,
                n = e,
                r = t.alternate,
                a = t.flags;
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                case 5:
                case 26:
                case 27:
                case 6:
                case 4:
                case 17:
                  break;
                case 1:
                  if (1024 & a && null !== r) {
                    (n = void 0), (a = r.memoizedProps), (r = r.memoizedState);
                    var i = t.stateNode;
                    try {
                      var l = es(t.type, a);
                      (n = i.getSnapshotBeforeUpdate(l, r)),
                        (i.__reactInternalSnapshotBeforeUpdate = n);
                    } catch (s) {
                      Vd(t, t.return, s);
                    }
                  }
                  break;
                case 3:
                  if (1024 & a)
                    if (9 === (n = (r = t.stateNode.containerInfo).nodeType)) Cp(r);
                    else if (1 === n)
                      switch (r.nodeName) {
                        case 'HEAD':
                        case 'HTML':
                        case 'BODY':
                          Cp(r);
                          break;
                        default:
                          r.textContent = '';
                      }
                  break;
                case 30:
                  n &&
                    null !== r &&
                    ((n = Qr(r.memoizedProps, r.stateNode)),
                    'none' !== (a = Xr((a = t.memoizedProps).default, a.update)) &&
                      wu(r, n, a, (r.memoizedState = []), !0));
                  break;
                default:
                  if (1024 & a) throw Error(o(163));
              }
              if (null !== (r = t.sibling)) {
                (r.return = t.return), (zu = r);
                break;
              }
              zu = t.return;
            }
          }
          function Vu(e, t, n) {
            var r = n.flags;
            switch (n.tag) {
              case 0:
              case 11:
              case 15:
                uc(e, n), 4 & r && Qs(5, n);
                break;
              case 1:
                if ((uc(e, n), 4 & r))
                  if (((e = n.stateNode), null === t))
                    try {
                      e.componentDidMount();
                    } catch (i) {
                      Vd(n, n.return, i);
                    }
                  else {
                    var a = es(n.type, t.memoizedProps);
                    t = t.memoizedState;
                    try {
                      e.componentDidUpdate(a, t, e.__reactInternalSnapshotBeforeUpdate);
                    } catch (l) {
                      Vd(n, n.return, l);
                    }
                  }
                64 & r && Xs(n), 512 & r && eu(n, n.return);
                break;
              case 3:
                if ((uc(e, n), 64 & r && null !== (e = n.updateQueue))) {
                  if (((t = null), null !== n.child))
                    switch (n.child.tag) {
                      case 27:
                      case 5:
                      case 1:
                        t = n.child.stateNode;
                    }
                  try {
                    ni(e, t);
                  } catch (i) {
                    Vd(n, n.return, i);
                  }
                }
                break;
              case 27:
                null === t && 4 & r && pu(n);
              case 26:
              case 5:
                uc(e, n), null === t && 4 & r && lu(n), 512 & r && eu(n, n.return);
                break;
              case 12:
                uc(e, n);
                break;
              case 31:
                uc(e, n), 4 & r && Ju(e, n);
                break;
              case 13:
                uc(e, n),
                  4 & r && ec(e, n),
                  64 & r &&
                    null !== (e = n.memoizedState) &&
                    null !== (e = e.dehydrated) &&
                    (function (e, t) {
                      var n = e.ownerDocument;
                      if ('$~' === e.data) e._reactRetry = t;
                      else if ('$?' !== e.data || 'loading' !== n.readyState) t();
                      else {
                        var r = function () {
                          t(), n.removeEventListener('DOMContentLoaded', r);
                        };
                        n.addEventListener('DOMContentLoaded', r), (e._reactRetry = r);
                      }
                    })(e, (n = Yd.bind(null, n)));
                break;
              case 22:
                if (!(r = null !== n.memoizedState || Lu)) {
                  var o = (null !== t && null !== t.memoizedState) || Iu;
                  (t = Lu),
                    (a = Iu),
                    (Lu = r),
                    (Iu = o) && !a
                      ? ((r = 2), !!(8772 & n.subtreeFlags) && (r |= 1), dc(e, n, r))
                      : uc(e, n),
                    (Lu = t),
                    (Iu = a);
                }
                break;
              case 30:
                uc(e, n), 512 & r && eu(n, n.return);
                break;
              case 7:
                512 & r && eu(n, n.return);
              default:
                uc(e, n);
            }
          }
          function Wu(e, t) {
            for (e = e.child; null !== e; ) Gu(e, t), (e = e.sibling);
          }
          function Gu(e, t) {
            switch (e.tag) {
              case 5:
              case 26:
                try {
                  var n = e.stateNode;
                  if (t) {
                    var r = n.style;
                    'function' == typeof r.setProperty
                      ? r.setProperty('display', 'none', 'important')
                      : (r.display = 'none');
                  } else {
                    var a = e.stateNode,
                      o = e.memoizedProps.style,
                      i = null != o && o.hasOwnProperty('display') ? o.display : null;
                    a.style.display =
                      null == i || 'boolean' == typeof i ? '' : ('' + i).trim();
                  }
                } catch (s) {
                  Vd(e, e.return, s);
                }
                qu(e, t);
                break;
              case 6:
                try {
                  (e.stateNode.nodeValue = t ? '' : e.memoizedProps), (Tt = !0);
                } catch (s) {
                  Vd(e, e.return, s);
                }
                break;
              case 18:
                try {
                  var l = e.stateNode;
                  t ? Xf(l, !0) : Xf(e.stateNode, !1);
                } catch (s) {
                  Vd(e, e.return, s);
                }
                break;
              case 22:
              case 23:
                null === e.memoizedState && Wu(e, t);
                break;
              default:
                Wu(e, t);
            }
          }
          function qu(e, t) {
            if (67108864 & e.subtreeFlags)
              for (e = e.child; null !== e; ) {
                e: {
                  var n = e,
                    r = t;
                  switch (n.tag) {
                    case 4:
                      Gu(n, r);
                      break e;
                    case 22:
                      null === n.memoizedState && qu(n, r);
                      break e;
                    default:
                      qu(n, r);
                  }
                }
                e = e.sibling;
              }
          }
          function Yu(e) {
            var t = e.alternate;
            null !== t && ((e.alternate = null), Yu(t)),
              (e.child = null),
              (e.deletions = null),
              (e.sibling = null),
              5 === e.tag && null !== (t = e.stateNode) && gt(t),
              (e.stateNode = null),
              (e.return = null),
              (e.dependencies = null),
              (e.memoizedProps = null),
              (e.memoizedState = null),
              (e.pendingProps = null),
              (e.stateNode = null),
              (e.updateQueue = null);
          }
          var Ku = null,
            Qu = !1;
          function Zu(e, t, n) {
            for (n = n.child; null !== n; ) Xu(e, t, n), (n = n.sibling);
          }
          function Xu(e, t, n) {
            if (Fe && 'function' == typeof Fe.onCommitFiberUnmount)
              try {
                Fe.onCommitFiberUnmount(Ie, n);
              } catch (o) {}
            switch (n.tag) {
              case 26:
                Iu || tu(n, t),
                  Zu(e, t, n),
                  n.memoizedState
                    ? n.memoizedState.count--
                    : n.stateNode && !Iu && (n = n.stateNode).parentNode.removeChild(n);
                break;
              case 27:
                Iu || tu(n, t), au(n);
                var r = Ku,
                  a = Qu;
                Qf(n.type) && ((Ku = n.stateNode), (Qu = !1)),
                  Zu(e, t, n),
                  Rp(n.stateNode, n.type, n.memoizedProps),
                  (Ku = r),
                  (Qu = a);
                break;
              case 5:
                Iu || tu(n, t), au(n);
              case 6:
                if (
                  (6 === n.tag && au(n),
                  (r = Ku),
                  (a = Qu),
                  (Ku = null),
                  Zu(e, t, n),
                  (Qu = a),
                  null !== (Ku = r))
                )
                  if (Qu)
                    try {
                      (9 === Ku.nodeType
                        ? Ku.body
                        : 'HTML' === Ku.nodeName
                        ? Ku.ownerDocument.body
                        : Ku
                      ).removeChild(n.stateNode),
                        (Tt = !0);
                    } catch (i) {
                      Vd(n, t, i);
                    }
                  else
                    try {
                      Ku.removeChild(n.stateNode), (Tt = !0);
                    } catch (i) {
                      Vd(n, t, i);
                    }
                break;
              case 18:
                null !== Ku &&
                  (Qu
                    ? (Zf(
                        9 === (e = Ku).nodeType
                          ? e.body
                          : 'HTML' === e.nodeName
                          ? e.ownerDocument.body
                          : e,
                        n.stateNode,
                      ),
                      Yg(e))
                    : Zf(Ku, n.stateNode));
                break;
              case 4:
                (r = Ku),
                  (a = Qu),
                  (Ku = n.stateNode.containerInfo),
                  (Qu = !0),
                  Zu(e, t, n),
                  (Ku = r),
                  (Qu = a);
                break;
              case 0:
              case 11:
              case 14:
              case 15:
                Zs(2, n, t), Iu || Zs(4, n, t), Zu(e, t, n);
                break;
              case 1:
                Iu ||
                  (tu(n, t),
                  'function' == typeof (r = n.stateNode).componentWillUnmount &&
                    Js(n, t, r)),
                  Zu(e, t, n);
                break;
              case 21:
                Zu(e, t, n);
                break;
              case 22:
                (Iu = (r = Iu) || null !== n.memoizedState), Zu(e, t, n), (Iu = r);
                break;
              case 30:
                tu(n, t), Zu(e, t, n);
                break;
              case 7:
                Iu || tu(n, t), Zu(e, t, n);
                break;
              default:
                Zu(e, t, n);
            }
          }
          function Ju(e, t) {
            if (
              null === t.memoizedState &&
              null !== (e = t.alternate) &&
              null !== (e = e.memoizedState)
            ) {
              e = e.dehydrated;
              try {
                Yg(e);
              } catch (n) {
                Vd(t, t.return, n);
              }
            }
          }
          function ec(e, t) {
            if (
              null === t.memoizedState &&
              null !== (e = t.alternate) &&
              null !== (e = e.memoizedState) &&
              null !== (e = e.dehydrated)
            )
              try {
                Yg(e);
              } catch (n) {
                Vd(t, t.return, n);
              }
          }
          function tc(e, t) {
            var n = (function (e) {
              switch (e.tag) {
                case 31:
                case 13:
                case 19:
                  var t = e.stateNode;
                  return null === t && (t = e.stateNode = new Du()), t;
                case 22:
                  return (
                    null === (t = (e = e.stateNode)._retryCache) &&
                      (t = e._retryCache = new Du()),
                    t
                  );
                default:
                  throw Error(o(435, e.tag));
              }
            })(e);
            t.forEach(function (t) {
              if (!n.has(t)) {
                n.add(t);
                var r = Kd.bind(null, e, t);
                t.then(r, r);
              }
            });
          }
          function nc(e, t, n) {
            var r = t.deletions;
            if (null !== r)
              for (var a = 0; a < r.length; a++) {
                var i = r[a],
                  l = e,
                  s = t,
                  u = s;
                e: for (; null !== u; ) {
                  switch (u.tag) {
                    case 27:
                      if (Qf(u.type)) {
                        (Ku = u.stateNode), (Qu = !1);
                        break e;
                      }
                      break;
                    case 5:
                      (Ku = u.stateNode), (Qu = !1);
                      break e;
                    case 3:
                    case 4:
                      (Ku = u.stateNode.containerInfo), (Qu = !0);
                      break e;
                  }
                  u = u.return;
                }
                if (null === Ku) throw Error(o(160));
                Xu(l, s, i),
                  (Ku = null),
                  (Qu = !1),
                  null !== (l = i.alternate) && (l.return = null),
                  (i.return = null);
              }
            if (13886 & t.subtreeFlags)
              for (t = t.child; null !== t; ) ac(t, e, n), (t = t.sibling);
          }
          var rc = null;
          function ac(e, t, n) {
            var r = e.alternate,
              a = e.flags;
            switch (e.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                if (
                  4 & a &&
                  null !== (r = null !== (r = e.updateQueue) ? r.events : null)
                )
                  for (var i = 0; i < r.length; i++) {
                    var l = r[i];
                    l.ref.impl = l.nextImpl;
                  }
                nc(t, e, n),
                  oc(e),
                  4 & a && (Zs(3, e, e.return), Qs(3, e), Zs(5, e, e.return));
                break;
              case 1:
                nc(t, e, n),
                  oc(e),
                  512 & a && (Iu || null === r || tu(r, r.return)),
                  64 & a &&
                    Lu &&
                    null !== (e = e.updateQueue) &&
                    null !== (t = e.callbacks) &&
                    ((n = e.shared.hiddenCallbacks),
                    (e.shared.hiddenCallbacks = null === n ? t : n.concat(t)));
                break;
              case 26:
                if (
                  ((i = rc),
                  nc(t, e, n),
                  oc(e),
                  512 & a && (Iu || null === r || tu(r, r.return)),
                  4 & a)
                )
                  if (
                    ((a = null !== r ? r.memoizedState : null),
                    (n = e.memoizedState),
                    null === r)
                  )
                    if (null === n)
                      if (null === e.stateNode)
                        if (Lu)
                          e.stateNode = $f(e.type, e.memoizedProps, t.containerInfo, e);
                        else {
                          e: {
                            (t = e.type),
                              (n = e.memoizedProps),
                              (a = i.ownerDocument || i);
                            t: switch (t) {
                              case 'title':
                                (!(r = a.getElementsByTagName('title')[0]) ||
                                  r[ft] ||
                                  r[ot] ||
                                  'http://www.w3.org/2000/svg' === r.namespaceURI ||
                                  r.hasAttribute('itemprop')) &&
                                  ((r = a.createElement(t)),
                                  a.head.insertBefore(
                                    r,
                                    a.querySelector('head > title'),
                                  )),
                                  Lf(r, t, n),
                                  (r[ot] = e),
                                  bt(r),
                                  (t = r);
                                break e;
                              case 'link':
                                if ((i = tg('link', 'href', a).get(t + (n.href || ''))))
                                  for (l = 0; l < i.length; l++)
                                    if (
                                      (r = i[l]).getAttribute('href') ===
                                        (null == n.href || '' === n.href
                                          ? null
                                          : n.href) &&
                                      r.getAttribute('rel') ===
                                        (null == n.rel ? null : n.rel) &&
                                      r.getAttribute('title') ===
                                        (null == n.title ? null : n.title) &&
                                      r.getAttribute('crossorigin') ===
                                        (null == n.crossOrigin ? null : n.crossOrigin)
                                    ) {
                                      i.splice(l, 1);
                                      break t;
                                    }
                                Lf((r = a.createElement(t)), t, n), a.head.appendChild(r);
                                break;
                              case 'meta':
                                if (
                                  (i = tg('meta', 'content', a).get(
                                    t + (n.content || ''),
                                  ))
                                )
                                  for (l = 0; l < i.length; l++)
                                    if (
                                      (r = i[l]).getAttribute('content') ===
                                        (null == n.content ? null : '' + n.content) &&
                                      r.getAttribute('name') ===
                                        (null == n.name ? null : n.name) &&
                                      r.getAttribute('property') ===
                                        (null == n.property ? null : n.property) &&
                                      r.getAttribute('http-equiv') ===
                                        (null == n.httpEquiv ? null : n.httpEquiv) &&
                                      r.getAttribute('charset') ===
                                        (null == n.charSet ? null : n.charSet)
                                    ) {
                                      i.splice(l, 1);
                                      break t;
                                    }
                                Lf((r = a.createElement(t)), t, n), a.head.appendChild(r);
                                break;
                              default:
                                throw Error(o(468, t));
                            }
                            (r[ot] = e), bt(r), (t = r);
                          }
                          e.stateNode = t;
                        }
                      else Lu || ng(i, e.type, e.stateNode);
                    else e.stateNode = Qp(i, n, e.memoizedProps);
                  else
                    a !== n
                      ? (null === a
                          ? null === (t = r.stateNode) ||
                            Iu ||
                            t.parentNode.removeChild(t)
                          : a.count--,
                        null === n
                          ? Lu || ng(i, e.type, e.stateNode)
                          : Qp(i, n, e.memoizedProps))
                      : null === n &&
                        null !== e.stateNode &&
                        su(e, e.memoizedProps, r.memoizedProps);
                break;
              case 27:
                nc(t, e, n),
                  oc(e),
                  512 & a && (Iu || null === r || tu(r, r.return)),
                  null !== r && 4 & a && su(e, e.memoizedProps, r.memoizedProps);
                break;
              case 5:
                if (
                  ((i = Fu),
                  (Fu = !1),
                  nc(t, e, n),
                  (Fu = i),
                  oc(e),
                  512 & a && (Iu || null === r || tu(r, r.return)),
                  32 & e.flags)
                ) {
                  t = e.stateNode;
                  try {
                    Wt(t, ''), (Tt = !0);
                  } catch (d) {
                    Vd(e, e.return, d);
                  }
                }
                4 & a &&
                  null != e.stateNode &&
                  su(e, (t = e.memoizedProps), null !== r ? r.memoizedProps : t),
                  1024 & a && (Ru = !0);
                break;
              case 6:
                if ((nc(t, e, n), oc(e), 4 & a)) {
                  if (null === e.stateNode) throw Error(o(162));
                  (t = e.memoizedProps), (n = e.stateNode);
                  try {
                    (n.nodeValue = t), (Tt = !0);
                  } catch (d) {
                    Vd(e, e.return, d);
                  }
                }
                break;
              case 3:
                if (
                  ((Tt = !1),
                  (eg = null),
                  (i = rc),
                  (rc = Bp(t.containerInfo)),
                  nc(t, e, n),
                  (rc = i),
                  oc(e),
                  4 & a && null !== r && r.memoizedState.isDehydrated)
                )
                  try {
                    Yg(t.containerInfo);
                  } catch (d) {
                    Vd(e, e.return, d);
                  }
                Ru && ((Ru = !1), ic(e)), (Tt = !1);
                break;
              case 4:
                (a = Fu),
                  (Fu = Lu),
                  (r = Nt()),
                  (i = rc),
                  (rc = Bp(e.stateNode.containerInfo)),
                  nc(t, e, n),
                  oc(e),
                  (rc = i),
                  Tt && Bu && ($u = !0),
                  (Tt = r),
                  (Fu = a);
                break;
              case 12:
                nc(t, e, n), oc(e);
                break;
              case 31:
                nc(t, e, n),
                  oc(e),
                  4 & a &&
                    null !== (t = e.updateQueue) &&
                    ((e.updateQueue = null), tc(e, t));
                break;
              case 13:
                nc(t, e, n),
                  oc(e),
                  8192 & e.child.flags &&
                    (null !== e.memoizedState) !=
                      (null !== r && null !== r.memoizedState) &&
                    (qc = _e()),
                  4 & a &&
                    null !== (t = e.updateQueue) &&
                    ((e.updateQueue = null), tc(e, t));
                break;
              case 22:
                (i = null !== e.memoizedState),
                  (l = null !== r && null !== r.memoizedState);
                var s = Lu,
                  u = Iu,
                  c = Fu;
                (Lu = s || i),
                  (Fu = c || i),
                  (Iu = u || l),
                  nc(t, e, n),
                  (Iu = u),
                  (Fu = c),
                  (Lu = s),
                  oc(e),
                  8192 & a &&
                    (((t = e.stateNode)._visibility = i
                      ? -2 & t._visibility
                      : 1 | t._visibility),
                    !i ||
                      null === r ||
                      l ||
                      Lu ||
                      Iu ||
                      ((n = Lu),
                      (r = Iu),
                      (Lu = i || Lu),
                      (Iu = t = l || Iu),
                      cc(e, 2),
                      (Lu = n),
                      (Iu = r)),
                    (!i && Fu) || Wu(e, i)),
                  4 & a &&
                    null !== (t = e.updateQueue) &&
                    null !== (n = t.retryQueue) &&
                    ((t.retryQueue = null), tc(e, n));
                break;
              case 19:
                nc(t, e, n),
                  oc(e),
                  4 & a &&
                    null !== (t = e.updateQueue) &&
                    ((e.updateQueue = null), tc(e, t));
                break;
              case 30:
                512 & a && (Iu || null === r || tu(r, r.return)),
                  (a = Nt()),
                  (i = Bu),
                  (l = (335544064 & n) === n),
                  (s = e.memoizedProps),
                  (Bu = l && 'none' !== Xr(s.default, s.update)),
                  nc(t, e, n),
                  oc(e),
                  l && null !== r && Tt && (e.flags |= 4),
                  (Bu = i),
                  (Tt = a);
                break;
              case 21:
                break;
              case 7:
                512 & a && (Iu || null === r || tu(r, r.return)),
                  r && null !== r.stateNode && (r.stateNode._fragmentFiber = e);
              default:
                nc(t, e, n), oc(e);
            }
          }
          function oc(e) {
            var t = e.flags;
            if (2 & t) {
              try {
                for (var n, r = e.return; null !== r; ) {
                  if (uu(r)) {
                    n = r;
                    break;
                  }
                  r = r.return;
                }
                r = null;
                for (var a = e.return; null !== a; ) {
                  if (iu(a)) {
                    var i = a.stateNode;
                    null === r ? (r = [i]) : r.push(i);
                  }
                  if (ou(a)) break;
                  a = a.return;
                }
                var l = r;
                if (null == n) throw Error(o(160));
                switch (n.tag) {
                  case 27:
                    var s = n.stateNode;
                    fu(e, cu(e), s, l);
                    break;
                  case 5:
                    var u = n.stateNode;
                    32 & n.flags && (Wt(u, ''), (n.flags &= -33)), fu(e, cu(e), u, l);
                    break;
                  case 3:
                  case 4:
                    var c = n.stateNode.containerInfo;
                    du(e, cu(e), c, l);
                    break;
                  default:
                    throw Error(o(161));
                }
              } catch (d) {
                Vd(e, e.return, d);
              }
              e.flags &= -3;
            }
            4096 & t && (e.flags &= -4097);
          }
          function ic(e) {
            if (1024 & e.subtreeFlags)
              for (e = e.child; null !== e; ) {
                var t = e;
                ic(t),
                  5 === t.tag &&
                    1024 & t.flags &&
                    ((t = t.stateNode), (xg = !0), t.reset(), (xg = !1)),
                  (e = e.sibling);
              }
          }
          function lc(e, t) {
            if (9270 & t.subtreeFlags)
              for (t = t.child; null !== t; ) sc(t, e), (t = t.sibling);
            else ju(t, !1);
          }
          function sc(e, t) {
            var n = e.alternate;
            if (null === n) Eu(e, !1);
            else
              switch (e.tag) {
                case 3:
                  if (((Uu = Mu = !1), vu(), lc(t, e), !Mu && !$u)) {
                    if (null !== (e = yu))
                      for (var r = 0; r < e.length; r += 3) {
                        n = e[r];
                        var a = e[r + 1];
                        ep(n, e[r + 2]),
                          null !== (n = n.ownerDocument.documentElement) &&
                            n.animate(
                              { opacity: [0, 0], pointerEvents: ['none', 'none'] },
                              {
                                duration: 0,
                                fill: 'forwards',
                                pseudoElement: '::view-transition-group(' + a + ')',
                              },
                            );
                      }
                    null !==
                      (e =
                        9 === (e = t.containerInfo).nodeType
                          ? e.documentElement
                          : e.ownerDocument.documentElement) &&
                      '' === e.style.viewTransitionName &&
                      ((e.style.viewTransitionName = 'none'),
                      e.animate(
                        { opacity: [0, 0], pointerEvents: ['none', 'none'] },
                        {
                          duration: 0,
                          fill: 'forwards',
                          pseudoElement: '::view-transition-group(root)',
                        },
                      ),
                      e.animate(
                        { width: [0, 0], height: [0, 0] },
                        {
                          duration: 0,
                          fill: 'forwards',
                          pseudoElement: '::view-transition',
                        },
                      )),
                      (Uu = !0);
                  }
                  yu = null;
                  break;
                case 5:
                default:
                  lc(t, e);
                  break;
                case 4:
                  (r = Mu), (Mu = !1), lc(t, e), Mu && ($u = !0), (Mu = r);
                  break;
                case 22:
                  null === e.memoizedState &&
                    (null !== n.memoizedState ? Eu(e, !1) : lc(t, e));
                  break;
                case 30:
                  (r = Mu), (a = vu()), (Mu = !1), lc(t, e), Mu && (e.flags |= 4);
                  var o = e.memoizedProps,
                    i = e.stateNode;
                  (t = Qr(o, i)), (i = Qr(n.memoizedProps, i));
                  var l = Xr(o.default, o.update);
                  'none' === l
                    ? (t = !1)
                    : ((o = n.memoizedState),
                      (n.memoizedState = null),
                      (n = e.child),
                      (bu = 0),
                      (t = Pu(e, n, t, i, l, o, !0)),
                      bu !== (null === o ? 0 : o.length) && (e.flags |= 32)),
                    4 & e.flags && t
                      ? (fd(e, e.memoizedProps.onUpdate), (yu = a))
                      : null !== a && (a.push.apply(a, yu), (yu = a)),
                    (Mu = !!(32 & e.flags) || r);
              }
          }
          function uc(e, t) {
            if (8772 & t.subtreeFlags)
              for (t = t.child; null !== t; ) Vu(e, t.alternate, t), (t = t.sibling);
          }
          function cc(e, t) {
            for (e = e.child; null !== e; ) {
              var n = e,
                r = t;
              switch (n.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Zs(4, n, n.return), cc(n, r);
                  break;
                case 1:
                  tu(n, n.return);
                  var a = n.stateNode;
                  'function' == typeof a.componentWillUnmount && Js(n, n.return, a),
                    cc(n, r);
                  break;
                case 27:
                  2 & r && Rp(n.stateNode, n.type, n.memoizedProps);
                case 5:
                  tu(n, n.return), (5 !== n.tag && 27 !== n.tag) || au(n), cc(n, r);
                  break;
                case 6:
                  au(n);
                  break;
                case 26:
                  tu(n, n.return),
                    (a = n.stateNode),
                    null !== n.memoizedState ||
                      null === a ||
                      Iu ||
                      a.parentNode.removeChild(a),
                    cc(n, r);
                  break;
                case 22:
                  null === n.memoizedState && cc(n, r);
                  break;
                case 30:
                  tu(n, n.return), cc(n, r);
                  break;
                case 7:
                  tu(n, n.return);
                default:
                  cc(n, r);
              }
              e = e.sibling;
            }
          }
          function dc(e, t, n) {
            for (n = 8772 & t.subtreeFlags ? n : -2 & n, t = t.child; null !== t; ) {
              var r = t.alternate,
                a = e,
                o = t,
                i = o.flags,
                l = !!(1 & n);
              switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  dc(a, o, n), Qs(4, o);
                  break;
                case 1:
                  if (
                    (dc(a, o, n),
                    'function' == typeof (a = (r = o).stateNode).componentDidMount)
                  )
                    try {
                      a.componentDidMount();
                    } catch (c) {
                      Vd(r, r.return, c);
                    }
                  if (null !== (a = (r = o).updateQueue)) {
                    var s = r.stateNode;
                    try {
                      var u = a.shared.hiddenCallbacks;
                      if (null !== u)
                        for (a.shared.hiddenCallbacks = null, a = 0; a < u.length; a++)
                          ti(u[a], s);
                    } catch (c) {
                      Vd(r, r.return, c);
                    }
                  }
                  l && 64 & i && Xs(o), eu(o, o.return);
                  break;
                case 27:
                  2 & n && pu(o);
                case 5:
                  (5 !== o.tag && 27 !== o.tag) || ru(o),
                    dc(a, o, n),
                    l && null === r && 4 & i && lu(o),
                    eu(o, o.return);
                  break;
                case 6:
                  ru(o);
                  break;
                case 26:
                  (s = o.stateNode),
                    null !== o.memoizedState ||
                      null === s ||
                      Lu ||
                      ng(Bp(s.ownerDocument), o.type, s),
                    dc(a, o, n),
                    l && null === r && 4 & i && lu(o),
                    eu(o, o.return);
                  break;
                case 12:
                  dc(a, o, n);
                  break;
                case 31:
                  dc(a, o, n), l && 4 & i && Ju(a, o);
                  break;
                case 13:
                  dc(a, o, n), l && 4 & i && ec(a, o);
                  break;
                case 22:
                  null === o.memoizedState && dc(a, o, n), eu(o, o.return);
                  break;
                case 30:
                  dc(a, o, n), eu(o, o.return);
                  break;
                case 7:
                  eu(o, o.return);
                default:
                  dc(a, o, n);
              }
              t = t.sibling;
            }
          }
          function fc(e, t) {
            var n = null;
            null !== e &&
              null !== e.memoizedState &&
              null !== e.memoizedState.cachePool &&
              (n = e.memoizedState.cachePool.pool),
              (e = null),
              null !== t.memoizedState &&
                null !== t.memoizedState.cachePool &&
                (e = t.memoizedState.cachePool.pool),
              e !== n && (null != e && e.refCount++, null != n && go(n));
          }
          function pc(e, t) {
            (e = null),
              null !== t.alternate && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache) !== e && (t.refCount++, null != e && go(e));
          }
          function gc(e, t, n, r) {
            var a = (335544064 & n) === n;
            if (t.subtreeFlags & (a ? 10262 : 10256))
              for (t = t.child; null !== t; ) mc(e, t, n, r), (t = t.sibling);
            else a && Ou(t);
          }
          function mc(e, t, n, r) {
            var a = (335544064 & n) === n;
            a &&
              null === t.alternate &&
              null !== t.return &&
              null !== t.return.alternate &&
              Nu(t);
            var o = t.flags;
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                gc(e, t, n, r), 2048 & o && Qs(9, t);
                break;
              case 1:
              case 31:
              case 13:
              default:
                gc(e, t, n, r);
                break;
              case 3:
                gc(e, t, n, r),
                  a &&
                    Uu &&
                    ('root' ===
                      (e =
                        9 === (e = e.containerInfo).nodeType
                          ? e.body
                          : 'HTML' === e.nodeName
                          ? e.ownerDocument.body
                          : e).style.viewTransitionName &&
                      (e.style.viewTransitionName = ''),
                    null !== (e = e.ownerDocument.documentElement) &&
                      'none' === e.style.viewTransitionName &&
                      (e.style.viewTransitionName = '')),
                  2048 & o &&
                    ((o = null),
                    null !== t.alternate && (o = t.alternate.memoizedState.cache),
                    (t = t.memoizedState.cache) !== o &&
                      (t.refCount++, null != o && go(o)));
                break;
              case 12:
                if (2048 & o) {
                  gc(e, t, n, r), (o = t.stateNode);
                  try {
                    var i = t.memoizedProps,
                      l = i.id,
                      s = i.onPostCommit;
                    'function' == typeof s &&
                      s(
                        l,
                        null === t.alternate ? 'mount' : 'update',
                        o.passiveEffectDuration,
                        -0,
                      );
                  } catch (u) {
                    Vd(t, t.return, u);
                  }
                } else gc(e, t, n, r);
                break;
              case 23:
                break;
              case 22:
                (i = t.stateNode),
                  (l = t.alternate),
                  null !== t.memoizedState
                    ? (a && null !== l && null === l.memoizedState && Nu(l),
                      2 & i._visibility ? gc(e, t, n, r) : yc(e, t))
                    : (a && null !== l && null !== l.memoizedState && Nu(t),
                      2 & i._visibility
                        ? gc(e, t, n, r)
                        : ((i._visibility |= 2),
                          hc(e, t, n, r, !!(10256 & t.subtreeFlags) || !1))),
                  2048 & o && fc(l, t);
                break;
              case 24:
                gc(e, t, n, r), 2048 & o && pc(t.alternate, t);
                break;
              case 30:
                a && null !== (o = t.alternate) && (Su(o.child, !0), Su(t.child, !0)),
                  gc(e, t, n, r);
            }
          }
          function hc(e, t, n, r, a) {
            for (a = a && (!!(10256 & t.subtreeFlags) || !1), t = t.child; null !== t; ) {
              var o = e,
                i = t,
                l = n,
                s = r,
                u = i.flags;
              switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  hc(o, i, l, s, a), Qs(8, i);
                  break;
                case 23:
                  break;
                case 22:
                  var c = i.stateNode;
                  null !== i.memoizedState
                    ? 2 & c._visibility
                      ? hc(o, i, l, s, a)
                      : yc(o, i)
                    : ((c._visibility |= 2), hc(o, i, l, s, a)),
                    a && 2048 & u && fc(i.alternate, i);
                  break;
                case 24:
                  hc(o, i, l, s, a), a && 2048 & u && pc(i.alternate, i);
                  break;
                default:
                  hc(o, i, l, s, a);
              }
              t = t.sibling;
            }
          }
          function yc(e, t) {
            if (10256 & t.subtreeFlags)
              for (t = t.child; null !== t; ) {
                var n = e,
                  r = t,
                  a = r.flags;
                switch (r.tag) {
                  case 22:
                    yc(n, r), 2048 & a && fc(r.alternate, r);
                    break;
                  case 24:
                    yc(n, r), 2048 & a && pc(r.alternate, r);
                    break;
                  default:
                    yc(n, r);
                }
                t = t.sibling;
              }
          }
          var vc = 8192;
          function bc(e, t, n) {
            if (e.subtreeFlags & vc)
              for (e = e.child; null !== e; ) wc(e, t, n), (e = e.sibling);
          }
          function wc(e, t, n) {
            switch (e.tag) {
              case 26:
                bc(e, t, n),
                  e.flags & vc &&
                    (null !== e.memoizedState
                      ? (function (e, t, n, r) {
                          if (
                            !(
                              'stylesheet' !== n.type ||
                              ('string' == typeof r.media &&
                                !1 === matchMedia(r.media).matches) ||
                              4 & n.state.loading
                            )
                          ) {
                            if (null === n.instance) {
                              var a = Wp(r.href),
                                o = t.querySelector(Gp(a));
                              if (o)
                                return (
                                  null !== (t = o._p) &&
                                    'object' == typeof t &&
                                    'function' == typeof t.then &&
                                    (e.count++, (e = ug.bind(e)), t.then(e, e)),
                                  (n.state.loading |= 4),
                                  (n.instance = o),
                                  void bt(o)
                                );
                              (o = t.ownerDocument || t),
                                (r = qp(r)),
                                (a = zp.get(a)) && Xp(r, a),
                                bt((o = o.createElement('link')));
                              var i = o;
                              (i._p = new Promise(function (e, t) {
                                (i.onload = e), (i.onerror = t);
                              })),
                                Lf(o, 'link', r),
                                (n.instance = o);
                            }
                            null === e.stylesheets && (e.stylesheets = new Map()),
                              e.stylesheets.set(n, t),
                              (t = n.state.preload) &&
                                !(3 & n.state.loading) &&
                                (e.count++,
                                (n = ug.bind(e)),
                                t.addEventListener('load', n),
                                t.addEventListener('error', n));
                          }
                        })(n, rc, e.memoizedState, e.memoizedProps)
                      : ((e = e.stateNode), (335544128 & t) === t && ig(n, e)));
                break;
              case 5:
                bc(e, t, n),
                  e.flags & vc && ((e = e.stateNode), (335544128 & t) === t && ig(n, e));
                break;
              case 3:
              case 4:
                var r = rc;
                (rc = Bp(e.stateNode.containerInfo)), bc(e, t, n), (rc = r);
                break;
              case 22:
                null === e.memoizedState &&
                  (null !== (r = e.alternate) && null !== r.memoizedState
                    ? ((r = vc), (vc = 16777216), bc(e, t, n), (vc = r))
                    : bc(e, t, n));
                break;
              case 30:
                if (
                  0 !== (e.flags & vc) &&
                  null != (r = e.memoizedProps.name) &&
                  'auto' !== r
                ) {
                  var a = e.stateNode;
                  (a.paired = null), null === mu && (mu = new Map()), mu.set(r, a);
                }
                bc(e, t, n);
                break;
              default:
                bc(e, t, n);
            }
          }
          function kc(e) {
            var t = e.alternate;
            if (null !== t && null !== (e = t.child)) {
              t.child = null;
              do {
                (t = e.sibling), (e.sibling = null), (e = t);
              } while (null !== e);
            }
          }
          function Sc(e) {
            var t = e.deletions;
            if (16 & e.flags) {
              if (null !== t)
                for (var n = 0; n < t.length; n++) {
                  var r = t[n];
                  (zu = r), _c(r, e);
                }
              kc(e);
            }
            if (10256 & e.subtreeFlags)
              for (e = e.child; null !== e; ) xc(e), (e = e.sibling);
          }
          function xc(e) {
            switch (e.tag) {
              case 0:
              case 11:
              case 15:
                Sc(e), 2048 & e.flags && Zs(9, e, e.return);
                break;
              case 3:
              case 12:
              default:
                Sc(e);
                break;
              case 22:
                var t = e.stateNode;
                null !== e.memoizedState &&
                2 & t._visibility &&
                (null === e.return || 13 !== e.return.tag)
                  ? ((t._visibility &= -3), Ec(e))
                  : Sc(e);
            }
          }
          function Ec(e) {
            var t = e.deletions;
            if (16 & e.flags) {
              if (null !== t)
                for (var n = 0; n < t.length; n++) {
                  var r = t[n];
                  (zu = r), _c(r, e);
                }
              kc(e);
            }
            for (e = e.child; null !== e; ) {
              switch ((t = e).tag) {
                case 0:
                case 11:
                case 15:
                  Zs(8, t, t.return), Ec(t);
                  break;
                case 22:
                  2 & (n = t.stateNode)._visibility && ((n._visibility &= -3), Ec(t));
                  break;
                default:
                  Ec(t);
              }
              e = e.sibling;
            }
          }
          function _c(e, t) {
            for (; null !== zu; ) {
              var n = zu;
              switch (n.tag) {
                case 0:
                case 11:
                case 15:
                  Zs(8, n, t);
                  break;
                case 23:
                case 22:
                  if (null !== n.memoizedState && null !== n.memoizedState.cachePool) {
                    var r = n.memoizedState.cachePool.pool;
                    null != r && r.refCount++;
                  }
                  break;
                case 24:
                  go(n.memoizedState.cache);
              }
              if (null !== (r = n.child)) (r.return = n), (zu = r);
              else
                e: for (n = e; null !== zu; ) {
                  var a = (r = zu).sibling,
                    o = r.return;
                  if ((Yu(r), r === n)) {
                    zu = null;
                    break e;
                  }
                  if (null !== a) {
                    (a.return = o), (zu = a);
                    break e;
                  }
                  zu = o;
                }
            }
          }
          var Ac = {
              getCacheForType: function (e) {
                var t = oo(fo),
                  n = t.data.get(e);
                return void 0 === n && ((n = e()), t.data.set(e, n)), n;
              },
              cacheSignal: function () {
                return oo(fo).controller.signal;
              },
            },
            Cc = 'function' == typeof WeakMap ? WeakMap : Map,
            Tc = 0,
            Nc = null,
            Oc = null,
            Pc = 0,
            jc = 0,
            Lc = null,
            Ic = !1,
            Fc = !1,
            Rc = !1,
            Dc = 0,
            zc = 0,
            Mc = 0,
            Bc = 0,
            $c = 0,
            Uc = 0,
            Hc = 0,
            Vc = null,
            Wc = null,
            Gc = !1,
            qc = 0,
            Yc = 0,
            Kc = 1 / 0,
            Qc = null,
            Zc = null,
            Xc = 0,
            Jc = null,
            ed = null,
            td = 0,
            nd = 0,
            rd = null,
            ad = null,
            od = null,
            id = null,
            ld = null,
            sd = 0,
            ud = null;
          function cd() {
            return 2 & Tc && 0 !== Pc ? Pc & -Pc : null !== Z.T ? cf() : nt();
          }
          function dd() {
            if (0 === Uc)
              if (536870912 & Pc && !za) Uc = 536870912;
              else {
                var e = $e;
                !(3932160 & ($e <<= 1)) && ($e = 262144), (Uc = e);
              }
            return null !== (e = si.current) && (e.flags |= 32), Uc;
          }
          function fd(e, t) {
            if (null != t) {
              var n = e.stateNode,
                r = n.ref;
              null === r && (r = n.ref = ip(Qr(e.memoizedProps, n))),
                null === id && (id = []),
                id.push(t.bind(null, r));
            }
          }
          function pd(e, t, n) {
            ((e !== Nc || (2 !== jc && 9 !== jc)) && null === e.cancelPendingCommit) ||
              (wd(e, 0), yd(e, Pc, Uc, !1)),
              Qe(e, n),
              (2 & Tc && e === Nc) ||
                (e === Nc && (!(2 & Tc) && (Bc |= n), 4 === zc && yd(e, Pc, Uc, !1)),
                nf(e));
          }
          function gd(e, t, n) {
            if (6 & Tc) throw Error(o(327));
            for (
              var r = (!n && !(127 & t) && 0 === (t & e.expiredLanes)) || We(e, t),
                a = r
                  ? (function (e, t) {
                      var n = Tc;
                      Tc |= 2;
                      var r = xd(),
                        a = Ed();
                      Nc !== e || Pc !== t
                        ? ((Qc = null), (Kc = _e() + 500), wd(e, t))
                        : (Fc = We(e, t));
                      e: for (;;)
                        try {
                          if (0 !== jc && null !== Oc) {
                            t = Oc;
                            var i = Lc;
                            t: switch (jc) {
                              case 1:
                                (jc = 0), (Lc = null), Pd(e, t, i, 1);
                                break;
                              case 2:
                              case 9:
                                if (Po(i)) {
                                  (jc = 0), (Lc = null), Od(t);
                                  break;
                                }
                                (t = function () {
                                  (2 !== jc && 9 !== jc) || Nc !== e || (jc = 7), nf(e);
                                }),
                                  i.then(t, t);
                                break e;
                              case 3:
                                jc = 7;
                                break e;
                              case 4:
                                jc = 5;
                                break e;
                              case 7:
                                Po(i)
                                  ? ((jc = 0), (Lc = null), Od(t))
                                  : ((jc = 0), (Lc = null), Pd(e, t, i, 7));
                                break;
                              case 5:
                                var l = null;
                                switch (Oc.tag) {
                                  case 26:
                                    l = Oc.memoizedState;
                                  case 5:
                                  case 27:
                                    var s = Oc;
                                    if (l ? ag(l) : s.stateNode.complete) {
                                      (jc = 0), (Lc = null);
                                      var u = s.sibling;
                                      if (null !== u) Oc = u;
                                      else {
                                        var c = s.return;
                                        null !== c ? ((Oc = c), jd(c)) : (Oc = null);
                                      }
                                      break t;
                                    }
                                }
                                (jc = 0), (Lc = null), Pd(e, t, i, 5);
                                break;
                              case 6:
                                (jc = 0), (Lc = null), Pd(e, t, i, 6);
                                break;
                              case 8:
                                bd(), (zc = 6);
                                break e;
                              default:
                                throw Error(o(462));
                            }
                          }
                          Td();
                          break;
                        } catch (d) {
                          kd(e, d);
                        }
                      return (
                        (Za = Qa = null),
                        (Z.H = r),
                        (Z.A = a),
                        (Tc = n),
                        null !== Oc ? 0 : ((Nc = null), (Pc = 0), ra(), zc)
                      );
                    })(e, t)
                  : Ad(e, t, !0),
                i = r;
              ;

            ) {
              if (0 === a) {
                Fc && !r && yd(e, t, 0, !1);
                break;
              }
              if (((n = e.current.alternate), !i || hd(n))) {
                if (2 === a) {
                  if (((i = t), e.errorRecoveryDisabledLanes & i)) var l = 0;
                  else
                    l =
                      0 !== (l = -536870913 & e.pendingLanes)
                        ? l
                        : 536870912 & l
                        ? 536870912
                        : 0;
                  if (0 !== l) {
                    t = l;
                    e: {
                      var s = e;
                      a = Vc;
                      var u = s.current.memoizedState.isDehydrated;
                      if (
                        (u && (wd(s, l).flags |= 256),
                        2 !== (l = Ad(s, l, !1)) && 6 !== l)
                      ) {
                        if (Rc && !u) {
                          (s.errorRecoveryDisabledLanes |= i), (Bc |= i), (a = 4);
                          break e;
                        }
                        (i = Wc),
                          (Wc = a),
                          null !== i && (null === Wc ? (Wc = i) : Wc.push.apply(Wc, i));
                      }
                      a = l;
                    }
                    if (((i = !1), 2 !== a)) continue;
                  }
                }
                if (1 === a) {
                  wd(e, 0), yd(e, t, 0, !0);
                  break;
                }
                e: {
                  switch (((r = e), (i = a))) {
                    case 0:
                    case 1:
                      throw Error(o(345));
                    case 4:
                      if ((4194048 & t) !== t && (62914560 & t) !== t) break;
                    case 6:
                      yd(r, t, Uc, !Ic);
                      break e;
                    case 2:
                      Wc = null;
                      break;
                    case 3:
                    case 5:
                      break;
                    default:
                      throw Error(o(329));
                  }
                  if ((62914560 & t) === t && 10 < (a = qc + 300 - _e())) {
                    if ((yd(r, t, Uc, !Ic), 0 !== Ve(r, 0, !0))) break e;
                    (td = t),
                      (r.timeoutHandle = Vf(
                        md.bind(
                          null,
                          r,
                          n,
                          Wc,
                          Qc,
                          Gc,
                          t,
                          Uc,
                          Bc,
                          Hc,
                          Ic,
                          i,
                          'Throttled',
                          -0,
                          0,
                        ),
                        a,
                      ));
                  } else md(r, n, Wc, Qc, Gc, t, Uc, Bc, Hc, Ic, i, null, -0, 0);
                }
                break;
              }
              (a = Ad(e, t, !1)), (i = !1);
            }
            nf(e);
          }
          function md(e, t, n, r, a, o, i, l, s, u, c, d, f, p) {
            e.timeoutHandle = -1;
            var g,
              m,
              h = t.subtreeFlags,
              y = (335544064 & o) === o;
            if (
              ((d = null),
              (y || 8192 & h || !(16785408 & ~h)) &&
                ((mu = null),
                wc(
                  t,
                  o,
                  (d = {
                    stylesheets: null,
                    count: 0,
                    imgCount: 0,
                    imgBytes: 0,
                    suspenseyImages: [],
                    waitingForImages: !0,
                    waitingForViewTransition: !1,
                    unsuspend: Jt,
                  }),
                ),
                y &&
                  ((h = d),
                  null !=
                    (y = (9 === (y = e.containerInfo).nodeType ? y : y.ownerDocument)
                      .__reactViewTransition) &&
                    (h.count++,
                    (h.waitingForViewTransition = !0),
                    (h = ug.bind(h)),
                    y.finished.then(h, h))),
                (h =
                  (62914560 & o) === o ? qc - _e() : (4194048 & o) === o ? Yc - _e() : 0),
                (m = h),
                (g = d).stylesheets && 0 === g.count && fg(g, g.stylesheets),
                null !==
                  (h =
                    0 < g.count || 0 < g.imgCount
                      ? function (e) {
                          var t = setTimeout(function () {
                            if ((g.stylesheets && fg(g, g.stylesheets), g.unsuspend)) {
                              var e = g.unsuspend;
                              (g.unsuspend = null), e();
                            }
                          }, 6e4 + m);
                          0 < g.imgBytes &&
                            0 === lg &&
                            (lg =
                              62500 *
                              (function () {
                                if ('function' == typeof performance.getEntriesByType) {
                                  for (
                                    var e = 0,
                                      t = 0,
                                      n = performance.getEntriesByType('resource'),
                                      r = 0;
                                    r < n.length;
                                    r++
                                  ) {
                                    var a = n[r],
                                      o = a.transferSize,
                                      i = a.initiatorType,
                                      l = a.duration;
                                    if (o && l && Ff(i)) {
                                      for (
                                        i = 0, l = a.responseEnd, r += 1;
                                        r < n.length;
                                        r++
                                      ) {
                                        var s = n[r],
                                          u = s.startTime;
                                        if (u > l) break;
                                        var c = s.transferSize,
                                          d = s.initiatorType;
                                        c &&
                                          Ff(d) &&
                                          (i +=
                                            c *
                                            ((s = s.responseEnd) < l
                                              ? 1
                                              : (l - u) / (s - u)));
                                      }
                                      if (
                                        (--r,
                                        (t += (8 * (o + i)) / (a.duration / 1e3)),
                                        10 < ++e)
                                      )
                                        break;
                                    }
                                  }
                                  if (0 < e) return t / e / 1e6;
                                }
                                return navigator.connection &&
                                  'number' == typeof (e = navigator.connection.downlink)
                                  ? e
                                  : 5;
                              })());
                          var n = setTimeout(function () {
                            if (
                              ((g.waitingForImages = !1),
                              0 === g.count &&
                                (g.stylesheets && fg(g, g.stylesheets), g.unsuspend))
                            ) {
                              var e = g.unsuspend;
                              (g.unsuspend = null), e();
                            }
                          }, (g.imgBytes > lg ? 50 : 800) + m);
                          return (
                            (g.unsuspend = e),
                            function () {
                              (g.unsuspend = null), clearTimeout(t), clearTimeout(n);
                            }
                          );
                        }
                      : null)))
            )
              return (
                (td = o),
                (e.cancelPendingCommit = h(
                  Id.bind(null, e, t, o, n, r, a, i, l, s, u, c, d, null, f, p),
                )),
                void yd(e, o, i, !u)
              );
            Id(e, t, o, n, r, a, i, l, s, u, c, d);
          }
          function hd(e) {
            for (var t = e; ; ) {
              var n = t.tag;
              if (
                (0 === n || 11 === n || 15 === n) &&
                16384 & t.flags &&
                null !== (n = t.updateQueue) &&
                null !== (n = n.stores)
              )
                for (var r = 0; r < n.length; r++) {
                  var a = n[r],
                    o = a.getSnapshot;
                  a = a.value;
                  try {
                    if (!wr(o(), a)) return !1;
                  } catch (i) {
                    return !1;
                  }
                }
              if (((n = t.child), 16384 & t.subtreeFlags && null !== n))
                (n.return = t), (t = n);
              else {
                if (t === e) break;
                for (; null === t.sibling; ) {
                  if (null === t.return || t.return === e) return !0;
                  t = t.return;
                }
                (t.sibling.return = t.return), (t = t.sibling);
              }
            }
            return !0;
          }
          function yd(e, t, n, r) {
            (t = Ge(e, t)),
              (t &= ~$c),
              (t &= ~Bc),
              (e.suspendedLanes |= t),
              (e.pingedLanes &= ~t),
              r && (e.warmLanes |= t),
              (r = e.expirationTimes);
            for (var a = t; 0 < a; ) {
              var o = 31 - De(a),
                i = 1 << o;
              (r[o] = -1), (a &= ~i);
            }
            0 !== n && Ze(e, n, t);
          }
          function vd() {
            return !!(6 & Tc) || (rf(0, !1), !1);
          }
          function bd() {
            if (null !== Oc) {
              if (0 === jc) var e = Oc.return;
              else (Za = Qa = null), zi((e = Oc)), (Do = null), (zo = 0), (e = Oc);
              for (; null !== e; ) Ks(e.alternate, e), (e = e.return);
              Oc = null;
            }
          }
          function wd(e, t) {
            var n = e.timeoutHandle;
            return (
              -1 !== n && ((e.timeoutHandle = -1), Wf(n)),
              null !== (n = e.cancelPendingCommit) &&
                ((e.cancelPendingCommit = null), n()),
              (td = 0),
              bd(),
              (Nc = e),
              (Oc = n = pa(e.current, null)),
              (Pc = t),
              (jc = 0),
              (Lc = null),
              (Ic = !1),
              (Fc = We(e, t)),
              (Rc = !1),
              (Hc = Uc = $c = Bc = Mc = zc = 0),
              (Wc = Vc = null),
              (Gc = !1),
              (Dc = Ge(e, t)),
              ra(),
              n
            );
          }
          function kd(e, t) {
            (wi = null),
              (Z.H = Gl),
              t === Co || t === No
                ? ((t = Fo()), (jc = 3))
                : t === To
                ? ((t = Fo()), (jc = 4))
                : (jc =
                    t === us
                      ? 8
                      : null !== t && 'object' == typeof t && 'function' == typeof t.then
                      ? 6
                      : 1),
              (Lc = t),
              null === Oc && ((zc = 1), as(e, ka(t, e.current)));
          }
          function Sd() {
            var e = si.current;
            return (
              null === e ||
              ((4194048 & Pc) === Pc
                ? null === ui
                : !!((62914560 & Pc) === Pc || 536870912 & Pc) && e === ui)
            );
          }
          function xd() {
            var e = Z.H;
            return (Z.H = Gl), null === e ? Gl : e;
          }
          function Ed() {
            var e = Z.A;
            return (Z.A = Ac), e;
          }
          function _d() {
            (zc = 4),
              Ic || ((4194048 & Pc) !== Pc && null !== si.current) || (Fc = !0),
              (!(134217727 & Mc) && !(134217727 & Bc)) ||
                null === Nc ||
                yd(Nc, Pc, Uc, !1);
          }
          function Ad(e, t, n) {
            var r = Tc;
            Tc |= 2;
            var a = xd(),
              o = Ed();
            (Nc === e && Pc === t) || ((Qc = null), wd(e, t)), (t = !1);
            var i = zc;
            e: for (;;)
              try {
                if (0 !== jc && null !== Oc) {
                  var l = Oc,
                    s = Lc;
                  switch (jc) {
                    case 8:
                      bd(), (i = 6);
                      break e;
                    case 3:
                    case 2:
                    case 9:
                    case 6:
                      null === si.current && (t = !0);
                      var u = jc;
                      if (((jc = 0), (Lc = null), Pd(e, l, s, u), n && Fc)) {
                        i = 0;
                        break e;
                      }
                      break;
                    default:
                      (u = jc), (jc = 0), (Lc = null), Pd(e, l, s, u);
                  }
                }
                Cd(), (i = zc);
                break;
              } catch (c) {
                kd(e, c);
              }
            return (
              t && e.shellSuspendCounter++,
              (Za = Qa = null),
              (Tc = r),
              (Z.H = a),
              (Z.A = o),
              null === Oc && ((Nc = null), (Pc = 0), ra()),
              i
            );
          }
          function Cd() {
            for (; null !== Oc; ) Nd(Oc);
          }
          function Td() {
            for (; null !== Oc && !xe(); ) Nd(Oc);
          }
          function Nd(e) {
            var t = Bs(e.alternate, e, Dc);
            (e.memoizedProps = e.pendingProps), null === t ? jd(e) : (Oc = t);
          }
          function Od(e) {
            var t = e,
              n = t.alternate;
            switch (t.tag) {
              case 15:
              case 0:
                t = Ss(n, t, t.pendingProps, t.type, void 0, Pc);
                break;
              case 11:
                t = Ss(n, t, t.pendingProps, t.type.render, t.ref, Pc);
                break;
              case 5:
                zi(t);
                var r = t;
                r === Ra &&
                  (za
                    ? (Va(r), 5 === r.tag && null != r.stateNode && (Da = r.stateNode))
                    : (Va(r), (za = !0)));
              default:
                Ks(n, t), (t = Bs(n, (t = Oc = ga(t, Dc)), Dc));
            }
            (e.memoizedProps = e.pendingProps), null === t ? jd(e) : (Oc = t);
          }
          function Pd(e, t, n, r) {
            (Za = Qa = null), zi(t), (Do = null), (zo = 0);
            var a = t.return;
            try {
              if (
                (function (e, t, n, r, a) {
                  if (
                    ((n.flags |= 32768),
                    null !== r && 'object' == typeof r && 'function' == typeof r.then)
                  ) {
                    if (
                      (null !== (t = n.alternate) && no(t, n, a, !0),
                      null !== (n = si.current))
                    ) {
                      switch (n.tag) {
                        case 31:
                        case 13:
                        case 19:
                          return (
                            null === ui
                              ? _d()
                              : null === n.alternate && 0 === zc && (zc = 3),
                            (n.flags &= -257),
                            (n.flags |= 65536),
                            (n.lanes = a),
                            r === Oo
                              ? (n.flags |= 16384)
                              : (null === (t = n.updateQueue)
                                  ? (n.updateQueue = new Set([r]))
                                  : t.add(r),
                                Wd(e, r, a)),
                            !1
                          );
                        case 22:
                          return (
                            (n.flags |= 65536),
                            r === Oo
                              ? (n.flags |= 16384)
                              : (null === (t = n.updateQueue)
                                  ? ((t = {
                                      transitions: null,
                                      markerInstances: null,
                                      retryQueue: new Set([r]),
                                    }),
                                    (n.updateQueue = t))
                                  : null === (n = t.retryQueue)
                                  ? (t.retryQueue = new Set([r]))
                                  : n.add(r),
                                Wd(e, r, a)),
                            !1
                          );
                      }
                      throw Error(o(435, n.tag));
                    }
                    return Wd(e, r, a), _d(), !1;
                  }
                  if (za)
                    return (
                      null !== (t = si.current)
                        ? (!(65536 & t.flags) && (t.flags |= 256),
                          (t.flags |= 65536),
                          (t.lanes = a),
                          r !== $a && Ya(ka((e = Error(o(422), { cause: r })), n)))
                        : (r !== $a && Ya(ka((t = Error(o(423), { cause: r })), n)),
                          ((e = e.current.alternate).flags |= 65536),
                          (a &= -a),
                          (e.lanes |= a),
                          (r = ka(r, n)),
                          Zo(e, (a = is(e.stateNode, r, a))),
                          4 !== zc && (zc = 2)),
                      !1
                    );
                  var i = Error(o(520), { cause: r });
                  if (
                    ((i = ka(i, n)),
                    null === Vc ? (Vc = [i]) : Vc.push(i),
                    4 !== zc && (zc = 2),
                    null === t)
                  )
                    return !0;
                  (r = ka(r, n)), (n = t);
                  do {
                    switch (n.tag) {
                      case 3:
                        return (
                          (n.flags |= 65536),
                          (e = a & -a),
                          (n.lanes |= e),
                          Zo(n, (e = is(n.stateNode, r, e))),
                          !1
                        );
                      case 1:
                        if (
                          ((t = n.type),
                          (i = n.stateNode),
                          !(
                            128 & n.flags ||
                            ('function' != typeof t.getDerivedStateFromError &&
                              (null === i ||
                                'function' != typeof i.componentDidCatch ||
                                (null !== Zc && Zc.has(i))))
                          ))
                        )
                          return (
                            (n.flags |= 65536),
                            (a &= -a),
                            (n.lanes |= a),
                            ss((a = ls(a)), e, n, r),
                            Zo(n, a),
                            !1
                          );
                        break;
                      case 22:
                        if (null !== n.memoizedState) return (n.flags |= 65536), !1;
                    }
                    n = n.return;
                  } while (null !== n);
                  return !1;
                })(e, a, t, n, Pc)
              )
                return (zc = 1), as(e, ka(n, e.current)), void (Oc = null);
            } catch (i) {
              if (null !== a) throw ((Oc = a), i);
              return (zc = 1), as(e, ka(n, e.current)), void (Oc = null);
            }
            32768 & t.flags
              ? (za || 1 === r
                  ? (e = !0)
                  : Fc || 536870912 & Pc
                  ? (e = !1)
                  : ((Ic = e = !0),
                    (2 === r || 9 === r || 3 === r || 6 === r) &&
                      null !== (r = si.current) &&
                      13 === r.tag &&
                      (r.flags |= 16384)),
                Ld(t, e))
              : jd(t);
          }
          function jd(e) {
            var t = e;
            do {
              if (32768 & t.flags) return void Ld(t, Ic);
              e = t.return;
              var n = qs(t.alternate, t, Dc);
              if (null !== n) return void (Oc = n);
              if (null !== (t = t.sibling)) return void (Oc = t);
              Oc = t = e;
            } while (null !== t);
            0 === zc && (zc = 5);
          }
          function Ld(e, t) {
            do {
              var n = Ys(e.alternate, e);
              if (null !== n) return (n.flags &= 32767), void (Oc = n);
              if (
                (null !== (n = e.return) &&
                  ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
                !t && null !== (e = e.sibling))
              )
                return void (Oc = e);
              Oc = e = n;
            } while (null !== e);
            (zc = 6), (Oc = null);
          }
          function Id(e, t, n, r, a, i, l, s, u, c, d, f) {
            e.cancelPendingCommit = null;
            do {
              $d();
            } while (0 !== Xc);
            if (6 & Tc) throw Error(o(327));
            if (null !== t) {
              if (t === e.current) throw Error(o(177));
              e === Nc && ((Oc = Nc = null), (Pc = 0)),
                (ed = t),
                (Jc = e),
                (td = n),
                (rd = a),
                (ad = r),
                (function (e, t, n, r, a, o, i) {
                  var l = t.lanes | t.childLanes;
                  if (
                    ((nd = l),
                    (function (e, t, n, r, a, o) {
                      var i = e.pendingLanes;
                      (e.pendingLanes = n),
                        (e.suspendedLanes = 0),
                        (e.pingedLanes = 0),
                        (e.warmLanes = 0),
                        (e.expiredLanes &= n),
                        (e.entangledLanes &= n),
                        (e.errorRecoveryDisabledLanes &= n),
                        (e.shellSuspendCounter = 0);
                      var l = e.entanglements,
                        s = e.expirationTimes,
                        u = e.hiddenUpdates;
                      for (n = i & ~n; 0 < n; ) {
                        var c = 31 - De(n),
                          d = 1 << c;
                        (l[c] = 0), (s[c] = -1);
                        var f = u[c];
                        if (null !== f)
                          for (u[c] = null, c = 0; c < f.length; c++) {
                            var p = f[c];
                            null !== p && (p.lane &= -536870913);
                          }
                        n &= ~d;
                      }
                      0 !== r && Ze(e, r, 0),
                        0 !== o &&
                          0 === a &&
                          0 !== e.tag &&
                          (e.suspendedLanes |= o & ~(i & ~t));
                    })(e, n, (l |= na), r, a, o),
                    (id = null),
                    (335544064 & n) === n
                      ? ((ld = (function (e) {
                          var t = e.transitionTypes;
                          return (e.transitionTypes = null), t;
                        })(e)),
                        (r = 10262))
                      : ((ld = null), (r = 10256)),
                    0 !== (t.subtreeFlags & r) || 0 !== (t.flags & r)
                      ? ((e.callbackNode = null),
                        (e.callbackPriority = 0),
                        (function (e, t) {
                          ke(e, t);
                        })(Ne, function () {
                          return Ud(), null;
                        }))
                      : ((e.callbackNode = null), (e.callbackPriority = 0)),
                    (gu = !1),
                    (r = !!(13878 & t.flags)),
                    !!(13878 & t.subtreeFlags) || r)
                  ) {
                    (r = Z.T), (Z.T = null), (a = X.p), (X.p = 2), (o = Tc), (Tc |= 4);
                    try {
                      !(function (e, t, n) {
                        if (((e = e.containerInfo), (Rf = xg), Cr((e = Ar(e))))) {
                          if ('selectionStart' in e)
                            var r = { start: e.selectionStart, end: e.selectionEnd };
                          else
                            e: {
                              var a =
                                (r = ((r = e.ownerDocument) && r.defaultView) || window)
                                  .getSelection && r.getSelection();
                              if (a && 0 !== a.rangeCount) {
                                r = a.anchorNode;
                                var o = a.anchorOffset,
                                  i = a.focusNode;
                                a = a.focusOffset;
                                try {
                                  r.nodeType, i.nodeType;
                                } catch (m) {
                                  r = null;
                                  break e;
                                }
                                var l = 0,
                                  s = -1,
                                  u = -1,
                                  c = 0,
                                  d = 0,
                                  f = e,
                                  p = null;
                                t: for (;;) {
                                  for (
                                    var g;
                                    f !== r ||
                                      (0 !== o && 3 !== f.nodeType) ||
                                      (s = l + o),
                                      f !== i ||
                                        (0 !== a && 3 !== f.nodeType) ||
                                        (u = l + a),
                                      3 === f.nodeType && (l += f.nodeValue.length),
                                      null !== (g = f.firstChild);

                                  )
                                    (p = f), (f = g);
                                  for (;;) {
                                    if (f === e) break t;
                                    if (
                                      (p === r && ++c === o && (s = l),
                                      p === i && ++d === a && (u = l),
                                      null !== (g = f.nextSibling))
                                    )
                                      break;
                                    p = (f = p).parentNode;
                                  }
                                  f = g;
                                }
                                r = -1 === s || -1 === u ? null : { start: s, end: u };
                              } else r = null;
                            }
                          r = r || { start: 0, end: 0 };
                        } else r = null;
                        for (
                          Df = { focusedElem: e, selectionRange: r },
                            xg = !1,
                            zu = t,
                            t = (n = (335544064 & n) === n) ? 9270 : 1024;
                          null !== zu;

                        ) {
                          if (((e = zu), n && null !== (r = e.deletions)))
                            for (o = 0; o < r.length; o++) n && Au(r[o]);
                          if (null === e.alternate && 2 & e.flags) n && hu(e), Hu(n);
                          else {
                            if (22 === e.tag) {
                              if (((r = e.alternate), null !== e.memoizedState)) {
                                null !== r && null === r.memoizedState && n && Au(r),
                                  Hu(n);
                                continue;
                              }
                              if (null !== r && null !== r.memoizedState) {
                                n && hu(e), Hu(n);
                                continue;
                              }
                            }
                            (r = e.child),
                              0 !== (e.subtreeFlags & t) && null !== r
                                ? ((r.return = e), (zu = r))
                                : (n && Cu(e), Hu(n));
                          }
                        }
                        mu = null;
                      })(e, t, n);
                    } finally {
                      (Tc = o), (X.p = a), (Z.T = r);
                    }
                  }
                  (Xc = 1),
                    gu
                      ? (od = (function (e, t, n, r, a, o, i, l, s) {
                          var u = 9 === t.nodeType ? t : t.ownerDocument;
                          try {
                            var c = u.startViewTransition({
                              update: function () {
                                var t = u.defaultView,
                                  n = t.navigation && t.navigation.transition,
                                  i = u.fonts.status;
                                r();
                                var l = [];
                                if (
                                  ('loaded' === i &&
                                    ((function (e) {
                                      e.documentElement.clientHeight;
                                    })(u),
                                    'loading' === u.fonts.status &&
                                      l.push(u.fonts.ready)),
                                  (i = l.length),
                                  null !== e)
                                )
                                  for (
                                    var s = e.suspenseyImages, c = 0, d = 0;
                                    d < s.length;
                                    d++
                                  ) {
                                    var f = s[d];
                                    if (!f.complete) {
                                      var p = f.getBoundingClientRect();
                                      if (
                                        0 < p.bottom &&
                                        0 < p.right &&
                                        p.top < t.innerHeight &&
                                        p.left < t.innerWidth
                                      ) {
                                        if ((c += og(f)) > lg) {
                                          l.length = i;
                                          break;
                                        }
                                        (f = new Promise(ap.bind(f))), l.push(f);
                                      }
                                    }
                                  }
                                return 0 < l.length
                                  ? ((t = Promise.race([
                                      Promise.all(l),
                                      new Promise(function (e) {
                                        return setTimeout(e, 500);
                                      }),
                                    ]).then(a, a)),
                                    (n ? Promise.allSettled([n.finished, t]) : t).then(
                                      o,
                                      o,
                                    ))
                                  : (a(), n ? n.finished.then(o, o) : void o());
                              },
                              types: n,
                            });
                            u.__reactViewTransition = c;
                            var d = [];
                            return (
                              c.ready.then(
                                function () {
                                  for (
                                    var e = u.documentElement.getAnimations({
                                        subtree: !0,
                                      }),
                                      t = 0;
                                    t < e.length;
                                    t++
                                  ) {
                                    var n = e[t],
                                      r = n.effect,
                                      a = r.pseudoElement;
                                    if (null != a && a.startsWith('::view-transition')) {
                                      d.push(n), (n = r.getKeyframes());
                                      for (
                                        var o = (a = void 0), l = !0, s = 0;
                                        s < n.length;
                                        s++
                                      ) {
                                        var c = n[s],
                                          f = c.width;
                                        if (void 0 === a) a = f;
                                        else if (a !== f) {
                                          l = !1;
                                          break;
                                        }
                                        if (((f = c.height), void 0 === o)) o = f;
                                        else if (o !== f) {
                                          l = !1;
                                          break;
                                        }
                                        delete c.width,
                                          delete c.height,
                                          'none' === c.transform && delete c.transform;
                                      }
                                      l &&
                                        void 0 !== a &&
                                        void 0 !== o &&
                                        (r.setKeyframes(n),
                                        (l = getComputedStyle(r.target, r.pseudoElement))
                                          .width !== a || l.height !== o) &&
                                        (((l = n[0]).width = a),
                                        (l.height = o),
                                        ((l = n[n.length - 1]).width = a),
                                        (l.height = o),
                                        r.setKeyframes(n));
                                    }
                                  }
                                  i();
                                },
                                function (e) {
                                  u.__reactViewTransition === c &&
                                    (u.__reactViewTransition = null);
                                  try {
                                    if (
                                      'object' == typeof e &&
                                      null !== e &&
                                      'InvalidStateError' === e.name
                                    )
                                      ('View transition was skipped because document visibility state is hidden.' !==
                                        e.message &&
                                        'Skipping view transition because document visibility state has become hidden.' !==
                                          e.message &&
                                        'Skipping view transition because viewport size changed.' !==
                                          e.message &&
                                        'Transition was aborted because of invalid state' !==
                                          e.message) ||
                                        (e = null);
                                    null !== e && s(e);
                                  } finally {
                                    r(), a(), i();
                                  }
                                },
                              ),
                              c.finished.finally(function () {
                                for (var e = 0; e < d.length; e++) d[e].cancel();
                                u.__reactViewTransition === c &&
                                  (u.__reactViewTransition = null),
                                  l();
                              }),
                              c
                            );
                          } catch (f) {
                            return r(), a(), i(), null;
                          }
                        })(i, e.containerInfo, ld, Dd, zd, Rd, Md, Ud, Fd))
                      : (Dd(), zd(), Md());
                })(e, t, n, l, s, u, f);
            }
          }
          function Fd(e) {
            0 !== Xc && (0, Jc.onRecoverableError)(e, { componentStack: null });
          }
          function Rd() {
            3 === Xc && ((Xc = 0), sc(ed, Jc), (Xc = 4));
          }
          function Dd() {
            if (1 === Xc) {
              Xc = 0;
              var e = Jc,
                t = ed,
                n = td,
                r = !!(13878 & t.flags);
              if (13878 & t.subtreeFlags || r) {
                (r = Z.T), (Z.T = null);
                var a = X.p;
                X.p = 2;
                var o = Tc;
                Tc |= 4;
                try {
                  (Bu = $u = !1), ac(t, e, n), (n = Df);
                  var i = Ar(e.containerInfo),
                    l = n.focusedElem,
                    s = n.selectionRange;
                  if (
                    i !== l &&
                    l &&
                    l.ownerDocument &&
                    _r(l.ownerDocument.documentElement, l)
                  ) {
                    if (null !== s && Cr(l)) {
                      var u = s.start,
                        c = s.end;
                      if ((void 0 === c && (c = u), 'selectionStart' in l))
                        (l.selectionStart = u),
                          (l.selectionEnd = Math.min(c, l.value.length));
                      else {
                        var d = l.ownerDocument || document,
                          f = (d && d.defaultView) || window;
                        if (f.getSelection) {
                          var p = f.getSelection(),
                            g = l.textContent.length,
                            m = Math.min(s.start, g),
                            h = void 0 === s.end ? m : Math.min(s.end, g);
                          !p.extend && m > h && ((i = h), (h = m), (m = i));
                          var y = Er(l, m),
                            v = Er(l, h);
                          if (
                            y &&
                            v &&
                            (1 !== p.rangeCount ||
                              p.anchorNode !== y.node ||
                              p.anchorOffset !== y.offset ||
                              p.focusNode !== v.node ||
                              p.focusOffset !== v.offset)
                          ) {
                            var b = d.createRange();
                            b.setStart(y.node, y.offset),
                              p.removeAllRanges(),
                              m > h
                                ? (p.addRange(b), p.extend(v.node, v.offset))
                                : (b.setEnd(v.node, v.offset), p.addRange(b));
                          }
                        }
                      }
                    }
                    for (d = [], p = l; (p = p.parentNode); )
                      1 === p.nodeType &&
                        d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
                    for (
                      'function' == typeof l.focus && l.focus(), l = 0;
                      l < d.length;
                      l++
                    ) {
                      var w = d[l];
                      (w.element.scrollLeft = w.left), (w.element.scrollTop = w.top);
                    }
                  }
                  (xg = !!Rf), (Df = Rf = null);
                } finally {
                  (Tc = o), (X.p = a), (Z.T = r);
                }
              }
              (e.current = t), (Xc = 2);
            }
          }
          function zd() {
            if (2 === Xc) {
              Xc = 0;
              var e = Jc,
                t = ed,
                n = !!(8772 & t.flags);
              if (8772 & t.subtreeFlags || n) {
                (n = Z.T), (Z.T = null);
                var r = X.p;
                X.p = 2;
                var a = Tc;
                Tc |= 4;
                try {
                  Vu(e, t.alternate, t);
                } finally {
                  (Tc = a), (X.p = r), (Z.T = n);
                }
              }
              Xc = 3;
            }
          }
          function Md() {
            if (4 === Xc || 3 === Xc) {
              Xc = 0;
              var e = od;
              (od = null), Ee();
              var t = Jc,
                n = ed,
                r = td,
                a = ad,
                o = (335544064 & r) === r ? 10262 : 10256;
              if (
                (0 !== (n.subtreeFlags & o) || 0 !== (n.flags & o)
                  ? (Xc = 5)
                  : ((Xc = 0), (ed = Jc = null), Bd(t, t.pendingLanes)),
                0 === (o = t.pendingLanes) && (Zc = null),
                tt(r),
                (n = n.stateNode),
                Fe && 'function' == typeof Fe.onCommitFiberRoot)
              )
                try {
                  Fe.onCommitFiberRoot(Ie, n, void 0, !(128 & ~n.current.flags));
                } catch (u) {}
              if (null !== a) {
                (n = Z.T), (o = X.p), (X.p = 2), (Z.T = null);
                try {
                  for (var i = t.onRecoverableError, l = 0; l < a.length; l++) {
                    var s = a[l];
                    i(s.value, { componentStack: s.stack });
                  }
                } finally {
                  (Z.T = n), (X.p = o);
                }
              }
              if (
                ((i = ld),
                (ld = null),
                null !== (a = id) && ((id = null), null === i && (i = []), null !== e))
              )
                for (s = 0; s < a.length; s++)
                  void 0 !== (n = (0, a[s])(i)) && e.finished.finally(n);
              3 & td && $d(),
                nf(t),
                (o = t.pendingLanes),
                261930 & r && 42 & o
                  ? t === ud
                    ? sd++
                    : ((sd = 0), (ud = t))
                  : ((sd = 0), (ud = null)),
                rf(0, !1);
            }
          }
          function Bd(e, t) {
            0 === (e.pooledCacheLanes &= t) &&
              null != (t = e.pooledCache) &&
              ((e.pooledCache = null), go(t));
          }
          function $d() {
            return (
              null !== od && (od.skipTransition(), (od = null)), Dd(), zd(), Md(), Ud()
            );
          }
          function Ud() {
            if (5 !== Xc) return !1;
            var e = Jc,
              t = nd;
            nd = 0;
            var n = tt(td),
              r = Z.T,
              a = X.p;
            try {
              (X.p = 32 > n ? 32 : n), (Z.T = null), (n = rd), (rd = null);
              var i = Jc,
                l = td;
              if (((Xc = 0), (ed = Jc = null), (td = 0), 6 & Tc)) throw Error(o(331));
              var s = Tc;
              if (
                ((Tc |= 4),
                xc(i.current),
                mc(i, i.current, l, n),
                (Tc = s),
                rf(0, !1),
                Fe && 'function' == typeof Fe.onPostCommitFiberRoot)
              )
                try {
                  Fe.onPostCommitFiberRoot(Ie, i);
                } catch (u) {}
              return !0;
            } finally {
              (X.p = a), (Z.T = r), Bd(e, t);
            }
          }
          function Hd(e, t, n) {
            (t = ka(n, t)),
              null !== (e = Ko(e, (t = is(e.stateNode, t, 2)), 2)) && (Qe(e, 2), nf(e));
          }
          function Vd(e, t, n) {
            if (3 === e.tag) Hd(e, e, n);
            else
              for (; null !== t; ) {
                if (3 === t.tag) {
                  Hd(t, e, n);
                  break;
                }
                if (1 === t.tag) {
                  var r = t.stateNode;
                  if (
                    'function' == typeof t.type.getDerivedStateFromError ||
                    ('function' == typeof r.componentDidCatch &&
                      (null === Zc || !Zc.has(r)))
                  ) {
                    (e = ka(n, e)),
                      null !== (r = Ko(t, (n = ls(2)), 2)) &&
                        (ss(n, r, t, e), Qe(r, 2), nf(r));
                    break;
                  }
                }
                t = t.return;
              }
          }
          function Wd(e, t, n) {
            var r = e.pingCache;
            if (null === r) {
              r = e.pingCache = new Cc();
              var a = new Set();
              r.set(t, a);
            } else void 0 === (a = r.get(t)) && ((a = new Set()), r.set(t, a));
            a.has(n) || ((Rc = !0), a.add(n), (e = Gd.bind(null, e, t, n)), t.then(e, e));
          }
          function Gd(e, t, n) {
            var r = e.pingCache;
            null !== r && r.delete(t),
              (e.pingedLanes |= e.suspendedLanes & n),
              (e.warmLanes &= ~n),
              Nc === e &&
                (Pc & n) === n &&
                (4 === zc || (3 === zc && (62914560 & Pc) === Pc && 300 > _e() - qc)
                  ? 2 & Tc
                    ? ($c |= n)
                    : wd(e, 0)
                  : ($c |= n),
                Hc === Pc && (Hc = 0)),
              nf(e);
          }
          function qd(e, t) {
            0 === t && (t = Ye()), null !== (e = ia(e, t)) && (Qe(e, t), nf(e));
          }
          function Yd(e) {
            var t = e.memoizedState,
              n = 0;
            null !== t && (n = t.retryLane), qd(e, n);
          }
          function Kd(e, t) {
            var n = 0;
            switch (e.tag) {
              case 31:
              case 13:
                var r = e.stateNode,
                  a = e.memoizedState;
                null !== a && (n = a.retryLane);
                break;
              case 19:
                r = e.stateNode;
                break;
              case 22:
                r = e.stateNode._retryCache;
                break;
              default:
                throw Error(o(314));
            }
            null !== r && r.delete(t), qd(e, n);
          }
          var Qd = null,
            Zd = null,
            Xd = !1,
            Jd = !1,
            ef = !1,
            tf = 0;
          function nf(e) {
            e !== Zd &&
              null === e.next &&
              (null === Zd ? (Qd = Zd = e) : (Zd = Zd.next = e)),
              (Jd = !0),
              Xd ||
                ((Xd = !0),
                Yf(function () {
                  6 & Tc ? ke(Ce, af) : of();
                }));
          }
          function rf(e, t) {
            if (!ef && Jd) {
              ef = !0;
              do {
                for (var n = !1, r = Qd; null !== r; ) {
                  if (!t)
                    if (0 !== e) {
                      var a = r.pendingLanes;
                      if (0 === a) var o = 0;
                      else {
                        var i = r.suspendedLanes,
                          l = r.pingedLanes;
                        (o = (1 << (31 - De(42 | e) + 1)) - 1),
                          (o =
                            201326741 & (o &= a & ~(i & ~l))
                              ? (201326741 & o) | 1
                              : o
                              ? 2 | o
                              : 0);
                      }
                      0 !== o && ((n = !0), uf(r, o));
                    } else
                      (o = Pc),
                        !(
                          3 &
                          (o = Ve(
                            r,
                            r === Nc ? o : 0,
                            null !== r.cancelPendingCommit || -1 !== r.timeoutHandle,
                          ))
                        ) ||
                          We(r, o) ||
                          ((n = !0), uf(r, o));
                  r = r.next;
                }
              } while (n);
              ef = !1;
            }
          }
          function af() {
            of();
          }
          function of() {
            Jd = Xd = !1;
            var e = 0;
            0 !== tf &&
              (function () {
                var e = window.event;
                if (e && 'popstate' === e.type) return e !== Hf && ((Hf = e), !0);
                return (Hf = null), !1;
              })() &&
              (e = tf);
            for (var t = _e(), n = null, r = Qd; null !== r; ) {
              var a = r.next,
                o = lf(r, t);
              0 === o
                ? ((r.next = null),
                  null === n ? (Qd = a) : (n.next = a),
                  null === a && (Zd = n))
                : ((n = r), (0 !== e || 3 & o) && (Jd = !0)),
                (r = a);
            }
            (0 !== Xc && 5 !== Xc) || rf(e, !1), 0 !== tf && (tf = 0);
          }
          function lf(e, t) {
            for (
              var n = e.suspendedLanes,
                r = e.pingedLanes,
                a = e.expirationTimes,
                o = -62914561 & e.pendingLanes;
              0 < o;

            ) {
              var i = 31 - De(o),
                l = 1 << i,
                s = a[i];
              -1 === s
                ? (0 !== (l & n) && 0 === (l & r)) || (a[i] = qe(l, t))
                : s <= t && (e.expiredLanes |= l),
                (o &= ~l);
            }
            if (
              ((n = Pc),
              (n = Ve(
                e,
                e === (t = Nc) ? n : 0,
                null !== e.cancelPendingCommit || -1 !== e.timeoutHandle,
              )),
              (r = e.callbackNode),
              0 === n ||
                (e === t && (2 === jc || 9 === jc)) ||
                null !== e.cancelPendingCommit)
            )
              return (
                null !== r && null !== r && Se(r),
                (e.callbackNode = null),
                (e.callbackPriority = 0)
              );
            if (!(3 & n) || We(e, n)) {
              if ((t = n & -n) === e.callbackPriority) return t;
              switch ((null !== r && Se(r), tt(n))) {
                case 2:
                case 8:
                  n = Te;
                  break;
                case 32:
                default:
                  n = Ne;
                  break;
                case 268435456:
                  n = Pe;
              }
              return (
                (r = sf.bind(null, e)),
                (n = ke(n, r)),
                (e.callbackPriority = t),
                (e.callbackNode = n),
                t
              );
            }
            return (
              null !== r && null !== r && Se(r),
              (e.callbackPriority = 2),
              (e.callbackNode = null),
              2
            );
          }
          function sf(e, t) {
            if (0 !== Xc && 5 !== Xc)
              return (e.callbackNode = null), (e.callbackPriority = 0), null;
            var n = e.callbackNode;
            if ($d() && e.callbackNode !== n) return null;
            var r = Pc;
            return 0 ===
              (r = Ve(
                e,
                e === Nc ? r : 0,
                null !== e.cancelPendingCommit || -1 !== e.timeoutHandle,
              ))
              ? null
              : (gd(e, r, t),
                lf(e, _e()),
                null != e.callbackNode && e.callbackNode === n ? sf.bind(null, e) : null);
          }
          function uf(e, t) {
            if ($d()) return null;
            gd(e, t, !0);
          }
          function cf() {
            if (0 === tf) {
              var e = bo;
              0 === e && ((e = Be), !(261888 & (Be <<= 1)) && (Be = 256)), (tf = e);
            }
            return tf;
          }
          function df(e) {
            return null == e || 'symbol' == typeof e || 'boolean' == typeof e
              ? null
              : 'function' == typeof e
              ? e
              : Xt(e);
          }
          for (var ff = 0; ff < qr.length; ff++) {
            var pf = qr[ff];
            Yr(pf.toLowerCase(), 'on' + (pf[0].toUpperCase() + pf.slice(1)));
          }
          Yr(Mr, 'onAnimationEnd'),
            Yr(Br, 'onAnimationIteration'),
            Yr($r, 'onAnimationStart'),
            Yr('dblclick', 'onDoubleClick'),
            Yr('focusin', 'onFocus'),
            Yr('focusout', 'onBlur'),
            Yr(Ur, 'onTransitionRun'),
            Yr(Hr, 'onTransitionStart'),
            Yr(Vr, 'onTransitionCancel'),
            Yr(Wr, 'onTransitionEnd'),
            Et('onMouseEnter', ['mouseout', 'mouseover']),
            Et('onMouseLeave', ['mouseout', 'mouseover']),
            Et('onPointerEnter', ['pointerout', 'pointerover']),
            Et('onPointerLeave', ['pointerout', 'pointerover']),
            xt(
              'onChange',
              'change click focusin focusout input keydown keyup selectionchange'.split(
                ' ',
              ),
            ),
            xt(
              'onSelect',
              'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
                ' ',
              ),
            ),
            xt('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
            xt(
              'onCompositionEnd',
              'compositionend focusout keydown keypress keyup mousedown'.split(' '),
            ),
            xt(
              'onCompositionStart',
              'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
            ),
            xt(
              'onCompositionUpdate',
              'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
            );
          var gf =
              'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
                ' ',
              ),
            mf = new Set(
              'beforetoggle cancel close invalid load scroll scrollend toggle'
                .split(' ')
                .concat(gf),
            );
          function hf(e, t) {
            t = !!(4 & t);
            for (var n = 0; n < e.length; n++) {
              var r = e[n],
                a = r.event;
              r = r.listeners;
              e: {
                var o = void 0;
                if (t)
                  for (var i = r.length - 1; 0 <= i; i--) {
                    var l = r[i],
                      s = l.instance,
                      u = l.currentTarget;
                    if (((l = l.listener), s !== o && a.isPropagationStopped())) break e;
                    (o = l), (a.currentTarget = u);
                    try {
                      o(a);
                    } catch (c) {
                      Jr(c);
                    }
                    (a.currentTarget = null), (o = s);
                  }
                else
                  for (i = 0; i < r.length; i++) {
                    if (
                      ((s = (l = r[i]).instance),
                      (u = l.currentTarget),
                      (l = l.listener),
                      s !== o && a.isPropagationStopped())
                    )
                      break e;
                    (o = l), (a.currentTarget = u);
                    try {
                      o(a);
                    } catch (c) {
                      Jr(c);
                    }
                    (a.currentTarget = null), (o = s);
                  }
              }
            }
          }
          function yf(e, t) {
            var n = t[st];
            void 0 === n && (n = t[st] = new Set());
            var r = e + '__bubble';
            n.has(r) || (kf(t, e, 2, !1), n.add(r));
          }
          function vf(e, t, n) {
            var r = 0;
            t && (r |= 4), kf(n, e, r, t);
          }
          var bf = '_reactListening' + Math.random().toString(36).slice(2);
          function wf(e) {
            if (!e[bf]) {
              (e[bf] = !0),
                kt.forEach(function (t) {
                  'selectionchange' !== t && (mf.has(t) || vf(t, !1, e), vf(t, !0, e));
                });
              var t = 9 === e.nodeType ? e : e.ownerDocument;
              null === t || t[bf] || ((t[bf] = !0), vf('selectionchange', !1, t));
            }
          }
          function kf(e, t, n, r) {
            switch (Og(t)) {
              case 2:
                var a = Eg;
                break;
              case 8:
                a = _g;
                break;
              default:
                a = Ag;
            }
            (n = a.bind(null, t, n, e)),
              (a = void 0),
              !cn ||
                ('touchstart' !== t && 'touchmove' !== t && 'wheel' !== t) ||
                (a = !0),
              r
                ? void 0 !== a
                  ? e.addEventListener(t, n, { capture: !0, passive: a })
                  : e.addEventListener(t, n, !0)
                : void 0 !== a
                ? e.addEventListener(t, n, { passive: a })
                : e.addEventListener(t, n, !1);
          }
          function Sf(e, t, n, r, a) {
            var o = r;
            if (!(1 & t || 2 & t || null === r))
              e: for (;;) {
                if (null === r) return;
                var i = r.tag;
                if (3 === i || 4 === i) {
                  var s = r.stateNode.containerInfo;
                  if (s === a) break;
                  if (4 === i)
                    for (i = r.return; null !== i; ) {
                      var u = i.tag;
                      if ((3 === u || 4 === u) && i.stateNode.containerInfo === a) return;
                      i = i.return;
                    }
                  for (; null !== s; ) {
                    if (null === (i = mt(s))) return;
                    if (5 === (u = i.tag) || 6 === u || 26 === u || 27 === u) {
                      r = o = i;
                      continue e;
                    }
                    s = s.parentNode;
                  }
                }
                r = r.return;
              }
            ln(function () {
              var r = o,
                a = tn(n),
                i = [];
              e: {
                var s = Gr.get(e);
                if (void 0 !== s) {
                  var u = En,
                    c = e;
                  switch (e) {
                    case 'keypress':
                      if (0 === hn(n)) break e;
                    case 'keydown':
                    case 'keyup':
                      u = Mn;
                      break;
                    case 'focusin':
                      (c = 'focus'), (u = On);
                      break;
                    case 'focusout':
                      (c = 'blur'), (u = On);
                      break;
                    case 'beforeblur':
                    case 'afterblur':
                      u = On;
                      break;
                    case 'click':
                      if (2 === n.button) break e;
                    case 'auxclick':
                    case 'dblclick':
                    case 'mousedown':
                    case 'mousemove':
                    case 'mouseup':
                    case 'mouseout':
                    case 'mouseover':
                    case 'contextmenu':
                      u = Tn;
                      break;
                    case 'drag':
                    case 'dragend':
                    case 'dragenter':
                    case 'dragexit':
                    case 'dragleave':
                    case 'dragover':
                    case 'dragstart':
                    case 'drop':
                      u = Nn;
                      break;
                    case 'touchcancel':
                    case 'touchend':
                    case 'touchmove':
                    case 'touchstart':
                      u = Un;
                      break;
                    case Mr:
                    case Br:
                    case $r:
                      u = Pn;
                      break;
                    case Wr:
                      u = Hn;
                      break;
                    case 'scroll':
                    case 'scrollend':
                      u = An;
                      break;
                    case 'wheel':
                      u = Vn;
                      break;
                    case 'copy':
                    case 'cut':
                    case 'paste':
                      u = jn;
                      break;
                    case 'gotpointercapture':
                    case 'lostpointercapture':
                    case 'pointercancel':
                    case 'pointerdown':
                    case 'pointermove':
                    case 'pointerout':
                    case 'pointerover':
                    case 'pointerup':
                      u = Bn;
                      break;
                    case 'submit':
                      u = $n;
                      break;
                    case 'toggle':
                    case 'beforetoggle':
                      u = Wn;
                  }
                  var d = !!(4 & t),
                    f = !d && ('scroll' === e || 'scrollend' === e),
                    p = d ? (null !== s ? s + 'Capture' : null) : s;
                  d = [];
                  for (var g, m = r; null !== m; ) {
                    var h = m;
                    if (
                      ((g = h.stateNode),
                      (5 !== (h = h.tag) && 26 !== h && 27 !== h) ||
                        null === g ||
                        null === p ||
                        (null != (h = sn(m, p)) && d.push(xf(m, h, g))),
                      f)
                    )
                      break;
                    m = m.return;
                  }
                  0 < d.length &&
                    ((s = new u(s, c, null, n, a)), i.push({ event: s, listeners: d }));
                }
              }
              if (!(7 & t)) {
                if (
                  ((s = 'mouseout' === e || 'pointerout' === e),
                  ((u = 'mouseover' === e || 'pointerover' === e) &&
                    n !== en &&
                    (c = n.relatedTarget || n.fromElement) &&
                    (mt(c) || c[lt])) ||
                    ((s || u) &&
                      ((c =
                        a.window === a
                          ? a
                          : (u = a.ownerDocument)
                          ? u.defaultView || u.parentWindow
                          : window),
                      s
                        ? ((s = r),
                          null !==
                            (u = (u = n.relatedTarget || n.toElement) ? mt(u) : null) &&
                            ((f = l(u)),
                            (d = u.tag),
                            u !== f || (5 !== d && 27 !== d && 6 !== d)) &&
                            (u = null))
                        : ((s = null), (u = r)),
                      s !== u &&
                        ((d = Tn),
                        (h = 'onMouseLeave'),
                        (p = 'onMouseEnter'),
                        (m = 'mouse'),
                        ('pointerout' !== e && 'pointerover' !== e) ||
                          ((d = Bn),
                          (h = 'onPointerLeave'),
                          (p = 'onPointerEnter'),
                          (m = 'pointer')),
                        (f = null == s ? c : yt(s)),
                        (g = null == u ? c : yt(u)),
                        ((c = new d(h, m + 'leave', s, n, a)).target = f),
                        (c.relatedTarget = g),
                        (h = null),
                        mt(a) === r &&
                          (((d = new d(p, m + 'enter', u, n, a)).target = g),
                          (d.relatedTarget = f),
                          (h = d)),
                        (f = h),
                        (d = s && u ? A(s, u, _f) : null),
                        null !== s && Af(i, c, s, d, !1),
                        null !== u && null !== f && Af(i, f, u, d, !0)))),
                  'select' ===
                    (u = (s = r ? yt(r) : window).nodeName && s.nodeName.toLowerCase()) ||
                    ('input' === u && 'file' === s.type))
                )
                  var y = ur;
                else if (rr(s))
                  if (cr) y = br;
                  else {
                    y = yr;
                    var v = hr;
                  }
                else
                  !(u = s.nodeName) ||
                  'input' !== u.toLowerCase() ||
                  ('checkbox' !== s.type && 'radio' !== s.type)
                    ? r && Kt(r.elementType) && (y = ur)
                    : (y = vr);
                switch (
                  (y && (y = y(e, r)) ? ar(i, y, n, a) : v && v(e, s, r),
                  (v = r ? yt(r) : window),
                  e)
                ) {
                  case 'focusin':
                    (rr(v) || 'true' === v.contentEditable) &&
                      ((Nr = v), (Or = r), (Pr = null));
                    break;
                  case 'focusout':
                    Pr = Or = Nr = null;
                    break;
                  case 'mousedown':
                    jr = !0;
                    break;
                  case 'contextmenu':
                  case 'mouseup':
                  case 'dragend':
                    (jr = !1), Lr(i, n, a);
                    break;
                  case 'selectionchange':
                    if (Tr) break;
                  case 'keydown':
                  case 'keyup':
                    Lr(i, n, a);
                }
                var b;
                if (qn)
                  e: {
                    switch (e) {
                      case 'compositionstart':
                        var w = 'onCompositionStart';
                        break e;
                      case 'compositionend':
                        w = 'onCompositionEnd';
                        break e;
                      case 'compositionupdate':
                        w = 'onCompositionUpdate';
                        break e;
                    }
                    w = void 0;
                  }
                else
                  tr
                    ? Jn(e, n) && (w = 'onCompositionEnd')
                    : 'keydown' === e && 229 === n.keyCode && (w = 'onCompositionStart');
                w &&
                  (Qn &&
                    'ko' !== n.locale &&
                    (tr || 'onCompositionStart' !== w
                      ? 'onCompositionEnd' === w && tr && (b = mn())
                      : ((pn = 'value' in (fn = a) ? fn.value : fn.textContent),
                        (tr = !0))),
                  0 < (v = Ef(r, w)).length &&
                    ((w = new Ln(w, e, null, n, a)),
                    i.push({ event: w, listeners: v }),
                    b ? (w.data = b) : null !== (b = er(n)) && (w.data = b))),
                  (b = Kn
                    ? (function (e, t) {
                        switch (e) {
                          case 'compositionend':
                            return er(t);
                          case 'keypress':
                            return 32 !== t.which ? null : ((Xn = !0), Zn);
                          case 'textInput':
                            return (e = t.data) === Zn && Xn ? null : e;
                          default:
                            return null;
                        }
                      })(e, n)
                    : (function (e, t) {
                        if (tr)
                          return 'compositionend' === e || (!qn && Jn(e, t))
                            ? ((e = mn()), (gn = pn = fn = null), (tr = !1), e)
                            : null;
                        switch (e) {
                          case 'paste':
                          default:
                            return null;
                          case 'keypress':
                            if (
                              !(t.ctrlKey || t.altKey || t.metaKey) ||
                              (t.ctrlKey && t.altKey)
                            ) {
                              if (t.char && 1 < t.char.length) return t.char;
                              if (t.which) return String.fromCharCode(t.which);
                            }
                            return null;
                          case 'compositionend':
                            return Qn && 'ko' !== t.locale ? null : t.data;
                        }
                      })(e, n)) &&
                    0 < (w = Ef(r, 'onBeforeInput')).length &&
                    ((v = new Ln('onBeforeInput', 'beforeinput', null, n, a)),
                    i.push({ event: v, listeners: w }),
                    (v.data = b)),
                  (function (e, t, n, r, a) {
                    if ('submit' === t && n && n.stateNode === a) {
                      var o = df((a[it] || null).action),
                        i = r.submitter;
                      i &&
                        null !==
                          (t = (t = i[it] || null)
                            ? df(t.formAction)
                            : i.getAttribute('formAction')) &&
                        ((o = t), (i = null));
                      var l = new En('action', 'action', null, r, a);
                      e.push({
                        event: l,
                        listeners: [
                          {
                            instance: null,
                            listener: function () {
                              if (r.defaultPrevented) {
                                if (0 !== tf) {
                                  var e = new FormData(a, i);
                                  jl(
                                    n,
                                    { pending: !0, data: e, method: a.method, action: o },
                                    null,
                                    e,
                                  );
                                }
                              } else
                                'function' == typeof o &&
                                  (l.preventDefault(),
                                  (e = new FormData(a, i)),
                                  jl(
                                    n,
                                    { pending: !0, data: e, method: a.method, action: o },
                                    o,
                                    e,
                                  ));
                            },
                            currentTarget: a,
                          },
                        ],
                      });
                    }
                  })(i, e, r, n, a);
              }
              hf(i, t);
            });
          }
          function xf(e, t, n) {
            return { instance: e, listener: t, currentTarget: n };
          }
          function Ef(e, t) {
            for (var n = t + 'Capture', r = []; null !== e; ) {
              var a = e,
                o = a.stateNode;
              if (
                ((5 !== (a = a.tag) && 26 !== a && 27 !== a) ||
                  null === o ||
                  (null != (a = sn(e, n)) && r.unshift(xf(e, a, o)),
                  null != (a = sn(e, t)) && r.push(xf(e, a, o))),
                3 === e.tag)
              )
                return r;
              e = e.return;
            }
            return [];
          }
          function _f(e) {
            if (null === e) return null;
            do {
              e = e.return;
            } while (e && 5 !== e.tag && 27 !== e.tag);
            return e || null;
          }
          function Af(e, t, n, r, a) {
            for (var o = t._reactName, i = []; null !== n && n !== r; ) {
              var l = n,
                s = l.alternate,
                u = l.stateNode;
              if (((l = l.tag), null !== s && s === r)) break;
              (5 !== l && 26 !== l && 27 !== l) ||
                null === u ||
                ((s = u),
                a
                  ? null != (u = sn(n, o)) && i.unshift(xf(n, u, s))
                  : a || (null != (u = sn(n, o)) && i.push(xf(n, u, s)))),
                (n = n.return);
            }
            0 !== i.length && e.push({ event: t, listeners: i });
          }
          var Cf = /\r\n?/g,
            Tf = /\u0000|\uFFFD/g;
          function Nf(e) {
            return ('string' == typeof e ? e : '' + e).replace(Cf, '\n').replace(Tf, '');
          }
          function Of(e, t) {
            return (t = Nf(t)), Nf(e) === t;
          }
          function Pf(e, t, n, r, a, i) {
            switch (n) {
              case 'children':
                if ('string' == typeof r)
                  'body' === t || ('textarea' === t && '' === r) || Wt(e, r);
                else {
                  if ('number' != typeof r && 'bigint' != typeof r) return;
                  'body' !== t && Wt(e, '' + r);
                }
                break;
              case 'className':
                Pt(e, 'class', r);
                break;
              case 'tabIndex':
                Pt(e, 'tabindex', r);
                break;
              case 'dir':
              case 'role':
              case 'viewBox':
              case 'width':
              case 'height':
                Pt(e, n, r);
                break;
              case 'style':
                return void Yt(e, r, i);
              case 'data':
                if ('object' !== t) {
                  Pt(e, 'data', r);
                  break;
                }
              case 'src':
              case 'href':
                if ('' === r && ('a' !== t || 'href' !== n)) {
                  e.removeAttribute(n);
                  break;
                }
                if (
                  null == r ||
                  'function' == typeof r ||
                  'symbol' == typeof r ||
                  'boolean' == typeof r
                ) {
                  e.removeAttribute(n);
                  break;
                }
                (r = Xt(r)), e.setAttribute(n, r);
                break;
              case 'action':
              case 'formAction':
                if ('function' == typeof r) {
                  e.setAttribute(
                    n,
                    "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
                  );
                  break;
                }
                if (
                  ('function' == typeof i &&
                    ('formAction' === n
                      ? ('input' !== t && Pf(e, t, 'name', a.name, a, null),
                        Pf(e, t, 'formEncType', a.formEncType, a, null),
                        Pf(e, t, 'formMethod', a.formMethod, a, null),
                        Pf(e, t, 'formTarget', a.formTarget, a, null))
                      : (Pf(e, t, 'encType', a.encType, a, null),
                        Pf(e, t, 'method', a.method, a, null),
                        Pf(e, t, 'target', a.target, a, null))),
                  null == r || 'symbol' == typeof r || 'boolean' == typeof r)
                ) {
                  e.removeAttribute(n);
                  break;
                }
                (r = Xt(r)), e.setAttribute(n, r);
                break;
              case 'onClick':
                return void (null != r && (e.onclick = Jt));
              case 'onScroll':
                return void (null != r && yf('scroll', e));
              case 'onScrollEnd':
                return void (null != r && yf('scrollend', e));
              case 'dangerouslySetInnerHTML':
                if (null != r) {
                  if ('object' != typeof r || !('__html' in r)) throw Error(o(61));
                  if (null != (n = r.__html)) {
                    if (null != a.children) throw Error(o(60));
                    (null != i ? i.__html : void 0) !== n && (e.innerHTML = n);
                  }
                }
                break;
              case 'multiple':
                e.multiple = r && 'function' != typeof r && 'symbol' != typeof r;
                break;
              case 'muted':
                e.muted = r && 'function' != typeof r && 'symbol' != typeof r;
                break;
              case 'suppressContentEditableWarning':
              case 'suppressHydrationWarning':
              case 'defaultValue':
              case 'defaultChecked':
              case 'innerHTML':
              case 'ref':
              case 'autoFocus':
                break;
              case 'xlinkHref':
                if (
                  null == r ||
                  'function' == typeof r ||
                  'boolean' == typeof r ||
                  'symbol' == typeof r
                ) {
                  e.removeAttribute('xlink:href');
                  break;
                }
                (n = Xt(r)),
                  e.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', n);
                break;
              case 'contentEditable':
              case 'spellCheck':
              case 'draggable':
              case 'value':
              case 'autoReverse':
              case 'externalResourcesRequired':
              case 'focusable':
              case 'preserveAlpha':
                null != r && 'function' != typeof r && 'symbol' != typeof r
                  ? e.setAttribute(n, r)
                  : e.removeAttribute(n);
                break;
              case 'inert':
              case 'allowFullScreen':
              case 'async':
              case 'autoPlay':
              case 'controls':
              case 'credentialless':
              case 'default':
              case 'defer':
              case 'disabled':
              case 'disablePictureInPicture':
              case 'disableRemotePlayback':
              case 'formNoValidate':
              case 'hidden':
              case 'loop':
              case 'noModule':
              case 'noValidate':
              case 'open':
              case 'playsInline':
              case 'readOnly':
              case 'required':
              case 'reversed':
              case 'scoped':
              case 'seamless':
              case 'itemScope':
                r && 'function' != typeof r && 'symbol' != typeof r
                  ? e.setAttribute(n, '')
                  : e.removeAttribute(n);
                break;
              case 'capture':
              case 'download':
                !0 === r
                  ? e.setAttribute(n, '')
                  : !1 !== r &&
                    null != r &&
                    'function' != typeof r &&
                    'symbol' != typeof r
                  ? e.setAttribute(n, r)
                  : e.removeAttribute(n);
                break;
              case 'cols':
              case 'rows':
              case 'size':
              case 'span':
                null != r &&
                'function' != typeof r &&
                'symbol' != typeof r &&
                !isNaN(r) &&
                1 <= r
                  ? e.setAttribute(n, r)
                  : e.removeAttribute(n);
                break;
              case 'rowSpan':
              case 'start':
                null == r || 'function' == typeof r || 'symbol' == typeof r || isNaN(r)
                  ? e.removeAttribute(n)
                  : e.setAttribute(n, r);
                break;
              case 'popover':
                yf('beforetoggle', e), yf('toggle', e), Ot(e, 'popover', r);
                break;
              case 'xlinkActuate':
                jt(e, 'http://www.w3.org/1999/xlink', 'xlink:actuate', r);
                break;
              case 'xlinkArcrole':
                jt(e, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', r);
                break;
              case 'xlinkRole':
                jt(e, 'http://www.w3.org/1999/xlink', 'xlink:role', r);
                break;
              case 'xlinkShow':
                jt(e, 'http://www.w3.org/1999/xlink', 'xlink:show', r);
                break;
              case 'xlinkTitle':
                jt(e, 'http://www.w3.org/1999/xlink', 'xlink:title', r);
                break;
              case 'xlinkType':
                jt(e, 'http://www.w3.org/1999/xlink', 'xlink:type', r);
                break;
              case 'xmlBase':
                jt(e, 'http://www.w3.org/XML/1998/namespace', 'xml:base', r);
                break;
              case 'xmlLang':
                jt(e, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', r);
                break;
              case 'xmlSpace':
                jt(e, 'http://www.w3.org/XML/1998/namespace', 'xml:space', r);
                break;
              case 'is':
                Ot(e, 'is', r);
                break;
              case 'innerText':
              case 'textContent':
                return;
              default:
                if (
                  2 < n.length &&
                  ('o' === n[0] || 'O' === n[0]) &&
                  ('n' === n[1] || 'N' === n[1])
                )
                  return;
                Ot(e, (n = Qt.get(n) || n), r);
            }
            Tt = !0;
          }
          function jf(e, t, n, r, a, i) {
            switch (n) {
              case 'style':
                return void Yt(e, r, i);
              case 'dangerouslySetInnerHTML':
                if (null != r) {
                  if ('object' != typeof r || !('__html' in r)) throw Error(o(61));
                  if (null != (n = r.__html)) {
                    if (null != a.children) throw Error(o(60));
                    (null != i ? i.__html : void 0) !== n && (e.innerHTML = n);
                  }
                }
                break;
              case 'children':
                if ('string' == typeof r) Wt(e, r);
                else {
                  if ('number' != typeof r && 'bigint' != typeof r) return;
                  Wt(e, '' + r);
                }
                break;
              case 'onScroll':
                return void (null != r && yf('scroll', e));
              case 'onScrollEnd':
                return void (null != r && yf('scrollend', e));
              case 'onClick':
                return void (null != r && (e.onclick = Jt));
              case 'suppressContentEditableWarning':
              case 'suppressHydrationWarning':
              case 'innerHTML':
              case 'ref':
              case 'innerText':
              case 'textContent':
                return;
              default:
                return void (
                  St.hasOwnProperty(n) ||
                  ('o' !== n[0] ||
                  'n' !== n[1] ||
                  ((a = n.endsWith('Capture')),
                  (i = n.slice(2, a ? n.length - 7 : void 0)),
                  'function' == typeof (t = null != (t = e[it] || null) ? t[n] : null) &&
                    e.removeEventListener(i, t, a),
                  'function' != typeof r)
                    ? ((Tt = !0),
                      n in e
                        ? (e[n] = r)
                        : !0 === r
                        ? e.setAttribute(n, '')
                        : Ot(e, n, r))
                    : ('function' != typeof t &&
                        null !== t &&
                        (n in e
                          ? (e[n] = null)
                          : e.hasAttribute(n) && e.removeAttribute(n)),
                      e.addEventListener(i, r, a)))
                );
            }
            Tt = !0;
          }
          function Lf(e, t, n) {
            switch (t) {
              case 'div':
              case 'span':
              case 'svg':
              case 'path':
              case 'a':
              case 'g':
              case 'p':
              case 'li':
                break;
              case 'img':
                yf('error', e), yf('load', e);
                var r,
                  a = !1,
                  i = !1;
                for (r in n)
                  if (n.hasOwnProperty(r)) {
                    var l = n[r];
                    if (null != l)
                      switch (r) {
                        case 'src':
                          a = !0;
                          break;
                        case 'srcSet':
                          i = !0;
                          break;
                        case 'children':
                        case 'dangerouslySetInnerHTML':
                          throw Error(o(137, t));
                        default:
                          Pf(e, t, r, l, n, null);
                      }
                  }
                return (
                  i && Pf(e, t, 'srcSet', n.srcSet, n, null),
                  void (a && Pf(e, t, 'src', n.src, n, null))
                );
              case 'input':
                yf('invalid', e);
                var s = (r = l = i = null),
                  u = null,
                  c = null;
                for (a in n)
                  if (n.hasOwnProperty(a)) {
                    var d = n[a];
                    if (null != d)
                      switch (a) {
                        case 'name':
                          i = d;
                          break;
                        case 'type':
                          l = d;
                          break;
                        case 'checked':
                          u = d;
                          break;
                        case 'defaultChecked':
                          c = d;
                          break;
                        case 'value':
                          r = d;
                          break;
                        case 'defaultValue':
                          s = d;
                          break;
                        case 'children':
                        case 'dangerouslySetInnerHTML':
                          if (null != d) throw Error(o(137, t));
                          break;
                        default:
                          Pf(e, t, a, d, n, null);
                      }
                  }
                return void Bt(e, r, s, u, c, l, i, !1);
              case 'select':
                for (i in (yf('invalid', e), (a = l = r = null), n))
                  if (n.hasOwnProperty(i) && null != (s = n[i]))
                    switch (i) {
                      case 'value':
                        r = s;
                        break;
                      case 'defaultValue':
                        l = s;
                        break;
                      case 'multiple':
                        a = s;
                      default:
                        Pf(e, t, i, s, n, null);
                    }
                return (
                  (t = r),
                  (n = l),
                  (e.multiple = !!a),
                  void (null != t ? Ut(e, !!a, t, !1) : null != n && Ut(e, !!a, n, !0))
                );
              case 'textarea':
                for (l in (yf('invalid', e), (r = i = a = null), n))
                  if (n.hasOwnProperty(l) && null != (s = n[l]))
                    switch (l) {
                      case 'value':
                        a = s;
                        break;
                      case 'defaultValue':
                        i = s;
                        break;
                      case 'children':
                        r = s;
                        break;
                      case 'dangerouslySetInnerHTML':
                        if (null != s) throw Error(o(91));
                        break;
                      default:
                        Pf(e, t, l, s, n, null);
                    }
                return void Vt(e, a, i, r);
              case 'option':
                for (u in n)
                  if (n.hasOwnProperty(u) && null != (a = n[u]))
                    if ('selected' === u)
                      e.selected = a && 'function' != typeof a && 'symbol' != typeof a;
                    else Pf(e, t, u, a, n, null);
                return;
              case 'dialog':
                yf('beforetoggle', e), yf('toggle', e), yf('cancel', e), yf('close', e);
                break;
              case 'iframe':
              case 'object':
                yf('load', e);
                break;
              case 'video':
              case 'audio':
                for (a = 0; a < gf.length; a++) yf(gf[a], e);
                break;
              case 'image':
                yf('error', e), yf('load', e);
                break;
              case 'details':
                yf('toggle', e);
                break;
              case 'embed':
              case 'source':
              case 'link':
                yf('error', e), yf('load', e);
              case 'area':
              case 'base':
              case 'br':
              case 'col':
              case 'hr':
              case 'keygen':
              case 'meta':
              case 'param':
              case 'track':
              case 'wbr':
              case 'menuitem':
                for (c in n)
                  if (n.hasOwnProperty(c) && null != (a = n[c]))
                    switch (c) {
                      case 'children':
                      case 'dangerouslySetInnerHTML':
                        throw Error(o(137, t));
                      default:
                        Pf(e, t, c, a, n, null);
                    }
                return;
              default:
                if (Kt(t)) {
                  for (d in n)
                    n.hasOwnProperty(d) &&
                      void 0 !== (a = n[d]) &&
                      jf(e, t, d, a, n, void 0);
                  return;
                }
            }
            for (s in n)
              n.hasOwnProperty(s) && null != (a = n[s]) && Pf(e, t, s, a, n, null);
          }
          var If = {};
          function Ff(e) {
            switch (e) {
              case 'css':
              case 'script':
              case 'font':
              case 'img':
              case 'image':
              case 'input':
              case 'link':
                return !0;
              default:
                return !1;
            }
          }
          var Rf = null,
            Df = null;
          function zf(e) {
            return 9 === e.nodeType ? e : e.ownerDocument;
          }
          function Mf(e) {
            switch (e) {
              case 'http://www.w3.org/2000/svg':
                return 1;
              case 'http://www.w3.org/1998/Math/MathML':
                return 2;
              default:
                return 0;
            }
          }
          function Bf(e, t) {
            if (0 === e)
              switch (t) {
                case 'svg':
                  return 1;
                case 'math':
                  return 2;
                default:
                  return 0;
              }
            return 1 === e && 'foreignObject' === t ? 0 : e;
          }
          function $f(e, t, n, r) {
            return (
              ((n = zf(n).createElement(e))[ot] = r), (n[it] = t), Lf(n, e, t), bt(n), n
            );
          }
          function Uf(e, t) {
            return (
              'textarea' === e ||
              'noscript' === e ||
              'string' == typeof t.children ||
              'number' == typeof t.children ||
              'bigint' == typeof t.children ||
              ('object' == typeof t.dangerouslySetInnerHTML &&
                null !== t.dangerouslySetInnerHTML &&
                null != t.dangerouslySetInnerHTML.__html)
            );
          }
          var Hf = null;
          var Vf = 'function' == typeof setTimeout ? setTimeout : void 0,
            Wf = 'function' == typeof clearTimeout ? clearTimeout : void 0,
            Gf = 'function' == typeof Promise ? Promise : void 0,
            qf = 'function' == typeof requestAnimationFrame ? requestAnimationFrame : Vf,
            Yf =
              'function' == typeof queueMicrotask
                ? queueMicrotask
                : void 0 !== Gf
                ? function (e) {
                    return Gf.resolve(null).then(e).catch(Kf);
                  }
                : Vf;
          function Kf(e) {
            setTimeout(function () {
              throw e;
            });
          }
          function Qf(e) {
            return 'head' === e;
          }
          function Zf(e, t) {
            var n = t,
              r = 0;
            do {
              var a = n.nextSibling;
              if ((e.removeChild(n), a && 8 === a.nodeType))
                if ('/$' === (n = a.data) || '/&' === n) {
                  if (0 === r) return e.removeChild(a), void Yg(t);
                  r--;
                } else if (
                  '$' === n ||
                  '$?' === n ||
                  '$~' === n ||
                  '$!' === n ||
                  '&' === n
                )
                  r++;
                else if ('html' === n) Dp(e.ownerDocument.documentElement);
                else if ('head' === n) {
                  Dp((n = e.ownerDocument.head));
                  for (var o = n.firstChild; o; ) {
                    var i = o.nextSibling,
                      l = o.nodeName;
                    o[ft] ||
                      'SCRIPT' === l ||
                      'STYLE' === l ||
                      ('LINK' === l && 'stylesheet' === o.rel.toLowerCase()) ||
                      n.removeChild(o),
                      (o = i);
                  }
                } else 'body' === n && Dp(e.ownerDocument.body);
              n = a;
            } while (n);
            Yg(t);
          }
          function Xf(e, t) {
            var n = e;
            e = 0;
            do {
              var r = n.nextSibling;
              if (
                (1 === n.nodeType
                  ? t
                    ? ((n._stashedDisplay = n.style.display), (n.style.display = 'none'))
                    : ((n.style.display = n._stashedDisplay || ''),
                      '' === n.getAttribute('style') && n.removeAttribute('style'))
                  : 3 === n.nodeType &&
                    (t
                      ? ((n._stashedText = n.nodeValue), (n.nodeValue = ''))
                      : (n.nodeValue = n._stashedText || '')),
                r && 8 === r.nodeType)
              )
                if ('/$' === (n = r.data)) {
                  if (0 === e) break;
                  e--;
                } else ('$' !== n && '$?' !== n && '$~' !== n && '$!' !== n) || e++;
              n = r;
            } while (n);
          }
          function Jf(e, t, n) {
            if (
              ((t = CSS.escape(t) !== t ? 'r-' + btoa(t).replace(/=/g, '') : t),
              (e.style.viewTransitionName = t),
              null != n && (e.style.viewTransitionClass = n),
              'inline' === (n = getComputedStyle(e)).display)
            ) {
              if (1 === (t = e.getClientRects()).length) var r = 1;
              else
                for (var a = (r = 0); a < t.length; a++) {
                  var o = t[a];
                  0 < o.width && 0 < o.height && r++;
                }
              1 === r &&
                (((e = e.style).display = 1 === t.length ? 'inline-block' : 'block'),
                (e.marginTop = '-' + n.paddingTop),
                (e.marginBottom = '-' + n.paddingBottom));
            }
          }
          function ep(e, t) {
            e = e.style;
            var n =
              null != (t = t.style)
                ? t.hasOwnProperty('viewTransitionName')
                  ? t.viewTransitionName
                  : t.hasOwnProperty('view-transition-name')
                  ? t['view-transition-name']
                  : null
                : null;
            (e.viewTransitionName =
              null == n || 'boolean' == typeof n ? '' : ('' + n).trim()),
              (n =
                null != t
                  ? t.hasOwnProperty('viewTransitionClass')
                    ? t.viewTransitionClass
                    : t.hasOwnProperty('view-transition-class')
                    ? t['view-transition-class']
                    : null
                  : null),
              (e.viewTransitionClass =
                null == n || 'boolean' == typeof n ? '' : ('' + n).trim()),
              'inline-block' === e.display &&
                (null == t
                  ? (e.display = e.margin = '')
                  : ((n = t.display),
                    (e.display = null == n || 'boolean' == typeof n ? '' : n),
                    null != (n = t.margin)
                      ? (e.margin = n)
                      : ((n = t.hasOwnProperty('marginTop')
                          ? t.marginTop
                          : t['margin-top']),
                        (e.marginTop = null == n || 'boolean' == typeof n ? '' : n),
                        (t = t.hasOwnProperty('marginBottom')
                          ? t.marginBottom
                          : t['margin-bottom']),
                        (e.marginBottom = null == t || 'boolean' == typeof t ? '' : t))));
          }
          function tp(e, t, n) {
            return (
              (n = n.ownerDocument.defaultView),
              {
                rect: e,
                abs: 'absolute' === t.position || 'fixed' === t.position,
                clip:
                  'none' !== t.clipPath ||
                  'visible' !== t.overflow ||
                  'none' !== t.filter ||
                  'none' !== t.mask ||
                  'none' !== t.mask ||
                  '0px' !== t.borderRadius,
                view:
                  0 <= e.bottom &&
                  0 <= e.right &&
                  e.top <= n.innerHeight &&
                  e.left <= n.innerWidth,
              }
            );
          }
          function np(e) {
            return tp(e.getBoundingClientRect(), getComputedStyle(e), e);
          }
          function rp(e) {
            var t = e.getBoundingClientRect();
            return tp(
              (t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height)),
              getComputedStyle(e),
              e,
            );
          }
          function ap(e) {
            this.addEventListener('load', e), this.addEventListener('error', e);
          }
          function op(e, t) {
            (this._scope = document.documentElement),
              (this._selector = '::view-transition-' + e + '(' + t + ')');
          }
          function ip(e) {
            return {
              name: e,
              group: new op('group', e),
              imagePair: new op('image-pair', e),
              old: new op('old', e),
              new: new op('new', e),
            };
          }
          function lp(e) {
            (this._fragmentFiber = e), (this._observers = this._eventListeners = null);
          }
          function sp(e, t, n, r) {
            return w(e).addEventListener(t, n, r), !1;
          }
          function up(e, t, n, r) {
            return w(e).removeEventListener(t, n, r), !1;
          }
          function cp(e) {
            return null != e &&
              'boolean' != typeof e &&
              (!0 === e.once || e.signal instanceof AbortSignal)
              ? { capture: e.capture, passive: e.passive }
              : e;
          }
          function dp(e) {
            return null == e
              ? 'c=0'
              : 'boolean' == typeof e
              ? 'c=' + (e ? '1' : '0')
              : 'c=' + (e.capture ? '1' : '0');
          }
          function fp(e, t, n, r) {
            if (0 === e.length) return -1;
            r = dp(r);
            for (var a = 0; a < e.length; a++) {
              var o = e[a];
              if (o.type === t && o.listener === n && dp(o.optionsOrUseCapture) === r)
                return a;
            }
            return -1;
          }
          function pp(e, t) {
            return (
              6 !== e.tag &&
              (function (e, t) {
                function n() {
                  r = !0;
                }
                if (e.ownerDocument.activeElement === e) return !0;
                var r = !1;
                try {
                  e.ownerDocument.addEventListener('focus', n, !0),
                    (e.focus || HTMLElement.prototype.focus).call(e, t);
                } finally {
                  e.ownerDocument.removeEventListener('focus', n, !0);
                }
                return r;
              })((e = w(e)), t)
            );
          }
          function gp(e, t) {
            return t.push(e), !1;
          }
          function mp(e, t) {
            return 6 !== e.tag && !((e = w(e)) !== t && !e.contains(t)) && (t.blur(), !0);
          }
          function hp(e, t) {
            return 6 === e.tag || ((e = w(e)), t.observe(e)), !1;
          }
          function yp(e, t) {
            return 6 === e.tag || ((e = w(e)), t.unobserve(e)), !1;
          }
          (op.prototype.animate = function (e, t) {
            return (
              ((t = 'number' == typeof t ? { duration: t } : C({}, t)).pseudoElement =
                this._selector),
              this._scope.animate(e, t)
            );
          }),
            (op.prototype.getAnimations = function () {
              for (
                var e = this._scope,
                  t = this._selector,
                  n = e.getAnimations({ subtree: !0 }),
                  r = [],
                  a = 0;
                a < n.length;
                a++
              ) {
                var o = n[a].effect;
                null !== o && o.target === e && o.pseudoElement === t && r.push(n[a]);
              }
              return r;
            }),
            (op.prototype.getComputedStyle = function () {
              return getComputedStyle(this._scope, this._selector);
            }),
            (lp.prototype.addEventListener = function (e, t, n) {
              var r = null,
                a = null;
              if (
                null == n ||
                'boolean' == typeof n ||
                null === (r = n.signal || null) ||
                !r.aborted
              ) {
                null === this._eventListeners && (this._eventListeners = []);
                var o = this._eventListeners;
                if (-1 === fp(o, e, t, n)) {
                  var i = this,
                    l = t;
                  null != n &&
                    'boolean' != typeof n &&
                    !0 === n.once &&
                    (l = function (r) {
                      i.removeEventListener(e, t, n),
                        'function' == typeof t ? t.call(this, r) : t.handleEvent(r);
                    }),
                    null !== r &&
                      ((a = i.removeEventListener.bind(i, e, t, n)),
                      r.addEventListener('abort', a, { once: !0 }),
                      (a = r.removeEventListener.bind(r, 'abort', a))),
                    (r = cp(n)),
                    o.push({
                      type: e,
                      listener: t,
                      optionsOrUseCapture: n,
                      attachedListener: l,
                      cleanup: a,
                    }),
                    f(this._fragmentFiber.child, !1, sp, e, l, r);
                }
                this._eventListeners = o;
              }
            }),
            (lp.prototype.removeEventListener = function (e, t, n) {
              var r = this._eventListeners;
              if (null !== r && -1 !== (t = fp(r, e, t, n))) {
                var a = r[t];
                n = a.attachedListener;
                var o = a.cleanup;
                (a = cp(a.optionsOrUseCapture)),
                  f(this._fragmentFiber.child, !1, up, e, n, a),
                  r.splice(t, 1),
                  null !== o && o();
              }
            }),
            (lp.prototype.dispatchEvent = function (e) {
              var t = m(this._fragmentFiber);
              if (null === t) return !0;
              t = w(t);
              var n = this._eventListeners;
              if ((null !== n && 0 < n.length) || !e.bubbles) {
                var r =
                  9 === t.nodeType ? t.createComment('') : document.createTextNode('');
                if (n)
                  for (var a = 0; a < n.length; a++) {
                    var o = n[a];
                    r.addEventListener(
                      o.type,
                      o.attachedListener,
                      cp(o.optionsOrUseCapture),
                    );
                  }
                if ((t.appendChild(r), (e = r.dispatchEvent(e)), n))
                  for (a = 0; a < n.length; a++)
                    (o = n[a]),
                      r.removeEventListener(
                        o.type,
                        o.attachedListener,
                        cp(o.optionsOrUseCapture),
                      );
                return t.removeChild(r), e;
              }
              return t.dispatchEvent(e);
            }),
            (lp.prototype.focus = function (e) {
              f(this._fragmentFiber.child, !0, pp, e, void 0, void 0);
            }),
            (lp.prototype.focusLast = function (e) {
              var t = [];
              f(this._fragmentFiber.child, !0, gp, t, void 0, void 0);
              for (var n = t.length - 1; 0 <= n && !pp(t[n], e); n--);
            }),
            (lp.prototype.blur = function () {
              var e = m(this._fragmentFiber);
              null !== e &&
                null !== (e = zf((e = w(e))).activeElement) &&
                f(this._fragmentFiber.child, !1, mp, e, void 0, void 0);
            }),
            (lp.prototype.observeUsing = function (e) {
              null === this._observers && (this._observers = new Set()),
                this._observers.add(e),
                f(this._fragmentFiber.child, !1, hp, e, void 0, void 0);
            }),
            (lp.prototype.unobserveUsing = function (e) {
              var t = this._observers;
              if (null !== t && t.has(e)) {
                t.delete(e), f(this._fragmentFiber.child, !1, yp, e, void 0, void 0);
                for (var n = (t = 0); n < vp.length; n++) {
                  var r = vp[n];
                  r.fragmentInstance === this && r.observer === e
                    ? e.unobserve(r.instance)
                    : (vp[t++] = r);
                }
                vp.length = t;
              }
            });
          var vp = [],
            bp = !1;
          function wp(e, t, n) {
            var r;
            vp.push({ fragmentInstance: e, observer: t, instance: n }),
              bp ||
                ((bp = !0),
                (r = function () {
                  bp = !1;
                  var e = vp;
                  vp = [];
                  for (var t = 0; t < e.length; t++) {
                    var n = e[t];
                    n.observer.unobserve(n.instance);
                  }
                }),
                qf(function () {
                  qf(function (e) {
                    return r(e);
                  });
                }));
          }
          function kp(e, t) {
            if (6 === e.tag) {
              var n = (e = e.stateNode).ownerDocument.createRange();
              n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
            } else (e = w(e)), t.push.apply(t, e.getClientRects());
            return !1;
          }
          function Sp(e, t) {
            var n = e.ownerDocument.createRange();
            n.selectNodeContents(e),
              (e = n.getBoundingClientRect()),
              window.scrollTo(
                window.scrollX + e.left,
                t
                  ? window.scrollY + e.top
                  : window.scrollY + e.bottom - window.innerHeight,
              );
          }
          function xp(e, t) {
            return Ep((e = w(e)), t), !1;
          }
          function Ep(e, t) {
            null == e.reactFragments && (e.reactFragments = new Set()),
              e.reactFragments.add(t);
          }
          function _p(e, t) {
            var n = t._eventListeners;
            if (null !== n)
              for (var r = 0; r < n.length; r++) {
                var a = n[r];
                e.addEventListener(a.type, a.attachedListener, cp(a.optionsOrUseCapture));
              }
            3 !== e.nodeType &&
              (null !== (n = t._observers) &&
                n.forEach(function (n) {
                  for (var r = 0, a = 0; a < vp.length; a++) {
                    var o = vp[a];
                    (o.fragmentInstance === t && o.observer === n && o.instance === e) ||
                      (vp[r++] = o);
                  }
                  (vp.length = r), n.observe(e);
                }),
              Ep(e, t));
          }
          function Ap(e, t) {
            var n = t._eventListeners;
            if (null !== n)
              for (var r = 0; r < n.length; r++) {
                var a = n[r];
                e.removeEventListener(
                  a.type,
                  a.attachedListener,
                  cp(a.optionsOrUseCapture),
                );
              }
            3 !== e.nodeType &&
              (null !== (n = t._observers) &&
                n.forEach(function (n) {
                  'string' == typeof n.rootMargin ? wp(t, n, e) : n.unobserve(e);
                }),
              null != e.reactFragments && e.reactFragments.delete(t));
          }
          function Cp(e) {
            var t = e.firstChild;
            for (t && 10 === t.nodeType && (t = t.nextSibling); t; ) {
              var n = t;
              switch (((t = t.nextSibling), n.nodeName)) {
                case 'HTML':
                case 'HEAD':
                case 'BODY':
                  Cp(n), gt(n);
                  continue;
                case 'SCRIPT':
                case 'STYLE':
                  continue;
                case 'LINK':
                  if ('stylesheet' === n.rel.toLowerCase()) continue;
              }
              e.removeChild(n);
            }
          }
          function Tp(e, t) {
            for (; 8 !== e.nodeType; ) {
              if (
                (1 !== e.nodeType || 'INPUT' !== e.nodeName || 'hidden' !== e.type) &&
                !t
              )
                return null;
              if (null === (e = Pp(e.nextSibling))) return null;
            }
            return e;
          }
          function Np(e) {
            return '$?' === e.data || '$~' === e.data;
          }
          function Op(e) {
            return (
              '$!' === e.data ||
              ('$?' === e.data && 'loading' !== e.ownerDocument.readyState)
            );
          }
          function Pp(e) {
            for (; null != e; e = e.nextSibling) {
              var t = e.nodeType;
              if (1 === t || 3 === t) break;
              if (8 === t) {
                if (
                  '$' === (t = e.data) ||
                  '$!' === t ||
                  '$?' === t ||
                  '$~' === t ||
                  '&' === t ||
                  'F!' === t ||
                  'F' === t
                )
                  break;
                if ('/$' === t || '/&' === t) return null;
              }
            }
            return e;
          }
          (lp.prototype.getClientRects = function () {
            var e = [];
            return f(this._fragmentFiber.child, !1, kp, e, void 0, void 0), e;
          }),
            (lp.prototype.getRootNode = function (e) {
              var t = m(this._fragmentFiber);
              return null === t ? this : w(t).getRootNode(e);
            }),
            (lp.prototype.compareDocumentPosition = function (e) {
              var t = m(this._fragmentFiber);
              if (null === t) return Node.DOCUMENT_POSITION_DISCONNECTED;
              var n = [];
              f(this._fragmentFiber.child, !1, gp, n, void 0, void 0);
              var r = w(t);
              if (0 === n.length) {
                if (((n = r), y(this._fragmentFiber))) {
                  e: {
                    for (t = this._fragmentFiber.return; null !== t; ) {
                      if (4 === t.tag) {
                        t = t.stateNode.containerInfo;
                        break e;
                      }
                      if (3 === t.tag || 5 === t.tag || 27 === t.tag) break;
                      t = t.return;
                    }
                    t = null;
                  }
                  null != t && (n = t);
                }
                t = this._fragmentFiber;
                var a = (r = n.compareDocumentPosition(e));
                return (
                  n === e
                    ? (a = Node.DOCUMENT_POSITION_CONTAINS)
                    : r & Node.DOCUMENT_POSITION_CONTAINED_BY &&
                      (null === (n = v(t)[1])
                        ? (a = Node.DOCUMENT_POSITION_PRECEDING)
                        : (a =
                            0 === (e = w(n).compareDocumentPosition(e)) ||
                            e & Node.DOCUMENT_POSITION_FOLLOWING
                              ? Node.DOCUMENT_POSITION_FOLLOWING
                              : Node.DOCUMENT_POSITION_PRECEDING)),
                  a | Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                );
              }
              (t = w(n[0])), (a = w(n[n.length - 1]));
              var o = y(this._fragmentFiber) ? t.parentElement : r;
              if (null == o) return Node.DOCUMENT_POSITION_DISCONNECTED;
              (r = o.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY),
                (o = o.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_CONTAINED_BY);
              var i = t.compareDocumentPosition(e),
                l = a.compareDocumentPosition(e),
                s =
                  i & Node.DOCUMENT_POSITION_CONTAINED_BY ||
                  l & Node.DOCUMENT_POSITION_CONTAINED_BY;
              return (
                (l =
                  r &&
                  o &&
                  i & Node.DOCUMENT_POSITION_FOLLOWING &&
                  l & Node.DOCUMENT_POSITION_PRECEDING),
                (t =
                  (r && t === e) || (o && a === e) || s || l
                    ? Node.DOCUMENT_POSITION_CONTAINED_BY
                    : (!r && t === e) || (!o && a === e)
                    ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                    : i) & Node.DOCUMENT_POSITION_DISCONNECTED ||
                t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC ||
                (function (e, t, n, r, a) {
                  var o = mt(a);
                  if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                    if ((n = !!o))
                      e: {
                        for (; null !== o; ) {
                          if (7 === o.tag && (o === t || o.alternate === t)) {
                            n = !0;
                            break e;
                          }
                          o = o.return;
                        }
                        n = !1;
                      }
                    return n;
                  }
                  if (e & Node.DOCUMENT_POSITION_CONTAINS) {
                    if (null === o)
                      return (
                        a === (o = a.ownerDocument) ||
                        a === o.documentElement ||
                        a === o.body
                      );
                    e: {
                      for (o = t, t = m(t); null !== o; ) {
                        if (
                          !(
                            (5 !== o.tag && 3 !== o.tag && 27 !== o.tag) ||
                            (o !== t && o.alternate !== t)
                          )
                        ) {
                          o = !0;
                          break e;
                        }
                        o = o.return;
                      }
                      o = !1;
                    }
                    return o;
                  }
                  return e & Node.DOCUMENT_POSITION_PRECEDING
                    ? ((t = !!o) &&
                        !(t = o === n) &&
                        (null === (t = A(n, o, _))
                          ? (t = !1)
                          : (f(t, !0, x, o, n), (o = k), (k = null), (t = null !== o))),
                      t)
                    : !!(e & Node.DOCUMENT_POSITION_FOLLOWING) &&
                        ((t = !!o) &&
                          !(t = o === r) &&
                          (null === (t = A(r, o, _))
                            ? (t = !1)
                            : (f(t, !0, E, o, r),
                              (o = k),
                              (S = k = null),
                              (t = null !== o))),
                        t);
                })(t, this._fragmentFiber, n[0], n[n.length - 1], e)
                  ? t
                  : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
              );
            }),
            (lp.prototype.scrollIntoView = function (e) {
              if ('object' == typeof e) throw Error(o(566));
              var t = [];
              f(this._fragmentFiber.child, !1, gp, t, void 0, void 0);
              var n = !1 !== e;
              if (0 === t.length) {
                var r = v(this._fragmentFiber);
                if (
                  null === (r = n ? r[1] || r[0] || m(this._fragmentFiber) : r[0] || r[1])
                )
                  return;
                if (6 === r.tag) return void Sp((e = w(r)), n);
                if (9 !== (r = w(r)).nodeType) {
                  if (11 === r.nodeType)
                    return void (
                      null !== (n = 'host' in r ? r.host : null) && n.scrollIntoView(e)
                    );
                  r.scrollIntoView(e);
                }
              }
              for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length); ) {
                var a = t[r];
                6 === a.tag ? Sp((a = w(a)), n) : w(a).scrollIntoView(e),
                  (r += n ? -1 : 1);
              }
            });
          var jp = null;
          function Lp(e) {
            e = e.nextSibling;
            for (var t = 0; e; ) {
              if (8 === e.nodeType) {
                var n = e.data;
                if ('/$' === n || '/&' === n) {
                  if (0 === t) return Pp(e.nextSibling);
                  t--;
                } else
                  ('$' !== n && '$!' !== n && '$?' !== n && '$~' !== n && '&' !== n) ||
                    t++;
              }
              e = e.nextSibling;
            }
            return null;
          }
          function Ip(e) {
            e = e.previousSibling;
            for (var t = 0; e; ) {
              if (8 === e.nodeType) {
                var n = e.data;
                if ('$' === n || '$!' === n || '$?' === n || '$~' === n || '&' === n) {
                  if (0 === t) return e;
                  t--;
                } else ('/$' !== n && '/&' !== n) || t++;
              }
              e = e.previousSibling;
            }
            return null;
          }
          function Fp(e, t, n) {
            switch (((t = zf(n)), e)) {
              case 'html':
                if (!(e = t.documentElement)) throw Error(o(452));
                return e;
              case 'head':
                if (!(e = t.head)) throw Error(o(453));
                return e;
              case 'body':
                if (!(e = t.body)) throw Error(o(454));
                return e;
              default:
                throw Error(o(451));
            }
          }
          function Rp(e, t, n) {
            for (var r in n) {
              var a = n[r];
              n.hasOwnProperty(r) && null != a && Pf(e, t, r, null, If, a);
            }
            null != n.dangerouslySetInnerHTML && (e.textContent = ''),
              e.onclick === Jt && (e.onclick = null),
              gt(e);
          }
          function Dp(e) {
            for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
            gt(e);
          }
          var zp = new Map(),
            Mp = new Set();
          function Bp(e) {
            if ('function' == typeof e.getRootNode) {
              var t = e.getRootNode();
              if (9 === t.nodeType || 11 === t.nodeType) return t;
            }
            return 9 === e.nodeType ? e : e.ownerDocument;
          }
          var $p = X.d;
          X.d = {
            f: function () {
              var e = $p.f(),
                t = vd();
              return e || t;
            },
            r: function (e) {
              var t = ht(e);
              null !== t && 5 === t.tag && 'form' === t.type ? Il(t) : $p.r(e);
            },
            D: function (e) {
              $p.D(e), Hp('dns-prefetch', e, null);
            },
            C: function (e, t) {
              $p.C(e, t), Hp('preconnect', e, t);
            },
            L: function (e, t, n) {
              $p.L(e, t, n);
              var r = Up;
              if (r && e && t) {
                var a = 'link[rel="preload"][as="' + zt(t) + '"]';
                'image' === t && n && n.imageSrcSet
                  ? ((a += '[imagesrcset="' + zt(n.imageSrcSet) + '"]'),
                    'string' == typeof n.imageSizes &&
                      (a += '[imagesizes="' + zt(n.imageSizes) + '"]'))
                  : (a += '[href="' + zt(e) + '"]');
                var o = a;
                switch (t) {
                  case 'style':
                    o = Wp(e);
                    break;
                  case 'script':
                    o = Yp(e);
                }
                if (
                  !(
                    zp.has(o) ||
                    ((e = C(
                      {
                        rel: 'preload',
                        href: 'image' === t && n && n.imageSrcSet ? void 0 : e,
                        as: t,
                      },
                      n,
                    )),
                    zp.set(o, e),
                    null !== r.querySelector(a) ||
                      ('style' === t && r.querySelector(Gp(o))) ||
                      ('script' === t && r.querySelector(Kp(o))))
                  )
                ) {
                  var i = r.createElement('link');
                  Lf(i, 'link', e),
                    'style' === t &&
                      ((i[pt] = !0),
                      (i.onload = i.onerror =
                        function () {
                          wt(i);
                        })),
                    bt(i),
                    r.head.appendChild(i);
                }
              }
            },
            m: function (e, t) {
              $p.m(e, t);
              var n = Up;
              if (n && e) {
                var r = t && 'string' == typeof t.as ? t.as : 'script',
                  a =
                    'link[rel="modulepreload"][as="' + zt(r) + '"][href="' + zt(e) + '"]',
                  o = a;
                switch (r) {
                  case 'audioworklet':
                  case 'paintworklet':
                  case 'serviceworker':
                  case 'sharedworker':
                  case 'worker':
                  case 'script':
                    o = Yp(e);
                }
                if (
                  !zp.has(o) &&
                  ((e = C({ rel: 'modulepreload', href: e }, t)),
                  zp.set(o, e),
                  null === n.querySelector(a))
                ) {
                  switch (r) {
                    case 'audioworklet':
                    case 'paintworklet':
                    case 'serviceworker':
                    case 'sharedworker':
                    case 'worker':
                    case 'script':
                      if (n.querySelector(Kp(o))) return;
                  }
                  Lf((r = n.createElement('link')), 'link', e),
                    bt(r),
                    n.head.appendChild(r);
                }
              }
            },
            X: function (e, t) {
              $p.X(e, t);
              var n = Up;
              if (n && e) {
                var r = vt(n).hoistableScripts,
                  a = Yp(e),
                  o = r.get(a);
                o ||
                  ((o = n.querySelector(Kp(a))) ||
                    ((e = C({ src: e, async: !0 }, t)),
                    (t = zp.get(a)) && Jp(e, t),
                    bt((o = n.createElement('script'))),
                    Lf(o, 'link', e),
                    n.head.appendChild(o)),
                  (o = { type: 'script', instance: o, count: 1, state: null }),
                  r.set(a, o));
              }
            },
            S: function (e, t, n) {
              $p.S(e, t, n);
              var r = Up;
              if (r && e) {
                var a = vt(r).hoistableStyles,
                  o = Wp(e);
                t = t || 'default';
                var i = a.get(o);
                if (!i) {
                  var l = { loading: 0, preload: null };
                  if ((i = r.querySelector(Gp(o)))) l.loading = 5;
                  else {
                    (e = C({ rel: 'stylesheet', href: e, 'data-precedence': t }, n)),
                      (n = zp.get(o)) && Xp(e, n);
                    var s = (i = r.createElement('link'));
                    bt(s),
                      Lf(s, 'link', e),
                      (s._p = new Promise(function (e, t) {
                        (s.onload = e), (s.onerror = t);
                      })),
                      s.addEventListener('load', function () {
                        l.loading |= 1;
                      }),
                      s.addEventListener('error', function () {
                        l.loading |= 2;
                      }),
                      (l.loading |= 4),
                      Zp(i, t, r);
                  }
                  (i = { type: 'stylesheet', instance: i, count: 1, state: l }),
                    a.set(o, i);
                }
              }
            },
            M: function (e, t) {
              $p.M(e, t);
              var n = Up;
              if (n && e) {
                var r = vt(n).hoistableScripts,
                  a = Yp(e),
                  o = r.get(a);
                o ||
                  ((o = n.querySelector(Kp(a))) ||
                    ((e = C({ src: e, async: !0, type: 'module' }, t)),
                    (t = zp.get(a)) && Jp(e, t),
                    bt((o = n.createElement('script'))),
                    Lf(o, 'link', e),
                    n.head.appendChild(o)),
                  (o = { type: 'script', instance: o, count: 1, state: null }),
                  r.set(a, o));
              }
            },
          };
          var Up = 'undefined' == typeof document ? null : document;
          function Hp(e, t, n) {
            var r = Up;
            if (r && 'string' == typeof t && t) {
              var a = zt(t);
              (a = 'link[rel="' + e + '"][href="' + a + '"]'),
                'string' == typeof n && (a += '[crossorigin="' + n + '"]'),
                Mp.has(a) ||
                  (Mp.add(a),
                  (e = { rel: e, crossOrigin: n, href: t }),
                  null === r.querySelector(a) &&
                    (Lf((t = r.createElement('link')), 'link', e),
                    bt(t),
                    r.head.appendChild(t)));
            }
          }
          function Vp(e, t, n, r) {
            var a = (a = ue.current) ? Bp(a) : null;
            if (!a) throw Error(o(446));
            switch (e) {
              case 'meta':
              case 'title':
                return null;
              case 'style':
                return 'string' == typeof n.precedence && 'string' == typeof n.href
                  ? ((n = Wp(n.href)),
                    (r = (t = vt(a).hoistableStyles).get(n)) ||
                      ((r = { type: 'style', instance: null, count: 0, state: null }),
                      t.set(n, r)),
                    r)
                  : { type: 'void', instance: null, count: 0, state: null };
              case 'link':
                if (
                  'stylesheet' === n.rel &&
                  'string' == typeof n.href &&
                  'string' == typeof n.precedence
                ) {
                  e = Wp(n.href);
                  var i = vt(a).hoistableStyles,
                    l = i.get(e);
                  if (
                    (l ||
                      ((a = a.ownerDocument || a),
                      (l = {
                        type: 'stylesheet',
                        instance: null,
                        count: 0,
                        state: { loading: 0, preload: null },
                      }),
                      i.set(e, l),
                      (i = a.querySelector(Gp(e)))
                        ? i._p || ((l.instance = i), (l.state.loading = 5))
                        : ((i = zp.get(e)) ||
                            ((i = {
                              rel: 'preload',
                              as: 'style',
                              href: n.href,
                              crossOrigin: n.crossOrigin,
                              integrity: n.integrity,
                              media: n.media,
                              hrefLang: n.hrefLang,
                              referrerPolicy: n.referrerPolicy,
                            }),
                            zp.set(e, i)),
                          (function (e, t, n, r) {
                            if (
                              (t = e.querySelector(
                                'link[rel="preload"][as="style"][' + t + ']',
                              ))
                            ) {
                              if (!0 !== t[pt]) return void (r.loading = 1);
                            } else
                              ((t = e.createElement('link'))[pt] = !0),
                                (t.onload = t.onerror = wt.bind(null, t)),
                                Lf(t, 'link', n),
                                bt(t),
                                e.head.appendChild(t);
                            (r.preload = t),
                              t.addEventListener('load', function () {
                                return (r.loading |= 1);
                              }),
                              t.addEventListener('error', function () {
                                return (r.loading |= 2);
                              });
                          })(a, e, i, l.state))),
                    t && null === r)
                  )
                    throw Error(o(528, ''));
                  return l;
                }
                if (t && null !== r) throw Error(o(529, ''));
                return null;
              case 'script':
                return (
                  (t = n.async),
                  'string' == typeof (n = n.src) &&
                  t &&
                  'function' != typeof t &&
                  'symbol' != typeof t
                    ? ((n = Yp(n)),
                      (r = (t = vt(a).hoistableScripts).get(n)) ||
                        ((r = { type: 'script', instance: null, count: 0, state: null }),
                        t.set(n, r)),
                      r)
                    : { type: 'void', instance: null, count: 0, state: null }
                );
              default:
                throw Error(o(444, e));
            }
          }
          function Wp(e) {
            return 'href="' + zt(e) + '"';
          }
          function Gp(e) {
            return 'link[rel="stylesheet"][' + e + ']';
          }
          function qp(e) {
            return C({}, e, { 'data-precedence': e.precedence, precedence: null });
          }
          function Yp(e) {
            return '[src="' + zt(e) + '"]';
          }
          function Kp(e) {
            return 'script[async]' + e;
          }
          function Qp(e, t, n) {
            if ((t.count++, null === t.instance))
              switch (t.type) {
                case 'style':
                  var r = e.querySelector('style[data-href~="' + zt(n.href) + '"]');
                  if (r) return (t.instance = r), bt(r), r;
                  var a = C({}, n, {
                    'data-href': n.href,
                    'data-precedence': n.precedence,
                    href: null,
                    precedence: null,
                  });
                  return (
                    bt((r = (e.ownerDocument || e).createElement('style'))),
                    Lf(r, 'style', a),
                    Zp(r, n.precedence, e),
                    (t.instance = r)
                  );
                case 'stylesheet':
                  a = Wp(n.href);
                  var i = e.querySelector(Gp(a));
                  if (i) return (t.state.loading |= 4), (t.instance = i), bt(i), i;
                  (r = qp(n)),
                    (a = zp.get(a)) && Xp(r, a),
                    bt((i = (e.ownerDocument || e).createElement('link')));
                  var l = i;
                  return (
                    (l._p = new Promise(function (e, t) {
                      (l.onload = e), (l.onerror = t);
                    })),
                    Lf(i, 'link', r),
                    (t.state.loading |= 4),
                    Zp(i, n.precedence, e),
                    (t.instance = i)
                  );
                case 'script':
                  return (
                    (i = Yp(n.src)),
                    (a = e.querySelector(Kp(i)))
                      ? ((t.instance = a), bt(a), a)
                      : ((r = n),
                        (a = zp.get(i)) && Jp((r = C({}, n)), a),
                        bt((a = (e = e.ownerDocument || e).createElement('script'))),
                        Lf(a, 'link', r),
                        e.head.appendChild(a),
                        (t.instance = a))
                  );
                case 'void':
                  return null;
                default:
                  throw Error(o(443, t.type));
              }
            else
              'stylesheet' === t.type &&
                !(4 & t.state.loading) &&
                ((r = t.instance), (t.state.loading |= 4), Zp(r, n.precedence, e));
            return t.instance;
          }
          function Zp(e, t, n) {
            for (
              var r = n.querySelectorAll(
                  'link[rel="stylesheet"][data-precedence],style[data-precedence]',
                ),
                a = r.length ? r[r.length - 1] : null,
                o = a,
                i = 0;
              i < r.length;
              i++
            ) {
              var l = r[i];
              if (l.dataset.precedence === t) o = l;
              else if (o !== a) break;
            }
            o
              ? o.parentNode.insertBefore(e, o.nextSibling)
              : (t = 9 === n.nodeType ? n.head : n).insertBefore(e, t.firstChild);
          }
          function Xp(e, t) {
            null == e.crossOrigin && (e.crossOrigin = t.crossOrigin),
              null == e.referrerPolicy && (e.referrerPolicy = t.referrerPolicy),
              null == e.title && (e.title = t.title);
          }
          function Jp(e, t) {
            null == e.crossOrigin && (e.crossOrigin = t.crossOrigin),
              null == e.referrerPolicy && (e.referrerPolicy = t.referrerPolicy),
              null == e.integrity && (e.integrity = t.integrity);
          }
          var eg = null;
          function tg(e, t, n) {
            if (null === eg) {
              var r = new Map(),
                a = (eg = new Map());
              a.set(n, r);
            } else (r = (a = eg).get(n)) || ((r = new Map()), a.set(n, r));
            if (r.has(e)) return r;
            for (
              r.set(e, null), n = n.getElementsByTagName(e), a = 0;
              a < n.length;
              a++
            ) {
              var o = n[a];
              if (
                !(
                  o[ft] ||
                  o[ot] ||
                  ('link' === e && 'stylesheet' === o.getAttribute('rel'))
                ) &&
                'http://www.w3.org/2000/svg' !== o.namespaceURI
              ) {
                var i = o.getAttribute(t) || '';
                i = e + i;
                var l = r.get(i);
                l ? l.push(o) : r.set(i, [o]);
              }
            }
            return r;
          }
          function ng(e, t, n) {
            (e = e.ownerDocument || e).head.insertBefore(
              n,
              'title' === t ? e.querySelector('head > title') : null,
            );
          }
          function rg(e, t) {
            return (
              'img' === e &&
              null != t.src &&
              '' !== t.src &&
              null == t.onLoad &&
              'lazy' !== t.loading
            );
          }
          function ag(e) {
            return !!('stylesheet' !== e.type || 3 & e.state.loading);
          }
          function og(e) {
            return (
              (e.width || 100) *
              (e.height || 100) *
              ('number' == typeof devicePixelRatio ? devicePixelRatio : 1) *
              0.25
            );
          }
          function ig(e, t) {
            'function' == typeof t.decode &&
              (e.imgCount++,
              t.complete || ((e.imgBytes += og(t)), e.suspenseyImages.push(t)),
              (e = cg.bind(e)),
              t.decode().then(e, e));
          }
          var lg = 0;
          function sg(e) {
            if (0 === e.count && (0 === e.imgCount || !e.waitingForImages))
              if (e.stylesheets) fg(e, e.stylesheets);
              else if (e.unsuspend) {
                var t = e.unsuspend;
                (e.unsuspend = null), t();
              }
          }
          function ug() {
            this.count--, sg(this);
          }
          function cg() {
            this.imgCount--, sg(this);
          }
          var dg = null;
          function fg(e, t) {
            (e.stylesheets = null),
              null !== e.unsuspend &&
                (e.count++, (dg = new Map()), t.forEach(pg, e), (dg = null), ug.call(e));
          }
          function pg(e, t) {
            if (!(4 & t.state.loading)) {
              var n = dg.get(e);
              if (n) var r = n.get(null);
              else {
                (n = new Map()), dg.set(e, n);
                for (
                  var a = e.querySelectorAll(
                      'link[data-precedence],style[data-precedence]',
                    ),
                    o = 0;
                  o < a.length;
                  o++
                ) {
                  var i = a[o];
                  ('LINK' !== i.nodeName && 'not all' === i.getAttribute('media')) ||
                    (n.set(i.dataset.precedence, i), (r = i));
                }
                r && n.set(null, r);
              }
              (i = (a = t.instance).getAttribute('data-precedence')),
                (o = n.get(i) || r) === r && n.set(null, a),
                n.set(i, a),
                this.count++,
                (r = ug.bind(this)),
                a.addEventListener('load', r),
                a.addEventListener('error', r),
                o
                  ? o.parentNode.insertBefore(a, o.nextSibling)
                  : (e = 9 === e.nodeType ? e.head : e).insertBefore(a, e.firstChild),
                (t.state.loading |= 4);
            }
          }
          var gg = {
            $$typeof: F,
            Provider: null,
            Consumer: null,
            _currentValue: J,
            _currentValue2: J,
            _threadCount: 0,
          };
          function mg(e, t, n, r, a, o, i, l, s) {
            (this.tag = 1),
              (this.containerInfo = e),
              (this.pingCache = this.current = this.pendingChildren = null),
              (this.timeoutHandle = -1),
              (this.callbackNode =
                this.next =
                this.pendingContext =
                this.context =
                this.cancelPendingCommit =
                  null),
              (this.callbackPriority = 0),
              (this.expirationTimes = Ke(-1)),
              (this.entangledLanes =
                this.shellSuspendCounter =
                this.errorRecoveryDisabledLanes =
                this.expiredLanes =
                this.warmLanes =
                this.pingedLanes =
                this.suspendedLanes =
                this.pendingLanes =
                  0),
              (this.entanglements = Ke(0)),
              (this.hiddenUpdates = Ke(null)),
              (this.identifierPrefix = r),
              (this.onUncaughtError = a),
              (this.onCaughtError = o),
              (this.onRecoverableError = i),
              (this.pooledCache = null),
              (this.pooledCacheLanes = 0),
              (this.formState = s),
              (this.transitionTypes = null),
              (this.incompleteTransitions = new Map());
          }
          function hg(e, t, n, r, a, o, i, l, s, u, c, d) {
            return (
              (e = new mg(e, t, n, i, s, u, c, d, l)),
              (t = 1),
              !0 === o && (t |= 24),
              (o = da(3, null, null, t)),
              (e.current = o),
              (o.stateNode = e),
              (t = po()).refCount++,
              (e.pooledCache = t),
              t.refCount++,
              (o.memoizedState = { element: r, isDehydrated: n, cache: t }),
              Go(o),
              e
            );
          }
          function yg(e) {
            return e ? (e = ua) : ua;
          }
          function vg(e, t, n, r, a, o) {
            (a = yg(a)),
              null === r.context ? (r.context = a) : (r.pendingContext = a),
              ((r = Yo(t)).payload = { element: n }),
              null !== (o = void 0 === o ? null : o) && (r.callback = o),
              null !== (n = Ko(e, r, t)) && (pd(n, 0, t), Qo(n, e, t));
          }
          function bg(e, t) {
            if (null !== (e = e.memoizedState) && null !== e.dehydrated) {
              var n = e.retryLane;
              e.retryLane = 0 !== n && n < t ? n : t;
            }
          }
          function wg(e, t) {
            bg(e, t), (e = e.alternate) && bg(e, t);
          }
          function kg(e) {
            if (13 === e.tag || 31 === e.tag) {
              var t = ia(e, 67108864);
              null !== t && pd(t, 0, 67108864), wg(e, 67108864);
            }
          }
          function Sg(e) {
            if (13 === e.tag || 31 === e.tag) {
              var t = cd(),
                n = ia(e, (t = et(t)));
              null !== n && pd(n, 0, t), wg(e, t);
            }
          }
          var xg = !0;
          function Eg(e, t, n, r) {
            var a = Z.T;
            Z.T = null;
            var o = X.p;
            try {
              (X.p = 2), Ag(e, t, n, r);
            } finally {
              (X.p = o), (Z.T = a);
            }
          }
          function _g(e, t, n, r) {
            var a = Z.T;
            Z.T = null;
            var o = X.p;
            try {
              (X.p = 8), Ag(e, t, n, r);
            } finally {
              (X.p = o), (Z.T = a);
            }
          }
          function Ag(e, t, n, r) {
            if (xg) {
              var a = Cg(r);
              if (null === a) Sf(e, t, r, Tg, n), Mg(e, r);
              else if (
                (function (e, t, n, r, a) {
                  switch (t) {
                    case 'focusin':
                      return (jg = Bg(jg, e, t, n, r, a)), !0;
                    case 'dragenter':
                      return (Lg = Bg(Lg, e, t, n, r, a)), !0;
                    case 'mouseover':
                      return (Ig = Bg(Ig, e, t, n, r, a)), !0;
                    case 'pointerover':
                      var o = a.pointerId;
                      return Fg.set(o, Bg(Fg.get(o) || null, e, t, n, r, a)), !0;
                    case 'gotpointercapture':
                      return (
                        (o = a.pointerId),
                        Rg.set(o, Bg(Rg.get(o) || null, e, t, n, r, a)),
                        !0
                      );
                  }
                  return !1;
                })(a, e, t, n, r)
              )
                r.stopPropagation();
              else if ((Mg(e, r), 4 & t && -1 < zg.indexOf(e))) {
                for (; null !== a; ) {
                  var o = ht(a);
                  if (null !== o)
                    switch (o.tag) {
                      case 3:
                        if ((o = o.stateNode).current.memoizedState.isDehydrated) {
                          var i = He(o.pendingLanes);
                          if (0 !== i) {
                            var l = o;
                            for (l.pendingLanes |= 2, l.entangledLanes |= 2; i; ) {
                              var s = 1 << (31 - De(i));
                              (l.entanglements[1] |= s), (i &= ~s);
                            }
                            nf(o), !(6 & Tc) && ((Kc = _e() + 500), rf(0, !1));
                          }
                        }
                        break;
                      case 31:
                      case 13:
                        null !== (l = ia(o, 2)) && pd(l, 0, 2), vd(), wg(o, 2);
                    }
                  if ((null === (o = Cg(r)) && Sf(e, t, r, Tg, n), o === a)) break;
                  a = o;
                }
                null !== a && r.stopPropagation();
              } else Sf(e, t, r, null, n);
            }
          }
          function Cg(e) {
            return Ng((e = tn(e)));
          }
          var Tg = null;
          function Ng(e) {
            if (((Tg = null), null !== (e = mt(e)))) {
              var t = l(e);
              if (null === t) e = null;
              else {
                var n = t.tag;
                if (13 === n) {
                  if (null !== (e = s(t))) return e;
                  e = null;
                } else if (31 === n) {
                  if (null !== (e = u(t))) return e;
                  e = null;
                } else if (3 === n) {
                  if (t.stateNode.current.memoizedState.isDehydrated)
                    return 3 === t.tag ? t.stateNode.containerInfo : null;
                  e = null;
                } else t !== e && (e = null);
              }
            }
            return (Tg = e), null;
          }
          function Og(e) {
            switch (e) {
              case 'beforetoggle':
              case 'cancel':
              case 'click':
              case 'close':
              case 'contextmenu':
              case 'copy':
              case 'cut':
              case 'auxclick':
              case 'dblclick':
              case 'dragend':
              case 'dragstart':
              case 'drop':
              case 'focusin':
              case 'focusout':
              case 'input':
              case 'invalid':
              case 'keydown':
              case 'keypress':
              case 'keyup':
              case 'mousedown':
              case 'mouseup':
              case 'paste':
              case 'pause':
              case 'play':
              case 'pointercancel':
              case 'pointerdown':
              case 'pointerup':
              case 'ratechange':
              case 'reset':
              case 'seeked':
              case 'submit':
              case 'toggle':
              case 'touchcancel':
              case 'touchend':
              case 'touchstart':
              case 'volumechange':
              case 'change':
              case 'selectionchange':
              case 'textInput':
              case 'compositionstart':
              case 'compositionend':
              case 'compositionupdate':
              case 'beforeblur':
              case 'afterblur':
              case 'beforeinput':
              case 'blur':
              case 'fullscreenchange':
              case 'fullscreenerror':
              case 'focus':
              case 'hashchange':
              case 'popstate':
              case 'select':
              case 'selectstart':
                return 2;
              case 'drag':
              case 'dragenter':
              case 'dragexit':
              case 'dragleave':
              case 'dragover':
              case 'mousemove':
              case 'mouseout':
              case 'mouseover':
              case 'pointermove':
              case 'pointerout':
              case 'pointerover':
              case 'resize':
              case 'scroll':
              case 'touchmove':
              case 'wheel':
              case 'mouseenter':
              case 'mouseleave':
              case 'pointerenter':
              case 'pointerleave':
                return 8;
              case 'message':
                switch (Ae()) {
                  case Ce:
                    return 2;
                  case Te:
                    return 8;
                  case Ne:
                  case Oe:
                    return 32;
                  case Pe:
                    return 268435456;
                  default:
                    return 32;
                }
              default:
                return 32;
            }
          }
          var Pg = !1,
            jg = null,
            Lg = null,
            Ig = null,
            Fg = new Map(),
            Rg = new Map(),
            Dg = [],
            zg =
              'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
                ' ',
              );
          function Mg(e, t) {
            switch (e) {
              case 'focusin':
              case 'focusout':
                jg = null;
                break;
              case 'dragenter':
              case 'dragleave':
                Lg = null;
                break;
              case 'mouseover':
              case 'mouseout':
                Ig = null;
                break;
              case 'pointerover':
              case 'pointerout':
                Fg.delete(t.pointerId);
                break;
              case 'gotpointercapture':
              case 'lostpointercapture':
                Rg.delete(t.pointerId);
            }
          }
          function Bg(e, t, n, r, a, o) {
            return null === e || e.nativeEvent !== o
              ? ((e = {
                  blockedOn: t,
                  domEventName: n,
                  eventSystemFlags: r,
                  nativeEvent: o,
                  targetContainers: [a],
                }),
                null !== t && null !== (t = ht(t)) && kg(t),
                e)
              : ((e.eventSystemFlags |= r),
                (t = e.targetContainers),
                null !== a && -1 === t.indexOf(a) && t.push(a),
                e);
          }
          function $g(e) {
            var t = mt(e.target);
            if (null !== t) {
              var n = l(t);
              if (null !== n)
                if (13 === (t = n.tag)) {
                  if (null !== (t = s(n)))
                    return (
                      (e.blockedOn = t),
                      void rt(e.priority, function () {
                        Sg(n);
                      })
                    );
                } else if (31 === t) {
                  if (null !== (t = u(n)))
                    return (
                      (e.blockedOn = t),
                      void rt(e.priority, function () {
                        Sg(n);
                      })
                    );
                } else if (3 === t && n.stateNode.current.memoizedState.isDehydrated)
                  return void (e.blockedOn =
                    3 === n.tag ? n.stateNode.containerInfo : null);
            }
            e.blockedOn = null;
          }
          function Ug(e) {
            if (null !== e.blockedOn) return !1;
            for (var t = e.targetContainers; 0 < t.length; ) {
              var n = Cg(e.nativeEvent);
              if (null !== n) return null !== (t = ht(n)) && kg(t), (e.blockedOn = n), !1;
              var r = new (n = e.nativeEvent).constructor(n.type, n);
              (en = r), n.target.dispatchEvent(r), (en = null), t.shift();
            }
            return !0;
          }
          function Hg(e, t, n) {
            Ug(e) && n.delete(t);
          }
          function Vg() {
            (Pg = !1),
              null !== jg && Ug(jg) && (jg = null),
              null !== Lg && Ug(Lg) && (Lg = null),
              null !== Ig && Ug(Ig) && (Ig = null),
              Fg.forEach(Hg),
              Rg.forEach(Hg);
          }
          function Wg(e, t) {
            e.blockedOn === t &&
              ((e.blockedOn = null),
              Pg ||
                ((Pg = !0), n.unstable_scheduleCallback(n.unstable_NormalPriority, Vg)));
          }
          var Gg = null;
          function qg(e) {
            Gg !== e &&
              ((Gg = e),
              n.unstable_scheduleCallback(n.unstable_NormalPriority, function () {
                Gg === e && (Gg = null);
                for (var t = 0; t < e.length; t += 3) {
                  var n = e[t],
                    r = e[t + 1],
                    a = e[t + 2];
                  if ('function' != typeof r) {
                    if (null === Ng(r || n)) continue;
                    break;
                  }
                  var o = ht(n);
                  null !== o &&
                    (e.splice(t, 3),
                    (t -= 3),
                    jl(o, { pending: !0, data: a, method: n.method, action: r }, r, a));
                }
              }));
          }
          function Yg(e) {
            function t(t) {
              return Wg(t, e);
            }
            null !== jg && Wg(jg, e),
              null !== Lg && Wg(Lg, e),
              null !== Ig && Wg(Ig, e),
              Fg.forEach(t),
              Rg.forEach(t);
            for (var n = 0; n < Dg.length; n++) {
              var r = Dg[n];
              r.blockedOn === e && (r.blockedOn = null);
            }
            for (; 0 < Dg.length && null === (n = Dg[0]).blockedOn; )
              $g(n), null === n.blockedOn && Dg.shift();
            if (null != (n = (e.ownerDocument || e).$$reactFormReplay))
              for (r = 0; r < n.length; r += 3) {
                var a = n[r],
                  o = n[r + 1],
                  i = a[it] || null;
                if ('function' == typeof o) i || qg(n);
                else if (i) {
                  var l = null;
                  if (o && o.hasAttribute('formAction')) {
                    if (((a = o), (i = o[it] || null))) l = i.formAction;
                    else if (null !== Ng(a)) continue;
                  } else l = i.action;
                  'function' == typeof l ? (n[r + 1] = l) : (n.splice(r, 3), (r -= 3)),
                    qg(n);
                }
              }
          }
          function Kg() {
            function e(e) {
              e.canIntercept &&
                'react-transition' === e.info &&
                e.intercept({
                  handler: function () {
                    return new Promise(function (e) {
                      return (a = e);
                    });
                  },
                  focusReset: 'manual',
                  scroll: 'manual',
                });
            }
            function t() {
              null !== a && (a(), (a = null)), r || setTimeout(n, 20);
            }
            function n() {
              if (!r && !navigation.transition) {
                var e = navigation.currentEntry;
                e &&
                  null != e.url &&
                  navigation.navigate(e.url, {
                    state: e.getState(),
                    info: 'react-transition',
                    history: 'replace',
                  });
              }
            }
            if ('object' == typeof navigation) {
              var r = !1,
                a = null;
              return (
                navigation.addEventListener('navigate', e),
                navigation.addEventListener('navigatesuccess', t),
                navigation.addEventListener('navigateerror', t),
                setTimeout(n, 100),
                function () {
                  (r = !0),
                    navigation.removeEventListener('navigate', e),
                    navigation.removeEventListener('navigatesuccess', t),
                    navigation.removeEventListener('navigateerror', t),
                    null !== a && (a(), (a = null));
                }
              );
            }
          }
          function Qg(e) {
            this._internalRoot = e;
          }
          function Zg(e) {
            this._internalRoot = e;
          }
          (Zg.prototype.render = Qg.prototype.render =
            function (e) {
              var t = this._internalRoot;
              if (null === t) throw Error(o(409));
              vg(t.current, cd(), e, t, null, null);
            }),
            (Zg.prototype.unmount = Qg.prototype.unmount =
              function () {
                var e = this._internalRoot;
                if (null !== e) {
                  this._internalRoot = null;
                  var t = e.containerInfo;
                  vg(e.current, 2, null, e, null, null), vd(), (t[lt] = null);
                }
              }),
            (Zg.prototype.unstable_scheduleHydration = function (e) {
              if (e) {
                var t = nt();
                e = { blockedOn: null, target: e, priority: t };
                for (var n = 0; n < Dg.length && 0 !== t && t < Dg[n].priority; n++);
                Dg.splice(n, 0, e), 0 === n && $g(e);
              }
            });
          var Xg = r.version;
          if ('19.3.1' !== Xg) throw Error(o(527, Xg, '19.3.1'));
          X.findDOMNode = function (e) {
            var t = e._reactInternals;
            if (void 0 === t) {
              if ('function' == typeof e.render) throw Error(o(188));
              throw ((e = Object.keys(e).join(',')), Error(o(268, e)));
            }
            return (
              (e = (function (e) {
                var t = e.alternate;
                if (!t) {
                  if (null === (t = l(e))) throw Error(o(188));
                  return t !== e ? null : e;
                }
                for (var n = e, r = t; ; ) {
                  var a = n.return;
                  if (null === a) break;
                  var i = a.alternate;
                  if (null === i) {
                    if (null !== (r = a.return)) {
                      n = r;
                      continue;
                    }
                    break;
                  }
                  if (a.child === i.child) {
                    for (i = a.child; i; ) {
                      if (i === n) return c(a), e;
                      if (i === r) return c(a), t;
                      i = i.sibling;
                    }
                    throw Error(o(188));
                  }
                  if (n.return !== r.return) (n = a), (r = i);
                  else {
                    for (var s = !1, u = a.child; u; ) {
                      if (u === n) {
                        (s = !0), (n = a), (r = i);
                        break;
                      }
                      if (u === r) {
                        (s = !0), (r = a), (n = i);
                        break;
                      }
                      u = u.sibling;
                    }
                    if (!s) {
                      for (u = i.child; u; ) {
                        if (u === n) {
                          (s = !0), (n = i), (r = a);
                          break;
                        }
                        if (u === r) {
                          (s = !0), (r = i), (n = a);
                          break;
                        }
                        u = u.sibling;
                      }
                      if (!s) throw Error(o(189));
                    }
                  }
                  if (n.alternate !== r) throw Error(o(190));
                }
                if (3 !== n.tag) throw Error(o(188));
                return n.stateNode.current === n ? e : t;
              })(t)),
              (e = null === (e = null !== e ? d(e) : null) ? null : e.stateNode)
            );
          };
          var Jg = {
            bundleType: 0,
            version: '19.3.1',
            rendererPackageName: 'react-dom',
            currentDispatcherRef: Z,
            reconcilerVersion: '19.3.1',
          };
          if ('undefined' != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
            var em = __REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!em.isDisabled && em.supportsFiber)
              try {
                (Ie = em.inject(Jg)), (Fe = em);
              } catch (nm) {}
          }
          (t.createRoot = function (e, t) {
            if (!i(e)) throw Error(o(299));
            var n = !1,
              r = '',
              a = ts,
              l = ns,
              s = rs;
            return (
              null != t &&
                (!0 === t.unstable_strictMode && (n = !0),
                void 0 !== t.identifierPrefix && (r = t.identifierPrefix),
                void 0 !== t.onUncaughtError && (a = t.onUncaughtError),
                void 0 !== t.onCaughtError && (l = t.onCaughtError),
                void 0 !== t.onRecoverableError && (s = t.onRecoverableError)),
              (t = hg(e, 1, !1, null, 0, n, r, null, a, l, s, Kg)),
              (e[lt] = t.current),
              wf(e),
              new Qg(t)
            );
          }),
            (t.hydrateRoot = function (e, t, n) {
              if (!i(e)) throw Error(o(299));
              var r = !1,
                a = '',
                l = ts,
                s = ns,
                u = rs,
                c = null;
              return (
                null != n &&
                  (!0 === n.unstable_strictMode && (r = !0),
                  void 0 !== n.identifierPrefix && (a = n.identifierPrefix),
                  void 0 !== n.onUncaughtError && (l = n.onUncaughtError),
                  void 0 !== n.onCaughtError && (s = n.onCaughtError),
                  void 0 !== n.onRecoverableError && (u = n.onRecoverableError),
                  void 0 !== n.formState && (c = n.formState)),
                ((t = hg(e, 1, !0, t, 0, r, a, c, l, s, u, Kg)).context = yg(null)),
                (n = t.current),
                ((a = Yo((r = et((r = cd()))))).callback = null),
                Ko(n, a, r),
                (n = r),
                (t.current.lanes = n),
                Qe(t, n),
                nf(t),
                (e[lt] = t.current),
                wf(e),
                new Zg(t)
              );
            }),
            (t.version = '19.3.1');
        }),
        d = n.cw((e, t) => {
          var n = g();
          function r(e) {
            var t = 'https://react.dev/errors/' + e;
            if (1 < arguments.length) {
              t += '?args[]=' + encodeURIComponent(arguments[1]);
              for (var n = 2; n < arguments.length; n++)
                t += '&args[]=' + encodeURIComponent(arguments[n]);
            }
            return (
              'Minified React error #' +
              e +
              '; visit ' +
              t +
              ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
            );
          }
          function a() {}
          var o = {
              d: {
                f: a,
                r: function () {
                  throw Error(r(522));
                },
                D: a,
                C: a,
                L: a,
                m: a,
                X: a,
                S: a,
                M: a,
              },
              p: 0,
              findDOMNode: null,
            },
            i = Symbol.for('react.portal'),
            l = Symbol.for('react.recoverable'),
            s = Symbol.for('react.optimistic_key');
          var u = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
          function c(e, t) {
            return 'font' === e
              ? ''
              : 'string' == typeof t
              ? 'use-credentials' === t
                ? t
                : ''
              : void 0;
          }
          (t.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o),
            (t.browser = function (e) {
              return { $$typeof: l, _reason: e };
            }),
            (t.createPortal = function (e, t) {
              var n =
                2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
              if (!t || (1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType))
                throw Error(r(299));
              return (function (e, t, n) {
                var r =
                  3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
                return {
                  $$typeof: i,
                  key: null == r ? null : r === s ? s : '' + r,
                  children: e,
                  containerInfo: t,
                  implementation: n,
                };
              })(e, t, null, n);
            }),
            (t.flushSync = function (e) {
              var t = u.T,
                n = o.p;
              try {
                if (((u.T = null), (o.p = 2), e)) return e();
              } finally {
                (u.T = t), (o.p = n), o.d.f();
              }
            }),
            (t.preconnect = function (e, t) {
              'string' == typeof e &&
                (t
                  ? (t =
                      'string' == typeof (t = t.crossOrigin)
                        ? 'use-credentials' === t
                          ? t
                          : ''
                        : void 0)
                  : (t = null),
                o.d.C(e, t));
            }),
            (t.prefetchDNS = function (e) {
              'string' == typeof e && o.d.D(e);
            }),
            (t.preinit = function (e, t) {
              if ('string' == typeof e && t && 'string' == typeof t.as) {
                var n = t.as,
                  r = c(n, t.crossOrigin),
                  a = 'string' == typeof t.integrity ? t.integrity : void 0,
                  i = 'string' == typeof t.fetchPriority ? t.fetchPriority : void 0;
                'style' === n
                  ? o.d.S(e, 'string' == typeof t.precedence ? t.precedence : void 0, {
                      crossOrigin: r,
                      integrity: a,
                      fetchPriority: i,
                    })
                  : 'script' === n &&
                    o.d.X(e, {
                      crossOrigin: r,
                      integrity: a,
                      fetchPriority: i,
                      nonce: 'string' == typeof t.nonce ? t.nonce : void 0,
                    });
              }
            }),
            (t.preinitModule = function (e, t) {
              if ('string' == typeof e)
                if ('object' == typeof t && null !== t) {
                  if (null == t.as || 'script' === t.as) {
                    var n = c(t.as, t.crossOrigin);
                    o.d.M(e, {
                      crossOrigin: n,
                      integrity: 'string' == typeof t.integrity ? t.integrity : void 0,
                      nonce: 'string' == typeof t.nonce ? t.nonce : void 0,
                      fetchPriority:
                        'string' == typeof t.fetchPriority ? t.fetchPriority : void 0,
                    });
                  }
                } else null == t && o.d.M(e);
            }),
            (t.preload = function (e, t) {
              if (
                'string' == typeof e &&
                'object' == typeof t &&
                null !== t &&
                'string' == typeof t.as
              ) {
                var n = t.as,
                  r = c(n, t.crossOrigin);
                o.d.L(e, n, {
                  crossOrigin: r,
                  integrity: 'string' == typeof t.integrity ? t.integrity : void 0,
                  nonce: 'string' == typeof t.nonce ? t.nonce : void 0,
                  type: 'string' == typeof t.type ? t.type : void 0,
                  fetchPriority:
                    'string' == typeof t.fetchPriority ? t.fetchPriority : void 0,
                  referrerPolicy:
                    'string' == typeof t.referrerPolicy ? t.referrerPolicy : void 0,
                  imageSrcSet: 'string' == typeof t.imageSrcSet ? t.imageSrcSet : void 0,
                  imageSizes: 'string' == typeof t.imageSizes ? t.imageSizes : void 0,
                  media: 'string' == typeof t.media ? t.media : void 0,
                });
              }
            }),
            (t.preloadModule = function (e, t) {
              if ('string' == typeof e)
                if (t) {
                  var n = c(t.as, t.crossOrigin);
                  o.d.m(e, {
                    as: 'string' == typeof t.as && 'script' !== t.as ? t.as : void 0,
                    crossOrigin: n,
                    integrity: 'string' == typeof t.integrity ? t.integrity : void 0,
                    nonce: 'string' == typeof t.nonce ? t.nonce : void 0,
                    fetchPriority:
                      'string' == typeof t.fetchPriority ? t.fetchPriority : void 0,
                  });
                } else o.d.m(e);
            }),
            (t.requestFormReset = function (e) {
              o.d.r(e);
            }),
            (t.unstable_batchedUpdates = function (e, t) {
              return e(t);
            }),
            (t.useFormState = function (e, t, n) {
              return u.H.useFormState(e, t, n);
            }),
            (t.useFormStatus = function () {
              return u.H.useHostTransitionStatus();
            }),
            (t.version = '19.3.1');
        }),
        f = n.cw((e) => {
          !(function e() {
            if (
              'undefined' != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
              'function' == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
            )
              try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
              } catch (t) {
                console.error(t);
              }
          })(),
            (e.exports = c());
        }),
        p = n.cw((e) => {
          !(function e() {
            if (
              'undefined' != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
              'function' == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
            )
              try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
              } catch (t) {
                console.error(t);
              }
          })(),
            (e.exports = d());
        }),
        g = () => n(2503),
        m = n.cw((e, t) => {
          function n(e, t) {
            var n = e.length;
            e.push(t);
            e: for (; 0 < n; ) {
              var r = (n - 1) >>> 1,
                a = e[r];
              if (!(0 < o(a, t))) break e;
              (e[r] = t), (e[n] = a), (n = r);
            }
          }
          function r(e) {
            return 0 === e.length ? null : e[0];
          }
          function a(e) {
            if (0 === e.length) return null;
            var t = e[0],
              n = e.pop();
            if (n !== t) {
              e[0] = n;
              e: for (var r = 0, a = e.length, i = a >>> 1; r < i; ) {
                var l = 2 * (r + 1) - 1,
                  s = e[l],
                  u = l + 1,
                  c = e[u];
                if (0 > o(s, n))
                  u < a && 0 > o(c, s)
                    ? ((e[r] = c), (e[u] = n), (r = u))
                    : ((e[r] = s), (e[l] = n), (r = l));
                else {
                  if (!(u < a && 0 > o(c, n))) break e;
                  (e[r] = c), (e[u] = n), (r = u);
                }
              }
            }
            return t;
          }
          function o(e, t) {
            var n = e.sortIndex - t.sortIndex;
            return 0 !== n ? n : e.id - t.id;
          }
          if (
            ((t.unstable_now = void 0),
            'object' == typeof performance && 'function' == typeof performance.now)
          ) {
            var i = performance;
            t.unstable_now = function () {
              return i.now();
            };
          } else {
            var l = Date,
              s = l.now();
            t.unstable_now = function () {
              return l.now() - s;
            };
          }
          var u = [],
            c = [],
            d = 1,
            f = null,
            p = 3,
            g = !1,
            m = !1,
            h = !1,
            y = !1,
            v = 'function' == typeof setTimeout ? setTimeout : null,
            b = 'function' == typeof clearTimeout ? clearTimeout : null,
            w = 'undefined' != typeof setImmediate ? setImmediate : null;
          function k(e) {
            for (var t = r(c); null !== t; ) {
              if (null === t.callback) a(c);
              else {
                if (!(t.startTime <= e)) break;
                a(c), (t.sortIndex = t.expirationTime), n(u, t);
              }
              t = r(c);
            }
          }
          function S(e) {
            if (((h = !1), k(e), !m))
              if (null !== r(u)) (m = !0), E || ((E = !0), x());
              else {
                var t = r(c);
                null !== t && j(S, t.startTime - e);
              }
          }
          var x,
            E = !1,
            _ = -1,
            A = 5,
            C = -1;
          function T() {
            return !!y || !(t.unstable_now() - C < A);
          }
          function N() {
            if (((y = !1), E)) {
              var e = t.unstable_now();
              C = e;
              var n = !0;
              try {
                e: {
                  (m = !1), h && ((h = !1), b(_), (_ = -1)), (g = !0);
                  var o = p;
                  try {
                    t: {
                      for (
                        k(e), f = r(u);
                        null !== f && !(f.expirationTime > e && T());

                      ) {
                        var i = f.callback;
                        if ('function' == typeof i) {
                          (f.callback = null), (p = f.priorityLevel);
                          var l = i(f.expirationTime <= e);
                          if (((e = t.unstable_now()), 'function' == typeof l)) {
                            (f.callback = l), k(e), (n = !0);
                            break t;
                          }
                          f === r(u) && a(u), k(e);
                        } else a(u);
                        f = r(u);
                      }
                      if (null !== f) n = !0;
                      else {
                        var s = r(c);
                        null !== s && j(S, s.startTime - e), (n = !1);
                      }
                    }
                    break e;
                  } finally {
                    (f = null), (p = o), (g = !1);
                  }
                  n = void 0;
                }
              } finally {
                n ? x() : (E = !1);
              }
            }
          }
          if ('function' == typeof w)
            x = function () {
              w(N);
            };
          else if ('undefined' != typeof MessageChannel) {
            var O = new MessageChannel(),
              P = O.port2;
            (O.port1.onmessage = N),
              (x = function () {
                P.postMessage(null);
              });
          } else
            x = function () {
              v(N, 0);
            };
          function j(e, n) {
            _ = v(function () {
              e(t.unstable_now());
            }, n);
          }
          (t.unstable_IdlePriority = 5),
            (t.unstable_ImmediatePriority = 1),
            (t.unstable_LowPriority = 4),
            (t.unstable_NormalPriority = 3),
            (t.unstable_Profiling = null),
            (t.unstable_UserBlockingPriority = 2),
            (t.unstable_cancelCallback = function (e) {
              e.callback = null;
            }),
            (t.unstable_forceFrameRate = function (e) {
              0 > e || 125 < e
                ? console.error(
                    'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                  )
                : (A = 0 < e ? Math.floor(1e3 / e) : 5);
            }),
            (t.unstable_getCurrentPriorityLevel = function () {
              return p;
            }),
            (t.unstable_next = function (e) {
              switch (p) {
                case 1:
                case 2:
                case 3:
                  var t = 3;
                  break;
                default:
                  t = p;
              }
              var n = p;
              p = t;
              try {
                return e();
              } finally {
                p = n;
              }
            }),
            (t.unstable_requestPaint = function () {
              y = !0;
            }),
            (t.unstable_runWithPriority = function (e, t) {
              switch (e) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                  break;
                default:
                  e = 3;
              }
              var n = p;
              p = e;
              try {
                return t();
              } finally {
                p = n;
              }
            }),
            (t.unstable_scheduleCallback = function (e, a, o) {
              var i = t.unstable_now();
              switch (
                ('object' == typeof o && null !== o
                  ? (o = 'number' == typeof (o = o.delay) && 0 < o ? i + o : i)
                  : (o = i),
                e)
              ) {
                case 1:
                  var l = -1;
                  break;
                case 2:
                  l = 250;
                  break;
                case 5:
                  l = 1073741823;
                  break;
                case 4:
                  l = 1e4;
                  break;
                default:
                  l = 5e3;
              }
              return (
                (e = {
                  id: d++,
                  callback: a,
                  priorityLevel: e,
                  startTime: o,
                  expirationTime: (l = o + l),
                  sortIndex: -1,
                }),
                o > i
                  ? ((e.sortIndex = o),
                    n(c, e),
                    null === r(u) &&
                      e === r(c) &&
                      (h ? (b(_), (_ = -1)) : (h = !0), j(S, o - i)))
                  : ((e.sortIndex = l),
                    n(u, e),
                    m || g || ((m = !0), E || ((E = !0), x()))),
                e
              );
            }),
            (t.unstable_shouldYield = T),
            (t.unstable_wrapCallback = function (e) {
              var t = p;
              return function () {
                var n = p;
                p = t;
                try {
                  return e.apply(this, arguments);
                } finally {
                  p = n;
                }
              };
            });
        }),
        h = n.cw((e) => {
          e.exports = m();
        }),
        y = () => n(4784),
        v = () => n(2017);
      g(), f();
      var b = n(9293),
        w = n(1555),
        k = n(8299);
      function S() {
        return S.c || (S.c = n.n(s()));
      }
      const x = [i(), a(), r(), l()];
      var E = n(3151),
        _ = n(8266),
        A = n(3433),
        C = n(159);
      function T(e) {
        var t = e.children;
        return (0, C.jsx)(C.Fragment, { children: t });
      }
      var N = n(2801),
        O = function (e) {
          return e.defaultFormatter(e);
        };
      function P(e) {
        var t = e.children;
        return (0, C.jsx)(N.AL, { formatter: O, children: t });
      }
      function j(e) {
        var t = e.children;
        return (0, C.jsx)(P, { children: t });
      }
      var L = n(466),
        I = n(8364),
        F = n(975),
        R = n(5660),
        D = n(2594),
        z = n(2233),
        M = n(2),
        B = n(1817);
      function $() {
        var e = (0, I.A)().i18n,
          t = e.currentLocale,
          n = e.defaultLocale,
          r = e.localeConfigs,
          a = (0, z.o)(),
          o = r[t].htmlLang,
          i = function (e) {
            return e.replace('-', '_');
          };
        return (0, C.jsxs)(L.A, {
          children: [
            Object.entries(r).map(function (e) {
              var t = e[0],
                n = e[1].htmlLang;
              return (0,
              C.jsx)('link', { rel: 'alternate', href: a.createUrl({ locale: t, fullyQualified: !0 }), hrefLang: n }, t);
            }),
            (0, C.jsx)('link', {
              rel: 'alternate',
              href: a.createUrl({ locale: n, fullyQualified: !0 }),
              hrefLang: 'x-default',
            }),
            (0, C.jsx)('meta', { property: 'og:locale', content: i(o) }),
            Object.values(r)
              .filter(function (e) {
                return o !== e.htmlLang;
              })
              .map(function (e) {
                return (0,
                C.jsx)('meta', { property: 'og:locale:alternate', content: i(e.htmlLang) }, 'meta-og-' + e.htmlLang);
              }),
          ],
        });
      }
      function U(e) {
        var t = e.permalink,
          n = (0, I.A)().siteConfig.url,
          r = (function () {
            var e = (0, I.A)().siteConfig,
              t = e.url,
              n = e.baseUrl,
              r = e.trailingSlash,
              a = (0, _.zy)().pathname;
            return t + (0, M.Ks)((0, F.Ay)(a), { trailingSlash: r, baseUrl: n });
          })(),
          a = t ? '' + n + t : r;
        return (0, C.jsxs)(L.A, {
          children: [
            (0, C.jsx)('meta', { property: 'og:url', content: a }),
            (0, C.jsx)('link', { rel: 'canonical', href: a }),
          ],
        });
      }
      function H() {
        var e = (0, I.A)().i18n.currentLocale,
          t = (0, R.p)(),
          n = t.metadata,
          r = t.image;
        return (0, C.jsxs)(C.Fragment, {
          children: [
            (0, C.jsxs)(L.A, {
              children: [
                (0, C.jsx)('meta', {
                  name: 'twitter:card',
                  content: 'summary_large_image',
                }),
                (0, C.jsx)('body', {}),
              ],
            }),
            r && (0, C.jsx)(D.be, { image: r }),
            (0, C.jsx)(U, {}),
            (0, C.jsx)($, {}),
            (0, C.jsx)(B.A, { tag: 'default', locale: e }),
            (0, C.jsx)(L.A, {
              children: n.map(function (e, t) {
                return (0, C.jsx)('meta', Object.assign({}, e), t);
              }),
            }),
          ],
        });
      }
      var V = new Map();
      var W = n(271),
        G = n(4961),
        q = n(2247),
        Y = n(9127);
      function K(e) {
        for (
          var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
          r < t;
          r++
        )
          n[r - 1] = arguments[r];
        var a = x.map(function (t) {
          var r,
            a,
            o = null != (r = null == (a = t.default) ? void 0 : a[e]) ? r : t[e];
          return null == o ? void 0 : o.apply(void 0, n);
        });
        return function () {
          return a.forEach(function (e) {
            return null == e ? void 0 : e();
          });
        };
      }
      const Q = function (e) {
        var t = e.children,
          n = e.location,
          r = e.previousLocation;
        return (
          (0, Y.A)(
            function () {
              r !== n &&
                (!(function (e) {
                  var t = e.location,
                    n = e.previousLocation;
                  if (n) {
                    var r = t.pathname === n.pathname,
                      a = t.hash === n.hash,
                      o = t.search === n.search;
                    if (!r || !a || o) {
                      var i = t.hash;
                      if (i) {
                        var l = decodeURIComponent(i.substring(1)),
                          s = document.getElementById(l);
                        null == s || s.scrollIntoView();
                      } else window.scrollTo(0, 0);
                    }
                  }
                })({ location: n, previousLocation: r }),
                K('onRouteDidUpdate', { previousLocation: r, location: n }));
            },
            [r, n],
          ),
          t
        );
      };
      function Z(e) {
        var t = Array.from(new Set([e, decodeURI(e)]))
          .map(function (e) {
            return (0, A.u)(E.A, e);
          })
          .flat();
        return Promise.all(
          t.map(function (e) {
            return null == e.route.component.preload
              ? void 0
              : e.route.component.preload();
          }),
        );
      }
      const X = (function (e) {
        function t(t) {
          var n;
          return (
            ((n = e.call(this, t) || this).previousLocation = void 0),
            (n.routeUpdateCleanupCb = void 0),
            (n.previousLocation = null),
            (n.routeUpdateCleanupCb = k.A.canUseDOM
              ? K('onRouteUpdate', { previousLocation: null, location: n.props.location })
              : function () {}),
            (n.state = { nextRouteHasLoaded: !0 }),
            n
          );
        }
        (0, q.A)(t, e);
        var n = t.prototype;
        return (
          (n.shouldComponentUpdate = function (e, t) {
            var n = this;
            if (e.location === this.props.location) return t.nextRouteHasLoaded;
            var r = e.location;
            return (
              (this.previousLocation = this.props.location),
              this.setState({ nextRouteHasLoaded: !1 }),
              (this.routeUpdateCleanupCb = K('onRouteUpdate', {
                previousLocation: this.previousLocation,
                location: r,
              })),
              Z(r.pathname)
                .then(function () {
                  n.routeUpdateCleanupCb(), n.setState({ nextRouteHasLoaded: !0 });
                })
                .catch(function (e) {
                  console.warn(e), window.location.reload();
                }),
              !1
            );
          }),
          (n.render = function () {
            var e = this.props,
              t = e.children,
              n = e.location;
            return (0, C.jsx)(Q, {
              previousLocation: this.previousLocation,
              location: n,
              children: (0, C.jsx)(_.qh, {
                location: n,
                render: function () {
                  return t;
                },
              }),
            });
          }),
          t
        );
      })(g().Component);
      var J = '__docusaurus-base-url-issue-banner-suggestion-container';
      function ee(e) {
        return (
          "\ndocument.addEventListener('DOMContentLoaded', function maybeInsertBanner() {\n  var shouldInsert = typeof window['docusaurus'] === 'undefined';\n  shouldInsert && insertBanner();\n});\n\nfunction insertBanner() {\n  var bannerContainer = document.createElement('div');\n  bannerContainer.id = '__docusaurus-base-url-issue-banner-container';\n  var bannerHtml = " +
          JSON.stringify(
            (function (e) {
              return (
                '\n<div id="__docusaurus-base-url-issue-banner" style="border: thick solid red; background-color: rgb(255, 230, 179); margin: 20px; padding: 20px; font-size: 20px;">\n   <p style="font-weight: bold; font-size: 30px;">Your Docusaurus site did not load properly.</p>\n   <p>A very common reason is a wrong site <a href="https://docusaurus.io/docs/docusaurus.config.js/#baseUrl" style="font-weight: bold;">baseUrl configuration</a>.</p>\n   <p>Current configured baseUrl = <span style="font-weight: bold; color: red;">' +
                e +
                '</span> ' +
                ('/' === e ? ' (default value)' : '') +
                '</p>\n   <p>We suggest trying baseUrl = <span id="' +
                J +
                '" style="font-weight: bold; color: green;"></span></p>\n</div>\n'
              );
            })(e),
          ).replace(/</g, '\\<') +
          ";\n  bannerContainer.innerHTML = bannerHtml;\n  document.body.prepend(bannerContainer);\n  var suggestionContainer = document.getElementById('" +
          J +
          "');\n  var actualHomePagePath = window.location.pathname;\n  var suggestedBaseUrl = actualHomePagePath.substr(-1) === '/'\n        ? actualHomePagePath\n        : actualHomePagePath + '/';\n  suggestionContainer.textContent = suggestedBaseUrl;\n}\n"
        );
      }
      function te() {
        var e = (0, I.A)().siteConfig.baseUrl;
        return (0, C.jsx)(C.Fragment, {
          children:
            !k.A.canUseDOM &&
            (0, C.jsx)(L.A, { children: (0, C.jsx)('script', { children: ee(e) }) }),
        });
      }
      function ne() {
        var e = (0, I.A)().siteConfig,
          t = e.baseUrl,
          n = e.baseUrlIssueBanner,
          r = (0, _.zy)().pathname;
        return n && r === t ? (0, C.jsx)(te, {}) : null;
      }
      function re() {
        var e = (0, I.A)(),
          t = e.siteConfig,
          n = t.favicon,
          r = t.title,
          a = t.noIndex,
          o = e.i18n,
          i = o.currentLocale,
          l = o.localeConfigs,
          s = (0, F.Ay)(n),
          u = l[i],
          c = u.htmlLang,
          d = u.direction;
        return (0, C.jsxs)(L.A, {
          children: [
            (0, C.jsx)('html', { lang: c, dir: d }),
            (0, C.jsx)('title', { children: r }),
            (0, C.jsx)('meta', { property: 'og:title', content: r }),
            (0, C.jsx)('meta', {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1.0',
            }),
            a && (0, C.jsx)('meta', { name: 'robots', content: 'noindex, nofollow' }),
            n && (0, C.jsx)('link', { rel: 'icon', href: s }),
          ],
        });
      }
      var ae = n(17),
        oe = n(3573);
      function ie() {
        var e = (0, oe.A)();
        return (0, C.jsx)(L.A, {
          children: (0, C.jsx)('html', { 'data-has-hydrated': e }),
        });
      }
      var le = (0, A.v)(E.A);
      function se() {
        var e = (function (e) {
          if (V.has(e.pathname))
            return Object.assign({}, e, { pathname: V.get(e.pathname) });
          if (
            (0, A.u)(E.A, e.pathname).some(function (e) {
              return !0 === e.route.exact;
            })
          )
            return V.set(e.pathname, e.pathname), e;
          var t = e.pathname.trim().replace(/(?:\/index)?\.html$/, '') || '/';
          return V.set(e.pathname, t), Object.assign({}, e, { pathname: t });
        })((0, _.zy)());
        return (0, C.jsx)(X, { location: e, children: le });
      }
      function ue() {
        return (0, C.jsx)(ae.A, {
          children: (0, C.jsx)(G.l, {
            children: (0, C.jsxs)(W.x, {
              children: [
                (0, C.jsx)(T, {
                  children: (0, C.jsxs)(j, {
                    children: [
                      (0, C.jsx)(re, {}),
                      (0, C.jsx)(H, {}),
                      (0, C.jsx)(ne, {}),
                      (0, C.jsx)(se, {}),
                    ],
                  }),
                }),
                (0, C.jsx)(ie, {}),
              ],
            }),
          }),
        });
      }
      var ce = n(4054);
      var de = (function (e) {
        try {
          return document.createElement('link').relList.supports(e);
        } catch (t) {
          return !1;
        }
      })('prefetch')
        ? function (e) {
            return new Promise(function (t, n) {
              var r, a;
              if ('undefined' != typeof document) {
                var o = document.createElement('link');
                o.setAttribute('rel', 'prefetch'),
                  o.setAttribute('href', e),
                  (o.onload = function () {
                    return t();
                  }),
                  (o.onerror = function () {
                    return n();
                  });
                var i =
                  null != (r = document.getElementsByTagName('head')[0])
                    ? r
                    : null == (a = document.getElementsByName('script')[0])
                    ? void 0
                    : a.parentNode;
                null == i || i.appendChild(o);
              } else n();
            });
          }
        : function (e) {
            return new Promise(function (t, n) {
              var r = new XMLHttpRequest();
              r.open('GET', e, !0),
                (r.withCredentials = !0),
                (r.onload = function () {
                  200 === r.status ? t() : n();
                }),
                r.send(null);
            });
          };
      var fe = n(1971),
        pe = new Set(),
        ge = new Set(),
        me = function () {
          var e, t;
          return (
            (null == (e = navigator.connection)
              ? void 0
              : e.effectiveType.includes('2g')) ||
            (null == (t = navigator.connection) ? void 0 : t.saveData)
          );
        },
        he = {
          prefetch: function (e) {
            if (
              !(function (e) {
                return !me() && !ge.has(e) && !pe.has(e);
              })(e)
            )
              return !1;
            pe.add(e);
            var t = (0, A.u)(E.A, e).flatMap(function (e) {
              return (
                (t = e.route.path),
                Object.entries(ce)
                  .filter(function (e) {
                    return e[0].replace(/-[^-]+$/, '') === t;
                  })
                  .flatMap(function (e) {
                    var t = e[1];
                    return Object.values((0, fe.A)(t));
                  })
              );
              var t;
            });
            return Promise.all(
              t.map(function (e) {
                var t = n.gca(e);
                return t && !t.includes('undefined')
                  ? de(t).catch(function () {})
                  : Promise.resolve();
              }),
            );
          },
          preload: function (e) {
            return (
              !!(function (e) {
                return !me() && !ge.has(e);
              })(e) && (ge.add(e), Z(e))
            );
          },
        };
      const ye = Object.freeze(he);
      function ve(e) {
        var t = e.children;
        return 'hash' === y().default.future.experimental_router
          ? (0, C.jsx)(w.I9, { children: t })
          : (0, C.jsx)(w.Kd, { children: t });
      }
      var be = Boolean(!0);
      if (k.A.canUseDOM) {
        window.docusaurus = ye;
        var we = document.getElementById('__docusaurus'),
          ke = (0, C.jsx)(b.vd, {
            children: (0, C.jsx)(ve, { children: (0, C.jsx)(ue, {}) }),
          }),
          Se = function (e, t) {
            console.error('Docusaurus React Root onRecoverableError:', e, t);
          },
          xe = function () {
            if (window.docusaurusRoot) window.docusaurusRoot.render(ke);
            else if (be)
              window.docusaurusRoot = c().hydrateRoot(we, ke, { onRecoverableError: Se });
            else {
              var e = c().createRoot(we, { onRecoverableError: Se });
              e.render(ke), (window.docusaurusRoot = e);
            }
          };
        Z(window.location.pathname).then(function () {
          (0, g().startTransition)(xe);
        });
      }
    },
    4961(e, t, n) {
      'use strict';
      n.d(t, { o: () => d, l: () => f });
      var r = n(2503),
        a = n(4784);
      const o = JSON.parse(
          '{"docusaurus-plugin-content-docs":{"default":{"path":"/core/hygen/docs","versions":[{"name":"current","label":"Next","isLast":true,"path":"/core/hygen/docs","mainDocId":"quick-start","docs":[{"id":"conditional-skip","path":"/core/hygen/docs/conditional-skip","sidebar":"docs"},{"id":"content-transforms","path":"/core/hygen/docs/content-transforms","sidebar":"docs"},{"id":"create","path":"/core/hygen/docs/create","sidebar":"docs"},{"id":"express","path":"/core/hygen/docs/express","sidebar":"docs"},{"id":"extensibility","path":"/core/hygen/docs/extensibility","sidebar":"docs"},{"id":"faq","path":"/core/hygen/docs/faq","sidebar":"docs"},{"id":"generators","path":"/core/hygen/docs/generators","sidebar":"docs"},{"id":"glob-batch","path":"/core/hygen/docs/glob-batch","sidebar":"docs"},{"id":"ide-plugin","path":"/core/hygen/docs/ide-plugin","sidebar":"docs"},{"id":"interactive-picker","path":"/core/hygen/docs/interactive-picker","sidebar":"docs"},{"id":"packages","path":"/core/hygen/docs/packages","sidebar":"docs"},{"id":"prompts","path":"/core/hygen/docs/prompts","sidebar":"docs"},{"id":"quick-start","path":"/core/hygen/docs/quick-start","sidebar":"docs"},{"id":"react-native","path":"/core/hygen/docs/react-native","sidebar":"docs"},{"id":"redux","path":"/core/hygen/docs/redux","sidebar":"docs"},{"id":"standalone","path":"/core/hygen/docs/standalone","sidebar":"docs"},{"id":"templates","path":"/core/hygen/docs/templates","sidebar":"docs"}],"draftIds":[],"sidebars":{"docs":{"link":{"path":"/core/hygen/docs/quick-start","label":"quick-start"}}}}],"breadcrumbs":true}}}',
        ),
        i = JSON.parse(
          '{"defaultLocale":"en","locales":["en"],"path":"i18n","currentLocale":"en","localeConfigs":{"en":{"label":"English","direction":"ltr","htmlLang":"en","calendar":"gregory","path":"en","translate":false,"url":"https://biorate.github.io","baseUrl":"/core/hygen/"}}}',
        );
      var l = n(2654);
      const s = JSON.parse(
        '{"docusaurusVersion":"3.10.2","siteVersion":"0.0.0","pluginVersions":{"docusaurus-plugin-content-docs":{"type":"package","name":"@docusaurus/plugin-content-docs","version":"3.10.2"},"docusaurus-plugin-content-pages":{"type":"package","name":"@docusaurus/plugin-content-pages","version":"3.10.2"},"docusaurus-plugin-sitemap":{"type":"package","name":"@docusaurus/plugin-sitemap","version":"3.10.2"},"docusaurus-plugin-svgr":{"type":"package","name":"@docusaurus/plugin-svgr","version":"3.10.2"},"docusaurus-theme-classic":{"type":"package","name":"@docusaurus/theme-classic","version":"3.10.2"}}}',
      );
      var u = n(159),
        c = {
          siteConfig: a.default,
          siteMetadata: s,
          globalData: o,
          i18n: i,
          codeTranslations: l,
        },
        d = r.createContext(c);
      function f(e) {
        var t = e.children;
        return (0, u.jsx)(d.Provider, { value: c, children: t });
      }
    },
    17(e, t, n) {
      'use strict';
      n.d(t, { A: () => h });
      var r = n(2247),
        a = n(2503),
        o = n(8299),
        i = n(466),
        l = n(2),
        s = n(1953),
        u = n(8032),
        c = n(159);
      function d(e) {
        var t = e.error,
          n = e.tryAgain;
        return (0, c.jsxs)('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100vh',
            width: '100%',
            maxWidth: '80ch',
            fontSize: '20px',
            margin: '0 auto',
            padding: '1rem',
          },
          children: [
            (0, c.jsx)('h1', {
              style: { fontSize: '3rem' },
              children: 'This page crashed',
            }),
            (0, c.jsx)('button', {
              type: 'button',
              onClick: n,
              style: {
                margin: '1rem 0',
                fontSize: '2rem',
                cursor: 'pointer',
                borderRadius: 20,
                padding: '1rem',
              },
              children: 'Try again',
            }),
            (0, c.jsx)(f, { error: t }),
          ],
        });
      }
      function f(e) {
        var t = e.error,
          n = (0, l.rA)(t)
            .map(function (e) {
              return e.message;
            })
            .join('\n\nCause:\n');
        return (0, c.jsx)('p', { style: { whiteSpace: 'pre-wrap' }, children: n });
      }
      function p(e) {
        var t = e.children;
        return (0, c.jsx)(u.W, {
          value: { plugin: { name: 'docusaurus-core-error-boundary', id: 'default' } },
          children: t,
        });
      }
      function g(e) {
        var t = e.error,
          n = e.tryAgain;
        return (0, c.jsx)(p, {
          children: (0, c.jsxs)(h, {
            fallback: function () {
              return (0, c.jsx)(d, { error: t, tryAgain: n });
            },
            children: [
              (0, c.jsx)(i.A, {
                children: (0, c.jsx)('title', { children: 'Page Error' }),
              }),
              (0, c.jsx)(s.A, { children: (0, c.jsx)(d, { error: t, tryAgain: n }) }),
            ],
          }),
        });
      }
      var m = function (e) {
          return (0, c.jsx)(g, Object.assign({}, e));
        },
        h = (function (e) {
          function t(t) {
            var n;
            return ((n = e.call(this, t) || this).state = { error: null }), n;
          }
          (0, r.A)(t, e);
          var n = t.prototype;
          return (
            (n.componentDidCatch = function (e) {
              o.A.canUseDOM && this.setState({ error: e });
            }),
            (n.render = function () {
              var e = this,
                t = this.props.children,
                n = this.state.error;
              if (n) {
                var r,
                  a = {
                    error: n,
                    tryAgain: function () {
                      return e.setState({ error: null });
                    },
                  };
                return (null != (r = this.props.fallback) ? r : m)(a);
              }
              return null != t ? t : null;
            }),
            t
          );
        })(a.Component);
    },
    8299(e, t, n) {
      'use strict';
      var r =
        'undefined' != typeof window &&
        'document' in window &&
        'createElement' in window.document;
      const a = {
        canUseDOM: r,
        canUseEventListeners:
          r && ('addEventListener' in window || 'attachEvent' in window),
        canUseIntersectionObserver: r && 'IntersectionObserver' in window,
        canUseViewport: r && 'screen' in window,
      };
      n.d(t, ['A', 0, a]);
    },
    466(e, t, n) {
      'use strict';
      n.d(t, { A: () => o });
      n(2503);
      var r = n(9293),
        a = n(159);
      function o(e) {
        return (0, a.jsx)(r.mg, Object.assign({}, e));
      }
    },
    4740(e, t, n) {
      'use strict';
      var r = n(1463),
        a = n(2503),
        o = n(1555),
        i = n(2),
        l = n(8364),
        s = n(4556),
        u = n(8299),
        c = n(2971),
        d = n(975),
        f = n(159),
        p = [
          'isNavLink',
          'to',
          'href',
          'activeClassName',
          'isActive',
          'data-noBrokenLinkCheck',
          'autoAddBaseUrl',
        ];
      function g(e, t) {
        var n,
          g,
          m,
          h = e.isNavLink,
          y = e.to,
          v = e.href,
          b = e.activeClassName,
          w = e.isActive,
          k = e['data-noBrokenLinkCheck'],
          S = e.autoAddBaseUrl,
          x = void 0 === S || S,
          E = (0, r.A)(e, p),
          _ = (0, l.A)().siteConfig,
          A = _.trailingSlash,
          C = _.baseUrl,
          T = _.future.experimental_router,
          N = (0, d.hH)().withBaseUrl,
          O = (0, c.A)(),
          P = (0, a.useRef)(null);
        (0, a.useImperativeHandle)(t, function () {
          return P.current;
        });
        var j = y || v;
        var L,
          I,
          F = (0, s.A)(j),
          R = null == j ? void 0 : j.replace('pathname://', ''),
          D =
            void 0 !== R
              ? ((L = R),
                x &&
                (function (e) {
                  return e.startsWith('/');
                })(L)
                  ? N(L)
                  : L)
              : void 0;
        'hash' === T &&
          null != (n = D) &&
          n.startsWith('./') &&
          (D = null == (I = D) ? void 0 : I.slice(1));
        D && F && (D = (0, i.Ks)(D, { trailingSlash: A, baseUrl: C }));
        var z = (0, a.useRef)(!1),
          M = h ? o.k2 : o.N_,
          B = u.A.canUseIntersectionObserver,
          $ = (0, a.useRef)(void 0),
          U = function () {
            z.current || null == D || (window.docusaurus.preload(D), (z.current = !0));
          };
        (0, a.useEffect)(
          function () {
            return (
              !B && F && u.A.canUseDOM && null != D && window.docusaurus.prefetch(D),
              function () {
                B && $.current && $.current.disconnect();
              }
            );
          },
          [$, D, B, F],
        );
        var H = null != (g = null == (m = D) ? void 0 : m.startsWith('#')) && g,
          V = !E.target || '_self' === E.target,
          W = !D || !F || !V || (H && 'hash' !== T);
        k || (!H && W) || O.collectLink(D), E.id && O.collectAnchor(E.id);
        var G = {};
        return W
          ? (0, f.jsx)(
              'a',
              Object.assign(
                { ref: P, href: D },
                j && !F && { target: '_blank', rel: 'noopener noreferrer' },
                E,
                G,
              ),
            )
          : (0, f.jsx)(
              M,
              Object.assign(
                {},
                E,
                {
                  onMouseEnter: U,
                  onTouchStart: U,
                  innerRef: function (e) {
                    (P.current = e),
                      B &&
                        e &&
                        F &&
                        (($.current = new window.IntersectionObserver(function (t) {
                          t.forEach(function (t) {
                            e === t.target &&
                              (t.isIntersecting || t.intersectionRatio > 0) &&
                              ($.current.unobserve(e),
                              $.current.disconnect(),
                              null != D && window.docusaurus.prefetch(D));
                          });
                        })),
                        $.current.observe(e));
                  },
                  to: D,
                },
                h && { isActive: w, activeClassName: b },
                G,
              ),
            );
      }
      const m = a.forwardRef(g);
      n.d(t, ['A', 0, m]);
    },
    5012(e, t, n) {
      'use strict';
      const r = function () {
        return null;
      };
      n.dn(r), n.d(t, ['A', 0, r]);
    },
    2258(e, t, n) {
      'use strict';
      n.d(t, { A: () => u, T: () => s });
      var r = n(2503),
        a = n(159);
      function o(e, t) {
        var n = e.split(/(\{\w+\})/).map(function (e, n) {
          if (n % 2 == 1) {
            var r = null == t ? void 0 : t[e.slice(1, -1)];
            if (void 0 !== r) return r;
          }
          return e;
        });
        return n.some(function (e) {
          return (0, r.isValidElement)(e);
        })
          ? n
              .map(function (e, t) {
                return (0, r.isValidElement)(e) ? r.cloneElement(e, { key: t }) : e;
              })
              .filter(function (e) {
                return '' !== e;
              })
          : n.join('');
      }
      var i = n(2654);
      function l(e) {
        var t,
          n,
          r = e.id,
          a = e.message;
        if (void 0 === r && void 0 === a)
          throw new Error(
            'Docusaurus translation declarations must have at least a translation id or a default translation message',
          );
        return null != (t = null != (n = i[null != r ? r : a]) ? n : a) ? t : r;
      }
      function s(e, t) {
        return o(l({ message: e.message, id: e.id }), t);
      }
      function u(e) {
        var t = e.children,
          n = e.id,
          r = e.values;
        if (t && 'string' != typeof t)
          throw (
            (console.warn('Illegal <Translate> children', t),
            new Error(
              'The Docusaurus <Translate> component only accept simple string values',
            ))
          );
        var i = l({ message: t, id: n });
        return (0, a.jsx)(a.Fragment, { children: o(i, r) });
      }
    },
    9427(e, t, n) {
      'use strict';
      n.d(t, { W: () => r });
      var r = 'default';
    },
    4556(e, t, n) {
      'use strict';
      function r(e) {
        return /^(?:[A-Za-z][A-Za-z\d+.-]*:|\/\/)/.test(e);
      }
      function a(e) {
        return void 0 !== e && !r(e);
      }
      n.d(t, { A: () => a, z: () => r });
    },
    975(e, t, n) {
      'use strict';
      n.d(t, { Ay: () => l, hH: () => i });
      var r = n(2503),
        a = n(8364),
        o = n(4556);
      function i() {
        var e = (0, a.A)().siteConfig,
          t = e.baseUrl,
          n = e.url,
          i = e.future.experimental_router,
          l = (0, r.useCallback)(
            function (e, r) {
              return (function (e) {
                var t = e.siteUrl,
                  n = e.baseUrl,
                  r = e.url,
                  a = e.options,
                  i = void 0 === a ? {} : a,
                  l = i.forcePrependBaseUrl,
                  s = void 0 !== l && l,
                  u = i.absolute,
                  c = void 0 !== u && u,
                  d = e.router;
                if (!r || r.startsWith('#') || (0, o.z)(r)) return r;
                if ('hash' === d) return r.startsWith('/') ? '.' + r : './' + r;
                if (s) return n + r.replace(/^\//, '');
                if (r === n.replace(/\/$/, '')) return n;
                var f = r.startsWith(n) ? r : n + r.replace(/^\//, '');
                return c ? t + f : f;
              })({ siteUrl: n, baseUrl: t, url: e, options: r, router: i });
            },
            [n, t, i],
          );
        return { withBaseUrl: l };
      }
      function l(e, t) {
        return void 0 === t && (t = {}), (0, i().withBaseUrl)(e, t);
      }
    },
    2971(e, t, n) {
      'use strict';
      n.d(t, { A: () => o });
      var r = n(2503),
        a =
          (n(159),
          r.createContext({
            collectAnchor: function () {},
            collectLink: function () {},
          }));
      function o() {
        return (0, r.useContext)(a);
      }
    },
    8364(e, t, n) {
      'use strict';
      n.d(t, { A: () => o });
      var r = n(2503),
        a = n(4961);
      function o() {
        return (0, r.useContext)(a.o);
      }
    },
    3573(e, t, n) {
      'use strict';
      n.d(t, { A: () => o });
      var r = n(2503),
        a = n(271);
      function o() {
        return (0, r.useContext)(a.o);
      }
    },
    9127(e, t, n) {
      'use strict';
      var r = n(2503);
      const a = n(8299).A.canUseDOM ? r.useLayoutEffect : r.useEffect;
      n.d(t, ['A', 0, a]);
    },
    9917(e, t, n) {
      'use strict';
      n.d(t, { A: () => o });
      var r = n(2503),
        a = n(8032);
      function o() {
        var e = r.useContext(a.o);
        if (!e) throw new Error('Unexpected: no Docusaurus route context found');
        return e;
      }
    },
    1971(e, t, n) {
      'use strict';
      n.d(t, { A: () => r });
      function r(e) {
        var t = {};
        return (
          (function e(n, r) {
            Object.entries(n).forEach(function (n) {
              var a,
                o = n[0],
                i = n[1],
                l = r ? r + '.' + o : o;
              'object' == typeof (a = i) && a && Object.keys(a).length > 0
                ? e(i, l)
                : (t[l] = i);
            });
          })(e),
          t
        );
      }
    },
    8032(e, t, n) {
      'use strict';
      n.d(t, { W: () => i, o: () => o });
      var r = n(2503),
        a = n(159),
        o = r.createContext(null);
      function i(e) {
        var t = e.children,
          n = e.value,
          i = r.useContext(o),
          l = (0, r.useMemo)(
            function () {
              return (function (e) {
                var t = e.parent,
                  n = e.value;
                if (!t) {
                  if (!n)
                    throw new Error('Unexpected: no Docusaurus route context found');
                  if (!('plugin' in n))
                    throw new Error(
                      'Unexpected: Docusaurus topmost route context has no `plugin` attribute',
                    );
                  return n;
                }
                var r = Object.assign({}, t.data, null == n ? void 0 : n.data);
                return { plugin: t.plugin, data: r };
              })({ parent: i, value: n });
            },
            [i, n],
          );
        return (0, a.jsx)(o.Provider, { value: l, children: t });
      }
    },
    4158(e, t, n) {
      'use strict';
      n.d(t, { VQ: () => y, g1: () => b });
      var r = n(2503),
        a = n(6758),
        o = n(9427),
        i = n(5660),
        l = n(5093),
        s = n(6348),
        u = n(159),
        c = function (e) {
          return 'docs-preferred-version-' + e;
        },
        d = function (e, t, n) {
          (0, l.Wf)(c(e), { persistence: t }).set(n);
        },
        f = function (e, t) {
          return (0, l.Wf)(c(e), { persistence: t }).get();
        },
        p = function (e, t) {
          (0, l.Wf)(c(e), { persistence: t }).del();
        };
      var g = r.createContext(null);
      function m() {
        var e = (0, a.Gy)(),
          t = (0, i.p)().docs.versionPersistence,
          n = (0, r.useMemo)(
            function () {
              return Object.keys(e);
            },
            [e],
          ),
          o = (0, r.useState)(function () {
            return (function (e) {
              return Object.fromEntries(
                e.map(function (e) {
                  return [e, { preferredVersionName: null }];
                }),
              );
            })(n);
          }),
          l = o[0],
          s = o[1];
        return (
          (0, r.useEffect)(
            function () {
              s(
                (function (e) {
                  var t = e.pluginIds,
                    n = e.versionPersistence,
                    r = e.allDocsData;
                  return Object.fromEntries(
                    t.map(function (e) {
                      return [
                        e,
                        ((t = e),
                        (a = f(t, n)),
                        r[t].versions.some(function (e) {
                          return e.name === a;
                        })
                          ? { preferredVersionName: a }
                          : (p(t, n), { preferredVersionName: null })),
                      ];
                      var t, a;
                    }),
                  );
                })({ allDocsData: e, versionPersistence: t, pluginIds: n }),
              );
            },
            [e, t, n],
          ),
          [
            l,
            (0, r.useMemo)(
              function () {
                return {
                  savePreferredVersion: function (e, n) {
                    d(e, t, n),
                      s(function (t) {
                        var r;
                        return Object.assign(
                          {},
                          t,
                          (((r = {})[e] = { preferredVersionName: n }), r),
                        );
                      });
                  },
                };
              },
              [t],
            ),
          ]
        );
      }
      function h(e) {
        var t = e.children,
          n = m();
        return (0, u.jsx)(g.Provider, { value: n, children: t });
      }
      function y(e) {
        var t = e.children;
        return (0, u.jsx)(h, { children: t });
      }
      function v() {
        var e = (0, r.useContext)(g);
        if (!e) throw new s.dV('DocsPreferredVersionContextProvider');
        return e;
      }
      function b(e) {
        var t;
        void 0 === e && (e = o.W);
        var n = (0, a.ht)(e),
          i = v(),
          l = i[0],
          s = i[1],
          u = l[e].preferredVersionName;
        return {
          preferredVersion:
            null !=
            (t = n.versions.find(function (e) {
              return e.name === u;
            }))
              ? t
              : null,
          savePreferredVersionName: (0, r.useCallback)(
            function (t) {
              s.savePreferredVersion(e, t);
            },
            [s, e],
          ),
        };
      }
    },
    1617(e, t, n) {
      'use strict';
      n.d(t, { V: () => s, t: () => u });
      var r = n(2503),
        a = n(6348),
        o = n(159),
        i = Symbol('EmptyContext'),
        l = r.createContext(i);
      function s(e) {
        var t = e.children,
          n = e.name,
          a = e.items,
          i = (0, r.useMemo)(
            function () {
              return n && a ? { name: n, items: a } : null;
            },
            [n, a],
          );
        return (0, o.jsx)(l.Provider, { value: i, children: t });
      }
      function u() {
        var e = (0, r.useContext)(l);
        if (e === i) throw new a.dV('DocsSidebarProvider');
        return e;
      }
    },
    720(e, t, n) {
      'use strict';
      n.d(t, {
        Nr: () => p,
        w8: () => m,
        B5: () => x,
        Vd: () => w,
        QB: () => S,
        fW: () => k,
        OF: () => b,
        Y: () => y,
      });
      var r = n(3961),
        a = n(2503),
        o = n(8266),
        i = n(3433),
        l = n(6758),
        s = n(979);
      function u(e) {
        return Array.from(new Set(e));
      }
      var c = n(4158),
        d = n(2689),
        f = n(1617);
      function p(e) {
        return 'link' !== e.type || e.unlisted
          ? 'category' === e.type
            ? (function (e) {
                if (e.href && !e.linkUnlisted) return e.href;
                for (var t, n = (0, r.A)(e.items); !(t = n()).done; ) {
                  var a = p(t.value);
                  if (a) return a;
                }
              })(e)
            : void 0
          : e.href;
      }
      var g = function (e, t) {
        return void 0 !== e && (0, s.ys)(e, t);
      };
      function m(e, t) {
        return 'link' === e.type
          ? g(e.href, t)
          : 'category' === e.type &&
              (g(e.href, t) ||
                (function (e, t) {
                  return e.some(function (e) {
                    return m(e, t);
                  });
                })(e.items, t));
      }
      function h(e, t) {
        switch (e.type) {
          case 'category':
            return (
              m(e, t) ||
              (void 0 !== e.href && !e.linkUnlisted) ||
              e.items.some(function (e) {
                return h(e, t);
              })
            );
          case 'link':
            return !e.unlisted || m(e, t);
          default:
            return !0;
        }
      }
      function y(e, t) {
        return (0, a.useMemo)(
          function () {
            return e.filter(function (e) {
              return h(e, t);
            });
          },
          [e, t],
        );
      }
      function v(e) {
        var t = e.sidebarItems,
          n = e.pathname,
          a = e.onlyCategories,
          o = void 0 !== a && a,
          i = [];
        return (
          (function e(t) {
            for (var a, l = (0, r.A)(t); !(a = l()).done; ) {
              var u = a.value;
              if ('category' === u.type) {
                if ((0, s.ys)(u.href, n) || e(u.items)) return i.unshift(u), !0;
              } else if ('link' === u.type && u.docId && (0, s.ys)(u.href, n))
                return o || i.unshift(u), !0;
            }
            return !1;
          })(t),
          i
        );
      }
      function b() {
        var e,
          t = (0, f.t)(),
          n = (0, o.zy)().pathname;
        return !1 !== (null == (e = (0, l.vT)()) ? void 0 : e.pluginData.breadcrumbs) && t
          ? v({ sidebarItems: t.items, pathname: n })
          : null;
      }
      function w(e) {
        var t = (0, l.zK)(e).activeVersion,
          n = (0, c.g1)(e).preferredVersion,
          r = (0, l.r7)(e);
        return (0, a.useMemo)(
          function () {
            return u([t, n, r].filter(Boolean));
          },
          [t, n, r],
        );
      }
      function k(e, t) {
        var n = w(t);
        return (0, a.useMemo)(
          function () {
            var t = n.flatMap(function (e) {
                return e.sidebars ? Object.entries(e.sidebars) : [];
              }),
              r = t.find(function (t) {
                return t[0] === e;
              });
            if (!r)
              throw new Error(
                'Can\'t find any sidebar with id "' +
                  e +
                  '" in version' +
                  (n.length > 1 ? 's' : '') +
                  ' ' +
                  n
                    .map(function (e) {
                      return e.name;
                    })
                    .join(', ') +
                  '".\nAvailable sidebar ids are:\n- ' +
                  t
                    .map(function (e) {
                      return e[0];
                    })
                    .join('\n- '),
              );
            return r[1];
          },
          [e, n],
        );
      }
      function S(e, t) {
        var n = w(t);
        return (0, a.useMemo)(
          function () {
            var t = n.flatMap(function (e) {
                return e.docs;
              }),
              r = t.find(function (t) {
                return t.id === e;
              });
            if (!r) {
              if (
                n
                  .flatMap(function (e) {
                    return e.draftIds;
                  })
                  .includes(e)
              )
                return null;
              throw new Error(
                'Couldn\'t find any doc with id "' +
                  e +
                  '" in version' +
                  (n.length > 1 ? 's' : '') +
                  ' "' +
                  n
                    .map(function (e) {
                      return e.name;
                    })
                    .join(', ') +
                  '".\nAvailable doc ids are:\n- ' +
                  u(
                    t.map(function (e) {
                      return e.id;
                    }),
                  ).join('\n- '),
              );
            }
            return r;
          },
          [e, n],
        );
      }
      function x(e) {
        var t = e.route,
          n = (0, o.zy)(),
          r = (0, d.r)(),
          a = t.routes,
          l = a.find(function (e) {
            return (0, o.B6)(n.pathname, e);
          });
        if (!l) return null;
        var s = l.sidebar,
          u = s ? r.docsSidebars[s] : void 0;
        return { docElement: (0, i.v)(a), sidebarName: s, sidebarItems: u };
      }
    },
    2689(e, t, n) {
      'use strict';
      n.d(t, { n: () => l, r: () => s });
      var r = n(2503),
        a = n(6348),
        o = n(159),
        i = r.createContext(null);
      function l(e) {
        var t = e.children,
          n = e.version;
        return (0, o.jsx)(i.Provider, { value: n, children: t });
      }
      function s() {
        var e = (0, r.useContext)(i);
        if (null === e) throw new a.dV('DocsVersionProvider');
        return e;
      }
    },
    6758(e, t, n) {
      'use strict';
      n.d(t, {
        zK: () => m,
        vT: () => f,
        Gy: () => c,
        HW: () => h,
        ht: () => d,
        r7: () => g,
        jh: () => p,
      });
      var r = n(8266),
        a = n(8364),
        o = n(9427);
      function i(e, t) {
        void 0 === t && (t = {});
        var n = (0, a.A)().globalData[e];
        if (!n && t.failfast)
          throw new Error(
            'Docusaurus plugin global data not found for "' + e + '" plugin.',
          );
        return n;
      }
      var l = function (e) {
        return e.versions.find(function (e) {
          return e.isLast;
        });
      };
      function s(e, t) {
        var n,
          a,
          o = (function (e, t) {
            return []
              .concat(e.versions)
              .sort(function (e, t) {
                return e.path === t.path
                  ? 0
                  : e.path.includes(t.path)
                  ? -1
                  : t.path.includes(e.path)
                  ? 1
                  : 0;
              })
              .find(function (e) {
                return !!(0, r.B6)(t, { path: e.path, exact: !1, strict: !1 });
              });
          })(e, t),
          i =
            null == o
              ? void 0
              : o.docs.find(function (e) {
                  return !!(0, r.B6)(t, { path: e.path, exact: !0, strict: !1 });
                });
        return {
          activeVersion: o,
          activeDoc: i,
          alternateDocVersions: i
            ? ((n = i.id),
              (a = {}),
              e.versions.forEach(function (e) {
                e.docs.forEach(function (t) {
                  t.id === n && (a[e.name] = t);
                });
              }),
              a)
            : {},
        };
      }
      var u = {},
        c = function () {
          var e;
          return null != (e = i('docusaurus-plugin-content-docs')) ? e : u;
        },
        d = function (e) {
          try {
            return (function (e, t, n) {
              void 0 === t && (t = o.W), void 0 === n && (n = {});
              var r = i(e),
                a = null == r ? void 0 : r[t];
              if (!a && n.failfast)
                throw new Error(
                  'Docusaurus plugin global data not found for "' +
                    e +
                    '" plugin with id "' +
                    t +
                    '".',
                );
              return a;
            })('docusaurus-plugin-content-docs', e, { failfast: !0 });
          } catch (t) {
            throw new Error(
              'You are using a feature of the Docusaurus docs plugin, but this plugin does not seem to be enabled' +
                ('Default' === e ? '' : ' (pluginId=' + e),
              { cause: t },
            );
          }
        };
      function f(e) {
        return (
          void 0 === e && (e = {}),
          (function (e, t, n) {
            void 0 === n && (n = {});
            var a = Object.entries(e)
                .sort(function (e, t) {
                  return t[1].path.localeCompare(e[1].path);
                })
                .find(function (e) {
                  var n = e[1];
                  return !!(0, r.B6)(t, { path: n.path, exact: !1, strict: !1 });
                }),
              o = a ? { pluginId: a[0], pluginData: a[1] } : void 0;
            if (!o && n.failfast)
              throw new Error(
                'Can\'t find active docs plugin for "' +
                  t +
                  '" pathname, while it was expected to be found. Maybe you tried to use a docs feature that can only be used on a docs-related page? Existing docs plugin paths are: ' +
                  Object.values(e)
                    .map(function (e) {
                      return e.path;
                    })
                    .join(', '),
              );
            return o;
          })(c(), (0, r.zy)().pathname, e)
        );
      }
      function p(e) {
        return d(e).versions;
      }
      function g(e) {
        var t = d(e);
        return l(t);
      }
      function m(e) {
        return s(d(e), (0, r.zy)().pathname);
      }
      function h(e) {
        return (function (e, t) {
          var n = l(e);
          return {
            latestDocSuggestion: s(e, t).alternateDocVersions[n.name],
            latestVersionSuggestion: n,
          };
        })(d(e), (0, r.zy)().pathname);
      }
    },
    7074(e, t, n) {
      'use strict';
      n.d(t, { A: () => d });
      var r = n(1463),
        a = (n(2503), n(3526)),
        o = n(2258),
        i = n(2147),
        l = n(4740),
        s = n(2971),
        u = n(159),
        c = ['as', 'id'];
      function d(e) {
        var t = e.as,
          n = e.id,
          d = (0, r.A)(e, c),
          f = (0, s.A)(),
          p = (0, i.v)(n);
        if ('h1' === t || !n) return (0, u.jsx)(t, Object.assign({}, d, { id: void 0 }));
        f.collectAnchor(n);
        var g = (0, o.T)(
          {
            id: 'theme.common.headingLinkTitle',
            message: 'Direct link to {heading}',
            description: 'Title for link to heading',
          },
          { heading: 'string' == typeof d.children ? d.children : n },
        );
        return (0, u.jsxs)(
          t,
          Object.assign({}, d, {
            className: (0, a.A)('anchor', p, d.className),
            id: n,
            children: [
              d.children,
              (0, u.jsx)(l.A, {
                className: 'hash-link',
                to: '#' + n,
                'aria-label': g,
                title: g,
                translate: 'no',
                children: '\u200b',
              }),
            ],
          }),
        );
      }
    },
    7093(e, t, n) {
      'use strict';
      n.d(t, { A: () => i });
      n(2503);
      var r = n(2258);
      const a = 'iconExternalLink_doDY';
      var o = n(159);
      function i(e) {
        var t = e.width,
          n = void 0 === t ? 13.5 : t,
          i = e.height,
          l = void 0 === i ? 13.5 : i;
        return (0, o.jsx)('svg', {
          width: n,
          height: l,
          'aria-label': (0, r.T)({
            id: 'theme.IconExternalLink.ariaLabel',
            message: '(opens in new tab)',
            description: 'The ARIA label for the external link icon',
          }),
          className: a,
          children: (0, o.jsx)('use', { href: '#theme-svg-external-link' }),
        });
      }
    },
    1953(e, t, n) {
      'use strict';
      n.d(t, { A: () => Kt });
      var r = n(2503),
        a = n(3526),
        o = n(17),
        i = n(2594),
        l = n(8266),
        s = n(2258),
        u = n(7752),
        c = n(159),
        d = '__docusaurus_skipToContent_fallback';
      function f(e) {
        e.setAttribute('tabindex', '-1'), e.focus(), e.removeAttribute('tabindex');
      }
      function p() {
        var e = (0, r.useRef)(null),
          t = (0, l.W6)().action,
          n = (0, r.useCallback)(function (e) {
            e.preventDefault();
            var t,
              n =
                null != (t = document.querySelector('main:first-of-type'))
                  ? t
                  : document.getElementById(d);
            n && f(n);
          }, []);
        return (
          (0, u.$)(function (n) {
            var r = n.location;
            e.current && !r.hash && 'PUSH' === t && f(e.current);
          }),
          { containerRef: e, onClick: n }
        );
      }
      var g = (0, s.T)({
        id: 'theme.common.skipToMainContent',
        description:
          'The skip to content label used for accessibility, allowing to rapidly navigate to main content with keyboard tab/enter navigation',
        message: 'Skip to main content',
      });
      function m(e) {
        var t,
          n = null != (t = e.children) ? t : g,
          r = p(),
          a = r.containerRef,
          o = r.onClick;
        return (0, c.jsx)('div', {
          ref: a,
          role: 'region',
          'aria-label': g,
          children: (0, c.jsx)(
            'a',
            Object.assign({}, e, { href: '#' + d, onClick: o, children: n }),
          ),
        });
      }
      var h = n(8941);
      const y = 'skipToContent_UG9r';
      function v() {
        return (0, c.jsx)(m, { className: y });
      }
      var b = n(5660),
        w = n(8507),
        k = n(1463),
        S = ['width', 'height', 'color', 'strokeWidth', 'className'];
      function x(e) {
        var t = e.width,
          n = void 0 === t ? 21 : t,
          r = e.height,
          a = void 0 === r ? 21 : r,
          o = e.color,
          i = void 0 === o ? 'currentColor' : o,
          l = e.strokeWidth,
          s = void 0 === l ? 1.2 : l,
          u = (e.className, (0, k.A)(e, S));
        return (0, c.jsx)(
          'svg',
          Object.assign({ viewBox: '0 0 15 15', width: n, height: a }, u, {
            children: (0, c.jsx)('g', {
              stroke: i,
              strokeWidth: s,
              children: (0, c.jsx)('path', { d: 'M.75.75l13.5 13.5M14.25.75L.75 14.25' }),
            }),
          }),
        );
      }
      const E = 'closeButton_S_Ka';
      function _(e) {
        return (0, c.jsx)(
          'button',
          Object.assign(
            {
              type: 'button',
              'aria-label': (0, s.T)({
                id: 'theme.AnnouncementBar.closeButtonAriaLabel',
                message: 'Close',
                description: 'The ARIA label for close button of announcement bar',
              }),
            },
            e,
            {
              className: (0, a.A)('clean-btn close', E, e.className),
              children: (0, c.jsx)(x, { width: 14, height: 14, strokeWidth: 3.1 }),
            },
          ),
        );
      }
      const A = 'content_VX4f';
      function C(e) {
        var t = (0, b.p)().announcementBar.content;
        return (0, c.jsx)(
          'div',
          Object.assign({}, e, {
            className: (0, a.A)(A, e.className),
            dangerouslySetInnerHTML: { __html: t },
          }),
        );
      }
      const T = 'announcementBar_Kzs_',
        N = 'announcementBarPlaceholder_iG40',
        O = 'announcementBarClose_Ss14',
        P = 'announcementBarContent_WyGW';
      function j() {
        var e = (0, b.p)().announcementBar,
          t = (0, w.M)(),
          n = t.isActive,
          r = t.close;
        if (!n) return null;
        var o = e.backgroundColor,
          i = e.textColor,
          l = e.isCloseable;
        return (0, c.jsxs)('div', {
          className: (0, a.A)(h.G.announcementBar.container, T),
          style: { backgroundColor: o, color: i },
          role: 'banner',
          children: [
            l && (0, c.jsx)('div', { className: N }),
            (0, c.jsx)(C, { className: P }),
            l && (0, c.jsx)(_, { onClick: r, className: O }),
          ],
        });
      }
      var L = n(3019),
        I = n(8614);
      var F = n(6348),
        R = n(6550),
        D = r.createContext(null);
      function z(e) {
        var t,
          n,
          a,
          o,
          i,
          l,
          s,
          u = e.children,
          d =
            ((t = (0, L.M)()),
            (n = (0, R.YL)()),
            (a = (0, r.useState)(!1)),
            (o = a[0]),
            (i = a[1]),
            (l = null !== n.component),
            (s = (0, F.ZC)(l)),
            (0, r.useEffect)(
              function () {
                l && !s && i(!0);
              },
              [l, s],
            ),
            (0, r.useEffect)(
              function () {
                l ? t.shown || i(!0) : i(!1);
              },
              [t.shown, l],
            ),
            (0, r.useMemo)(
              function () {
                return [o, i];
              },
              [o],
            ));
        return (0, c.jsx)(D.Provider, { value: d, children: u });
      }
      function M(e) {
        if (e.component) {
          var t = e.component;
          return (0, c.jsx)(t, Object.assign({}, e.props));
        }
      }
      function B() {
        var e = (0, r.useContext)(D);
        if (!e) throw new F.dV('NavbarSecondaryMenuDisplayProvider');
        var t = e[0],
          n = e[1],
          a = (0, r.useCallback)(
            function () {
              return n(!1);
            },
            [n],
          ),
          o = (0, R.YL)();
        return (0, r.useMemo)(
          function () {
            return { shown: t, hide: a, content: M(o) };
          },
          [a, o, t],
        );
      }
      function $(e) {
        var t = e.children,
          n = e.inert;
        return (0, c.jsx)(
          'div',
          Object.assign(
            {
              className: (0, a.A)(
                h.G.layout.navbar.mobileSidebar.panel,
                'navbar-sidebar__item menu',
              ),
            },
            (function (e) {
              return parseInt(r.version.split('.')[0], 10) < 19
                ? { inert: e ? '' : void 0 }
                : { inert: e };
            })(n),
            { children: t },
          ),
        );
      }
      function U(e) {
        var t = e.header,
          n = e.primaryMenu,
          r = e.secondaryMenu,
          o = B().shown;
        return (0, c.jsxs)('div', {
          className: (0, a.A)(
            h.G.layout.navbar.mobileSidebar.container,
            'navbar-sidebar',
          ),
          children: [
            t,
            (0, c.jsxs)('div', {
              className: (0, a.A)('navbar-sidebar__items', {
                'navbar-sidebar__items--show-secondary': o,
              }),
              children: [
                (0, c.jsx)($, { inert: o, children: n }),
                (0, c.jsx)($, { inert: !o, children: r }),
              ],
            }),
          ],
        });
      }
      var H = n(3939),
        V = n(3573);
      function W(e) {
        return (0, c.jsx)(
          'svg',
          Object.assign({ viewBox: '0 0 24 24', width: 24, height: 24 }, e, {
            children: (0, c.jsx)('path', {
              fill: 'currentColor',
              d: 'M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z',
            }),
          }),
        );
      }
      function G(e) {
        return (0, c.jsx)(
          'svg',
          Object.assign({ viewBox: '0 0 24 24', width: 24, height: 24 }, e, {
            children: (0, c.jsx)('path', {
              fill: 'currentColor',
              d: 'M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z',
            }),
          }),
        );
      }
      function q(e) {
        return (0, c.jsx)(
          'svg',
          Object.assign({ viewBox: '0 0 24 24', width: 24, height: 24 }, e, {
            children: (0, c.jsx)('path', {
              fill: 'currentColor',
              d: 'm12 21c4.971 0 9-4.029 9-9s-4.029-9-9-9-9 4.029-9 9 4.029 9 9 9zm4.95-13.95c1.313 1.313 2.05 3.093 2.05 4.95s-0.738 3.637-2.05 4.95c-1.313 1.313-3.093 2.05-4.95 2.05v-14c1.857 0 3.637 0.737 4.95 2.05z',
            }),
          }),
        );
      }
      const Y = 'toggle_Z5Kc',
        K = 'toggleButton_T_fP',
        Q = 'toggleIcon__wCh',
        Z = 'systemToggleIcon_xRgL',
        X = 'lightToggleIcon_tW27',
        J = 'darkToggleIcon_xXhk',
        ee = 'toggleButtonDisabled_TWNG';
      function te(e) {
        switch (e) {
          case null:
            return (0, s.T)({
              message: 'system mode',
              id: 'theme.colorToggle.ariaLabel.mode.system',
              description: 'The name for the system color mode',
            });
          case 'light':
            return (0, s.T)({
              message: 'light mode',
              id: 'theme.colorToggle.ariaLabel.mode.light',
              description: 'The name for the light color mode',
            });
          case 'dark':
            return (0, s.T)({
              message: 'dark mode',
              id: 'theme.colorToggle.ariaLabel.mode.dark',
              description: 'The name for the dark color mode',
            });
          default:
            throw new Error('unexpected color mode ' + e);
        }
      }
      function ne(e) {
        return (0, s.T)(
          {
            message: 'Switch between dark and light mode (currently {mode})',
            id: 'theme.colorToggle.ariaLabel',
            description: 'The ARIA label for the color mode toggle',
          },
          { mode: te(e) },
        );
      }
      function re() {
        return (0, c.jsxs)(c.Fragment, {
          children: [
            (0, c.jsx)(W, { 'aria-hidden': !0, className: (0, a.A)(Q, X) }),
            (0, c.jsx)(G, { 'aria-hidden': !0, className: (0, a.A)(Q, J) }),
            (0, c.jsx)(q, { 'aria-hidden': !0, className: (0, a.A)(Q, Z) }),
          ],
        });
      }
      function ae(e) {
        var t = e.className,
          n = e.buttonClassName,
          r = e.respectPrefersColorScheme,
          o = e.value,
          i = e.onChange,
          l = (0, V.A)();
        return (0, c.jsx)('div', {
          className: (0, a.A)(Y, t),
          children: (0, c.jsx)('button', {
            className: (0, a.A)('clean-btn', K, !l && ee, n),
            type: 'button',
            onClick: function () {
              return i(
                (function (e, t) {
                  if (!t) return 'dark' === e ? 'light' : 'dark';
                  switch (e) {
                    case null:
                      return 'light';
                    case 'light':
                      return 'dark';
                    case 'dark':
                      return null;
                    default:
                      throw new Error('unexpected color mode ' + e);
                  }
                })(o, r),
              );
            },
            disabled: !l,
            title: te(o),
            'aria-label': ne(o),
            children: (0, c.jsx)(re, {}),
          }),
        });
      }
      const oe = r.memo(ae),
        ie = 'darkNavbarColorModeToggle_Nls4';
      function le(e) {
        var t = e.className,
          n = (0, b.p)().navbar.style,
          r = (0, b.p)().colorMode,
          a = r.disableSwitch,
          o = r.respectPrefersColorScheme,
          i = (0, H.G)(),
          l = i.colorModeChoice,
          s = i.setColorMode;
        return a
          ? null
          : (0, c.jsx)(oe, {
              className: t,
              buttonClassName: 'dark' === n ? ie : void 0,
              respectPrefersColorScheme: o,
              value: l,
              onChange: s,
            });
      }
      var se = n(7091);
      function ue() {
        return (0, c.jsx)(se.A, {
          className: 'navbar__brand',
          imageClassName: 'navbar__logo',
          titleClassName: 'navbar__title text--truncate',
        });
      }
      function ce() {
        var e = (0, L.M)();
        return (0, c.jsx)('button', {
          type: 'button',
          'aria-label': (0, s.T)({
            id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
            message: 'Close navigation bar',
            description: 'The ARIA label for close button of mobile sidebar',
          }),
          className: 'clean-btn navbar-sidebar__close',
          onClick: function () {
            return e.toggle();
          },
          children: (0, c.jsx)(x, { color: 'var(--ifm-color-emphasis-600)' }),
        });
      }
      function de() {
        return (0, c.jsxs)('div', {
          className: 'navbar-sidebar__brand',
          children: [
            (0, c.jsx)(ue, {}),
            (0, c.jsx)(le, { className: 'margin-right--md' }),
            (0, c.jsx)(ce, {}),
          ],
        });
      }
      var fe = n(4740),
        pe = n(975),
        ge = n(4556);
      function me(e, t) {
        return void 0 !== e && void 0 !== t && new RegExp(e, 'gi').test(t);
      }
      var he = n(7093),
        ye = [
          'activeBasePath',
          'activeBaseRegex',
          'to',
          'href',
          'label',
          'html',
          'isDropdownLink',
          'prependBaseUrlToHref',
        ];
      function ve(e) {
        var t = e.activeBasePath,
          n = e.activeBaseRegex,
          r = e.to,
          a = e.href,
          o = e.label,
          i = e.html,
          l = e.isDropdownLink,
          s = e.prependBaseUrlToHref,
          u = (0, k.A)(e, ye),
          d = (0, pe.Ay)(r),
          f = (0, pe.Ay)(t),
          p = (0, pe.Ay)(a, { forcePrependBaseUrl: !0 }),
          g = o && a && !(0, ge.A)(a),
          m = i
            ? { dangerouslySetInnerHTML: { __html: i } }
            : {
                children: (0, c.jsxs)(c.Fragment, {
                  children: [
                    o,
                    g &&
                      (0, c.jsx)(he.A, Object.assign({}, l && { width: 12, height: 12 })),
                  ],
                }),
              };
        return a
          ? (0, c.jsx)(fe.A, Object.assign({ href: s ? p : a }, u, m))
          : (0, c.jsx)(
              fe.A,
              Object.assign(
                { to: d, isNavLink: !0 },
                (t || n) && {
                  isActive: function (e, t) {
                    return n ? me(n, t.pathname) : t.pathname.startsWith(f);
                  },
                },
                u,
                m,
              ),
            );
      }
      var be = ['className', 'isDropdownItem'];
      function we(e) {
        var t = e.className,
          n = (e.isDropdownItem, (0, k.A)(e, be));
        return (0, c.jsx)('li', {
          className: 'menu__list-item',
          children: (0, c.jsx)(
            ve,
            Object.assign({ className: (0, a.A)('menu__link', t) }, n),
          ),
        });
      }
      var ke = ['className', 'isDropdownItem'];
      function Se(e) {
        var t = e.className,
          n = e.isDropdownItem,
          r = void 0 !== n && n,
          o = (0, k.A)(e, ke),
          i = (0, c.jsx)(
            ve,
            Object.assign(
              {
                className: (0, a.A)(
                  r ? 'dropdown__link' : 'navbar__item navbar__link',
                  t,
                ),
                isDropdownLink: r,
              },
              o,
            ),
          );
        return r ? (0, c.jsx)('li', { children: i }) : i;
      }
      var xe = ['mobile', 'position'];
      function Ee(e) {
        var t,
          n = e.mobile,
          r = void 0 !== n && n,
          a = (e.position, (0, k.A)(e, xe)),
          o = r ? we : Se;
        return (0, c.jsx)(
          o,
          Object.assign({}, a, {
            activeClassName:
              null != (t = a.activeClassName)
                ? t
                : r
                ? 'menu__link--active'
                : 'navbar__link--active',
          }),
        );
      }
      var _e = n(6120),
        Ae = n(979),
        Ce = n(8364);
      const Te = 'dropdownNavbarItemMobile_bENQ';
      var Ne = ['items', 'className', 'position', 'onClick'];
      function Oe(e, t) {
        return e.some(function (e) {
          return (function (e, t) {
            return (
              !!(0, Ae.ys)(e.to, t) ||
              !!me(e.activeBaseRegex, t) ||
              !(!e.activeBasePath || !t.startsWith(e.activeBasePath))
            );
          })(e, t);
        });
      }
      function Pe(e) {
        var t = e.collapsed,
          n = e.onClick;
        return (0, c.jsx)('button', {
          'aria-label': t
            ? (0, s.T)({
                id: 'theme.navbar.mobileDropdown.collapseButton.expandAriaLabel',
                message: 'Expand the dropdown',
                description:
                  'The ARIA label of the button to expand the mobile dropdown navbar item',
              })
            : (0, s.T)({
                id: 'theme.navbar.mobileDropdown.collapseButton.collapseAriaLabel',
                message: 'Collapse the dropdown',
                description:
                  'The ARIA label of the button to collapse the mobile dropdown navbar item',
              }),
          'aria-expanded': !t,
          type: 'button',
          className: 'clean-btn menu__caret',
          onClick: n,
        });
      }
      function je(e) {
        var t,
          n,
          o = e.items,
          i = e.className,
          s = (e.position, e.onClick),
          u = (0, k.A)(e, Ne),
          d =
            ((n = (0, Ce.A)().siteConfig.baseUrl), (0, l.zy)().pathname.replace(n, '/')),
          f = (0, Ae.ys)(u.to, d),
          p = Oe(o, d),
          g = (function (e) {
            var t = e.active,
              n = (0, _e.u)({
                initialState: function () {
                  return !t;
                },
              }),
              a = n.collapsed,
              o = n.toggleCollapsed,
              i = n.setCollapsed;
            return (
              (0, r.useEffect)(
                function () {
                  t && i(!1);
                },
                [t, i],
              ),
              { collapsed: a, toggleCollapsed: o }
            );
          })({ active: f || p }),
          m = g.collapsed,
          h = g.toggleCollapsed,
          y = u.to ? void 0 : '#';
        return (0, c.jsxs)('li', {
          className: (0, a.A)('menu__list-item', { 'menu__list-item--collapsed': m }),
          children: [
            (0, c.jsxs)('div', {
              className: (0, a.A)('menu__list-item-collapsible', {
                'menu__list-item-collapsible--active': f,
              }),
              children: [
                (0, c.jsx)(
                  ve,
                  Object.assign(
                    {
                      role: 'button',
                      className: (0, a.A)(Te, 'menu__link menu__link--sublist', i),
                      href: y,
                    },
                    u,
                    {
                      onClick: function (e) {
                        '#' === y && e.preventDefault(), h();
                      },
                      children: null != (t = u.children) ? t : u.label,
                    },
                  ),
                ),
                (0, c.jsx)(Pe, {
                  collapsed: m,
                  onClick: function (e) {
                    e.preventDefault(), h();
                  },
                }),
              ],
            }),
            (0, c.jsx)(_e.N, {
              lazy: !0,
              as: 'ul',
              className: 'menu__list',
              collapsed: m,
              children: o.map(function (e, t) {
                return (0,
                r.createElement)(at, Object.assign({ mobile: !0, isDropdownItem: !0, onClick: s, activeClassName: 'menu__link--active' }, e, { key: t }));
              }),
            }),
          ],
        });
      }
      var Le = ['items', 'position', 'className', 'onClick'];
      function Ie(e) {
        var t,
          n = e.items,
          o = e.position,
          i = e.className,
          l = (e.onClick, (0, k.A)(e, Le)),
          s = (0, r.useRef)(null),
          u = (0, r.useState)(!1),
          d = u[0],
          f = u[1];
        return (
          (0, r.useEffect)(
            function () {
              var e = function (e) {
                s.current && !s.current.contains(e.target) && f(!1);
              };
              return (
                document.addEventListener('mousedown', e),
                document.addEventListener('touchstart', e),
                document.addEventListener('focusin', e),
                function () {
                  document.removeEventListener('mousedown', e),
                    document.removeEventListener('touchstart', e),
                    document.removeEventListener('focusin', e);
                }
              );
            },
            [s],
          ),
          (0, c.jsxs)('div', {
            ref: s,
            className: (0, a.A)('navbar__item', 'dropdown', 'dropdown--hoverable', {
              'dropdown--right': 'right' === o,
              'dropdown--show': d,
            }),
            children: [
              (0, c.jsx)(
                ve,
                Object.assign(
                  {
                    'aria-haspopup': 'true',
                    'aria-expanded': d,
                    role: 'button',
                    href: l.to ? void 0 : '#',
                    className: (0, a.A)('navbar__link', i),
                  },
                  l,
                  {
                    onClick: l.to
                      ? void 0
                      : function (e) {
                          return e.preventDefault();
                        },
                    onKeyDown: function (e) {
                      ('Enter' !== e.key && ' ' !== e.key) || (e.preventDefault(), f(!d));
                    },
                    children: null != (t = l.children) ? t : l.label,
                  },
                ),
              ),
              (0, c.jsx)('ul', {
                className: 'dropdown__menu',
                children: n.map(function (e, t) {
                  return (0,
                  r.createElement)(at, Object.assign({ isDropdownItem: !0, activeClassName: 'dropdown__link--active' }, e, { key: t }));
                }),
              }),
            ],
          })
        );
      }
      var Fe = ['mobile'];
      function Re(e) {
        var t = e.mobile,
          n = void 0 !== t && t,
          r = (0, k.A)(e, Fe),
          a = n ? je : Ie;
        return (0, c.jsx)(a, Object.assign({}, r));
      }
      var De = n(2233),
        ze = n(3403),
        Me = ['width', 'height'];
      function Be(e) {
        var t = e.width,
          n = void 0 === t ? 20 : t,
          r = e.height,
          a = void 0 === r ? 20 : r,
          o = (0, k.A)(e, Me);
        return (0, c.jsx)(
          'svg',
          Object.assign(
            { viewBox: '0 0 24 24', width: n, height: a, 'aria-hidden': !0 },
            o,
            {
              children: (0, c.jsx)('path', {
                fill: 'currentColor',
                d: 'M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
              }),
            },
          ),
        );
      }
      const $e = 'iconLanguage_gix8';
      var Ue = ['mobile', 'dropdownItemsBefore', 'dropdownItemsAfter', 'queryString'];
      function He() {
        var e = (0, Ce.A)(),
          t = e.siteConfig,
          n = e.i18n.localeConfigs,
          r = (0, De.o)(),
          a = (0, ze.Hl)(function (e) {
            return e.location.search;
          }),
          o = (0, ze.Hl)(function (e) {
            return e.location.hash;
          }),
          i = function (e) {
            var t = n[e];
            if (!t)
              throw new Error('Docusaurus bug, no locale config found for locale=' + e);
            return t;
          };
        return {
          getURL: function (e, n) {
            var l = (0, ze.jy)([a, n.queryString], 'append');
            return (
              '' +
              (function (e) {
                return i(e).url === t.url
                  ? 'pathname://' + r.createUrl({ locale: e, fullyQualified: !1 })
                  : r.createUrl({ locale: e, fullyQualified: !0 });
              })(e) +
              l +
              o
            );
          },
          getLabel: function (e) {
            return i(e).label;
          },
          getLang: function (e) {
            return i(e).htmlLang;
          },
        };
      }
      var Ve = n(5012);
      const We = 'navbarSearchContainer_gTKI';
      function Ge(e) {
        var t = e.children,
          n = e.className;
        return (0, c.jsx)('div', { className: (0, a.A)(n, We), children: t });
      }
      var qe = n(6758),
        Ye = n(720),
        Ke = ['docId', 'label', 'docsPluginId'];
      var Qe = ['sidebarId', 'label', 'docsPluginId'];
      var Ze = ['label', 'to', 'docsPluginId'];
      var Xe = n(4158),
        Je = [
          'mobile',
          'docsPluginId',
          'dropdownActiveClassDisabled',
          'dropdownItemsBefore',
          'dropdownItemsAfter',
          'versions',
        ];
      function et(e) {
        var t = e.docsPluginId,
          n = e.configs;
        return (function (e, t) {
          if (t) {
            var n = new Map(
                e.map(function (e) {
                  return [e.name, e];
                }),
              ),
              r = function (t, r) {
                var a,
                  o = n.get(t);
                if (!o)
                  throw new Error(
                    "No docs version exist for name '" +
                      t +
                      "', please verify your 'docsVersionDropdown' navbar item versions config.\nAvailable version names:\n- " +
                      e
                        .map(function (e) {
                          return '' + e.name;
                        })
                        .join('\n- '),
                  );
                return {
                  version: o,
                  label: null != (a = null == r ? void 0 : r.label) ? a : o.label,
                };
              };
            return Array.isArray(t)
              ? t.map(function (e) {
                  return r(e, void 0);
                })
              : Object.entries(t).map(function (e) {
                  var t = e[0],
                    n = e[1];
                  return r(t, n);
                });
          }
          return e.map(function (e) {
            return { version: e, label: e.label };
          });
        })((0, qe.jh)(t), n);
      }
      function tt(e, t) {
        var n;
        return null != (n = t.alternateDocVersions[e.name])
          ? n
          : (function (e) {
              return e.docs.find(function (t) {
                return t.id === e.mainDocId;
              });
            })(e);
      }
      const nt = {
        default: Ee,
        localeDropdown: function (e) {
          var t = e.mobile,
            n = e.dropdownItemsBefore,
            r = e.dropdownItemsAfter,
            a = e.queryString,
            o = (0, k.A)(e, Ue),
            i = He(),
            l = (0, Ce.A)().i18n,
            u = l.currentLocale,
            d = l.locales.map(function (e) {
              return {
                label: i.getLabel(e),
                lang: i.getLang(e),
                to: i.getURL(e, { queryString: a }),
                target: '_self',
                autoAddBaseUrl: !1,
                className:
                  e === u ? (t ? 'menu__link--active' : 'dropdown__link--active') : '',
              };
            }),
            f = [].concat(n, d, r),
            p = t
              ? (0, s.T)({
                  message: 'Languages',
                  id: 'theme.navbar.mobileLanguageDropdown.label',
                  description: 'The label for the mobile language switcher dropdown',
                })
              : i.getLabel(u);
          return (0, c.jsx)(
            Re,
            Object.assign({}, o, {
              mobile: t,
              label: (0, c.jsxs)(c.Fragment, {
                children: [(0, c.jsx)(Be, { className: $e }), p],
              }),
              items: f,
            }),
          );
        },
        search: function (e) {
          var t = e.mobile,
            n = e.className;
          return t
            ? null
            : (0, c.jsx)(Ge, { className: n, children: (0, c.jsx)(Ve.A, {}) });
        },
        dropdown: Re,
        html: function (e) {
          var t = e.value,
            n = e.className,
            r = e.mobile,
            o = void 0 !== r && r,
            i = e.isDropdownItem,
            l = void 0 !== i && i,
            s = l ? 'li' : 'div';
          return (0, c.jsx)(s, {
            className: (0, a.A)({ navbar__item: !o && !l, 'menu__list-item': o }, n),
            dangerouslySetInnerHTML: { __html: t },
          });
        },
        doc: function (e) {
          var t = e.docId,
            n = e.label,
            r = e.docsPluginId,
            a = (0, k.A)(e, Ke),
            o = (0, qe.zK)(r).activeDoc,
            i = (0, Ye.QB)(t, r),
            l = (null == o ? void 0 : o.path) === (null == i ? void 0 : i.path);
          return null === i || (i.unlisted && !l)
            ? null
            : (0, c.jsx)(
                Ee,
                Object.assign({ exact: !0 }, a, {
                  isActive: function () {
                    return l || (!(null == o || !o.sidebar) && o.sidebar === i.sidebar);
                  },
                  label: null != n ? n : i.id,
                  to: i.path,
                }),
              );
        },
        docSidebar: function (e) {
          var t = e.sidebarId,
            n = e.label,
            r = e.docsPluginId,
            a = (0, k.A)(e, Qe),
            o = (0, qe.zK)(r).activeDoc,
            i = (0, Ye.fW)(t, r).link;
          if (!i)
            throw new Error(
              'DocSidebarNavbarItem: Sidebar with ID "' +
                t +
                '" doesn\'t have anything to be linked to.',
            );
          return (0, c.jsx)(
            Ee,
            Object.assign({ exact: !0 }, a, {
              isActive: function () {
                return (null == o ? void 0 : o.sidebar) === t;
              },
              label: null != n ? n : i.label,
              to: i.path,
            }),
          );
        },
        docsVersion: function (e) {
          var t = e.label,
            n = e.to,
            r = e.docsPluginId,
            a = (0, k.A)(e, Ze),
            o = (0, Ye.Vd)(r)[0],
            i = null != t ? t : o.label,
            l =
              null != n
                ? n
                : (function (e) {
                    return e.docs.find(function (t) {
                      return t.id === e.mainDocId;
                    });
                  })(o).path;
          return (0, c.jsx)(Ee, Object.assign({}, a, { label: i, to: l }));
        },
        docsVersionDropdown: function (e) {
          var t = e.mobile,
            n = e.docsPluginId,
            r = e.dropdownActiveClassDisabled,
            a = e.dropdownItemsBefore,
            o = e.dropdownItemsAfter,
            i = e.versions,
            l = (0, k.A)(e, Je),
            u = (0, ze.Hl)(function (e) {
              return e.location.search;
            }),
            d = (0, ze.Hl)(function (e) {
              return e.location.hash;
            }),
            f = (0, qe.zK)(n),
            p = (0, Xe.g1)(n).savePreferredVersionName,
            g = et({ docsPluginId: n, configs: i }),
            m = (function (e) {
              var t,
                n = e.docsPluginId,
                r = e.versionItems;
              return null !=
                (t = (0, Ye.Vd)(n)
                  .map(function (e) {
                    return r.find(function (t) {
                      return t.version === e;
                    });
                  })
                  .filter(function (e) {
                    return void 0 !== e;
                  })[0])
                ? t
                : r[0];
            })({ docsPluginId: n, versionItems: g }),
            h = [].concat(
              a,
              g.map(function (e) {
                var t = e.version;
                return {
                  label: e.label,
                  to: '' + tt(t, f).path + u + d,
                  isActive: function () {
                    return t === f.activeVersion;
                  },
                  onClick: function () {
                    return p(t.name);
                  },
                };
              }),
              o,
            ),
            y =
              t && h.length > 1
                ? (0, s.T)({
                    id: 'theme.navbar.mobileVersionsDropdown.label',
                    message: 'Versions',
                    description:
                      'The label for the navbar versions dropdown on mobile view',
                  })
                : m.label,
            v = t && h.length > 1 ? void 0 : tt(m.version, f).path;
          return h.length <= 1
            ? (0, c.jsx)(
                Ee,
                Object.assign({}, l, {
                  mobile: t,
                  label: y,
                  to: v,
                  isActive: r
                    ? function () {
                        return !1;
                      }
                    : void 0,
                }),
              )
            : (0, c.jsx)(
                Re,
                Object.assign({}, l, {
                  mobile: t,
                  label: y,
                  to: v,
                  items: h,
                  isActive: r
                    ? function () {
                        return !1;
                      }
                    : void 0,
                }),
              );
        },
      };
      var rt = ['type'];
      function at(e) {
        var t = e.type,
          n = (0, k.A)(e, rt),
          r = (function (e, t) {
            return e && 'default' !== e ? e : 'items' in t ? 'dropdown' : 'default';
          })(t, n),
          a = nt[r];
        if (!a) throw new Error('No NavbarItem component found for type "' + t + '".');
        return (0, c.jsx)(a, Object.assign({}, n));
      }
      function ot() {
        var e = (0, L.M)(),
          t = (0, b.p)().navbar.items;
        return (0, c.jsx)('ul', {
          className: 'menu__list',
          children: t.map(function (t, n) {
            return (0, r.createElement)(
              at,
              Object.assign({ mobile: !0 }, t, {
                onClick: function () {
                  return e.toggle();
                },
                key: n,
              }),
            );
          }),
        });
      }
      function it(e) {
        return (0, c.jsx)(
          'button',
          Object.assign({}, e, {
            type: 'button',
            className: 'clean-btn navbar-sidebar__back',
            children: (0, c.jsx)(s.A, {
              id: 'theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel',
              description:
                'The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)',
              children: '\u2190 Back to main menu',
            }),
          }),
        );
      }
      function lt() {
        var e = 0 === (0, b.p)().navbar.items.length,
          t = B();
        return (0, c.jsxs)(c.Fragment, {
          children: [
            !e &&
              (0, c.jsx)(it, {
                onClick: function () {
                  return t.hide();
                },
              }),
            t.content,
          ],
        });
      }
      function st() {
        var e,
          t = (0, L.M)();
        return (
          void 0 === (e = t.shown) && (e = !0),
          (0, r.useEffect)(
            function () {
              return (
                (document.body.style.overflow = e ? 'hidden' : 'visible'),
                function () {
                  document.body.style.overflow = 'visible';
                }
              );
            },
            [e],
          ),
          t.shouldRender
            ? (0, c.jsx)(U, {
                header: (0, c.jsx)(de, {}),
                primaryMenu: (0, c.jsx)(ot, {}),
                secondaryMenu: (0, c.jsx)(lt, {}),
              })
            : null
        );
      }
      const ut = 'navbarHideable_WOYS',
        ct = 'navbarHidden_wRTR';
      function dt(e) {
        return (0, c.jsx)(
          'div',
          Object.assign({ role: 'presentation' }, e, {
            className: (0, a.A)('navbar-sidebar__backdrop', e.className),
          }),
        );
      }
      function ft(e) {
        var t = e.children,
          n = (0, b.p)().navbar,
          o = n.hideOnScroll,
          i = n.style,
          l = (0, L.M)(),
          d = (function (e) {
            var t = (0, r.useState)(e),
              n = t[0],
              a = t[1],
              o = (0, r.useRef)(!1),
              i = (0, r.useRef)(0),
              l = (0, r.useCallback)(function (e) {
                null !== e && (i.current = e.getBoundingClientRect().height);
              }, []);
            return (
              (0, I.Mq)(function (t, n) {
                var r = t.scrollY;
                if (e)
                  if (r < i.current) a(!0);
                  else if (o.current) o.current = !1;
                  else {
                    var l = null == n ? void 0 : n.scrollY,
                      s = document.documentElement.scrollHeight - i.current,
                      u = window.innerHeight;
                    l && r >= l ? a(!1) : r + u < s && a(!0);
                  }
              }),
              (0, u.$)(function (t) {
                if (e) {
                  var n = t.location.hash;
                  if (n ? document.getElementById(n.substring(1)) : void 0)
                    return (o.current = !0), void a(!1);
                  a(!0);
                }
              }),
              { navbarRef: l, isNavbarVisible: n }
            );
          })(o),
          f = d.navbarRef,
          p = d.isNavbarVisible;
        return (0, c.jsxs)('nav', {
          ref: f,
          'aria-label': (0, s.T)({
            id: 'theme.NavBar.navAriaLabel',
            message: 'Main',
            description: 'The ARIA label for the main navigation',
          }),
          className: (0, a.A)(
            h.G.layout.navbar.container,
            'navbar',
            'navbar--fixed-top',
            o && [ut, !p && ct],
            {
              'navbar--dark': 'dark' === i,
              'navbar--primary': 'primary' === i,
              'navbar-sidebar--show': l.shown,
            },
          ),
          children: [t, (0, c.jsx)(dt, { onClick: l.toggle }), (0, c.jsx)(st, {})],
        });
      }
      var pt = n(2247),
        gt = n(2);
      const mt = 'errorBoundaryError_UWlb';
      function ht(e) {
        return (0, c.jsx)(
          'button',
          Object.assign({ type: 'button' }, e, {
            children: (0, c.jsx)(s.A, {
              id: 'theme.ErrorPageContent.tryAgain',
              description:
                'The label of the button to try again rendering when the React error boundary captures an error',
              children: 'Try again',
            }),
          }),
        );
      }
      function yt(e) {
        var t = e.error,
          n = (0, gt.rA)(t)
            .map(function (e) {
              return e.message;
            })
            .join('\n\nCause:\n');
        return (0, c.jsx)('p', { className: mt, children: n });
      }
      var vt = (function (e) {
        function t() {
          return e.apply(this, arguments) || this;
        }
        (0, pt.A)(t, e);
        var n = t.prototype;
        return (
          (n.componentDidCatch = function (e, t) {
            throw this.props.onError(e, t);
          }),
          (n.render = function () {
            return this.props.children;
          }),
          t
        );
      })(r.Component);
      var bt = ['width', 'height', 'className'];
      function wt(e) {
        var t = e.width,
          n = void 0 === t ? 30 : t,
          r = e.height,
          a = void 0 === r ? 30 : r,
          o = e.className,
          i = (0, k.A)(e, bt);
        return (0, c.jsx)(
          'svg',
          Object.assign(
            {
              className: o,
              width: n,
              height: a,
              viewBox: '0 0 30 30',
              'aria-hidden': 'true',
            },
            i,
            {
              children: (0, c.jsx)('path', {
                stroke: 'currentColor',
                strokeLinecap: 'round',
                strokeMiterlimit: '10',
                strokeWidth: '2',
                d: 'M4 7h22M4 15h22M4 23h22',
              }),
            },
          ),
        );
      }
      function kt() {
        var e = (0, L.M)(),
          t = e.toggle,
          n = e.shown;
        return (0, c.jsx)('button', {
          onClick: t,
          'aria-label': (0, s.T)({
            id: 'theme.docs.sidebar.toggleSidebarButtonAriaLabel',
            message: 'Toggle navigation bar',
            description: 'The ARIA label for hamburger menu button of mobile navigation',
          }),
          'aria-expanded': n,
          className: 'navbar__toggle clean-btn',
          type: 'button',
          children: (0, c.jsx)(wt, {}),
        });
      }
      const St = 'colorModeToggle_nURv';
      function xt(e) {
        var t = e.items;
        return (0, c.jsx)(c.Fragment, {
          children: t.map(function (e, t) {
            return (0, c.jsx)(
              vt,
              {
                onError: function (t) {
                  return new Error(
                    'A theme navbar item failed to render.\nPlease double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:\n' +
                      JSON.stringify(e, null, 2),
                    { cause: t },
                  );
                },
                children: (0, c.jsx)(at, Object.assign({}, e)),
              },
              t,
            );
          }),
        });
      }
      function Et(e) {
        var t = e.left,
          n = e.right;
        return (0, c.jsxs)('div', {
          className: 'navbar__inner',
          children: [
            (0, c.jsx)('div', {
              className: (0, a.A)(h.G.layout.navbar.containerLeft, 'navbar__items'),
              children: t,
            }),
            (0, c.jsx)('div', {
              className: (0, a.A)(
                h.G.layout.navbar.containerRight,
                'navbar__items navbar__items--right',
              ),
              children: n,
            }),
          ],
        });
      }
      function _t() {
        var e = (0, L.M)(),
          t = (0, b.p)().navbar.items,
          n = (function (e) {
            function t(e) {
              var t;
              return 'left' === (null != (t = e.position) ? t : 'right');
            }
            return [
              e.filter(t),
              e.filter(function (e) {
                return !t(e);
              }),
            ];
          })(t),
          r = n[0],
          a = n[1],
          o = t.find(function (e) {
            return 'search' === e.type;
          });
        return (0, c.jsx)(Et, {
          left: (0, c.jsxs)(c.Fragment, {
            children: [
              !e.disabled && (0, c.jsx)(kt, {}),
              (0, c.jsx)(ue, {}),
              (0, c.jsx)(xt, { items: r }),
            ],
          }),
          right: (0, c.jsxs)(c.Fragment, {
            children: [
              (0, c.jsx)(xt, { items: a }),
              (0, c.jsx)(le, { className: St }),
              !o && (0, c.jsx)(Ge, { children: (0, c.jsx)(Ve.A, {}) }),
            ],
          }),
        });
      }
      function At() {
        return (0, c.jsx)(ft, { children: (0, c.jsx)(_t, {}) });
      }
      var Ct = ['to', 'href', 'label', 'prependBaseUrlToHref', 'className'];
      function Tt(e) {
        var t = e.item,
          n = t.to,
          r = t.href,
          o = t.label,
          i = t.prependBaseUrlToHref,
          l = t.className,
          s = (0, k.A)(t, Ct),
          u = (0, pe.Ay)(n),
          d = (0, pe.Ay)(r, { forcePrependBaseUrl: !0 });
        return (0, c.jsxs)(
          fe.A,
          Object.assign(
            { className: (0, a.A)('footer__link-item', l) },
            r ? { href: i ? d : r } : { to: u },
            s,
            { children: [o, r && !(0, ge.A)(r) && (0, c.jsx)(he.A, {})] },
          ),
        );
      }
      function Nt(e) {
        var t,
          n = e.item;
        return n.html
          ? (0, c.jsx)('li', {
              className: (0, a.A)('footer__item', n.className),
              dangerouslySetInnerHTML: { __html: n.html },
            })
          : (0, c.jsx)(
              'li',
              { className: 'footer__item', children: (0, c.jsx)(Tt, { item: n }) },
              null != (t = n.href) ? t : n.to,
            );
      }
      function Ot(e) {
        var t = e.column;
        return (0, c.jsxs)('div', {
          className: (0, a.A)(h.G.layout.footer.column, 'col footer__col', t.className),
          children: [
            (0, c.jsx)('div', { className: 'footer__title', children: t.title }),
            (0, c.jsx)('ul', {
              className: 'footer__items clean-list',
              children: t.items.map(function (e, t) {
                return (0, c.jsx)(Nt, { item: e }, t);
              }),
            }),
          ],
        });
      }
      function Pt(e) {
        var t = e.columns;
        return (0, c.jsx)('div', {
          className: 'row footer__links',
          children: t.map(function (e, t) {
            return (0, c.jsx)(Ot, { column: e }, t);
          }),
        });
      }
      function jt() {
        return (0, c.jsx)('span', {
          className: 'footer__link-separator',
          children: '\xb7',
        });
      }
      function Lt(e) {
        var t = e.item;
        return t.html
          ? (0, c.jsx)('span', {
              className: (0, a.A)('footer__link-item', t.className),
              dangerouslySetInnerHTML: { __html: t.html },
            })
          : (0, c.jsx)(Tt, { item: t });
      }
      function It(e) {
        var t = e.links;
        return (0, c.jsx)('div', {
          className: 'footer__links text--center',
          children: (0, c.jsx)('div', {
            className: 'footer__links',
            children: t.map(function (e, n) {
              return (0,
              c.jsxs)(r.Fragment, { children: [(0, c.jsx)(Lt, { item: e }), t.length !== n + 1 && (0, c.jsx)(jt, {})] }, n);
            }),
          }),
        });
      }
      function Ft(e) {
        var t = e.links;
        return (function (e) {
          return 'title' in e[0];
        })(t)
          ? (0, c.jsx)(Pt, { columns: t })
          : (0, c.jsx)(It, { links: t });
      }
      var Rt = n(5571);
      const Dt = 'footerLogoLink_CMj5';
      function zt(e) {
        var t,
          n = e.logo,
          r = (0, pe.hH)().withBaseUrl,
          o = { light: r(n.src), dark: r(null != (t = n.srcDark) ? t : n.src) };
        return (0, c.jsx)(Rt.A, {
          className: (0, a.A)('footer__logo', n.className),
          alt: n.alt,
          sources: o,
          width: n.width,
          height: n.height,
          style: n.style,
        });
      }
      function Mt(e) {
        var t = e.logo;
        return t.href
          ? (0, c.jsx)(fe.A, {
              href: t.href,
              className: Dt,
              target: t.target,
              children: (0, c.jsx)(zt, { logo: t }),
            })
          : (0, c.jsx)(zt, { logo: t });
      }
      function Bt(e) {
        var t = e.copyright;
        return (0, c.jsx)('div', {
          className: 'footer__copyright',
          dangerouslySetInnerHTML: { __html: t },
        });
      }
      function $t(e) {
        var t = e.style,
          n = e.links,
          r = e.logo,
          o = e.copyright;
        return (0, c.jsx)('footer', {
          className: (0, a.A)(h.G.layout.footer.container, 'footer', {
            'footer--dark': 'dark' === t,
          }),
          children: (0, c.jsxs)('div', {
            className: 'container container-fluid',
            children: [
              n,
              (r || o) &&
                (0, c.jsxs)('div', {
                  className: 'footer__bottom text--center',
                  children: [
                    r &&
                      (0, c.jsx)('div', { className: 'margin-bottom--sm', children: r }),
                    o,
                  ],
                }),
            ],
          }),
        });
      }
      function Ut() {
        var e = (0, b.p)().footer;
        if (!e) return null;
        var t = e.copyright,
          n = e.links,
          r = e.logo,
          a = e.style;
        return (0, c.jsx)($t, {
          style: a,
          links: n && n.length > 0 && (0, c.jsx)(Ft, { links: n }),
          logo: r && (0, c.jsx)(Mt, { logo: r }),
          copyright: t && (0, c.jsx)(Bt, { copyright: t }),
        });
      }
      const Ht = r.memo(Ut);
      var Vt = (0, F.fM)([
        H.a,
        w.o,
        I.Tv,
        Xe.VQ,
        i.Jx,
        function (e) {
          var t = e.children;
          return (0, c.jsx)(R.y_, {
            children: (0, c.jsx)(L.e, { children: (0, c.jsx)(z, { children: t }) }),
          });
        },
      ]);
      function Wt(e) {
        var t = e.children;
        return (0, c.jsx)(Vt, { children: t });
      }
      var Gt = n(7074);
      function qt(e) {
        var t = e.error,
          n = e.tryAgain;
        return (0, c.jsx)('main', {
          className: 'container margin-vert--xl',
          children: (0, c.jsx)('div', {
            className: 'row',
            children: (0, c.jsxs)('div', {
              className: 'col col--6 col--offset-3',
              children: [
                (0, c.jsx)(Gt.A, {
                  as: 'h1',
                  className: 'hero__title',
                  children: (0, c.jsx)(s.A, {
                    id: 'theme.ErrorPageContent.title',
                    description: 'The title of the fallback page when the page crashed',
                    children: 'This page crashed.',
                  }),
                }),
                (0, c.jsx)('div', {
                  className: 'margin-vert--lg',
                  children: (0, c.jsx)(ht, {
                    onClick: n,
                    className: 'button button--primary shadow--lw',
                  }),
                }),
                (0, c.jsx)('hr', {}),
                (0, c.jsx)('div', {
                  className: 'margin-vert--md',
                  children: (0, c.jsx)(yt, { error: t }),
                }),
              ],
            }),
          }),
        });
      }
      const Yt = 'mainWrapper_IZXf';
      function Kt(e) {
        var t = e.children,
          n = e.noFooter,
          r = e.wrapperClassName,
          l = e.title,
          s = e.description;
        return (0, c.jsxs)(Wt, {
          children: [
            (0, c.jsx)(i.be, { title: l, description: s }),
            (0, c.jsx)(v, {}),
            (0, c.jsx)(j, {}),
            (0, c.jsx)(At, {}),
            (0, c.jsx)('div', {
              id: d,
              className: (0, a.A)(h.G.layout.main.container, h.G.wrapper.main, Yt, r),
              children: (0, c.jsx)(o.A, {
                fallback: function (e) {
                  return (0, c.jsx)(qt, Object.assign({}, e));
                },
                children: t,
              }),
            }),
            !n && (0, c.jsx)(Ht, {}),
          ],
        });
      }
    },
    7091(e, t, n) {
      'use strict';
      n.d(t, { A: () => f });
      var r = n(1463),
        a = (n(2503), n(4740)),
        o = n(975),
        i = n(8364),
        l = n(5660),
        s = n(5571),
        u = n(159),
        c = ['imageClassName', 'titleClassName'];
      function d(e) {
        var t = e.logo,
          n = e.alt,
          r = e.imageClassName,
          a = { light: (0, o.Ay)(t.src), dark: (0, o.Ay)(t.srcDark || t.src) },
          i = (0, u.jsx)(s.A, {
            className: t.className,
            sources: a,
            height: t.height,
            width: t.width,
            alt: n,
            style: t.style,
          });
        return r ? (0, u.jsx)('div', { className: r, children: i }) : i;
      }
      function f(e) {
        var t,
          n = (0, i.A)().siteConfig.title,
          s = (0, l.p)().navbar,
          f = s.title,
          p = s.logo,
          g = e.imageClassName,
          m = e.titleClassName,
          h = (0, r.A)(e, c),
          y = (0, o.Ay)((null == p ? void 0 : p.href) || '/'),
          v = f ? '' : n,
          b = null != (t = null == p ? void 0 : p.alt) ? t : v;
        return (0, u.jsxs)(
          a.A,
          Object.assign(
            { to: y },
            h,
            (null == p ? void 0 : p.target) && { target: p.target },
            {
              children: [
                p && (0, u.jsx)(d, { logo: p, alt: b, imageClassName: g }),
                null != f && (0, u.jsx)('b', { className: m, children: f }),
              ],
            },
          ),
        );
      }
    },
    1817(e, t, n) {
      'use strict';
      n.d(t, { A: () => o });
      n(2503);
      var r = n(466),
        a = n(159);
      function o(e) {
        var t = e.locale,
          n = e.version,
          o = e.tag,
          i = t;
        return (0, a.jsxs)(r.A, {
          children: [
            t && (0, a.jsx)('meta', { name: 'docusaurus_locale', content: t }),
            n && (0, a.jsx)('meta', { name: 'docusaurus_version', content: n }),
            o && (0, a.jsx)('meta', { name: 'docusaurus_tag', content: o }),
            i && (0, a.jsx)('meta', { name: 'docsearch:language', content: i }),
            n && (0, a.jsx)('meta', { name: 'docsearch:version', content: n }),
            o && (0, a.jsx)('meta', { name: 'docsearch:docusaurus_tag', content: o }),
          ],
        });
      }
    },
    5571(e, t, n) {
      'use strict';
      n.d(t, { A: () => f });
      var r = n(1463),
        a = n(2503),
        o = n(3526),
        i = n(3573),
        l = n(3939);
      const s = {
        themedComponent: 'themedComponent_BJnz',
        'themedComponent--light': 'themedComponent--light_ZEj2',
        'themedComponent--dark': 'themedComponent--dark_z6s7',
      };
      var u = n(159);
      function c(e) {
        var t = e.className,
          n = e.children,
          r = (0, i.A)(),
          c = (0, l.G)().colorMode;
        return (0, u.jsx)(u.Fragment, {
          children: (r ? ('dark' === c ? ['dark'] : ['light']) : ['light', 'dark']).map(
            function (e) {
              var r = n({
                theme: e,
                className: (0, o.A)(t, s.themedComponent, s['themedComponent--' + e]),
              });
              return (0, u.jsx)(a.Fragment, { children: r }, e);
            },
          ),
        });
      }
      var d = ['sources', 'className', 'alt'];
      function f(e) {
        var t = e.sources,
          n = e.className,
          a = e.alt,
          o = (0, r.A)(e, d);
        return (0, u.jsx)(c, {
          className: n,
          children: function (e) {
            var n = e.theme,
              r = e.className;
            return (0, u.jsx)(
              'img',
              Object.assign({ src: t[n], alt: a, className: r }, o),
            );
          },
        });
      }
    },
    6120(e, t, n) {
      'use strict';
      n.d(t, { N: () => y, u: () => c });
      var r = n(1463),
        a = n(2503),
        o = n(9127),
        i = n(4011),
        l = n(159),
        s = ['collapsed'],
        u = ['lazy'];
      function c(e) {
        var t = e.initialState,
          n = (0, a.useState)(null != t && t),
          r = n[0],
          o = n[1],
          i = (0, a.useCallback)(function () {
            o(function (e) {
              return !e;
            });
          }, []);
        return { collapsed: r, setCollapsed: o, toggleCollapsed: i };
      }
      var d = { display: 'none', overflow: 'hidden', height: '0px' },
        f = { display: 'block', overflow: 'visible', height: 'auto' };
      function p(e, t) {
        var n = t ? d : f;
        (e.style.display = n.display),
          (e.style.overflow = n.overflow),
          (e.style.height = n.height);
      }
      function g(e) {
        var t = e.collapsibleRef,
          n = e.collapsed,
          r = e.animation,
          o = (0, a.useRef)(!1);
        (0, a.useEffect)(
          function () {
            var e,
              a = t.current;
            function l() {
              var e,
                t,
                n = a.scrollHeight,
                o =
                  null != (e = null == r ? void 0 : r.duration)
                    ? e
                    : (function (e) {
                        if ((0, i.O)()) return 1;
                        var t = e / 36;
                        return Math.round(10 * (4 + 15 * Math.pow(t, 0.25) + t / 5));
                      })(n);
              return {
                transition:
                  'height ' +
                  o +
                  'ms ' +
                  (null != (t = null == r ? void 0 : r.easing) ? t : 'ease-in-out'),
                height: n + 'px',
              };
            }
            function s() {
              var e = l();
              (a.style.transition = e.transition), (a.style.height = e.height);
            }
            if (!o.current) return p(a, n), void (o.current = !0);
            return (
              (a.style.willChange = 'height'),
              (e = requestAnimationFrame(function () {
                n
                  ? (s(),
                    requestAnimationFrame(function () {
                      (a.style.height = d.height), (a.style.overflow = d.overflow);
                    }))
                  : ((a.style.display = 'block'),
                    requestAnimationFrame(function () {
                      s();
                    }));
              })),
              function () {
                return cancelAnimationFrame(e);
              }
            );
          },
          [t, n, r],
        );
      }
      function m(e) {
        var t = e.as,
          n = void 0 === t ? 'div' : t,
          r = e.collapsed,
          o = e.children,
          i = e.animation,
          s = e.onCollapseTransitionEnd,
          u = e.className,
          c = (0, a.useRef)(null);
        return (
          g({ collapsibleRef: c, collapsed: r, animation: i }),
          (0, l.jsx)(n, {
            ref: c,
            onTransitionEnd: function (e) {
              'height' === e.propertyName && (p(c.current, r), null == s || s(r));
            },
            className: u,
            children: o,
          })
        );
      }
      function h(e) {
        var t = e.collapsed,
          n = (0, r.A)(e, s),
          i = (0, a.useState)(!t),
          u = i[0],
          c = i[1],
          d = (0, a.useState)(t),
          f = d[0],
          p = d[1];
        return (
          (0, o.A)(
            function () {
              t || c(!0);
            },
            [t],
          ),
          (0, o.A)(
            function () {
              u && p(t);
            },
            [u, t],
          ),
          u ? (0, l.jsx)(m, Object.assign({}, n, { collapsed: f })) : null
        );
      }
      function y(e) {
        var t = e.lazy,
          n = (0, r.A)(e, u),
          a = t ? h : m;
        return (0, l.jsx)(a, Object.assign({}, n));
      }
    },
    8507(e, t, n) {
      'use strict';
      n.d(t, { M: () => m, o: () => g });
      var r = n(2503),
        a = n(3573),
        o = n(5093),
        i = n(6348),
        l = n(5660),
        s = n(159),
        u = (0, o.Wf)('docusaurus.announcement.dismiss'),
        c = (0, o.Wf)('docusaurus.announcement.id'),
        d = function () {
          return 'true' === u.get();
        },
        f = function (e) {
          return u.set(String(e));
        },
        p = r.createContext(null);
      function g(e) {
        var t = e.children,
          n = (function () {
            var e = (0, l.p)().announcementBar,
              t = (0, a.A)(),
              n = (0, r.useState)(function () {
                return !!t && d();
              }),
              o = n[0],
              i = n[1];
            (0, r.useEffect)(function () {
              i(d());
            }, []);
            var s = (0, r.useCallback)(function () {
              f(!0), i(!0);
            }, []);
            return (
              (0, r.useEffect)(
                function () {
                  if (e) {
                    var t = e.id,
                      n = c.get();
                    'annoucement-bar' === n && (n = 'announcement-bar');
                    var r = t !== n;
                    c.set(t), r && f(!1), (!r && d()) || i(!1);
                  }
                },
                [e],
              ),
              (0, r.useMemo)(
                function () {
                  return { isActive: !!e && !o, close: s };
                },
                [e, o, s],
              )
            );
          })();
        return (0, s.jsx)(p.Provider, { value: n, children: t });
      }
      function m() {
        var e = (0, r.useContext)(p);
        if (!e) throw new i.dV('AnnouncementBarProvider');
        return e;
      }
    },
    3939(e, t, n) {
      'use strict';
      n.d(t, { G: () => S, a: () => k });
      var r = n(2503),
        a = n(3573),
        o = n(6348),
        i = n(5093),
        l = n(5660),
        s = n(159);
      function u() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      function c(e) {
        return (
          (t = '(prefers-color-scheme: dark)'),
          (n = function () {
            return e(u());
          }),
          (r = window.matchMedia(t)).addEventListener('change', n),
          function () {
            return r.removeEventListener('change', n);
          }
        );
        var t, n, r;
      }
      var d = r.createContext(void 0),
        f = (0, i.Wf)('theme'),
        p = 'system',
        g = function (e) {
          return 'dark' === e ? 'dark' : 'light';
        },
        m = function (e) {
          return null === e || e === p ? null : g(e);
        },
        h = function () {
          return g(document.documentElement.getAttribute('data-theme'));
        },
        y = function (e) {
          document.documentElement.setAttribute('data-theme', g(e));
        },
        v = function () {
          return m(document.documentElement.getAttribute('data-theme-choice'));
        },
        b = function (e) {
          var t;
          document.documentElement.setAttribute(
            'data-theme-choice',
            null != (t = m(e)) ? t : p,
          );
        };
      function w() {
        var e = (0, l.p)().colorMode,
          t = e.defaultMode,
          n = e.disableSwitch,
          o = e.respectPrefersColorScheme,
          i = (function () {
            var e = (0, l.p)().colorMode.defaultMode,
              t = (0, a.A)(),
              n = (0, r.useState)(t ? h() : e),
              o = n[0],
              i = n[1],
              s = (0, r.useState)(t ? v() : null),
              u = s[0],
              c = s[1];
            return (
              (0, r.useEffect)(function () {
                i(h()), c(v());
              }, []),
              {
                colorMode: o,
                setColorModeState: i,
                colorModeChoice: u,
                setColorModeChoiceState: c,
              }
            );
          })(),
          s = i.colorMode,
          d = i.setColorModeState,
          p = i.colorModeChoice,
          w = i.setColorModeChoiceState;
        (0, r.useEffect)(
          function () {
            n && f.del();
          },
          [n],
        );
        var k = (0, r.useCallback)(
          function (e, n) {
            void 0 === n && (n = {});
            var r = n.persist,
              a = void 0 === r || r;
            if (null === e) {
              var i = o ? u() : t;
              y(i), d(i), b(null), w(null);
            } else y(e), b(e), d(e), w(e);
            a &&
              (function (e) {
                null === e ? f.del() : f.set(g(e));
              })(e);
          },
          [d, w, o, t],
        );
        return (
          (0, r.useEffect)(
            function () {
              return f.listen(function (e) {
                k(m(e.newValue));
              });
            },
            [k],
          ),
          (0, r.useEffect)(
            function () {
              if (null === p && o)
                return c(function (e) {
                  d(e), y(e);
                });
            },
            [o, p, d],
          ),
          (0, r.useMemo)(
            function () {
              return {
                colorMode: s,
                colorModeChoice: p,
                setColorMode: k,
                get isDarkTheme() {
                  return 'dark' === s;
                },
                setLightTheme: function () {
                  k('light');
                },
                setDarkTheme: function () {
                  k('dark');
                },
              };
            },
            [s, p, k],
          )
        );
      }
      function k(e) {
        var t = e.children,
          n = w();
        return (0, s.jsx)(d.Provider, { value: n, children: t });
      }
      function S() {
        var e = (0, r.useContext)(d);
        if (null == e)
          throw new o.dV(
            'ColorModeProvider',
            'Please see https://docusaurus.io/docs/api/themes/configuration#use-color-mode.',
          );
        return e;
      }
    },
    3019(e, t, n) {
      'use strict';
      n.d(t, { M: () => g, e: () => p });
      var r = n(2503),
        a = n(6550),
        o = n(9927),
        i = n(3403),
        l = n(5660),
        s = n(6348),
        u = n(159),
        c = r.createContext(void 0);
      function d() {
        var e,
          t = ((e = (0, a.YL)()), 0 === (0, l.p)().navbar.items.length && !e.component),
          n = (0, o.l)(),
          i = !t && 'mobile' === n,
          s = (0, r.useState)(!1),
          u = s[0],
          c = s[1],
          d = (0, r.useCallback)(function () {
            c(function (e) {
              return !e;
            });
          }, []);
        return (
          (0, r.useEffect)(
            function () {
              'desktop' === n && c(!1);
            },
            [n],
          ),
          (0, r.useMemo)(
            function () {
              return { disabled: t, shouldRender: i, toggle: d, shown: u };
            },
            [t, i, d, u],
          )
        );
      }
      function f(e) {
        var t = e.handler;
        return (0, i.$Z)(t), null;
      }
      function p(e) {
        var t = e.children,
          n = d();
        return (0, u.jsxs)(u.Fragment, {
          children: [
            n.shown &&
              (0, u.jsx)(f, {
                handler: function () {
                  return n.toggle(), !1;
                },
              }),
            (0, u.jsx)(c.Provider, { value: n, children: t }),
          ],
        });
      }
      function g() {
        var e = r.useContext(c);
        if (void 0 === e) throw new s.dV('NavbarMobileSidebarProvider');
        return e;
      }
    },
    6550(e, t, n) {
      'use strict';
      n.d(t, { GX: () => u, YL: () => s, y_: () => l });
      var r = n(2503),
        a = n(6348),
        o = n(159),
        i = r.createContext(null);
      function l(e) {
        var t = e.children,
          n = (0, r.useState)({ component: null, props: null });
        return (0, o.jsx)(i.Provider, { value: n, children: t });
      }
      function s() {
        var e = (0, r.useContext)(i);
        if (!e) throw new a.dV('NavbarSecondaryMenuContentProvider');
        return e[0];
      }
      function u(e) {
        var t = e.component,
          n = e.props,
          o = (0, r.useContext)(i);
        if (!o) throw new a.dV('NavbarSecondaryMenuContentProvider');
        var l = o[1],
          s = (0, a.Be)(n);
        return (
          (0, r.useEffect)(
            function () {
              l({ component: t, props: s });
            },
            [l, t, s],
          ),
          (0, r.useEffect)(
            function () {
              return function () {
                return l({ component: null, props: null });
              };
            },
            [l],
          ),
          null
        );
      }
    },
    9927(e, t, n) {
      'use strict';
      n.d(t, { l: () => l });
      var r = n(2503),
        a = n(8299),
        o = 'desktop',
        i = 'mobile';
      function l(e) {
        var t = (void 0 === e ? {} : e).desktopBreakpoint,
          n = void 0 === t ? 996 : t,
          l = (0, r.useState)(function () {
            return 'ssr';
          }),
          s = l[0],
          u = l[1];
        return (
          (0, r.useEffect)(
            function () {
              function e() {
                u(
                  (function (e) {
                    if (!a.A.canUseDOM)
                      throw new Error(
                        'getWindowSize() should only be called after React hydration',
                      );
                    return window.innerWidth > e ? o : i;
                  })(n),
                );
              }
              return (
                e(),
                window.addEventListener('resize', e),
                function () {
                  window.removeEventListener('resize', e);
                }
              );
            },
            [n],
          ),
          s
        );
      }
    },
    8941(e, t, n) {
      'use strict';
      n.d(t, { G: () => r });
      var r = {
        page: {
          blogListPage: 'blog-list-page',
          blogPostPage: 'blog-post-page',
          blogTagsListPage: 'blog-tags-list-page',
          blogTagPostListPage: 'blog-tags-post-list-page',
          blogAuthorsListPage: 'blog-authors-list-page',
          blogAuthorsPostsPage: 'blog-authors-posts-page',
          docsDocPage: 'docs-doc-page',
          docsTagsListPage: 'docs-tags-list-page',
          docsTagDocListPage: 'docs-tags-doc-list-page',
          mdxPage: 'mdx-page',
        },
        wrapper: {
          main: 'main-wrapper',
          blogPages: 'blog-wrapper',
          docsPages: 'docs-wrapper',
          mdxPages: 'mdx-wrapper',
        },
        common: {
          editThisPage: 'theme-edit-this-page',
          lastUpdated: 'theme-last-updated',
          backToTopButton: 'theme-back-to-top-button',
          codeBlock: 'theme-code-block',
          admonition: 'theme-admonition',
          unlistedBanner: 'theme-unlisted-banner',
          draftBanner: 'theme-draft-banner',
          admonitionType: function (e) {
            return 'theme-admonition-' + e;
          },
        },
        announcementBar: { container: 'theme-announcement-bar' },
        tabs: { container: 'theme-tabs-container' },
        layout: {
          navbar: {
            container: 'theme-layout-navbar',
            containerLeft: 'theme-layout-navbar-left',
            containerRight: 'theme-layout-navbar-right',
            mobileSidebar: {
              container: 'theme-layout-navbar-sidebar',
              panel: 'theme-layout-navbar-sidebar-panel',
            },
          },
          main: { container: 'theme-layout-main' },
          footer: {
            container: 'theme-layout-footer',
            column: 'theme-layout-footer-column',
          },
        },
        docs: {
          docVersionBanner: 'theme-doc-version-banner',
          docVersionBadge: 'theme-doc-version-badge',
          docBreadcrumbs: 'theme-doc-breadcrumbs',
          docMarkdown: 'theme-doc-markdown',
          docTocMobile: 'theme-doc-toc-mobile',
          docTocDesktop: 'theme-doc-toc-desktop',
          docFooter: 'theme-doc-footer',
          docFooterTagsRow: 'theme-doc-footer-tags-row',
          docFooterEditMetaRow: 'theme-doc-footer-edit-meta-row',
          docSidebarContainer: 'theme-doc-sidebar-container',
          docSidebarMenu: 'theme-doc-sidebar-menu',
          docSidebarItemCategory: 'theme-doc-sidebar-item-category',
          docSidebarItemLink: 'theme-doc-sidebar-item-link',
          docSidebarItemCategoryLevel: function (e) {
            return 'theme-doc-sidebar-item-category-level-' + e;
          },
          docSidebarItemLinkLevel: function (e) {
            return 'theme-doc-sidebar-item-link-level-' + e;
          },
          docCard: {
            container: 'theme-doc-card-container',
            heading: 'theme-doc-card-heading',
            icon: 'theme-doc-card-icon',
            title: 'theme-doc-card-title',
            description: 'theme-doc-card-description',
          },
        },
        blog: {
          blogFooterTagsRow: 'theme-blog-footer-tags-row',
          blogFooterEditMetaRow: 'theme-blog-footer-edit-meta-row',
        },
        pages: { pageFooterEditMetaRow: 'theme-pages-footer-edit-meta-row' },
      };
    },
    4011(e, t, n) {
      'use strict';
      function r() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      n.d(t, { O: () => r });
    },
    2147(e, t, n) {
      'use strict';
      n.d(t, { v: () => i });
      var r = n(5660);
      const a = 'anchorTargetStickyNavbar_Jy20',
        o = 'anchorTargetHideOnScrollNavbar_IObu';
      function i(e) {
        var t = (0, r.p)().navbar.hideOnScroll;
        if (void 0 !== e) return t ? o : a;
      }
    },
    3403(e, t, n) {
      'use strict';
      n.d(t, { $Z: () => l, Hl: () => s, jy: () => u });
      var r = n(3961),
        a = n(2503),
        o = n(8266),
        i = n(6348);
      function l(e) {
        !(function (e) {
          var t = (0, o.W6)(),
            n = (0, i._q)(e);
          (0, a.useEffect)(
            function () {
              return t.block(function (e, t) {
                return n(e, t);
              });
            },
            [t, n],
          );
        })(function (t, n) {
          if ('POP' === n) return e(t, n);
        });
      }
      function s(e) {
        var t = (0, o.W6)();
        return (0, a.useSyncExternalStore)(
          t.listen,
          function () {
            return e(t);
          },
          function () {
            return e(
              Object.assign({}, t, {
                location: Object.assign({}, t.location, {
                  search: '',
                  hash: '',
                  state: void 0,
                }),
              }),
            );
          },
        );
      }
      function u(e, t) {
        var n = (function (e, t) {
            for (var n, a = new URLSearchParams(), o = (0, r.A)(e); !(n = o()).done; )
              for (var i, l = n.value, s = (0, r.A)(l.entries()); !(i = s()).done; ) {
                var u = i.value,
                  c = u[0],
                  d = u[1];
                'append' === t ? a.append(c, d) : a.set(c, d);
              }
            return a;
          })(
            e.map(function (e) {
              return new URLSearchParams(null != e ? e : '');
            }),
            t,
          ),
          a = n.toString();
        return a ? '?' + a : a;
      }
    },
    2594(e, t, n) {
      'use strict';
      n.d(t, { Jx: () => y, be: () => g, e3: () => h });
      var r = n(2503),
        a = n(3526),
        o = n(466),
        i = n(9917),
        l = n(975),
        s = n(2801),
        u = n(159);
      function c(e) {
        var t = e.title,
          n = (0, s.s$)().format(t);
        return (0, u.jsxs)(o.A, {
          children: [
            (0, u.jsx)('title', { children: n }),
            (0, u.jsx)('meta', { property: 'og:title', content: n }),
          ],
        });
      }
      function d(e) {
        var t = e.description;
        return (0, u.jsxs)(o.A, {
          children: [
            (0, u.jsx)('meta', { name: 'description', content: t }),
            (0, u.jsx)('meta', { property: 'og:description', content: t }),
          ],
        });
      }
      function f(e) {
        var t = e.image,
          n = (0, (0, l.hH)().withBaseUrl)(t, { absolute: !0 });
        return (0, u.jsxs)(o.A, {
          children: [
            (0, u.jsx)('meta', { property: 'og:image', content: n }),
            (0, u.jsx)('meta', { name: 'twitter:image', content: n }),
          ],
        });
      }
      function p(e) {
        var t = e.keywords;
        return (0, u.jsx)(o.A, {
          children: (0, u.jsx)('meta', {
            name: 'keywords',
            content: Array.isArray(t) ? t.join(',') : t,
          }),
        });
      }
      function g(e) {
        var t = e.title,
          n = e.description,
          r = e.keywords,
          a = e.image,
          i = e.children;
        return (0, u.jsxs)(u.Fragment, {
          children: [
            t && (0, u.jsx)(c, { title: t }),
            n && (0, u.jsx)(d, { description: n }),
            r && (0, u.jsx)(p, { keywords: r }),
            a && (0, u.jsx)(f, { image: a }),
            i && (0, u.jsx)(o.A, { children: i }),
          ],
        });
      }
      var m = r.createContext(void 0);
      function h(e) {
        var t = e.className,
          n = e.children,
          i = r.useContext(m),
          l = (0, a.A)(i, t);
        return (0, u.jsxs)(m.Provider, {
          value: l,
          children: [
            (0, u.jsx)(o.A, { children: (0, u.jsx)('html', { className: l }) }),
            n,
          ],
        });
      }
      function y(e) {
        var t = e.children,
          n = (0, i.A)(),
          r =
            'plugin-' +
            n.plugin.name.replace(/docusaurus-(?:plugin|theme)-(?:content-)?/gi, ''),
          o = 'plugin-id-' + n.plugin.id;
        return (0, u.jsx)(h, { className: (0, a.A)(r, o), children: t });
      }
    },
    6348(e, t, n) {
      'use strict';
      n.d(t, { dV: () => g, fM: () => h, _q: () => f, ZC: () => p, Be: () => m });
      var r = n(2670),
        a = n(2247);
      function o(e) {
        return (
          (o = Object.setPrototypeOf
            ? Object.getPrototypeOf.bind()
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              }),
          o(e)
        );
      }
      var i = n(5250);
      function l() {
        try {
          var e = !Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {}),
          );
        } catch (e) {}
        return (l = function () {
          return !!e;
        })();
      }
      function s(e) {
        var t = 'function' == typeof Map ? new Map() : void 0;
        return (
          (s = function (e) {
            if (
              null === e ||
              !(function (e) {
                try {
                  return -1 !== Function.toString.call(e).indexOf('[native code]');
                } catch (t) {
                  return 'function' == typeof e;
                }
              })(e)
            )
              return e;
            if ('function' != typeof e)
              throw new TypeError('Super expression must either be null or a function');
            if (void 0 !== t) {
              if (t.has(e)) return t.get(e);
              t.set(e, n);
            }
            function n() {
              return (function (e, t, n) {
                if (l()) return Reflect.construct.apply(null, arguments);
                var r = [null];
                r.push.apply(r, t);
                var a = new (e.bind.apply(e, r))();
                return n && (0, i.A)(a, n.prototype), a;
              })(e, arguments, o(this).constructor);
            }
            return (
              (n.prototype = Object.create(e.prototype, {
                constructor: { value: n, enumerable: !1, writable: !0, configurable: !0 },
              })),
              (0, i.A)(n, e)
            );
          }),
          s(e)
        );
      }
      var u = n(2503),
        c = n(9127),
        d = n(159);
      function f(e) {
        var t = (0, u.useRef)(e);
        return (
          (0, c.A)(
            function () {
              t.current = e;
            },
            [e],
          ),
          (0, u.useCallback)(function () {
            return t.current.apply(t, arguments);
          }, [])
        );
      }
      function p(e) {
        var t = (0, u.useRef)(void 0);
        return (
          (0, c.A)(function () {
            t.current = e;
          }),
          t.current
        );
      }
      var g = (function (e) {
        function t(t, n) {
          var a, o, i;
          return (
            ((i = e.call(this) || this).name = 'ReactContextError'),
            (i.message =
              'Hook ' +
              (null !=
              (a =
                null == (o = i.stack) ||
                null == (o = o.split('\n')[1]) ||
                null == (o = o.match((0, r.A)(/at (?:\w+\.)?(\w+)/, { name: 1 })))
                  ? void 0
                  : o.groups.name)
                ? a
                : '') +
              ' is called outside the <' +
              t +
              '>. ' +
              (null != n ? n : '')),
            i
          );
        }
        return (0, a.A)(t, e), t;
      })(s(Error));
      function m(e) {
        var t = Object.entries(e);
        return (
          t.sort(function (e, t) {
            return e[0].localeCompare(t[0]);
          }),
          (0, u.useMemo)(function () {
            return e;
          }, t.flat())
        );
      }
      function h(e) {
        return function (t) {
          var n = t.children;
          return (0, d.jsx)(d.Fragment, {
            children: e.reduceRight(function (e, t) {
              return (0, d.jsx)(t, { children: e });
            }, n),
          });
        };
      }
    },
    979(e, t, n) {
      'use strict';
      n.d(t, { Dt: () => l, ys: () => i });
      var r = n(2503),
        a = n(3151),
        o = n(8364);
      function i(e, t) {
        var n = function (e) {
          var t;
          return null == (t = !e || e.endsWith('/') ? e : e + '/')
            ? void 0
            : t.toLowerCase();
        };
        return n(e) === n(t);
      }
      function l() {
        var e = (0, o.A)().siteConfig.baseUrl;
        return (0, r.useMemo)(
          function () {
            return (function (e) {
              var t = e.baseUrl;
              function n(e) {
                return e.path === t && !0 === e.exact;
              }
              function r(e) {
                return e.path === t && !e.exact;
              }
              return (function e(t) {
                if (0 !== t.length)
                  return (
                    t.find(n) ||
                    e(
                      t.filter(r).flatMap(function (e) {
                        var t;
                        return null != (t = e.routes) ? t : [];
                      }),
                    )
                  );
              })(e.routes);
            })({ routes: a.A, baseUrl: e });
          },
          [e],
        );
      }
    },
    8614(e, t, n) {
      'use strict';
      n.d(t, { Mq: () => f, Tv: () => u, gk: () => p });
      var r = n(2503),
        a = n(8299),
        o = n(3573),
        i = (n(9127), n(6348)),
        l = n(159);
      var s = r.createContext(void 0);
      function u(e) {
        var t,
          n = e.children,
          a =
            ((t = (0, r.useRef)(!0)),
            (0, r.useMemo)(function () {
              return {
                scrollEventsEnabledRef: t,
                enableScrollEvents: function () {
                  t.current = !0;
                },
                disableScrollEvents: function () {
                  t.current = !1;
                },
              };
            }, []));
        return (0, l.jsx)(s.Provider, { value: a, children: n });
      }
      function c() {
        var e = (0, r.useContext)(s);
        if (null == e) throw new i.dV('ScrollControllerProvider');
        return e;
      }
      var d = function () {
        return a.A.canUseDOM
          ? { scrollX: window.pageXOffset, scrollY: window.pageYOffset }
          : null;
      };
      function f(e, t) {
        void 0 === t && (t = []);
        var n = c().scrollEventsEnabledRef,
          a = (0, r.useRef)(d()),
          o = (0, i._q)(e);
        (0, r.useEffect)(function () {
          var e = function () {
              if (n.current) {
                var e = d();
                o(e, a.current), (a.current = e);
              }
            },
            t = { passive: !0 };
          return (
            e(),
            window.addEventListener('scroll', e, t),
            function () {
              return window.removeEventListener('scroll', e, t);
            }
          );
        }, [o, n].concat(t));
      }
      function p() {
        var e = (0, r.useRef)(null),
          t =
            (0, o.A)() &&
            'smooth' === getComputedStyle(document.documentElement).scrollBehavior;
        return {
          startScroll: function (n) {
            e.current = t
              ? (function (e) {
                  return window.scrollTo({ top: e, behavior: 'smooth' }), function () {};
                })(n)
              : (function (e) {
                  var t = null,
                    n = document.documentElement.scrollTop > e;
                  return (
                    (function r() {
                      var a = document.documentElement.scrollTop;
                      ((n && a > e) || (!n && a < e)) &&
                        ((t = requestAnimationFrame(r)),
                        window.scrollTo(0, Math.floor(0.85 * (a - e)) + e));
                    })(),
                    function () {
                      return t && cancelAnimationFrame(t);
                    }
                  );
                })(n);
          },
          cancelScroll: function () {
            return null == e.current ? void 0 : e.current();
          },
        };
      }
    },
    5093(e, t, n) {
      'use strict';
      n.d(t, { Wf: () => u });
      n(2503);
      const r = JSON.parse('{"N":"localStorage","M":""}');
      var a = r.N;
      function o(e) {
        var t = e.key,
          n = e.oldValue,
          r = e.newValue,
          a = e.storage;
        if (n !== r) {
          var o = document.createEvent('StorageEvent');
          o.initStorageEvent('storage', !1, !1, t, n, r, window.location.href, a),
            window.dispatchEvent(o);
        }
      }
      function i(e) {
        if ((void 0 === e && (e = a), 'undefined' == typeof window))
          throw new Error(
            'Browser storage is not available on Node.js/Docusaurus SSR process.',
          );
        if ('none' === e) return null;
        try {
          return window[e];
        } catch (n) {
          return (
            (t = n),
            l ||
              (console.warn(
                'Docusaurus browser storage is not available.\nPossible reasons: running Docusaurus in an iframe, in an incognito browser session, or using too strict browser privacy settings.',
                t,
              ),
              (l = !0)),
            null
          );
        }
        var t;
      }
      var l = !1;
      var s = {
        get: function () {
          return null;
        },
        set: function () {},
        del: function () {},
        listen: function () {
          return function () {};
        },
      };
      function u(e, t) {
        var n = '' + e + r.M;
        if ('undefined' == typeof window)
          return (function (e) {
            function t() {
              throw new Error(
                'Illegal storage API usage for storage key "' +
                  e +
                  '".\nDocusaurus storage APIs are not supposed to be called on the server-rendering process.\nPlease only call storage APIs in effects and event handlers.',
              );
            }
            return { get: t, set: t, del: t, listen: t };
          })(n);
        var a = i(null == t ? void 0 : t.persistence);
        return null === a
          ? s
          : {
              get: function () {
                try {
                  return a.getItem(n);
                } catch (e) {
                  return (
                    console.error("Docusaurus storage error, can't get key=" + n, e), null
                  );
                }
              },
              set: function (e) {
                try {
                  var t = a.getItem(n);
                  a.setItem(n, e), o({ key: n, oldValue: t, newValue: e, storage: a });
                } catch (r) {
                  console.error("Docusaurus storage error, can't set " + n + '=' + e, r);
                }
              },
              del: function () {
                try {
                  var e = a.getItem(n);
                  a.removeItem(n), o({ key: n, oldValue: e, newValue: null, storage: a });
                } catch (t) {
                  console.error("Docusaurus storage error, can't delete key=" + n, t);
                }
              },
              listen: function (e) {
                try {
                  var t = function (t) {
                    t.storageArea === a && t.key === n && e(t);
                  };
                  return (
                    window.addEventListener('storage', t),
                    function () {
                      return window.removeEventListener('storage', t);
                    }
                  );
                } catch (r) {
                  return (
                    console.error(
                      "Docusaurus storage error, can't listen for changes of key=" + n,
                      r,
                    ),
                    function () {}
                  );
                }
              },
            };
      }
    },
    2801(e, t, n) {
      'use strict';
      n.d(t, { AL: () => c, s$: () => d });
      var r = n(2503),
        a = n(8364),
        o = n(9917),
        i = n(6348),
        l = n(159),
        s = function (e) {
          var t = e.title,
            n = e.siteTitle,
            r = e.titleDelimiter,
            a = null == t ? void 0 : t.trim();
          return a && a !== n ? a + ' ' + r + ' ' + n : n;
        },
        u = (0, r.createContext)(null);
      function c(e) {
        var t = e.formatter,
          n = e.children;
        return (0, l.jsx)(u.Provider, { value: t, children: n });
      }
      function d() {
        var e = (function () {
            var e = (0, r.useContext)(u);
            if (null === e) throw new i.dV('TitleFormatterProvider');
            return e;
          })(),
          t = (0, a.A)().siteConfig,
          n = t.title,
          l = t.titleDelimiter,
          c = (0, o.A)().plugin;
        return {
          format: function (t) {
            return e({
              title: t,
              siteTitle: n,
              titleDelimiter: l,
              plugin: c,
              defaultFormatter: s,
            });
          },
        };
      }
    },
    2233(e, t, n) {
      'use strict';
      n.d(t, { o: () => i });
      var r = n(8364),
        a = n(8266),
        o = n(2);
      function i() {
        var e = (0, r.A)(),
          t = e.siteConfig,
          n = t.baseUrl,
          i = t.trailingSlash,
          l = e.i18n.localeConfigs,
          s = (0, a.zy)().pathname,
          u = (0, o.Ks)(s, { trailingSlash: i, baseUrl: n }).replace(n, '');
        return {
          createUrl: function (e) {
            var t = e.locale,
              n = e.fullyQualified,
              r = (function (e) {
                var t = l[e];
                if (!t)
                  throw new Error(
                    'Unexpected Docusaurus bug, no locale config found for locale=' + e,
                  );
                return t;
              })(t);
            return '' + ('' + (n ? r.url : '')) + r.baseUrl + u;
          },
        };
      }
    },
    7752(e, t, n) {
      'use strict';
      n.d(t, { $: () => i });
      var r = n(2503),
        a = n(8266),
        o = n(6348);
      function i(e) {
        var t = (0, a.zy)(),
          n = (0, o.ZC)(t),
          i = (0, o._q)(e);
        (0, r.useEffect)(
          function () {
            n && t !== n && i({ location: t, previousLocation: n });
          },
          [i, t, n],
        );
      }
    },
    5660(e, t, n) {
      'use strict';
      n.d(t, { p: () => a });
      var r = n(8364);
      function a() {
        return (0, r.A)().siteConfig.themeConfig;
      }
    },
    1373(e, t, n) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.addTrailingSlash = a),
        (t.default = function (e, t) {
          var n = t.trailingSlash,
            r = t.baseUrl;
          if (e.startsWith('#')) return e;
          if (void 0 === n) return e;
          var i = e.split(/[#?]/)[0],
            l = '/' === i || i === r ? i : ((s = i), (u = n), u ? a(s) : o(s));
          var s, u;
          return e.replace(i, l);
        }),
        (t.addLeadingSlash = function (e) {
          return (0, r.addPrefix)(e, '/');
        }),
        (t.removeTrailingSlash = o);
      var r = n(8848);
      function a(e) {
        return e.endsWith('/') ? e : e + '/';
      }
      function o(e) {
        return (0, r.removeSuffix)(e, '/');
      }
    },
    2755(e, t) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.getErrorCausalChain = function e(t) {
          if (t.cause) return [t].concat(e(t.cause));
          return [t];
        });
    },
    2(e, t, n) {
      'use strict';
      t.rA = t.Ks = void 0;
      var r = n(4429);
      var a = n(1373);
      Object.defineProperty(t, 'Ks', {
        enumerable: !0,
        get: function () {
          return r.__importDefault(a).default;
        },
      });
      var o = n(8848);
      var i = n(2755);
      Object.defineProperty(t, 'rA', {
        enumerable: !0,
        get: function () {
          return i.getErrorCausalChain;
        },
      });
    },
    8848(e, t) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.addPrefix = function (e, t) {
          return e.startsWith(t) ? e : '' + t + e;
        }),
        (t.removeSuffix = function (e, t) {
          if ('' === t) return e;
          return e.endsWith(t) ? e.slice(0, -t.length) : e;
        }),
        (t.addSuffix = function (e, t) {
          return e.endsWith(t) ? e : '' + e + t;
        }),
        (t.removePrefix = function (e, t) {
          return e.startsWith(t) ? e.slice(t.length) : e;
        });
    },
    3332(e, t, n) {
      'use strict';
      n.d(t, { zR: () => w, TM: () => A, yJ: () => p, sC: () => T, AO: () => f });
      var r = n(8820);
      function a(e) {
        return '/' === e.charAt(0);
      }
      function o(e, t) {
        for (var n = t, r = n + 1, a = e.length; r < a; n += 1, r += 1) e[n] = e[r];
        e.pop();
      }
      const i = function (e, t) {
        void 0 === t && (t = '');
        var n,
          r = (e && e.split('/')) || [],
          i = (t && t.split('/')) || [],
          l = e && a(e),
          s = t && a(t),
          u = l || s;
        if ((e && a(e) ? (i = r) : r.length && (i.pop(), (i = i.concat(r))), !i.length))
          return '/';
        if (i.length) {
          var c = i[i.length - 1];
          n = '.' === c || '..' === c || '' === c;
        } else n = !1;
        for (var d = 0, f = i.length; f >= 0; f--) {
          var p = i[f];
          '.' === p ? o(i, f) : '..' === p ? (o(i, f), d++) : d && (o(i, f), d--);
        }
        if (!u) for (; d--; d) i.unshift('..');
        !u || '' === i[0] || (i[0] && a(i[0])) || i.unshift('');
        var g = i.join('/');
        return n && '/' !== g.substr(-1) && (g += '/'), g;
      };
      var l = n(5385);
      function s(e) {
        return '/' === e.charAt(0) ? e : '/' + e;
      }
      function u(e) {
        return '/' === e.charAt(0) ? e.substr(1) : e;
      }
      function c(e, t) {
        return (function (e, t) {
          return (
            0 === e.toLowerCase().indexOf(t.toLowerCase()) &&
            -1 !== '/?#'.indexOf(e.charAt(t.length))
          );
        })(e, t)
          ? e.substr(t.length)
          : e;
      }
      function d(e) {
        return '/' === e.charAt(e.length - 1) ? e.slice(0, -1) : e;
      }
      function f(e) {
        var t = e.pathname,
          n = e.search,
          r = e.hash,
          a = t || '/';
        return (
          n && '?' !== n && (a += '?' === n.charAt(0) ? n : '?' + n),
          r && '#' !== r && (a += '#' === r.charAt(0) ? r : '#' + r),
          a
        );
      }
      function p(e, t, n, a) {
        var o;
        'string' == typeof e
          ? ((o = (function (e) {
              var t = e || '/',
                n = '',
                r = '',
                a = t.indexOf('#');
              -1 !== a && ((r = t.substr(a)), (t = t.substr(0, a)));
              var o = t.indexOf('?');
              return (
                -1 !== o && ((n = t.substr(o)), (t = t.substr(0, o))),
                { pathname: t, search: '?' === n ? '' : n, hash: '#' === r ? '' : r }
              );
            })(e)),
            (o.state = t))
          : (void 0 === (o = (0, r.A)({}, e)).pathname && (o.pathname = ''),
            o.search
              ? '?' !== o.search.charAt(0) && (o.search = '?' + o.search)
              : (o.search = ''),
            o.hash ? '#' !== o.hash.charAt(0) && (o.hash = '#' + o.hash) : (o.hash = ''),
            void 0 !== t && void 0 === o.state && (o.state = t));
        try {
          o.pathname = decodeURI(o.pathname);
        } catch (l) {
          throw l instanceof URIError
            ? new URIError(
                'Pathname "' +
                  o.pathname +
                  '" could not be decoded. This is likely caused by an invalid percent-encoding.',
              )
            : l;
        }
        return (
          n && (o.key = n),
          a
            ? o.pathname
              ? '/' !== o.pathname.charAt(0) && (o.pathname = i(o.pathname, a.pathname))
              : (o.pathname = a.pathname)
            : o.pathname || (o.pathname = '/'),
          o
        );
      }
      function g() {
        var e = null;
        var t = [];
        return {
          setPrompt: function (t) {
            return (
              (e = t),
              function () {
                e === t && (e = null);
              }
            );
          },
          confirmTransitionTo: function (t, n, r, a) {
            if (null != e) {
              var o = 'function' == typeof e ? e(t, n) : e;
              'string' == typeof o
                ? 'function' == typeof r
                  ? r(o, a)
                  : a(!0)
                : a(!1 !== o);
            } else a(!0);
          },
          appendListener: function (e) {
            var n = !0;
            function r() {
              n && e.apply(void 0, arguments);
            }
            return (
              t.push(r),
              function () {
                (n = !1),
                  (t = t.filter(function (e) {
                    return e !== r;
                  }));
              }
            );
          },
          notifyListeners: function () {
            for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
              n[r] = arguments[r];
            t.forEach(function (e) {
              return e.apply(void 0, n);
            });
          },
        };
      }
      var m = !(
        'undefined' == typeof window ||
        !window.document ||
        !window.document.createElement
      );
      function h(e, t) {
        t(window.confirm(e));
      }
      var y = 'popstate',
        v = 'hashchange';
      function b() {
        try {
          return window.history.state || {};
        } catch (e) {
          return {};
        }
      }
      function w(e) {
        void 0 === e && (e = {}), m || (0, l.A)(!1);
        var t,
          n = window.history,
          a =
            ((-1 === (t = window.navigator.userAgent).indexOf('Android 2.') &&
              -1 === t.indexOf('Android 4.0')) ||
              -1 === t.indexOf('Mobile Safari') ||
              -1 !== t.indexOf('Chrome') ||
              -1 !== t.indexOf('Windows Phone')) &&
            window.history &&
            'pushState' in window.history,
          o = !(-1 === window.navigator.userAgent.indexOf('Trident')),
          i = e,
          u = i.forceRefresh,
          w = void 0 !== u && u,
          k = i.getUserConfirmation,
          S = void 0 === k ? h : k,
          x = i.keyLength,
          E = void 0 === x ? 6 : x,
          _ = e.basename ? d(s(e.basename)) : '';
        function A(e) {
          var t = e || {},
            n = t.key,
            r = t.state,
            a = window.location,
            o = a.pathname + a.search + a.hash;
          return _ && (o = c(o, _)), p(o, r, n);
        }
        function C() {
          return Math.random().toString(36).substr(2, E);
        }
        var T = g();
        function N(e) {
          (0, r.A)($, e), ($.length = n.length), T.notifyListeners($.location, $.action);
        }
        function O(e) {
          (function (e) {
            return void 0 === e.state && -1 === navigator.userAgent.indexOf('CriOS');
          })(e) || L(A(e.state));
        }
        function P() {
          L(A(b()));
        }
        var j = !1;
        function L(e) {
          if (j) (j = !1), N();
          else {
            T.confirmTransitionTo(e, 'POP', S, function (t) {
              t
                ? N({ action: 'POP', location: e })
                : (function (e) {
                    var t = $.location,
                      n = F.indexOf(t.key);
                    -1 === n && (n = 0);
                    var r = F.indexOf(e.key);
                    -1 === r && (r = 0);
                    var a = n - r;
                    a && ((j = !0), D(a));
                  })(e);
            });
          }
        }
        var I = A(b()),
          F = [I.key];
        function R(e) {
          return _ + f(e);
        }
        function D(e) {
          n.go(e);
        }
        var z = 0;
        function M(e) {
          1 === (z += e) && 1 === e
            ? (window.addEventListener(y, O), o && window.addEventListener(v, P))
            : 0 === z &&
              (window.removeEventListener(y, O), o && window.removeEventListener(v, P));
        }
        var B = !1;
        var $ = {
          length: n.length,
          action: 'POP',
          location: I,
          createHref: R,
          push: function (e, t) {
            var r = 'PUSH',
              o = p(e, t, C(), $.location);
            T.confirmTransitionTo(o, r, S, function (e) {
              if (e) {
                var t = R(o),
                  i = o.key,
                  l = o.state;
                if (a)
                  if ((n.pushState({ key: i, state: l }, null, t), w))
                    window.location.href = t;
                  else {
                    var s = F.indexOf($.location.key),
                      u = F.slice(0, s + 1);
                    u.push(o.key), (F = u), N({ action: r, location: o });
                  }
                else window.location.href = t;
              }
            });
          },
          replace: function (e, t) {
            var r = 'REPLACE',
              o = p(e, t, C(), $.location);
            T.confirmTransitionTo(o, r, S, function (e) {
              if (e) {
                var t = R(o),
                  i = o.key,
                  l = o.state;
                if (a)
                  if ((n.replaceState({ key: i, state: l }, null, t), w))
                    window.location.replace(t);
                  else {
                    var s = F.indexOf($.location.key);
                    -1 !== s && (F[s] = o.key), N({ action: r, location: o });
                  }
                else window.location.replace(t);
              }
            });
          },
          go: D,
          goBack: function () {
            D(-1);
          },
          goForward: function () {
            D(1);
          },
          block: function (e) {
            void 0 === e && (e = !1);
            var t = T.setPrompt(e);
            return (
              B || (M(1), (B = !0)),
              function () {
                return B && ((B = !1), M(-1)), t();
              }
            );
          },
          listen: function (e) {
            var t = T.appendListener(e);
            return (
              M(1),
              function () {
                M(-1), t();
              }
            );
          },
        };
        return $;
      }
      var k = 'hashchange',
        S = {
          hashbang: {
            encodePath: function (e) {
              return '!' === e.charAt(0) ? e : '!/' + u(e);
            },
            decodePath: function (e) {
              return '!' === e.charAt(0) ? e.substr(1) : e;
            },
          },
          noslash: { encodePath: u, decodePath: s },
          slash: { encodePath: s, decodePath: s },
        };
      function x(e) {
        var t = e.indexOf('#');
        return -1 === t ? e : e.slice(0, t);
      }
      function E() {
        var e = window.location.href,
          t = e.indexOf('#');
        return -1 === t ? '' : e.substring(t + 1);
      }
      function _(e) {
        window.location.replace(x(window.location.href) + '#' + e);
      }
      function A(e) {
        void 0 === e && (e = {}), m || (0, l.A)(!1);
        var t = window.history,
          n = (window.navigator.userAgent.indexOf('Firefox'), e),
          a = n.getUserConfirmation,
          o = void 0 === a ? h : a,
          i = n.hashType,
          u = void 0 === i ? 'slash' : i,
          y = e.basename ? d(s(e.basename)) : '',
          v = S[u],
          b = v.encodePath,
          w = v.decodePath;
        function A() {
          var e = w(E());
          return y && (e = c(e, y)), p(e);
        }
        var C = g();
        function T(e) {
          (0, r.A)(B, e), (B.length = t.length), C.notifyListeners(B.location, B.action);
        }
        var N = !1,
          O = null;
        function P() {
          var e,
            t,
            n = E(),
            r = b(n);
          if (n !== r) _(r);
          else {
            var a = A(),
              i = B.location;
            if (
              !N &&
              ((t = a),
              (e = i).pathname === t.pathname &&
                e.search === t.search &&
                e.hash === t.hash)
            )
              return;
            if (O === f(a)) return;
            (O = null),
              (function (e) {
                if (N) (N = !1), T();
                else {
                  var t = 'POP';
                  C.confirmTransitionTo(e, t, o, function (n) {
                    n
                      ? T({ action: t, location: e })
                      : (function (e) {
                          var t = B.location,
                            n = F.lastIndexOf(f(t));
                          -1 === n && (n = 0);
                          var r = F.lastIndexOf(f(e));
                          -1 === r && (r = 0);
                          var a = n - r;
                          a && ((N = !0), R(a));
                        })(e);
                  });
                }
              })(a);
          }
        }
        var j = E(),
          L = b(j);
        j !== L && _(L);
        var I = A(),
          F = [f(I)];
        function R(e) {
          t.go(e);
        }
        var D = 0;
        function z(e) {
          1 === (D += e) && 1 === e
            ? window.addEventListener(k, P)
            : 0 === D && window.removeEventListener(k, P);
        }
        var M = !1;
        var B = {
          length: t.length,
          action: 'POP',
          location: I,
          createHref: function (e) {
            var t = document.querySelector('base'),
              n = '';
            return (
              t && t.getAttribute('href') && (n = x(window.location.href)),
              n + '#' + b(y + f(e))
            );
          },
          push: function (e, t) {
            var n = 'PUSH',
              r = p(e, void 0, void 0, B.location);
            C.confirmTransitionTo(r, n, o, function (e) {
              if (e) {
                var t = f(r),
                  a = b(y + t);
                if (E() !== a) {
                  (O = t),
                    (function (e) {
                      window.location.hash = e;
                    })(a);
                  var o = F.lastIndexOf(f(B.location)),
                    i = F.slice(0, o + 1);
                  i.push(t), (F = i), T({ action: n, location: r });
                } else T();
              }
            });
          },
          replace: function (e, t) {
            var n = 'REPLACE',
              r = p(e, void 0, void 0, B.location);
            C.confirmTransitionTo(r, n, o, function (e) {
              if (e) {
                var t = f(r),
                  a = b(y + t);
                E() !== a && ((O = t), _(a));
                var o = F.indexOf(f(B.location));
                -1 !== o && (F[o] = t), T({ action: n, location: r });
              }
            });
          },
          go: R,
          goBack: function () {
            R(-1);
          },
          goForward: function () {
            R(1);
          },
          block: function (e) {
            void 0 === e && (e = !1);
            var t = C.setPrompt(e);
            return (
              M || (z(1), (M = !0)),
              function () {
                return M && ((M = !1), z(-1)), t();
              }
            );
          },
          listen: function (e) {
            var t = C.appendListener(e);
            return (
              z(1),
              function () {
                z(-1), t();
              }
            );
          },
        };
        return B;
      }
      function C(e, t, n) {
        return Math.min(Math.max(e, t), n);
      }
      function T(e) {
        void 0 === e && (e = {});
        var t = e,
          n = t.getUserConfirmation,
          a = t.initialEntries,
          o = void 0 === a ? ['/'] : a,
          i = t.initialIndex,
          l = void 0 === i ? 0 : i,
          s = t.keyLength,
          u = void 0 === s ? 6 : s,
          c = g();
        function d(e) {
          (0, r.A)(w, e),
            (w.length = w.entries.length),
            c.notifyListeners(w.location, w.action);
        }
        function m() {
          return Math.random().toString(36).substr(2, u);
        }
        var h = C(l, 0, o.length - 1),
          y = o.map(function (e) {
            return p(e, void 0, 'string' == typeof e ? m() : e.key || m());
          }),
          v = f;
        function b(e) {
          var t = C(w.index + e, 0, w.entries.length - 1),
            r = w.entries[t];
          c.confirmTransitionTo(r, 'POP', n, function (e) {
            e ? d({ action: 'POP', location: r, index: t }) : d();
          });
        }
        var w = {
          length: y.length,
          action: 'POP',
          location: y[h],
          index: h,
          entries: y,
          createHref: v,
          push: function (e, t) {
            var r = 'PUSH',
              a = p(e, t, m(), w.location);
            c.confirmTransitionTo(a, r, n, function (e) {
              if (e) {
                var t = w.index + 1,
                  n = w.entries.slice(0);
                n.length > t ? n.splice(t, n.length - t, a) : n.push(a),
                  d({ action: r, location: a, index: t, entries: n });
              }
            });
          },
          replace: function (e, t) {
            var r = 'REPLACE',
              a = p(e, t, m(), w.location);
            c.confirmTransitionTo(a, r, n, function (e) {
              e && ((w.entries[w.index] = a), d({ action: r, location: a }));
            });
          },
          go: b,
          goBack: function () {
            b(-1);
          },
          goForward: function () {
            b(1);
          },
          canGo: function (e) {
            var t = w.index + e;
            return t >= 0 && t < w.entries.length;
          },
          block: function (e) {
            return void 0 === e && (e = !1), c.setPrompt(e);
          },
          listen: function (e) {
            return c.appendListener(e);
          },
        };
        return w;
      }
    },
    5526(e) {
      e.exports =
        Array.isArray ||
        function (e) {
          return '[object Array]' == Object.prototype.toString.call(e);
        };
    },
    8744(e, t, n) {
      var r, a;
      (r = function () {
        var e,
          t,
          n = { version: '0.2.0' },
          r = (n.settings = {
            minimum: 0.08,
            easing: 'ease',
            positionUsing: '',
            speed: 200,
            trickle: !0,
            trickleRate: 0.02,
            trickleSpeed: 800,
            showSpinner: !0,
            barSelector: '[role="bar"]',
            spinnerSelector: '[role="spinner"]',
            parent: 'body',
            template:
              '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
          });
        function a(e, t, n) {
          return e < t ? t : e > n ? n : e;
        }
        function o(e) {
          return 100 * (-1 + e);
        }
        function i(e, t, n) {
          var a;
          return (
            ((a =
              'translate3d' === r.positionUsing
                ? { transform: 'translate3d(' + o(e) + '%,0,0)' }
                : 'translate' === r.positionUsing
                ? { transform: 'translate(' + o(e) + '%,0)' }
                : { 'margin-left': o(e) + '%' }).transition = 'all ' + t + 'ms ' + n),
            a
          );
        }
        (n.configure = function (e) {
          var t, n;
          for (t in e) void 0 !== (n = e[t]) && e.hasOwnProperty(t) && (r[t] = n);
          return this;
        }),
          (n.status = null),
          (n.set = function (e) {
            var t = n.isStarted();
            (e = a(e, r.minimum, 1)), (n.status = 1 === e ? null : e);
            var o = n.render(!t),
              u = o.querySelector(r.barSelector),
              c = r.speed,
              d = r.easing;
            return (
              o.offsetWidth,
              l(function (t) {
                '' === r.positionUsing && (r.positionUsing = n.getPositioningCSS()),
                  s(u, i(e, c, d)),
                  1 === e
                    ? (s(o, { transition: 'none', opacity: 1 }),
                      o.offsetWidth,
                      setTimeout(function () {
                        s(o, { transition: 'all ' + c + 'ms linear', opacity: 0 }),
                          setTimeout(function () {
                            n.remove(), t();
                          }, c);
                      }, c))
                    : setTimeout(t, c);
              }),
              this
            );
          }),
          (n.isStarted = function () {
            return 'number' == typeof n.status;
          }),
          (n.start = function () {
            n.status || n.set(0);
            var e = function () {
              setTimeout(function () {
                n.status && (n.trickle(), e());
              }, r.trickleSpeed);
            };
            return r.trickle && e(), this;
          }),
          (n.done = function (e) {
            return e || n.status ? n.inc(0.3 + 0.5 * Math.random()).set(1) : this;
          }),
          (n.inc = function (e) {
            var t = n.status;
            return t
              ? ('number' != typeof e && (e = (1 - t) * a(Math.random() * t, 0.1, 0.95)),
                (t = a(t + e, 0, 0.994)),
                n.set(t))
              : n.start();
          }),
          (n.trickle = function () {
            return n.inc(Math.random() * r.trickleRate);
          }),
          (e = 0),
          (t = 0),
          (n.promise = function (r) {
            return r && 'resolved' !== r.state()
              ? (0 === t && n.start(),
                e++,
                t++,
                r.always(function () {
                  0 === --t ? ((e = 0), n.done()) : n.set((e - t) / e);
                }),
                this)
              : this;
          }),
          (n.render = function (e) {
            if (n.isRendered()) return document.getElementById('nprogress');
            c(document.documentElement, 'nprogress-busy');
            var t = document.createElement('div');
            (t.id = 'nprogress'), (t.innerHTML = r.template);
            var a,
              i = t.querySelector(r.barSelector),
              l = e ? '-100' : o(n.status || 0),
              u = document.querySelector(r.parent);
            return (
              s(i, {
                transition: 'all 0 linear',
                transform: 'translate3d(' + l + '%,0,0)',
              }),
              r.showSpinner || ((a = t.querySelector(r.spinnerSelector)) && p(a)),
              u != document.body && c(u, 'nprogress-custom-parent'),
              u.appendChild(t),
              t
            );
          }),
          (n.remove = function () {
            d(document.documentElement, 'nprogress-busy'),
              d(document.querySelector(r.parent), 'nprogress-custom-parent');
            var e = document.getElementById('nprogress');
            e && p(e);
          }),
          (n.isRendered = function () {
            return !!document.getElementById('nprogress');
          }),
          (n.getPositioningCSS = function () {
            var e = document.body.style,
              t =
                'WebkitTransform' in e
                  ? 'Webkit'
                  : 'MozTransform' in e
                  ? 'Moz'
                  : 'msTransform' in e
                  ? 'ms'
                  : 'OTransform' in e
                  ? 'O'
                  : '';
            return t + 'Perspective' in e
              ? 'translate3d'
              : t + 'Transform' in e
              ? 'translate'
              : 'margin';
          });
        var l = (function () {
            var e = [];
            function t() {
              var n = e.shift();
              n && n(t);
            }
            return function (n) {
              e.push(n), 1 == e.length && t();
            };
          })(),
          s = (function () {
            var e = ['Webkit', 'O', 'Moz', 'ms'],
              t = {};
            function n(e) {
              return e.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function (e, t) {
                return t.toUpperCase();
              });
            }
            function r(t) {
              var n = document.body.style;
              if (t in n) return t;
              for (var r, a = e.length, o = t.charAt(0).toUpperCase() + t.slice(1); a--; )
                if ((r = e[a] + o) in n) return r;
              return t;
            }
            function a(e) {
              return (e = n(e)), t[e] || (t[e] = r(e));
            }
            function o(e, t, n) {
              (t = a(t)), (e.style[t] = n);
            }
            return function (e, t) {
              var n,
                r,
                a = arguments;
              if (2 == a.length)
                for (n in t) void 0 !== (r = t[n]) && t.hasOwnProperty(n) && o(e, n, r);
              else o(e, a[1], a[2]);
            };
          })();
        function u(e, t) {
          return ('string' == typeof e ? e : f(e)).indexOf(' ' + t + ' ') >= 0;
        }
        function c(e, t) {
          var n = f(e),
            r = n + t;
          u(n, t) || (e.className = r.substring(1));
        }
        function d(e, t) {
          var n,
            r = f(e);
          u(e, t) &&
            ((n = r.replace(' ' + t + ' ', ' ')),
            (e.className = n.substring(1, n.length - 1)));
        }
        function f(e) {
          return (' ' + (e.className || '') + ' ').replace(/\s+/gi, ' ');
        }
        function p(e) {
          e && e.parentNode && e.parentNode.removeChild(e);
        }
        return n;
      }),
        void 0 === (a = 'function' == typeof r ? r.call(t, n, t, e) : r) ||
          (e.exports = a);
    },
    4785(e, t, n) {
      var r = n(5526);
      (e.exports = m),
        (e.exports.parse = o),
        (e.exports.compile = function (e, t) {
          return u(o(e, t), t);
        }),
        (e.exports.tokensToFunction = u),
        (e.exports.tokensToRegExp = g);
      var a = new RegExp(
        [
          '(\\\\.)',
          '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))',
        ].join('|'),
        'g',
      );
      function o(e, t) {
        for (
          var n, r = [], o = 0, l = 0, s = '', u = (t && t.delimiter) || '/';
          null != (n = a.exec(e));

        ) {
          var c = n[0],
            f = n[1],
            p = n.index;
          if (((s += e.slice(l, p)), (l = p + c.length), f)) s += f[1];
          else {
            var g = e[l],
              m = n[2],
              h = n[3],
              y = n[4],
              v = n[5],
              b = n[6],
              w = n[7];
            s && (r.push(s), (s = ''));
            var k = null != m && null != g && g !== m,
              S = '+' === b || '*' === b,
              x = '?' === b || '*' === b,
              E = m || u,
              _ = y || v,
              A = m || ('string' == typeof r[r.length - 1] ? r[r.length - 1] : '');
            r.push({
              name: h || o++,
              prefix: m || '',
              delimiter: E,
              optional: x,
              repeat: S,
              partial: k,
              asterisk: !!w,
              pattern: _ ? d(_) : w ? '.*' : i(E, A),
            });
          }
        }
        return l < e.length && (s += e.substr(l)), s && r.push(s), r;
      }
      function i(e, t) {
        return !t || t.indexOf(e) > -1
          ? '[^' + c(e) + ']+?'
          : c(t) + '|(?:(?!' + c(t) + ')[^' + c(e) + '])+?';
      }
      function l(e) {
        return encodeURI(e).replace(/[\/?#]/g, function (e) {
          return '%' + e.charCodeAt(0).toString(16).toUpperCase();
        });
      }
      function s(e) {
        return encodeURI(e).replace(/[?#]/g, function (e) {
          return '%' + e.charCodeAt(0).toString(16).toUpperCase();
        });
      }
      function u(e, t) {
        for (var n = new Array(e.length), a = 0; a < e.length; a++)
          'object' == typeof e[a] &&
            (n[a] = new RegExp('^(?:' + e[a].pattern + ')$', p(t)));
        return function (t, a) {
          for (
            var o = '', i = t || {}, u = (a || {}).pretty ? l : encodeURIComponent, c = 0;
            c < e.length;
            c++
          ) {
            var d = e[c];
            if ('string' != typeof d) {
              var f,
                p = i[d.name];
              if (null == p) {
                if (d.optional) {
                  d.partial && (o += d.prefix);
                  continue;
                }
                throw new TypeError('Expected "' + d.name + '" to be defined');
              }
              if (r(p)) {
                if (!d.repeat)
                  throw new TypeError(
                    'Expected "' +
                      d.name +
                      '" to not repeat, but received `' +
                      JSON.stringify(p) +
                      '`',
                  );
                if (0 === p.length) {
                  if (d.optional) continue;
                  throw new TypeError('Expected "' + d.name + '" to not be empty');
                }
                for (var g = 0; g < p.length; g++) {
                  if (((f = u(p[g])), !n[c].test(f)))
                    throw new TypeError(
                      'Expected all "' +
                        d.name +
                        '" to match "' +
                        d.pattern +
                        '", but received `' +
                        JSON.stringify(f) +
                        '`',
                    );
                  o += (0 === g ? d.prefix : d.delimiter) + f;
                }
              } else {
                if (((f = d.asterisk ? s(p) : u(p)), !n[c].test(f)))
                  throw new TypeError(
                    'Expected "' +
                      d.name +
                      '" to match "' +
                      d.pattern +
                      '", but received "' +
                      f +
                      '"',
                  );
                o += d.prefix + f;
              }
            } else o += d;
          }
          return o;
        };
      }
      function c(e) {
        return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
      }
      function d(e) {
        return e.replace(/([=!:$\/()])/g, '\\$1');
      }
      function f(e, t) {
        return (e.keys = t), e;
      }
      function p(e) {
        return e && e.sensitive ? '' : 'i';
      }
      function g(e, t, n) {
        r(t) || ((n = t || n), (t = []));
        for (
          var a = (n = n || {}).strict, o = !1 !== n.end, i = '', l = 0;
          l < e.length;
          l++
        ) {
          var s = e[l];
          if ('string' == typeof s) i += c(s);
          else {
            var u = c(s.prefix),
              d = '(?:' + s.pattern + ')';
            t.push(s),
              s.repeat && (d += '(?:' + u + d + ')*'),
              (i += d =
                s.optional
                  ? s.partial
                    ? u + '(' + d + ')?'
                    : '(?:' + u + '(' + d + '))?'
                  : u + '(' + d + ')');
          }
        }
        var g = c(n.delimiter || '/'),
          m = i.slice(-g.length) === g;
        return (
          a || (i = (m ? i.slice(0, -g.length) : i) + '(?:' + g + '(?=$))?'),
          (i += o ? '$' : a && m ? '' : '(?=' + g + '|$)'),
          f(new RegExp('^' + i, p(n)), t)
        );
      }
      function m(e, t, n) {
        return (
          r(t) || ((n = t || n), (t = [])),
          (n = n || {}),
          e instanceof RegExp
            ? (function (e, t) {
                var n = e.source.match(/\((?!\?)/g);
                if (n)
                  for (var r = 0; r < n.length; r++)
                    t.push({
                      name: r,
                      prefix: null,
                      delimiter: null,
                      optional: !1,
                      repeat: !1,
                      partial: !1,
                      asterisk: !1,
                      pattern: null,
                    });
                return f(e, t);
              })(e, t)
            : r(e)
            ? (function (e, t, n) {
                for (var r = [], a = 0; a < e.length; a++) r.push(m(e[a], t, n).source);
                return f(new RegExp('(?:' + r.join('|') + ')', p(n)), t);
              })(e, t, n)
            : (function (e, t, n) {
                return g(o(e, n), t, n);
              })(e, t, n)
        );
      }
    },
    1022() {
      !(function (e) {
        var t =
            '\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b',
          n = {
            pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
            lookbehind: !0,
            alias: 'punctuation',
            inside: null,
          },
          r = {
            bash: n,
            environment: { pattern: RegExp('\\$' + t), alias: 'constant' },
            variable: [
              {
                pattern: /\$?\(\([\s\S]+?\)\)/,
                greedy: !0,
                inside: {
                  variable: [
                    { pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 },
                    /^\$\(\(/,
                  ],
                  number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
                  operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
                  punctuation: /\(\(?|\)\)?|,|;/,
                },
              },
              {
                pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
                greedy: !0,
                inside: { variable: /^\$\(|^`|\)$|`$/ },
              },
              {
                pattern: /\$\{[^}]+\}/,
                greedy: !0,
                inside: {
                  operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                  punctuation: /[\[\]]/,
                  environment: {
                    pattern: RegExp('(\\{)' + t),
                    lookbehind: !0,
                    alias: 'constant',
                  },
                },
              },
              /\$(?:\w+|[#?*!@$])/,
            ],
            entity:
              /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
          };
        (e.languages.bash = {
          shebang: { pattern: /^#!\s*\/.*/, alias: 'important' },
          comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
          'function-name': [
            {
              pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
              lookbehind: !0,
              alias: 'function',
            },
            { pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: 'function' },
          ],
          'for-or-select': {
            pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
            alias: 'variable',
            lookbehind: !0,
          },
          'assign-left': {
            pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
            inside: {
              environment: {
                pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + t),
                lookbehind: !0,
                alias: 'constant',
              },
            },
            alias: 'variable',
            lookbehind: !0,
          },
          parameter: {
            pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
            alias: 'variable',
            lookbehind: !0,
          },
          string: [
            {
              pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
              lookbehind: !0,
              greedy: !0,
              inside: r,
            },
            {
              pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
              lookbehind: !0,
              greedy: !0,
              inside: { bash: n },
            },
            {
              pattern:
                /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
              lookbehind: !0,
              greedy: !0,
              inside: r,
            },
            { pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0 },
            {
              pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
              greedy: !0,
              inside: { entity: r.entity },
            },
          ],
          environment: { pattern: RegExp('\\$?' + t), alias: 'constant' },
          variable: r.variable,
          function: {
            pattern:
              /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
            lookbehind: !0,
          },
          keyword: {
            pattern:
              /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
            lookbehind: !0,
          },
          builtin: {
            pattern:
              /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
            lookbehind: !0,
            alias: 'class-name',
          },
          boolean: {
            pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
            lookbehind: !0,
          },
          'file-descriptor': { pattern: /\B&\d\b/, alias: 'important' },
          operator: {
            pattern:
              /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
            inside: { 'file-descriptor': { pattern: /^\d/, alias: 'important' } },
          },
          punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
          number: { pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/, lookbehind: !0 },
        }),
          (n.inside = e.languages.bash);
        for (
          var a = [
              'comment',
              'function-name',
              'for-or-select',
              'assign-left',
              'parameter',
              'string',
              'environment',
              'function',
              'keyword',
              'builtin',
              'boolean',
              'file-descriptor',
              'operator',
              'punctuation',
              'number',
            ],
            o = r.variable[1].inside,
            i = 0;
          i < a.length;
          i++
        )
          o[a[i]] = e.languages.bash[a[i]];
        (e.languages.sh = e.languages.bash), (e.languages.shell = e.languages.bash);
      })(Prism);
    },
    1515() {
      (Prism.languages.javascript = Prism.languages.extend('clike', {
        'class-name': [
          Prism.languages.clike['class-name'],
          {
            pattern:
              /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
            lookbehind: !0,
          },
        ],
        keyword: [
          { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
          {
            pattern:
              /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: !0,
          },
        ],
        function:
          /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        number: {
          pattern: RegExp(
            /(^|[^\w$])/.source +
              '(?:' +
              /NaN|Infinity/.source +
              '|' +
              /0[bB][01]+(?:_[01]+)*n?/.source +
              '|' +
              /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
              '|' +
              /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
              '|' +
              /\d+(?:_\d+)*n/.source +
              '|' +
              /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                .source +
              ')' +
              /(?![\w$])/.source,
          ),
          lookbehind: !0,
        },
        operator:
          /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
      })),
        (Prism.languages.javascript['class-name'][0].pattern =
          /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
        Prism.languages.insertBefore('javascript', 'keyword', {
          regex: {
            pattern: RegExp(
              /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
                /\//.source +
                '(?:' +
                /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
                '|' +
                /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
                  .source +
                ')' +
                /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source,
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
              'regex-source': {
                pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                lookbehind: !0,
                alias: 'language-regex',
                inside: Prism.languages.regex,
              },
              'regex-delimiter': /^\/|\/$/,
              'regex-flags': /^[a-z]+$/,
            },
          },
          'function-variable': {
            pattern:
              /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
            alias: 'function',
          },
          parameter: [
            {
              pattern:
                /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
              lookbehind: !0,
              inside: Prism.languages.javascript,
            },
            {
              pattern:
                /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
              lookbehind: !0,
              inside: Prism.languages.javascript,
            },
            {
              pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
              lookbehind: !0,
              inside: Prism.languages.javascript,
            },
            {
              pattern:
                /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
              lookbehind: !0,
              inside: Prism.languages.javascript,
            },
          ],
          constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
        }),
        Prism.languages.insertBefore('javascript', 'string', {
          hashbang: { pattern: /^#!.*/, greedy: !0, alias: 'comment' },
          'template-string': {
            pattern:
              /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
            greedy: !0,
            inside: {
              'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
              interpolation: {
                pattern:
                  /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                lookbehind: !0,
                inside: {
                  'interpolation-punctuation': {
                    pattern: /^\$\{|\}$/,
                    alias: 'punctuation',
                  },
                  rest: Prism.languages.javascript,
                },
              },
              string: /[\s\S]+/,
            },
          },
          'string-property': {
            pattern:
              /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
            lookbehind: !0,
            greedy: !0,
            alias: 'property',
          },
        }),
        Prism.languages.insertBefore('javascript', 'operator', {
          'literal-property': {
            pattern:
              /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
            lookbehind: !0,
            alias: 'property',
          },
        }),
        Prism.languages.markup &&
          (Prism.languages.markup.tag.addInlined('script', 'javascript'),
          Prism.languages.markup.tag.addAttribute(
            /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
              .source,
            'javascript',
          )),
        (Prism.languages.js = Prism.languages.javascript);
    },
    8020() {
      !(function (e) {
        function t(e, t) {
          return '___' + e.toUpperCase() + t + '___';
        }
        Object.defineProperties((e.languages['markup-templating'] = {}), {
          buildPlaceholders: {
            value: function (n, r, a, o) {
              if (n.language === r) {
                var i = (n.tokenStack = []);
                (n.code = n.code.replace(a, function (e) {
                  if ('function' == typeof o && !o(e)) return e;
                  for (var a, l = i.length; -1 !== n.code.indexOf((a = t(r, l))); ) ++l;
                  return (i[l] = e), a;
                })),
                  (n.grammar = e.languages.markup);
              }
            },
          },
          tokenizePlaceholders: {
            value: function (n, r) {
              if (n.language === r && n.tokenStack) {
                n.grammar = e.languages[r];
                var a = 0,
                  o = Object.keys(n.tokenStack);
                !(function i(l) {
                  for (var s = 0; s < l.length && !(a >= o.length); s++) {
                    var u = l[s];
                    if (
                      'string' == typeof u ||
                      (u.content && 'string' == typeof u.content)
                    ) {
                      var c = o[a],
                        d = n.tokenStack[c],
                        f = 'string' == typeof u ? u : u.content,
                        p = t(r, c),
                        g = f.indexOf(p);
                      if (g > -1) {
                        ++a;
                        var m = f.substring(0, g),
                          h = new e.Token(
                            r,
                            e.tokenize(d, n.grammar),
                            'language-' + r,
                            d,
                          ),
                          y = f.substring(g + p.length),
                          v = [];
                        m && v.push.apply(v, i([m])),
                          v.push(h),
                          y && v.push.apply(v, i([y])),
                          'string' == typeof u
                            ? l.splice.apply(l, [s, 1].concat(v))
                            : (u.content = v);
                      }
                    } else u.content && i(u.content);
                  }
                  return l;
                })(n.tokens);
              }
            },
          },
        });
      })(Prism);
    },
    4413() {
      !(function (e) {
        var t = [
          /"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/.source,
          /'[^']*'/.source,
          /\$'(?:[^'\\]|\\[\s\S])*'/.source,
          /<<-?\s*(["']?)(\w+)\1\s[\s\S]*?[\r\n]\2/.source,
        ].join('|');
        (e.languages['shell-session'] = {
          command: {
            pattern: RegExp(
              /^/.source +
                '(?:' +
                /[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+(?::[^\0-\x1F$#%*?"<>:;|]+)?/.source +
                '|' +
                /[/~.][^\0-\x1F$#%*?"<>@:;|]*/.source +
                ')?' +
                /[$#%](?=\s)/.source +
                /(?:[^\\\r\n \t'"<$]|[ \t](?:(?!#)|#.*$)|\\(?:[^\r]|\r\n?)|\$(?!')|<(?!<)|<<str>>)+/.source.replace(
                  /<<str>>/g,
                  function () {
                    return t;
                  },
                ),
              'm',
            ),
            greedy: !0,
            inside: {
              info: {
                pattern: /^[^#$%]+/,
                alias: 'punctuation',
                inside: {
                  user: /^[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+/,
                  punctuation: /:/,
                  path: /[\s\S]+/,
                },
              },
              bash: {
                pattern: /(^[$#%]\s*)\S[\s\S]*/,
                lookbehind: !0,
                alias: 'language-bash',
                inside: e.languages.bash,
              },
              'shell-symbol': { pattern: /^[$#%]/, alias: 'important' },
            },
          },
          output: /.(?:.*(?:[\r\n]|.$))*/,
        }),
          (e.languages['sh-session'] = e.languages.shellsession =
            e.languages['shell-session']);
      })(Prism);
    },
    6931() {
      !(function (e) {
        (e.languages.typescript = e.languages.extend('javascript', {
          'class-name': {
            pattern:
              /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
            lookbehind: !0,
            greedy: !0,
            inside: null,
          },
          builtin:
            /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
        })),
          e.languages.typescript.keyword.push(
            /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
            /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
            /\btype\b(?=\s*(?:[\{*]|$))/,
          ),
          delete e.languages.typescript.parameter,
          delete e.languages.typescript['literal-property'];
        var t = e.languages.extend('typescript', {});
        delete t['class-name'],
          (e.languages.typescript['class-name'].inside = t),
          e.languages.insertBefore('typescript', 'function', {
            decorator: {
              pattern: /@[$\w\xA0-\uFFFF]+/,
              inside: { at: { pattern: /^@/, alias: 'operator' }, function: /^[\s\S]+/ },
            },
            'generic-function': {
              pattern:
                /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
              greedy: !0,
              inside: {
                function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
                generic: { pattern: /<[\s\S]+/, alias: 'class-name', inside: t },
              },
            },
          }),
          (e.languages.ts = e.languages.typescript);
      })(Prism);
    },
    9299() {
      !(function (e) {
        var t = /[*&][^\s[\]{},]+/,
          n =
            /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
          r =
            '(?:' +
            n.source +
            '(?:[ \t]+' +
            t.source +
            ')?|' +
            t.source +
            '(?:[ \t]+' +
            n.source +
            ')?)',
          a =
            /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(
              /<PLAIN>/g,
              function () {
                return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/
                  .source;
              },
            ),
          o = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;
        function i(e, t) {
          t = (t || '').replace(/m/g, '') + 'm';
          var n =
            /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source
              .replace(/<<prop>>/g, function () {
                return r;
              })
              .replace(/<<value>>/g, function () {
                return e;
              });
          return RegExp(n, t);
        }
        (e.languages.yaml = {
          scalar: {
            pattern: RegExp(
              /([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
                /<<prop>>/g,
                function () {
                  return r;
                },
              ),
            ),
            lookbehind: !0,
            alias: 'string',
          },
          comment: /#.*/,
          key: {
            pattern: RegExp(
              /((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source
                .replace(/<<prop>>/g, function () {
                  return r;
                })
                .replace(/<<key>>/g, function () {
                  return '(?:' + a + '|' + o + ')';
                }),
            ),
            lookbehind: !0,
            greedy: !0,
            alias: 'atrule',
          },
          directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: 'important' },
          datetime: {
            pattern: i(
              /\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/
                .source,
            ),
            lookbehind: !0,
            alias: 'number',
          },
          boolean: {
            pattern: i(/false|true/.source, 'i'),
            lookbehind: !0,
            alias: 'important',
          },
          null: { pattern: i(/null|~/.source, 'i'), lookbehind: !0, alias: 'important' },
          string: { pattern: i(o), lookbehind: !0, greedy: !0 },
          number: {
            pattern: i(
              /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/
                .source,
              'i',
            ),
            lookbehind: !0,
          },
          tag: n,
          important: t,
          punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
        }),
          (e.languages.yml = e.languages.yaml);
      })(Prism);
    },
    6186(e, t, n) {
      'use strict';
      var r = n(2985);
      function a() {}
      function o() {}
      (o.resetWarningCache = a),
        (e.exports = function () {
          function e(e, t, n, a, o, i) {
            if (i !== r) {
              var l = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              );
              throw ((l.name = 'Invariant Violation'), l);
            }
          }
          function t() {
            return e;
          }
          e.isRequired = e;
          var n = {
            array: e,
            bigint: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: t,
            element: e,
            elementType: e,
            instanceOf: t,
            node: e,
            objectOf: t,
            oneOf: t,
            oneOfType: t,
            shape: t,
            exact: t,
            checkPropTypes: o,
            resetWarningCache: a,
          };
          return (n.PropTypes = n), n;
        });
    },
    2736(e, t, n) {
      e.exports = n(6186)();
    },
    2985(e) {
      'use strict';
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    },
    4072(e) {
      var t = 'undefined' != typeof Element,
        n = 'function' == typeof Map,
        r = 'function' == typeof Set,
        a = 'function' == typeof ArrayBuffer && !!ArrayBuffer.isView;
      function o(e, i) {
        if (e === i) return !0;
        if (e && i && 'object' == typeof e && 'object' == typeof i) {
          if (e.constructor !== i.constructor) return !1;
          var l, s, u, c;
          if (Array.isArray(e)) {
            if ((l = e.length) != i.length) return !1;
            for (s = l; 0 !== s--; ) if (!o(e[s], i[s])) return !1;
            return !0;
          }
          if (n && e instanceof Map && i instanceof Map) {
            if (e.size !== i.size) return !1;
            for (c = e.entries(); !(s = c.next()).done; )
              if (!i.has(s.value[0])) return !1;
            for (c = e.entries(); !(s = c.next()).done; )
              if (!o(s.value[1], i.get(s.value[0]))) return !1;
            return !0;
          }
          if (r && e instanceof Set && i instanceof Set) {
            if (e.size !== i.size) return !1;
            for (c = e.entries(); !(s = c.next()).done; )
              if (!i.has(s.value[0])) return !1;
            return !0;
          }
          if (a && ArrayBuffer.isView(e) && ArrayBuffer.isView(i)) {
            if ((l = e.length) != i.length) return !1;
            for (s = l; 0 !== s--; ) if (e[s] !== i[s]) return !1;
            return !0;
          }
          if (e.constructor === RegExp)
            return e.source === i.source && e.flags === i.flags;
          if (
            e.valueOf !== Object.prototype.valueOf &&
            'function' == typeof e.valueOf &&
            'function' == typeof i.valueOf
          )
            return e.valueOf() === i.valueOf();
          if (
            e.toString !== Object.prototype.toString &&
            'function' == typeof e.toString &&
            'function' == typeof i.toString
          )
            return e.toString() === i.toString();
          if ((l = (u = Object.keys(e)).length) !== Object.keys(i).length) return !1;
          for (s = l; 0 !== s--; )
            if (!Object.prototype.hasOwnProperty.call(i, u[s])) return !1;
          if (t && e instanceof Element) return !1;
          for (s = l; 0 !== s--; )
            if (
              (('_owner' !== u[s] && '__v' !== u[s] && '__o' !== u[s]) || !e.$$typeof) &&
              !o(e[u[s]], i[u[s]])
            )
              return !1;
          return !0;
        }
        return e != e && i != i;
      }
      e.exports = function (e, t) {
        try {
          return o(e, t);
        } catch (n) {
          if ((n.message || '').match(/stack|recursion/i))
            return console.warn('react-fast-compare cannot handle circular refs'), !1;
          throw n;
        }
      };
    },
    3433(e, t, n) {
      'use strict';
      n.d(t, { u: () => i, v: () => l });
      var r = n(8266),
        a = n(8820),
        o = n(2503);
      function i(e, t, n) {
        return (
          void 0 === n && (n = []),
          e.some(function (e) {
            var a = e.path
              ? (0, r.B6)(t, e)
              : n.length
              ? n[n.length - 1].match
              : r.Ix.computeRootMatch(t);
            return (
              a && (n.push({ route: e, match: a }), e.routes && i(e.routes, t, n)), a
            );
          }),
          n
        );
      }
      function l(e, t, n) {
        return (
          void 0 === t && (t = {}),
          void 0 === n && (n = {}),
          e
            ? o.createElement(
                r.dO,
                n,
                e.map(function (e, n) {
                  return o.createElement(r.qh, {
                    key: e.key || n,
                    path: e.path,
                    exact: e.exact,
                    strict: e.strict,
                    render: function (n) {
                      return e.render
                        ? e.render((0, a.A)({}, n, {}, t, { route: e }))
                        : o.createElement(e.component, (0, a.A)({}, n, t, { route: e }));
                    },
                  });
                }),
              )
            : null
        );
      }
    },
    1555(e, t, n) {
      'use strict';
      n.d(t, { I9: () => d, Kd: () => c, N_: () => y, k2: () => w });
      var r = n(8266),
        a = n(2247),
        o = n(2503),
        i = n(3332),
        l = n(8820),
        s = n(1463),
        u = n(5385),
        c = (function (e) {
          function t() {
            for (var t, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
              r[a] = arguments[a];
            return (
              ((t = e.call.apply(e, [this].concat(r)) || this).history = (0, i.zR)(
                t.props,
              )),
              t
            );
          }
          return (
            (0, a.A)(t, e),
            (t.prototype.render = function () {
              return o.createElement(r.Ix, {
                history: this.history,
                children: this.props.children,
              });
            }),
            t
          );
        })(o.Component);
      var d = (function (e) {
        function t() {
          for (var t, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
            r[a] = arguments[a];
          return (
            ((t = e.call.apply(e, [this].concat(r)) || this).history = (0, i.TM)(
              t.props,
            )),
            t
          );
        }
        return (
          (0, a.A)(t, e),
          (t.prototype.render = function () {
            return o.createElement(r.Ix, {
              history: this.history,
              children: this.props.children,
            });
          }),
          t
        );
      })(o.Component);
      var f = function (e, t) {
          return 'function' == typeof e ? e(t) : e;
        },
        p = function (e, t) {
          return 'string' == typeof e ? (0, i.yJ)(e, null, null, t) : e;
        },
        g = function (e) {
          return e;
        },
        m = o.forwardRef;
      void 0 === m && (m = g);
      var h = m(function (e, t) {
        var n = e.innerRef,
          r = e.navigate,
          a = e.onClick,
          i = (0, s.A)(e, ['innerRef', 'navigate', 'onClick']),
          u = i.target,
          c = (0, l.A)({}, i, {
            onClick: function (e) {
              try {
                a && a(e);
              } catch (t) {
                throw (e.preventDefault(), t);
              }
              e.defaultPrevented ||
                0 !== e.button ||
                (u && '_self' !== u) ||
                (function (e) {
                  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
                })(e) ||
                (e.preventDefault(), r());
            },
          });
        return (c.ref = (g !== m && t) || n), o.createElement('a', c);
      });
      var y = m(function (e, t) {
          var n = e.component,
            a = void 0 === n ? h : n,
            c = e.replace,
            d = e.to,
            y = e.innerRef,
            v = (0, s.A)(e, ['component', 'replace', 'to', 'innerRef']);
          return o.createElement(r.XZ.Consumer, null, function (e) {
            e || (0, u.A)(!1);
            var n = e.history,
              r = p(f(d, e.location), e.location),
              s = r ? n.createHref(r) : '',
              h = (0, l.A)({}, v, {
                href: s,
                navigate: function () {
                  var t = f(d, e.location),
                    r = (0, i.AO)(e.location) === (0, i.AO)(p(t));
                  (c || r ? n.replace : n.push)(t);
                },
              });
            return g !== m ? (h.ref = t || y) : (h.innerRef = y), o.createElement(a, h);
          });
        }),
        v = function (e) {
          return e;
        },
        b = o.forwardRef;
      void 0 === b && (b = v);
      var w = b(function (e, t) {
        var n = e['aria-current'],
          a = void 0 === n ? 'page' : n,
          i = e.activeClassName,
          c = void 0 === i ? 'active' : i,
          d = e.activeStyle,
          g = e.className,
          m = e.exact,
          h = e.isActive,
          w = e.location,
          k = e.sensitive,
          S = e.strict,
          x = e.style,
          E = e.to,
          _ = e.innerRef,
          A = (0, s.A)(e, [
            'aria-current',
            'activeClassName',
            'activeStyle',
            'className',
            'exact',
            'isActive',
            'location',
            'sensitive',
            'strict',
            'style',
            'to',
            'innerRef',
          ]);
        return o.createElement(r.XZ.Consumer, null, function (e) {
          e || (0, u.A)(!1);
          var n = w || e.location,
            i = p(f(E, n), n),
            s = i.pathname,
            C = s && s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1'),
            T = C
              ? (0, r.B6)(n.pathname, { path: C, exact: m, sensitive: k, strict: S })
              : null,
            N = !!(h ? h(T, n) : T),
            O = 'function' == typeof g ? g(N) : g,
            P = 'function' == typeof x ? x(N) : x;
          N &&
            ((O = (function () {
              for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                t[n] = arguments[n];
              return t
                .filter(function (e) {
                  return e;
                })
                .join(' ');
            })(O, c)),
            (P = (0, l.A)({}, P, d)));
          var j = (0, l.A)(
            { 'aria-current': (N && a) || null, className: O, style: P, to: i },
            A,
          );
          return v !== b ? (j.ref = t || _) : (j.innerRef = _), o.createElement(y, j);
        });
      });
    },
    8266(e, t, n) {
      'use strict';
      n.d(t, {
        qh: () => A,
        Ix: () => S,
        dO: () => j,
        XZ: () => k,
        B6: () => _,
        W6: () => I,
        zy: () => F,
      });
      var r = n.cw((e) => {
          var t = o(),
            n = {
              childContextTypes: !0,
              contextType: !0,
              contextTypes: !0,
              defaultProps: !0,
              displayName: !0,
              getDefaultProps: !0,
              getDerivedStateFromError: !0,
              getDerivedStateFromProps: !0,
              mixins: !0,
              propTypes: !0,
              type: !0,
            },
            r = {
              name: !0,
              length: !0,
              prototype: !0,
              caller: !0,
              callee: !0,
              arguments: !0,
              arity: !0,
            },
            a = {
              $$typeof: !0,
              compare: !0,
              defaultProps: !0,
              displayName: !0,
              propTypes: !0,
              type: !0,
            },
            i = {};
          function l(e) {
            return t.isMemo(e) ? a : i[e.$$typeof] || n;
          }
          (i[t.ForwardRef] = {
            $$typeof: !0,
            render: !0,
            defaultProps: !0,
            displayName: !0,
            propTypes: !0,
          }),
            (i[t.Memo] = a);
          var s = Object.defineProperty,
            u = Object.getOwnPropertyNames,
            c = Object.getOwnPropertySymbols,
            d = Object.getOwnPropertyDescriptor,
            f = Object.getPrototypeOf,
            p = Object.prototype;
          e.exports = function e(t, n, a) {
            if ('string' != typeof n) {
              if (p) {
                var o = f(n);
                o && o !== p && e(t, o, a);
              }
              var i = u(n);
              c && (i = i.concat(c(n)));
              for (var g = l(t), m = l(n), h = 0; h < i.length; ++h) {
                var y = i[h];
                if (!(r[y] || (a && a[y]) || (m && m[y]) || (g && g[y]))) {
                  var v = d(n, y);
                  try {
                    s(t, y, v);
                  } catch (b) {}
                }
              }
            }
            return t;
          };
        }),
        a = n.cw((e, t) => {
          var n = 'function' == typeof Symbol && Symbol.for,
            r = n ? Symbol.for('react.element') : 60103,
            a = n ? Symbol.for('react.portal') : 60106,
            o = n ? Symbol.for('react.fragment') : 60107,
            i = n ? Symbol.for('react.strict_mode') : 60108,
            l = n ? Symbol.for('react.profiler') : 60114,
            s = n ? Symbol.for('react.provider') : 60109,
            u = n ? Symbol.for('react.context') : 60110,
            c = n ? Symbol.for('react.async_mode') : 60111,
            d = n ? Symbol.for('react.concurrent_mode') : 60111,
            f = n ? Symbol.for('react.forward_ref') : 60112,
            p = n ? Symbol.for('react.suspense') : 60113,
            g = n ? Symbol.for('react.suspense_list') : 60120,
            m = n ? Symbol.for('react.memo') : 60115,
            h = n ? Symbol.for('react.lazy') : 60116,
            y = n ? Symbol.for('react.block') : 60121,
            v = n ? Symbol.for('react.fundamental') : 60117,
            b = n ? Symbol.for('react.responder') : 60118,
            w = n ? Symbol.for('react.scope') : 60119;
          function k(e) {
            if ('object' == typeof e && null !== e) {
              var t = e.$$typeof;
              switch (t) {
                case r:
                  switch ((e = e.type)) {
                    case c:
                    case d:
                    case o:
                    case l:
                    case i:
                    case p:
                      return e;
                    default:
                      switch ((e = e && e.$$typeof)) {
                        case u:
                        case f:
                        case h:
                        case m:
                        case s:
                          return e;
                        default:
                          return t;
                      }
                  }
                case a:
                  return t;
              }
            }
          }
          function S(e) {
            return k(e) === d;
          }
          (t.AsyncMode = c),
            (t.ConcurrentMode = d),
            (t.ContextConsumer = u),
            (t.ContextProvider = s),
            (t.Element = r),
            (t.ForwardRef = f),
            (t.Fragment = o),
            (t.Lazy = h),
            (t.Memo = m),
            (t.Portal = a),
            (t.Profiler = l),
            (t.StrictMode = i),
            (t.Suspense = p),
            (t.isAsyncMode = function (e) {
              return S(e) || k(e) === c;
            }),
            (t.isConcurrentMode = S),
            (t.isContextConsumer = function (e) {
              return k(e) === u;
            }),
            (t.isContextProvider = function (e) {
              return k(e) === s;
            }),
            (t.isElement = function (e) {
              return 'object' == typeof e && null !== e && e.$$typeof === r;
            }),
            (t.isForwardRef = function (e) {
              return k(e) === f;
            }),
            (t.isFragment = function (e) {
              return k(e) === o;
            }),
            (t.isLazy = function (e) {
              return k(e) === h;
            }),
            (t.isMemo = function (e) {
              return k(e) === m;
            }),
            (t.isPortal = function (e) {
              return k(e) === a;
            }),
            (t.isProfiler = function (e) {
              return k(e) === l;
            }),
            (t.isStrictMode = function (e) {
              return k(e) === i;
            }),
            (t.isSuspense = function (e) {
              return k(e) === p;
            }),
            (t.isValidElementType = function (e) {
              return (
                'string' == typeof e ||
                'function' == typeof e ||
                e === o ||
                e === d ||
                e === l ||
                e === i ||
                e === p ||
                e === g ||
                ('object' == typeof e &&
                  null !== e &&
                  (e.$$typeof === h ||
                    e.$$typeof === m ||
                    e.$$typeof === s ||
                    e.$$typeof === u ||
                    e.$$typeof === f ||
                    e.$$typeof === v ||
                    e.$$typeof === b ||
                    e.$$typeof === w ||
                    e.$$typeof === y))
              );
            }),
            (t.typeOf = k);
        }),
        o = n.cw((e) => {
          e.exports = a();
        }),
        i = n(2247),
        l = n(2503),
        s = n(2736),
        u = n.n(s),
        c = n(3332),
        d = n(5385),
        f = n(8820),
        p = n(4785),
        g = n.n(p);
      o();
      var m = n(1463);
      r();
      var h = 1073741823,
        y =
          'undefined' != typeof globalThis
            ? globalThis
            : 'undefined' != typeof window
            ? window
            : void 0 !== n.g
            ? n.g
            : {};
      var v =
          l.createContext ||
          function (e, t) {
            var n,
              r,
              a,
              o =
                '__create-react-context-' +
                ((y[(a = '__global_unique_id__')] = (y[a] || 0) + 1) + '__'),
              s = (function (e) {
                function n() {
                  for (
                    var t, n, r, a = arguments.length, o = new Array(a), i = 0;
                    i < a;
                    i++
                  )
                    o[i] = arguments[i];
                  return (
                    ((t = e.call.apply(e, [this].concat(o)) || this).emitter =
                      ((n = t.props.value),
                      (r = []),
                      {
                        on: function (e) {
                          r.push(e);
                        },
                        off: function (e) {
                          r = r.filter(function (t) {
                            return t !== e;
                          });
                        },
                        get: function () {
                          return n;
                        },
                        set: function (e, t) {
                          (n = e),
                            r.forEach(function (e) {
                              return e(n, t);
                            });
                        },
                      })),
                    t
                  );
                }
                (0, i.A)(n, e);
                var r = n.prototype;
                return (
                  (r.getChildContext = function () {
                    var e;
                    return ((e = {})[o] = this.emitter), e;
                  }),
                  (r.componentWillReceiveProps = function (e) {
                    if (this.props.value !== e.value) {
                      var n,
                        r = this.props.value,
                        a = e.value;
                      ((o = r) === (i = a) ? 0 !== o || 1 / o == 1 / i : o != o && i != i)
                        ? (n = 0)
                        : ((n = 'function' == typeof t ? t(r, a) : h),
                          0 !== (n |= 0) && this.emitter.set(e.value, n));
                    }
                    var o, i;
                  }),
                  (r.render = function () {
                    return this.props.children;
                  }),
                  n
                );
              })(l.Component);
            s.childContextTypes = (((n = {})[o] = u().object.isRequired), n);
            var c = (function (t) {
              function n() {
                for (var e, n = arguments.length, r = new Array(n), a = 0; a < n; a++)
                  r[a] = arguments[a];
                return (
                  ((e = t.call.apply(t, [this].concat(r)) || this).observedBits = void 0),
                  (e.state = { value: e.getValue() }),
                  (e.onUpdate = function (t, n) {
                    0 !== ((0 | e.observedBits) & n) &&
                      e.setState({ value: e.getValue() });
                  }),
                  e
                );
              }
              (0, i.A)(n, t);
              var r = n.prototype;
              return (
                (r.componentWillReceiveProps = function (e) {
                  var t = e.observedBits;
                  this.observedBits = null == t ? h : t;
                }),
                (r.componentDidMount = function () {
                  this.context[o] && this.context[o].on(this.onUpdate);
                  var e = this.props.observedBits;
                  this.observedBits = null == e ? h : e;
                }),
                (r.componentWillUnmount = function () {
                  this.context[o] && this.context[o].off(this.onUpdate);
                }),
                (r.getValue = function () {
                  return this.context[o] ? this.context[o].get() : e;
                }),
                (r.render = function () {
                  return ((e = this.props.children), Array.isArray(e) ? e[0] : e)(
                    this.state.value,
                  );
                  var e;
                }),
                n
              );
            })(l.Component);
            return (
              (c.contextTypes = (((r = {})[o] = u().object), r)),
              { Provider: s, Consumer: c }
            );
          },
        b = function (e) {
          var t = v();
          return (t.displayName = e), t;
        },
        w = b('Router-History'),
        k = b('Router'),
        S = (function (e) {
          function t(t) {
            var n;
            return (
              ((n = e.call(this, t) || this).state = { location: t.history.location }),
              (n._isMounted = !1),
              (n._pendingLocation = null),
              t.staticContext ||
                (n.unlisten = t.history.listen(function (e) {
                  n._pendingLocation = e;
                })),
              n
            );
          }
          (0, i.A)(t, e),
            (t.computeRootMatch = function (e) {
              return { path: '/', url: '/', params: {}, isExact: '/' === e };
            });
          var n = t.prototype;
          return (
            (n.componentDidMount = function () {
              var e = this;
              (this._isMounted = !0),
                this.unlisten && this.unlisten(),
                this.props.staticContext ||
                  (this.unlisten = this.props.history.listen(function (t) {
                    e._isMounted && e.setState({ location: t });
                  })),
                this._pendingLocation &&
                  this.setState({ location: this._pendingLocation });
            }),
            (n.componentWillUnmount = function () {
              this.unlisten &&
                (this.unlisten(), (this._isMounted = !1), (this._pendingLocation = null));
            }),
            (n.render = function () {
              return l.createElement(
                k.Provider,
                {
                  value: {
                    history: this.props.history,
                    location: this.state.location,
                    match: t.computeRootMatch(this.state.location.pathname),
                    staticContext: this.props.staticContext,
                  },
                },
                l.createElement(w.Provider, {
                  children: this.props.children || null,
                  value: this.props.history,
                }),
              );
            }),
            t
          );
        })(l.Component);
      l.Component;
      l.Component;
      var x = {},
        E = 0;
      function _(e, t) {
        void 0 === t && (t = {}),
          ('string' == typeof t || Array.isArray(t)) && (t = { path: t });
        var n = t,
          r = n.path,
          a = n.exact,
          o = void 0 !== a && a,
          i = n.strict,
          l = void 0 !== i && i,
          s = n.sensitive,
          u = void 0 !== s && s;
        return [].concat(r).reduce(function (t, n) {
          if (!n && '' !== n) return null;
          if (t) return t;
          var r = (function (e, t) {
              var n = '' + t.end + t.strict + t.sensitive,
                r = x[n] || (x[n] = {});
              if (r[e]) return r[e];
              var a = [],
                o = { regexp: g()(e, a, t), keys: a };
              return E < 1e4 && ((r[e] = o), E++), o;
            })(n, { end: o, strict: l, sensitive: u }),
            a = r.regexp,
            i = r.keys,
            s = a.exec(e);
          if (!s) return null;
          var c = s[0],
            d = s.slice(1),
            f = e === c;
          return o && !f
            ? null
            : {
                path: n,
                url: '/' === n && '' === c ? '/' : c,
                isExact: f,
                params: i.reduce(function (e, t, n) {
                  return (e[t.name] = d[n]), e;
                }, {}),
              };
        }, null);
      }
      var A = (function (e) {
        function t() {
          return e.apply(this, arguments) || this;
        }
        return (
          (0, i.A)(t, e),
          (t.prototype.render = function () {
            var e = this;
            return l.createElement(k.Consumer, null, function (t) {
              t || (0, d.A)(!1);
              var n = e.props.location || t.location,
                r = e.props.computedMatch
                  ? e.props.computedMatch
                  : e.props.path
                  ? _(n.pathname, e.props)
                  : t.match,
                a = (0, f.A)({}, t, { location: n, match: r }),
                o = e.props,
                i = o.children,
                s = o.component,
                u = o.render;
              return (
                Array.isArray(i) &&
                  (function (e) {
                    return 0 === l.Children.count(e);
                  })(i) &&
                  (i = null),
                l.createElement(
                  k.Provider,
                  { value: a },
                  a.match
                    ? i
                      ? 'function' == typeof i
                        ? i(a)
                        : i
                      : s
                      ? l.createElement(s, a)
                      : u
                      ? u(a)
                      : null
                    : 'function' == typeof i
                    ? i(a)
                    : null,
                )
              );
            });
          }),
          t
        );
      })(l.Component);
      function C(e) {
        return '/' === e.charAt(0) ? e : '/' + e;
      }
      function T(e, t) {
        if (!e) return t;
        var n = C(e);
        return 0 !== t.pathname.indexOf(n)
          ? t
          : (0, f.A)({}, t, { pathname: t.pathname.substr(n.length) });
      }
      function N(e) {
        return 'string' == typeof e ? e : (0, c.AO)(e);
      }
      function O(e) {
        return function () {
          (0, d.A)(!1);
        };
      }
      function P() {}
      l.Component;
      var j = (function (e) {
        function t() {
          return e.apply(this, arguments) || this;
        }
        return (
          (0, i.A)(t, e),
          (t.prototype.render = function () {
            var e = this;
            return l.createElement(k.Consumer, null, function (t) {
              t || (0, d.A)(!1);
              var n,
                r,
                a = e.props.location || t.location;
              return (
                l.Children.forEach(e.props.children, function (e) {
                  if (null == r && l.isValidElement(e)) {
                    n = e;
                    var o = e.props.path || e.props.from;
                    r = o ? _(a.pathname, (0, f.A)({}, e.props, { path: o })) : t.match;
                  }
                }),
                r ? l.cloneElement(n, { location: a, computedMatch: r }) : null
              );
            });
          }),
          t
        );
      })(l.Component);
      var L = l.useContext;
      function I() {
        return L(w);
      }
      function F() {
        return L(k).location;
      }
    },
    443(e, t) {
      'use strict';
      var n = Symbol.for('react.transitional.element'),
        r = Symbol.for('react.fragment');
      function a(e, t, r) {
        var a = null;
        if (
          (void 0 !== r && (a = '' + r), void 0 !== t.key && (a = '' + t.key), 'key' in t)
        )
          for (var o in ((r = {}), t)) 'key' !== o && (r[o] = t[o]);
        else r = t;
        return (
          (t = r.ref),
          { $$typeof: n, type: e, key: a, ref: void 0 !== t ? t : null, props: r }
        );
      }
      (t.Fragment = r), (t.jsx = a), (t.jsxs = a);
    },
    8340(e, t) {
      'use strict';
      var n = Symbol.for('react.transitional.element'),
        r = Symbol.for('react.portal'),
        a = Symbol.for('react.fragment'),
        o = Symbol.for('react.strict_mode'),
        i = Symbol.for('react.profiler'),
        l = Symbol.for('react.consumer'),
        s = Symbol.for('react.context'),
        u = Symbol.for('react.forward_ref'),
        c = Symbol.for('react.suspense'),
        d = Symbol.for('react.memo'),
        f = Symbol.for('react.lazy'),
        p = Symbol.for('react.activity'),
        g = Symbol.for('react.view_transition'),
        m = Symbol.iterator;
      var h = {
          isMounted: function () {
            return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
        },
        y = Object.assign,
        v = {};
      function b(e, t, n) {
        (this.props = e), (this.context = t), (this.refs = v), (this.updater = n || h);
      }
      function w() {}
      function k(e, t, n) {
        (this.props = e), (this.context = t), (this.refs = v), (this.updater = n || h);
      }
      (b.prototype.isReactComponent = {}),
        (b.prototype.setState = function (e, t) {
          if ('object' != typeof e && 'function' != typeof e && null != e)
            throw Error(
              'takes an object of state variables to update or a function which returns an object of state variables.',
            );
          this.updater.enqueueSetState(this, e, t, 'setState');
        }),
        (b.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
        }),
        (w.prototype = b.prototype);
      var S = (k.prototype = new w());
      (S.constructor = k), y(S, b.prototype), (S.isPureReactComponent = !0);
      var x = Array.isArray;
      function E() {}
      var _ = { H: null, A: null, T: null, S: null },
        A = Object.prototype.hasOwnProperty;
      function C(e, t, r) {
        var a = r.ref;
        return { $$typeof: n, type: e, key: t, ref: void 0 !== a ? a : null, props: r };
      }
      function T(e) {
        return 'object' == typeof e && null !== e && e.$$typeof === n;
      }
      var N = /\/+/g;
      function O(e, t) {
        return 'object' == typeof e && null !== e && null != e.key
          ? ((n = '' + e.key),
            (r = { '=': '=0', ':': '=2' }),
            '$' +
              n.replace(/[=:]/g, function (e) {
                return r[e];
              }))
          : t.toString(36);
        var n, r;
      }
      function P(e, t, a, o, i) {
        var l = typeof e;
        ('undefined' !== l && 'boolean' !== l) || (e = null);
        var s,
          u,
          c = !1;
        if (null === e) c = !0;
        else
          switch (l) {
            case 'bigint':
            case 'string':
            case 'number':
              c = !0;
              break;
            case 'object':
              switch (e.$$typeof) {
                case n:
                case r:
                  c = !0;
                  break;
                case f:
                  return P((c = e._init)(e._payload), t, a, o, i);
              }
          }
        if (c)
          return (
            (i = i(e)),
            (c = '' === o ? '.' + O(e, 0) : o),
            x(i)
              ? ((a = ''),
                null != c && (a = c.replace(N, '$&/') + '/'),
                P(i, t, a, '', function (e) {
                  return e;
                }))
              : null != i &&
                (T(i) &&
                  ((s = i),
                  (u =
                    a +
                    (null == i.key || (e && e.key === i.key)
                      ? ''
                      : ('' + i.key).replace(N, '$&/') + '/') +
                    c),
                  (i = C(s.type, u, s.props))),
                t.push(i)),
            1
          );
        c = 0;
        var d,
          p = '' === o ? '.' : o + ':';
        if (x(e))
          for (var g = 0; g < e.length; g++)
            c += P((o = e[g]), t, a, (l = p + O(o, g)), i);
        else if (
          'function' ==
          typeof (g =
            null === (d = e) || 'object' != typeof d
              ? null
              : 'function' == typeof (d = (m && d[m]) || d['@@iterator'])
              ? d
              : null)
        )
          for (e = g.call(e), g = 0; !(o = e.next()).done; )
            c += P((o = o.value), t, a, (l = p + O(o, g++)), i);
        else if ('object' === l) {
          if ('function' == typeof e.then)
            return P(
              (function (e) {
                switch (e.status) {
                  case 'fulfilled':
                    return e.value;
                  case 'rejected':
                    throw e.reason;
                  default:
                    switch (
                      ('string' == typeof e.status
                        ? e.then(E, E)
                        : ((e.status = 'pending'),
                          e.then(
                            function (t) {
                              'pending' === e.status &&
                                ((e.status = 'fulfilled'), (e.value = t));
                            },
                            function (t) {
                              'pending' === e.status &&
                                ((e.status = 'rejected'), (e.reason = t));
                            },
                          )),
                      e.status)
                    ) {
                      case 'fulfilled':
                        return e.value;
                      case 'rejected':
                        throw e.reason;
                    }
                }
                throw e;
              })(e),
              t,
              a,
              o,
              i,
            );
          throw (
            ((t = String(e)),
            Error(
              'Objects are not valid as a React child (found: ' +
                ('[object Object]' === t
                  ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                  : t) +
                '). If you meant to render a collection of children, use an array instead.',
            ))
          );
        }
        return c;
      }
      function j(e, t, n) {
        if (null == e) return e;
        var r = [],
          a = 0;
        return (
          P(e, r, '', '', function (e) {
            return t.call(n, e, a++);
          }),
          r
        );
      }
      function L(e) {
        if (-1 === e._status) {
          var t = (0, e._result)();
          t.then(
            function (n) {
              (0 !== e._status && -1 !== e._status) ||
                ((e._status = 1),
                (e._result = n),
                void 0 === t.status && ((t.status = 'fulfilled'), (t.value = n)));
            },
            function (n) {
              (0 !== e._status && -1 !== e._status) ||
                ((e._status = 2),
                (e._result = n),
                void 0 === t.status && ((t.status = 'rejected'), (t.reason = n)));
            },
          ),
            -1 === e._status && ((e._status = 0), (e._result = t));
        }
        if (1 === e._status) return e._result.default;
        throw e._result;
      }
      var I =
        'function' == typeof reportError
          ? reportError
          : function (e) {
              if ('object' == typeof window && 'function' == typeof window.ErrorEvent) {
                var t = new window.ErrorEvent('error', {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    'object' == typeof e && null !== e && 'string' == typeof e.message
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if ('object' == typeof process && 'function' == typeof process.emit)
                return void process.emit('uncaughtException', e);
              console.error(e);
            };
      function F(e) {
        var t = _.T,
          n = {};
        (n.types = null !== t ? t.types : null), (_.T = n);
        try {
          var r = e(),
            a = _.S;
          null !== a && a(n, r),
            'object' == typeof r &&
              null !== r &&
              'function' == typeof r.then &&
              r.then(E, I);
        } catch (o) {
          I(o);
        } finally {
          null !== t && null !== n.types && (t.types = n.types), (_.T = t);
        }
      }
      var R = {
        map: j,
        forEach: function (e, t, n) {
          j(
            e,
            function () {
              t.apply(this, arguments);
            },
            n,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            j(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            j(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!T(e))
            throw Error(
              'React.Children.only expected to receive a single React element child.',
            );
          return e;
        },
      };
      (t.Activity = p),
        (t.Children = R),
        (t.Component = b),
        (t.Fragment = a),
        (t.Profiler = i),
        (t.PureComponent = k),
        (t.StrictMode = o),
        (t.Suspense = c),
        (t.ViewTransition = g),
        (t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = _),
        (t.__COMPILER_RUNTIME = {
          __proto__: null,
          c: function (e) {
            return _.H.useMemoCache(e);
          },
        }),
        (t.addTransitionType = function e(t) {
          var n = _.T;
          if (null !== n) {
            var r = n.types;
            null === r ? (n.types = [t]) : -1 === r.indexOf(t) && r.push(t);
          } else F(e.bind(null, t));
        }),
        (t.cache = function (e) {
          return function () {
            return e.apply(null, arguments);
          };
        }),
        (t.cacheSignal = function () {
          return null;
        }),
        (t.cloneElement = function (e, t, n) {
          if (null == e)
            throw Error(
              'The argument must be a React element, but you passed ' + e + '.',
            );
          var r = y({}, e.props),
            a = e.key;
          if (null != t)
            for (o in (void 0 !== t.key && (a = '' + t.key), t))
              !A.call(t, o) ||
                'key' === o ||
                '__self' === o ||
                '__source' === o ||
                ('ref' === o && void 0 === t.ref) ||
                (r[o] = t[o]);
          var o = arguments.length - 2;
          if (1 === o) r.children = n;
          else if (1 < o) {
            for (var i = Array(o), l = 0; l < o; l++) i[l] = arguments[l + 2];
            r.children = i;
          }
          return C(e.type, a, r);
        }),
        (t.createContext = function (e) {
          return (
            ((e = {
              $$typeof: s,
              _currentValue: e,
              _currentValue2: e,
              _threadCount: 0,
              Provider: null,
              Consumer: null,
            }).Provider = e),
            (e.Consumer = { $$typeof: l, _context: e }),
            e
          );
        }),
        (t.createElement = function (e, t, n) {
          var r,
            a = {},
            o = null;
          if (null != t)
            for (r in (void 0 !== t.key && (o = '' + t.key), t))
              A.call(t, r) &&
                'key' !== r &&
                '__self' !== r &&
                '__source' !== r &&
                (a[r] = t[r]);
          var i = arguments.length - 2;
          if (1 === i) a.children = n;
          else if (1 < i) {
            for (var l = Array(i), s = 0; s < i; s++) l[s] = arguments[s + 2];
            a.children = l;
          }
          if (e && e.defaultProps)
            for (r in (i = e.defaultProps)) void 0 === a[r] && (a[r] = i[r]);
          return C(e, o, a);
        }),
        (t.createRef = function () {
          return { current: null };
        }),
        (t.forwardRef = function (e) {
          return { $$typeof: u, render: e };
        }),
        (t.isValidElement = T),
        (t.lazy = function (e) {
          return { $$typeof: f, _payload: { _status: -1, _result: e }, _init: L };
        }),
        (t.memo = function (e, t) {
          return { $$typeof: d, type: e, compare: void 0 === t ? null : t };
        }),
        (t.startTransition = F),
        (t.unstable_useCacheRefresh = function () {
          return _.H.useCacheRefresh();
        }),
        (t.use = function (e) {
          return _.H.use(e);
        }),
        (t.useActionState = function (e, t, n) {
          return _.H.useActionState(e, t, n);
        }),
        (t.useCallback = function (e, t) {
          return _.H.useCallback(e, t);
        }),
        (t.useContext = function (e) {
          return _.H.useContext(e);
        }),
        (t.useDebugValue = function () {}),
        (t.useDeferredValue = function (e, t) {
          return _.H.useDeferredValue(e, t);
        }),
        (t.useEffect = function (e, t) {
          return _.H.useEffect(e, t);
        }),
        (t.useEffectEvent = function (e) {
          return _.H.useEffectEvent(e);
        }),
        (t.useId = function () {
          return _.H.useId();
        }),
        (t.useImperativeHandle = function (e, t, n) {
          return _.H.useImperativeHandle(e, t, n);
        }),
        (t.useInsertionEffect = function (e, t) {
          return _.H.useInsertionEffect(e, t);
        }),
        (t.useLayoutEffect = function (e, t) {
          return _.H.useLayoutEffect(e, t);
        }),
        (t.useMemo = function (e, t) {
          return _.H.useMemo(e, t);
        }),
        (t.useOptimistic = function (e, t) {
          return _.H.useOptimistic(e, t);
        }),
        (t.useReducer = function (e, t, n) {
          return _.H.useReducer(e, t, n);
        }),
        (t.useRef = function (e) {
          return _.H.useRef(e);
        }),
        (t.useState = function (e) {
          return _.H.useState(e);
        }),
        (t.useSyncExternalStore = function (e, t, n) {
          return _.H.useSyncExternalStore(e, t, n);
        }),
        (t.useTransition = function () {
          return _.H.useTransition();
        }),
        (t.version = '19.3.1');
    },
    2503(e, t, n) {
      'use strict';
      e.exports = n(8340);
    },
    159(e, t, n) {
      'use strict';
      e.exports = n(443);
    },
    2945(e) {
      e.exports = function (e, t, n, r) {
        var a = n ? n.call(r, e, t) : void 0;
        if (void 0 !== a) return !!a;
        if (e === t) return !0;
        if ('object' != typeof e || !e || 'object' != typeof t || !t) return !1;
        var o = Object.keys(e),
          i = Object.keys(t);
        if (o.length !== i.length) return !1;
        for (var l = Object.prototype.hasOwnProperty.bind(t), s = 0; s < o.length; s++) {
          var u = o[s];
          if (!l(u)) return !1;
          var c = e[u],
            d = t[u];
          if (!1 === (a = n ? n.call(r, c, d, u) : void 0) || (void 0 === a && c !== d))
            return !1;
        }
        return !0;
      };
    },
    4784(e, t, n) {
      'use strict';
      n.r(t);
      n.d(t, [
        'default',
        0,
        {
          title: '@biorate/hygen',
          tagline: 'The scalable code generator that lives in your project.',
          url: 'https://biorate.github.io',
          baseUrl: '/core/hygen/',
          onBrokenLinks: 'throw',
          organizationName: 'biorate',
          projectName: 'hygen',
          i18n: { defaultLocale: 'en', locales: ['en'], path: 'i18n', localeConfigs: {} },
          presets: [
            [
              'classic',
              {
                docs: {
                  path: '../docs',
                  routeBasePath: 'docs',
                  sidebarPath: './sidebar.js',
                },
                blog: !1,
                theme: {
                  customCss:
                    '/www/biorate/core/packages/@biorate/hygen/site/src/css/custom.css',
                },
              },
            ],
          ],
          themeConfig: {
            navbar: {
              title: '@biorate/hygen',
              items: [
                { type: 'doc', docId: 'quick-start', position: 'left', label: 'Docs' },
                {
                  href: 'https://www.npmjs.com/package/@biorate/hygen',
                  label: 'npm',
                  position: 'right',
                },
                {
                  href: 'https://github.com/biorate/core',
                  label: 'GitHub',
                  position: 'right',
                },
              ],
              hideOnScroll: !1,
            },
            prism: {
              additionalLanguages: [
                'bash',
                'yaml',
                'typescript',
                'javascript',
                'shell-session',
              ],
              theme: {
                plain: { color: '#bfc7d5', backgroundColor: '#292d3e' },
                styles: [
                  {
                    types: ['comment'],
                    style: { color: 'rgb(105, 112, 152)', fontStyle: 'italic' },
                  },
                  {
                    types: ['string', 'inserted'],
                    style: { color: 'rgb(195, 232, 141)' },
                  },
                  { types: ['number'], style: { color: 'rgb(247, 140, 108)' } },
                  {
                    types: ['builtin', 'char', 'constant', 'function'],
                    style: { color: 'rgb(130, 170, 255)' },
                  },
                  {
                    types: ['punctuation', 'selector'],
                    style: { color: 'rgb(199, 146, 234)' },
                  },
                  { types: ['variable'], style: { color: 'rgb(191, 199, 213)' } },
                  {
                    types: ['class-name', 'attr-name'],
                    style: { color: 'rgb(255, 203, 107)' },
                  },
                  { types: ['tag', 'deleted'], style: { color: 'rgb(255, 85, 114)' } },
                  { types: ['operator'], style: { color: 'rgb(137, 221, 255)' } },
                  { types: ['boolean'], style: { color: 'rgb(255, 88, 116)' } },
                  { types: ['keyword'], style: { fontStyle: 'italic' } },
                  {
                    types: ['doctype'],
                    style: { color: 'rgb(199, 146, 234)', fontStyle: 'italic' },
                  },
                  { types: ['namespace'], style: { color: 'rgb(178, 204, 214)' } },
                  { types: ['url'], style: { color: 'rgb(221, 221, 221)' } },
                ],
              },
              magicComments: [
                {
                  className: 'theme-code-block-highlighted-line',
                  line: 'highlight-next-line',
                  block: { start: 'highlight-start', end: 'highlight-end' },
                },
              ],
            },
            footer: {
              style: 'dark',
              links: [
                {
                  title: 'Docs',
                  items: [
                    { label: 'Quick start', to: '/docs/quick-start' },
                    { label: 'Generators', to: '/docs/generators' },
                    { label: 'Templates', to: '/docs/templates' },
                    { label: 'FAQ', to: '/docs/faq' },
                  ],
                },
                {
                  title: 'Support',
                  items: [{ label: 'Boosty', href: 'https://boosty.to/llevkin' }],
                },
              ],
              copyright:
                '@biorate/hygen \u2014 a fork of <a href="https://github.com/jondot/hygen">jondot/hygen</a> (v6.2.11, MIT). Original work \xa9 Dotan Nahum, fork adaptations \xa9 Leonid Levkin. Built with <a href="https://docusaurus.io/">Docusaurus</a>. Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license.',
            },
            colorMode: {
              defaultMode: 'light',
              disableSwitch: !1,
              respectPrefersColorScheme: !1,
            },
            docs: {
              versionPersistence: 'localStorage',
              sidebar: { hideable: !1, autoCollapseCategories: !1 },
            },
            blog: { sidebar: { groupByYear: !0 } },
            metadata: [],
            tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
          },
          baseUrlIssueBanner: !0,
          storage: { type: 'localStorage', namespace: !1 },
          future: {
            v4: {
              removeLegacyPostBuildHeadAttribute: !1,
              useCssCascadeLayers: !1,
              siteStorageNamespacing: !1,
              fasterByDefault: !1,
              mdx1CompatDisabledByDefault: !1,
            },
            faster: {
              swcJsLoader: !1,
              swcJsMinimizer: !1,
              swcHtmlMinimizer: !1,
              lightningCssMinimizer: !1,
              mdxCrossCompilerCache: !1,
              rspackBundler: !1,
              rspackPersistentCache: !1,
              ssgWorkerThreads: !1,
              gitEagerVcs: !1,
            },
            experimental_vcs: {},
            experimental_router: 'browser',
          },
          onBrokenAnchors: 'warn',
          onDuplicateRoutes: 'warn',
          staticDirectories: ['static'],
          customFields: {},
          plugins: [],
          themes: [],
          scripts: [],
          headTags: [],
          stylesheets: [],
          clientModules: [],
          titleDelimiter: '|',
          noIndex: !1,
          markdown: {
            format: 'mdx',
            mermaid: !1,
            emoji: !0,
            mdx1Compat: { comments: !0, admonitions: !0, headingIds: !0 },
            anchors: { maintainCase: !1 },
            hooks: { onBrokenMarkdownLinks: 'throw', onBrokenMarkdownImages: 'throw' },
          },
        },
      ]);
    },
    3961(e, t, n) {
      'use strict';
      function r(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function a(e, t) {
        var n = ('undefined' != typeof Symbol && e[Symbol.iterator]) || e['@@iterator'];
        if (n) return (n = n.call(e)).next.bind(n);
        if (
          Array.isArray(e) ||
          (n = (function (e, t) {
            if (e) {
              if ('string' == typeof e) return r(e, t);
              var n = {}.toString.call(e).slice(8, -1);
              return (
                'Object' === n && e.constructor && (n = e.constructor.name),
                'Map' === n || 'Set' === n
                  ? Array.from(e)
                  : 'Arguments' === n ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                  ? r(e, t)
                  : void 0
              );
            }
          })(e)) ||
          (t && e && 'number' == typeof e.length)
        ) {
          n && (e = n);
          var a = 0;
          return function () {
            return a >= e.length ? { done: !0 } : { done: !1, value: e[a++] };
          };
        }
        throw new TypeError(
          'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      }
      n.d(t, { A: () => a });
    },
    8820(e, t, n) {
      'use strict';
      function r() {
        return (
          (r = Object.assign
            ? Object.assign.bind()
            : function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = arguments[t];
                  for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
                }
                return e;
              }),
          r.apply(null, arguments)
        );
      }
      n.d(t, { A: () => r });
    },
    2247(e, t, n) {
      'use strict';
      n.d(t, { A: () => a });
      var r = n(5250);
      function a(e, t) {
        (e.prototype = Object.create(t.prototype)),
          (e.prototype.constructor = e),
          (0, r.A)(e, t);
      }
    },
    1463(e, t, n) {
      'use strict';
      function r(e, t) {
        if (null == e) return {};
        var n = {};
        for (var r in e)
          if ({}.hasOwnProperty.call(e, r)) {
            if (-1 !== t.indexOf(r)) continue;
            n[r] = e[r];
          }
        return n;
      }
      n.d(t, { A: () => r });
    },
    5250(e, t, n) {
      'use strict';
      function r(e, t) {
        return (
          (r = Object.setPrototypeOf
            ? Object.setPrototypeOf.bind()
            : function (e, t) {
                return (e.__proto__ = t), e;
              }),
          r(e, t)
        );
      }
      n.d(t, { A: () => r });
    },
    2670(e, t, n) {
      'use strict';
      function r(e) {
        return (
          (r =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    'function' == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? 'symbol'
                    : typeof e;
                }),
          r(e)
        );
      }
      n.d(t, { A: () => o });
      var a = n(5250);
      function o() {
        o = function (e, t) {
          return new n(e, void 0, t);
        };
        var e = RegExp.prototype,
          t = new WeakMap();
        function n(e, r, o) {
          var i = RegExp(e, r);
          return t.set(i, o || t.get(e)), (0, a.A)(i, n.prototype);
        }
        function i(e, n) {
          var r = t.get(n);
          return Object.keys(r).reduce(function (t, n) {
            var a = r[n];
            if ('number' == typeof a) t[n] = e[a];
            else {
              for (var o = 0; void 0 === e[a[o]] && o + 1 < a.length; ) o++;
              t[n] = e[a[o]];
            }
            return t;
          }, Object.create(null));
        }
        return (
          (function (e, t) {
            if ('function' != typeof t && null !== t)
              throw new TypeError('Super expression must either be null or a function');
            (e.prototype = Object.create(t && t.prototype, {
              constructor: { value: e, writable: !0, configurable: !0 },
            })),
              Object.defineProperty(e, 'prototype', { writable: !1 }),
              t && (0, a.A)(e, t);
          })(n, RegExp),
          (n.prototype.exec = function (t) {
            var n = e.exec.call(this, t);
            if (n) {
              n.groups = i(n, this);
              var r = n.indices;
              r && (r.groups = i(r, this));
            }
            return n;
          }),
          (n.prototype[Symbol.replace] = function (n, a) {
            if ('string' == typeof a) {
              var o = t.get(this);
              return e[Symbol.replace].call(
                this,
                n,
                a.replace(/\$<([^>]+)(>|$)/g, function (e, t, n) {
                  if ('' === n) return e;
                  var r = o[t];
                  return Array.isArray(r)
                    ? '$' + r.join('$')
                    : 'number' == typeof r
                    ? '$' + r
                    : '';
                }),
              );
            }
            if ('function' == typeof a) {
              var l = this;
              return e[Symbol.replace].call(this, n, function () {
                var e = arguments;
                return (
                  'object' != r(e[e.length - 1]) && (e = [].slice.call(e)).push(i(e, l)),
                  a.apply(this, e)
                );
              });
            }
            return e[Symbol.replace].call(this, n, a);
          }),
          o.apply(this, arguments)
        );
      }
    },
    3526(e, t, n) {
      'use strict';
      function r(e) {
        var t,
          n,
          a = '';
        if ('string' == typeof e || 'number' == typeof e) a += e;
        else if ('object' == typeof e)
          if (Array.isArray(e)) {
            var o = e.length;
            for (t = 0; t < o; t++) e[t] && (n = r(e[t])) && (a && (a += ' '), (a += n));
          } else for (n in e) e[n] && (a && (a += ' '), (a += n));
        return a;
      }
      const a = function () {
        for (var e, t, n = 0, a = '', o = arguments.length; n < o; n++)
          (e = arguments[n]) && (t = r(e)) && (a && (a += ' '), (a += t));
        return a;
      };
      n.d(t, ['A', 0, a]);
    },
    2017(e, t, n) {
      'use strict';
      n.d(t, { My: () => C, f4: () => ne });
      var r,
        a,
        o,
        i,
        l,
        s,
        u,
        c = n(2503),
        d = n(3526),
        f = Object.create,
        p = Object.defineProperty,
        g = Object.defineProperties,
        m = Object.getOwnPropertyDescriptor,
        h = Object.getOwnPropertyDescriptors,
        y = Object.getOwnPropertyNames,
        v = Object.getOwnPropertySymbols,
        b = Object.getPrototypeOf,
        w = Object.prototype.hasOwnProperty,
        k = Object.prototype.propertyIsEnumerable,
        S = (e, t, n) =>
          t in e
            ? p(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
            : (e[t] = n),
        x = (e, t) => {
          for (var n in t || (t = {})) w.call(t, n) && S(e, n, t[n]);
          if (v) for (var n of v(t)) k.call(t, n) && S(e, n, t[n]);
          return e;
        },
        E = (e, t) => g(e, h(t)),
        _ = (e, t) => {
          var n = {};
          for (var r in e) w.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
          if (null != e && v)
            for (var r of v(e)) t.indexOf(r) < 0 && k.call(e, r) && (n[r] = e[r]);
          return n;
        },
        A =
          ((r = {
            '../../node_modules/.pnpm/prismjs@1.29.0_patch_hash=vrxx3pzkik6jpmgpayxfjunetu/node_modules/prismjs/prism.js'(
              e,
              t,
            ) {
              var n = (function () {
                var e = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
                  t = 0,
                  n = {},
                  r = {
                    util: {
                      encode: function e(t) {
                        return t instanceof a
                          ? new a(t.type, e(t.content), t.alias)
                          : Array.isArray(t)
                          ? t.map(e)
                          : t
                              .replace(/&/g, '&amp;')
                              .replace(/</g, '&lt;')
                              .replace(/\u00a0/g, ' ');
                      },
                      type: function (e) {
                        return Object.prototype.toString.call(e).slice(8, -1);
                      },
                      objId: function (e) {
                        return (
                          e.__id || Object.defineProperty(e, '__id', { value: ++t }),
                          e.__id
                        );
                      },
                      clone: function e(t, n) {
                        var a, o;
                        switch (((n = n || {}), r.util.type(t))) {
                          case 'Object':
                            if (((o = r.util.objId(t)), n[o])) return n[o];
                            for (var i in ((a = {}), (n[o] = a), t))
                              t.hasOwnProperty(i) && (a[i] = e(t[i], n));
                            return a;
                          case 'Array':
                            return (
                              (o = r.util.objId(t)),
                              n[o]
                                ? n[o]
                                : ((a = []),
                                  (n[o] = a),
                                  t.forEach(function (t, r) {
                                    a[r] = e(t, n);
                                  }),
                                  a)
                            );
                          default:
                            return t;
                        }
                      },
                      getLanguage: function (t) {
                        for (; t; ) {
                          var n = e.exec(t.className);
                          if (n) return n[1].toLowerCase();
                          t = t.parentElement;
                        }
                        return 'none';
                      },
                      setLanguage: function (t, n) {
                        (t.className = t.className.replace(RegExp(e, 'gi'), '')),
                          t.classList.add('language-' + n);
                      },
                      isActive: function (e, t, n) {
                        for (var r = 'no-' + t; e; ) {
                          var a = e.classList;
                          if (a.contains(t)) return !0;
                          if (a.contains(r)) return !1;
                          e = e.parentElement;
                        }
                        return !!n;
                      },
                    },
                    languages: {
                      plain: n,
                      plaintext: n,
                      text: n,
                      txt: n,
                      extend: function (e, t) {
                        var n = r.util.clone(r.languages[e]);
                        for (var a in t) n[a] = t[a];
                        return n;
                      },
                      insertBefore: function (e, t, n, a) {
                        var o = (a = a || r.languages)[e],
                          i = {};
                        for (var l in o)
                          if (o.hasOwnProperty(l)) {
                            if (l == t)
                              for (var s in n) n.hasOwnProperty(s) && (i[s] = n[s]);
                            n.hasOwnProperty(l) || (i[l] = o[l]);
                          }
                        var u = a[e];
                        return (
                          (a[e] = i),
                          r.languages.DFS(r.languages, function (t, n) {
                            n === u && t != e && (this[t] = i);
                          }),
                          i
                        );
                      },
                      DFS: function e(t, n, a, o) {
                        o = o || {};
                        var i = r.util.objId;
                        for (var l in t)
                          if (t.hasOwnProperty(l)) {
                            n.call(t, l, t[l], a || l);
                            var s = t[l],
                              u = r.util.type(s);
                            'Object' !== u || o[i(s)]
                              ? 'Array' !== u ||
                                o[i(s)] ||
                                ((o[i(s)] = !0), e(s, n, l, o))
                              : ((o[i(s)] = !0), e(s, n, null, o));
                          }
                      },
                    },
                    plugins: {},
                    highlight: function (e, t, n) {
                      var o = { code: e, grammar: t, language: n };
                      if ((r.hooks.run('before-tokenize', o), !o.grammar))
                        throw new Error(
                          'The language "' + o.language + '" has no grammar.',
                        );
                      return (
                        (o.tokens = r.tokenize(o.code, o.grammar)),
                        r.hooks.run('after-tokenize', o),
                        a.stringify(r.util.encode(o.tokens), o.language)
                      );
                    },
                    tokenize: function (e, t) {
                      var n = t.rest;
                      if (n) {
                        for (var r in n) t[r] = n[r];
                        delete t.rest;
                      }
                      var a = new l();
                      return (
                        s(a, a.head, e),
                        i(e, a, t, a.head, 0),
                        (function (e) {
                          for (var t = [], n = e.head.next; n !== e.tail; )
                            t.push(n.value), (n = n.next);
                          return t;
                        })(a)
                      );
                    },
                    hooks: {
                      all: {},
                      add: function (e, t) {
                        var n = r.hooks.all;
                        (n[e] = n[e] || []), n[e].push(t);
                      },
                      run: function (e, t) {
                        var n = r.hooks.all[e];
                        if (n && n.length) for (var a, o = 0; (a = n[o++]); ) a(t);
                      },
                    },
                    Token: a,
                  };
                function a(e, t, n, r) {
                  (this.type = e),
                    (this.content = t),
                    (this.alias = n),
                    (this.length = 0 | (r || '').length);
                }
                function o(e, t, n, r) {
                  e.lastIndex = t;
                  var a = e.exec(n);
                  if (a && r && a[1]) {
                    var o = a[1].length;
                    (a.index += o), (a[0] = a[0].slice(o));
                  }
                  return a;
                }
                function i(e, t, n, l, c, d) {
                  for (var f in n)
                    if (n.hasOwnProperty(f) && n[f]) {
                      var p = n[f];
                      p = Array.isArray(p) ? p : [p];
                      for (var g = 0; g < p.length; ++g) {
                        if (d && d.cause == f + ',' + g) return;
                        var m = p[g],
                          h = m.inside,
                          y = !!m.lookbehind,
                          v = !!m.greedy,
                          b = m.alias;
                        if (v && !m.pattern.global) {
                          var w = m.pattern.toString().match(/[imsuy]*$/)[0];
                          m.pattern = RegExp(m.pattern.source, w + 'g');
                        }
                        for (
                          var k = m.pattern || m, S = l.next, x = c;
                          S !== t.tail && !(d && x >= d.reach);
                          x += S.value.length, S = S.next
                        ) {
                          var E = S.value;
                          if (t.length > e.length) return;
                          if (!(E instanceof a)) {
                            var _,
                              A = 1;
                            if (v) {
                              if (!(_ = o(k, x, e, y)) || _.index >= e.length) break;
                              var C = _.index,
                                T = _.index + _[0].length,
                                N = x;
                              for (N += S.value.length; C >= N; )
                                N += (S = S.next).value.length;
                              if (((x = N -= S.value.length), S.value instanceof a))
                                continue;
                              for (
                                var O = S;
                                O !== t.tail && (N < T || 'string' == typeof O.value);
                                O = O.next
                              )
                                A++, (N += O.value.length);
                              A--, (E = e.slice(x, N)), (_.index -= x);
                            } else if (!(_ = o(k, 0, E, y))) continue;
                            C = _.index;
                            var P = _[0],
                              j = E.slice(0, C),
                              L = E.slice(C + P.length),
                              I = x + E.length;
                            d && I > d.reach && (d.reach = I);
                            var F = S.prev;
                            if (
                              (j && ((F = s(t, F, j)), (x += j.length)),
                              u(t, F, A),
                              (S = s(t, F, new a(f, h ? r.tokenize(P, h) : P, b, P))),
                              L && s(t, S, L),
                              A > 1)
                            ) {
                              var R = { cause: f + ',' + g, reach: I };
                              i(e, t, n, S.prev, x, R),
                                d && R.reach > d.reach && (d.reach = R.reach);
                            }
                          }
                        }
                      }
                    }
                }
                function l() {
                  var e = { value: null, prev: null, next: null },
                    t = { value: null, prev: e, next: null };
                  (e.next = t), (this.head = e), (this.tail = t), (this.length = 0);
                }
                function s(e, t, n) {
                  var r = t.next,
                    a = { value: n, prev: t, next: r };
                  return (t.next = a), (r.prev = a), e.length++, a;
                }
                function u(e, t, n) {
                  for (var r = t.next, a = 0; a < n && r !== e.tail; a++) r = r.next;
                  (t.next = r), (r.prev = t), (e.length -= a);
                }
                return (
                  (a.stringify = function e(t, n) {
                    if ('string' == typeof t) return t;
                    if (Array.isArray(t)) {
                      var a = '';
                      return (
                        t.forEach(function (t) {
                          a += e(t, n);
                        }),
                        a
                      );
                    }
                    var o = {
                        type: t.type,
                        content: e(t.content, n),
                        tag: 'span',
                        classes: ['token', t.type],
                        attributes: {},
                        language: n,
                      },
                      i = t.alias;
                    i &&
                      (Array.isArray(i)
                        ? Array.prototype.push.apply(o.classes, i)
                        : o.classes.push(i)),
                      r.hooks.run('wrap', o);
                    var l = '';
                    for (var s in o.attributes)
                      l +=
                        ' ' +
                        s +
                        '="' +
                        (o.attributes[s] || '').replace(/"/g, '&quot;') +
                        '"';
                    return (
                      '<' +
                      o.tag +
                      ' class="' +
                      o.classes.join(' ') +
                      '"' +
                      l +
                      '>' +
                      o.content +
                      '</' +
                      o.tag +
                      '>'
                    );
                  }),
                  r
                );
              })();
              (t.exports = n), (n.default = n);
            },
          }),
          function () {
            return a || (0, r[y(r)[0]])((a = { exports: {} }).exports, a), a.exports;
          }),
        C = ((e, t, n) => (
          (n = null != e ? f(b(e)) : {}),
          ((e, t, n, r) => {
            if ((t && 'object' == typeof t) || 'function' == typeof t)
              for (let a of y(t))
                w.call(e, a) ||
                  a === n ||
                  p(e, a, {
                    get: () => t[a],
                    enumerable: !(r = m(t, a)) || r.enumerable,
                  });
            return e;
          })(
            !t && e && e.__esModule ? n : p(n, 'default', { value: e, enumerable: !0 }),
            e,
          )
        ))(A());
      (C.languages.markup = {
        comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
        prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
        doctype: {
          pattern:
            /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
          greedy: !0,
          inside: {
            'internal-subset': {
              pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
              lookbehind: !0,
              greedy: !0,
              inside: null,
            },
            string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
            punctuation: /^<!|>$|[[\]]/,
            'doctype-tag': /^DOCTYPE/i,
            name: /[^\s<>'"]+/,
          },
        },
        cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
        tag: {
          pattern:
            /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
          greedy: !0,
          inside: {
            tag: {
              pattern: /^<\/?[^\s>\/]+/,
              inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
            },
            'special-attr': [],
            'attr-value': {
              pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
              inside: {
                punctuation: [
                  { pattern: /^=/, alias: 'attr-equals' },
                  { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
                ],
              },
            },
            punctuation: /\/?>/,
            'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } },
          },
        },
        entity: [
          { pattern: /&[\da-z]{1,8};/i, alias: 'named-entity' },
          /&#x?[\da-f]{1,8};/i,
        ],
      }),
        (C.languages.markup.tag.inside['attr-value'].inside.entity =
          C.languages.markup.entity),
        (C.languages.markup.doctype.inside['internal-subset'].inside =
          C.languages.markup),
        C.hooks.add('wrap', function (e) {
          'entity' === e.type && (e.attributes.title = e.content.replace(/&amp;/, '&'));
        }),
        Object.defineProperty(C.languages.markup.tag, 'addInlined', {
          value: function (e, t) {
            var n;
            ((t =
              (((n =
                (((n = {})['language-' + t] = {
                  pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                  lookbehind: !0,
                  inside: C.languages[t],
                }),
                (n.cdata = /^<!\[CDATA\[|\]\]>$/i),
                {
                  'included-cdata': { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: n },
                }))['language-' + t] = { pattern: /[\s\S]+/, inside: C.languages[t] }),
              {}))[e] = {
              pattern: RegExp(
                /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
                  /__/g,
                  function () {
                    return e;
                  },
                ),
                'i',
              ),
              lookbehind: !0,
              greedy: !0,
              inside: n,
            }),
              C.languages.insertBefore('markup', 'cdata', t);
          },
        }),
        Object.defineProperty(C.languages.markup.tag, 'addAttribute', {
          value: function (e, t) {
            C.languages.markup.tag.inside['special-attr'].push({
              pattern: RegExp(
                /(^|["'\s])/.source +
                  '(?:' +
                  e +
                  ')' +
                  /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                'i',
              ),
              lookbehind: !0,
              inside: {
                'attr-name': /^[^\s=]+/,
                'attr-value': {
                  pattern: /=[\s\S]+/,
                  inside: {
                    value: {
                      pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                      lookbehind: !0,
                      alias: [t, 'language-' + t],
                      inside: C.languages[t],
                    },
                    punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/],
                  },
                },
              },
            });
          },
        }),
        (C.languages.html = C.languages.markup),
        (C.languages.mathml = C.languages.markup),
        (C.languages.svg = C.languages.markup),
        (C.languages.xml = C.languages.extend('markup', {})),
        (C.languages.ssml = C.languages.xml),
        (C.languages.atom = C.languages.xml),
        (C.languages.rss = C.languages.xml),
        (o = C),
        (i = { pattern: /\\[\\(){}[\]^$+*?|.]/, alias: 'escape' }),
        (s =
          '(?:[^\\\\-]|' +
          (l =
            /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|0[0-7]{0,2}|[123][0-7]{2}|c[a-zA-Z]|.)/)
            .source +
          ')'),
        (s = RegExp(s + '-' + s)),
        (u = { pattern: /(<|')[^<>']+(?=[>']$)/, lookbehind: !0, alias: 'variable' }),
        (o.languages.regex = {
          'char-class': {
            pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
            lookbehind: !0,
            inside: {
              'char-class-negation': {
                pattern: /(^\[)\^/,
                lookbehind: !0,
                alias: 'operator',
              },
              'char-class-punctuation': { pattern: /^\[|\]$/, alias: 'punctuation' },
              range: {
                pattern: s,
                inside: {
                  escape: l,
                  'range-punctuation': { pattern: /-/, alias: 'operator' },
                },
              },
              'special-escape': i,
              'char-set': { pattern: /\\[wsd]|\\p\{[^{}]+\}/i, alias: 'class-name' },
              escape: l,
            },
          },
          'special-escape': i,
          'char-set': { pattern: /\.|\\[wsd]|\\p\{[^{}]+\}/i, alias: 'class-name' },
          backreference: [
            { pattern: /\\(?![123][0-7]{2})[1-9]/, alias: 'keyword' },
            { pattern: /\\k<[^<>']+>/, alias: 'keyword', inside: { 'group-name': u } },
          ],
          anchor: { pattern: /[$^]|\\[ABbGZz]/, alias: 'function' },
          escape: l,
          group: [
            {
              pattern:
                /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
              alias: 'punctuation',
              inside: { 'group-name': u },
            },
            { pattern: /\)/, alias: 'punctuation' },
          ],
          quantifier: { pattern: /(?:[+*?]|\{\d+(?:,\d*)?\})[?+]?/, alias: 'number' },
          alternation: { pattern: /\|/, alias: 'keyword' },
        }),
        (C.languages.clike = {
          comment: [
            { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
            { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
          ],
          string: {
            pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: !0,
          },
          'class-name': {
            pattern:
              /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
            lookbehind: !0,
            inside: { punctuation: /[.\\]/ },
          },
          keyword:
            /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
          boolean: /\b(?:false|true)\b/,
          function: /\b\w+(?=\()/,
          number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
          operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
          punctuation: /[{}[\];(),.:]/,
        }),
        (C.languages.javascript = C.languages.extend('clike', {
          'class-name': [
            C.languages.clike['class-name'],
            {
              pattern:
                /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
              lookbehind: !0,
            },
          ],
          keyword: [
            { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
            {
              pattern:
                /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
              lookbehind: !0,
            },
          ],
          function:
            /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
          number: {
            pattern: RegExp(
              /(^|[^\w$])/.source +
                '(?:' +
                /NaN|Infinity/.source +
                '|' +
                /0[bB][01]+(?:_[01]+)*n?/.source +
                '|' +
                /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                '|' +
                /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                '|' +
                /\d+(?:_\d+)*n/.source +
                '|' +
                /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
                  .source +
                ')' +
                /(?![\w$])/.source,
            ),
            lookbehind: !0,
          },
          operator:
            /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
        })),
        (C.languages.javascript['class-name'][0].pattern =
          /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
        C.languages.insertBefore('javascript', 'keyword', {
          regex: {
            pattern: RegExp(
              /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
                /\//.source +
                '(?:' +
                /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
                '|' +
                /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
                  .source +
                ')' +
                /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source,
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
              'regex-source': {
                pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                lookbehind: !0,
                alias: 'language-regex',
                inside: C.languages.regex,
              },
              'regex-delimiter': /^\/|\/$/,
              'regex-flags': /^[a-z]+$/,
            },
          },
          'function-variable': {
            pattern:
              /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
            alias: 'function',
          },
          parameter: [
            {
              pattern:
                /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
              lookbehind: !0,
              inside: C.languages.javascript,
            },
            {
              pattern:
                /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
              lookbehind: !0,
              inside: C.languages.javascript,
            },
            {
              pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
              lookbehind: !0,
              inside: C.languages.javascript,
            },
            {
              pattern:
                /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
              lookbehind: !0,
              inside: C.languages.javascript,
            },
          ],
          constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
        }),
        C.languages.insertBefore('javascript', 'string', {
          hashbang: { pattern: /^#!.*/, greedy: !0, alias: 'comment' },
          'template-string': {
            pattern:
              /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
            greedy: !0,
            inside: {
              'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
              interpolation: {
                pattern:
                  /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                lookbehind: !0,
                inside: {
                  'interpolation-punctuation': {
                    pattern: /^\$\{|\}$/,
                    alias: 'punctuation',
                  },
                  rest: C.languages.javascript,
                },
              },
              string: /[\s\S]+/,
            },
          },
          'string-property': {
            pattern:
              /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
            lookbehind: !0,
            greedy: !0,
            alias: 'property',
          },
        }),
        C.languages.insertBefore('javascript', 'operator', {
          'literal-property': {
            pattern:
              /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
            lookbehind: !0,
            alias: 'property',
          },
        }),
        C.languages.markup &&
          (C.languages.markup.tag.addInlined('script', 'javascript'),
          C.languages.markup.tag.addAttribute(
            /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
              .source,
            'javascript',
          )),
        (C.languages.js = C.languages.javascript),
        (C.languages.actionscript = C.languages.extend('javascript', {
          keyword:
            /\b(?:as|break|case|catch|class|const|default|delete|do|dynamic|each|else|extends|final|finally|for|function|get|if|implements|import|in|include|instanceof|interface|internal|is|namespace|native|new|null|override|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|use|var|void|while|with)\b/,
          operator: /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/,
        })),
        (C.languages.actionscript['class-name'].alias = 'function'),
        delete C.languages.actionscript.parameter,
        delete C.languages.actionscript['literal-property'],
        C.languages.markup &&
          C.languages.insertBefore('actionscript', 'string', {
            xml: {
              pattern:
                /(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\[\s\S]|(?!\2)[^\\])*\2)*\s*\/?>/,
              lookbehind: !0,
              inside: C.languages.markup,
            },
          }),
        (function (e) {
          var t = /#(?!\{).+/,
            n = { pattern: /#\{[^}]+\}/, alias: 'variable' };
          (e.languages.coffeescript = e.languages.extend('javascript', {
            comment: t,
            string: [
              { pattern: /'(?:\\[\s\S]|[^\\'])*'/, greedy: !0 },
              {
                pattern: /"(?:\\[\s\S]|[^\\"])*"/,
                greedy: !0,
                inside: { interpolation: n },
              },
            ],
            keyword:
              /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
            'class-member': { pattern: /@(?!\d)\w+/, alias: 'variable' },
          })),
            e.languages.insertBefore('coffeescript', 'comment', {
              'multiline-comment': { pattern: /###[\s\S]+?###/, alias: 'comment' },
              'block-regex': {
                pattern: /\/{3}[\s\S]*?\/{3}/,
                alias: 'regex',
                inside: { comment: t, interpolation: n },
              },
            }),
            e.languages.insertBefore('coffeescript', 'string', {
              'inline-javascript': {
                pattern: /`(?:\\[\s\S]|[^\\`])*`/,
                inside: {
                  delimiter: { pattern: /^`|`$/, alias: 'punctuation' },
                  script: {
                    pattern: /[\s\S]+/,
                    alias: 'language-javascript',
                    inside: e.languages.javascript,
                  },
                },
              },
              'multiline-string': [
                { pattern: /'''[\s\S]*?'''/, greedy: !0, alias: 'string' },
                {
                  pattern: /"""[\s\S]*?"""/,
                  greedy: !0,
                  alias: 'string',
                  inside: { interpolation: n },
                },
              ],
            }),
            e.languages.insertBefore('coffeescript', 'keyword', {
              property: /(?!\d)\w+(?=\s*:(?!:))/,
            }),
            delete e.languages.coffeescript['template-string'],
            (e.languages.coffee = e.languages.coffeescript);
        })(C),
        (function (e) {
          var t = (e.languages.javadoclike = {
            parameter: {
              pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,
              lookbehind: !0,
            },
            keyword: {
              pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
              lookbehind: !0,
            },
            punctuation: /[{}]/,
          });
          Object.defineProperty(t, 'addSupport', {
            value: function (t, n) {
              (t = 'string' == typeof t ? [t] : t).forEach(function (t) {
                var r = function (e) {
                    e.inside || (e.inside = {}), (e.inside.rest = n);
                  },
                  a = 'doc-comment';
                if ((o = e.languages[t])) {
                  var o,
                    i = o[a];
                  if (
                    ((i =
                      i ||
                      (o = e.languages.insertBefore(t, 'comment', {
                        'doc-comment': {
                          pattern: /(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,
                          lookbehind: !0,
                          alias: 'comment',
                        },
                      }))[a]) instanceof RegExp && (i = o[a] = { pattern: i }),
                    Array.isArray(i))
                  )
                    for (var l = 0, s = i.length; l < s; l++)
                      i[l] instanceof RegExp && (i[l] = { pattern: i[l] }), r(i[l]);
                  else r(i);
                }
              });
            },
          }),
            t.addSupport(['java', 'javascript', 'php'], t);
        })(C),
        (function (e) {
          var t =
            /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
          (t =
            ((e.languages.css = {
              comment: /\/\*[\s\S]*?\*\//,
              atrule: {
                pattern: RegExp(
                  '@[\\w-](?:' +
                    /[^;{\s"']|\s+(?!\s)/.source +
                    '|' +
                    t.source +
                    ')*?' +
                    /(?:;|(?=\s*\{))/.source,
                ),
                inside: {
                  rule: /^@[\w-]+/,
                  'selector-function-argument': {
                    pattern:
                      /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                    lookbehind: !0,
                    alias: 'selector',
                  },
                  keyword: {
                    pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                    lookbehind: !0,
                  },
                },
              },
              url: {
                pattern: RegExp(
                  '\\burl\\((?:' +
                    t.source +
                    '|' +
                    /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
                    ')\\)',
                  'i',
                ),
                greedy: !0,
                inside: {
                  function: /^url/i,
                  punctuation: /^\(|\)$/,
                  string: { pattern: RegExp('^' + t.source + '$'), alias: 'url' },
                },
              },
              selector: {
                pattern: RegExp(
                  '(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' +
                    t.source +
                    ')*(?=\\s*\\{)',
                ),
                lookbehind: !0,
              },
              string: { pattern: t, greedy: !0 },
              property: {
                pattern:
                  /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                lookbehind: !0,
              },
              important: /!important\b/i,
              function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
              punctuation: /[(){};:,]/,
            }),
            (e.languages.css.atrule.inside.rest = e.languages.css),
            e.languages.markup)) &&
            (t.tag.addInlined('style', 'css'), t.tag.addAttribute('style', 'css'));
        })(C),
        (function (e) {
          var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            n =
              ((t =
                ((e.languages.css.selector = {
                  pattern: e.languages.css.selector.pattern,
                  lookbehind: !0,
                  inside: (t = {
                    'pseudo-element':
                      /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
                    'pseudo-class': /:[-\w]+/,
                    class: /\.[-\w]+/,
                    id: /#[-\w]+/,
                    attribute: {
                      pattern: RegExp('\\[(?:[^[\\]"\']|' + t.source + ')*\\]'),
                      greedy: !0,
                      inside: {
                        punctuation: /^\[|\]$/,
                        'case-sensitivity': {
                          pattern: /(\s)[si]$/i,
                          lookbehind: !0,
                          alias: 'keyword',
                        },
                        namespace: {
                          pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
                          lookbehind: !0,
                          inside: { punctuation: /\|$/ },
                        },
                        'attr-name': {
                          pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/,
                          lookbehind: !0,
                        },
                        'attr-value': [
                          t,
                          {
                            pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/,
                            lookbehind: !0,
                          },
                        ],
                        operator: /[|~*^$]?=/,
                      },
                    },
                    'n-th': [
                      {
                        pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
                        lookbehind: !0,
                        inside: { number: /[\dn]+/, operator: /[+-]/ },
                      },
                      { pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i, lookbehind: !0 },
                    ],
                    combinator: />|\+|~|\|\|/,
                    punctuation: /[(),]/,
                  }),
                }),
                (e.languages.css.atrule.inside['selector-function-argument'].inside = t),
                e.languages.insertBefore('css', 'property', {
                  variable: {
                    pattern:
                      /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
                    lookbehind: !0,
                  },
                }),
                { pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/, lookbehind: !0 })),
              { pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/, lookbehind: !0 });
          e.languages.insertBefore('css', 'function', {
            operator: { pattern: /(\s)[+\-*\/](?=\s)/, lookbehind: !0 },
            hexcode: { pattern: /\B#[\da-f]{3,8}\b/i, alias: 'color' },
            color: [
              {
                pattern:
                  /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|RebeccaPurple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
                lookbehind: !0,
              },
              {
                pattern:
                  /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
                inside: {
                  unit: t,
                  number: n,
                  function: /[\w-]+(?=\()/,
                  punctuation: /[(),]/,
                },
              },
            ],
            entity: /\\[\da-f]{1,8}/i,
            unit: t,
            number: n,
          });
        })(C),
        (function (e) {
          var t = /[*&][^\s[\]{},]+/,
            n =
              /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
            r =
              '(?:' +
              n.source +
              '(?:[ \t]+' +
              t.source +
              ')?|' +
              t.source +
              '(?:[ \t]+' +
              n.source +
              ')?)',
            a =
              /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(
                /<PLAIN>/g,
                function () {
                  return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/
                    .source;
                },
              ),
            o = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;
          function i(e, t) {
            t = (t || '').replace(/m/g, '') + 'm';
            var n =
              /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source
                .replace(/<<prop>>/g, function () {
                  return r;
                })
                .replace(/<<value>>/g, function () {
                  return e;
                });
            return RegExp(n, t);
          }
          (e.languages.yaml = {
            scalar: {
              pattern: RegExp(
                /([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
                  /<<prop>>/g,
                  function () {
                    return r;
                  },
                ),
              ),
              lookbehind: !0,
              alias: 'string',
            },
            comment: /#.*/,
            key: {
              pattern: RegExp(
                /((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source
                  .replace(/<<prop>>/g, function () {
                    return r;
                  })
                  .replace(/<<key>>/g, function () {
                    return '(?:' + a + '|' + o + ')';
                  }),
              ),
              lookbehind: !0,
              greedy: !0,
              alias: 'atrule',
            },
            directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: 'important' },
            datetime: {
              pattern: i(
                /\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/
                  .source,
              ),
              lookbehind: !0,
              alias: 'number',
            },
            boolean: {
              pattern: i(/false|true/.source, 'i'),
              lookbehind: !0,
              alias: 'important',
            },
            null: {
              pattern: i(/null|~/.source, 'i'),
              lookbehind: !0,
              alias: 'important',
            },
            string: { pattern: i(o), lookbehind: !0, greedy: !0 },
            number: {
              pattern: i(
                /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/
                  .source,
                'i',
              ),
              lookbehind: !0,
            },
            tag: n,
            important: t,
            punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
          }),
            (e.languages.yml = e.languages.yaml);
        })(C),
        (function (e) {
          var t = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;
          function n(e) {
            return (
              (e = e.replace(/<inner>/g, function () {
                return t;
              })),
              RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + e + ')')
            );
          }
          var r = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source,
            a = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(
              /__/g,
              function () {
                return r;
              },
            ),
            o = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/
              .source,
            i =
              ((e.languages.markdown = e.languages.extend('markup', {})),
              e.languages.insertBefore('markdown', 'prolog', {
                'front-matter-block': {
                  pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
                  lookbehind: !0,
                  greedy: !0,
                  inside: {
                    punctuation: /^---|---$/,
                    'front-matter': {
                      pattern: /\S+(?:\s+\S+)*/,
                      alias: ['yaml', 'language-yaml'],
                      inside: e.languages.yaml,
                    },
                  },
                },
                blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: 'punctuation' },
                table: {
                  pattern: RegExp('^' + a + o + '(?:' + a + ')*', 'm'),
                  inside: {
                    'table-data-rows': {
                      pattern: RegExp('^(' + a + o + ')(?:' + a + ')*$'),
                      lookbehind: !0,
                      inside: {
                        'table-data': {
                          pattern: RegExp(r),
                          inside: e.languages.markdown,
                        },
                        punctuation: /\|/,
                      },
                    },
                    'table-line': {
                      pattern: RegExp('^(' + a + ')' + o + '$'),
                      lookbehind: !0,
                      inside: { punctuation: /\||:?-{3,}:?/ },
                    },
                    'table-header-row': {
                      pattern: RegExp('^' + a + '$'),
                      inside: {
                        'table-header': {
                          pattern: RegExp(r),
                          alias: 'important',
                          inside: e.languages.markdown,
                        },
                        punctuation: /\|/,
                      },
                    },
                  },
                },
                code: [
                  {
                    pattern:
                      /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
                    lookbehind: !0,
                    alias: 'keyword',
                  },
                  {
                    pattern: /^```[\s\S]*?^```$/m,
                    greedy: !0,
                    inside: {
                      'code-block': {
                        pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                        lookbehind: !0,
                      },
                      'code-language': { pattern: /^(```).+/, lookbehind: !0 },
                      punctuation: /```/,
                    },
                  },
                ],
                title: [
                  {
                    pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
                    alias: 'important',
                    inside: { punctuation: /==+$|--+$/ },
                  },
                  {
                    pattern: /(^\s*)#.+/m,
                    lookbehind: !0,
                    alias: 'important',
                    inside: { punctuation: /^#+|#+$/ },
                  },
                ],
                hr: {
                  pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
                  lookbehind: !0,
                  alias: 'punctuation',
                },
                list: {
                  pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
                  lookbehind: !0,
                  alias: 'punctuation',
                },
                'url-reference': {
                  pattern:
                    /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
                  inside: {
                    variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
                    string:
                      /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                    punctuation: /^[\[\]!:]|[<>]/,
                  },
                  alias: 'url',
                },
                bold: {
                  pattern: n(
                    /\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/
                      .source,
                  ),
                  lookbehind: !0,
                  greedy: !0,
                  inside: {
                    content: {
                      pattern: /(^..)[\s\S]+(?=..$)/,
                      lookbehind: !0,
                      inside: {},
                    },
                    punctuation: /\*\*|__/,
                  },
                },
                italic: {
                  pattern: n(
                    /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
                      .source,
                  ),
                  lookbehind: !0,
                  greedy: !0,
                  inside: {
                    content: { pattern: /(^.)[\s\S]+(?=.$)/, lookbehind: !0, inside: {} },
                    punctuation: /[*_]/,
                  },
                },
                strike: {
                  pattern: n(/(~~?)(?:(?!~)<inner>)+\2/.source),
                  lookbehind: !0,
                  greedy: !0,
                  inside: {
                    content: {
                      pattern: /(^~~?)[\s\S]+(?=\1$)/,
                      lookbehind: !0,
                      inside: {},
                    },
                    punctuation: /~~?/,
                  },
                },
                'code-snippet': {
                  pattern:
                    /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
                  lookbehind: !0,
                  greedy: !0,
                  alias: ['code', 'keyword'],
                },
                url: {
                  pattern: n(
                    /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/
                      .source,
                  ),
                  lookbehind: !0,
                  greedy: !0,
                  inside: {
                    operator: /^!/,
                    content: { pattern: /(^\[)[^\]]+(?=\])/, lookbehind: !0, inside: {} },
                    variable: { pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
                    url: { pattern: /(^\]\()[^\s)]+/, lookbehind: !0 },
                    string: {
                      pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
                      lookbehind: !0,
                    },
                  },
                },
              }),
              ['url', 'bold', 'italic', 'strike'].forEach(function (t) {
                ['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(function (n) {
                  t !== n &&
                    (e.languages.markdown[t].inside.content.inside[n] =
                      e.languages.markdown[n]);
                });
              }),
              e.hooks.add('after-tokenize', function (e) {
                ('markdown' !== e.language && 'md' !== e.language) ||
                  (function e(t) {
                    if (t && 'string' != typeof t)
                      for (var n = 0, r = t.length; n < r; n++) {
                        var a,
                          o = t[n];
                        'code' !== o.type
                          ? e(o.content)
                          : ((a = o.content[1]),
                            (o = o.content[3]),
                            a &&
                              o &&
                              'code-language' === a.type &&
                              'code-block' === o.type &&
                              'string' == typeof a.content &&
                              ((a = a.content
                                .replace(/\b#/g, 'sharp')
                                .replace(/\b\+\+/g, 'pp')),
                              (a =
                                'language-' +
                                (a = (/[a-z][\w-]*/i.exec(a) || [''])[0].toLowerCase())),
                              o.alias
                                ? 'string' == typeof o.alias
                                  ? (o.alias = [o.alias, a])
                                  : o.alias.push(a)
                                : (o.alias = [a])));
                      }
                  })(e.tokens);
              }),
              e.hooks.add('wrap', function (t) {
                if ('code-block' === t.type) {
                  for (var n = '', r = 0, a = t.classes.length; r < a; r++) {
                    var o = t.classes[r];
                    if ((o = /language-(.+)/.exec(o))) {
                      n = o[1];
                      break;
                    }
                  }
                  var u,
                    c = e.languages[n];
                  c
                    ? (t.content = e.highlight(
                        t.content
                          .replace(i, '')
                          .replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function (e, t) {
                            var n;
                            return '#' === (t = t.toLowerCase())[0]
                              ? ((n =
                                  'x' === t[1]
                                    ? parseInt(t.slice(2), 16)
                                    : Number(t.slice(1))),
                                s(n))
                              : l[t] || e;
                          }),
                        c,
                        n,
                      ))
                    : n &&
                      'none' !== n &&
                      e.plugins.autoloader &&
                      ((u =
                        'md-' +
                        new Date().valueOf() +
                        '-' +
                        Math.floor(1e16 * Math.random())),
                      (t.attributes.id = u),
                      e.plugins.autoloader.loadLanguages(n, function () {
                        var t = document.getElementById(u);
                        t &&
                          (t.innerHTML = e.highlight(t.textContent, e.languages[n], n));
                      }));
                }
              }),
              RegExp(e.languages.markup.tag.pattern.source, 'gi')),
            l = { amp: '&', lt: '<', gt: '>', quot: '"' },
            s = String.fromCodePoint || String.fromCharCode;
          e.languages.md = e.languages.markdown;
        })(C),
        (C.languages.graphql = {
          comment: /#.*/,
          description: {
            pattern: /(?:"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*")(?=\s*[a-z_])/i,
            greedy: !0,
            alias: 'string',
            inside: {
              'language-markdown': {
                pattern: /(^"(?:"")?)(?!\1)[\s\S]+(?=\1$)/,
                lookbehind: !0,
                inside: C.languages.markdown,
              },
            },
          },
          string: {
            pattern: /"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*"/,
            greedy: !0,
          },
          number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
          boolean: /\b(?:false|true)\b/,
          variable: /\$[a-z_]\w*/i,
          directive: { pattern: /@[a-z_]\w*/i, alias: 'function' },
          'attr-name': {
            pattern: /\b[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
            greedy: !0,
          },
          'atom-input': { pattern: /\b[A-Z]\w*Input\b/, alias: 'class-name' },
          scalar: /\b(?:Boolean|Float|ID|Int|String)\b/,
          constant: /\b[A-Z][A-Z_\d]*\b/,
          'class-name': {
            pattern:
              /(\b(?:enum|implements|interface|on|scalar|type|union)\s+|&\s*|:\s*|\[)[A-Z_]\w*/,
            lookbehind: !0,
          },
          fragment: {
            pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
            lookbehind: !0,
            alias: 'function',
          },
          'definition-mutation': {
            pattern: /(\bmutation\s+)[a-zA-Z_]\w*/,
            lookbehind: !0,
            alias: 'function',
          },
          'definition-query': {
            pattern: /(\bquery\s+)[a-zA-Z_]\w*/,
            lookbehind: !0,
            alias: 'function',
          },
          keyword:
            /\b(?:directive|enum|extend|fragment|implements|input|interface|mutation|on|query|repeatable|scalar|schema|subscription|type|union)\b/,
          operator: /[!=|&]|\.{3}/,
          'property-query': /\w+(?=\s*\()/,
          object: /\w+(?=\s*\{)/,
          punctuation: /[!(){}\[\]:=,]/,
          property: /\w+/,
        }),
        C.hooks.add('after-tokenize', function (e) {
          if ('graphql' === e.language)
            for (
              var t = e.tokens.filter(function (e) {
                  return (
                    'string' != typeof e && 'comment' !== e.type && 'scalar' !== e.type
                  );
                }),
                n = 0;
              n < t.length;

            ) {
              var r = t[n++];
              if ('keyword' === r.type && 'mutation' === r.content) {
                var a = [];
                if (d(['definition-mutation', 'punctuation']) && '(' === c(1).content) {
                  n += 2;
                  var o = f(/^\($/, /^\)$/);
                  if (-1 === o) continue;
                  for (; n < o; n++) {
                    var i = c(0);
                    'variable' === i.type && (p(i, 'variable-input'), a.push(i.content));
                  }
                  n = o + 1;
                }
                if (
                  d(['punctuation', 'property-query']) &&
                  '{' === c(0).content &&
                  (n++, p(c(0), 'property-mutation'), 0 < a.length)
                ) {
                  var l = f(/^\{$/, /^\}$/);
                  if (-1 !== l)
                    for (var s = n; s < l; s++) {
                      var u = t[s];
                      'variable' === u.type &&
                        0 <= a.indexOf(u.content) &&
                        p(u, 'variable-input');
                    }
                }
              }
            }
          function c(e) {
            return t[n + e];
          }
          function d(e, t) {
            t = t || 0;
            for (var n = 0; n < e.length; n++) {
              var r = c(n + t);
              if (!r || r.type !== e[n]) return;
            }
            return 1;
          }
          function f(e, r) {
            for (var a = 1, o = n; o < t.length; o++) {
              var i = t[o],
                l = i.content;
              if ('punctuation' === i.type && 'string' == typeof l)
                if (e.test(l)) a++;
                else if (r.test(l) && 0 === --a) return o;
            }
            return -1;
          }
          function p(e, t) {
            var n = e.alias;
            n ? Array.isArray(n) || (e.alias = n = [n]) : (e.alias = n = []), n.push(t);
          }
        }),
        (C.languages.sql = {
          comment: {
            pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
            lookbehind: !0,
          },
          variable: [
            { pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/, greedy: !0 },
            /@[\w.$]+/,
          ],
          string: {
            pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
            greedy: !0,
            lookbehind: !0,
          },
          identifier: {
            pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
            greedy: !0,
            lookbehind: !0,
            inside: { punctuation: /^`|`$/ },
          },
          function:
            /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
          keyword:
            /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
          boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
          number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
          operator:
            /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
          punctuation: /[;[\]()`,.]/,
        }),
        (function (e) {
          var t = e.languages.javascript['template-string'],
            n = t.pattern.source,
            r = t.inside.interpolation,
            a = r.inside['interpolation-punctuation'],
            o = r.pattern.source;
          function i(t, r) {
            if (e.languages[t])
              return {
                pattern: RegExp('((?:' + r + ')\\s*)' + n),
                lookbehind: !0,
                greedy: !0,
                inside: {
                  'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
                  'embedded-code': { pattern: /[\s\S]+/, alias: t },
                },
              };
          }
          function l(t, n, r) {
            return (
              (t = { code: t, grammar: n, language: r }),
              e.hooks.run('before-tokenize', t),
              (t.tokens = e.tokenize(t.code, t.grammar)),
              e.hooks.run('after-tokenize', t),
              t.tokens
            );
          }
          function s(t, n, i) {
            var s = e.tokenize(t, {
                interpolation: { pattern: RegExp(o), lookbehind: !0 },
              }),
              u = 0,
              c = {},
              d =
                ((s = l(
                  s
                    .map(function (e) {
                      if ('string' == typeof e) return e;
                      var n, r;
                      for (
                        e = e.content;
                        -1 !==
                        t.indexOf(
                          ((r = u++), (n = '___' + i.toUpperCase() + '_' + r + '___')),
                        );

                      );
                      return (c[n] = e), n;
                    })
                    .join(''),
                  n,
                  i,
                )),
                Object.keys(c));
            return (
              (u = 0),
              (function t(n) {
                for (var o = 0; o < n.length; o++) {
                  if (u >= d.length) return;
                  var i,
                    s,
                    f,
                    p,
                    g,
                    m,
                    h,
                    y = n[o];
                  'string' == typeof y || 'string' == typeof y.content
                    ? ((i = d[u]),
                      -1 !==
                        (h = (m = 'string' == typeof y ? y : y.content).indexOf(i)) &&
                        (++u,
                        (s = m.substring(0, h)),
                        (g = c[i]),
                        (f = void 0),
                        ((p = {})['interpolation-punctuation'] = a),
                        3 === (p = e.tokenize(g, p)).length &&
                          ((f = [1, 1]).push.apply(
                            f,
                            l(p[1], e.languages.javascript, 'javascript'),
                          ),
                          p.splice.apply(p, f)),
                        (f = new e.Token('interpolation', p, r.alias, g)),
                        (p = m.substring(h + i.length)),
                        (g = []),
                        s && g.push(s),
                        g.push(f),
                        p && (t((m = [p])), g.push.apply(g, m)),
                        'string' == typeof y
                          ? (n.splice.apply(n, [o, 1].concat(g)), (o += g.length - 1))
                          : (y.content = g)))
                    : ((h = y.content), Array.isArray(h) ? t(h) : t([h]));
                }
              })(s),
              new e.Token(i, s, 'language-' + i, t)
            );
          }
          e.languages.javascript['template-string'] = [
            i(
              'css',
              /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/
                .source,
            ),
            i('html', /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source),
            i('svg', /\bsvg/.source),
            i('markdown', /\b(?:markdown|md)/.source),
            i('graphql', /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source),
            i('sql', /\bsql/.source),
            t,
          ].filter(Boolean);
          var u = { javascript: !0, js: !0, typescript: !0, ts: !0, jsx: !0, tsx: !0 };
          function c(e) {
            return 'string' == typeof e
              ? e
              : Array.isArray(e)
              ? e.map(c).join('')
              : c(e.content);
          }
          e.hooks.add('after-tokenize', function (t) {
            t.language in u &&
              (function t(n) {
                for (var r = 0, a = n.length; r < a; r++) {
                  var o,
                    i,
                    l,
                    u = n[r];
                  'string' != typeof u &&
                    ((o = u.content),
                    Array.isArray(o)
                      ? 'template-string' === u.type
                        ? ((u = o[1]),
                          3 === o.length &&
                            'string' != typeof u &&
                            'embedded-code' === u.type &&
                            ((i = c(u)),
                            (u = u.alias),
                            (u = Array.isArray(u) ? u[0] : u),
                            (l = e.languages[u])) &&
                            (o[1] = s(i, l, u)))
                        : t(o)
                      : 'string' != typeof o && t([o]));
                }
              })(t.tokens);
          });
        })(C),
        (function (e) {
          (e.languages.typescript = e.languages.extend('javascript', {
            'class-name': {
              pattern:
                /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
              lookbehind: !0,
              greedy: !0,
              inside: null,
            },
            builtin:
              /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
          })),
            e.languages.typescript.keyword.push(
              /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
              /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
              /\btype\b(?=\s*(?:[\{*]|$))/,
            ),
            delete e.languages.typescript.parameter,
            delete e.languages.typescript['literal-property'];
          var t = e.languages.extend('typescript', {});
          delete t['class-name'],
            (e.languages.typescript['class-name'].inside = t),
            e.languages.insertBefore('typescript', 'function', {
              decorator: {
                pattern: /@[$\w\xA0-\uFFFF]+/,
                inside: {
                  at: { pattern: /^@/, alias: 'operator' },
                  function: /^[\s\S]+/,
                },
              },
              'generic-function': {
                pattern:
                  /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
                greedy: !0,
                inside: {
                  function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
                  generic: { pattern: /<[\s\S]+/, alias: 'class-name', inside: t },
                },
              },
            }),
            (e.languages.ts = e.languages.typescript);
        })(C),
        (function (e) {
          var t = e.languages.javascript,
            n = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source,
            r = '(@(?:arg|argument|param|property)\\s+(?:' + n + '\\s+)?)';
          (e.languages.jsdoc = e.languages.extend('javadoclike', {
            parameter: {
              pattern: RegExp(r + /(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),
              lookbehind: !0,
              inside: { punctuation: /\./ },
            },
          })),
            e.languages.insertBefore('jsdoc', 'keyword', {
              'optional-parameter': {
                pattern: RegExp(
                  r + /\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source,
                ),
                lookbehind: !0,
                inside: {
                  parameter: {
                    pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
                    lookbehind: !0,
                    inside: { punctuation: /\./ },
                  },
                  code: {
                    pattern: /(=)[\s\S]*(?=\]$)/,
                    lookbehind: !0,
                    inside: t,
                    alias: 'language-javascript',
                  },
                  punctuation: /[=[\]]/,
                },
              },
              'class-name': [
                {
                  pattern: RegExp(
                    /(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(
                      /<TYPE>/g,
                      function () {
                        return n;
                      },
                    ),
                  ),
                  lookbehind: !0,
                  inside: { punctuation: /\./ },
                },
                {
                  pattern: RegExp('(@[a-z]+\\s+)' + n),
                  lookbehind: !0,
                  inside: {
                    string: t.string,
                    number: t.number,
                    boolean: t.boolean,
                    keyword: e.languages.typescript.keyword,
                    operator: /=>|\.\.\.|[&|?:*]/,
                    punctuation: /[.,;=<>{}()[\]]/,
                  },
                },
              ],
              example: {
                pattern:
                  /(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
                lookbehind: !0,
                inside: {
                  code: {
                    pattern: /^([\t ]*(?:\*\s*)?)\S.*$/m,
                    lookbehind: !0,
                    inside: t,
                    alias: 'language-javascript',
                  },
                },
              },
            }),
            e.languages.javadoclike.addSupport('javascript', e.languages.jsdoc);
        })(C),
        (function (e) {
          (e.languages.flow = e.languages.extend('javascript', {})),
            e.languages.insertBefore('flow', 'keyword', {
              type: [
                {
                  pattern:
                    /\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
                  alias: 'class-name',
                },
              ],
            }),
            (e.languages.flow['function-variable'].pattern =
              /(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i),
            delete e.languages.flow.parameter,
            e.languages.insertBefore('flow', 'operator', {
              'flow-punctuation': { pattern: /\{\||\|\}/, alias: 'punctuation' },
            }),
            Array.isArray(e.languages.flow.keyword) ||
              (e.languages.flow.keyword = [e.languages.flow.keyword]),
            e.languages.flow.keyword.unshift(
              {
                pattern: /(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/,
                lookbehind: !0,
              },
              {
                pattern:
                  /(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,
                lookbehind: !0,
              },
            );
        })(C),
        (C.languages.n4js = C.languages.extend('javascript', {
          keyword:
            /\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
        })),
        C.languages.insertBefore('n4js', 'constant', {
          annotation: { pattern: /@+\w+/, alias: 'operator' },
        }),
        (C.languages.n4jsd = C.languages.n4js),
        (function (e) {
          function t(e, t) {
            return RegExp(
              e.replace(/<ID>/g, function () {
                return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/.source;
              }),
              t,
            );
          }
          e.languages.insertBefore('javascript', 'function-variable', {
            'method-variable': {
              pattern: RegExp(
                '(\\.\\s*)' + e.languages.javascript['function-variable'].pattern.source,
              ),
              lookbehind: !0,
              alias: ['function-variable', 'method', 'function', 'property-access'],
            },
          }),
            e.languages.insertBefore('javascript', 'function', {
              method: {
                pattern: RegExp('(\\.\\s*)' + e.languages.javascript.function.source),
                lookbehind: !0,
                alias: ['function', 'property-access'],
              },
            }),
            e.languages.insertBefore('javascript', 'constant', {
              'known-class-name': [
                {
                  pattern:
                    /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
                  alias: 'class-name',
                },
                { pattern: /\b(?:[A-Z]\w*)Error\b/, alias: 'class-name' },
              ],
            }),
            e.languages.insertBefore('javascript', 'keyword', {
              imports: {
                pattern: t(
                  /(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/
                    .source,
                ),
                lookbehind: !0,
                inside: e.languages.javascript,
              },
              exports: {
                pattern: t(
                  /(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/
                    .source,
                ),
                lookbehind: !0,
                inside: e.languages.javascript,
              },
            }),
            e.languages.javascript.keyword.unshift(
              { pattern: /\b(?:as|default|export|from|import)\b/, alias: 'module' },
              {
                pattern:
                  /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
                alias: 'control-flow',
              },
              { pattern: /\bnull\b/, alias: ['null', 'nil'] },
              { pattern: /\bundefined\b/, alias: 'nil' },
            ),
            e.languages.insertBefore('javascript', 'operator', {
              spread: { pattern: /\.{3}/, alias: 'operator' },
              arrow: { pattern: /=>/, alias: 'operator' },
            }),
            e.languages.insertBefore('javascript', 'punctuation', {
              'property-access': { pattern: t(/(\.\s*)#?<ID>/.source), lookbehind: !0 },
              'maybe-class-name': {
                pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
                lookbehind: !0,
              },
              dom: {
                pattern:
                  /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
                alias: 'variable',
              },
              console: { pattern: /\bconsole(?=\s*\.)/, alias: 'class-name' },
            });
          for (
            var n = [
                'function',
                'function-variable',
                'method',
                'method-variable',
                'property-access',
              ],
              r = 0;
            r < n.length;
            r++
          ) {
            var a = n[r],
              o = e.languages.javascript[a];
            a =
              (o =
                'RegExp' === e.util.type(o)
                  ? (e.languages.javascript[a] = { pattern: o })
                  : o).inside || {};
            (o.inside = a)['maybe-class-name'] = /^[A-Z][\s\S]*/;
          }
        })(C),
        (function (e) {
          var t = e.util.clone(e.languages.javascript),
            n = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source,
            r = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source,
            a = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
          function o(e, t) {
            return (
              (e = e
                .replace(/<S>/g, function () {
                  return n;
                })
                .replace(/<BRACES>/g, function () {
                  return r;
                })
                .replace(/<SPREAD>/g, function () {
                  return a;
                })),
              RegExp(e, t)
            );
          }
          function i(t) {
            for (var n = [], r = 0; r < t.length; r++) {
              var a = t[r],
                o = !1;
              'string' != typeof a &&
                ('tag' === a.type && a.content[0] && 'tag' === a.content[0].type
                  ? '</' === a.content[0].content[0].content
                    ? 0 < n.length &&
                      n[n.length - 1].tagName === l(a.content[0].content[1]) &&
                      n.pop()
                    : '/>' !== a.content[a.content.length - 1].content &&
                      n.push({ tagName: l(a.content[0].content[1]), openedBraces: 0 })
                  : 0 < n.length && 'punctuation' === a.type && '{' === a.content
                  ? n[n.length - 1].openedBraces++
                  : 0 < n.length &&
                    0 < n[n.length - 1].openedBraces &&
                    'punctuation' === a.type &&
                    '}' === a.content
                  ? n[n.length - 1].openedBraces--
                  : (o = !0)),
                (o || 'string' == typeof a) &&
                  0 < n.length &&
                  0 === n[n.length - 1].openedBraces &&
                  ((o = l(a)),
                  r < t.length - 1 &&
                    ('string' == typeof t[r + 1] || 'plain-text' === t[r + 1].type) &&
                    ((o += l(t[r + 1])), t.splice(r + 1, 1)),
                  0 < r &&
                    ('string' == typeof t[r - 1] || 'plain-text' === t[r - 1].type) &&
                    ((o = l(t[r - 1]) + o), t.splice(r - 1, 1), r--),
                  (t[r] = new e.Token('plain-text', o, null, o))),
                a.content && 'string' != typeof a.content && i(a.content);
            }
          }
          (a = o(a).source),
            (e.languages.jsx = e.languages.extend('markup', t)),
            (e.languages.jsx.tag.pattern = o(
              /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/
                .source,
            )),
            (e.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/),
            (e.languages.jsx.tag.inside['attr-value'].pattern =
              /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/),
            (e.languages.jsx.tag.inside.tag.inside['class-name'] =
              /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
            (e.languages.jsx.tag.inside.comment = t.comment),
            e.languages.insertBefore(
              'inside',
              'attr-name',
              { spread: { pattern: o(/<SPREAD>/.source), inside: e.languages.jsx } },
              e.languages.jsx.tag,
            ),
            e.languages.insertBefore(
              'inside',
              'special-attr',
              {
                script: {
                  pattern: o(/=<BRACES>/.source),
                  alias: 'language-javascript',
                  inside: {
                    'script-punctuation': { pattern: /^=(?=\{)/, alias: 'punctuation' },
                    rest: e.languages.jsx,
                  },
                },
              },
              e.languages.jsx.tag,
            );
          var l = function (e) {
            return e
              ? 'string' == typeof e
                ? e
                : 'string' == typeof e.content
                ? e.content
                : e.content.map(l).join('')
              : '';
          };
          e.hooks.add('after-tokenize', function (e) {
            ('jsx' !== e.language && 'tsx' !== e.language) || i(e.tokens);
          });
        })(C),
        (function (e) {
          var t = e.util.clone(e.languages.typescript);
          ((t =
            ((e.languages.tsx = e.languages.extend('jsx', t)),
            delete e.languages.tsx.parameter,
            delete e.languages.tsx['literal-property'],
            e.languages.tsx.tag)).pattern = RegExp(
            /(^|[^\w$]|(?=<\/))/.source + '(?:' + t.pattern.source + ')',
            t.pattern.flags,
          )),
            (t.lookbehind = !0);
        })(C),
        (C.languages.swift = {
          comment: {
            pattern:
              /(^|[^\\:])(?:\/\/.*|\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\/)/,
            lookbehind: !0,
            greedy: !0,
          },
          'string-literal': [
            {
              pattern: RegExp(
                /(^|[^"#])/.source +
                  '(?:' +
                  /"(?:\\(?:\((?:[^()]|\([^()]*\))*\)|\r\n|[^(])|[^\\\r\n"])*"/.source +
                  '|' +
                  /"""(?:\\(?:\((?:[^()]|\([^()]*\))*\)|[^(])|[^\\"]|"(?!""))*"""/
                    .source +
                  ')' +
                  /(?!["#])/.source,
              ),
              lookbehind: !0,
              greedy: !0,
              inside: {
                interpolation: {
                  pattern: /(\\\()(?:[^()]|\([^()]*\))*(?=\))/,
                  lookbehind: !0,
                  inside: null,
                },
                'interpolation-punctuation': {
                  pattern: /^\)|\\\($/,
                  alias: 'punctuation',
                },
                punctuation: /\\(?=[\r\n])/,
                string: /[\s\S]+/,
              },
            },
            {
              pattern: RegExp(
                /(^|[^"#])(#+)/.source +
                  '(?:' +
                  /"(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|\r\n|[^#])|[^\\\r\n])*?"/.source +
                  '|' +
                  /"""(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|[^#])|[^\\])*?"""/.source +
                  ')\\2',
              ),
              lookbehind: !0,
              greedy: !0,
              inside: {
                interpolation: {
                  pattern: /(\\#+\()(?:[^()]|\([^()]*\))*(?=\))/,
                  lookbehind: !0,
                  inside: null,
                },
                'interpolation-punctuation': {
                  pattern: /^\)|\\#+\($/,
                  alias: 'punctuation',
                },
                string: /[\s\S]+/,
              },
            },
          ],
          directive: {
            pattern: RegExp(
              /#/.source +
                '(?:' +
                /(?:elseif|if)\b/.source +
                '(?:[ \t]*' +
                /(?:![ \t]*)?(?:\b\w+\b(?:[ \t]*\((?:[^()]|\([^()]*\))*\))?|\((?:[^()]|\([^()]*\))*\))(?:[ \t]*(?:&&|\|\|))?/
                  .source +
                ')+|' +
                /(?:else|endif)\b/.source +
                ')',
            ),
            alias: 'property',
            inside: {
              'directive-name': /^#\w+/,
              boolean: /\b(?:false|true)\b/,
              number: /\b\d+(?:\.\d+)*\b/,
              operator: /!|&&|\|\||[<>]=?/,
              punctuation: /[(),]/,
            },
          },
          literal: {
            pattern:
              /#(?:colorLiteral|column|dsohandle|file(?:ID|Literal|Path)?|function|imageLiteral|line)\b/,
            alias: 'constant',
          },
          'other-directive': { pattern: /#\w+\b/, alias: 'property' },
          attribute: { pattern: /@\w+/, alias: 'atrule' },
          'function-definition': {
            pattern: /(\bfunc\s+)\w+/,
            lookbehind: !0,
            alias: 'function',
          },
          label: {
            pattern:
              /\b(break|continue)\s+\w+|\b[a-zA-Z_]\w*(?=\s*:\s*(?:for|repeat|while)\b)/,
            lookbehind: !0,
            alias: 'important',
          },
          keyword:
            /\b(?:Any|Protocol|Self|Type|actor|as|assignment|associatedtype|associativity|async|await|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic|else|enum|extension|fallthrough|fileprivate|final|for|func|get|guard|higherThan|if|import|in|indirect|infix|init|inout|internal|is|isolated|lazy|left|let|lowerThan|mutating|none|nonisolated|nonmutating|open|operator|optional|override|postfix|precedencegroup|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|set|some|static|struct|subscript|super|switch|throw|throws|try|typealias|unowned|unsafe|var|weak|where|while|willSet)\b/,
          boolean: /\b(?:false|true)\b/,
          nil: { pattern: /\bnil\b/, alias: 'constant' },
          'short-argument': /\$\d+\b/,
          omit: { pattern: /\b_\b/, alias: 'keyword' },
          number:
            /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
          'class-name': /\b[A-Z](?:[A-Z_\d]*[a-z]\w*)?\b/,
          function: /\b[a-z_]\w*(?=\s*\()/i,
          constant: /\b(?:[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
          operator: /[-+*/%=!<>&|^~?]+|\.[.\-+*/%=!<>&|^~?]+/,
          punctuation: /[{}[\]();,.:\\]/,
        }),
        C.languages.swift['string-literal'].forEach(function (e) {
          e.inside.interpolation.inside = C.languages.swift;
        }),
        (function (e) {
          (e.languages.kotlin = e.languages.extend('clike', {
            keyword: {
              pattern:
                /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
              lookbehind: !0,
            },
            function: [
              { pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/, greedy: !0 },
              { pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/, lookbehind: !0, greedy: !0 },
            ],
            number:
              /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
            operator:
              /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/,
          })),
            delete e.languages.kotlin['class-name'];
          var t = {
            'interpolation-punctuation': { pattern: /^\$\{?|\}$/, alias: 'punctuation' },
            expression: { pattern: /[\s\S]+/, inside: e.languages.kotlin },
          };
          e.languages.insertBefore('kotlin', 'string', {
            'string-literal': [
              {
                pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
                alias: 'multiline',
                inside: {
                  interpolation: { pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i, inside: t },
                  string: /[\s\S]+/,
                },
              },
              {
                pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
                alias: 'singleline',
                inside: {
                  interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
                    lookbehind: !0,
                    inside: t,
                  },
                  string: /[\s\S]+/,
                },
              },
            ],
            char: { pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/, greedy: !0 },
          }),
            delete e.languages.kotlin.string,
            e.languages.insertBefore('kotlin', 'keyword', {
              annotation: {
                pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
                alias: 'builtin',
              },
            }),
            e.languages.insertBefore('kotlin', 'function', {
              label: { pattern: /\b\w+@|@\w+\b/, alias: 'symbol' },
            }),
            (e.languages.kt = e.languages.kotlin),
            (e.languages.kts = e.languages.kotlin);
        })(C),
        (C.languages.c = C.languages.extend('clike', {
          comment: {
            pattern:
              /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
            greedy: !0,
          },
          string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
          'class-name': {
            pattern:
              /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
            lookbehind: !0,
          },
          keyword:
            /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
          function: /\b[a-z_]\w*(?=\s*\()/i,
          number:
            /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
          operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
        })),
        C.languages.insertBefore('c', 'string', {
          char: { pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/, greedy: !0 },
        }),
        C.languages.insertBefore('c', 'string', {
          macro: {
            pattern:
              /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
            lookbehind: !0,
            greedy: !0,
            alias: 'property',
            inside: {
              string: [
                { pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0 },
                C.languages.c.string,
              ],
              char: C.languages.c.char,
              comment: C.languages.c.comment,
              'macro-name': [
                { pattern: /(^#\s*define\s+)\w+\b(?!\()/i, lookbehind: !0 },
                {
                  pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
                  lookbehind: !0,
                  alias: 'function',
                },
              ],
              directive: { pattern: /^(#\s*)[a-z]+/, lookbehind: !0, alias: 'keyword' },
              'directive-hash': /^#/,
              punctuation: /##|\\(?=[\r\n])/,
              expression: { pattern: /\S[\s\S]*/, inside: C.languages.c },
            },
          },
        }),
        C.languages.insertBefore('c', 'function', {
          constant:
            /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
        }),
        delete C.languages.c.boolean,
        (C.languages.objectivec = C.languages.extend('c', {
          string: { pattern: /@?"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
          keyword:
            /\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|in|inline|int|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
          operator: /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/,
        })),
        delete C.languages.objectivec['class-name'],
        (C.languages.objc = C.languages.objectivec),
        (C.languages.reason = C.languages.extend('clike', {
          string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"/, greedy: !0 },
          'class-name': /\b[A-Z]\w*/,
          keyword:
            /\b(?:and|as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|sig|struct|switch|then|to|try|type|val|virtual|when|while|with)\b/,
          operator:
            /\.{3}|:[:=]|\|>|->|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:asr|land|lor|lsl|lsr|lxor|mod)\b/,
        })),
        C.languages.insertBefore('reason', 'class-name', {
          char: {
            pattern: /'(?:\\x[\da-f]{2}|\\o[0-3][0-7][0-7]|\\\d{3}|\\.|[^'\\\r\n])'/,
            greedy: !0,
          },
          constructor: /\b[A-Z]\w*\b(?!\s*\.)/,
          label: { pattern: /\b[a-z]\w*(?=::)/, alias: 'symbol' },
        }),
        delete C.languages.reason.function,
        (function (e) {
          for (
            var t = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source, n = 0;
            n < 2;
            n++
          )
            t = t.replace(/<self>/g, function () {
              return t;
            });
          (t = t.replace(/<self>/g, function () {
            return /[^\s\S]/.source;
          })),
            (e.languages.rust = {
              comment: [
                { pattern: RegExp(/(^|[^\\])/.source + t), lookbehind: !0, greedy: !0 },
                { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
              ],
              string: {
                pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
                greedy: !0,
              },
              char: {
                pattern:
                  /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
                greedy: !0,
              },
              attribute: {
                pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
                greedy: !0,
                alias: 'attr-name',
                inside: { string: null },
              },
              'closure-params': {
                pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
                lookbehind: !0,
                greedy: !0,
                inside: {
                  'closure-punctuation': { pattern: /^\||\|$/, alias: 'punctuation' },
                  rest: null,
                },
              },
              'lifetime-annotation': { pattern: /'\w+/, alias: 'symbol' },
              'fragment-specifier': {
                pattern: /(\$\w+:)[a-z]+/,
                lookbehind: !0,
                alias: 'punctuation',
              },
              variable: /\$\w+/,
              'function-definition': {
                pattern: /(\bfn\s+)\w+/,
                lookbehind: !0,
                alias: 'function',
              },
              'type-definition': {
                pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
                lookbehind: !0,
                alias: 'class-name',
              },
              'module-declaration': [
                {
                  pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
                  lookbehind: !0,
                  alias: 'namespace',
                },
                {
                  pattern:
                    /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
                  lookbehind: !0,
                  alias: 'namespace',
                  inside: { punctuation: /::/ },
                },
              ],
              keyword: [
                /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
                /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/,
              ],
              function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
              macro: { pattern: /\b\w+!/, alias: 'property' },
              constant: /\b[A-Z_][A-Z_\d]+\b/,
              'class-name': /\b[A-Z]\w*\b/,
              namespace: {
                pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
                inside: { punctuation: /::/ },
              },
              number:
                /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
              boolean: /\b(?:false|true)\b/,
              punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
              operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/,
            }),
            (e.languages.rust['closure-params'].inside.rest = e.languages.rust),
            (e.languages.rust.attribute.inside.string = e.languages.rust.string);
        })(C),
        (C.languages.go = C.languages.extend('clike', {
          string: {
            pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
            lookbehind: !0,
            greedy: !0,
          },
          keyword:
            /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
          boolean: /\b(?:_|false|iota|nil|true)\b/,
          number: [
            /\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
            /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
            /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i,
          ],
          operator:
            /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
          builtin:
            /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/,
        })),
        C.languages.insertBefore('go', 'string', {
          char: { pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/, greedy: !0 },
        }),
        delete C.languages.go['class-name'],
        (function (e) {
          var t =
              /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
            n = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(
              /<keyword>/g,
              function () {
                return t.source;
              },
            );
          (e.languages.cpp = e.languages.extend('c', {
            'class-name': [
              {
                pattern: RegExp(
                  /(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(
                    /<keyword>/g,
                    function () {
                      return t.source;
                    },
                  ),
                ),
                lookbehind: !0,
              },
              /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
              /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
              /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/,
            ],
            keyword: t,
            number: {
              pattern:
                /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
              greedy: !0,
            },
            operator:
              />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
            boolean: /\b(?:false|true)\b/,
          })),
            e.languages.insertBefore('cpp', 'string', {
              module: {
                pattern: RegExp(
                  /(\b(?:import|module)\s+)/.source +
                    '(?:' +
                    /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source +
                    '|' +
                    /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(
                      /<mod-name>/g,
                      function () {
                        return n;
                      },
                    ) +
                    ')',
                ),
                lookbehind: !0,
                greedy: !0,
                inside: { string: /^[<"][\s\S]+/, operator: /:/, punctuation: /\./ },
              },
              'raw-string': {
                pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
                alias: 'string',
                greedy: !0,
              },
            }),
            e.languages.insertBefore('cpp', 'keyword', {
              'generic-function': {
                pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
                inside: {
                  function: /^\w+/,
                  generic: {
                    pattern: /<[\s\S]+/,
                    alias: 'class-name',
                    inside: e.languages.cpp,
                  },
                },
              },
            }),
            e.languages.insertBefore('cpp', 'operator', {
              'double-colon': { pattern: /::/, alias: 'punctuation' },
            }),
            e.languages.insertBefore('cpp', 'class-name', {
              'base-clause': {
                pattern:
                  /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
                lookbehind: !0,
                greedy: !0,
                inside: e.languages.extend('cpp', {}),
              },
            }),
            e.languages.insertBefore(
              'inside',
              'double-colon',
              { 'class-name': /\b[a-z_]\w*\b(?!\s*::)/i },
              e.languages.cpp['base-clause'],
            );
        })(C),
        (C.languages.python = {
          comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0, greedy: !0 },
          'string-interpolation': {
            pattern:
              /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
            greedy: !0,
            inside: {
              interpolation: {
                pattern:
                  /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
                lookbehind: !0,
                inside: {
                  'format-spec': { pattern: /(:)[^:(){}]+(?=\}$)/, lookbehind: !0 },
                  'conversion-option': {
                    pattern: /![sra](?=[:}]$)/,
                    alias: 'punctuation',
                  },
                  rest: null,
                },
              },
              string: /[\s\S]+/,
            },
          },
          'triple-quoted-string': {
            pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
            greedy: !0,
            alias: 'string',
          },
          string: {
            pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
            greedy: !0,
          },
          function: {
            pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
            lookbehind: !0,
          },
          'class-name': { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
          decorator: {
            pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
            lookbehind: !0,
            alias: ['annotation', 'punctuation'],
            inside: { punctuation: /\./ },
          },
          keyword:
            /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
          builtin:
            /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
          boolean: /\b(?:False|None|True)\b/,
          number:
            /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
          operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
          punctuation: /[{}[\];(),.:]/,
        }),
        (C.languages.python['string-interpolation'].inside.interpolation.inside.rest =
          C.languages.python),
        (C.languages.py = C.languages.python),
        (C.languages.json = {
          property: {
            pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
            lookbehind: !0,
            greedy: !0,
          },
          string: {
            pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
            lookbehind: !0,
            greedy: !0,
          },
          comment: { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: !0 },
          number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
          punctuation: /[{}[\],]/,
          operator: /:/,
          boolean: /\b(?:false|true)\b/,
          null: { pattern: /\bnull\b/, alias: 'keyword' },
        }),
        (C.languages.webmanifest = C.languages.json);
      ((e, t) => {
        for (var n in t) p(e, n, { get: t[n], enumerable: !0 });
      })(
        {},
        {
          dracula: () => T,
          duotoneDark: () => N,
          duotoneLight: () => O,
          github: () => P,
          gruvboxMaterialDark: () => Y,
          gruvboxMaterialLight: () => K,
          jettwaveDark: () => V,
          jettwaveLight: () => W,
          nightOwl: () => j,
          nightOwlLight: () => L,
          oceanicNext: () => R,
          okaidia: () => D,
          oneDark: () => G,
          oneLight: () => q,
          palenight: () => z,
          shadesOfPurple: () => M,
          synthwave84: () => B,
          ultramin: () => $,
          vsDark: () => U,
          vsLight: () => H,
        },
      );
      var T = {
          plain: { color: '#F8F8F2', backgroundColor: '#282A36' },
          styles: [
            {
              types: ['prolog', 'constant', 'builtin'],
              style: { color: 'rgb(189, 147, 249)' },
            },
            { types: ['inserted', 'function'], style: { color: 'rgb(80, 250, 123)' } },
            { types: ['deleted'], style: { color: 'rgb(255, 85, 85)' } },
            { types: ['changed'], style: { color: 'rgb(255, 184, 108)' } },
            { types: ['punctuation', 'symbol'], style: { color: 'rgb(248, 248, 242)' } },
            {
              types: ['string', 'char', 'tag', 'selector'],
              style: { color: 'rgb(255, 121, 198)' },
            },
            {
              types: ['keyword', 'variable'],
              style: { color: 'rgb(189, 147, 249)', fontStyle: 'italic' },
            },
            { types: ['comment'], style: { color: 'rgb(98, 114, 164)' } },
            { types: ['attr-name'], style: { color: 'rgb(241, 250, 140)' } },
          ],
        },
        N = {
          plain: { backgroundColor: '#2a2734', color: '#9a86fd' },
          styles: [
            {
              types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
              style: { color: '#6c6783' },
            },
            { types: ['namespace'], style: { opacity: 0.7 } },
            { types: ['tag', 'operator', 'number'], style: { color: '#e09142' } },
            { types: ['property', 'function'], style: { color: '#9a86fd' } },
            { types: ['tag-id', 'selector', 'atrule-id'], style: { color: '#eeebff' } },
            { types: ['attr-name'], style: { color: '#c4b9fe' } },
            {
              types: [
                'boolean',
                'string',
                'entity',
                'url',
                'attr-value',
                'keyword',
                'control',
                'directive',
                'unit',
                'statement',
                'regex',
                'atrule',
                'placeholder',
                'variable',
              ],
              style: { color: '#ffcc99' },
            },
            { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
            { types: ['inserted'], style: { textDecorationLine: 'underline' } },
            { types: ['italic'], style: { fontStyle: 'italic' } },
            { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
            { types: ['important'], style: { color: '#c4b9fe' } },
          ],
        },
        O = {
          plain: { backgroundColor: '#faf8f5', color: '#728fcb' },
          styles: [
            {
              types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
              style: { color: '#b6ad9a' },
            },
            { types: ['namespace'], style: { opacity: 0.7 } },
            { types: ['tag', 'operator', 'number'], style: { color: '#063289' } },
            { types: ['property', 'function'], style: { color: '#b29762' } },
            { types: ['tag-id', 'selector', 'atrule-id'], style: { color: '#2d2006' } },
            { types: ['attr-name'], style: { color: '#896724' } },
            {
              types: [
                'boolean',
                'string',
                'entity',
                'url',
                'attr-value',
                'keyword',
                'control',
                'directive',
                'unit',
                'statement',
                'regex',
                'atrule',
              ],
              style: { color: '#728fcb' },
            },
            { types: ['placeholder', 'variable'], style: { color: '#93abdc' } },
            { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
            { types: ['inserted'], style: { textDecorationLine: 'underline' } },
            { types: ['italic'], style: { fontStyle: 'italic' } },
            { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
            { types: ['important'], style: { color: '#896724' } },
          ],
        },
        P = {
          plain: { color: '#393A34', backgroundColor: '#f6f8fa' },
          styles: [
            {
              types: ['comment', 'prolog', 'doctype', 'cdata'],
              style: { color: '#999988', fontStyle: 'italic' },
            },
            { types: ['namespace'], style: { opacity: 0.7 } },
            { types: ['string', 'attr-value'], style: { color: '#e3116c' } },
            { types: ['punctuation', 'operator'], style: { color: '#393A34' } },
            {
              types: [
                'entity',
                'url',
                'symbol',
                'number',
                'boolean',
                'variable',
                'constant',
                'property',
                'regex',
                'inserted',
              ],
              style: { color: '#36acaa' },
            },
            {
              types: ['atrule', 'keyword', 'attr-name', 'selector'],
              style: { color: '#00a4db' },
            },
            { types: ['function', 'deleted', 'tag'], style: { color: '#d73a49' } },
            { types: ['function-variable'], style: { color: '#6f42c1' } },
            { types: ['tag', 'selector', 'keyword'], style: { color: '#00009f' } },
          ],
        },
        j = {
          plain: { color: '#d6deeb', backgroundColor: '#011627' },
          styles: [
            {
              types: ['changed'],
              style: { color: 'rgb(162, 191, 252)', fontStyle: 'italic' },
            },
            {
              types: ['deleted'],
              style: { color: 'rgba(239, 83, 80, 0.56)', fontStyle: 'italic' },
            },
            {
              types: ['inserted', 'attr-name'],
              style: { color: 'rgb(173, 219, 103)', fontStyle: 'italic' },
            },
            {
              types: ['comment'],
              style: { color: 'rgb(99, 119, 119)', fontStyle: 'italic' },
            },
            { types: ['string', 'url'], style: { color: 'rgb(173, 219, 103)' } },
            { types: ['variable'], style: { color: 'rgb(214, 222, 235)' } },
            { types: ['number'], style: { color: 'rgb(247, 140, 108)' } },
            {
              types: ['builtin', 'char', 'constant', 'function'],
              style: { color: 'rgb(130, 170, 255)' },
            },
            { types: ['punctuation'], style: { color: 'rgb(199, 146, 234)' } },
            {
              types: ['selector', 'doctype'],
              style: { color: 'rgb(199, 146, 234)', fontStyle: 'italic' },
            },
            { types: ['class-name'], style: { color: 'rgb(255, 203, 139)' } },
            {
              types: ['tag', 'operator', 'keyword'],
              style: { color: 'rgb(127, 219, 202)' },
            },
            { types: ['boolean'], style: { color: 'rgb(255, 88, 116)' } },
            { types: ['property'], style: { color: 'rgb(128, 203, 196)' } },
            { types: ['namespace'], style: { color: 'rgb(178, 204, 214)' } },
          ],
        },
        L = {
          plain: { color: '#403f53', backgroundColor: '#FBFBFB' },
          styles: [
            {
              types: ['changed'],
              style: { color: 'rgb(162, 191, 252)', fontStyle: 'italic' },
            },
            {
              types: ['deleted'],
              style: { color: 'rgba(239, 83, 80, 0.56)', fontStyle: 'italic' },
            },
            {
              types: ['inserted', 'attr-name'],
              style: { color: 'rgb(72, 118, 214)', fontStyle: 'italic' },
            },
            {
              types: ['comment'],
              style: { color: 'rgb(152, 159, 177)', fontStyle: 'italic' },
            },
            {
              types: ['string', 'builtin', 'char', 'constant', 'url'],
              style: { color: 'rgb(72, 118, 214)' },
            },
            { types: ['variable'], style: { color: 'rgb(201, 103, 101)' } },
            { types: ['number'], style: { color: 'rgb(170, 9, 130)' } },
            { types: ['punctuation'], style: { color: 'rgb(153, 76, 195)' } },
            {
              types: ['function', 'selector', 'doctype'],
              style: { color: 'rgb(153, 76, 195)', fontStyle: 'italic' },
            },
            { types: ['class-name'], style: { color: 'rgb(17, 17, 17)' } },
            { types: ['tag'], style: { color: 'rgb(153, 76, 195)' } },
            {
              types: ['operator', 'property', 'keyword', 'namespace'],
              style: { color: 'rgb(12, 150, 155)' },
            },
            { types: ['boolean'], style: { color: 'rgb(188, 84, 84)' } },
          ],
        },
        I = '#c5a5c5',
        F = '#8dc891',
        R = {
          plain: { backgroundColor: '#282c34', color: '#ffffff' },
          styles: [
            { types: ['attr-name'], style: { color: I } },
            { types: ['attr-value'], style: { color: F } },
            {
              types: [
                'comment',
                'block-comment',
                'prolog',
                'doctype',
                'cdata',
                'shebang',
              ],
              style: { color: '#999999' },
            },
            {
              types: [
                'property',
                'number',
                'function-name',
                'constant',
                'symbol',
                'deleted',
              ],
              style: { color: '#5a9bcf' },
            },
            { types: ['boolean'], style: { color: '#ff8b50' } },
            { types: ['tag'], style: { color: '#fc929e' } },
            { types: ['string'], style: { color: F } },
            { types: ['punctuation'], style: { color: F } },
            {
              types: ['selector', 'char', 'builtin', 'inserted'],
              style: { color: '#D8DEE9' },
            },
            { types: ['function'], style: { color: '#79b6f2' } },
            {
              types: ['operator', 'entity', 'url', 'variable'],
              style: { color: '#d7deea' },
            },
            { types: ['keyword'], style: { color: I } },
            { types: ['atrule', 'class-name'], style: { color: '#FAC863' } },
            { types: ['important'], style: { fontWeight: '400' } },
            { types: ['bold'], style: { fontWeight: 'bold' } },
            { types: ['italic'], style: { fontStyle: 'italic' } },
            { types: ['namespace'], style: { opacity: 0.7 } },
          ],
        },
        D = {
          plain: { color: '#f8f8f2', backgroundColor: '#272822' },
          styles: [
            {
              types: ['changed'],
              style: { color: 'rgb(162, 191, 252)', fontStyle: 'italic' },
            },
            { types: ['deleted'], style: { color: '#f92672', fontStyle: 'italic' } },
            {
              types: ['inserted'],
              style: { color: 'rgb(173, 219, 103)', fontStyle: 'italic' },
            },
            { types: ['comment'], style: { color: '#8292a2', fontStyle: 'italic' } },
            { types: ['string', 'url'], style: { color: '#a6e22e' } },
            { types: ['variable'], style: { color: '#f8f8f2' } },
            { types: ['number'], style: { color: '#ae81ff' } },
            {
              types: ['builtin', 'char', 'constant', 'function', 'class-name'],
              style: { color: '#e6db74' },
            },
            { types: ['punctuation'], style: { color: '#f8f8f2' } },
            {
              types: ['selector', 'doctype'],
              style: { color: '#a6e22e', fontStyle: 'italic' },
            },
            { types: ['tag', 'operator', 'keyword'], style: { color: '#66d9ef' } },
            { types: ['boolean'], style: { color: '#ae81ff' } },
            {
              types: ['namespace'],
              style: { color: 'rgb(178, 204, 214)', opacity: 0.7 },
            },
            { types: ['tag', 'property'], style: { color: '#f92672' } },
            { types: ['attr-name'], style: { color: '#a6e22e !important' } },
            { types: ['doctype'], style: { color: '#8292a2' } },
            { types: ['rule'], style: { color: '#e6db74' } },
          ],
        },
        z = {
          plain: { color: '#bfc7d5', backgroundColor: '#292d3e' },
          styles: [
            {
              types: ['comment'],
              style: { color: 'rgb(105, 112, 152)', fontStyle: 'italic' },
            },
            { types: ['string', 'inserted'], style: { color: 'rgb(195, 232, 141)' } },
            { types: ['number'], style: { color: 'rgb(247, 140, 108)' } },
            {
              types: ['builtin', 'char', 'constant', 'function'],
              style: { color: 'rgb(130, 170, 255)' },
            },
            {
              types: ['punctuation', 'selector'],
              style: { color: 'rgb(199, 146, 234)' },
            },
            { types: ['variable'], style: { color: 'rgb(191, 199, 213)' } },
            {
              types: ['class-name', 'attr-name'],
              style: { color: 'rgb(255, 203, 107)' },
            },
            { types: ['tag', 'deleted'], style: { color: 'rgb(255, 85, 114)' } },
            { types: ['operator'], style: { color: 'rgb(137, 221, 255)' } },
            { types: ['boolean'], style: { color: 'rgb(255, 88, 116)' } },
            { types: ['keyword'], style: { fontStyle: 'italic' } },
            {
              types: ['doctype'],
              style: { color: 'rgb(199, 146, 234)', fontStyle: 'italic' },
            },
            { types: ['namespace'], style: { color: 'rgb(178, 204, 214)' } },
            { types: ['url'], style: { color: 'rgb(221, 221, 221)' } },
          ],
        },
        M = {
          plain: { color: '#9EFEFF', backgroundColor: '#2D2A55' },
          styles: [
            { types: ['changed'], style: { color: 'rgb(255, 238, 128)' } },
            { types: ['deleted'], style: { color: 'rgba(239, 83, 80, 0.56)' } },
            { types: ['inserted'], style: { color: 'rgb(173, 219, 103)' } },
            {
              types: ['comment'],
              style: { color: 'rgb(179, 98, 255)', fontStyle: 'italic' },
            },
            { types: ['punctuation'], style: { color: 'rgb(255, 255, 255)' } },
            { types: ['constant'], style: { color: 'rgb(255, 98, 140)' } },
            { types: ['string', 'url'], style: { color: 'rgb(165, 255, 144)' } },
            { types: ['variable'], style: { color: 'rgb(255, 238, 128)' } },
            { types: ['number', 'boolean'], style: { color: 'rgb(255, 98, 140)' } },
            { types: ['attr-name'], style: { color: 'rgb(255, 180, 84)' } },
            {
              types: [
                'keyword',
                'operator',
                'property',
                'namespace',
                'tag',
                'selector',
                'doctype',
              ],
              style: { color: 'rgb(255, 157, 0)' },
            },
            {
              types: ['builtin', 'char', 'constant', 'function', 'class-name'],
              style: { color: 'rgb(250, 208, 0)' },
            },
          ],
        },
        B = {
          plain: {
            backgroundColor: 'linear-gradient(to bottom, #2a2139 75%, #34294f)',
            backgroundImage: '#34294f',
            color: '#f92aad',
            textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
          },
          styles: [
            {
              types: ['comment', 'block-comment', 'prolog', 'doctype', 'cdata'],
              style: { color: '#495495', fontStyle: 'italic' },
            },
            { types: ['punctuation'], style: { color: '#ccc' } },
            {
              types: [
                'tag',
                'attr-name',
                'namespace',
                'number',
                'unit',
                'hexcode',
                'deleted',
              ],
              style: { color: '#e2777a' },
            },
            {
              types: ['property', 'selector'],
              style: {
                color: '#72f1b8',
                textShadow: '0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475',
              },
            },
            { types: ['function-name'], style: { color: '#6196cc' } },
            {
              types: ['boolean', 'selector-id', 'function'],
              style: {
                color: '#fdfdfd',
                textShadow:
                  '0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975',
              },
            },
            {
              types: ['class-name', 'maybe-class-name', 'builtin'],
              style: {
                color: '#fff5f6',
                textShadow:
                  '0 0 2px #000, 0 0 10px #fc1f2c75, 0 0 5px #fc1f2c75, 0 0 25px #fc1f2c75',
              },
            },
            {
              types: ['constant', 'symbol'],
              style: {
                color: '#f92aad',
                textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
              },
            },
            {
              types: ['important', 'atrule', 'keyword', 'selector-class'],
              style: {
                color: '#f4eee4',
                textShadow: '0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575',
              },
            },
            {
              types: ['string', 'char', 'attr-value', 'regex', 'variable'],
              style: { color: '#f87c32' },
            },
            { types: ['parameter'], style: { fontStyle: 'italic' } },
            { types: ['entity', 'url'], style: { color: '#67cdcc' } },
            { types: ['operator'], style: { color: 'ffffffee' } },
            { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
            { types: ['italic'], style: { fontStyle: 'italic' } },
            { types: ['entity'], style: { cursor: 'help' } },
            { types: ['inserted'], style: { color: 'green' } },
          ],
        },
        $ = {
          plain: { color: '#282a2e', backgroundColor: '#ffffff' },
          styles: [
            { types: ['comment'], style: { color: 'rgb(197, 200, 198)' } },
            {
              types: ['string', 'number', 'builtin', 'variable'],
              style: { color: 'rgb(150, 152, 150)' },
            },
            {
              types: ['class-name', 'function', 'tag', 'attr-name'],
              style: { color: 'rgb(40, 42, 46)' },
            },
          ],
        },
        U = {
          plain: { color: '#9CDCFE', backgroundColor: '#1E1E1E' },
          styles: [
            { types: ['prolog'], style: { color: 'rgb(0, 0, 128)' } },
            { types: ['comment'], style: { color: 'rgb(106, 153, 85)' } },
            {
              types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
              style: { color: 'rgb(86, 156, 214)' },
            },
            { types: ['number', 'inserted'], style: { color: 'rgb(181, 206, 168)' } },
            { types: ['constant'], style: { color: 'rgb(100, 102, 149)' } },
            { types: ['attr-name', 'variable'], style: { color: 'rgb(156, 220, 254)' } },
            {
              types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
              style: { color: 'rgb(206, 145, 120)' },
            },
            { types: ['selector'], style: { color: 'rgb(215, 186, 125)' } },
            { types: ['tag'], style: { color: 'rgb(78, 201, 176)' } },
            {
              types: ['tag'],
              languages: ['markup'],
              style: { color: 'rgb(86, 156, 214)' },
            },
            {
              types: ['punctuation', 'operator'],
              style: { color: 'rgb(212, 212, 212)' },
            },
            {
              types: ['punctuation'],
              languages: ['markup'],
              style: { color: '#808080' },
            },
            { types: ['function'], style: { color: 'rgb(220, 220, 170)' } },
            { types: ['class-name'], style: { color: 'rgb(78, 201, 176)' } },
            { types: ['char'], style: { color: 'rgb(209, 105, 105)' } },
          ],
        },
        H = {
          plain: { color: '#000000', backgroundColor: '#ffffff' },
          styles: [
            { types: ['comment'], style: { color: 'rgb(0, 128, 0)' } },
            { types: ['builtin'], style: { color: 'rgb(0, 112, 193)' } },
            {
              types: ['number', 'variable', 'inserted'],
              style: { color: 'rgb(9, 134, 88)' },
            },
            { types: ['operator'], style: { color: 'rgb(0, 0, 0)' } },
            { types: ['constant', 'char'], style: { color: 'rgb(129, 31, 63)' } },
            { types: ['tag'], style: { color: 'rgb(128, 0, 0)' } },
            { types: ['attr-name'], style: { color: 'rgb(255, 0, 0)' } },
            { types: ['deleted', 'string'], style: { color: 'rgb(163, 21, 21)' } },
            { types: ['changed', 'punctuation'], style: { color: 'rgb(4, 81, 165)' } },
            { types: ['function', 'keyword'], style: { color: 'rgb(0, 0, 255)' } },
            { types: ['class-name'], style: { color: 'rgb(38, 127, 153)' } },
          ],
        },
        V = {
          plain: { color: '#f8fafc', backgroundColor: '#011627' },
          styles: [
            { types: ['prolog'], style: { color: '#000080' } },
            { types: ['comment'], style: { color: '#6A9955' } },
            {
              types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
              style: { color: '#569CD6' },
            },
            { types: ['number', 'inserted'], style: { color: '#B5CEA8' } },
            { types: ['constant'], style: { color: '#f8fafc' } },
            { types: ['attr-name', 'variable'], style: { color: '#9CDCFE' } },
            {
              types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
              style: { color: '#cbd5e1' },
            },
            { types: ['selector'], style: { color: '#D7BA7D' } },
            { types: ['tag'], style: { color: '#0ea5e9' } },
            { types: ['tag'], languages: ['markup'], style: { color: '#0ea5e9' } },
            { types: ['punctuation', 'operator'], style: { color: '#D4D4D4' } },
            {
              types: ['punctuation'],
              languages: ['markup'],
              style: { color: '#808080' },
            },
            { types: ['function'], style: { color: '#7dd3fc' } },
            { types: ['class-name'], style: { color: '#0ea5e9' } },
            { types: ['char'], style: { color: '#D16969' } },
          ],
        },
        W = {
          plain: { color: '#0f172a', backgroundColor: '#f1f5f9' },
          styles: [
            { types: ['prolog'], style: { color: '#000080' } },
            { types: ['comment'], style: { color: '#6A9955' } },
            {
              types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
              style: { color: '#0c4a6e' },
            },
            { types: ['number', 'inserted'], style: { color: '#B5CEA8' } },
            { types: ['constant'], style: { color: '#0f172a' } },
            { types: ['attr-name', 'variable'], style: { color: '#0c4a6e' } },
            {
              types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
              style: { color: '#64748b' },
            },
            { types: ['selector'], style: { color: '#D7BA7D' } },
            { types: ['tag'], style: { color: '#0ea5e9' } },
            { types: ['tag'], languages: ['markup'], style: { color: '#0ea5e9' } },
            { types: ['punctuation', 'operator'], style: { color: '#475569' } },
            {
              types: ['punctuation'],
              languages: ['markup'],
              style: { color: '#808080' },
            },
            { types: ['function'], style: { color: '#0e7490' } },
            { types: ['class-name'], style: { color: '#0ea5e9' } },
            { types: ['char'], style: { color: '#D16969' } },
          ],
        },
        G = {
          plain: {
            backgroundColor: 'hsl(220, 13%, 18%)',
            color: 'hsl(220, 14%, 71%)',
            textShadow: '0 1px rgba(0, 0, 0, 0.3)',
          },
          styles: [
            {
              types: ['comment', 'prolog', 'cdata'],
              style: { color: 'hsl(220, 10%, 40%)' },
            },
            {
              types: ['doctype', 'punctuation', 'entity'],
              style: { color: 'hsl(220, 14%, 71%)' },
            },
            {
              types: [
                'attr-name',
                'class-name',
                'maybe-class-name',
                'boolean',
                'constant',
                'number',
                'atrule',
              ],
              style: { color: 'hsl(29, 54%, 61%)' },
            },
            { types: ['keyword'], style: { color: 'hsl(286, 60%, 67%)' } },
            {
              types: ['property', 'tag', 'symbol', 'deleted', 'important'],
              style: { color: 'hsl(355, 65%, 65%)' },
            },
            {
              types: [
                'selector',
                'string',
                'char',
                'builtin',
                'inserted',
                'regex',
                'attr-value',
              ],
              style: { color: 'hsl(95, 38%, 62%)' },
            },
            {
              types: ['variable', 'operator', 'function'],
              style: { color: 'hsl(207, 82%, 66%)' },
            },
            { types: ['url'], style: { color: 'hsl(187, 47%, 55%)' } },
            { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
            { types: ['inserted'], style: { textDecorationLine: 'underline' } },
            { types: ['italic'], style: { fontStyle: 'italic' } },
            { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
            { types: ['important'], style: { color: 'hsl(220, 14%, 71%)' } },
          ],
        },
        q = {
          plain: { backgroundColor: 'hsl(230, 1%, 98%)', color: 'hsl(230, 8%, 24%)' },
          styles: [
            {
              types: ['comment', 'prolog', 'cdata'],
              style: { color: 'hsl(230, 4%, 64%)' },
            },
            {
              types: ['doctype', 'punctuation', 'entity'],
              style: { color: 'hsl(230, 8%, 24%)' },
            },
            {
              types: [
                'attr-name',
                'class-name',
                'boolean',
                'constant',
                'number',
                'atrule',
              ],
              style: { color: 'hsl(35, 99%, 36%)' },
            },
            { types: ['keyword'], style: { color: 'hsl(301, 63%, 40%)' } },
            {
              types: ['property', 'tag', 'symbol', 'deleted', 'important'],
              style: { color: 'hsl(5, 74%, 59%)' },
            },
            {
              types: [
                'selector',
                'string',
                'char',
                'builtin',
                'inserted',
                'regex',
                'attr-value',
                'punctuation',
              ],
              style: { color: 'hsl(119, 34%, 47%)' },
            },
            {
              types: ['variable', 'operator', 'function'],
              style: { color: 'hsl(221, 87%, 60%)' },
            },
            { types: ['url'], style: { color: 'hsl(198, 99%, 37%)' } },
            { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
            { types: ['inserted'], style: { textDecorationLine: 'underline' } },
            { types: ['italic'], style: { fontStyle: 'italic' } },
            { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
            { types: ['important'], style: { color: 'hsl(230, 8%, 24%)' } },
          ],
        },
        Y = {
          plain: { color: '#ebdbb2', backgroundColor: '#292828' },
          styles: [
            {
              types: [
                'imports',
                'class-name',
                'maybe-class-name',
                'constant',
                'doctype',
                'builtin',
                'function',
              ],
              style: { color: '#d8a657' },
            },
            { types: ['property-access'], style: { color: '#7daea3' } },
            { types: ['tag'], style: { color: '#e78a4e' } },
            { types: ['attr-name', 'char', 'url', 'regex'], style: { color: '#a9b665' } },
            { types: ['attr-value', 'string'], style: { color: '#89b482' } },
            {
              types: ['comment', 'prolog', 'cdata', 'operator', 'inserted'],
              style: { color: '#a89984' },
            },
            {
              types: [
                'delimiter',
                'boolean',
                'keyword',
                'selector',
                'important',
                'atrule',
                'property',
                'variable',
                'deleted',
              ],
              style: { color: '#ea6962' },
            },
            { types: ['entity', 'number', 'symbol'], style: { color: '#d3869b' } },
          ],
        },
        K = {
          plain: { color: '#654735', backgroundColor: '#f9f5d7' },
          styles: [
            {
              types: [
                'delimiter',
                'boolean',
                'keyword',
                'selector',
                'important',
                'atrule',
                'property',
                'variable',
                'deleted',
              ],
              style: { color: '#af2528' },
            },
            {
              types: [
                'imports',
                'class-name',
                'maybe-class-name',
                'constant',
                'doctype',
                'builtin',
              ],
              style: { color: '#b4730e' },
            },
            { types: ['string', 'attr-value'], style: { color: '#477a5b' } },
            { types: ['property-access'], style: { color: '#266b79' } },
            {
              types: ['function', 'attr-name', 'char', 'url'],
              style: { color: '#72761e' },
            },
            { types: ['tag'], style: { color: '#b94c07' } },
            {
              types: ['comment', 'prolog', 'cdata', 'operator', 'inserted'],
              style: { color: '#a89984' },
            },
            { types: ['entity', 'number', 'symbol'], style: { color: '#924f79' } },
          ],
        },
        Q = /\r\n|\r|\n/,
        Z = (e) => {
          0 === e.length
            ? e.push({ types: ['plain'], content: '\n', empty: !0 })
            : 1 === e.length &&
              '' === e[0].content &&
              ((e[0].content = '\n'), (e[0].empty = !0));
        },
        X = (e, t) => {
          const n = e.length;
          return n > 0 && e[n - 1] === t ? e : e.concat(t);
        },
        J = (e) => {
          const t = [[]],
            n = [e],
            r = [0],
            a = [e.length];
          let o = 0,
            i = 0,
            l = [];
          const s = [l];
          for (; i > -1; ) {
            for (; (o = r[i]++) < a[i]; ) {
              let e,
                u = t[i];
              const c = n[i][o];
              if (
                ('string' == typeof c
                  ? ((u = i > 0 ? u : ['plain']), (e = c))
                  : ((u = X(u, c.type)), c.alias && (u = X(u, c.alias)), (e = c.content)),
                'string' != typeof e)
              ) {
                i++, t.push(u), n.push(e), r.push(0), a.push(e.length);
                continue;
              }
              const d = e.split(Q),
                f = d.length;
              l.push({ types: u, content: d[0] });
              for (let t = 1; t < f; t++)
                Z(l), s.push((l = [])), l.push({ types: u, content: d[t] });
            }
            i--, t.pop(), n.pop(), r.pop(), a.pop();
          }
          return Z(l), s;
        },
        ee = (e, t) => {
          const { plain: n } = e,
            r = e.styles.reduce((e, n) => {
              const { languages: r, style: a } = n;
              return (
                (r && !r.includes(t)) ||
                  n.types.forEach((t) => {
                    const n = x(x({}, e[t]), a);
                    e[t] = n;
                  }),
                e
              );
            }, {});
          return (r.root = n), (r.plain = E(x({}, n), { backgroundColor: void 0 })), r;
        },
        te = ({ children: e, language: t, code: n, theme: r, prism: a }) => {
          const o = t.toLowerCase(),
            i = ee(r, o),
            l = ((e) =>
              (0, c.useCallback)(
                (t) => {
                  var n = t,
                    { className: r, style: a, line: o } = n,
                    i = _(n, ['className', 'style', 'line']);
                  const l = E(x({}, i), { className: (0, d.A)('token-line', r) });
                  return (
                    'object' == typeof e && 'plain' in e && (l.style = e.plain),
                    'object' == typeof a && (l.style = x(x({}, l.style || {}), a)),
                    l
                  );
                },
                [e],
              ))(i),
            s = ((e) => {
              const t = (0, c.useCallback)(
                ({ types: t, empty: n }) => {
                  if (null != e)
                    return 1 === t.length && 'plain' === t[0]
                      ? null != n
                        ? { display: 'inline-block' }
                        : void 0
                      : 1 === t.length && null != n
                      ? e[t[0]]
                      : Object.assign(
                          null != n ? { display: 'inline-block' } : {},
                          ...t.map((t) => e[t]),
                        );
                },
                [e],
              );
              return (0, c.useCallback)(
                (e) => {
                  var n = e,
                    { token: r, className: a, style: o } = n,
                    i = _(n, ['token', 'className', 'style']);
                  const l = E(x({}, i), {
                    className: (0, d.A)('token', ...r.types, a),
                    children: r.content,
                    style: t(r),
                  });
                  return null != o && (l.style = x(x({}, l.style || {}), o)), l;
                },
                [t],
              );
            })(i),
            u = (({ prism: e, code: t, grammar: n, language: r }) =>
              (0, c.useMemo)(() => {
                if (null == n) return J([t]);
                const a = { code: t, grammar: n, language: r, tokens: [] };
                return (
                  e.hooks.run('before-tokenize', a),
                  (a.tokens = e.tokenize(t, n)),
                  e.hooks.run('after-tokenize', a),
                  J(a.tokens)
                );
              }, [t, n, r, e]))({
              prism: a,
              language: o,
              code: n,
              grammar: a.languages[o],
            });
          return e({
            tokens: u,
            className: `prism-code language-${o}`,
            style: null != i ? i.root : {},
            getLineProps: l,
            getTokenProps: s,
          });
        },
        ne = (e) =>
          (0, c.createElement)(
            te,
            E(x({}, e), {
              prism: e.prism || C,
              theme: e.theme || U,
              code: e.code,
              language: e.language,
            }),
          );
    },
    5385(e, t, n) {
      'use strict';
      n.d(t, { A: () => a });
      var r = 'Invariant failed';
      function a(e, t) {
        if (!e) throw new Error(r);
      }
    },
    4429(e, t, n) {
      'use strict';
      n.r(t),
        n.d(t, {
          __addDisposableResource: () => F,
          __assign: () => o,
          __asyncDelegator: () => _,
          __asyncGenerator: () => E,
          __asyncValues: () => A,
          __await: () => x,
          __awaiter: () => g,
          __classPrivateFieldGet: () => j,
          __classPrivateFieldIn: () => I,
          __classPrivateFieldSet: () => L,
          __createBinding: () => h,
          __decorate: () => l,
          __disposeResources: () => D,
          __esDecorate: () => u,
          __exportStar: () => y,
          __extends: () => a,
          __generator: () => m,
          __importDefault: () => P,
          __importStar: () => O,
          __makeTemplateObject: () => C,
          __metadata: () => p,
          __param: () => s,
          __propKey: () => d,
          __read: () => b,
          __rest: () => i,
          __rewriteRelativeImportExtension: () => z,
          __runInitializers: () => c,
          __setFunctionName: () => f,
          __spread: () => w,
          __spreadArray: () => S,
          __spreadArrays: () => k,
          __values: () => v,
        });
      var r = function (e, t) {
        return (
          (r =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
            }),
          r(e, t)
        );
      };
      function a(e, t) {
        if ('function' != typeof t && null !== t)
          throw new TypeError(
            'Class extends value ' + String(t) + ' is not a constructor or null',
          );
        function n() {
          this.constructor = e;
        }
        r(e, t),
          (e.prototype =
            null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
      }
      var o = function () {
        return (
          (o =
            Object.assign ||
            function (e) {
              for (var t, n = 1, r = arguments.length; n < r; n++)
                for (var a in (t = arguments[n]))
                  Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
              return e;
            }),
          o.apply(this, arguments)
        );
      };
      function i(e, t) {
        var n = {};
        for (var r in e)
          Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
        if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
          var a = 0;
          for (r = Object.getOwnPropertySymbols(e); a < r.length; a++)
            t.indexOf(r[a]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(e, r[a]) &&
              (n[r[a]] = e[r[a]]);
        }
        return n;
      }
      function l(e, t, n, r) {
        var a,
          o = arguments.length,
          i = o < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, n)) : r;
        if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
          i = Reflect.decorate(e, t, n, r);
        else
          for (var l = e.length - 1; l >= 0; l--)
            (a = e[l]) && (i = (o < 3 ? a(i) : o > 3 ? a(t, n, i) : a(t, n)) || i);
        return o > 3 && i && Object.defineProperty(t, n, i), i;
      }
      function s(e, t) {
        return function (n, r) {
          t(n, r, e);
        };
      }
      function u(e, t, n, r, a, o) {
        function i(e) {
          if (void 0 !== e && 'function' != typeof e)
            throw new TypeError('Function expected');
          return e;
        }
        for (
          var l,
            s = r.kind,
            u = 'getter' === s ? 'get' : 'setter' === s ? 'set' : 'value',
            c = !t && e ? (r.static ? e : e.prototype) : null,
            d = t || (c ? Object.getOwnPropertyDescriptor(c, r.name) : {}),
            f = !1,
            p = n.length - 1;
          p >= 0;
          p--
        ) {
          var g = {};
          for (var m in r) g[m] = 'access' === m ? {} : r[m];
          for (var m in r.access) g.access[m] = r.access[m];
          g.addInitializer = function (e) {
            if (f)
              throw new TypeError(
                'Cannot add initializers after decoration has completed',
              );
            o.push(i(e || null));
          };
          var h = (0, n[p])('accessor' === s ? { get: d.get, set: d.set } : d[u], g);
          if ('accessor' === s) {
            if (void 0 === h) continue;
            if (null === h || 'object' != typeof h)
              throw new TypeError('Object expected');
            (l = i(h.get)) && (d.get = l),
              (l = i(h.set)) && (d.set = l),
              (l = i(h.init)) && a.unshift(l);
          } else (l = i(h)) && ('field' === s ? a.unshift(l) : (d[u] = l));
        }
        c && Object.defineProperty(c, r.name, d), (f = !0);
      }
      function c(e, t, n) {
        for (var r = arguments.length > 2, a = 0; a < t.length; a++)
          n = r ? t[a].call(e, n) : t[a].call(e);
        return r ? n : void 0;
      }
      function d(e) {
        return 'symbol' == typeof e ? e : ''.concat(e);
      }
      function f(e, t, n) {
        return (
          'symbol' == typeof t &&
            (t = t.description ? '['.concat(t.description, ']') : ''),
          Object.defineProperty(e, 'name', {
            configurable: !0,
            value: n ? ''.concat(n, ' ', t) : t,
          })
        );
      }
      function p(e, t) {
        if ('object' == typeof Reflect && 'function' == typeof Reflect.metadata)
          return Reflect.metadata(e, t);
      }
      function g(e, t, n, r) {
        return new (n || (n = Promise))(function (a, o) {
          function i(e) {
            try {
              s(r.next(e));
            } catch (t) {
              o(t);
            }
          }
          function l(e) {
            try {
              s(r.throw(e));
            } catch (t) {
              o(t);
            }
          }
          function s(e) {
            var t;
            e.done
              ? a(e.value)
              : ((t = e.value),
                t instanceof n
                  ? t
                  : new n(function (e) {
                      e(t);
                    })).then(i, l);
          }
          s((r = r.apply(e, t || [])).next());
        });
      }
      function m(e, t) {
        var n,
          r,
          a,
          o = {
            label: 0,
            sent: function () {
              if (1 & a[0]) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          },
          i = Object.create(
            ('function' == typeof Iterator ? Iterator : Object).prototype,
          );
        return (
          (i.next = l(0)),
          (i.throw = l(1)),
          (i.return = l(2)),
          'function' == typeof Symbol &&
            (i[Symbol.iterator] = function () {
              return this;
            }),
          i
        );
        function l(l) {
          return function (s) {
            return (function (l) {
              if (n) throw new TypeError('Generator is already executing.');
              for (; i && ((i = 0), l[0] && (o = 0)), o; )
                try {
                  if (
                    ((n = 1),
                    r &&
                      (a =
                        2 & l[0]
                          ? r.return
                          : l[0]
                          ? r.throw || ((a = r.return) && a.call(r), 0)
                          : r.next) &&
                      !(a = a.call(r, l[1])).done)
                  )
                    return a;
                  switch (((r = 0), a && (l = [2 & l[0], a.value]), l[0])) {
                    case 0:
                    case 1:
                      a = l;
                      break;
                    case 4:
                      return o.label++, { value: l[1], done: !1 };
                    case 5:
                      o.label++, (r = l[1]), (l = [0]);
                      continue;
                    case 7:
                      (l = o.ops.pop()), o.trys.pop();
                      continue;
                    default:
                      if (
                        !((a = o.trys),
                        (a = a.length > 0 && a[a.length - 1]) ||
                          (6 !== l[0] && 2 !== l[0]))
                      ) {
                        o = 0;
                        continue;
                      }
                      if (3 === l[0] && (!a || (l[1] > a[0] && l[1] < a[3]))) {
                        o.label = l[1];
                        break;
                      }
                      if (6 === l[0] && o.label < a[1]) {
                        (o.label = a[1]), (a = l);
                        break;
                      }
                      if (a && o.label < a[2]) {
                        (o.label = a[2]), o.ops.push(l);
                        break;
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue;
                  }
                  l = t.call(e, o);
                } catch (s) {
                  (l = [6, s]), (r = 0);
                } finally {
                  n = a = 0;
                }
              if (5 & l[0]) throw l[1];
              return { value: l[0] ? l[1] : void 0, done: !0 };
            })([l, s]);
          };
        }
      }
      var h = Object.create
        ? function (e, t, n, r) {
            void 0 === r && (r = n);
            var a = Object.getOwnPropertyDescriptor(t, n);
            (a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
              (a = {
                enumerable: !0,
                get: function () {
                  return t[n];
                },
              }),
              Object.defineProperty(e, r, a);
          }
        : function (e, t, n, r) {
            void 0 === r && (r = n), (e[r] = t[n]);
          };
      function y(e, t) {
        for (var n in e)
          'default' === n || Object.prototype.hasOwnProperty.call(t, n) || h(t, e, n);
      }
      function v(e) {
        var t = 'function' == typeof Symbol && Symbol.iterator,
          n = t && e[t],
          r = 0;
        if (n) return n.call(e);
        if (e && 'number' == typeof e.length)
          return {
            next: function () {
              return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
            },
          };
        throw new TypeError(
          t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
        );
      }
      function b(e, t) {
        var n = 'function' == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var r,
          a,
          o = n.call(e),
          i = [];
        try {
          for (; (void 0 === t || t-- > 0) && !(r = o.next()).done; ) i.push(r.value);
        } catch (l) {
          a = { error: l };
        } finally {
          try {
            r && !r.done && (n = o.return) && n.call(o);
          } finally {
            if (a) throw a.error;
          }
        }
        return i;
      }
      function w() {
        for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(b(arguments[t]));
        return e;
      }
      function k() {
        for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
        var r = Array(e),
          a = 0;
        for (t = 0; t < n; t++)
          for (var o = arguments[t], i = 0, l = o.length; i < l; i++, a++) r[a] = o[i];
        return r;
      }
      function S(e, t, n) {
        if (n || 2 === arguments.length)
          for (var r, a = 0, o = t.length; a < o; a++)
            (!r && a in t) ||
              (r || (r = Array.prototype.slice.call(t, 0, a)), (r[a] = t[a]));
        return e.concat(r || Array.prototype.slice.call(t));
      }
      function x(e) {
        return this instanceof x ? ((this.v = e), this) : new x(e);
      }
      function E(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError('Symbol.asyncIterator is not defined.');
        var r,
          a = n.apply(e, t || []),
          o = [];
        return (
          (r = Object.create(
            ('function' == typeof AsyncIterator ? AsyncIterator : Object).prototype,
          )),
          i('next'),
          i('throw'),
          i('return', function (e) {
            return function (t) {
              return Promise.resolve(t).then(e, u);
            };
          }),
          (r[Symbol.asyncIterator] = function () {
            return this;
          }),
          r
        );
        function i(e, t) {
          a[e] &&
            ((r[e] = function (t) {
              return new Promise(function (n, r) {
                o.push([e, t, n, r]) > 1 || l(e, t);
              });
            }),
            t && (r[e] = t(r[e])));
        }
        function l(e, t) {
          try {
            (n = a[e](t)).value instanceof x
              ? Promise.resolve(n.value.v).then(s, u)
              : c(o[0][2], n);
          } catch (r) {
            c(o[0][3], r);
          }
          var n;
        }
        function s(e) {
          l('next', e);
        }
        function u(e) {
          l('throw', e);
        }
        function c(e, t) {
          e(t), o.shift(), o.length && l(o[0][0], o[0][1]);
        }
      }
      function _(e) {
        var t, n;
        return (
          (t = {}),
          r('next'),
          r('throw', function (e) {
            throw e;
          }),
          r('return'),
          (t[Symbol.iterator] = function () {
            return this;
          }),
          t
        );
        function r(r, a) {
          t[r] = e[r]
            ? function (t) {
                return (n = !n) ? { value: x(e[r](t)), done: !1 } : a ? a(t) : t;
              }
            : a;
        }
      }
      function A(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError('Symbol.asyncIterator is not defined.');
        var t,
          n = e[Symbol.asyncIterator];
        return n
          ? n.call(e)
          : ((e = v(e)),
            (t = {}),
            r('next'),
            r('throw'),
            r('return'),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function r(n) {
          t[n] =
            e[n] &&
            function (t) {
              return new Promise(function (r, a) {
                (function (e, t, n, r) {
                  Promise.resolve(r).then(function (t) {
                    e({ value: t, done: n });
                  }, t);
                })(r, a, (t = e[n](t)).done, t.value);
              });
            };
        }
      }
      function C(e, t) {
        return (
          Object.defineProperty
            ? Object.defineProperty(e, 'raw', { value: t })
            : (e.raw = t),
          e
        );
      }
      var T = Object.create
          ? function (e, t) {
              Object.defineProperty(e, 'default', { enumerable: !0, value: t });
            }
          : function (e, t) {
              e.default = t;
            },
        N = function (e) {
          return (
            (N =
              Object.getOwnPropertyNames ||
              function (e) {
                var t = [];
                for (var n in e)
                  Object.prototype.hasOwnProperty.call(e, n) && (t[t.length] = n);
                return t;
              }),
            N(e)
          );
        };
      function O(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var n = N(e), r = 0; r < n.length; r++)
            'default' !== n[r] && h(t, e, n[r]);
        return T(t, e), t;
      }
      function P(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function j(e, t, n, r) {
        if ('a' === n && !r)
          throw new TypeError('Private accessor was defined without a getter');
        if ('function' == typeof t ? e !== t || !r : !t.has(e))
          throw new TypeError(
            'Cannot read private member from an object whose class did not declare it',
          );
        return 'm' === n ? r : 'a' === n ? r.call(e) : r ? r.value : t.get(e);
      }
      function L(e, t, n, r, a) {
        if ('m' === r) throw new TypeError('Private method is not writable');
        if ('a' === r && !a)
          throw new TypeError('Private accessor was defined without a setter');
        if ('function' == typeof t ? e !== t || !a : !t.has(e))
          throw new TypeError(
            'Cannot write private member to an object whose class did not declare it',
          );
        return 'a' === r ? a.call(e, n) : a ? (a.value = n) : t.set(e, n), n;
      }
      function I(e, t) {
        if (null === t || ('object' != typeof t && 'function' != typeof t))
          throw new TypeError("Cannot use 'in' operator on non-object");
        return 'function' == typeof e ? t === e : e.has(t);
      }
      function F(e, t, n) {
        if (null != t) {
          if ('object' != typeof t && 'function' != typeof t)
            throw new TypeError('Object expected.');
          var r, a;
          if (n) {
            if (!Symbol.asyncDispose)
              throw new TypeError('Symbol.asyncDispose is not defined.');
            r = t[Symbol.asyncDispose];
          }
          if (void 0 === r) {
            if (!Symbol.dispose) throw new TypeError('Symbol.dispose is not defined.');
            (r = t[Symbol.dispose]), n && (a = r);
          }
          if ('function' != typeof r) throw new TypeError('Object not disposable.');
          a &&
            (r = function () {
              try {
                a.call(this);
              } catch (e) {
                return Promise.reject(e);
              }
            }),
            e.stack.push({ value: t, dispose: r, async: n });
        } else n && e.stack.push({ async: !0 });
        return t;
      }
      var R =
        'function' == typeof SuppressedError
          ? SuppressedError
          : function (e, t, n) {
              var r = new Error(n);
              return (r.name = 'SuppressedError'), (r.error = e), (r.suppressed = t), r;
            };
      function D(e) {
        function t(t) {
          (e.error = e.hasError
            ? new R(t, e.error, 'An error was suppressed during disposal.')
            : t),
            (e.hasError = !0);
        }
        var n,
          r = 0;
        return (function a() {
          for (; (n = e.stack.pop()); )
            try {
              if (!n.async && 1 === r)
                return (r = 0), e.stack.push(n), Promise.resolve().then(a);
              if (n.dispose) {
                var o = n.dispose.call(n.value);
                if (n.async)
                  return (
                    (r |= 2),
                    Promise.resolve(o).then(a, function (e) {
                      return t(e), a();
                    })
                  );
              } else r |= 1;
            } catch (i) {
              t(i);
            }
          if (1 === r) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
          if (e.hasError) throw e.error;
        })();
      }
      function z(e, t, n, r) {
        if ('string' == typeof e && /^\.\.?\//.test(e)) {
          if (n)
            for (var a in n) {
              var o = e.slice(-a.length);
              if (o === a || (r && o.toLowerCase() === a.toLowerCase())) {
                var i = n[a];
                return i === a ? e : e.slice(0, -a.length) + i;
              }
            }
          return e.replace(
            /\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,
            function (e, n, r, a, o) {
              return n
                ? t
                  ? '.jsx'
                  : '.js'
                : !r || (a && o)
                ? r + a + '.' + o.toLowerCase() + 'js'
                : e;
            },
          );
        }
        return e;
      }
      const M = {
        __extends: a,
        __assign: o,
        __rest: i,
        __decorate: l,
        __param: s,
        __esDecorate: u,
        __runInitializers: c,
        __propKey: d,
        __setFunctionName: f,
        __metadata: p,
        __awaiter: g,
        __generator: m,
        __createBinding: h,
        __exportStar: y,
        __values: v,
        __read: b,
        __spread: w,
        __spreadArrays: k,
        __spreadArray: S,
        __await: x,
        __asyncGenerator: E,
        __asyncDelegator: _,
        __asyncValues: A,
        __makeTemplateObject: C,
        __importStar: O,
        __importDefault: P,
        __classPrivateFieldGet: j,
        __classPrivateFieldSet: L,
        __classPrivateFieldIn: I,
        __addDisposableResource: F,
        __disposeResources: D,
        __rewriteRelativeImportExtension: z,
      };
      n.d(t, ['default', 0, M]);
    },
    2654(e) {
      'use strict';
      e.exports = {};
    },
    4054(e) {
      'use strict';
      e.exports = JSON.parse(
        '{"/core/hygen/docs-0a5":{"__comp":"5e95c892","__context":{"plugin":"aba21aa0"}},"/core/hygen/docs-d3d":{"__comp":"a7bd4aaa","__props":"12e141dd"},"/core/hygen/docs-965":{"__comp":"a94703ab"},"/core/hygen/docs/conditional-skip-719":{"__comp":"17896441","content":"0422a2f9"},"/core/hygen/docs/content-transforms-f8c":{"__comp":"17896441","content":"1948972b"},"/core/hygen/docs/create-a6b":{"__comp":"17896441","content":"56a8b04e"},"/core/hygen/docs/express-20d":{"__comp":"17896441","content":"2d1977f1"},"/core/hygen/docs/extensibility-95b":{"__comp":"17896441","content":"22f85d81"},"/core/hygen/docs/faq-342":{"__comp":"17896441","content":"3d70cde6"},"/core/hygen/docs/generators-e47":{"__comp":"17896441","content":"9972b359"},"/core/hygen/docs/glob-batch-30b":{"__comp":"17896441","content":"f369a9c8"},"/core/hygen/docs/ide-plugin-c24":{"__comp":"17896441","content":"2605654f"},"/core/hygen/docs/interactive-picker-e01":{"__comp":"17896441","content":"409e5977"},"/core/hygen/docs/packages-cca":{"__comp":"17896441","content":"c38d0ac7"},"/core/hygen/docs/prompts-53e":{"__comp":"17896441","content":"abec451a"},"/core/hygen/docs/quick-start-221":{"__comp":"17896441","content":"2cb93357"},"/core/hygen/docs/react-native-aa9":{"__comp":"17896441","content":"1c568be9"},"/core/hygen/docs/redux-f8b":{"__comp":"17896441","content":"347f7030"},"/core/hygen/docs/standalone-b10":{"__comp":"17896441","content":"50037f41"},"/core/hygen/docs/templates-9ad":{"__comp":"17896441","content":"e96c62ed"},"/core/hygen/-5d7":{"__comp":"1df93b7f","__context":{"plugin":"a7456010"},"config":"5e9f5e1a"}}',
      );
    },
  },
  (e) => {
    e.O(0, [869], () => e(5119));
    e.O();
  },
]);
