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

       <BlockUI class="card" :blocked="savedSchemes==null">
       <div class="card-header">
         <button v-if="selectedScheme" class="btn btn-info float-end" @click="selectedScheme=null">
            Clear
          </button>
          <h4>Saved Schemes</h4>
          <small v-if="selectedScheme">Selected Scheme: {{selectedScheme.name}}</small>
        </div>
        <div class="card-body">
          <button class="btn btn-success me-2" v-for="(saved,i) in savedSchemes" :key="i" @click="selectedScheme=saved">{{saved.name}}</button>
        </div>
      </BlockUI>
      <div class="card">
        <div class="card-header">
          <button class="btn btn-info float-end" @click="workshopItems = []">
            Clear
          </button>
          {{mainPath}}
          <h4>Workshop Items ({{ workshopItems.length }})</h4>
        </div>
        <div class="card-content pb-4" v-if="workshopItems!=null && workshopItems.length > 0">
          <div class="px-4">
            <input
                type="text"
                placeholder="Search in collection"
                class="form-control mb-2"
                v-model="searchWorkshop"
              />

            <button class="btn btn-block btn-xl btn-success font-bold mb-3" @click="downloadAll">
              <template v-if="searchWorkshop">
              Download Searched
              </template>

              <template v-else>
              Download All
              </template>
              
            </button>
          </div>

          <ListItem
            v-for="(item, index) in filteredWorkshops"
            :key="index"
            :Item="item"
            @clicked="downloadSingle"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ListItem from "@/components/ListItem.vue";
import BlockUI from '@/components/BlockUI.vue'
import API from '@/utils/API'

export default {
  components:{ListItem, BlockUI},
  data(){
    return {
      dragging: false,
      itemSearch:{
        writedID:"2712258971",
        block:false
      },
      savedSchemes: null,
      selectedScheme: null,
      workshopItems:[],
      searchWorkshop: null,
      mainPath:null
    }
  },
  async mounted(){
    var GetSchemes= await API.getSchemes();
    if(GetSchemes.success==false){
      this.$swal("Cant fetch schemes. Please reload page.");
      return;
    }
    this.schemes= GetSchemes.data;

    var GetConfig= await API.getConfig();
    if(GetConfig.success==false){
      this.$swal("Cant fetch config. Please reload page.");
      return;
    }
    this.mainPath= GetConfig.data.currentPath;

    this.$socket.emit('folderPreview:getSavedSchemes');

    this.$socket.on("statu",this.statu)
    this.$socket.on("prepared",this.prepared);
    this.$socket.on("folderPreview:savedSchemes",(data)=>{
      this.savedSchemes=data;
    })
  },
  computed:{
    filteredWorkshops(){
      if(this.searchWorkshop){
        return this.workshopItems
          .filter(x=>
            x.title.toLowerCase().includes(this.searchWorkshop.toLowerCase()) ||
            x.title_disk_safe.toLowerCase().includes(this.searchWorkshop.toLowerCase()) ||
            x.app_name.toLowerCase().includes(this.searchWorkshop.toLowerCase()) ||
            x.publishedfileid.toLowerCase().includes(this.searchWorkshop.toLowerCase())
          );
      }else return this.workshopItems;
    }
  },
  methods:{
    getItemByID(ID){
      return this.filteredWorkshops.find(x=>x.publishedfileid==ID)
    },
    download(items){
      this.$socket.emit("download",{scheme:this.selectedScheme?.name,items});
    },
    downloadAll(){
      this.download(this.filteredWorkshops.map(x=>({title:x.title,title_disk_safe:x.title_disk_safe,publishedfileid:x.publishedfileid})))
    },
    downloadSingle(id){
      var {title, title_disk_safe, publishedfileid}= this.getItemByID(id);
      if(title && title_disk_safe && publishedfileid) this.download([{title, title_disk_safe, publishedfileid}]);
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