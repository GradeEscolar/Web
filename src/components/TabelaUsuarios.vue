<template>
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>E-mail</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="usuario in usuarios" @click="selecionarUsuario(usuario)" :class="{ 'seta': exibirEntrar }">
        <td>{{ usuario.nome }}</td>
        <td>{{ usuario.email }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Usuario from '@/classes/Usuario';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TabelaUsuarios',
  props: {
    exibirEntrar: Boolean,
    usuarios: Array as () => Usuario[]
  },
  data(): {
    usuario: Usuario | undefined
  } {
    return {
      usuario: undefined
    }
  },
  emits: ['goToPage'],
  methods: {
    goToPage(page: string) {
      this.$emit('goToPage', page);
    },
    selecionarUsuario(usuario: Usuario) {
      if (this.exibirEntrar) {
        localStorage.setItem('token', usuario.id!.toString());
        this.goToPage('Grade');
      }
    }
  }
})
</script>
<style scoped>
table {
  padding: 0 10px 0 10px;
  border-radius: 5px;
  border-spacing: 0px;
  border: 1px solid gray;
}

table th td {
  border-collapse: collapse;
}

.seta:hover {
  cursor: pointer !important;
  background-color: aliceblue;
}

th,
td {
  padding: 10px;
  text-align: start;
}

tbody td {
  border-top: 1px solid gray;
}

th {
  text-align: start;
}
</style>
