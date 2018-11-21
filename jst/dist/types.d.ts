export declare type IParser = (obj: any, offset?: number, resolve?: Function, reject?: Function) => string | undefined;
export interface IParseSettings {
    indent?: number;
    parsers: {
        [key: string]: IParser;
    };
}
export interface ITransformSettings {
    async?: boolean;
    indent?: boolean;
}
export default interface I_UI {
    Component: any;
    processElement(tag: string | Object, attributes: Object, children?: Array<Object>): any;
    render(node: any, parent: Element | Document | ShadowRoot | DocumentFragment, mergeWith?: Element): Element;
}
export interface IAppSettings {
    app: object | Array<object>;
    designer?: Function;
    defaultState?: Object;
    components: Object;
    target?: string | HTMLElement;
    title?: string;
    ui: I_UI;
    async?: boolean;
    stateChanged?: Function;
}
export interface IContext {
    state?: Object;
    setState?: Function;
}
export interface IContextSettings {
    requireAsync?: boolean;
}
