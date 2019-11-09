<template>
  <div>
    <b-button v-if="$auth.check()" v-b-modal.add-manual-modal variant="primary" title="Add manual">
      <font-awesome-icon icon="file" />
    </b-button>
    <b-modal
      id="add-manual-modal"
      ref="add_manual_modal"
      title="Add manual"
      @shown="clear"
      v-bind:hide-footer="true"
    >
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group label="Title" label-for="title">
          <b-form-input
            id="title"
            type="text"
            ref="focusThis"
            v-model="data.title"
            required
            autofocus
            placeholder="Enter the title of your manual..."
          />
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="button" class="ml-2" variant="warning" @click.prevent="onCancel">Cancel</b-button>
        <b-alert v-show="error" variant="warning" show>{{ error }}</b-alert>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "AddManual",
  data() {
    return {
      data: {
        title: ""
      },
      error: null,
      show: true
    };
  },
  methods: {
    clear() {
      this.data.title = "";
    },
    onCancel() {
      this.$refs.add_manual_modal.hide();
    },
    onSubmit(evt) {
      evt.preventDefault();
      Vue.axios
        .post("/manuals", this.data)
        .then(resp => {
          this.$nextTick(() => {
            this.clear();
            console.log(resp);
            this.$emit("add-manual", resp.data["id"]);
            this.$refs.add_manual_modal.hide();
          });
        })
        .catch(err => {
          this.error = err.response.data.error;
        });
    }
  }
};
</script>
