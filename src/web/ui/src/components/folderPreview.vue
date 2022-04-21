<template>
  <tree :config="config" :nodes="nodes"> </tree>
</template>

<script>
import treeview from "vue3-treeview";
import "vue3-treeview/dist/style.css";
import _ from "lodash";

export default {
  props: ["schemes"],
  components: {
    tree: treeview,
  },
  data() {
    return {
      nodes: {
        mainFolder: {
          text: "Main Folder",
          children: ["testTxt", "testPng"],
        },
        testTxt: {
          text: "test.txt",
        },
        testPng: {
          text: "test.png",
        },
      },

      config: {
        roots: ["mainFolder"],
        openedIcon: {
          type: "class",
          class: "bi bi-folder2-open",
        },
        closedIcon: {
          type: "class",
          class: "bi bi-folder",
        },
      },
    };
  },
  methods: {
    fileToName(name) {
      return _.camelCase(name);
    },
    updateSchemes() {
      this.nodes.mainFolder.children=["testTxt", "testPng"];

      this.config.roots = ["mainFolder"];


      this.schemes.forEach((singleScheme) => {
        let firstParam = this.fileToName(singleScheme.params[0].value);
        if (singleScheme.id == 0) {
          if (this.nodes[firstParam] != null) {
            this.nodes[firstParam] = null;
          }
        } else if (singleScheme.id == 1) {
          if (this.nodes[firstParam] == null) {
            this.nodes[firstParam] = {
              text: singleScheme.params[0].value,
            };

            this.nodes.mainFolder.children.push(firstParam);
          }
        } else if (singleScheme.id == 2) {
          let secondParam = singleScheme.params[1].value;
          var getFolderName = null;

          if (secondParam.includes("/")) {
            var split = secondParam.split("/");
            getFolderName = split[split.length - 2];

            var createdNode = {
              text: getFolderName,
              children: [],
            };

            this.nodes[this.fileToName(getFolderName)] = createdNode;
            this.config.roots.push(getFolderName);
          }

          if (this.nodes[firstParam] != null) {
            var split2 = secondParam.split("/");

            this.nodes[this.fileToName(secondParam)] = {
              text: split2[split2.length - 1],
            };

            if (getFolderName == null)
              this.nodes.mainFolder.children.push(this.fileToName(secondParam));
            else
              this.nodes[this.fileToName(getFolderName)].children.push(
                this.fileToName(secondParam)
              );
          }
        }
      });
    },
  },
  mounted() {
    if (this.schemes == null || this.schemes.length <= 0) return;
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
