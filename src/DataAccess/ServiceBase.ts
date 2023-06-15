import IModel from "@/Models/IModel";
import IRepositoryBase from "./IRepositoryBase";

export default abstract class ServiceBase<TRepository extends IRepositoryBase<IModel>> {

    private _repository: TRepository | undefined;
    protected get repository(): TRepository {
        return this._repository!;
    }

    constructor(createRepository: () => TRepository) {
        this._repository = createRepository();
    }
}