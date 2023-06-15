import { AxiosStatic } from "axios";

export default abstract class DataContext {
    protected source: AxiosStatic;
    
    constructor(axios: AxiosStatic) {
        this.source = axios;
    }
}