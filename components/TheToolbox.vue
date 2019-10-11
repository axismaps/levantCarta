<template>
  <div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-arrow-left"></el-button>
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-position"></el-button>
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-edit"></el-button>
      <el-button size="small" icon="el-icon-share"></el-button>
      <el-button size="small" icon="el-icon-delete"></el-button>
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-edit"></el-button>
      <el-button size="small" icon="el-icon-full-screen"></el-button>
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-copy-document"></el-button>
    </div>
    <div class="btn-group el-button-group">
      <el-button size="small" icon="el-icon-refresh-left"></el-button>
      <el-button size="small" icon="el-icon-delete"></el-button>
    </div>
  </div>
</template>

<script>
/**
 * Mapboxdraw toolbox
 */
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
export default {
  mounted() {
    const draw = this.drawInit();
    /**
     * MapboxDraw instance created event.
     * @type {object}
     */
    this.$emit('draw-init', draw);
  },
  methods: {
    drawInit() {
      const Draw = new MapboxDraw();
      return Draw;
    }
  }
};
</script>

<style scoped>
.btn-group {
  margin-bottom: 30px;
}
.btn-group button {
  padding: 13px;
  cursor: pointer;
  display: block;
}

.btn-group button:not(:last-child) {
  border-bottom: none; /* Prevent double borders */
}

.btn-group button:first-child {
  border-radius: 4px 4px 0px 0px;
}

.btn-group button:last-child {
  border-radius: 0px 0px 4px 4px;
}
</style>