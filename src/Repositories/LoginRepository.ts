import { AxiosStatic } from "axios";
import Usuario from "@/Models/Usuario";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";
import TokenResponse from "@/Models/TokenResponse";

export default class LoginRepository extends RepositoryBase<Usuario> {
    
    constructor(axios: AxiosStatic) {
        super(AppConfig.loginUrl, axios);
    }

    login(usuario: Usuario): Promise<TokenResponse> {
        return new Promise<TokenResponse>(async (ok, err) => {
            try {
                const result = await this.axios.post<TokenResponse>(this.url, usuario);
                ok(result.data);
            } catch (error: any) {
                console.log(error);
                err(error?.request?.data?.message);
            }
        });
    }
}