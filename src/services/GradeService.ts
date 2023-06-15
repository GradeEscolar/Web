import { AxiosStatic } from "axios";
import Grade from "@/Models/Grade";
import GradeRepository from "@/Repositories/GradeRepository";
import ServiceBase from "@/DataAccess/ServiceBase";

export default class GradeService extends ServiceBase<GradeRepository> {
   
    constructor(axios: AxiosStatic) {
        super(() => new GradeRepository(axios));
    }

    async obter(): Promise<Grade> {
        const grades = await this.repository.obter();
        if(grades.length != 1)
            throw new Error("Falha de banco de dados");
            
        return grades[0];
    }

    async atualizar(grade: Grade): Promise<void> {
        return this.repository.atualizar(grade);
    }
}