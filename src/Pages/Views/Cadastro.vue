<template>
    <section class="form">
        <form @submit.prevent="cadastrarUsuario">
            <div class="field">
                <label for="nome">Nome</label>
                <input type="text" id="nome" v-model="usuario.nome" @keypress="clearResult()" @change="clearResult()" />
            </div>
            
            <div class="field">
                <label for="email">E-Mail</label>
                <input type="email" id="email" v-model="usuario.email" autocomplete="email" @keypress="clearResult()" @change="clearResult()" />
            </div>
            
            <div class="field">
                <label for="email">Senha</label>
                <input type="password" id="senha" v-model="usuario.senha" autocomplete="new-password" @keypress="clearResult()" @change="clearResult()"/>
            </div>
            
            <div class="button">
                <button type="submit">Cadastrar</button>
                <mark v-if="result">{{ result }}</mark>
            </div>
        </form>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Usuario from '@/Models/Usuario';
import UsuarioService from '@/Services/UsuarioService';

export default defineComponent({
    name: 'CadastroView',

    data(): {
        service: UsuarioService,
        usuario: Usuario,
        result: string | undefined,
        nomePattern: RegExp,
        emailPattern: RegExp,
        senhaPattern: RegExp
    } {
        return {
            service: new UsuarioService(this.axios),
            usuario: new Usuario(),
            result: undefined,
            nomePattern: /.{4,}/,
            emailPattern: /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
            senhaPattern: /.{4,}/
        }
    },

    computed: {
        
    },
    emits: ['goToPage'],
    methods: {
        goToPage(page: string) {
            this.$emit('goToPage', page);
        },

        formValido() {
            if (!this.usuario.email || !this.usuario.senha || !this.usuario.nome){
                return false;
            }

            let nomeValido = this.nomePattern.test(this.usuario.nome);
            let emailValido = this.emailPattern.test(this.usuario.email);
            let senhaValida = this.senhaPattern.test(this.usuario.senha);
            return nomeValido && emailValido && senhaValida;
        },

        async cadastrarUsuario() {
            this.result = undefined;
            this.usuario.id = undefined;

            if(!this.formValido()){
                this.result = "Os dados informados são inválidos.";
                return;
            }

            try {
                await this.service.cadastrar(this.usuario);
                this.usuario = new Usuario();
                this.result = "Ok!";
            }
            catch (error: any) {
                this.result = error ?? 'Falha ao cadastrar usuário!';
            }
        },
        
        clearResult() {
            if(this.result)
                this.result = undefined;
        }
    }
});
</script>