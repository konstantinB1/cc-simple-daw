(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fe=globalThis,Je=fe.ShadowRoot&&(fe.ShadyCSS===void 0||fe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,et=Symbol(),gt=new WeakMap;let St=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==et)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Je&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=gt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&gt.set(t,e))}return e}toString(){return this.cssText}};const ps=i=>new St(typeof i=="string"?i:i+"",void 0,et),u=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new St(t,i,et)},us=(i,e)=>{if(Je)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const r=document.createElement("style"),s=fe.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},mt=Je?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return ps(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:fs,defineProperty:vs,getOwnPropertyDescriptor:gs,getOwnPropertyNames:ms,getOwnPropertySymbols:bs,getPrototypeOf:ys}=Object,k=globalThis,bt=k.trustedTypes,ws=bt?bt.emptyScript:"",Ke=k.reactiveElementPolyfillSupport,Q=(i,e)=>i,me={toAttribute(i,e){switch(e){case Boolean:i=i?ws:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},tt=(i,e)=>!fs(i,e),yt={attribute:!0,type:String,converter:me,reflect:!1,useDefault:!1,hasChanged:tt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);let R=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=yt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&vs(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){const{get:s,set:n}=gs(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){const a=s==null?void 0:s.call(this);n==null||n.call(this,o),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??yt}static _$Ei(){if(this.hasOwnProperty(Q("elementProperties")))return;const e=ys(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Q("properties"))){const t=this.properties,r=[...ms(t),...bs(t)];for(const s of r)this.createProperty(s,t[s])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const s of r)t.unshift(mt(s))}else e!==void 0&&t.push(mt(e));return t}static _$Eu(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return us(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostConnected)==null?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){var n;const r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:me).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){var n,o;const r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const a=r.getPropertyOptions(s),c=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:me;this._$Em=s,this[s]=c.fromAttribute(t,a.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(e,t,r){var s;if(e!==void 0){const n=this.constructor,o=this[e];if(r??(r=n.getPropertyOptions(e)),!((r.hasChanged??tt)(o,t)||r.useDefault&&r.reflect&&o===((s=this._$Ej)==null?void 0:s.get(e))&&!this.hasAttribute(n._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:a}=o,c=this[n];a!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,o,c)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(r=this._$EO)==null||r.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};R.elementStyles=[],R.shadowRootOptions={mode:"open"},R[Q("elementProperties")]=new Map,R[Q("finalized")]=new Map,Ke==null||Ke({ReactiveElement:R}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const J=globalThis,be=J.trustedTypes,wt=be?be.createPolicy("lit-html",{createHTML:i=>i}):void 0,Lt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,jt="?"+E,$s=`<${jt}>`,B=document,se=()=>B.createComment(""),re=i=>i===null||typeof i!="object"&&typeof i!="function",st=Array.isArray,xs=i=>st(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ue=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$t=/-->/g,xt=/>/g,L=RegExp(`>|${Ue}(?:([^\\s"'>=/]+)(${Ue}*=${Ue}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,Ct=/"/g,zt=/^(?:script|style|textarea|title)$/i,_s=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),l=_s(1),M=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),Pt=new WeakMap,j=B.createTreeWalker(B,129);function It(i,e){if(!st(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return wt!==void 0?wt.createHTML(e):e}const Cs=(i,e)=>{const t=i.length-1,r=[];let s,n=e===2?"<svg>":e===3?"<math>":"",o=Y;for(let a=0;a<t;a++){const c=i[a];let f,m,v=-1,x=0;for(;x<c.length&&(o.lastIndex=x,m=o.exec(c),m!==null);)x=o.lastIndex,o===Y?m[1]==="!--"?o=$t:m[1]!==void 0?o=xt:m[2]!==void 0?(zt.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=L):m[3]!==void 0&&(o=L):o===L?m[0]===">"?(o=s??Y,v=-1):m[1]===void 0?v=-2:(v=o.lastIndex-m[2].length,f=m[1],o=m[3]===void 0?L:m[3]==='"'?Ct:_t):o===Ct||o===_t?o=L:o===$t||o===xt?o=Y:(o=L,s=void 0);const C=o===L&&i[a+1].startsWith("/>")?" ":"";n+=o===Y?c+$s:v>=0?(r.push(f),c.slice(0,v)+Lt+c.slice(v)+E+C):c+E+(v===-2?a:C)}return[It(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]};class ie{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let n=0,o=0;const a=e.length-1,c=this.parts,[f,m]=Cs(e,t);if(this.el=ie.createElement(f,r),j.currentNode=this.el.content,t===2||t===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(s=j.nextNode())!==null&&c.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const v of s.getAttributeNames())if(v.endsWith(Lt)){const x=m[o++],C=s.getAttribute(v).split(E),ue=/([.?@])?(.*)/.exec(x);c.push({type:1,index:n,name:ue[2],strings:C,ctor:ue[1]==="."?Es:ue[1]==="?"?ks:ue[1]==="@"?Ms:Ie}),s.removeAttribute(v)}else v.startsWith(E)&&(c.push({type:6,index:n}),s.removeAttribute(v));if(zt.test(s.tagName)){const v=s.textContent.split(E),x=v.length-1;if(x>0){s.textContent=be?be.emptyScript:"";for(let C=0;C<x;C++)s.append(v[C],se()),j.nextNode(),c.push({type:2,index:++n});s.append(v[x],se())}}}else if(s.nodeType===8)if(s.data===jt)c.push({type:2,index:n});else{let v=-1;for(;(v=s.data.indexOf(E,v+1))!==-1;)c.push({type:7,index:n}),v+=E.length-1}n++}}static createElement(e,t){const r=B.createElement("template");return r.innerHTML=e,r}}function q(i,e,t=i,r){var o,a;if(e===M)return e;let s=r!==void 0?(o=t._$Co)==null?void 0:o[r]:t._$Cl;const n=re(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=s:t._$Cl=s),s!==void 0&&(e=q(i,s._$AS(i,e.values),s,r)),e}class Ps{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,s=((e==null?void 0:e.creationScope)??B).importNode(t,!0);j.currentNode=s;let n=j.nextNode(),o=0,a=0,c=r[0];for(;c!==void 0;){if(o===c.index){let f;c.type===2?f=new de(n,n.nextSibling,this,e):c.type===1?f=new c.ctor(n,c.name,c.strings,this,e):c.type===6&&(f=new As(n,this,e)),this._$AV.push(f),c=r[++a]}o!==(c==null?void 0:c.index)&&(n=j.nextNode(),o++)}return j.currentNode=B,s}p(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class de{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=q(this,e,t),re(e)?e===g||e==null||e===""?(this._$AH!==g&&this._$AR(),this._$AH=g):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):xs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==g&&re(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){var n;const{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=ie.createElement(It(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(t);else{const o=new Ps(s,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=Pt.get(e.strings);return t===void 0&&Pt.set(e.strings,t=new ie(e)),t}k(e){st(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,s=0;for(const n of e)s===t.length?t.push(r=new de(this.O(se()),this.O(se()),this,this.options)):r=t[s],r._$AI(n),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class Ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,n){this.type=1,this._$AH=g,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=g}_$AI(e,t=this,r,s){const n=this.strings;let o=!1;if(n===void 0)e=q(this,e,t,0),o=!re(e)||e!==this._$AH&&e!==M,o&&(this._$AH=e);else{const a=e;let c,f;for(e=n[0],c=0;c<n.length-1;c++)f=q(this,a[r+c],t,c),f===M&&(f=this._$AH[c]),o||(o=!re(f)||f!==this._$AH[c]),f===g?e=g:e!==g&&(e+=(f??"")+n[c+1]),this._$AH[c]=f}o&&!s&&this.j(e)}j(e){e===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Es extends Ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===g?void 0:e}}class ks extends Ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==g)}}class Ms extends Ie{constructor(e,t,r,s,n){super(e,t,r,s,n),this.type=5}_$AI(e,t=this){if((e=q(this,e,t,0)??g)===M)return;const r=this._$AH,s=e===g&&r!==g||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==g&&(r===g||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class As{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){q(this,e)}}const He=J.litHtmlPolyfillSupport;He==null||He(ie,de),(J.litHtmlVersions??(J.litHtmlVersions=[])).push("3.3.0");const Os=(i,e,t)=>{const r=(t==null?void 0:t.renderBefore)??e;let s=r._$litPart$;if(s===void 0){const n=(t==null?void 0:t.renderBefore)??null;r._$litPart$=s=new de(e.insertBefore(se(),n),n,void 0,t??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const z=globalThis;let d=class extends R{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Os(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return M}};var Tt;d._$litElement$=!0,d.finalized=!0,(Tt=z.litElementHydrateSupport)==null||Tt.call(z,{LitElement:d});const Ve=z.litElementPolyfillSupport;Ve==null||Ve({LitElement:d});(z.litElementVersions??(z.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const p=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ds={attribute:!0,type:String,converter:me,reflect:!1,hasChanged:tt},Ts=(i=Ds,e,t)=>{const{kind:r,metadata:s}=t;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(t.name,i),r==="accessor"){const{name:o}=t;return{set(a){const c=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,c,i)},init(a){return a!==void 0&&this.C(o,void 0,i,a),a}}}if(r==="setter"){const{name:o}=t;return function(a){const c=this[o];e.call(this,a),this.requestUpdate(o,c,i)}}throw Error("Unsupported decorator location: "+r)};function h(i){return(e,t)=>typeof t=="object"?Ts(i,e,t):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(i){return h({...i,state:!0,attribute:!1})}var Ss=Object.defineProperty,Ls=Object.getOwnPropertyDescriptor,Bt=(i,e,t,r)=>{for(var s=r>1?void 0:r?Ls(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Ss(e,t,s),s};let ye=class extends d{constructor(){super(...arguments),this.height=100}render(){return l`
            <input
                type="range"
                orientation="vertical"
                min="0"
                max="100"
                value="50"
            />
        `}};ye.styles=[u`
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
        `];Bt([h({type:Number})],ye.prototype,"height",2);ye=Bt([p("daw-slider")],ye);const D=u`
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
`;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rt={ATTRIBUTE:1,CHILD:2},it=i=>(...e)=>({_$litDirective$:i,values:e});let nt=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const A=it(class extends nt{constructor(i){var e;if(super(i),i.type!==rt.ATTRIBUTE||i.name!=="class"||((e=i.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter(e=>i[e]).join(" ")+" "}update(i,[e]){var r,s;if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter(n=>n!=="")));for(const n in e)e[n]&&!((r=this.nt)!=null&&r.has(n))&&this.st.add(n);return this.render(e)}const t=i.element.classList;for(const n of this.st)n in e||(t.remove(n),this.st.delete(n));for(const n in e){const o=!!e[n];o===this.st.has(n)||(s=this.nt)!=null&&s.has(n)||(o?(t.add(n),this.st.add(n)):(t.remove(n),this.st.delete(n)))}return M}});var js=Object.defineProperty,zs=Object.getOwnPropertyDescriptor,ot=(i,e,t,r)=>{for(var s=r>1?void 0:r?zs(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&js(e,t,s),s};let ne=class extends d{constructor(){super(...arguments),this.active=void 0,this.label=void 0}get renderLabel(){return this.label?l`<span class="label typography-200"
                >${this.label}</span
            >`:l``}render(){return l`
            <button
                class=${A({btn:!0,"active-indicator":this.active!==void 0&&this.active})}
            >
                ${this.renderLabel}
            </button>
        `}};ne.styles=[D,u`
            .btn {
                border-radius: 5px;
                border: 0;
                min-width: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                background-color: var(--color-primary);
                border: 1px solid transparent;
                height: 40px;
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
        `];ot([h({type:Boolean,attribute:"active"})],ne.prototype,"active",2);ot([h({type:String})],ne.prototype,"label",2);ne=ot([p("mpc-button")],ne);const Is=100;var I=(i=>(i[i.Start=0]="Start",i[i.End=1]="End",i[i.Dragging=2]="Dragging",i))(I||{});class Nt extends EventTarget{constructor(){super(...arguments),this.holdTimeout=null,this.dragOffset=[0,0],this.pos=[0,0],this.isDragging=!1,this.handleWindowMouseMove=e=>{if(!this.isDragging)return;const[t,r]=this.dragOffset,s=e.clientX-t,n=e.clientY-r;this.pos=[this.getX(s),this.getY(n)],this.triggerDragEvent({event:2,coords:this.pos})},this.handleWindowMouseUp=e=>{this.holdTimeout&&(clearTimeout(this.holdTimeout),this.holdTimeout=null),this.triggerDragEvent({event:1,coords:this.pos}),window.removeEventListener("mousemove",this.handleWindowMouseMove),window.removeEventListener("mouseup",this.handleWindowMouseUp)}}setElement(e){this.element=e}setStartPos(e){this.pos=e,this.dragOffset=e}handleMouseDown(e){const[t,r]=this.pos;this.dragOffset=[e.clientX-t,e.clientY-r],this.holdTimeout=setTimeout(()=>{this.isDragging=!0,this.triggerDragEvent({event:0,coords:this.pos}),window.addEventListener("mousemove",this.handleWindowMouseMove)},Is),window.addEventListener("mouseup",this.handleWindowMouseUp)}getY(e){const t=document.documentElement.clientHeight;return e<80?80:e+400>t?t-400:e}getX(e){var s;const t=(s=this.element)==null?void 0:s.getBoundingClientRect().width,r=document.documentElement.clientWidth;return e+t>r?r-t-10:e<0?0:e}triggerDragEvent(e){const t=new CustomEvent("drag-change",{detail:e,bubbles:!0,composed:!0});this.dispatchEvent(t)}onDragChange(e){this.addEventListener("drag-change",t=>{e(t.detail)})}}class Bs{constructor(){this.observers={}}subscribe(e,t){this.observers[e]||(this.observers[e]=[]),this.observers[e].push(t)}unsubscribe(e,t){this.observers[e]&&(this.observers[e]=this.observers[e].filter(r=>r!==t))}notify(e,t){this.observers[e]&&this.observers[e].forEach(r=>r(t))}clear(e){this.observers[e]&&(this.observers[e]=[])}clearAll(){this.observers={}}}class U{constructor(){this.panels=[],this.obs=new Bs}static getInstance(){return U.instance||(U.instance=new U),U.instance}add(e){return this.panels.push(e),this}notify(e){for(const t of this.panels)this.obs.notify(t,{isCurrent:t===e})}listen(e,t){this.obs.subscribe(e,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ns=i=>i.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee=(i,e)=>{var r;const t=i._$AN;if(t===void 0)return!1;for(const s of t)(r=s._$AO)==null||r.call(s,e,!1),ee(s,e);return!0},we=i=>{let e,t;do{if((e=i._$AM)===void 0)break;t=e._$AN,t.delete(i),i=e}while((t==null?void 0:t.size)===0)},Rt=i=>{for(let e;e=i._$AM;i=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(i))break;t.add(i),Us(e)}};function Rs(i){this._$AN!==void 0?(we(this),this._$AM=i,Rt(this)):this._$AM=i}function Ks(i,e=!1,t=0){const r=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(e)if(Array.isArray(r))for(let n=t;n<r.length;n++)ee(r[n],!1),we(r[n]);else r!=null&&(ee(r,!1),we(r));else ee(this,i)}const Us=i=>{i.type==rt.CHILD&&(i._$AP??(i._$AP=Ks),i._$AQ??(i._$AQ=Rs))};class Hs extends nt{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,r){super._$AT(e,t,r),Rt(this),this.isConnected=e._$AU}_$AO(e,t=!0){var r,s;e!==this.isConnected&&(this.isConnected=e,e?(r=this.reconnected)==null||r.call(this):(s=this.disconnected)==null||s.call(this)),t&&(ee(this,e),we(this))}setValue(e){if(Ns(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const at=()=>new Vs;class Vs{}const qe=new WeakMap,ct=it(class extends Hs{render(i){return g}update(i,[e]){var r;const t=e!==this.G;return t&&this.G!==void 0&&this.rt(void 0),(t||this.lt!==this.ct)&&(this.G=e,this.ht=(r=i.options)==null?void 0:r.host,this.rt(this.ct=i.element)),g}rt(i){if(this.isConnected||(i=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let t=qe.get(e);t===void 0&&(t=new WeakMap,qe.set(e,t)),t.get(this.G)!==void 0&&this.G.call(this.ht,void 0),t.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){var i,e;return typeof this.G=="function"?(i=qe.get(this.ht??globalThis))==null?void 0:i.get(this.G):(e=this.G)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kt="important",qs=" !"+Kt,G=it(class extends nt{constructor(i){var e;if(super(i),i.type!==rt.ATTRIBUTE||i.name!=="style"||((e=i.strings)==null?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((e,t)=>{const r=i[t];return r==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(i,[e]){const{style:t}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const r of this.ft)e[r]==null&&(this.ft.delete(r),r.includes("-")?t.removeProperty(r):t[r]=null);for(const r in e){const s=e[r];if(s!=null){this.ft.add(r);const n=typeof s=="string"&&s.endsWith(qs);r.includes("-")||n?t.setProperty(r,n?s.slice(0,-11):s,n?Kt:""):t[r]=s}}return M}});var Fs=Object.defineProperty,Ws=Object.getOwnPropertyDescriptor,N=(i,e,t,r)=>{for(var s=r>1?void 0:r?Ws(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Fs(e,t,s),s};const Gs=100,Zs=50;let _=class extends d{constructor(){super(),this.pos=[0,0],this.isDragging=!1,this.cardWidth="auto",this.cardHeight="auto",this.dragController=new Nt,this.panelManager=U.getInstance(),this.cardRef=at(),this.elementZIndex=0;const i=this.getAttribute("card-id");if(i==null)throw new Error("Card ID is not set, panel manager for this card will not work");this.cardId=i}firstUpdated(i){const e=this.cardId;this.dragController.setElement(this.cardRef.value),this.panelManager.add(e).listen(e,({isCurrent:t})=>{this.elementZIndex=t?Gs:Zs}),this.dragController.onDragChange.call(this.dragController,({event:t,coords:[r,s]})=>{switch(t){case I.Start:this.panelManager.notify(e),this.isDragging=!0;break;case I.Dragging:this.pos=[r,s];break;case I.End:this.isDragging=!1;break}})}connectedCallback(){super.connectedCallback(),this.startPos&&(this.pos=this.startPos)}render(){const[i,e]=this.pos,t=this.dragController.handleMouseDown.bind(this.dragController),r=A({card:!0,"is-dragging":this.isDragging}),s=G({transform:`translate(${i}px, ${e}px)`,width:this.cardWidth,height:this.cardHeight,zIndex:this.elementZIndex});return l`<div
            ${ct(this.cardRef)}
            id=${this.cardId}
            class=${r}
            style=${s}
            @mousedown="${t}"
        >
            <slot></slot>
        </div> `}};_.styles=u`
        :root {
            --color-drag: #3f3f3f;
        }

        .card {
            display: flex;
            flex-direction: column;
            padding: 20px;
            background-color: var(--card-color);
            border-radius: var(--border-radius);
            border: 1px solid var(--color-accent);
            position: absolute;
        }

        .card.is-dragging {
            cursor: grabbing;
            border: 1px solid var(--color-tint-primary);
        }
    `;N([b()],_.prototype,"pos",2);N([h({type:Array})],_.prototype,"startPos",2);N([b()],_.prototype,"isDragging",2);N([h({type:String,attribute:"card-width"})],_.prototype,"cardWidth",2);N([h({type:String,attribute:"card-height"})],_.prototype,"cardHeight",2);N([b()],_.prototype,"elementZIndex",2);_=N([p("card-component")],_);var Xs=Object.defineProperty,Ys=Object.getOwnPropertyDescriptor,Ut=(i,e,t,r)=>{for(var s=r>1?void 0:r?Ys(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Xs(e,t,s),s};let $e=class extends d{constructor(){super(),this.options=[]}handleChange(i){this.dispatchEvent(new CustomEvent("select-data",{detail:{value:i.target.value},bubbles:!0,composed:!0}))}render(){return l`
            <select class="select typography-100" @change=${this.handleChange}>
                ${this.options.map(i=>l`<option
                            value="${i.value}"
                            class="typography-100"
                        >
                            ${i.label}
                        </option>`)}
            </select>
        `}};$e.styles=[D,u`
            .select {
                width: 100%;
                padding: 10px;
                border-radius: 3px;
                border: 1px solid var(--color-accent);
                background-color: var(--color-secondary);
                color: var(--color-text);
            }
        `];Ut([h({type:Array})],$e.prototype,"options",2);$e=Ut([p("daw-select")],$e);var Qs=Object.defineProperty,Js=Object.getOwnPropertyDescriptor,lt=(i,e,t,r)=>{for(var s=r>1?void 0:r?Js(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Qs(e,t,s),s};let oe=class extends d{constructor(){super(...arguments),this.color="#000000",this.size=24}render(){return l`
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
        `}};oe.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;lt([h({type:String})],oe.prototype,"color",2);lt([h({type:Number})],oe.prototype,"size",2);oe=lt([p("drag-icon")],oe);var er=Object.defineProperty,tr=Object.getOwnPropertyDescriptor,Ht=(i,e,t,r)=>{for(var s=r>1?void 0:r?tr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&er(e,t,s),s};let xe=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
            <icon-component size=${this.size}>
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
            </icon-component>
        `}};xe.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;Ht([h({type:Number})],xe.prototype,"size",2);xe=Ht([p("record-icon")],xe);var sr=Object.defineProperty,rr=Object.getOwnPropertyDescriptor,Vt=(i,e,t,r)=>{for(var s=r>1?void 0:r?rr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&sr(e,t,s),s};let _e=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
            <icon-component size=${this.size}>
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
            </icon-component>
        `}};_e.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;Vt([h({type:Number})],_e.prototype,"size",2);_e=Vt([p("play-icon")],_e);var ir=Object.defineProperty,nr=Object.getOwnPropertyDescriptor,qt=(i,e,t,r)=>{for(var s=r>1?void 0:r?nr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&ir(e,t,s),s};let Ce=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
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
        `}};Ce.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;qt([h({type:Number})],Ce.prototype,"size",2);Ce=qt([p("stop-icon")],Ce);var or=Object.defineProperty,ar=Object.getOwnPropertyDescriptor,Ft=(i,e,t,r)=>{for(var s=r>1?void 0:r?ar(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&or(e,t,s),s};let Pe=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
            <icon-component size=${this.size}>
                <svg
                    fill="orange"
                    width="800px"
                    height="800px"
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
            </icon-component>
        `}};Pe.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;Ft([h({type:Number})],Pe.prototype,"size",2);Pe=Ft([p("up-down-icon")],Pe);var cr=Object.defineProperty,lr=Object.getOwnPropertyDescriptor,Wt=(i,e,t,r)=>{for(var s=r>1?void 0:r?lr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&cr(e,t,s),s};let Ee=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
            <icon-component size=${this.size}>
                <svg
                    fill="var(--color-tint-primary)"
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
            </icon-component>
        `}};Ee.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;Wt([h({type:Number})],Ee.prototype,"size",2);Ee=Wt([p("metronome-icon")],Ee);var hr=Object.defineProperty,dr=Object.getOwnPropertyDescriptor,Gt=(i,e,t,r)=>{for(var s=r>1?void 0:r?dr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&hr(e,t,s),s};let ke=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
            <icon-component size=${this.size}>
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
            </icon-component>
        `}};ke.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;Gt([h({type:Number})],ke.prototype,"size",2);ke=Gt([p("eq-icon")],ke);var pr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,Zt=(i,e,t,r)=>{for(var s=r>1?void 0:r?ur(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&pr(e,t,s),s};let Me=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
            <icon-component size=${this.size}>
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
            </icon-component>
        `}};Me.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;Zt([h({type:Number})],Me.prototype,"size",2);Me=Zt([p("forward-icon")],Me);var fr=Object.defineProperty,vr=Object.getOwnPropertyDescriptor,Xt=(i,e,t,r)=>{for(var s=r>1?void 0:r?vr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&fr(e,t,s),s};let Ae=class extends d{constructor(){super(...arguments),this.size=24}render(){return l`
            <icon-component size=${this.size}>
                <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z"
                        fill="var(--color-text)"
                    />
                </svg>
            </icon-component>
        `}};Ae.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;Xt([h({type:Number})],Ae.prototype,"size",2);Ae=Xt([p("rewind-icon")],Ae);var gr=Object.defineProperty,mr=Object.getOwnPropertyDescriptor,ht=(i,e,t,r)=>{for(var s=r>1?void 0:r?mr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&gr(e,t,s),s};let ae=class extends d{constructor(){super(...arguments),this.color="var(--color-primary)",this.size=24}render(){return l`
            <icon-component size=${this.size}>
                <svg
                    height="800px"
                    width="800px"
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
            </icon-component>
        `}};ae.styles=u`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;ht([h({type:String})],ae.prototype,"color",2);ht([h({type:Number})],ae.prototype,"size",2);ae=ht([p("clock-icon")],ae);var br=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,Yt=(i,e,t,r)=>{for(var s=r>1?void 0:r?yr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&br(e,t,s),s};let Oe=class extends d{constructor(){super(...arguments),this.size=50}render(){return l`
            <div
                class="icon"
                style=${G({width:this.size+"px",height:this.size+"px"})}
            >
                <slot></slot>
            </div>
        `}};Oe.styles=[u`
            .icon {
                display: block;
                position: relative;
            }
        `];Yt([h({type:Number})],Oe.prototype,"size",2);Oe=Yt([p("icon-component")],Oe);var wr=Object.defineProperty,$r=Object.getOwnPropertyDescriptor,Be=(i,e,t,r)=>{for(var s=r>1?void 0:r?$r(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&wr(e,t,s),s};let F=class extends d{constructor(){super(...arguments),this.size=50,this.isActive=!1,this.labelText=""}delegateClick(i){i.stopPropagation(),i.preventDefault(),this.dispatchEvent(new CustomEvent("handle-click",{detail:{active:this.isActive}}))}handleKeydown(i){(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),this.isActive!==void 0&&this.delegateClick(i))}handleFocus(i){const e=i.target;e.addEventListener("keydown",this.handleKeydown.bind(this)),e.addEventListener("blur",this.handleBlur.bind(this))}handleBlur(i){const e=i.target;e.removeEventListener("keydown",this.handleKeydown.bind(this)),e.removeEventListener("blur",this.handleBlur.bind(this))}render(){return l`
            <div class="icon-button-wrapper">
                <button
                    @focus=${this.handleFocus}
                    @blur=${this.handleFocus}
                    class=${A({"icon-button":!0,active:this.isActive&&this.isActive!==void 0})}
                    @click=${this.delegateClick}
                    style=${G({width:this.size+"px",height:this.size+"px"})}
                >
                    <slot></slot>
                </button>
                ${this.labelText?l`<span class="label-text typography-400"
                          >${this.labelText}</span
                      >`:""}
            </div>
        `}};F.styles=[D,u`
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
        `];Be([h({type:Number})],F.prototype,"size",2);Be([h({type:Boolean})],F.prototype,"isActive",2);Be([h({type:String,attribute:"label-text"})],F.prototype,"labelText",2);F=Be([p("icon-button")],F);function xr(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(i){const e=Math.random()*16|0;return(i==="x"?e:e&3|8).toString(16)})}class _r{constructor(e){this.ctx=e}async load(e){if(!this.rawBuffer&&e&&(this.rawBuffer=e),this.audioBuffer)return console.warn("Audio buffer already loaded, do not call load() again"),this.audioBuffer;try{const t=await this.ctx.decodeAudioData(this.rawBuffer);return this.audioBuffer=t,this.duration=t.duration,this.audioBuffer}catch{throw new Error("Failed to decode audio data")}}}class De extends EventTarget{constructor(e,t,r,s){super(),this.effects=[],this.muted=!1,this.subChannels=[],this.ctx=t,this.id=e,this.name=r,this.master=s,this.source=new _r(t),this.master?this.getGainNode.connect(this.master.getGainNode):this.getGainNode.connect(this.ctx.destination)}get getGainNode(){return this.gainNode||(this.gainNode=this.ctx.createGain()),this.gainNode}get isLoaded(){return this.buffer!==void 0}setVolume(e){this.getGainNode.gain.setValueAtTime(e,this.ctx.currentTime),this.dispatchEvent(new CustomEvent("volumeChange",{detail:{volume:e}}))}setMuted(e){this.muted=e,e?this.getGainNode.gain.setValueAtTime(0,this.ctx.currentTime):this.getGainNode.gain.setValueAtTime(1,this.ctx.currentTime),this.dispatchEvent(new CustomEvent("muteChange",{detail:{muted:e}}))}async load(e){const t=await this.source.load(e);if(!t)throw new Error("Failed to load audio sample");this.buffer=t,this.dispatchEvent(new CustomEvent("sampleLoaded",{detail:{sample:t}}))}async play(e=this.ctx.currentTime,t=0,r,s,n){if(!this.buffer)throw new Error("No sample loaded to play");if(this.muted)return Promise.resolve();const o=this.ctx.createBufferSource();o.buffer=this.buffer,o.connect(this.getGainNode),o.start(e,t,r),s!==void 0&&n!==void 0?(o.loop=!0,o.loopStart=s,o.loopEnd=n):o.loop=!1,o.connect(this.ctx.destination);const a=xr(),c=new CustomEvent("audio-channel/play",{detail:{id:a,when:e,offset:t,duration:r??this.buffer.duration}});return this.dispatchEvent(new CustomEvent("audio-channel/play",c)),new Promise(f=>{o.onended=()=>{const m=new CustomEvent("audio-channel/ended",{detail:{id:a}});this.dispatchEvent(new CustomEvent("audio-channel/ended",m)),f()}})}onPlay(e){this.addEventListener("audio-channel/play",t=>{e(t)})}onStop(e){this.addEventListener("audio-channel/ended",t=>{e(t)})}stop(){this.getGainNode.disconnect(),this.dispatchEvent(new CustomEvent("stop"))}addSubChannel(e){this.subChannels.push(e),e.setVolume(this.getGainNode.gain.value),e.setMuted(this.muted),e.getGainNode.connect(this.getGainNode),this.subChannels.forEach(t=>{t.setVolume(this.getGainNode.gain.value),t.setMuted(this.muted),t.getGainNode.connect(this.ctx.destination)})}}class Cr{constructor(){this.vstPlugins=new Map}register(e){if(this.vstPlugins.has(e.id)){console.warn(`VST plugin with id ${e.id} is already registered.`);return}this.vstPlugins.set(e.id,e)}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let dt=class extends Event{constructor(e,t,r,s){super("context-request",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t,this.callback=r,this.subscribe=s??!1}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Et=class{constructor(e,t,r,s){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(n,o)=>{this.unsubscribe&&(this.unsubscribe!==o&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=n,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(n,o)),this.unsubscribe=o},this.host=e,t.context!==void 0){const n=t;this.context=n.context,this.callback=n.callback,this.subscribe=n.subscribe??!1}else this.context=t,this.callback=r,this.subscribe=s??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new dt(this.context,this.host,this.t,this.subscribe))}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Pr{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){const r=t||!Object.is(e,this.o);this.o=e,r&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(const[t,{disposer:r}]of this.subscriptions)t(this.o,r)},e!==void 0&&(this.value=e)}addCallback(e,t,r){if(!r)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});const{disposer:s}=this.subscriptions.get(e);e(this.value,s)}clearCallbacks(){this.subscriptions.clear()}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Er=class extends Event{constructor(e,t){super("context-provider",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}};class Te extends Pr{constructor(e,t,r){var s,n;super(t.context!==void 0?t.initialValue:r),this.onContextRequest=o=>{if(o.context!==this.context)return;const a=o.contextTarget??o.composedPath()[0];a!==this.host&&(o.stopPropagation(),this.addCallback(o.callback,a,o.subscribe))},this.onProviderRequest=o=>{if(o.context!==this.context||(o.contextTarget??o.composedPath()[0])===this.host)return;const a=new Set;for(const[c,{consumerHost:f}]of this.subscriptions)a.has(c)||(a.add(c),f.dispatchEvent(new dt(this.context,f,c,!0)));o.stopPropagation()},this.host=e,t.context!==void 0?this.context=t.context:this.context=t,this.attachListeners(),(n=(s=this.host).addController)==null||n.call(s,this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new Er(this.context,this.host))}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function kr({context:i}){return(e,t)=>{const r=new WeakMap;if(typeof t=="object")return{get(){return e.get.call(this)},set(s){return r.get(this).setValue(s),e.set.call(this,s)},init(s){return r.set(this,new Te(this,{context:i,initialValue:s})),s}};{e.constructor.addInitializer(o=>{r.set(o,new Te(o,{context:i}))});const s=Object.getOwnPropertyDescriptor(e,t);let n;if(s===void 0){const o=new WeakMap;n={get(){return o.get(this)},set(a){r.get(this).setValue(a),o.set(this,a)},configurable:!0,enumerable:!0}}else{const o=s.set;n={...s,set(a){r.get(this).setValue(a),o==null||o.call(this,a)}}}return void Object.defineProperty(e,t,n)}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt({context:i,subscribe:e}){return(t,r)=>{typeof r=="object"?r.addInitializer(function(){new Et(this,{context:i,callback:s=>{t.set.call(this,s)},subscribe:e})}):t.constructor.addInitializer(s=>{new Et(s,{context:i,callback:n=>{s[r]=n},subscribe:e})})}}const T=Symbol("playbackContext"),Fe=new AudioContext;class Mr{constructor(){this.audioContext=Fe,this.isPlaying=!1,this.isRecording=!1,this.isLooping=!1,this.bpm=120,this.master=new De("master",Fe,"Master"),this.preview=new De("preview",Fe,"Preview"),this.timeSignature=[4,4],this.currentTime=0,this.vstRegistry=new Cr}}function Ar(i,e){i.addEventListener("playback-context/bpm",t=>{e.setValue({...e.value,bpm:t.detail})}),i.addEventListener("playback-context/play",()=>{e.setValue({...e.value,isPlaying:!0})}),i.addEventListener("playback-context/stop",()=>{e.setValue({...e.value,isPlaying:!1})}),i.addEventListener("playback-context/record",()=>{e.setValue({...e.value,isRecording:!e.value.isRecording})}),i.addEventListener("playback-context/stop-recording",()=>{e.setValue({...e.value,isRecording:!1})}),i.addEventListener("playback-context/toggle-loop",()=>{e.setValue({...e.value,isLooping:!e.value.isLooping})}),i.addEventListener("playback-context/toggle-is-playing",()=>{e.setValue({...e.value,isPlaying:!e.value.isPlaying})}),i.addEventListener("playback-context/set-time-signature",t=>{const[r,s]=t.detail;e.setValue({...e.value,timeSignature:[r,s]})}),i.addEventListener("playback-context/set-current-time",t=>{e.setValue({...e.value,currentTime:t.detail})})}var Or=Object.defineProperty,Dr=(i,e,t,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(e,t,s)||s);return s&&Or(e,t,s),s};class Tr{constructor(e){this.host=e}$setBpm(e){this.host.dispatchEvent(new CustomEvent("playback-context/bpm",{detail:e,bubbles:!0,composed:!0}))}$play(){this.host.dispatchEvent(new CustomEvent("playback-context/play",{bubbles:!0,composed:!0}))}$stop(){this.host.dispatchEvent(new CustomEvent("playback-context/stop",{bubbles:!0,composed:!0}))}$toggleIsPlaying(){this.host.dispatchEvent(new CustomEvent("playback-context/toggle-is-playing",{bubbles:!0,composed:!0}))}$toggleIsRecording(){this.host.dispatchEvent(new CustomEvent("playback-context/record",{bubbles:!0,composed:!0}))}$setCurrentTime(e){this.host.dispatchEvent(new CustomEvent("playback-context/set-current-time",{detail:e,bubbles:!0,composed:!0}))}$onBpmChange(e){this.host.addEventListener("playback-context/bpm",t=>{e(t.detail)})}$onCurrentTimeChange(e){this.host.addEventListener("playback-context/set-current-time",t=>{e(t.detail)})}}const pe=i=>{class e extends i{constructor(){super(...arguments),this.consumer=new Tr(this)}}return Dr([pt({context:T,subscribe:!0}),b()],e.prototype,"playbackContext"),e};var Sr=Object.getOwnPropertyDescriptor,Lr=(i,e,t,r)=>{for(var s=r>1?void 0:r?Sr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(s)||s);return s};let We=class extends pe(d){constructor(){super(...arguments),this.isDragging=!1,this.iconBounds=null,this.clickedPixel=0,this.onMouseDown=i=>{this.isDragging=!0,window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("mouseup",this.onMouseUp),this.clickedPixel=i.clientY-this.unsafeIconBounds.top},this.onMouseMove=i=>{if(!this.isDragging)return;const e=i.clientY-this.unsafeIconBounds.top,t=e-this.clickedPixel;this.clickedPixel=e;const r=Math.floor(t/2);if(r===0)return;const s=this.playbackContext.bpm,n=r>0?Math.max(0,s-r):Math.min(999,s-r);this.consumer.$setBpm(n)},this.onMouseUp=()=>{this.isDragging=!1,this.clickedPixel=0,window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mouseup",this.onMouseUp)},this.onKeyDown=i=>{let e=null;if(i.key==="ArrowUp"?e=Math.min(999,this.playbackContext.bpm+1):i.key==="ArrowDown"&&(e=Math.max(0,this.playbackContext.bpm-1)),e===null)throw new Error("BPM value is null somehow");this.consumer.$setBpm(e)},this.handleFocus=()=>{window.addEventListener("keydown",this.onKeyDown)},this.handleBlur=()=>{window.removeEventListener("keydown",this.onKeyDown)}}get unsafeIconBounds(){if(!this.iconBounds)throw new Error("Icon bounds not found");return this.iconBounds}firstUpdated(i){var e,t;if(!this.iconBounds){const r=(t=(e=this.shadowRoot)==null?void 0:e.querySelector(".bpm-input-icon-wrapper"))==null?void 0:t.getBoundingClientRect();if(!r)throw new Error("Icon bounds not found");this.iconBounds=r}}render(){return l`<div
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
        </div> `}};We.styles=[D,u`
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
        `];We=Lr([p("bpm-picker")],We);var jr=Object.getOwnPropertyDescriptor,zr=(i,e,t,r)=>{for(var s=r>1?void 0:r?jr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(s)||s);return s};let Ge=class extends pe(d){formatedDisplayTime(){const i=this.playbackContext.currentTime,e=Math.floor(i/6e4),t=Math.floor(i%6e4/1e3),r=(i%1e3).toFixed(0);return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}:${String(r).slice(0,2).padStart(2,"0")}`}render(){return l`
            <div class="time-indicator typography-200">
                <p>${this.formatedDisplayTime()}</p>
            </div>
        `}};Ge.styles=[D,u`
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
        `];Ge=zr([p("time-indicator")],Ge);const Qt=async i=>{const e=await fetch(i,{headers:{"Content-Type":"audio/wav"}});if(!e.ok)throw new Error(`Failed to load file: ${i}`);return await e.arrayBuffer()};class Ir{constructor(e){this.lastTick=-1,this.channel=e}tick(e,t){const r=this.getNextBeatTime(e,t);r>this.lastTick&&(this.lastTick=r,this.channel.play())}getNextBeatTime(e,t){const r=this.metronomeInterval(t);return(Math.floor(e/r)+1)*r}start(){}stop(){this.lastTick=-1}rewind(){this.lastTick=-1}async preloadTickSound(){const e=await Qt("/assets/sounds/metronome-tick.wav");if(!e)throw new Error("Metronome sound not found");await this.channel.load(e).catch(t=>{console.error("Failed to load metronome sound:",t)})}metronomeInterval(e){return Math.floor(60/e*1e3)}}class Br{constructor(){this.startTime=0,this.elapsedTime=0,this.running=!1,this.requestId=null}start(e,t=20){if(!this.running&&(this.startTime=performance.now(),this.running=!0,e&&t))return this.onTick(e)}stop(){this.running&&(this.running=!1,this.elapsedTime+=performance.now()-this.startTime),this.requestId!==null&&(window.cancelAnimationFrame(this.requestId),this.requestId=null)}reset(){this.elapsedTime=0,this.startTime=0,this.running=!1}getElapsedTime(){return this.running?this.elapsedTime+(performance.now()-this.startTime):this.elapsedTime}tick(e=()=>{}){this.running&&(e(),this.requestId=window.requestAnimationFrame(this.tick.bind(this,e)))}onTick(e){return this.running?(this.requestId=window.requestAnimationFrame(this.tick.bind(this,e)),()=>{this.requestId!==null&&(window.cancelAnimationFrame(this.requestId),this.requestId=null)}):()=>{}}}const Jt=(i,e=4)=>Number((i/1e3).toFixed(e));var Nr=Object.defineProperty,Rr=Object.getOwnPropertyDescriptor,ut=(i,e,t,r)=>{for(var s=r>1?void 0:r?Rr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Nr(e,t,s),s};let ce=class extends pe(d){constructor(){super(...arguments),this.isMetronomeOn=!1,this.stopWatch=new Br,this.metronomeRafId=void 0}connectedCallback(){super.connectedCallback(),this.metronome=new Ir(this.playbackContext.preview),this.metronome.preloadTickSound(),this.keyboardManager.addKeys([{active:!0,keys:["Shift","r"],description:"Toggle Recording",handler:()=>this.handleRecord()},{active:!0,keys:["Space"],description:"Toggle Play/Pause",handler:()=>this.handlePlay()},{active:!0,keys:["Shift","m"],description:"Toggle Metronome",handler:()=>this.toggleMetronome()},{active:!0,keys:["Shift","ArrowLeft"],description:"Rewind to Start",handler:()=>this.handleRewind()}])}toggleMetronome(){this.isMetronomeOn=!this.isMetronomeOn}handlePlay(){this.consumer.$toggleIsPlaying();const i=!this.playbackContext.isPlaying;i&&this.stopWatch.stop(),i||this.stopWatch.start(()=>{this.consumer.$setCurrentTime(this.stopWatch.getElapsedTime())})}metronomeLoop(){this.isMetronomeOn&&this.playbackContext.isPlaying&&this.metronome.tick(this.playbackContext.currentTime,this.playbackContext.bpm),this.metronomeRafId=requestAnimationFrame(this.metronomeLoop.bind(this))}updated(i){var e;(e=super.updated)==null||e.call(this,i),this.playbackContext.isPlaying&&this.isMetronomeOn?this.metronomeRafId||this.metronomeLoop():this.metronomeRafId&&(cancelAnimationFrame(this.metronomeRafId),this.metronome.stop(),this.metronomeRafId=void 0)}handleRewind(){this.consumer.$setCurrentTime(0),this.stopWatch.reset(),this.playbackContext.isPlaying&&(this.stopWatch.start(()=>{this.consumer.$setCurrentTime(this.stopWatch.getElapsedTime())}),this.isMetronomeOn&&this.metronome.rewind())}handleRecord(){this.consumer.$toggleIsRecording()}get renderIsPlayingIcon(){return this.playbackContext.isPlaying?l`<stop-icon size=${15}></stop-icon>`:l`<play-icon size=${15}></play-icon>`}render(){return l`
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
                </div>
            </div>
        `}};ce.styles=[u`
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
        `];ut([h({type:Object})],ce.prototype,"keyboardManager",2);ut([b()],ce.prototype,"isMetronomeOn",2);ce=ut([p("recorder-component")],ce);var Kr=Object.defineProperty,Ur=Object.getOwnPropertyDescriptor,es=(i,e,t,r)=>{for(var s=r>1?void 0:r?Ur(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Kr(e,t,s),s};let Se=class extends d{render(){return l`
            <header>
                <div class="container">
                    <div class="controls-and-time">
                        <div class="recorder-wrapper">
                            <recorder-component
                                .keyboardManager=${this.keyboardManager}
                            ></recorder-component>
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
        `}};Se.styles=[u`
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
        `];es([h({type:Object})],Se.prototype,"keyboardManager",2);Se=es([p("top-nav")],Se);var ft=(i=>(i[i.VSTI=0]="VSTI",i[i.Custom=1]="Custom",i[i.Effect=2]="Effect",i))(ft||{});class ts extends EventTarget{constructor(...[e,t,r,s,n=!1]){super(),this.isCurrent=!1,this.screenManagerInstance=e,this.name=t,this.element=r,this.type=s,this.isVisible=n}setCurrent(e){this.isCurrent=e}setVisible(e){this.isVisible=e}}class Hr extends ts{constructor(e,...t){super(...t),this.vstData=e}}class Vr extends ts{constructor(...e){super(...e)}}const te=class te extends EventTarget{constructor(){super(),this.panels=[],te.instance=this}onPanelFocused(e){this.addEventListener("panel-focus",t=>{e(t.detail.panel)})}add(e,t){if(this.panels.find(r=>r.name===e))throw new Error(`Panel with name ${e} already exists.`);return this.panels.push(t),this}dispatchFocusEvent(e){this.dispatchEvent(new CustomEvent("panel-focus",{detail:{panel:e},bubbles:!0,composed:!0}))}quetlyUnfocus(){for(const e of this.panels)e.setCurrent(!1)}focus(e){const t=this.panels.find(r=>r.name===e);if(!t)throw new Error(`Panel with name ${e} does not exist.`);if(t.isCurrent)return t;for(const r of this.panels.values())r.name!==t.name&&r.setCurrent(!1);return t.setCurrent(!0),this.dispatchFocusEvent(t),t}static handleBackgroundClick(){const e=te.instance;if(!e){console.warn("No PanelScreenManager instance found.");return}e.dispatchFocusEvent()}};te.instance=null;let le=te;var qr=Object.defineProperty,Fr=Object.getOwnPropertyDescriptor,ss=(i,e,t,r)=>{for(var s=r>1?void 0:r?Fr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&qr(e,t,s),s};let Le=class extends d{constructor(){super(...arguments),this.current=P.A}isCurrentBank(i){return this.current===i}onChangeBank(i){this.dispatchEvent(new CustomEvent("pad-bank-changed",{detail:{bank:i},bubbles:!0,composed:!0}))}renderBankButton(i){return l`
            <mpc-button
                label="${P[i]}"
                .active=${this.isCurrentBank(i)}
                @click=${()=>this.onChangeBank(i)}
            >
                ${P[i]}
            </mpc-button>
        `}get renderPadButtons(){return l`
            <div class="pad-bank">
                ${this.renderBankButton(P.A)}
                ${this.renderBankButton(P.B)}
                ${this.renderBankButton(P.C)}
                ${this.renderBankButton(P.D)}
            </div>
        `}render(){return l`<div class="container">
            <div class="pad-container">
                <div></div>
                ${this.renderPadButtons}
            </div>
        </div>`}};Le.styles=[u`
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
        `];ss([h({type:Number})],Le.prototype,"current",2);Le=ss([p("pads-bank")],Le);const Wr=[{name:"TR-808",description:"This is the first program.",path:"assets/kits/TR-808",data:[{name:"808",file:"808.wav"},{name:"Clap",file:"Clap.wav"},{name:"Claves",file:"Claves.wav"},{name:"Conga High",file:"Conga High.wav"},{name:"Conga Mid",file:"Conga Mid.wav"},{name:"Conga Low",file:"Conga Low.wav"},{name:"Cowbell",file:"Cowbell.wav"},{name:"Cymbal",file:"Cymbal.wav"},{name:"HiHat",file:"Hihat.wav"},{name:"Kick Basic",file:"Kick Basic.wav"},{name:"Kick Long",file:"Kick Long.wav"},{name:"Kick Mid",file:"Kick Mid.wav"},{name:"Kick Short",file:"Kick Short.wav"},{name:"Maracas",file:"Maracas.wav"},{name:"Open Hat Long",file:"Open Hat Long.wav"},{name:"Open Hat Short",file:"Open Hat Short.wav"},{name:"Rimshot",file:"Rimshot.wav"},{name:"Snare Bright",file:"Snare Bright.wav"},{name:"Snare High",file:"Snare High.wav"},{name:"Snare Low",file:"Snare Low.wav"},{name:"Snare Mid",file:"Snare Mid.wav"},{name:"Tom High",file:"Tom High.wav"},{name:"Tom Low",file:"Tom Low.wav"},{name:"Tom Mid",file:"Tom Mid.wav"}]},{name:"Program 2",description:"This is the second program.",version:"2.0.0",author:"Author B"}],kt={programs:Wr};class H{constructor(){this.loadedPrograms=new Map,this.currentProgram=null}static getInstance(){return H.instance||(H.instance=new H),H.instance}get programNames(){return kt.programs.map(e=>e.name)}async load(e){if(this.loadedPrograms.has(e))return this.loadedPrograms.get(e);const t=kt.programs.find(s=>s.name===e);if(!t)throw new Error(`Program ${e} not found`);const r=t.path;try{const s=await Promise.all(((t==null?void 0:t.data)??[]).map(async({name:o,file:a})=>{const c=await Qt(`${r}/${a}`);return{name:o,data:c}})),n={name:e,data:s};return this.loadedPrograms.set(e,n),this.currentProgram=n,n}catch{throw new Error(`Error loading program ${e}`)}}}var Gr=Object.getOwnPropertyDescriptor,Zr=(i,e,t,r)=>{for(var s=r>1?void 0:r?Gr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(s)||s);return s};let Ze=class extends d{constructor(){super(...arguments),this.programManager=H.getInstance()}connectedCallback(){super.connectedCallback(),this.loadDefaultProgram()}get programNames(){return this.programManager.programNames.map(i=>({label:i,value:i}))}async loadDefaultProgram(){throw new Error("Default program not set")}async handleSelectProgram({detail:{value:i}}){try{const e=await this.programManager.load(i);this.emitProgramToParent(e)}catch{throw new Error("Failed to load program")}}emitProgramToParent(i){this.dispatchEvent(new CustomEvent("program-loaded",{detail:{program:i},bubbles:!0,composed:!0}))}render(){return l`
            <section class="container">
                <daw-select
                    .options=${this.programNames}
                    @select-data=${this.handleSelectProgram}
                >
                </daw-select>
            </section>
        `}};Ze.styles=[D,u`
            .container {
                padding: 20px 0;
            }
        `];Ze=Zr([p("program-container")],Ze);var Xr=Object.defineProperty,Yr=Object.getOwnPropertyDescriptor,Ne=(i,e,t,r)=>{for(var s=r>1?void 0:r?Yr(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Xr(e,t,s),s};let W=class extends d{constructor(){super(...arguments),this.volume=0,this.isActive=!0}emitClickData(){this.dispatchEvent(new CustomEvent("pad-click",{detail:{mapping:this.mappedPad},bubbles:!0,composed:!0}))}render(){var r,s,n;const i=((r=this.mappedPad)==null?void 0:r.name)||"Unnamed Pad",e=((s=this.mappedPad)==null?void 0:s.description)||"No Description",t=(n=this.mappedPad)==null?void 0:n.pressed;return l`
            <div>
                <p class="pad-name typography-300">${i}</p>
                <button
                    @click=${this.emitClickData}
                    class=${A({pad:!0,active:t!==void 0&&t})}
                >
                    <span class="key typography-500">${e}</span>
                </button>
            </div>
        `}};W.styles=[D,u`
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
        `];Ne([h({type:Object})],W.prototype,"mappedPad",2);Ne([h({type:Number})],W.prototype,"volume",2);Ne([h({type:Boolean})],W.prototype,"isActive",2);W=Ne([p("daw-pad")],W);class Qr{constructor(e,t,r,s=!0,n,o){this.active=!0,this.keys=e,this.index=t,this.handler=r,this.description=n,this.name=o,this.active=s}}class rs extends Qr{constructor(e,t,r,s=!0,n,o,a=!1){super(e,t,r,s,n,o),this.pressed=a}}class Jr extends EventTarget{constructor(){super(),this.keys=new Map,this.pressedKeys=new Set,this.attached=!1,this.handleKeyDown=this.handleKeyDown.bind(this),this.handleKeyUp=this.handleKeyUp.bind(this)}attachEventListeners(){if(console.log("SimpleKeyboardKanager: Attaching event listeners."),this.attached){console.warn("SimpleKeyboardKanager: Event listeners already attached.");return}this.attached=!0,document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}detachEventListeners(){if(!this.attached){console.warn("SimpleKeyboardKanager: No event listeners to detach.");return}this.attached=!1,document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}add(e,t){const r=e.join("-").toLowerCase();this.keys.set(r,t)}addKeys(e){e.forEach(t=>{this.add(t.keys,t)})}remove(e){const t=e.join("-").toLowerCase();this.keys.delete(t)}removeKeys(e){e.forEach(t=>{this.remove(t.keys)})}onMappingHit(e){this.addEventListener("key-pressed",t=>{e(t)})}pressedEvent(e,t){return new CustomEvent("key-pressed",{detail:{mapping:e,pressed:t}})}handleKeyDown(e){const t=e.key.toLowerCase();if(this.keys.has(t)){const r=this.keys.get(t);r&&!r.pressed&&(r.pressed=!0,this.pressedKeys.add(t),this.dispatchEvent(this.pressedEvent(r,!0)))}}handleKeyUp(e){const t=e.key.toLowerCase();if(this.keys.has(t)){const r=this.keys.get(t);r&&r.pressed&&(r.pressed=!1,this.pressedKeys.delete(t),this.dispatchEvent(this.pressedEvent(r,!1)))}}}class is extends EventTarget{constructor(){super(),this.keyMappings=new Map,this.currentCombination=[],this.interval=null,this.attached=!1,this.currentKeys=[],this.handleKeyDown=this.handleKeyDown.bind(this)}add(e,t){const r=e.join("-").toLowerCase();this.keyMappings.set(r,t)}addKeys(e){e.forEach(t=>{this.add(t.keys,t)})}remove(e){const t=e.join("-").toLowerCase();this.keyMappings.delete(t)}removeKeys(e){e.forEach(t=>{this.remove(t.keys)})}handleKeyDown(e){var n;let t=e.key.toLowerCase();if("code"in e&&e.code==="Space"&&(t=e.code.toLowerCase()),this.currentCombination[this.currentCombination.length-1]===t)return;this.currentCombination.push(t);const s=this.currentCombination.length===1?t:this.currentCombination.join("-").toLowerCase();if(this.currentCombination.length>3&&this.currentCombination.shift(),this.keyMappings.has(s)){const o=this.keyMappings.get(s);if(!o||!o.active)return;(n=o.handler)==null||n.call(o),this.dispatchEvent(new CustomEvent("mapping-hit",{detail:o,bubbles:!0,composed:!0})),this.currentKeys.push(s)}this.interval&&clearTimeout(this.interval),this.interval=setTimeout(()=>{this.currentCombination=[]},300)}onMappingHit(e){this.addEventListener("mapping-hit",t=>{e(t)})}attachEventListeners(){if(this.attached){console.warn("KeyboardManager: Event listeners already attached.");return}this.attached=!0,document.addEventListener("keydown",this.handleKeyDown)}detachEventListeners(){if(!this.attached){console.warn("KeyboardManager: No event listeners to detach.");return}this.attached=!1,document.removeEventListener("keydown",this.handleKeyDown),console.log("KeyboardManager: Event listeners detached.")}}const ns=Symbol("screenManagerContext");new le;var ei=Object.defineProperty,ti=(i,e,t,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(e,t,s)||s);return s&&ei(e,t,s),s};const Re=i=>{class e extends i{}return ti([pt({context:ns,subscribe:!0}),b()],e.prototype,"screenManager"),e},os=Symbol("channelsContext");function si(i,e){i.addEventListener("channels-context/add-channel",t=>{const r=t.detail,s=r.id,n=e.value.channels.findIndex(o=>o.id===s);n!==-1?e.setValue({...e.value,channels:e.value.channels.map((o,a)=>a===n?r:o)}):e.setValue({...e.value,channels:[...e.value.channels,r]})})}var ri=Object.defineProperty,ii=(i,e,t,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(e,t,s)||s);return s&&ri(e,t,s),s};const as=i=>{class e extends i{hasChannel(r){return this.audioChannels.channels.some(s=>s.id===r.id)}$addChannel(r){this.dispatchEvent(new CustomEvent("channels-context/add-channel",{detail:r,bubbles:!0,composed:!0}))}}return ii([pt({context:os,subscribe:!0}),b()],e.prototype,"audioChannels"),e};var ni=Object.defineProperty,oi=Object.getOwnPropertyDescriptor,Z=(i,e,t,r)=>{for(var s=r>1?void 0:r?oi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&ni(e,t,s),s};const ai=()=>{},Xe=["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h"];class ci extends rs{constructor(e,t,r,s,n){super(t.keys,t.index,t.handler,t.active,t.description,t.name,!1),this.data=r,this.bank=s,this.index=n,this.sample=new De(`pad-${t.name}-${s}-${n}`,e,t.name),this.sample.load(r.data).catch(o=>{console.error(`Failed to load sample for pad ${t.name} in bank ${s}:`,o)})}async play(){await this.sample.play()}}const K=Xe.length;var P=(i=>(i[i.A=0]="A",i[i.B=1]="B",i[i.C=2]="C",i[i.D=3]="D",i))(P||{});const li=i=>{let e=0;return i>=K&&i<K*2?e=1:i>=K*2&&i<K*3?e=2:i>=K*3&&(e=3),e},hi="sampler-view";let O=class extends as(Re(pe(d))){constructor(){super(...arguments),this.samplerKeyMgr=new Jr,this.mappedKeyPads=[],this.currentView=[],this.programData=null,this.currentBank=0,this.isFocused=!1}connectedCallback(){var e;super.connectedCallback();const i=this;this.screenManager.onPanelFocused(t=>{(t==null?void 0:t.name)===i.nodeName.toLowerCase()?this.samplerKeyMgr.attachEventListeners():this.samplerKeyMgr.detachEventListeners()}),(e=this.samplerKeyMgr)==null||e.onMappingHit(({detail:{mapping:t}})=>{const r=this.currentBankPads.findIndex(s=>s.name===t.name);if(r===-1){console.warn(`No pad found for mapping: ${t.name}. Index: ${r}`);return}this.currentView=this.currentBankPads.map(s=>{const n=this.samplerKeyMgr.keys.get(s.keys.join("-").toLowerCase());return s.pressed=(n==null?void 0:n.pressed)??!1,(n==null?void 0:n.pressed)!==void 0&&n.pressed&&(s.play(),this.dispatchEvent(new CustomEvent("sample-play",{detail:{mapping:s},bubbles:!0,composed:!0}))),s})})}disconnectedCallback(){var i;super.disconnectedCallback(),(i=this.samplerKeyMgr)==null||i.detachEventListeners()}getBankAndRealIndex(i){const e=li(i),t=i%K;return{bank:e,realIndex:t}}createMappings(){var i;this.mappedKeyPads=(((i=this.programData)==null?void 0:i.data)??[]).map((e,t)=>{const{realIndex:r,bank:s}=this.getBankAndRealIndex(t),n=[Xe[r]],o=new rs(n,r,ai,!0,Xe[r],e.name),a=this.playbackContext.audioContext;return new ci(a,o,e,s,t)}),this.currentView=this.mappedKeyPads.filter(e=>e.bank===this.currentBank),this.samplerKeyMgr.addKeys(this.currentBankPads)}get currentBankPads(){return this.mappedKeyPads.filter(i=>i.bank===this.currentBank)}update(i){if(super.update(i),Array.from(i.keys()).includes("programData")){this.createMappings();const t=this.playbackContext.master,r=new De("sampler-master",this.playbackContext.audioContext,"Sampler Master",t);this.mappedKeyPads.forEach(({sample:s})=>r.addSubChannel(s)),this.$addChannel(r)}}setPadBankFromEvent(i){const e=i.detail.bank;this.samplerKeyMgr.removeKeys(this.currentBankPads),this.currentBank=e;const t=this.mappedKeyPads.filter(r=>r.bank===this.currentBank);t.forEach(r=>{r.pressed=!1}),this.samplerKeyMgr.addKeys(t),this.currentView=t}setProgramFromEvent(i){const e=i.detail.program;if(e)this.programData=e;else throw new Error("No program found in event")}handleClick(i){}render(){return l`
            <div class="top-bar">
                <program-container
                    @program-loaded=${this.setProgramFromEvent}
                ></program-container>
                <pads-bank
                    @pad-bank-changed=${this.setPadBankFromEvent}
                    .current=${this.currentBank}
                ></pads-bank>
            </div>
            <div class="pads">
                ${this.currentView.map(i=>l`
                        <daw-pad
                            @pad-click=${this.handleClick}
                            .mappedPad=${i}
                        ></daw-pad>
                    `)}
            </div>
        `}};O.styles=u`
        .root {
            background-color: red;
        }
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
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
    `;Z([b()],O.prototype,"mappedKeyPads",2);Z([b()],O.prototype,"currentView",2);Z([h({type:Object})],O.prototype,"programData",2);Z([h({type:Number})],O.prototype,"currentBank",2);Z([h({type:Boolean})],O.prototype,"isFocused",2);O=Z([p(hi)],O);class di{constructor(e,t,r,s=1,n=0,o=!1,a=!1,c=!0){this.id=e,this.name=t,this.ctx=r,this.volume=s,this.pan=n,this.mute=o,this.solo=a,this.isActive=c}}class pi{constructor(e,t,r=[]){this.id=e,this.name=t,this.soundChannels=r}addSoundChannel(e,t,r,s=1,n=0,o=!1,a=!1,c=!0){const f=new di(t,r,e,s,n,o,a,c);this.soundChannels.push(f)}}var ui=Object.getOwnPropertyDescriptor,fi=(i,e,t,r)=>{for(var s=r>1?void 0:r?ui(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(s)||s);return s};const cs="sampler-root";let Mt=class extends Re(pe(d)){constructor(){super(...arguments),this.keyboardManager=new is}connectedCallback(){super.connectedCallback();const i=new pi("Sampler","sampler");this.screenManager.add(cs,new Hr(i,this.screenManager,"sampler-view",this,ft.VSTI,!0))}onSamplePlay(i){}render(){return l`
            <panel-card
                card-height="auto"
                card-width="500px"
                card-id="sampler-view"
                .startPos=${[10,80]}
                .isDraggable=${!0}
                .keyboardManager=${this.keyboardManager}
            >
                <sampler-view
                    .keyManager=${this.keyboardManager}
                    @sample-play=${this.onSamplePlay.bind(this)}
                ></sampler-view>
            </panel-card>
        `}};Mt=fi([p(cs)],Mt);var vi=Object.defineProperty,gi=Object.getOwnPropertyDescriptor,w=(i,e,t,r)=>{for(var s=r>1?void 0:r?gi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&vi(e,t,s),s};const mi=100,bi=50;let y=class extends Re(d){constructor(){super(...arguments),this.cardWidth="auto",this.cardHeight="auto",this.isDragging=!1,this.pos=[0,0],this.dragController=new Nt,this.cardRef=at(),this.elementZIndex=0,this.isFocused=!1}firstUpdated(i){this.dragController.setElement(this.cardRef.value),this.screenManager&&(this.screenManager.onPanelFocused(e=>{var t,r;(e==null?void 0:e.name)===this.cardId?((t=this.keyboardManager)==null||t.attachEventListeners(),this.elementZIndex=mi,this.isFocused=!0):((r=this.keyboardManager)==null||r.detachEventListeners(),this.elementZIndex=bi,this.isFocused=!1,this.screenManager.quetlyUnfocus())}),this.dragController.onDragChange.call(this.dragController,({event:e,coords:[t,r]})=>{switch(e){case I.Start:this.screenManager.focus(this.cardId),this.isDragging=!0;break;case I.Dragging:this.pos=[t,r];break;case I.End:this.isDragging=!1;break}}))}handleFocus(){this.screenManager.focus(this.cardId)}connectedCallback(){super.connectedCallback(),this.startPos&&(this.pos=this.startPos)}render(){const[i,e]=this.pos;let t=n=>{};this.isDraggable&&(t=this.dragController.handleMouseDown.bind(this.dragController));const r=A({card:!0,"is-dragging":this.isDragging,"is-focused":this.isFocused}),s=G({transform:`translate(${i}px, ${e}px)`,width:this.cardWidth,height:this.cardHeight,zIndex:this.elementZIndex});return l`<div
            tabindex="0"
            @focus=${this.handleFocus}
            ${ct(this.cardRef)}
            id=${this.cardId}
            class=${r}
            style=${s}
            @mousedown="${t}"
            @click="${this.handleFocus.bind(this)}"
        >
            <div class="card-header">
                <slot name="header"></slot>
            </div>
            <div class="content-wrapper">
                <slot></slot>
            </div>
        </div> `}};y.styles=u`
        :root {
            --color-drag: #3f3f3f;
        }

        .card {
            display: flex;
            flex-direction: column;
            padding: 20px;
            background-color: var(--card-color);
            border-radius: var(--border-radius);
            border: 1px solid var(--color-accent);
            position: absolute;
        }

        .card.is-dragging {
            cursor: grabbing;
            border: 1px solid var(--color-tint-primary);
        }

        .card.is-focused {
            border: 1px solid var(--color-tint-primary);
        }
    `;w([h({type:Array})],y.prototype,"startPos",2);w([h({type:String,attribute:"card-id"})],y.prototype,"cardId",2);w([h({type:String,attribute:"card-width"})],y.prototype,"cardWidth",2);w([h({type:String,attribute:"card-height"})],y.prototype,"cardHeight",2);w([h({type:Boolean})],y.prototype,"isDraggable",2);w([h({type:Object,attribute:!1})],y.prototype,"keyboardManager",2);w([b()],y.prototype,"isDragging",2);w([b()],y.prototype,"pos",2);w([b()],y.prototype,"elementZIndex",2);w([b()],y.prototype,"isFocused",2);y=w([p("panel-card")],y);var yi=Object.getOwnPropertyDescriptor,wi=(i,e,t,r)=>{for(var s=r>1?void 0:r?yi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(s)||s);return s};let Ye=class extends d{constructor(){super(...arguments),this.dialogRef=at()}firstUpdated(i){super.firstUpdated(i),this.dispatchEvent(new CustomEvent("dialog-ready",{bubbles:!0,composed:!0,detail:{dialogRef:this.dialogRef.value}}))}render(){return l`
            <dialog ${ct(this.dialogRef)} id="add-track-dialog">
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
        `}};Ye.styles=[u`
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
        `];Ye=wi([p("add-track-dialog")],Ye);class $i{constructor(e,{context:t,callback:r,subscribe:s=!1}){this.subscribe=!1,this.provided=!1,this.value=void 0,this._callback=(n,o)=>{this.unsubscribe&&(this.unsubscribe!==o&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=n,(!this.provided||this.subscribe)&&(this.provided=!0,this.callback&&this.callback(n,o)),this.unsubscribe=o},this.host=e,this.context=t,this.callback=r,this.subscribe=s??!1,this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new dt(this.context,this.host,this._callback,this.subscribe))}}function X({context:i,subscribe:e}){return(t,r)=>{t.constructor.addInitializer(s=>{let n;new $i(s,{context:i,subscribe:e,callback:o=>{const a=o[r];(n===void 0||n!==a)&&(s[r]=a,s.requestUpdate(r,n)),n=a}})})}}var xi=Object.defineProperty,_i=Object.getOwnPropertyDescriptor,vt=(i,e,t,r)=>{for(var s=r>1?void 0:r?_i(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&xi(e,t,s),s};const ve=131;let he=class extends d{getPlayheadPosition(){return ge(this.bpm,this.currentTime)}render(){return l`<div
            class="current-time-indicator"
            style=${G({transform:`translateX(${this.getPlayheadPosition()}px)`})}
        ></div>`}};he.styles=[u`
            .current-time-indicator {
                position: absolute;
                width: 1px;
                top: 0;
                bottom: 0;
                background-color: var(--color-tint-primary);
                height: 100%;
                z-index: 10;
                left: ${ve}px;
            }
        `];vt([X({context:T,subscribe:!0})],he.prototype,"bpm",2);vt([X({context:T,subscribe:!0})],he.prototype,"currentTime",2);he=vt([p("playhead-node")],he);var Ci=Object.defineProperty,Pi=Object.getOwnPropertyDescriptor,S=(i,e,t,r)=>{for(var s=r>1?void 0:r?Pi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Ci(e,t,s),s};let $=class extends d{constructor(){super(...arguments),this.events=[],this.zIndex=1,this.played=new Set}updated(i){super.updated(i),i.has("currentTime")&&(console.log(123),this.isPlaying&&this.playTrack())}playTrack(){const i=this.currentTime;this.events.forEach(e=>{if(!this.played.has(e.id))return e.startTime&&i>e.startTime&&(this.played.add(e.id),queueMicrotask(()=>{console.log("Playing track",this.track.id,e.id),this.track.channel.play(0,0)})),e})}connectedCallback(){super.connectedCallback(),this.track.channel.onPlay(({detail:{id:i,duration:e}})=>{if(!this.isRecording&&!this.isPlaying)return;const t=this.zIndex+1;this.events=[{id:i,done:!1,xStart:ge(this.bpm,this.currentTime),xEnd:Jt(e??0),zIndex:t,startTime:this.currentTime,isPlaying:!1},...this.events],this.zIndex=t}),this.track.channel.onStop(({detail:{id:i}})=>{!this.isRecording&&!this.isPlaying||(this.events=this.events.map(e=>e.id===i?{...e,done:!0,xEnd:ge(this.bpm,this.currentTime)-(e.xStart??0)}:e))})}render(){return l` <div class="event-container">
            ${this.events.map(({xEnd:i=0,done:e,xStart:t,zIndex:r})=>{const s=e?i:ge(this.bpm,this.currentTime)-(t??0),n=G({transform:`translateX(${t}px)`,width:`${s}px`,top:"0px",height:"100%",zIndex:r}),o=A({event:!0,"event-done":!!e,"event-drawing":this.isRecording});return l`<div class="${o}" style=${n}></div>`})}
        </div>`}};$.styles=[u`
            .event-container {
                position: relative;
                width: 100%;
                height: 80%;
            }

            .event {
                position: absolute;
                background-color: var(--color-tint-primary);
                box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
                border-left: 4px solid var(--color-accent);
            }

            .event-drawing {
                border-right: none;
            }

            .event-done {
                border-right: 1px solid var(--color-accent);
            }
        `];S([X({context:T,subscribe:!0})],$.prototype,"currentTime",2);S([X({context:T,subscribe:!0})],$.prototype,"isPlaying",2);S([X({context:T,subscribe:!0})],$.prototype,"isRecording",2);S([X({context:T,subscribe:!0})],$.prototype,"bpm",2);S([h({type:Object})],$.prototype,"track",2);S([b()],$.prototype,"events",2);S([b()],$.prototype,"zIndex",2);$=S([p("track-event")],$);var Ei=Object.defineProperty,ki=Object.getOwnPropertyDescriptor,ls=(i,e,t,r)=>{for(var s=r>1?void 0:r?ki(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Ei(e,t,s),s};const At=4,V=70;class Ot{constructor(e,t){this.channel=e,this.id=e.id,this.parent=t}mute(){this.channel.setMuted(!0)}unmute(){this.channel.setMuted(!1)}}let je=class extends as(d){constructor(){super(...arguments),this.currentQuantisize=4}get tracks(){return this.audioChannels.channels.flatMap(i=>{var t;const e=new Ot(i);return[e,...((t=i.subChannels)==null?void 0:t.map(r=>new Ot(r,e)))||[]]})}renderQuantisisedLines(){const i=[],e=this.currentQuantisize,t=Math.ceil(At*V);for(let r=0;r<t;r+=e)i.push(l`<div class="typography-300 time-cell">${r}</div>`);return i}generateCells(i){const e=[],t=this.currentQuantisize,r=Math.ceil(At*V);for(let s=0;s<r;s+=t)e.push(l`<div id=${i+s} class="typography-300 time-beat"></div>`);return e}setSelectedTrack(i){this.selectedTrack=i}renderQuantisisedTrackCells(i=this.tracks,e=!1){return i.map(t=>{var n;const r=A({"track-name":!0,"typography-200":e,"typography-500":!e}),s=A({"track-row":!0,"selected-row":((n=this.selectedTrack)==null?void 0:n.id)===t.id});return l`
                <div
                    class="${s}"
                    @click=${()=>this.setSelectedTrack(t)}
                >
                    <div class="sub-track">
                        <div class="${r}">${t.channel.name}</div>
                        <div class="muted-button"></div>
                    </div>
                    <track-event .track=${t}></track-event>
                    ${this.generateCells(t.id)}
                </div>
            `})}render(){return l`
            <div class="tracks-container">
                <div class="track-pool">
                    <playhead-node></playhead-node>
                    <div class="times-container">
                        ${this.renderQuantisisedLines()}
                    </div>
                    <div class="tracks-slots">
                        ${this.renderQuantisisedTrackCells()}
                    </div>
                </div>
            </div>
        `}};je.styles=[D,u`
            .tracks-container {
                width: 100%;
                min-height: 300px;
                max-height: 500px;
            }

            .times-container {
                display: flex;
                width: 100%;
                height: 30px;
                margin-left: ${ve}px;
                border-left: 1px solid var(--color-accent);
            }

            .track-pool {
                position: relative;
                width: 100%;
                overflow: auto;
            }

            .tracks-container {
                display: flex;
                background-color: var(--color-primary);
            }

            .time-beat {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 0.7em;
                border-right: 1px solid var(--color-accent);
                border-bottom: 1px solid var(--color-accent);
                min-width: ${V}px;
                max-width: ${V}px;
                background-color: var(--color-secondary);
                height: 35px;
                padding: 0 5px;
            }

            .time-cell {
                display: flex;
                justify-content: flex;
                align-items: center;
                font-size: 0.7em;
                border-bottom: 1px solid var(--color-accent);
                min-width: ${V}px;
                max-width: ${V}px;
                height: 50px;
                padding: 0 5px;
            }

            .sub-track {
                position: sticky;
                left: 0;
                min-width: ${ve-1}px;
                max-width: ${ve-1}px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 50;
                background-color: var(--color-primary);
                border-right: 1px solid var(--color-accent);
                border-bottom: 1px solid var(--color-accent);

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
            }

            .selected-row {
                border: 1px solid var(--color-tint-primary);
                border-left: 0;
            }

            .selected {
                border: 1px solid var(--color-tint-primary);
            }

            .sound-sequence {
                position: absolute;
                height: 100%;
                background-color: var(--color-tint-primary);
                border-radius: 2px;
                transition: width 0.2s ease-in-out;
            }
        `];ls([b()],je.prototype,"selectedTrack",2);je=ls([p("tracks-view")],je);var Mi=Object.getOwnPropertyDescriptor,Ai=(i,e,t,r)=>{for(var s=r>1?void 0:r?Mi(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(s)||s);return s};const hs="tracks-panel",ge=(i,e)=>{const r=81/(60/i);return Jt(e)*r};let Dt=class extends Re(d){connectedCallback(){super.connectedCallback();const i=new Vr(this.screenManager,"tracks-view",this,ft.Custom,!0,!0);this.screenManager.add(hs,i)}render(){return l`
            <panel-card
                card-id="tracks-view"
                card-height="auto"
                card-width="1100px"
                .startPos=${[570,80]}
                .isDraggable=${!0}
                .screenManagerInstance=${this.screenManager}
            >
                <tracks-view></tracks-view>
            </panel-card>
        `}};Dt=Ai([p(hs)],Dt);var Oi=Object.defineProperty,Di=Object.getOwnPropertyDescriptor,ds=(i,e,t,r)=>{for(var s=r>1?void 0:r?Di(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(e,t,s):o(s))||s);return r&&s&&Oi(e,t,s),s};let ze=class extends d{constructor(){super(...arguments),this.screenManager=new le,this.channelsCtx=new Te(this,{context:os,initialValue:{channels:[]}}),this.keyboardManager=new is}connectedCallback(){super.connectedCallback(),si(this,this.channelsCtx),this.keyboardManager.attachEventListeners()}handleClick(i){i.target instanceof HTMLElement&&i.target.classList.contains("container")&&le.handleBackgroundClick()}firstUpdated(i){var t;const e=(t=this.screenManager.panels)==null?void 0:t[0];e&&setTimeout(()=>{this.screenManager.focus(e.name)})}render(){return l` <top-nav
                .keyboardManager=${this.keyboardManager}
            ></top-nav>
            <div class="container" @click="${this.handleClick}">
                <sampler-root></sampler-root>
                <tracks-panel></tracks-panel>
            </div>`}};ze.styles=u`
        .container {
            position: relative;
            width: 100%;
            height: calc(100vh - 80px);
        }
    `;ds([kr({context:ns})],ze.prototype,"screenManager",2);ze=ds([p("app-view")],ze);var Ti=Object.getOwnPropertyDescriptor,Si=(i,e,t,r)=>{for(var s=r>1?void 0:r?Ti(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(s)||s);return s};let Qe=class extends d{constructor(){super(...arguments),this.playbackProvider=new Te(this,{context:T,initialValue:new Mr})}connectedCallback(){super.connectedCallback(),Ar(this,this.playbackProvider)}render(){return l`
            <main class="container">
                <app-view></app-view>
            </main>
        `}};Qe.styles=[u`
            :host {
                --color-primary: #1d1d1d;
                --color-secondary: #171717;
                --color-accent: hwb(0 22% 78%);
                --color-text: #ffffff;
                --color-background: #181818;
                --container-width: 1200px;
                --container-height: 60vh;
                --card-color: #2c2c2c;
                --color-tint-primary: #d95656;
                --border-radius: 10px;
            }

            html {
                background-color: var(--color-background);
            }

            .container {
                margin: 20px auto;
            }
        `];Qe=Si([p("root-app")],Qe);function Li(){const i=document.createElement("root-app",{is:"root-app"});document.body.appendChild(i),console.log("App initialized. If you see this, the app is running correctly.")}Li();
