import { h, render, Component } from 'preact';

function processElement(tag, attributes, children) {
    return h(tag, attributes, children);   
}

export {render, processElement, Component};