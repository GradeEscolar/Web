<template>
    <h3>Grade Escolar</h3>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeView',
    components: {
    },
    data(): {
    } {
        return {
        };
    },
    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        }
    },
    
});
</script>