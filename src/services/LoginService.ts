import { AxiosStatic } from "axios";
import LoginRepository from "@/Repositories/LoginRepository";
import Usuario from "@/Models/Usuario";
import ServiceBase from "@/DataAccess/ServiceBase";

export default class LoginService extends ServiceBase<LoginRepository> {

    constructor(axios: AxiosStatic) {
        super(() => new LoginRepository(axios))
    }

    async login(usuario: Usuario): Promise<string> {
        const result = await this.repository.login(usuario);
        return result.access_token;
    }
}