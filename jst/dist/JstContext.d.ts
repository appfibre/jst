import { IContextSettings } from './interfaces/IContextSettings';
import { Promise } from './promise';
export declare class JstContext {
    private _transform;
    private _settings;
    private _cache;
    constructor(settings: IContextSettings);
    _require(url: string): Promise<any>;
    run(str: string): Promise<any>;
    load(url: string, parse: boolean): Promise<any>;
}
