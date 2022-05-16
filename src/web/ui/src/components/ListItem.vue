<template>
  <div class="workshop-item px-4 py-3">
    <div class="row">
      <div class="col-12 d-flex">
        <div class="image image-lg">
            <a :href="Item.preview_url" target="_blank">
                <img :src="Item.preview_url" />
            </a>
        </div>

        <div class="col-8">
          <div class="name ms-4">
            <h5 class="mb-1">{{Item.title}}</h5>
            <h6 class="text-muted">{{Item.publishedfileid}}</h6>
          </div>
        </div>

        <div class="col-3">
          <a v-if="Item.statu==null" class="stats-icon purple ms-2 float-end" href="#" @click="$emit('clicked',Item.publishedfileid)">
            <i class="bi bi-arrow-down"></i>
          </a>
        </div>
      </div>
      <div class="col-12" v-if="Item.statu">
        <div class="progress progress-info mt-2">
          <div
            class="progress-bar progress-label"
            role="progressbar"
            :style="'width: '+Item.statu.progress+'%'"
            :aria-valuenow="Item.statu.progressText"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListItem",
  props:["Item"]
};
</script>