<template>
    <section>
        <form @submit.prevent="cadastrarUsuario">
            <label for="nome">Nome</label><br />
            <input type="text" id="nome" v-model="usuario.nome" /><br />
            <br />
            <label for="email">E-Mail</label><br />
            <input type="email" id="email" v-model="usuario.email" /><br />
            <br />
            <label for="email">Senha</label><br />
            <input type="password" id="senha" v-model="usuario.senha" /><br />
            <br />
            <button type="submit">Enviar</button><br />
            <br />
            <mark v-if="submitResult">{{ submitResult }}</mark>
        </form>
    </section>
    <br />
    <section>
        <tabela-usuarios :usuarios="usuarios" />
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Usuario from '@/models/Usuario';
import DefaultResponse from '@/api/DefaultResponse';
import TabelaUsuarios from '@/components/TabelaUsuarios.vue';

export default defineComponent({
    name: 'CadastroView',
    components: {
        TabelaUsuarios
    },
    data(): {
        usuario: Usuario;
        usuarios: Usuario[];
        apiUsuario: string;
        submitResult: string | undefined;
    } {
        return {
            usuario: new Usuario(),
            usuarios: new Array<Usuario>(),
            apiUsuario: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_USUARIO,
            submitResult: undefined
        }
    },
    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },
        async cadastrarUsuario() {
            this.submitResult = undefined;
            this.usuario.id = undefined;
            try {
                let response = await this.axios.post<DefaultResponse>(this.apiUsuario, this.usuario);
                this.usuario = new Usuario();
                this.usuarios = await this.obterUsuarios();
                this.submitResult = "Ok!";
            }
            catch (error: any) {
                let response = error.response.data as DefaultResponse;
                this.submitResult = response.message;
            }
        },
        async obterUsuarios() {
            let response = await this.axios.get<Usuario[]>(this.apiUsuario);
            return response.data;
        }
    },
    async mounted() {
        this.usuarios = await this.obterUsuarios();
    }
});
</script>