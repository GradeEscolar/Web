<template>
    <h3>About</h3>
    <button @click="goToPage('Home')">Home</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'About',
    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        }
    }
});
</script>