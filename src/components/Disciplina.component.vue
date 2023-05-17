<template>
    <form @submit.prevent="submit()" @reset.prevent="reset()">
        <input type="text" id="disciplina" v-model="disciplina.disciplina" />

        <span v-if="!disciplinaSelecionada">
            <button type="submit" id="add">Incluir</button>
        </span>
        <span v-else>
            <button type="submit" id="upd">Salvar</button>
            <button type="button" id="del" @click="del()">Excluir</button>
            <button type="reset" id="abt">Cancelar</button>
        </span>

        <br />
        <table>
            <tbody>
                <tr v-for="disciplina in disciplinas" @click="selecionar(disciplina)">
                    <td :class="{ selecionada: disciplinaAtiva(disciplina) }">{{ disciplina.disciplina }}</td>
                </tr>
            </tbody>
        </table>
    </form>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Disciplina from '@/models/Disciplina'
import DefaultResponse from '@/api/DefaultResponse';

export default defineComponent({
    name: 'DisciplinaComponent',

    data(): {
        api: string,
        result: string | undefined,
        disciplina: Disciplina,
        disciplinaSelecionada: Disciplina | undefined,
        disciplinas: Disciplina[]
    } {
        return {
            api: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_DISCIPLINA,
            result: undefined,
            disciplina: new Disciplina(),
            disciplinaSelecionada: undefined,
            disciplinas: new Array<Disciplina>()
        }
    },

    emits: ['disciplinas'],

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

            this.$emit('disciplinas', this.disciplinas);
        },
        async submit() {
            try {
                if (!this.disciplinaSelecionada)
                    await this.axios.post(this.api, this.disciplina);
                else
                    await this.axios.patch(this.api, this.disciplina);

                await this.obter();

            } catch (error: any) {
                let response = error.response.data as DefaultResponse;
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
        await this.obter()
    }
})
</script>

<style scoped>
tr:hover {
    cursor: pointer;
    background-color: aliceblue;
}

.selecionada {
    font-weight: bold;
}
</style>