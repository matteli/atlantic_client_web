<template>
  <div>
    <b-navbar type="light" variant="dark" fixed="top">
      <b-navbar-nav>
        <b-form-select v-model="modelSelected" :options="models" class="mx-1"></b-form-select>
        <b-form-select
          v-model="referenceSelected"
          :options="references"
          :disabled="!modelIsSelected"
          class="mx-1"
        ></b-form-select>
        <add-file
          :disabled="!referenceIsSelected"
          :model="modelSelected"
          :reference="referenceSelected"
          :files="files"
          v-on:add-file="openFile"
          class="mx-1"
        />
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
        <b-button
          v-if="$auth.check()"
          variant="primary"
          size="sm"
          @click="openFile(row.item['filename'])"
        >
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
          key: "filename",
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
      files: [],
      models: [],
      references: [],
      modelSelected: this.model,
      referenceSelected: this.reference
    };
  },
  props: {
    model: {
      type: String,
      default: ""
    },
    reference: {
      type: String,
      default: ""
    }
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
    openFile(filename) {
      const name = filename.replace(/.(?!.*\.)/, "-").toLowerCase();
      Vue.router.push({
        name: "FileEditor",
        params: {
          name: name,
          model: this.modelSelected,
          reference: this.referenceSelected
        }
      });
    },
    getModels() {
      let model = [{ value: "", text: "-- Select a model plane --" }];
      Vue.axios.get("/docs").then(data => {
        for (let d in data.data) {
          model.push({
            value: data.data[d]["slug_model_plane"],
            text: data.data[d]["model_plane"]
          });
        }
      });
      return model;
    },
    getRefs(model) {
      let references = [{ value: "", text: "-- Select a reference --" }];
      Vue.axios.get("/docs/" + model + "/references").then(data => {
        for (let d in data.data) {
          references.push({
            value: data.data[d],
            text: data.data[d]
          });
        }
      });
      return references;
    },
    getFiles(model, reference) {
      let files = [];
      Vue.axios
        .get("/docs/" + model + "/references/" + reference + "/files")
        .then(data => {
          for (let d in data.data) {
            let file = {
              hash: data.data[d].hash,
              filename: data.data[d]["filename"],
              editor: data.data[d]["editor"],
              state: data.data[d]["state"]
            };
            files.push(file);
          }
        });
      return files;
    }
  },

  watch: {
    referenceSelected: function(reference) {
      if (reference) {
        this.files = this.getFiles(this.modelSelected, reference);
        Vue.router.push({
          name: "FilelistRef",
          params: {
            model: this.modelSelected,
            reference: reference
          }
        });
      } else {
        Vue.router.push({
          name: "FilelistModel",
          params: {
            model: this.modelSelected
          }
        });
        this.files = [];
      }
    },
    modelSelected: function(model) {
      if (model) {
        this.references = this.getRefs(model);
        Vue.router.push({
          name: "FilelistModel",
          params: {
            model: model
          }
        });
      } else {
        this.references = [{ value: "", text: "-- Select a reference --" }];
        this.referenceSelected = "";
        Vue.router.push({
          name: "Filelist"
        });
      }
    }
  },
  computed: {
    modelIsSelected: function() {
      if (this.modelSelected) return true;
      return false;
    },
    referenceIsSelected: function() {
      if (this.referenceSelected) return true;
      return false;
    }
  },
  mounted() {
    this.models = this.getModels();
    if (this.modelSelected) {
      this.references = this.getRefs(this.modelSelected);
      if (this.referenceSelected) {
        this.files = this.getFiles(this.modelSelected, this.referenceSelected);
      }
    } else {
      this.references = [{ value: "", text: "-- Select a reference --" }];
    }
  }
};
</script>

<style>
</style>