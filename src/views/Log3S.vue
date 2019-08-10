<template>
  <div>
    <b-navbar type="light" variant="light" fixed="top">
      <b-navbar-brand>{{ plane.registration }}</b-navbar-brand>
      <b-navbar-nav>
        <add-page
          v-on:add-page="newPage"
          v-bind:cursor="getPosCursor"
          v-bind:camera="getCamera"
          class="mx-1"
        />
        <b-dropdown title="Views" class="mx-1" variant="primary" v-bind:disabled="tour">
          <template slot="button-content">
            <font-awesome-icon icon="video" />
            <span class="sr-only">View</span>
          </template>
          <b-dropdown-item
            v-for="(name, id) in viewsOptions"
            v-bind:key="id"
            v-bind:value="id"
            @click="view=id"
          >{{name}}</b-dropdown-item>
        </b-dropdown>
        <b-dropdown id="label-filters" class="mx-1" variant="primary" v-bind:disabled="tour">
          <template slot="button-content">
            <font-awesome-icon
              v-if="colorLabel=='N'"
              title="Colors are nature"
              icon="exclamation-triangle"
            />
            <font-awesome-icon
              v-else-if="colorLabel=='P'"
              title="Colors are progress"
              icon="tasks"
            />
          </template>
          <b-dropdown-form>
            <b-form-group>
              <b-form-radio-group id="color-label" v-model="colorLabel" buttons>
                <b-form-radio value="N" title="Nature" button-variant="outline-primary">
                  <font-awesome-icon icon="exclamation-triangle" />
                </b-form-radio>
                <b-form-radio value="P" title="Progress" button-variant="outline-primary">
                  <font-awesome-icon icon="tasks" />
                </b-form-radio>
              </b-form-radio-group>
            </b-form-group>
            <b-form-group v-if="colorLabel=='N'">
              <b-form-checkbox-group v-model="filters.nature" buttons id="filters-nature">
                <b-form-checkbox title="Damage" value="D" button-variant="outline-danger">
                  <font-awesome-icon icon="bolt" />
                </b-form-checkbox>
                <b-form-checkbox title="Works" value="W" button-variant="outline-success">
                  <font-awesome-icon icon="tools" />
                </b-form-checkbox>
                <b-form-checkbox title="Others" value="O" button-variant="outline-warning">
                  <font-awesome-icon icon="exclamation-triangle" />
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
            <b-form-group v-else-if="colorLabel=='P'">
              <b-form-checkbox-group v-model="filters.progress" buttons id="filters-progress">
                <b-form-checkbox title="Opened" value="O" button-variant="outline-danger">
                  <font-awesome-icon icon="file" />
                </b-form-checkbox>
                <b-form-checkbox title="Fixed" value="F" button-variant="outline-warning">
                  <font-awesome-icon icon="file-alt" />
                </b-form-checkbox>
                <b-form-checkbox title="Checked" value="C" button-variant="outline-success">
                  <font-awesome-icon icon="file-signature" />
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
            <b-button block variant="primary" @click="loadLabels()">
              <font-awesome-icon icon="sync-alt" />
            </b-button>
          </b-dropdown-form>
        </b-dropdown>
        <b-button class="mx-1" :pressed.sync="tour" variant="outline-warning">
          <font-awesome-icon icon="plane" />
        </b-button>
        <b-button-group class="mx-1">
          <b-button v-bind:variant="tour ? 'warning':'primary'" @click="previousLabel()">
            <font-awesome-icon icon="less-than" />
          </b-button>
          <b-button :pressed.sync="centerLabel" variant="outline-warning">
            <font-awesome-icon icon="video" />
          </b-button>
          <b-button v-bind:variant="tour ? 'success':'primary'" @click="nextLabel()">
            <font-awesome-icon icon="greater-than" />
          </b-button>
        </b-button-group>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-button variant="primary" href="/#/" class="mx-1">
          <font-awesome-icon icon="home" />
        </b-button>
        <login class="mx-1" v-on:clear="clearAddView()">
          <template v-slot:login>
            <b-form @submit="addView" v-if="addViewData.show">
              <b-input-group class="mx-1">
                <b-form-input
                  required
                  v-model="addViewData.data.name"
                  placeholder="Enter a name for this view..."
                />
                <b-input-group-append class="mr-2">
                  <b-button v-if="$auth.check('admin')" type="submit" variant="primary">
                    <font-awesome-icon icon="camera" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form>
            <b-alert class="m-2" v-show="addViewData.msg" show>{{ addViewData.msg }}</b-alert>
          </template>
        </login>
      </b-navbar-nav>
    </b-navbar>
    <div id="plane" ref="plane" v-on:click="onClickScene" @touchend="onClickScene"></div>
    <view-page v-bind:label="getSelectedLabel" v-on:labelchanged="loadLabels()" />
  </div>
</template>

<script>
import Vue from "vue";
import { PlaneViewer } from "@/assets/js/PlaneViewer";
import Login from "@/components/Login.vue";
import AddPage from "@/components/AddPage.vue";
import ViewPage from "@/components/ViewPage.vue";
import querystring from "querystring";

export default {
  name: "Log3S",
  data() {
    return {
      plane: {},
      planeViewer: new PlaneViewer(),
      sphereCursor: null,
      labels: [],
      centerLabel: true,
      filters: {
        nature: ["D", "W"],
        progress: ["O", "F"]
      },
      tour: false,
      colorLabel: "P",
      selectedLabel: null,
      viewsOptions: {},
      viewsData: {},
      view: "",
      addViewData: {
        data: {
          name: "",
          xpos: 0,
          ypos: 0,
          zpos: 0,
          xtarget: 0,
          ytarget: 0,
          ztarget: 0,
          zoom: 0
        },
        show: true,
        msg: null
      }
    };
  },
  components: {
    Login,
    AddPage,
    ViewPage
  },
  computed: {
    getSelectedLabel: function() {
      if (this.selectedLabel) return this.selectedLabel.id;
      else return 0;
    },

    getPosCursor: function() {
      if (!this.sphereCursor || !this.sphereCursor.visible)
        return { x: null, y: null, z: null };
      return {
        x: this.sphereCursor.position.getComponent(0),
        y: this.sphereCursor.position.getComponent(1),
        z: this.sphereCursor.position.getComponent(2)
      };
    },

    getCamera: function() {
      var camera = this.planeViewer.getCamera();
      return {
        xpos: camera.position.x,
        ypos: camera.position.y,
        zpos: camera.position.z,
        xtarget: camera.target.x,
        ytarget: camera.target.y,
        ztarget: camera.target.z,
        zoom: camera.zoom
      };
    }
  },
  watch: {
    colorLabel: function() {
      this.labels.forEach(label => {
        var color = this.getColorLabel(label);
        if (color) this.planeViewer.changeColorLabel(label.id, color);
      });
    },

    filters: {
      handler: function() {
        this.drawLabels();
      },
      deep: true
    },

    labels: function() {
      this.drawLabels();
    },

    view: function(view) {
      if (view) {
        this.planeViewer.moveTo(this.viewsData[view]);
      }
    },

    centerLabel: function(centerLabel) {
      if (centerLabel) {
        this.planeViewer.moveTo(this.selectedLabel.camera);
      }
    },

    tour: function(tour) {
      if (tour) {
        Vue.axios
          .get("/planes/" + this.$route.params.registration + "/tours")
          .then(data => {
            this.labels = data.data;
            this.filters["nature"] = ["D", "W", "O"];
            this.filters["progress"] = ["O", "F"];
            this.unSelectLabel();
            this.nextLabel();
          });
      } else {
        this.filters["nature"] = ["D", "W"];
        this.filters["progress"] = ["O", "F"];
        this.loadLabels();
        this.unSelectLabel();
      }
    }
  },
  methods: {
    getColorLabel(label) {
      var color = "black";
      if (this.colorLabel == "P") {
        if (label.progress == "O" && this.filters["progress"].includes("O")) {
          color = "red";
        } else if (
          label.progress == "F" &&
          this.filters["progress"].includes("F")
        ) {
          color = "orange";
        } else if (
          label.progress == "C" &&
          this.filters["progress"].includes("C")
        ) {
          color = "green";
        }
      } else if (this.colorLabel == "N") {
        if (label.nature == "D" && this.filters["nature"].includes("D")) {
          color = "red";
        } else if (
          label.nature == "O" &&
          this.filters["nature"].includes("O")
        ) {
          color = "orange";
        } else if (
          label.nature == "W" &&
          this.filters["nature"].includes("W")
        ) {
          color = "green";
        }
      }
      return color;
    },

    drawLabels() {
      var selectedLabelLoaded = false;
      this.planeViewer.unvisibleLabels();
      this.labels.forEach(label => {
        var color = this.getColorLabel(label);
        if (color != "black") {
          this.planeViewer.visibleLabel(label.id);
          if (!this.planeViewer.changeColorLabel(label.id, color)) {
            this.planeViewer.drawLabel(
              label.id,
              label.x,
              label.y,
              label.z,
              color
            );
          }
          if (this.selectedLabel == label) selectedLabelLoaded = true;
        }
      });
      if (selectedLabelLoaded)
        this.planeViewer.selectLabel(this.selectedLabel.id);
      else {
        if (this.selectedLabel)
          this.planeViewer.deSelectLabel(this.selectedLabel.id);
        this.selectedLabel = null;
      }
    },

    previousLabel() {
      var previousLabel = null;
      var maxLabel = null;
      var delta = 0;
      this.labels.forEach(label => {
        if (
          (this.selectedLabel && this.selectedLabel.id != label.id) ||
          !this.selectedLabel
        ) {
          if (!maxLabel) maxLabel = label;
          else if (label.id > maxLabel.id) maxLabel = label;
          if (
            this.selectedLabel &&
            (this.selectedLabel.id - label.id > 0 &&
              (!delta || (delta && this.selectedLabel.id - label.id < delta)))
          ) {
            previousLabel = label;
            delta = this.selectedLabel.id - label.id;
          }
        }
      });
      if (previousLabel) this.changeSelectedLabel(previousLabel);
      else if (maxLabel) this.changeSelectedLabel(maxLabel);
    },

    nextLabel() {
      var nextLabel = null;
      var minLabel = null;
      var delta = 0;
      this.labels.forEach(label => {
        if (
          (this.selectedLabel && this.selectedLabel.id != label.id) ||
          !this.selectedLabel
        ) {
          if (!minLabel) minLabel = label;
          else if (label.id < minLabel.id) minLabel = label;
          if (
            this.selectedLabel &&
            (label.id - this.selectedLabel.id > 0 &&
              (!delta || (delta && label.id - this.selectedLabel.id < delta)))
          ) {
            nextLabel = label;
            delta = label.id - this.selectedLabel.id;
          }
        }
      });
      if (nextLabel) this.changeSelectedLabel(nextLabel);
      else if (minLabel) this.changeSelectedLabel(minLabel);
    },

    loadPlane() {
      Vue.axios.get("/planes/" + this.$route.params.registration).then(data => {
        this.plane = data.data;
        this.planeViewer.load(
          "/media/" + this.plane.obj,
          this.$route.params.registration
        );
      });
    },

    loadView() {
      Vue.axios
        .get("/planes/" + this.$route.params.registration + "/cameras")
        .then(data => {
          data.data.forEach(view => {
            this.$set(this.viewsData, view.id, view);
            this.$set(this.viewsOptions, view.id, view.name);
            if (!this.view) this.view = view.id;
          });
        });
    },

    unSelectLabel() {
      if (this.selectedLabel) {
        this.planeViewer.deSelectLabel(this.selectedLabel.id);
        this.selectedLabel = null;
      }
    },

    changeSelectedLabel(newLabel) {
      if (this.selectedLabel)
        this.planeViewer.deSelectLabel(this.selectedLabel.id);
      this.selectedLabel = newLabel;
      this.planeViewer.selectLabel(this.selectedLabel.id);
      if (this.centerLabel) {
        this.planeViewer.moveTo(this.selectedLabel.camera);
      }
    },

    onClickScene(event) {
      var cursor = this.planeViewer.onMouseClick(event);
      if (!cursor) {
        //nothing clicking
        if (this.sphereCursor) this.sphereCursor.visible = false;
        if (this.selectedLabel)
          this.planeViewer.deSelectLabel(this.selectedLabel.id);
        this.selectedLabel = null;
      } else if (typeof cursor.object.name === "number") {
        //clicking label
        if (this.sphereCursor) this.sphereCursor.visible = false;
        this.labels.some(label => {
          if (label.id == cursor.object.name) {
            this.changeSelectedLabel(label);
            return true;
          }
        });
      } //clicking plane
      else {
        if (this.selectedLabel)
          this.planeViewer.deSelectLabel(this.selectedLabel.id);
        this.selectedLabel = null;
        if (!this.sphereCursor) {
          this.sphereCursor = this.planeViewer.drawCursor(
            this.$route.params.registration,
            cursor.point.x,
            cursor.point.y,
            cursor.point.z,
            "blue"
          );
        } else {
          this.sphereCursor.position.set(
            cursor.point.x,
            cursor.point.y,
            cursor.point.z
          );
          this.sphereCursor.visible = true;
        }
      }
    },

    newPage(resp) {
      if (this.sphereCursor) this.sphereCursor.visible = false;
      var length = this.labels.push(resp.data);
      this.selectedLabel = this.labels[length - 1];
    },

    loadLabels() {
      if (this.filters.nature.length && this.filters.progress.length) {
        Vue.axios
          .get(
            "/planes/" +
              this.$route.params.registration +
              "/pages?" +
              querystring.stringify(this.filters)
          )
          .then(data => {
            this.labels = data.data;
          });
      } else {
        this.labels = [];
      }
    },

    clearAddView() {
      this.addViewData.data.name = "";
      this.addViewData.msg = null;
      this.addViewData.show = false;
      this.$nextTick(() => {
        this.addViewData.show = true;
      });
    },

    addView(evt) {
      evt.preventDefault();
      var camera = this.planeViewer.getCamera();
      this.addViewData.data.xpos = camera.position.x;
      this.addViewData.data.ypos = camera.position.y;
      this.addViewData.data.zpos = camera.position.z;
      this.addViewData.data.xtarget = camera.target.x;
      this.addViewData.data.ytarget = camera.target.y;
      this.addViewData.data.ztarget = camera.target.z;
      this.addViewData.data.zoom = camera.zoom;
      Vue.axios
        .post(
          "/planes/" + this.$route.params.registration + "/cameras",
          this.addViewData.data
        )
        .then(() => {
          this.addViewData.msg = "View added";
        })
        .catch(err => {
          console.log(err);
          //this.error = err.response.data.error;
        });
    }
  },

  mounted() {
    this.planeViewer.init(this.$refs["plane"]);
    var render = () => {
      requestAnimationFrame(render);
      this.planeViewer.render();
    };
    render();
    this.resizeWindow = () => {
      this.planeViewer.resizeDisplayGL();
    };
    this.$nextTick(() => window.addEventListener("resize", this.resizeWindow));
    this.loadPlane();
    this.loadLabels();
    this.loadView();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeWindow);
  }
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  min-width: 360px;
  min-height: 360px;
  position: relative;
  overflow: hidden;
  z-index: 0;
}
#plane {
  width: 100%;
  height: 100%;
  min-width: 360px;
  min-height: 360px;
  position: relative;
  overflow: hidden;
  z-index: 0;
  top: 0;
  left: 0;
  background-color: #000000;
}
</style>
