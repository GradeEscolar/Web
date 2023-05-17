<template></template>
<script lang="ts">
import Disciplina from '@/models/Disciplina';
import Grade from '@/models/Grade';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "GradeComponent",

    props: {
        disciplinas: Array as () => Disciplina[]
    },

    data(): {
        grade: Grade
    } {
        return {
            grade: new Grade()
        }
    },

    methods: {
        async obterGrade() {
            try {
                
            } catch (error: any) {
                
            }
        }
    }
})
</script>