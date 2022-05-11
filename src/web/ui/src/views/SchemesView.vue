<template>
  <section class="row">
    <div class="col-12 col-lg-8">
      <div class="row">
        <div class="col-6">
          <div class="card">
            <div class="card-header">
              <h4>Schemes</h4>
            </div>
            <div class="card-body">
              <draggable
                class="dragArea"
                tag="div"
                :list="schemes"
                item-key="id"
                :clone="cloneScheme"
                :sort="false"
                :group="{ name: 'people', pull: 'clone', put: false }"
                @start="dragging = true"
                @end="dragging = false"
              >
                <template #item="{ element }">
                  <Scheme :scheme="element" :childs="element.childs" />
                </template>
              </draggable>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card">
            <div class="card-header">
              <h4>Saved</h4>
            </div>
            <div class="card-body">
              <button class="btn btn-success me-2" v-for="(saved,i) in savedSchemes" :key="i" @click="changeScheme(saved)">{{saved.name}}</button>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <button class="btn btn-success float-end" @click="runSchemes">
                RUN
              </button>
              <h4>Tasks</h4>
            </div>

            <div class="card-body">
              <draggable
                class="dragArea"
                tag="div"
                group="people"
                :list="schemes2"
                item-key="genID"
                :disabled="dragging == false"
              >
                <template #item="{ element }">
                  <Scheme
                    :scheme="element"
                    :childs="element.childs"
                    @remove="removeScheme"
                    :showParams="true"
                    :disabled="dragging == false"
                  />
                </template>
              </draggable>
            </div>
            <div class="card-footer" v-if="schemes2.length > 0">
              <div class="row">
                <div :class="{'col-8':alreadyCreated,'col-10':!alreadyCreated}">
                  <input class="form-control" v-model="schemeName"/>
                </div>
                <div class="col-2 px-0">
                  <button class="btn btn-success" @click="saveScheme">Save</button>
                </div>
                <div class="col-2 px-0" v-if="alreadyCreated">
                  <button class="btn btn-danger" @click="deleteScheme()">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-4">
      <div class="card">
        <div class="card-header">
          <h4>Example folders</h4>
        </div>
        <div class="card-body">
          <button class="btn btn-success me-2" v-for="(name,i) in exampleFolders" :key="i" @click="changeFolder(name)">{{name}}</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h4>Folder Preview</h4>
          <small>({{mainFolderPath}})</small>
        </div>
        <div class="card-body">
          <folderPreview :folders="folders" />
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import Scheme from "@/components/Scheme.vue";
import draggable from "vuedraggable";
import API from "@/utils/API";
import folderPreview from '../components/folderPreview.vue'
import { nextTick } from 'vue';

export default {
  components: { Scheme, draggable, folderPreview },
  data() {
    return {
      dragging: false,
      schemes: [],
      schemes2: [],
      genID: 0,
      folders:null,
      mainFolderPath: null,
      exampleFolders:null,
      savedSchemes: null,
      schemeName:null
    };
  },
  async mounted() {

    var GetSchemes = await API.getSchemes();
    if (GetSchemes.success == false) {
      this.$swal("Cant fetch schemes. Please reload page.");
      return;
    }
    this.schemes = GetSchemes.data;

    this.$socket.emit('folderPreview:getExampleFolders');
    this.$socket.emit('folderPreview:getSavedSchemes');

    this.$socket.on("folderPreview:savedSchemes",(data)=>{
      this.savedSchemes=data;
    })

    this.$socket.on("folderPreview:exampleFolders",(data)=>{
      this.exampleFolders=data;
    })

    this.$socket.emit("folderPreview:createFolder");
    this.$socket.on("folderPreview:folder",(data)=>{
      this.folders= data;
    });
    this.$socket.on("folderPreview:error",(err)=>{
      this.$swal(err);
    })

    this.$socket.on("folderPreview:mainFolder",(data)=>{
      this.mainFolderPath= data;
    });

  },
  computed:{
    alreadyCreated(){
      return this.savedSchemes.find(x=>x.name==this.schemeName)!=null;
    }
  },
  methods: {
    changeScheme(scheme){
      this.schemeName=scheme.name;
      this.schemes2=[];
      nextTick(()=>{
        this.schemes2= scheme.schemes;
      });
      
    },
    saveScheme(){
      this.$socket.emit("folderPreview:saveScheme",{name: this.schemeName, schemes: this.schemes2});
    },
    deleteScheme(){
      this.$socket.emit("folderPreview:deleteScheme",this.schemeName);
    },
    changeFolder(name){
      this.$socket.emit("folderPreview:changeFolder",name);
    },
    runSchemes(){
      this.$socket.emit("folderPreview:runSchemes",this.schemes2);
    },
    readFolder(){
      this.$socket.emit("folderPreview:readFolder");
    },
    removeById(arr, targetId) {
      return arr.reduce(
        (acc, obj) =>
          obj.genID === targetId
            ? acc
            : [
                ...acc,
                {
                  ...obj,
                  ...(obj.childs && {
                    childs: this.removeById(obj.childs, targetId),
                  }),
                },
              ],
        []
      );
    },

    removeScheme(genID) {
      this.schemes2 = this.removeById(this.schemes2, genID);
      if(this.schemes2.length <= 0)
        this.schemeName=null;
    },
    cloneScheme(items) {
      this.genID++;
      items.childs = [];

      return JSON.parse(
        JSON.stringify({
          genID: this.genID,
          ...items,
        })
      );
    },
    async getItem() {
      if (this.itemSearch.writedID == null || this.itemSearch.writedID == "")
        return;

      if (
        this.workshopItems.find(
          (x) => x.publishedfileid == this.itemSearch.writedID.trim()
        ) != null
      )
        return;

      this.itemSearch.block = true;
      var GetItems = await API.getItem(this.itemSearch.writedID.trim());
      this.itemSearch.block = false;

      if (GetItems.success == false) {
        this.$swal("Cant fetch item", GetItems.message);
        return;
      }

      this.workshopItems = this.workshopItems.concat(GetItems.data);
    },
  },
};
</script>