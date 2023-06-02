import DbDataContext from "@/data_access/DbDataContext";
import IRepository from "./IRepository";
import IModel from "@/models/IModel";

export default class DbRepository extends DbDataContext implements IRepository {
    
    private get db(): IDBDatabase {
        return this.source as IDBDatabase;
    }

    public get acessoLocal(): boolean {
        return true;
    }

    create<T extends IModel>(tabela: string, model: T): Promise<void> {
        const transaction = this.db.transaction(tabela, "readwrite");
        const objectStore = transaction.objectStore(tabela);
        const request = objectStore.add(this.parseModel(model, true));
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                model.id = this.result as number;
                ok();
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    read<T extends IModel>(tabela: string): Promise<T[]> {
        const transaction = this.db.transaction(tabela, "readonly");
        const objectStore = transaction.objectStore(tabela);
        const request = objectStore.getAll();
        return new Promise((ok, err) => {
            request.onsuccess = function () {
                ok(this.result as T[]);
            }
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    update<T extends IModel>(tabela: string, model: T): Promise<void> {
        const transaction = this.db.transaction(tabela, "readwrite");
        const objectStore = transaction.objectStore(tabela);
        const request = objectStore.put(this.parseModel(model, false));
        return new Promise((ok, err) => {
            request.onsuccess = function(){
                ok();
            } 
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    delete<T extends IModel>(tabela: string, model: T): Promise<void> {
        const transaction = this.db.transaction(tabela, "readwrite");
        const objectStore = transaction.objectStore(tabela);
        const request = objectStore.delete(model.id!);
        return new Promise((ok, err) => {
            request.onsuccess = function(){
                ok();
            } 
            request.onerror = function () {
                console.log(this.error);
                err(this.error?.message);
            }
        });
    }

    private parseModel(model: any, removerId: boolean){
        return JSON.parse(JSON.stringify(model, (key, value) => removerId && key == 'id' ? undefined : value));
    }

}