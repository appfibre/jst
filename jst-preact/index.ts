import { h, render, Component } from 'preact';

function processElement(tag:any, attributes?:object|undefined, children?:any|undefined) : any {
    if (typeof tag === "function" && Array.isArray(children)) {
        if (children.length > 1) {
            console.warn("Class/function tags cannot have more than one direct child elements, wrapping elements in a div tag");
            return processElement(tag, attributes, processElement("div", {}, children));
        } 
        else { 
            children = children[0];
        }
    }

    return h(tag, attributes || null, children ? children : null);   
}

export {render, processElement, Component};