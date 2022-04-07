<template>
  <div id="main" class="layout">
    <Header />
    <div class="content-wrapper container">
      <div class="page-content">
        <section class="row">
          <div class="col-12 col-lg-4">

            <BlockUI class="card" :blocked="itemSearch.block">
              <div class="card-body py-4 px-5">
                <div class="d-flex align-items-center">
                  <div class="col-md-8">
                    <input
                      type="text"
                      placeholder="Workshop ID"
                      class="form-control"
                      v-model="itemSearch.writedID"
                    />
                  </div>
                  <button class="btn btn-block btn-info ms-2" @click="getItem">Search</button>
                </div>
              </div>
            </BlockUI>

            <div class="card">
              <div class="card-header">
                <button class="btn btn-info float-end" @click="workshopItems=[]">Clear</button>
                <h4>Workshop Items ({{workshopItems.length}})</h4>
              </div>
              <div class="card-content pb-4">
                <div class="px-4">
                  <button class="btn btn-block btn-xl btn-success font-bold mb-3">
                    Download All
                  </button>
                </div>

                <ListItem v-for="(item, index) in workshopItems" :key="index" :Item="item" :Download="null"/>

              </div>
            </div>
          </div>
          
          <div class="col-12 col-lg-8">
            <div class="row">
              <div class="col-6">
                <div class="card">
                  <div class="card-header">
                    <h4>Schemes</h4>
                  </div>
                  <div class="card-body">
                    <Scheme v-for="(scheme, index) in schemes" :key="index" :scheme="scheme" :showParams="true"/>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card">
                  <div class="card-header">
                    <h4>DO</h4>
                  </div>
                  <div class="card-body" id="dropzone">
                    <div class="alert alert-info" style="z-index: 1000000">
                      <button
                        type="button"
                        class="btn-close float-end"
                      ></button>
                      <h4 class="alert-heading">Copy</h4>

                      <div class="form-group">
                        <label>Glob or path</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                        />
                      </div>
                    </div>

                    <div
                      class="alert alert-warning"
                      id="myalert"
                      style="z-index: 1000000"
                    >
                      <h4 class="alert-heading">Has</h4>
                      <div class="form-group">
                        <label>Glob or path</label>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                        />
                      </div>

                      <div class="card">
                        <div class="card-header">
                          <h6>Childs</h6>
                        </div>
                        <div class="card-body">
                          <div
                            class="alert alert-info"
                            style="z-index: 1000000"
                          >
                            <h4 class="alert-heading">Copy</h4>
                            <div class="form-group">
                              <label>Glob or path</label>
                              <input
                                type="text"
                                class="form-control form-control-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import ListItem from "./components/ListItem.vue";
import BlockUI from './components/BlockUI.vue'
import Scheme from './components/Scheme.vue'

import API from './utils/API'

export default {
  components:{Header, Footer, ListItem, BlockUI, Scheme},
  data(){
    return {
      itemSearch:{
        writedID:null,
        block:false
      },

      workshopItems:[],
      schemes:[]
    }
  },
  async mounted(){
    var GetSchemes= await API.getSchemes();
    if(GetSchemes.success==false){
      this.$swal("Cant fetch schemes. Please reload page.");
      return;
    }

    this.schemes= GetSchemes.data;
  },
  methods:{
    async getItem(){
      if(this.itemSearch.writedID==null || this.itemSearch.writedID=="") return;
      this.itemSearch.block=true;
      var GetItems= await API.getItem(this.itemSearch.writedID.trim());
      this.itemSearch.block=false;

      if(GetItems.success==false){
        this.$swal("Cant fetch item",GetItems.message);
        return;
      }

      this.workshopItems= this.workshopItems.concat(GetItems.data);
    }
  }
}
</script>

<style lang="scss">

@use 'sass:math';

@import "@/assets/scss/_variables";
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-icons/font/bootstrap-icons.css';

@import "@/assets/scss/layouts/main";
@import "@/assets/scss/layouts/default";

@import "@/assets/scss/components/alert";

@import "@/assets/scss/components/image";
@import "@/assets/scss/components/buttons";
@import "@/assets/scss/components/card";
@import "@/assets/scss/components/forms";
@import "@/assets/scss/components/progress";
@import "@/assets/scss/components/icons";

@import "@/assets/scss/_utilities";
//@import "@/assets/scss/image";



</style>
