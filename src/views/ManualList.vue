<template>
  <div>
    <b-navbar type="light" variant="dark" fixed="top">
      <b-navbar-nav>
        <add-manual v-on:add-manual="manual" class="mx-1" />
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <login class="mx-1" />
      </b-navbar-nav>
    </b-navbar>
    <b-table class="mt-5" striped small hover :items="manuals" :fields="fields">
      <template v-slot:cell(state)="row">
        <b-badge :variant="colorState(row.item['state'])">
          <font-awesome-icon :icon="iconState(row.item['state'])" />
        </b-badge>
      </template>
      <template v-slot:cell(action)="row">
        <b-button variant="primary" size="sm" @click="manual(row.item['id'])">
          <font-awesome-icon icon="edit" />
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import Vue from "vue";
import AddManual from "@/components/AddManual.vue";
import Login from "@/components/Login.vue";

export default {
  name: "ManualList",
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
      manuals: []
    };
  },
  components: {
    AddManual,
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
    manual(id) {
      Vue.router.push({ name: "manualdesigner", params: { id: id } });
    }
  },
  computed: {},
  mounted() {
    Vue.axios.get("/manuals").then(data => {
      this.manuals = data.data;
    });
  }
};
</script>

<style>
</style>