<template>
  <div>
    <b-form-input v-model="newInstruction.text" placeholder="Enter your instruction here"></b-form-input>
  </div>
</template>

<script>
export default {
  name: "InstructionSheetDesigner",
  data() {
    return {
      instructions: [],
      newInstruction: {text=""}
    };
  }
};
</script>

<style>
</style>