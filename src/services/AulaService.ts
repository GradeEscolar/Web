import { AxiosStatic } from "axios";
import Aula from "@/Models/Aula";
import AulaRepository from "@/Repositories/AulaRepository";
import ServiceBase from "@/DataAccess/ServiceBase";

export default class AulaService extends ServiceBase<AulaRepository> {
   
    constructor(axios: AxiosStatic) {
        super(() => new AulaRepository(axios));
    }

    obter(id_grade: number, dia: number): Promise<Aula[]> {
        const filtro = new Aula();
        filtro.id_grade = id_grade;
        filtro.dia = dia;
        return this.repository.obter(filtro);
    }

    salvar(aulas: Aula[]): Promise<void> {
        return this.repository.salvar(aulas);
    }

    sort(aulas: Aula[]): Aula[] {
        return aulas.sort((a, b) => {
            return a.aula - b.aula;
        });
    }

}