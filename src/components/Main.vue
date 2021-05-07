<template>
  <div>
    <h1>Gestão de Aeronaves</h1>
    <div class="container mt-5">
      <div class="row w-75 m-auto p-4 align-items-center rounded-3 border shadow-lg">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="add-aircrafts-tab" data-bs-toggle="tab" data-bs-target="#add-aircrafts" type="button" role="tab" aria-controls="addAircrafts" aria-selected="true">Adicionar Aeronaves</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="search-tab" data-bs-toggle="tab" data-bs-target="#search" type="button" role="tab" aria-controls="profile" aria-selected="false">Pesquisar</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="statistics-tab" data-bs-toggle="tab" data-bs-target="#statistics" type="button" role="tab" aria-controls="profile" aria-selected="false">Estatísticas</button>
        </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active m-3" id="add-aircrafts" role="tabpanel" aria-labelledby="add-aircrafts-tab">
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
                <div class="row mt-3">
                  <div class="mb-3">
                    <label for="description" class="form-label">Descrição</label>
                    <textarea v-model="form.descricao" class="form-control" id="description" rows="3"></textarea>
                  </div>
                </div>
                <div class="row mt-3 align-items-end">
                  <div class="col-6">
                    <div class="input-group">
                      <span class="input-group-text">Ano</span>
                      <select required v-model="form.ano" class="form-select" id="year-field">
                        <option disabled value="">Selecione o ano de fabricação</option>
                        <option :value="year" v-for="year in years" :key="year">{{ year }}</option>  
                      </select>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="input-group">
                      <div class="pb-1 input-group-text">
                        <input  v-model="form.vendido"  class="form-check-input" type="checkbox" id="sold">                  
                      </div>
                      <label class="form-control bg-white" for="sold">Vendido</label>
                    </div>
                  </div>
                  <div class="col-2 text-end">
                      <button class="btn btn-primary" type="submit">Salvar</button>
                  </div>          
                </div>
            </form>
          </div>
          <div class="tab-pane fade m-3" id="search" role="tabpanel" aria-labelledby="search-tab">
            <h2>Pesquisar Aeronave</h2>
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
          <div class="tab-pane fade m-3" id="statistics" role="tabpanel" aria-labelledby="statistics-tab">
            <h2>Estatísticas</h2>
            
          </div>
        </div>        
      </div>
    </div>
  </div>
  <div class="modal fade" id="savedModal" tabindex="-1" aria-labelledby="savedModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="savedModal">Aeronave Adicionada!</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">A aeronave foi adicionada com sucesso ao banco de dados!</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
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
          ref.results = res.data;
        });
    },
    submitAeronave: function(e){
      e.preventDefault();
      var ref = this;
      axios.post('/cadastro/aeronaves',
        {
          modelo: ref.form.modelo,
          marca: ref.form.marca,
          ano: ref.form.ano,
          descricao: ref.form.descricao,
          vendido: ref.form.vendido
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        })
      .then(function (){
        //MODAL SALVO
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
