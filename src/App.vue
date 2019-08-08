<template>
    <div>
        <div v-if="$auth.ready()">
            <router-view></router-view>
        </div>

        <div v-if="!$auth.ready()">
            Loading ...
        </div>
    </div>
</template>

<script>
  export default {

    created() {
      this.$auth.ready(function () {
          //console.log(this);
      });
    }
  }
</script>

<style>
</style>
