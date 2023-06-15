import ServiceBase from "@/DataAccess/ServiceBase";
import Usuario from "@/Models/Usuario";
import UsuarioRepository from "@/Repositories/UsuarioRepository";
import { AxiosStatic } from "axios";

export default class UsuarioService extends ServiceBase<UsuarioRepository> {
    
    constructor(axios: AxiosStatic) {
        super(() => new UsuarioRepository(axios));
    }

    cadastrar(usuario: Usuario): Promise<void> {
        return this.repository.cadastrar(usuario);
    }
} 