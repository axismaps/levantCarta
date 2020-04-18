<template>
  <div class="container">
    <el-button icon="el-icon-arrow-left">Back</el-button>
    <div>
      <el-button type="success" icon="el-icon-check">Close Change Set</el-button>
      <el-button icon="el-icon-refresh-left">Revert Selected</el-button>
      <el-button icon="el-icon-refresh-left">Revert</el-button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>