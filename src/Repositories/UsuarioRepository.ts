import { AxiosStatic } from "axios";
import Usuario from "@/Models/Usuario";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";

export default class UsuarioRepository extends RepositoryBase<Usuario> {
    
    constructor(axios: AxiosStatic) {
        super(AppConfig.usuarioUrl, axios);
    }

    cadastrar(usuario: Usuario): Promise<void> {
        return this.put(usuario);
    }
}