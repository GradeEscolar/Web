<template>
    <h3>Home</h3>
    <button @click="goToPage('About')">About</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Home',
    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        }
    }
});
</script>