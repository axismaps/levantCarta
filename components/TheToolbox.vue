<template>
  <div></div>
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
</style>