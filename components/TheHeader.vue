<template>
  <div class="header">
    <el-select id="layer-dropdown" v-model="layer" placeholder="Select">
      <el-option
        v-for="item in layerOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>

    <div class="connection">
      <i class="el-icon-minus"></i>
      <i class="el-icon-connection"></i>
      <i class="el-icon-minus"></i>
    </div>

    <el-date-picker
      id="year-stepper"
      v-model="layerYear"
      type="year"
      default-value="2010"
      placeholder="Pick a year"
    ></el-date-picker>

    <div class="basemap-dropdown">
      <el-select id="basemap-dropdown" v-model="basemap" placeholder="Select">
        <el-option
          v-for="item in basemapOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button icon="el-icon-view"></el-button>
    </div>

    <div id="opacity-slider" class="layerOpacityController">
      <p>{{layerOpacity}}%</p>
      <el-slider v-model="layerOpacity"></el-slider>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      basemap: '',
      basemapOptions: [
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
      layer: ''
    };
  }
};
</script>

<style lang="scss">
.header {
  min-height: $header-height;
  width: 100%;
  z-index: 6;
  background-color: rgb(255, 255, 255);
  display: flex;
  box-shadow: 0px 1px 3px rgb(206, 206, 206);
  align-items: center;
  padding: 0px 20px;

  .basemap-dropdown {
    display: flex;
    align-items: center;
    padding-left: 30px;

    .el-select {
      width: 200px;
      .el-input__inner {
        border-radius: 3px 0px 0px 3px;
      }
    }
    .el-button {
      border-radius: 0px 3px 3px 0px;
      border-left: none;
    }
  }

  .el-date-editor.el-input {
    width: 140px;
  }

  .connection {
    margin: 10px;
  }

  .layerOpacityController {
    display: flex;
    align-items: center;
    p {
      text-align: center;
      width: 90px;
    }
    .el-slider {
      min-width: 150px;
    }
  }
}
</style>