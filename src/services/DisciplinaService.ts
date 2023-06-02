import { AxiosStatic } from "axios";
import DataAccessConfig from "@/data_access/DataAccessConfig";
import Disciplina from "@/models/Disciplina";
import IRepository from "@/repositories/IRepository";
import RepositoryFactory from "@/repositories/RepositoryFactory";
import IModel from "@/models/IModel";

export default class DisciplinaService {

    private _repository: IRepository | undefined;
    private get repository(): IRepository {
        return this._repository!;
    }

    private _tabela: string | undefined;
    private get tabela(): string {
        return this._tabela!;
    }

    async config(axios: AxiosStatic): Promise<boolean> {
        try {
            this._repository = await RepositoryFactory.CreateRepository(axios);
            this._tabela = this._repository.acessoLocal ? DataAccessConfig.disciplinas : `${DataAccessConfig.api}${DataAccessConfig.disciplinas}`;
            return true;
        } catch (error) {
            return false;
        }
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

    create(disciplina: Disciplina) {
        return this.repository.create(this.tabela, disciplina);
    }

    read<T extends IModel>() {
        return this.repository.read<T>(this.tabela);
    }

    update(disciplina: Disciplina) {
        return this.repository.update(this.tabela, disciplina);
    }

    delete(disciplina: Disciplina) {
        return this.repository.delete(this.tabela, disciplina);
    }


}