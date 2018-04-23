import {h} from 'preact';
import Preact from "preact";

class A extends Preact.Component {
	render() {
		return <button {...this.props} onClick={() => {debugger; alert(JSON.stringify(this.props))}}>{this.props.children}</button>
	}
}

class B extends Preact.Component {
	render() {
		return <div {...this.props}>A{this.props.children}B</div>
	}
}

export { A, B };
