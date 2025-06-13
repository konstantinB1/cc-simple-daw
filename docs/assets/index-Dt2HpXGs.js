var _a;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3 = globalThis, e$9 = t$3.ShadowRoot && (void 0 === t$3.ShadyCSS || t$3.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$6 = Symbol(), o$7 = /* @__PURE__ */ new WeakMap();
let n$7 = class n {
  constructor(t2, e3, o2) {
    if (this._$cssResult$ = true, o2 !== s$6) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e3;
  }
  get styleSheet() {
    let t2 = this.o;
    const s4 = this.t;
    if (e$9 && void 0 === t2) {
      const e3 = void 0 !== s4 && 1 === s4.length;
      e3 && (t2 = o$7.get(s4)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e3 && o$7.set(s4, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$5 = (t2) => new n$7("string" == typeof t2 ? t2 : t2 + "", void 0, s$6), i$6 = (t2, ...e3) => {
  const o2 = 1 === t2.length ? t2[0] : e3.reduce((e4, s4, o3) => e4 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t2[o3 + 1], t2[0]);
  return new n$7(o2, t2, s$6);
}, S$1 = (s4, o2) => {
  if (e$9) s4.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e3 of o2) {
    const o3 = document.createElement("style"), n3 = t$3.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e3.cssText, s4.appendChild(o3);
  }
}, c$4 = e$9 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e3 = "";
  for (const s4 of t3.cssRules) e3 += s4.cssText;
  return r$5(e3);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$5, defineProperty: e$8, getOwnPropertyDescriptor: h$3, getOwnPropertyNames: r$4, getOwnPropertySymbols: o$6, getPrototypeOf: n$6 } = Object, a$1 = globalThis, c$3 = a$1.trustedTypes, l$1 = c$3 ? c$3.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s4) => t2, u$1 = { toAttribute(t2, s4) {
  switch (s4) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s4) {
  let i4 = t2;
  switch (s4) {
    case Boolean:
      i4 = null !== t2;
      break;
    case Number:
      i4 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i4 = JSON.parse(t2);
      } catch (t3) {
        i4 = null;
      }
  }
  return i4;
} }, f$3 = (t2, s4) => !i$5(t2, s4), b = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$3 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t2, s4), !s4.noAccessor) {
      const i4 = Symbol(), h2 = this.getPropertyDescriptor(t2, i4, s4);
      void 0 !== h2 && e$8(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s4, i4) {
    const { get: e3, set: r2 } = h$3(this.prototype, t2) ?? { get() {
      return this[s4];
    }, set(t3) {
      this[s4] = t3;
    } };
    return { get: e3, set(s5) {
      const h2 = e3 == null ? void 0 : e3.call(this);
      r2 == null ? void 0 : r2.call(this, s5), this.requestUpdate(t2, h2, i4);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$6(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s4 = [...r$4(t3), ...o$6(t3)];
      for (const i4 of s4) this.createProperty(i4, t3[i4]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s4 = litPropertyMetadata.get(t2);
      if (void 0 !== s4) for (const [t3, i4] of s4) this.elementProperties.set(t3, i4);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s4] of this.elementProperties) {
      const i4 = this._$Eu(t3, s4);
      void 0 !== i4 && this._$Eh.set(i4, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i4 = [];
    if (Array.isArray(s4)) {
      const e3 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e3) i4.unshift(c$4(s5));
    } else void 0 !== s4 && i4.push(c$4(s4));
    return i4;
  }
  static _$Eu(t2, s4) {
    const i4 = s4.attribute;
    return false === i4 ? void 0 : "string" == typeof i4 ? i4 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i4 of s4.keys()) this.hasOwnProperty(i4) && (t2.set(i4, this[i4]), delete this[i4]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s4, i4) {
    this._$AK(t2, i4);
  }
  _$ET(t2, s4) {
    var _a2;
    const i4 = this.constructor.elementProperties.get(t2), e3 = this.constructor._$Eu(t2, i4);
    if (void 0 !== e3 && true === i4.reflect) {
      const h2 = (void 0 !== ((_a2 = i4.converter) == null ? void 0 : _a2.toAttribute) ? i4.converter : u$1).toAttribute(s4, i4.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e3) : this.setAttribute(e3, h2), this._$Em = null;
    }
  }
  _$AK(t2, s4) {
    var _a2, _b;
    const i4 = this.constructor, e3 = i4._$Eh.get(t2);
    if (void 0 !== e3 && this._$Em !== e3) {
      const t3 = i4.getPropertyOptions(e3), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e3, this[e3] = h2.fromAttribute(s4, t3.type) ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e3)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t2, s4, i4) {
    var _a2;
    if (void 0 !== t2) {
      const e3 = this.constructor, h2 = this[t2];
      if (i4 ?? (i4 = e3.getPropertyOptions(t2)), !((i4.hasChanged ?? f$3)(h2, s4) || i4.useDefault && i4.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(e3._$Eu(t2, i4)))) return;
      this.C(t2, s4, i4);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s4, { useDefault: i4, reflect: e3, wrapped: h2 }, r2) {
    i4 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s4 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i4 || (s4 = void 0), this._$AL.set(t2, s4)), true === e3 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s5] of this._$Ep) this[t4] = s5;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s5, i4] of t3) {
        const { wrapped: t4 } = i4, e3 = this[s5];
        true !== t4 || this._$AL.has(s5) || void 0 === e3 || this.C(s5, void 0, i4, e3);
      }
    }
    let t2 = false;
    const s4 = this._$AL;
    try {
      t2 = this.shouldUpdate(s4), t2 ? (this.willUpdate(s4), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t2 = false, this._$EM(), s5;
    }
    t2 && this._$AE(s4);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = globalThis, i$4 = t$2.trustedTypes, s$5 = i$4 ? i$4.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e$7 = "$lit$", h$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, o$5 = "?" + h$2, n$5 = `<${o$5}>`, r$3 = document, l = () => r$3.createComment(""), c$2 = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f$2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y2 = (t2) => (i4, ...s4) => ({ _$litType$: t2, strings: i4, values: s4 }), x = y2(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$3.createTreeWalker(r$3, 129);
function P(t2, i4) {
  if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$5 ? s$5.createHTML(i4) : i4;
}
const V = (t2, i4) => {
  const s4 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i4 ? "<svg>" : 3 === i4 ? "<math>" : "", c2 = f$2;
  for (let i5 = 0; i5 < s4; i5++) {
    const s5 = t2[i5];
    let a2, u2, d2 = -1, y3 = 0;
    for (; y3 < s5.length && (c2.lastIndex = y3, u2 = c2.exec(s5), null !== u2); ) y3 = c2.lastIndex, c2 === f$2 ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 ?? f$2, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f$2 : (c2 = m, r2 = void 0);
    const x2 = c2 === m && t2[i5 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f$2 ? s5 + n$5 : d2 >= 0 ? (o2.push(a2), s5.slice(0, d2) + e$7 + s5.slice(d2) + h$2 + x2) : s5 + h$2 + (-2 === d2 ? i5 : x2);
  }
  return [P(t2, l2 + (t2[s4] || "<?>") + (2 === i4 ? "</svg>" : 3 === i4 ? "</math>" : "")), o2];
};
class N {
  constructor({ strings: t2, _$litType$: s4 }, n3) {
    let r2;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s4);
    if (this.el = N.createElement(f2, n3), C.currentNode = this.el.content, 2 === s4 || 3 === s4) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = C.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e$7)) {
          const i4 = v2[a2++], s5 = r2.getAttribute(t3).split(h$2), e3 = /([.?@])?(.*)/.exec(i4);
          d2.push({ type: 1, index: c2, name: e3[2], strings: s5, ctor: "." === e3[1] ? H : "?" === e3[1] ? I : "@" === e3[1] ? L : k }), r2.removeAttribute(t3);
        } else t3.startsWith(h$2) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($.test(r2.tagName)) {
          const t3 = r2.textContent.split(h$2), s5 = t3.length - 1;
          if (s5 > 0) {
            r2.textContent = i$4 ? i$4.emptyScript : "";
            for (let i4 = 0; i4 < s5; i4++) r2.append(t3[i4], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s5], l());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === o$5) d2.push({ type: 2, index: c2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(h$2, t3 + 1)); ) d2.push({ type: 7, index: c2 }), t3 += h$2.length - 1;
      }
      c2++;
    }
  }
  static createElement(t2, i4) {
    const s4 = r$3.createElement("template");
    return s4.innerHTML = t2, s4;
  }
}
function S(t2, i4, s4 = t2, e3) {
  var _a2, _b;
  if (i4 === T) return i4;
  let h2 = void 0 !== e3 ? (_a2 = s4._$Co) == null ? void 0 : _a2[e3] : s4._$Cl;
  const o2 = c$2(i4) ? void 0 : i4._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s4, e3)), void 0 !== e3 ? (s4._$Co ?? (s4._$Co = []))[e3] = h2 : s4._$Cl = h2), void 0 !== h2 && (i4 = S(t2, h2._$AS(t2, i4.values), h2, e3)), i4;
}
class M {
  constructor(t2, i4) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i4;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i4 }, parts: s4 } = this._$AD, e3 = ((t2 == null ? void 0 : t2.creationScope) ?? r$3).importNode(i4, true);
    C.currentNode = e3;
    let h2 = C.nextNode(), o2 = 0, n3 = 0, l2 = s4[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i5;
        2 === l2.type ? i5 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i5 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i5 = new z(h2, this, t2)), this._$AV.push(i5), l2 = s4[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
    }
    return C.currentNode = r$3, e3;
  }
  p(t2) {
    let i4 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t2, s4, i4), i4 += s4.strings.length - 2) : s4._$AI(t2[i4])), i4++;
  }
}
class R {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i4, s4, e3) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i4, this._$AM = s4, this.options = e3, this._$Cv = (e3 == null ? void 0 : e3.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i4 = this._$AM;
    return void 0 !== i4 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i4.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i4 = this) {
    t2 = S(this, t2, i4), c$2(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== E && c$2(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$3.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i4, _$litType$: s4 } = t2, e3 = "number" == typeof s4 ? this._$AC(t2) : (void 0 === s4.el && (s4.el = N.createElement(P(s4.h, s4.h[0]), this.options)), s4);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e3) this._$AH.p(i4);
    else {
      const t3 = new M(e3, this), s5 = t3.u(this.options);
      t3.p(i4), this.T(s5), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i4 = A.get(t2.strings);
    return void 0 === i4 && A.set(t2.strings, i4 = new N(t2)), i4;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i4 = this._$AH;
    let s4, e3 = 0;
    for (const h2 of t2) e3 === i4.length ? i4.push(s4 = new R(this.O(l()), this.O(l()), this, this.options)) : s4 = i4[e3], s4._$AI(h2), e3++;
    e3 < i4.length && (this._$AR(s4 && s4._$AB.nextSibling, e3), i4.length = e3);
  }
  _$AR(t2 = this._$AA.nextSibling, i4) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i4); t2 && t2 !== this._$AB; ) {
      const i5 = t2.nextSibling;
      t2.remove(), t2 = i5;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i4, s4, e3, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i4, this._$AM = e3, this.options = h2, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = E;
  }
  _$AI(t2, i4 = this, s4, e3) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = S(this, t2, i4, 0), o2 = !c$2(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
    else {
      const e4 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = S(this, e4[s4 + n3], i4, n3), r2 === T && (r2 = this._$AH[n3]), o2 || (o2 = !c$2(r2) || r2 !== this._$AH[n3]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e3 && this.j(t2);
  }
  j(t2) {
    t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === E ? void 0 : t2;
  }
}
class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
  }
}
class L extends k {
  constructor(t2, i4, s4, e3, h2) {
    super(t2, i4, s4, e3, h2), this.type = 5;
  }
  _$AI(t2, i4 = this) {
    if ((t2 = S(this, t2, i4, 0) ?? E) === T) return;
    const s4 = this._$AH, e3 = t2 === E && s4 !== E || t2.capture !== s4.capture || t2.once !== s4.once || t2.passive !== s4.passive, h2 = t2 !== E && (s4 === E || e3);
    e3 && this.element.removeEventListener(this.name, this, s4), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class z {
  constructor(t2, i4, s4) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    S(this, t2);
  }
}
const j = t$2.litHtmlPolyfillSupport;
j == null ? void 0 : j(N, R), (t$2.litHtmlVersions ?? (t$2.litHtmlVersions = [])).push("3.3.0");
const B = (t2, i4, s4) => {
  const e3 = (s4 == null ? void 0 : s4.renderBefore) ?? i4;
  let h2 = e3._$litPart$;
  if (void 0 === h2) {
    const t3 = (s4 == null ? void 0 : s4.renderBefore) ?? null;
    e3._$litPart$ = h2 = new R(i4.insertBefore(l(), t3), t3, void 0, s4 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s$4 = globalThis;
let i$3 = class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return T;
  }
};
i$3._$litElement$ = true, i$3["finalized"] = true, (_a = s$4.litElementHydrateSupport) == null ? void 0 : _a.call(s$4, { LitElement: i$3 });
const o$4 = s$4.litElementPolyfillSupport;
o$4 == null ? void 0 : o$4({ LitElement: i$3 });
(s$4.litElementVersions ?? (s$4.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = (t2) => (e3, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e3);
  }) : customElements.define(t2, e3);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o$3 = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$3 }, r$2 = (t2 = o$3, e3, r2) => {
  const { kind: n3, metadata: i4 } = r2;
  let s4 = globalThis.litPropertyMetadata.get(i4);
  if (void 0 === s4 && globalThis.litPropertyMetadata.set(i4, s4 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s4.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e3.get.call(this);
      e3.set.call(this, r3), this.requestUpdate(o2, n4, t2);
    }, init(e4) {
      return void 0 !== e4 && this.C(o2, void 0, t2, e4), e4;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e3.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n$4(t2) {
  return (e3, o2) => "object" == typeof o2 ? r$2(t2, e3, o2) : ((t3, e4, o3) => {
    const r2 = e4.hasOwnProperty(o3);
    return e4.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e4, o3) : void 0;
  })(t2, e3, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r$1(r2) {
  return n$4({ ...r2, state: true, attribute: false });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$6 = (e3, t2, c2) => (c2.configurable = true, c2.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e3, t2, c2), c2);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e$5(e3, r2) {
  return (n3, s4, i4) => {
    const o2 = (t2) => {
      var _a2;
      return ((_a2 = t2.renderRoot) == null ? void 0 : _a2.querySelector(e3)) ?? null;
    };
    return e$6(n3, s4, { get() {
      return o2(this);
    } });
  };
}
var __defProp$k = Object.defineProperty;
var __getOwnPropDesc$y = Object.getOwnPropertyDescriptor;
var __decorateClass$B = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$y(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$k(target, key, result);
  return result;
};
let Slider = class extends i$3 {
  constructor() {
    super(...arguments);
    this.height = 100;
  }
  render() {
    return x`
            <input
                type="range"
                orientation="vertical"
                min="0"
                max="100"
                value="50"
            />
        `;
  }
};
Slider.styles = [
  i$6`
            :host {
                display: block;
            }

            input[type="range"] {
                appearance: slider-vertical;
                width: 2px;
                vertical-align: bottom;
                height: 60px;
                background-color: var(--color-secondary);
            }
        `
];
__decorateClass$B([
  n$4({ type: Number })
], Slider.prototype, "height", 2);
Slider = __decorateClass$B([
  t$1("daw-slider")
], Slider);
const typography = i$6`
    .typography-100 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 100;
        font-style: normal;
    }

    .typography-200 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 200;
        font-style: normal;
    }

    .typography-300 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
    }

    .typography-400 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }

    .typography-500 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 500;
        font-style: normal;
    }
`;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = { ATTRIBUTE: 1, CHILD: 2 }, e$4 = (t2) => (...e3) => ({ _$litDirective$: t2, values: e3 });
let i$2 = class i2 {
  constructor(t2) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t2, e3, i4) {
    this._$Ct = t2, this._$AM = e3, this._$Ci = i4;
  }
  _$AS(t2, e3) {
    return this.update(t2, e3);
  }
  update(t2, e3) {
    return this.render(...e3);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$3 = e$4(class extends i$2 {
  constructor(t$12) {
    var _a2;
    if (super(t$12), t$12.type !== t.ATTRIBUTE || "class" !== t$12.name || ((_a2 = t$12.strings) == null ? void 0 : _a2.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return " " + Object.keys(t2).filter((s4) => t2[s4]).join(" ") + " ";
  }
  update(s4, [i4]) {
    var _a2, _b;
    if (void 0 === this.st) {
      this.st = /* @__PURE__ */ new Set(), void 0 !== s4.strings && (this.nt = new Set(s4.strings.join(" ").split(/\s/).filter((t2) => "" !== t2)));
      for (const t2 in i4) i4[t2] && !((_a2 = this.nt) == null ? void 0 : _a2.has(t2)) && this.st.add(t2);
      return this.render(i4);
    }
    const r2 = s4.element.classList;
    for (const t2 of this.st) t2 in i4 || (r2.remove(t2), this.st.delete(t2));
    for (const t2 in i4) {
      const s5 = !!i4[t2];
      s5 === this.st.has(t2) || ((_b = this.nt) == null ? void 0 : _b.has(t2)) || (s5 ? (r2.add(t2), this.st.add(t2)) : (r2.remove(t2), this.st.delete(t2)));
    }
    return T;
  }
});
var __defProp$j = Object.defineProperty;
var __getOwnPropDesc$x = Object.getOwnPropertyDescriptor;
var __decorateClass$A = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$x(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$j(target, key, result);
  return result;
};
let MpcButton = class extends i$3 {
  constructor() {
    super(...arguments);
    this.active = void 0;
    this.label = void 0;
    this.size = "medium";
  }
  get sizeClass() {
    switch (this.size) {
      case "small":
        return "btn-small";
      case "medium":
        return "btn-medium";
      case "large":
        return "btn-large";
      default:
        return "";
    }
  }
  get renderLabel() {
    if (this.label) {
      return x`<span class="label typography-200"
                >${this.label}</span
            >`;
    }
    return x``;
  }
  render() {
    return x`
            <button
                class=${e$3({
      btn: true,
      [this.sizeClass]: true,
      "active-indicator": this.active !== void 0 && this.active
    })}
            >
                ${this.renderLabel}
            </button>
        `;
  }
};
MpcButton.styles = [
  typography,
  i$6`
            .btn {
                border-radius: 5px;
                border: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                height: 40px;
                background-color: var(--color-primary);
                border: 1px solid transparent;
                cursor: pointer;
                transition: all 0.2s ease-in-out;

                &:hover {
                    transform: scale(0.98);
                    border-color: var(--color-tint-primary);
                }

                &:active {
                    transform: scale(0.95);
                }
            }

            .btn-small {
                padding: 5px 10px;
                font-size: 0.8em;
            }

            .btn-medium {
                padding: 10px 15px;
                font-size: 1em;
            }

            .btn-large {
                padding: 15px 20px;
                font-size: 1.2em;
            }

            .active-indicator {
                border: 1px solid var(--color-tint-primary);
            }

            .label {
                font-size: 1em;
                color: var(--color-text);
            }

            .active-indicator.active {
                background-color: green;
            }
        `
];
__decorateClass$A([
  n$4({ type: Boolean, attribute: "active" })
], MpcButton.prototype, "active", 2);
__decorateClass$A([
  n$4({ type: String })
], MpcButton.prototype, "label", 2);
__decorateClass$A([
  n$4({ type: String })
], MpcButton.prototype, "size", 2);
MpcButton = __decorateClass$A([
  t$1("mpc-button")
], MpcButton);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const f$1 = (o2) => void 0 === o2.strings;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s$3 = (i4, t2) => {
  var _a2;
  const e3 = i4._$AN;
  if (void 0 === e3) return false;
  for (const i5 of e3) (_a2 = i5._$AO) == null ? void 0 : _a2.call(i5, t2, false), s$3(i5, t2);
  return true;
}, o$2 = (i4) => {
  let t2, e3;
  do {
    if (void 0 === (t2 = i4._$AM)) break;
    e3 = t2._$AN, e3.delete(i4), i4 = t2;
  } while (0 === (e3 == null ? void 0 : e3.size));
}, r = (i4) => {
  for (let t2; t2 = i4._$AM; i4 = t2) {
    let e3 = t2._$AN;
    if (void 0 === e3) t2._$AN = e3 = /* @__PURE__ */ new Set();
    else if (e3.has(i4)) break;
    e3.add(i4), c$1(t2);
  }
};
function h$1(i4) {
  void 0 !== this._$AN ? (o$2(this), this._$AM = i4, r(this)) : this._$AM = i4;
}
function n$3(i4, t2 = false, e3 = 0) {
  const r2 = this._$AH, h2 = this._$AN;
  if (void 0 !== h2 && 0 !== h2.size) if (t2) if (Array.isArray(r2)) for (let i5 = e3; i5 < r2.length; i5++) s$3(r2[i5], false), o$2(r2[i5]);
  else null != r2 && (s$3(r2, false), o$2(r2));
  else s$3(this, i4);
}
const c$1 = (i4) => {
  i4.type == t.CHILD && (i4._$AP ?? (i4._$AP = n$3), i4._$AQ ?? (i4._$AQ = h$1));
};
class f extends i$2 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i4, t2, e3) {
    super._$AT(i4, t2, e3), r(this), this.isConnected = i4._$AU;
  }
  _$AO(i4, t2 = true) {
    var _a2, _b;
    i4 !== this.isConnected && (this.isConnected = i4, i4 ? (_a2 = this.reconnected) == null ? void 0 : _a2.call(this) : (_b = this.disconnected) == null ? void 0 : _b.call(this)), t2 && (s$3(this, i4), o$2(this));
  }
  setValue(t2) {
    if (f$1(this._$Ct)) this._$Ct._$AI(t2, this);
    else {
      const i4 = [...this._$Ct._$AH];
      i4[this._$Ci] = t2, this._$Ct._$AI(i4, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
function getTarget(targetOrSelector) {
  let target = targetOrSelector;
  if (typeof target === "string") {
    target = document.querySelector(target);
    if (target === null) {
      throw Error(`Could not locate portal target with selector "${targetOrSelector}".`);
    }
  }
  return target;
}
class PortalDirective extends f {
  constructor() {
    super(...arguments);
    this.containerId = `portal-${self.crypto.randomUUID()}`;
  }
  /**
   * Main render function for the directive.
   *
   * For clarity's sake, here is the outline of the function body::
   *
   * - Resolve `targetOrSelector` to an element.
   *
   * - If the directive's `container` property is `undefined`,
   *   - then create the container element and store it in the property.
   *
   * - If `modifyContainer` is provided in the `options`,
   *   - then call `modifyContainer(container)`.
   *
   * - If the target has changed from one element to another,
   *   - then migrate `container` to the new target and reassign the directive's `target` property.
   *
   * - If the directive's `target` property is `undefined`,
   *   - then store the target element in the property.
   *
   *   - If a `placeholder` is provided in the `options`,
   *     - then append `container` to `target` (if necessary) and render `placeholder` in `container`.
   *
   * - Resolve `content` (awaited).
   *
   * - Append `container` to `target` (if necessary) and render `content` in `container`.
   *
   * The steps are organized this way to balance the initalization and refreshing of crucial properties
   * like `container` and `target` while ensuring that `container` isn't added to the DOM until
   * the directive is about to render something (either `placeholder` or `content`).
   *
   * @param content - The content of the portal.
   * This parameter is passed as the `value` parameter in [Lit's `render` function](https://lit.dev/docs/api/templates/#render).
   *
   * The `content` parameter can be a promise, which will be rendered in the portal once it resolves.
   *
   * @param targetOrSelector - The "target" for the portal.
   * If the value is a string, then it is treated as a query selector and passed to `document.querySelector()` in order to locate the portal target.
   * If no element is found with the selector, then an error is thrown.
   *
   * @param options - See {@link PortalOptions}.
   *
   * @returns This function always returns Lit's [`nothing`](https://lit.dev/docs/api/templates/#nothing) value,
   * because nothing ever renders where the portal is used.
   */
  render(content, targetOrSelector, options) {
    Promise.resolve(targetOrSelector).then(async (targetOrSelector2) => {
      var _a2;
      if (!targetOrSelector2) {
        throw Error(
          "Target was falsy. Are you using a Lit ref before its value is defined? If so, try using Lit's @queryAsync decorator instead (https://lit.dev/docs/api/decorators/#queryAsync)."
        );
      }
      const newTarget = getTarget(targetOrSelector2);
      if (!this.container) {
        const newContainer = document.createElement("div");
        newContainer.id = this.containerId;
        if (options == null ? void 0 : options.modifyContainer) {
          options.modifyContainer(newContainer);
        }
        this.container = newContainer;
      }
      if (this.target && this.target !== newTarget) {
        (_a2 = this.target) == null ? void 0 : _a2.removeChild(this.container);
        newTarget.appendChild(this.container);
        this.target = newTarget;
      }
      if (!this.target) {
        this.target = newTarget;
        if (options == null ? void 0 : options.placeholder) {
          if (!this.target.contains(this.container)) {
            this.target.appendChild(this.container);
          }
          B(options.placeholder, this.container);
        }
      }
      const resolvedContent = await Promise.resolve(content);
      if (!this.target.contains(this.container)) {
        this.target.appendChild(this.container);
      }
      B(resolvedContent, this.container);
    });
    return E;
  }
  /** Remove container from target when the directive is disconnected. */
  disconnected() {
    var _a2, _b;
    if ((_a2 = this.target) == null ? void 0 : _a2.contains(this.container)) {
      (_b = this.target) == null ? void 0 : _b.removeChild(this.container);
    } else {
      console.warn(
        "portal directive was disconnected after the portal container was removed from the target."
      );
    }
  }
  /** Append container to target when the directive is reconnected. */
  reconnected() {
    var _a2;
    (_a2 = this.target) == null ? void 0 : _a2.appendChild(this.container);
  }
}
const portal = e$4(PortalDirective);
function fade(element2, duration = 300, delay = 0, onFinish) {
  const fadeImpl = (fadeIn) => {
    const keyframes = fadeIn ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }];
    element2.animate(keyframes, {
      duration,
      easing: "ease-in-out",
      fill: "forwards",
      delay
    }).onfinish = () => {
      if (!fadeIn) {
        element2.style.display = "none";
      }
    };
    if (fadeIn) {
      element2.style.display = "block";
    } else {
      element2.style.display = "none";
    }
  };
  return {
    in: () => fadeImpl(true),
    out: () => fadeImpl(false)
  };
}
function slide(element2, duration = 300, y3 = 50, delay = 0, onFinish) {
  const slideImpl = (direction) => {
    const behaviour = {
      [
        "inFromTop"
        /* InFromTop */
      ]: {
        instructions: [
          {
            transform: `translateY(-${y3}px)`,
            opacity: 0
          },
          {
            transform: "translateY(0)",
            opacity: 1
          }
        ],
        applyStyles: () => {
          element2.style.transform = "translateY(0)";
          element2.style.opacity = "1";
          element2.style.display = "block";
        }
      },
      [
        "outToTop"
        /* OutToTop */
      ]: {
        instructions: [
          {
            transform: "translateY(0)",
            opacity: 1
          },
          {
            transform: `translateY(-${y3}px)`,
            opacity: 0
          }
        ],
        applyStyles: () => {
          element2.style.transform = `translateY(-${y3}px)`;
          element2.style.opacity = "0";
          element2.style.display = "none";
        }
      },
      [
        "inFromBottom"
        /* InFromBottom */
      ]: {
        instructions: [
          {
            transform: `translateY(${y3}px)`,
            opacity: 0
          },
          {
            transform: "translateY(0)",
            opacity: 1
          }
        ],
        applyStyles: () => {
          element2.style.transform = "translateY(0)";
          element2.style.opacity = "1";
          element2.style.display = "block";
        }
      },
      [
        "outToBottom"
        /* OutToBottom */
      ]: {
        instructions: [
          {
            transform: "translateY(0)",
            opacity: 1
          },
          {
            transform: `translateY(${y3}px)`,
            opacity: 0
          }
        ],
        applyStyles: () => {
          element2.style.transform = `translateY(${y3}px)`;
          element2.style.opacity = "0";
          element2.style.display = "none";
        }
      },
      [
        "inFromLeft"
        /* InFromLeft */
      ]: {
        instructions: [
          {
            transform: `translateX(-${y3}px)`,
            opacity: 0
          },
          {
            transform: "translateX(0)",
            opacity: 1
          }
        ],
        applyStyles: () => {
          element2.style.transform = "translateX(0)";
          element2.style.opacity = "1";
          element2.style.display = "block";
        }
      },
      [
        "outToLeft"
        /* OutToLeft */
      ]: {
        instructions: [
          {
            transform: "translateX(0)",
            opacity: 1
          },
          {
            transform: `translateX(-${y3}px)`,
            opacity: 0
          }
        ],
        applyStyles: () => {
          element2.style.transform = `translateX(-${y3}px)`;
          element2.style.opacity = "0";
          element2.style.display = "none";
        }
      }
    };
    if (!behaviour[direction]) {
      throw new Error(`Unknown slide direction: ${direction}`);
    }
    const { instructions, applyStyles } = behaviour[direction];
    element2.animate(instructions, {
      duration,
      easing: "ease-in-out",
      fill: "forwards",
      delay
    }).onfinish = () => {
      applyStyles();
    };
  };
  return {
    [
      "inFromTop"
      /* InFromTop */
    ]: () => slideImpl(
      "inFromTop"
      /* InFromTop */
    ),
    [
      "outToTop"
      /* OutToTop */
    ]: () => slideImpl(
      "outToTop"
      /* OutToTop */
    ),
    [
      "inFromBottom"
      /* InFromBottom */
    ]: () => slideImpl(
      "inFromBottom"
      /* InFromBottom */
    ),
    [
      "outToBottom"
      /* OutToBottom */
    ]: () => slideImpl(
      "outToBottom"
      /* OutToBottom */
    ),
    [
      "inFromLeft"
      /* InFromLeft */
    ]: () => slideImpl(
      "inFromLeft"
      /* InFromLeft */
    ),
    [
      "outToLeft"
      /* OutToLeft */
    ]: () => slideImpl(
      "outToLeft"
      /* OutToLeft */
    ),
    [
      "inFromRight"
      /* InFromRight */
    ]: () => slideImpl(
      "inFromRight"
      /* InFromRight */
    ),
    [
      "outToRight"
      /* OutToRight */
    ]: () => slideImpl(
      "outToRight"
      /* OutToRight */
    )
  };
}
var __defProp$i = Object.defineProperty;
var __getOwnPropDesc$w = Object.getOwnPropertyDescriptor;
var __decorateClass$z = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$w(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$i(target, key, result);
  return result;
};
let Select = class extends i$3 {
  constructor() {
    super();
    this.options = [];
    this.placeholder = "";
    this.value = "";
    this.isOpen = false;
    this.backdropElement = null;
    this.selectMenu = null;
    this.selectedIndex = 0;
    this.backdropClick = this.backdropClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  firstUpdated(_changedProperties) {
    setTimeout(() => {
      this.slide = slide(this.selectMenu, 155, 10);
      this.fade = fade(this.backdropElement, 155);
    });
  }
  loadStyles() {
    const styles = [
      typography,
      i$6`
                .select-backdrop {
                    background-color: rgba(0, 0, 0, 0.3);
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                    display: none;
                    cursor: pointer;
                }

                .select-menu {
                    width: 100%;
                    background-color: var(--color-secondary);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    height: 100%;
                    max-height: 350px;
                    overflow-y: auto;
                }

                .select-option {
                    padding: 10px;
                    cursor: pointer;
                    background-color: var(--color-secondary);
                    border-bottom: 1px solid var(--color-accent);
                    transition: background-color 0.2s ease;
                    color: var(--color-text);
                    font-size: 0.9em;
                    box-sizing: border-box;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &:hover {
                        background-color: var(--color-accent);
                    }

                    > span {
                        font-size: 0.95em;
                    }
                }

                .select-option + .selected-item {
                    color: var(--color-text);
                    font-weight: bold;

                    &:hover {
                        background-color: var(--color-tint-primary);
                    }
                }

                .open {
                    display: block;
                }
            `
    ];
    const sheet = styles;
    const style = document.createElement("style");
    for (const s4 of sheet) {
      style.innerHTML += s4.cssText || s4.toString();
    }
    document.head.appendChild(style);
  }
  connectedCallback() {
    super.connectedCallback();
    this.loadStyles();
  }
  renderText() {
    if (this.value === "") {
      return this.placeholder || "Select an option";
    }
    const selectedOption = this.options.find(
      (option) => option.value === this.value
    );
    return selectedOption ? selectedOption.label : this.placeholder;
  }
  backdropClick(_2) {
    console.log("Backdrop clicked");
    this.slide.outToTop();
    this.fade.out();
    window.removeEventListener("keydown", this.handleKeyDown);
  }
  handleKeyDown(event) {
    const key = event.key;
    if (key === "ArrowUp") {
      this.selectedIndex = this.selectedIndex === 0 ? this.options.length - 1 : this.selectedIndex - 1;
    } else if (key === "ArrowDown") {
      this.selectedIndex = this.selectedIndex === this.options.length - 1 ? 0 : this.selectedIndex + 1;
    } else if (key === "Escape") {
      if (this.isOpen) {
        this.backdropClick(event);
      }
    } else if (key === "Enter" && this.selectedIndex !== -1) {
      const option = this.options[this.selectedIndex];
      this.value = option.value;
      this.isOpen = false;
      this.backdropClick(event);
      this.dispatchEvent(
        new CustomEvent("select-changed", {
          detail: { value: option.value },
          bubbles: true,
          composed: true
        })
      );
    }
  }
  openDropdown() {
    this.isOpen = !this.isOpen;
    const backdrop = this.backdropElement;
    backdrop.classList.toggle("open", this.isOpen);
    const selectMenu = this.selectMenu;
    selectMenu.style.display = "block";
    this.fade.in();
    this.slide.inFromTop();
    window.addEventListener("keydown", this.handleKeyDown);
  }
  get isDropdownOpen() {
    return this.isOpen;
  }
  backdropAndDropdownElement(container) {
    this.backdropElement = container;
    container.classList.add("select-backdrop");
    container.addEventListener("click", this.backdropClick);
  }
  dropdownElement(container) {
    this.selectMenu = container;
    const bounds = this.selectContainer.getBoundingClientRect();
    setTimeout(() => {
      container.style.position = "absolute";
      container.style.zIndex = "1001";
      container.style.top = `${bounds.bottom + 10}px`;
      container.style.left = `${bounds.left}px`;
      container.style.width = `${bounds.width}px`;
      container.style.display = "none";
    }, 0);
  }
  clickOption(option, index) {
    this.selectedIndex = index;
    this.value = option.value;
    this.isOpen = false;
    this.dispatchEvent(
      new CustomEvent("select-changed", {
        detail: { value: option.value },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
            <div
                @focus=${this.openDropdown}
                @blur=${this.backdropClick}
                class="select-container"
                @click=${this.openDropdown}
                tabindex="0"
            >
                <p class="typography-300">${this.renderText()}</p>
                <arrow-down-icon color="var(--color-text)" .size=${18}>
                </arrow-down-icon>
                ${portal(x``, document.body, {
      modifyContainer: this.backdropAndDropdownElement.bind(this)
    })}
                ${portal(
      x`<div class="select-menu">
                        ${this.options.map(
        (option, i4) => x`
                                <div
                                    class="${e$3({
          "select-option": true,
          "selected-item": this.selectedIndex === i4
        })}"
                                    @click="${() => this.clickOption(option, i4)}"
                                >
                                    <span class="typography-300"
                                        >${option.label}</span
                                    >
                                </div>
                            `
      )}
                    </div> `,
      document.body,
      {
        modifyContainer: this.dropdownElement.bind(this)
      }
    )}
            </div>
        `;
  }
};
Select.styles = [
  typography,
  i$6`
            .select-container {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.9em;
                width: 100%;
                border: 1px solid var(--color-accent);
                border-radius: var(--border-radius);
                padding: 12px 10px;
                background-color: var(--color-secondary);
                cursor: pointer;

                > p {
                    margin: 0;
                }
            }

            .select {
                width: 100%;
                padding: 10px;
                border-radius: 3px;
                border: 1px solid var(--color-accent);
                background-color: var(--color-secondary);
                color: var(--color-text);
            }

            .open {
                display: block; /* Show when open */
            }
        `
];
__decorateClass$z([
  n$4({ type: Array })
], Select.prototype, "options", 2);
__decorateClass$z([
  n$4({ type: String })
], Select.prototype, "placeholder", 2);
__decorateClass$z([
  n$4({ type: String })
], Select.prototype, "value", 2);
__decorateClass$z([
  e$5(".select-container")
], Select.prototype, "selectContainer", 2);
__decorateClass$z([
  r$1()
], Select.prototype, "isOpen", 2);
__decorateClass$z([
  r$1()
], Select.prototype, "selectedIndex", 2);
Select = __decorateClass$z([
  t$1("daw-select")
], Select);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n$2 = "important", i$1 = " !" + n$2, o$1 = e$4(class extends i$2 {
  constructor(t$12) {
    var _a2;
    if (super(t$12), t$12.type !== t.ATTRIBUTE || "style" !== t$12.name || ((_a2 = t$12.strings) == null ? void 0 : _a2.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return Object.keys(t2).reduce((e3, r2) => {
      const s4 = t2[r2];
      return null == s4 ? e3 : e3 + `${r2 = r2.includes("-") ? r2 : r2.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s4};`;
    }, "");
  }
  update(e3, [r2]) {
    const { style: s4 } = e3.element;
    if (void 0 === this.ft) return this.ft = new Set(Object.keys(r2)), this.render(r2);
    for (const t2 of this.ft) null == r2[t2] && (this.ft.delete(t2), t2.includes("-") ? s4.removeProperty(t2) : s4[t2] = null);
    for (const t2 in r2) {
      const e4 = r2[t2];
      if (null != e4) {
        this.ft.add(t2);
        const r3 = "string" == typeof e4 && e4.endsWith(i$1);
        t2.includes("-") || r3 ? s4.setProperty(t2, r3 ? e4.slice(0, -11) : e4, r3 ? n$2 : "") : s4[t2] = e4;
      }
    }
    return T;
  }
});
var __defProp$h = Object.defineProperty;
var __getOwnPropDesc$v = Object.getOwnPropertyDescriptor;
var __decorateClass$y = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$v(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$h(target, key, result);
  return result;
};
let DragIcon = class extends i$3 {
  constructor() {
    super(...arguments);
    this.color = "#000000";
    this.size = 24;
  }
  render() {
    return x`
            <icon-component size=${this.size}>
                <svg
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    fill="transparent"
                    xmlns="http://www.w3.org/2000/svg"
                    width=${0}
                    height=${0}
                >
                    <circle
                        cx="9.5"
                        cy="6"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="9.5"
                        cy="10"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="9.5"
                        cy="14"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="9.5"
                        cy="18"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="6"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="10"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="14"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="18"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </icon-component>
        `;
  }
};
DragIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
__decorateClass$y([
  n$4({ type: String })
], DragIcon.prototype, "color", 2);
__decorateClass$y([
  n$4({ type: Number })
], DragIcon.prototype, "size", 2);
DragIcon = __decorateClass$y([
  t$1("drag-icon")
], DragIcon);
var __defProp$g = Object.defineProperty;
var __decorateClass$x = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp$g(target, key, result);
  return result;
};
const IconConsumerMixin = (superClass) => {
  class IconConsumer extends superClass {
    constructor() {
      super(...arguments);
      this.size = 24;
      this.color = "var(--color-tint-primary)";
    }
    renderIcon() {
      return x`icon not implemented`;
    }
    render() {
      return x`
                <icon-component .size=${this.size} .color=${this.color}>
                    ${this.renderIcon()}
                </icon-component>
            `;
    }
  }
  __decorateClass$x([
    n$4({ type: Number })
  ], IconConsumer.prototype, "size");
  __decorateClass$x([
    n$4({ type: String })
  ], IconConsumer.prototype, "color");
  return IconConsumer;
};
var __getOwnPropDesc$u = Object.getOwnPropertyDescriptor;
var __decorateClass$w = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$u(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let RecordIcon = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                width=${0}
                height=${0}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle opacity="0" cx="12" cy="12" r="7" fill="#ffffff" />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
                    fill="var(--color-tint-primary)"
                />
            </svg>
        `;
  }
};
RecordIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
RecordIcon = __decorateClass$w([
  t$1("record-icon")
], RecordIcon);
var __getOwnPropDesc$t = Object.getOwnPropertyDescriptor;
var __decorateClass$v = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$t(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let PlayIcon = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                width=${0}
                height=${0}
                viewBox="-3 0 28 28"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
            >
                <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                    sketch:type="MSPage"
                >
                    <g
                        id="Icon-Set-Filled"
                        sketch:type="MSLayerGroup"
                        transform="translate(-419.000000, -571.000000)"
                        fill="var(--color-text)"
                    >
                        <path
                            d="M440.415,583.554 L421.418,571.311 C420.291,570.704 419,570.767 419,572.946 L419,597.054 C419,599.046 420.385,599.36 421.418,598.689 L440.415,586.446 C441.197,585.647 441.197,584.353 440.415,583.554"
                            id="play"
                            sketch:type="MSShapeGroup"
                        ></path>
                    </g>
                </g>
            </svg>
        `;
  }
};
PlayIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
PlayIcon = __decorateClass$v([
  t$1("play-icon")
], PlayIcon);
var __getOwnPropDesc$s = Object.getOwnPropertyDescriptor;
var __decorateClass$u = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$s(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let StopIcon = class extends IconConsumerMixin(i$3) {
  render() {
    return x`
            <icon-component size=${this.size}>
                <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        x="1"
                        y="1"
                        width="14"
                        height="14"
                        fill="var(--color-text)"
                    />
                </svg>
            </icon-component>
        `;
  }
};
StopIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
StopIcon = __decorateClass$u([
  t$1("stop-icon")
], StopIcon);
var __getOwnPropDesc$r = Object.getOwnPropertyDescriptor;
var __decorateClass$t = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$r(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let UpAndDownIcon = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                viewBox="0 0 24 24"
                id="up-down-scroll-bar-2"
                data-name="Flat Line"
                class="icon flat-line"
            >
                <polyline
                    id="primary"
                    points="10 5 12 3 14 5"
                    style="fill: none; stroke: var(--color-tint-primary); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
                ></polyline>
                <polyline
                    id="primary-2"
                    data-name="primary"
                    points="14 19 12 21 10 19"
                    style="fill: none; stroke: var(--color-tint-primary); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
                ></polyline>
                <path
                    id="primary-3"
                    data-name="primary"
                    d="M18,12H6m6-4V3m0,18V16"
                    style="fill: none; stroke: var(--color-tint-primary); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
                ></path>
            </svg>
        `;
  }
};
UpAndDownIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
UpAndDownIcon = __decorateClass$t([
  t$1("up-down-icon")
], UpAndDownIcon);
var __getOwnPropDesc$q = Object.getOwnPropertyDescriptor;
var __decorateClass$s = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$q(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let MetronomeIcon = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                fill=${this.color}
                width="800px"
                height="800px"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g fill-rule="evenodd">
                    <path
                        d="M64.458 228.867c-.428 2.167 1.007 3.91 3.226 3.893l121.557-.938c2.21-.017 3.68-1.794 3.284-3.97l-11.838-64.913c-.397-2.175-1.626-2.393-2.747-.487l-9.156 15.582c-1.12 1.907-1.71 5.207-1.313 7.388l4.915 27.03c.395 2.175-1.072 3.937-3.288 3.937H88.611c-2.211 0-3.659-1.755-3.233-3.92L114.85 62.533l28.44-.49 11.786 44.43c.567 2.139 2.01 2.386 3.236.535l8.392-12.67c1.22-1.843 1.73-5.058 1.139-7.185l-9.596-34.5c-1.184-4.257-5.735-7.677-10.138-7.638l-39.391.349c-4.415.039-8.688 3.584-9.544 7.912L64.458 228.867z"
                    />
                    <path
                        d="M118.116 198.935c-1.182 1.865-.347 3.377 1.867 3.377h12.392c2.214 0 4.968-1.524 6.143-3.39l64.55-102.463c1.18-1.871 3.906-3.697 6.076-4.074l9.581-1.667c2.177-.379 4.492-2.38 5.178-4.496l4.772-14.69c.683-2.104-.063-5.034-1.677-6.555L215.53 54.173c-1.609-1.517-4.482-1.862-6.4-.78l-11.799 6.655c-1.925 1.086-3.626 3.754-3.799 5.954l-.938 11.967c-.173 2.202-1.27 5.498-2.453 7.363l-72.026 113.603z"
                    />
                </g>
            </svg>
        `;
  }
};
MetronomeIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
MetronomeIcon = __decorateClass$s([
  t$1("metronome-icon")
], MetronomeIcon);
var __getOwnPropDesc$p = Object.getOwnPropertyDescriptor;
var __decorateClass$r = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$p(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let EQIcon = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                fill="var(--color-text)"
                viewBox="0 0 122.879 122.102"
                enable-background="new 0 0 122.879 122.102"
                xml:space="preserve"
            >
                <g>
                    <path
                        d="M9.96,0h102.96c2.744,0,5.232,1.117,7.035,2.919c1.801,1.803,2.924,4.288,2.924,7.032v102.201 c0,2.74-1.123,5.229-2.924,7.031c-1.803,1.805-4.291,2.918-7.035,2.918H9.96c-2.745,0-5.233-1.113-7.035-2.918 C1.123,117.381,0,114.893,0,112.152V9.951c0-2.745,1.123-5.229,2.925-7.032C4.727,1.117,7.215,0,9.96,0L9.96,0z M80.629,41.732 h7.365V17.8c0-1.031,0.416-1.96,1.088-2.634c0.678-0.674,1.605-1.088,2.633-1.088c1.029,0,1.961,0.414,2.631,1.088 c0.674,0.674,1.092,1.603,1.092,2.634v23.932h7.359c2.205,0,4.01,1.804,4.01,4.009l0,0c0,2.206-1.805,4.009-4.01,4.009h-7.359 v36.488c0,1.027-0.418,1.959-1.092,2.629c-0.67,0.672-1.602,1.092-2.631,1.092c-1.027,0-1.955-0.42-2.633-1.092 c-0.672-0.67-1.088-1.602-1.088-2.629V49.75h-7.365c-2.205,0-4.008-1.804-4.008-4.009l0,0 C76.621,43.536,78.424,41.732,80.629,41.732L80.629,41.732z M50.165,58.956h7.362V17.8c0-1.031,0.417-1.96,1.091-2.634 c0.671-0.674,1.603-1.088,2.633-1.088c1.022,0,1.956,0.414,2.628,1.088c0.674,0.674,1.088,1.603,1.088,2.634v41.155h7.365 c2.205,0,4.01,1.804,4.01,4.009l0,0c0,2.205-1.805,4.01-4.01,4.01h-7.365v19.264c0,1.027-0.414,1.959-1.088,2.629 c-0.672,0.672-1.605,1.092-2.628,1.092c-1.031,0-1.962-0.42-2.633-1.092c-0.674-0.67-1.091-1.602-1.091-2.629V66.975h-7.362 c-2.205,0-4.009-1.805-4.009-4.01l0,0C46.155,60.759,47.959,58.956,50.165,58.956L50.165,58.956z M19.971,41.35h7.194V17.8 c0-1.031,0.419-1.96,1.094-2.634c0.671-0.674,1.603-1.088,2.63-1.088c1.026,0,1.957,0.414,2.631,1.088 c0.674,0.674,1.088,1.603,1.088,2.634V41.35h7.53c2.205,0,4.009,1.804,4.009,4.009l0,0c0,2.205-1.804,4.009-4.009,4.009h-7.53 v36.871c0,1.027-0.415,1.959-1.088,2.629c-0.674,0.672-1.605,1.092-2.631,1.092c-1.028,0-1.959-0.42-2.63-1.092 c-0.674-0.67-1.094-1.602-1.094-2.629V49.368h-7.194c-2.205,0-4.009-1.804-4.009-4.009l0,0 C15.962,43.153,17.766,41.35,19.971,41.35L19.971,41.35z M91.715,95.18c2.205,0,4.203,0.895,5.658,2.346l0.006-0.004 c1.449,1.451,2.346,3.453,2.346,5.668c0,2.199-0.896,4.201-2.346,5.652l-0.012,0.018c-1.455,1.445-3.457,2.338-5.652,2.338 c-2.209,0-4.213-0.896-5.662-2.344l-0.123-0.139c-1.377-1.439-2.227-3.387-2.227-5.525c0-2.215,0.9-4.217,2.35-5.668 C87.502,96.074,89.506,95.18,91.715,95.18L91.715,95.18z M94.449,100.447c-0.691-0.693-1.66-1.123-2.734-1.123 c-1.064,0-2.033,0.432-2.732,1.131c-0.697,0.697-1.135,1.662-1.135,2.734c0,1.025,0.4,1.955,1.043,2.646l0.092,0.084 c0.699,0.699,1.668,1.131,2.732,1.131c1.074,0,2.043-0.426,2.734-1.123l0.008-0.008c0.691-0.695,1.127-1.662,1.127-2.73 c0-1.072-0.436-2.037-1.135-2.734l0.006-0.002L94.449,100.447L94.449,100.447z M61.249,95.18c2.205,0,4.207,0.895,5.658,2.346 l0.004-0.004c1.451,1.451,2.35,3.453,2.35,5.668c0,2.205-0.898,4.203-2.354,5.658l0.004,0.006 c-1.445,1.447-3.451,2.344-5.662,2.344c-2.202,0-4.199-0.896-5.655-2.344l-0.014-0.018c-1.448-1.451-2.339-3.447-2.339-5.646 c0-2.215,0.897-4.217,2.348-5.668l0.132-0.123C57.159,96.025,59.109,95.18,61.249,95.18L61.249,95.18z M63.982,100.447 c-0.697-0.693-1.662-1.123-2.734-1.123c-1.028,0-1.959,0.391-2.648,1.037l-0.083,0.094c-0.7,0.697-1.134,1.662-1.134,2.734 c0,1.068,0.428,2.035,1.125,2.73l0.009,0.008c0.691,0.697,1.659,1.123,2.73,1.123c1.068,0,2.031-0.432,2.734-1.131l0.006,0.002 l0.002-0.002c0.695-0.695,1.123-1.662,1.123-2.73c0-1.072-0.432-2.037-1.131-2.734l0.006-0.002L63.982,100.447L63.982,100.447z M30.89,95.18c2.211,0,4.216,0.895,5.661,2.342c1.451,1.451,2.351,3.453,2.351,5.668c0,2.205-0.9,4.203-2.354,5.658l0.003,0.006 c-1.445,1.447-3.45,2.344-5.661,2.344c-2.202,0-4.201-0.896-5.658-2.344l-0.012-0.018c-1.448-1.451-2.342-3.447-2.342-5.646 c0-2.215,0.896-4.217,2.348-5.668l0.131-0.123C26.797,96.025,28.748,95.18,30.89,95.18L30.89,95.18z M33.621,100.455 c-0.697-0.699-1.665-1.131-2.731-1.131c-1.028,0-1.959,0.391-2.647,1.037l-0.085,0.094c-0.7,0.697-1.131,1.662-1.131,2.734 c0,1.068,0.429,2.035,1.123,2.73l0.009,0.008c0.691,0.697,1.662,1.123,2.733,1.123c1.066,0,2.034-0.432,2.731-1.131l0.006,0.002 l0.003-0.002c0.696-0.695,1.125-1.662,1.125-2.73C34.754,102.117,34.323,101.152,33.621,100.455L33.621,100.455z M112.92,4.981 H9.96c-1.369,0-2.611,0.56-3.51,1.463c-0.903,0.9-1.463,2.145-1.463,3.507v102.201c0,1.361,0.56,2.607,1.463,3.506 c0.899,0.906,2.142,1.461,3.51,1.461h102.96c1.369,0,2.611-0.555,3.51-1.461c0.902-0.898,1.463-2.145,1.463-3.506V9.951 c0-1.363-0.561-2.607-1.463-3.507C115.531,5.541,114.289,4.981,112.92,4.981L112.92,4.981z"
                    />
                </g>
            </svg>
        `;
  }
};
EQIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
EQIcon = __decorateClass$r([
  t$1("eq-icon")
], EQIcon);
var __getOwnPropDesc$o = Object.getOwnPropertyDescriptor;
var __decorateClass$q = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$o(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let ForwardIcon = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2 17.5737L2 6.42632C2 4.57895 3.60064 3.41122 4.90312 4.30838L10.9998 8.76844L10.9998 7.12303C10.9998 5.50658 12.467 4.48482 13.661 5.26983L21.0784 10.1468C22.3069 10.9545 22.3069 13.0455 21.0784 13.8532L13.661 18.7302C12.467 19.5152 10.9998 18.4934 10.9998 16.877V15.2316L4.90313 19.6916C3.60065 20.5888 2 19.4211 2 17.5737Z"
                    fill="var(--color-text)"
                />
            </svg>
        `;
  }
};
ForwardIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
ForwardIcon = __decorateClass$q([
  t$1("forward-icon")
], ForwardIcon);
var __getOwnPropDesc$n = Object.getOwnPropertyDescriptor;
var __decorateClass$p = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$n(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let RewindIcon = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z"
                    fill="var(--color-text)"
                />
            </svg>
        `;
  }
};
RewindIcon.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
RewindIcon = __decorateClass$p([
  t$1("rewind-icon")
], RewindIcon);
var __getOwnPropDesc$m = Object.getOwnPropertyDescriptor;
var __decorateClass$o = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$m(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let ClockIcon$1 = class ClockIcon extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                version="1.1"
                id="_x32_"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xml:space="preserve"
            >
                <style type="text/css">
                    .st0 {
                        fill: ${this.color};
                    }
                </style>
                <g>
                    <path
                        class="st0"
                        d="M181.158,225.346l64.826,50.011l0.902,0.517l0.404,0.226c5.606,3.122,13.027,1.467,17.975-3.979l0.432-0.414
		l79.452-94.002c4.524-5.07,4.599-12.369,0.198-16.282c-4.411-3.922-11.644-2.981-16.15,2.088l-74.268,79.339l-57.338-39.928
		c-5.362-3.95-13.403-2.116-17.947,4.082C175.11,213.184,175.777,221.405,181.158,225.346z"
                    />
                    <path
                        class="st0"
                        d="M100.445,255.99c0-3.434,0.075-6.866,0.438-10.234H60.188c-0.249,3.367-0.315,6.8-0.315,10.234
		c0,3.499,0.066,6.876,0.315,10.252h40.695C100.52,262.866,100.445,259.442,100.445,255.99z"
                    />
                    <path
                        class="st0"
                        d="M172.42,124.797c3.847-2.436,7.774-4.731,11.762-6.772l1.552-0.753l-20.28-35.215
		c-5.074,2.558-10.017,5.398-14.814,8.512l20.289,35.234L172.42,124.797z"
                    />
                    <path
                        class="st0"
                        d="M82.071,165.44l35.23,20.279l8.527-14.795l-35.244-20.289C87.47,155.432,84.634,160.361,82.071,165.44z"
                    />
                    <path
                        class="st0"
                        d="M393.985,327.814c-2.116,3.998-4.341,7.91-6.844,11.701l-1.015,1.486l35.24,20.288
		c3.118-4.797,5.958-9.66,8.582-14.73l-35.15-20.355L393.985,327.814z"
                    />
                    <path
                        class="st0"
                        d="M118.044,327.748l-0.814-1.543l-35.159,20.28c2.502,5.07,5.398,10.008,8.512,14.805l35.244-20.288
		l-1.026-1.486C122.371,335.724,120.076,331.812,118.044,327.748z"
                    />
                    <path
                        class="st0"
                        d="M172.42,387.127l-1.491-1.015l-20.289,35.243c4.798,3.114,9.74,6.02,14.814,8.588l20.28-35.234l-1.552-0.752
		C180.193,391.924,176.266,389.629,172.42,387.127z"
                    />
                    <path
                        class="st0"
                        d="M326.214,117.216l14.81,8.588l20.284-35.234c-4.793-3.114-9.674-5.954-14.73-8.512L326.214,117.216z"
                    />
                    <path
                        class="st0"
                        d="M245.771,411.121v40.644c3.377,0.3,6.8,0.366,10.229,0.366c3.442,0,6.871-0.066,10.238-0.366v-40.644v-0.423
		h-20.467V411.121z"
                    />
                    <path
                        class="st0"
                        d="M266.238,100.878V60.235c-3.367-0.302-6.796-0.367-10.238-0.367c-3.429,0-6.852,0.065-10.229,0.367v40.643
		v0.423h20.467V100.878z"
                    />
                    <path
                        class="st0"
                        d="M326.214,394.774l20.364,35.168c5.056-2.643,9.937-5.474,14.73-8.588l-20.284-35.243L326.214,394.774z"
                    />
                    <path
                        class="st0"
                        d="M429.948,165.44c-2.572-5.079-5.465-10.007-8.582-14.805l-35.24,20.289l8.601,14.795L429.948,165.44z"
                    />
                    <path
                        class="st0"
                        d="M451.826,245.757h-40.69h-0.423v20.486h0.423h40.69c0.254-3.376,0.311-6.8,0.311-10.252
		C452.136,252.557,452.08,249.124,451.826,245.757z"
                    />
                    <path
                        class="st0"
                        d="M256,0C114.606,0.009,0.014,114.61,0.005,256C0.014,397.39,114.606,511.99,256,512
		c141.394-0.01,255.986-114.61,255.995-256C511.986,114.61,397.394,0.009,256,0z M256,478.966
		c-61.627-0.01-117.268-24.926-157.661-65.305C57.964,373.254,33.043,317.617,33.038,256c0.005-61.618,24.926-117.263,65.3-157.652
		C138.732,57.958,194.373,33.042,256,33.033c61.618,0.01,117.258,24.926,157.661,65.315c40.375,40.389,65.296,96.024,65.3,157.652
		c-0.005,61.617-24.926,117.254-65.3,157.661C373.258,454.041,317.618,478.957,256,478.966z"
                    />
                </g>
            </svg>
        `;
  }
};
ClockIcon$1.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
ClockIcon$1 = __decorateClass$o([
  t$1("clock-icon")
], ClockIcon$1);
var __getOwnPropDesc$l = Object.getOwnPropertyDescriptor;
var __decorateClass$n = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$l(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let ClockIcon2 = class extends IconConsumerMixin(i$3) {
  renderIcon() {
    return x`
            <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill=${this.color}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z"
                    fill=${this.color}
                />
            </svg>
        `;
  }
};
ClockIcon2.styles = i$6`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
ClockIcon2 = __decorateClass$n([
  t$1("arrow-down-icon")
], ClockIcon2);
var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$k = Object.getOwnPropertyDescriptor;
var __decorateClass$m = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$k(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$f(target, key, result);
  return result;
};
let Icon = class extends i$3 {
  constructor() {
    super(...arguments);
    this.size = 50;
  }
  render() {
    return x`
            <div
                class="icon"
                style=${o$1({
      width: this.size + "px",
      height: this.size + "px"
    })}
            >
                <slot></slot>
            </div>
        `;
  }
};
Icon.styles = [
  i$6`
            .icon {
                display: block;
                position: relative;
            }
        `
];
__decorateClass$m([
  n$4({ type: Number })
], Icon.prototype, "size", 2);
Icon = __decorateClass$m([
  t$1("icon-component")
], Icon);
var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$j = Object.getOwnPropertyDescriptor;
var __decorateClass$l = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$j(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$e(target, key, result);
  return result;
};
let IconButton = class extends i$3 {
  constructor() {
    super(...arguments);
    this.size = 50;
    this.isActive = false;
    this.labelText = "";
  }
  delegateClick(event) {
    event.stopPropagation();
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("handle-click", {
        detail: { active: this.isActive }
      })
    );
  }
  handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (this.isActive !== void 0) {
        this.delegateClick(event);
      }
    }
  }
  handleFocus(event) {
    const button = event.target;
    button.addEventListener("keydown", this.handleKeydown.bind(this));
    button.addEventListener("blur", this.handleBlur.bind(this));
  }
  handleBlur(event) {
    const button = event.target;
    button.removeEventListener("keydown", this.handleKeydown.bind(this));
    button.removeEventListener("blur", this.handleBlur.bind(this));
  }
  render() {
    return x`
            <div class="icon-button-wrapper">
                <button
                    @focus=${this.handleFocus}
                    @blur=${this.handleFocus}
                    class=${e$3({
      "icon-button": true,
      active: this.isActive && this.isActive !== void 0
    })}
                    @click=${this.delegateClick}
                    style=${o$1({
      width: this.size + "px",
      height: this.size + "px"
    })}
                >
                    <slot></slot>
                </button>
                ${this.labelText ? x`<span class="label-text typography-400"
                          >${this.labelText}</span
                      >` : ""}
            </div>
        `;
  }
};
IconButton.styles = [
  typography,
  i$6`
            .icon-button {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: var(--border-radius);
                border: 1px solid var(--color-accent);
                background-color: var(--color-primary);
                color: var(--color-white);
                cursor: pointer;
                transition: all 0.15s ease-in-out;

                &:hover {
                    transform: scale(0.96);
                    border-color: var(--color-tint-primary);
                }

                &:active {
                    transform: scale(0.91);
                }
            }

            .icon-button > svg {
                fill: var(--color-white);
            }

            .active {
                border-color: var(--color-tint-primary);
                background-color: var(--color-tint-primary-active);
            }

            .label-text {
                font-size: 0.7em;
            }

            .icon-button-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 4px;
            }
        `
];
__decorateClass$l([
  n$4({ type: Number })
], IconButton.prototype, "size", 2);
__decorateClass$l([
  n$4({ type: Boolean })
], IconButton.prototype, "isActive", 2);
__decorateClass$l([
  n$4({ type: String, attribute: "label-text" })
], IconButton.prototype, "labelText", 2);
IconButton = __decorateClass$l([
  t$1("icon-button")
], IconButton);
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function(c2) {
      const r2 = Math.random() * 16 | 0;
      const v2 = c2 === "x" ? r2 : r2 & 3 | 8;
      return v2.toString(16);
    }
  );
}
class AudioSample {
  constructor(ctx) {
    this.ctx = ctx;
  }
  async load(rawBuffer) {
    if (!this.rawBuffer && rawBuffer) {
      this.rawBuffer = rawBuffer;
    }
    if (this.audioBuffer) {
      console.warn(
        "Audio buffer already loaded, do not call load() again"
      );
      return this.audioBuffer;
    }
    try {
      const buffer = await this.ctx.decodeAudioData(
        this.rawBuffer
      );
      this.audioBuffer = buffer;
      this.duration = buffer.duration;
      return this.audioBuffer;
    } catch (error) {
      throw new Error("Failed to decode audio data");
    }
  }
}
class Logger {
  constructor() {
  }
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  log(message, ...optionalParams) {
    console.log(
      `[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`,
      ...optionalParams
    );
  }
  error(message, ...optionalParams) {
    console.error(
      `[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`,
      ...optionalParams
    );
  }
  warn(message, ...optionalParams) {
    console.warn(
      `[${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`,
      ...optionalParams
    );
  }
}
class AudioSource extends EventTarget {
  constructor(id, ctx, name, master, isMixerChannel = false) {
    super();
    this.logger = Logger.getInstance();
    this.effects = [];
    this.muted = false;
    this.subChannels = /* @__PURE__ */ new Map();
    this.bufferSources = /* @__PURE__ */ new Set();
    this.isPlaying = false;
    this.isMixerChannel = false;
    this.ctx = ctx;
    this.id = id;
    this.name = name;
    this.master = master;
    this.isMixerChannel = isMixerChannel;
    this.source = new AudioSample(ctx);
    if (this.master) {
      this.getGainNode.connect(this.master.getGainNode);
    } else {
      this.getGainNode.connect(this.ctx.destination);
    }
  }
  get getGainNode() {
    if (!this.gainNode) {
      this.gainNode = this.ctx.createGain();
    }
    return this.gainNode;
  }
  get isLoaded() {
    return this.buffer !== void 0;
  }
  setVolume(volume) {
    const gain = this.getGainNode;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.dispatchEvent(
      new CustomEvent("volumeChange", { detail: { volume } })
    );
  }
  setMuted(muted) {
    this.muted = muted;
    if (muted) {
      this.getGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    } else {
      this.getGainNode.gain.setValueAtTime(1, this.ctx.currentTime);
    }
    this.dispatchEvent(
      new CustomEvent("muteChange", { detail: { muted } })
    );
  }
  async load(sample) {
    if (this.isMixerChannel) {
      throw new Error("Cannot load sample into a mixer channel");
    }
    const audioBuffer = await this.source.load(sample);
    if (!audioBuffer) {
      throw new Error("Failed to load audio sample");
    }
    this.buffer = audioBuffer;
    this.dispatchEvent(
      new CustomEvent("sampleLoaded", {
        detail: { sample: audioBuffer }
      })
    );
  }
  async play(when = this.ctx.currentTime, offset = 0, duration, emitEvents = true, loopStart, loopEnd, onStart, onEnd) {
    if (!this.buffer) {
      throw new Error("No sample loaded to play");
    }
    if (this.muted) {
      return Promise.resolve();
    }
    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    const uuid = generateUUID();
    source.onended = () => {
      this.bufferSources.delete(source);
      if (emitEvents) {
        const event = new CustomEvent(
          "audio-channel/ended",
          {
            detail: { id: uuid, isPlaying: false }
          }
        );
        this.dispatchEvent(event);
      }
      onEnd == null ? void 0 : onEnd();
    };
    if (loopStart !== void 0 && loopEnd !== void 0) {
      source.loop = true;
      source.loopStart = loopStart;
      source.loopEnd = loopEnd;
    } else {
      source.loop = false;
    }
    source.connect(this.ctx.destination);
    source.start(when, offset, duration);
    if (emitEvents) {
      const event = new CustomEvent("audio-channel/play", {
        detail: {
          id: uuid,
          when,
          offset,
          duration: duration ?? this.buffer.duration,
          isPlaying: true
        }
      });
      this.dispatchEvent(new CustomEvent("audio-channel/play", event));
    }
    this.bufferSources.add(source);
    onStart == null ? void 0 : onStart();
    return new Promise((resolve) => {
      source.onended = () => {
        const event = new CustomEvent(
          "audio-channel/ended",
          {
            detail: {
              id: uuid,
              isPlaying: false
            }
          }
        );
        this.dispatchEvent(event);
        this.bufferSources.delete(source);
        onEnd == null ? void 0 : onEnd();
        resolve();
      };
    });
  }
  onPlay(callback) {
    this.addEventListener("audio-channel/play", (event) => {
      const playEvent = event;
      callback(playEvent);
    });
  }
  onStop(callback) {
    this.addEventListener("audio-channel/ended", (event) => {
      const stopEvent = event;
      callback(stopEvent);
    });
  }
  stop(when = 0, emitEvents = true) {
    this.bufferSources.forEach((source) => {
      source.stop(this.ctx.currentTime + when);
      source.disconnect();
    });
    this.bufferSources.clear();
    if (emitEvents) {
      this.dispatchEvent(new CustomEvent("stop"));
    }
  }
  addSubChannel(channel) {
    if (this.subChannels.has(channel.id)) {
      throw new Error(`SubChannel with id ${channel.id} already exists`);
    }
    this.subChannels.set(channel.id, channel);
    channel.setVolume(this.getGainNode.gain.value);
    channel.setMuted(this.muted);
    channel.getGainNode.connect(this.getGainNode);
    this.subChannels.forEach((subChannel) => {
      subChannel.setVolume(this.getGainNode.gain.value);
      subChannel.setMuted(this.muted);
      subChannel.getGainNode.connect(this.ctx.destination);
    });
    this.dispatchEvent(
      new CustomEvent("audio-channel/sub-channel-added", {
        detail: { channel }
      })
    );
    return channel;
  }
}
class Scheduler {
  constructor(store, lookahead = 0.1) {
    this.playbackQueue = [];
    this.stopQueue = [];
    this.prevTimeWindow = 0;
    this.store = store;
    this.lookahead = lookahead;
  }
  // Every play event will have a unique ID, so there is no need to
  // check for duplicates in the queue, but just skip it since its
  // guaranteed to be the same event
  hasId(id) {
    return this.playbackQueue.some((item) => item.params.id === id);
  }
  addToQueue(audioSource, params) {
    if (this.hasId(params.id)) {
      return;
    }
    this.playbackQueue.push({
      params,
      audioSource
    });
  }
  // Sync with external clock (Stopwatch) so we don't need
  // to use pooling to check for changes, but rather rely
  // on real time updates for the queue scheduling
  // This method needs to be called on each "tick" of the clock
  // (ie window.requestAnimationFrame + performance.now())
  startWithSyncedClock(currentTime) {
    if (this.prevTimeWindow === 0) {
      this.prevTimeWindow = currentTime;
    }
    this.playbackQueue.forEach((cur) => {
      if (!cur.params.scheduled && cur.params.startTime < currentTime + this.lookahead && cur.params.startTime >= this.prevTimeWindow) {
        this.tick(currentTime, cur);
        cur.params.scheduled = true;
      }
    });
    this.prevTimeWindow = currentTime + this.lookahead;
  }
  tick(currentTime, next = ((_b) => (_b = this.playbackQueue) == null ? void 0 : _b[0])()) {
    const { audioSource, params } = next;
    const ctxTime = this.store.audioContext.currentTime;
    const when = ctxTime + (params.startTime - currentTime);
    const endTime = params.endTime ? when + (params.endTime - params.startTime) : void 0;
    audioSource.play(when, 0, endTime, false);
    if ((params == null ? void 0 : params.endTime) && currentTime > params.endTime) {
      audioSource.stop(0);
    } else {
      this.stopQueue.push({
        audioSource,
        params
      });
    }
  }
  reschedule() {
    this.stopAndReschedule();
  }
  stopAndReschedule() {
    this.prevTimeWindow = 0;
    this.playbackQueue = this.playbackQueue.map((item) => {
      if (item.params.scheduled) {
        item.audioSource.stop(0);
      }
      return {
        ...item,
        params: {
          ...item.params,
          scheduled: false
        }
      };
    });
  }
  stop() {
    this.stopAndReschedule();
  }
}
class VSTRegistry {
  constructor() {
    this.vstPlugins = /* @__PURE__ */ new Map();
  }
  register(plugin) {
    if (this.vstPlugins.has(plugin.id)) {
      console.warn(
        `VST plugin with id ${plugin.id} is already registered.`
      );
      return;
    }
    this.vstPlugins.set(plugin.id, plugin);
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let s$2 = class s extends Event {
  constructor(s4, t2, e3, o2) {
    super("context-request", { bubbles: true, composed: true }), this.context = s4, this.contextTarget = t2, this.callback = e3, this.subscribe = o2 ?? false;
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function n$1(n3) {
  return n3;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let s$1 = class s2 {
  constructor(t2, s4, i4, h2) {
    if (this.subscribe = false, this.provided = false, this.value = void 0, this.t = (t3, s5) => {
      this.unsubscribe && (this.unsubscribe !== s5 && (this.provided = false, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = t3, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = true, this.callback && this.callback(t3, s5)), this.unsubscribe = s5;
    }, this.host = t2, void 0 !== s4.context) {
      const t3 = s4;
      this.context = t3.context, this.callback = t3.callback, this.subscribe = t3.subscribe ?? false;
    } else this.context = s4, this.callback = i4, this.subscribe = h2 ?? false;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
  }
  dispatchRequest() {
    this.host.dispatchEvent(new s$2(this.context, this.host, this.t, this.subscribe));
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class s3 {
  get value() {
    return this.o;
  }
  set value(s4) {
    this.setValue(s4);
  }
  setValue(s4, t2 = false) {
    const i4 = t2 || !Object.is(s4, this.o);
    this.o = s4, i4 && this.updateObservers();
  }
  constructor(s4) {
    this.subscriptions = /* @__PURE__ */ new Map(), this.updateObservers = () => {
      for (const [s5, { disposer: t2 }] of this.subscriptions) s5(this.o, t2);
    }, void 0 !== s4 && (this.value = s4);
  }
  addCallback(s4, t2, i4) {
    if (!i4) return void s4(this.value);
    this.subscriptions.has(s4) || this.subscriptions.set(s4, { disposer: () => {
      this.subscriptions.delete(s4);
    }, consumerHost: t2 });
    const { disposer: h2 } = this.subscriptions.get(s4);
    s4(this.value, h2);
  }
  clearCallbacks() {
    this.subscriptions.clear();
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let e$2 = class e extends Event {
  constructor(t2, s4) {
    super("context-provider", { bubbles: true, composed: true }), this.context = t2, this.contextTarget = s4;
  }
};
class i3 extends s3 {
  constructor(s4, e3, i4) {
    var _a2, _b;
    super(void 0 !== e3.context ? e3.initialValue : i4), this.onContextRequest = (t2) => {
      if (t2.context !== this.context) return;
      const s5 = t2.contextTarget ?? t2.composedPath()[0];
      s5 !== this.host && (t2.stopPropagation(), this.addCallback(t2.callback, s5, t2.subscribe));
    }, this.onProviderRequest = (s5) => {
      if (s5.context !== this.context) return;
      if ((s5.contextTarget ?? s5.composedPath()[0]) === this.host) return;
      const e4 = /* @__PURE__ */ new Set();
      for (const [s6, { consumerHost: i5 }] of this.subscriptions) e4.has(s6) || (e4.add(s6), i5.dispatchEvent(new s$2(this.context, i5, s6, true)));
      s5.stopPropagation();
    }, this.host = s4, void 0 !== e3.context ? this.context = e3.context : this.context = e3, this.attachListeners(), (_b = (_a2 = this.host).addController) == null ? void 0 : _b.call(_a2, this);
  }
  attachListeners() {
    this.host.addEventListener("context-request", this.onContextRequest), this.host.addEventListener("context-provider", this.onProviderRequest);
  }
  hostConnected() {
    this.host.dispatchEvent(new e$2(this.context, this.host));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e$1({ context: e3 }) {
  return (n3, i$12) => {
    const r2 = /* @__PURE__ */ new WeakMap();
    if ("object" == typeof i$12) return { get() {
      return n3.get.call(this);
    }, set(t2) {
      return r2.get(this).setValue(t2), n3.set.call(this, t2);
    }, init(n4) {
      return r2.set(this, new i3(this, { context: e3, initialValue: n4 })), n4;
    } };
    {
      n3.constructor.addInitializer((n4) => {
        r2.set(n4, new i3(n4, { context: e3 }));
      });
      const o2 = Object.getOwnPropertyDescriptor(n3, i$12);
      let s4;
      if (void 0 === o2) {
        const t2 = /* @__PURE__ */ new WeakMap();
        s4 = { get() {
          return t2.get(this);
        }, set(e4) {
          r2.get(this).setValue(e4), t2.set(this, e4);
        }, configurable: true, enumerable: true };
      } else {
        const t2 = o2.set;
        s4 = { ...o2, set(e4) {
          r2.get(this).setValue(e4), t2 == null ? void 0 : t2.call(this, e4);
        } };
      }
      return void Object.defineProperty(n3, i$12, s4);
    }
  };
}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function c({ context: c2, subscribe: e3 }) {
  return (o2, n3) => {
    "object" == typeof n3 ? n3.addInitializer(function() {
      new s$1(this, { context: c2, callback: (t2) => {
        o2.set.call(this, t2);
      }, subscribe: e3 });
    }) : o2.constructor.addInitializer((o3) => {
      new s$1(o3, { context: c2, callback: (t2) => {
        o3[n3] = t2;
      }, subscribe: e3 });
    });
  };
}
const playbackContext = n$1(
  Symbol("playbackContext")
);
var TimeEventChange = /* @__PURE__ */ ((TimeEventChange2) => {
  TimeEventChange2[TimeEventChange2["Rewinded"] = 0] = "Rewinded";
  TimeEventChange2[TimeEventChange2["Forwarded"] = 1] = "Forwarded";
  TimeEventChange2[TimeEventChange2["SeekStart"] = 2] = "SeekStart";
  TimeEventChange2[TimeEventChange2["SeekEnd"] = 3] = "SeekEnd";
  TimeEventChange2[TimeEventChange2["Natural"] = 4] = "Natural";
  return TimeEventChange2;
})(TimeEventChange || {});
class PlaybackContextStore {
  constructor() {
    this.sources = [];
    this.isPlaying = false;
    this.isRecording = false;
    this.isLooping = false;
    this.bpm = 120;
    this.timeSignature = [4, 4];
    this.currentTime = 0;
    this.vstRegistry = new VSTRegistry();
    this.lastTimeEventChange = void 0;
    this.audioContext = new AudioContext();
    this.master = new AudioSource(
      "master",
      this.audioContext,
      "Master",
      void 0,
      true
    );
    this.preview = new AudioSource(
      "preview",
      this.audioContext,
      "Preview",
      this.master,
      true
    );
    this.scheduler = new Scheduler(this);
  }
}
function attachPlaybackContextEvents(host, ctx) {
  host.addEventListener("playback-context/bpm", (event) => {
    ctx.setValue({
      ...ctx.value,
      lastTimeEventChange: 4,
      bpm: event.detail
    });
  });
  host.addEventListener("playback-context/play", () => {
    ctx.setValue({
      ...ctx.value,
      isPlaying: true
    });
  });
  host.addEventListener("playback-context/stop", () => {
    ctx.setValue({
      ...ctx.value,
      isPlaying: false
    });
  });
  host.addEventListener("playback-context/record", () => {
    ctx.setValue({
      ...ctx.value,
      isRecording: !ctx.value.isRecording
    });
  });
  host.addEventListener("playback-context/stop-recording", () => {
    ctx.setValue({
      ...ctx.value,
      isRecording: false
    });
  });
  host.addEventListener("playback-context/toggle-loop", () => {
    ctx.setValue({
      ...ctx.value,
      isLooping: !ctx.value.isLooping
    });
  });
  host.addEventListener("playback-context/toggle-is-playing", () => {
    ctx.setValue({
      ...ctx.value,
      isPlaying: !ctx.value.isPlaying
    });
  });
  host.addEventListener(
    "playback-context/set-time-signature",
    (event) => {
      const [numerator, denominator] = event.detail;
      ctx.setValue({
        ...ctx.value,
        timeSignature: [numerator, denominator]
      });
    }
  );
  host.addEventListener(
    "playback-context/set-current-time",
    (event) => {
      const { type = 4, value } = event.detail;
      if (type === 2) {
        return;
      }
      ctx.setValue({
        ...ctx.value,
        currentTime: value,
        lastTimeEventChange: type
      });
    }
  );
  host.addEventListener("playback-context/add-channel", (event) => {
    const source = event.detail;
    if (ctx.value.sources.some((s4) => s4.id === source[0].id)) {
      console.warn(
        `AudioSource with id ${source[0].id} already exists in playback context.`
      );
    }
    ctx.setValue({
      ...ctx.value,
      sources: [...ctx.value.sources, ...source]
    });
  });
}
var __defProp$d = Object.defineProperty;
var __decorateClass$k = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp$d(target, key, result);
  return result;
};
class PlaybackContextConsumerBase {
  constructor(host) {
    this.host = host;
  }
  $setBpm(bpm) {
    this.host.dispatchEvent(
      new CustomEvent("playback-context/bpm", {
        detail: bpm,
        bubbles: true,
        composed: true
      })
    );
  }
  $play() {
    this.host.dispatchEvent(
      new CustomEvent("playback-context/play", {
        bubbles: true,
        composed: true
      })
    );
  }
  $addChannel(...channel) {
    this.host.dispatchEvent(
      new CustomEvent("playback-context/add-channel", {
        detail: channel,
        bubbles: true,
        composed: true
      })
    );
  }
  $stop() {
    this.host.dispatchEvent(
      new CustomEvent("playback-context/stop", {
        bubbles: true,
        composed: true
      })
    );
  }
  $toggleIsPlaying() {
    this.host.dispatchEvent(
      new CustomEvent("playback-context/toggle-is-playing", {
        bubbles: true,
        composed: true
      })
    );
  }
  $toggleIsRecording() {
    this.host.dispatchEvent(
      new CustomEvent("playback-context/record", {
        bubbles: true,
        composed: true
      })
    );
  }
  $setCurrentTime(ev) {
    this.host.dispatchEvent(
      new CustomEvent(
        "playback-context/set-current-time",
        {
          detail: ev,
          bubbles: true,
          composed: true
        }
      )
    );
  }
  $onBpmChange(callback) {
    this.host.addEventListener("playback-context/bpm", (event) => {
      callback(event.detail);
    });
  }
  $onCurrentTimeChange(callback) {
    this.host.addEventListener(
      "playback-context/set-current-time",
      (event) => {
        callback(event.detail);
      }
    );
  }
}
const WithPlaybackContext = (superClass) => {
  class PlaybackContextConsumer extends superClass {
    constructor() {
      super(...arguments);
      this.consumer = new PlaybackContextConsumerBase(this);
    }
  }
  __decorateClass$k([
    c({ context: playbackContext, subscribe: true }),
    r$1()
  ], PlaybackContextConsumer.prototype, "playbackContext");
  return PlaybackContextConsumer;
};
var __getOwnPropDesc$i = Object.getOwnPropertyDescriptor;
var __decorateClass$j = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$i(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let BpmPicker = class extends WithPlaybackContext(i$3) {
  constructor() {
    super(...arguments);
    this.isDragging = false;
    this.iconBounds = null;
    this.clickedPixel = 0;
    this.onMouseDown = (e3) => {
      this.isDragging = true;
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);
      this.clickedPixel = e3.clientY - this.unsafeIconBounds.top;
    };
    this.onMouseMove = (e3) => {
      if (!this.isDragging) {
        return;
      }
      const mouseY = e3.clientY - this.unsafeIconBounds.top;
      const diff = mouseY - this.clickedPixel;
      this.clickedPixel = mouseY;
      const diffBpm = Math.floor(diff / 2);
      if (diffBpm === 0) {
        return;
      }
      const currentBpm = this.playbackContext.bpm;
      const bpm = diffBpm > 0 ? Math.max(0, currentBpm - diffBpm) : Math.min(999, currentBpm - diffBpm);
      this.consumer.$setBpm(bpm);
    };
    this.onMouseUp = () => {
      this.isDragging = false;
      this.clickedPixel = 0;
      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
    };
    this.onKeyDown = (e3) => {
      let bpm = null;
      if (e3.key === "ArrowUp") {
        bpm = Math.min(999, this.playbackContext.bpm + 1);
      } else if (e3.key === "ArrowDown") {
        bpm = Math.max(0, this.playbackContext.bpm - 1);
      }
      if (bpm === null) {
        throw new Error("BPM value is null somehow");
      }
      this.consumer.$setBpm(bpm);
    };
    this.handleFocus = () => {
      window.addEventListener("keydown", this.onKeyDown);
    };
    this.handleBlur = () => {
      window.removeEventListener("keydown", this.onKeyDown);
    };
  }
  get unsafeIconBounds() {
    if (!this.iconBounds) {
      throw new Error("Icon bounds not found");
    }
    return this.iconBounds;
  }
  firstUpdated(_2) {
    var _a2, _b;
    if (!this.iconBounds) {
      const bounds = (_b = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".bpm-input-icon-wrapper")) == null ? void 0 : _b.getBoundingClientRect();
      if (!bounds) {
        throw new Error("Icon bounds not found");
      }
      this.iconBounds = bounds;
    }
  }
  render() {
    return x`<div
            class="bpm-picker"
            tabindex="0"
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
        >
            <div class="bpm-input">
                <p class="typography-300 bpm-text">
                    ${this.playbackContext.bpm}
                </p>
                <div
                    class="bpm-input-icon-wrapper"
                    @mousedown=${this.onMouseDown}
                >
                    <up-down-icon></up-down-icon>
                </div>
            </div>
        </div> `;
  }
};
BpmPicker.styles = [
  typography,
  i$6`
            .bpm-picker {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                gap: 5px;
            }

            .bpm-text {
                font-size: 1.2em;
                width: 40px;
            }

            .bpm-input {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 40px;
                gap: 20px;
                border-radius: var(--border-radius);
                background-color: var(--color-primary);
                color: var(--color-text);
                padding: 0 16px;
            }

            .bpm-input-icon-wrapper {
                cursor: grab;
            }
        `
];
BpmPicker = __decorateClass$j([
  t$1("bpm-picker")
], BpmPicker);
var __getOwnPropDesc$h = Object.getOwnPropertyDescriptor;
var __decorateClass$i = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$h(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let TimeIndicator = class extends WithPlaybackContext(i$3) {
  formatedDisplayTime() {
    const ms = this.playbackContext.currentTime;
    const minutes = Math.floor(ms / 6e4);
    const seconds = Math.floor(ms % 6e4 / 1e3);
    const mil = (ms % 1e3).toFixed(0);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(mil).slice(0, 2).padStart(2, "0")}`;
  }
  render() {
    return x`
            <div class="time-indicator typography-400">
                <p>${this.formatedDisplayTime()}</p>
            </div>
        `;
  }
};
TimeIndicator.styles = [
  typography,
  i$6`
            .time-indicator {
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--color-text);
                border-radius: var(--border-radius);
                width: 170px;
                height: 50px;
                border: 1px solid var(--color-accent);
                background-color: var(--color-secondary);

                & > p {
                    text-align: center;
                    letter-spacing: 0.25em;
                    width: 170px;
                    color: var(--color-success);
                }
            }
        `
];
TimeIndicator = __decorateClass$i([
  t$1("time-indicator")
], TimeIndicator);
const getAudioAsset = async (filePath) => {
  const file = await fetch(filePath, {
    headers: {
      "Content-Type": "audio/wav"
    }
  });
  if (!file.ok) {
    throw new Error(`Failed to load file: ${filePath}`);
  }
  return await file.arrayBuffer();
};
class Metronome {
  constructor(channel, context) {
    this.lastTick = -1;
    this.countdownInterval = null;
    const sub = channel.addSubChannel(
      new AudioSource(
        "metronome-tick",
        context,
        "Metronome tick sound",
        channel
      )
    );
    this.channel = sub;
  }
  getNextBeatTime(currentTime, bpm) {
    const interval = this.metronomeInterval(bpm);
    const nextBeat = Math.floor(currentTime / interval) + 1;
    return nextBeat * interval;
  }
  tick(currentTime, bpm) {
    const nextBeatTime = this.getNextBeatTime(currentTime, bpm);
    if (nextBeatTime > this.lastTick) {
      this.lastTick = nextBeatTime;
      this.channel.play();
    }
  }
  // TODO: Use tick and scheduling to play countdown instead of setInterval
  fixedCountdown(bpm, timeSignature = 4) {
    return new Promise((resolve) => {
      let ticks = 3;
      this.countdownInterval = setInterval(() => {
        if (ticks === 0) {
          clearInterval(this.countdownInterval);
          this.lastTick = -1;
          resolve();
        } else {
          this.channel.play();
        }
        ticks--;
      }, this.metronomeInterval(bpm));
    });
  }
  cancelCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
  stop() {
    this.lastTick = -1;
  }
  rewind() {
    this.lastTick = -1;
  }
  async preloadTickSound() {
    const sound = await getAudioAsset(
      "/cc-simple-daw/assets/sounds/metronome-tick.wav"
    );
    if (!sound) {
      throw new Error("Metronome sound not found");
    }
    await this.channel.load(sound).catch((err) => {
      console.error("Failed to load metronome sound:", err);
    });
  }
  metronomeInterval(bpm) {
    return Math.floor(60 / bpm * 1e3);
  }
}
class StopWatch {
  constructor() {
    this.startTime = 0;
    this.elapsedTime = 0;
    this.running = false;
    this.requestId = null;
  }
  start(onTick, startTime = 0) {
    if (!this.running) {
      this.startTime = performance.now();
      this.elapsedTime = startTime;
      this.running = true;
      if (onTick) {
        return this.onTick(onTick.bind(this, this.getElapsedTime()));
      }
    }
  }
  stop() {
    if (this.running) {
      this.running = false;
      this.elapsedTime += performance.now() - this.startTime;
    }
    if (this.requestId !== null) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }
  reset() {
    this.elapsedTime = 0;
    this.startTime = 0;
    this.running = false;
  }
  getElapsedTime() {
    if (this.running) {
      return this.elapsedTime + (performance.now() - this.startTime);
    }
    return this.elapsedTime;
  }
  tick(cb) {
    if (!this.running) {
      return;
    }
    cb(this.getElapsedTime());
    this.requestId = window.requestAnimationFrame(this.tick.bind(this, cb));
  }
  onTick(callback) {
    if (!this.running) {
      return () => {
      };
    }
    this.requestId = window.requestAnimationFrame(
      this.tick.bind(this, callback.bind(this, this.getElapsedTime()))
    );
    return () => {
      if (this.requestId !== null) {
        window.cancelAnimationFrame(this.requestId);
        this.requestId = null;
      }
    };
  }
}
const msToSeconds = (ms, fixed = 4) => Number((ms / 1e3).toFixed(fixed));
var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$c(target, key, result);
  return result;
};
let PlaybackElement = class extends WithPlaybackContext(i$3) {
  constructor() {
    super(...arguments);
    this.isMetronomeOn = false;
    this.countdown = false;
    this.stopWatch = new StopWatch();
    this.metronomeRafId = void 0;
  }
  connectedCallback() {
    super.connectedCallback();
    this.metronome = new Metronome(
      this.playbackContext.preview,
      this.playbackContext.audioContext
    );
    this.metronome.preloadTickSound();
    this.keyboardManager.addKeys([
      {
        active: true,
        keys: ["Shift", "r"],
        description: "Toggle Recording",
        handler: () => this.handleRecord()
      },
      {
        active: true,
        keys: ["Space"],
        description: "Toggle Play/Pause",
        handler: () => this.handlePlay()
      },
      {
        active: true,
        keys: ["Shift", "m"],
        description: "Toggle Metronome",
        handler: () => this.toggleMetronome()
      },
      {
        active: true,
        keys: ["Shift", "ArrowLeft"],
        description: "Rewind to Start",
        handler: () => this.handleRewind()
      },
      {
        active: true,
        keys: ["Shift", "c"],
        description: "Toggle Countdown",
        handler: () => this.toggleCountdown()
      }
    ]);
  }
  toggleMetronome() {
    this.isMetronomeOn = !this.isMetronomeOn;
  }
  async handlePlay() {
    this.consumer.$toggleIsPlaying();
    const isPlaying = !this.playbackContext.isPlaying;
    const currentTime = this.playbackContext.currentTime;
    if (isPlaying) {
      this.metronome.cancelCountdown();
      this.stopWatch.stop();
      this.playbackContext.scheduler.stop();
    } else {
      if (this.countdown) {
        await this.metronome.fixedCountdown(this.playbackContext.bpm);
        this.stopWatch.start(() => {
          const elapsedTime = this.stopWatch.getElapsedTime();
          this.consumer.$setCurrentTime({
            value: elapsedTime,
            type: TimeEventChange.Natural
          });
        }, currentTime);
        this.playbackContext.master.stop();
      } else {
        this.stopWatch.start(() => {
          const elapsedTime = this.stopWatch.getElapsedTime();
          this.consumer.$setCurrentTime({
            value: elapsedTime,
            type: TimeEventChange.Natural
          });
          this.playbackContext.scheduler.startWithSyncedClock(
            msToSeconds(elapsedTime)
          );
        }, currentTime);
      }
    }
  }
  metronomeLoop() {
    if (this.isMetronomeOn && this.playbackContext.isPlaying) {
      this.metronome.tick(
        this.playbackContext.currentTime,
        this.playbackContext.bpm
      );
    }
    this.metronomeRafId = requestAnimationFrame(
      this.metronomeLoop.bind(this)
    );
  }
  updated(_changedProperties) {
    var _a2;
    (_a2 = super.updated) == null ? void 0 : _a2.call(this, _changedProperties);
    if (_changedProperties.has("lastTimeEventChange")) {
      this.playbackContext.scheduler.stop();
    }
    if (this.playbackContext.isPlaying && this.isMetronomeOn) {
      if (!this.metronomeRafId) {
        this.metronomeLoop();
      }
    } else if (this.metronomeRafId) {
      cancelAnimationFrame(this.metronomeRafId);
      this.metronome.stop();
      this.metronomeRafId = void 0;
    }
  }
  handleRewind() {
    this.consumer.$setCurrentTime({
      value: 0,
      type: TimeEventChange.Rewinded
    });
    this.stopWatch.reset();
    this.playbackContext.currentTime;
    if (this.playbackContext.isPlaying) {
      this.playbackContext.scheduler.reschedule();
      this.stopWatch.start();
      if (this.isMetronomeOn) {
        this.metronome.rewind();
      }
    }
  }
  handleRecord() {
    this.consumer.$toggleIsRecording();
  }
  get renderIsPlayingIcon() {
    if (!this.playbackContext.isPlaying) {
      return x`<play-icon size=${15}></play-icon>`;
    }
    return x`<stop-icon size=${15}></stop-icon>`;
  }
  toggleCountdown() {
    this.countdown = !this.countdown;
  }
  render() {
    return x`
            <div class="container">
                <div class="button-wrapper">
                    <icon-button
                        .isActive=${this.playbackContext.isRecording}
                        size=${40}
                        @handle-click=${this.handleRecord}
                    >
                        <record-icon size=${20}></record-icon>
                    </icon-button>
                    <icon-button size=${40} @handle-click=${this.handleRewind}>
                        <rewind-icon size=${20}></rewind-icon>
                    </icon-button>
                    <icon-button size=${40} @handle-click=${this.handlePlay}>
                        ${this.renderIsPlayingIcon}
                    </icon-button>
                    <icon-button size=${40}>
                        <forward-icon size=${20}></forward-icon>
                    </icon-button>
                    <bpm-picker></bpm-picker>
                    <icon-button
                        .isActive=${this.isMetronomeOn}
                        size=${40}
                        @handle-click=${this.toggleMetronome}
                    >
                        <metronome-icon></metronome-icon>
                    </icon-button>
                    <icon-button
                        .isActive=${this.countdown}
                        size=${40}
                        @handle-click=${this.toggleCountdown}
                    >
                        <clock-icon .size=${20}></clock-icon>
                    </icon-button>
                </div>
            </div>
        `;
  }
};
PlaybackElement.styles = [
  i$6`
            .button-wrapper {
                display: flex;
                gap: 6px;
            }

            .time-indicator-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100px;
            }
        `
];
__decorateClass$h([
  n$4({ type: Object })
], PlaybackElement.prototype, "keyboardManager", 2);
__decorateClass$h([
  r$1()
], PlaybackElement.prototype, "isMetronomeOn", 2);
__decorateClass$h([
  r$1()
], PlaybackElement.prototype, "countdown", 2);
PlaybackElement = __decorateClass$h([
  t$1("playback-element")
], PlaybackElement);
var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$b(target, key, result);
  return result;
};
let Navigation = class extends i$3 {
  render() {
    return x`
            <header>
                <div class="container">
                    <div class="controls-and-time">
                        <div class="recorder-wrapper">
                            <playback-element
                                .keyboardManager=${this.keyboardManager}
                            ></playback-element>
                        </div>
                        <div class="time-indicator-wrapper">
                            <time-indicator></time-indicator>
                        </div>
                    </div>
                    <nav>
                        <icon-button size=${40} label-text="Tracks List">
                            <eq-icon size=${20}></eq-icon>
                        </icon-button>
                    </nav>
                </div>
            </header>
        `;
  }
};
Navigation.styles = [
  i$6`
            header {
                background-color: var(--card-color);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 80px;
                box-shadow: 0 0px 4px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                display: flex;
            }

            .controls-and-time {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 30px;
                height: 100%;
            }

            .container {
                display: flex;
                margin: 0 auto;
                width: 80%;
                align-items: center;
                justify-content: space-between;
            }

            .nav {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                width: 100%;
            }
        `
];
__decorateClass$g([
  n$4({ type: Object })
], Navigation.prototype, "keyboardManager", 2);
Navigation = __decorateClass$g([
  t$1("top-nav")
], Navigation);
class Panel extends EventTarget {
  constructor(...[
    screenManagerInstance,
    name,
    element2,
    type,
    isVisible = false
  ]) {
    super();
    this.isCurrent = false;
    this.screenManagerInstance = screenManagerInstance;
    this.name = name;
    this.element = element2;
    this.type = type;
    this.isVisible = isVisible;
  }
  setCurrent(isCurrent) {
    this.isCurrent = isCurrent;
  }
  setVisible(isVisible) {
    this.isVisible = isVisible;
  }
}
class VSTIPanel extends Panel {
  constructor(screenManagerInstance, name, element2, isVisible = false, isDraggable = true, vstData) {
    super(
      screenManagerInstance,
      name,
      element2,
      0,
      isVisible,
      isDraggable
    );
    this.vstData = vstData;
  }
}
class CustomPanel extends Panel {
  constructor(screenManagerInstance, name, element2, isVisible = false, isDraggable = true) {
    super(
      screenManagerInstance,
      name,
      element2,
      1,
      isVisible,
      isDraggable
    );
  }
}
const _PanelScreenManager = class _PanelScreenManager extends EventTarget {
  constructor() {
    super();
    this.panels = [];
    _PanelScreenManager.instance = this;
  }
  onPanelFocused(callback) {
    this.addEventListener("panel-focus", (event) => {
      callback(event.detail.panel);
    });
  }
  add(name, panel) {
    if (this.panels.find((p2) => p2.name === name)) {
      throw new Error(`Panel with name ${name} already exists.`);
    }
    this.panels.push(panel);
    return this;
  }
  dispatchFocusEvent(context) {
    this.dispatchEvent(
      new CustomEvent("panel-focus", {
        detail: { panel: context },
        bubbles: true,
        composed: true
      })
    );
  }
  // Unfocuses all panels but does not dispatch an event.
  quetlyUnfocus() {
    for (const panel of this.panels) {
      panel.setCurrent(false);
    }
  }
  getCurrentPanel() {
    return this.panels.find((panel) => panel.isCurrent);
  }
  focusNext() {
    const currentPanel = this.getCurrentPanel();
    if (!currentPanel) {
      const first = this.panels[0];
      if (!first) {
        console.warn("No panels available to focus.");
        return void 0;
      }
      return this.focus(first.name);
    }
    const currentIndex = this.panels.indexOf(currentPanel);
    const nextIndex = (currentIndex + 1) % this.panels.length;
    const nextPanel = this.panels[nextIndex];
    if (nextPanel) {
      return this.focus(nextPanel.name);
    }
    console.warn("No next panel to focus.");
    return void 0;
  }
  focusPrevious() {
    const currentPanel = this.getCurrentPanel();
    if (!currentPanel) {
      const last = this.panels[this.panels.length - 1];
      if (!last) {
        console.warn("No panels available to focus.");
        return void 0;
      }
      return this.focus(last.name);
    }
    const currentIndex = this.panels.indexOf(currentPanel);
    const previousIndex = (currentIndex - 1 + this.panels.length) % this.panels.length;
    const previousPanel = this.panels[previousIndex];
    if (previousPanel) {
      return this.focus(previousPanel.name);
    }
    console.warn("No previous panel to focus.");
    return void 0;
  }
  // Focuses on a panel by its name.
  // If the panel is already focused, it returns the panel.
  // If the panel does not exist, it throws an error.
  // If the panel is focused, it sets all other panels to not current.
  // It also dispatches a "panel-focused" event with the focused panel.
  focus(name) {
    const panel = this.panels.find((p2) => p2.name === name);
    if (!panel) {
      throw new Error(`Panel with name ${name} does not exist.`);
    }
    if (panel.isCurrent) {
      return panel;
    }
    for (const p2 of this.panels.values()) {
      if (p2.name !== panel.name) {
        p2.setCurrent(false);
      }
    }
    panel.setCurrent(true);
    this.dispatchFocusEvent(panel);
    return panel;
  }
  // We need to handle clicks for non panel elements
  // so we can lose the current panel and dispatch a focus event
  static handleBackgroundClick() {
    const instance = _PanelScreenManager.instance;
    if (!instance) {
      console.warn("No PanelScreenManager instance found.");
      return;
    }
    instance.dispatchFocusEvent();
  }
};
_PanelScreenManager.instance = null;
let PanelScreenManager = _PanelScreenManager;
var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$a(target, key, result);
  return result;
};
let PadBank = class extends i$3 {
  constructor() {
    super(...arguments);
    this.current = PadBankSelector.A;
  }
  isCurrentBank(bank) {
    return this.current === bank;
  }
  onChangeBank(bank) {
    this.dispatchEvent(
      new CustomEvent("pad-bank-changed", {
        detail: { bank },
        bubbles: true,
        composed: true
      })
    );
  }
  renderBankButton(bank) {
    return x`
            <mpc-button
                label="${PadBankSelector[bank]}"
                .active=${this.isCurrentBank(bank)}
                @click=${() => this.onChangeBank(bank)}
            >
                ${PadBankSelector[bank]}
            </mpc-button>
        `;
  }
  get renderPadButtons() {
    return x`
            <div class="pad-bank">
                ${this.renderBankButton(PadBankSelector.A)}
                ${this.renderBankButton(PadBankSelector.B)}
                ${this.renderBankButton(PadBankSelector.C)}
                ${this.renderBankButton(PadBankSelector.D)}
            </div>
        `;
  }
  render() {
    return x`<div class="container">
            <div class="pad-container">
                <div></div>
                ${this.renderPadButtons}
            </div>
        </div>`;
  }
};
PadBank.styles = [
  i$6`
            .pad-container {
                display: flex;
                justify-content: space-between;
            }

            .pad-bank {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }
        `
];
__decorateClass$f([
  n$4({ type: Number })
], PadBank.prototype, "current", 2);
PadBank = __decorateClass$f([
  t$1("pads-bank")
], PadBank);
const programs = [{ "name": "TR-808", "description": "This is the first program.", "path": "assets/kits/TR-808", "data": [{ "name": "808", "file": "808.wav" }, { "name": "Clap", "file": "Clap.wav" }, { "name": "Claves", "file": "Claves.wav" }, { "name": "Conga High", "file": "Conga High.wav" }, { "name": "Conga Mid", "file": "Conga Mid.wav" }, { "name": "Conga Low", "file": "Conga Low.wav" }, { "name": "Cowbell", "file": "Cowbell.wav" }, { "name": "Cymbal", "file": "Cymbal.wav" }, { "name": "HiHat", "file": "Hihat.wav" }, { "name": "Kick Basic", "file": "Kick Basic.wav" }, { "name": "Kick Long", "file": "Kick Long.wav" }, { "name": "Kick Mid", "file": "Kick Mid.wav" }, { "name": "Kick Short", "file": "Kick Short.wav" }, { "name": "Maracas", "file": "Maracas.wav" }, { "name": "Open Hat Long", "file": "Open Hat Long.wav" }, { "name": "Open Hat Short", "file": "Open Hat Short.wav" }, { "name": "Rimshot", "file": "Rimshot.wav" }, { "name": "Snare Bright", "file": "Snare Bright.wav" }, { "name": "Snare High", "file": "Snare High.wav" }, { "name": "Snare Low", "file": "Snare Low.wav" }, { "name": "Snare Mid", "file": "Snare Mid.wav" }, { "name": "Tom High", "file": "Tom High.wav" }, { "name": "Tom Low", "file": "Tom Low.wav" }, { "name": "Tom Mid", "file": "Tom Mid.wav" }] }, { "name": "Program 2", "description": "This is the second program.", "version": "2.0.0", "author": "Author B" }];
const programsJson = {
  programs
};
class ProgramManager {
  constructor() {
    this.loadedPrograms = /* @__PURE__ */ new Map();
    this.currentProgram = null;
  }
  static getInstance() {
    if (!ProgramManager.instance) {
      ProgramManager.instance = new ProgramManager();
    }
    return ProgramManager.instance;
  }
  get programNames() {
    return programsJson.programs.map((program) => program.name);
  }
  async load(name) {
    if (this.loadedPrograms.has(name)) {
      return this.loadedPrograms.get(name);
    }
    const program = programsJson.programs.find((p2) => p2.name === name);
    if (!program) {
      throw new Error(`Program ${name} not found`);
    }
    const basePath = program.path;
    try {
      const audioFiles = await Promise.all(
        ((program == null ? void 0 : program.data) ?? []).map(async ({ name: name2, file }) => {
          const data = await getAudioAsset(`${basePath}/${file}`);
          return {
            name: name2,
            data
          };
        })
      );
      const loadedProgram = {
        name,
        data: audioFiles
      };
      this.loadedPrograms.set(name, loadedProgram);
      this.currentProgram = loadedProgram;
      return loadedProgram;
    } catch (error) {
      throw new Error(`Error loading program ${name}`);
    }
  }
}
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let Program = class extends i$3 {
  constructor() {
    super(...arguments);
    this.programManager = ProgramManager.getInstance();
  }
  connectedCallback() {
    super.connectedCallback();
    this.loadDefaultProgram();
  }
  get programNames() {
    return this.programManager.programNames.map((program) => ({
      label: program,
      value: program
    }));
  }
  async loadDefaultProgram() {
    const defaultProgram = "TR-808";
    try {
      const prog = await this.programManager.load(defaultProgram);
      this.emitProgramToParent(prog);
    } catch (error) {
      throw new Error("Failed to load default program");
    }
  }
  async handleSelectProgram({
    detail: { value }
  }) {
    try {
      const currentProgram = await this.programManager.load(value);
      this.emitProgramToParent(currentProgram);
    } catch (error) {
      throw new Error("Failed to load program");
    }
  }
  emitProgramToParent(data) {
    this.dispatchEvent(
      new CustomEvent("program-loaded", {
        detail: { program: data },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return x`
            <section class="container">
                <daw-select
                    placeholder="Select Program"
                    .options=${this.programNames}
                    @select-data=${this.handleSelectProgram}
                >
                </daw-select>
            </section>
        `;
  }
};
Program.styles = [
  typography,
  i$6`
            .container {
                padding: 20px 0;
            }
        `
];
Program = __decorateClass$e([
  t$1("program-container")
], Program);
var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$9(target, key, result);
  return result;
};
let Pad = class extends i$3 {
  constructor() {
    super(...arguments);
    this.volume = 0;
    this.isActive = true;
  }
  emitClickData() {
    this.dispatchEvent(
      new CustomEvent("pad-click", {
        detail: {
          mapping: this.mappedPad
        },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    var _a2, _b, _c;
    const name = ((_a2 = this.mappedPad) == null ? void 0 : _a2.name) || "Unnamed Pad";
    const key = ((_b = this.mappedPad) == null ? void 0 : _b.description) || "No Description";
    const isActive = (_c = this.mappedPad) == null ? void 0 : _c.pressed;
    return x`
            <div>
                <p class="pad-name typography-300">${name}</p>
                <button
                    @click=${this.emitClickData}
                    class=${e$3({
      pad: true,
      active: isActive !== void 0 && isActive
    })}
                >
                    <span class="key typography-500">${key}</span>
                </button>
            </div>
        `;
  }
};
Pad.styles = [
  typography,
  i$6`
            .pad {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                border-radius: 3px;
                border: 0;
                background-color: var(--color-accent);
                width: 100px;
                height: 70px;
                transition: background-color 0.4s
                    cubic-bezier(0.165, 0.84, 0.44, 1);
                box-shadow: 0px 0px 2px #1c1c1c;
                position: relative;
            }

            .pad:active,
            .active {
                background-color: #1c1c1c;
                transform: scale(1.05);
            }

            .key {
                font-size: 1em;
                color: var(--color-text);
                text-transform: uppercase;
                position: absolute;
                bottom: 8px;
                right: 10px;
            }

            .pad-name {
                font-size: 0.7em;
                color: var(--color-text);
                background-color: var(--color-secondary);
                padding: 6px;
                margin-bottom: 4px;
            }
        `
];
__decorateClass$d([
  n$4({ type: Object })
], Pad.prototype, "mappedPad", 2);
__decorateClass$d([
  n$4({ type: Number })
], Pad.prototype, "volume", 2);
__decorateClass$d([
  n$4({ type: Boolean })
], Pad.prototype, "isActive", 2);
Pad = __decorateClass$d([
  t$1("daw-pad")
], Pad);
class KeyMapping {
  constructor(keys, index, handler, active = true, description, name) {
    this.active = true;
    this.keys = keys;
    this.index = index;
    this.handler = handler;
    this.description = description;
    this.name = name;
    this.active = active;
  }
}
class KeyMappingWithPressed extends KeyMapping {
  constructor(keys, index, handler, active = true, description, name, pressed = false, oneShot = true) {
    super(keys, index, handler, active, description, name);
    this.pressed = pressed;
    this.oneShot = oneShot;
  }
}
class SimpleKeyboardKanager extends EventTarget {
  constructor() {
    super();
    this.keys = /* @__PURE__ */ new Map();
    this.pressedKeysMetadata = /* @__PURE__ */ new Map();
    this.attached = false;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  attachEventListeners() {
    console.log("SimpleKeyboardKanager: Attaching event listeners.");
    if (this.attached) {
      console.warn(
        "SimpleKeyboardKanager: Event listeners already attached."
      );
      return;
    }
    this.attached = true;
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  detachEventListeners() {
    if (!this.attached) {
      console.warn(
        "SimpleKeyboardKanager: No event listeners to detach."
      );
      return;
    }
    this.attached = false;
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
  add(keys, mapping) {
    const key = keys.join("-").toLowerCase();
    this.keys.set(key, mapping);
  }
  addKeys(keys) {
    keys.forEach((mapping) => {
      this.add(mapping.keys, mapping);
    });
  }
  remove(keys) {
    const key = keys.join("-").toLowerCase();
    this.keys.delete(key);
  }
  removeKeys(keys) {
    keys.forEach((mapping) => {
      this.remove(mapping.keys);
    });
  }
  // @ts-ignore
  onMappingHit(callback) {
    this.addEventListener("key-pressed", (event) => {
      callback(event);
    });
  }
  pressedEvent(mapping, pressed) {
    return new CustomEvent("key-pressed", {
      detail: { mapping, pressed }
    });
  }
  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (this.keys.has(key)) {
      const padKey = this.keys.get(key);
      if (padKey && !padKey.pressed) {
        padKey.pressed = true;
        this.pressedKeysMetadata.set(key, {
          startTime: performance.now()
        });
        this.dispatchEvent(this.pressedEvent(padKey, true));
      }
    }
  }
  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (this.keys.has(key)) {
      const metadata = this.pressedKeysMetadata.get(key);
      if (!metadata) {
        throw new Error(`No metadata found for key: ${key}`);
      }
      const padKey = this.keys.get(key);
      if (padKey && padKey.pressed) {
        padKey.pressed = false;
        padKey.startTime = metadata.startTime;
        padKey.endTime = performance.now();
        padKey.duration = padKey.endTime - padKey.startTime;
        this.dispatchEvent(this.pressedEvent(padKey, false));
      }
    }
  }
}
class LayeredKeyboardManager extends EventTarget {
  constructor() {
    super();
    this.keyMappings = /* @__PURE__ */ new Map();
    this.currentCombination = [];
    this.interval = null;
    this.attached = false;
    this.currentKeys = [];
    this.ignoreFn = null;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  add(keys, mapping) {
    const key = keys.join("-").toLowerCase();
    this.keyMappings.set(key, mapping);
  }
  addKeys(keys) {
    keys.forEach((mapping) => {
      this.add(mapping.keys, mapping);
    });
  }
  remove(keys) {
    const key = keys.join("-").toLowerCase();
    this.keyMappings.delete(key);
  }
  removeKeys(keys) {
    keys.forEach((mapping) => {
      this.remove(mapping.keys);
    });
  }
  handleKeyDown(event) {
    var _a2, _b;
    let key = event.key.toLowerCase();
    if ("code" in event && event.code === "Space") {
      key = event.code.toLowerCase();
    }
    if ((_a2 = this.ignoreFn) == null ? void 0 : _a2.call(this, event)) {
      return;
    }
    const prevKey = this.currentCombination[this.currentCombination.length - 1];
    if (prevKey === key) {
      return;
    }
    this.currentCombination.push(key);
    const keyCombination = this.currentCombination.length === 1 ? key : this.currentCombination.join("-").toLowerCase();
    if (this.currentCombination.length > 3) {
      this.currentCombination.shift();
    }
    if (this.keyMappings.has(keyCombination)) {
      const mapping = this.keyMappings.get(keyCombination);
      if (!mapping || !mapping.active) {
        return;
      }
      (_b = mapping.handler) == null ? void 0 : _b.call(mapping);
      this.dispatchEvent(
        new CustomEvent("mapping-hit", {
          detail: mapping,
          bubbles: true,
          composed: true
        })
      );
      this.currentKeys.push(keyCombination);
    }
    if (this.interval) {
      clearTimeout(this.interval);
    }
    this.interval = setTimeout(() => {
      this.currentCombination = [];
    }, 300);
  }
  onMappingHit(callback) {
    this.addEventListener("mapping-hit", (event) => {
      callback(event);
    });
  }
  attachEventListeners() {
    if (this.attached) {
      console.warn("KeyboardManager: Event listeners already attached.");
      return;
    }
    this.attached = true;
    document.addEventListener("keydown", this.handleKeyDown);
  }
  detachEventListeners() {
    if (!this.attached) {
      console.warn("KeyboardManager: No event listeners to detach.");
      return;
    }
    this.attached = false;
    document.removeEventListener("keydown", this.handleKeyDown);
    console.log("KeyboardManager: Event listeners detached.");
  }
}
const screenManagerContext = n$1(
  Symbol("screenManagerContext")
);
new PanelScreenManager();
var __defProp$8 = Object.defineProperty;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp$8(target, key, result);
  return result;
};
const WithScreenManager = (superClass) => {
  class PlaybackContextConsumer extends superClass {
  }
  __decorateClass$c([
    c({ context: screenManagerContext, subscribe: true }),
    r$1()
  ], PlaybackContextConsumer.prototype, "screenManager");
  return PlaybackContextConsumer;
};
var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$7(target, key, result);
  return result;
};
const noop = () => {
};
const padMappings = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h"
];
class MappedPadKeyWithPressed extends KeyMappingWithPressed {
  constructor(ctx, mapping, data, bank, index, master) {
    super(
      mapping.keys,
      mapping.index,
      mapping.handler,
      mapping.active,
      mapping.description,
      mapping.name,
      false
    );
    this.data = data;
    this.bank = bank;
    this.index = index;
    this.sample = new AudioSource(
      `pad-${mapping.name}-${bank}-${index}`,
      ctx,
      mapping.name,
      master
    );
    this.sample.load(data.data).catch((err) => {
      console.error(
        `Failed to load sample for pad ${mapping.name} in bank ${bank}:`,
        err
      );
    });
  }
}
const PADS_PER_BANK = padMappings.length;
var PadBankSelector = /* @__PURE__ */ ((PadBankSelector2) => {
  PadBankSelector2[PadBankSelector2["A"] = 0] = "A";
  PadBankSelector2[PadBankSelector2["B"] = 1] = "B";
  PadBankSelector2[PadBankSelector2["C"] = 2] = "C";
  PadBankSelector2[PadBankSelector2["D"] = 3] = "D";
  return PadBankSelector2;
})(PadBankSelector || {});
const getBank = (index) => {
  let nextBank = 0;
  if (index >= PADS_PER_BANK && index < PADS_PER_BANK * 2) {
    nextBank = 1;
  } else if (index >= PADS_PER_BANK * 2 && index < PADS_PER_BANK * 3) {
    nextBank = 2;
  } else if (index >= PADS_PER_BANK * 3) {
    nextBank = 3;
  }
  return nextBank;
};
const element = "sampler-view";
let Pads = class extends WithPlaybackContext(
  WithScreenManager(i$3)
) {
  constructor() {
    super(...arguments);
    this.samplerKeyMgr = new SimpleKeyboardKanager();
    this.mappedKeyPads = [];
    this.currentView = [];
    this.programData = null;
    this.currentBank = 0;
    this.isFocused = false;
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback();
    this.samplerMaster = new AudioSource(
      "sampler-master",
      this.playbackContext.audioContext,
      "Sampler Master",
      this.playbackContext.master,
      true
    );
    this.playbackContext.master.addSubChannel(this.samplerMaster);
    this.screenManager.onPanelFocused((p2) => {
      if ((p2 == null ? void 0 : p2.name) === this.nodeName.toLowerCase()) {
        this.samplerKeyMgr.attachEventListeners();
      } else {
        this.samplerKeyMgr.detachEventListeners();
      }
    });
    (_a2 = this.samplerKeyMgr) == null ? void 0 : _a2.onMappingHit(({ detail: { mapping, pressed } }) => {
      this.currentView = this.currentView.map((pad) => {
        if (pad.name === mapping.name) {
          if (pressed) {
            pad.sample.play().catch((err) => {
              console.error(
                `Failed to play sample for pad ${pad.name}:`,
                err
              );
            });
          } else if (!pressed && pad.pressed) {
            pad.sample.stop();
          }
          return {
            ...pad,
            pressed
          };
        }
        return pad;
      });
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.samplerKeyMgr.detachEventListeners();
  }
  getBankAndRealIndex(index) {
    const bank = getBank(index);
    const realIndex = index % PADS_PER_BANK;
    return { bank, realIndex };
  }
  createMappings() {
    var _a2;
    this.mappedKeyPads = (((_a2 = this.programData) == null ? void 0 : _a2.data) ?? []).map(
      (data, index) => {
        const { realIndex, bank } = this.getBankAndRealIndex(index);
        const key = [padMappings[realIndex]];
        const mapping = new KeyMappingWithPressed(
          key,
          realIndex,
          noop,
          // Let the key manager handle the click
          true,
          padMappings[realIndex],
          data.name
        );
        const ctx = this.playbackContext.audioContext;
        return new MappedPadKeyWithPressed(
          ctx,
          mapping,
          data,
          bank,
          index,
          this.samplerMaster
        );
      }
    );
    this.currentView = this.mappedKeyPads.filter(
      (pad) => pad.bank === this.currentBank
    );
    this.samplerKeyMgr.addKeys(this.currentBankPads);
  }
  get currentBankPads() {
    return this.mappedKeyPads.filter(
      (pad) => pad.bank === this.currentBank
    );
  }
  update(changedProperties) {
    super.update(changedProperties);
    const changed = Array.from(changedProperties.keys());
    if (changed.includes("programData")) {
      this.createMappedKeysFromProgram();
    }
  }
  createMappedKeysFromProgram() {
    this.createMappings();
    this.mappedKeyPads.forEach(({ sample }) => {
      this.samplerMaster.addSubChannel(sample);
      this.consumer.$addChannel(sample);
    });
  }
  setPadBankFromEvent(e3) {
    const bank = e3.detail.bank;
    this.samplerKeyMgr.removeKeys(this.currentBankPads);
    this.currentBank = bank;
    const next = this.mappedKeyPads.filter((pad) => pad.bank === this.currentBank).map((pad) => ({
      ...pad,
      pressed: false
      // Reset pressed state when changing bank
    }));
    this.samplerKeyMgr.addKeys(next);
    this.currentView = next;
  }
  setProgramFromEvent(e3) {
    const program = e3.detail.program;
    if (!program) {
      throw new Error("No program data provided");
    }
    this.programData = program;
  }
  handleClick(_2) {
  }
  render() {
    return x`
            <div class="top-bar">
                <div class="program-container">
                    <program-container
                        @program-loaded=${this.setProgramFromEvent}
                    ></program-container>
                </div>
                <div class="pad-bank-selector">
                    <pads-bank
                        @pad-bank-changed=${this.setPadBankFromEvent}
                        .current=${this.currentBank}
                    ></pads-bank>
                </div>
            </div>
            <div class="pads">
                ${this.currentView.map(
      (mappedPad) => x`
                        <daw-pad
                            @pad-click=${this.handleClick}
                            .mappedPad=${mappedPad}
                        ></daw-pad>
                    `
    )}
            </div>
        `;
  }
};
Pads.styles = i$6`
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;

            .program-container {
                flex: 3;
            }

            .pad-bank-selector {
                flex: 2;
            }
        }

        .pads {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(4, 1fr);
            grid-gap: 6px;
            align-items: center;
            justify-items: center;
            justify-content: center;
            align-content: center;
            height: 100%;
            padding: 20px 0;
            min-height: 450px;
        }
    `;
__decorateClass$b([
  r$1()
], Pads.prototype, "mappedKeyPads", 2);
__decorateClass$b([
  r$1()
], Pads.prototype, "currentView", 2);
__decorateClass$b([
  n$4({ type: Object })
], Pads.prototype, "programData", 2);
__decorateClass$b([
  n$4({ type: Number })
], Pads.prototype, "currentBank", 2);
__decorateClass$b([
  n$4({ type: Boolean })
], Pads.prototype, "isFocused", 2);
Pads = __decorateClass$b([
  t$1(element)
], Pads);
class SoundChannel {
  constructor(id, name, ctx, volume = 1, pan = 0, mute = false, solo = false, isActive = true) {
    this.id = id;
    this.name = name;
    this.ctx = ctx;
    this.volume = volume;
    this.pan = pan;
    this.mute = mute;
    this.solo = solo;
    this.isActive = isActive;
  }
}
class VSTInstrument {
  constructor(id, name, soundChannels = []) {
    this.id = id;
    this.name = name;
    this.soundChannels = soundChannels;
  }
  addSoundChannel(ctx, channelId, channelName, volume = 1, pan = 0, mute = false, solo = false, isActive = true) {
    const newChannel = new SoundChannel(
      channelId,
      channelName,
      ctx,
      volume,
      pan,
      mute,
      solo,
      isActive
    );
    this.soundChannels.push(newChannel);
  }
}
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
const elementName = "sampler-root";
let SamplerPanel = class extends WithScreenManager(
  WithPlaybackContext(i$3)
) {
  constructor() {
    super(...arguments);
    this.keyboardManager = new LayeredKeyboardManager();
  }
  connectedCallback() {
    super.connectedCallback();
    const vstInstrument = new VSTInstrument("Sampler", "sampler");
    this.screenManager.add(
      elementName,
      new VSTIPanel(
        this.screenManager,
        "sampler-view",
        this,
        true,
        true,
        vstInstrument
      )
    );
  }
  onSamplePlay(_2) {
  }
  render() {
    return x`
            <div class="sampler-root">
                <panel-card
                    card-height="auto"
                    card-width="500px"
                    card-id="sampler-view"
                    .startPos=${[10, 80]}
                    .isDraggable=${true}
                    padded
                    .keyboardManager=${this.keyboardManager}
                >
                    <sampler-view
                        .keyManager=${this.keyboardManager}
                        @sample-play=${this.onSamplePlay.bind(this)}
                    ></sampler-view>
                </panel-card>
            </div>
        `;
  }
};
SamplerPanel = __decorateClass$a([
  t$1(elementName)
], SamplerPanel);
const HOLD_TIMEOUT_MS = 100;
var DragEvent = /* @__PURE__ */ ((DragEvent2) => {
  DragEvent2[DragEvent2["Start"] = 0] = "Start";
  DragEvent2[DragEvent2["End"] = 1] = "End";
  DragEvent2[DragEvent2["Dragging"] = 2] = "Dragging";
  return DragEvent2;
})(DragEvent || {});
const Y_BOTTOM_PADDING = 40;
class DragController extends EventTarget {
  constructor(startPos = [0, 0]) {
    super();
    this.holdTimeout = null;
    this.dragOffset = [0, 0];
    this.pos = [0, 0];
    this.isDragging = false;
    this.handleWindowMouseMove = (event) => {
      if (!this.isDragging) {
        return;
      }
      const [offsetX, offsetY] = this.dragOffset;
      const newX = event.clientX - offsetX;
      const newY = event.clientY - offsetY;
      this.pos = [this.getX(newX), this.getY(newY)];
      this.triggerDragEvent({
        event: 2,
        coords: this.pos
      });
    };
    this.handleWindowMouseUp = (_2) => {
      if (this.holdTimeout) {
        clearTimeout(this.holdTimeout);
        this.holdTimeout = null;
      }
      this.triggerDragEvent({
        event: 1,
        coords: this.pos
      });
      window.removeEventListener("mousemove", this.handleWindowMouseMove);
      window.removeEventListener("mouseup", this.handleWindowMouseUp);
    };
    this.setStartPos(startPos);
    this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);
    this.handleWindowMouseUp = this.handleWindowMouseUp.bind(this);
  }
  setElement(element2) {
    this.element = element2;
  }
  setStartPos(pos) {
    this.pos = pos;
  }
  handleMouseDown(event) {
    if (!event.target.classList.contains("card-draggable")) {
      return;
    }
    const [x2, y3] = this.pos;
    this.dragOffset = [event.clientX - x2, event.clientY - y3];
    this.holdTimeout = setTimeout(() => {
      this.isDragging = true;
      this.triggerDragEvent({
        event: 0,
        coords: this.pos
      });
      window.addEventListener("mousemove", this.handleWindowMouseMove);
    }, HOLD_TIMEOUT_MS);
    window.addEventListener("mouseup", this.handleWindowMouseUp);
  }
  get height() {
    var _a2;
    return ((_a2 = this.element) == null ? void 0 : _a2.getBoundingClientRect().height) || 0;
  }
  getY(pos) {
    const viewportHeight = document.documentElement.clientHeight;
    if (pos < 80) {
      return 80;
    }
    if (pos + this.height > viewportHeight - Y_BOTTOM_PADDING) {
      return viewportHeight - this.height - Y_BOTTOM_PADDING;
    }
    return pos;
  }
  getX(pos) {
    var _a2;
    const width = (_a2 = this.element) == null ? void 0 : _a2.getBoundingClientRect().width;
    const viewportWidth = document.documentElement.clientWidth;
    if (pos + width > viewportWidth) {
      return viewportWidth - width - 10;
    }
    if (pos < 0) {
      return 0;
    }
    return pos;
  }
  triggerDragEvent(event) {
    const customEvent = new CustomEvent("drag-change", {
      detail: event,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(customEvent);
  }
  onDragChange(cb) {
    this.addEventListener("drag-change", (event) => {
      cb(event.detail);
    });
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e2 = () => new h();
class h {
}
const o = /* @__PURE__ */ new WeakMap(), n2 = e$4(class extends f {
  render(i4) {
    return E;
  }
  update(i4, [s4]) {
    var _a2;
    const e3 = s4 !== this.G;
    return e3 && void 0 !== this.G && this.rt(void 0), (e3 || this.lt !== this.ct) && (this.G = s4, this.ht = (_a2 = i4.options) == null ? void 0 : _a2.host, this.rt(this.ct = i4.element)), E;
  }
  rt(t2) {
    if (this.isConnected || (t2 = void 0), "function" == typeof this.G) {
      const i4 = this.ht ?? globalThis;
      let s4 = o.get(i4);
      void 0 === s4 && (s4 = /* @__PURE__ */ new WeakMap(), o.set(i4, s4)), void 0 !== s4.get(this.G) && this.G.call(this.ht, void 0), s4.set(this.G, t2), void 0 !== t2 && this.G.call(this.ht, t2);
    } else this.G.value = t2;
  }
  get lt() {
    var _a2, _b;
    return "function" == typeof this.G ? (_a2 = o.get(this.ht ?? globalThis)) == null ? void 0 : _a2.get(this.G) : (_b = this.G) == null ? void 0 : _b.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$6(target, key, result);
  return result;
};
const ELEVATED_Z_INDEX = 100;
const DEFAULT_Z_INDEX = 50;
let PanelCard = class extends WithScreenManager(i$3) {
  constructor() {
    super(...arguments);
    this.cardWidth = "auto";
    this.cardHeight = "auto";
    this.padded = false;
    this.isDragging = false;
    this.pos = [0, 0];
    this.cardRef = e2();
    this.elementZIndex = 0;
    this.isFocused = false;
  }
  firstUpdated(_changedProperties) {
    this.dragController = new DragController(this.startPos);
    this.dragController.setElement(this.cardRef.value);
    if (!this.screenManager) {
      return;
    }
    this.screenManager.onPanelFocused((panel) => {
      var _a2, _b;
      if ((panel == null ? void 0 : panel.name) === this.cardId) {
        (_a2 = this.keyboardManager) == null ? void 0 : _a2.attachEventListeners();
        this.elementZIndex = ELEVATED_Z_INDEX;
        this.isFocused = true;
      } else {
        (_b = this.keyboardManager) == null ? void 0 : _b.detachEventListeners();
        this.elementZIndex = DEFAULT_Z_INDEX;
        this.isFocused = false;
        this.screenManager.quetlyUnfocus();
      }
    });
    this.dragController.onDragChange.call(
      this.dragController,
      ({ event, coords: [x2, y3] }) => {
        switch (event) {
          case DragEvent.Start:
            this.screenManager.focus(this.cardId);
            this.isDragging = true;
            break;
          case DragEvent.Dragging:
            this.pos = [x2, y3];
            break;
          case DragEvent.End:
            this.isDragging = false;
            break;
        }
      }
    );
  }
  handleFocus() {
    this.screenManager.focus(this.cardId);
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.startPos) {
      this.pos = this.startPos;
    }
  }
  handleDoubleClick() {
  }
  render() {
    const [x$1, y3] = this.pos;
    let handleMouseDown = (_2) => {
    };
    if (this.isDraggable && this.dragController) {
      handleMouseDown = this.dragController.handleMouseDown.bind(
        this.dragController
      );
    }
    const classes = e$3({
      card: true,
      "is-dragging": this.isDragging,
      "is-focused": this.isFocused
    });
    const headerClasses = e$3({
      "card-header": true,
      "card-draggable": !!this.isDraggable
    });
    const contentClasses = e$3({
      "content-wrapper": true,
      "card-padded": this.padded
    });
    const styles = o$1({
      transform: `translate(${x$1}px, ${y3}px)`,
      width: this.cardWidth,
      height: this.cardHeight,
      zIndex: this.elementZIndex
    });
    return x`<div
            tabindex="0"
            @focus=${this.handleFocus}
            ${n2(this.cardRef)}
            id=${this.cardId}
            class=${classes}
            style=${styles}
            @mousedown="${handleMouseDown}"
            @dblclick="${this.handleDoubleClick.bind(this)}"
            @click="${this.handleFocus.bind(this)}"
        >
            <div class=${headerClasses}>
                <slot name="header"></slot>
            </div>
            <div class=${contentClasses}>
                <slot></slot>
            </div>
        </div> `;
  }
};
PanelCard.styles = i$6`
        :root {
            --color-drag: #3f3f3f;
        }

        .card {
            display: flex;
            flex-direction: column;
            background-color: var(--card-color);
            border-radius: var(--border-radius);
            border: 1px solid var(--color-accent);
            position: absolute;
            box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
        }

        .card.is-dragging {
            cursor: grabbing;
            box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2);
        }

        .card.is-focused {
            border: 1px solid #533f3f;
        }

        .card-header {
            width: 100%;
            height: 50px;
            background-color: var(--color-secondary);
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;
        }

        .content-wrapper {
            border-top: none;
            border-bottom-left-radius: inherit;
            border-bottom-right-radius: inherit;
            background-color: var(--card-color);
        }

        .card-padded {
            padding: 0 20px 20px 20px;
        }
    `;
__decorateClass$9([
  n$4({ type: Array })
], PanelCard.prototype, "startPos", 2);
__decorateClass$9([
  n$4({ type: String, attribute: "card-id" })
], PanelCard.prototype, "cardId", 2);
__decorateClass$9([
  n$4({ type: String, attribute: "card-width" })
], PanelCard.prototype, "cardWidth", 2);
__decorateClass$9([
  n$4({ type: String, attribute: "card-height" })
], PanelCard.prototype, "cardHeight", 2);
__decorateClass$9([
  n$4({ type: Boolean })
], PanelCard.prototype, "isDraggable", 2);
__decorateClass$9([
  n$4({ type: Object, attribute: false })
], PanelCard.prototype, "keyboardManager", 2);
__decorateClass$9([
  n$4({ type: Boolean, attribute: true })
], PanelCard.prototype, "padded", 2);
__decorateClass$9([
  r$1()
], PanelCard.prototype, "isDragging", 2);
__decorateClass$9([
  r$1()
], PanelCard.prototype, "pos", 2);
__decorateClass$9([
  r$1()
], PanelCard.prototype, "elementZIndex", 2);
__decorateClass$9([
  r$1()
], PanelCard.prototype, "isFocused", 2);
PanelCard = __decorateClass$9([
  t$1("panel-card")
], PanelCard);
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let AddTrackDialog = class extends i$3 {
  constructor() {
    super(...arguments);
    this.dialogRef = e2();
  }
  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.dispatchEvent(
      new CustomEvent("dialog-ready", {
        bubbles: true,
        composed: true,
        detail: { dialogRef: this.dialogRef.value }
      })
    );
  }
  render() {
    return x`
            <dialog ${n2(this.dialogRef)} id="add-track-dialog">
                <form method="dialog">
                    <h2>Add Track</h2>
                    <label for="track-name">Track Name:</label>
                    <input
                        type="text"
                        id="track-name"
                        name="track-name"
                        required
                    />

                    <label for="track-color">Track Color:</label>
                    <input
                        type="color"
                        id="track-color"
                        name="track-color"
                        value="#ffffff"
                    />

                    <button type="submit">Add Track</button>
                    <button type="button">Cancel</button>
                </form>
            </dialog>
        `;
  }
};
AddTrackDialog.styles = [
  i$6`
            dialog {
                width: 400px;
                padding: 20px;
                border-radius: 8px;
                background-color: var(--color-primary);
                border: 1px solid var(--color-accent);
                color: var(--color-white);
            }

            dialog::backdrop {
                background-color: rgba(0, 0, 0, 0.8);
            }

            form {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
        `
];
AddTrackDialog = __decorateClass$8([
  t$1("add-track-dialog")
], AddTrackDialog);
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$5(target, key, result);
  return result;
};
let PlayheadNode = class extends i$3 {
  firstUpdated() {
    var _a2;
    const playhead = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(
      ".current-time-indicator"
    );
    playhead.style.left = `${NEEDLE_START_POS}px`;
  }
  render() {
    return x`<div
            class="current-time-indicator"
            style=${o$1({
      transform: `translateX(${this.xPosition}px)`
    })}
        ></div>`;
  }
};
PlayheadNode.styles = [
  i$6`
            .current-time-indicator {
                position: absolute;
                width: 1px;
                top: 0;
                bottom: 0;
                background-color: var(--color-tint-primary);
                height: 100%;
                z-index: 10;
                left: 0;
                cursor: grabbing;

                &:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -6px;
                    width: 0;
                    height: 0;
                    border-top: 6px solid var(--color-tint-primary);
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                }
            }
        `
];
__decorateClass$7([
  n$4({ type: Number })
], PlayheadNode.prototype, "xPosition", 2);
PlayheadNode = __decorateClass$7([
  t$1("playhead-node")
], PlayheadNode);
class ContextConsumerLite {
  constructor(host, { context, callback, subscribe = false }) {
    this.subscribe = false;
    this.provided = false;
    this.value = void 0;
    this._callback = (value, unsubscribe) => {
      if (this.unsubscribe) {
        if (this.unsubscribe !== unsubscribe) {
          this.provided = false;
          this.unsubscribe();
        }
        if (!this.subscribe) {
          this.unsubscribe();
        }
      }
      this.value = value;
      if (!this.provided || this.subscribe) {
        this.provided = true;
        if (this.callback) {
          this.callback(value, unsubscribe);
        }
      }
      this.unsubscribe = unsubscribe;
    };
    this.host = host;
    this.context = context;
    this.callback = callback;
    this.subscribe = subscribe ?? false;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = void 0;
    }
  }
  dispatchRequest() {
    this.host.dispatchEvent(
      new s$2(
        this.context,
        this.host,
        this._callback,
        this.subscribe
      )
    );
  }
}
function consumeProp({
  context,
  subscribe
}) {
  return (protoOrTarget, nameOrContext) => {
    protoOrTarget.constructor.addInitializer(
      (element2) => {
        let prevValue = void 0;
        new ContextConsumerLite(element2, {
          context,
          subscribe,
          callback: (value) => {
            const next = value[nameOrContext];
            if (prevValue === void 0 || prevValue !== next) {
              element2[nameOrContext] = next;
              element2.requestUpdate(
                nameOrContext,
                prevValue
              );
            }
            prevValue = next;
          }
        });
      }
    );
  };
}
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$4(target, key, result);
  return result;
};
const getPlayheadPosition = (bpm, currentTime) => {
  const secondsPerBeat = 60 / bpm;
  const pxPerSecond = 80 / secondsPerBeat;
  return msToSeconds(currentTime) * pxPerSecond;
};
const getCurrentTimeFromPosition = (bpm, position) => {
  const secondsPerBeat = 60 / bpm;
  const pxPerSecond = 80 / secondsPerBeat;
  return position / pxPerSecond * 1e3;
};
let TimeTracker = class extends i$3 {
  constructor() {
    super();
    this.xPos = 0;
    this.playbackCtxConsumer = new PlaybackContextConsumerBase(this);
    this.seeking = false;
    this.addEventListener("mouseup", this.mouseUpHandler.bind(this));
    this.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
    this.addEventListener("mousedown", this.mouseDownHandler.bind(this));
  }
  get xLeft() {
    return this.container.getBoundingClientRect().left;
  }
  updated(_changedProperties) {
    if (_changedProperties.has("currentTime")) {
      this.xPos = getPlayheadPosition(this.bpm, this.currentTime);
    }
    if (_changedProperties.has("currentQuantisize")) {
      this.renderTimeCells();
    }
  }
  renderTimeCells() {
    const lines = [];
    const quantisizedBeats = this.currentQuantisize;
    const totalBeats = Math.ceil(MAX_TIME_BEATS * BEAT_WIDTH);
    const styles = o$1({
      maxWidth: `${BEAT_WIDTH}px`,
      minWidth: `${BEAT_WIDTH}px`
    });
    for (let i4 = 0, y3 = 1; i4 < totalBeats; i4 += quantisizedBeats, y3++) {
      lines.push(
        x`<div
                    class="typography-300 time-cell"
                    data-cellid=${y3}
                    style=${styles}
                >
                    ${i4}
                </div>`
      );
    }
    this.cachedCells = lines;
  }
  mouseUpHandler() {
    this.seeking = false;
  }
  mouseMoveHandler(e3) {
    if (this.seeking) {
      const x2 = e3.clientX - this.xLeft;
      const time = x2 <= 0 ? 0 : getCurrentTimeFromPosition(this.bpm, x2);
      this.playbackCtxConsumer.$setCurrentTime({
        value: time,
        type: TimeEventChange.SeekEnd
      });
    }
  }
  mouseDownHandler() {
    this.playbackCtxConsumer.$setCurrentTime({
      value: this.currentTime,
      type: TimeEventChange.SeekStart
    });
    this.seeking = true;
  }
  render() {
    return x`
            <div
                class="time-container"
                @mousedown=${this.mouseDownHandler}
                @mouseup=${this.mouseUpHandler}
                @click=${this.mouseUpHandler}
            >
                <playhead-node .xPosition=${this.xPos}></playhead-node>
                ${this.cachedCells}
            </div>
        `;
  }
};
TimeTracker.styles = [
  typography,
  i$6`
            .time-container {
                width: 100%;
                display: flex;
                cursor: pointer;
            }

            .time-cell {
                display: flex;
                justify-content: flex;
                align-items: center;
                font-size: 0.7em;
                border-bottom: 1px solid var(--color-accent);
                height: 50px;
                padding: 0 5px;
            }
        `
];
__decorateClass$6([
  n$4({ type: Number })
], TimeTracker.prototype, "currentQuantisize", 2);
__decorateClass$6([
  consumeProp({ context: playbackContext, subscribe: true })
], TimeTracker.prototype, "bpm", 2);
__decorateClass$6([
  consumeProp({ context: playbackContext, subscribe: true })
], TimeTracker.prototype, "currentTime", 2);
__decorateClass$6([
  r$1()
], TimeTracker.prototype, "xPos", 2);
__decorateClass$6([
  r$1()
], TimeTracker.prototype, "cachedCells", 2);
__decorateClass$6([
  e$5(".time-container")
], TimeTracker.prototype, "container", 2);
TimeTracker = __decorateClass$6([
  t$1("time-tracker")
], TimeTracker);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
  return result;
};
let TrackEvents = class extends i$3 {
  constructor() {
    super(...arguments);
    this.events = [];
    this.zIndex = 1;
  }
  connectedCallback() {
    super.connectedCallback();
    this.track.channel.onPlay(this.handlePlayEvent.bind(this));
    this.track.channel.onStop(this.handleStopEvent.bind(this));
  }
  updated(_changedProperties) {
    const children = Array.from(this.eventContainer.children);
    if (_changedProperties.has("isPlaying")) {
      this.scheduleEvents();
    }
    if (_changedProperties.has("currentTime") && this.isPlaying && this.isRecording) {
      children.forEach(this.animateWidth.bind(this));
    }
    super.updated(_changedProperties);
  }
  scheduleEvents() {
    if (!this.isPlaying) {
      return;
    }
    this.events.forEach((ev) => {
      const startTime = msToSeconds(ev.startTime);
      const endTime = msToSeconds(ev.endTime ?? 0);
      this.scheduler.addToQueue(this.track.channel, {
        startTime,
        endTime,
        id: ev.id
      });
    });
  }
  handlePlayEvent({
    detail: { id, duration }
  }) {
    if (!this.isRecording) {
      return;
    }
    const zIndex = this.zIndex + 1;
    this.events = [
      {
        id,
        startTime: this.currentTime,
        done: false,
        endTime: duration,
        xStart: getPlayheadPosition(this.bpm, this.currentTime),
        zIndex
      },
      ...this.events
    ];
    this.zIndex = zIndex;
  }
  handleStopEvent({ detail: { id } }) {
    if (!this.isRecording) {
      return;
    }
    this.events = this.events.map((ev) => {
      if (ev.id === id && !(ev == null ? void 0 : ev.done)) {
        return {
          ...ev,
          done: true,
          endTime: this.currentTime,
          xEnd: getPlayheadPosition(this.bpm, this.currentTime)
        };
      }
      return ev;
    });
  }
  animateWidth(el) {
    const ev = this.events.find((ev2) => ev2.id === el.id);
    if (!ev) {
      return;
    }
    el.style.width = (ev == null ? void 0 : ev.xEnd) && ev.done ? (ev == null ? void 0 : ev.xEnd) - (ev == null ? void 0 : ev.xStart) + "px" : getPlayheadPosition(
      this.bpm,
      this.currentTime - ev.startTime
    ) + "px";
  }
  render() {
    return x` <div class="event-container">
            ${this.events.map(({ done, xStart, zIndex, id }) => {
      const styles = o$1({
        transform: `translateX(${xStart}px)`,
        top: "0px",
        height: "100%",
        zIndex
      });
      const classes = e$3({
        event: true,
        "event-done": !!done,
        "event-drawing": !done && this.isRecording
      });
      return x`<div
                    id=${id}
                    class="${classes}"
                    style=${styles}
                ></div>`;
    })}
        </div>`;
  }
};
TrackEvents.styles = [
  i$6`
            .event-container {
                position: relative;
                width: 100%;
                height: 40%;
                display: flex;
            }

            .event {
                position: absolute;
                background: var(--color-tint-primary);
                box-shadow: 0 0px 5 px rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                min-width: 10px;
            }

            .event-drawing {
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            .event-done {
                border-right: 1px solid var(--color-accent);
            }
        `
];
__decorateClass$5([
  consumeProp({ context: playbackContext })
], TrackEvents.prototype, "scheduler", 2);
__decorateClass$5([
  consumeProp({ context: playbackContext, subscribe: true })
], TrackEvents.prototype, "currentTime", 2);
__decorateClass$5([
  consumeProp({ context: playbackContext, subscribe: true })
], TrackEvents.prototype, "isPlaying", 2);
__decorateClass$5([
  consumeProp({ context: playbackContext, subscribe: true })
], TrackEvents.prototype, "isRecording", 2);
__decorateClass$5([
  consumeProp({ context: playbackContext, subscribe: true })
], TrackEvents.prototype, "bpm", 2);
__decorateClass$5([
  consumeProp({ context: playbackContext, subscribe: true })
], TrackEvents.prototype, "lastTimeEventChange", 2);
__decorateClass$5([
  n$4({ type: Object })
], TrackEvents.prototype, "track", 2);
__decorateClass$5([
  r$1()
], TrackEvents.prototype, "events", 2);
__decorateClass$5([
  r$1()
], TrackEvents.prototype, "zIndex", 2);
__decorateClass$5([
  e$5(".event-container")
], TrackEvents.prototype, "eventContainer", 2);
TrackEvents = __decorateClass$5([
  t$1("track-event")
], TrackEvents);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
const MAX_TIME_BEATS = 4;
const BEAT_WIDTH = 70;
const NEEDLE_START_POS = 131;
class Track {
  constructor(channel, parent) {
    this.channel = channel;
    this.id = channel.id;
    this.parent = parent;
  }
  mute() {
    this.channel.setMuted(true);
  }
  unmute() {
    this.channel.setMuted(false);
  }
}
let TracksView = class extends i$3 {
  constructor() {
    super(...arguments);
    this.currentQuantisize = 4;
    this.eventData = [];
  }
  get tracks() {
    return this.sources.map((source) => new Track(source));
  }
  generateCells(id) {
    const lines = [];
    const quantisizedBeats = this.currentQuantisize;
    const totalBeats = Math.ceil(MAX_TIME_BEATS * BEAT_WIDTH);
    for (let i4 = 0; i4 < totalBeats; i4 += quantisizedBeats) {
      lines.push(
        x`<div id=${id + i4} class="typography-300 time-beat"></div>`
      );
    }
    return lines;
  }
  setSelectedTrack(track) {
    this.selectedTrack = track;
  }
  renderQuantisisedTrackCells(tracks = this.tracks, isSub = false) {
    return tracks.map((track) => {
      var _a2;
      const classes = e$3({
        "track-name": true,
        "typography-200": isSub,
        "typography-500": !isSub
      });
      const rowClasses = e$3({
        "track-row": true,
        "selected-row": ((_a2 = this.selectedTrack) == null ? void 0 : _a2.id) === track.id
      });
      return x`
                <div
                    class="${rowClasses}"
                    @click=${() => this.setSelectedTrack(track)}
                >
                    <div class="sub-track">
                        <div class="${classes}">${track.channel.name}</div>
                        <div class="muted-button"></div>
                    </div>
                    <track-event .track=${track}></track-event>
                    ${this.generateCells(track.id)}
                </div>
            `;
    });
  }
  render() {
    return x`
            <div class="tracks-container">
                <div class="track-pool">
                    <div class="times-container">
                        <time-tracker .currentQuantisize=${4}></time-tracker>
                    </div>
                    <div class="tracks-slots">
                        ${this.renderQuantisisedTrackCells()}
                    </div>
                </div>
            </div>
        `;
  }
};
TracksView.styles = [
  typography,
  i$6`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                max-height: 500px;
            }

            .times-container {
                display: flex;
                width: 100%;
                height: 30px;
                margin-left: ${NEEDLE_START_POS}px;
                border-left: 1px solid var(--color-accent);
            }

            .track-pool {
                position: relative;
                width: 100%;
                overflow: auto;
            }

            .tracks-container {
                display: flex;
            }

            .time-beat {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 0.7em;
                border-right: 1px solid var(--color-accent);
                border-bottom: 1px solid var(--color-accent);
                min-width: ${BEAT_WIDTH}px;
                max-width: ${BEAT_WIDTH}px;
                background-color: var(--color-secondary);
                height: 35px;
                padding: 0 5px;
            }

            .sub-track {
                position: sticky;
                left: 0;
                min-width: ${NEEDLE_START_POS - 1}px;
                max-width: ${NEEDLE_START_POS - 1}px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 50;
                background-color: var(--color-primary);
                border-right: 1px solid var(--color-accent);
                border-bottom: 1px solid var(--color-accent);
                border-bottom-left-radius: var(--border-radius);

                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);

                &:hover {
                    background-color: var(--color-secondary);
                }
            }

            .muted-button {
                width: 6px;
                height: 6px;
                background-color: var(--color-success);
                border-radius: 50%;
                cursor: pointer;
                margin-right: 8px;
            }

            .track-name {
                font-size: 0.7em;
                margin-left: 5px;
                max-width: 80px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .track-row {
                width: 100%;
                display: flex;
                background-color: var(--color-secondary);
                position: relative;
                border-bottom-left-radius: 100px;
                border-top-left-radius: 100px;
            }
        `
];
__decorateClass$4([
  consumeProp({ context: playbackContext, subscribe: true })
], TracksView.prototype, "sources", 2);
__decorateClass$4([
  r$1()
], TracksView.prototype, "selectedTrack", 2);
__decorateClass$4([
  r$1()
], TracksView.prototype, "eventData", 2);
__decorateClass$4([
  consumeProp({ context: playbackContext })
], TracksView.prototype, "master", 2);
TracksView = __decorateClass$4([
  t$1("tracks-view")
], TracksView);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let TracksViewCanvas = class extends i$3 {
  constructor() {
    super(...arguments);
    this.zoomLevel = 1;
    this.scrollX = 0;
    this.scrollY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.gridWidth = 50;
    this.trackHeight = 60;
    this.timelineHeight = 30;
    this.handleWheel = (e3) => {
      e3.preventDefault();
      if (e3.ctrlKey || e3.metaKey) {
        const zoomDelta = e3.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(
          0.1,
          Math.min(5, this.zoomLevel * zoomDelta)
        );
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e3.clientX - rect.left;
        const worldX = (mouseX - this.scrollX) / this.zoomLevel;
        this.zoomLevel = newZoom;
        this.scrollX = mouseX - worldX * this.zoomLevel;
        this.renderGrid();
      } else if (e3.shiftKey) {
        this.scrollY += e3.deltaY;
        this.renderGrid();
      } else {
        this.scrollX = Math.min(0, this.scrollX - e3.deltaX - e3.deltaY);
        this.renderGrid();
      }
    };
    this.handleMouseDown = (e3) => {
      this.isDragging = true;
      this.lastMouseX = e3.clientX;
      this.lastMouseY = e3.clientY;
      this.canvas.style.cursor = "grabbing";
    };
    this.handleMouseMove = (e3) => {
      if (this.isDragging) {
        const deltaX = e3.clientX - this.lastMouseX;
        const deltaY = e3.clientY - this.lastMouseY;
        this.scrollX = Math.min(0, this.scrollX + deltaX);
        this.scrollY += deltaY;
        this.lastMouseX = e3.clientX;
        this.lastMouseY = e3.clientY;
        this.renderGrid();
      }
    };
    this.handleMouseUp = () => {
      this.isDragging = false;
      this.canvas.style.cursor = "grab";
    };
  }
  renderGrid() {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    const scaledGridWidth = this.gridWidth * this.zoomLevel;
    const visibleStartTime = Math.floor(-this.scrollX / scaledGridWidth);
    const visibleEndTime = Math.ceil(
      (width - this.scrollX) / scaledGridWidth
    );
    ctx.fillStyle = "#f8f8f8";
    ctx.fillRect(0, 0, width, this.timelineHeight);
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#666";
    ctx.font = "10px Montserrat, sans-serif";
    for (let time = visibleStartTime; time <= visibleEndTime; time++) {
      const x2 = this.scrollX + time * scaledGridWidth;
      if (x2 >= 0 && x2 <= width) {
        ctx.beginPath();
        ctx.moveTo(x2, 0);
        ctx.lineTo(x2, height);
        ctx.stroke();
        if (time >= 0) {
          const timeText = `${Math.floor(time / 4)}:${time % 4}`;
          ctx.fillText(timeText, x2 + 2, 15);
        }
      }
    }
    const visibleTrackStart = Math.floor(-this.scrollY / this.trackHeight);
    const visibleTrackEnd = Math.floor(
      (height - this.timelineHeight - this.scrollY) / this.trackHeight
    ) + 1;
    for (let track = visibleTrackStart; track <= visibleTrackEnd; track++) {
      const y3 = this.timelineHeight + this.scrollY + track * this.trackHeight;
      if (y3 >= this.timelineHeight && y3 <= height) {
        ctx.beginPath();
        ctx.moveTo(0, y3);
        ctx.lineTo(width, y3);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.timelineHeight);
    ctx.lineTo(width, this.timelineHeight);
    ctx.stroke();
  }
  handleMouseScrollDirection(e3) {
    e3.preventDefault();
    if (e3.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }
  zoomIn() {
    this.zoomLevel = Math.min(5, this.zoomLevel * 1.2);
    this.renderGrid();
  }
  zoomOut() {
    this.zoomLevel = Math.max(0.1, this.zoomLevel / 1.2);
    this.renderGrid();
  }
  resetZoom() {
    this.zoomLevel = 1;
    this.scrollX = 0;
    this.scrollY = 0;
    this.renderGrid();
  }
  firstUpdated() {
    this.canvas.addEventListener("wheel", this.handleWheel);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mouseleave", this.handleMouseUp);
    setTimeout(() => this.renderGrid(), 0);
    new ResizeObserver(() => this.renderGrid()).observe(this.canvas);
  }
  disconnectedCallback() {
    var _a2, _b, _c, _d, _e;
    super.disconnectedCallback();
    (_a2 = this.canvas) == null ? void 0 : _a2.removeEventListener("wheel", this.handleWheel);
    (_b = this.canvas) == null ? void 0 : _b.removeEventListener("mousedown", this.handleMouseDown);
    (_c = this.canvas) == null ? void 0 : _c.removeEventListener("mousemove", this.handleMouseMove);
    (_d = this.canvas) == null ? void 0 : _d.removeEventListener("mouseup", this.handleMouseUp);
    (_e = this.canvas) == null ? void 0 : _e.removeEventListener("mouseleave", this.handleMouseUp);
  }
  render() {
    return x`
            <div class="tracks-container">
                <canvas id="tracks-view-canvas"></canvas>
                <div class="zoom-controls">
                    <button class="zoom-btn" @click=${this.zoomOut}>-</button>
                    <button class="zoom-btn" @click=${this.resetZoom}>
                        Reset
                    </button>
                    <button class="zoom-btn" @click=${this.zoomIn}>+</button>
                </div>
            </div>
        `;
  }
};
TracksViewCanvas.styles = [
  i$6`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                max-height: 500px;
                position: relative;
                overflow: hidden;
                border: 1px solid #ddd;
            }

            #tracks-view-canvas {
                width: 100%;
                height: 100%;
                display: block;
                cursor: grab;
            }

            #tracks-view-canvas:active {
                cursor: grabbing;
            }

            .zoom-controls {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 5px;
                z-index: 10;
            }

            .zoom-btn {
                padding: 5px 10px;
                background: #f0f0f0;
                border: 1px solid #ccc;
                cursor: pointer;
                border-radius: 3px;
            }

            .zoom-btn:hover {
                background: #e0e0e0;
            }
        `
];
__decorateClass$3([
  e$5("#tracks-view-canvas")
], TracksViewCanvas.prototype, "canvas", 2);
__decorateClass$3([
  n$4({ type: Number })
], TracksViewCanvas.prototype, "zoomLevel", 2);
__decorateClass$3([
  n$4({ type: Number })
], TracksViewCanvas.prototype, "scrollX", 2);
__decorateClass$3([
  n$4({ type: Number })
], TracksViewCanvas.prototype, "scrollY", 2);
TracksViewCanvas = __decorateClass$3([
  t$1("tracks-view-canvas")
], TracksViewCanvas);
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
const tracksPanelElement = "tracks-panel";
let TracksPanel = class extends WithScreenManager(i$3) {
  connectedCallback() {
    super.connectedCallback();
    const panel = new CustomPanel(
      this.screenManager,
      "tracks-view",
      this,
      true,
      true
    );
    this.screenManager.add(tracksPanelElement, panel);
  }
  render() {
    return x`
            <panel-card
                card-id="tracks-view"
                card-height="auto"
                card-width="1100px"
                .startPos=${[570, 80]}
                .isDraggable=${true}
                .screenManagerInstance=${this.screenManager}
            >
                ${x`<tracks-view></tracks-view>`}
            </panel-card>
        `;
  }
};
TracksPanel = __decorateClass$2([
  t$1(tracksPanelElement)
], TracksPanel);
const channelsContext = n$1(
  Symbol("channelsContext")
);
function attachChannelContextEvents(host, ctx) {
  host.addEventListener("channels-context/add-channel", (event) => {
    const channel = event.detail;
    const id = channel.id;
    const existingIndex = ctx.value.channels.findIndex((c2) => c2.id === id);
    if (existingIndex !== -1) {
      ctx.setValue({
        ...ctx.value,
        channels: ctx.value.channels.map(
          (c2, index) => index === existingIndex ? channel : c2
        )
      });
    } else {
      ctx.setValue({
        ...ctx.value,
        channels: [...ctx.value.channels, channel]
      });
    }
  });
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
let AppView = class extends i$3 {
  constructor() {
    super();
    this.screenManager = new PanelScreenManager();
    this.channelsCtx = new i3(this, {
      context: channelsContext,
      initialValue: {
        channels: []
      }
    });
    this.keyboardManager = new LayeredKeyboardManager();
    this.screenManager.onPanelFocused((panel) => {
      if ((panel == null ? void 0 : panel.name) === "tracks-view") ;
    });
  }
  firstUpdated() {
    var _a2;
    super.connectedCallback();
    attachChannelContextEvents(this, this.channelsCtx);
    this.keyboardManager.attachEventListeners();
    const firstPanel = (_a2 = this.screenManager.panels) == null ? void 0 : _a2[0];
    this.keyboardManager.addKeys([
      {
        active: true,
        keys: ["Shift", "C", "ArrowRight"],
        description: "Focus next panel",
        handler: () => this.screenManager.focusNext()
      },
      {
        active: true,
        keys: ["Shift", "C", "ArrowLeft"],
        description: "Focus previous panel",
        handler: () => this.screenManager.focusPrevious()
      }
    ]);
    if (firstPanel) {
      setTimeout(() => {
        this.screenManager.focus(firstPanel.name);
      });
    }
  }
  handleClick(event) {
    if (event.target instanceof HTMLElement && event.target.classList.contains("container")) {
      PanelScreenManager.handleBackgroundClick();
    }
  }
  render() {
    return x` <top-nav
                .keyboardManager=${this.keyboardManager}
            ></top-nav>
            <div class="container" @click="${this.handleClick}">
                <sampler-root></sampler-root>
                <tracks-panel></tracks-panel>
            </div>`;
  }
};
AppView.styles = i$6`
        .container {
            position: relative;
            width: 100%;
            height: calc(100vh - 40px);
            overflow: hidden;
        }
    `;
__decorateClass$1([
  e$1({ context: screenManagerContext })
], AppView.prototype, "screenManager", 2);
AppView = __decorateClass$1([
  t$1("app-view")
], AppView);
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(result) || result;
  return result;
};
let App = class extends i$3 {
  constructor() {
    super(...arguments);
    this.playbackProvider = new i3(this, {
      context: playbackContext,
      initialValue: new PlaybackContextStore()
    });
  }
  connectedCallback() {
    super.connectedCallback();
    attachPlaybackContextEvents(this, this.playbackProvider);
  }
  render() {
    return x`
            <main class="container">
                <app-view></app-view>
            </main>
        `;
  }
};
App.styles = [
  i$6`
            :host {
                --color-primary: #1d1d1d;
                --color-secondary: #171717;
                --color-accent: hwb(0 22% 78%);
                --color-text: #ffffff;
                --color-background: #181818;
                --container-width: 1200px;
                --container-height: 60vh;
                --card-color: #2c2c2c;
                --color-tint-primary: #f74323;
                --border-radius: 10px;
                --nav-bg-color: #595959;
                --color-success: #5ace5e;
                --color-error: #ff1e0e;
                --color-warning: #ff9800;
                --color-info: #2196f3;
                --color-border: #333333;
                --color-border-light: #444444;
            }

            html {
                background-color: red;
            }

            .container {
                margin: 20px auto;
            }
        `
];
App = __decorateClass([
  t$1("root-app")
], App);
function main() {
  const element2 = document.createElement("root-app", {
    is: "root-app"
  });
  document.body.appendChild(element2);
  console.log(
    "App initialized. If you see this, the app is running correctly."
  );
}
main();
