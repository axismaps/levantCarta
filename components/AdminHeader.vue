<template>
  <div class="header">
    <div class="section">
      <el-button class="font-awesome-icon bars" type="text" circle>
        <font-awesome-icon :icon="['far', 'bars']" />
      </el-button>
      <p class="page-title">{{pageTitle}}</p>
    </div>
    <div class="section">
      <the-header-controls />
    </div>
  </div>
</template>

<script>
import TheHeaderControls from './TheHeaderControls.vue';

export default {
  components: {
    TheHeaderControls
  },
  props: {
    pageTitle: {
      type: String,
      default: 'page title'
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.header {
  min-height: var(--header-height);
  width: 100%;
  z-index: 6;
  background-color: rgb(255, 255, 255);
  display: flex;
  box-shadow: 0px 1px 3px rgb(206, 206, 206);
  align-items: center;
  padding: 0px 20px;
  justify-content: space-between;
}
.section {
  display: flex;
  align-items: center;
}
.form-input-with-ctrl-btn {
  padding-left: 30px;
}

.el-date-editor.el-input {
  width: 140px;
}

.connection {
  margin: 10px;
}
.bars {
  font-size: 22px;
}
.page-title {
  margin-left: 10px;
}
</style>