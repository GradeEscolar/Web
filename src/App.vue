<template>
  <header>
    <h1>Grade Escolar - {{ page }}</h1>
  </header>

  <nav>
    <div v-if="page != 'Grade'">
      <a @click="goToPage('Home')">Home</a> |
      <a @click="goToPage('Cadastro')">Cadastro</a>
    </div>
    <div v-else>
      <a @click="sair()">Sair</a>
    </div>
  </nav>

  <hr />

  <section>
    <div v-if="page == 'Home'">
      <Home @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Cadastro'">
      <Cadastro @go-to-page="goToPage" />
    </div>

    <div v-if="page == 'Grade'">
      <Grade @go-to-page="goToPage" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './views/Home.vue';
import Cadastro from './views/Cadastro.vue';
import Grade from './views/Grade.vue';

export default defineComponent({
  name: 'App',

  components: {
    Home,
    Cadastro,
    Grade
  },

  data(): {
    page: string | undefined
  } {
    return {
      page: undefined
    }
  },

  methods: {
    goToPage(page: string) {
      this.page = page;
    },
    sair() {
      localStorage.removeItem('token');
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