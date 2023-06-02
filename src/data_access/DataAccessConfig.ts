
export default class DataAccessConfig {
    public static api = process.env.VUE_APP_GE_API;
    public static db = process.env.VUE_APP_GE_DB;
    public static login = process.env.VUE_APP_GE_LOGIN;
    public static usuarios = process.env.VUE_APP_GE_USUARIOS;
    public static grade = process.env.VUE_APP_GE_GRADE;
    public static disciplinas = process.env.VUE_APP_GE_DISCIPLINAS;
    public static anotacoes = process.env.VUE_APP_GE_ANOTACOES;
    public static aulas = process.env.VUE_APP_GE_AULAS;

    public api = DataAccessConfig.api;
    public db = DataAccessConfig.db;
    public login = DataAccessConfig.login;
    public usuarios = DataAccessConfig.usuarios;
    public grade = DataAccessConfig.grade;
    public disciplinas = DataAccessConfig.disciplinas;
    public anotacoes = DataAccessConfig.anotacoes;
    public aulas = DataAccessConfig.aulas;
}