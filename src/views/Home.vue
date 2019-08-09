<template>
  <div class="home">
    <img src="@/assets/img/Breguet_Atlantic.jpg" alt="Breguet Atlantic" width="100%" />
    <h1 class="text-center bg-primary">Bienvenue sur Atlantic</h1>
    <div>
      <b-card-group deck>
        <b-card
          v-for="plane in planes"
          v-bind:key="plane.registration"
          v-bind:title="plane.registration"
        >
          <b-card-text>{{ plane.manufacturer }} {{ plane.model }} ({{ plane.msn }})</b-card-text>
          <b-button v-bind:href="'/#/log3s/' + plane.registration">3D</b-button>
        </b-card>
      </b-card-group>
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
