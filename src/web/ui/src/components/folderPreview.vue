<template>
  <div class="tree" style="display: flex; align-items: center" v-if="folders!=null">
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
  props: ["folders"],
}
</script>
