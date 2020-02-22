<template>
  <div>
    <b-navbar type="light" variant="dark" fixed="top">
      <b-navbar-nav>
        <add-file v-on:add-file="file" class="mx-1" />
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <login class="mx-1" />
      </b-navbar-nav>
    </b-navbar>
    <b-table class="mt-5" striped small hover :items="files" :fields="fields">
      <template v-slot:cell(state)="row">
        <b-badge :variant="colorState(row.item['state'])">
          <font-awesome-icon :icon="iconState(row.item['state'])" />
        </b-badge>
      </template>
      <template v-slot:cell(action)="row">
        <b-button variant="primary" size="sm" @click="file(row.item['id'])">
          <font-awesome-icon icon="edit" />
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import Vue from "vue";
import AddFile from "@/components/AddFile.vue";
import Login from "@/components/Login.vue";

export default {
  name: "FileList",
  data() {
    return {
      fields: [
        {
          key: "id",
          sortable: true,
          label: "#"
        },
        {
          key: "title",
          sortable: true
        },
        {
          key: "editor",
          sortable: true
        },
        {
          key: "state",
          sortable: true
        },
        {
          key: "action",
          sortable: false
        }
      ],
      files: []
    };
  },
  components: {
    AddFile,
    Login
  },
  methods: {
    colorState(state) {
      if (state == "D") {
        return "danger";
      } else if (state == "C") {
        return "warning";
      } else if (state == "V") {
        return "success";
      }
    },
    iconState(state) {
      if (state == "D") {
        return ["fab", "firstdraft"];
      } else if (state == "C") {
        return ["fas", "file-alt"];
      } else if (state == "V") {
        return ["fas", "file-signature"];
      }
    },
    file(id) {
      Vue.router.push({ name: "filedesigner", params: { id: id } });
    }
  },
  computed: {},
  mounted() {
    Vue.axios.get("/files").then(data => {
      this.files = data.data;
    });
  }
};
</script>

<style>
</style>