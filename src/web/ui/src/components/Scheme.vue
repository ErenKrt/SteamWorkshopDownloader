<template>
  <div :class="'alert alert-' + type + ' scheme'">
    <button type="button" class="btn-close float-end" v-if="showParams" @click="$emit('remove',scheme.genID)"></button>
    <h4 class="alert-heading">{{ scheme.name }}</h4>
    <p v-if="showParams == false">{{ scheme.description }}</p>
    <template v-else>

      <div class="form-group" v-for="(param, index) in scheme.params" :key="index">
        <label>{{ param.name }}</label>
        <input type="text" v-model="param.value" class="form-control form-control-sm" />
      </div>

      <div class="card" v-if="scheme.acceptChilds">
        <div class="card-header"><h6>Childs</h6></div>
        <div class="card-body">
          <draggable
                      class="dragArea"
                      tag="div"
                      group="people"
                      :list="scheme.childs"
                      item-key="genID"
                      >
                      <template #item="{ element }">
                        <Scheme :scheme="element" :childs="element.childs" :showParams="showParams" @remove="$emit('remove',element.genID)" />
                      </template>
            </draggable>
        </div>
      </div>

    </template>
  </div>
</template>

<script>

import Scheme from './Scheme.vue';
import draggable from "vuedraggable";
export default {
  components:{
    Scheme,
    draggable
  },
  name: "AppScheme",
  props: {
    scheme:{},
    showParams: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      type: null,
    };
  },
  mounted() {
    if (this.scheme.id == 0) this.type = "danger";
    else if (this.scheme.id == 1) this.type = "success";
    else if (this.scheme.id == 2) this.type = "warning";
    else if (this.scheme.id == 3) this.type = "info";
  }
};
</script>