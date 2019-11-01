<template>
  <div class="container">
    <the-header
      class="header"
      v-on:set-active-overlay="handleSetActiveOverlay"
      v-on:set-overlay-opacity="handleSetOverlayOpacity"
    />
    <div class="sidebar">
      <the-sidebar v-show="showSidebar" @add-new-feature="handleAddNewFeature" />
      <the-toolbox
        class="toolbox"
        :showSidebar="showSidebar"
        v-on:draw-init="handleDrawInit"
        v-on:toggle-sidebar="handleTogglesidebar"
      />
    </div>
    <mapbox
      v-if="draw"
      :map-options="{
        style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
        center: [-43.181587010622025, -22.905508179548036],
        zoom: 11,
        }"
      :geolocate-control="{
        show: true,
        position: 'top-right'
        }"
      v-on:map-init="handleMapInit"
      class="map"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import Mapbox from '~/components/Mapbox.vue';
import TheToolbox from '~/components/TheToolbox';
import TheHeader from '~/components/TheHeader';
import TheSidebar from '~/components/TheSidebar';

export default {
  components: {
    Mapbox,
    TheToolbox,
    TheHeader,
    TheSidebar
  },
  data() {
    return {
      showSidebar: true,
      map: null,
      draw: null
    };
  },
  async fetch(context) {
    const { data: layers } = await axios.get('/data/layers.json');
    const { data: overlays } = await axios.get('/data/overlays.json');
    context.store.dispatch('overlays/setItems', overlays);
    context.store.dispatch('layers/setItems', layers);
  },
  computed: {
    ...mapGetters({
      layers: 'layers/items',
      activeLayer: 'layers/currentItem',
      overlays: 'overlays/items',
      activeOverlay: 'overlays/currentItem'
    })
  },
  methods: {
    ...mapActions({
      setActiveOverlay: 'overlays/setCurrentItem',
      updateDrawMode: 'updateDrawMode',
      setDraw: 'setDraw'
    }),
    handleMapInit(map) {
      console.log('Here is the map:', map);
      map.addControl(this.draw);
      this.map = map;
    },
    handleDrawInit(draw) {
      console.log('Here is the draw instance', draw);
      this.draw = draw;
      this.setDraw(draw);
    },
    handleTogglesidebar() {
      this.showSidebar = !this.showSidebar;
    },
    handleSetActiveOverlay(overlayId) {
      console.log(overlayId);
      const overlay = this.overlays.filter(
        overlay => overlay.id === overlayId
      )[0];
      console.log(overlay);
      this.map.addLayer(overlay);
      this.map.moveLayer(overlayId);
      this.setActiveOverlay(overlayId);
      console.log(this.map.getStyle().layers);
    },
    handleSetOverlayOpacity(opacity) {
      console.log('opacity: ', opacity);
      this.map.setPaintProperty(
        this.activeOverlay.id,
        'raster-opacity',
        opacity / 100
      );
    },
    handleAddNewFeature() {
      const activeLayerType = this.activeLayer.geometryType;
      switch (activeLayerType) {
        case 'Point':
          this.updateDrawMode('draw_point');
          this.draw.changeMode('draw_point');
          break;
        case 'LineString':
          this.draw.changeMode('draw_line_string');
          this.updateDrawMode('draw_line_string');
          break;
        case 'Polygon':
          this.draw.changeMode('draw_polygon');
          this.updateDrawMode('draw_polygon');
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 60px repeat(4, 1fr);
  grid-template-rows: repeat(5, fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.map {
  grid-area: 2 / 1 / 6 / 6;
  height: calc(100vh - #{$header-height});
}
.sidebar {
  display: flex;
  height: 100%;
  z-index: 5;
  grid-area: 2 / 1 / 6 / 2;
  .toolbox {
    margin: 25px 15px;
  }
}
.header {
  grid-area: 1 / 1 / 2 / 6;
}
</style>