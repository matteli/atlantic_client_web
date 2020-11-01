<template>
  <div id="view-page" v-bind:class="{ sidebarnav: true, collapsed: !label }">
    <h4>
      #{{ page.id }} {{ page.title }}
      <nature-badge v-bind:nature="page.nature" />
      <progress-badge class="ml-1" v-bind:progress="page.progress" />
    </h4>
    <h6>{{ optionsSystemCode[page.ATA] }}</h6>
    <comment
      v-for="comment in comments"
      v-bind:key="comment.edited"
      v-bind:editor="comment.editor"
      v-bind:progress="comment.progress"
      v-bind:text="comment.text"
      v-bind:date="comment.edited"
      v-bind:image="comment.image"
    />
    <b-form v-if="$auth.check()">
      <b-input-group>
        <b-input-group-prepend>
          <add-photo ref="addPhoto" v-on:add-photo="addPhoto" />
          <get-photo ref="getPhoto" v-on:get-photo="addPhoto" />
        </b-input-group-prepend>
        <b-form-input
          id="textarea"
          v-model="data.text"
          placeholder="Enter comment..."
        />
        <b-input-group-append>
          <template v-if="page.progress == 'O'">
            <progress-button v-on:click="comment('')" />
            <progress-button v-on:click="comment('F')" progress="F" />
          </template>
          <template v-else-if="page.progress == 'F'">
            <progress-button v-on:click="comment('O')" progress="O" />
            <progress-button v-on:click="comment('C')" progress="C" />
          </template>
          <template v-else-if="page.progress == 'C'">
            <progress-button v-on:click="comment('O')" progress="O" />
          </template>
        </b-input-group-append>
      </b-input-group>
    </b-form>
  </div>
</template>

<script>
import Vue from "vue";
import ProgressBadge from "@/components/ProgressBadge.vue";
import ProgressButton from "@/components/ProgressButton.vue";
import NatureBadge from "@/components/NatureBadge.vue";
import Comment from "@/components/Comment.vue";
import GetPhoto from "@/components/GetPhoto.vue";
import AddPhoto from "@/components/AddPhoto.vue";
import { systemCode } from "@/assets/js/SystemCode.js";

export default {
  name: "ViewPage",
  data() {
    return {
      page: {},
      comments: [],
      optionsSystemCode: systemCode,
      data: {
        text: "",
        progress: "",
        image: "",
      },
    };
  },
  components: {
    ProgressBadge,
    ProgressButton,
    NatureBadge,
    Comment,
    GetPhoto,
    AddPhoto,
  },
  props: {
    label: Number,
  },
  watch: {
    label(lab) {
      if (lab) {
        this.updateAll(lab);
        this.clear();
      }
    },
  },
  methods: {
    clear() {
      this.data.text = "";
      this.data.progress = "";
      this.data.image = "";
      if (this.$auth.check()) this.$refs.getPhoto.clear();
    },
    comment(progress) {
      this.data.progress = progress;
      Vue.axios
        .post(
          "/planes/" +
            this.$route.params.registration +
            "/pages/" +
            this.page.id +
            "/comments",
          this.data
        )
        .then(() => {
          this.clear();
          this.updateAll(this.page.id);
          //this.$emit("labelchanged");
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
    updateAll(page) {
      Vue.axios
        .get("/planes/" + this.$route.params.registration + "/pages/" + page)
        .then((data) => {
          this.page = data.data;
        });
      Vue.axios
        .get(
          "/planes/" +
            this.$route.params.registration +
            "/pages/" +
            page +
            "/comments"
        )
        .then((data) => {
          this.comments = data.data;
        });
    },
    addPhoto(img) {
      this.data.image = img;
    },
  },
};
</script>

<style scoped>
.sidebarnav {
  margin: 0;
  padding: 10px;
  position: absolute;
  top: 50px;
  width: 400px;
  overflow-y: scroll;
  height: calc(100% - 50px);
  transition: left 0.3s ease;
  z-index: 1000;
  background: var(--light);
}
#view-page {
  left: 0;
}
#view-page.collapsed {
  left: -400px;
}
</style>
