import I_UI from "./I_UI";

export interface IAppSettings {
      app: object|Array<object>
    , designer?:Function
    , defaultState?: Object 
    , components: Object
    , target?: string|HTMLElement
    , title?: string
    , ui: I_UI
    , async?:boolean
    , stateChanged?:Function
}