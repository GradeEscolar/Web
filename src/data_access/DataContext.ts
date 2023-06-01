import BaseModel from "@/models/BaseModel";

export default class DataContext {
    public static localDb: IDBDatabase | null = null;
    public static acessoLocal: boolean = false;
    public get db(): IDBDatabase { return DataContext.localDb!; }

    public static openLocalDb() {
        const request = window.indexedDB.open('GradeEscolar', 1);
        request.onupgradeneeded = DataContext.upgradeneeded;

        return new Promise<IDBDatabase>((ok, err) => {
            request.onsuccess = function () {
                DataContext.localDb = this.result;
                DataContext.acessoLocal = true;
                ok(this.result);
            };

            request.onerror = function () {
                DataContext.localDb = null;
                DataContext.acessoLocal = false;
                console.log(this.error);
                err(this.error);
            };
        });
    }

    private static upgradeneeded(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) {
        const db = this.result;
        DataContext.createObjectStore(db, "disciplinas", "grade", "aulas", "anotacoes");
    }

    private static createObjectStore(db: IDBDatabase, ...names: string[]) {
        names.forEach(name => {
            if (!db.objectStoreNames.contains(name))
                db.createObjectStore(name, { autoIncrement: true, keyPath: "id" });
        });
    }

    getAll<T>(tabela: string): Promise<T[]> {
        const transaction = this.db.transaction(tabela, "readonly");
        const objectStore = transaction.objectStore(tabela);
        const request = objectStore.getAll();
        return new Promise((ok, err) => {
            request.onsuccess = function (ev) {
                ok(this.result as T[]);
            };

            request.onerror = function () {
                console.log(this.error);
                err(this.error);
            }
        });
    }

    add<T extends BaseModel>(tabela: string, registro: T): Promise<void> {
        const transaction = this.db.transaction(tabela, "readwrite");
        const objectStore = transaction.objectStore(tabela);
        const request = objectStore.add(JSON.parse(JSON.stringify(registro)));
        return new Promise((ok, err) => {
            request.onsuccess = function (ev) {
                registro.id = this.result as number;
                ok();
            };

            request.onerror = function () {
                console.log(this.error);
                err(this.error);
            }
        });
    }

    update<T extends BaseModel>(tabela: string, registro: T): Promise<void> {
        const transaction = this.db.transaction(tabela, "readwrite");
        const objectStore = transaction.objectStore(tabela);
        const request = objectStore.put(JSON.parse(JSON.stringify(registro)));
        return new Promise((ok, err) => {
            request.onsuccess = function (ev) {
                ok();
            };

            request.onerror = function () {
                console.log(this.error);
                err(this.error);
            }
        });
    }
}