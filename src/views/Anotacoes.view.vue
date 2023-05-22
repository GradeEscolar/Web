<template>
    <h3>Anotações</h3>
    <span v-if="disciplinas">
        <label for="disciplinas">Disciplina</label><br />
        <select id="disciplinas" v-model="disciplina" @change="obterAnotacoes()">
            <option v-for="disciplina in disciplinas" :value="disciplina">{{ disciplina.disciplina }}</option>
        </select><br />
        <br />
        <label for="mes">Mês</label><br />
        <input type="month" id="mes" v-model="mes" @change="obterAnotacoes()" /><br />
        <br />

        Anotações<br />
        <input type="checkbox" id="titulos" v-model="exibirTitulos" />
        <label for="titutlos">Exibir títulos</label>
        <br />
        <br />
        <span v-for="anotacao in anotacoes">
            <span v-if="exibirTitulos">{{ obterTitulo(anotacao) }}</span>
            <span v-html="obterConteudo(anotacao)"></span>
        </span>

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

export default defineComponent({
    name: 'AnotacoesView',

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
        }
    },

    async mounted() {
        if (!Auth.autenticado()) {
            this.goToPage('Login');
            return;
        }

        let exibirTitulos = localStorage.getItem('exibir_titulos');
        if(exibirTitulos){
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