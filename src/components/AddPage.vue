<template>
  <div>
    <b-button
      v-if="$auth.check()"
      v-b-modal.add-page-modal
      variant="danger"
      v-bind:disabled="!cursor.x"
      title="Add page"
    >
      <font-awesome-icon icon="file" />
    </b-button>
    <b-modal
      id="add-page-modal"
      ref="addPageModal"
      title="Add log page"
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
            placeholder="Explain with few words the situation..."
          />
        </b-form-group>
        <b-form-group label="Nature" label-for="nature">
          <b-form-radio-group id="nature" v-model="data.nature" required buttons>
            <b-form-radio value="D" title="Damage" button-variant="outline-danger">
              <font-awesome-icon icon="bolt" />
            </b-form-radio>
            <b-form-radio value="W" title="Work" button-variant="outline-success">
              <font-awesome-icon icon="tools" />
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group label="Include in tour" label-for="tour">
          <b-form-checkbox
            id="tour"
            v-model="data.tour"
            value="1"
            unchecked-value="0"
            button
            button-variant="outline-warning"
          >
            <font-awesome-icon icon="plane" />
          </b-form-checkbox>
        </b-form-group>
        <b-form-group label="ATA" label-for="ata">
          <b-form-select id="ata" v-model="data.ATA" required v-bind:options="optionsAta">
            <template slot="first">
              <option v-bind:value="null" disabled>Select ATA</option>
            </template>
          </b-form-select>
        </b-form-group>
        <b-form-group label="Comment" label-for="comment">
          <b-form-textarea
            id="comment"
            v-model="data.comments.text"
            placeholder="Here, you can describe with more words..."
            rows="3"
            max-rows="6"
          />
        </b-form-group>
        <b-form-group label-for="get-photo-add-page">
          <get-photo id="get-photo-add-page" ref="getPhotoAddPage" v-on:get-photo="addPhoto" />
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
import { systemCode } from "@/assets/js/SystemCode.js";
import GetPhoto from "@/components/GetPhoto.vue";

export default {
  name: "AddPage",
  data() {
    return {
      data: {
        x: 0,
        y: 0,
        z: 0,
        ATA: null,
        title: "",
        comments: {
          text: "",
          image: ""
        },
        nature: "O",
        tour: 0
      },
      optionsAta: systemCode,
      error: null,
      show: true
    };
  },
  components: {
    GetPhoto
  },
  props: {
    cursor: {},
    camera: {}
  },
  methods: {
    clear() {
      /*this.show = false;
      this.$nextTick(() => {
        this.show = true;
        this.$nextTick(() => {
          this.$refs.focusThis.focus();
        });
      });*/
      this.data.ATA = null;
      this.data.title = "";
      this.data.comments.text = "";
      this.data.comments.image = "";
      this.data.nature = "O";
      this.data.tour = 0;
      this.$refs.getPhotoAddPage.clear();
    },
    addPhoto(img) {
      this.data.comments.image = img;
    },
    onCancel() {
      this.$refs.addPageModal.hide();
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.data.x = this.cursor.x;
      this.data.y = this.cursor.y;
      this.data.z = this.cursor.z;
      this.data.camera = this.camera;
      Vue.axios
        .post(
          "/planes/" + this.$route.params.registration + "/pages",
          this.data
        )
        .then(resp => {
          this.$nextTick(() => {
            this.clear();
            this.$emit("add-page", resp);
            this.$refs.addPageModal.hide();
          });
        })
        .catch(err => {
          this.error = err.response.data.error;
        });
    }
  }
};
</script>
