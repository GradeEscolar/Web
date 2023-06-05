<template>
    <section class="form">



        <form @submit.prevent="salvar()" @reset.prevent="cancelar()">

            <div class="field">
                <Label for="dia">Dia</Label>
                <select id="dia" name="dia" v-model="dia" :disabled="edicao" @change="obterDados()">
                    <option v-for="dia in dias" :value="dia.dia">{{ dia.nome }}</option>
                </select>
            </div>

            <div class="button">
                <span v-if="!edicao">
                    <button type="button" @click="editar()">Editar</button>
                </span>
                <span v-else>
                    <button type="submit">Salvar</button>
                    <button type="reset">Cancelar</button>
                </span>
            </div>

            <section class="table">
                <table>
                    <caption></caption>
                    <thead>
                        <tr>
                            <th class="center">Aula</th>
                            <th class="center">Disciplina</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="aula in aulas">
                            <td class="center">{{ aula.aula }}</td>
                            <td>
                                <select v-model="aula.id_disciplina" :disabled="!edicao">
                                    <option :value="undefined">-- aula vaga --</option>
                                    <option v-for="disciplina in disciplinas" :value="disciplina.id">{{
                                        disciplina.disciplina }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

        </form>
    </section>
</template>

<script lang="ts">
import Grade from '@/Models/Grade';
import Dia from '@/Models/Dia';
import Aula from '@/Models/Aula';
import { defineComponent } from 'vue';
import DefaultResponse from '@/api/DefaultResponse';
import Disciplina from '@/Models/Disciplina';
// import DisciplinaService from '@/services/DisciplinaService';
// import GradeService from '@/services/GradeService';
// import AulaService from '@/services/AulaService';
// import Auth from '@/api/Auth';

export default defineComponent({
    name: "AulaConfigView",

    data(): {
        apiGrade: string,
        apiDisciplina: string,
        apiAula: string,
        // disciplinaService: DisciplinaService,
        // gradeService: GradeService,
        // aulaService: AulaService,
        disciplinas: Disciplina[],
        grade: Grade,
        aulasDb: Aula[],
        aulas: Aula[],
        dia: number | undefined
        dias: Dia[],
        edicao: boolean,
    } {
        return {
            apiGrade: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_GRADE,
            apiDisciplina: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_DISCIPLINAS,
            apiAula: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_AULAS,
            // disciplinaService: new DisciplinaService(),
            // gradeService: new GradeService(),
            // aulaService: new AulaService,
            disciplinas: [],
            grade: new Grade(),
            aulasDb: [],
            aulas: [],
            dia: undefined,
            dias: [],
            edicao: false
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
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
            let pGrades = this.axios.get<Grade[]>(this.apiGrade);
            let [rDisciplina, rGrades] = await Promise.all([pDisciplina, pGrades]);
            this.disciplinas = rDisciplina.data;
            this.grade = rGrades.data[0];
        },
        async obterDados() {
            let aulaPesquisa = new Aula();
            aulaPesquisa.id_grade = this.grade.id!;
            aulaPesquisa.dia = this.dia ?? Number(this.grade.dias.substring(0, 1))
            this.dia = aulaPesquisa.dia;
            let aulaResponse = await this.axios.post<Aula[]>(this.apiAula, aulaPesquisa);
            this.aulasDb = aulaResponse.data;
            this.ler();
        }
    },

    async mounted() {
        // if (!Auth.autenticado || !(await this.service.config(this.axios))){
        //     this.goToPage('Home');
        //     return;
        // }

        await this.obterDadosIniciais();
        await this.obterDados();
    },

})
</script>