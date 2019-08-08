<template>
  <b-badge title="Damage" v-if="nature=='D'" variant="danger">
    <font-awesome-icon icon="bolt"/>
  </b-badge>
  <b-badge title="Works" v-else-if="nature=='W'" variant="success">
    <font-awesome-icon icon="tools"/>
  </b-badge>
  <b-badge title="Caution" v-else variant="warning">
    <font-awesome-icon icon="exclamation-triangle"/>
  </b-badge>
</template>

<script>
export default {
  props: {
    nature: String
  }
};
</script>
