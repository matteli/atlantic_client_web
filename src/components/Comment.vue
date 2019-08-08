<template>
  <b-card v-bind:border-variant="bgColor" no-body class="mb-2">
    <b-card-img v-bind:src="image" top />
    <b-card-body class="p-1">
      <b-card-text>{{ text }}</b-card-text>
    </b-card-body>
    <b-card-footer
      class="p-1"
      v-bind:footer-bg-variant="bgColor"
      v-bind:footer-text-variant="textColor"
    >{{ footer }}</b-card-footer>
  </b-card>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {};
  },
  props: {
    editor: String,
    date: String,
    progress: String,
    text: String,
    image: String
  },
  computed: {
    bgColor() {
      if (this.progress == "O") return "danger";
      else if (this.progress == "C") return "success";
      else if (this.progress == "F") return "warning";
      else return "secondary";
    },
    textColor() {
      if (this.progress == "O") return "white";
      else if (this.progress == "C") return "white";
      else if (this.progress == "F") return "white";
      else return "white";
    },
    footer() {
      var d = new Date(this.date);
      return this.editor + " - " + d.toLocaleDateString();
    }
  }
};
</script>

