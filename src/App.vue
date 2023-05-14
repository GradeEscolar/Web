<template>
  <div v-if="page == 'Home'">
    <Home @go-to-page="goToPage" />
  </div>
  <div v-if="page == 'About'">
    <About @go-to-page="goToPage" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './components/Home.vue';
import About from './components/About.vue';

export default defineComponent({
  name: 'App',
  components: {
    Home,
    About
  },
  data(): { 
    page: string 
  } {
    return {
      page: 'Home'
    }
  },
  methods: {
    goToPage(page: string){
      this.page = page;
    }
  },
  mounted() {
    let page = localStorage.getItem('page');
    if(page){
      this.page = page;
    }
  },
  watch: {
    page(newPage: string){
      localStorage.setItem('page', newPage);
    }
  }
});
</script>