import { AxiosStatic } from "axios";
import Aula from "@/Models/Aula";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";

export default class AulaRepository extends RepositoryBase<Aula> {

    constructor(axios: AxiosStatic) {
        super(AppConfig.aulaUrl, axios);
    }

    obter(filtro: Aula): Promise<Aula[]> {
        return this.post(filtro);
    }

    salvar(aulas: Aula[]): Promise<void> {
        return new Promise<void>(async (ok, err) => {
            try {
                await this.axios.put<void>(this.url, aulas);
                ok();
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }

}
