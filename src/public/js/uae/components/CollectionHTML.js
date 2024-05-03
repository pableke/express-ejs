
import coll from "./Collection.js";
import i18n from "../i18n/langs.js";

const STATUS = {};
const HIDE_CLASS = "hide";
const FADE_IN = "fadeIn";
const FADE_OUT = "fadeOut";
const SLIDE_IN = "slideIn";
const SLIDE_OUT = "slideOut";

const fnHide = el => el.classList.add(HIDE_CLASS);
const fnShow = el => el.classList.remove(HIDE_CLASS);
const fnVisible = el => (el.offsetWidth || el.offsetHeight || el.getClientRects().length);

// Extends HTMLCollection prototype
HTMLCollection.prototype.find = Array.prototype.find;
HTMLCollection.prototype.filter = Array.prototype.filter;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.eachPrev = Array.prototype.eachPrev;
HTMLCollection.prototype.findIndex = Array.prototype.findIndex;
HTMLCollection.prototype.findOne = function(selector) { return this.find(el => el.matches(selector)); }
HTMLCollection.prototype.query = function(selector) { return this.filter(el => el.matches(selector)); }
HTMLCollection.prototype.text = function(text) { this.forEach(el => { el.innerHTML = text; }); }
HTMLCollection.prototype.setClick = function(fn) { this.forEach(el => el.setClick(fn)); };
HTMLCollection.prototype.render = function(data) { this.forEach((el, i) => el.render(data, i, this.length)); }
HTMLCollection.prototype.mask = function(flags) { this.forEach((el, i) => el.toggle(HIDE_CLASS, (flags >> i) & 1)); }
HTMLCollection.prototype.hide = function() { this.forEach(fnHide); }
HTMLCollection.prototype.show = function() { this.forEach(fnShow); }
HTMLCollection.prototype.toggle = function(name, force) {
    name = name || HIDE_CLASS;
    this.forEach(el => el.classList.toggle(name, force));
}

// Extends NodeList prototype
NodeList.prototype.find = Array.prototype.find;
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.eachPrev = Array.prototype.eachPrev;
NodeList.prototype.findOne = HTMLCollection.prototype.findOne;
NodeList.prototype.query = HTMLCollection.prototype.query;
NodeList.prototype.text = HTMLCollection.prototype.text;
NodeList.prototype.setClick = HTMLCollection.prototype.setClick;
NodeList.prototype.render = HTMLCollection.prototype.render;
NodeList.prototype.mask = HTMLCollection.prototype.mask;
NodeList.prototype.hide = HTMLCollection.prototype.hide;
NodeList.prototype.show = HTMLCollection.prototype.show;
NodeList.prototype.toggle = HTMLCollection.prototype.toggle;

// Extends HTMLElement prototype
HTMLElement.prototype.setMsg = function(msg) { this.innerHTML = i18n.get(msg); return this }
HTMLElement.prototype.show = function() { fnShow(this); return this }
HTMLElement.prototype.hide = function() { fnHide(this); return this }
HTMLElement.prototype.toggle = function(name, force) { this.classList.toggle(name || HIDE_CLASS, force); }
//HTMLElement.prototype.trigger = function(name, detail) { this.dispatchEvent(detail ? new CustomEvent(name, { detail }) : new Event(name)); } //ev.detail
HTMLElement.prototype.setClick = function(fn) { this.addEventListener("click", ev => fn(ev, this)); return this; }
HTMLElement.prototype.setVisible = function(force) { return force ? this.show() : this.hide(); }
HTMLElement.prototype.isHidden = function() { return this.classList.contains(HIDE_CLASS); } // has class hide
HTMLElement.prototype.isVisible = function(selector) {
    return fnVisible(this) && (selector ? this.matches(selector) : true);
}
HTMLElement.prototype.render = function(data, i, size) {
    i = i || 0;
    STATUS.index = i;
    STATUS.count = i + 1;
    STATUS.size = size || 1;
    const fnReplace = (m, k) => (data[k] ?? STATUS[k] ?? ""); // remplace function
    this.dataset.template = this.dataset.template || this.innerHTML; // save current template
    this.innerHTML = this.dataset.template.replace(/@(\w+);/g, fnReplace); // display new data
    return this;
}

HTMLElement.prototype.setDisabled = function(force) { // Update attribute and style
    this.classList.toggle("disabled", this.toggleAttribute("disabled", force));
    return this;
}
HTMLElement.prototype.setReadonly = function(force) { // Update attribute and style
    // The attribute readonly is not supported or relevant to <select> or input types file, checkbox, radio, range...
    if ([ "file", "checkbox", "radio", "range" ].includes(this.type))
        return this.setDisabled(force); // Force disabled attribute
    this.classList.toggle("readonly", this.toggleAttribute("readonly", force));
    return this;
}

function fnAnimate(el, addName, removeName) {
    el.classList.remove(HIDE_CLASS, removeName);
    el.classList.add(addName);
    return el;
}
HTMLElement.prototype.fadeIn = function() { return fnAnimate(this, FADE_IN, FADE_OUT); }
HTMLElement.prototype.fadeOut = function() { return fnVisible(this) ? fnAnimate(this, FADE_OUT, FADE_IN) : this; }
HTMLElement.prototype.slideIn = function() { return fnAnimate(this, SLIDE_IN, SLIDE_OUT); }
HTMLElement.prototype.slideOut = function() { return fnVisible(this) ? fnAnimate(this, SLIDE_OUT, SLIDE_IN) : this; }
//HTMLElement.prototype.slideInRight = function() { return fnAnimate(this, SLIDE_IN_RIGHT, SLIDE_OUT_RIGHT); }
//HTMLElement.prototype.slideOutRight = function() { return fnVisible(this) ? fnAnimate(this, SLIDE_OUT_RIGHT, SLIDE_IN_RIGHT) : this; }

// Commons initializations in the HTML client
coll.ready = fn => document.addEventListener("DOMContentLoaded", fn);
coll.ready(i18n.setLanguage); // Load client language

export default coll;
