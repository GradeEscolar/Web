import { AxiosStatic } from "axios";
import Anotacao from "@/Models/Anotacao";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";

export default class AnotacaoRepository extends RepositoryBase<Anotacao> {

    constructor(axios: AxiosStatic) {
        super(AppConfig.anotacaoUrl, axios);
    }

    obter(filtro: Anotacao): Promise<Anotacao[]> {
        return this.post(filtro);
    }

    salvar(anotacao: Anotacao): Promise<Anotacao> {
        return new Promise<Anotacao>(async (ok, err) => {
            try {
                let result = await this.axios.put<Anotacao>(this.url, anotacao);
                ok(result.data);
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }
}