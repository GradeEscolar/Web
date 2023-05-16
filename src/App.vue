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
      <Home @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Login'">
      <Login @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Cadastro'">
      <Cadastro @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Grade'">
      <Grade @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Anotacoes'">
      <Anotacoes @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Configuracoes'">
      <Configuracoes @go-to-page="goToPage" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Cadastro from './views/Cadastro.vue';
import Grade from './views/Grade.vue';
import Anotacoes from './views/Anotacoes.vue';
import Configuracoes from './views/Configuracoes.vue';

export default defineComponent({
  name: 'App',

  components: {
    Home,
    Login,
    Cadastro,
    Grade,
    Anotacoes,
    Configuracoes
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