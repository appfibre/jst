import { createElement, Component } from 'react';
import { render } from 'react-dom';

function processElement(tag, attributes, children) {
    return createElement(tag, attributes, children);   
}


export {render, processElement, Component};