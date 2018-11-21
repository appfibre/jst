interface isubscribe<T> {
    owner: any;
    then: Promise<T>;
    fulfilled: ((value: T) => any) | null | undefined;
    rejected: ((reason: any) => any) | null | undefined;
}
export declare class Promise<T> implements Promise<T> {
    _state: number;
    _data: undefined;
    _handled: boolean;
    _then: isubscribe<T>[];
    constructor(resolver: Function);
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<T>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T>;
    static all(promises: Promise<any>[]): Promise<any>;
    static race(promises: Promise<any>[]): Promise<{}>;
}
export {};
