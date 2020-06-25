<template>
  <div>
    <b-navbar type="light" variant="dark" sticky>
      <b-navbar-nav>
        <b-button :disabled="false" variant="primary" class="mx-1" @click="save()">
          <font-awesome-icon icon="save" />
        </b-button>
        <b-button-group class="mx-1">
          <b-button @click="proceduralStep()">
            <font-awesome-icon icon="tasks" />
          </b-button>
          <b-button @click="title()">
            <font-awesome-icon icon="heading" />
          </b-button>
          <b-button @click="para()">
            <font-awesome-icon icon="paragraph" />
          </b-button>
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
import { Procedure } from "@/assets/js/documents/procedure/procedure.js";
import { EditorView } from "prosemirror-view";

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
      view: null,
      procedure: null
    };
  },
  components: { Login },
  methods: {
    save() {
      const xml = html2xml(this.view.dom, this.content);
      console.log(xml);
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
      while (this.$refs.editor.firstChild) {
        this.$refs.editor.firstChild.remove();
      }
      if (this.meta.type == "xpro") {
        this.procedure = new Procedure(this.content);
        this.view = new EditorView(this.$refs.editor, {
          state: this.procedure.state
        });
      } else {
        //RAW
      }
    },
    proceduralStep() {
      this.procedure.commands["proceduralStep"](
        this.view.state,
        this.view.dispatch
      );
    },
    title() {
      console.log(
        this.procedure.commands["title"](this.view.state, this.view.dispatch)
      );
    },
    para() {
      this.procedure.commands["para"](this.view.state, this.view.dispatch);
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