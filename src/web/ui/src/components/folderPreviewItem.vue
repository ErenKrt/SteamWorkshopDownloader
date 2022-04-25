<template>
  <li class="tree-node" aria-expanded="false">

    <div class="node-wrapper" tabindex="0" style="display: flex">
        <div class="icon-wrapper">
            <i class="bi bi-folder" v-if="isFolder"></i>
            <i class="bi bi-file-earmark-binary" v-else></i>
        </div>

        <div class="input-wrapper">
            <span class="node-text">{{ item.name }}</span>
        </div>
    </div>

    <ul class="tree-level" style="list-style: none" v-if="isFolder">
      <folderItem 
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
      />
    </ul>
  </li>
</template>
<script>

export default {
    name:"folderItem",
    props:["item"],
    computed: {
        isFolder: function() {
            return this.item.children && this.item.children.length;
        }
    },
}
</script>