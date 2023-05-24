<template>
    <div class="tela">
        <section class="form">
            <form @submit.prevent="submit()" @reset.prevent="reset()">

                <span class="field">
                    <label for="disciplina">Disciplina</label>
                    <input type="text" id="disciplina" v-model="disciplina.disciplina" />
                </span>

                <span class="button">
                    <div v-if="!disciplinaSelecionada">
                        <button type="submit" id="add" :disabled="!formValido">Incluir</button>
                    </div>
                    <div v-else>
                        <button type="submit" id="upd" :disabled="!formValido">Salvar</button>
                        <button type="button" id="del" @click="del()">Excluir</button>
                        <button type="reset" id="abt">Cancelar</button>
                    </div>
                    <mark class="error" v-if="result">{{ result }}</mark>
                </span>
            </form>
        </section>


        <section class="table">
            <div>
                <table>
                    <tbody>
                        <tr v-for="disciplina in disciplinas" @click="selecionar(disciplina)">
                            <td :class="{ selecionada: disciplinaAtiva(disciplina) }">{{ disciplina.disciplina }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>


    </div>

    <div class="a" style="display: none;">
        <div class="b">

        </div>
        <div class="c">

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Disciplina from '@/models/Disciplina'
import DefaultResponse from '@/api/DefaultResponse';

export default defineComponent({
    name: 'DisciplinaConfigComponent',

    data(): {
        api: string,
        result: string | undefined,
        disciplina: Disciplina,
        disciplinaSelecionada: Disciplina | undefined,
        disciplinas: Disciplina[] | undefined
    } {
        return {
            api: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_DISCIPLINA,
            result: undefined,
            disciplina: new Disciplina(),
            disciplinaSelecionada: undefined,
            disciplinas: undefined
        }
    },

    computed: {
        formValido() {
            if (!this.disciplina.disciplina) {
                return false;
            }

            return true;
        }
    },

    methods: {
        async obter() {
            try {
                let response = await this.axios.get<Disciplina[]>(this.api);
                this.disciplinas = Disciplina.sort(response.data);
            } catch (error: any) {
                this.disciplinas = new Array<Disciplina>();
            }

            this.disciplina = new Disciplina();
            this.disciplinaSelecionada = undefined;
            this.result = undefined;
        },
        async submit() {

            if (this.disciplinas?.find(d => d.disciplina?.toLowerCase() == this.disciplina.disciplina?.toLowerCase()) != undefined) {
                this.result = 'A disciplina informada já existe.';
                return;
            }

            try {
                if (!this.disciplinaSelecionada)
                    await this.axios.post(this.api, this.disciplina);
                else
                    await this.axios.patch(this.api, this.disciplina);

                await this.obter();

            } catch (error: any) {
                console.log(error);
                let response = error.response.data as DefaultResponse;
                console.log(response.message);
                this.result = response.message;
            }
        },
        reset() {
            this.disciplina = new Disciplina();
            this.disciplinaSelecionada = undefined;
        },
        async del() {
            try {
                await this.axios.delete(`${this.api}/${this.disciplina.id}`);
                await this.obter();
            } catch (error: any) {
                let response = error.response.data as DefaultResponse;
                this.result = response.message;
            }
        },
        selecionar(disciplina: Disciplina) {
            this.disciplinaSelecionada = Disciplina.clone(disciplina)
            this.disciplina = this.disciplinaSelecionada
        },
        disciplinaAtiva(disciplina: Disciplina): boolean {
            return this.disciplinaSelecionada?.id == disciplina.id;
        }
    },

    async mounted() {
        await this.obter();
    }
})
</script>

<style scoped>
.a {
    display: flex;
    flex-direction: column;
    background-color: antiquewhite;
    width: 100vw;
    height: calc(100vh - 75px);
}

.b {
    background-color: aqua;
    width: 100%;
    height: 100px;
}

.c {
    background-color: cornflowerblue;
    width: 100%;
    flex-grow: 1;
}

div.tela {
    /* position: sticky;
    top: var(--header-height);
    background-color: white;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--menu-border-color);
    box-shadow: 0 0 2px 2px white; */
    display: flex;
    flex-direction: column;
    background-color: antiquewhite;
    width: 100vw;
    height: calc(100vh - 75px);
}

section.form {
    padding-bottom: 10px;
}

section.table {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: aquamarine;
    flex-grow: 1;
}

section.table div:first-child {
    overflow-y: auto;
    height: 100%;
    width: 100%;
    max-width: 600px;
    background-color: blueviolet;
    display: flex;
    flex-direction: column;
    align-items: center;
}

table {
    width: 100%;


    background-color: red;
    border-collapse: collapse;
    border-left: 10px;
    border-right: 10px;
    border-top: 0;
    border-bottom: 0;
    max-width: 600px;
    border-style: solid;
    border-color: white;
}

table tbody {
    background-color: dodgerblue;
    width: 100%;
    max-width: 600px;
}

table tr {
    border: 1px solid red;
}

table td {
    margin: 10px;
}

tr:hover {
    cursor: pointer;
    background-color: aliceblue;
}

.selecionada {
    font-weight: bold;
}
</style>