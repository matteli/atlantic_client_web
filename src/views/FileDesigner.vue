<template>
  <div>
    <ckeditor :editor="editor" v-model="text" :config="editorConfig"></ckeditor>
  </div>
</template>

<script>
import Vue from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import CKSave from "../assets/js/CKSave.js";

export default {
  name: "FileDesigner",
  data() {
    return {
      text: "",
      editor: ClassicEditor,
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          CKSave
        ],

        toolbar: {
          items: ["bold", "italic", "link", "undo", "redo", "save"]
        }
      }
    };
  },
  components: {
    ckeditor: CKEditor.component
  },
  methods: {
    modifyFile() {
      //Vue.axios.post("/files/" + this.$route.params.id, this.text).then();
    }
  },
  mounted() {
    Vue.axios
      .get(
        "/docs/" +
          this.$route.params.plane_model +
          "/planes/" +
          this.$route.params.plane +
          "/files/" +
          this.$route.params.name
      )
      .then(data => (this.text = data.data));
    //.catch(error => (this.newInstruction.error = error));
  }
};
</script>

<style>
</style>