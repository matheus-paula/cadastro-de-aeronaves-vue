<template>
  <div>
    
  <div class="container mt-5">
    <div class="row w-75 m-auto p-4 align-items-center rounded-3 border shadow-lg">
      <h2>Gestão de Aeronaves</h2>
      <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="add-aircrafts-tab" data-bs-toggle="tab" data-bs-target="#add-aircrafts" type="button" role="tab" aria-controls="addAircrafts" aria-selected="true">Adicionar Aeronaves</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="search-tab" data-bs-toggle="tab" data-bs-target="#search" type="button" role="tab" aria-controls="profile" aria-selected="false">Pesquisar Aeronaves</button>
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
                      <input v-model="form.vendido"  class="form-check-input mt-0" type="checkbox" id="sold">                  
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
                    <th scope="col"></th>
                    <th scope="col"></th>              
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
                    <td><button @click="removeAeronaveById(result.id)" type="button" class="btn btn-sm btn-danger">Remover</button></td>
                    <td><button @click="editAeronaveById(result.id)" type="button" class="btn btn-sm btn-primary">Editar</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="tab-pane fade m-3" id="statistics" role="tabpanel" aria-labelledby="statistics-tab">
          <h2>Estatísticas</h2>
            
          <div class="d-flex justify-content-between flex-wrap">
            <div style="width:calc(50% - 10px)" class="card mb-auto h-auto mt-3 bg-success text-white">
                <div class="card-body d-flex">
                  <h5 class="card-title text-start">Aeronaves adicionadas na semana</h5>
                  <h1>{{semana[0]}}</h1>
                </div>
            </div>
            
            <div style="width:calc(50% - 10px)" class="bg-primary text-white card mt-3">
              <h5 class="card-title m-3 text-start">Aeronaves por década</h5>
                <div class="card-body d-flex">
                  <table class="table text-white">
                    <thead>
                      <tr>
                        <th scope="col">Década</th>
                        <th scope="col">Aeronaves</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="decada in decadas" :key="decada"><td>{{decada[0]}}0</td><td>{{decada[1]}}</td></tr>
                    </tbody>
                  </table>
              </div>
            </div>

            <div class="card w-100 bg-dark text-white mt-3">
              <h5 class="card-title m-3 text-start">Aeronaves por marca</h5>
                <div class="card-body d-flex">
                  <table class="table text-white">
                    <thead>
                      <tr>
                        <th scope="col">Marca</th>
                        <th scope="col">Aeronaves</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="marca in marcas" :key="marca"><td class="text-start">{{marca[0]}}</td><td>{{marca[1]}}</td></tr>
                    </tbody>
                  </table>
              </div>
            </div>
          </div>
          </div>
        </div>        
      </div>
    </div>
  </div>
  <div id="update-aircraft" class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Editar aeronave</h5>
          <button type="button" class="btn-close" data-bs-dismiss="update-aircraft" aria-label="Fechar"></button>
        </div>
        <div class="modal-body">
          <form v-on:submit="editAeronave" name="aeronave-edit" class="text-start">
                <div class="row">
                  <div class="col-12 input-group">
                    <span class="input-group-text">Modelo</span>
                    <input required  v-model="formEdit.modelo"  type="text" class="form-control" id="formEdit-aircraft" placeholder="E170">
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-12">
                    <div class=" input-group">
                      <span class="input-group-text">Marca</span>
                      <select required v-model="formEdit.marca"  id="formEdit-brand" class="form-select" aria-label="Marca">
                        <Brands/>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="mb-3">
                    <label for="description" class="form-label">Descrição</label>
                    <textarea v-model="formEdit.descricao" class="form-control" id="formEdit-description" rows="3"></textarea>
                  </div>
                </div>
                <div class="row mt-3 align-items-end">
                  <div class="col-6">
                    <div class="input-group">
                      <span class="input-group-text">Ano</span>
                      <select required v-model="formEdit.ano" class="form-select" id="formEdit-year-field">
                        <option disabled value="">Selecione o ano de fabricação</option>
                        <option :value="year" v-for="year in years" :key="year">{{ year }}</option>  
                      </select>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="input-group">
                      <div class="pb-1 input-group-text">
                        <input v-model="formEdit.vendido"  class="form-check-input mt-0" type="checkbox" id="formEdit-sold">                  
                      </div>
                      <label class="form-control bg-white" for="sold">Vendido</label>
                    </div>
                  </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="update-aircraft">Fechar</button>
          <button @click="submitAeronaveEdit" type="button" class="btn btn-primary">Salvar alterações</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Brands from './Brands.vue';
import axios from "axios";
import toastr from '../../node_modules/toastr/build/toastr.min.js'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"

export default {
  name: 'Main', 
  components: {
    Brands
  },
  data() {
    return {
      aircraft: null,
      editingId: 0,
      form: {
        modelo: '',
        marca: '',
        ano: '',
        vendido: false,
        descricao: ''
      },
      formEdit: {
        modelo: '',
        marca: '',
        ano: '',
        vendido: false,
        descricao: ''
      },
      searchTerm: "",
      results: [],
      decadas:[],
      semana: [],
      marcas: []
    }
  },
  computed : {
    years () {
      const year = new Date().getFullYear()
      return Array.from({length: year - 1900}, (value, index) => 1901 + index)
    }
  },
  mounted: function(){
    this.getAeronavesByManufacturer();
  },
  methods:{
    clearForm: function(){
      this.form.modelo = ''
      this.form.marca= ''
      this.form.ano= ''
      this.form.vendido=  false
      this.form.descricao=  ''
    },
    getAeronavesByDecade: function(){
        var ref = this;
        axios.get('cadastro/aeronaves/decada', {headers: { Accept: 'application/json' }})
        .then(res => {
          ref.decadas = res.data;
          ref.getAeronavesByWeek();
        });
    },
    getAeronavesByManufacturer: function(){
        var ref = this;
        axios.get('cadastro/aeronaves/marca', {headers: { Accept: 'application/json' }})
        .then(res => {
          ref.marcas = res.data;
          ref.getAeronavesByDecade();
        });
    },
    getAeronavesByWeek: function(){
        var ref = this;
        axios.get('cadastro/aeronaves/semana', {headers: { Accept: 'application/json' }})
        .then(res => {
          ref.semana = res.data;
        });
    },
    getAeronavesByTerm: function(){
        var ref = this;
        axios.get('cadastro/aeronaves/term/'+ref.searchTerm, {headers: { Accept: 'application/json' }})
        .then(res => {
          ref.results = res.data;
          if(ref.results.length == 0){
            toastr.warning("Não foram encontrados resultados para <b>\""+ref.searchTerm+"\"</b>!", "Sem resultados!", {timeOut: 5000});
          }
        });
    },
    getAeronaveById: function(id){
        var ref = this;
        axios.get('cadastro/aeronaves/'+id, {headers: { Accept: 'application/json' }})
        .then(res => {
          ref.populateEditForm(res.data);
        });
    },
    removeAeronaveById: function(id){
        var ref = this;
        axios.delete('cadastro/aeronaves/'+id, {headers: { Accept: 'application/json' }})
        .then(function (res){
          var data = res.data;
          if(data.type == "success"){
            toastr.success(data.title, data.message, {timeOut: 5000})
          }else if(data.type == "error"){
            toastr.error(data.title, data.message, {timeOut: 5000})
          }
          ref.getAeronavesByTerm();
        });
    },
    populateEditForm: function(data){
      this.formEdit.modelo = data.modelo;
      this.formEdit.marca = data.marca;
      this.formEdit.ano = data.ano;
      this.formEdit.descricao = data.descricao;
      this.formEdit.vendido = data.vendido;
    },
    editAeronaveById: function(id){
      window.$("#update-aircraft").modal('show');
      this.getAeronaveById(id);
      this.editingId = id;
    },
    submitAeronaveEdit: function(e){
      e.preventDefault();
      var ref = this,
        win = window;
      axios.put('/cadastro/aeronaves/'+ref.editingId,
        {
          modelo: ref.formEdit.modelo,
          marca: ref.formEdit.marca,
          ano: ref.formEdit.ano,
          descricao: ref.formEdit.descricao,
          vendido: ref.formEdit.vendido
        },{
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).then(function (res){
        var data = res.data;
          if(data.type == "success"){
            toastr.success(data.title, data.message, {timeOut: 5000})
            win.$("#update-aircraft").modal('hide');
            ref.getAeronavesByTerm();
          }else if(data.type == "error"){
            toastr.error(data.title, data.message, {timeOut: 5000})
          }
        })
        .catch(function(res){
          var data = res.data;
          toastr.error(data.title, data.message, {timeOut: 5000});
        })
      
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
      },{
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
      }).then(function (res){
        var data = res.data;
        if(data.type == "success"){
          toastr.success(data.title, data.message, {timeOut: 5000})
          ref.clearForm();
        }else if(data.type == "error"){
          toastr.error(data.title, data.message, {timeOut: 5000})
        }
      }).catch(function(res){
        var data = res.data;
        toastr.error(data.title, data.message, {timeOut: 5000})
      });
    }
  }
}
</script>
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
