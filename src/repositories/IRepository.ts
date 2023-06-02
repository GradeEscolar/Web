import IModel from "@/models/IModel";

export default interface IRepository {
    config(): Promise<void> | void;
    get acessoLocal(): boolean;
    create<T extends IModel>(tabela: string, model: T): Promise<void>;
    read<T extends IModel>(tabela: string): Promise<T[]>;
    update<T extends IModel>(tabela: string, model: T): Promise<void>;
    delete<T extends IModel>(tabela: string, model: T): Promise<void>;
}