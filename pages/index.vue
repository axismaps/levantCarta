<template>
  <div class="container">
    <el-card class="box-card">
      <div class="login-header">
        <h1>Welcome</h1>
      </div>

      <NuxtLink to="/edit">
        <el-button type="primary">Start Editing</el-button>
      </NuxtLink>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container {
  background-color: #edf2f7;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 380px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.el-form-btn {
  margin-top: 42px;
  display: flex;
  justify-content: center;
}
.el-button {
  background-color: #4299e1;
}
.login-header {
  display: flex;
  justify-content: center;
  margin-top: 42px;
  margin-bottom: 62px;
  color: #2d3748;
}
</style>