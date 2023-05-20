export default class Dia {
    dia: number;
    nome: string;
    ativo: boolean;

    constructor() {
        this.dia = 2;
        this.nome = 'Segunda'
        this.ativo = true
    }

    static montar(): Dia[] {
        return [
            {dia: 2, nome: 'Segunda', ativo: false}, 
            {dia: 3, nome: 'Terça', ativo: false}, 
            {dia: 4, nome: 'Quarta', ativo: false}, 
            {dia: 5, nome: 'Quinta', ativo: false}, 
            {dia: 6, nome: 'Sexta', ativo: false}, 
            {dia: 7, nome: 'Sábado', ativo: false}, 
            {dia: 1, nome: 'Domingo', ativo: false}
        ];
    }

    static montarTodos(dias: string): Dia[] {
        let todos = this.montar();
        todos.forEach(t => t.ativo = dias.indexOf(t.dia.toString()) != -1);
        return todos;
    }

    static montarAtivos(dias: string): Dia[] {
        return this.montar().filter(t => dias.indexOf(t.dia.toString()) != -1);
    }

    static desmontar(dias: Dia[]): string {
        return dias.filter(d => d.ativo).map(d => d.dia.toString()).join(';');
    }
}