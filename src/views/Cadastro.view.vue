<template>
    <section class="form">
        <form @submit.prevent="cadastrarUsuario">
            <div class="field">
                <label for="nome">Nome</label>
                <input type="text" id="nome" v-model="usuario.nome" :pattern="nomePattern.source" />
            </div>
            
            <div class="field">
                <label for="email">E-Mail</label>
                <input type="email" id="email" v-model="usuario.email" :pattern="emailPattern.source" autocomplete="email" />
            </div>
            
            <div class="field">
                <label for="email">Senha</label>
                <input type="password" id="senha" v-model="usuario.senha" :pattern="senhaPattern.source" autocomplete="new-password"/>
            </div>
            
            <div class="button">
                <button type="submit" :disabled="!formValido">Cadastrar</button>
                <mark v-if="submitResult">{{ submitResult }}</mark>
            </div>
        </form>
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
        usuario: Usuario,
        usuarios: Usuario[],
        apiUsuario: string,
        submitResult: string | undefined,
        nomePattern: RegExp,
        emailPattern: RegExp,
        senhaPattern: RegExp
    } {
        return {
            usuario: new Usuario(),
            usuarios: new Array<Usuario>(),
            apiUsuario: process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_USUARIO,
            submitResult: undefined,
            nomePattern: new RegExp('.{4,}'),
            emailPattern: new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
            senhaPattern: new RegExp('.{4,}')
        }
    },

    computed: {
        formValido() {
            if (!this.usuario.email || !this.usuario.senha || !this.usuario.nome){
                return false;
            }

            let nomeValido = this.nomePattern.test(this.usuario.nome);
            let emailValido = this.emailPattern.test(this.usuario.email);
            let senhaValida = this.senhaPattern.test(this.usuario.senha);
            return nomeValido && emailValido && senhaValida;
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