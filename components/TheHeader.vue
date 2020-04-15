<template>
  <div class="header">
    <div class="section">
      <el-select
        id="layer-dropdown"
        @change="handleLayerSelect"
        v-model="activeLayer"
        placeholder="Select"
        :disabled="isEditionInProgress"
      >
        <i slot="prefix" class="el-input__icon el-icon-document-copy"></i>
        <el-option v-for="item in layers" :key="item.id" :label="item.title" :value="item.id"></el-option>
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
        format="yyyy"
        value-format="yyyy"
        placeholder="Pick a year"
        @change="handleSetYearCurrentYear"
      ></el-date-picker>
      <div class="form-input-with-ctrl-btn">
        <el-select
          id="basemap-dropdown"
          @change="handleOverlaySelect"
          v-model="basemap"
          placeholder="Select"
        >
          <el-option v-for="item in overlays" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button icon="el-icon-view" type="info" plain></el-button>
      </div>

      <div id="opacity-slider" class="layerOpacityController">
        <p>{{layerOpacity}}%</p>
        <el-slider v-model="layerOpacity" @change="handleSetOverlayOpacity"></el-slider>
      </div>
    </div>
    <div class="section">
      <el-button class="font-awesome-icon" type="text" circle>
        <font-awesome-icon :icon="['far', 'cog']" />
      </el-button>

      <el-button class="font-awesome-icon" type="text" circle>
        <font-awesome-icon :icon="['far', 'bell']" />
      </el-button>

      <el-dropdown @command="handleCommand">
        <el-button class="font-awesome-icon" type="text" circle>
          <font-awesome-icon :icon="['far', 'user-circle']" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      currentYear: 'layers/currentYear',
      overlays: 'overlays/items',
      isEditionInProgress: 'isEditionInProgress'
    })
  },
  methods: {
    ...mapActions({
      setActiveLayer: 'layers/setCurrentItem',
      setCurrentYear: 'layers/setCurrentYear',
      logout: 'auth/logout'
    }),
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;

        default:
          break;
      }
    },
    handleLayerSelect(layerId) {
      this.setActiveLayer(layerId);
    },
    handleOverlaySelect(overlayId) {
      this.$emit('set-active-overlay', overlayId);
    },
    handleSetOverlayOpacity(opacity) {
      this.$emit('set-overlay-opacity', opacity);
    },
    handleSetYearCurrentYear(year) {
      this.setCurrentYear(year);
    }
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
  justify-content: space-between;

  .section {
    display: flex;
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

  .el-dropdown {
    margin-left: 10px;
  }

  .font-awesome-icon {
    color: #4a5568;
    font-size: 17px;
    &:hover {
      color: $--color-primary;
    }
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