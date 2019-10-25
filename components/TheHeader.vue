<template>
  <div class="header">
    <el-select
      id="layer-dropdown"
      @change="handleLayerSelect"
      v-model="activeLayer"
      placeholder="Select"
    >
      <i slot="prefix" class="el-input__icon el-icon-document-copy"></i>
      <el-option v-for="item in layers" :key="item._id" :label="item.name" :value="item._id"></el-option>
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
      <el-select
        id="basemap-dropdown"
        @change="handleOverlaySelect"
        v-model="basemap"
        placeholder="Select"
      >
        <el-option v-for="item in overlays" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button icon="el-icon-view"></el-button>
    </div>

    <div id="opacity-slider" class="layerOpacityController">
      <p>{{layerOpacity}}%</p>
      <el-slider v-model="layerOpacity" v-on:change="handleSetOverlayOpacity"></el-slider>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      basemap: '',
      layerYear: null,
      layerOpacity: 100,
      activeLayer: ''
    };
  },
  computed: {
    ...mapGetters({
      layers: 'layers/items',
      overlays: 'overlays/items'
    })
  },
  methods: {
    ...mapActions({
      setActiveLayer: 'layers/setCurrentItem',
      setActiveOverlay: 'overlays/setCurrentItem'
    }),
    handleLayerSelect(layerId) {
      this.setActiveLayer(layerId);
    },
    handleOverlaySelect(overlayId) {
      this.$emit('set-active-overlay', overlayId);
    },
    handleSetOverlayOpacity(opacity) {
      console.log(opacity)
      this.$emit('set-overlay-opacity', opacity);
    }
  },
  created() {
    const activeLayerId = this.layers[0]._id; // set first layer as active 
    this.activeLayer = activeLayerId;
    this.setActiveLayer(activeLayerId);
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