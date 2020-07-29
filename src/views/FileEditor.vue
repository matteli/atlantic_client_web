<template>
  <div>
    <b-navbar type="light" variant="dark" sticky>
      <b-navbar-nav>
        <b-button :disabled="false" variant="primary" class="mx-1" @click="save()">
          <font-awesome-icon icon="save" />
        </b-button>
        <b-button-group class="mx-1">
          <b-button @click="document.commands['title'](view.state, view.dispatch)">
            <font-awesome-icon icon="heading" />
          </b-button>
          <b-button @click="document.commands['para'](view.state, view.dispatch)">
            <font-awesome-icon icon="paragraph" />
          </b-button>
        </b-button-group>
        <b-button-group v-if="type='procedure'" class="mx-1">
          <b-button
            @click="document.commands['proceduralStep'](
        view.state,
        view.dispatch)"
          >
            <font-awesome-icon icon="tasks" />
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
import { Procedure } from "@/assets/js/documents/procedure.js";
import { EditorView } from "prosemirror-view";

export default {
  name: "FileEditor",
  data() {
    return {
      type: "",
      commit: "",
      xmlStr: "",
      view: null,
      document: null,
    };
  },
  components: { Login },
  methods: {
    save() {
      const xml = html2xml(this.view.dom, this.xmlStr);
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
            xml_str: xml,
            commit: this.commit,
          }
        )
        .then((data) => {
          this.commit = data.data["commit"];
          this.xmlStr = data.data["xml_str"];
          this.xmlInEditor();
        });
    },
    xmlInEditor() {
      while (this.$refs.editor.firstChild) {
        this.$refs.editor.firstChild.remove();
      }
      const xml = new DOMParser().parseFromString(this.xmlStr, "text/xml");
      if (
        xml.evaluate(
          "count(/dmodule/content/procedure)",
          xml,
          null,
          XPathResult.ANY_TYPE,
          null
        )
      ) {
        this.type = "procedure";
        this.document = new Procedure(xml);
      }

      this.view = new EditorView(this.$refs.editor, {
        state: this.document.state,
      });
    },
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
      .then((data) => {
        this.commit = data.data["commit"];
        this.xmlStr = data.data["xml_str"];
        const extension = this.$route.params.name.split("-").pop();
        if (extension == "xml") this.xmlInEditor();
      });
  },
};
</script>

<style lang="scss">
@import "~prosemirror-view/style/prosemirror.css";
@import "../assets/css/procedure.css";
</style>