<template>
  <div class="tree" style="display: flex; align-items: center" v-if="folders!=null">
    <ul class="tree-level" style="padding-left: 0px; list-style: none;">
      <folderPreviewItem v-for="(folder, index) in folders" :key="index" :item="folder" />
    </ul>
  </div>
</template>

<script>
import folderPreviewItem from './folderPreviewItem.vue'

export default {
  components:{
    folderPreviewItem
  },
  props: ["folders"],
}
</script>

<style>
.tree{
    width:100%
}
.tree-level{
    flex:1
}
.node-checkbox{
    display:none
}
.icon-wrapper{
    padding:0;
    min-width:0;
    flex-shrink:0;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    height:24px;
    width:24px;
    color:#F95959;
}

.input-wrapper{
    margin-left:.75em
}
.icon-wrapper svg{
    height:12px;
    width:12px
}
.node-wrapper{
    min-height:32px;
    display:flex;
    align-items:center;
    flex:1;
    word-wrap:break-word;
    font-weight:400;
    font-size:14px
}

.node-over{
    border-top:solid 2px #5C6BC0
}
.node-in{
    background-color:#bdbdbd
}
.node-under{
    border-bottom:solid 2px #5C6BC0
}
.input-wrapper{
    font-size:14px;
    position:relative;
    color:#000;
    display:flex;
    align-items:center
}
.node-input,.node-text{
    color:white;
}
</style>