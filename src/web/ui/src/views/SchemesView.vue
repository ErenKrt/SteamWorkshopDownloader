<template>
  <section class="row">
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
    <div class="col-12 col-lg-4">
      <div class="card">
        <div class="card-header">
          <h4>Folder Preview</h4>
        </div>
        <div class="card-body">
          <folderPreview :schemes="schemes2" />
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import Scheme from "@/components/Scheme.vue";
import draggable from "vuedraggable";
import API from "@/utils/API";
import folderPreview from '../components/folderPreview.vue'

export default {
  components: { Scheme, draggable, folderPreview },
  data() {
    return {
      dragging: false,
      schemes: [],
      schemes2: [],
      genID: 0,
    };
  },
  async mounted() {
    var GetSchemes = await API.getSchemes();
    if (GetSchemes.success == false) {
      this.$swal("Cant fetch schemes. Please reload page.");
      return;
    }
    this.schemes = GetSchemes.data;
  },
  methods: {
    removeById(arr, targetId) {
      return arr.reduce(
        (acc, obj) =>
          obj.genID === targetId
            ? acc
            : [
                ...acc,
                {
                  ...obj,
                  ...(obj.childs && {
                    childs: this.removeById(obj.childs, targetId),
                  }),
                },
              ],
        []
      );
    },

    removeScheme(genID) {
      this.schemes2 = this.removeById(this.schemes2, genID);
    },
    cloneScheme(items) {
      this.genID++;
      items.childs = [];

      return JSON.parse(
        JSON.stringify({
          genID: this.genID,
          ...items,
        })
      );
    },
    async getItem() {
      if (this.itemSearch.writedID == null || this.itemSearch.writedID == "")
        return;

      if (
        this.workshopItems.find(
          (x) => x.publishedfileid == this.itemSearch.writedID.trim()
        ) != null
      )
        return;

      this.itemSearch.block = true;
      var GetItems = await API.getItem(this.itemSearch.writedID.trim());
      this.itemSearch.block = false;

      if (GetItems.success == false) {
        this.$swal("Cant fetch item", GetItems.message);
        return;
      }

      this.workshopItems = this.workshopItems.concat(GetItems.data);
    },
  },
};
</script>