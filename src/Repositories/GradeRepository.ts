import { AxiosStatic } from "axios";
import Grade from "@/Models/Grade";
import RepositoryBase from "@/DataAccess/RepositoryBase";
import AppConfig from "@/AppConfig";

export default class GradeRepository extends RepositoryBase<Grade>  {

    constructor(axios: AxiosStatic) {
        super(AppConfig.gradeUrl, axios);
    }

    obter(): Promise<Grade[]> {
        return this.get();
    }

    atualizar(grade: Grade): Promise<void> {
        return this.patch(grade);
    }

}