export type IParser = (obj:any, offset?:number, resolve?:Function, reject?:Function) => string|undefined;

export interface IParseSettings {
    indent?:number,
    //parsers:{[key:string]:{value:Function;(obj:any, offset?:number):string}}
    parsers:{[key:string]:IParser}
    imports:any[string];
}

export interface ITransformSettings {
    async?: boolean
  , indent?: boolean
}

export interface IModule {
        scripts?:(string|{src:string, type:string})[]
      , modules?:(IModule|string)[]
      , init?:(app:IAppSettings)=>void
      , components?: Object|Function
}

export interface IAppSettings extends IModule {
    app: object|Array<object>
  , defaultState?: Object 
  , target?: string|HTMLElement
  , title?: string
  , ui: {Component: any, processElement(tag:any, attributes?:object|undefined, children?:any|undefined) : any, render:any}
  , async?:boolean
  , stateChanged?:Function
  , disableIntercept?:boolean
}

export interface IContext {
    state?: Object,
    setState?: Function
}

export interface IContextSettings {
      requireAsync?:boolean
    , supportsAsync?:boolean
}