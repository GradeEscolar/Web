<template>
    <section>
        <form @submit.prevent="signIn">
            <label for="email">E-Mail</label><br />
            <input type="email" id="email" v-model="usuario.email" /><br />
            <br />
            <label for="email">Senha</label><br />
            <input type="password" id="senha" v-model="usuario.senha" /><br />
            <br />
            <button type="submit">Entrar</button><br />
            <br />
            <mark v-if="result">{{ result }}</mark>
        </form>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Usuario from '@/classes/Usuario';
import TokenResponse from '@/classes/TokenResponse'
import DefaultResponse from '@/classes/DefaultResponse';

export default defineComponent({
    name: 'Login',

    data(): {
        api: string,
        result: string | undefined,
        usuario: Usuario
    } {
        return {
            api: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_LOGIN,
            result: undefined,
            usuario: new Usuario()
        }
    },

    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },

        async signIn() {
            try {
                this.result = undefined;
                let response = await this.axios.post<TokenResponse>(this.api, this.usuario);
                this.usuario = new Usuario();
                localStorage.setItem('access_token', response.data.access_token);
                this.goToPage('Grade');
            }
            catch (error: any) {
                let response = error.response.data as DefaultResponse;
                this.result = response.message;
            }
        }
    }

})
</script>