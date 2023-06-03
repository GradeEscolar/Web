import IDataContext from "./IDataContext";
import BaseDataContext from "./BaseDataContext";
import DataAccessConfig from "./DataAccessConfig";
import { AxiosStatic } from "axios";
import GradeService from "@/services/GradeService";

export default class DbDataContext extends BaseDataContext implements IDataContext {
    private static source: IDBDatabase | undefined = undefined;
    
    public get source(): IDBDatabase | AxiosStatic | undefined {
        return DbDataContext.source;
    }
    
    public config(): Promise<void> {

        if(DbDataContext.source)        
            return new Promise(ok => ok());
        
        const request = window.indexedDB.open(this.dataAccessConfig.db, 1);
        request.onupgradeneeded = this.upgradeneeded;

        return new Promise<void>((ok, err) => {
            request.onsuccess = async function () {
                DbDataContext.source = this.result;
                await GradeService.initialize(this.result);
                ok();
            };
            request.onerror = function () {
                DbDataContext.source = undefined;
                console.log(this.error);
                err(this.error?.message);
            };
        });
    }

    private upgradeneeded(this: IDBOpenDBRequest) {
        const db = this.result;
        const objectStoreNames: string[] = [DataAccessConfig.grade, DataAccessConfig.disciplinas, DataAccessConfig.anotacoes, DataAccessConfig.aulas];
        objectStoreNames.forEach(async objectStoreName => {
            if (!db.objectStoreNames.contains(objectStoreName))
                db.createObjectStore(objectStoreName, { autoIncrement: true, keyPath: "id" });
        });
    }
}