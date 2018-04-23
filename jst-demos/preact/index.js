import {h, render} from 'preact';

render(h(require('./src/layout.jst').default), document.getElementById('window'));