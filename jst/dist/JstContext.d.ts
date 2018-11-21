import { IContextSettings } from './types';
import { transformAsync, transformSync } from './transform';
import { Promise } from './promise';
export declare class JstContext {
    private _transform;
    private _settings;
    private _cache;
    constructor(settings: IContextSettings);
    transformAsync: typeof transformAsync;
    transformSync: typeof transformSync;
    _require(url: string): Promise<any>;
    run(str: string): Promise<any>;
    load(url: string, parse: boolean): Promise<any>;
}
