<template>
  <div>
    <b-navbar type="light" variant="dark" sticky>
      <b-navbar-nav>
        <b-button :disabled="false" variant="primary" class="mx-1" @click="save()">
          <font-awesome-icon icon="save" />
        </b-button>
        <b-button-group class="mx-1">
          <b-button>Title</b-button>
          <b-button>Para</b-button>
        </b-button-group>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <login class="mx-1" />
      </b-navbar-nav>
    </b-navbar>

    <div id="editor" ref="editor"></div>
  </div>
</template>

<script>
import Vue from "vue";
import html2xml from "@/assets/js/html2xml.js";
import Login from "@/components/Login.vue";

import { EditorView } from "prosemirror-view";

import { Procedure } from "@/assets/js/documents/procedure/procedure.js";

export default {
  name: "FileEditor",
  data() {
    return {
      meta: {
        mtype: "RAW",
        xslt: "",
        state: "D",
        hidden: "false",
        blob_id: ""
      },
      commit: "",
      content: "",
      view: null
    };
  },
  components: { Login },
  methods: {
    save() {
      const xml = html2xml(this.view.dom, this.content);
      Vue.axios
        .put(
          "/docs/" +
            this.$route.params.model +
            "/references/" +
            this.$route.params.reference +
            "/files/" +
            this.$route.params.name,
          {
            content: xml,
            commit: this.commit,
            meta: this.meta
          }
        )
        .then(data => {
          this.meta = data.data["meta"];
          this.commit = data.data["commit"];
          this.content = data.data["content"];
          this.xmlInEditor();
        });
    },
    xmlInEditor() {
      if (this.meta.type == "xpro") {
        while (this.$refs.editor.firstChild) {
          this.$refs.editor.firstChild.remove();
        }

        const procedure = new Procedure(this.content);
        this.view = new EditorView(this.$refs.editor, {
          state: procedure.state
        });
      } else {
        //RAW
      }
    }
  },
  mounted() {
    Vue.axios
      .get(
        "/docs/" +
          this.$route.params.model +
          "/references/" +
          this.$route.params.reference +
          "/files/" +
          this.$route.params.name
      )
      .then(data => {
        this.meta = data.data["meta"];
        this.commit = data.data["commit"];
        this.content = data.data["content"];
        this.xmlInEditor();
      });
  }
};
</script>

<style lang="scss">
@import "~prosemirror-view/style/prosemirror.css";
</style>