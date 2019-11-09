<template>
  <div>
    <editor v-model="text" />
  </div>
</template>

<script>
import Vue from "vue";
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";
import { Editor } from "@toast-ui/vue-editor";

export default {
  name: "ManualDesigner",
  data() {
    return {
      text: ""
    };
  },
  components: {
    editor: Editor
  },
  methods: {
    addInstruction() {
      Vue.axios
        .post(
          "/manuals/" + this.$route.params.id + "/instructions",
          this.newInstruction.data
        )
        .then();
    }
  },
  mounted() {
    if (typeof this.$route.params.id == "number") {
      Vue.axios
        .get("/manuals/" + this.$route.params.id)
        .then(data => (this.text = data.data));
      //.catch(error => (this.newInstruction.error = error));
    }
  }
};
</script>

<style>
</style>