<template>
    <p>Anotações</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Anotacoes',

    data(): {
        access_token: string | undefined
    } {
        return {
            access_token: undefined
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        }
    },

    mounted() {
        let access_token = localStorage.getItem('access_token');
        if (access_token) {
            this.access_token = access_token;
        } else {
            this.goToPage('Home');
        }
    },
});
</script>