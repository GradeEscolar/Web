<template>
    <h3>Configurações - Aulas</h3>

    <form @submit.prevent="salvar()" @reset.prevent="cancelar()">

        <Label for="dia">Dia</Label><br />
        <select id="dia" name="dia" v-model="dia" :disabled="edicao" @change="selecionarDia()">
            <option v-for="dia in dias" :value="dia.dia">{{ dia.nome }}</option>
        </select><br />
        <br />

        <span v-if="!edicao">
            <button type="button" @click="editar()">Editar</button>
        </span>
        <span v-else>
            <button type="submit">Salvar</button>
            <button type="reset">Cancelar</button>
        </span>


        <br />
        <br />


        Aulas<br />
        <table>
            <thead>
                <tr>
                    <th>Aula</th>
                    <th>Disciplina</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="aula in aulas">
                    <td>{{ aula.aula }}</td>
                    <td>
                        <select v-model="aula.id_disciplina" :disabled="!edicao">
                            <option :value="undefined">-- aula vaga --</option>
                            <option v-for="disciplina in disciplinas" :value="disciplina.id">{{ disciplina.disciplina }}
                            </option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
</template>
<script lang="ts">
import Disciplina from '@/models/Disciplina';
import Grade from '@/models/Grade';
import Dia from '@/models/dia';
import Aula from '@/models/aula';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "AulaConfigComponent",

    data(): {
        disciplinas: Disciplina[],
        grade: Grade,
        aulasDb: Aula[],
        aulas: Aula[],
        dia: number
        dias: Dia[],
        edicao: boolean,
    } {
        return {
            disciplinas: [],
            grade: new Grade(),
            aulasDb: [],
            aulas: [],
            dia: 2,
            dias: Dia.montar(),
            edicao: false
        }
    },

    methods: {
        editar() {
            this.edicao = true;
        },
        selecionarDia() {
            this.aulasDb = [{ id: 1, id_grade: this.grade.id, aula: 2, dia: this.dia, id_disciplina: 3 }]
            this.ler();
        },
        salvar() {
            this.edicao = false;
            console.log(this.aulas);
        },
        cancelar() {
            this.edicao = false;
            this.ler();
        },
        ler() {
            
            this.dias = Dia.montarAtivos(this.grade.dias);
            this.aulas = Aula.montar(this.grade, this.aulasDb, this.dia);
            
        },
        persistir() {

        }
    },

    mounted() {
        this.disciplinas = [
            { id: 1, id_usuario: 1, disciplina: 'Artes' },
            { id: 2, id_usuario: 1, disciplina: 'Ciências' },
            { id: 3, id_usuario: 1, disciplina: 'Matemática' }
        ];

        this.grade = { id: 1, id_usuario: 1, dias: '2;3;4;5;6', aulas: 5 };
        this.aulasDb = [{ id: 1, id_grade: this.grade.id, aula: 2, dia: 2, id_disciplina: 3 }]

        this.ler();
        this.dia = this.dias[0].dia;
    },

})
</script>