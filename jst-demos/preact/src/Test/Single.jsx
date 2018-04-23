import {h} from 'preact';
import Preact from "preact";

export default class Single extends Preact.Component {
	render() {
		return <div {...this.props}>{this.props.children}</div>
	}
}

