<template>
  <div>
    <b-navbar type="light" variant="dark" sticky>
      <b-navbar-nav>
        <b-button variant="primary" size="sm" @click="commit()">
          <font-awesome-icon icon="save" />
        </b-button>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <login class="mx-1" />
      </b-navbar-nav>
    </b-navbar>

    <div v-html="rawHtml" @focusout="edit"></div>
  </div>
</template>

<script>
import Vue from "vue";
import { testxslt } from "@/assets/js/xslt/test.js";
import Login from "@/components/Login.vue";

export default {
  name: "FileDesigner",
  data() {
    return {
      rawHtml: "",
      docxml: null
    };
  },
  components: { Login },
  methods: {
    edit(evt) {
      const path = evt["target"]["attributes"]["data-path"]["value"];
      const text = evt["target"]["innerHTML"];
      //console.log(evt);
      const result = this.docxml.evaluate(
        path,
        this.docxml,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      //console.log(result.singleNodeValue);
      result.singleNodeValue.textContent = text;
      console.log(this.docxml);
    },
    commit() {
      const serializer = new XMLSerializer();
      const doc = serializer.serializeToString(this.docxml);
      Vue.axios.put(
        "/docs/" +
          this.$route.params.plane_model +
          "/planes/" +
          this.$route.params.plane +
          "/files/" +
          this.$route.params.name,
        {
          content: doc
        }
      );
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
      .then(data => {
        const xsltProcessor = new XSLTProcessor();
        const testxsltxml = new DOMParser().parseFromString(
          testxslt,
          "text/xml"
        );
        xsltProcessor.importStylesheet(testxsltxml);
        const doc = data.data;
        this.docxml = new DOMParser().parseFromString(doc, "text/xml");
        const html = xsltProcessor.transformToFragment(this.docxml, document);
        this.rawHtml = html["firstChild"]["innerHTML"];
      });
  }
};
</script>

<style>
</style>