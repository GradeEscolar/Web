<template>
    <section class="form">
        <form>
            <span v-if="disciplinas">
                <div class="field">
                    <label for="disciplinas">Disciplina</label>
                    <select id="disciplinas" v-model="disciplina" @change="obterAnotacoes()">
                        <option v-for="disciplina in disciplinas" :value="disciplina">{{ disciplina.disciplina }}</option>
                    </select>
                </div>
                <div class="field">
                    <label for="mes">Mês</label>
                    <input type="month" id="mes" v-model="mes" @change="obterAnotacoes()" />
                </div>

                <div class="field" v-if="anotacoes?.length ?? 0 >= 1">
                    <span>
                        <input type="checkbox" id="titulos" name="titulos" v-model="exibirTitulos" />
                        <label for="titulos">Exibir títulos</label>
                    </span>
                </div>
                <div v-else class="info">
                    <mark class="info">Não existem anotações.</mark>
                </div>

            </span>
            <div v-else class="info">
                <mark class="info">Não existem disciplinas cadastradas.</mark>
            </div>
        </form>
    </section>

    <span v-for="anotacao in anotacoes">
        <AnotacaoComponent :anotacao="anotacao" :disciplina="disciplina?.disciplina" :exibir-titulos="exibirTitulos">
        </AnotacaoComponent>
    </span>
</template>

<script lang="ts">
import Api from '@/api/Api';
import Auth from '@/api/Auth';
import Anotacao from '@/models/Anotacao';
import Dia from '@/models/Dia';
import Disciplina from '@/models/Disciplina';
import { defineComponent } from 'vue';
import MarkdownIt from 'markdown-it';
import AnotacaoComponent from '@/components/anotacao.component.vue';

export default defineComponent({
    name: 'AnotacoesView',

    components: {
        AnotacaoComponent
    },

    data(): {
        api: Api,
        disciplinas: Disciplina[] | undefined,
        disciplina: Disciplina | undefined,
        exibirTitulos: boolean,
        anotacoes: Anotacao[] | undefined,
        mes: string | undefined,
        md: MarkdownIt
    } {
        return {
            api: new Api(this.axios),
            disciplinas: undefined,
            disciplina: undefined,
            exibirTitulos: true,
            anotacoes: undefined,
            mes: undefined,
            md: new MarkdownIt({
                xhtmlOut: true,
                breaks: true,
                linkify: true
            })
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async obterDisciplinas() {
            this.disciplinas = await this.api.obterDisciplinas();
            if (this.disciplinas) {
                this.disciplina = this.disciplinas[0];
            }
        },
        async obterAnotacoes() {
            if (!this.disciplina || !this.mes) {
                return;
            }

            this.anotacoes = await this.api.obterAnotacoes(this.disciplina, this.mes);
        },
        obterTitulo(anotacao: Anotacao) {
            return `Aula ${anotacao.aula} - ${Dia.dataCompleta(new Date(anotacao.data))}.`;
        },
        obterConteudo(anotacao: Anotacao) {
            return this.md.render(anotacao.anotacao!);
        },
        obterDisciplina(id_disciplina: number | undefined): string | undefined {
            return this.disciplinas?.find(d => d.id == id_disciplina)?.disciplina;
        },
    },

    async mounted() {
        if (!Auth.autenticado) {
            this.goToPage('Home');
            return;
        }

        let exibirTitulos = localStorage.getItem('exibir_titulos');
        if (exibirTitulos) {
            this.exibirTitulos = exibirTitulos == 's';
        }

        this.mes = Dia.mesAtual();
        await this.obterDisciplinas();
        await this.obterAnotacoes();
    },

    watch: {
        exibirTitulos(newData: boolean) {
            localStorage.setItem('exibir_titulos', newData ? 's' : 'n');
        }
    }
});
</script>

<style scoped>
.anotacoes_label {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.anotacoes_label label:first-child {
    flex-grow: 1;
}

.anotacoes {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>