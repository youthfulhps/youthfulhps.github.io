(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"7tbW":function(e,t,r){var n=r("LGYb");e.exports=function(e){return e&&e.length?n(e):[]}},"8jRI":function(e,t,r){"use strict";var n=new RegExp("%[a-f0-9]{2}","gi"),o=new RegExp("(%[a-f0-9]{2})+","gi");function a(e,t){try{return decodeURIComponent(e.join(""))}catch(o){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],a(r),a(n))}function c(e){try{return decodeURIComponent(e)}catch(o){for(var t=e.match(n),r=1;r<t.length;r++)t=(e=a(t,r).join("")).match(n);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var r={"%FE%FF":"��","%FF%FE":"��"},n=o.exec(e);n;){try{r[n[0]]=decodeURIComponent(n[0])}catch(t){var a=c(n[0]);a!==n[0]&&(r[n[0]]=a)}n=o.exec(e)}r["%C2"]="�";for(var i=Object.keys(r),u=0;u<i.length;u++){var s=i[u];e=e.replace(new RegExp(s,"g"),r[s])}return e}(e)}}},"8yz6":function(e,t,r){"use strict";e.exports=function(e,t){if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];var r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}},Bnag:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},EbDI:function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},Ijbi:function(e,t,r){var n=r("WkPL");e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},J4zp:function(e,t,r){var n=r("wTVA"),o=r("m0LI"),a=r("ZhPi"),c=r("wkBT");e.exports=function(e,t){return n(e)||o(e,t)||a(e,t)||c()},e.exports.__esModule=!0,e.exports.default=e.exports},LGYb:function(e,t,r){var n=r("1hJj"),o=r("jbM+"),a=r("Xt/L"),c=r("xYSL"),i=r("dQpi"),u=r("rEGp");e.exports=function(e,t,r){var s=-1,l=o,f=e.length,p=!0,d=[],y=d;if(r)p=!1,l=a;else if(f>=200){var m=t?null:i(e);if(m)return u(m);p=!1,l=c,y=new n}else y=t?[]:d;e:for(;++s<f;){var g=e[s],v=t?t(g):g;if(g=r||0!==g?g:0,p&&v==v){for(var b=y.length;b--;)if(y[b]===v)continue e;t&&y.push(v),d.push(g)}else l(y,v,r)||(y!==d&&y.push(v),d.push(g))}return d}},O92f:function(e,t,r){},Pmem:function(e,t,r){"use strict";e.exports=function(e){return encodeURIComponent(e).replace(/[!'()*]/g,(function(e){return"%".concat(e.charCodeAt(0).toString(16).toUpperCase())}))}},RIqP:function(e,t,r){var n=r("Ijbi"),o=r("EbDI"),a=r("ZhPi"),c=r("Bnag");e.exports=function(e){return n(e)||o(e)||a(e)||c()},e.exports.__esModule=!0,e.exports.default=e.exports},RXBc:function(e,t,r){"use strict";r.r(t);var n,o=r("7tbW"),a=r.n(o),c=r("q1tI"),i=r.n(c),u=r("lbRd"),s=r("p3AD"),l=(r("O92f"),function(e){var t=e.title,r=e.selectedCategory,n=e.onClick,o=e.scrollToCenter,a=Object(c.useRef)(null),u=Object(c.useCallback)((function(){o(a),n(t)}),[a]);return Object(c.useEffect)((function(){r===t&&o(a)}),[r,a]),i.a.createElement("li",{ref:a,className:"item",role:"tab","aria-selected":r===t?"true":"false"},i.a.createElement("div",{onClick:u},t))}),f=function(e){var t=e.categories,r=e.category,n=e.selectCategory,o=Object(c.useRef)(null),a=Object(c.useCallback)((function(e){var t=e.current.offsetWidth,r=o.current,n=r.scrollLeft,a=r.offsetWidth,c=n+(e.current.getBoundingClientRect().left-o.current.getBoundingClientRect().left)-a/2+t/2;o.current.scroll({left:c,top:0,behavior:"smooth"})}),[o]);return i.a.createElement("ul",{ref:o,className:"category-container",role:"tablist",id:"category",style:{margin:"0 -"+Object(s.a)(3/4)}},i.a.createElement(l,{title:"All",selectedCategory:r,onClick:n,scrollToCenter:a}),t.map((function(e,t){return i.a.createElement(l,{key:t,title:e,selectedCategory:r,onClick:n,scrollToCenter:a})})))},p=(r("lEUh"),function(e){var t=e.title,r=e.selectedCategory,n=e.onClick,o=e.scrollToCenter,a=Object(c.useRef)(null),u=Object(c.useCallback)((function(){o(a),n(t)}),[a]);return Object(c.useEffect)((function(){r===t&&o(a)}),[r,a]),i.a.createElement("li",{ref:a,className:"item",role:"tab","aria-selected":r===t?"true":"false"},i.a.createElement("div",{onClick:u},t))}),d=function(e){var t=e.categories,r=e.category,n=e.selectCategory,o=Object(c.useRef)(null),a=Object(c.useCallback)((function(e){var t=e.current.offsetWidth,r=o.current,n=r.scrollLeft,a=r.offsetWidth,c=n+(e.current.getBoundingClientRect().left-o.current.getBoundingClientRect().left)-a/2+t/2;o.current.scroll({left:c,top:0,behavior:"smooth"})}),[o]);return i.a.createElement("ul",{ref:o,className:"category-container",role:"tablist",id:"category",style:{margin:"0 -"+Object(s.a)(3/4)}},i.a.createElement(p,{title:"All",selectedCategory:r,onClick:n,scrollToCenter:a}),t.map((function(e,t){return i.a.createElement(p,{key:t,title:e,selectedCategory:r,onClick:n,scrollToCenter:a})})))},y=(r("Z/JJ"),i.a.memo((function(e){var t=e.children;return i.a.createElement("div",{className:"thumbnail-container"},t)}))),m=r("Wbzz"),g=r("JqEL");function v(e){return e.filter((function(e){return e.isIntersecting})).forEach((function(e){var t=e.target;return g.a(t,"visible")}))}function b(){return g.e(".observed").forEach((function(e){return n.observe(e)}))}function h(){if(!n)throw Error("Not found IntersectionObserver instance");return Promise.resolve(n.disconnect())}r("aGs0");var j,w=function(e){var t=e.node;return i.a.createElement(m.Link,{className:"thumbnail observed",to:t.fields.slug},i.a.createElement("div",{key:t.fields.slug},i.a.createElement("h3",null,t.frontmatter.title||t.fields.slug),i.a.createElement("p",{dangerouslySetInnerHTML:{__html:t.frontmatter.description||t.excerpt}})))},x=r("WlAH"),E=function(e){var t=e.posts,r=e.countOfInitialPost,n=e.count,o=e.category,a=e.typeCategory,u=Object(c.useMemo)((function(){return t.filter((function(e){var t=e.node;return o===x.a.ALL||t.frontmatter.category===o})).filter((function(e){var t,r=e.node;return a===x.a.ALL||(null!==(t=r.frontmatter.type)&&void 0!==t?t:"BLOG")===a})).slice(0,n*r)}));return i.a.createElement(y,null,u.map((function(e,t){var r=e.node;return i.a.createElement(w,{node:r,key:"item_"+t})})))},O=r("CC2r"),C=r("cr+I"),k=r.n(C),I=r("EXIE");function A(e){var t=Object(c.useState)(x.a.ALL),r=t[0],n=t[1],o=Object(c.useState)(x.a.ALL),a=o[0],i=o[1];j=e;var u=function(){window.scrollY>j&&I.b(j)},s=Object(c.useCallback)((function(e){n(e),u(),window.history.pushState({category:e,typeCategory:a},"",window.location.pathname+"?"+k.a.stringify({category:e,typeCategory:a}))}),[]),l=Object(c.useCallback)((function(e){i(e),u(),window.history.pushState({category:e,typeCategory:a},"",window.location.pathname+"?"+k.a.stringify({category:e,typeCategory:a}))}),[]),f=Object(c.useCallback)((function(e){void 0===e&&(e=!0);var t=k.a.parse(location.search).category,r=null==t?x.a.ALL:t;n(r),e&&u()}),[]),p=Object(c.useCallback)((function(e){void 0===e&&(e=!0);var t=k.a.parse(location.search).typeCategory,r=null==t?x.a.ALL:t;i(r),e&&u()}),[]);return Object(c.useEffect)((function(){return I.c(),function(){I.a()}}),[]),Object(c.useEffect)((function(){return window.addEventListener("popstate",f),window.addEventListener("popstate",p),function(){window.removeEventListener("popstate",f),window.removeEventListener("popstate",p)}}),[]),Object(c.useEffect)((function(){f(!1),p(!1)}),[]),[r,s,a,l]}function L(){Object(c.useEffect)((function(){return n=new IntersectionObserver(v,{root:g.d("#___gatsby"),rootMargin:"20px",threshold:.8}),b(),function(){h(),n=null}}),[]),Object(c.useEffect)((function(){h().then(b)}))}var S=r("2w9V");var R=r("hpys");r("pxef");t.default=function(e){var t,r=e.data,n=e.location,o=r.site.siteMetadata,s=o.configs.countOfInitialPost,l=r.allMarkdownRemark.edges,p=Object(c.useMemo)((function(){return a()(l.map((function(e){return e.node.frontmatter.category})))}),[]),y=Object.keys(x.e),m=Object(c.useRef)(null),v=Object(c.useState)(316),b=v[0],h=v[1],j=function(){var e=S.a(1),t=Object(c.useState)(e),r=t[0],n=t[1],o=Object(c.useRef)(r);return Object(c.useEffect)((function(){o.current=r,S.b(r)}),[r]),[r,o,function(){return n((function(e){return e+1}))}]}(),w=j[0],C=j[1],k=j[2],I=A(b),_=I[0],F=I[1],N=I[2],M=I[3];return Object(c.useEffect)((function(e){h(m.current?m.current.getBoundingClientRect().bottom+window.pageYOffset+24:316)}),[m.current]),L(),t=function(){var e=window.scrollY+window.innerHeight,t=function(){return function(e){return g.c()-e}(e)<80};return function(e,t){var r=t.dismissCondition,n=void 0===r?function(){return!1}:r,o=t.triggerCondition,a=void 0===o?function(){return!0}:o;if(!e)throw Error("Invalid required arguments");var c=!1;return function(){if(!c)return c=!0,requestAnimationFrame((function(){if(!n())return a()?(c=!1,e()):void 0;c=!1}))}}(k,{dismissCondition:function(){return!t()},triggerCondition:function(){return t()&&l.length>C.current*s}})()},Object(c.useEffect)((function(){return window.addEventListener("scroll",t,{passive:!1}),function(){window.removeEventListener("scroll",t,{passive:!1})}}),[]),i.a.createElement(R.a,{location:n,title:o.title},i.a.createElement(O.a,{title:x.c,keywords:o.keywords}),i.a.createElement(u.a,{ref:m}),i.a.createElement("div",{className:"category-wrapper"},i.a.createElement(d,{categories:y,category:N,selectCategory:M}),i.a.createElement(f,{categories:p,category:_,selectCategory:F})),i.a.createElement(E,{posts:l,countOfInitialPost:s,count:w,category:_,typeCategory:N}))}},WkPL:function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},"Xt/L":function(e,t){e.exports=function(e,t,r){for(var n=-1,o=null==e?0:e.length;++n<o;)if(r(t,e[n]))return!0;return!1}},"Z/JJ":function(e,t,r){},ZhPi:function(e,t,r){var n=r("WkPL");e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports},aGs0:function(e,t,r){},c0go:function(e,t,r){"use strict";e.exports=function(e,t){for(var r={},n=Object.keys(e),o=Array.isArray(t),a=0;a<n.length;a++){var c=n[a],i=e[c];(o?-1!==t.indexOf(c):t(c,i,e))&&(r[c]=i)}return r}},"cr+I":function(e,t,r){"use strict";var n=r("J4zp"),o=r("RIqP");function a(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return c(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return c(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return i=e.done,e},e:function(e){u=!0,a=e},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw a}}}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}r("ToJy"),r("E9XD");var i=r("Pmem"),u=r("8jRI"),s=r("8yz6"),l=r("c0go");function f(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function p(e,t){return t.encode?t.strict?i(e):encodeURIComponent(e):e}function d(e,t){return t.decode?u(e):e}function y(e){var t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function m(e){var t=(e=y(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function g(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function v(e,t){f((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);var r=function(e){var t;switch(e.arrayFormat){case"index":return function(e,r,n){t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return function(e,r,n){t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return function(t,r,n){var o="string"==typeof r&&r.includes(e.arrayFormatSeparator),a="string"==typeof r&&!o&&d(r,e).includes(e.arrayFormatSeparator);r=a?d(r,e):r;var c=o||a?r.split(e.arrayFormatSeparator).map((function(t){return d(t,e)})):null===r?r:d(r,e);n[t]=c};default:return function(e,t,r){void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),o=Object.create(null);if("string"!=typeof e)return o;if(!(e=e.trim().replace(/^[?#&]/,"")))return o;var c,i=a(e.split("&"));try{for(i.s();!(c=i.n()).done;){var u=c.value;if(""!==u){var l=s(t.decode?u.replace(/\+/g," "):u,"="),p=n(l,2),y=p[0],m=p[1];m=void 0===m?null:["comma","separator"].includes(t.arrayFormat)?m:d(m,t),r(d(y,t),m,o)}}}catch(O){i.e(O)}finally{i.f()}for(var v=0,b=Object.keys(o);v<b.length;v++){var h=b[v],j=o[h];if("object"==typeof j&&null!==j)for(var w=0,x=Object.keys(j);w<x.length;w++){var E=x[w];j[E]=g(j[E],t)}else o[h]=g(j,t)}return!1===t.sort?o:(!0===t.sort?Object.keys(o).sort():Object.keys(o).sort(t.sort)).reduce((function(e,t){var r=o[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((function(e,t){return Number(e)-Number(t)})).map((function(e){return t[e]})):t}(r):e[t]=r,e}),Object.create(null))}t.extract=m,t.parse=v,t.stringify=function(e,t){if(!e)return"";f((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);for(var r=function(r){return t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r]},n=function(e){switch(e.arrayFormat){case"index":return function(t){return function(r,n){var a=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:[].concat(o(r),null===n?[[p(t,e),"[",a,"]"].join("")]:[[p(t,e),"[",p(a,e),"]=",p(n,e)].join("")])}};case"bracket":return function(t){return function(r,n){return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:[].concat(o(r),null===n?[[p(t,e),"[]"].join("")]:[[p(t,e),"[]=",p(n,e)].join("")])}};case"comma":case"separator":return function(t){return function(r,n){return null==n||0===n.length?r:0===r.length?[[p(t,e),"=",p(n,e)].join("")]:[[r,p(n,e)].join(e.arrayFormatSeparator)]}};default:return function(t){return function(r,n){return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:[].concat(o(r),null===n?[p(t,e)]:[[p(t,e),"=",p(n,e)].join("")])}}}}(t),a={},c=0,i=Object.keys(e);c<i.length;c++){var u=i[c];r(u)||(a[u]=e[u])}var s=Object.keys(a);return!1!==t.sort&&s.sort(t.sort),s.map((function(r){var o=e[r];return void 0===o?"":null===o?p(r,t):Array.isArray(o)?o.reduce(n(r),[]).join("&"):p(r,t)+"="+p(o,t)})).filter((function(e){return e.length>0})).join("&")},t.parseUrl=function(e,t){t=Object.assign({decode:!0},t);var r=s(e,"#"),o=n(r,2),a=o[0],c=o[1];return Object.assign({url:a.split("?")[0]||"",query:v(m(e),t)},t&&t.parseFragmentIdentifier&&c?{fragmentIdentifier:d(c,t)}:{})},t.stringifyUrl=function(e,r){r=Object.assign({encode:!0,strict:!0},r);var n=y(e.url).split("?")[0]||"",o=t.extract(e.url),a=t.parse(o,{sort:!1}),c=Object.assign(a,e.query),i=t.stringify(c,r);i&&(i="?".concat(i));var u=function(e){var t="",r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);return e.fragmentIdentifier&&(u="#".concat(p(e.fragmentIdentifier,r))),"".concat(n).concat(i).concat(u)},t.pick=function(e,r,n){n=Object.assign({parseFragmentIdentifier:!0},n);var o=t.parseUrl(e,n),a=o.url,c=o.query,i=o.fragmentIdentifier;return t.stringifyUrl({url:a,query:l(c,r),fragmentIdentifier:i},n)},t.exclude=function(e,r,n){var o=Array.isArray(r)?function(e){return!r.includes(e)}:function(e,t){return!r(e,t)};return t.pick(e,o,n)}},dQpi:function(e,t,r){var n=r("yGk4"),o=r("vN+2"),a=r("rEGp"),c=n&&1/a(new n([,-0]))[1]==1/0?function(e){return new n(e)}:o;e.exports=c},lEUh:function(e,t,r){},m0LI:function(e,t){e.exports=function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a=[],c=!0,i=!1;try{for(r=r.call(e);!(c=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);c=!0);}catch(u){i=!0,o=u}finally{try{c||null==r.return||r.return()}finally{if(i)throw o}}return a}},e.exports.__esModule=!0,e.exports.default=e.exports},pxef:function(e,t,r){},wTVA:function(e,t){e.exports=function(e){if(Array.isArray(e))return e},e.exports.__esModule=!0,e.exports.default=e.exports},wkBT:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=component---src-pages-index-js-a08c49d4fa876cfd3868.js.map