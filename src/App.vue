<template>
  <header>
    <HeaderComponent @go-to-page="goToPage" :page="page" />
  </header>

  <main>

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

      <div v-if="page == 'Menu'">
        <MenuView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'Aula'">
        <AulaView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'Anotacoes'">
        <AnotacoesView @go-to-page="goToPage" />
      </div>

      <div v-if="page == 'DisciplinaConfig'">
        <DisciplinaConfigView />
      </div>

      <div v-if="page == 'GradeConfig'">
        <GradeConfigView />
      </div>

      <div v-if="page == 'AulaConfig'">
        <AulaConfigView />
      </div>
    </section>

  </main>

  <footer>
    <p>
      Grade Escolar 2023 - v 0.1
    </p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from './components/header.component.vue';
import HomeView from './views/Home.view.vue';
import LoginView from './views/Login.view.vue';
import CadastroView from './views/Cadastro.view.vue';
import MenuView from './views/Menu.view.vue';
import AulaView from './views/Aula.view.vue';
import AnotacoesView from './views/Anotacoes.view.vue';
import DisciplinaConfigView from './views/DisciplinaConfig.view.vue';
import GradeConfigView from './views/GradeConfig.view.vue';
import AulaConfigView from './views/AulaConfig.view.vue';

export default defineComponent({
  name: 'App',

  components: {
    HeaderComponent,
    HomeView,
    LoginView,
    CadastroView,
    MenuView,
    AulaView,
    AnotacoesView,
    DisciplinaConfigView,
    GradeConfigView,
    AulaConfigView
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
      localStorage.removeItem('access_token');
      this.goToPage('Home');
    }
  },

  mounted() {

    let page = localStorage.getItem('page');
    if (page) {
      this.page = page;
    } else {
      localStorage.setItem('page', 'Home')
      this.page = 'Home'
    }

    this.axios.interceptors.request.use(
      config => {
        let access_token = localStorage.getItem('access_token');
        if (access_token)
          config.headers.Authorization = `Bearer ${access_token}`;

        return config;
      },
      error => Promise.reject(error)
    )

    this.axios.interceptors.response.use(
      value => value,
      error => {
        if (error.response.status == 422 || error.response.status == 401) {
          localStorage.removeItem('access_token');
          this.goToPage('Login')
        }

        return Promise.reject(error);
      }
    )
  },

  watch: {
    page(newPage: string) {
      localStorage.setItem('page', newPage);
    }
  }

});

</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Indie+Flower&family=Lobster+Two&family=Sacramento&display=swap');

:root {
  --header-height: 60px;
  --header-icon-box-border-color: rgb(40, 50, 55);
  --header-icon-box-text-color: rgb(40, 50, 55);
  --header-icon-box-backgroud-color: rgb(240, 250, 255);
  --header-background-color: rgb(70, 70, 70);
  --header-text-color: rgb(210, 210, 210);
  --button-background-color: rgb(60, 60, 150);
  --button-background-color-disabled: rgb(140, 140, 150);
  --button-text-color: rgb(240, 240, 240);
  --menu-border-color: rgb(40, 50, 55);
  --menu-background-color: rgb(240, 250, 255);
  --lnk-hover-color: rgb(0, 60, 155);
  --lnk-color: rgb(0, 60, 155);
  --input-invalid-background-color: rgb(255, 250, 250);
  --input-invalid-border-color: rgb(150, 0, 0);
}

html {
  font-family: 'Didact Gothic', sans-serif;
}

body {
  margin: 0;
}

#app {
  cursor: default;
  display: flex;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

main {
  flex-grow: 1;
  position: relative;
  top: 60px;
  z-index: 0;
}

footer {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: right;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  z-index: 1;
  background-color: rgb(250, 250, 250);
}

footer p {
  color: rgb(150, 170, 175);
  font-size: 7pt;
  padding: 2px 10px 2px 0;
  margin: 0;
}

/* Form */
section.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  width: 100%;
  max-width: 600px;
}

form span {
  display: flex;
  margin: 15px 10px 0 10px;
}

form span.field {
  flex-direction: column;
}

form span.button {
  flex-direction: row;
}

label {
  padding-left: 5px;
  padding-bottom: 2px;
}

input,
button {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid gray;
  font-size: 10pt;
}

input:invalid {
  border-color: var(--input-invalid-border-color);
  background-color: var(--input-invalid-background-color);
}

button {
  max-width: 150px;
  min-width: 100px;
  margin-right: 10px;
  border: 1px solid var(--button-background-color);
  background-color: var(--button-background-color);
  color: var(--button-text-color);
  cursor: pointer;
}

button:disabled {
  background-color: var(--button-background-color-disabled);
  cursor: default;
}

mark {
  background-color: white;
  border: 1px solid;
  border-radius: 5px;
  flex-grow: 1;
  padding: 4px;
  font-size: 10pt;
}

mark.error {
  border-color: rgb(255, 100, 0);
}
</style>