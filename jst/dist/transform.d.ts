import { ITransformSettings } from './types';
export declare function transformSync(json: object | Array<object>, settings?: ITransformSettings): string;
export declare function transformAsync(json: object | Array<object>, settings: ITransformSettings, resolve: Function, reject: Function): void;
