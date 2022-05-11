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
      workshopItems:[],
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