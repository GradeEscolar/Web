<template>
    <p>Token: {{ token }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Usuario from '@/classes/Usuario';
import DefaultResponse from '@/classes/DefaultResponse';

export default defineComponent({
    name: 'Grade',

    data(): {
        token: string | undefined
    } {
        return {
            token: undefined
        }
    },

    emits: ['goToPage'],

    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        }
    },

    mounted() {
        let token = localStorage.getItem('token');
        if (token) {
            this.token = token;
        } else {
            this.goToPage('Home');
        }
    },
});
</script>