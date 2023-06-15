import { AxiosStatic } from "axios";
import Disciplina from "@/Models/Disciplina";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";

export default class DisciplinaRepository extends RepositoryBase<Disciplina> {
    
    constructor(axios: AxiosStatic) {
        super(AppConfig.disciplinaUrl, axios);
    }

    criar(disciplina: Disciplina): Promise<void> {
        return this.put(disciplina);
    }

    obter(): Promise<Disciplina[]> {
        return this.get();
    }

    atualizar(disciplina: Disciplina): Promise<void> {
        return this.patch(disciplina);
    }

    excluir(disciplina: Disciplina): Promise<void> {
        return this.delete(disciplina);
    }
}