<template>
    <fieldset>
        <legend>Disciplinas</legend>
        <DisciplinaComponent @disciplinas="vincularDisciplinas" />
    </fieldset>
    <br />
    <fieldset>
        <legend>Grade</legend>
        <GradeComponent :disciplinas="disciplinas" />
    </fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DisciplinaComponent from '@/components/Disciplina.component.vue';
import GradeComponent from '@/components/Grade.component.vue';
import Auth from '@/api/Auth'
import Disciplina from '@/models/Disciplina';

export default defineComponent({
    name: 'ConfiguracoesView',

    components: { DisciplinaComponent, GradeComponent },

    data(): {
        disciplinas: Disciplina[]
    } {
        return {
            disciplinas: new Array<Disciplina>()
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        vincularDisciplinas(disciplinas: Disciplina[]) {
            this.disciplinas = disciplinas;
        }
    },

    mounted() {
        if (!Auth.autenticado())
            this.goToPage('Login');
    }
});
</script>