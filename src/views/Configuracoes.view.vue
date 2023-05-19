<template>
    <nav>
        <a @click="goToConfig('disciplina')">Disciplinas</a> |
        <a @click="goToConfig('grade')">Grade</a> |
        <a @click="goToConfig('aula')">Aulas</a>
    </nav>
    <hr />
    <div v-if="config == 'disciplina'">
        <DisciplinaConfigComponent />
    </div>
    <div v-if="config == 'grade'">
        <GradeConfigComponent />
    </div>
    <div v-if="config == 'aula'">
        <AulaConfigComponent />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DisciplinaConfigComponent from '@/components/DisciplinaConfig.component.vue';
import GradeConfigComponent from '@/components/GradeConfig.component.vue';
import AulaConfigComponent from '@/components/AulaConfig.component.vue';
import Auth from '@/api/Auth'
import Disciplina from '@/models/Disciplina';

export default defineComponent({
    name: 'ConfiguracoesView',

    components: { DisciplinaConfigComponent, GradeConfigComponent, AulaConfigComponent },

    data(): {
        config: string,
        disciplinas: Disciplina[]
    } {
        return {
            config: 'disciplina',
            disciplinas: new Array<Disciplina>()
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        goToConfig(config: string) {
            this.config = config;
        },
        vincularDisciplinas(disciplinas: Disciplina[]) {
            this.disciplinas = disciplinas;
        }
    },

    mounted() {
        if (!Auth.autenticado())
            this.goToPage('Login');

        let config = localStorage.getItem('config');
        if (config) {
            this.config = config;
        } else {
            localStorage.setItem('page', 'disciplina')
            this.config = 'disciplina'
        }
    },

    watch: {
        config(newConfig: string) {
            localStorage.setItem('config', newConfig);
        }
    }
});
</script>