<template>
  <header>
    <h1>Grade Escolar - {{ page }}</h1>
  </header>

  <nav>
    <div v-if="paginasSeguras.includes(page ?? '')">
      <a @click="goToPage('Grade')">Grade</a> |
      <a @click="goToPage('Anotacoes')">Anotações</a> |
      <a @click="goToPage('Configuracoes')">Configurações</a> |
      <a @click="sair()">Sair</a>
    </div>
    <div v-else>
      <a @click="goToPage('Home')">Home</a> |
      <a @click="goToPage('Login')">Login</a> |
      <a @click="goToPage('Cadastro')">Cadastro</a>
    </div>
  </nav>

  <hr />

  <section>
    <div v-if="page == 'Home'">
      <HomeView @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Login'">
      <LoginView @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Cadastro'">
      <CadastroView @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Grade'">
      <GradeView @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Anotacoes'">
      <AnotacoesView @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Configuracoes'">
      <ConfiguracoesView @go-to-page="goToPage" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HomeView from './views/Home.view.vue';
import LoginView from './views/Login.view.vue';
import CadastroView from './views/Cadastro.view.vue';
import GradeView from './views/Grade.view.vue';
import AnotacoesView from './views/Anotacoes.view.vue';
import ConfiguracoesView from './views/Configuracoes.view.vue';

export default defineComponent({
  name: 'App',

  components: {
    HomeView,
    LoginView,
    CadastroView,
    GradeView,
    AnotacoesView,
    ConfiguracoesView
  },

  data(): {
    page: string | undefined,
    paginasSeguras: string[]
  } {
    return {
      page: undefined,
      paginasSeguras: ['Grade', 'Anotacoes', 'Configuracoes']
    }
  },

  methods: {
    goToPage(page: string) {
      this.page = page;
    },
    sair() {
      localStorage.removeItem('access_token');
      this.goToPage('Home');
    }
  },

  mounted() {
    let page = localStorage.getItem('page');
    if (page) {
      this.page = page;
    } else {
      this.page = 'Home'
    }
  },

  watch: {
    page(newPage: string) {
      localStorage.setItem('page', newPage);
    }
  }

});

</script>

<style>
a {
  cursor: pointer;
}

#app {
  cursor: default;
}
</style>