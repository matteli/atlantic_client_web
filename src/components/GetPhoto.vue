<template>
  <div>
    <b-button variant="outline-primary" v-b-modal="uid" title="Get Photo">
      <font-awesome-icon v-show="!srcThumb" icon="camera" />
      <img v-show="srcThumb" v-bind:src="srcThumb" width="31" height="23" />
    </b-button>
    <b-modal
      v-bind:id="uid"
      v-bind:ref="uid"
      size="lg"
      @shown="init"
      v-bind:hide-footer="true"
      v-bind:hide-header="true"
      class="container-fluid"
      no-close-on-backdrop
    >
      <div class="text-center">
        <div v-show="snap">
          <video id="video" width="640" height="480" autoplay />
          <b-button class="video-button video-left-button" pill @click="getPhoto()">
            <font-awesome-icon icon="camera" />
          </b-button>
          <b-button class="video-button video-right-button" pill @click="quit()">
            <font-awesome-icon icon="times" />
          </b-button>
        </div>
        <div v-show="!snap">
          <canvas id="photo" width="640" height="480" />
          <canvas hidden id="thumb" width="31" height="23" />
          <b-button class="video-button video-left-button" pill @click="savePhoto()">
            <font-awesome-icon icon="check" />
          </b-button>
          <b-button class="video-button video-right-button" pill @click="snap=true;">
            <font-awesome-icon icon="trash" />
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
let uid = 0;
export default {
  name: "GetPhoto",

  data() {
    uid += 1;
    return {
      snap: true,
      srcPhoto: "",
      srcThumb: "",
      uid: `get-photo-modal-${uid}`
    };
  },

  methods: {
    init() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.video = document.getElementById("video");
        this.eltPhoto = document.getElementById("photo");
        this.eltThumb = document.getElementById("thumb");
        this.ctxPhoto = this.eltPhoto.getContext("2d");
        this.ctxThumb = this.eltThumb.getContext("2d");
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "environment" } })
          .then(stream => {
            this.video.srcObject = stream;
            this.video.play();
          });
        if (this.srcPhoto) {
          var photo = new Image();
          var thumb = new Image();
          photo.onload = () => {
            this.ctxPhoto.drawImage(photo, 0, 0);
          };
          thumb.onload = () => {
            this.ctxThumb.drawImage(thumb, 0, 0);
          };
          photo.src = this.srcPhoto;
          thumb.src = this.srcThumb;
        }
      }
    },
    clear() {
      this.snap = true;
      this.srcPhoto = "";
      this.srcThumb = "";
    },
    getPhoto() {
      this.ctxPhoto.drawImage(this.video, 0, 0, 640, 480);
      this.ctxThumb.drawImage(this.video, 0, 0, 31, 23);
      this.snap = false;
    },
    savePhoto() {
      this.srcPhoto = this.eltPhoto.toDataURL("image/jpeg", 1.0);
      this.srcThumb = this.eltThumb.toDataURL("image/jpeg", 1.0);
      this.$emit("get-photo", this.srcPhoto);
      this.$bvModal.hide(this.uid);
    },
    quit() {
      this.srcPhoto = "";
      this.srcThumb = "";
      this.$emit("get-photo", "");
      this.$bvModal.hide(this.uid);
    }
  }
};
</script>

<style scoped>
.video-button {
  position: absolute;
  z-index: 1;
  top: 80%;
}
.video-left-button {
  left: 15%;
}
.video-right-button {
  right: 15%;
}
</style>
