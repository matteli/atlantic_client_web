<template>
  <div>
    <b-navbar type="light" variant="dark" fixed="top">
      <b-navbar-nav>
        <b-form-select v-model="model_plane_selected" :options="model_planes" class="mx-1"></b-form-select>
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
        <b-button variant="primary" size="sm" @click="file(row.item['title'])">
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
      files: [],
      model_planes: [],
      model_plane_selected: null,
      planes: [],
      plane_selected: null,
      isDisabled: true
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
    file(title) {
      const name = title.replace(/.(?!.*\.)/, "-");
      Vue.router.push({
        name: "Filedesigner",
        params: {
          name: name,
          plane_model: this.model_plane_selected,
          plane: this.plane_selected
        }
      });
    },
    clear_planes_options() {
      this.planes = [{ value: null, text: "-- Select a plane (MSN) --" }];
      this.plane_selected = null;
    }
  },
  watch: {
    plane_selected: function(val) {
      if (val) {
        this.files = [];
        Vue.axios
          .get(
            "/docs/" + this.model_plane_selected + "/planes/" + val + "/files"
          )
          .then(data => {
            for (var mp in data.data) {
              var file = {
                hash: data.data[mp].hash,
                title: data.data[mp].title,
                editor: data.data[mp].editor,
                state: data.data[mp].state
              };
              this.files.push(file);
            }
          });
      }
    },
    model_plane_selected: function(val) {
      if (val) {
        this.clear_planes_options();
        Vue.axios.get("/docs/" + val + "/planes").then(data => {
          for (var mp in data.data) {
            //console.log(data.data[mp]["model_plane"]);
            this.planes.push({
              value: data.data[mp],
              text: data.data[mp]
            });
          }
          this.isDisabled = false;
        });
      } else {
        this.clear_planes_options();
        this.isDisabled = true;
      }
    }
  },
  computed: {},
  mounted() {
    this.model_planes = [{ value: null, text: "-- Select a model plane --" }];
    Vue.axios.get("/docs").then(data => {
      for (var mp in data.data) {
        //console.log(data.data[mp]["model_plane"]);
        this.model_planes.push({
          value: data.data[mp]["slug_model_plane"],
          text: data.data[mp]["model_plane"]
        });
      }
      this.clear_planes_options();
    });
  }
};
</script>

<style>
</style>