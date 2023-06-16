<template>
    <section class="form" v-if="grade">

        <form @submit.prevent="salvar()" @reset.prevent="cancelar()">

            <div class="field">
                <Label for="dia">Dia</Label>
                <select id="dia" name="dia" v-model="dia" :disabled="edicao" @change="obterDados()">
                    <option v-for="dia in dias" :value="dia.dia">{{ dia.nome }}</option>
                </select>
            </div>

            <div class="button">
                <span v-if="!edicao">
                    <button v-if="!bloquearEdicao" type="button" @click="editar()">Editar</button>
                    <button v-if="bloquearEdicao" type="button" @click="goToPage('DisciplinaConfig')">Editar
                        Disciplinas</button>
                </span>
                <span v-else>
                    <button type="submit">Salvar</button>
                    <button type="reset">Cancelar</button>
                </span>
                <mark class="error" v-if="result">{{ result }}</mark>
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
import Disciplina from '@/Models/Disciplina';
import AuthService from '@/Services/AuthService';
import DisciplinaService from '@/Services/DisciplinaService';
import GradeService from '@/Services/GradeService';
import AulaService from '@/Services/AulaService';

export default defineComponent({
    name: "AulaConfigView",

    data(): {
        disciplinaService: DisciplinaService,
        gradeService: GradeService,
        aulaService: AulaService,
        disciplinas: Disciplina[],
        grade: Grade | undefined,
        aulasDb: Aula[],
        aulas: Aula[],
        dia: number | undefined
        dias: Dia[],
        edicao: boolean,
        result: string | undefined,
        bloquearEdicao: boolean
    } {
        return {
            disciplinaService: new DisciplinaService(this.axios),
            gradeService: new GradeService(this.axios),
            aulaService: new AulaService(this.axios),
            disciplinas: [],
            grade: undefined,
            aulasDb: [],
            aulas: [],
            dia: undefined,
            dias: [],
            edicao: false,
            result: undefined,
            bloquearEdicao: false
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
            await this.aulaService.salvar(this.aulas);
            this.edicao = false;
        },
        cancelar() {
            this.ler();
            this.edicao = false;
        },
        ler() {
            this.dias = Dia.montarAtivos(this.grade!.dias);
            this.aulas = Aula.montar(this.grade!, this.aulasDb, this.dia!);
        },
        async obterDadosIniciais() {
            try {
                this.grade = await this.gradeService.obter();
                this.disciplinas = await this.disciplinaService.obter();
                this.bloquearEdicao = this.disciplinas.length == 0;
                if (this.bloquearEdicao) {
                    this.result = "Não existem disciplinas cadastradas!";
                }
            } catch (error) {
                this.grade = undefined;
            }
        },
        async obterDados() {
            if(!this.grade)
                return;
            
            this.dia = this.dia ?? Number(this.grade.dias.substring(0, 1));
            this.aulasDb = await this.aulaService.obter(this.grade.id, this.dia);
            this.ler();
        }
    },

    async mounted() {
        if (!AuthService.autenticado) {
            this.goToPage('Home');
            return;
        }

        await this.obterDadosIniciais();
        await this.obterDados();
    },

})
</script>