<template>
    <section class="container" :class="{ edit: edit }" v-if="anotacao">
        <div class="subcontainer" :class="{ edit: edit }">
            <div v-if="exibirTitulos" class="titulo">
                <span>
                    <p>{{ dataCompleta }}</p>
                </span>

                <span class="buttons">
                    <span>
                        <p>
                            <span>{{ anotacao.aula }}ª aula - </span>
                            <span class="disciplina">{{ disciplina }}</span>
                        </p>
                    </span>

                    <span class="lnk" @click="definirEdit(true)" v-if="!edit">
                        <p>Editar</p>
                    </span>

                    <span class="lnk" @click="alternarPreview()" v-if="edit">
                        <p>{{ preview ? 'Editar' : 'Visualizar' }}</p>
                    </span>
                    <span v-if="edit">|</span>
                    <span class="lnk" v-if="edit" @click="salvar()">
                        <p>Salvar</p>
                    </span>
                    <span v-if="edit">|</span>
                    <span class="lnk" @click="definirEdit(false)" v-if="edit">
                        <p>Cancelar</p>
                    </span>
                </span>

            </div>

            <div v-if="edit && !preview" class="conteudo_edit">
                <textarea v-model.trim="conteudo_edit" autofocus ref="ta"></textarea>
                <span class="lnk" @click="help = !help">Como formatar esta anotação?</span>
                <span class="help" v-if="help">
                        <br />
                        <br />
                        As anotações utilizam o padrão de formatação <a href="https://www.google.com/search?q=markdown+basic+syntax" target="_blank" class="lnk" style="margin: 0;">Markdown</a><br />
                        veja alguns exemplos:
                        <br />
                        <br />
                        <strong># Título 1</strong><br />
                        <b>## Título 2</b><br />
                        &nbsp;&nbsp;&nbsp;&nbsp;> Indentação 1<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>> Indentação 2<br />
                        
                        <b>**Negrito**</b><br />
                        <span style="font-style: italic;">*itálico*</span><br />
                        * Lista - Item 1<br />
                        * Lista - Item 2<br />
                        --- linha horizontal<br />
                        <hr style="size: 1px" />
                </span>
            </div>
            <div v-if="!edit || preview" class="conteudo_view" :class="{ borda: exibirTitulos, preview: preview }">
                <span v-html="conteudo_view" :class="{ sem_anotacao: conteudo_view == '-- sem anotação --' }"></span>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dia from '@/Models/Dia';
import Anotacao from '@/Models/Anotacao';
import MarkdownIt from 'markdown-it';
import Api from '@/api/Api';


export default defineComponent({
    name: 'AnotacaoComponent',

    props: {
        anotacao: Anotacao,
        disciplina: String,
        exibirTitulos: Boolean
    },

    data(): {
        api: Api,
        edit: boolean,
        preview: boolean,
        dataCompleta: string | undefined,
        conteudo_view: string | undefined,
        conteudo_edit: string | undefined,
        help: boolean,
        md: MarkdownIt
    } {
        return {
            api: new Api(this.axios),
            edit: false,
            preview: false,
            dataCompleta: undefined,
            conteudo_view: undefined,
            conteudo_edit: undefined,
            help: false,
            md: new MarkdownIt({
                xhtmlOut: true,
                breaks: true,
                linkify: true
            })
        }
    },

    emits: ['editando'],

    methods: {
        definirDataCompleta(anotacao: Anotacao | undefined) {
            if (anotacao?.data) {
                let data = new Date(anotacao.data).toISOString().substring(0, 10);
                let dt = new Date(`${data}T00:00:00.000-03:00`);
                this.dataCompleta = Dia.dataCompleta(dt);
            } else {
                return undefined;
            }
        },
        definirConteudo(anotacao: Anotacao | undefined) {
            if (anotacao?.anotacao) {
                this.conteudo_edit = anotacao.anotacao;
                this.conteudo_view = this.md.render(this.conteudo_edit);
            } else {
                this.conteudo_edit = undefined;
                this.conteudo_view = '-- sem anotação --';
            }
        },
        definirEdit(edit: boolean) {
            this.definirConteudo(this.anotacao);
            this.edit = edit;
            this.$emit('editando', this.edit);
            this.preview = false;
            this.help = false;
        },
        alternarPreview() {
            this.preview = !this.preview;
            if (this.preview)
                this.conteudo_view = this.conteudo_edit == undefined || this.conteudo_edit == '' ? '-- sem anotação --' : this.md.render(this.conteudo_edit);
        },
        async salvar() {
            this.anotacao!.anotacao = this.conteudo_edit;
            let anotacao_db = await this.api.salvarAnotacao(this.anotacao!);
            this.anotacao!.id = anotacao_db.id;
            this.definirEdit(false);
        }
    },

    mounted() {
        this.definirDataCompleta(this.anotacao);
        this.definirConteudo(this.anotacao);
    },

    watch: {
        anotacao(newAnotacao: Anotacao | undefined) {
            this.definirDataCompleta(newAnotacao);
            this.definirConteudo(newAnotacao);
        }
    }

})
</script>

<style scoped>
section.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 5px 18px 5px;
}

section.container.edit {
    position: fixed;
    top: var(--header-height);
    width: 100vw;
    height: calc(100vh - var(--header-footer-height) - 10px);
    background-color: white;
    padding: 10px 0 0 0;
    overflow-y: auto;
}

div.subcontainer {
    width: 100%;
    max-width: 600px;
}

div.subcontainer.edit {
    width: calc(100% - 10px);
    padding: 0 5px 0px 5px;
}

.titulo {
    display: flex;
    flex-direction: column;
    font-size: 10pt;
}

.disciplina {
    font-weight: bold;
}

span p {
    margin: 0;
}

span.buttons {
    display: flex;
    flex-direction: row;
    align-items: end;
}

span.buttons span:first-child {
    flex-grow: 1;
}

.lnk {
    cursor: pointer;
    margin: 0 10px 0 10px;
    color: var(--lnk-color);
}

.editar:hover {
    text-shadow: 0 0 1px var(--lnk-hover-color);
    text-decoration: underline;
    text-decoration-thickness: .01px;
}

.conteudo_view {
    margin: 5px 0 5px 0;
    padding: 6px;
}

.conteudo_edit {
    margin: 5px 0 0 0;
    padding: 0 3px 0 0;
    font-size: 10pt;
}

@media only screen and (hover: none) and (pointer: coarse) {
    .conteudo_view.preview {
        margin: 5px 0 65px 0;
        padding: 6px;
    }

    .conteudo_edit {
        margin: 5px 0 0 0;
        padding: 0 3px 0 0;
    }

}

.conteudo_view.borda {
    border: 1px solid var(--input-border-color);
    border-radius: 5px;
}

.sem_anotacao {
    font-size: 10pt;
    color: gray;
    font-style: italic;
}

textarea {
    font-family: var(--font-family);
    font-size: 14px;
    width: calc(100% - 10px);
    height: 350px;
    border: 1px solid var(--input-border-color);
    border-radius: 5px;
    padding: 6px;
}

span.help {
    padding: 5px 0 60px 10px;
}

</style>