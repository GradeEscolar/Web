import Auth from "@/api/Auth";
import { AxiosStatic } from "axios";
import IRepository from "./IRepository";
import DbRepository from "./DbRepository";
import ApiRepository from "./ApiRepository";

export default class RepositoryFactory {

    public static async CreateRepository(axios: AxiosStatic): Promise<IRepository>{
        let repository: IRepository;
        if(Auth.localAccess) {
            repository = new DbRepository();
            await repository.config();
        } else {
            repository = new ApiRepository(axios);
            repository.config();
        }

        return repository;
    }
}