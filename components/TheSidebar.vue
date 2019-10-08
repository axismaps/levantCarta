<template>
  <div class="sidebar">
    <div class="title">
      <p>Edit Feature</p>
      <p class="close">
        <i class="el-icon-close"></i>
      </p>
    </div>
    <div class="controls">
      <div class="control">
        <el-badge is-dot class="item"><h5>Name</h5></el-badge>
        <el-input size="medium" placeholder="Please Input" v-model="input1"></el-input>
      </div>
      <div class="control">
        <h5>Mapped</h5>
        <el-input size="medium" placeholder="Please Input" v-model="input1"></el-input>
      </div>
      <div class="control">
        <h5>Type</h5>
        <el-input size="medium" placeholder="Please Input" v-model="input1"></el-input>
      </div>
      <div class="control">
        <h5>Tags</h5>
        <el-input size="medium" placeholder="Please Input" v-model="input1"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style  lang="scss" scoped>
.sidebar {
  height: 100%;
  width: 320px;
  position: fixed;
  top: 60px;
  z-index: 5;
  background-color: rgb(255, 255, 255);
  left: 0;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0px 1px 3px rgb(206, 206, 206);
}
.title {
  position: relative;
  padding: 25px 0px;
  text-align: center;
  width: 100%;
  background-color: #edf2f7;
  .close {
    position: absolute;
    top: 26px;
    right: 14px;
    cursor: pointer;
  }
}
.controls {
  padding: 20px;
  text-align: start;
  .control {
    padding-bottom: 20px;
    .el-input {
      padding-top: 5px;
    }
  }
}
</style>