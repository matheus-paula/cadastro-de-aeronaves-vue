<template>
  <div>
    <h1>Gestão de Aeronaves</h1>
    <div class="container mt-5">
      <div class="row w-50 m-auto p-4 align-items-center rounded-3 border shadow-lg">
        <h2>Adicionar Aeronave</h2>
        <form v-on:submit="submitAeronave" name="aeronave" class="text-start">
            <div class="row">
              <div class="col-12 input-group">
                <span class="input-group-text">Modelo</span>
                <input required  v-model="form.modelo"  type="text" class="form-control" id="aircraft" placeholder="E170">
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <div class=" input-group">
                  <span class="input-group-text">Marca</span>
                  <select required v-model="form.marca"  id="brand" class="form-select" aria-label="Marca">
                    <Brands/>
                  </select>
                </div>
              </div>
            </div>
            <div class="row mt-3 align-items-end">
              <div class="col-6">
                <div class="input-group">
                  <span class="input-group-text">Ano</span>
                  <select required v-model="form.ano" class="form-select" id="year-field">
                    <option  disabled value="">Selecione o ano de fabricação</option>
                    <option  :value="year" v-for="year in years" :key="year">{{ year }}</option>  
                  </select>
                </div>
              </div>
              <div class="col-4">
                <div class="input-group">
                  <div class="pb-1 input-group-text">
                    <input required v-model="form.vendido"  class="form-check-input" type="checkbox" id="sold">                  
                  </div>
                  <label class="form-control bg-white" for="sold">Vendido</label>
                </div>
              </div>
              <div class="col-2 text-end">
                  <button class="btn btn-primary" type="submit">Salvar</button>
              </div>          
            </div>
        </form>
        <hr class="mt-5"/>
        <div class="row">
          <div class="col-12">
            <p>Resumo</p>
          
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="input-group mb-3">
              <input v-model="searchTerm" type="text" class="form-control" placeholder="Pesquisa por modelo ou ID" aria-label="Pesquisa por modelo ou ID" aria-describedby="search">
              <button @click="getAeronavesByTerm" class="btn btn-outline-secondary" type="button" id="search">Pesquisar</button>
            </div>
          </div>
        </div>
        <div v-if="results.length" class="row">
          <div class="col-12">
            <p class="text-start"><b>Resultados da pesquisa por:</b> "{{searchTerm}}"</p>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Modelo</th>
                  <th scope="col">Fabricante</th>
                  <th scope="col">Ano</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Vendido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in results" :key="result">
                  <th>{{result.id}}</th>
                  <td>{{result.modelo}}</td>
                  <td>{{result.marca}}</td>
                  <td>{{result.ano}}</td>
                  <td>{{result.descricao}}</td>
                  <td v-if="result.vendido == true">&check;</td>
                  <td v-if="result.vendido == false">&cross;</td>                  
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Brands from './Brands.vue';
import axios from "axios";
export default {
  name: 'Main', 
  components: {
    Brands
  },
  data() {
    return {
      form: {
        modelo: '',
        marca: '',
        ano: '',
        vendido: false,
        descricao: ''
      },
      searchTerm: null,
      results: []
    }
  },
  computed : {
    years () {
      const year = new Date().getFullYear()
      return Array.from({length: year - 1900}, (value, index) => 1901 + index)
    }
  },
  methods:{
    getAeronavesByTerm: function(){
        var ref = this;
        console.log(ref.searchTerm);
        axios.get('cadastro/aeronaves/term/'+ref.searchTerm, {headers: { Accept: 'application/json' }})
        .then(res => {
          console.log(res.data);
          ref.results = res.data;
        });
    },
    submitAeronave: function(e){
      e.preventDefault();
      var ref = this;
      console.log(ref.form);
      axios.post('/cadastro/aeronaves',
        ref.form,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        })
      .then(function (res){
        console.log(res)
      })
      .catch(function(){
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
