import"/extension/js/modules/dom.js";var SlidePanels=globalThis.SlidePanels=class extends HTMLElement{static get observedAttributes(){return["open"]}constructor(){super(),this.addEventListener("pointerup",(e=>{e.target===this&&this.close()})),this.addEventListener("transitionend",(e=>{e.target.parentElement===this&&"opacity"===e.propertyName&&DOM.fireEvent(this,this.id===this.active?"panelopened":"panelclosed")}))}get active(){return this.getAttribute("open")}toggle(e){this.active===e?this.close():this.open(e)}open(e){this.setAttribute("open",e)}close(){this.removeAttribute("open")}attributeChangedCallback(e,t,i){if("open"===e)for(let e of this.children)e.id===i?(DOM.fireEvent(e,"panelopen"),e.setAttribute("open","")):e.hasAttribute("open")&&(DOM.fireEvent(e,"panelclose"),e.removeAttribute("open",""))}};customElements.define("slide-panels",SlidePanels);export{SlidePanels};
import"/extension/js/modules/dom.js";var TabPanels=globalThis.TabPanels=class extends HTMLElement{constructor(){super(),DOM.delegateEvent("click","tab-panels > nav > *",((e,t)=>{let l=t.parentElement;l.parentElement===this&&this.setAttribute("selected-index",Array.prototype.indexOf.call(l.children,t))}),{container:this,passive:!0})}static get observedAttributes(){return["selected-index"]}attributeChangedCallback(e,t,l){DOM.ready.then((()=>{if("selected-index"===e){let e=l||0,t=this.querySelector("nav");if(t.parentElement===this){let l=t.children,s=l[e];for(let e of l)e.removeAttribute("selected");s&&s.setAttribute("selected","");let a=Array.prototype.filter.call(this.children,(e=>{if("SECTION"===e.tagName)return e.removeAttribute("selected"),!0}))[e];a&&a.setAttribute("selected",""),DOM.fireEvent(this,"tabselected",{detail:{index:e,tab:s,panel:a}})}}}))}};customElements.define("tab-panels",TabPanels);export{TabPanels};
import{DOM}from"/extension/js/modules/dom.js";import{DID}from"/extension/js/modules/did.js";import{Storage}from"/extension/js/modules/storage.js";class RenderList extends HTMLElement{constructor(t={}){super(),DOM.setOptions(this,t),this.storageBucket=t.storageBucket,t.autoload&&this.load()}async renderItem(t,e={}){let s=document.createElement("li");return s.innerHTML=t,s}async renderItems(t,e={}){let s=document.createDocumentFragment();return Promise.all(t.map((t=>this.renderItem(t,e)))).then((t=>t.reduce(((t,e)=>(t.appendChild(e),t)),s)))}async renderList(t={}){let e=document.createElement("ul");return e.setAttribute("render-list-container",""),e.appendChild(await this.renderItems(this.items,t)),e}async load(t={}){let e=t.data&&"string"!=typeof t.data?t.data:await Storage.getAll(t.data||this.storageBucket);if(!e)return void this.setAttribute("empty","");this.items=Array.isArray(e)?e:Object.values(e);let s=this.querySelector("[render-list-container]"),r=await this.renderList(t);this.items.length?this.removeAttribute("empty"):this.setAttribute("empty",""),s?s.replaceWith(r):this.prepend(r)}async add(t){let e=Array.isArray(t)?t:arguments.length?Array.from(arguments):[t];this.items=(this.items||[]).concat(e);let s=this.querySelector("[render-list-container]");this.items.length?this.removeAttribute("empty"):this.setAttribute("empty",""),s?s.appendChild(await this.renderItems(e,{state:"add"})):this.prepend(await this.renderList())}}class PersonaList extends RenderList{constructor(t={}){t.storageBucket="dids",super(t)}async load(t={}){return t.data=await DID.getPersonas(),super.load(t)}async renderList(t={}){let e=await super.renderList(t);return e.setAttribute("list","block"),e}async renderItem(t,e={}){let s=document.createElement("li");return s.setAttribute("persona-id",t.id),s.setAttribute("persona-name",t.persona),s.innerHTML=`<i class="${t.icon}"></i><h3>${t.persona}</h3>`,s}}customElements.define("persona-list",PersonaList);class ConnectionList extends RenderList{constructor(t={}){t.storageBucket="connections",super(t)}async renderList(){let t=document.createElement("table");return t.setAttribute("render-list-container",""),t.innerHTML="<thead>\n                               <tr>\n                                 <th>Connection</th><th>DID</th>\n                               </tr>\n                             </thead>\n                             <tbody></tbody>",t.lastElementChild.appendChild(await this.renderItems(this.items)),t}async renderItem(t,e={}){let s=document.createElement("tr");return s.setAttribute("connection-id",t.id),e.state&&s.setAttribute("connection-state",e.state),s.innerHTML=`<td>${t.id}</td><td>${t.did||""}</td>`,s}}customElements.define("connection-list",ConnectionList);class AppList extends RenderList{constructor(t={}){t.storageBucket="apps",super(t)}}customElements.define("app-list",AppList);export{RenderList,PersonaList,ConnectionList};
import"/extension/js/modules/dom.js";var ModalOverlay=globalThis.ModalOverlay=class extends HTMLElement{static get observedAttributes(){return["open"]}constructor(){super(),this.addEventListener("pointerup",(e=>{(e.target===this||e.target.hasAttribute("modal-close"))&&this.close()})),this.addEventListener("transitionend",(e=>{e.target===this&&"opacity"===e.propertyName&&DOM.fireEvent(this,this.isOpen?"modalopened":"modalclosed")}))}get isOpen(){return this.hasAttribute("open")}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}attributeChangedCallback(e,t,o){if("open"===e)DOM.ready.then((e=>{DOM.fireEvent(this,null!==o?"modalopen":"modalclose")}))}};customElements.define("modal-overlay",ModalOverlay);export{ModalOverlay};
import"/extension/js/modules/dom.js";var DetailBox=globalThis.DetailBox=class extends HTMLElement{static get observedAttributes(){return["open"]}constructor(){super(),this.addEventListener("pointerup",(t=>{t.target.hasAttribute("detail-box-toggle")&&(t.stopPropagation(),this.toggle())})),this.addEventListener("transitionend",(t=>{let e=t.target;e.parentElement===this&&"SECTION"===e.tagName&&"height"===t.propertyName&&(e.style.height=this.hasAttribute("open")?"auto":null)}))}open(){this.setAttribute("open","")}close(){this.removeAttribute("open")}toggle(){this.toggleAttribute("open")}attributeChangedCallback(t,e,i){if("open"===t)DOM.ready.then((t=>{for(let t of this.children)if("SECTION"===t.tagName){if(null!==i)t.offsetHeight<t.scrollHeight&&(t.style.height=t.scrollHeight+"px",DOM.fireEvent(this,"detailboxtoggle",{detail:{open:!0}}));else if(t.offsetHeight>0){t.style.height=t.offsetHeight+"px";this.scrollHeight;t.style.height=0,DOM.fireEvent(this,"detailboxtoggle",{detail:{open:!1}})}break}}))}};customElements.define("detail-box",DetailBox);export{DetailBox};
import"/extension/js/modules/dom.js";var NoticeBar=globalThis.NoticeBar=class extends HTMLElement{static get observedAttributes(){return["open"]}constructor(t={}){super(),this.options=t,this.addEventListener("transitionend",(t=>{if(t.target===this&&"transform"===t.propertyName){let t="show"===this.getAttribute("notice-state");t?this.setAttribute("notice-state","hide"):!this.options.retain&&this.parentElement&&this.parentElement.removeChild(this),DOM.fireEvent(this,t?"noticeshow":"noticehide")}})),this.addEventListener("pointerenter",(t=>this.setAttribute("notice-interaction","")))}render(t){this.setAttribute("notice-type",t.type||"default"),this.innerHTML=`<header>${t.title||""}</header>\n                      <section>${t.body||""}</section>\n                      <footer>${t.footer||""}</footer>`,(t.container||document.body||document.documentElement).appendChild(this)}notify(t){this.options=t||this.options,this.render(this.options),DOM.skipAnimationFrame((()=>this.setAttribute("notice-state","show")))}};customElements.define("notice-bar",NoticeBar);export{NoticeBar};