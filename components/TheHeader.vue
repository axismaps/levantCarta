<template>
  <div class="header">
    <el-select v-model="value" placeholder="Select">
      <el-option v-for="item in layerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div class="connection">
      <i class="el-icon-minus"></i>
      <i class="el-icon-connection"></i>
      <i class="el-icon-minus"></i>
    </div>
    <el-date-picker v-model="layerYear" type="year"  default-value="2010" placeholder="Pick a year"></el-date-picker>
    <div class="layerOpacityController">
      <div>{{layerOpacity}}%</div>
      <el-slider v-model="layerOpacity"></el-slider>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      layerYear: null,
      layerOpacity: 100,
      layerOptions: [
        {
          value: 'Option1',
          label: 'Option1'
        },
        {
          value: 'Option2',
          label: 'Option2'
        },
        {
          value: 'Option3',
          label: 'Option3'
        },
        {
          value: 'Option4',
          label: 'Option4'
        },
        {
          value: 'Option5',
          label: 'Option5'
        }
      ],
      value: ''
    };
  }
};
</script>

<style lang="scss" scoped>
.header {
  min-height: $header-height;
  width: 100%;
  z-index: 6;
  background-color: rgb(255, 255, 255);
  display: flex;
  box-shadow: 0px 1px 3px rgb(206, 206, 206);
  align-items: center;
  padding: 0px 20px;
}
.el-date-editor.el-input {
  width: 140px;
}
.el-select {
  width: 140px;
}
.connection {
  margin: 10px;
}
.layerOpacityController {
  display: flex;
  align-items: center;
  div {
    text-align: center;
    width: 90px;
  }
  .el-slider {
    min-width: 150px;
  }
}

</style>