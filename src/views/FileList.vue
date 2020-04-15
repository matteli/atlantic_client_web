<template>
  <div>
    <b-navbar type="light" variant="dark" fixed="top">
      <b-navbar-nav>
        <b-form-select v-model="model_selected" :options="models" class="mx-1"></b-form-select>
        <b-form-select
          v-model="plane_selected"
          :options="planes"
          :disabled="isDisabled"
          class="mx-1"
        ></b-form-select>
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
        <b-button variant="primary" size="sm" @click="file(row.item['filename'])">
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
      planes: [],
      model_selected: this.model,
      plane_selected: this.plane
    };
  },
  props: {
    model: {
      type: String,
      default: null
    },
    plane: {
      type: String,
      default: null
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
    file(filename) {
      const name = filename.replace(/.(?!.*\.)/, "-");
      Vue.router.push({
        name: "Filedesigner",
        params: {
          name: name,
          plane_model: this.model_selected,
          plane: this.plane_selected
        }
      });
    },
    get_models() {
      let model = [{ value: null, text: "-- Select a model plane --" }];
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
    get_planes(model) {
      let planes = [{ value: null, text: "-- Select a plane (MSN) --" }];
      Vue.axios.get("/docs/" + model + "/planes").then(data => {
        for (let d in data.data) {
          planes.push({
            value: data.data[d],
            text: data.data[d]
          });
        }
      });
      return planes;
    },
    get_files(model, plane) {
      let files = [];
      Vue.axios
        .get("/docs/" + model + "/planes/" + plane + "/files")
        .then(data => {
          console.log(data);
          for (let d in data.data) {
            let file = {
              hash: data.data[d].hash,
              filename: data.data[d].filename,
              editor: data.data[d].editor,
              state: data.data[d].state
            };
            files.push(file);
          }
        });
      return files;
    }
  },

  watch: {
    plane_selected: function(plane) {
      if (plane) {
        this.files = this.get_files(this.model_selected, plane);
        Vue.router.push({
          name: "FilelistPlane",
          params: {
            model: this.model_selected,
            plane: plane
          }
        });
      } else {
        Vue.router.push({
          name: "FilelistModel",
          params: {
            model: this.model_selected
          }
        });
        this.files = [];
      }
    },
    model_selected: function(model) {
      if (model) {
        this.planes = this.get_planes(model);
        Vue.router.push({
          name: "FilelistModel",
          params: {
            model: model
          }
        });
      } else {
        this.planes = [{ value: null, text: "-- Select a plane (MSN) --" }];
        this.plane_selected = null;
        Vue.router.push({
          name: "Filelist"
        });
      }
    }
  },
  computed: {
    isDisabled: function() {
      if (this.model_selected) return false;
      else return true;
    }
  },
  mounted() {
    this.models = this.get_models();
    if (this.model_selected) {
      this.planes = this.get_planes(this.model_selected);
      if (this.plane_selected) {
        this.files = this.get_files(this.model_selected, this.plane_selected);
      }
    } else {
      this.planes = [{ value: null, text: "-- Select a plane (MSN) --" }];
    }
  }
};
</script>

<style>
</style>