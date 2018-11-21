export type IParser = (obj:any, offset?:number, resolve?:Function, reject?:Function) => string|undefined;

export interface IParseSettings {
    indent?:number,
    //parsers:{[key:string]:{value:Function;(obj:any, offset?:number):string}}
    parsers:{[key:string]:IParser}
}

export interface ITransformSettings {
    async?: boolean
  , indent?: boolean
}

export interface IPromise<T> extends Promise<T> {
    new ( fn:((resolve:T, reject:(reason: any) => PromiseLike<never>) => any) ): Promise<T>;
}
