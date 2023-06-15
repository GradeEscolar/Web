
export default class AppConfig {
    public static api = process.env.VUE_APP_GE_API;
    public static loginUrl = this.api + process.env.VUE_APP_GE_LOGIN_URL;
    public static usuarioUrl = this.api + process.env.VUE_APP_GE_USUARIO_URL;
    public static gradeUrl = this.api + process.env.VUE_APP_GE_GRADE_URL;
    public static disciplinaUrl = this.api + process.env.VUE_APP_GE_DISCIPLINA_URL;
    public static anotacaoUrl = this.api + process.env.VUE_APP_GE_ANOTACAO_URL;
    public static aulaUrl = this.api + process.env.VUE_APP_GE_AULA_URL;
}