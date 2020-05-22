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

    <div ref="editor"></div>
  </div>
</template>

<script>
import Vue from "vue";
import { procedureXslt } from "@/assets/js/documents/procedure/procedure.xslt.js";
import { procedureSchema } from "@/assets/js/documents/procedure/procedure.js";
import html2xml from "@/assets/js/html2xml.js";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser as PMDOMParser } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import Login from "@/components/Login.vue";

export default {
  name: "FileEditor",
  data() {
    return {
      meta: {
        mtype: "RAW",
        xslt: "",
        state: "D",
        hidden: "false"
      },
      commit: "",
      view: null
    };
  },
  components: { Login },
  methods: {
    save() {
      const xml = html2xml(this.view.dom);
      console.log(xml);
      Vue.axios.put(
        "/docs/" +
          this.$route.params.model +
          "/references/" +
          this.$route.params.reference +
          "/files/" +
          this.$route.params.name,
        {
          content: xml,
          meta: this.meta
        }
      );
    }
  },
  mounted() {
    const xsltList = { xpro: procedureXslt };
    const schemaList = { xpro: procedureSchema };
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
        console.log(data.data);
        this.meta = data.data["meta"];
        this.commit = data.data["commit"];
        const content = data.data["content"];
        if (this.meta.type == "xpro") {
          const xsltProcessor = new XSLTProcessor();
          const xsltDom = new DOMParser().parseFromString(
            xsltList[this.meta.type],
            "text/xml"
          );
          xsltProcessor.importStylesheet(xsltDom);
          const xml = new DOMParser().parseFromString(content, "text/xml");
          const html = xsltProcessor.transformToFragment(xml, document);
          const dParser = PMDOMParser.fromSchema(schemaList[this.meta.type]);
          const state = EditorState.create({
            schema: schemaList[this.meta.type],
            doc: dParser.parse(html),
            plugins: [keymap(baseKeymap)]
          });
          this.view = new EditorView(this.$refs.editor, { state });
        } else {
          //RAW
        }
      });
  }
};
</script>

<style lang="scss">
@import "~prosemirror-view/style/prosemirror.css";
</style>