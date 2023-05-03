<template>
    <div class="container w-75">
        <h3>{{ title }}</h3>
        <form>
            <div class="mb-3">
                <label class="form-label col-form-label-sm m-0">Nome</label>
                <input class="form-control form-control-sm m-0" type="text" v-model="usuario.nome" />
            </div>
            <div class="mb-3">
                <label class="form-label col-form-label-sm m-0">E-mail</label>
                <input class="form-control form-control-sm m-0" type="email" v-model="usuario.email" />
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary btn-sm">Cadastrar</button>
            </div>
        </form>

        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="usuario in usuarios">
                    <td>{{ usuario.nome }}</td>
                    <td>{{ usuario.email }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CadastroView',
    data() {
        return {
            title: 'Cadastro de Alunos',
            usuario: {
                id: null,
                nome: null,
                email: null
            },
            usuarios: []
        }
    },
    mounted() {
        this.axios.get('https://gersonmsj.pythonanywhere.com/login').then((response) => {
            console.log(response.data);
            this.usuarios = response.data;
        })
    }
})
</script>

<style scoped>
h3 {
    text-align: center;
}
</style>