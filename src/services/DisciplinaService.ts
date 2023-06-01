import DataContext from "@/data_access/DataContext";
import Disciplina from "@/models/Disciplina";
import { AxiosStatic } from "axios";

export default class DisciplinaService {
    private api: string;
    private tabela: string;
    private axios: AxiosStatic;
    private dataContext: DataContext;
    private get acessoLocal(): boolean { return DataContext.acessoLocal; };

    constructor(axios: AxiosStatic) {
        this.axios = axios;
        this.api = process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_DISCIPLINA;
        this.dataContext = new DataContext();
        this.tabela = 'disciplinas';
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

    async create(disciplina: Disciplina) {
        console.log(disciplina);
        if (this.acessoLocal)
            await this.dataContext.add(this.tabela, disciplina);
        else
            await this.axios.post(this.api, disciplina);
    }

    async read(): Promise<Disciplina[]> {
        let result = this.acessoLocal
            ? await this.dataContext.getAll<Disciplina>(this.tabela)
            : (await this.axios.get<Disciplina[]>(this.api)).data;

        return this.sort(result);
    }

    async update(disciplina: Disciplina) {
        this.acessoLocal
            ? await this.dataContext.update(this.tabela, disciplina)
            : await this.axios.patch(this.api, disciplina);
    }

    async delete(disciplina: Disciplina) {
        throw new Error("");
    }


}