import { AxiosStatic } from "axios";
import DataAccessConfig from "@/data_access/DataAccessConfig";
import BaseService from "./BaseService";
import Grade from "@/models/Grade";

export default class GradeService extends BaseService {

    async config(axios: AxiosStatic): Promise<boolean> {
        return this.baseConfig(axios, DataAccessConfig.grade);
    }

    public static initialize(db: IDBDatabase): Promise<void> {
        const transaction = db.transaction(DataAccessConfig.grade, "readwrite");
        const objectStore = transaction.objectStore(DataAccessConfig.grade);
        const count = objectStore.count();
        return new Promise<void>((ok, err) => {
            count.onsuccess = (ev) => {
                const hasData = (ev.target as IDBRequest).result == 1;
                if (!hasData) {
                    let grade = new Grade();
                    grade.dias = '2;3;4;5;6';
                    grade.aulas = 5;
                    let model = JSON.parse(JSON.stringify(grade, (key, value) => key == 'id' ? undefined : value));
                    const add = objectStore.add(model);
                    add.onsuccess = function () {
                        ok();
                    }
                    add.onerror = function () {
                        err(this.error);
                    }
                } else {
                    ok();
                }
            }
            count.onerror = function () {
                err(this.error);
            }
        });
    }

    async obterGrade(): Promise<Grade> {
        const grades = await this.repository.read<Grade>(this.tabela);
        if(grades.length != 1)
            throw new Error("Falha de banco de dados");
            
        return grades[0];
    }

    async atualizarGrade(grade: Grade): Promise<void> {
        return this.repository.update(this.tabela, grade);
    }
}