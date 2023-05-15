<template>
    <h3>Grade Escolar</h3>
    <tabela-usuarios :usuarios="usuarios" exibir-entrar @go-to-page="goToPage" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TabelaUsuarios from '@/components/TabelaUsuarios.vue';
import Usuario from '@/classes/Usuario';

export default defineComponent({
    name: 'Home',
    components: {
        TabelaUsuarios
    },
    data(): {
        usuario: Usuario,
        usuarios: Usuario[],
        apiUsuario: string;
    } {
        return {
            usuario: new Usuario(),
            usuarios: new Array<Usuario>(),
            apiUsuario: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_USUARIO,
        };
    },
    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async obterUsuarios() {
            let response = await this.axios.get<Usuario[]>(this.apiUsuario);
            return response.data;
        }
    },
    async mounted() {
        this.usuarios = await this.obterUsuarios();
    },
});
</script>