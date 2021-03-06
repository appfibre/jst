"use strict";
exports.__esModule = true;
var preact_1 = require("preact");
exports.render = preact_1.render;
exports.Component = preact_1.Component;
function processElement(tag, attributes, children) {
    if (typeof tag === "function" && Array.isArray(children)) {
        if (children.length > 1) {
            console.warn("Class/function tags cannot have more than one direct child elements, wrapping elements in a div tag");
            return processElement(tag, attributes, processElement("div", {}, children));
        }
        else {
            children = children[0];
        }
    }
    return preact_1.h(tag, attributes || null, children ? children : null);
}
exports.processElement = processElement;
