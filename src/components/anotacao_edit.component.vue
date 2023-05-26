<template>
    <section class="anotacao_view">
        <div>
            
        </div>
    </section>
</template>

<script lang="ts">
import Aula from '@/models/Aula';
import Disciplina from '@/models/Disciplina';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AnotacaoEditComponent',

    props: {
        aula: Aula,
        disciplina: Disciplina
    }

})
</script>

<style scoped>

</style>