import { AxiosStatic } from "axios";
import DataAccessConfig from "@/data_access/DataAccessConfig";
import IRepository from "@/repositories/IRepository";
import RepositoryFactory from "@/repositories/RepositoryFactory";
import IModel from "@/models/IModel";

export default abstract class BaseService {

    private _repository: IRepository | undefined;
    protected get repository(): IRepository {
        return this._repository!;
    }

    private _tabela: string | undefined;
    protected get tabela(): string {
        return this._tabela!;
    }

    protected async baseConfig(axios: AxiosStatic, tabela: string): Promise<boolean> {
        try {
            this._repository = await RepositoryFactory.CreateRepository(axios);
            this._tabela = this._repository.acessoLocal ? tabela : `${DataAccessConfig.api}${tabela}`;
            return true;
        } catch (error) {
            return false;
        }
    }

    protected parseModel<T extends IModel>(model: T, removerId: boolean){
        return JSON.parse(JSON.stringify(model, (key, value) => removerId && key == 'id' ? undefined : value));
    }
}