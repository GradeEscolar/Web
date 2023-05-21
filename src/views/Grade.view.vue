<template>
    <input type="date" v-model="data" @change="setDate()" /><br />
    <br />
    {{ nomeDia(dia) }}<br />
    <br />
    <table v-if="aulas">
        <thead>
            <tr>
                <th>Aula</th>
                <th>Disciplina</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="aula in aulas">
                <td>{{ aula.aula }}</td>
                <td>{{ obterDisciplina(aula.id_disciplina) }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import Auth from '@/api/Auth';
import Anotacao from '@/models/Anotacao';
import Disciplina from '@/models/Disciplina';
import Grade from '@/models/Grade';
import Aula from '@/models/Aula';
import { defineComponent } from 'vue';
import Api from '@/api/Api';
import Dia from '@/models/Dia';

export default defineComponent({
    name: 'GradeView',

    data(): {
        api: Api,
        grade: Grade | undefined,
        disciplinas: Disciplina[] | undefined,
        data: string | undefined,
        dt: Date | undefined,
        dia: number | undefined,
        dias: Dia[],
        aulas: Aula[] | undefined,
        anotacao: Anotacao | undefined
    } {
        return {
            api: new Api(this.axios),
            grade: undefined,
            disciplinas: undefined,
            data: undefined,
            dt: undefined,
            dia: undefined,
            dias: Dia.montar(),
            aulas: undefined,
            anotacao: undefined
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async setDate() {
            this.dt = new Date(`${this.data!}T00:00:00.000-03:00`);
            this.dia = this.dt.getDay() + 1;
            await this.obterAulas();
        },
        async obterAulas() {
            let aulas = await this.api.obterAulas(this.grade!.id, this.dia!);
            this.aulas = aulas.length == 0 ? undefined : aulas;
        },
        obterDisciplina(id_disciplina: number | undefined): string | undefined {
            return this.disciplinas?.find(d => d.id == id_disciplina)?.disciplina;
        },
        nomeDia(dia: number | undefined) {
            return this.dias.find(d => d.dia == dia)?.nome;
        }
    },

    async mounted() {
        if (!Auth.autenticado()) {
            this.goToPage('Login');
            return;
        }

        let [grade, disciplinas] = await this.api.obterGradeDisciplinas();
        this.grade = grade;
        this.disciplinas = disciplinas;

        let dataSessao = sessionStorage.getItem('data');
        if (dataSessao) {
            this.data = dataSessao;
        } else {
            let curDate = new Date(Date.now() - 180 * 60 * 1000);
            this.data = curDate.toISOString().substring(0, 10);
            sessionStorage.setItem('data', this.data);
        }

        this.setDate();
    },

    watch: {
        data(newData: string) {
            sessionStorage.setItem('data', newData);
        }
    }
});
</script>