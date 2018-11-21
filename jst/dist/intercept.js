"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Intercept = function inject(_a) {
    var Component = _a.Component;
    return /** @class */ (function (_super) {
        __extends(Intercept, _super);
        function Intercept() {
            var _this = _super.call(this) || this;
            _this.state = { focus: false, selected: false, editMode: null, canEdit: true };
            _this.onMessage = _this.onMessage.bind(_this);
            _this.click = _this.click.bind(_this);
            _this.mouseEnter = _this.mouseEnter.bind(_this);
            _this.mouseLeave = _this.mouseLeave.bind(_this);
            return _this;
        }
        Intercept.prototype.componentDidMount = function () {
            window.addEventListener("message", this.onMessage);
            window.onclick = function () { parent.postMessage({ eventType: "select", correlationId: Date.now().toString() }, location.href); };
        };
        Intercept.prototype.componentWillUnmount = function () {
            window.removeEventListener("message", this.onMessage);
        };
        Intercept.prototype.reconstruct = function (obj) {
            if (!obj[1])
                obj[1] = {};
            if (!obj[1].style)
                obj[1].style = {};
            if (!obj[1].style.border && !obj[1].style.padding && !obj[1].onMouseEnter && !obj[1].onMouseLeave) {
                obj[1].style.padding = this.state.focus || this.state.selected ? "1px" : "2px";
                if (this.state.editMode)
                    obj[1].style.background = "lightblue";
                if (this.state.selected)
                    obj[1].style.border = "1px solid black";
                else if (this.state.focus)
                    obj[1].style.border = "1px dashed grey";
                obj[1].onMouseEnter = this.mouseEnter;
                obj[1].onMouseLeave = this.mouseLeave;
                obj[1].onClick = this.click;
            }
            return obj;
        };
        Intercept.prototype.render = function () {
            //return super.render(Array.isArray(this.props.children) ? this.reconstruct(["div", {style: {display: "inline-block"}}, this.props.children])  : this.reconstruct(this.props.children));
            return _super.prototype.render.call(this, this.reconstruct(["div", { style: { display: "inline-block" }, key: 0 }, this.props.children]));
        };
        Intercept.prototype.mouseEnter = function () {
            //x.Designer.notify("x");
            this.setState({ "focus": true });
        };
        Intercept.prototype.mouseLeave = function () {
            //x.Designer.notify("y");
            this.setState({ "focus": false });
        };
        Intercept.prototype.click = function (ev) {
            ev.stopPropagation();
            //Designer.notify(this.props.file);
            var parent = window;
            while (parent.parent !== parent && window.parent != null)
                parent = parent.parent;
            var correlationId = Date.now().toString();
            parent.postMessage({ eventType: "select", editMode: this.state.editMode, canEdit: this.state.canEdit, correlationId: correlationId, control: { file: this.props.file, method: this.props.method } }, location.href);
            this.setState({ "selected": correlationId });
        };
        Intercept.prototype.onMessage = function (ev) {
            if (location.href.substr(0, ev.origin.length) == ev.origin && ev.type == "message" && ev.data) {
                if (this.state.selected == ev.data.correlationId)
                    switch (ev.data.eventType) {
                        case "deselect":
                            this.setState({ selected: false });
                            break;
                        case "edit":
                            this.setState({ editMode: ev.data.editMode });
                            break;
                    }
            }
        };
        return Intercept;
    }(Component));
};
exports.Intercept = Intercept;
