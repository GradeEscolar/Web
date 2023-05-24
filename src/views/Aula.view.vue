<template>
    <input type="date" v-model="data" @change="setDate()" /><br />
    <br />
    {{ dia?.nome }}<br />
    <br />
    <table v-if="aulas">
        <thead>
            <tr>
                <th>Aula</th>
                <th>Disciplina</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="aula in aulas" @click="setAula(aula)">
                <td>{{ aula.aula }}</td>
                <td>{{ obterDisciplina(aula.id_disciplina) }}</td>
            </tr>
        </tbody>
    </table><br />
    <br />
    <label v-if="anotacao" for="anotacao">Anotações</label><br />
    <textarea v-if="anotacao" id="anotacao"  v-model.trim="anotacao.anotacao" rows="5" cols="40" /><br />
    <button v-if="anotacao" type="button" @click="salvarAnotacao()">Salvar</button>
    
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
    name: 'AulaView',

    data(): {
        api: Api,
        grade: Grade | undefined,
        disciplinas: Disciplina[] | undefined,
        data: string | undefined,
        dia: Dia | undefined,
        aulas: Aula[] | undefined,
        aula: Aula | undefined,
        anotacao: Anotacao | undefined
    } {
        return {
            api: new Api(this.axios),
            grade: undefined,
            disciplinas: undefined,
            data: undefined,
            dia: undefined,
            aulas: undefined,
            aula: undefined,
            anotacao: undefined
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async setDate() {
            this.dia = Dia.obterDia(this.data!);
            await this.obterAulas();
        },
        async obterAulas() {
            let aulas = await this.api.obterAulas(this.grade!.id, this.dia!.dia);
            this.aulas = aulas.length == 0 ? undefined : aulas;
            if(this.aulas) {
                await this.setAula(this.aulas[0]);
            }
        },
        async setAula(aula: Aula) {
            this.aula = aula;
            this.anotacao = await this.api.obterAnotacaoGrade(this.aula, this.data!);
        },
        obterDisciplina(id_disciplina: number | undefined): string | undefined {
            return this.disciplinas?.find(d => d.id == id_disciplina)?.disciplina;
        },
        async salvarAnotacao() {
            await this.api.salvarAnotacao(this.anotacao!);
            this.anotacao = await this.api.obterAnotacaoGrade(this.aula!, this.data!);
        }
    },

    async mounted() {
        if (!Auth.autenticado()) {
            this.goToPage('Home');
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

        await this.setDate();
    },

    watch: {
        data(newData: string) {
            sessionStorage.setItem('data', newData);
        }
    }
});
</script>