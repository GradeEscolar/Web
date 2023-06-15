import { AxiosStatic } from "axios";
import IModel from "@/Models/IModel";
import DataContext from "./DataContext";
import IRepositoryBase from "./IRepositoryBase";

export default abstract class RepositoryBase<T extends IModel> extends DataContext implements IRepositoryBase<T> {

    protected get axios(): AxiosStatic {
        return this.source;
    }

    protected url: string;

    constructor(url: string, axios: AxiosStatic) {
        super(axios);
        this.url = url;
    }

    get(): Promise<T[]> {
        return new Promise<T[]>(async (ok, err) => {
            try {
                const result = await this.axios.get<T[]>(this.url);
                ok(result.data);
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

    post(model: T): Promise<T[]> {
        return new Promise<T[]>(async (ok, err) => {
            try {
                const result = await this.axios.post<T[]>(this.url, model);
                ok(result.data);
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

    put(model: T): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.put<void>(this.url, model);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

    patch(model: T): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.patch<void>(this.url, model);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

    delete(model: T): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.delete<void>(`${this.url}/${model.id}`);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }
}