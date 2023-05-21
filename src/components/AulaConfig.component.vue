<template>
    <h3>Configurações - Aulas</h3>

    <form @submit.prevent="salvar()" @reset.prevent="cancelar()">

        <Label for="dia">Dia</Label><br />
        <select id="dia" name="dia" v-model="dia" :disabled="edicao" @change="obterDados()">
            <option v-for="dia in dias" :value="dia.dia">{{ dia.nome }}</option>
        </select><br />
        <br />

        <span v-if="!edicao">
            <button type="button" @click="editar()">Editar</button>
        </span>
        <span v-else>
            <button type="submit">Salvar</button>
            <button type="reset">Cancelar</button>
        </span>


        <br />
        <br />


        Aulas<br />
        <table>
            <thead>
                <tr>
                    <th>Aula</th>
                    <th>Disciplina</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="aula in aulas">
                    <td>{{ aula.aula }}</td>
                    <td>
                        <select v-model="aula.id_disciplina" :disabled="!edicao">
                            <option :value="undefined">-- aula vaga --</option>
                            <option v-for="disciplina in disciplinas" :value="disciplina.id">{{ disciplina.disciplina }}
                            </option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
</template>
<script lang="ts">
import Disciplina from '@/models/Disciplina';
import Grade from '@/models/Grade';
import Dia from '@/models/Dia';
import Aula from '@/models/Aula';
import { defineComponent } from 'vue';
import DefaultResponse from '@/api/DefaultResponse';

export default defineComponent({
    name: "AulaConfigComponent",

    data(): {
        apiGrade: string,
        apiDisciplina: string,
        apiAula: string,
        disciplinas: Disciplina[],
        grade: Grade,
        aulasDb: Aula[],
        aulas: Aula[],
        dia: number | undefined
        dias: Dia[],
        edicao: boolean,
    } {
        return {
            apiGrade: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_GRADE, 
            apiDisciplina: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_DISCIPLINA, 
            apiAula: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_AULA, 
            disciplinas: [],
            grade: new Grade(),
            aulasDb: [],
            aulas: [],
            dia: undefined,
            dias: [],
            edicao: false
        }
    },

    methods: {
        editar() {
            this.edicao = true;
        },
        async salvar() {
            await this.axios.put<DefaultResponse>(this.apiAula, this.aulas);
            this.edicao = false;
        },
        cancelar() {
            this.ler();
            this.edicao = false;
        },
        ler() {
            this.dias = Dia.montarAtivos(this.grade.dias);
            this.aulas = Aula.montar(this.grade, this.aulasDb, this.dia!);
        },
        persistir() {

        }, 
        async obterDadosIniciais() {
            let pDisciplina = this.axios.get<Disciplina[]>(this.apiDisciplina);
            let pGrade = this.axios.get<Grade>(this.apiGrade);
            let [rDisciplina, rGrade] = await Promise.all([pDisciplina, pGrade]);
            this.disciplinas = rDisciplina.data;
            this.grade = rGrade.data;
        },
        async obterDados() {
            let aulaPesquisa = new Aula();
            aulaPesquisa.id_grade = this.grade.id;
            aulaPesquisa.dia = this.dia ?? Number(this.grade.dias.substring(0, 1))
            this.dia = aulaPesquisa.dia;
            let aulaResponse = await this.axios.post<Aula[]>(this.apiAula, aulaPesquisa);
            this.aulasDb = aulaResponse.data;
            this.ler();
        }
    },

    async mounted() {
        await this.obterDadosIniciais();
        await this.obterDados();
    },

})
</script>