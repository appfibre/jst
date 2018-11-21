export default interface I_UI {
      Component: any
    , processElement(tag:string|Object, attributes:Object, children?:Array<Object>):any
    , render(node: any/*ComponentChild*/, parent: Element | Document | ShadowRoot | DocumentFragment, mergeWith?: Element): Element;   
}