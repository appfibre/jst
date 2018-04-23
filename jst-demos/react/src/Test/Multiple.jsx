import React from "react";

class A extends React.Component {
	render() {
		return <button {...this.props} onClick={() => {debugger; alert(JSON.stringify(this.props))}}>{this.props.children}</button>
	}
}

class B extends React.Component {
	render() {
		return <div {...this.props}>A{this.props.children}B</div>
	}
}

export { A, B };
