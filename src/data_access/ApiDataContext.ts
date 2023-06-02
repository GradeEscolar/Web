import { AxiosStatic } from "axios";
import BaseDataContext from "./BaseDataContext";
import IDataContext from "./IDataContext";

export default class ApiDataContext extends BaseDataContext implements IDataContext {
    private static source: AxiosStatic | undefined;
    private _axios: AxiosStatic;

    public get source(): IDBDatabase | AxiosStatic | undefined {
        return ApiDataContext.source;
    }

    constructor(axios: AxiosStatic) {
        super();
        this._axios = axios;
    }

    public config(): void {
        if (ApiDataContext.source)
            return;

        ApiDataContext.source = this._axios;
    }
}