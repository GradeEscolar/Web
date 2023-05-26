<template>
    <section class="form">
        <form @submit.prevent="persistirGrade()" @reset.prevent="lerGrade()">

            <label class="checkboxlist">Dias de aula</label>
            <div class="checkboxlist">
                <span v-for="dia in dias">
                    <input type="checkbox" :id="dia.nome" :value="dia.dia" v-model="dia.ativo" :name="dia.nome"
                        :disabled="!hasData" @change="validar(dia)" />
                    <label :for="dia.nome">{{ dia.nome }}</label>
                </span>
            </div>

            <div class="field">
                <label for="aulas">Aulas por dia</label>
                <input type="number" id="aulas" name="aulas" min="1" max="10" step="1" required v-model.number="aulas"
                    :disabled="!hasData" />
            </div>

            <div class="button">
                <button type="submit" id="submit">Salvar</button>
                <button type="reset" id="reset">Cancelar</button>
                <mark v-if="result">{{ result }}</mark>
            </div>

        </form>

    </section>
</template>

<script lang="ts">
import DefaultResponse from '@/api/DefaultResponse';
import Grade from '@/models/Grade';
import Dia from '@/models/Dia';
import { defineComponent } from 'vue';
import Api from '@/api/Api';

export default defineComponent({
    name: "GradeConfigComponent",

    data(): {
        api: Api,
        hasData: boolean,
        grade: Grade,
        aulas: number,
        dias: Dia[],
        result: string | undefined
    } {
        return {
            api: new Api(this.axios),
            hasData: false,
            grade: new Grade(),
            aulas: 0,
            dias: Dia.dias(),
            result: undefined
        }
    },

    methods: {
        lerGrade() {
            this.dias = Dia.montarTodos(this.grade.dias);
            this.aulas = this.grade.aulas
        },
        async persistirGrade() {
            this.grade.dias = Dia.desmontar(this.dias);
            this.grade.aulas = this.aulas;
            await this.axios.patch<DefaultResponse>(this.api.grade, this.grade);
            this.result = "Grade salva!";
        },
        async obterGrade() {
            let response = await this.axios.get<Grade>(this.api.grade);
            this.grade = response.data;
            this.lerGrade();
            this.hasData = true;
        },
        validar(dia: Dia) {
            if(this.dias.find(d => d.ativo) == undefined) {
                dia.ativo = true;
            }
        }
    },

    async mounted() {
        await this.obterGrade();
    }
})
</script>