<template>
  <div class="sidebar">
    <div class="title">
      <el-input placeholder="Search..." v-model="searchbox" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="controls">
      <el-button type="success" icon="el-icon-plus" @click="addNewFeature">Add new feature</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchbox: ''
    }
  },
  methods: {
    addNewFeature() {
      this.$emit('addNewFeature')
    }
  },
};
</script>

<style  lang="scss" scoped>
.sidebar {
  min-width: $sidebar-width;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 3px rgb(206, 206, 206);
}
.title {
  position: relative;
  padding: 30px 20px;
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
  .el-button {
    width: 100%;
    height: 56px;
  }
  .control {
    padding-bottom: 20px;
    .el-input {
      padding-top: 5px;
    }
  }
}
</style>