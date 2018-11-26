"use strict";
exports.__esModule = true;
var react_1 = require("react");
exports.Component = react_1.Component;
var react_dom_1 = require("react-dom");
exports.render = react_dom_1.render;
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
    return react_1.createElement(tag, attributes, children ? children : null);
}
exports.processElement = processElement;
