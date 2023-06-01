import BaseModel from "./BaseModel";

export default class Disciplina implements BaseModel {
    id: number | undefined;
    id_usuario: number | undefined;
    disciplina: string | undefined;
}