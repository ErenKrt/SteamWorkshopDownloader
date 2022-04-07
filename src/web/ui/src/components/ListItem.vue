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

        <a class="stats-icon purple ms-2" href="#">
          <i class="iconly-boldArrow---Down-3"></i>
        </a>
      </div>
      <div class="col-12" v-if="Download?.status=='downloading'">
        <div class="progress progress-info mb-4">
          <div
            class="progress-bar progress-label"
            role="progressbar"
            style="width: 35%"
            aria-valuenow="50%"
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
  props:["Item","Download"]
};
</script>