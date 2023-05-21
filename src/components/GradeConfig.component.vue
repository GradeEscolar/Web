<template>
    <h3>Configurações - Grade</h3>
    <form @submit.prevent="persistirGrade()" @reset.prevent="lerGrade()">
        Dias de aula<br />
        <div v-for="dia in dias">
            <input type="checkbox" :id="dia.nome" :value="dia.dia" v-model="dia.ativo" :name="dia.nome" :disabled="!hasData" />
            <label :for="dia.nome">{{ dia.nome }}</label>
            <br />
        </div>

        <br />

        Aulas por dia<br />
        <input type="number" id="aulas" name="aulas" min="1" max="10" step="1" required v-model.number="aulas" :disabled="!hasData"/><br />
        <br />

        <button type="submit" id="submit">Salvar</button>
        <button type="reset" id="reset">Cancelar</button><br />
        
        <br />

        <mark v-if="result">{{ result }}</mark>

    </form>
</template>
<script lang="ts">
import DefaultResponse from '@/api/DefaultResponse';
import Grade from '@/models/Grade';
import Dia from '@/models/Dia';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "GradeConfigComponent",

    data(): {
        api: string,
        hasData: boolean, 
        grade: Grade,
        aulas: number,
        dias: Dia[],
        result: string | undefined
    } {
        return {
            api: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_GRADE, 
            hasData: false,
            grade: new Grade(),
            aulas: 0,
            dias: Dia.montar(),
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
            await this.axios.patch<DefaultResponse>(this.api, this.grade);
            this.result = "Grade salva!";
        },
        async obterGrade() {
            let response = await this.axios.get<Grade>(this.api);
            this.grade = response.data;
            this.lerGrade();
            this.hasData = true;
        }
    },

    async mounted() {
        await this.obterGrade();
    }
})
</script>