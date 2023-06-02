import DataAccessConfig from "./DataAccessConfig";

export default abstract class BaseDataContext {
    dataAccessConfig: DataAccessConfig = new DataAccessConfig();
}