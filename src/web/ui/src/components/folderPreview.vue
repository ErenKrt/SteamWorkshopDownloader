<template>
  <div class="tree" style="display: flex; align-items: center">
    <!--<ul
      class="tree-level"
      id="1650878769663"
      style="padding-left: 0px; list-style: none"
    >
      <li class="tree-node" aria-expanded="false">
        <div class="node-wrapper" tabindex="0" style="display: flex">
          <div class="icon-wrapper"><i class="bi bi-folder"></i></div>
          <div class="input-wrapper">
            <span class="node-text">Main Folder</span>
          </div>
        </div>
        <ul class="tree-level" style="list-style: none"
        >
          <li class="tree-node" aria-expanded="false">
            <div class="node-wrapper" tabindex="-1" style="display: flex">
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 123.958 123.959"
                >
                  <path fill="black" stroke="black"></path>
                </svg>
              </div>

              <div class="input-wrapper">
                <span class="node-text">test.txt</span>
              </div>
            </div>

          </li>
          <li class="tree-node" aria-expanded="false">
            <div class="node-wrapper" tabindex="-1" style="display: flex">
              <div class="icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 123.958 123.959"
                >
                  <path fill="black" stroke="black"></path>
                </svg>
              </div>
 
              <div class="input-wrapper">
                <span class="node-text">test.png</span>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>-->


    <ul class="tree-level" style="padding-left: 0px; list-style: none;">
      <folderPreviewItem v-for="(folder, index) in folders" :key="index" :item="folder" />
    </ul>

  </div>

</template>

<script>
import folderPreviewItem from './folderPreviewItem.vue'
import "vue3-treeview/dist/style.css";


export default {
  components:{
    folderPreviewItem
  },
  props: ["schemes"],
  data() {
    return {

      defaultFolders:[
        {
          id:1,
          name: "Main Folder",
          children:[
            {
              id:2,
              name: "test.txt"
            },
            {
              id:2,
              name: "test.png"
            }
          ]
        }
      ],

      folders:null
      
    };
  },
  methods: {
    /*getNode(name) {
      var parseFolders= name.split('/').filter(n => n);
      var currentObj= this.folders;

      for (let index = 0; index < parseFolders.length; index++) {
        var findedIndex= -1;

        if(currentObj.children!=null)
          findedIndex= currentObj.children.findIndex(x=>x.name==parseFolders[index]);
        else
          findedIndex= currentObj.findIndex(x=>x.name==parseFolders[index]);
        
        if(findedIndex==-1) return null;

        if(currentObj.children!=null)
          currentObj= currentObj.children[findedIndex];
        else
          currentObj= currentObj[findedIndex];

      }

      return currentObj;
    },*/

    getNode(name) {
      var parseFolders= name.split('/').filter(n => n);
      var currentObjs= [this.folders];

      var findedObj= [];

      for (let i = 0; i < currentObjs.length; i++) {
        var currentObj = currentObjs[i];

        for (let index = 0; index < parseFolders.length; index++) {
          var findedItems= [];

          if(currentObj.children!=null)
            findedItems= currentObj.children.filter(x=>new RegExp('^' + parseFolders[index].replace(/\*/g, '.*') + '$').test(x.name));
          else
            findedItems= currentObj.filter(x=>new RegExp('^' + parseFolders[index].replace(/\*/g, '.*') + '$').test(x.name));
          
          if(findedItems.length<=0){
             return;
          }

          currentObjs= findedItems;
         
        }

        findedObj.push(currentObj);
      }

    
      console.log(findedObj);

      return null;
    },
    updateSchemes() {

      this.folders= JSON.parse(JSON.stringify(this.defaultFolders));

      if (this.schemes == null || this.schemes.length <= 0) return;

      this.schemes.forEach((singleScheme) => {
        if(singleScheme.id==0 && singleScheme.params[0].value != null ) this.deleteTrigger(singleScheme);
      });
    },

    deleteTrigger(deleteScheme){
      var param= deleteScheme.params[0].value;
      console.log(this.getNode(param));
    }
  },
  mounted() {
    this.updateSchemes();
  },
  watch: {
    schemes: {
      handler() {
        this.updateSchemes();
      },
      deep: true,
    },
  },
};
</script>
