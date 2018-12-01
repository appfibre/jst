"use strict";
exports.__esModule = true;
function ui(script) {
    return {
        scripts: [script],
        init: function (app) {
            var preact = this.preact;
            function processElement(tag, attributes, children) {
                if (typeof tag === "function" && Array.isArray(children)) {
                    if (children.length > 1) {
                        console.warn("Class/function tags cannot have more than one direct child elements, wrapping elements in a div tag");
                        return preact.processElement(tag, attributes, processElement("div", {}, children));
                    }
                    else {
                        children = children[0];
                    }
                }
                return preact.h(tag, attributes || null, children ? children : null);
            }
            app.ui = { Component: preact.Component,
                processElement: processElement,
                render: preact.render
            };
        }
    };
}
exports.ui = ui;
;
