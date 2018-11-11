import { createElement, Component } from 'react';
import { render } from 'react-dom';

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

    return createElement(tag, attributes, children ? children : null);   
}


export {render, processElement, Component};