<template>
    <div class="formFix">
        <section class="form">
            <form @submit.prevent="submit()" @reset.prevent="reset()">

                <div class="field">
                    <label for="disciplina">Disciplina</label>
                    <input type="text" id="disciplina" v-model="disciplina.disciplina" />
                </div>

                <div class="button">
                    <span v-if="!disciplinaSelecionada">
                        <button type="submit" id="add" :disabled="!formValido">Incluir</button>
                    </span>
                    <span v-else>
                        <button type="submit" id="upd" :disabled="!formValido">Salvar</button>
                        <button type="button" id="del" @click="del()">Excluir</button>
                        <button type="reset" id="abt">Cancelar</button>
                    </span>
                    <mark class="error" v-if="result">{{ result }}</mark>
                </div>
            </form>
        </section>
    </div>

    <section class="table">
        <table>
            <tbody>
                <tr class="hover" v-for="disciplina in disciplinas" @click="selecionar(disciplina)">
                    <td :class="{ selecionada: disciplinaAtiva(disciplina) }">{{ disciplina.disciplina }}</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Disciplina from '@/models/Disciplina'
import DefaultResponse from '@/api/DefaultResponse';
import Api from '@/api/Api';

export default defineComponent({
    name: 'DisciplinaConfigComponent',

    data(): {
        api: Api,
        result: string | undefined,
        disciplina: Disciplina,
        disciplinaSelecionada: Disciplina | undefined,
        disciplinas: Disciplina[] | undefined
    } {
        return {
            api: new Api(this.axios),
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
        async obter(): Promise<void> {
            try {
                let response = await this.axios.get<Disciplina[]>(this.api.disciplina);
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
                    await this.axios.post(this.api.disciplina, this.disciplina);
                else
                    await this.axios.patch(this.api.disciplina, this.disciplina);

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
                await this.axios.delete(`${this.api.disciplina}/${this.disciplina.id}`);
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
div.formFix {
    position: sticky;
    top: var(--header-height);
    background-color: white;
    border-bottom: 1px solid var(--menu-border-color);
    box-shadow: 0 0 2px 2px white;
}


</style>