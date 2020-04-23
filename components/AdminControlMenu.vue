<template>
  <div class="container">
    <el-button icon="el-icon-arrow-left" @click="$emit('back')">Back</el-button>
    <div v-if="hasSelections">
      <el-button
        type="success"
        icon="el-icon-check"
        @click="$emit('approve-selected')"
      >Approve selected</el-button>
      <el-button icon="el-icon-refresh-left" @click="$emit('revert-selected')">Revert Selected</el-button>
    </div>
    <div v-else>
      <el-button
        type="success"
        icon="el-icon-check"
        @click="$emit('close-change-set')"
      >Close Change Set</el-button>
    </div>
    <!-- <el-button icon="el-icon-refresh-left">Revert</el-button> -->
  </div>
</template>

<script>
export default {
  props: {
    hasSelections: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>