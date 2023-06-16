<template>
    <section class="form" v-if="grade">
        <form>
            <div class="field">
                <label for="data">Data</label>
                <input id="data" type="date" v-model="data" @change="selecionarData()" required ref="data" />
            </div>
        </form>
    </section>
    <span v-if="data">
        <section class="table">
            <table v-if="aulas">
                <caption></caption>
                <thead>
                    <tr>
                        <th class="center" style="width: 100px;">Aula</th>
                        <th>Disciplina</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="hover" v-for="aula in aulas" @click="setAula(aula)"
                        :class="{ selecionada: aulaAtiva(aula.aula) }">
                        <td class="center">{{ aula.aula }}</td>
                        <td>{{ obterDisciplina(aula.id_disciplina) }}</td>
                    </tr>
                </tbody>
            </table>

            <div v-if="!aulas" class="mark">
                <mark class="info">Não existem aulas para a data selecionada.</mark>
            </div>

        </section>

        <AnotacaoComponent @editando="editando" :anotacao="anotacao" :disciplina="obterDisciplina(aula?.id_disciplina)"
            exibir-titulos>
        </AnotacaoComponent>
    </span>
</template>

<script lang="ts">
import AuthService from '@/Services/AuthService';
import Anotacao from '@/Models/Anotacao';
import Grade from '@/Models/Grade';
import Aula from '@/Models/Aula';
import { defineComponent } from 'vue';
import Dia from '@/Models/Dia';
import AnotacaoComponent from '@/Pages/Components/Anotacao.vue';
import Disciplina from '@/Models/Disciplina';
import AulaService from '@/Services/AulaService';
import DisciplinaService from '@/Services/DisciplinaService';
import GradeService from '@/Services/GradeService';
import AnotacaoService from '@/Services/AnotacaoService';


export default defineComponent({
    name: 'AulaView',

    components: {
        AnotacaoComponent
    },

    data(): {
        disciplinaService: DisciplinaService,
        gradeService: GradeService,
        aulaService: AulaService,
        anotacaoService: AnotacaoService,
        grade: Grade | undefined,
        disciplinas: Disciplina[] | undefined,
        disciplina: string,
        data: string | undefined,
        dia: Dia | undefined,
        aulas: Aula[] | undefined,
        aula: Aula | undefined,
        anotacao: Anotacao | undefined
    } {
        return {
            disciplinaService: new DisciplinaService(this.axios),
            gradeService: new GradeService(this.axios),
            aulaService: new AulaService(this.axios),
            anotacaoService: new AnotacaoService(this.axios),
            grade: undefined,
            disciplinas: undefined,
            disciplina: '',
            data: undefined,
            dia: undefined,
            aulas: undefined,
            aula: undefined,
            anotacao: undefined
        }
    },

    emits: ['goToPage', 'hideBackButton'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async editando(editando: boolean) {
            this.$emit('hideBackButton', editando);
        },
        async selecionarData(fromSession: boolean = false) {
            if (this.data) {
                this.dia = Dia.obterDia(this.data);
                if (this.dia) {
                    await this.selecionarAula(fromSession);
                } else {
                    this.aula = undefined;
                    this.anotacao = undefined
                }
            }
        },
        async selecionarAula(fromSession: boolean = false) {
            let aulas = await this.aulaService.obter(this.grade!.id, this.dia!.dia);
            if (aulas)
                aulas = this.aulaService.sort(aulas);
            this.aulas = aulas?.length == 0 ? undefined : aulas;
            if (this.aulas) {
                let index: number = 0;
                if (fromSession) {
                    let aulaSessao = sessionStorage.getItem('aula_aula');
                    if (aulaSessao) {
                        let aula = Number(aulaSessao);
                        let indexSessao = this.aulas.findIndex(a => a.aula == aula);
                        if (indexSessao >= 0)
                            index = indexSessao;
                    }
                }

                await this.setAula(this.aulas[index]);
            } else {
                this.aula = undefined;
                this.anotacao = undefined;
            }
            this.focus();
        },
        async setAula(aula: Aula) {
            this.aula = aula;
            this.anotacao = await this.anotacaoService.obterAnotacao(this.aula, this.data!);
        },
        obterDisciplina(id_disciplina: number | undefined): string | undefined {
            return this.disciplinas?.find(d => d.id == id_disciplina)?.disciplina;
        },
        async salvarAnotacao() {
            await this.anotacaoService.salvarAnotacao(this.anotacao!);
            this.anotacao = await this.anotacaoService.obterAnotacao(this.aula!, this.data!);
        },
        aulaAtiva(aula: number | undefined) {
            return this.aula?.aula == aula;
        },
        focus() {
            let data = this.$refs.data as HTMLInputElement;
            data.focus();
        },
        async obterDadosIniciais(): Promise<boolean> {
            try {
                this.grade = await this.gradeService.obter();
                this.disciplinas = await this.disciplinaService.obter();
                let dataSessao = sessionStorage.getItem('aula_data');
                if (dataSessao) {
                    this.data = dataSessao;
                } else {
                    let curDate = new Date(Date.now() - 180 * 60 * 1000);
                    this.data = curDate.toISOString().substring(0, 10);
                    sessionStorage.setItem('data', this.data);
                }

                return true;
            } catch (error) {
                return false;
            }
        },
    },

    async mounted() {
        if (!AuthService.autenticado) {
            this.goToPage('Home');
            return;
        }

        this.$emit('hideBackButton', false);
        if(await this.obterDadosIniciais()){
            await this.selecionarData(true);
        }
    },

    watch: {
        data(newData: string) {
            sessionStorage.setItem('aula_data', newData);
        },

        aula(newAula: Aula) {
            sessionStorage.setItem('aula_aula', newAula?.aula.toString());
        }
    }
});
</script>