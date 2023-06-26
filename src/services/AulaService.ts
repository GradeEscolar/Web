import { AxiosStatic } from "axios";
import Aula from "@/Models/Aula";
import AulaRepository from "@/Repositories/AulaRepository";
import ServiceBase from "@/DataAccess/ServiceBase";
import Grade from "@/Models/Grade";

export default class AulaService extends ServiceBase<AulaRepository> {
   
    constructor(axios: AxiosStatic) {
        super(() => new AulaRepository(axios));
    }

    async obter(grade: Grade, dia: number): Promise<Aula[]> {
        if(grade.dias.indexOf(dia.toString()) == -1){
            return Promise.resolve(new Array<Aula>());
        }
        
        const filtro = new Aula();
        filtro.id_grade = grade.id;
        filtro.dia = dia;
        const aulas = await this.repository.obter(filtro);
        return aulas.filter(a => a.aula <= grade.aulas);
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