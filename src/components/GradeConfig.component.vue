<template>
    <h3>Configurações - Grade</h3>
    <form @submit.prevent="persistirGrade()" @reset.prevent="lerGrade()">
        Dias de aula<br />
        <div v-for="dia in dias">
            <input type="checkbox" :id="dia.nome" :value="dia.dia" v-model="dia.nome" :name="dia.nome" />
            <label :for="dia.nome">{{ dia.nome }}</label>
            <br />
        </div>

        <br />

        Aulas por dia<br />
        <input type="number" id="aulas" name="aulas" min="1" max="10" step="1" required v-model.number="aulas"/><br />
        <br />

        <button type="submit" id="submit">Salvar</button>
        <button type="reset" id="reset">Cancelar</button>
    </form>
</template>
<script lang="ts">
import Grade from '@/models/Grade';
import Dia from '@/models/dia';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "GradeConfigComponent",

    data(): {
        grade: Grade,
        aulas: number,
        dia: Dia,
        dias: Dia[]
    } {
        return {
            grade: new Grade(),
            aulas: 5,
            dia: new Dia(),
            dias: Dia.montar()
        }
    },

    methods: {
        lerGrade() {
            this.dias = Dia.montarTodos(this.grade.dias);
            this.aulas = this.grade.aulas!
        },
        persistirGrade() {
            this.grade.dias = Dia.desmontar(this.dias);
            this.grade.aulas = this.aulas;
        }
    },

    mounted() {
        this.grade.aulas = 3;
        this.grade.dias = '2;3;4';
        
        this.lerGrade();
    }
})
</script>