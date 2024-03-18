/*! For license information please see component---src-templates-blog-post-js-559d23bdd86fe9a4e1f1.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"1QcF":function(e,t,n){},"1jzt":function(e,t,n){(function(n){var o,r;r=void 0!==n?n:"undefined"!=typeof window?window:this,void 0===(o=function(){return function(e){"use strict";var t={ignore:"[data-scroll-ignore]",header:null,topOnEmptyHash:!0,speed:500,speedAsDuration:!1,durationMax:null,durationMin:null,clip:!0,offset:0,easing:"easeInOutCubic",customEasing:null,updateURL:!0,popstate:!0,emitEvents:!0},n=function(){var e={};return Array.prototype.forEach.call(arguments,(function(t){for(var n in t){if(!t.hasOwnProperty(n))return;e[n]=t[n]}})),e},o=function(e){"#"===e.charAt(0)&&(e=e.substr(1));for(var t,n=String(e),o=n.length,r=-1,l="",s=n.charCodeAt(0);++r<o;){if(0===(t=n.charCodeAt(r)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");l+=1<=t&&t<=31||127==t||0===r&&48<=t&&t<=57||1===r&&48<=t&&t<=57&&45===s?"\\"+t.toString(16)+" ":128<=t||45===t||95===t||48<=t&&t<=57||65<=t&&t<=90||97<=t&&t<=122?n.charAt(r):"\\"+n.charAt(r)}return"#"+l},r=function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)},l=function(t,n,o){0===t&&document.body.focus(),o||(t.focus(),document.activeElement!==t&&(t.setAttribute("tabindex","-1"),t.focus(),t.style.outline="none"),e.scrollTo(0,n))},s=function(t,n,o,r){if(n.emitEvents&&"function"==typeof e.CustomEvent){var l=new CustomEvent(t,{bubbles:!0,detail:{anchor:o,toggle:r}});document.dispatchEvent(l)}};return function(a,i){var c,u,f,d,$={cancelScroll:function(e){cancelAnimationFrame(d),d=null,e||s("scrollCancel",c)},animateScroll:function(o,a,i){$.cancelScroll();var u=n(c||t,i||{}),m="[object Number]"===Object.prototype.toString.call(o),h=m||!o.tagName?null:o;if(m||h){var p=e.pageYOffset;u.header&&!f&&(f=document.querySelector(u.header));var g,y,v,b,w,E,S,O,L=function(t){return t?(n=t,parseInt(e.getComputedStyle(n).height,10)+t.offsetTop):0;var n}(f),k=m?o:function(t,n,o,l){var s=0;if(t.offsetParent)for(;s+=t.offsetTop,t=t.offsetParent;);return s=Math.max(s-n-o,0),l&&(s=Math.min(s,r()-e.innerHeight)),s}(h,L,parseInt("function"==typeof u.offset?u.offset(o,a):u.offset,10),u.clip),N=k-p,j=r(),C=0,R=(g=N,v=(y=u).speedAsDuration?y.speed:Math.abs(g/1e3*y.speed),y.durationMax&&v>y.durationMax?y.durationMax:y.durationMin&&v<y.durationMin?y.durationMin:parseInt(v,10)),M=function(t){var n,r,i;b||(b=t),C+=t-b,E=p+N*(r=w=1<(w=0===R?0:C/R)?1:w,"easeInQuad"===(n=u).easing&&(i=r*r),"easeOutQuad"===n.easing&&(i=r*(2-r)),"easeInOutQuad"===n.easing&&(i=r<.5?2*r*r:(4-2*r)*r-1),"easeInCubic"===n.easing&&(i=r*r*r),"easeOutCubic"===n.easing&&(i=--r*r*r+1),"easeInOutCubic"===n.easing&&(i=r<.5?4*r*r*r:(r-1)*(2*r-2)*(2*r-2)+1),"easeInQuart"===n.easing&&(i=r*r*r*r),"easeOutQuart"===n.easing&&(i=1- --r*r*r*r),"easeInOutQuart"===n.easing&&(i=r<.5?8*r*r*r*r:1-8*--r*r*r*r),"easeInQuint"===n.easing&&(i=r*r*r*r*r),"easeOutQuint"===n.easing&&(i=1+--r*r*r*r*r),"easeInOutQuint"===n.easing&&(i=r<.5?16*r*r*r*r*r:1+16*--r*r*r*r*r),n.customEasing&&(i=n.customEasing(r)),i||r),e.scrollTo(0,Math.floor(E)),function(t,n){var r=e.pageYOffset;if(t==n||r==n||(p<n&&e.innerHeight+r)>=j)return $.cancelScroll(!0),l(o,n,m),s("scrollStop",u,o,a),!(d=b=null)}(E,k)||(d=e.requestAnimationFrame(M),b=t)};0===e.pageYOffset&&e.scrollTo(0,0),S=o,O=u,m||history.pushState&&O.updateURL&&history.pushState({smoothScroll:JSON.stringify(O),anchor:S.id},document.title,S===document.documentElement?"#top":"#"+S.id),"matchMedia"in e&&e.matchMedia("(prefers-reduced-motion)").matches?l(o,Math.floor(k),!1):(s("scrollStart",u,o,a),$.cancelScroll(!0),e.requestAnimationFrame(M))}}},m=function(t){if(!t.defaultPrevented&&!(0!==t.button||t.metaKey||t.ctrlKey||t.shiftKey)&&"closest"in t.target&&(u=t.target.closest(a))&&"a"===u.tagName.toLowerCase()&&!t.target.closest(c.ignore)&&u.hostname===e.location.hostname&&u.pathname===e.location.pathname&&/#/.test(u.href)){var n,r;try{n=o(decodeURIComponent(u.hash))}catch(t){n=o(u.hash)}if("#"===n){if(!c.topOnEmptyHash)return;r=document.documentElement}else r=document.querySelector(n);(r=r||"#top"!==n?r:document.documentElement)&&(t.preventDefault(),function(t){if(history.replaceState&&t.updateURL&&!history.state){var n=e.location.hash;n=n||"",history.replaceState({smoothScroll:JSON.stringify(t),anchor:n||e.pageYOffset},document.title,n||e.location.href)}}(c),$.animateScroll(r,u))}},h=function(e){if(null!==history.state&&history.state.smoothScroll&&history.state.smoothScroll===JSON.stringify(c)){var t=history.state.anchor;"string"==typeof t&&t&&!(t=document.querySelector(o(history.state.anchor)))||$.animateScroll(t,null,{updateURL:!1})}};return $.destroy=function(){c&&(document.removeEventListener("click",m,!1),e.removeEventListener("popstate",h,!1),$.cancelScroll(),d=f=u=c=null)},function(){if(!("querySelector"in document&&"addEventListener"in e&&"requestAnimationFrame"in e&&"closest"in e.Element.prototype))throw"Smooth Scroll: This browser does not support the required JavaScript methods and browser APIs.";$.destroy(),c=n(t,i||{}),f=c.header?document.querySelector(c.header):null,document.addEventListener("click",m,!1),c.updateURL&&c.popstate&&e.addEventListener("popstate",h,!1)}(),$}}(r)}.apply(t,[]))||(e.exports=o)}).call(this,n("yLpj"))},Dh2z:function(e,t,n){"use strict";n.d(t,"a",(function(){return L})),n.d(t,"b",(function(){return re})),n.d(t,"c",(function(){return U})),n.d(t,"d",(function(){return D})),n.d(t,"e",(function(){return S})),n.d(t,"f",(function(){return u})),n.d(t,"g",(function(){return ae}));let o,r,l=!1,s=!1;const a="undefined"!=typeof window?window:{},i=a.document||{head:{}},c={$flags$:0,$resourcesUrl$:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,o)=>e.addEventListener(t,n,o),rel:(e,t,n,o)=>e.removeEventListener(t,n,o),ce:(e,t)=>new CustomEvent(e,t)},u=e=>Promise.resolve(e),f=(()=>{try{return new CSSStyleSheet,"function"==typeof(new CSSStyleSheet).replaceSync}catch(e){}return!1})(),d=(e,t,n,o)=>{n&&n.map(n=>{let[o,r,l]=n;const s=m(e,o),a=$(t,l),i=h(o);c.ael(s,r,a,i),(t.$rmListeners$=t.$rmListeners$||[]).push(()=>c.rel(s,r,a,i))})},$=(e,t)=>n=>{try{256&e.$flags$?e.$lazyInstance$[t](n):(e.$queuedListeners$=e.$queuedListeners$||[]).push([t,n])}catch(o){ue(o)}},m=(e,t)=>4&t?i:e,h=e=>0!=(2&e),p="{visibility:hidden}.hydrated{visibility:inherit}",g="http://www.w3.org/1999/xlink",y=new WeakMap,v=e=>{const t=e.$cmpMeta$,n=e.$hostElement$,o=t.$flags$,r=(t.$tagName$,()=>{}),l=((e,t,n,o)=>{let r=b(t);const l=$e.get(r);if(e=11===e.nodeType?e:i,l)if("string"==typeof l){e=e.head||e;let t,n=y.get(e);n||y.set(e,n=new Set),n.has(r)||(t=i.createElement("style"),t.innerHTML=l,e.insertBefore(t,e.querySelector("link")),n&&n.add(r))}else e.adoptedStyleSheets.includes(l)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,l]);return r})(n.shadowRoot?n.shadowRoot:n.getRootNode(),t);10&o&&(n["s-sc"]=l,n.classList.add(l+"-h")),r()},b=(e,t)=>"sc-"+e.$tagName$,w={},E=e=>"object"===(e=typeof e)||"function"===e,S=function(e,t){let n=null,o=null,r=!1,l=!1;const s=[],a=t=>{for(let o=0;o<t.length;o++)n=t[o],Array.isArray(n)?a(n):null!=n&&"boolean"!=typeof n&&((r="function"!=typeof e&&!E(n))&&(n=String(n)),r&&l?s[s.length-1].$text$+=n:s.push(r?O(null,n):n),l=r)};for(var i=arguments.length,c=new Array(i>2?i-2:0),u=2;u<i;u++)c[u-2]=arguments[u];if(a(c),t){t.key&&(o=t.key);{const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter(t=>e[t]).join(" "))}}if("function"==typeof e)return e(null===t?{}:t,s,k);const f=O(e,null);return f.$attrs$=t,s.length>0&&(f.$children$=s),f.$key$=o,f},O=(e,t)=>{const n={$flags$:0,$tag$:e,$text$:t,$elm$:null,$children$:null,$attrs$:null,$key$:null};return n},L={},k={forEach:(e,t)=>e.map(N).forEach(t),map:(e,t)=>e.map(N).map(t).map(j)},N=e=>({vattrs:e.$attrs$,vchildren:e.$children$,vkey:e.$key$,vname:e.$name$,vtag:e.$tag$,vtext:e.$text$}),j=e=>{if("function"==typeof e.vtag){const t=Object.assign({},e.vattrs);return e.vkey&&(t.key=e.vkey),e.vname&&(t.name=e.vname),S(e.vtag,t,...e.vchildren||[])}const t=O(e.vtag,e.vtext);return t.$attrs$=e.vattrs,t.$children$=e.vchildren,t.$key$=e.vkey,t.$name$=e.vname,t},C=(e,t,n,o,r,l)=>{if(n!==o){let i=ce(e,t),u=t.toLowerCase();if("class"===t){const t=e.classList,r=M(n),l=M(o);t.remove(...r.filter(e=>e&&!l.includes(e))),t.add(...l.filter(e=>e&&!r.includes(e)))}else if("style"===t){for(const t in n)o&&null!=o[t]||(t.includes("-")?e.style.removeProperty(t):e.style[t]="");for(const t in o)n&&o[t]===n[t]||(t.includes("-")?e.style.setProperty(t,o[t]):e.style[t]=o[t])}else if("key"===t);else if("ref"===t)o&&o(e);else if(i||"o"!==t[0]||"n"!==t[1]){const a=E(o);if((i||a&&null!==o)&&!r)try{if(e.tagName.includes("-"))e[t]=o;else{const r=null==o?"":o;"list"===t?i=!1:null!=n&&e[t]==r||(e[t]=r)}}catch(s){}let c=!1;u!==(u=u.replace(/^xlink\:?/,""))&&(t=u,c=!0),null==o||!1===o?!1===o&&""!==e.getAttribute(t)||(c?e.removeAttributeNS(g,t):e.removeAttribute(t)):(!i||4&l||r)&&!a&&(o=!0===o?"":o,c?e.setAttributeNS(g,t,o):e.setAttribute(t,o))}else t="-"===t[2]?t.slice(3):ce(a,u)?u.slice(2):u[2]+t.slice(3),n&&c.rel(e,t,n,!1),o&&c.ael(e,t,o,!1)}},R=/\s/,M=e=>e?e.split(R):[],T=(e,t,n,o)=>{const r=11===t.$elm$.nodeType&&t.$elm$.host?t.$elm$.host:t.$elm$,l=e&&e.$attrs$||w,s=t.$attrs$||w;for(o in l)o in s||C(r,o,l[o],void 0,n,t.$flags$);for(o in s)C(r,o,l[o],s[o],n,t.$flags$)},x=(e,t,n,r)=>{const s=t.$children$[n];let a,c,u=0;if(null!==s.$text$)a=s.$elm$=i.createTextNode(s.$text$);else{if(l||(l="svg"===s.$tag$),a=s.$elm$=i.createElementNS(l?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml",s.$tag$),l&&"foreignObject"===s.$tag$&&(l=!1),T(null,s,l),null!=o&&a["s-si"]!==o&&a.classList.add(a["s-si"]=o),s.$children$)for(u=0;u<s.$children$.length;++u)c=x(e,s,u),c&&a.appendChild(c);"svg"===s.$tag$?l=!1:"foreignObject"===a.tagName&&(l=!0)}return a},I=(e,t,n,o,l,s)=>{let a,i=e;for(i.shadowRoot&&i.tagName===r&&(i=i.shadowRoot);l<=s;++l)o[l]&&(a=x(null,n,l),a&&(o[l].$elm$=a,i.insertBefore(a,t)))},P=(e,t,n,o,r)=>{for(;t<=n;++t)(o=e[t])&&(r=o.$elm$,_(o),r.remove())},A=(e,t)=>e.$tag$===t.$tag$&&e.$key$===t.$key$,q=(e,t)=>{const n=t.$elm$=e.$elm$,o=e.$children$,r=t.$children$,s=t.$tag$,a=t.$text$;null===a?(l="svg"===s||"foreignObject"!==s&&l,"slot"===s||T(e,t,l),null!==o&&null!==r?((e,t,n,o)=>{let r,l,s=0,a=0,i=0,c=0,u=t.length-1,f=t[0],d=t[u],$=o.length-1,m=o[0],h=o[$];for(;s<=u&&a<=$;)if(null==f)f=t[++s];else if(null==d)d=t[--u];else if(null==m)m=o[++a];else if(null==h)h=o[--$];else if(A(f,m))q(f,m),f=t[++s],m=o[++a];else if(A(d,h))q(d,h),d=t[--u],h=o[--$];else if(A(f,h))q(f,h),e.insertBefore(f.$elm$,d.$elm$.nextSibling),f=t[++s],h=o[--$];else if(A(d,m))q(d,m),e.insertBefore(d.$elm$,f.$elm$),d=t[--u],m=o[++a];else{for(i=-1,c=s;c<=u;++c)if(t[c]&&null!==t[c].$key$&&t[c].$key$===m.$key$){i=c;break}i>=0?(l=t[i],l.$tag$!==m.$tag$?r=x(t&&t[a],n,i):(q(l,m),t[i]=void 0,r=l.$elm$),m=o[++a]):(r=x(t&&t[a],n,a),m=o[++a]),r&&f.$elm$.parentNode.insertBefore(r,f.$elm$)}s>u?I(e,null==o[$+1]?null:o[$+1].$elm$,n,o,a,$):a>$&&P(t,s,u)})(n,o,t,r):null!==r?(null!==e.$text$&&(n.textContent=""),I(n,null,t,r,0,r.length-1)):null!==o&&P(o,0,o.length-1),l&&"svg"===s&&(l=!1)):e.$text$!==a&&(n.data=a)},_=e=>{e.$attrs$&&e.$attrs$.ref&&e.$attrs$.ref(null),e.$children$&&e.$children$.map(_)},H=(e,t)=>{const n=e.$hostElement$,l=e.$cmpMeta$,s=e.$vnode$||O(null,null),a=(i=t)&&i.$tag$===L?t:S(null,null,t);var i;r=n.tagName,l.$attrsToReflect$&&(a.$attrs$=a.$attrs$||{},l.$attrsToReflect$.map(e=>{let[t,o]=e;return a.$attrs$[o]=n[t]})),a.$tag$=null,a.$flags$|=4,e.$vnode$=a,a.$elm$=s.$elm$=n.shadowRoot||n,o=n["s-sc"],q(s,a)},D=e=>se(e).$hostElement$,U=(e,t,n)=>{const o=D(e);return{emit:e=>B(o,t,{bubbles:!!(4&n),composed:!!(2&n),cancelable:!!(1&n),detail:e})}},B=(e,t,n)=>{const o=c.ce(t,n);return e.dispatchEvent(o),o},Y=(e,t)=>{t&&!e.$onRenderResolve$&&t["s-p"]&&t["s-p"].push(new Promise(t=>e.$onRenderResolve$=t))},X=(e,t)=>{if(e.$flags$|=16,4&e.$flags$)return void(e.$flags$|=512);Y(e,e.$ancestorComponent$);return be(()=>z(e,t))},z=(e,t)=>{const n=(e.$cmpMeta$.$tagName$,()=>{}),o=e.$lazyInstance$;let r;return t&&(e.$flags$|=256,e.$queuedListeners$&&(e.$queuedListeners$.map(e=>{let[t,n]=e;return W(o,t,n)}),e.$queuedListeners$=null),r=W(o,"componentWillLoad")),n(),K(r,()=>F(e,o,t))},F=async(e,t,n)=>{const o=e.$hostElement$,r=(e.$cmpMeta$.$tagName$,()=>{}),l=o["s-rc"];n&&v(e);const s=(e.$cmpMeta$.$tagName$,()=>{});Q(e,t),l&&(l.map(e=>e()),o["s-rc"]=void 0),s(),r();{const t=o["s-p"],n=()=>V(e);0===t.length?n():(Promise.all(t).then(n),e.$flags$|=4,t.length=0)}},Q=(e,t,n)=>{try{t=t.render(),e.$flags$&=-17,e.$flags$|=2,H(e,t)}catch(o){ue(o,e.$hostElement$)}return null},V=e=>{e.$cmpMeta$.$tagName$;const t=e.$hostElement$,n=()=>{},o=e.$lazyInstance$,r=e.$ancestorComponent$;64&e.$flags$?(W(o,"componentDidUpdate"),n()):(e.$flags$|=64,Z(t),W(o,"componentDidLoad"),n(),e.$onReadyResolve$(t),r||J()),e.$onInstanceResolve$(t),e.$onRenderResolve$&&(e.$onRenderResolve$(),e.$onRenderResolve$=void 0),512&e.$flags$&&ve(()=>X(e,!1)),e.$flags$&=-517},J=e=>{Z(i.documentElement),ve(()=>B(a,"appload",{detail:{namespace:"deckdeckgo-highlight-code"}}))},W=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(o){ue(o)}},K=(e,t)=>e&&e.then?e.then(t):t(),Z=e=>e.classList.add("hydrated"),G=(e,t,n,o)=>{const r=se(e),l=r.$hostElement$,s=r.$instanceValues$.get(t),a=r.$flags$,i=r.$lazyInstance$;var c,u;c=n,u=o.$members$[t][0],n=null==c||E(c)?c:4&u?"false"!==c&&(""===c||!!c):1&u?String(c):c;const f=Number.isNaN(s)&&Number.isNaN(n);if((!(8&a)||void 0===s)&&(n!==s&&!f)&&(r.$instanceValues$.set(t,n),i)){if(o.$watchers$&&128&a){const e=o.$watchers$[t];e&&e.map(e=>{try{i[e](n,s,t)}catch(o){ue(o,l)}})}2==(18&a)&&X(r,!1)}},ee=(e,t,n)=>{if(t.$members$){e.watchers&&(t.$watchers$=e.watchers);const o=Object.entries(t.$members$),r=e.prototype;if(o.map(e=>{let[o,[l]]=e;31&l||2&n&&32&l?Object.defineProperty(r,o,{get(){return e=o,se(this).$instanceValues$.get(e);var e},set(e){G(this,o,e,t)},configurable:!0,enumerable:!0}):1&n&&64&l&&Object.defineProperty(r,o,{value(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];const r=se(this);return r.$onInstancePromise$.then(()=>r.$lazyInstance$[o](...t))}})}),1&n){const n=new Map;r.attributeChangedCallback=function(e,t,o){c.jmp(()=>{const t=n.get(e);if(this.hasOwnProperty(t))o=this[t],delete this[t];else if(r.hasOwnProperty(t)&&"number"==typeof this[t]&&this[t]==o)return;this[t]=(null!==o||"boolean"!=typeof this[t])&&o})},e.observedAttributes=o.filter(e=>{let[t,n]=e;return 15&n[0]}).map(e=>{let[o,r]=e;const l=r[1]||o;return n.set(l,o),512&r[0]&&t.$attrsToReflect$.push([o,l]),l})}}return e},te=async(e,t,n,o,r)=>{if(0==(32&t.$flags$)){{if(t.$flags$|=32,(r=de(n)).then){const e=()=>{};r=await r,e()}r.isProxied||(n.$watchers$=r.watchers,ee(r,n,2),r.isProxied=!0);const e=(n.$tagName$,()=>{});t.$flags$|=8;try{new r(t)}catch(a){ue(a)}t.$flags$&=-9,t.$flags$|=128,e()}if(r.style){let e=r.style;const t=b(n);if(!$e.has(t)){const o=(n.$tagName$,()=>{});((e,t,n)=>{let o=$e.get(e);f&&n?(o=o||new CSSStyleSheet,"string"==typeof o?o=t:o.replaceSync(t)):o=t,$e.set(e,o)})(t,e,!!(1&n.$flags$)),o()}}}const l=t.$ancestorComponent$,s=()=>X(t,!0);l&&l["s-rc"]?l["s-rc"].push(s):s()},ne=e=>{if(0==(1&c.$flags$)){const t=se(e),n=t.$cmpMeta$,o=(n.$tagName$,()=>{});if(1&t.$flags$)d(e,t,n.$listeners$);else{t.$flags$|=1;{let n=e;for(;n=n.parentNode||n.host;)if(n["s-p"]){Y(t,t.$ancestorComponent$=n);break}}n.$members$&&Object.entries(n.$members$).map(t=>{let[n,[o]]=t;if(31&o&&e.hasOwnProperty(n)){const t=e[n];delete e[n],e[n]=t}}),te(0,t,n)}o()}},oe=e=>{if(0==(1&c.$flags$)){const t=se(e);t.$rmListeners$&&(t.$rmListeners$.map(e=>e()),t.$rmListeners$=void 0)}},re=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=()=>{},o=[],r=t.exclude||[],l=a.customElements,s=i.head,u=s.querySelector("meta[charset]"),f=i.createElement("style"),d=[];let $,m=!0;Object.assign(c,t),c.$resourcesUrl$=new URL(t.resourcesUrl||"./",i.baseURI).href,e.map(e=>{e[1].map(t=>{const n={$flags$:t[0],$tagName$:t[1],$members$:t[2],$listeners$:t[3]};n.$members$=t[2],n.$listeners$=t[3],n.$attrsToReflect$=[],n.$watchers$={};const s=n.$tagName$,a=class extends HTMLElement{constructor(e){super(e),ie(e=this,n),1&n.$flags$&&e.attachShadow({mode:"open"})}connectedCallback(){$&&(clearTimeout($),$=null),m?d.push(this):c.jmp(()=>ne(this))}disconnectedCallback(){c.jmp(()=>oe(this))}componentOnReady(){return se(this).$onReadyPromise$}};n.$lazyBundleId$=e[0],r.includes(s)||l.get(s)||(o.push(s),l.define(s,ee(a,n,1)))})}),f.innerHTML=o+p,f.setAttribute("data-styles",""),s.insertBefore(f,u?u.nextSibling:s.firstChild),m=!1,d.length?d.map(e=>e.connectedCallback()):c.jmp(()=>$=setTimeout(J,30)),n()},le=new WeakMap,se=e=>le.get(e),ae=(e,t)=>le.set(t.$lazyInstance$=e,t),ie=(e,t)=>{const n={$flags$:0,$hostElement$:e,$cmpMeta$:t,$instanceValues$:new Map};return n.$onInstancePromise$=new Promise(e=>n.$onInstanceResolve$=e),n.$onReadyPromise$=new Promise(e=>n.$onReadyResolve$=e),e["s-p"]=[],e["s-rc"]=[],d(e,n,t.$listeners$),le.set(e,n)},ce=(e,t)=>t in e,ue=(e,t)=>(0,console.error)(e,t),fe=new Map,de=(e,t,o)=>{const r=e.$tagName$.replace(/-/g,"_"),l=e.$lazyBundleId$,s=fe.get(l);if(s)return s[r];if(!o||!BUILD.hotModuleReplacement){const e=e=>(fe.set(l,e),e[r]);switch(l){case"deckgo-highlight-code_2":return n.e(4).then(n.bind(null,"lFdl")).then(e,ue)}}return n("rHgL")(`./${l}.entry.js`).then(e=>(fe.set(l,e),e[r]),ue)},$e=new Map,me=[],he=[],pe=(e,t)=>n=>{e.push(n),s||(s=!0,t&&4&c.$flags$?ve(ye):c.raf(ye))},ge=e=>{for(let n=0;n<e.length;n++)try{e[n](performance.now())}catch(t){ue(t)}e.length=0},ye=()=>{ge(me),ge(he),(s=me.length>0)&&c.raf(ye)},ve=e=>u().then(e),be=pe(he,!0)},EXIE:function(e,t,n){"use strict";n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return u}));var o=n("1jzt"),r=n.n(o),l=n("dwco"),s=n.n(l);let a;function i(){return s.a.polyfill(),a=new r.a('a[href*="#"]',{speed:500,speedAsDuration:!0}),a}function c(){if(!a)throw Error("Not founded SmoothScroll instance");return a.destroy(),a=null,a}function u(e){if(!a)throw Error("Not founded SmoothScroll instance");return a.animateScroll(e),a}},RPjP:function(e,t,n){"use strict";e.exports=n("SLms")},SLms:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),l=a(n("q1tI")),s=a(n("17x9"));function a(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var u=["shortname","identifier","title","url","category_id","onNewComment","language"],f=!1;function d(e,t){var n=t.onNewComment,o=t.language,r=function(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}(t,["onNewComment","language"]);for(var l in r)e.page[l]=r[l];e.language=o,n&&(e.callbacks={onNewComment:[n]})}var $=function(e){function t(){return i(this,t),c(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){this.loadDisqus()}},{key:"componentDidUpdate",value:function(){this.loadDisqus()}},{key:"shouldComponentUpdate",value:function(e,t){return e.identifier!==this.props.identifier}},{key:"render",value:function(){var e=this,t=Object.keys(this.props).reduce((function(t,n){return u.some((function(e){return e===n}))?t:o({},t,function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({},n,e.props[n]))}),{});return l.default.createElement("div",t,l.default.createElement("div",{id:"disqus_thread"}))}},{key:"addDisqusScript",value:function(){if(!f){var e=this.disqus=document.createElement("script"),t=document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0];e.async=!0,e.type="text/javascript",e.src="//"+this.props.shortname+".disqus.com/embed.js",t.appendChild(e),f=!0}}},{key:"loadDisqus",value:function(){var e=this,t={};u.forEach((function(n){"shortname"!==n&&e.props[n]&&(t[n]=e.props[n])})),"undefined"!=typeof DISQUS?DISQUS.reset({reload:!0,config:function(){d(this,t),this.page.url=this.page.url.replace(/#/,"")+"#!newthread"}}):(window.disqus_config=function(){d(this,t)},this.addDisqusScript())}}]),t}(l.default.Component);$.displayName="DisqusThread",$.propTypes={id:s.default.string,shortname:s.default.string.isRequired,identifier:s.default.string,title:s.default.string,url:s.default.string,category_id:s.default.string,onNewComment:s.default.func,language:s.default.string},$.defaultProps={url:"undefined"==typeof window?null:window.location.href},t.default=$},TsVF:function(e,t,n){},dwco:function(e,t,n){!function(){"use strict";e.exports={polyfill:function(){var e=window,t=document;if(!("scrollBehavior"in t.documentElement.style)||!0===e.__forceSmoothScrollPolyfill__){var n,o=e.HTMLElement||e.Element,r={scroll:e.scroll||e.scrollTo,scrollBy:e.scrollBy,elementScroll:o.prototype.scroll||a,scrollIntoView:o.prototype.scrollIntoView},l=e.performance&&e.performance.now?e.performance.now.bind(e.performance):Date.now,s=(n=e.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(n)?1:0);e.scroll=e.scrollTo=function(){void 0!==arguments[0]&&(!0!==i(arguments[0])?m.call(e,t.body,void 0!==arguments[0].left?~~arguments[0].left:e.scrollX||e.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:e.scrollY||e.pageYOffset):r.scroll.call(e,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:e.scrollX||e.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:e.scrollY||e.pageYOffset))},e.scrollBy=function(){void 0!==arguments[0]&&(i(arguments[0])?r.scrollBy.call(e,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):m.call(e,t.body,~~arguments[0].left+(e.scrollX||e.pageXOffset),~~arguments[0].top+(e.scrollY||e.pageYOffset)))},o.prototype.scroll=o.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==i(arguments[0])){var e=arguments[0].left,t=arguments[0].top;m.call(this,this,void 0===e?this.scrollLeft:~~e,void 0===t?this.scrollTop:~~t)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value could not be converted");r.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!=typeof arguments[0]?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},o.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==i(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):r.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},o.prototype.scrollIntoView=function(){if(!0!==i(arguments[0])){var n=d(this),o=n.getBoundingClientRect(),l=this.getBoundingClientRect();n!==t.body?(m.call(this,n,n.scrollLeft+l.left-o.left,n.scrollTop+l.top-o.top),"fixed"!==e.getComputedStyle(n).position&&e.scrollBy({left:o.left,top:o.top,behavior:"smooth"})):e.scrollBy({left:l.left,top:l.top,behavior:"smooth"})}else r.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}function a(e,t){this.scrollLeft=e,this.scrollTop=t}function i(e){if(null===e||"object"!=typeof e||void 0===e.behavior||"auto"===e.behavior||"instant"===e.behavior)return!0;if("object"==typeof e&&"smooth"===e.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+e.behavior+" is not a valid value for enumeration ScrollBehavior.")}function c(e,t){return"Y"===t?e.clientHeight+s<e.scrollHeight:"X"===t?e.clientWidth+s<e.scrollWidth:void 0}function u(t,n){var o=e.getComputedStyle(t,null)["overflow"+n];return"auto"===o||"scroll"===o}function f(e){var t=c(e,"Y")&&u(e,"Y"),n=c(e,"X")&&u(e,"X");return t||n}function d(e){for(;e!==t.body&&!1===f(e);)e=e.parentNode||e.host;return e}function $(t){var n,o,r,s,a=(l()-t.startTime)/468;s=a=a>1?1:a,n=.5*(1-Math.cos(Math.PI*s)),o=t.startX+(t.x-t.startX)*n,r=t.startY+(t.y-t.startY)*n,t.method.call(t.scrollable,o,r),o===t.x&&r===t.y||e.requestAnimationFrame($.bind(e,t))}function m(n,o,s){var i,c,u,f,d=l();n===t.body?(i=e,c=e.scrollX||e.pageXOffset,u=e.scrollY||e.pageYOffset,f=r.scroll):(i=n,c=n.scrollLeft,u=n.scrollTop,f=a),$({scrollable:i,method:f,startTime:d,startX:c,startY:u,x:o,y:s})}}}}()},"n1n/":function(e,t,n){},rHgL:function(e,t,n){var o={"./deckgo-highlight-code_2.entry.js":["lFdl",4]};function r(e){if(!n.o(o,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=o[e],r=t[0];return n.e(t[1]).then((function(){return n(r)}))}r.keys=function(){return Object.keys(o)},r.id="rHgL",e.exports=r},vg9a:function(e,t,n){},yZlL:function(e,t,n){"use strict";n.r(t);var o=n("q1tI"),r=n.n(o);n("TsVF");var l=n("hpys"),s=n("CC2r");const a=e=>{let{title:t}=e;return r.a.createElement("h1",null,t)};n("1QcF");const i=e=>{let{date:t}=e;return r.a.createElement("p",{className:"post-date"},t)};var c=n("Dh2z");var u;!function(){if("undefined"!=typeof window&&void 0!==window.Reflect&&void 0!==window.customElements){var e=HTMLElement;window.HTMLElement=function(){return Reflect.construct(e,[],this.constructor)},HTMLElement.prototype=e.prototype,HTMLElement.prototype.constructor=HTMLElement,Object.setPrototypeOf(HTMLElement,e)}}(),"undefined"==typeof window?Promise.resolve():Object(c.f)().then(()=>Object(c.b)([["deckgo-highlight-code_2",[[1,"deckgo-highlight-code",{language:[513],highlightLines:[513,"highlight-lines"],lineNumbers:[516,"line-numbers"],terminal:[513],editable:[4],editableLabel:[1,"editable-label"],theme:[513],revealProgress:[1025,"reveal-progress"],themeStyle:[32],loaded:[32],highlightRows:[32],load:[64],reveal:[64],hide:[64],revealAll:[64],hideAll:[64],nextHighlight:[64],prevHighlight:[64]},[[5,"prismLanguageLoaded","onLanguageLoaded"],[5,"prismLanguageError","onLanguageError"]]],[1,"deckgo-highlight-code-edit",{label:[1]}]]]],u));const f=e=>{let{html:t}=e;return r.a.createElement("div",{className:"post-container",dangerouslySetInnerHTML:{__html:t}})};var d=n("Wbzz");n("n1n/");const $=e=>{let{pageContext:t}=e;const{previous:n,next:o}=t;return r.a.createElement("ul",{className:"navigator"},r.a.createElement("li",null,n&&r.a.createElement(d.Link,{to:n.fields.slug,rel:"prev"},"← ",n.frontmatter.title)),r.a.createElement("li",null,o&&r.a.createElement(d.Link,{to:o.fields.slug,rel:"next"},o.frontmatter.title," →")))};function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var h=n("dI71"),p=n("RPjP"),g=n.n(p);let y=function(e){function t(t){var n;return(n=e.call(this,t)||this).state={toasts:[]},n.notifyAboutComment=n.notifyAboutComment.bind(m(n)),n.onSnackbarDismiss=n.onSnackbarDismiss.bind(m(n)),n}Object(h.a)(t,e);var n=t.prototype;return n.onSnackbarDismiss=function(){const[,...e]=this.state.toasts;this.setState({toasts:e})},n.notifyAboutComment=function(){const e=this.state.toasts.slice();e.push({text:"New comment available!!"}),this.setState({toasts:e})},n.render=function(){const{post:e,shortName:t,siteUrl:n,slug:o}=this.props,l=n+o;return r.a.createElement(g.a,{shortname:t,identifier:e.frontmatter.title,title:e.frontmatter.title,url:l,category_id:e.frontmatter.category_id,onNewComment:this.notifyAboutComment})},t}(o.Component);var v=n("JqEL"),b=n("WlAH");const w=e=>{let{repo:t}=e;const n=r.a.createRef();return Object(o.useEffect)(()=>{const e=v.f(b.d.DARK),o=document.createElement("script"),r={src:"https://utteranc.es/client.js",repo:t,branch:"master",theme:e?"photon-dark":"github-light",label:"comment",async:!0,"issue-term":"pathname",crossorigin:"anonymous"};Object.keys(r).forEach(e=>{o.setAttribute(e,r[e])}),n.current.appendChild(o)},[]),r.a.createElement("div",{className:"utterances",ref:n})};var E=n("EXIE");n("vg9a"),t.default=e=>{let{data:t,pageContext:n,location:c}=e;Object(o.useEffect)(()=>(E.c(),()=>E.a()),[]);const u=t.markdownRemark,d=t.site.siteMetadata,{title:m,comment:h,siteUrl:p,author:g,sponsor:v}=d,{disqusShortName:b,utterances:S}=h,{title:O,date:L,description:k}=u.frontmatter;return r.a.createElement(l.a,{location:c,title:m},r.a.createElement(s.a,{title:O,description:k,thumbnail:d.thumbnail}),r.a.createElement(a,{title:O}),r.a.createElement(i,{date:L}),r.a.createElement(f,{html:u.html}),r.a.createElement($,{pageContext:n}),!!b&&r.a.createElement(y,{post:u,shortName:b,siteUrl:p,slug:n.slug}),!!S&&r.a.createElement(w,{repo:S}))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-559d23bdd86fe9a4e1f1.js.map