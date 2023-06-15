import { AxiosStatic } from "axios";
import Disciplina from "@/Models/Disciplina";
import DisciplinaRepository from "@/Repositories/DisciplinaRepository";
import ServiceBase from "@/DataAccess/ServiceBase";

export default class DisciplinaService extends ServiceBase<DisciplinaRepository> {

    constructor(axios: AxiosStatic) {
        super(() => new DisciplinaRepository(axios));
    }

    sort(disciplinas: Disciplina[]): Disciplina[] {
        return disciplinas.sort((a, b) => {
            if (!a.disciplina && !b.disciplina) return 0;
            if (!a.disciplina) return 1;
            if (!b.disciplina) return -1;
            return a.disciplina.localeCompare(b.disciplina);
        });
    }

    clone(disciplina: Disciplina): Disciplina {
        let clone = new Disciplina();
        clone.id = disciplina.id;
        clone.id_usuario = disciplina.id_usuario;
        clone.disciplina = disciplina.disciplina;
        return clone;
    }

    criar(disciplina: Disciplina) {
        return this.repository.criar(disciplina);
    }

    obter() {
        return this.repository.obter();
    }

    atualizar(disciplina: Disciplina) {
        return this.repository.atualizar(disciplina);
    }

    excluir(disciplina: Disciplina) {
        return this.repository.excluir(disciplina);
    }
}