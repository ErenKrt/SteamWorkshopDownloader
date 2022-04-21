<template>
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
            <button class="btn btn-block btn-info ms-2" @click="getItem">
              Search
            </button>
          </div>
        </div>
      </BlockUI>

      <div class="card">
        <div class="card-header">
          <button class="btn btn-info float-end" @click="workshopItems = []">
            Clear
          </button>
          <h4>Workshop Items ({{ workshopItems.length }})</h4>
        </div>
        <div class="card-content pb-4">
          <div class="px-4">
            <button
              class="btn btn-block btn-xl btn-success font-bold mb-3"
              @click="downloadAll"
            >
              Download All
            </button>
          </div>

          <ListItem
            v-for="(item, index) in workshopItems"
            :key="index"
            :Item="item"
            @clicked="download"
          />
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
              <h4>DO</h4>
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
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ListItem from "@/components/ListItem.vue";
import BlockUI from '@/components/BlockUI.vue'
import Scheme from '@/components/Scheme.vue'
import draggable from "vuedraggable";
import API from '@/utils/API'
import io from 'socket.io-client'


export default {
  components:{ListItem, BlockUI, Scheme, draggable},
  data(){
    return {
      dragging: false,
      itemSearch:{
        writedID:"2712258971",
        block:false
      },

      workshopItems:[],
      schemes:[],
      schemes2:[],
      genID:0,
      socket: io(API.socketURL)
    }
  },
  async mounted(){
    var GetSchemes= await API.getSchemes();
    if(GetSchemes.success==false){
      this.$swal("Cant fetch schemes. Please reload page.");
      return;
    }
    this.schemes= GetSchemes.data;

    this.socket.on("statu",this.statu)
    this.socket.on("prepared",this.prepared);
  },
  methods:{
    downloadAll(){
      this.socket.emit("download",this.workshopItems.map(x=>x.publishedfileid));
    },
    download(id){
      this.socket.emit("download",[id]);
    },
    statu(args){
      var ID= args.publishedfileid;
      var find= this.workshopItems.find(x=>x.publishedfileid==ID);
      if(find==null) return;

      find.statu= args;
    },
    prepared(args){
      var list= args;
      list.forEach(singlePrepared => {
        var ID= singlePrepared.publishedfileid;
        var find= this.workshopItems.find(x=>x.publishedfileid==ID);
        if(find==null) return;
        find.statu= null;
      });
    },
    removeById(arr, targetId)
    {
      return arr.reduce((acc, obj) => 
      (obj.genID === targetId) 
        ? acc 
        : [ ...acc, 
            {
              ...obj, 
              ...(obj.childs && { childs: this.removeById(obj.childs, targetId) }) 
            }
          ]
      , [])
    },

    removeScheme(genID){
      this.schemes2= this.removeById(this.schemes2,genID);
    },
    cloneScheme(items) {
      this.genID++;
      items.childs=[];
    
      return JSON.parse(JSON.stringify({
        genID:this.genID,
        ...items,
      }));
    },
    async getItem(){
      if(this.itemSearch.writedID==null || this.itemSearch.writedID=="") return;
      
      if(this.workshopItems.find(x=>x.publishedfileid==this.itemSearch.writedID.trim())!=null) return;

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