<template>
  <div class="home">
    <img src="@/assets/img/Breguet_Atlantic.jpg" alt="Breguet Atlantic" width="100%" />
    <h1 class="text-center bg-primary">Bienvenue sur Atlantic</h1>
    <div>
      <b-card-group deck v-bind:title="plane.registration"></b-card-group>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "Home",

  data() {
    return {
      planes: []
    };
  },

  mounted() {
    Vue.axios.get("/planes").then(data => {
      //console.log(data);
      this.planes = data.data;
    });
  }
};
</script>
