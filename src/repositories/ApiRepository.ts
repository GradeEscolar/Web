import { AxiosStatic } from "axios";
import ApiDataContext from "@/data_access/ApiDataContext";
import IRepository from "./IRepository";
import IModel from "@/models/IModel";

export default class ApiRepository extends ApiDataContext implements IRepository {
    
    private get axios(): AxiosStatic {
        return this.source as AxiosStatic;
    }

    public get acessoLocal(): boolean {
        return false;
    }

    constructor(axios: AxiosStatic) {
        super(axios);
    }
    
    create<T extends IModel>(tabela: string, model: T): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.post(tabela, model);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

    read<T extends IModel>(tabela: string): Promise<T[]> {
        return new Promise<T[]>(async (ok, err) => {
            try {
                const result = await this.axios.get<T[]>(tabela);
                ok(result.data);        
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

    update<T extends IModel>(tabela: string, model: T): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.patch(tabela, model);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

    delete<T extends IModel>(tabela: string, model: T): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.delete(`${tabela}/${model.id}`);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }
}