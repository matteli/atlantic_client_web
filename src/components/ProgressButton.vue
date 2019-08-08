<template>
  <b-button v-if="progress=='F'" variant="warning" @click="$emit('click')">
    <font-awesome-icon icon="file-alt"/>
  </b-button>
  <b-button v-else-if="progress=='C'" variant="success" @click="$emit('click')">
    <font-awesome-icon icon="file-signature"/>
  </b-button>
  <b-button v-else-if="progress=='O'" variant="danger" @click="$emit('click')">
    <font-awesome-icon icon="file"/>
  </b-button>
  <b-button v-else @click="$emit('click')">
    <font-awesome-icon icon="comment-alt"/>
  </b-button>
</template>

<script>
export default {
  props: {
    progress: String
  }
};
</script>
