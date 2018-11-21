interface Attributes {
    key?: string | number | any;
    jsx?: boolean;
}
declare type Ref<T> = (instance: T) => void;
declare type ComponentChild = /*VNode<any>*/ Object | Function | string | number | null;
declare type ComponentChildren = ComponentChild[] | ComponentChild | object | string | number | null;
declare type RenderableProps<P, RefType = any> = Readonly<P & Attributes & {
    children?: ComponentChildren;
    ref?: Ref<RefType>;
}>;
interface IComponent<P = {}, S = {}> extends ObjectConstructor {
    componentWillMount?(): void;
    componentDidMount?(): void;
    componentWillUnmount?(): void;
    getChildContext?(): object;
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
    componentDidUpdate?(previousProps: Readonly<P>, previousState: Readonly<S>, previousContext: any): void;
    setState<K extends keyof S>(state: Pick<S, K>, callback?: () => void): void;
    setState<K extends keyof S>(fn: (prevState: S, props: P) => Pick<S, K>, callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    render(props?: RenderableProps<P>, state?: Readonly<S>, context?: any): ComponentChild;
}
export interface IJstComponent extends IComponent {
    parse(obj: any, key?: number, supportAsync?: boolean): any;
}
export {};
