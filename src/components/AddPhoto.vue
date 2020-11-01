<template>
  <div>
    <b-button
      id="add-photo-button"
      variant="outline-primary"
      v-b-modal="uid"
      title="Add Photo"
    >
      <font-awesome-icon v-show="!srcThumb" icon="image" />
      <img v-show="srcThumb" v-bind:src="srcThumb" width="31" height="23" />
      <!--- <font-awesome-icon icon="image" /> --->
    </b-button>
    <b-modal
      v-bind:id="uid"
      v-bind:ref="uid"
      size="lg"
      @shown="init"
      v-bind:hide-footer="true"
      v-bind:hide-header="true"
      class="container-fluid"
    >
      <div class="text-center">
        <canvas id="photo" width="640" height="480" />
        <canvas hidden id="thumb" width="31" height="23" />
        <b-form-file
          v-model="image"
          :state="Boolean(image)"
          placeholder="Choose an image or drop it here..."
          drop-placeholder="Drop image here..."
        ></b-form-file>
      </div>
      <b-button class="mt-2 mr-2" variant="primary" @click="save()"
        >OK</b-button
      >
      <b-button class="mt-2" variant="warning" @click="cancel()"
        >Cancel</b-button
      >
    </b-modal>
  </div>
</template>

<script>
let uid = 0;
export default {
  name: "AddPhoto",
  data() {
    uid += 1;
    return {
      image: null,
      srcPhoto: "",
      srcThumb: "",
      uid: `add-photo-modal-${uid}`,
    };
  },
  watch: {
    image: function () {
      if (this.image) {
        const reader = new FileReader();
        const img = new Image();
        img.onload = () => {
          // scale canvas to image
          if (img.width > img.height) {
            //landscape
            this.ctxPhoto.canvas.width = 640;
            this.ctxThumb.canvas.width = 31;
            this.ctxPhoto.canvas.height = Math.round(
              (640 * img.height) / img.width
            );
            this.ctxThumb.canvas.height = Math.round(
              (31 * img.height) / img.width
            );
          } else {
            this.ctxPhoto.canvas.height = 640;
            this.ctxThumb.canvas.height = 23;
            this.ctxPhoto.canvas.width = Math.round(
              (640 * img.width) / img.height
            );
            this.ctxThumb.canvas.width = Math.round(
              (23 * img.width) / img.height
            );
          }
          // draw image
          this.ctxPhoto.drawImage(
            img,
            0,
            0,
            this.ctxPhoto.canvas.width,
            this.ctxPhoto.canvas.height
          );
          this.ctxThumb.drawImage(
            img,
            0,
            0,
            this.ctxThumb.canvas.width,
            this.ctxThumb.canvas.height
          );
        };
        // this is to setup loading the image
        reader.onloadend = () => {
          img.src = reader.result;
        };
        // this is to read the file
        reader.readAsDataURL(this.image);
      }
    },
  },
  methods: {
    init() {
      this.eltPhoto = document.getElementById("photo");
      this.eltThumb = document.getElementById("thumb");
      this.ctxPhoto = this.eltPhoto.getContext("2d");
      this.ctxThumb = this.eltThumb.getContext("2d");
    },
    save() {
      this.srcPhoto = this.eltPhoto.toDataURL("image/jpeg", 1.0);
      this.srcThumb = this.eltThumb.toDataURL("image/jpeg", 1.0);
      this.$emit("add-photo", this.srcPhoto);
      this.$bvModal.hide(this.uid);
    },
    cancel() {
      this.srcPhoto = "";
      this.srcThumb = "";
      this.$emit("add-photo", "");
      this.$bvModal.hide(this.uid);
    },
  },
};
</script>
