import { JstContext } from './JstContext';
import { IAppSettings, IContext } from './types';
import { Promise } from './promise';
export declare function Inject(app: IAppSettings, Context: IContext, Resolve: any, Proxy: any, JstContext: JstContext): any;
export declare function xhr(url: string, parse: boolean): Promise<any>;
