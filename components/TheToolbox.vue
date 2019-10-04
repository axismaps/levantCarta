<template>
  <div></div>
</template>

<script>
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
export default {
  mounted() {
      const draw = this.drawInit();
      this.$emit('draw-init', draw)
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
</style>