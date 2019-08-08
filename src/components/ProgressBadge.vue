<template>
  <b-badge v-if="progress=='F'" title="Fixed" variant="warning">
    <font-awesome-icon icon="file-alt"/>
  </b-badge>
  <b-badge v-else-if="progress=='C'" title="Checked" variant="success">
    <font-awesome-icon icon="file-signature"/>
  </b-badge>
  <b-badge v-else variant="danger" title="Opened">
    <font-awesome-icon icon="file"/>
  </b-badge>
</template>

<script>
export default {
  props: {
    progress: String
  }
};
</script>
