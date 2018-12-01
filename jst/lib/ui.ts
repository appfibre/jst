import { IAppSettings, IModule } from "./types";

export function ui (script:string) : IModule {
    return {
        scripts: [script],
        init: function (this:any, app:IAppSettings) {
                var preact:any = this.preact;

                function processElement(tag:any, attributes?:object|undefined, children?:any|undefined) : any {
                    if (typeof tag === "function" && Array.isArray(children)) {
                        if (children.length > 1) {
                            console.warn("Class/function tags cannot have more than one direct child elements, wrapping elements in a div tag");
                            return preact.processElement(tag, attributes, processElement("div", {}, children));
                        } 
                        else { 
                            children = children[0];
                        }
                    }
                    return preact.h(tag, attributes || null, children ? children : null);   
                }

                app.ui =    { Component : preact.Component       
                            , processElement: processElement
                            , render: preact.render
                            }
        }
    };
};