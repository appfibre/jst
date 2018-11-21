import { JstContext } from './JstContext';
import { IAppSettings } from './interfaces/IAppSettings';
import { IContext } from './interfaces/IContext';
import { Promise } from './promise';
export declare function Inject(app: IAppSettings, Context: IContext, Resolve: any, Proxy: any, JstContext: JstContext): any;
export declare function xhr(url: string, parse: boolean): Promise<any>;
