<template>
  <div>
    <b-navbar type="light" variant="dark" fixed="top">
      <add-manual v-on:add-manual="newManual" class="mx-1" />
    </b-navbar>
    <b-table class="mt-5" striped small hover :items="instructions" :fields="fields">
      <template v-slot:cell(state)="row">
        <b-badge :variant="colorState(row.item['state'])">
          <font-awesome-icon :icon="iconState(row.item['state'])" />
        </b-badge>
      </template>
    </b-table>
  </div>
</template>

<script>
import Vue from "vue";
import AddManual from "@/components/AddManual.vue";

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
        }
      ],
      instructions: []
    };
  },
  components: {
    AddManual
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
    newManual(id) {
      console.log("id :" + id);
      Vue.router.push({ name: "manualdesigner", params: { id: id } });
    }
  },
  computed: {},
  mounted() {
    Vue.axios.get("/manuals").then(data => {
      this.instructions = data.data;
    });
  }
};
</script>

<style>
</style>